/**
 * 학생 답변이 "질적으로 의미 있고 충분한지" 판정한다.
 * 기준: source/thinkfriend_eval.json (level 0~3, meaningful = level >= 2 + valueQuestion 요소 충족)
 * - 학생이 "자기 말"로 이유·비교·생활 적용을 말해야 충분(strong why)
 * - "예뻐서/좋아서"처럼 막연한 이유, AI 보기를 고른 것만 있으면 약한 이유(weak why)
 */
const meaning = require("./meaning");
const MAX_FOLLOWUPS = 5;

const ZERO_RE = /^(몰라|몰라요|모르겠어|모르겠어요|잘 ?모르겠어요?|그냥|그냥요|글쎄|글쎄요|없어|없어요|응|음+|네|아니|아니요|아직 ?잘 ?모르겠어요?)$/;
const REASON_WORDS = ["해서", "니까", "라서", "어서", "여서", "때문", "왜냐", "서요", "거든", "돼서", "져서", "려서", "워서", "와서", "야 해", "야 돼", "아서", "해야", "수 있", "수있"];
const FEELING_WORDS = ["좋", "예쁘", "이쁘", "멋", "재밌", "재미", "신나", "신기", "차분", "따뜻", "시원", "편안", "무섭", "웃기", "슬프", "기분", "느낌", "마음에", "자랑", "궁금", "포근", "부드럽", "힘차", "예뻐", "이뻐", "멋져", "귀여", "무서워", "슬퍼", "기뻐", "행복", "웃겨", "시끄러", "조용", "느려", "빨라", "든든", "씩씩", "맛있"];
const COMPARE_WORDS = ["보다", "더 ", "달라", "다르", "비슷", "둘 다", "차이"];
const EXPERIENCE_WORDS = ["했어", "해봤", "만들었", "들었", "봤", "골랐", "놀았", "접었", "입어", "먹어", "던졌", "움직였", "색칠", "골라", "움직여", "던져"];
const APPLY_WORDS = ["우리 집", "우리집", "집에", "학교", "교실", "나도", "내가 ", "하고 싶", "해보고 싶", "쓰고 싶", "있으면", "했으면", "좋겠", "입고 싶", "먹고 싶", "만들고 싶", "보여주", "알려주", "소개", "친구", "외국", "가족", "할머니", "할아버지", "엄마", "아빠", "넣고 싶", "그리고 싶", "계속"];
// 이유가 "예뻐서/좋아서" 같은 막연한 평가뿐인지
const BARE_REASON_RE = /^(너무|정말|진짜|아주|엄청|그냥)?\s*(예뻐|이뻐|예쁘|이쁘|좋아|좋|재밌어|재미있어|재밌|멋있어|멋져|멋있|신기해|신기|귀여워|귀엽)(서|서요|요|어요|니까|잖아)?$/;
const UNSURE_RE = /(모르|몰라|글쎄|생각이 안|생각 안|없어요|그냥요?$|아직 잘)/;

function trim(t) { return String(t || "").replace(/\s+/g, " ").trim(); }
function norm(t) {
  let s = meaning.normalizeSpelling ? meaning.normalizeSpelling(trim(t)) : trim(t);
  s = s.replace(/[ㅋㅎㅠㅜ]+/g, "").replace(/[.,!?~]+/g, " ").replace(/\s+/g, " ").trim();
  return s;
}
function has(t, words) { return words.some((w) => t.indexOf(w) >= 0); }

function isZero(text) {
  const t = norm(text);
  if (!t || t.length < 2) return true;
  if (ZERO_RE.test(t)) return true;
  if (/^(몰라|모르겠|잘 모르|그냥|글쎄)/.test(t) && t.length <= 10) return true;
  return false;
}
function isUnsure(text) {
  const t = norm(text);
  return isZero(t) || (UNSURE_RE.test(t) && t.length <= 12);
}

