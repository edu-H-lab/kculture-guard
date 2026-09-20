const { MAX_FOLLOWUPS } = require("./prompts");

const STATE = {
  NEED_CONFIRM: "NEED_CONFIRM",
  NEED_RECALL: "NEED_RECALL",
  NEED_CLARIFY: "NEED_CLARIFY",
  NEED_REASON: "NEED_REASON",
  READY_EXPAND: "READY_EXPAND",
  DEEP_ENOUGH: "DEEP_ENOUGH",
  OFF_TOPIC_OR_UNCLEAR: "OFF_TOPIC_OR_UNCLEAR",
  NEED_FINAL_SUPPORT: "NEED_FINAL_SUPPORT"
};

const FILLER_RE = /^(음+|어+|그냥(요)?|없음|아직|글쎄요?|모르(?:겠)?어요?|몰라요?|잘 모르겠어(?:요)?|아무거나(요)?|모름)$/;
const UNKNOWN_RE = /(잘 모르겠|모르겠어|몰라요|모름|글쎄요|생각(?:이)? 안 나)/;
const UNSURE_RE = /아직\s*잘\s*모르|나중에 다시/;
const ABSTRACT_RE = /^(진짜 |너무 |아주 |정말 )?(그냥\s*)?(좋아요|예뻐요|재미있어요|재밌어요|신기해요|멋있어요|예뻐|재미있어|신기해|멋있어)[.!~]*$/;
const REASON_RE = /(때문|그래서|왜냐|니까|이라서|해서|여서|려서|라서|같아서|싶어서|좋아서|예뻐서|이뻐서|아서|어서|지면|서요$)/;
const COLOR_RE = /(분홍|빨강|빨간|주황|노란|노랑|초록|파란|보라|하얀|흰|검정|검은|색)/;
const BLOOM_RE = /(피어|피고|피는|계속\s*피)/;
const PRETTY_RE = /(예쁘|이쁘|예뻐|이뻐|아름답)/;
const FEEL_RE = /(좋|신기|재미|재밌|멋있|힘 나|감동|신나|느낌)/;
const EXPAND_RE = /(쓰면|쓰고|넣고|입고|이어|달라|비교|우리\s*집|오늘날|친구에게|소개|옆에|거실|교실)/;
const PLACE_RE = /(옆|거실|방|마당|교실|집|어디)/;

const FEATURE_HINTS = {
  "마루": "여름에 시원해요",
  "온돌": "바닥이 따뜻해요",
  "창호지": "빛이 들어와요",
  "자연 재료": "나무와 흙으로 지어요",
  "꽃 모양": "동그란 꽃이 펴요",
  "꽃 색깔": "여러 색이 있어요",
  "계속 피는 모습": "오래 피고 또 펴요"
};

