/**
 * Gemini 정리문이 학생·활동 범위를 넘는 금지어만 문장 단위로 걷어낸다.
 * 기본은 Gemini 문장을 유지한다.
 */

const BANNED = [
  "전통", "계승", "정체성", "공동체", "상징", "민족", "자랑스럽",
  "영속성", "불굴", "문화유산", "보존", "교과", "주거"
];

function studentAnswers(input) {
  const meaning = require("./meaning");
  const units = Array.isArray(input && input.meaningUnits)
    ? input.meaningUnits
    : meaning.collectMeaningUnits(input || {});
  const bits = units.map((item) => String((item && item.meaning) || item || "").trim()).filter(Boolean);
  ((input && input.selectedChoices) || []).forEach((item) => {
    const t = String(item || "").trim();
    if (t && bits.indexOf(t) < 0) bits.push(t);
  });
  ((input && input.confirmedMeanings) || []).forEach((item) => {
    let t = "";
    if (item && typeof item === "object") {
      if (item.confirmed === false) return;
      t = String(item.aiInterpretation || item.meaning || "").trim();
    } else {
      t = String(item || "").trim();
    }
    if (t && bits.indexOf(t) < 0) bits.push(t);
  });
  ((input && input.thinkingFriendTurns) || []).forEach((turn) => {
    const t = String((turn && turn.answer) || "").trim();
    if (t && bits.indexOf(t) < 0) bits.push(t);
  });
  const initial = String((input && input.initialAnswer) || "").trim();
  if (initial && bits.indexOf(initial) < 0) bits.push(initial);
  return bits;
}

function activityBlob(input) {
  const pack = (input && input.pack) || {};
  const parts = [
    input && input.valueQuestion,
    pack.valueQuestion,
    pack.title,
    pack.activityExperience,
    ((pack.allowedKnowledge) || []).join(" "),
    ((pack.concepts) || []).join(" "),
    ((pack.thinkingGoals) || []).join(" ")
  ];
  return parts.map((item) => String(item || "").trim()).filter(Boolean).join(" ");
}

function allowedBlob(input) {
  return [studentAnswers(input).join(" "), activityBlob(input)].join(" ");
}

function compact(text) {
  return String(text || "").replace(/\s+/g, "");
}

function hasSpoken(blob, phrase) {
  return compact(blob).indexOf(compact(phrase)) >= 0;
}

function splitSentences(text) {
  return String(text || "").split(/(?<=[.!?])\s+/).filter(Boolean);
}

function extractGuess(question) {
  const q = String(question || "").trim();
  const m = q.match(/^(.+?)(?:다는|라는|이라는) 뜻이야/);
  if (!m) return "";
  let guess = m[1].replace(/^(그럼 |혹시 |그러면 )/g, "").trim();
  guess = guess.replace(/좋겠다$/, "좋겠어요").replace(/좋다$/, "좋아요");
  if (/겠$/.test(guess)) guess += "어요";
  if (guess && !/[요다]$/.test(guess)) guess += "요";
  return guess;
}

function isNoAnswer(text) {
  return /^(아니에요|아니야|아니요|아니)$/.test(String(text || "").trim().replace(/[.!~]+$/g, ""));
}

function rejectedKeyTerms(input) {
  const terms = [];
  function addTerm(word) {
    const t = String(word || "").trim();
    if (!t || t.length < 2) return;
    if (/^(생각|모습|그냥|같이|함께|좋겠어|좋아요|싶어|해요)$/.test(t)) return;
    if (terms.indexOf(t) < 0) terms.push(t);
  }
  ((input && input.thinkingFriendTurns) || []).forEach((turn) => {
    const answer = String((turn && turn.answer) || "").trim();
    if (!isNoAnswer(answer)) return;
    const guess = extractGuess(turn.question) || String((turn && turn.guess) || "").trim();
    if (!guess) return;
    String(guess)
      .replace(/[^\uac00-\ud7a3\s]/g, " ")
      .split(/\s+/)
      .map((word) => word.replace(/(이에요|예요|했어요|아요|어요|요)$/g, "").trim())
      .forEach(addTerm);
    const chunks = compact(guess).match(/[가-힣]{3,}/g) || [];
    chunks.forEach(addTerm);
  });
  ((input && input.confirmedMeanings) || []).forEach((item) => {
    if (!item || typeof item !== "object" || item.confirmed !== false) return;
    addTerm(item.aiInterpretation || item.meaning);
  });
  return terms;
}

function sentenceHasBanned(sentence, blob) {
  return BANNED.some((word) => {
    if (sentence.indexOf(word) < 0) return false;
    if (hasSpoken(blob, word)) return false;
    return true;
  });
}

function sentenceHasRejected(sentence, terms) {
  if (!terms || !terms.length) return false;
  const compactSentence = compact(sentence);
  return terms.some((term) => term && compactSentence.indexOf(compact(term)) >= 0);
}

function stripUnspokenWishes(text, blob) {
  let next = String(text || "");
  if (!hasSpoken(blob, "만들")) {
    next = next.replace(/[을를]?\s*만들고 싶어요\.?/g, "이에요.");
    next = next.replace(/만들고 싶은/g, "");
  }
  if (!hasSpoken(blob, "지키") && !hasSpoken(blob, "이어가") && !hasSpoken(blob, "이어졌") && !hasSpoken(blob, "이어지")) {
    next = next.replace(/지켜야 할|지켜야 해요|이어가야 할|이어가야 해요/g, "");
  }
  if (!hasSpoken(blob, "행운") && !hasSpoken(blob, "운과")) {
    next = next.replace(/행운보다\s*/g, "").replace(/행운과\s*/g, "");
  }
  return next.replace(/\s+/g, " ").replace(/\s+([.!?])/g, "$1").trim();
}

function keepAllowedSentences(summary, blob, rejectedTerms) {
  const parts = splitSentences(summary);
  const kept = parts.filter((sentence) => {
    if (sentenceHasBanned(sentence, blob)) return false;
    if (sentenceHasRejected(sentence, rejectedTerms)) return false;
    return true;
  });
  return kept.join(" ").trim();
}

function limitSentences(text) {
  const parts = splitSentences(text);
  return parts.slice(0, 3).join(" ").trim();
}

function polish(text) {
  let next = String(text || "").replace(/\s+/g, " ").replace(/\s+([.!?])/g, "$1").trim();
  if (!next) return "";
  if (!/[.!?]$/.test(next)) next += ".";
  return next;
}

function sanitizeSummary(summary, input) {
  const blob = allowedBlob(input);
  const rejected = rejectedKeyTerms(input);
  let next = String(summary || "").trim();
  if (!next) return "";
  next = stripUnspokenWishes(next, blob);
  next = keepAllowedSentences(next, blob, rejected);
  next = limitSentences(next);
  next = polish(next);
  return next;
}

function needsFormalPolish(text) {
  return /습니다|합니다|입니다/.test(String(text || ""));
}

module.exports = {
  sanitizeSummary,
  studentAnswers,
  needsFormalPolish,
  rejectedKeyTerms,
  BANNED
};
