/**
 * 생각친구 2차 설계안(thinkfriend_questions_v2.docx) — 정해진 3단계 대화
 *   열기 → ① 사실적 → ② 개념적 → ③ 논쟁적·전이 → 정리(3문장) → 확인
 *
 * react():   아이 답을 받아 (1) 막힘 종류 판단 (2) 칭찬하며 따라 말하기 (3) 다음 단계 맞춤 보기 1개
 * summary(): ①②③ 답을 모아 핵심 질문의 답으로 3문장 정리 (아이 말·고른 보기만 사용)
 */
const path = require("path");
const Q = require(path.join(require("../programDir"), "assets/js/thinking-friend-questions.js"));
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

function localKind(text) {
  const t = clean(text);
  if (!t) return "unsure";
  if (UNSURE_RE.test(t) || (UNSURE_LOOSE_RE.test(t) && t.length <= 12)) return "unsure";
  if (BARE_RE.test(t)) return "bare";
  return "";
}

function bareFollow(text) {
  const t = clean(text);
  if (/재미|재밌/.test(t)) return "우와! 어떤 게 제일 재밌었어?";
  if (/예뻐|예뻤/.test(t)) return "우와! 어떤 게 제일 예뻤어?";
  if (/멋/.test(t)) return "우와! 어떤 게 제일 멋있었어?";
  if (/신기/.test(t)) return "우와! 어떤 게 제일 신기했어?";
  return "우와! 어떤 게 제일 좋았어?";
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
    echo: { type: "STRING" },
    extraChoice: { type: "STRING" }
  },
  required: ["onTopic", "echo", "extraChoice"]
};

const { guidedReactPrompts: reactPrompts, guidedSummaryPrompts } = require("./prompts");

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

  if (!picked.length) {
    const k = localKind(text);
    if (k === "unsure") return { kind: "unsure", echo: "", followUp: "괜찮아! 그럼 이 중에 골라 볼래?", extraChoice: "" };
    if (k === "bare") return { kind: "bare", echo: "", followUp: bareFollow(text), extraChoice: "" };
  }

  let out = { kind: "answer", echo: templateEcho(picked, text, stepIndex + picked.length), followUp: "", extraChoice: "" };
  if (!provider || typeof provider.generateRaw !== "function") return out;
  try {
    const { system, user } = reactPrompts(entry, stepIndex, picked, text);
    const r = await provider.generateRaw({ system, user, schema: REACT_SCHEMA, purpose: "guided-react", timeoutMs: 7000, retries: 1 });
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
async function summary(body, provider) {
  const entry = Q.get(body && body.activityId);
  const answers = Array.isArray(body && body.answers) ? body.answers : [];
  if (!entry) return { summary: "아직 잘 모르겠어요.", summarySource: "local_fallback" };
  const usable = answers.filter((a) => a && !a.skipped && answerText(a));
  const draft = Q.composeSummary(entry, answers);
  if (!usable.length) return { summary: "아직 잘 모르겠어요.", summarySource: "local_fallback" };
  if (!provider || typeof provider.generateRaw !== "function") return { summary: draft, summarySource: "template" };

  const gin = groundingInput(entry, answers, draft);
  const maxSentences = Math.max(1, usable.length) + 1;
  const tryOnce = async (forbidden) => {
    const { system, user } = summaryPrompts(entry, answers, draft, forbidden);
    const r = await provider.generateRaw({ system, user, schema: SUMMARY_SCHEMA, purpose: "guided-summary", timeoutMs: 12000, retries: 1 });
    const s = String((r && r.summary) || "").replace(/\s+/g, " ").trim();
    return s;
  };
  try {
    let s = await tryOnce(null);
    let flagged = s ? grounding.unsupportedWords(s, gin) : ["(빈 답)"];
    if (s && hasBanned(s)) flagged.push("(쓰지 않을 말)");
    if (flagged.length) {
      console.log("[ThinkFriend:guided] 정리에 아이가 하지 않은 말:", JSON.stringify(flagged), "->", s);
      s = await tryOnce(flagged.filter((w) => !/^\(/.test(w)));
      flagged = s ? grounding.unsupportedWords(s, gin) : ["(빈 답)"];
      if (s && hasBanned(s)) flagged.push("(쓰지 않을 말)");
    }
    if (s && !flagged.length && sentenceCount(s) <= maxSentences) return { summary: s, summarySource: "gemini" };
    console.log("[ThinkFriend:guided] 초안 사용:", JSON.stringify(flagged));
  } catch (err) {
    console.warn("[ThinkFriend:guided] summary 실패 -> 초안 사용:", err && err.message);
  }
  return { summary: draft, summarySource: "template" };
}

module.exports = { react, summary, localKind };
