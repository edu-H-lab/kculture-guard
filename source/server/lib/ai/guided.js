/**
 * 생각친구 2차 설계안(thinkfriend_questions_v2.docx) — 정해진 3단계 대화
 *   열기 → ① 사실적 → ② 개념적 → ③ 논쟁적·전이 → 정리(3문장) → 확인
 *
 * react():   아이 답을 받아 (1) 막힘 종류 판단 (2) 칭찬하며 따라 말하기 (3) 다음 단계 맞춤 보기 1개
 * summary(): ①②③ 답을 모아 핵심 질문의 답으로 3문장 정리 (아이 말·고른 보기만 사용)
 */
const Q = require("../../../../program/assets/js/thinking-friend-questions.js");
const grounding = require("./grounding");

const BANNED = Q.BANNED_WORDS;
const UNSURE_RE = /^(몰라|몰라요|모르겠어|모르겠어요|잘 ?모르겠어요?|모름|글쎄|글쎄요|그냥|그냥요|없어|없어요|아무거나|음+|어+)$/;
const UNSURE_LOOSE_RE = /(모르겠|몰라|생각이 안 나|생각 안 나|기억이 안 나|기억 안 나)/;
const BARE_RE = /^(너무 |정말 |진짜 |아주 )?(좋았어|좋았어요|좋아|좋아요|재밌었어|재밌었어요|재미있었어|재미있었어요|재밌어|재밌어요|예뻤어|예뻤어요|예뻐|예뻐요|멋있었어|멋있어|멋졌어|신기했어|신기해)$/;

function clean(t) {
  return String(t || "").replace(/[.!?~ㅋㅎㅠㅜ]+/g, " ").replace(/\s+/g, " ").trim();
}

function hasBanned(t) {
  return BANNED.some((w) => String(t || "").indexOf(w) >= 0);
}

// '예뻐요, 재미있어요, 예쁜 거, 다 좋아요'처럼 무엇이 어떤지 없는 막연한 느낌말
const FILLER_RE = /(너무|정말|진짜|아주|엄청|되게|완전|그냥|다|전부|모두|좀|넘|많이)/g;
const FEEL_ONLY_RE = /^((예쁘|예뻐|예쁜|예뻤|이쁘|이뻐|이쁜|이뻤|재미|재밌|좋|멋|신기|귀엽|귀여|귀여웠|웃기|웃겨|웃긴|웃겼|신나|신난|신났|최고|대박|즐거|즐겁|행복)[가-힣]{0,4}\s*(거|것|걸|게)?\s*)+$/;

function isVague(text) {
  const t = clean(text).replace(FILLER_RE, " ").replace(/\s+/g, " ").trim();
  if (!t || t.length > 14) return false;
  return BARE_RE.test(clean(text)) || FEEL_ONLY_RE.test(t);
}

function localKind(text) {
  const t = clean(text);
  if (!t) return "unsure";
  if (UNSURE_RE.test(t) || (UNSURE_LOOSE_RE.test(t) && t.length <= 12)) return "unsure";
  if (isVague(t)) return "bare";
  return "";
}

function bareFollow(text) {
  const t = clean(text);
  if (/재미|재밌|즐거|신나|신난/.test(t)) return "우와! 어떤 게 제일 재미있었어?";
  if (/예쁘|예뻐|예쁜|예뻤|이쁘|이뻐|이쁜/.test(t)) return "우와! 어떤 부분이 예뻤어?";
  if (/멋/.test(t)) return "우와! 어떤 게 제일 멋있었어?";
  if (/신기/.test(t)) return "우와! 어떤 게 제일 신기했어?";
  if (/귀엽|귀여/.test(t)) return "우와! 어떤 게 귀여웠어?";
  if (/웃기|웃겨|웃긴/.test(t)) return "하하! 어떤 게 웃겼어?";
  return "우와! 어떤 게 제일 좋았어?";
}

function usableFollowUp(q) {
  const t = String(q || "").trim();
  return t && t.length <= 40 && (t.match(/\?/g) || []).length === 1 && !hasBanned(t) && !/혹시/.test(t);
}

const PRAISE = ["멋진 생각이야!", "잘 골랐어!", "좋은 생각이야!", "그렇구나, 좋아!"];