function trim(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function compact(text) {
  return String(text || "").replace(/\s+/g, "");
}

function tokens(text) {
  return trim(text).split(/\s+/).filter(Boolean);
}

function koreanRatio(text) {
  const t = String(text || "");
  if (!t) return 0;
  const ko = (t.match(/[가-힣]/g) || []).length;
  const letters = (t.match(/[가-힣a-zA-Z0-9]/g) || []).length;
  return letters ? ko / letters : 0;
}

function normalizeSpelling(text) {
  let t = trim(text);
  const pairs = [
    [/조켓/g, "좋겠"],
    [/조아(요|서|해|하)/g, "좋아$1"],
    [/조아/g, "좋아"],
    [/이뻐(요|서|해)/g, "예뻐$1"],
    [/이쁘/g, "예쁘"],
    [/이쁜/g, "예쁜"],
    [/제미있/g, "재미있"],
    [/재밌어오/g, "재밌어요"],
    [/시원해오/g, "시원해요"],
    [/따뜻해오/g, "따뜻해요"],
    [/좋아오/g, "좋아요"],
    [/예뻐오/g, "예뻐요"],
    [/쉬원/g, "시원"],
    [/햇서/g, "해서"],
    [/떄문/g, "때문"],
    [/야되서/g, "야 해서"],
    [/야되/g, "야 해"],
    [/돼야되/g, "돼야 해"],
    [/되서/g, "돼서"],
    [/오래피/g, "오래 피"],
    [/무궁화오래/g, "무궁화 오래"],
    [/생각중요/g, "생각이 중요"],
    [/말어디/g, "말 어디"],
    [/어디갈지/g, "어디 갈지"],
    [/골라야\s*해/g, "골라야 해"]
  ];
  pairs.forEach(([re, to]) => {
    t = t.replace(re, to);
  });
  return t;
}

function packLabels(pack) {
  return ((pack && pack.choicePool) || [])
    .map((item) => String(item.label || item.value || "").trim())
    .filter(Boolean);
}

function packKeywords(pack) {
  if (!pack) return [];
  const raw = [pack.title, pack.valueQuestion]
    .concat(pack.allowedKnowledge || [])
    .concat(pack.concepts || [])
    .concat(packLabels(pack))
    .join(" ");
  return Array.from(new Set(raw.match(/[가-힣]{2,}/g) || []));
}

function looksLikeChoice(text, pack) {
  const t = trim(text).replace(/[요.!~]+$/g, "");
  if (!t) return false;
  return packLabels(pack).some((label) => {
    const labelCore = label.replace(/\s+/g, "");
    return label === t || labelCore === t.replace(/\s+/g, "") || t.indexOf(label) >= 0;
  });
}

function mentionsPack(text, pack) {
  const t = compact(text);
  if (!t) return false;
  const core = t.replace(/요$/, "");
  return packKeywords(pack).some((kw) => {
    const k = compact(kw);
    if (k.length < 2) return false;
    if (t.indexOf(k) >= 0) return true;
    return core.length >= 2 && k.indexOf(core) >= 0 && core.length >= Math.min(2, k.length);
  });
}

function isUnsureText(text) {
  const t = trim(text).replace(/[.!~]+$/g, "");
  if (!t) return false;
  if (UNSURE_RE.test(t)) return true;
  return /^(잘\s*)?모르(겠)?어요?$|^몰라요?$|^모름$/.test(t);
}

function isFillerOrUnknown(text) {
  const t = trim(text).replace(/[.!~]+$/g, "");
  if (!t) return true;
  if (FILLER_RE.test(t)) return true;
  if (t.length <= 14 && UNKNOWN_RE.test(t)) return true;
  if (isUnsureText(t)) return true;
  return false;
}

function isGibberish(text) {
  const t = trim(text);
  return /^(.)\1{3,}$/.test(t) || /^[.?!,~\s]+$/.test(t) || (koreanRatio(t) < 0.3 && t.length >= 2);
}

function isAbstractOnly(text) {
  const t = trim(text).replace(/[.!~]+$/g, "");
  if (REASON_RE.test(t)) return false;
  if (ABSTRACT_RE.test(t)) return true;
  if (/^그냥\s+(좋아요|예뻐요|재미있어요)/.test(t)) return true;
  return t.length <= 8 && /^(좋|예뻐|재미|재밌|신기|멋있)/.test(t);
}

function isWeakText(text) {
  if (isFillerOrUnknown(text)) return true;
  if (isGibberish(text)) return true;
  if (isAbstractOnly(text)) return true;
  return false;
}

function isYes(text) {
  return /^(맞아요|맞아|네|응)$/.test(trim(text).replace(/[.!~]+$/g, ""));
}

function isNo(text) {
  return /^(아니에요|아니야|아니요|아니)$/.test(trim(text).replace(/[.!~]+$/g, ""));
}

function isRetry(text) {
  return /다시 말/.test(trim(text));
}

function isDifferent(text) {
  return /^(조금 달라요|달라요|아니 그거 말고)$/.test(trim(text).replace(/[.!~]+$/g, ""));
}

function isOtherThought(text) {
  return /다른 생각|잘 모르/.test(trim(text));
}

function isConfirmReply(text) {
  return isYes(text) || isNo(text) || isRetry(text) || isDifferent(text);
}

function isContentFollowUp(text) {
  const t = trim(text);
  if (!t) return false;
  return REASON_RE.test(t) || PLACE_RE.test(t) || EXPAND_RE.test(t);
}

function isOffTopic(text, pack, history) {
  if (!pack || !pack.id) return isGibberish(text);
  if (isAbstractOnly(text)) return false;
  if (looksLikeChoice(text, pack) || mentionsPack(text, pack)) return false;
  if (isContentFollowUp(text)) return false;
  const hasTopicHistory = (history || []).some((item) => mentionsPack(item, pack) || looksLikeChoice(item, pack));
  if (hasTopicHistory && !isGibberish(text)) return false;
  if (isGibberish(text)) return true;
  return false;
}

function isFragmented(text) {
  const t = trim(text);
  const words = tokens(t);
  if (words.length >= 3 && t.length <= 20 && !/[은는이가을를에서요까]/.test(t)) return true;
  if (/겨울/.test(t) && /시원|쉬원|쉬워/.test(t)) return true;
  return false;
}

function sttHypothesis(text, pack) {
  const raw = trim(text);
  const n = normalizeSpelling(raw);
  const ctx = compact([n, pack && pack.title, pack && pack.id, packLabels(pack).join("")].join(""));
  const hanokLike = /마루|한옥|온돌|창호/.test(ctx) || (pack && pack.id === "2-2");
  if (hanokLike && /쉬워서|쉬워|쉬운/.test(n) && /마루|한옥|집/.test(n + ctx)) {
    const guess = n.replace(/쉬워서/g, "시원해서").replace(/쉬워/g, "시원해").replace(/쉬운/g, "시원한");
    if (guess !== n) {
      return {
        guess: /요$/.test(guess) ? guess : `${guess.replace(/좋아요$/, "좋아요")}`,
        message: /마루/.test(n) ? "마루가 시원해서 좋다는 뜻이야?" : "시원해서 좋다는 뜻이야?",
        mode: "yesno"
      };
    }
  }
  return null;
}

function twoWaySeasonConfirm(text) {
  const n = normalizeSpelling(text);
  if (!/마루/.test(n) || !/집/.test(n)) return null;
  if (!(/겨울/.test(n) && /시원/.test(n))) return null;
  return {
    guess: "여름에 시원한 마루를 집에 쓰고 싶어요",
    message: "겨울에 시원해서 좋다는 뜻이야, 아니면 여름에 시원해서 좋다는 뜻이야?",
    mode: "season",
    choices: [
      { label: "여름에 시원해서요", value: "summer" },
      { label: "겨울에 시원해서요", value: "winter" },
      { label: "다시 말할래요", value: "retry" }
    ]
  };
}

function confirmChoices() {
  return [
    { label: "맞아요", value: "yes" },
    { label: "아니에요", value: "no" },
    { label: "다시 말할래요", value: "retry" }
  ];
}

function meaningConfirmChoices() {
  return [
    { label: "맞아요", value: "yes" },
    { label: "조금 달라요", value: "different" },
    { label: "다시 말할래요", value: "retry" }
  ];
}

function unfinishedMeaningConfirm(text, pack) {
  const n = normalizeSpelling(text);
  const trailing = /(\.{2,}|…|~)$/.test(n) || /우리나라도\s*계속\s*$/.test(n);
  const shortWish = /우리나라도/.test(n) && /계속|오래/.test(n) && n.length < 32
    && !/좋겠어|이어졌|힘을 냈|잘 지내/.test(n);
  if (!trailing && !shortWish) return null;
  if ((/오래|계속|피/.test(n) && (pack && pack.id === "1-2")) || (/우리나라도/.test(n) && /계속|오래/.test(n))) {
    return {
      guess: "우리나라도 오래오래 잘 이어졌으면 좋겠어요",
      message: "우리나라도 오래오래 잘 이어졌으면 좋겠다는 뜻이야?",
      mode: "yesno",
      choices: meaningConfirmChoices()
    };
  }
  return null;
}

function isAestheticLocked(text) {
  const t = normalizeSpelling(text);
  return /그냥/.test(t) && (PRETTY_RE.test(t) || /좋아/.test(t));
}

function alreadyConnectedWish(text) {
  const t = normalizeSpelling(text);
  return /우리나라도/.test(t) && /이어|힘을 냈|잘 지내|오래오래/.test(t);
}

function usedMeaningCheck(turns) {
  return (turns || []).some((turn) => /^(meaning-check|interpret)$/.test(String((turn && turn.strategy) || "")));
}

function hasConfirmedMeaning(turns, extra) {
  if (Array.isArray(extra) && extra.some((item) => {
    if (!item) return false;
    if (typeof item === "string") return !!String(item).trim();
    return item.confirmed !== false && String(item.aiInterpretation || item.meaning || "").trim();
  })) return true;
  return (turns || []).some((turn) => sourceOfTurn(turn) === "confirmed_meaning");
}

function confirmedMeaningTexts(list, turns) {
  const out = [];
  function add(text) {
    const t = normalizeSpelling(trim(text));
    if (!t || out.indexOf(t) >= 0) return;
    out.push(t);
  }
  (list || []).forEach((item) => {
    if (!item) return;
    if (typeof item === "string") add(item);
    else if (item.confirmed !== false) add(item.aiInterpretation || item.meaning || "");
  });
  (turns || []).forEach((turn) => {
    if (sourceOfTurn(turn) !== "confirmed_meaning") return;
    add(resolvedTurnAnswer(turn) || turn.answer);
  });
  return out;
}

function needsMeaningCheck(text, pack, turns, extraConfirmed) {
  if (usedMeaningCheck(turns) || hasConfirmedMeaning(turns, extraConfirmed)) return false;
  if (isUnsureText(text) || isFillerOrUnknown(text) || isGibberish(text)) return false;
  if (isAestheticLocked(text) || alreadyConnectedWish(text)) return false;
  const t = normalizeSpelling(text);
  const hasHook = REASON_RE.test(t) || BLOOM_RE.test(t) || FEEL_RE.test(t) || PRETTY_RE.test(t);
  if (!hasHook) return false;
  const linked = /이어졌|힘을 냈|보여 줄|보여줄|기억할 수|차분했|편안했|탈의 표정|크게 움직|골라|움직일/.test(t);
  if (linked && t.length >= 14) return false;
  return true;
}

function mockMeaningChoices(pack, answer) {
  const id = String((pack && pack.id) || "");
  const t = normalizeSpelling(answer);
  let options = [];
  if (id === "1-2" && /오래|계속|피/.test(t)) {
    options = [
      { label: "오래 피는 모습이 좋아서", value: "bloom_long" },
      { label: "지고 또 피는 게 신기해서", value: "bloom_again" }
    ];
  } else if (id === "4-3") {
    options = [
      { label: "느리고 차분해서", value: "calm" },
      { label: "빠르고 신나서", value: "fast" },
      { label: "슬프게 들려서", value: "sad" }
    ];
  } else if (id === "4-4") {
    options = [
      { label: "크게 움직여서", value: "big_move" },
      { label: "탈 표정이 재미있어서", value: "mask_fun" },
      { label: "보는 사람이 웃을 것 같아서", value: "friends_laugh" }
    ];
  } else {
    options = [
      { label: "색이나 모양이 마음에 들어서", value: "look" },
      { label: "직접 해 보니 재미있어서", value: "fun_doing" },
      { label: "처음 봐서 신기해서", value: "new" }
    ];
  }
  options.push({ label: "다른 생각이 있어", value: "other" });
  return options.slice(0, 4);
}

function meaningCheckQuestion(pack, answer) {
  const id = String((pack && pack.id) || "");
  if (id === "1-2" && /오래|계속|피/.test(answer || "")) return "무궁화가 오래 피는 게 어때서 좋았어?";
  if (id === "4-3") return "그 아리랑이 어떻게 들렸어?";
  if (id === "4-4") return "그 동작을 넣고 싶은 까닭과 비슷한 걸 골라 볼래?";
  return "네 생각과 가장 비슷한 걸 골라 볼래?";
}

function showMeaningCheck(pack, answer) {
  return {
    answerState: STATE.NEED_REASON,
    action: "SHOW_CHOICES",
    strategy: "meaning-check",
    message: meaningCheckQuestion(pack, answer),
    choices: mockMeaningChoices(pack, answer),
    finish: false
  };
}

function extractGuess(question) {
  const q = trim(question);
  const m = q.match(/^(.+?)(?:다는|라는|이라는) 뜻이야/);
  if (!m) return "";
  let guess = m[1].replace(/^(그럼 |혹시 |그러면 )/g, "").trim();
  guess = guess.replace(/좋겠다$/, "좋겠어요").replace(/좋다$/, "좋아요");
  if (/겠$/.test(guess)) guess += "어요";
  if (guess && !/[요다]$/.test(guess)) guess += "요";
  return guess;
}

function detectConfirm(text, pack) {
  const raw = trim(text);
  if (!raw || isFillerOrUnknown(raw) || isConfirmReply(raw)) return null;
  const unfinished = unfinishedMeaningConfirm(raw, pack);
  if (unfinished) return unfinished;
  const season = twoWaySeasonConfirm(raw, pack);
  if (season) return season;
  if (isFragmented(raw)) {
    const n = normalizeSpelling(raw);
    if (/마루/.test(n) && /집|시원/.test(n)) {
      return {
        guess: "마루가 시원해서 우리 집에 쓰고 싶어요",
        message: "마루가 시원해서 우리 집에 쓰고 싶다는 뜻이야?",
        mode: "yesno"
      };
    }
    return {
      guess: "",
      message: "방금 말이 두 가지로 들렸어. 어떤 뜻이야?",
      mode: "yesno"
    };
  }
  const stt = sttHypothesis(raw, pack);
  if (stt) return stt;
  return null;
}

function analyzeOne(text, ctx) {
  ctx = ctx || {};
  const t = normalizeSpelling(trim(text));
  if (!t || isFillerOrUnknown(t)) return STATE.NEED_RECALL;
  if (isGibberish(t) || isOffTopic(t, ctx.pack, ctx.history)) return STATE.OFF_TOPIC_OR_UNCLEAR;
  if (isAbstractOnly(t)) return STATE.NEED_CLARIFY;
  const hasReason = REASON_RE.test(t);
  const hasExpand = EXPAND_RE.test(t);
  if ((hasReason && hasExpand && t.length >= 16) || (t.length >= 28 && hasReason)) return STATE.DEEP_ENOUGH;
  const words = tokens(t);
  const nounLike = words.length <= 2 && t.length <= 10 && !ABSTRACT_RE.test(t);
  if (nounLike && !hasReason) return STATE.NEED_REASON;
  if (t.length >= 12 || hasReason) return STATE.READY_EXPAND;
  if (words.length <= 2) return STATE.NEED_REASON;
  return STATE.NEED_CLARIFY;
}

function isMeaningfulThought(text, pack, history) {
  const t = normalizeSpelling(text);
  if (isConfirmReply(t)) return false;
  if (isFillerOrUnknown(t) || isUnsureText(t)) return false;
  if (isGibberish(t)) return false;
  if (isContentFollowUp(t) || looksLikeChoice(t, pack) || mentionsPack(t, pack)) return true;
  if (isAbstractOnly(t)) return false;
  const state = analyzeOne(t, { pack, history: history || [] });
  return state !== STATE.NEED_RECALL && state !== STATE.OFF_TOPIC_OR_UNCLEAR;
}

function isSpokenFeeling(text) {
  const t = normalizeSpelling(text);
  if (!t || isUnsureText(t) || isFillerOrUnknown(t) || isGibberish(t) || isConfirmReply(t)) return false;
  return isAbstractOnly(t) || PRETTY_RE.test(t) || FEEL_RE.test(t);
}

function keepForSummary(text, pack, history) {
  const t = normalizeSpelling(text);
  if (!t || isUnsureText(t) || isFillerOrUnknown(t) || isGibberish(t) || isConfirmReply(t)) return false;
  if (isMeaningfulThought(t, pack, history)) return true;
  if (isSpokenFeeling(t) || COLOR_RE.test(t)) return true;
  return false;
}

function sourceOfTurn(turn) {
  const strategy = String((turn && turn.strategy) || "");
  if (/^(meaning-check|interpret)$/.test(strategy)) {
    const answer = String((turn && turn.answer) || "");
    if (/다른 생각|잘 모르/.test(answer)) return "free_response";
    return "confirmed_meaning";
  }
  const source = String((turn && turn.source) || "").trim();
  if (source) return source;
  if (/^(choice|recall|final-support)$/.test(strategy)) return "choice";
  if (/^confirm/.test(strategy)) return "confirmed_meaning";
  return "free_response";
}

function resolvedTurnAnswer(turn) {
  const raw = trim(turn && turn.answer);
  const strategy = String((turn && turn.strategy) || "");
  if (strategy === "confirm" || strategy === "confirmed") {
    if (isYes(raw)) return normalizeSpelling(extractGuess(turn.question) || turn.guess || "");
    if (isNo(raw) || isRetry(raw)) return "";
    return normalizeSpelling(raw);
  }
  if (isConfirmReply(raw)) return "";
  return normalizeSpelling(raw);
}

function allStudentTexts(initialAnswer, turns) {
  const bits = [];
  const first = normalizeSpelling(trim(initialAnswer));
  if (first && !isConfirmReply(first)) bits.push(first);
  (turns || []).forEach((turn) => {
    const answer = resolvedTurnAnswer(turn);
    if (answer) bits.push(answer);
  });
  return bits;
}

function summaryEvidence(initialAnswer, turns, pack) {
  const items = [];
  const first = normalizeSpelling(trim(initialAnswer));
  if (first && keepForSummary(first, pack, [])) {
    items.push({ text: first, source: "initial", weight: 2 });
  }
  const history = items.map((item) => item.text);
  (turns || []).forEach((turn) => {
    const answer = resolvedTurnAnswer(turn);
    if (!answer || isUnsureText(answer) || isConfirmReply(answer)) return;
    if (!keepForSummary(answer, pack, history)) return;
    const source = sourceOfTurn(turn);
    const weight = (source === "free_response" || source === "confirmed_meaning") ? 3 : source === "choice" ? 1 : 2;
    items.push({ text: answer, source, weight });
    history.push(answer);
  });
  return items;
}

function meaningfulAnswers(initialAnswer, turns, pack) {
  const bits = [];
  summaryEvidence(initialAnswer, turns, pack).forEach((item) => {
    if (bits.indexOf(item.text) === -1) bits.push(item.text);
  });
  return bits;
}

function summaryBits(initialAnswer, turns, pack) {
  return meaningfulAnswers(initialAnswer, turns, pack);
}

function compactMeaning(text) {
  return compact(normalizeSpelling(text))
    .replace(/[.!?~]+$/g, "")
    .replace(/(이에요|예요|입니다|요)$/g, "");
}

function similarMeaning(a, b) {
  const ka = compactMeaning(a);
  const kb = compactMeaning(b);
  if (!ka || !kb) return false;
  if (ka === kb) return true;
  if (ka.length >= 4 && kb.indexOf(ka) >= 0) return true;
  if (kb.length >= 4 && ka.indexOf(kb) >= 0) return true;
  return false;
}

function unitCovered(summary, unit) {
  const meaning = String((unit && unit.meaning) || unit || "");
  const text = String(summary || "");
  if (!meaning || !text) return false;
  if (/피어|피는|피어서/.test(meaning) && !/피/.test(text)) return false;
  if (/골라/.test(meaning) && !/골라|움직/.test(text)) return false;
  if (similarMeaning(text, meaning) || compact(text).indexOf(compactMeaning(meaning)) >= 0) return true;
  const pairs = [
    ["느려", "느리"], ["느리", "느려"],
    ["웃긴", "재미"], ["재미", "웃긴"],
    ["힘냈", "힘든"], ["힘든", "힘냈"], ["힘들어", "힘든"],
    ["보여주", "알려"], ["할머니랑", "할머니"], ["이어졌", "이어지"],
    ["골라", "움직"], ["피어서", "피는"], ["피어서", "피어"]
  ];
  if (pairs.some(([a, b]) => meaning.indexOf(a) >= 0 && text.indexOf(b) >= 0)) {
    return true;
  }
  const keys = (meaning.match(/[가-힣]{2,}/g) || [])
    .map((word) => word.replace(/이요$/, "").replace(/예요$/, "").replace(/요$/, ""))
    .filter((word) => word.length >= 2 && !/해서|좋아|있어요|우리|오늘|하면|싶|생각|모습|계속|그냥|같이|함께|좋겠/.test(word));
  const check = keys.length ? keys : (meaning.match(/[가-힣]{2,}/g) || []);
  if (!check.length) return true;
  function covered(word) {
    const stem = word
      .replace(/이요$/, "")
      .replace(/요$/, "")
      .replace(/(이|가|을|를|은|는|와|과|랑|도|서|면|게)$/g, "");
    if (!stem) return false;
    if (text.indexOf(word) >= 0 || text.indexOf(stem) >= 0) return true;
    if (/골라/.test(stem) && /움직/.test(text)) return true;
    if (stem.length <= 3 && stem.length >= 2 && text.indexOf(stem.slice(0, 2)) >= 0) return true;
    return false;
  }
  const strong = check.map((word) => word.replace(/(이|가|을|를|은|는|와|과|랑|도|서|면|게)$/g, "")).filter((word) => word.length >= 3);
  if (strong.length >= 2) return strong.every((word) => covered(word));
  return check.some((word) => covered(word));
}

function collectMeaningUnits(input) {
  const pack = (input && input.pack) || {};
  const units = [];
  function add(raw, source) {
    const meaning = normalizeSpelling(trim(raw)).replace(/[.!?~]+$/g, "");
    if (!meaning) return;
    if (isUnsureText(meaning) || isFillerOrUnknown(meaning) || isGibberish(meaning) || isConfirmReply(meaning)) return;
    if (isOtherThought(meaning)) return;
    if (source !== "confirmed_choice" && source !== "confirmed_meaning") {
      if (!keepForSummary(meaning, pack, units.map((item) => item.meaning)) && meaning.length < 4) return;
    }
    if (units.some((item) => similarMeaning(item.meaning, meaning))) return;
    units.push({ meaning, source });
  }

  add(input && input.initialAnswer, "initial");
  ((input && input.thinkingFriendTurns) || []).forEach((turn) => {
    const answer = resolvedTurnAnswer(turn);
    const source = sourceOfTurn(turn);
    const strategy = String((turn && turn.strategy) || "");
    if (strategy === "meaning-check" || strategy === "interpret" || source === "confirmed_meaning") {
      add(answer, "confirmed_choice");
    } else if (source === "choice") add(answer, "choice");
    else add(answer, "free_response");
  });
  ((input && input.selectedChoices) || []).forEach((item) => add(item, "choice"));
  confirmedMeaningTexts(input && input.confirmedMeanings, []).forEach((item) => add(item, "confirmed_meaning"));
  return units;
}

function composeFromMeaningUnits(pack, units) {
  const list = Array.isArray(units) ? units : [];
  if (!list.length) return "아직 잘 모르겠어요.";
  const q = String((pack && pack.valueQuestion) || "");
  const meanings = list.map((item) => item.meaning);
  const blob = blobOf(meanings);
  const topic = findSpecificTopic(meanings, pack) || findTopic(meanings, pack) || tidyPiece(meanings[0]);

  function clauseOf(raw) {
    let t = normalizeSpelling(raw).replace(/[.!?]+$/g, "").trim();
    t = t.replace(/좋겠어$/, "좋겠어요").replace(/싶어$/, "싶어요");
    return t;
  }

  function secondSentence(items) {
    const clauses = items.map((item) => clauseOf(item.meaning)).filter(Boolean);
    if (!clauses.length) return "";
    const blob = clauses.join(" ");
    if (/이어졌으면/.test(blob) && /힘냈으면|힘들어/.test(blob)) {
      return "우리나라도 오래오래 이어지고, 힘든 일이 있어도 계속 힘을 냈으면 좋겠어요.";
    }
    if (/이어졌으면/.test(blob)) {
      return "우리나라도 오래오래 이어졌으면 좋겠어요.";
    }
    if (/느려/.test(blob) && /차분/.test(blob) && /할머니/.test(blob)) {
      return "느리고 차분하게 들려서 좋고, 할머니와 함께 들어 보고 싶어요.";
    }
    if (/느려/.test(blob) && /차분/.test(blob)) {
      return "느리고 차분하게 들려서 마음에 들어요.";
    }
    if (/골라|어디 갈지|움직일/.test(blob)) {
      return "어떤 말을 움직일지 골라야 하기 때문이에요.";
    }
    if (/옛날 집/.test(blob) && /보여주/.test(blob) && /외국/.test(blob)) {
      return "한옥은 우리나라의 옛 집이고, 외국 사람들도 우리나라 집의 모습을 알 수 있으면 좋겠어요.";
    }
    const endClause = (t) => {
      let x = String(t || "").replace(/[.!?]+$/g, "").trim();
      if (/[요다]$/.test(x)) return x;
      return `${x}요`;
    };
    const useful = clauses.filter((c) => tidyPiece(c) !== tidyPiece(topic));
    if (!useful.length) return "";
    if (useful.length === 1) return `${endClause(useful[0])}.`;
    const head = useful.slice(0, -1).map((item) => item.replace(/요$/, "")).join(" ");
    const joined = `${head}, `;
    return `${joined}${endClause(useful[useful.length - 1])}.`;
  }

  function leftover(skip) {
    return list.filter((item) => !skip(item.meaning));
  }

  let first = "";
  let rest = list.slice(1);
  if (/어울/.test(q) && (BLOOM_RE.test(blob) || /오래|피/.test(blob))) {
    first = "나는 무궁화가 오래 피는 모습이 좋아요.";
    rest = leftover((text) => BLOOM_RE.test(text) || /피어서|오래 피|오래도록/.test(text));
  } else if (/행운|운과 생각|무엇이 더 중요/.test(q)) {
    first = /생각/.test(blob)
      ? "나는 윷놀이에서는 생각이 더 중요하다고 생각해요."
      : `나는 ${tidyPiece(topic)}${subjectParticle(tidyPiece(topic))} 더 중요하다고 생각해요.`;
    rest = leftover((text) => /생각|행운/.test(text) && tidyPiece(text).length <= 14);
  } else if (/돈을 만든다면|그림을 넣고/.test(q) && topic) {
    first = `나는 새로운 돈에 ${tidyPiece(topic)} 그림을 넣고 싶어요.`;
    rest = leftover((text) => tidyPiece(text) === tidyPiece(topic) || (compact(text).indexOf(compact(tidyPiece(topic))) >= 0 && tidyPiece(text).length <= tidyPiece(topic).length + 3));
  } else if (/마음에 드/.test(q)) {
    const song = list.find((item) => /아리랑/.test(item.meaning));
    const rawName = String((song && song.meaning) || topic || "");
    const name = (rawName.match(/진도아리랑|경기아리랑|아리랑/) || [tidyPiece(rawName).split(/\s+/)[0]])[0];
    first = `나는 ${name}${subjectParticle(name)} 더 좋아요.`;
    rest = leftover((text) => /아리랑/.test(text) && tidyPiece(text).length <= 12);
  } else if (/동작/.test(q)) {
    first = /웃긴|재미|신나/.test(blob)
      ? "나는 팔을 크게 움직이는 재미있는 탈춤 동작을 만들고 싶어요."
      : `나는 ${tidyPiece(topic)} 동작을 넣고 싶어요.`;
    rest = leftover((text) => /웃긴|재미|팔|크게 움직|동작/.test(text) && tidyPiece(text).length <= 16);
  } else if (/쓰고 싶|우리집|오늘날/.test(q) && topic) {
    first = `나는 ${tidyPiece(topic)}${objectParticle(tidyPiece(topic))} 우리 집에도 쓰고 싶어요.`;
    rest = leftover((text) => tidyPiece(text) === tidyPiece(topic));
  } else {
    const opening = clauseOf(list[0].meaning);
    const nounOnly = !/(어|아|해|워|와|져|려|서|요|다|니까|고|게|면|돼|야)$/.test(opening) && opening.length <= 10;
    if (nounOnly) {
      first = `${opening}${subjectParticle(opening) === "이" ? "이에요" : "예요"}.`;
    } else first = /^(나는|저는)\s/.test(opening)
      ? (/[.!?]$/.test(opening) ? opening : `${opening}${/[요다]$/.test(opening) ? "." : "요."}`)
      : `나는 ${opening}${/[요다]$/.test(opening) ? "." : "요."}`;
    rest = list.slice(1);
  }

  const extra = secondSentence(rest);
  return polishLanguage(extra ? `${first} ${extra}` : first);
}

function hasReasonBit(bits) {
  return bits.some((item) => REASON_RE.test(item));
}

function hasApplyBit(bits) {
  return bits.some((item) => EXPAND_RE.test(item) || PLACE_RE.test(item));
}

function questionNeeds(pack) {
  const q = String((pack && pack.valueQuestion) || "");
  return {
    why: /왜|이유|어울리|의미/.test(q),
    apply: /쓰고 싶|사용|우리집|넣고 싶|입고 싶/.test(q),
    what: /무엇|어떤|어디/.test(q)
  };
}

function hasTopicBit(bits, pack) {
  return bits.some((item) => looksLikeChoice(item, pack) || mentionsPack(item, pack));
}

function spokenMeaning(initialAnswer, turns) {
  return allStudentTexts(initialAnswer, turns).filter((item) => (
    item && !isUnsureText(item) && !isFillerOrUnknown(item) && !isConfirmReply(item) && !isGibberish(item)
  ));
}

function blobOf(bits) {
  return (bits || []).join(" ");
}

function hasFeatureBit(bits, pack) {
  const blob = blobOf(bits);
  if (bits.some((item) => looksLikeChoice(item, pack) || mentionsPack(item, pack))) return true;
  if (COLOR_RE.test(blob) || BLOOM_RE.test(blob)) return true;
  return bits.some((item) => {
    if (isAbstractOnly(item) || PRETTY_RE.test(item)) return false;
    const t = tidyPiece(item);
    return t.length >= 2;
  });
}

function thinkingStepsOf(pack) {
  const steps = pack && Array.isArray(pack.thinkingSteps) ? pack.thinkingSteps : [];
  return steps.length ? steps : ["feature", "reason", "value"];
}

function stepCovered(step, blob, pack) {
  const t = String(blob || "");
  switch (String(step || "")) {
    case "observe":
    case "feature":
    case "remember":
    case "pattern":
    case "look":
    case "food":
    case "custom":
    case "play":
    case "make":
      return looksLikeChoice(t, pack) || mentionsPack(t, pack) || COLOR_RE.test(t) || BLOOM_RE.test(t) || /무늬|모양|색|동작|탈|한복|윷|딱지|문양|음식|풍습/.test(t);
    case "liked":
    case "feel":
    case "good":
    case "wonder":
      return PRETTY_RE.test(t) || FEEL_RE.test(t);
    case "meaning":
    case "fit":
    case "reason":
    case "evidence":
    case "important":
    case "condition":
    case "boast":
    case "introduce":
    case "continue":
    case "luck-or-thought":
      return REASON_RE.test(t) || BLOOM_RE.test(t) || /어울|나라|의미|자랑|소개|이기|중요|운|생각/.test(t);
    case "today":
    case "use":
    case "wear":
    case "show":
    case "choose":
      return EXPAND_RE.test(t) || PLACE_RE.test(t) || /넣고|입고|쓰고|어디에|그림/.test(t);
    case "together":
      return /함께|같이|여럿|여러 사람/.test(t) || FEEL_RE.test(t);
    case "compare":
    case "difference":
      return /다르|비교|빠르|느리|장단|경기|진도/.test(t);
    case "move":
    case "create":
      return /동작|몸짓|손|발|탈/.test(t) || EXPAND_RE.test(t);
    default:
      return t.replace(/\s+/g, "").length >= 6;
  }
}

function coveredThinkingSteps(pack, spoken) {
  const blob = blobOf(spoken);
  return thinkingStepsOf(pack).filter((step) => stepCovered(step, blob, pack));
}

function nextThinkingStep(pack, spoken) {
  const steps = thinkingStepsOf(pack);
  const covered = coveredThinkingSteps(pack, spoken);
  const next = steps.find((step) => covered.indexOf(step) < 0);
  return next || steps[steps.length - 1] || "value";
}

function usedSupport(turns) {
  return (turns || []).some((turn) => /^(choice|recall|final-support)$/.test(String(turn.strategy || "")));
}

function previousStrategies(turns) {
  return (turns || []).map((turn) => String((turn && turn.strategy) || "")).filter(Boolean);
}

function supportQuestion(pack) {
  const recall = pack && pack.followUpExamples && pack.followUpExamples.recall;
  return recall || "오늘 활동에서 가장 기억나는 게 뭐야?";
}

function hasEnoughForSummary(initialAnswer, turns, pack) {
  const spoken = spokenMeaning(initialAnswer, turns);
  if (!spoken.length) return false;
  const blob = blobOf(spoken);
  if (spoken.some((item) => analyzeOne(item, { pack, history: spoken }) === STATE.DEEP_ENOUGH)) return true;
  const feature = hasFeatureBit(spoken, pack);
  const feeling = PRETTY_RE.test(blob) || FEEL_RE.test(blob);
  const reason = hasReasonBit(spoken);
  if (feature && (feeling || reason)) return true;
  if (BLOOM_RE.test(blob)) return true;
  if (spoken.length >= 2 && (feature || feeling || reason || hasTopicBit(spoken, pack))) return true;
  if (hasTopicBit(spoken, pack) && reason) return true;
  if (spoken.length === 1 && reason && trim(spoken[0]).length >= 12 && hasTopicBit(spoken, pack)) return true;
  const covered = coveredThinkingSteps(pack, spoken);
  if (covered.length >= Math.max(2, thinkingStepsOf(pack).length - 1)) {
    if (spoken.length >= 2 || spoken.some((item) => trim(item).length >= 14 || REASON_RE.test(item))) return true;
  }
  return false;
}

function hintFor(label, pack) {
  if (FEATURE_HINTS[label]) return FEATURE_HINTS[label];
  const hit = ((pack && pack.allowedKnowledge) || []).find((line) => String(line).indexOf(label) >= 0);
  if (!hit) return "";
  const clipped = String(hit).replace(/한옥에는 |무궁화는 |한복에는 /g, "").trim();
  if (clipped.length <= 18) return clipped;
  return "";
}

function supportChoices(pack) {
  const pool = (pack && pack.choicePool) || [];
  const rest = pool.filter((item) => !/other|다른|모르겠|unsure/i.test(String(item.value || item.label || "")));
  const take = rest.slice(0, 3).map((item) => {
    const label = String(item.label || item.value || "");
    return {
      label,
      value: String(item.value || item.label || ""),
      hint: hintFor(label, pack)
    };
  });
  take.push({ label: "아직 잘 모르겠어요", value: "unsure" });
  return take.slice(0, 4);
}

function isConfirmTurn(turn) {
  return /^(confirm|confirmed)$/.test(String((turn && turn.strategy) || ""));
}

function supportTurnCount(turns) {
  return (turns || []).filter((turn) => {
    if (isConfirmTurn(turn)) return false;
    const s = String((turn && turn.strategy) || "");
    if (/^(finish|unsure)$/.test(s)) return false;
    return Boolean(s || (turn && turn.question));
  }).length;
}

function freeAskCount(turns) {
  return supportTurnCount(turns);
}

function currentAnswer(input) {
  const latest = trim(input && input.studentAnswer);
  if (latest) return latest;
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  if (turns.length) return trim(turns[turns.length - 1].answer);
  return trim(input && input.initialAnswer);
}

function currentInputType(input) {
  const top = String((input && input.inputType) || "").trim().toLowerCase();
  if (top === "voice" || top === "text" || top === "choice") return top;
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  const latest = currentAnswer(input);
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    if (trim(turns[i] && turns[i].answer) !== latest) continue;
    const t = String((turns[i] && turns[i].inputType) || "").trim().toLowerCase();
    if (t === "voice" || t === "text" || t === "choice") return t;
  }
  if (turns.length) {
    const t = String((turns[turns.length - 1] && turns[turns.length - 1].inputType) || "").trim().toLowerCase();
    if (t === "voice" || t === "text" || t === "choice") return t;
  }
  return "text";
}

