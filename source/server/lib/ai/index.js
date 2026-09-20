const mockProvider = require("./mockProvider");
const openaiProvider = require("./openaiProvider");
const geminiProvider = require("./geminiProvider");
const meaning = require("./meaning");
const metrics = require("./metrics");
const { sanitizeSummary, needsFormalPolish } = require("./sanitizeSummary");
const sufficiency = require("./sufficiency");
const grounding = require("./grounding");

function providerName() {
  const raw = String(process.env.THINKING_FRIEND_PROVIDER || "mock").trim().toLowerCase();
  if (raw === "openai" || raw === "gpt") return "openai";
  if (raw === "gemini" || raw === "google") return "gemini";
  return "mock";
}

function selectProvider(name) {
  if (name === "openai") return openaiProvider;
  if (name === "gemini") return geminiProvider;
  return mockProvider;
}

function copiedExample(message, pack) {
  const compact = (text) => String(text || "").replace(/[\s.?!~]/g, "");
  const msg = compact(message);
  if (!msg) return true;
  const examples = Object.values((pack && pack.followUpExamples) || {});
  return examples.some((ex) => compact(ex) === msg);
}

function tooGeneric(message) {
  const t = String(message || "").replace(/[\s.?!~]/g, "");
  if (/골라볼까|오늘본것중/.test(t)) return true;
  return /^(왜그렇게생각했어|왜그렇게생각해요|왜요|이유가뭐야|왜그렇게느꼈어)$/.test(t);
}

function hanokLeak(message, pack) {
  if (!pack || pack.id === "2-2" || pack.activityKey === "hanok") return false;
  return /마루|온돌|창호지/.test(String(message || ""));
}

function compactAsk(text) {
  return String(text || "").replace(/[\s.?!~]/g, "");
}

function repeatedAsk(message, turns) {
  const msg = compactAsk(message);
  if (!msg) return true;
  return ((turns) || []).some((turn) => compactAsk(turn && turn.question) === msg);
}

function leadingOrLong(message) {
  const m = String(message || "");
  if ((m.match(/\?/g) || []).length > 1) return true;
  if (m.length > 55) return true;
  if (/혹시|서일까\?|때문일까\?|거지\?|잖아\?/.test(m)) return true;
  return false;
}

function usableAsk(message, pack, turns) {
  return Boolean(message)
    && !leadingOrLong(message)
    && !copiedExample(message, pack)
    && !tooGeneric(message)
    && !hanokLeak(message, pack)
    && !repeatedAsk(message, turns);
}

function fillAsk(decided, input) {
  const pack = (input && input.pack) || {};
  const turns = (input && input.previousTurns) || [];
  if (decided && usableAsk(decided.message, pack, turns)) return decided;
  const used = turns.map((turn) => String((turn && turn.strategy) || "")).filter(Boolean);
  let strategy = (decided && decided.strategy) || "clarify";
  const alts = ["reason", "clarify", "expand", "compare", "apply", "value", "create"];
  const candidates = [strategy].concat(alts.filter((item) => item !== strategy && used.indexOf(item) < 0));
  let message = "";
  let picked = strategy;
  candidates.some((item) => {
    const next = mockProvider.makeQuestion(item, pack, meaning.currentAnswer(input || {}));
    if (usableAsk(next, pack, turns)) {
      message = next;
      picked = item;
      return true;
    }
    return false;
  });
  return {
    ...decided,
    strategy: picked,
    message: message || mockProvider.makeQuestion(picked, pack, meaning.currentAnswer(input || {}))
  };
}

function logDevTurn(input, result) {
  const pack = (input && input.pack) || {};
  const spoken = meaning.spokenMeaning(
    (input && input.initialAnswer) || "",
    (input && input.previousTurns) || []
  );
  const latest = meaning.currentAnswer(input || {});
  if (latest && spoken.indexOf(meaning.normalizeSpelling(latest)) < 0 && !meaning.isUnsureText(latest)) {
    spoken.push(latest);
  }
  console.log("[ThinkFriend:dev]", JSON.stringify({
    activityId: pack.id || "",
    answerState: result.answerState,
    strategy: result.strategy,
    thinkingStep: result.thinkingStep || meaning.nextThinkingStep(pack, spoken),
    previousStrategies: result.previousStrategies || ((input && input.previousTurns) || []).map((turn) => turn && turn.strategy).filter(Boolean),
    action: result.action,
    choiceCount: Array.isArray(result.choices) ? result.choices.length : 0,
    finish: !!result.finish
  }));
}

