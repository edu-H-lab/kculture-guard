/**
 * 교사용 분석 3단계 — AI 분석 (Gemini)
 *
 * 교사 화면(teacher-analysis.js)의 ⑤ AI 분석 4가지를 한 번의 Gemini 호출로 만든다.
 *   1) 생각의 깊이     : 학생마다 관찰 · 이유 · 비교 · 적용 중 하나
 *   2) 다른 생각       : 많은 친구와 다른 관점 2~3개 + 토론 질문
 *   3) 목표 개념 다시 보기 : 낱말이 달라도 뜻이 같은 생각을 찾아 목표 개념별 학생 목록
 *   4) AI 교사 코치    : 다음 수업 발문 3개 + 활동 1개
 *
 * 개인정보: 학생 이름은 서버로 오지 않는다(s1, s2 … 로만 구분).
 * 신뢰성: 학생 id·목표 개념 id는 코드가 검증하고, 근거 문장은 그 학생이 실제로 한 말에 있어야 남긴다.
 */
const crypto = require("crypto");
const Q = require("../../../../program/assets/js/thinking-friend-questions.js");
const IDEAS = require("../../../../program/assets/js/teacher-target-ideas.js");
const { teacherAnalysisPrompts } = require("./prompts");

const LEVELS = ["관찰", "이유", "비교", "적용"];
const CACHE = new Map();
const CACHE_MAX = 60;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    depth: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          level: { type: "STRING", enum: LEVELS },
          evidence: { type: "STRING" }
        },
        required: ["id", "level", "evidence"]
      }
    },
    divergent: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          quote: { type: "STRING" },
          why: { type: "STRING" }
        },
        required: ["id", "quote", "why"]
      }
    },
    discussion: { type: "STRING" },
    ideaHits: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          ideaId: { type: "STRING" },
          ids: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["ideaId", "ids"]
      }
    },
    coach: {
      type: "OBJECT",
      properties: {
        summary: { type: "STRING" },
        questions: { type: "ARRAY", items: { type: "STRING" } },
        activity: { type: "STRING" }
      },
      required: ["summary", "questions", "activity"]
    }
  },
  required: ["depth", "divergent", "discussion", "ideaHits", "coach"]
};

function clean(t) {
  return String(t || "").replace(/\s+/g, " ").trim();
}
function compact(t) {
  return String(t || "").replace(/[\s.,!?~'"“”‘’·]/g, "");
}

function studentWords(s) {
  return (s.steps || []).map((st) => [(st.picked || []).join(" "), st.text || ""].join(" ")).join(" ") + " " + (s.final || "");
}

/** 근거 문장이 그 학생의 실제 말 안에 있는지 (앞뒤 조금 다른 것은 허용) */
function grounded(quote, words) {
  const q = compact(quote);
  if (!q) return false;
  const w = compact(words);
  if (w.indexOf(q) >= 0) return true;
  // 어미만 조금 다른 경우: 앞 70%가 들어 있으면 허용
  const head = q.slice(0, Math.max(2, Math.ceil(q.length * 0.7)));
  return head.length >= 2 && w.indexOf(head) >= 0;
}

function normalizeInput(body) {
  const students = (Array.isArray(body && body.students) ? body.students : []).slice(0, 40).map((s, i) => ({
    id: String((s && s.id) || `s${i + 1}`).slice(0, 8),
    steps: (Array.isArray(s && s.steps) ? s.steps : []).slice(0, 3).map((st) => ({
      picked: (Array.isArray(st && st.picked) ? st.picked : []).map(clean).filter(Boolean).slice(0, 8),
      text: clean(st && st.text).slice(0, 200),
      skipped: !!(st && st.skipped)
    })),
    final: clean(s && s.final).slice(0, 300)
  }));
  return { activity: String((body && body.activity) || ""), students };
}

function validate(raw, input, ideasEntry) {
  const byId = {};
  input.students.forEach((s) => { byId[s.id] = s; });
  const out = { depth: [], divergent: [], discussion: "", ideaHits: [], coach: { summary: "", questions: [], activity: "" } };

  const seen = new Set();
  (raw.depth || []).forEach((d) => {
    const s = byId[d && d.id];
    if (!s || seen.has(s.id) || LEVELS.indexOf(d.level) < 0) return;
    seen.add(s.id);
    const ev = clean(d.evidence);
    out.depth.push({ id: s.id, level: d.level, evidence: grounded(ev, studentWords(s)) ? ev : "" });
  });

  (raw.divergent || []).slice(0, 3).forEach((d) => {
    const s = byId[d && d.id];
    const quote = clean(d && d.quote);
    if (!s || !quote || !grounded(quote, studentWords(s))) return;
    out.divergent.push({ id: s.id, quote, why: clean(d.why).slice(0, 120) });
  });
  out.discussion = out.divergent.length ? clean(raw.discussion).slice(0, 80) : "";

  const ideaIds = new Set(((ideasEntry && ideasEntry.ideas) || []).map((i) => i.id));
  (raw.ideaHits || []).forEach((h) => {
    if (!h || !ideaIds.has(h.ideaId)) return;
    const ids = Array.from(new Set((h.ids || []).filter((id) => byId[id])));
    out.ideaHits.push({ ideaId: h.ideaId, ids });
  });

  const c = raw.coach || {};
  out.coach = {
    summary: clean(c.summary).slice(0, 240),
    questions: (c.questions || []).map(clean).filter(Boolean).slice(0, 3),
    activity: clean(c.activity).slice(0, 200)
  };
  return out;
}

async function analyze(body, provider) {
  const input = normalizeInput(body);
  const entry = Q.get(input.activity);
  if (!entry) return { ok: false, error: "unknown_activity" };
  const answered = input.students.filter((s) => s.steps.some((st) => !st.skipped && (st.picked.length || st.text)));
  if (answered.length < 2) return { ok: false, error: "too_few", message: "AI 분석은 두 명 이상 기록했을 때 할 수 있어요." };
  if (!provider || typeof provider.generateRaw !== "function") {
    return { ok: false, error: "no_ai", message: "지금은 AI(Gemini)가 연결되어 있지 않아요." };
  }
  const ideasEntry = IDEAS.get(entry.key);
  const key = crypto.createHash("sha1").update(JSON.stringify({ a: input.activity, s: answered })).digest("hex");
  if (!(body && body.force) && CACHE.has(key)) return { ...CACHE.get(key), cached: true };

  const { system, user } = teacherAnalysisPrompts(entry, ideasEntry, answered);
  const raw = await provider.generateRaw({ system, user, schema: SCHEMA, purpose: "teacher-analysis", timeoutMs: 40000, retries: 1 });
  const result = { ok: true, ...validate(raw || {}, { students: answered }, ideasEntry), analyzedCount: answered.length, at: new Date().toISOString() };
  CACHE.set(key, result);
  if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value);
  return result;
}

module.exports = { analyze, LEVELS };
