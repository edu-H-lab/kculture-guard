const { askJsonSchema, summaryJsonSchema, meaningCheckJsonSchema, toGeminiSchema, normalizeAsk, normalizeSummary, normalizeMeaningCheck } = require("./schemas");
const { questionSystemPrompt, questionUserPrompt, summarySystemPrompt, summaryUserPrompt, meaningCheckSystemPrompt, meaningCheckUserPrompt } = require("./prompts");
const metrics = require("./metrics");

function modelName() {
  return process.env.GEMINI_MODEL || "gemini-2.0-flash";
}

function apiKey() {
  return String(process.env.GEMINI_API_KEY || "").trim();
}

function extractText(payload) {
  const cand = payload && payload.candidates && payload.candidates[0];
  const parts = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts : [];
  return parts.map((part) => String(part.text || "")).join("\n").trim();
}

function parseJsonText(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {}
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(raw.slice(start, end + 1)); } catch (_) {}
  }
  return null;
}

function isTimeoutError(err) {
  if (!err) return false;
  if (err.name === "AbortError") return true;
  const msg = String(err.message || err);
  return /aborted|AbortError|timeout/i.test(msg);
}

// ---- 동시 호출 제한 + 재시도 (교실에서 여러 명이 동시에 눌러도 버티도록) ----
const MAX_CONCURRENT = Math.max(1, Number(process.env.GEMINI_MAX_CONCURRENT || 4));
let active = 0;
const waiters = [];
function acquire() {
  if (active < MAX_CONCURRENT) { active += 1; return Promise.resolve(); }
  return new Promise((resolve) => waiters.push(resolve)).then(() => { active += 1; });
}
function release() {
  active = Math.max(0, active - 1);
  const next = waiters.shift();
  if (next) next();
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function retryable(err) {
  const status = err && err.httpStatus;
  if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) return true;
  return isTimeoutError(err) === false && /fetch failed|ECONNRESET|socket/i.test(String((err && err.message) || ""));
}

async function generateJson(args) {
  const retries = args && Number.isFinite(args.retries) ? args.retries : Number(process.env.GEMINI_RETRIES || 2);
  const started = Date.now();
  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    await acquire();
    try {
      return await generateJsonOnce(args);
    } catch (err) {
      lastErr = err;
      console.warn(`[ThinkFriend] Gemini ${args.purpose || ""} 실패 (시도 ${attempt + 1}):`, err && (err.httpStatus || ""), err && err.message);
      if (!retryable(err) || attempt === retries) break;
    } finally {
      release();
    }
    const wait = (attempt === 0 ? 700 : 1800) + Math.floor(Math.random() * 400);
    if (Date.now() - started + wait > 12000) break;
    await sleep(wait);
  }
  throw lastErr || new Error("gemini_failed");
}

async function generateJsonOnce({ system, user, schema, purpose, timeoutMs }) {
  const key = apiKey();
  if (!key) throw new Error("missing_gemini_key");
  const call = metrics.geminiStart(purpose || "unknown");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number(timeoutMs) > 0 ? Number(timeoutMs) : 12000);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName())}:generateContent?key=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: toGeminiSchema(schema)
        }
      })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 429) metrics.note429();
      call.done({ status: res.status === 429 ? "429" : "http_error", httpStatus: res.status });
      const msg = payload && payload.error && payload.error.message ? payload.error.message : `gemini_${res.status}`;
      const e = new Error(msg);
      e.httpStatus = res.status;
      throw e;
    }
    const parseStart = Date.now();
    const parsed = parseJsonText(extractText(payload));
    metrics.addParse(Date.now() - parseStart);
    call.done({ status: "ok", httpStatus: res.status });
    return parsed;
  } catch (err) {
    if (isTimeoutError(err)) {
      metrics.noteTimeout();
      call.done({ status: "timeout" });
    } else {
      call.done({ status: "error" });
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function completeTurn(input) {
  if ((input && input.mode) === "meaning-check" || (input && input.strategy) === "meaning-check") {
    const parsed = await generateJson({
      system: meaningCheckSystemPrompt(),
      user: meaningCheckUserPrompt(input),
      schema: meaningCheckJsonSchema,
      purpose: "meaning-check"
    });
    const parseStart = Date.now();
    const normalized = normalizeMeaningCheck(parsed);
    metrics.addParse(Date.now() - parseStart);
    if (!normalized) throw new Error("invalid_gemini_meaning_check");
    return normalized;
  }
  const parsed = await generateJson({
    system: questionSystemPrompt(),
    user: questionUserPrompt(input),
    schema: askJsonSchema,
    purpose: "ask"
  });
  const parseStart = Date.now();
  const normalized = normalizeAsk(parsed);
  metrics.addParse(Date.now() - parseStart);
  if (!normalized) throw new Error("invalid_gemini_ask");
  return {
    answerState: "READY_EXPAND",
    action: "ASK",
    strategy: normalized.strategy,
    message: normalized.message,
    studentLevel: normalized.studentLevel,
    coversValueQuestion: normalized.coversValueQuestion,
    missing: normalized.missing,
    choices: [],
    finish: false
  };
}

async function completeSummary(input) {
  const parsed = await generateJson({
    system: summarySystemPrompt(),
    user: summaryUserPrompt(input),
    schema: summaryJsonSchema,
    purpose: "summary"
  });
  const parseStart = Date.now();
  const normalized = normalizeSummary(parsed);
  metrics.addParse(Date.now() - parseStart);
  if (!normalized) throw new Error("invalid_gemini_summary");
  return normalized;
}

/** 2차 설계안(guided)용: 스키마와 프롬프트를 그대로 받아 JSON 결과를 돌려준다 */
async function generateRaw({ system, user, schema, purpose, timeoutMs, retries }) {
  return generateJson({ system, user, schema, purpose, timeoutMs, retries });
}

module.exports = { completeTurn, completeSummary, generateRaw };
