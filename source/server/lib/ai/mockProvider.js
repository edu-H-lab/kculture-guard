const { MAX_FOLLOWUPS } = require("./prompts");
const meaning = require("./meaning");

const STATE = meaning.STATE;

const ACTION = {
  SHOW_CHOICES: "SHOW_CHOICES",
  ASK: "ASK",
  FINISH: "FINISH"
};

const FILLER_RE = /^(음+|어+|그냥|없음|아직|글쎄요?|모르(?:겠)?어요?|몰라요?|잘 모르겠어(?:요)?)$/;
const UNKNOWN_RE = /(잘 모르겠|모르겠어|몰라요|모름|글쎄요|생각(?:이)? 안 나)/;
const ABSTRACT_RE = /^(진짜 |너무 |아주 |정말 )?(좋아요|예뻐요|재미있어요|재밌어요|신기해요|멋있어요|예뻐|재미있어|신기해|멋있어|그냥 좋아요)[.!~]*$/;
const REASON_RE = /(때문|그래서|왜냐|니까|이라서|해서|여서|라서|같아서|싶어서|좋아서)/;
const EXPAND_RE = /(쓰면|쓰고|넣고|입고|이어|달라|비교|우리\s*집|오늘날|친구에게|소개)/;

function clip(text, n) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, n).trim();
}

function pick(seed, list) {
  const arr = (list || []).filter(Boolean);
  if (!arr.length) return "";
  let n = 0;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i += 1) n = (n + s.charCodeAt(i) * (i + 3)) % 997;
  return arr[n % arr.length];
}

function tokens(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean);
}

function koreanRatio(text) {
  const t = String(text || "");
  if (!t) return 0;
  const ko = (t.match(/[가-힣]/g) || []).length;
  const letters = (t.match(/[가-힣a-zA-Z0-9]/g) || []).length;
  return letters ? ko / letters : 0;
}

function isUnknownText(text) {
  const t = String(text || "").trim();
  if (!t) return true;
  if (FILLER_RE.test(t)) return true;
  if (t.length <= 12 && UNKNOWN_RE.test(t)) return true;
  return false;
}

function isNounLike(text) {
  const t = String(text || "").trim().replace(/[.!~]+$/g, "");
  const words = tokens(t);
  return words.length <= 2 && t.length <= 10 && !ABSTRACT_RE.test(t);
}

function tidyPiece(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?~]+$/g, "")
    .replace(/(요|예요|이에요|입니다)$/g, "")
    .trim();
}

