/**
 * ThinkFriend 공통 엔진
 *
 * UI는 thinking-friend-panel.js / value-reflection-flow.js 가 담당한다.
 * 이 파일은 답변 상태 판단과 다음 질문/정리문만 만든다.
 *
 * 현재: mockAnalyzeAnswer / getMockThinkFriendResponse / buildFinalSummary
 * 나중에: window.ThinkFriendProvider.complete(session) 로 GPT/Gemini 교체
 */
(function () {
  "use strict";

  const MAX_FOLLOWUPS = 5;

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

  const ACTION = {
    SHOW_CHOICES: "SHOW_CHOICES",
    ASK: "ASK",
    FINISH: "FINISH"
  };

  function logTiming(payload) {
    try {
      console.log("[ThinkFriend:timing]", JSON.stringify(payload || {}));
    } catch (_) {}
  }

  const FILLER_RE = /^(음+|어+|그냥(요)?|없음|아직|글쎄요?|모르(?:겠)?어요?|몰라요?|잘 모르겠어(?:요)?|아무거나(요)?|모름)$/;
  const UNSURE_RE = /아직\s*잘\s*모르|나중에 다시/;
  const UNKNOWN_RE = /(잘 모르겠|모르겠어|몰라요|모름|글쎄요|생각(?:이)? 안 나)/;
  const ABSTRACT_RE = /^(진짜 |너무 |아주 |정말 )?(그냥\s*)?(좋아요|예뻐요|재미있어요|재밌어요|신기해요|멋있어요|예뻐|재미있어|신기해|멋있어)[.!~]*$/;
  const REASON_RE = /(때문|그래서|왜냐|니까|이라서|해서|여서|라서|같아서|싶어서|좋아서)/;
  const EXPAND_RE = /(쓰면|쓰고|넣고|입고|이어|달라|비교|우리\s*집|오늘날|친구에게|소개|옆에|거실|교실)/;
  const PLACE_RE = /(옆|거실|방|마당|교실|집|어디)/;
  const PRETTY_RE = /(예쁘|이쁘|예뻐|이뻐|아름답)/;
  const COLOR_RE = /(분홍|빨강|빨간|주황|노란|노랑|초록|파란|보라|하얀|흰|검정|검은|색)/;
  const FEATURE_HINTS = {
    "마루": "여름에 시원해요",
    "온돌": "바닥이 따뜻해요",
    "창호지": "빛이 들어와요"
  };

  function getPack(activityId) {
    const T = window.ThinkingFriendActivities;
    if (T && typeof T.get === "function") return T.get(activityId);
    return null;
  }

  function normalizeSpelling(text) {
    let t = String(text || "").replace(/\s+/g, " ").trim();
    const pairs = [
      [/조아(요|서|해|하)/g, "좋아$1"],
      [/조아/g, "좋아"],
      [/이뻐(요|서|해)/g, "예뻐$1"],
      [/이쁘/g, "예쁘"],
      [/이쁜/g, "예쁜"],
      [/제미있/g, "재미있"],
      [/쉬원/g, "시원"]
    ];
    pairs.forEach((pair) => {
      t = t.replace(pair[0], pair[1]);
    });
    return t;
  }

  function isYes(text) {
    return /^(맞아요|맞아|네|응)$/.test(String(text || "").trim().replace(/[.!~]+$/g, ""));
  }

  function isNo(text) {
    return /^(아니에요|아니야|아니요|아니)$/.test(String(text || "").trim().replace(/[.!~]+$/g, ""));
  }

  function isRetry(text) {
    return /다시 말/.test(String(text || "").trim());
  }

  function extractGuess(question) {
    const q = String(question || "").trim();
    const m = q.match(/^(.+?)(?:다는|라는|이라는) 뜻이야/);
    if (!m) return "";
    let guess = m[1].replace(/^(그럼 |혹시 |그러면 )/g, "").trim();
    guess = guess.replace(/좋다$/, "좋아요");
    if (guess && !/[요다]$/.test(guess)) guess += "요";
    return guess;
  }

  function detectConfirm(text, pack) {
    const raw = String(text || "").trim();
    if (!raw || isUnknownText(raw) || isYes(raw) || isNo(raw) || isRetry(raw)) return null;
    const n = normalizeSpelling(raw);
    const words = n.split(/\s+/).filter(Boolean);
    const hanokLike = pack && (pack.id === "2-2" || /마루|한옥/.test(String((pack.title || "") + raw)));
    if (hanokLike && /쉬워서|쉬워/.test(n) && /마루|집|한옥/.test(n + String(pack && pack.title || ""))) {
      return {
        message: /마루/.test(n) ? "마루가 시원해서 좋다는 뜻이야?" : "시원해서 좋다는 뜻이야?",
        choices: [
          { label: "맞아요", value: "yes" },
          { label: "아니에요", value: "no" },
          { label: "다시 말할래요", value: "retry" }
        ]
      };
    }
    if (/마루/.test(n) && /겨울/.test(n) && /시원|쉬원|쉬워/.test(raw) && /집/.test(n)) {
      return {
        message: "겨울에 시원해서 좋다는 뜻이야, 아니면 여름에 시원해서 좋다는 뜻이야?",
        choices: [
          { label: "여름에 시원해서요", value: "summer" },
          { label: "겨울에 시원해서요", value: "winter" },
          { label: "다시 말할래요", value: "retry" }
        ]
      };
    }
    if (words.length >= 3 && n.length <= 20 && !/[은는이가을를에서요까]/.test(n)) {
      return {
        message: "방금 말이 두 가지로 들렸어. 어떤 뜻이야?",
        choices: [
          { label: "맞아요", value: "yes" },
          { label: "아니에요", value: "no" },
          { label: "다시 말할래요", value: "retry" }
        ]
      };
    }
    return null;
  }

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
    const t = String(text || "").trim().replace(/[.!~]+$/g, "");
    if (!t) return true;
    if (FILLER_RE.test(t)) return true;
    if (t.length <= 14 && UNKNOWN_RE.test(t)) return true;
    if (UNSURE_RE.test(t)) return true;
    return false;
  }

  function isUnsureText(text) {
    const t = String(text || "").trim().replace(/[.!~]+$/g, "");
    if (!t) return false;
    if (UNSURE_RE.test(t)) return true;
    return /^(잘\s*)?모르(겠)?어요?$|^몰라요?$|^모름$/.test(t);
  }

  function isGibberish(text) {
    const t = String(text || "").trim();
    return /^(.)\1{3,}$/.test(t) || /^[.?!,~\s]+$/.test(t) || (koreanRatio(t) < 0.3 && t.length >= 2);
  }

  function isAbstractOnly(text) {
    const t = String(text || "").trim().replace(/[.!~]+$/g, "");
    if (REASON_RE.test(t)) return false;
    if (ABSTRACT_RE.test(t)) return true;
    return t.length <= 8 && /^(좋|예뻐|재미|재밌|신기|멋있)/.test(t);
  }

  function isWeakText(text) {
    if (isUnknownText(text)) return true;
    if (isGibberish(text)) return true;
    if (isAbstractOnly(text)) return true;
    return false;
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

  function compact(text) {
    return String(text || "").replace(/\s+/g, "");
  }

  function looksLikeChoice(text, pack) {
    const t = String(text || "").trim().replace(/[요.!~]+$/g, "");
    if (!t) return false;
    return packLabels(pack).some((label) => t === label || compact(t) === compact(label) || t.indexOf(label) >= 0);
  }

  function mentionsPack(text, pack) {
    const t = compact(text);
    if (!t) return false;
    const core = t.replace(/요$/, "");
    return packKeywords(pack).some((kw) => {
      const k = compact(kw);
      return k.length >= 2 && (t.indexOf(k) >= 0 || k.indexOf(core) >= 0);
    });
  }

  function isOffTopic(text, pack, history) {
    if (!pack || !pack.id) return isGibberish(text);
    if (isAbstractOnly(text)) return false;
    if (looksLikeChoice(text, pack) || mentionsPack(text, pack)) return false;
    if (REASON_RE.test(text) || PLACE_RE.test(text) || EXPAND_RE.test(text)) return false;
    const hasTopicHistory = (history || []).some((item) => mentionsPack(item, pack) || looksLikeChoice(item, pack));
    if (hasTopicHistory && !isGibberish(text)) return false;
    if (isGibberish(text)) return true;
    return false;
  }

  function isMeaningfulThought(text, pack, history) {
    const t = normalizeSpelling(text);
    if (isYes(t) || isNo(t) || isRetry(t)) return false;
    if (isWeakText(t) && !(REASON_RE.test(t) || PLACE_RE.test(t) || EXPAND_RE.test(t))) return false;
    if (isUnsureText(t)) return false;
    if (REASON_RE.test(t) || PLACE_RE.test(t) || EXPAND_RE.test(t) || looksLikeChoice(t, pack) || mentionsPack(t, pack)) return true;
    const state = mockAnalyzeAnswer(t, { pack, history: history || [] });
    return state !== STATE.NEED_RECALL && state !== STATE.OFF_TOPIC_OR_UNCLEAR;
  }

  function meaningfulAnswers(session, pack) {
    const bits = [];
    const history = [];
    const first = String((session && session.initialAnswer) || "").trim();
    if (first && !isUnsureText(first) && (isMeaningfulThought(first, pack, []) || ABSTRACT_RE.test(first.replace(/[.!~]+$/g, "")) || PRETTY_RE.test(first) || COLOR_RE.test(first))) {
      bits.push(first);
      history.push(first);
    }
    ((session && session.thinkingFriendTurns) || []).forEach((turn) => {
      let a = String((turn && turn.answer) || "").trim();
      if ((turn.strategy === "confirm" || turn.strategy === "confirmed") && isYes(a)) {
        a = extractGuess(turn.question) || a;
      }
      if (isYes(a) || isNo(a) || isRetry(a)) return;
      if (a && !isUnsureText(a) && bits.indexOf(a) === -1 && (isMeaningfulThought(a, pack, history) || ABSTRACT_RE.test(a.replace(/[.!~]+$/g, "")) || PRETTY_RE.test(a) || COLOR_RE.test(a))) {
        bits.push(a);
        history.push(a);
      }
    });
    return bits;
  }

  function hasEnoughForSummary(session, pack) {
    const bits = meaningfulAnswers(session, pack);
    if (!bits.length) return false;
    if (bits.some((item) => mockAnalyzeAnswer(item, { pack, history: bits }) === STATE.DEEP_ENOUGH)) return true;
    if (bits.length >= 2 && bits.some((item) => REASON_RE.test(item) || item.trim().length >= 12)) return true;
    if (bits.length === 1 && (REASON_RE.test(bits[0]) || bits[0].trim().length >= 12) && bits[0].trim().length >= 12) return true;
    return false;
  }

  function supportChoices(pack) {
    const pool = (pack && pack.choicePool) || [];
    const rest = pool.filter((item) => !/other|다른|모르겠|unsure/i.test(String(item.value || item.label || "")));
    const take = rest.slice(0, 3).map((item) => ({
      label: String(item.label || item.value || ""),
      value: String(item.value || item.label || ""),
      hint: FEATURE_HINTS[String(item.label || "")] || ""
    }));
    take.push({ label: "아직 잘 모르겠어요", value: "unsure" });
    return take.slice(0, 4);
  }

  function isNounLike(text) {
    const t = String(text || "").trim().replace(/[.!~]+$/g, "");
    const words = tokens(t);
    return words.length <= 2 && t.length <= 10 && !ABSTRACT_RE.test(t);
  }

  function mockAnalyzeAnswer(text, ctx) {
    ctx = ctx || {};
    const t = normalizeSpelling(String(text || "").trim());
    if (!t || isUnknownText(t)) return STATE.NEED_RECALL;
    if (isGibberish(t) || isOffTopic(t, ctx.pack, ctx.history || [])) return STATE.OFF_TOPIC_OR_UNCLEAR;
    if (isAbstractOnly(t)) return STATE.NEED_CLARIFY;
    const hasReason = REASON_RE.test(t);
    const hasExpand = EXPAND_RE.test(t);
    if ((hasReason && hasExpand && t.length >= 16) || (t.length >= 28 && hasReason)) {
      return STATE.DEEP_ENOUGH;
    }
    if (isNounLike(t) && !hasReason) return STATE.NEED_REASON;
    if (t.length >= 12 || hasReason) return STATE.READY_EXPAND;
    if (tokens(t).length <= 2) return STATE.NEED_REASON;
    return STATE.NEED_CLARIFY;
  }

  function pickChoices(pack) {
    const pool = (pack && pack.choicePool) || [];
    const isOther = (item) => /other|다른|모르겠/.test(String(item.value || item.label || ""));
    const rest = pool.filter((item) => !isOther(item));
    const other = pool.find(isOther);
    const take = rest.slice(0, 3);
    if (other) take.push(other);
    return take.slice(0, 4);
  }

  function expandStrategy() {
    return "expand";
  }

  function makeQuestion(strategy, pack, answer) {
    const raw = clip(answer, 12);
    const snippet = tidyPiece(raw);
    const title = (pack && pack.title) || "오늘 활동";
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
      apply: (pack && pack.id === "2-2")
        ? [snippet ? `${snippet}을 우리 집에 둔다면 어디에 있으면 좋을까?` : "우리 집에 둔다면 어디에 있으면 좋을까?"]
        : [snippet ? "그걸 다른 곳에서도 그렇게 하면 어떻게 될까?" : "다른 곳에서도 그렇게 할 수 있을까?"],
      compare: [
        snippet ? `${snippet}과 지금 우리 생활은 어떻게 다를까?` : "지금 우리 생활과 비교하면 어떤 점이 다를까?",
        "비슷한 것과 비교하면 어떤 점이 다를까?"
      ],
      transfer: [
        "그렇게 하면 우리 생활이 어떻게 달라질까?",
        snippet ? `${snippet}을 다른 사람에게 전한다면 무엇을 말하고 싶어?` : "다른 사람에게는 어떻게 전해 주고 싶어?"
      ],
      value: [
        "그것을 소중히 여긴다면 우리는 어떻게 하면 좋을까?",
        "그 마음을 어떻게 나타낼 수 있을까?"
      ],
      "final-reason": [
        snippet ? `${snippet}의 어떤 점이 기억나?` : "어떤 점이 기억나?"
      ]
    };
    return pick(answer + strategy + ((pack && pack.id) || ""), by[strategy] || by.clarify);
  }

  function friendLine(action, state, strategy) {
    if (action === ACTION.FINISH && strategy === "unsure") return "괜찮아. 지금은 이렇게 남겨 둘게.";
    if (action === ACTION.FINISH) return "네 생각을 이렇게 정리했어.";
    if (state === STATE.NEED_CONFIRM || strategy === "confirm") return "방금 말이 잘 들렸는지 확인하고 싶어.";
    if (strategy === "meaning-check") return "조금 어려우면 비슷한 걸 골라 봐도 돼.";
    if (state === STATE.NEED_FINAL_SUPPORT) return "조금 어려웠구나. 하나씩 골라 볼까?";
    if (state === STATE.NEED_RECALL) return "아직 생각이 잘 안 떠오를 수 있어. 하나만 골라 볼까?";
    if (state === STATE.OFF_TOPIC_OR_UNCLEAR) return "오늘 활동에서 본 것을 함께 떠올려 보자.";
    return pick(state, [
      "네 말을 듣고 한 가지 더 궁금해졌어.",
      "조금 더 생각해 볼까?",
      "그 생각을 조금 더 이어가 보자."
    ]);
  }

  function tidyPiece(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.!?~]+$/g, "")
      .replace(/(이요|예요|이에요|입니다|요)$/g, "")
      .trim();
  }

  function subjectParticle(word) {
    const s = String(word || "");
    const last = s.charAt(s.length - 1);
    const code = last.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return "가";
    return ((code - 0xac00) % 28) ? "이" : "가";
  }

  function collectAnswers(session) {
    const pack = getPack(session && session.activityId) || {};
    return meaningfulAnswers(session, pack);
  }

  function toModifier(reason) {
    let adj = tidyPiece(reason);
    adj = adj.replace(/때문(에|이야|이에요)?$/g, "").trim();
    adj = adj.replace(/^(분홍색|빨간색|하얀색|노란색|보라색|마루|온돌|창호지)(이|가)\s*/, "");
    if (/예뻐서$/.test(adj) || adj === "예뻐" || adj === "이뻐") return "예쁜";
    if (/이뻐서$/.test(adj)) return "예쁜";
    if (/해서$/.test(adj)) adj = adj.replace(/해서$/, "한");
    else if (/여서$/.test(adj)) adj = adj.replace(/여서$/, "연");
    else if (/라서$/.test(adj)) adj = adj.replace(/라서$/, "란");
    else if (/서$/.test(adj)) adj = adj.replace(/서$/, "ㄴ");
    return adj;
  }

  function objectParticle(word) {
    const s = String(word || "");
    const last = s.charAt(s.length - 1);
    const code = last.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return "를";
    return ((code - 0xac00) % 28) ? "을" : "를";
  }

  function buildFinalSummary(session) {
    const pack = getPack(session && session.activityId) || {};
    const bits = [];
    function addBit(raw) {
      const t = String(raw || "").trim().replace(/[.!?~]+$/g, "");
      if (!t || isUnsureText(t) || isYes(t) || isNo(t) || isRetry(t)) return;
      if (bits.some((item) => tidyPiece(item) === tidyPiece(t))) return;
      bits.push(t);
    }
    addBit(session && session.initialAnswer);
    ((session && session.thinkingFriendTurns) || []).forEach((turn) => addBit(turn && turn.answer));
    ((session && session.confirmedMeanings) || []).forEach((item) => {
      if (!item) return;
      if (typeof item === "object") addBit(item.aiInterpretation || item.meaning);
      else addBit(item);
    });
    if (!bits.length) return "아직 잘 모르겠어요.";
    const q = String(pack.valueQuestion || session.valueQuestion || "");
    const labels = ((pack && pack.choicePool) || []).map((item) => String(item.label || item.value || "").trim()).filter(Boolean);
    const isGenericChoice = (item) => labels.some((label) => tidyPiece(item) === label || tidyPiece(item) === tidyPiece(label));
    const topicHit = bits.find((item) => COLOR_RE.test(item) && !isGenericChoice(item))
      || bits.find((item) => looksLikeChoice(item, pack))
      || bits.find((item) => !ABSTRACT_RE.test(String(item).replace(/[.!~]+$/g, "")) && !PLACE_RE.test(item))
      || bits[0];
    const color = String(topicHit || "").match(/분홍색|빨간색|하얀색|노란색|보라색|분홍/);
    const topic = color ? (color[0] === "분홍" ? "분홍색" : color[0]) : tidyPiece(String(topicHit || "").replace(/요$/, ""));
    const reason = bits.find((item) => (REASON_RE.test(item) || PRETTY_RE.test(item)) && tidyPiece(item) !== topic);
    const place = bits.find((item) => PLACE_RE.test(item) && !looksLikeChoice(item, pack) && String(item).indexOf(topic) < 0);
    const pretty = bits.some((item) => PRETTY_RE.test(item));

    let sentence = "";
    if (/쓰고 싶|우리집|오늘날/.test(q) && topic) {
      const adj = reason ? toModifier(reason) : "";
      sentence = adj
        ? `나는 ${adj} ${topic}${objectParticle(topic)} 우리 집에도 쓰고 싶어요.`
        : `나는 ${topic}${objectParticle(topic)} 우리 집에도 쓰고 싶어요.`;
      if (place) {
        const loc = tidyPiece(place).replace(/이$/, "");
        sentence += ` ${loc}에 있으면 좋겠어요.`;
      }
    } else if (/넣고 싶/.test(q) && topic) {
      sentence = `나는 ${topic}${objectParticle(topic)} 넣고 싶어요.`;
    } else if (/어울/.test(q) && topic) {
      if (pretty && COLOR_RE.test(topic)) {
        const flower = /무궁화/.test(q) ? "무궁화가 " : "";
        sentence = `나는 ${topic}${subjectParticle(topic)} 예뻐서 ${flower}우리나라 꽃과 잘 어울린다고 생각해요.`;
      } else if (/오래|계속|피/.test(bits.join(" "))) {
        sentence = "나는 무궁화가 오래 피는 모습이 우리나라와 잘 어울린다고 생각해요.";
      } else {
        const adj = reason ? toModifier(reason) : "";
        sentence = adj
          ? `나는 ${adj} ${topic}${subjectParticle(topic)} 우리나라 꽃과 잘 어울린다고 생각해요.`
          : `나는 ${topic}${subjectParticle(topic)} 우리나라 꽃과 잘 어울린다고 생각해요.`;
      }
    } else if (/마음에 드/.test(q) && topic) {
      sentence = `나는 ${topic}${subjectParticle(topic)} 더 마음에 들어요.`;
    } else if (/동작/.test(q) && topic) {
      sentence = `나는 ${topic} 동작을 넣고 싶어요.`;
    } else if (reason && topic) {
      const adj = toModifier(reason);
      if (adj) sentence = `나는 ${adj} ${topic}${subjectParticle(topic)} 좋아요.`;
    }
    if (!sentence) {
      const first = tidyPiece(bits[0]);
      if (/^(나는|저는)\s/.test(bits[0])) {
        sentence = /[.요]$/.test(bits[0].trim()) ? bits[0].trim() : `${bits[0].trim()}요.`;
      } else {
        sentence = `나는 ${first}요.`;
      }
    }
    const missing = bits.filter((item) => {
      const keys = String(item).match(/[가-힣]{2,}/g) || [];
      const important = keys.filter((word) => !/해서|좋아|있어요|우리|오늘|하면|싶어요|생각|모습|계속/.test(word));
      const check = important.length ? important : keys;
      if (!check.length) return false;
      return !check.some((word) => sentence.indexOf(word.replace(/이요$/, "").replace(/요$/, "")) >= 0);
    });
    if (!missing.length) return sentence.replace(/\s+/g, " ").trim();
    const extra = missing.map((item) => {
      let t = String(item).replace(/[.!?]+$/g, "").trim();
      t = t.replace(/좋겠어$/, "좋겠어요").replace(/싶어$/, "싶어요");
      if (!/[요다]$/.test(t)) t += "요";
      return t;
    }).join(" ");
    return `${sentence} ${extra}.`.replace(/\s+/g, " ").replace(/요요/g, "요").replace(/\.\./g, ".").trim();
  }

  function createSession(activityId, valueQuestion, grade) {
    const pack = getPack(activityId) || {};
    return {
      activityId: pack.id || String(activityId || ""),
      activityKey: pack.activityKey || "",
      valueQuestion: valueQuestion || pack.valueQuestion || "",
      grade: String(grade || "1"),
      initialAnswer: "",
      currentTurn: 0,
      maxFollowups: MAX_FOLLOWUPS,
      thinkingFriendTurns: [],
      confirmedMeanings: [],
      finalSummary: "",
      finalAnswer: "",
      studentApproved: false,
      editingFinal: false,
      action: "",
      state: "",
      strategy: "",
      question: "",
      friendLine: "",
      choices: []
    };
  }

  function supportTurnCount(turns) {
    return (turns || []).filter((turn) => {
      const s = String((turn && turn.strategy) || "");
      if (/^(confirm|confirmed|finish|unsure)$/.test(s)) return false;
      return Boolean(s);
    }).length;
  }

  function getMockThinkFriendResponse(session) {
    const pack = getPack(session && session.activityId) || {};
    const turns = (session && session.thinkingFriendTurns) || [];
    const lastTurn = turns[turns.length - 1];
    const lastAnswer = lastTurn && lastTurn.answer
      ? lastTurn.answer
      : String((session && session.initialAnswer) || "");
    const lastStrategy = lastTurn && lastTurn.strategy ? lastTurn.strategy : "";
    const history = [String((session && session.initialAnswer) || "")]
      .concat(turns.slice(0, -1).map((turn) => String((turn && turn.answer) || "")))
      .filter(Boolean);

    if (lastStrategy === "meaning-check") {
      if (/다른 생각|잘 모르/.test(String(lastAnswer || ""))) {
        return {
          state: STATE.NEED_CLARIFY,
          action: ACTION.ASK,
          strategy: "clarify",
          question: "어떤 생각이야?",
          friendLine: friendLine(ACTION.ASK, STATE.NEED_CLARIFY, "clarify"),
          choices: [],
          finalSummary: ""
        };
      }
      if (hasEnoughForSummary(session, pack) || supportTurnCount(turns) >= MAX_FOLLOWUPS) return finishReady();
      return {
        state: STATE.READY_EXPAND,
        action: ACTION.ASK,
        strategy: "expand",
        question: makeQuestion("expand", pack, lastAnswer),
        friendLine: friendLine(ACTION.ASK, STATE.READY_EXPAND, "expand"),
        choices: [],
        finalSummary: ""
      };
    }

    if (lastStrategy === "confirm") {
      if (isRetry(lastAnswer) || isNo(lastAnswer)) {
        return {
          state: STATE.NEED_CLARIFY,
          action: ACTION.ASK,
          strategy: "clarify",
          question: isRetry(lastAnswer) ? "괜찮아. 다시 말해 줄래?" : "어떤 뜻으로 말한 거야?",
          friendLine: friendLine(ACTION.ASK, STATE.NEED_CLARIFY, "clarify"),
          choices: [],
          finalSummary: ""
        };
      }
      const used = isYes(lastAnswer) ? extractGuess(lastTurn && lastTurn.question) : lastAnswer;
      if (used) {
        const copy = Object.assign({}, session, {
          thinkingFriendTurns: turns.slice(0, -1).concat([{
            strategy: "confirmed",
            question: lastTurn && lastTurn.question,
            answer: used
          }])
        });
        if (!copy.initialAnswer || isYes(copy.initialAnswer)) copy.initialAnswer = used;
        return getMockThinkFriendResponse(copy);
      }
    }

    const lastInputType = String((lastTurn && lastTurn.inputType) || (session && session.inputType) || "text").trim().toLowerCase();
    const confirm = lastInputType === "voice" ? detectConfirm(lastAnswer, pack) : null;
    if (confirm && lastStrategy !== "confirmed") {
      return {
        state: STATE.NEED_CONFIRM,
        action: ACTION.SHOW_CHOICES,
        strategy: "confirm",
        question: confirm.message,
        friendLine: friendLine(ACTION.SHOW_CHOICES, STATE.NEED_CONFIRM, "confirm"),
        choices: confirm.choices,
        finalSummary: ""
      };
    }

    const state = mockAnalyzeAnswer(lastAnswer, { pack, history });
    const freeAsks = supportTurnCount(turns);
    const longDeep = state === STATE.DEEP_ENOUGH && String(lastAnswer || "").trim().length >= 24;

    function finishUnsure() {
      return {
        state: STATE.NEED_RECALL,
        action: ACTION.FINISH,
        strategy: "unsure",
        question: "",
        friendLine: friendLine(ACTION.FINISH, STATE.NEED_RECALL, "unsure"),
        choices: [],
        finalSummary: "아직 잘 모르겠어요."
      };
    }

    function finishReady() {
      return {
        state: STATE.DEEP_ENOUGH,
        action: ACTION.FINISH,
        strategy: "finish",
        question: "",
        friendLine: friendLine(ACTION.FINISH, STATE.DEEP_ENOUGH, "finish"),
        choices: [],
        finalSummary: buildFinalSummary(session)
      };
    }

    function showSupport(nextState, strategy, question) {
      return {
        state: nextState,
        action: ACTION.SHOW_CHOICES,
        strategy,
        question,
        friendLine: friendLine(ACTION.SHOW_CHOICES, nextState, strategy),
        choices: supportChoices(pack),
        finalSummary: ""
      };
    }

    if (lastStrategy === "final-reason") {
      if (hasEnoughForSummary(session, pack) || meaningfulAnswers(session, pack).length) return finishReady();
      return finishUnsure();
    }

    if (lastStrategy === "final-support" || lastStrategy === "recall" || lastStrategy === "choice") {
      if (isUnsureText(lastAnswer)) return finishUnsure();
      if (isMeaningfulThought(lastAnswer, pack, history) || looksLikeChoice(lastAnswer, pack)) {
        if (hasEnoughForSummary(session, pack)) return finishReady();
        return {
          state: STATE.NEED_REASON,
          action: ACTION.ASK,
          strategy: "reason",
          question: makeQuestion("reason", pack, lastAnswer),
          friendLine: friendLine(ACTION.ASK, STATE.NEED_REASON, "reason"),
          choices: [],
          finalSummary: ""
        };
      }
      return finishUnsure();
    }

    if (hasEnoughForSummary(session, pack) && freeAsks >= 1) return finishReady();
    if (state === STATE.DEEP_ENOUGH && hasEnoughForSummary(session, pack)) return finishReady();

    const hasProgress = meaningfulAnswers(session, pack).length > 0 || (!isUnknownText(lastAnswer) && !isUnsureText(lastAnswer) && String(lastAnswer || "").trim());
    const usedHelp = turns.some((turn) => /^(choice|recall|final-support)$/.test(String(turn.strategy || "")));

    if (state === STATE.OFF_TOPIC_OR_UNCLEAR) {
      if (hasProgress || !turns.length) {
        return {
          state: STATE.NEED_CLARIFY,
          action: ACTION.ASK,
          strategy: "clarify",
          question: makeQuestion("clarify", pack, lastAnswer),
          friendLine: friendLine(ACTION.ASK, STATE.NEED_CLARIFY, "clarify"),
          choices: [],
          finalSummary: ""
        };
      }
      if (!usedHelp) return showSupport(STATE.OFF_TOPIC_OR_UNCLEAR, "recall", (pack.followUpExamples && pack.followUpExamples.recall) || "오늘 활동에서 가장 기억나는 게 뭐야?");
      return finishUnsure();
    }

    if (state === STATE.NEED_RECALL) {
      if (!hasProgress && !usedHelp && !turns.length) {
        return showSupport(STATE.NEED_RECALL, "recall", (pack.followUpExamples && pack.followUpExamples.recall) || "오늘 활동에서 가장 기억나는 게 뭐야?");
      }
      if (hasProgress) return finishReady();
      return finishUnsure();
    }

    if (freeAsks >= MAX_FOLLOWUPS) {
      if (hasProgress || hasEnoughForSummary(session, pack)) return finishReady();
      if (!usedHelp) return showSupport(STATE.NEED_FINAL_SUPPORT, "final-support", (pack.followUpExamples && pack.followUpExamples.recall) || "오늘 활동에서 가장 기억나는 게 뭐야?");
      return finishUnsure();
    }

    let strategy = "clarify";
    if (state === STATE.NEED_REASON) strategy = "reason";
    else if (state === STATE.READY_EXPAND) strategy = expandStrategy(pack);
    return {
      state,
      action: ACTION.ASK,
      strategy,
      question: makeQuestion(strategy, pack, lastAnswer),
      friendLine: friendLine(ACTION.ASK, state, strategy),
      choices: [],
      finalSummary: ""
    };
  }

  function applyResponse(session, response) {
    const next = session || createSession("");
    next.action = response.action || "";
    next.state = response.state || "";
    next.strategy = response.strategy || "";
    next.question = response.question || "";
    next.friendLine = response.friendLine || "";
    next.choices = response.choices || [];
    next.summaryWaiting = !!response.summaryWaiting;
    next.summaryTimedOut = !!response.summaryTimedOut;
    if (response.action === ACTION.FINISH) {
      next.finalSummary = response.finalSummary || (response.summaryTimedOut ? "" : buildFinalSummary(next));
    }
    return next;
  }

  function nextTurnCompat(input) {
    const pack = input.pack || getPack(input.activityId) || {};
    const answers = Array.isArray(input.answers) ? input.answers.filter(Boolean) : [];
    const session = createSession(pack.id || input.activityId, pack.valueQuestion);
    session.initialAnswer = answers[0] || "";
    session.thinkingFriendTurns = answers.slice(1).map((answer, i) => ({
      strategy: i === 0 ? "follow" : "follow",
      question: "",
      answer
    }));
    const response = getMockThinkFriendResponse(session);
    if (response.action === ACTION.FINISH) {
      return {
        move: "summary",
        kind: response.state,
        question: "",
        friendLine: response.friendLine,
        choices: [],
        extraAnswer: session.initialAnswer,
        summaryText: response.finalSummary
      };
    }
    if (response.action === ACTION.SHOW_CHOICES) {
      return {
        move: "choices",
        kind: response.state,
        question: response.question,
        friendLine: response.friendLine,
        choices: response.choices
      };
    }
    return {
      move: response.strategy,
      kind: response.state,
      question: response.question,
      friendLine: response.friendLine,
      choices: []
    };
  }

  function latestAnswer(session) {
    const turns = (session && session.thinkingFriendTurns) || [];
    if (turns.length && turns[turns.length - 1] && turns[turns.length - 1].answer) {
      return String(turns[turns.length - 1].answer);
    }
    return String((session && session.initialAnswer) || "");
  }

  function toEngineResponse(api) {
    const action = api.action || "";
    const message = String(api.message || "");
    const finish = action === ACTION.FINISH || api.finish === true;
    const state = api.answerState || api.state || "";
    const strategy = api.strategy || "";
    return {
      state,
      action: finish ? ACTION.FINISH : action,
      strategy,
      question: finish ? "" : message,
      friendLine: friendLine(finish ? ACTION.FINISH : action, state, strategy),
      choices: Array.isArray(api.choices) ? api.choices : [],
      finalSummary: api.finalSummary || api.summary || ""
    };
  }

  async function postJson(url, body, options) {
    const timeoutMs = Number(options && options.timeoutMs) || 0;
    const controller = timeoutMs > 0 ? new AbortController() : null;
    let timer = null;
    if (controller) {
      timer = setTimeout(() => controller.abort(), timeoutMs);
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller ? controller.signal : undefined
      });
      if (!res.ok) throw new Error("api_http");
      return res.json();
    } catch (err) {
      if (err && (err.name === "AbortError" || /aborted/i.test(String(err.message || "")))) {
        const timeoutErr = new Error("api_timeout");
        timeoutErr.code = "api_timeout";
        throw timeoutErr;
      }
      throw err;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function latestInputType(session) {
    const top = String((session && session.inputType) || "").trim().toLowerCase();
    if (top === "voice" || top === "text" || top === "choice") return top;
    const turns = (session && session.thinkingFriendTurns) || [];
    if (turns.length) {
      const t = String((turns[turns.length - 1] && turns[turns.length - 1].inputType) || "").trim().toLowerCase();
      if (t === "voice" || t === "text" || t === "choice") return t;
    }
    return "text";
  }

  async function requestApiTurn(session) {
    const turns = session.thinkingFriendTurns || [];
    return postJson("/api/thinking-friend", {
      activityId: session.activityId,
      activityKey: session.activityKey || "",
      grade: session.grade || "1",
      initialAnswer: session.initialAnswer || "",
      studentAnswer: latestAnswer(session),
      inputType: latestInputType(session),
      previousTurns: turns,
      confirmedMeanings: Array.isArray(session.confirmedMeanings) ? session.confirmedMeanings : [],
      turn: Number(session.currentTurn != null ? session.currentTurn : turns.length)
    });
  }

  async function requestApiSummary(session) {
    const turns = session.thinkingFriendTurns || [];
    return postJson("/api/thinking-friend/summary", {
      activityId: session.activityId,
      activityKey: session.activityKey || "",
      valueQuestion: session.valueQuestion || "",
      initialAnswer: session.initialAnswer || "",
      thinkingFriendTurns: turns,
      selectedChoices: turns.filter((turn) => {
        if (/^(meaning-check|interpret|confirm|confirmed)$/.test(String(turn.strategy || ""))) return false;
        return String(turn.source || "") === "choice" || /^(choice|recall|final-support)$/.test(String(turn.strategy || ""));
      }).map((turn) => turn.answer).filter(Boolean),
      confirmedMeanings: Array.isArray(session.confirmedMeanings) && session.confirmedMeanings.length
        ? session.confirmedMeanings.filter((item) => item && item.confirmed !== false)
        : turns.filter((turn) => String(turn.source || "") === "confirmed_meaning" || /^(confirm|meaning-check)/.test(String(turn.strategy || ""))).map((turn) => turn.answer).filter(Boolean)
    }, { timeoutMs: 40000 });
  }

  function notifySummaryWait(session, waiting) {
    if (!session) return;
    session.summaryWaiting = !!waiting;
    session.summaryTimedOut = waiting ? false : !!session.summaryTimedOut;
    if (waiting) {
      session.friendLine = "생각을 정리하는 중이야…";
    }
    if (typeof session.onUiUpdate === "function") {
      try { session.onUiUpdate(); } catch (_) {}
    }
  }

  async function finishWithSummary(session, api) {
    const mapped = toEngineResponse(api || { action: ACTION.FINISH, finish: true, answerState: "DEEP_ENOUGH" });
    mapped.action = ACTION.FINISH;
    if (mapped.strategy === "unsure" || /아직 잘 모르겠어요/.test(String(mapped.finalSummary || ""))) {
      mapped.finalSummary = "아직 잘 모르겠어요.";
      mapped.friendLine = friendLine(ACTION.FINISH, mapped.state, "unsure");
      mapped.summaryPath = "client_local";
      logTiming({ kind: "summary_path", summaryPath: "client_local", reason: "unsure_hardcoded" });
      return mapped;
    }
    const hasSpeech = Boolean(String((session && session.initialAnswer) || "").trim())
      || ((session && session.thinkingFriendTurns) || []).some((turn) => String((turn && turn.answer) || "").trim());
    if (!hasSpeech) {
      mapped.finalSummary = "아직 잘 모르겠어요.";
      mapped.friendLine = friendLine(ACTION.FINISH, mapped.state, "unsure");
      mapped.summaryPath = "client_local";
      logTiming({ kind: "summary_path", summaryPath: "client_local", reason: "empty_speech" });
      return mapped;
    }
    let summaryPath = "";
    let timedOut = false;
    notifySummaryWait(session, true);
    try {
      const sum = await requestApiSummary(session);
      if (sum && sum.summary) {
        mapped.finalSummary = sum.summary;
        summaryPath = "api";
      }
    } catch (err) {
      timedOut = !!(err && err.code === "api_timeout");
    }
    notifySummaryWait(session, false);
    if (timedOut) {
      mapped.finalSummary = "";
      mapped.summaryTimedOut = true;
      mapped.summaryWaiting = false;
      mapped.friendLine = "지금은 정리하기가 조금 늦어졌어.";
      mapped.summaryPath = "timeout";
      if (session) {
        session.summaryTimedOut = true;
        session.summaryWaiting = false;
      }
      logTiming({ kind: "summary_path", summaryPath: "timeout" });
      return mapped;
    }
    if (!mapped.finalSummary) {
      mapped.finalSummary = buildFinalSummary(session);
      summaryPath = "client_local";
    }
    mapped.summaryPath = summaryPath || "api";
    mapped.summaryTimedOut = false;
    mapped.friendLine = friendLine(ACTION.FINISH, mapped.state, mapped.strategy);
    logTiming({ kind: "summary_path", summaryPath: mapped.summaryPath });
    return mapped;
  }

  async function getThinkFriendResponse(session) {
    try {
      const api = await requestApiTurn(session);
      if (api && (api.action || api.answerState)) {
        const mapped = toEngineResponse(api);
        if (mapped.action === ACTION.FINISH) {
          return finishWithSummary(session, mapped);
        }
        return mapped;
      }
    } catch (_) {}
    const provider = window.ThinkFriendProvider;
    if (provider && typeof provider.complete === "function") {
      return provider.complete(session);
    }
    const mock = getMockThinkFriendResponse(session);
    if (mock && mock.action === ACTION.FINISH && !mock.summaryPath) {
      mock.summaryPath = "client_local";
      logTiming({ kind: "summary_path", summaryPath: "client_local", reason: "engine_mock" });
    }
    return mock;
  }

  window.ThinkFriendEngine = {
    STATE,
    ACTION,
    MAX_FOLLOWUPS,
    mockAnalyzeAnswer,
    getMockThinkFriendResponse,
    getThinkFriendResponse,
    buildFinalSummary,
    createSession,
    applyResponse,
    getPack,
    retrySummary(session) {
      return finishWithSummary(session, {
        action: ACTION.FINISH,
        finish: true,
        answerState: "DEEP_ENOUGH",
        strategy: "finish"
      });
    },
    nextTurn: nextTurnCompat,
    requestTurn(payload) {
      return Promise.resolve(nextTurnCompat(payload || {}));
    },
    providerHint: "서버 /api/thinking-friend 가 없으면 브라우저 mock을 쓴다. API 키는 프론트에 넣지 않는다."
  };
})();