function tooGrand(text) {
  return /영속성|정체성|계승|불굴|민족의/.test(String(text || ""));
}

function usableMeaningCheck(result, pack) {
  if (!result || !result.message || !Array.isArray(result.choices) || result.choices.length < 2) return false;
  if (tooGeneric(result.message) || hanokLeak(result.message, pack) || tooGrand(result.message)) return false;
  if (result.choices.some((item) => tooGrand(item && item.label))) return false;
  return true;
}

async function fillMeaningCheck(decided, input) {
  const pack = (input && input.pack) || {};
  const latest = meaning.currentAnswer(input || {});
  const fallback = {
    ...decided,
    action: "SHOW_CHOICES",
    strategy: "meaning-check",
    finish: false,
    message: meaning.meaningCheckQuestion(pack, latest),
    choices: meaning.mockMeaningChoices(pack, latest)
  };
  const name = providerName();
  if (name === "mock") return fallback;
  if (name === "gemini") console.log("[ThinkFriend] provider=gemini");
  try {
    const result = await selectProvider(name).completeTurn(Object.assign({}, input, {
      mode: "meaning-check",
      strategy: "meaning-check"
    }));
    if (usableMeaningCheck(result, pack)) {
      const cleaned = [];
      (result.choices || []).forEach((c) => {
        const label = String((c && c.label) || "").trim();
        if (!label || /다른 (이유|느낌|생각)/.test(label)) return;
        if (cleaned.some((x) => x.label === label)) return;
        cleaned.push({ label, value: String((c && c.value) || label) });
      });
      // 보기는 3개 + '다른 생각이 있어'. 모자라면 활동별 기본 보기로 채운다
      if (cleaned.length < 3) {
        meaning.mockMeaningChoices(pack, latest).forEach((c) => {
          if (cleaned.length >= 3 || /다른 생각/.test(c.label)) return;
          if (cleaned.some((x) => x.label === c.label)) return;
          cleaned.push({ label: c.label, value: c.value });
        });
      }
      result.choices = cleaned.slice(0, 3).concat([{ label: "다른 생각이 있어", value: "other" }]);
      return {
        ...decided,
        action: "SHOW_CHOICES",
        strategy: "meaning-check",
        finish: false,
        message: leadingOrLong(result.message) ? meaning.meaningCheckQuestion(pack, latest) : result.message,
        choices: result.choices
      };
    }
    metrics.noteFallback();
  } catch (err) {
    metrics.noteFallback();
    if (name === "gemini") console.warn("[ThinkFriend] Gemini failed -> fallback to mock");
    else console.warn("[ThinkFriend] meaning-check failed, using mock:", err && err.message);
  }
  return fallback;
}

function logTurnTiming(result) {
  metrics.finish({
    action: result && result.action,
    answerState: result && result.answerState,
    strategy: result && result.strategy,
    finish: !!(result && result.finish)
  });
}

// ---------------- 말투·대체 질문 ----------------
function toBanmal(message) {
  let m = String(message || "").trim();
  m = m
    .replace(/드나요\?/g, "들어?")
    .replace(/되나요\?/g, "돼?")
    .replace(/([었았였했있없])나요\?/g, "$1어?")
    .replace(/([었았였했있없])니\?/g, "$1어?")
    .replace(/인가요\?/g, "야?")
    .replace(/(이|에|예)요\?/g, "야?")
    .replace(/까요\?/g, "까?")
    .replace(/래요\?/g, "래?")
    .replace(/([아어워해와봐줘])요\?/g, "$1?")
    .replace(/주세요/g, "줘")
    .replace(/말해 줄 수 있니\?/g, "말해 줄래?");
  return m;
}

function hasJondaetmal(message) {
  return /(나요|인가요|까요|세요|습니까|니까요)\?/.test(String(message || "")) || /[가-힣]요\?$/.test(String(message || ""));
}