const PARTICLE_RE = /(이에요|예요|이요|에서|에게|한테|으로|로|이랑|랑|하고|과|와|은|는|이|가|을|를|의|도|에|요)$/;
function stem(word) {
  let w = String(word || "").replace(/[^가-힣]/g, "");
  for (let i = 0; i < 2; i += 1) w = w.replace(PARTICLE_RE, "");
  return w;
}

function activityKeywords(pack) {
  const p = pack || {};
  const src = [p.title, p.activityExperience]
    .concat(p.allowedKnowledge || [])
    .concat((p.choicePool || []).map((c) => c && c.label))
    .concat(p.keywords || []);
  const out = [];
  src.forEach((line) => {
    String(line || "").split(/[\s·,.()]+/).forEach((w) => {
      const s = stem(w);
      if (s.length >= 2 && !/^(학생|우리|다른|생각|모르겠|아직|사용|만들어|있다|된다|살펴보고|탐색하며|비교해|보았다|오늘날|등)/.test(s) && out.indexOf(s) < 0) out.push(s);
    });
  });
  return out;
}

function mentionsObject(text, pack) {
  const t = norm(text).replace(/\s+/g, "");
  return activityKeywords(pack).some((k) => t.indexOf(k) >= 0 || (k.length >= 3 && t.indexOf(k.slice(0, 2)) >= 0));
}

function isBareReason(text, pack) {
  const t = norm(text);
  if (BARE_REASON_RE.test(t)) return true;
  // 대상어 + 막연한 평가 ("분홍색이 이뻐요", "동그라미가 예뻐서")
  const words = t.split(" ");
  if (words.length <= 3) {
    const last = words[words.length - 1];
    if (BARE_REASON_RE.test(last)) {
      const rest = words.slice(0, -1).join(" ");
      if (!has(rest, REASON_WORDS) && !has(rest, APPLY_WORDS) && !has(rest, COMPARE_WORDS)) return true;
    }
  }
  return false;
}

/** eval.json level_rules */
function levelOf(text, pack, context) {
  const t = norm(text);
  if (isZero(t)) return 0;
  const reason = has(t, REASON_WORDS);
  const feeling = has(t, FEELING_WORDS);
  const compare = has(t, COMPARE_WORDS);
  const experience = has(t, EXPERIENCE_WORDS);
  const apply = has(t, APPLY_WORDS);
  const bareEval = /^(좋아요|좋아|예뻐요|이뻐요|재밌어요|멋져요|싫어요)$/.test(t);
  const obj = mentionsObject(t, pack) || !!context;
  if (reason && (experience || apply)) return 3;
  if (compare && reason) return 3;
  if ([reason, feeling, compare, experience, apply].filter(Boolean).length >= 3) return 3;
  if (reason || compare || apply) return 2;
  if (feeling && !bareEval && obj) return 2;
  if (obj || feeling || experience || bareEval) return 1;
  return t.length >= 2 ? 1 : 0;
}

function sourceOf(turn) {
  return meaning.sourceOfTurn ? meaning.sourceOfTurn(turn) : String((turn && turn.source) || "free_response");
}

function isSupportTurn(turn) {
  const s = String((turn && turn.strategy) || "");
  if (/^(confirm|confirmed|finish|unsure)$/.test(s)) return false;
  return Boolean(s || (turn && turn.question));
}

/**
 * input: { pack, initialAnswer, previousTurns }
 * previousTurns 마지막 턴의 answer = 방금 학생 답
 */