function initialOf(input) {
  const first = trim(input && input.initialAnswer);
  if (first) return first;
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  if (!turns.length) return currentAnswer(input);
  return first;
}

function lastQuestionStrategy(input) {
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  const latest = currentAnswer(input);
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    if (trim(turns[i] && turns[i].answer) === latest) return String(turns[i].strategy || "");
  }
  if (turns.length) return String(turns[turns.length - 1].strategy || "");
  return "";
}

function lastQuestion(input) {
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  const latest = currentAnswer(input);
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    if (trim(turns[i] && turns[i].answer) === latest) return String(turns[i].question || "");
  }
  if (turns.length) return String(turns[turns.length - 1].question || "");
  return "";
}

function historyOf(input) {
  const bits = allStudentTexts(initialOf(input), input && input.previousTurns);
  const latest = normalizeSpelling(currentAnswer(input));
  const idx = bits.lastIndexOf(latest);
  if (idx >= 0) bits.splice(idx, 1);
  return bits;
}

function finishUnsure() {
  return {
    answerState: STATE.NEED_RECALL,
    action: "FINISH",
    strategy: "unsure",
    message: "",
    choices: [],
    finish: true,
    summary: "아직 잘 모르겠어요."
  };
}

function finishReady() {
  return {
    answerState: STATE.DEEP_ENOUGH,
    action: "FINISH",
    strategy: "finish",
    message: "",
    choices: [],
    finish: true
  };
}