function templateEcho(picked, text, seed) {
  const praise = PRAISE[Math.abs(Number(seed) || 0) % PRAISE.length];
  const p = (picked || []).filter(Boolean);
  if (p.length === 1 && p[0].length <= 12) return `${Q.withJosa(p[0], "을")} 골랐구나! ${praise}`;
  if (p.length > 1) return `여러 개를 골랐구나! ${praise}`;
  if (text) return `그렇구나! ${praise}`;
  return praise;
}

const REACT_SCHEMA = {
  type: "OBJECT",
  properties: {
    onTopic: { type: "BOOLEAN" },
    vague: { type: "BOOLEAN" },
    followUp: { type: "STRING" },
    echo: { type: "STRING" },
    extraChoice: { type: "STRING" }
  },
  required: ["onTopic", "vague", "followUp", "echo", "extraChoice"]
};

const { guidedReactPrompts: reactPrompts, guidedSummaryPrompts, guidedStepSentencePrompts } = require("./prompts");

/**
 * body: { activityId, stepIndex, picked:[], text:"" }
 * return: { kind: answer|unsure|bare|offtopic, echo, followUp, extraChoice }
 */
async function react(body, provider) {
  const entry = Q.get(body && body.activityId);
  if (!entry) return { kind: "answer", echo: "좋은 생각이야!", followUp: "", extraChoice: "" };
  const stepIndex = Math.max(0, Math.min(2, Number(body.stepIndex) || 0));
  const picked = Array.isArray(body.picked) ? body.picked.map((p) => String(p || "").trim()).filter(Boolean) : [];
  const text = String((body && body.text) || "").trim();

  // 이미 한 번 되물었으면(vagueAsked) 막연한 답이라도 받아들이고 넘어간다
  const vagueAsked = !!(body && body.vagueAsked);
  let localBare = false;
  if (!picked.length) {
    const k = localKind(text);
    if (k === "unsure") return { kind: "unsure", echo: "", followUp: "괜찮아! 그럼 이 중에 골라 볼래?", extraChoice: "" };
    if (k === "bare" && !vagueAsked) localBare = true;
  }

  let out = { kind: "answer", echo: templateEcho(picked, text, stepIndex + picked.length), followUp: "", extraChoice: "" };
  if (!provider || typeof provider.generateRaw !== "function") {
    if (localBare) return { kind: "bare", echo: "", followUp: bareFollow(text), extraChoice: "" };
    return out;
  }
  try {
    const { system, user } = reactPrompts(entry, stepIndex, picked, text);
    const r = await provider.generateRaw({ system, user, schema: REACT_SCHEMA, purpose: "guided-react", timeoutMs: 7000, retries: 1 });
    // 막연한 느낌말 → 구체적인 생각을 이끄는 되묻기
    if (!picked.length && !vagueAsked && (localBare || (r && r.vague === true))) {
      const fq = usableFollowUp(r && r.followUp) ? String(r.followUp).trim() : bareFollow(text);
      return { kind: "bare", echo: "", followUp: fq, extraChoice: "" };
    }
    if (r && r.onTopic === false && !picked.length) {
      const step = entry.steps[stepIndex];
      return { kind: "offtopic", echo: "", followUp: `그렇구나! 그런데 ${step.q}`, extraChoice: "" };
    }
    const echo = String((r && r.echo) || "").trim();
    if (echo && echo.length <= 40 && !hasBanned(echo) && !/\?/.test(echo)) out.echo = echo;
    const next = entry.steps[stepIndex + 1];
    const extra = clean(r && r.extraChoice);
    if (next && extra && extra.length <= 14 && !hasBanned(extra) && next.choices.indexOf(extra) < 0) {
      out.extraChoice = extra;
    }
  } catch (err) {
    console.warn("[ThinkFriend:guided] react 실패 -> 기본 칭찬 사용:", err && err.message);
    if (localBare) return { kind: "bare", echo: "", followUp: bareFollow(text), extraChoice: "" };
  }
  return out;
}

const SUMMARY_SCHEMA = {
  type: "OBJECT",
  properties: { summary: { type: "STRING" } },
  required: ["summary"]
};