function evaluate(input) {
  const pack = (input && input.pack) || {};
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  const initial = trim(input && input.initialAnswer);
  const items = [];
  if (initial) items.push({ text: initial, own: true, source: "initial", strategy: "initial" });
  turns.forEach((turn) => {
    const answer = trim((meaning.resolvedTurnAnswer && meaning.resolvedTurnAnswer(turn)) || (turn && turn.answer));
    if (!answer) return;
    const src = sourceOf(turn);
    const own = src === "free_response" || src === "initial" || src === "voice" || src === "text";
    items.push({ text: answer, own, source: src, strategy: String((turn && turn.strategy) || "") });
  });

  let contextSeen = false;
  let hasWhat = false;
  let strongWhy = false;
  let weakWhy = false;
  let maxLevel = 0;
  let firstWhatIndex = -1;
  items.forEach((item, i) => {
    const t = item.text;
    if (/다른 생각/.test(t)) { item.level = 0; return; }
    if (item.source === "choice" && /^(아직 잘 모르겠어요|unsure)$/.test(t)) { item.level = 0; return; }
    let level = levelOf(t, pack, contextSeen);
    if (item.source === "choice") level = Math.min(level, 1); // 보기 고르기 = 대상 선택(level 1)
    if (item.source === "confirmed_meaning") level = Math.max(level, 2);
    item.level = level;
    if (level >= 1) {
      contextSeen = true;
      if (!hasWhat) { hasWhat = true; firstWhatIndex = i; }
    }
    maxLevel = Math.max(maxLevel, level);
    const n = norm(t);
    const whyish = has(n, REASON_WORDS) || has(n, COMPARE_WORDS) || has(n, APPLY_WORDS) || level >= 2;
    if (item.own && level >= 2 && whyish && !isBareReason(n, pack)) strongWhy = true;
    else if (level >= 2 || (item.own && has(n, FEELING_WORDS))) weakWhy = true;
  });

  // 방금 답까지 연속된 "모르겠어요" 수
  let unsureStreak = 0;
  for (let i = items.length - 1; i >= 1; i -= 1) {
    if (isUnsure(items[i].text) || /다른 생각|아직 잘 모르/.test(items[i].text)) unsureStreak += 1;
    else break;
  }
  const supportCount = turns.filter(isSupportTurn).length;
  // what 이후 이유를 끌어내려고 한 질문 수
  const whyAttempts = firstWhatIndex < 0 ? 0 : Math.max(0, items.length - 1 - firstWhatIndex);
  const usedMeaningCheck = turns.some((turn) => /^(meaning-check|interpret)$/.test(String((turn && turn.strategy) || "")));
  const latest = items.length ? items[items.length - 1] : null;

  let enough = false;
  let reason = "";
  if (hasWhat && strongWhy) { enough = true; reason = "strong_why"; }
  else if (hasWhat && weakWhy && whyAttempts >= 3) { enough = true; reason = "weak_why_after_tries"; }

  let stallFinish = false;
  if (!enough && unsureStreak >= 2 && hasWhat && (weakWhy || whyAttempts >= 3)) stallFinish = true;

  let missing = "";
  if (!hasWhat) missing = "what";
  else if (!strongWhy && !weakWhy) missing = "why";
  else if (!strongWhy) missing = "why_detail";

  return {
    hasWhat,
    strongWhy,
    weakWhy,
    maxLevel,
    levels: items.map((item) => item.level),
    latestLevel: latest ? latest.level : 0,
    latestUnsure: latest ? isUnsure(latest.text) : false,
    unsureStreak,
    supportCount,
    whyAttempts,
    usedMeaningCheck,
    enough,
    enoughReason: reason,
    stallFinish,
    maxReached: supportCount >= MAX_FOLLOWUPS,
    missing
  };
}

function missingHint(missing) {
  if (missing === "what") return "학생이 아직 무엇(대상·선택)을 말하지 않았다. 오늘 활동에서 본 것 중 하나를 떠올리게 하는 쉬운 질문을 한다.";
  if (missing === "why") return "학생이 무엇은 말했지만 이유가 없다. 학생이 말한 그것을 넣어서 '왜' 또는 '어떤 점이'를 묻는다.";
  if (missing === "why_detail") return "학생의 이유가 '예뻐서/좋아서'처럼 막연하다. 학생이 말한 그것의 어떤 모습·소리·느낌이 그랬는지 구체적으로 하나만 묻는다.";
  return "";
}

module.exports = { evaluate, levelOf, isUnsure, isZero, isBareReason, missingHint, activityKeywords, norm, stem, MAX_FOLLOWUPS };
