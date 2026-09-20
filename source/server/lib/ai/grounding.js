/**
 * 최종 답변(finalSummary)에 학생이 말하지 않은 새 내용어가 들어갔는지 검사한다.
 * 허용 어휘 = 학생 답(처음 답·자유 답·고른 보기·확인한 뜻) + 처음 질문(valueQuestion) + 활동 이름 + 공통 기능어
 * ThinkFriend 질문 속 내용, 고르지 않은 보기, allowedKnowledge는 허용하지 않는다.
 */
const meaning = require("./meaning");

const COMMON = [
  "나는", "저는", "내가", "제가", "나도", "저도", "나의", "내", "우리", "우리나라",
  "정말", "진짜", "아주", "너무", "많이", "조금", "더", "가장", "제일", "특히", "꼭", "잘", "또", "다시",
  "그래서", "그리고", "왜냐하면", "때문", "때문이에요", "때문에", "거든요",
  "좋아요", "좋아", "좋은", "좋겠어요", "좋겠어", "좋았어요", "좋고", "좋아서",
  "싶어요", "싶어", "싶은", "싶고", "생각해요", "생각해", "생각이", "생각도", "생각했어요", "생각",
  "마음에", "들어요", "들어서", "들었어요", "있어요", "있어서", "있는", "있고", "있으면", "있을",
  "없어요", "같아요", "같아서", "같은", "해요", "했어요", "하고", "하면", "해서", "하는", "할",
  "이에요", "예요", "거예요", "것", "것이", "것을", "것도", "것은", "수", "점", "점이", "점을", "점도",
  "모습", "모습이", "모습을", "부분", "부분이", "이", "그", "저", "이런", "그런", "모두", "다",
  "앞으로도", "앞으로", "계속", "오래", "오래오래", "함께", "같이",
  "어떤", "어느", "무엇", "무엇이", "보면", "보여요", "보여서", "들려요", "들려서", "느껴져요", "느껴져서", "느껴졌어요",
  "있다", "있다는", "없다", "한다", "된다", "되면", "돼요", "되고", "노래"
];

const ONE_CHAR_OK = ["나", "저", "내", "제", "것", "수", "있", "없", "더", "잘", "또", "꼭", "참", "다", "좀", "왜", "게", "걸", "거"];

// 한글 음절 분해: [초성, 중성, 종성]
function jamo(ch) {
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return [Math.floor(code / 588), Math.floor((code % 588) / 28), code % 28];
}

const PARTICLE_RE = /(이에요|예요|이요|에서|에게|한테|께서|께|으로|로|이랑|랑|하고|과|와|은|는|이|가|을|를|의|도|에|요|들)$/;
function stem(word) {
  let w = String(word || "").replace(/[^가-힣]/g, "");
  for (let i = 0; i < 2; i += 1) {
    const next = w.replace(PARTICLE_RE, "");
    if (next.length >= 2) w = next;
  }
  return w;
}

// 첫 음절 전체 + 둘째 음절 초성이 같으면 같은 말로 본다 (이길/이기려면, 예뻐/예쁘다)
function key(word) {
  const w = String(word || "");
  if (w.length < 2) return w;
  const b = jamo(w[1]);
  return w[0] + (b ? String(b[0]) : w[1]);
}

const ENDING_INITIALS = new Set([0, 2, 3, 5, 6, 9, 11, 12, 18]); // ㄱㄴㄷㄹㅁㅅㅇㅈㅎ
const IEUNG = 11;
function secondInitial(w) {
  if (!w || w.length < 2) return -1;
  const b = jamo(w[1]);
  return b ? b[0] : -1;
}