function objectParticleOf(word) {
  const s = String(word || "");
  const code = s.charCodeAt(s.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "를";
  return ((code - 0xac00) % 28) ? "을" : "를";
}

function topicWord(input) {
  const texts = [String((input && input.initialAnswer) || "")]
    .concat(((input && input.previousTurns) || []).map((t) => String((t && t.answer) || "")));
  for (const raw of texts) {
    let t = raw.replace(/[.!?~]+/g, " ").replace(/\s+/g, " ").trim().replace(/(이에요|예요|이요|요)$/, "").trim();
    if (!t || sufficiency.isUnsure(t)) continue;
    const words = t.split(" ");
    if (words.length > 2 || t.length > 8) continue;
    if (/(어|아|서|해|다|니까|워|뻐|져|고|게|면)$/.test(t)) continue;
    return t;
  }
  return "";
}

function fallbackQuestion(input, ev) {
  const pack = (input && input.pack) || {};
  const turns = (input && input.previousTurns) || [];
  const ex = pack.followUpExamples || {};
  const topic = topicWord(input);
  let list = [];
  if (ev.missing === "what") {
    list = [ex.recall, "오늘 활동에서 가장 기억나는 걸 하나 말해 줄래?", ex.clarify];
  } else if (ev.missing === "why") {
    list = [
      topic ? `왜 ${topic}${objectParticleOf(topic)} 골랐어?` : "",
      ex.reason,
      topic ? `${topic}의 어떤 점이 좋았어?` : "",
      ex.clarify,
      "왜 그렇게 생각했는지 하나만 말해 줄래?"
    ];
  } else if (ev.missing === "why_detail") {
    list = [
      topic ? `${topic}의 어떤 모습이 가장 좋았어?` : "",
      ex.clarify,
      ex.reason,
      "어떤 점이 가장 마음에 들었어?",
      "그렇게 생각한 까닭을 하나만 더 말해 줄래?"
    ];
  } else {
    list = [ex.apply, ex.transfer, ex.compare, ex.reason, ex.clarify];
  }
  const asked = turns.map((t) => compactAsk(t && t.question));
  const pick = list.filter(Boolean).find((q) => asked.indexOf(compactAsk(q)) < 0 && !hanokLeak(q, pack) && !/몰라/.test(q));
  return pick || "오늘 활동에서 무엇이 가장 기억나?";
}

function finishFrom(ev) {
  if (ev.hasWhat) {
    return { answerState: "DEEP_ENOUGH", action: "FINISH", strategy: "finish", message: "", choices: [], finish: true };
  }
  return {
    answerState: "NEED_RECALL",
    action: "FINISH",
    strategy: "unsure",
    message: "",
    choices: [],
    finish: true,
    summary: "아직 잘 모르겠어요."
  };
}

function askWith(decided, strategy, message, ev, extra) {
  return {
    ...decided,
    answerState: ev.missing === "what" ? "NEED_CLARIFY" : "NEED_REASON",
    action: "ASK",
    strategy,
    message,
    choices: [],
    finish: false,
    ...(extra || {})
  };
}

function strategyForMissing(missing) {
  if (missing === "what") return "clarify";
  if (missing === "why") return "reason";
  if (missing === "why_detail") return "clarify";
  return "expand";
}

/** Gemini에게 판정 + 다음 질문을 한 번에 받는다. 실패하면 null */
async function geminiJudgeAsk(payload) {
  const name = providerName();
  if (name === "mock") return null;
  try {
    const result = await selectProvider(name).completeTurn(payload);
    if (!result) return null;
    let message = toBanmal(result.message || "");
    const usable = message && usableAsk(message, payload.pack, payload.previousTurns) && message.length <= 60;
    return {
      covers: typeof result.coversValueQuestion === "boolean" ? result.coversValueQuestion : null,
      level: result.studentLevel,
      missing: result.missing || "",
      strategy: result.strategy || "",
      message: usable ? message : ""
    };
  } catch (err) {
    metrics.noteFallback();
    console.warn("[ThinkFriend] Gemini 판정/질문 실패 -> 대체 질문 사용:", err && err.message);
    return null;
  }
}

async function completeTurn(input) {
  const ctx = metrics.begin("turn", { activityId: (input && input.pack && input.pack.id) || "" });
  return metrics.run(ctx, async () => {
    const buildStart = Date.now();
    const pack = (input && input.pack) || {};
    const spoken = meaning.spokenMeaning((input && input.initialAnswer) || "", (input && input.previousTurns) || []);
    const thinkingStep = meaning.nextThinkingStep(pack, spoken);
    const payload = Object.assign({}, input, { thinkingStep });
    const decided = meaning.decideTurn(payload || {});
    const ev = sufficiency.evaluate(payload);
    payload.targetHint = sufficiency.missingHint(ev.missing);
    ctx.t_build_context = Date.now() - buildStart;

    const done = (result, why) => {
      const out = { ...result, judge: { ...ev, rule: why } };
      logDevTurn(payload, out);
      console.log("[ThinkFriend:judge]", JSON.stringify({ rule: why, enough: ev.enough, missing: ev.missing, levels: ev.levels, support: ev.supportCount, unsureStreak: ev.unsureStreak, action: out.action }));
      logTurnTiming(out);
      return out;
    };

    // 0) 음성 인식 확인 턴은 그대로
    if (decided.strategy === "confirm" && decided.action === "SHOW_CHOICES") return done(decided, "stt_confirm");

    // 1) 최대 횟수 / 막힘 종료
    if (ev.maxReached) return done(finishFrom(ev), "max_followups");
    if (ev.stallFinish) return done(finishFrom(ev), "stall_after_unsure");

    // 2) 아무 내용이 없을 때: 기존 보기(recall/final-support) 흐름 유지
    if (!ev.hasWhat && decided.action === "SHOW_CHOICES" && /^(recall|final-support)$/.test(String(decided.strategy || ""))) {
      return done(decided, "recall_choices");
    }

    // 3) 코드 기준 충분(학생이 자기 말로 대상 + 이유를 말함) -> 끝낸다
    const askedNothingYet = ev.supportCount === 0;
    if (ev.enough && !(askedNothingYet && ev.maxLevel < 3)) return done(finishFrom(ev), "enough_" + ev.enoughReason);
    if (ev.enough && askedNothingYet) {
      // 처음 답이 이미 충분해도 한 번은 생각을 이어 가게 한다 (생활·비교·까닭 중 하나)
      const g0 = await geminiJudgeAsk({ ...payload, targetHint: "학생이 무엇과 이유를 이미 말했다. 그 생각을 한 걸음만 더 이어 가는 질문을 한다(우리 생활·오늘날과 연결, 또는 조금 더 구체적으로). 답을 암시하지 않는다." });
      const msg0 = (g0 && g0.message) || fallbackQuestion(payload, { ...ev, missing: "" });
      return done(askWith(decided, (g0 && g0.strategy) || "expand", msg0, ev), "one_more_step");
    }

    // 4) 아직 부족: 막혔을 때만 '보기' 발판 (한 번만)
    const allowScaffold = ev.hasWhat && !ev.usedMeaningCheck && !ev.strongWhy
      && ((ev.latestUnsure && ev.whyAttempts >= 1) || ev.whyAttempts >= 2);
    if (allowScaffold) {
      const scaffold = await fillMeaningCheck({ ...decided, strategy: "meaning-check", action: "SHOW_CHOICES" }, payload);
      return done({ ...scaffold, message: toBanmal(scaffold.message) }, "scaffold_choices");
    }
    if (!ev.hasWhat && ev.latestUnsure && decided.action === "SHOW_CHOICES") return done(decided, "recall_choices");

    // 5) 빠진 요소를 묻는 질문
    const g = await geminiJudgeAsk(payload);
    const strategy = (g && g.strategy) || strategyForMissing(ev.missing);
    const message = (g && g.message) || fallbackQuestion(payload, ev);
    if (!g || !g.message) metrics.noteFallback();
    return done(askWith(decided, strategy, message, ev), g && g.message ? "ask_gemini" : "ask_fallback");
  });
}

function keepSummaryTurn(turn, pack) {
  const answer = String((turn && turn.answer) || "").trim();
  if (!answer || meaning.isUnsureText(answer)) return false;
  const source = meaning.sourceOfTurn(turn);
  const strategy = String((turn && turn.strategy) || "");
  if (source === "confirmed_meaning" || /^(meaning-check|interpret|confirm|confirmed)$/.test(strategy)) return true;
  if (source === "free_response" && answer.length >= 2) return true;
  if (source === "choice" && answer.length >= 2) return true;
  return meaning.keepForSummary(answer, pack, []);
}

function filteredSummaryInput(input) {
  const pack = (input && input.pack) || {};
  const initial = String((input && input.initialAnswer) || "").trim();
  return {
    ...input,
    valueQuestion: String((input && input.valueQuestion) || (pack && pack.valueQuestion) || ""),
    initialAnswer: meaning.isUnsureText(initial) ? "" : initial,
    selectedChoices: Array.isArray(input && input.selectedChoices) ? input.selectedChoices : [],
    confirmedMeanings: Array.isArray(input && input.confirmedMeanings) ? input.confirmedMeanings : [],
    thinkingFriendTurns: ((input && input.thinkingFriendTurns) || []).map((turn) => {
      const answer = meaning.resolvedTurnAnswer(turn) || String((turn && turn.answer) || "").trim();
      return {
        ...turn,
        question: String((turn && turn.question) || "").trim(),
        answer,
        source: meaning.sourceOfTurn(turn)
      };
    }).filter((turn) => keepSummaryTurn(turn, pack))
  };
}

function missingMeaningUnits(summary, units) {
  return (units || []).filter((unit) => !meaning.unitCovered(summary, unit));
}

function applySummaryPolish(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  if (needsFormalPolish(raw)) return meaning.polishLanguage(raw);
  return raw;
}

function withFaithfulSummary(input, result, units, preferredSource) {
  const raw = String((result && result.summary) || "").trim();
  const cleaned = applySummaryPolish(sanitizeSummary(raw, { ...input, meaningUnits: units }));
  const missing = missingMeaningUnits(cleaned || raw, units);
  if (missing.length) {
    console.log("[ThinkFriend:timing]", JSON.stringify({
      kind: "summary_coverage",
      covered: false,
      missingMeanings: missing.map((unit) => String((unit && unit.meaning) || unit || "")),
      keptGemini: !!cleaned
    }));
  }
  if (cleaned) {
    return { summary: cleaned, summarySource: preferredSource || "gemini" };
  }
  const composed = meaning.polishLanguage(meaning.composeFromMeaningUnits(input && input.pack, units));
  return { summary: composed, summarySource: "local_fallback" };
}

function logSummaryDebug(payload, units, finalSummary, summarySource) {
  console.log("[ThinkFriend:dev] summary", JSON.stringify({
    valueQuestion: payload.valueQuestion,
    initialAnswer: payload.initialAnswer,
    thinkingFriendTurns: payload.thinkingFriendTurns,
    selectedChoices: payload.selectedChoices,
    confirmedMeanings: payload.confirmedMeanings,
    meaningUnits: units,
    finalSummary: finalSummary || "",
    summarySource: summarySource || ""
  }));
}

function logSummarySource(summarySource) {
  const source = String(summarySource || "");
  console.log("[ThinkFriend:timing] summarySource=" + source);
}

function finishSummaryTiming(out) {
  logSummarySource(out && out.summarySource);
  metrics.finish({
    action: "FINISH",
    answerState: "DEEP_ENOUGH",
    strategy: "summary",
    finish: true,
    summarySource: (out && out.summarySource) || ""
  });
}

async function completeSummary(input) {
  const ctx = metrics.begin("summary", { activityId: (input && input.pack && input.pack.id) || "" });
  return metrics.run(ctx, async () => {
    const raw = input || {};
    const buildStart = Date.now();
    const filtered = filteredSummaryInput(raw);
    const units = meaning.collectMeaningUnits({
      pack: filtered.pack,
      valueQuestion: filtered.valueQuestion,
      initialAnswer: filtered.initialAnswer || raw.initialAnswer,
      thinkingFriendTurns: (filtered.thinkingFriendTurns && filtered.thinkingFriendTurns.length)
        ? filtered.thinkingFriendTurns
        : (raw.thinkingFriendTurns || []),
      selectedChoices: filtered.selectedChoices,
      confirmedMeanings: raw.confirmedMeanings || filtered.confirmedMeanings
    });
    const payload = {
      ...filtered,
      meaningUnits: units,
      confirmedMeanings: raw.confirmedMeanings || filtered.confirmedMeanings
    };
    ctx.t_build_context = Date.now() - buildStart;

    if (!units.length) {
      const out = { summary: "아직 잘 모르겠어요.", summarySource: "local_fallback" };
      metrics.noteFallback();
      logSummaryDebug(payload, units, out.summary, out.summarySource);
      finishSummaryTiming(out);
      return out;
    }

    const name = providerName();
    if (name === "mock") {
      const out = {
        summary: meaning.polishLanguage(meaning.composeFromMeaningUnits(filtered.pack, units)),
        summarySource: "mock"
      };
      logSummaryDebug(payload, units, out.summary, out.summarySource);
      finishSummaryTiming(out);
      return out;
    }

    if (name === "gemini") console.log("[ThinkFriend] provider=gemini");
    try {
      const provider = selectProvider(name);
      let result = await provider.completeSummary(payload);
      const parseStart = Date.now();
      let out = withFaithfulSummary(payload, result, units, "gemini");
      // 학생이 하지 않은 말 검사 -> 한 번 다시 쓰게 하기 -> 그래도 있으면 그 문장 빼기
      let flagged = out.summarySource === "gemini" ? grounding.unsupportedWords(out.summary, payload) : [];
      if (flagged.length) {
        console.log("[ThinkFriend:grounding] 학생이 하지 않은 말:", JSON.stringify(flagged), "->", out.summary);
        try {
          const retry = await provider.completeSummary({ ...payload, forbiddenWords: flagged });
          const out2 = withFaithfulSummary(payload, retry, units, "gemini");
          const flagged2 = out2.summarySource === "gemini" ? grounding.unsupportedWords(out2.summary, payload) : flagged;
          if (flagged2.length <= flagged.length) { out = out2; flagged = flagged2; }
        } catch (_) {}
        if (flagged.length) {
          try {
            const retry2 = await provider.completeSummary({ ...payload, forbiddenWords: flagged, strictStudentWords: true });
            const out3 = withFaithfulSummary(payload, retry2, units, "gemini");
            const flagged3 = out3.summarySource === "gemini" ? grounding.unsupportedWords(out3.summary, payload) : flagged;
            if (flagged3.length < flagged.length || (flagged3.length === flagged.length && flagged3.length === 0)) { out = out3; flagged = flagged3; }
          } catch (_) {}
        }
        if (flagged.length) {
          const trimmed = grounding.dropUnsupportedSentences(out.summary, payload, (text, unit) => meaning.unitCovered(text, unit) || meaning.unitCovered(String(text).replace(/\s+/g, ""), unit));
          if (trimmed) out = { summary: trimmed, summarySource: "gemini_trimmed" };
          console.log("[ThinkFriend:grounding] 남은 말:", JSON.stringify(flagged), "->", out.summary);
        }
      }
      metrics.addParse(Date.now() - parseStart);
      if (!/^gemini/.test(out.summarySource)) metrics.noteFallback();
      logSummaryDebug(payload, units, out.summary, out.summarySource);
      finishSummaryTiming(out);
      return out;
    } catch (err) {
      metrics.noteFallback();
      if (name === "gemini") console.warn("[ThinkFriend] Gemini failed -> fallback to mock");
      else console.warn("[ThinkFriend] summary provider failed, using mock:", err && err.message);
      const out = {
        summary: meaning.polishLanguage(meaning.composeFromMeaningUnits(filtered.pack, units)),
        summarySource: "local_fallback"
      };
      logSummaryDebug(payload, units, out.summary, out.summarySource);
      finishSummaryTiming(out);
      return out;
    }
  });
}

module.exports = {
  providerName,
  completeTurn,
  completeSummary
};