function showChoices(state, strategy, message, pack) {
  return {
    answerState: state,
    action: "SHOW_CHOICES",
    strategy,
    message,
    choices: supportChoices(pack),
    finish: false
  };
}

function confirmTurn(info) {
  return {
    answerState: STATE.NEED_CONFIRM,
    action: "SHOW_CHOICES",
    strategy: "confirm",
    message: info.message,
    choices: info.choices || confirmChoices(),
    guess: info.guess || "",
    finish: false
  };
}

function shortReasonQuestion(answer) {
  const snippet = tidyPiece(answer).replace(/[요.!~]+$/g, "");
  if (snippet) return `${snippet}의 어떤 점이 마음에 들었어?`;
  return "어떤 점이 마음에 들었어?";
}

function rewriteLastAnswer(turns, answer) {
  const next = (turns || []).slice();
  if (!next.length) return [{ strategy: "confirmed", question: "", answer }];
  const last = { ...next[next.length - 1], strategy: "confirmed", answer };
  next[next.length - 1] = last;
  return next;
}

function decideAfterConfirm(input) {
  const pack = (input && input.pack) || {};
  const latest = currentAnswer(input);
  if (isRetry(latest)) {
    return {
      answerState: STATE.NEED_CLARIFY,
      action: "ASK",
      strategy: "clarify",
      message: "괜찮아. 다시 말해 줄래?",
      choices: [],
      finish: false
    };
  }
  if (isDifferent(latest) || isNo(latest)) {
    return showMeaningCheck(pack, extractGuess(lastQuestion(input)) || initialOf(input));
  }
  const used = isYes(latest) ? extractGuess(lastQuestion(input)) : latest;
  if (!used) {
    return {
      answerState: STATE.NEED_CLARIFY,
      action: "ASK",
      strategy: "clarify",
      message: "그러면 어떤 뜻이야?",
      choices: [],
      finish: false
    };
  }
  let nextInitial = initialOf(input);
  if (detectConfirm(nextInitial, pack)) nextInitial = used;
  return decideTurn({
    ...input,
    initialAnswer: nextInitial,
    studentAnswer: used,
    skipConfirm: true,
    previousTurns: rewriteLastAnswer(input.previousTurns, used)
  });
}

