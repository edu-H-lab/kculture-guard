const { getPack } = require("../lib/activities");
const ai = require("../lib/ai");
const meaning = require("../lib/ai/meaning");

function readBody(req) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

function resolvePack(body) {
  return getPack(body.activityId)
    || getPack(body.activityKey)
    || getPack(body.route)
    || getPack(body.activity)
    || null;
}

function selectedFromTurns(turns) {
  return (turns || [])
    .filter((turn) => {
      if (/^(meaning-check|interpret|confirm|confirmed)$/.test(String((turn && turn.strategy) || ""))) return false;
      return meaning.sourceOfTurn(turn) === "choice";
    })
    .map((turn) => String((turn && turn.answer) || "").trim())
    .filter(Boolean);
}

function confirmedFromTurns(turns) {
  return (turns || [])
    .filter((turn) => meaning.sourceOfTurn(turn) === "confirmed_meaning")
    .map((turn) => meaning.resolvedTurnAnswer(turn) || String((turn && turn.answer) || "").trim())
    .filter(Boolean);
}

async function handleTurn(req, res) {
  const body = readBody(req);
  const pack = resolvePack(body) || {};
  const payload = {
    pack,
    grade: String(body.grade || "1"),
    studentAnswer: String(body.studentAnswer || ""),
    initialAnswer: String(body.initialAnswer || ""),
    inputType: String(body.inputType || "").trim().toLowerCase(),
    previousTurns: Array.isArray(body.previousTurns) ? body.previousTurns : [],
    selectedChoices: Array.isArray(body.selectedChoices) ? body.selectedChoices : selectedFromTurns(Array.isArray(body.previousTurns) ? body.previousTurns : []),
    confirmedMeanings: Array.isArray(body.confirmedMeanings) ? body.confirmedMeanings : confirmedFromTurns(Array.isArray(body.previousTurns) ? body.previousTurns : []),
    turn: Number(body.turn || 0)
  };
  const result = await ai.completeTurn(payload);
  res.json(result);
}

async function handleSummary(req, res) {
  const body = readBody(req);
  const pack = resolvePack(body) || {};
  const turns = Array.isArray(body.thinkingFriendTurns) ? body.thinkingFriendTurns : [];
  const result = await ai.completeSummary({
    pack,
    valueQuestion: String(body.valueQuestion || pack.valueQuestion || ""),
    initialAnswer: String(body.initialAnswer || ""),
    thinkingFriendTurns: turns,
    selectedChoices: Array.isArray(body.selectedChoices) ? body.selectedChoices : selectedFromTurns(turns),
    confirmedMeanings: Array.isArray(body.confirmedMeanings) ? body.confirmedMeanings : confirmedFromTurns(turns)
  });
  res.json(result);
}

function handleHealth(_req, res) {
  res.json({
    ok: true,
    provider: ai.providerName()
  });
}

// ---- 2차 설계안: 정해진 3단계 질문 (guided) ----
const guided = require("../lib/ai/guided");

function guidedProvider() {
  if (ai.providerName() === "gemini") return require("../lib/ai/geminiProvider");
  return null;
}

async function handleGuidedReact(req, res) {
  const body = readBody(req);
  const out = await guided.react(body, guidedProvider());
  console.log("[ThinkFriend:guided] react", JSON.stringify({ activityId: body.activityId, step: body.stepIndex, picked: body.picked, text: body.text, kind: out.kind, extra: out.extraChoice }));
  res.json(out);
}

async function handleGuidedSummary(req, res) {
  const body = readBody(req);
  const out = await guided.summary(body, guidedProvider());
  console.log("[ThinkFriend:guided] summary", JSON.stringify({ activityId: body.activityId, answers: body.answers, summary: out.summary, source: out.summarySource }));
  res.json(out);
}

// ---- 교사용 분석 3단계: AI 분석 ----
const teacherAnalysis = require("../lib/ai/teacherAnalysis");

async function handleTeacherAnalysis(req, res) {
  const body = readBody(req);
  const started = Date.now();
  try {
    const out = await teacherAnalysis.analyze(body, guidedProvider());
    console.log("[TeacherAnalysis]", JSON.stringify({ activity: body.activity, students: (body.students || []).length, ok: out.ok, cached: !!out.cached, ms: Date.now() - started, error: out.error || "" }));
    res.json(out);
  } catch (err) {
    console.warn("[TeacherAnalysis] 실패:", err && err.message);
    res.json({ ok: false, error: "ai_failed", message: "AI가 지금 바빠서 분석하지 못했어요. 잠시 뒤 다시 눌러 주세요." });
  }
}

module.exports = {
  handleTeacherAnalysis,
  handleTurn,
  handleSummary,
  handleHealth,
  handleGuidedReact,
  handleGuidedSummary
};
