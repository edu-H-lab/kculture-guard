const { askJsonSchema, summaryJsonSchema, meaningCheckJsonSchema, normalizeAsk, normalizeSummary, normalizeMeaningCheck } = require("./schemas");
const { questionSystemPrompt, questionUserPrompt, summarySystemPrompt, summaryUserPrompt, meaningCheckSystemPrompt, meaningCheckUserPrompt } = require("./prompts");

function modelName() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

function apiKey() {
  return String(process.env.OPENAI_API_KEY || "").trim();
}

function extractOutputText(payload) {
  if (!payload) return "";
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text;
  const chunks = [];
  const output = Array.isArray(payload.output) ? payload.output : [];
  output.forEach((item) => {
    const content = Array.isArray(item.content) ? item.content : [];
    content.forEach((part) => {
      if (typeof part.text === "string") chunks.push(part.text);
      else if (part.text && typeof part.text.value === "string") chunks.push(part.text.value);
    });
  });
  if (chunks.length) return chunks.join("\n");
  const choice = payload.choices && payload.choices[0];
  if (choice && choice.message && typeof choice.message.content === "string") return choice.message.content;
  return "";
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

async function responsesCall({ instructions, input, schema, name }) {
  const key = apiKey();
  if (!key) throw new Error("missing_openai_key");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName(),
        instructions,
        input,
        text: {
          format: {
            type: "json_schema",
            name,
            strict: true,
            schema
          }
        }
      })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = payload && payload.error && payload.error.message ? payload.error.message : `openai_${res.status}`;
      throw new Error(msg);
    }
    return parseJsonText(extractOutputText(payload));
  } finally {
    clearTimeout(timer);
  }
}

async function completeTurn(input) {
  if ((input && input.mode) === "meaning-check" || (input && input.strategy) === "meaning-check") {
    const parsed = await responsesCall({
      instructions: meaningCheckSystemPrompt(),
      input: meaningCheckUserPrompt(input),
      schema: meaningCheckJsonSchema,
      name: "think_friend_meaning_check"
    });
    const normalized = normalizeMeaningCheck(parsed);
    if (!normalized) throw new Error("invalid_openai_meaning_check");
    return normalized;
  }
  const parsed = await responsesCall({
    instructions: questionSystemPrompt(),
    input: questionUserPrompt(input),
    schema: askJsonSchema,
    name: "think_friend_ask"
  });
  const normalized = normalizeAsk(parsed);
  if (!normalized) throw new Error("invalid_openai_ask");
  return {
    answerState: "READY_EXPAND",
    action: "ASK",
    strategy: normalized.strategy,
    message: normalized.message,
    choices: [],
    finish: false
  };
}

async function completeSummary(input) {
  const parsed = await responsesCall({
    instructions: summarySystemPrompt(),
    input: summaryUserPrompt(input),
    schema: summaryJsonSchema,
    name: "think_friend_summary"
  });
  const normalized = normalizeSummary(parsed);
  if (!normalized) throw new Error("invalid_openai_summary");
  return normalized;
}

module.exports = { completeTurn, completeSummary };