function decideTurn(input) {
  const pack = (input && input.pack) || {};
  const turns = Array.isArray(input && input.previousTurns) ? input.previousTurns : [];
  const latestRaw = currentAnswer(input);
  const latest = normalizeSpelling(latestRaw);
  const initial = initialOf(input);
  const lastStrategy = lastQuestionStrategy(input);
  const history = historyOf(input);
  const spoken = spokenMeaning(initial, turns);
  const hasProgress = spoken.length > 0;
  const prevStrategies = previousStrategies(turns);
  const step = nextThinkingStep(pack, spoken);

  function withMeta(result) {
    return Object.assign({}, result, {
      thinkingStep: step,
      accumulatedStudentMeaning: spoken.slice(),
      previousStrategies: prevStrategies
    });
  }

  if (lastStrategy === "confirm") return withMeta(decideAfterConfirm(input));

  if (lastStrategy === "meaning-check" || lastStrategy === "interpret") {
    if (isUnsureText(latestRaw) || isOtherThought(latestRaw)) {
      if (supportTurnCount(turns) >= MAX_FOLLOWUPS) {
        return withMeta(hasProgress ? finishReady() : finishUnsure());
      }
      return withMeta({
        answerState: STATE.NEED_CLARIFY,
        action: "ASK",
        strategy: "clarify",
        message: "어떤 생각이야?",
        choices: [],
        finish: false
      });
    }
    const enoughAfterCheck = hasEnoughForSummary(initial, turns, pack);
    if (enoughAfterCheck || supportTurnCount(turns) >= MAX_FOLLOWUPS) return withMeta(finishReady());
    return withMeta({
      answerState: STATE.READY_EXPAND,
      action: "ASK",
      strategy: "expand",
      message: "",
      choices: [],
      finish: false
    });
  }

  if (!input.skipConfirm && currentInputType(input) === "voice") {
    const confirm = detectConfirm(latestRaw, pack);
    if (confirm) return withMeta(confirmTurn(confirm));
  }

  const latestState = analyzeOne(latest, { pack, history });
  const enough = hasEnoughForSummary(initial, turns, pack);
  const bits = meaningfulAnswers(initial, turns, pack);
  const asked = supportTurnCount(turns);
  const supportBefore = usedSupport(turns);

  if (lastStrategy === "final-reason") {
    if (enough || bits.length || hasProgress) return withMeta(finishReady());
    return withMeta(finishUnsure());
  }

  if (lastStrategy === "final-support" || lastStrategy === "recall" || lastStrategy === "choice") {
    if (isUnsureText(latestRaw) || isUnsureText(latest)) {
      if (asked >= MAX_FOLLOWUPS) return withMeta(hasProgress ? finishReady() : finishUnsure());
      return withMeta({
        answerState: STATE.NEED_CLARIFY,
        action: "ASK",
        strategy: "clarify",
        message: "",
        choices: [],
        finish: false
      });
    }
    if (isMeaningfulThought(latest, pack, history) || looksLikeChoice(latest, pack) || COLOR_RE.test(latest) || BLOOM_RE.test(latest) || PRETTY_RE.test(latest)) {
      if (enough) return withMeta(finishReady());
      if (asked >= MAX_FOLLOWUPS) return withMeta(finishReady());
      return withMeta({
        answerState: STATE.NEED_REASON,
        action: "ASK",
        strategy: "reason",
        thinkingStep: step,
        message: "",
        choices: [],
        finish: false
      });
    }
    if (asked >= MAX_FOLLOWUPS) return withMeta(hasProgress ? finishReady() : finishUnsure());
    return withMeta({
      answerState: STATE.NEED_CLARIFY,
      action: "ASK",
      strategy: "clarify",
      message: "",
      choices: [],
      finish: false
    });
  }

  if (asked >= MAX_FOLLOWUPS) {
    if (hasProgress || enough) return withMeta(finishReady());
    return withMeta(finishUnsure());
  }

  if (latestState === STATE.NEED_RECALL || isUnsureText(latestRaw) || isUnsureText(latest) || latestState === STATE.OFF_TOPIC_OR_UNCLEAR) {
    if (!hasProgress && !supportBefore) {
      return withMeta(showChoices(STATE.NEED_RECALL, "recall", supportQuestion(pack), pack));
    }
    if (prevStrategies.indexOf("recall") >= 0 && prevStrategies.indexOf("final-support") < 0) {
      return withMeta(showChoices(STATE.NEED_FINAL_SUPPORT, "final-support", "오늘 본 것 중 다른 하나를 말해 줄래?", pack));
    }
    const nextSupport = ["clarify", "reason", "expand", "compare", "apply"].find((item) => prevStrategies.indexOf(item) < 0) || "clarify";
    return withMeta({
      answerState: STATE.NEED_CLARIFY,
      action: "ASK",
      strategy: nextSupport,
      message: "",
      choices: [],
      finish: false
    });
  }

  if (enough && isAestheticLocked(latest)) return withMeta(finishReady());
  if (alreadyConnectedWish(latest) && (enough || BLOOM_RE.test(latest) || spoken.length >= 1)) {
    return withMeta(finishReady());
  }
  if (needsMeaningCheck(latest, pack, turns, input && input.confirmedMeanings)) {
    return withMeta(showMeaningCheck(pack, latest));
  }
  if (enough) return withMeta(finishReady());

  let strategy = "expand";
  if (latestState === STATE.NEED_CLARIFY) strategy = "clarify";
  else if (latestState === STATE.NEED_REASON) strategy = "reason";
  else if (latestState === STATE.READY_EXPAND || latestState === STATE.DEEP_ENOUGH) strategy = "reason";
  if (step === "compare" || step === "difference") strategy = "compare";
  if (step === "fit" || step === "meaning") strategy = "value";
  if (step === "today" || step === "use") strategy = "apply";
  if (step === "create" || step === "move") strategy = "create";
  const used = prevStrategies;
  const alts = ["reason", "clarify", "expand", "compare", "apply", "value", "create"];
  if (used.indexOf(strategy) >= 0) {
    const next = alts.find((item) => used.indexOf(item) < 0);
    if (next) strategy = next;
  }
  return withMeta({
    answerState: latestState === STATE.DEEP_ENOUGH ? STATE.READY_EXPAND : latestState,
    action: "ASK",
    strategy,
    message: "",
    choices: [],
    finish: false
  });
}