function answerText(a) {
  if (!a || a.skipped) return "";
  return [((a.picked || []).filter(Boolean)).join(", "), String(a.text || "").trim()].filter(Boolean).join(" / ");
}

function summaryPrompts(entry, answers, draft, forbidden) {
  const labels = ["1문장(① 본 것·한 것)", "2문장(② 핵심 질문에 대한 답, 까닭)", "3문장(③ 내 생활·다짐)"];
  const rows = entry.steps.map((s, i) => {
    const a = answers[i];
    if (!a || a.skipped || !answerText(a)) return `${labels[i]}: (몰라서 넘어감 → 이 문장은 쓰지 않는다)`;
    return `${labels[i]}: 질문 '${s.q}' → 아이 답 '${answerText(a)}'`;
  });
  return guidedSummaryPrompts(entry, rows, draft, forbidden);
}

function groundingInput(entry, answers, draft) {
  // 허용 어휘: 아이 답 + 고른 보기 + 질문 + 핵심 질문 + 템플릿 초안(설계안 문장 틀)
  const turns = [];
  entry.steps.forEach((s, i) => {
    const a = answers[i];
    if (!a || a.skipped) return;
    turns.push({ answer: answerText(a) });
    turns.push({ answer: s.q });
  });
  turns.push({ answer: draft });
  turns.push({ answer: "뜻이라고 뜻이에요 뜻으로 거라고 그런 것 같아요 우리 집에도" });
  return { pack: { title: entry.title, choicePool: [] }, valueQuestion: entry.core, initialAnswer: "", thinkingFriendTurns: turns };
}

function sentenceCount(t) {
  return String(t || "").split(/(?<=[.!?])\s+/).filter(Boolean).length;
}

/**
 * body: { activityId, answers:[{picked, text, skipped}] }
 * return: { summary, summarySource }
 */
// ---------------------------------------------------------------------
// 정리 규칙 (설계안 5장)
//  - 단계마다 한 문장: 1문장 ① 본 것·한 것 / 2문장 ② 까닭('~라고 생각해요') / 3문장 ③ 내 생활
//  - 건너뛴 단계는 뺀다. 아이 말과 고른 보기만 쓴다. 짧고 쉬운 '~요' 문장.
// 보기만 고른 단계는 설계안 문장 틀로 바로 만들고(정확),
// 아이가 직접 쓴 말이 있는 단계만 AI가 그 단계의 문장 틀에 맞춰 한 문장으로 다듬는다.
// ---------------------------------------------------------------------
const STEP_SCHEMA = {
  type: "OBJECT",
  properties: {
    sentences: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { step: { type: "INTEGER" }, sentence: { type: "STRING" } },
        required: ["step", "sentence"]
      }
    }
  },
  required: ["sentences"]
};

const VERB_END_RE = /(서|고|려고|라고|라서|니까|해|어|아|요|다|게|지)$/;

function tidyChild(text) {
  return String(text || "").replace(/[.!?~]+$/g, "").replace(/\s+/g, " ").trim()
    .replace(/(이에요|예요|이요|요)$/, "")
    .replace(/조케/g, "좋게").replace(/조아/g, "좋아").replace(/이뻐/g, "예뻐")
    .replace(/바게잇/g, "밖에 있").replace(/이스면/g, "있으면").replace(/업어/g, "없어")
    .trim();
}

/** AI를 쓸 수 없을 때: 아이 말이 보기와 같은 모양이면 문장 틀에 넣고, 아니면 아이 말을 다듬어 쓴다 */
function fallbackSentence(step, a) {
  const t = tidyChild(a.text);
  const picked = (a.picked || []).filter(Boolean);
  const choices = step.choices || [];
  const choicesAreNouns = choices.filter((c) => !VERB_END_RE.test(c)).length >= Math.ceil(choices.length / 2);
  const textIsNoun = t.length <= 14 && !VERB_END_RE.test(t);
  const sameEnding = choices.some((c) => { const m = c.match(/(서|고|려고|라서|니까)$/); return m && t.endsWith(m[1]); });
  if (t && ((choicesAreNouns && textIsNoun) || (!choicesAreNouns && sameEnding))) {
    return Q.stepSentence(step, { picked: picked.concat([t]) });
  }
  const base = picked.length ? Q.stepSentence(step, { picked }) : "";
  const own = Q.stepSentence(step, { picked: [], text: tidyChild(a.text) || a.text });
  return base ? base : own;
}

