/**
 * STAGE 2-2 한옥 탐방 확장 — 시작(전경·대문) + 3단계 비교·가치 수호록
 *
 * 1~2단계 공간/세부 탐방은 기존 HanokTour에 맡기고,
 * 이 모듈은 인트로와 한옥 만들기 이후의 비교·판단·표현만 담당한다.
 *
 * app.js: window.HanokExplorer = { render, stop, createDefaultState, shouldHandle }
 */
(function () {
  "use strict";

  const IMG_VER = "1";
  const IMG = (file) => String(`assets/hanok/${file}?v=${IMG_VER}`).replace(/\.(png|jpe?g)(\?[^#]*)?$/i, ".webp$2");
  const TRANSITION_MS = 420;

  const GATE_HOTSPOT = { left: 42, top: 42, width: 18, height: 38 };

  const COMPARE_STEPS = [
    {
      id: "compare-ondol",
      question: "옛날 한옥과 오늘날의 집은 어떻게 바닥을 따뜻하게 할까요?",
      left: {
        src: "hanok-11-ondol.png",
        title: "한옥",
        body: "아궁이의 열이 방바닥 아래를 지나갔어요."
      },
      right: {
        src: "hanok-17-modern-floor-heating.png",
        title: "오늘날",
        body: "바닥 아래의 난방 배관이나 열선으로 바닥을 따뜻하게 해요."
      },
      note: "방법은 달라졌지만 바닥을 따뜻하게 한다는 생각은 이어지고 있어요."
    },
    {
      id: "compare-window",
      question: "두 창문은 무엇이 같고 무엇이 다를까요?",
      left: {
        src: "hanok-10-hanji-window.png",
        title: "한옥",
        body: "창호지<br>빛이 부드럽게 들어옴"
      },
      right: {
        src: "hanok-18-glass-window.png",
        title: "오늘날",
        body: "유리창<br>밖을 선명하게 볼 수 있음"
      },
      note: ""
    },
    {
      id: "compare-material",
      question: "한옥과 오늘날의 집은 무엇으로 만들었을까요?",
      left: {
        src: "hanok-12-hwangto-wall.png",
        title: "한옥",
        body: "나무 · 흙 · 돌"
      },
      right: {
        src: "hanok-19-modern-structure.png",
        title: "오늘날",
        body: "콘크리트 · 철 · 유리 등<br>여러 재료를 사용해요."
      },
      note: "한옥에는 자연에서 얻은 재료가 많이 사용되었어요."
    }
  ];

  const VALUE_CHOICES = [
    { id: "ondol", label: "따뜻한 온돌" },
    { id: "maru", label: "시원한 마루" },
    { id: "hanji", label: "은은한 창호지" },
    { id: "nature", label: "자연에서 얻은 재료" },
    { id: "giwa", label: "아름다운 기와지붕" }
  ];

  const REASON_CHIPS = [
    "따뜻해서",
    "시원해서",
    "아름다워서",
    "자연과 가까워서",
    "편리해서",
    "마음에 들어서"
  ];

  const COMPARE_PHASES = COMPARE_STEPS.map((s) => s.id);

  let _ctx = null;
  let _appEl = null;
  let _root = null;
  let timers = [];
  let resizeObs = null;
  let transitioning = false;
  let recognition = null;

  const $ = (sel) => (_root ? _root.querySelector(sel) : null);

  function later(fn, ms) {
    const t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  }

  function playClick() {
    if (_ctx && _ctx.playSound) _ctx.playSound("click.mp3");
  }

  function createDefaultState() {
    return {
      phase: "exterior",
      selectedHanokValue: "",
      selectedHanokValueLabel: "",
      wantText: "",
      reasonText: "",
      reflectionText: "",
      journalSaved: false,
      createdAt: null
    };
  }

  function explorerState() {
    if (!_ctx) return createDefaultState();
    const s = _ctx.getState();
    if (!s.hanokExplorer) s.hanokExplorer = createDefaultState();
    const e = s.hanokExplorer;
    if (!e.phase) e.phase = "exterior";
    if (typeof e.journalSaved !== "boolean") e.journalSaved = false;
    return e;
  }

  function save() {
    if (_ctx && _ctx.saveProgress) _ctx.saveProgress();
  }

  function setPhase(phase) {
    const e = explorerState();
    e.phase = phase;
    save();
  }

  function syncImageLayer() {
    const img = $(".ht-img");
    const layer = $("#htLayer");
    const stage = $(".ht-stage");
    if (!img || !layer || !stage) return;
    const sr = stage.getBoundingClientRect();
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh || sr.width < 2 || sr.height < 2) return;
    const scale = Math.min(sr.width / nw, sr.height / nh);
    const w = nw * scale;
    const h = nh * scale;
    layer.style.width = `${w}px`;
    layer.style.height = `${h}px`;
    layer.style.left = `${(sr.width - w) / 2}px`;
    layer.style.top = `${(sr.height - h) / 2}px`;
  }

  function watchLayer() {
    const img = $(".ht-img");
    const stage = $(".ht-stage");
    if (img) {
      const onReady = () => syncImageLayer();
      if (img.complete && img.naturalWidth) onReady();
      else {
        img.addEventListener("load", onReady, { once: true });
        img.addEventListener("error", () => later(onReady, 30), { once: true });
      }
    }
    window.addEventListener("resize", syncImageLayer);
    window.addEventListener("orientationchange", () => later(syncImageLayer, 120));
    if (resizeObs) resizeObs.disconnect();
    if (stage && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(() => syncImageLayer());
      resizeObs.observe(stage);
    }
  }

  function stopAll() {
    timers.forEach(clearTimeout);
    timers = [];
    transitioning = false;
    try { if (recognition) recognition.stop(); } catch (_) {}
    recognition = null;
    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }
    window.removeEventListener("resize", syncImageLayer);
    window.removeEventListener("orientationchange", syncImageLayer);
  }

  function ensureShell(help) {
    let host = document.getElementById("hanok-explorer");
    if (host && _appEl.contains(host)) {
      _root = host;
      return host;
    }
    if (_ctx && _ctx.sceneTemplate) {
      _appEl.innerHTML = _ctx.sceneTemplate(
        "STAGE 2-2 한옥 세우기",
        `<div id="hanok-explorer" class="ht-root he-root"></div>`
      );
      if (_ctx.setupNavigationAndHelp) {
        _ctx.setupNavigationAndHelp(help || "한옥을 천천히 살펴보세요.");
      }
      host = _appEl.querySelector("#hanok-explorer");
    } else {
      host = _appEl;
      host.id = "hanok-explorer";
      host.classList.add("ht-root", "he-root");
    }
    _root = host;
    return host;
  }

  function goPhase(next, opts) {
    if (transitioning) return;
    opts = opts || {};
    const scene = $(".ht-scene") || $(".he-panel");
    const run = () => {
      transitioning = false;
      setPhase(next);
      paint({ entering: true });
    };
    if (!scene || opts.instant) {
      run();
      return;
    }
    transitioning = true;
    scene.classList.add("is-out");
    later(run, TRANSITION_MS);
  }

  function applyEnterAnim() {
    const scene = $(".ht-scene") || $(".he-panel");
    if (!scene) return;
    scene.classList.add("is-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scene.classList.remove("is-enter"));
    });
  }

  function introHTML(file, alt, overlay) {
    return `
      <div class="ht-scene he-intro" data-phase="${explorerState().phase}">
        <div class="ht-stage" id="htStage">
          <img class="ht-img" src="${IMG(file)}" alt="${alt}" draggable="false" />
          <div class="ht-layer" id="htLayer">${overlay}</div>
        </div>
      </div>
    `;
  }

  function exteriorHTML() {
    return introHTML(
      "hanok-01-exterior.png",
      "대문 밖 한옥 전경",
      `
        <div class="ht-ask">
          <p class="ht-ask-q">한옥은 어떤 모습일까요?</p>
        </div>
        <div class="ht-nav">
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heEnterBtn">한옥 안으로 들어가 볼까요?</button>
        </div>
      `
    );
  }

  function gateHTML() {
    return introHTML(
      "hanok-02-gate.png",
      "한옥 대문",
      `
        <button type="button" class="ht-door he-gate-hotspot" id="heGateHotspot"
          style="left:${GATE_HOTSPOT.left}%;top:${GATE_HOTSPOT.top}%;width:${GATE_HOTSPOT.width}%;height:${GATE_HOTSPOT.height}%"
          aria-label="대문 열기"></button>
        <div class="ht-modal hidden" id="heGateModal" hidden></div>
      `
    );
  }

  function bindExterior() {
    const btn = $("#heEnterBtn");
    if (btn) btn.onclick = () => {
      playClick();
      goPhase("gate");
    };
  }

  function bindGate() {
    const hot = $("#heGateHotspot");
    if (hot) hot.onclick = () => {
      playClick();
      openGateCard();
    };
  }

  function showModal(modal, html) {
    if (!modal) return;
    modal.innerHTML = html;
    modal.hidden = false;
    modal.classList.remove("hidden");
  }

  function hideModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    modal.classList.add("hidden");
    modal.innerHTML = "";
  }

  function openGateCard() {
    const modal = $("#heGateModal");
    showModal(modal, `
      <div class="ht-card" role="dialog" aria-labelledby="heGateTitle">
        <p class="ht-card-title" id="heGateTitle">대문을 열어 볼까요?</p>
        <button type="button" class="ht-text-btn ht-text-btn--accent" id="heGateEnter">들어가기</button>
        <button type="button" class="ht-text-btn ht-text-btn--quiet" id="heGateClose">닫기</button>
      </div>
    `);
    const enter = $("#heGateEnter");
    const close = $("#heGateClose");
    if (enter) enter.onclick = () => {
      playClick();
      hideModal(modal);
      startExploring();
    };
    if (close) close.onclick = () => hideModal(modal);
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) hideModal(modal);
      };
    }
  }

  function startExploring() {
    setPhase("exploring");
    if (_ctx && typeof _ctx.startExploring === "function") {
      _ctx.startExploring();
      return;
    }
    paint();
  }

  function bridgeHTML() {
    return `
      <div class="he-panel">
        <div class="ht-card he-flow-card">
          <p class="ht-card-title">한옥을 모두 살펴보았어요!</p>
          <p class="ht-card-body">한옥에는 어떤 생활의 지혜가 숨어 있었을까요?</p>
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heStartCompare">오늘날의 집과 비교해 볼까요?</button>
        </div>
      </div>
    `;
  }

  function compareHTML(step) {
    return `
      <div class="he-panel">
        <p class="he-q">${step.question}</p>
        <div class="he-compare">
          <article class="he-compare-card">
            <img src="${IMG(step.left.src)}" alt="${step.left.title}" />
            <p class="he-compare-title">${step.left.title}</p>
            <p class="he-compare-body">${step.left.body}</p>
          </article>
          <article class="he-compare-card">
            <img src="${IMG(step.right.src)}" alt="${step.right.title}" />
            <p class="he-compare-title">${step.right.title}</p>
            <p class="he-compare-body">${step.right.body}</p>
          </article>
        </div>
        ${step.note ? `<p class="he-note">${step.note}</p>` : ""}
        <div class="ht-nav he-flow-nav">
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heNextBtn">다음</button>
        </div>
      </div>
    `;
  }

  function modernHTML() {
    return `
      <div class="he-panel">
        <p class="he-q">한옥과 오늘날 우리가 사는 집은 어떤 점이 비슷하고 다를까요?</p>
        <div class="he-single-img">
          <img src="${IMG("hanok-16-modern-home.png")}" alt="오늘날의 집" />
        </div>
        <p class="he-note">천천히 살펴보며 생각해 보세요.</p>
        <div class="ht-nav he-flow-nav">
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heNextBtn">다음</button>
        </div>
      </div>
    `;
  }

  function chooseHTML() {
    const e = explorerState();
    const cards = VALUE_CHOICES.map((c) => `
      <button type="button" class="he-choice${e.selectedHanokValue === c.id ? " is-on" : ""}" data-value="${c.id}">
        ${c.label}
      </button>
    `).join("");
    return `
      <div class="he-panel">
        <p class="he-q">내가 살 집에 한옥의 한 가지를 넣는다면 무엇을 고르고 싶나요?</p>
        <div class="he-choices">${cards}</div>
        <div class="ht-nav he-flow-nav">
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heNextBtn" ${e.selectedHanokValue ? "" : "disabled"}>다음</button>
        </div>
      </div>
    `;
  }

  function reflectHTML() {
    const e = explorerState();
    const label = e.selectedHanokValueLabel || "한옥의 지혜";
    const chips = REASON_CHIPS.map((w) =>
      `<button type="button" class="he-chip" data-chip="${w}">${w}</button>`
    ).join("");
    const canTalk = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    return `
      <div class="he-panel">
        <p class="he-q">왜 그것을 우리 집에 넣고 싶나요?</p>
        <label class="he-field">
          <span>나는 ______을 넣고 싶어요.</span>
          <input type="text" id="heWantInput" class="he-input" maxlength="40" value="${escapeAttr(e.wantText || `나는 ${label}을 넣고 싶어요.`)}" />
        </label>
        <label class="he-field">
          <span>왜냐하면 ______ 때문이에요.</span>
          <input type="text" id="heReasonInput" class="he-input" maxlength="40" value="${escapeAttr(e.reasonText || "")}" placeholder="이유를 적어 보세요" />
        </label>
        <div class="he-chips">${chips}</div>
        ${canTalk ? `<button type="button" class="ht-text-btn he-mic" id="heMicBtn">말로 말하기</button>` : ""}
        <div class="ht-nav he-flow-nav">
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heNextBtn">다음</button>
        </div>
      </div>
    `;
  }

  function journalHTML() {
    const e = explorerState();
    return `
      <div class="he-panel">
        <div class="ht-card he-flow-card">
          <p class="ht-card-title">나의 한옥 생각</p>
          <p class="he-journal-label">내가 고른 한옥의 지혜</p>
          <p class="he-journal-value">${escapeHtml(e.selectedHanokValueLabel || "")}</p>
          <p class="he-journal-label">나의 생각</p>
          <p class="he-journal-value">${escapeHtml(e.reflectionText || "")}</p>
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="heSaveBtn">${e.journalSaved ? "확인" : "가치 수호록에 담기"}</button>
        </div>
      </div>
    `;
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function escapeAttr(text) {
    return escapeHtml(text);
  }

  function bindBridge() {
    const btn = $("#heStartCompare");
    if (btn) btn.onclick = () => {
      playClick();
      goPhase("compare-ondol");
    };
  }

  function nextAfterCompare(currentId) {
    const idx = COMPARE_PHASES.indexOf(currentId);
    if (idx < COMPARE_PHASES.length - 1) goPhase(COMPARE_PHASES[idx + 1]);
    else goPhase("modern");
  }

  function bindCompare(step) {
    const btn = $("#heNextBtn");
    if (btn) btn.onclick = () => {
      playClick();
      nextAfterCompare(step.id);
    };
  }

  function bindModern() {
    const btn = $("#heNextBtn");
    if (btn) btn.onclick = () => {
      playClick();
      goPhase("choose");
    };
  }

  function bindChoose() {
    _root.querySelectorAll(".he-choice").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        const id = btn.getAttribute("data-value");
        const found = VALUE_CHOICES.find((c) => c.id === id);
        const e = explorerState();
        e.selectedHanokValue = id;
        e.selectedHanokValueLabel = found ? found.label : "";
        e.wantText = found ? `나는 ${found.label}을 넣고 싶어요.` : "";
        save();
        paint();
      };
    });
    const next = $("#heNextBtn");
    if (next) next.onclick = () => {
      if (!explorerState().selectedHanokValue) return;
      playClick();
      setPhase("reflect");
      if (_ctx && typeof _ctx.beginValueReflection === "function") {
        _ctx.beginValueReflection("stage2_a2");
        return;
      }
      goPhase("reflect");
    };
  }

  function bindReflect() {
    const want = $("#heWantInput");
    const reason = $("#heReasonInput");
    const e = explorerState();
    const syncFields = () => {
      e.wantText = want ? want.value.trim() : "";
      e.reasonText = reason ? reason.value.trim() : "";
    };
    if (want) want.addEventListener("input", syncFields);
    if (reason) reason.addEventListener("input", syncFields);
    _root.querySelectorAll(".he-chip").forEach((chip) => {
      chip.onclick = () => {
        playClick();
        const word = chip.getAttribute("data-chip") || "";
        if (!reason) return;
        const cur = reason.value.trim();
        reason.value = cur ? `${cur} ${word}` : word;
        syncFields();
      };
    });
    const mic = $("#heMicBtn");
    if (mic) mic.onclick = () => startSpeech(reason);
    const next = $("#heNextBtn");
    if (next) next.onclick = () => {
      syncFields();
      const wantLine = e.wantText || (e.selectedHanokValueLabel ? `나는 ${e.selectedHanokValueLabel}을 넣고 싶어요.` : "");
      const reasonLine = e.reasonText ? `왜냐하면 ${e.reasonText} 때문이에요.` : "";
      e.reflectionText = [wantLine, reasonLine].filter(Boolean).join(" ");
      save();
      playClick();
      goPhase("journal");
    };
  }

  function startSpeech(input) {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec || !input) return;
    try { if (recognition) recognition.stop(); } catch (_) {}
    recognition = new Rec();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (ev) => {
      const said = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
      if (!said) return;
      const cur = input.value.trim();
      input.value = cur ? `${cur} ${said}` : said;
      input.dispatchEvent(new Event("input"));
    };
    recognition.onerror = () => {};
    try { recognition.start(); } catch (_) {}
  }

  function bindJournal() {
    const btn = $("#heSaveBtn");
    if (!btn) return;
    btn.onclick = () => {
      playClick();
      const e = explorerState();
      if (e.journalSaved) return;
      e.journalSaved = true;
      e.createdAt = new Date().toISOString();
      e.phase = "done";
      e.journal = {
        activity: "hanok",
        selectedHanokValue: e.selectedHanokValue,
        selectedHanokValueLabel: e.selectedHanokValueLabel,
        reflectionText: e.reflectionText,
        createdAt: e.createdAt
      };
      const st = _ctx ? _ctx.getState() : null;
      if (st) {
        if (st.solved) st.solved.hanok = true;
        if (st.hanok) st.hanok.complete = true;
      }
      save();
      if (window.ValueGuardianBook?.syncFromState && st) {
        window.ValueGuardianBook.syncFromState(st);
      }
      if (_ctx && typeof _ctx.finishHanok === "function") {
        _ctx.finishHanok();
        return;
      }
      paint();
    };
  }

  function paint(opts) {
    const phase = explorerState().phase;
    const helpMap = {
      exterior: "한옥의 모습을 살펴보고 안으로 들어가 보세요.",
      gate: "대문을 눌러 한옥 안으로 들어가 보세요.",
      bridge: "한옥에서 발견한 지혜를 오늘날의 집과 비교해 봅시다.",
      modern: "한옥과 오늘날의 집을 천천히 비교해 보세요.",
      choose: "우리 집에 넣고 싶은 한옥의 지혜를 하나 골라 보세요.",
      reflect: "왜 그것을 넣고 싶은지 말해 보세요.",
      journal: "나의 한옥 생각을 가치 수호록에 담아 보세요."
    };
    const host = ensureShell(helpMap[phase] || "한옥과 오늘날의 집을 비교해 보세요.");
    if (phase === "exterior") host.innerHTML = exteriorHTML();
    else if (phase === "gate") host.innerHTML = gateHTML();
    else if (phase === "bridge") host.innerHTML = bridgeHTML();
    else if (phase === "modern") host.innerHTML = modernHTML();
    else if (phase === "choose") host.innerHTML = chooseHTML();
    else if (phase === "reflect") host.innerHTML = reflectHTML();
    else if (phase === "journal" || phase === "done") host.innerHTML = journalHTML();
    else {
      const step = COMPARE_STEPS.find((s) => s.id === phase);
      host.innerHTML = step ? compareHTML(step) : bridgeHTML();
    }

    if (phase === "exterior") bindExterior();
    else if (phase === "gate") bindGate();
    else if (phase === "bridge") bindBridge();
    else if (phase === "modern") bindModern();
    else if (phase === "choose") bindChoose();
    else if (phase === "reflect") bindReflect();
    else if (phase === "journal" || phase === "done") bindJournal();
    else {
      const step = COMPARE_STEPS.find((s) => s.id === phase);
      if (step) bindCompare(step);
    }

    if (phase === "exterior" || phase === "gate") watchLayer();
    if (opts && opts.entering) applyEnterAnim();
  }

  function shouldHandle(state) {
    if (!state) return false;
    const e = state.hanokExplorer;
    if (!e) return true;
    const phase = e.phase || "exterior";
    if (phase === "exploring" || phase === "building") return false;
    return true;
  }

  window.HanokExplorer = {
    render(app, ctx) {
      _ctx = ctx || null;
      _appEl = app;
      stopAll();
      const e = explorerState();
      if (e.phase === "exploring" && _ctx && typeof _ctx.startExploring === "function") {
        _ctx.startExploring();
        return;
      }
      if (e.phase === "building" && _ctx && typeof _ctx.startBuilding === "function") {
        _ctx.startBuilding();
        return;
      }
      paint({ entering: true });
    },
    stop: stopAll,
    createDefaultState,
    shouldHandle
  };
})();