function subjectParticle(word) {
  const s = String(word || "");
  const last = s.charAt(s.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "가";
  return ((code - 0xac00) % 28) ? "이" : "가";
}

function objectParticle(word) {
  const s = String(word || "");
  const last = s.charAt(s.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "를";
  return ((code - 0xac00) % 28) ? "을" : "를";
}

function tidyPiece(text) {
  return trim(text)
    .replace(/[.!?~]+$/g, "")
    .replace(/(이요|예요|이에요|입니다|요)$/g, "")
    .trim();
}

function toModifier(reason) {
  let adj = tidyPiece(reason).replace(/때문(에|이야|이에요)?$/g, "").trim();
  adj = adj.replace(/^(분홍색|빨간색|하얀색|노란색|보라색|마루|온돌|창호지)(이|가)\s*/, "");
  if (/예뻐서$/.test(adj) || adj === "예뻐" || adj === "이뻐") return "예쁜";
  if (/이뻐서$/.test(adj)) return "예쁜";
  if (/해서$/.test(adj)) adj = adj.replace(/해서$/, "한");
  else if (/여서$/.test(adj)) adj = adj.replace(/여서$/, "연");
  else if (/라서$/.test(adj)) adj = adj.replace(/라서$/, "란");
  else if (/서$/.test(adj)) adj = adj.replace(/서$/, "ㄴ");
  return adj;
}

function findTopic(bits, pack) {
  const labeled = bits.find((item) => looksLikeChoice(item, pack));
  if (labeled) {
    const hit = packLabels(pack).find((label) => labeled.indexOf(label) >= 0);
    return hit || tidyPiece(labeled);
  }
  const mentioned = bits.find((item) => mentionsPack(item, pack));
  if (mentioned) {
    const hit = packLabels(pack).find((label) => mentioned.indexOf(label) >= 0);
    if (hit) return hit;
    return tidyPiece(mentioned);
  }
  return bits[0] ? tidyPiece(bits[0]) : "";
}

function findSpecificTopic(bits, pack) {
  const labels = packLabels(pack);
  const isGenericChoice = (item) => labels.some((label) => tidyPiece(item) === label || tidyPiece(item) === tidyPiece(label));
  const reasonOnly = (item) => REASON_RE.test(item) && !isGenericChoice(item) && !mentionsPack(item, pack) && !COLOR_RE.test(item);
  const placeOnly = (item) => PLACE_RE.test(item) && !COLOR_RE.test(item) && !isGenericChoice(item) && !mentionsPack(item, pack);
  const specific = bits.find((item) => {
    if (!item || isAbstractOnly(item) || reasonOnly(item) || placeOnly(item)) return false;
    if (isGenericChoice(item)) return false;
    return tidyPiece(item).length >= 2;
  });
  if (specific) {
    const color = String(specific).match(/분홍색|빨간색|하얀색|노란색|보라색|분홍/);
    if (color) return color[0] === "분홍" ? "분홍색" : color[0];
    return tidyPiece(specific);
  }
  return findTopic(bits, pack);
}

function polishStudent(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/요요/g, "요")
    .replace(/\s+([.!?])/g, "$1")
    .trim();
}

function polishLanguage(text) {
  let t = normalizeSpelling(String(text || ""));
  t = t
    .replace(/차분해([.!]|$)/g, "차분해요$1")
    .replace(/느려서\s*차분/g, "느리고 차분")
    .replace(/다고 생각합니다/g, "다고 생각해요")
    .replace(/이라고 생각합니다/g, "이라고 생각해요")
    .replace(/라고 생각합니다/g, "라고 생각해요")
    .replace(/고 생각합니다/g, "고 생각해요")
    .replace(/판단합니다/g, "생각해요")
    .replace(/할 필요가 있습니다/g, "하면 좋겠어요")
    .replace(/가치가 있다고 생각합니다/g, "좋아요")
    .replace(/계승해야 합니다/g, "이어가면 좋겠어요")
    .replace(/습니다([.!?]?)/g, "어요$1")
    .replace(/입니다([.!?]?)/g, "이에요$1")
    .replace(/좋겠어([.!]|$)/g, "좋겠어요$1")
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?])/g, "$1")
    .trim();
  return polishStudent(t);
}