function wordsOf(text) {
  const t = meaning.normalizeSpelling ? meaning.normalizeSpelling(String(text || "")) : String(text || "");
  return t.split(/[\s.,!?~"'“”‘’()·]+/).filter(Boolean);
}

function allowedKeys(texts) {
  const keys = new Set();
  const raw = new Set();
  const roots = new Map(); // 첫 음절 -> 둘째 음절 초성 집합 (활용형 비교용)
  texts.forEach((text) => {
    const compact = String(text || "").replace(/\s+/g, "");
    if (compact) raw.add(compact);
    wordsOf(text).forEach((w) => {
      const s = stem(w);
      if (s.length >= 2) {
        keys.add(key(s));
        if (!roots.has(s[0])) roots.set(s[0], new Set());
        roots.get(s[0]).add(secondInitial(s));
        // 붙여 쓴 말(여러가지, 배울수있어)도 앞뒤 조각으로 허용
        for (let i = 1; i < s.length - 1; i += 1) keys.add(key(s.slice(i)));
      }
    });
  });
  COMMON.forEach((w) => keys.add(key(stem(w))));
  return { keys, raw: Array.from(raw).join(" "), roots };
}

function evidenceTexts(input) {
  const out = [];
  const pack = (input && input.pack) || {};
  out.push(String((input && input.valueQuestion) || pack.valueQuestion || ""));
  out.push(String(pack.title || ""));
  // 활동에서 본 대상 이름(보기 라벨): "진도" → "진도아리랑"처럼 이름을 온전히 쓰는 것은 허용
  ((pack.choicePool) || []).forEach((c) => {
    const label = String((c && c.label) || "");
    if (label && !/다른|모르/.test(label)) out.push(label);
  });
  out.push(String((input && input.initialAnswer) || ""));
  ((input && input.thinkingFriendTurns) || []).forEach((turn) => {
    const a = String((turn && turn.answer) || "").trim();
    if (!a || /다른 생각|아직 잘 모르/.test(a)) return;
    out.push(a);
  });
  ((input && input.selectedChoices) || []).forEach((c) => out.push(String(c || "")));
  ((input && input.confirmedMeanings) || []).forEach((item) => {
    if (!item) return;
    if (typeof item === "string") out.push(item);
    else if (item.confirmed !== false) out.push(String(item.aiInterpretation || item.meaning || ""));
  });
  return out.filter(Boolean);
}

function unsupportedWords(summary, input) {
  const { keys, raw, roots } = allowedKeys(evidenceTexts(input));
  function conjugationOk(s) {
    // 남아요/남는, 좋아/좋은 처럼 둘째 음절이 어미인 활용형
    const set = roots.get(s[0]);
    if (!set) return false;
    const si = secondInitial(s);
    if (si === IEUNG) return Array.from(set).some((x) => ENDING_INITIALS.has(x));
    if (ENDING_INITIALS.has(si)) return set.has(IEUNG);
    return false;
  }
  const flagged = [];
  wordsOf(summary).forEach((w) => {
    const s = stem(w);
    if (s.length < 2) return;
    const core1 = String(w).replace(/[^가-힣]/g, "").replace(PARTICLE_RE, "");
    if (COMMON.indexOf(w) >= 0) return;
    if (core1.length === 1) {
      if (ONE_CHAR_OK.indexOf(core1) >= 0) return;
      if (raw.indexOf(core1) >= 0) return;
      if (flagged.indexOf(w) < 0) flagged.push(w);
      return;
    }
    if (keys.has(key(s))) return;
    if (raw.indexOf(s) >= 0) return;
    if (conjugationOk(s)) return;
    if (COMMON.indexOf(w) >= 0) return;
    if (flagged.indexOf(w) < 0) flagged.push(w);
  });
  return flagged;
}

function subjectParticleOf(word) {
  const s = String(word || "");
  const code = s.charCodeAt(s.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "예요";
  return ((code - 0xac00) % 28) ? "이에요" : "예요";
}

/** 학생 말 한 조각을 맞춤법만 다듬은 짧은 문장으로 */
function studentSentence(raw) {
  let t = (meaning.normalizeSpelling ? meaning.normalizeSpelling(String(raw || "")) : String(raw || ""))
    .replace(/[.!?~]+$/g, "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  t = t.replace(/여러가지/g, "여러 가지").replace(/([가-힣])수있/g, "$1 수 있").replace(/수있/g, "수 있");
  if (/[요다]$/.test(t)) return `${t}.`;
  if (/서$/.test(t)) return `${t} 좋아요.`;
  if (/(어|아|해|워|와|져|려|야|돼)$/.test(t)) return `${t}요.`;
  return `${t}${subjectParticleOf(t)}.`;
}

function splitSentences(text) {
  return String(text || "").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

/**
 * 근거 없는 말이 든 문장을 뺀다.
 * 단, 그 문장을 빼면 학생의 의미(meaning unit)가 사라지는 경우에는 빼지 않는다.
 * 모두 빠지면 null
 */
function dropUnsupportedSentences(summary, input, isCovered) {
  const parts = splitSentences(summary);
  const units = Array.isArray(input && input.meaningUnits) ? input.meaningUnits : [];
  const covers = (text) => units.filter((u) => (isCovered ? isCovered(text, u) : false)).length;
  const full = covers(summary);
  let kept = parts.slice();
  parts.forEach((sentence) => {
    if (unsupportedWords(sentence, input).length === 0) return;
    const without = kept.filter((x) => x !== sentence);
    if (!without.length) return;
    if (isCovered && covers(without.join(" ")) < full) {
      // 학생 의미를 잃으면 문장을 빼지 않고, 그 문장이 담던 학생 말로 바꿔 쓴다
      const lost = units.filter((u) => isCovered(sentence, u) && !isCovered(without.join(" "), u));
      const plain = lost.map((u) => studentSentence(u && u.meaning ? u.meaning : u)).filter(Boolean).join(" ");
      if (plain && unsupportedWords(plain, input).length === 0) {
        kept = kept.map((x) => (x === sentence ? plain : x));
      }
      return;
    }
    kept = without;
  });
  if (!kept.length) return null;
  return kept.join(" ");
}

module.exports = { unsupportedWords, dropUnsupportedSentences, evidenceTexts, stem, key };
