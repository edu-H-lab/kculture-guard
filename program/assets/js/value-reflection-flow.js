/**
 * 가치수호록 만들기
 *
 * ① 활동별 valueQuestion → 쓰기/말하기
 * ② 공통 ThinkFriendPanel (엔진 하나 + 14개 데이터)
 * ③ 정리문 저장 — 기존 ValueGuardianBook 저장 유지
 */
(function () {
  "use strict";

  const STEP_META = [
    { id: 1, label: "내 생각" },
    { id: 2, label: "생각 친구" },
    { id: 3, label: "정리" }
  ];

  const ROUTE_BY_ACTIVITY = {
    taegeukgi: "stage1_a1",
    mugunghwa: "stage1_a2",
    anthem: "stage1_a3",
    money: "stage1_a4",
    hangul: "stage2_a1",
    hanok: "stage2_a2",
    dancheong: "stage2_a3",
    hanbok: "stage3_a1",
    bibimbap: "stage3_a2",
    holiday: "stage3_a3",
    yut: "stage4_a1",
    ttakji: "stage4_a2",
    minyo: "stage4_a3",
    talchum: "stage4_a4"
  };

  const ACTIVITY_BY_ROUTE = Object.keys(ROUTE_BY_ACTIVITY).reduce((map, key) => {
    map[ROUTE_BY_ACTIVITY[key]] = key;
    return map;
  }, {});

  function packOf(activityOrRoute) {
    const T = window.ThinkingFriendActivities;
    if (T && typeof T.get === "function") return T.get(activityOrRoute);
    return null;
  }

  function configFromPack(pack) {
    if (!pack) return null;
    const choices = (pack.choicePool || []).map((item) => ({
      id: String(item.value || item.id || item.label || ""),
      label: String(item.label || item.value || ""),
      valueLabel: String(item.label || item.value || "")
    }));
    return {
      activityId: pack.activityKey || pack.id,
      activityTitle: pack.title || "",
      previewTitle: `나의 ${pack.title || ""} 생각`,
      valueQuestion: pack.valueQuestion || "",
      step1Question: pack.valueQuestion || "",
      step2Question: "",
      choices,
      pack
    };
  }

  function buildConfigs() {
    const out = {};
    const T = window.ThinkingFriendActivities;
    const packs = T && T.packs ? T.packs : {};
    Object.keys(packs).forEach((id) => {
      const pack = packs[id];
      const cfg = configFromPack(pack);
      if (cfg && cfg.activityId) out[cfg.activityId] = cfg;
    });
    return out;
  }

  const CONFIGS = buildConfigs();
  const HANOK_REFLECTION_CONFIG = CONFIGS.hanok || configFromPack({
    activityKey: "hanok",
    title: "한옥 세우기",
    valueQuestion: "한옥의 좋은 점 중 우리집에도 쓰고 싶은 것은 무엇일까?",
    choicePool: []
  });

  let _ctx = null;
  let _appEl = null;
  let _recognition = null;
  let _audio = null;

  function playClick() {
    if (_ctx && typeof _ctx.playSound === "function") _ctx.playSound("click.mp3");
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function getState() {
    return _ctx && typeof _ctx.getState === "function" ? _ctx.getState() : null;
  }

  function save() {
    if (_ctx && typeof _ctx.saveProgress === "function") _ctx.saveProgress();
  }

  let _lastSummaryPath = "";

  function nowMs() {
    return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  }

  function logTiming(payload) {
    try {
      console.log("[ThinkFriend:timing]", JSON.stringify(payload || {}));
    } catch (_) {}
  }

  function flowState() {
    const st = getState();
    return st && st.valueReflection ? st.valueReflection : null;
  }

  function studentGrade() {
    const st = getState();
    const grade = st && st.userProfile && st.userProfile.grade;
    return String(grade || "1");
  }

  function emptyThinkFriend(activityOrRoute, valueQuestion) {
    const engine = window.ThinkFriendEngine;
    const pack = packOf(activityOrRoute) || {};
    if (engine && typeof engine.createSession === "function") {
      return engine.createSession(pack.id || activityOrRoute, valueQuestion || pack.valueQuestion, studentGrade());
    }
    return {
      activityId: pack.id || "",
      valueQuestion: valueQuestion || pack.valueQuestion || "",
      grade: studentGrade(),
      initialAnswer: "",
      currentTurn: 0,
      maxFollowups: 5,
      thinkingFriendTurns: [],
      confirmedMeanings: [],
      finalSummary: "",
      studentApproved: false,
      action: "",
      state: "",
      strategy: "",
      question: "",
      friendLine: "",
      choices: []
    };
  }

  function getConfig(activityOrRoute) {
    const pack = packOf(activityOrRoute);
    if (pack) return configFromPack(pack);
    const key = CONFIGS[activityOrRoute]
      ? activityOrRoute
      : (ACTIVITY_BY_ROUTE[String(activityOrRoute || "").replace(/_hoist$/, "")] || activityOrRoute);
    return CONFIGS[key] || null;
  }

  function getThinkFriend(activityOrRoute) {
    const pack = packOf(activityOrRoute) || {};
    return {
      friendName: "생각 친구",
      greeting: "네 이야기를 잘 들었어!",
      pack
    };
  }

  function activityKeyForRoute(route) {
    return ACTIVITY_BY_ROUTE[String(route || "").replace(/_hoist$/, "")] || "";
  }

  function routeForActivity(activity) {
    return ROUTE_BY_ACTIVITY[activity] || "";
  }

  function normalizeChoice(choice, index) {
    if (choice && typeof choice === "object") {
      return {
        id: String(choice.id || choice.value || choice.label || index),
        label: String(choice.label || choice.id || choice.value || ""),
        valueLabel: String(choice.valueLabel || choice.label || "")
      };
    }
    const label = String(choice || "");
    return { id: label, label, valueLabel: label };
  }

  function choicesOf(config) {
    return (config.choices || []).map(normalizeChoice);
  }

  function createDefaultState(opts) {
    opts = opts || {};
    const route = String(opts.route || "").replace(/_hoist$/, "");
    const activity = opts.activity || activityKeyForRoute(route);
    const config = getConfig(activity) || {};
    return {
      active: false,
      pending: false,
      route: route || routeForActivity(activity),
      activity,
      activityTitle: config.activityTitle || "",
      step: "value",
      recordMode: "write",
      selectedId: opts.selectedId || "",
      selectedLabel: opts.selectedLabel || "",
      valueLabel: opts.valueLabel || "",
      reflectionText: "",
      writeDraft: opts.writeDraft || "",
      voiceDraft: "",
      photoUrl: null,
      photoDraft: null,
      audioUrl: null,
      responseType: "",
      listening: false,
      voiceError: false,
      photoError: false,
      openPhotoOnce: false,
      status: "draft",
      createdAt: null,
      answers: [],
      tfDraft: "",
      tfVoiceDraft: "",
      tfFinalDraft: "",
      thinkFriend: emptyThinkFriend(activity, config.valueQuestion)
    };
  }

  function isFinish(flow) {
    const ACTION = window.ThinkFriendEngine && window.ThinkFriendEngine.ACTION;
    const action = flow && flow.thinkFriend && flow.thinkFriend.action;
    return action === "FINISH" || (ACTION && action === ACTION.FINISH) || action === "summary";
  }

  function currentStepNum(flow) {
    if (!flow) return 1;
    if (flow.step === "saved") return 3;
    if (flow.step === "think") return isFinish(flow) ? 3 : 2;
    return 1;
  }

  function migrateLegacyStep(flow) {
    if (!flow) return;
    if (flow.step === "saved" || flow.step === "think") return;
    if (flow.step === "preview" || flow.step === "compose" || flow.step === "record") {
      flow.step = "value";
      flow.recordMode = "write";
      return;
    }
    if (flow.step === "write" || flow.step === "voice" || flow.step === "photo") {
      flow.step = "value";
      return;
    }
    const n = Number(flow.step);
    if (n === 1 || n === 2 || n === 3) flow.step = "value";
  }

  function inferResponseType(flow) {
    const hasText = !!(flow.reflectionText || flow.writeDraft || flow.voiceDraft);
    const hasPhoto = !!(flow.photoUrl || flow.photoDraft);
    const hasVoice = !!(flow.voiceDraft || flow.audioUrl);
    const count = [hasText, hasPhoto, hasVoice].filter(Boolean).length;
    if (count >= 2) return "mixed";
    if (hasPhoto && !hasText) return "photo";
    if (hasVoice && !flow.writeDraft) return "voice";
    if (hasText) return "text";
    return "text";
  }

  function combinedText(flow) {
    const parts = [];
    const write = String(flow.writeDraft || "").trim();
    const voice = String(flow.voiceDraft || "").trim();
    if (write) parts.push(write);
    if (voice && voice !== write) parts.push(voice);
    if (!parts.length && flow.reflectionText) parts.push(String(flow.reflectionText).trim());
    return parts.join("\n");
  }

  function followUpText(flow) {
    const write = String(flow.tfDraft || "").trim();
    const voice = String(flow.tfVoiceDraft || "").trim();
    if (write && voice && write !== voice) return `${write}\n${voice}`;
    return write || voice;
  }

  function extraAnswers(flow) {
    const turns = (flow.thinkFriend && flow.thinkFriend.thinkingFriendTurns) || [];
    return turns.map((turn) => String(turn.answer || "").trim()).filter(Boolean).join("\n");
  }

  function stepperHTML(flow) {
    const cur = currentStepNum(flow);
    return `
      <ol class="vrf-steps" aria-label="가치수호록">
        ${STEP_META.map((item) => {
          let cls = "vrf-step";
          if (item.id < cur) cls += " is-done";
          else if (item.id === cur) cls += " is-now";
          else cls += " is-todo";
          return `<li class="${cls}"><span class="vrf-step-num">${item.id}</span><span class="vrf-step-label">${item.label}</span></li>`;
        }).join("")}
      </ol>
    `;
  }

  function questionHeadHTML(kicker, question) {
    return `
      <p class="vrf-kicker">${escapeHtml(kicker)}</p>
      <h2 class="vrf-title">${escapeHtml(question)}</h2>
    `;
  }

  function valueHTML(flow, config) {
    const listening = !!flow.listening;
    const said = String(flow.voiceDraft || "").trim();
    let voiceBody = "";
    if (listening) voiceBody = `<p class="vrf-listen">듣고 있어요...</p>`;
    else if (said) voiceBody = `<p class="vrf-voice-result">${escapeHtml(said)}</p>`;
    else if (flow.voiceError) voiceBody = `<p class="vrf-soft">지금은 말을 듣지 못했어요. 글로 적어도 괜찮아요.</p>`;
    const speakLabel = listening ? "듣고 있어요..." : (said ? "다시 말하기" : "말로 답하기");
    return `
      ${questionHeadHTML("① 가치수호록", config.valueQuestion || config.step1Question || "오늘 활동에서 무엇을 느꼈을까?")}
      <textarea id="vrfWriteInput" class="vrf-textarea" rows="3" maxlength="160" placeholder="생각나는 대로 적어 보세요.">${escapeHtml(flow.writeDraft || "")}</textarea>
      ${voiceBody}
      <div class="vrf-actions vrf-actions--pair">
        <button type="button" class="vrf-btn vrf-btn--next" id="vrfKeepBtn">이대로</button>
        <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfRetryBtn" ${listening ? "disabled" : ""}>${speakLabel}</button>
      </div>
    `;
  }

  function savedHTML(flow) {
    const shown = resolveFinalAnswer(flow, flow && flow.thinkFriend);
    return `
      <h2 class="vrf-title vrf-title--done">가치수호록 완성!</h2>
      ${shown ? `<p class="tf-summary">${escapeHtml(shown)}</p>` : ""}
      <div class="vrf-actions vrf-actions--pair">
        <button type="button" class="vrf-btn vrf-btn--save" id="vrfBookBtn">내 수호책 보기</button>
        <button type="button" class="vrf-btn vrf-btn--next" id="vrfNextActBtn">다음 활동</button>
      </div>
    `;
  }

  function thinkFriendHTML(flow) {
    const panel = window.ThinkFriendPanel;
    if (panel && typeof panel.renderHTML === "function") {
      return panel.renderHTML(flow.thinkFriend || emptyThinkFriend(flow.activity), {
        listening: !!flow.listening,
        writeValue: flow.tfDraft || "",
        voiceValue: flow.tfVoiceDraft || "",
        voiceError: !!flow.voiceError,
        finalDraft: flow.tfFinalDraft || ""
      });
    }
    return `<p class="vrf-soft">생각 친구를 불러오지 못했어요.</p>`;
  }

  function bodyHTML(flow, config) {
    if (flow.step === "saved") return savedHTML(flow);
    if (flow.step === "think") return thinkFriendHTML(flow, config);
    return valueHTML(flow, config);
  }

  function stopSpeech() {
    try { if (_recognition) _recognition.stop(); } catch (_) {}
    _recognition = null;
    const flow = flowState();
    if (flow) flow.listening = false;
  }

  function stopAudio() {
    if (_audio) {
      try { _audio.pause(); } catch (_) {}
      _audio = null;
    }
  }

  function stopAll() {
    stopSpeech();
    stopAudio();
  }

  function runEngine(flow) {
    const engine = window.ThinkFriendEngine;
    if (!flow.thinkFriend) flow.thinkFriend = emptyThinkFriend(flow.activity);
    flow.thinkFriend.onUiUpdate = () => {
      save();
      paint();
    };
    const tSubmit = nowMs();
    const request = engine && typeof engine.getThinkFriendResponse === "function"
      ? engine.getThinkFriendResponse(flow.thinkFriend)
      : Promise.resolve(engine.getMockThinkFriendResponse(flow.thinkFriend));
    Promise.resolve(request).then((response) => {
      if (engine && typeof engine.applyResponse === "function") {
        engine.applyResponse(flow.thinkFriend, response || {});
      }
      if (response && response.summaryPath) _lastSummaryPath = response.summaryPath;
      flow.step = "think";
      flow.tfDraft = "";
      flow.tfVoiceDraft = "";
      flow.listening = false;
      flow.voiceError = false;
      stopSpeech();
      save();
      paint();
      logTiming({
        kind: "submit_to_ui",
        t_ms: Math.round(nowMs() - tSubmit),
        action: String((response && response.action) || (flow.thinkFriend && flow.thinkFriend.action) || ""),
        state: String((response && response.state) || (flow.thinkFriend && flow.thinkFriend.state) || ""),
        strategy: String((response && response.strategy) || (flow.thinkFriend && flow.thinkFriend.strategy) || ""),
        finish: String((response && response.action) || "") === "FINISH",
        summaryPath: (response && response.summaryPath) || ""
      });
    }).catch(() => {
      flow.thinkFriend.action = "FINISH";
      flow.thinkFriend.finalSummary = "";
      flow.thinkFriend.summaryTimedOut = true;
      flow.thinkFriend.summaryWaiting = false;
      flow.thinkFriend.friendLine = "지금은 정리하기가 조금 늦어졌어.";
      flow.step = "think";
      _lastSummaryPath = "timeout";
      save();
      paint();
      logTiming({
        kind: "submit_to_ui",
        t_ms: Math.round(nowMs() - tSubmit),
        action: "FINISH",
        state: "",
        strategy: "",
        finish: true,
        summaryPath: "timeout"
      });
      logTiming({ kind: "summary_path", summaryPath: "timeout" });
    });
  }

  function retrySummary(flow) {
    const engine = window.ThinkFriendEngine;
    if (!flow.thinkFriend || !engine || typeof engine.retrySummary !== "function") return;
    flow.thinkFriend.onUiUpdate = () => {
      save();
      paint();
    };
    flow.thinkFriend.summaryTimedOut = false;
    flow.thinkFriend.summaryWaiting = true;
    flow.thinkFriend.friendLine = "생각을 정리하는 중이야…";
    flow.thinkFriend.action = "FINISH";
    save();
    paint();
    Promise.resolve(engine.retrySummary(flow.thinkFriend)).then((response) => {
      engine.applyResponse(flow.thinkFriend, response || {});
      if (response && response.summaryPath) _lastSummaryPath = response.summaryPath;
      save();
      paint();
    }).catch(() => {
      flow.thinkFriend.summaryTimedOut = true;
      flow.thinkFriend.summaryWaiting = false;
      flow.thinkFriend.finalSummary = "";
      flow.thinkFriend.friendLine = "지금은 정리하기가 조금 늦어졌어.";
      save();
      paint();
    });
  }

  function goThinkFriend(flow) {
    const text = combinedText(flow);
    flow.reflectionText = text;
    flow.responseType = inferResponseType(flow);
    flow.answers = [text].filter(Boolean);
    const pack = packOf(flow.activity) || {};
    flow.thinkFriend = emptyThinkFriend(pack.id || flow.activity, pack.valueQuestion);
    flow.thinkFriend.initialAnswer = text;
    flow.thinkFriend.currentTurn = 0;
    const voice = String(flow.voiceDraft || "").trim();
    flow.thinkFriend.inputType = voice && text.indexOf(voice) >= 0 ? "voice" : "text";
    runEngine(flow);
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

  function isYes(text) {
    return /^(맞아요|맞아|네|응)$/.test(String(text || "").trim().replace(/[.!~]+$/g, ""));
  }

  function pushFriendAnswer(flow, text, meta) {
    const said = String(text || "").trim();
    if (!said) return false;
    meta = meta || {};
    if (!flow.thinkFriend) flow.thinkFriend = emptyThinkFriend(flow.activity);
    if (!flow.thinkFriend.thinkingFriendTurns) flow.thinkFriend.thinkingFriendTurns = [];
    const strategy = String(flow.thinkFriend.strategy || "");
    const action = String(flow.thinkFriend.action || "");
    let source = meta.source || "";
    let stored = said;
    if (!source) {
      if (strategy === "confirm" && isYes(said)) source = "confirmed_meaning";
      else if (action === "SHOW_CHOICES" && /^(choice|recall|final-support|confirm)$/.test(strategy)) source = strategy === "confirm" ? "choice" : "choice";
      else source = "free_response";
    }
    if (strategy === "confirm" && isYes(said)) {
      const guess = extractGuess(flow.thinkFriend.question);
      if (guess) {
        stored = guess;
        source = "confirmed_meaning";
      }
    }
    if (strategy === "meaning-check" && source !== "confirmed_meaning") {
      if (!/다른 생각|잘 모르/.test(said)) source = "confirmed_meaning";
    }
    const inputType = meta.inputType || (source === "choice" ? "choice" : (flow.tfVoiceDraft && said.indexOf(String(flow.tfVoiceDraft).trim()) >= 0 ? "voice" : "text"));
    flow.thinkFriend.inputType = inputType;
    if (source === "confirmed_meaning") {
      if (!Array.isArray(flow.thinkFriend.confirmedMeanings)) flow.thinkFriend.confirmedMeanings = [];
      const prevFree = (flow.thinkFriend.thinkingFriendTurns || []).filter((turn) => turn && turn.source === "free_response").slice(-1)[0];
      flow.thinkFriend.confirmedMeanings.push({
        studentExpression: String((prevFree && prevFree.answer) || flow.thinkFriend.initialAnswer || "").trim(),
        aiInterpretation: stored,
        confirmed: true
      });
    }
    flow.thinkFriend.thinkingFriendTurns.push({
      strategy,
      question: flow.thinkFriend.question || "",
      answer: stored,
      inputType,
      source
    });
    flow.thinkFriend.currentTurn = flow.thinkFriend.thinkingFriendTurns.length;
    if (!flow.answers) flow.answers = [];
    flow.answers.push(stored);
    if (!flow.selectedLabel) {
      flow.selectedLabel = stored;
      flow.valueLabel = stored;
    }
    runEngine(flow);
    return true;
  }

  function startSpeechCapture(flow, target) {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) {
      flow.voiceError = true;
      flow.listening = false;
      save();
      paint();
      return;
    }
    stopSpeech();
    flow.voiceError = false;
    flow.listening = true;
    save();
    paint();
    try {
      _recognition = new Rec();
      _recognition.lang = "ko-KR";
      _recognition.interimResults = false;
      _recognition.maxAlternatives = 1;
      let speechEndAt = 0;
      _recognition.onspeechend = () => {
        speechEndAt = nowMs();
      };
      _recognition.onresult = (ev) => {
        const tTranscript = nowMs();
        const said = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
        if (target === "tf") flow.tfVoiceDraft = said || "";
        else flow.voiceDraft = said || "";
        flow.listening = false;
        flow.voiceError = !said;
        save();
        paint();
        logTiming({
          kind: "speech_end_to_transcript",
          t_ms: speechEndAt ? Math.round(tTranscript - speechEndAt) : null,
          hasSpeechEnd: !!speechEndAt,
          target: target === "tf" ? "think_friend" : "value"
        });
      };
      _recognition.onerror = () => {
        flow.listening = false;
        flow.voiceError = true;
        save();
        paint();
      };
      _recognition.onend = () => {
        const cur = flowState();
        if (cur) cur.listening = false;
      };
      _recognition.start();
    } catch (_) {
      flow.listening = false;
      flow.voiceError = true;
      save();
      paint();
    }
  }

  function resolveFinalAnswer(flow, tf) {
    const edited = String((flow && flow.tfFinalDraft) || (tf && tf.finalAnswer) || "").trim();
    if (tf && tf.editingFinal && edited) return edited;
    const summary = String((tf && tf.finalSummary) || "").trim();
    if (/아직 잘 모르겠어요/.test(summary) || (tf && tf.strategy === "unsure")) {
      return summary || "아직 잘 모르겠어요.";
    }
    if (summary) return summary;
    const first = String((tf && tf.initialAnswer) || "").trim();
    if (first) return first;
    return combinedText(flow);
  }

  function persistRecord(flow, config) {
    const st = getState();
    if (!st || !window.ValueGuardianBook) return;
    const tf = flow.thinkFriend || emptyThinkFriend(flow.activity);
    const editEl = document.getElementById("vrfFinalEdit");
    if (editEl) flow.tfFinalDraft = editEl.value;
    const finalAnswer = resolveFinalAnswer(flow, tf);
    const editedNow = !!(tf.editingFinal && String((flow && flow.tfFinalDraft) || "").trim());
    if (editedNow) _lastSummaryPath = "student_edited";
    logTiming({
      kind: "summary_path",
      summaryPath: _lastSummaryPath || (tf.finalSummary ? "api" : "client_local"),
      saved: true,
      edited: editedNow
    });
    tf.finalAnswer = finalAnswer;
    tf.studentApproved = true;
    tf.editingFinal = false;
    const initialAnswer = String(tf.initialAnswer || combinedText(flow) || "").trim();
    const extra = extraAnswers(flow);
    const photo = flow.photoUrl || flow.photoDraft || null;
    const choice = choicesOf(config).find((item) => item.id === flow.selectedId);
    const lastFollow = (tf.thinkingFriendTurns || []).slice(-1)[0] || {};
    const inputMode = inferResponseType(flow);
    const record = {
      activity: flow.activity,
      activityTitle: config.activityTitle || flow.activityTitle || "",
      activityId: tf.activityId || "",
      valueQuestion: config.valueQuestion || config.step1Question || tf.valueQuestion || "",
      selectedElement: flow.selectedId || "",
      selectedElementLabel: flow.selectedLabel || (choice && choice.label) || "",
      valueLabel: flow.valueLabel || (choice && choice.valueLabel) || flow.selectedLabel || "",
      initialAnswer,
      thinkingFriendTurns: (tf.thinkingFriendTurns || []).slice(),
      confirmedMeanings: Array.isArray(tf.confirmedMeanings) ? tf.confirmedMeanings.slice() : [],
      finalSummary: tf.finalSummary || "",
      finalAnswer,
      studentApproved: true,
      inputMode,
      reflectionText: finalAnswer,
      audioUrl: flow.audioUrl || null,
      photoUrl: photo,
      representativeImage: photo || "",
      responseType: inputMode,
      followUpQuestion: lastFollow.question || tf.question || "",
      followUpLabel: lastFollow.answer || tf.selectedLabel || "",
      extraAnswer: extra,
      summaryText: tf.finalSummary || finalAnswer || "",
      thinkFriend: { ...tf, initialAnswer, finalAnswer, studentApproved: true },
      status: "complete",
      createdAt: new Date().toISOString()
    };
    window.ValueGuardianBook.upsertRecord(st, record);
    flow.reflectionText = finalAnswer;
    flow.photoUrl = photo;
    flow.responseType = record.responseType;
    flow.status = "complete";
    flow.createdAt = record.createdAt;
    flow.step = "saved";
    flow.active = true;
    flow.pending = false;
    if (flow.activity === "hanok" && st.hanokExplorer) {
      const e = st.hanokExplorer;
      e.journalSaved = true;
      e.phase = "done";
      e.selectedHanokValue = flow.selectedId || e.selectedHanokValue;
      e.selectedHanokValueLabel = flow.selectedLabel || e.selectedHanokValueLabel;
      e.reflectionText = finalAnswer;
      e.createdAt = record.createdAt;
      e.journal = {
        activity: "hanok",
        selectedElement: flow.selectedId,
        selectedElementLabel: flow.selectedLabel,
        selectedHanokValue: flow.selectedId,
        selectedHanokValueLabel: flow.selectedLabel,
        valueLabel: record.valueLabel,
        valueQuestion: record.valueQuestion || "",
        initialAnswer,
        thinkingFriendTurns: (tf.thinkingFriendTurns || []).slice(),
        finalSummary: tf.finalSummary || "",
        finalAnswer,
        studentApproved: true,
        inputMode,
        thinkFriend: { ...tf, initialAnswer, finalAnswer, studentApproved: true },
        summaryText: tf.finalSummary || finalAnswer || "",
        reflectionText: finalAnswer,
        photoUrl: photo,
        audioUrl: flow.audioUrl || null,
        representativeImage: photo || "",
        createdAt: record.createdAt
      };
      if (st.solved) st.solved.hanok = true;
      if (st.hanok) st.hanok.complete = true;
    }
    save();
    if (_ctx && typeof _ctx.onReflectionSaved === "function") {
      _ctx.onReflectionSaved(flow.route, record);
    }
    paint();
  }

  function bind(flow, config) {
    const write = document.getElementById("vrfWriteInput");
    if (write) {
      write.addEventListener("input", () => {
        flow.writeDraft = write.value;
      });
    }

    const tfWrite = document.getElementById("vrfTfWriteInput");
    if (tfWrite) {
      tfWrite.addEventListener("input", () => {
        flow.tfDraft = tfWrite.value;
      });
    }

    const keep = document.getElementById("vrfKeepBtn");
    if (keep) {
      keep.onclick = () => {
        if (write) flow.writeDraft = write.value;
        playClick();
        goThinkFriend(flow);
      };
    }

    const retry = document.getElementById("vrfRetryBtn");
    if (retry) {
      retry.onclick = () => {
        playClick();
        startSpeechCapture(flow, "value");
      };
    }

    const tfKeep = document.getElementById("vrfTfKeepBtn");
    if (tfKeep) {
      tfKeep.onclick = () => {
        if (tfWrite) flow.tfDraft = tfWrite.value;
        const text = followUpText(flow);
        if (!text) return;
        playClick();
        pushFriendAnswer(flow, text, {
          source: "free_response",
          inputType: flow.tfVoiceDraft && text.indexOf(String(flow.tfVoiceDraft).trim()) >= 0 ? "voice" : "text"
        });
      };
    }

    const summaryRetry = document.getElementById("vrfSummaryRetryBtn");
    if (summaryRetry) {
      summaryRetry.onclick = () => {
        playClick();
        retrySummary(flow);
      };
    }

    const tfSpeak = document.getElementById("vrfTfSpeakBtn");
    if (tfSpeak) {
      tfSpeak.onclick = () => {
        playClick();
        startSpeechCapture(flow, "tf");
      };
    }

    document.querySelectorAll("[data-tf-id]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        const id = btn.getAttribute("data-tf-id") || "";
        const label = btn.getAttribute("data-tf-label") || "";
        flow.selectedId = id;
        flow.selectedLabel = label;
        flow.valueLabel = label;
        pushFriendAnswer(flow, label, { source: flow.thinkFriend && flow.thinkFriend.strategy === "confirm" ? "confirmed_meaning" : "choice", inputType: "choice" });
      };
    });

    const editBtn = document.getElementById("vrfEditBtn");
    if (editBtn) {
      editBtn.onclick = () => {
        playClick();
        if (!flow.thinkFriend) flow.thinkFriend = emptyThinkFriend(flow.activity);
        flow.thinkFriend.editingFinal = true;
        flow.tfFinalDraft = flow.thinkFriend.finalAnswer || flow.thinkFriend.finalSummary || flow.thinkFriend.initialAnswer || "";
        save();
        paint();
      };
    }

    const cancelEdit = document.getElementById("vrfCancelEditBtn");
    if (cancelEdit) {
      cancelEdit.onclick = () => {
        playClick();
        if (flow.thinkFriend) flow.thinkFriend.editingFinal = false;
        save();
        paint();
      };
    }

    const finalEdit = document.getElementById("vrfFinalEdit");
    if (finalEdit) {
      finalEdit.addEventListener("input", () => {
        flow.tfFinalDraft = finalEdit.value;
        if (flow.thinkFriend) flow.thinkFriend.finalAnswer = finalEdit.value;
      });
    }

    const saveBtn = document.getElementById("vrfSaveBtn");
    if (saveBtn) {
      saveBtn.onclick = () => {
        playClick();
        persistRecord(flow, config);
      };
    }

    const bookBtn = document.getElementById("vrfBookBtn");
    if (bookBtn) {
      bookBtn.onclick = () => {
        playClick();
        flow.active = false;
        flow.pending = false;
        save();
        if (_ctx && typeof _ctx.openValueBook === "function") _ctx.openValueBook(flow.activity);
      };
    }

    const nextAct = document.getElementById("vrfNextActBtn");
    if (nextAct) {
      nextAct.onclick = () => {
        playClick();
        flow.active = false;
        flow.pending = false;
        save();
        if (_ctx && typeof _ctx.goNextActivity === "function") _ctx.goNextActivity(flow.route);
      };
    }
  }

  // =====================================================================
  // 2차 설계안 (thinkfriend_questions_v2.docx)
  // 열기 → ① 사실적 → ② 개념적 → ③ 논쟁적·전이 → 정리(3문장) → 확인
  // 질문·보기: assets/js/thinking-friend-questions.js
  // =====================================================================
  const GUIDED_STEP_META = [
    { id: 1, label: "떠올리기" },
    { id: 2, label: "생각하기" },
    { id: 3, label: "나와 연결" },
    { id: 4, label: "정리" }
  ];

  function guidedEntry(flow) {
    const GQ = window.ThinkFriendQuestions;
    if (!GQ || !flow) return null;
    return GQ.get(flow.activity) || GQ.get(flow.route) || null;
  }

  function shuffled(list) {
    const arr = (list || []).slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function emptyAnswer() {
    return { picked: [], text: "", skipped: false, stuck: 0, offtopicUsed: false };
  }

  function ensureGuided(flow, entry) {
    if (flow.guided && flow.guided.v === 2 && flow.guided.entryId === entry.id) return flow.guided;
    const g = {
      v: 2,
      entryId: entry.id,
      idx: 0,
      answers: [emptyAnswer(), emptyAnswer(), emptyAnswer()],
      sel: [],
      extra: [[], [], []],
      order: [null, null, null],
      echo: "",
      prompt: "",
      showChoices: false,
      phase: "ask",
      summary: "",
      summarySource: "",
      finalDraft: ""
    };
    // 기록하기 전에 아이가 요소를 먼저 골랐다면(예: 한옥 탐험) ①을 건너뛴다
    const pre = String(flow.selectedLabel || "").trim();
    if (pre) {
      g.answers[0].picked = [pre];
      g.idx = 1;
      const GQ = window.ThinkFriendQuestions;
      g.echo = `${GQ ? GQ.withJosa(pre, "을") : pre} 골랐구나! 왜 그게 좋았는지 생각하면서 답해 봐.`;
    }
    flow.guided = g;
    flow.step = "guided";
    return g;
  }

  function stepChoices(g, entry) {
    const step = entry.steps[g.idx];
    if (!step) return [];
    if (!g.order[g.idx]) g.order[g.idx] = shuffled(step.choices);
    const extra = (g.extra[g.idx] || []).filter((e) => g.order[g.idx].indexOf(e) < 0);
    return g.order[g.idx].concat(extra);
  }

  function guidedStepNum(g) {
    if (!g) return 1;
    if (g.phase === "confirm" || g.phase === "edit" || g.phase === "summarizing") return 4;
    return Math.min(3, g.idx + 1);
  }

  function guidedStepperHTML(g) {
    const cur = guidedStepNum(g);
    return `
      <ol class="vrf-steps" aria-label="가치수호록">
        ${GUIDED_STEP_META.map((item) => {
          let cls = "vrf-step";
          if (item.id < cur) cls += " is-done";
          else if (item.id === cur) cls += " is-now";
          else cls += " is-todo";
          return `<li class="${cls}"><span class="vrf-step-num">${item.id}</span><span class="vrf-step-label">${item.label}</span></li>`;
        }).join("")}
      </ol>
    `;
  }

  function friendHeadHTML(line) {
    return `
      <header class="tf-friend">
        <span class="tf-face" aria-hidden="true">🐻</span>
        <div>
          <p class="tf-name">생각 친구</p>
          <p class="tf-hello">${escapeHtml(line)}</p>
        </div>
      </header>
    `;
  }

  function guidedHTML(flow, entry) {
    const g = ensureGuided(flow, entry);
    const GQ = window.ThinkFriendQuestions;
    if (g.phase === "loading") {
      return `${friendHeadHTML("음, 네 말을 잘 듣고 있어…")}<p class="vrf-soft">잠깐만 기다려 줘.</p>`;
    }
    if (g.phase === "summarizing") {
      return `${friendHeadHTML("네 생각을 정리하는 중이야…")}<p class="vrf-soft">잠깐만 기다려 줘.</p>`;
    }
    if (g.phase === "confirm") {
      return `
        ${friendHeadHTML("네 생각을 이렇게 적어 봤어. 이렇게 적을까?")}
        <p class="vrf-kicker">핵심 질문</p>
        <h2 class="vrf-title">${escapeHtml(entry.core)}</h2>
        <p class="tf-summary sent-lines">${escapeHtml(g.summary)}</p>
        <div class="vrf-actions vrf-actions--pair">
          <button type="button" class="vrf-btn vrf-btn--save" id="vrfGOkBtn">👍 좋아</button>
          <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfGEditBtn">✏️ 고칠래</button>
        </div>
      `;
    }
    if (g.phase === "edit") {
      return `
        ${friendHeadHTML("내 말로 고쳐 써 봐.")}
        <p class="vrf-kicker">핵심 질문</p>
        <h2 class="vrf-title">${escapeHtml(entry.core)}</h2>
        <textarea id="vrfGFinalEdit" class="vrf-textarea" rows="4" maxlength="200">${escapeHtml(g.finalDraft || g.summary)}</textarea>
        <div class="vrf-actions vrf-actions--pair">
          <button type="button" class="vrf-btn vrf-btn--save" id="vrfGSaveEditBtn">이대로 저장</button>
          <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfGBackBtn">다시 보기</button>
        </div>
      `;
    }
    // phase: ask
    const step = entry.steps[g.idx];
    let hello = "";
    if (g.prompt) hello = g.prompt;
    else if (g.echo) hello = g.echo;
    else if (g.idx === 0) hello = `활동 시작할 때 '${entry.core.split("\n")[0]}' 궁금했지? 같이 생각해 보자!`;
    else hello = "좋아, 다음 질문이야!";
    const choices = stepChoices(g, entry);
    const listening = !!flow.listening;
    const said = String(flow.tfVoiceDraft || "").trim();
    let voiceBody = "";
    if (listening) voiceBody = `<p class="vrf-listen">듣고 있어요...</p>`;
    else if (said) voiceBody = `<p class="vrf-voice-result">${escapeHtml(said)}</p>`;
    else if (flow.voiceError) voiceBody = `<p class="vrf-soft">지금은 말을 듣지 못했어요. 글로 적어도 괜찮아요.</p>`;
    const speakLabel = listening ? "듣고 있어요..." : (said ? "다시 말하기" : "🎤 말로 답하기");
    const stepLabel = (GQ && GQ.STEP_LABELS && GQ.STEP_LABELS[step.type]) || "";
    const head = `
      ${friendHeadHTML(hello)}
      <p class="vrf-kicker">${escapeHtml(stepLabel)} <button type="button" class="vrf-g-speak" id="vrfGReadBtn" aria-label="읽어 주기">🔊</button></p>
      <h2 class="vrf-title">${escapeHtml(step.q)}</h2>
    `;
    // 처음에는 자유롭게 대답하고, [🙋 도와줘요]를 누르면 보기가 나온다
    if (!g.showChoices) {
      return `
        ${head}
        <div class="vrf-g-free">
          <textarea id="vrfTfWriteInput" class="vrf-textarea" rows="3" maxlength="160" placeholder="생각나는 대로 적거나 말해 보세요.">${escapeHtml(flow.tfDraft || "")}</textarea>
          ${voiceBody}
          <div class="vrf-actions vrf-actions--pair">
            <button type="button" class="vrf-btn vrf-btn--next" id="vrfGFreeBtn">이대로</button>
            <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfTfSpeakBtn" ${listening ? "disabled" : ""}>${speakLabel}</button>
          </div>
        </div>
        <div class="vrf-actions">
          <button type="button" class="vrf-btn vrf-btn--help" id="vrfGHelpBtn">🙋 도와줘요</button>
        </div>
      `;
    }
    return `
      ${head}
      <p class="vrf-soft vrf-g-hint">이 중에 골라 볼래? 여러 개 골라도 돼요.</p>
      <div class="vrf-choices">
        ${choices.map((label) => `<button type="button" class="vrf-choice${g.sel.indexOf(label) >= 0 ? " is-on" : ""}" data-g-choice="${escapeHtml(label)}">${escapeHtml(label)}</button>`).join("")}
        <button type="button" class="vrf-choice vrf-choice--free" id="vrfGFreeToggle">✏️ 내 생각 말하기</button>
      </div>
      <div class="vrf-actions">
        <button type="button" class="vrf-btn vrf-btn--next" id="vrfGNextBtn" ${g.sel.length ? "" : "disabled"}>다 골랐어</button>
      </div>
    `;
  }

  function postJsonTimeout(url, body, ms) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), ms) : null;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller ? controller.signal : undefined
    }).then((res) => {
      if (!res.ok) throw new Error("http_" + res.status);
      return res.json();
    }).finally(() => { if (timer) clearTimeout(timer); });
  }

  // 서버에 닿지 않을 때 쓰는 간단한 판단
  function localReact(picked, text) {
    const t = String(text || "").replace(/[.!?~]+/g, "").trim();
    if (!picked.length) {
      if (!t || /^(몰라|몰라요|모르겠어요?|잘 ?모르겠어요?|그냥|그냥요|글쎄요?|없어요?)$/.test(t)) {
        return { kind: "unsure", followUp: "괜찮아! 그럼 이 중에 골라 볼래?" };
      }
      if (/^(너무 |정말 |진짜 )?(좋았어요?|좋아요?|재밌었어요?|재미있었어요?|재밌어요?|예뻤어요?|예뻐요?)$/.test(t)) {
        return { kind: "bare", followUp: /재미|재밌/.test(t) ? "우와! 어떤 게 제일 재밌었어?" : "우와! 어떤 게 제일 좋았어?" };
      }
    }
    return { kind: "answer", echo: picked.length ? "잘 골랐어!" : "그렇구나! 좋은 생각이야!" };
  }

  function guidedAdvance(flow, entry, echo, extraChoice) {
    const g = flow.guided;
    g.idx += 1;
    g.sel = [];
    g.showChoices = false;
    g.prompt = "";
    g.echo = echo || "";
    flow.tfDraft = "";
    flow.tfVoiceDraft = "";
    if (g.idx < entry.steps.length && extraChoice) {
      if (!g.extra[g.idx]) g.extra[g.idx] = [];
      if (g.extra[g.idx].indexOf(extraChoice) < 0) g.extra[g.idx].push(extraChoice);
    }
    if (g.idx >= entry.steps.length) {
      guidedSummarize(flow, entry);
      return;
    }
    g.phase = "ask";
    save();
    paint();
  }

  function guidedSubmit(flow, entry, picked, text) {
    const g = flow.guided;
    const idx = g.idx;
    const a = g.answers[idx];
    g.phase = "loading";
    stopSpeech();
    save();
    paint();
    postJsonTimeout("/api/thinking-friend/guided/react", {
      activityId: entry.id,
      stepIndex: idx,
      picked,
      text
    }, 9000).catch(() => localReact(picked, text)).then((r) => {
      r = r || {};
      const kind = r.kind || "answer";
      if (kind === "answer") {
        a.picked = picked.slice();
        a.text = text || "";
        a.skipped = false;
        guidedAdvance(flow, entry, r.echo || "", r.extraChoice || "");
        return;
      }
      // 막힘: 몰라 / 한 단어 / 엉뚱한 답
      a.stuck += 1;
      if (kind === "offtopic") a.offtopicUsed = true;
      if (a.stuck >= 2) {
        a.skipped = true;
        guidedAdvance(flow, entry, "괜찮아! 다음 질문으로 가 보자.", "");
        return;
      }
      g.phase = "ask";
      g.sel = [];
      // 몰라 / 한 단어 답 → 보기를 바로 보여 준다. 엉뚱한 답 → 다시 자유롭게 말해 보게 한다
      g.showChoices = kind !== "offtopic";
      g.order[idx] = shuffled(entry.steps[idx].choices);
      g.prompt = r.followUp || "괜찮아! 그럼 이 중에 골라 볼래?";
      flow.tfDraft = "";
      flow.tfVoiceDraft = "";
      save();
      paint();
    });
  }

  function guidedSummarize(flow, entry) {
    const g = flow.guided;
    const GQ = window.ThinkFriendQuestions;
    g.phase = "summarizing";
    save();
    paint();
    const answers = g.answers.map((a) => ({ picked: a.picked, text: a.text, skipped: a.skipped }));
    postJsonTimeout("/api/thinking-friend/guided/summary", { activityId: entry.id, answers }, 30000)
      .catch(() => ({ summary: GQ.composeSummary(entry, answers), summarySource: "client_template" }))
      .then((r) => {
        g.summary = String((r && r.summary) || GQ.composeSummary(entry, answers)).trim();
        g.summarySource = (r && r.summarySource) || "";
        _lastSummaryPath = g.summarySource;
        g.finalDraft = g.summary;
        g.phase = "confirm";
        save();
        paint();
      });
  }

  function guidedPersist(flow, entry, finalText, edited) {
    const g = flow.guided;
    const config = Object.assign({}, getConfig(flow.activity) || HANOK_REFLECTION_CONFIG, {
      valueQuestion: entry.core,
      step1Question: entry.core
    });
    const tf = flow.thinkFriend || emptyThinkFriend(flow.activity, entry.core);
    const turns = entry.steps.map((step, i) => {
      const a = g.answers[i] || {};
      const answer = a.skipped ? "" : [((a.picked || []).join(", ")), String(a.text || "").trim()].filter(Boolean).join(" / ");
      return {
        strategy: step.type,
        question: step.q,
        answer,
        picked: (a.picked || []).slice(),
        inputType: a.text ? "text" : "choice",
        source: a.text ? "free_response" : "choice",
        skipped: !!a.skipped
      };
    });
    tf.valueQuestion = entry.core;
    tf.initialAnswer = turns[0] ? turns[0].answer : "";
    tf.thinkingFriendTurns = turns;
    tf.finalSummary = g.summary;
    tf.action = "FINISH";
    tf.strategy = "finish";
    tf.editingFinal = !!edited;
    tf.finalAnswer = finalText;
    tf.guided = { answers: g.answers, summarySource: g.summarySource };
    flow.thinkFriend = tf;
    flow.tfFinalDraft = edited ? finalText : "";
    if (edited) _lastSummaryPath = "student_edited";
    if (!flow.selectedLabel && turns[0] && turns[0].answer) {
      flow.selectedLabel = (g.answers[0].picked || [])[0] || turns[0].answer;
      flow.valueLabel = flow.selectedLabel;
    }
    persistRecord(flow, config);
  }

  function speakText(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ko-KR";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  function bindGuided(flow, entry) {
    const g = flow.guided;
    if (!g) return;
    document.querySelectorAll("[data-g-choice]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        const label = btn.getAttribute("data-g-choice") || "";
        const i = g.sel.indexOf(label);
        if (i >= 0) g.sel.splice(i, 1);
        else g.sel.push(label);
        save();
        paint();
      };
    });
    const next = document.getElementById("vrfGNextBtn");
    if (next) {
      next.onclick = () => {
        if (!g.sel.length) return;
        playClick();
        guidedSubmit(flow, entry, g.sel.slice(), "");
      };
    }
    const freeToggle = document.getElementById("vrfGFreeToggle");
    if (freeToggle) {
      freeToggle.onclick = () => {
        playClick();
        g.showChoices = false;
        g.sel = [];
        save();
        paint();
        const ta = document.getElementById("vrfTfWriteInput");
        if (ta) ta.focus();
      };
    }
    const help = document.getElementById("vrfGHelpBtn");
    if (help) {
      help.onclick = () => {
        playClick();
        g.showChoices = true;
        g.prompt = "좋아, 도와줄게! 이 중에 네 생각과 비슷한 걸 골라 봐.";
        save();
        paint();
      };
    }
    const tfWrite = document.getElementById("vrfTfWriteInput");
    if (tfWrite) tfWrite.addEventListener("input", () => { flow.tfDraft = tfWrite.value; });
    const freeBtn = document.getElementById("vrfGFreeBtn");
    if (freeBtn) {
      freeBtn.onclick = () => {
        if (tfWrite) flow.tfDraft = tfWrite.value;
        const text = followUpText(flow);
        if (!text) return;
        playClick();
        guidedSubmit(flow, entry, g.sel.slice(), text);
      };
    }
    const speak = document.getElementById("vrfTfSpeakBtn");
    if (speak) {
      speak.onclick = () => {
        playClick();
        startSpeechCapture(flow, "tf");
      };
    }
    const read = document.getElementById("vrfGReadBtn");
    if (read) {
      read.onclick = () => {
        const step = entry.steps[g.idx];
        if (!step) return;
        speakText(`${step.q} ${stepChoices(g, entry).join(", ")}`);
      };
    }
    const ok = document.getElementById("vrfGOkBtn");
    if (ok) {
      ok.onclick = () => {
        playClick();
        guidedPersist(flow, entry, g.summary, false);
      };
    }
    const edit = document.getElementById("vrfGEditBtn");
    if (edit) {
      edit.onclick = () => {
        playClick();
        g.phase = "edit";
        g.finalDraft = g.finalDraft || g.summary;
        save();
        paint();
      };
    }
    const finalEdit = document.getElementById("vrfGFinalEdit");
    if (finalEdit) finalEdit.addEventListener("input", () => { g.finalDraft = finalEdit.value; });
    const saveEdit = document.getElementById("vrfGSaveEditBtn");
    if (saveEdit) {
      saveEdit.onclick = () => {
        if (finalEdit) g.finalDraft = finalEdit.value;
        const text = String(g.finalDraft || "").trim();
        if (!text) return;
        playClick();
        guidedPersist(flow, entry, text, text !== g.summary);
      };
    }
    const back = document.getElementById("vrfGBackBtn");
    if (back) {
      back.onclick = () => {
        playClick();
        g.phase = "confirm";
        save();
        paint();
      };
    }
  }

  function paint() {
    const st = getState();
    const flow = st && st.valueReflection;
    if (!_appEl || !flow || !flow.active) return;
    migrateLegacyStep(flow);
    const config = getConfig(flow.activity) || HANOK_REFLECTION_CONFIG;
    const entry = flow.step === "saved" ? null : guidedEntry(flow);
    if (entry) {
      const body = guidedHTML(flow, entry);
      const innerG = `
        <div class="vrf-screen vrf-screen--guided" id="valueReflectionFlow">
          ${guidedStepperHTML(flow.guided)}
          <div class="vrf-card">${body}</div>
        </div>
      `;
      if (_ctx && typeof _ctx.sceneTemplate === "function") {
        _appEl.innerHTML = _ctx.sceneTemplate("가치수호록 만들기", innerG);
      } else {
        _appEl.innerHTML = innerG;
      }
      bind(flow, config);
      bindGuided(flow, entry);
      return;
    }
    const inner = `
      <div class="vrf-screen" id="valueReflectionFlow">
        ${flow.step === "saved" ? "" : stepperHTML(flow)}
        <div class="vrf-card">${bodyHTML(flow, config)}</div>
      </div>
    `;
    if (_ctx && typeof _ctx.sceneTemplate === "function") {
      _appEl.innerHTML = _ctx.sceneTemplate("가치수호록 만들기", inner);
    } else {
      _appEl.innerHTML = inner;
    }
    bind(flow, config);
  }

  window.ValueReflectionFlow = {
    HANOK_REFLECTION_CONFIG,
    CONFIGS,
    render(app, ctx) {
      _ctx = ctx || null;
      _appEl = app;
      stopAll();
      const st = getState();
      if (!st || !st.valueReflection) return;
      st.valueReflection.active = true;
      st.valueReflection.pending = false;
      paint();
    },
    stop: stopAll,
    createDefaultState,
    getConfig,
    getThinkFriend,
    getPack: packOf,
    activityKeyForRoute,
    routeForActivity,
    isActive(st) {
      return !!(st && st.valueReflection && st.valueReflection.active);
    }
  };
})();