function subjectParticle(word) {
  const s = String(word || "");
  const last = s.charAt(s.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "가";
  return ((code - 0xac00) % 28) ? "이" : "가";
}

function mockAnalyzeAnswer(text, ctx) {
  ctx = ctx || {};
  return meaning.analyzeOne(text, {
    pack: ctx.pack,
    history: ctx.history || []
  });
}

function pickChoices(pack) {
  const pool = (pack && pack.choicePool) || [];
  const isOther = (item) => /other|다른|모르겠/.test(String(item.value || item.label || ""));
  const rest = pool.filter((item) => !isOther(item));
  const other = pool.find(isOther);
  const take = rest.slice(0, 3).map((item) => ({
    label: String(item.label || item.value || ""),
    value: String(item.value || item.label || "")
  }));
  if (other) {
    take.push({
      label: String(other.label || other.value || "다른 생각"),
      value: String(other.value || "other")
    });
  }
  return take.slice(0, 4);
}

function makeQuestion(strategy, pack, answer) {
  const snippet = tidyPiece(clip(answer, 12));
  const title = (pack && pack.title) || "오늘 활동";
  const hanok = pack && pack.id === "2-2";
  const by = {
    recall: [
      `${title}에서 본 것 중 마음에 남는 것을 하나만 골라 볼까?`,
      "오늘 한 활동에서 기억나는 것을 하나 말해 줄래?"
    ],
    clarify: [
      snippet ? `“${snippet}”의 어떤 점이 좋았어?` : "그것의 어떤 점이 좋았어?",
      "조금만 더 구체적으로 말해 줄래?"
    ],
    reason: [
      snippet ? `“${snippet}”라고 했을 때, 어떤 모습이 그렇게 느껴지게 했어?` : "어떤 모습이 그렇게 느껴지게 했어?"
    ],
    apply: hanok
      ? [snippet ? `${snippet}을 우리 집에 둔다면 어디에 있으면 좋을까?` : "우리 집에 둔다면 어디에 있으면 좋을까?"]
      : [snippet ? `그걸 다른 곳에서도 그렇게 하면 어떻게 될까?` : "다른 곳에서도 그렇게 할 수 있을까?"],
    compare: [
      snippet ? `${snippet}과 다른 것은 어떤 점이 다를까?` : "그것과 다른 것은 어떤 점이 다를까?"
    ],
    transfer: [
      "그렇게 하면 우리 생활이 어떻게 달라질까?"
    ],
    value: [
      "왜 많은 사람한테 그것이 기억되면 좋겠다고 생각해?"
    ],
    observe: [
      snippet ? `${snippet}에서 어떤 모습이 가장 눈에 들어왔어?` : "어떤 모습이 가장 눈에 들어왔어?"
    ],
    evidence: [
      snippet ? `${snippet}라고 말할 수 있는 장면을 하나 떠올려 볼까?` : "그렇게 말할 수 있는 장면을 하나 떠올려 볼까?"
    ],
    predict: [
      snippet ? `만약 ${snippet}가 아니라면 결과는 어떻게 될까?` : "만약 그게 아니라면 결과는 어떻게 될까?"
    ],
    counter: [
      snippet ? `${snippet}여도 다른 결과가 나올 수 있을까?` : "그래도 다른 결과가 나올 수 있을까?"
    ],
    create: [
      snippet ? `${snippet}라면 어떤 몸짓이나 모습을 넣고 싶어?` : "어떤 모습을 넣고 싶어?"
    ],
    expand: [
      snippet ? `${snippet}라고 했을 때, 그러면 어떻게 될까?` : "그러면 어떻게 될까?"
    ],
    "final-reason": [
      snippet ? `${snippet}의 어떤 점이 기억나?` : "어떤 점이 기억나?"
    ]
  };
  return pick(answer + strategy + ((pack && pack.id) || ""), by[strategy] || by.expand);
}

function completeTurn(input) {
  const pack = (input && input.pack) || {};
  const decided = meaning.decideTurn(input || {});
  if (decided.action === ACTION.ASK && !decided.message) {
    decided.message = makeQuestion(decided.strategy, pack, meaning.currentAnswer(input || {}));
  }
  return decided;
}

function collectAnswers(initialAnswer, turns, pack) {
  return meaning.summaryBits(initialAnswer, turns, pack);
}

function toModifier(reason) {
  let adj = tidyPiece(reason).replace(/때문(에|이야|이에요)?$/g, "").trim();
  if (/해서$/.test(adj)) adj = adj.replace(/해서$/, "한");
  else if (/여서$/.test(adj)) adj = adj.replace(/여서$/, "연");
  else if (/라서$/.test(adj)) adj = adj.replace(/라서$/, "란");
  else if (/서$/.test(adj)) adj = adj.replace(/서$/, "ㄴ");
  return adj;
}

function completeSummary(input) {
  const units = meaning.collectMeaningUnits(input || {});
  if (!units.length) return { summary: "아직 잘 모르겠어요." };
  return { summary: meaning.polishLanguage(meaning.composeFromMeaningUnits(input && input.pack, units)), summarySource: "mock" };
}

function easyFallback(pack) {
  return {
    answerState: STATE.NEED_RECALL,
    action: ACTION.SHOW_CHOICES,
    strategy: "recall",
    message: "오늘 한 활동에서 기억나는 것을 하나 말해 줄래?",
    choices: meaning.supportChoices(pack),
    finish: false
  };
}

module.exports = {
  completeTurn,
  completeSummary,
  easyFallback,
  mockAnalyzeAnswer,
  pickChoices,
  makeQuestion
};