function composeValueSummary(pack, bits, confirmedTexts) {
  const clean = (bits || []).map((item) => normalizeSpelling(item)).filter(Boolean);
  const confirmed = (confirmedTexts || []).map((item) => normalizeSpelling(item)).filter(Boolean);
  if (!clean.length && !confirmed.length) return "아직 잘 모르겠어요.";
  const q = String((pack && pack.valueQuestion) || "");
  const topic = findSpecificTopic(clean, pack) || findTopic(clean, pack);
  const reason = clean.find((item) => {
    if (!(REASON_RE.test(item) || PRETTY_RE.test(item))) return false;
    if (tidyPiece(item) === tidyPiece(topic)) return false;
    if (COLOR_RE.test(item) && tidyPiece(topic).indexOf("색") >= 0 && tidyPiece(item).indexOf(tidyPiece(topic)) >= 0) {
      return PRETTY_RE.test(item) || REASON_RE.test(item);
    }
    return true;
  });
  let adj = "";
  if (reason) {
    if (PRETTY_RE.test(reason) && !/예뻐서|이뻐서/.test(reason) && !REASON_RE.test(reason)) adj = "예쁜";
    else adj = toModifier(reason);
  }
  const place = clean.find((item) => PLACE_RE.test(item) && !looksLikeChoice(item, pack) && String(item).indexOf(String(topic || "")) < 0);
  const first = normalizeSpelling(clean[0] || confirmed[0] || "");
  const blob = blobOf(clean.concat(confirmed));

  function withConfirmed(sentence) {
    let next = sentence;
    confirmed.concat(clean).forEach((item) => {
      if (unitCovered(next, { meaning: item })) return;
      if (tidyPiece(item).length < 4) return;
      let extra = String(item).replace(/[.!?]+$/g, "").trim();
      extra = extra.replace(/좋겠어$/, "좋겠어요").replace(/싶어$/, "싶어요");
      if (!/[요다]$/.test(extra)) extra += "요";
      extra = extra.replace(/다요$/, "어요").replace(/요요$/, "요");
      if (!/[.!?]$/.test(extra)) extra += ".";
      next = `${next} ${extra}`;
    });
    return polishStudent(next);
  }

  if (/쓰고 싶|우리집|오늘날/.test(q) && topic) {
    let sentence = adj
      ? `나는 ${adj} ${topic}${objectParticle(topic)} 우리 집에도 쓰고 싶어요.`
      : `나는 ${topic}${objectParticle(topic)} 우리 집에도 쓰고 싶어요.`;
    if (place) sentence += ` ${tidyPiece(place).replace(/이$/, "")}에 있으면 좋겠어요.`;
    return withConfirmed(sentence);
  }
  if (/넣고 싶/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${objectParticle(topic)} 넣고 싶어요.`
      : `나는 ${topic}${objectParticle(topic)} 넣고 싶어요.`);
  }
  if (/입고 싶/.test(q) && topic) {
    return withConfirmed(adj ? `나는 ${adj} ${topic} 한복을 입고 싶어요.` : `나는 ${topic} 한복을 입고 싶어요.`);
  }
  if (/어울/.test(q) && (BLOOM_RE.test(blob) || /오래|계속/.test(blob))) {
    const pretty = clean.some((item) => PRETTY_RE.test(item));
    if (pretty && COLOR_RE.test(String(topic))) {
      const flower = /무궁화/.test(q) ? "무궁화가 " : "";
      return withConfirmed(`나는 ${topic}${subjectParticle(topic)} 예뻐서 ${flower}우리나라 꽃과 잘 어울린다고 생각해요.`);
    }
    if (PRETTY_RE.test(blob)) {
      return withConfirmed("나는 무궁화가 오래 피는 모습이 예뻐서 우리나라 꽃과 잘 어울린다고 생각해요.");
    }
    return withConfirmed("나는 무궁화가 오래 피는 모습이 우리나라와 잘 어울린다고 생각해요.");
  }
  if (/어울/.test(q) && topic) {
    const pretty = clean.some((item) => PRETTY_RE.test(item));
    if (pretty && COLOR_RE.test(String(topic))) {
      const flower = /무궁화/.test(q) ? "무궁화가 " : "";
      return withConfirmed(`나는 ${topic}${subjectParticle(topic)} 예뻐서 ${flower}우리나라 꽃과 잘 어울린다고 생각해요.`);
    }
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${subjectParticle(topic)} 우리나라 꽃과 잘 어울린다고 생각해요.`
      : `나는 ${topic}${subjectParticle(topic)} 우리나라 꽃과 잘 어울린다고 생각해요.`);
  }
  if (/자랑/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${objectParticle(topic)} 자랑하고 싶어요.`
      : `나는 ${topic}${objectParticle(topic)} 자랑하고 싶어요.`);
  }
  if (/느낌/.test(q)) {
    const feel = tidyPiece(reason || clean[clean.length - 1] || first);
    return withConfirmed(`나는 ${feel} 느낌이 들어요.`);
  }
  if (/행운|운과 생각|무엇이 더 중요/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${subjectParticle(topic)} 더 중요하다고 생각해요.`
      : `나는 ${topic}${subjectParticle(topic)} 더 중요하다고 생각해요.`);
  }
  if (/마음에 드/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${subjectParticle(topic)} 더 마음에 들어요.`
      : `나는 ${topic}${subjectParticle(topic)} 더 마음에 들어요.`);
  }
  if (/이어가/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${objectParticle(topic)} 이어가고 싶어요.`
      : `나는 ${topic}${objectParticle(topic)} 이어가고 싶어요.`);
  }
  if (/동작/.test(q) && topic) {
    return withConfirmed(`나는 ${adj ? `${adj} ` : ""}${topic} 동작을 넣고 싶어요.`);
  }
  if (/딱지/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}${subjectParticle(topic)} 중요하다고 생각해요.`
      : `나는 ${topic}${subjectParticle(topic)} 중요하다고 생각해요.`);
  }
  if (/어디에 새롭게/.test(q) && topic) {
    return withConfirmed(adj
      ? `나는 ${adj} ${topic}에 문양을 써 보고 싶어요.`
      : `나는 ${topic}에 문양을 써 보고 싶어요.`);
  }
  if (adj && topic) return withConfirmed(`나는 ${adj} ${topic}${subjectParticle(topic)} 좋아요.`);
  if (topic) {
    const piece = tidyPiece(topic);
    if (/^(나는|저는)\s/.test(first)) return withConfirmed(/[.요]$/.test(first) ? first : `${first}요.`);
    return withConfirmed(/[요다]$/.test(piece) ? `나는 ${piece}.` : `나는 ${piece}요.`);
  }
  if (/^(나는|저는)\s/.test(first)) return withConfirmed(/[.요]$/.test(first) ? first : `${first}요.`);
  const piece = tidyPiece(first);
  return withConfirmed(/[요다]$/.test(piece) ? `나는 ${piece}.` : `나는 ${piece}요.`);
}

function minSummary(initialAnswer, turns, pack, confirmedMeanings) {
  const units = collectMeaningUnits({
    pack,
    initialAnswer,
    thinkingFriendTurns: turns,
    confirmedMeanings
  });
  if (!units.length) return "아직 잘 모르겠어요.";
  return composeFromMeaningUnits(pack, units);
}

module.exports = {
  meaningCheckQuestion,
  STATE,
  MAX_FOLLOWUPS,
  isUnsureText,
  isWeakText,
  isMeaningfulThought,
  meaningfulAnswers,
  hasEnoughForSummary,
  supportChoices,
  decideTurn,
  minSummary,
  composeValueSummary,
  summaryBits,
  keepForSummary,
  composeFromMeaningUnits,
  collectMeaningUnits,
  unitCovered,
  polishLanguage,
  supportTurnCount,
  confirmedMeaningTexts,
  mockMeaningChoices,
  needsMeaningCheck,
  analyzeOne,
  currentAnswer,
  toModifier,
  tidyPiece,
  subjectParticle,
  normalizeSpelling,
  detectConfirm,
  confirmChoices,
  summaryEvidence,
  sourceOfTurn,
  resolvedTurnAnswer,
  spokenMeaning,
  nextThinkingStep,
  previousStrategies
};