function frameOf(step) {
  // 문장 틀을 보여 주기: {a…} 자리를 ○○ 로
  return String(step.say || "").replace(/\{a(:[^}]*)?\.?\}/g, "○○");
}

function exampleOf(step) {
  const first = (step.choices || [])[0];
  return first ? Q.stepSentence(step, { picked: [first] }) : "";
}

function sentenceOk(sentence, step, a, entry) {
  const t = String(sentence || "").replace(/\s+/g, " ").trim();
  if (!t) return false;
  if (sentenceCount(t) !== 1) return false;
  if (!/요\.$/.test(t)) return false;
  if (step.type === "concept" && !/생각해요\.$/.test(t)) return false;
  if (hasBanned(t)) return false;
  const gin = {
    pack: { title: entry.title, choicePool: [] },
    valueQuestion: entry.core,
    initialAnswer: "",
    thinkingFriendTurns: [
      { answer: answerText(a) },
      { answer: step.q },
      { answer: frameOf(step) },
      { answer: exampleOf(step) },
      { answer: "그런 거라고 생각해요 것 같아요 뜻이라고 우리 집에도" }
    ]
  };
  return grounding.unsupportedWords(t, gin).length === 0;
}

/**
 * body: { activityId, answers:[{picked, text, skipped}] }
 * return: { summary, summarySource }
 */
async function summary(body, provider) {
  const entry = Q.get(body && body.activityId);
  const answers = Array.isArray(body && body.answers) ? body.answers : [];
  if (!entry) return { summary: "아직 잘 모르겠어요.", summarySource: "local_fallback" };
  const usable = answers.filter((a) => a && !a.skipped && answerText(a));
  if (!usable.length) return { summary: "아직 잘 모르겠어요.", summarySource: "local_fallback" };

  // 1) 단계별 기본 문장 (보기 → 문장 틀, 직접 쓴 말 → 기본 다듬기)
  const lines = entry.steps.map((step, i) => {
    const a = answers[i];
    if (!a || a.skipped || !answerText(a)) return null;
    const hasText = !!String(a.text || "").trim();
    return { i, step, a, hasText, sentence: hasText ? fallbackSentence(step, a) : Q.stepSentence(step, a) };
  }).filter(Boolean);

  // 2) 직접 쓴 말이 있는 단계만 AI가 문장 틀에 맞춰 한 문장으로
  const need = lines.filter((l) => l.hasText);
  let source = "template";
  if (need.length && provider && typeof provider.generateRaw === "function") {
    try {
      const { system, user } = guidedStepSentencePrompts(entry, need.map((l) => ({
        index: l.i,
        type: l.step.type,
        question: l.step.q,
        frame: frameOf(l.step),
        example: exampleOf(l.step),
        picked: (l.a.picked || []).filter(Boolean),
        text: String(l.a.text || "").trim()
      })));
      const r = await provider.generateRaw({ system, user, schema: STEP_SCHEMA, purpose: "guided-summary", timeoutMs: 12000, retries: 1 });
      const got = {};
      ((r && r.sentences) || []).forEach((x) => { if (x && Number.isFinite(Number(x.step))) got[Number(x.step)] = String(x.sentence || "").replace(/\s+/g, " ").trim(); });
      let used = 0;
      need.forEach((l) => {
        const cand = got[l.i];
        if (cand && sentenceOk(cand, l.step, l.a, entry)) { l.sentence = cand; used += 1; }
        else console.log("[ThinkFriend:guided] 문장 틀에 안 맞아 기본 문장 사용:", l.i, JSON.stringify(cand || ""));
      });
      if (used) source = used === need.length ? "gemini" : "gemini_partial";
    } catch (err) {
      console.warn("[ThinkFriend:guided] summary 실패 -> 기본 문장 사용:", err && err.message);
    }
  }
  const text = lines.map((l) => l.sentence).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return { summary: text || "아직 잘 모르겠어요.", summarySource: source };
}

module.exports = { react, summary, localKind };
