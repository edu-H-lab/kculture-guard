/**
 * 나의 가치수호책
 *
 * 각 활동의 가치수호록을 책처럼 모아 보고,
 * 마지막에 가장 소중한 우리 문화 가치를 고르고 이유를 남긴다.
 *
 * 기존 활동 완료 흐름은 바꾸지 않는다.
 * 한옥 가치수호록(state.hanokExplorer)을 공통 valueRecords 형식으로 읽어 모은다.
 *
 * app.js: window.ValueGuardianBook = { render, stop, syncFromState, getProgress, upsertRecord }
 */
(function () {
  "use strict";

  const TRANSITION_MS = 420;
  const HANOK_DEFAULT_IMAGE = "assets/hanok/hanok-01-exterior.png";
  const BOOK_IMG_VER = "1";
  const BOOK_IMG = {
    cover: `assets/value-book/value-book-cover.png?v=${BOOK_IMG_VER}`,
    page: `assets/value-book/value-book-page.png?v=${BOOK_IMG_VER}`,
    bookmark: `assets/value-book/value-book-bookmark.png?v=${BOOK_IMG_VER}`
  };

  const ACCENT_BY_ACTIVITY = {
    hanok: "ochre",
    hanbok: "plum",
    minyo: "teal",
    talchum: "orange",
    dancheong: "navy",
    hangul: "navy",
    taegeukgi: "navy",
    mugunghwa: "plum",
    anthem: "teal",
    money: "ochre",
    bibimbap: "orange",
    holiday: "plum",
    yut: "ochre",
    ttakji: "orange"
  };

  /** STAGE_MENUS 활동 라벨을 책 페이지용 짧은 제목으로 줄인다. 새 활동명을 만들지 않는다. */
  const SHORT_TITLE_BY_LABEL = {
    "태극기 세우기": "태극기",
    "무궁화 피우기": "무궁화",
    "애국가 부르기": "애국가",
    "화폐 속 이야기": "화폐",
    "한글 조각 맞추기": "한글",
    "한옥 세우기": "한옥",
    "단청 색칠하기": "단청",
    "한복 입히기": "한복",
    "비빔밥 만들기": "비빔밥",
    "설날과 추석": "명절",
    "윷놀이": "윷놀이",
    "딱지접기": "딱지접기",
    "우리민요 얼쑤!": "민요",
    "탈춤놀이": "탈춤"
  };

  const ACTIVITY_KEY_BY_ROUTE = {
    stage1_a1: "taegeukgi",
    stage1_a2: "mugunghwa",
    stage1_a3: "anthem",
    stage1_a4: "money",
    stage2_a1: "hangul",
    stage2_a2: "hanok",
    stage2_a3: "dancheong",
    stage3_a1: "hanbok",
    stage3_a2: "bibimbap",
    stage3_a3: "holiday",
    stage4_a1: "yut",
    stage4_a2: "ttakji",
    stage4_a3: "minyo",
    stage4_a4: "talchum"
  };

  /** 한옥에서 고른 요소 → 책 페이지의 발견/가치/대표 이미지 */
  const HANOK_ELEMENT_META = {
    ondol: {
      selectedElement: "ondol",
      selectedElementLabel: "온돌",
      valueLabel: "따뜻하게 지내는 지혜",
      representativeImage: "assets/hanok/hanok-11-ondol.png"
    },
    maru: {
      selectedElement: "maru",
      selectedElementLabel: "마루",
      valueLabel: "자연과 어울리는 생활의 지혜",
      representativeImage: "assets/hanok/hanok-08-maru.png"
    },
    hanji: {
      selectedElement: "hanji",
      selectedElementLabel: "창호지",
      valueLabel: "빛을 부드럽게 담는 마음",
      representativeImage: "assets/hanok/hanok-10-hanji-window.png"
    },
    nature: {
      selectedElement: "nature",
      selectedElementLabel: "나무·흙·돌",
      valueLabel: "자연과 어울리는 생활의 지혜",
      representativeImage: "assets/hanok/hanok-12-hwangto-wall.png"
    },
    giwa: {
      selectedElement: "giwa",
      selectedElementLabel: "기와지붕",
      valueLabel: "아름다움을 지키는 마음",
      representativeImage: "assets/hanok/hanok-13-giwa-roof.png"
    }
  };

  const STATUS_LABEL = {
    before: "아직 기록이 없어요.",
    pending: "아직 기록이 없어요.",
    draft: "아직 기록이 없어요.",
    complete: "기록함"
  };

  const ROUTE_BY_ACTIVITY = Object.keys(ACTIVITY_KEY_BY_ROUTE).reduce((map, route) => {
    map[ACTIVITY_KEY_BY_ROUTE[route]] = route;
    return map;
  }, {});

  let _ctx = null;
  let _appEl = null;
  let _root = null;
  let _timers = [];
  let _recognition = null;
  let _transitioning = false;
  let _audio = null;
  let _artObs = null;

  const $ = (sel) => (_root ? _root.querySelector(sel) : null);

  function later(fn, ms) {
    const t = setTimeout(fn, ms);
    _timers.push(t);
    return t;
  }

  function playClick() {
    if (_ctx && _ctx.playSound) _ctx.playSound("click.mp3");
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/`/g, "&#96;");
  }

  function getState() {
    return _ctx && _ctx.getState ? _ctx.getState() : null;
  }

  function isViewOnly() {
    return !!(_ctx && _ctx.viewOnly);
  }

  function save() {
    if (isViewOnly()) return;
    if (_ctx && _ctx.saveProgress) _ctx.saveProgress();
  }

  function studentName() {
    if (_ctx && typeof _ctx.getStudentName === "function") {
      const name = String(_ctx.getStudentName() || "").trim();
      if (name) return name;
    }
    const st = getState();
    const name = String(st?.userProfile?.name || "").trim();
    return name || "나";
  }

  function iGa(word) {
    const text = String(word || "").trim();
    const ch = text.charAt(text.length - 1);
    const code = ch.charCodeAt(0);
    if (!text || code < 0xac00 || code > 0xd7a3) return "이";
    return ((code - 0xac00) % 28) === 0 ? "가" : "이";
  }

  function preciousLine(value) {
    if (!value) return "";
    return `나는 ${value}${iGa(value)} 가장 소중하다고 생각해요.`;
  }

  function coverTitle() {
    const name = studentName();
    return name === "나" ? "나의 우리 문화 수호책" : `${name}의 우리 문화 수호책`;
  }

  function ensureBookUi(st) {
    if (!st.valueBook || typeof st.valueBook !== "object") {
      st.valueBook = { view: "cover", pageIndex: 0, whyWant: "", whyReason: "" };
    }
    if (!st.valueBook.view) st.valueBook.view = "cover";
    if (!Number.isFinite(Number(st.valueBook.pageIndex))) st.valueBook.pageIndex = 0;
    if (typeof st.valueBook.whyWant !== "string") st.valueBook.whyWant = "";
    if (typeof st.valueBook.whyReason !== "string") st.valueBook.whyReason = "";
    return st.valueBook;
  }

  function ensureRecords(st) {
    if (!Array.isArray(st.valueRecords)) st.valueRecords = [];
    return st.valueRecords;
  }

  function normalizeRecord(raw) {
    if (!raw || typeof raw !== "object") return null;
    const activity = String(raw.activity || "").trim();
    if (!activity) return null;
    const selectedElement = raw.selectedElement || raw.selectedHanokValue || "";
    const selectedElementLabel = raw.selectedElementLabel || raw.selectedHanokValueLabel || "";
    return {
      activity,
      activityTitle: raw.activityTitle || "",
      selectedElement,
      selectedElementLabel,
      valueLabel: raw.valueLabel || "",
      valueQuestion: raw.valueQuestion || "",
      initialAnswer: raw.initialAnswer || "",
      thinkingFriendTurns: Array.isArray(raw.thinkingFriendTurns)
        ? raw.thinkingFriendTurns
        : ((raw.thinkFriend && Array.isArray(raw.thinkFriend.thinkingFriendTurns))
          ? raw.thinkFriend.thinkingFriendTurns
          : []),
      finalSummary: raw.finalSummary || raw.summaryText || "",
      finalAnswer: raw.finalAnswer || raw.answer || "",
      studentApproved: !!(raw.studentApproved || (raw.thinkFriend && raw.thinkFriend.studentApproved)),
      inputMode: raw.inputMode || raw.responseType || "",
      reflectionText: raw.reflectionText || "",
      audioUrl: raw.audioUrl || null,
      photoUrl: null, // 사진으로 응답하기는 없음 — 예전 기록의 사진도 쓰지 않는다
      representativeImage: "",
      responseType: raw.responseType || "",
      followUpQuestion: raw.followUpQuestion || "",
      followUpLabel: raw.followUpLabel || "",
      extraAnswer: raw.extraAnswer || "",
      summaryText: raw.summaryText || "",
      thinkFriend: raw.thinkFriend && typeof raw.thinkFriend === "object" ? raw.thinkFriend : null,
      status: raw.status || "",
      createdAt: raw.createdAt || null,
      answerHistory: Array.isArray(raw.answerHistory) ? raw.answerHistory : []
    };
  }

  function displayAnswer(rec) {
    if (!rec || typeof rec !== "object") return "";
    const tf = rec.thinkFriend && typeof rec.thinkFriend === "object" ? rec.thinkFriend : {};
    return String(
      rec.finalAnswer
      || tf.finalAnswer
      || rec.finalSummary
      || tf.finalSummary
      || rec.summaryText
      || rec.answer
      || rec.reflectionText
      || rec.initialAnswer
      || tf.initialAnswer
      || rec.selectedElementLabel
      || rec.valueLabel
      || ""
    ).trim();
  }

  function packQuestion(activity) {
    const key = String(activity || "").trim();
    if (!key) return "";
    // 2차 설계안: 가치수호록 제목은 활동의 핵심 질문
    const GQ = window.ThinkFriendQuestions;
    if (GQ && typeof GQ.get === "function") {
      const q = GQ.get(key);
      if (q && q.core) return String(q.core).trim();
    }
    const packs = window.ThinkingFriendActivities;
    if (packs && typeof packs.get === "function") {
      const pack = packs.get(key);
      if (pack && pack.valueQuestion) return String(pack.valueQuestion).trim();
    }
    const flow = window.ValueReflectionFlow;
    if (flow && typeof flow.getConfig === "function") {
      const config = flow.getConfig(key);
      if (config && (config.valueQuestion || config.step1Question)) {
        return String(config.valueQuestion || config.step1Question).trim();
      }
    }
    return "";
  }

  function displayQuestion(rec, activity) {
    const first = packQuestion(activity || (rec && rec.activity) || "");
    if (first) return first;
    return String((rec && rec.valueQuestion) || "").trim();
  }

  function upsertRecord(st, record) {
    if (!st || !record) return;
    const next = normalizeRecord(record);
    if (!next) return;
    const list = ensureRecords(st);
    const idx = list.findIndex((item) => item.activity === next.activity);
    const stamp = next.createdAt || new Date().toISOString();
    const entry = {
      reflectionText: next.reflectionText || next.finalAnswer || "",
      finalAnswer: next.finalAnswer || next.reflectionText || "",
      finalSummary: next.finalSummary || "",
      initialAnswer: next.initialAnswer || "",
      valueLabel: next.valueLabel || "",
      selectedElement: next.selectedElement || "",
      selectedElementLabel: next.selectedElementLabel || "",
      audioUrl: next.audioUrl || null,
      createdAt: stamp
    };
    if (idx >= 0) {
      const prev = list[idx];
      let history = Array.isArray(prev.answerHistory) ? prev.answerHistory.slice() : [];
      if (!history.length) {
        const prevText = String(prev.finalAnswer || prev.reflectionText || "").trim();
        if (prevText) {
          history.push({
            reflectionText: prev.reflectionText || prev.finalAnswer || "",
            finalAnswer: prev.finalAnswer || prev.reflectionText || "",
            finalSummary: prev.finalSummary || "",
            initialAnswer: prev.initialAnswer || "",
            valueLabel: prev.valueLabel || "",
            selectedElement: prev.selectedElement || "",
            selectedElementLabel: prev.selectedElementLabel || "",
            audioUrl: prev.audioUrl || null,
            createdAt: prev.createdAt || stamp
          });
        }
      }
      const newText = String(entry.finalAnswer || entry.reflectionText || "").trim();
      if (newText) history.push(entry);
      list[idx] = {
        ...prev,
        ...next,
        audioUrl: next.audioUrl || prev.audioUrl || null,
        photoUrl: null,
        responseType: next.responseType || prev.responseType || "",
        inputMode: next.inputMode || prev.inputMode || "",
        reflectionText: next.reflectionText || next.finalAnswer || prev.reflectionText || "",
        finalAnswer: next.finalAnswer || next.reflectionText || prev.finalAnswer || "",
        finalSummary: next.finalSummary || prev.finalSummary || "",
        initialAnswer: next.initialAnswer || prev.initialAnswer || "",
        thinkingFriendTurns: (Array.isArray(next.thinkingFriendTurns) && next.thinkingFriendTurns.length)
          ? next.thinkingFriendTurns
          : (prev.thinkingFriendTurns || []),
        studentApproved: !!(next.studentApproved || prev.studentApproved),
        thinkFriend: next.thinkFriend || prev.thinkFriend || null,
        valueQuestion: next.valueQuestion || prev.valueQuestion || "",
        representativeImage: next.representativeImage || prev.representativeImage || "",
        status: next.status || prev.status || "",
        valueLabel: next.valueLabel || prev.valueLabel || "",
        selectedElement: next.selectedElement || prev.selectedElement || "",
        selectedElementLabel: next.selectedElementLabel || prev.selectedElementLabel || "",
        createdAt: stamp,
        answerHistory: history
      };
    } else {
      next.answerHistory = (entry.finalAnswer || entry.reflectionText) ? [entry] : [];
      list.push(next);
    }
  }

  function recordFromHanokExplorer(explorer) {
    if (!explorer || !explorer.journalSaved) return null;
    const id = explorer.selectedHanokValue || explorer.journal?.selectedHanokValue || "";
    const meta = HANOK_ELEMENT_META[id] || {};
    const journal = explorer.journal && typeof explorer.journal === "object" ? explorer.journal : {};
    const elementLabel = journal.selectedElementLabel
      || meta.selectedElementLabel
      || explorer.selectedHanokValueLabel
      || "";
    const valueLabel = journal.valueLabel
      || meta.valueLabel
      || explorer.selectedHanokValueLabel
      || "";
    const image = journal.representativeImage
      || meta.representativeImage
      || HANOK_DEFAULT_IMAGE;
    return {
      activity: "hanok",
      activityTitle: "한옥",
      selectedElement: journal.selectedElement || meta.selectedElement || id,
      selectedElementLabel: elementLabel,
      valueLabel,
      valueQuestion: journal.valueQuestion || "",
      initialAnswer: journal.initialAnswer || "",
      thinkingFriendTurns: Array.isArray(journal.thinkingFriendTurns) ? journal.thinkingFriendTurns : [],
      finalSummary: journal.finalSummary || "",
      finalAnswer: journal.finalAnswer || journal.reflectionText || explorer.reflectionText || "",
      studentApproved: !!journal.studentApproved,
      inputMode: journal.inputMode || journal.responseType || "",
      reflectionText: journal.finalAnswer || journal.reflectionText || explorer.reflectionText || "",
      audioUrl: journal.audioUrl || explorer.audioUrl || null,
      photoUrl: null,
      representativeImage: image,
      responseType: journal.responseType || journal.inputMode || "",
      thinkFriend: journal.thinkFriend && typeof journal.thinkFriend === "object" ? journal.thinkFriend : null,
      summaryText: journal.summaryText || journal.finalSummary || "",
      status: "complete",
      createdAt: journal.createdAt || explorer.createdAt || null
    };
  }

  function syncFromState(st) {
    if (!st) return;
    ensureRecords(st);
    const hanokRecord = recordFromHanokExplorer(st.hanokExplorer);
    if (hanokRecord) upsertRecord(st, hanokRecord);
  }

  function stageMenus() {
    if (_ctx && typeof _ctx.getStageMenus === "function") return _ctx.getStageMenus();
    return null;
  }

  function stageImage(stageNum, file) {
    if (_ctx && typeof _ctx.stageImage === "function") return _ctx.stageImage(stageNum, file);
    return "";
  }

  function treasureList() {
    if (_ctx && typeof _ctx.getTreasureList === "function") {
      const list = _ctx.getTreasureList();
      return Array.isArray(list) ? list : [];
    }
    return [];
  }

  function treasureSrc(file) {
    if (_ctx && typeof _ctx.treasureSrc === "function") return _ctx.treasureSrc(file);
    return file ? `assets/images/treasures/${file}` : "";
  }

  function treasureForRoute(route) {
    return treasureList().find((item) => item && item.route === route) || null;
  }

  function buildCatalog(st, menus) {
    const source = menus || stageMenus();
    const list = [];
    if (!source || typeof source !== "object") return list;
    Object.keys(source).sort((a, b) => Number(a) - Number(b)).forEach((stageKey) => {
      const stageNum = Number(stageKey);
      const acts = source[stageKey]?.activities;
      if (!Array.isArray(acts)) return;
      acts.forEach((act) => {
        if (!act?.route) return;
        const activity = ACTIVITY_KEY_BY_ROUTE[act.route] || act.route;
        const title = SHORT_TITLE_BY_LABEL[act.label] || act.label;
        list.push({
          activity,
          activityTitle: title,
          route: act.route,
          stageNum,
          menuLabel: act.label,
          fallbackImage: stageImage(stageNum, act.image)
        });
      });
    });
    return list;
  }

  function recordFor(st, activity) {
    return ensureRecords(st).find((item) => item.activity === activity) || null;
  }

  function isCompleteRecord(rec) {
    if (!rec) return false;
    if (rec.status === "complete") return true;
    return !!(rec.valueLabel || rec.selectedElementLabel || rec.reflectionText || rec.finalAnswer || rec.photoUrl);
  }

  function hanokStatus(st) {
    const e = st.hanokExplorer;
    if (e?.journalSaved || isCompleteRecord(recordFor(st, "hanok"))) return "complete";
    if (!e) return "before";
    const exploringPhases = ["exterior", "gate", "exploring", "building", ""];
    const started = !!(e.selectedHanokValue || e.reflectionText || e.wantText
      || (e.phase && exploringPhases.indexOf(e.phase) < 0));
    return started ? "pending" : "before";
  }

  function pageStatus(st, activity) {
    if (isCompleteRecord(recordFor(st, activity))) return "complete";
    const draft = st && st.valueReflection;
    if (draft && draft.activity === activity && draft.status !== "complete" && draft.step !== "saved") {
      const started = !!(draft.selectedId
        || draft.recordMode
        || (Number(draft.step) > 1)
        || draft.writeDraft
        || draft.voiceDraft
        || draft.photoUrl
        || draft.photoDraft);
      return started ? "draft" : "pending";
    }
    const route = ROUTE_BY_ACTIVITY[activity];
    if (route && st && st.completedMissions && st.completedMissions[route]) return "pending";
    if (activity === "hanok") return hanokStatus(st);
    return "before";
  }

  function statusLabel(status) {
    return STATUS_LABEL[status] || STATUS_LABEL.before;
  }

  function isRecordedStatus(status) {
    return status === "complete";
  }

  function bookmarkAria(title, status) {
    return isRecordedStatus(status) ? `${title} 기록함` : `${title} 아직 기록 없음`;
  }

  function bookmarkHTML(opts) {
    const kind = opts.kind === "rail" ? "vb-mark" : "vb-toc-mark";
    const status = opts.status || "before";
    const recorded = isRecordedStatus(status) || opts.finale;
    const title = opts.title || "";
    const extra = opts.extraClass ? ` ${opts.extraClass}` : "";
    const finale = opts.finale ? ` ${kind}--finale` : "";
    const idAttr = opts.id ? ` id="${escapeAttr(opts.id)}"` : "";
    const pageAttr = opts.page != null && opts.page !== "" ? ` data-page="${Number(opts.page) || 0}"` : "";
    const long = title.length >= 4 ? " vb-mark-label--long" : "";
    return `
      <button type="button" class="${kind} ${kind}--${status}${recorded ? " is-recorded" : " is-wait"}${finale}${extra}"${idAttr}${pageAttr} aria-label="${escapeAttr(opts.finale ? title : bookmarkAria(title, status))}">
        <img src="${BOOK_IMG.bookmark}" alt="" aria-hidden="true" />
        <span class="vb-mark-label${long}">${escapeHtml(title)}</span>
      </button>
    `;
  }

  function accentOf(activity) {
    return ACCENT_BY_ACTIVITY[activity] || "ochre";
  }

  function getProgress(st, menus) {
    if (st) syncFromState(st);
    const catalog = buildCatalog(st || {}, menus);
    const complete = catalog.filter((item) => pageStatus(st || {}, item.activity) === "complete").length;
    return { complete, total: catalog.length };
  }

  function completeRecords(st, catalog) {
    return catalog
      .map((item) => recordFor(st, item.activity))
      .filter((rec) => isCompleteRecord(rec));
  }

  function stopMedia() {
    try { if (_recognition) _recognition.stop(); } catch (_) {}
    _recognition = null;
    if (_audio) {
      try { _audio.pause(); } catch (_) {}
      _audio = null;
    }
  }

  function stopAll() {
    _timers.forEach(clearTimeout);
    _timers = [];
    _transitioning = false;
    stopMedia();
    if (_artObs) {
      try { _artObs.disconnect(); } catch (_) {}
      _artObs = null;
    }
    window.removeEventListener("resize", syncArtLayer);
    resetHeaderPos();
    _root = null;
  }

  function setView(view, pageIndex) {
    const st = getState();
    if (!st) return;
    const ui = ensureBookUi(st);
    ui.view = view;
    if (pageIndex != null) ui.pageIndex = pageIndex;
  }

  function progressLine(st, catalog) {
    const done = catalog.filter((item) => pageStatus(st, item.activity) === "complete").length;
    const total = catalog.length;
    if (!total) return "";
    return `${total}개 중 ${done}개의 가치수호록을 만들었어요.`;
  }

  function progressShort(st, catalog) {
    const done = catalog.filter((item) => pageStatus(st, item.activity) === "complete").length;
    return `${done} / ${catalog.length}`;
  }

  function pageStageHTML(inner, opts) {
    const st = getState();
    const catalog = buildCatalog(st || {});
    const showRail = !!(opts && opts.showRail);
    const current = (opts && opts.currentActivity) || "";
    const marks = showRail ? catalog : [];
    const rail = marks.length
      ? `<div class="vb-mark-rail">
          ${marks.map((item) => {
            const idx = catalog.findIndex((c) => c.activity === item.activity);
            const status = pageStatus(st || {}, item.activity);
            const on = item.activity === current ? " is-current" : "";
            return bookmarkHTML({
              kind: "rail",
              title: item.activityTitle,
              status,
              page: idx,
              extraClass: on
            });
          }).join("")}
        </div>`
      : "";
    const slotClass = showRail ? " vb-page-slot--rail" : (opts && opts.toc ? " vb-page-slot--toc" : "");
    return `
      <div class="vb-art-stage vb-art-stage--page" id="vbArtStage">
        <img class="vb-art" id="vbArt" src="${BOOK_IMG.page}" alt="우리문화 수호책 한지 페이지" />
        <div class="vb-art-layer" id="vbArtLayer">
          <div class="vb-page-slot${slotClass}">${rail}${inner}</div>
        </div>
      </div>
    `;
  }

  function isStudentPhoto(url) {
    const src = String(url || "");
    if (!src) return false;
    if (src.indexOf("data:") === 0 || src.indexOf("blob:") === 0) return true;
    if (src.indexOf("assets/review-demo/") === 0) return true;
    return src.indexOf("assets/") !== 0;
  }

  function voiceBtnHTML() {
    return `
      <button type="button" class="vb-voice" id="vbVoiceBtn">
        <span class="vb-voice-mark" aria-hidden="true"></span>
        내 목소리 듣기
      </button>
    `;
  }

  function pageNavHTML(opts) {
    const prevLabel = opts.prevLabel || "이전 페이지";
    const nextLabel = opts.nextLabel || "다음 페이지";
    const prevDisabled = opts.prevDisabled ? " disabled" : "";
    const nextDisabled = opts.nextDisabled ? " disabled" : "";
    const extra = opts.extra || "";
    return `
      <div class="vb-nav">
        <button type="button" class="vb-btn vb-btn--ghost" id="vbPrevBtn"${prevDisabled}>${prevLabel}</button>
        <div class="vb-nav-mid">${extra}</div>
        <button type="button" class="vb-btn vb-btn--accent" id="vbNextBtn"${nextDisabled}>${nextLabel}</button>
      </div>
    `;
  }

  function tocLinkHTML() {
    return `<button type="button" class="vb-btn vb-btn--ghost" id="vbTocBtn">목차</button>`;
  }

  function albumLinkHTML() {
    return `<button type="button" class="vb-btn vb-btn--ghost" id="vbAlbumOpenBtn">보물 모아보기</button>`;
  }

  function treasureBlockHTML(item) {
    const treasure = treasureForRoute(item && item.route);
    if (!treasure) return "";
    if (treasure.acquired) {
      return `
        <div class="vb-treasure is-on">
          <img src="${escapeAttr(treasureSrc(treasure.image))}" alt="${escapeAttr(treasure.name)}" />
          <div class="vb-treasure-copy">
            <p class="vb-treasure-kicker">되찾은 보물</p>
            <p class="vb-treasure-name">${escapeHtml(treasure.name)}</p>
          </div>
        </div>
      `;
    }
    return `
      <div class="vb-treasure is-off">
        <span class="vb-treasure-lock" aria-hidden="true">👹</span>
        <div class="vb-treasure-copy">
          <p class="vb-treasure-kicker">보물</p>
          <p class="vb-treasure-name">아직 되찾지 못했어요</p>
        </div>
      </div>
    `;
  }

  function coverHTML(st, catalog, mode) {
    const done = mode === "done";
    const action = done
      ? `<button type="button" class="vb-btn vb-btn--accent vb-btn--wide" id="vbReplayBtn">내 책 다시 보기</button>`
      : `<button type="button" class="vb-btn vb-btn--accent vb-btn--wide" id="vbOpenBtn">내 책 펼쳐보기</button>`;
    return `
      <div class="vb-art-stage vb-art-stage--cover" id="vbArtStage">
        <img class="vb-art" id="vbArt" src="${BOOK_IMG.cover}" alt="우리문화 수호책 표지" />
        <div class="vb-art-layer" id="vbArtLayer">
          <div class="vb-cover-plate">
            <h1 class="vb-cover-title">${escapeHtml(coverTitle())}</h1>
          </div>
          <div class="vb-cover-body${done ? " vb-cover-body--done" : ""}">
            ${done ? `<p class="vb-cover-done">완성!</p>` : `<p class="vb-cover-sub">되찾은 보물과 내가 발견한 우리 문화의 가치</p>`}
            <div class="vb-cover-actions">
              ${action}
              <button type="button" class="vb-btn vb-btn--ghost vb-btn--wide" id="vbAlbumOpenBtn">보물 모아보기</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function tocHTML(st, catalog) {
    const marks = catalog.map((item, idx) => bookmarkHTML({
      kind: "toc",
      title: item.activityTitle,
      status: pageStatus(st, item.activity),
      page: idx
    })).join("");
    const done = catalog.filter((item) => pageStatus(st, item.activity) === "complete").length;
    const summaryMark = done >= 1
      ? bookmarkHTML({
          kind: "toc",
          title: "가치",
          status: "complete",
          finale: true,
          id: "vbSummaryCard"
        })
      : "";
    return pageStageHTML(`
      <div class="vb-toc">
        <h2 class="vb-page-title">나의 우리문화 기록</h2>
        <p class="vb-lead">책갈피를 눌러 내가 담은 페이지를 펼쳐 보세요.</p>
        <div class="vb-toc-rail">${marks}${summaryMark}</div>
      </div>
      ${pageNavHTML({ prevLabel: "표지로", nextLabel: "첫 페이지", extra: "" })}
    `, { toc: true });
  }

  function activityPageHTML(st, catalog, pageIndex) {
    const item = catalog[pageIndex];
    if (!item) return pageStageHTML(`<p class="vb-empty-line">아직 기록이 없어요.</p>`, {});
    const rec = recordFor(st, item.activity);
    const complete = isCompleteRecord(rec);
    const audioBtn = (complete && rec.audioUrl) ? voiceBtnHTML() : "";
    // 책이 가로로 길어서: 왼쪽에 되찾은 보물(과 목소리), 오른쪽에 질문 글상자와 그 아래 응답
    const question = displayQuestion(rec, item.activity);
    const questionBox = question
      ? `<div class="vb-qbox"><span class="vb-qbox-tag">질문</span><p class="vb-prose-question">${escapeHtml(question)}</p></div>`
      : "";
    let right;
    if (complete) {
      const thought = displayAnswer(rec);
      const history = Array.isArray(rec.answerHistory) ? rec.answerHistory : [];
      const older = history.length > 1
        ? history.slice(0, -1).map((h, i) => {
          const text = String(h.finalAnswer || h.reflectionText || "").trim();
          if (!text) return "";
          return `<p class="vb-prose-line vb-answer-past sent-lines"><span class="vb-answer-past-tag">${i + 1}번째 기록</span>${escapeHtml(text)}</p>`;
        }).filter(Boolean).join("")
        : "";
      const rerecord = isViewOnly()
        ? ""
        : `<div class="vb-page-actions"><button type="button" class="vb-mini-btn" id="vbRecordBtn">다시 기록하기</button></div>`;
      right = `
        ${questionBox}
        <div class="vb-answer">
          ${thought
            ? `<p class="vb-prose-line sent-lines">${escapeHtml(thought)}</p>`
            : `<p class="vb-empty-line">아직 쓴 생각이 없어요.</p>`}
          ${older
            ? `<div class="vb-answer-history"><p class="vb-answer-history-label">이전 기록</p>${older}</div>`
            : ""}
          ${rerecord}
        </div>
      `;
    } else {
      const status = pageStatus(st, item.activity);
      const action = isViewOnly()
        ? ""
        : (status === "pending" || status === "draft")
          ? `<button type="button" class="vb-mini-btn" id="vbRecordBtn">기록하기</button>`
          : `<button type="button" class="vb-mini-btn" id="vbPlayBtn">활동하기</button>`;
      right = `
        ${questionBox}
        <div class="vb-answer vb-answer--empty">
          ${action ? `<div class="vb-page-actions">${action}</div>` : `<p class="vb-empty-line">아직 기록이 없어요.</p>`}
        </div>
      `;
    }
    const body = `
      <div class="vb-spread${complete ? "" : " vb-spread--empty"}">
        <div class="vb-spread-left">
          ${treasureBlockHTML(item)}
          ${audioBtn}
        </div>
        <div class="vb-spread-right">${right}</div>
      </div>
    `;
    const doneCount = catalog.filter((c) => pageStatus(st, c.activity) === "complete").length;
    const isLast = pageIndex >= catalog.length - 1;
    const nextLabel = isLast && doneCount >= 1 ? "모아 보기" : "다음 페이지";
    const nextDisabled = isLast && doneCount < 1;
    return pageStageHTML(`
      <h2 class="vb-page-title">${escapeHtml(item.activityTitle)}</h2>
      <div class="vb-page-body">
        ${body}
      </div>
      ${pageNavHTML({
        nextLabel,
        nextDisabled,
        extra: tocLinkHTML()
      })}
    `, { currentActivity: item.activity, showRail: true });
  }

  function albumHTML(st, catalog) {
    const items = treasureList();
    const got = items.filter((item) => item.acquired).length;
    const cards = items.map((item) => {
      const idx = catalog.findIndex((c) => c.route === item.route);
      const mission = item.missionLabel || item.name || "미션";
      if (item.acquired) {
        return `
          <button type="button" class="vb-album-card is-on" data-treasure-route="${escapeAttr(item.route)}" data-page="${idx}" aria-label="${escapeAttr(item.name)}">
            <span class="vb-album-frame"><img src="${escapeAttr(treasureSrc(item.image))}" alt="" /></span>
            <span class="vb-album-name">${escapeHtml(item.name)}</span>
          </button>
        `;
      }
      return `
        <button type="button" class="vb-album-card is-off" data-treasure-route="${escapeAttr(item.route)}" data-go-activity="1" aria-label="${escapeAttr(mission)} 미션으로 가서 되찾기">
          <span class="vb-album-frame">
            <img class="vb-album-silhouette" src="${escapeAttr(treasureSrc(item.image))}" alt="" />
          </span>
          <span class="vb-album-name">${escapeHtml(mission)}</span>
        </button>
      `;
    }).join("");
    return pageStageHTML(`
      <div class="vb-album">
        <h2 class="vb-page-title">되찾은 보물</h2>
        <p class="vb-lead">${items.length}개 중 ${got}개의 보물을 찾았어요.</p>
        <div class="vb-album-grid">${cards || `<p class="vb-empty-line">아직 되찾은 보물이 없어요.</p>`}</div>
      </div>
      ${pageNavHTML({ prevLabel: "표지로", nextLabel: "목차", extra: "" })}
    `, { toc: true });
  }

  function summaryHTML(st, catalog) {
    const records = completeRecords(st, catalog);
    const selected = (st.finalCultureReflection && st.finalCultureReflection.selectedActivity) || "";
    const tags = records.map((rec) => `
      <button type="button" class="vb-tag vb-tag--${accentOf(rec.activity)}${selected === rec.activity ? " is-on" : ""}" data-activity="${escapeAttr(rec.activity)}">
        <span class="vb-tag-act">${escapeHtml(rec.activityTitle || "")}</span>
        <span class="vb-tag-val">${escapeHtml(rec.valueLabel || rec.selectedElementLabel || "")}</span>
      </button>
    `).join("");
    const empty = records.length
      ? ""
      : `<p class="vb-empty-line">아직 기록이 없어요.</p>`;
    const ask = records.length
      ? `<p class="vb-lead">우리 문화에서 내가 가장 소중하다고 생각하는 것은 무엇인가요?</p>`
      : "";
    const whyHint = selected
      ? `<p class="vb-lead vb-lead--soft">왜 그렇게 생각하나요?</p>`
      : "";
    return pageStageHTML(`
      <h2 class="vb-page-title">내가 찾은 우리 문화의 가치</h2>
      <div class="vb-value-cloud">${tags || empty}</div>
      ${ask}
      ${whyHint}
      ${pageNavHTML({
        nextLabel: selected ? (isViewOnly() ? "생각 보기" : "이유 남기기") : "다음 페이지",
        nextDisabled: !selected,
        extra: tocLinkHTML()
      })}
    `, {});
  }

  function whyHTML(st, catalog) {
    const ui = ensureBookUi(st);
    const saved = st.finalCultureReflection || {};
    const rec = completeRecords(st, catalog).find((item) => item.activity === saved.selectedActivity);
    const value = rec?.valueLabel || rec?.selectedElementLabel || saved.selectedValue || "이것";
    if (isViewOnly()) {
      const thought = saved.reflectionText
        || [saved.wantText || ui.whyWant || "", saved.reasonText || ui.whyReason || ""].filter(Boolean).join(" ");
      return pageStageHTML(`
        <h2 class="vb-page-title">나의 우리문화 생각</h2>
        <p class="vb-finale-value">${escapeHtml(value)}</p>
        <div class="vb-prose">
          <p class="vb-prose-kicker">나의 생각</p>
          <p class="vb-prose-line sent-lines">${escapeHtml(thought || "아직 남긴 생각이 없어요.")}</p>
        </div>
        ${pageNavHTML({
          nextLabel: "다음 페이지",
          extra: tocLinkHTML()
        })}
      `, { currentActivity: rec?.activity || saved.selectedActivity || "", showRail: true });
    }
    const canTalk = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const want = ui.whyWant || saved.wantText || preciousLine(value);
    const reason = ui.whyReason || saved.reasonText || "";
    const talk = canTalk
      ? `<button type="button" class="vb-voice vb-voice--talk" id="vbTalkBtn">
           <span class="vb-voice-mark" aria-hidden="true"></span>
           말로 말하기
         </button>`
      : "";
    return pageStageHTML(`
      <h2 class="vb-page-title">나의 우리문화 생각</h2>
      <p class="vb-finale-value">${escapeHtml(value)}</p>
      <p class="vb-lead">왜 그렇게 생각하나요?</p>
      <label class="vb-field">
        <span>나는 ______이 가장 소중하다고 생각해요.</span>
        <input type="text" id="vbWantInput" class="vb-input" maxlength="60" value="${escapeAttr(want)}" />
      </label>
      <label class="vb-field">
        <span>왜냐하면 ______ 때문이에요.</span>
        <input type="text" id="vbReasonInput" class="vb-input" maxlength="60" value="${escapeAttr(reason)}" placeholder="이유를 적어 보세요" />
      </label>
      ${talk}
      ${pageNavHTML({
        nextLabel: "생각 담기",
        extra: tocLinkHTML()
      })}
    `, { currentActivity: rec?.activity || saved.selectedActivity || "", showRail: true });
  }

  function resultHTML(st, catalog) {
    const saved = st.finalCultureReflection || {};
    const rec = completeRecords(st, catalog).find((item) => item.activity === saved.selectedActivity);
    const value = saved.selectedValue || rec?.valueLabel || rec?.selectedElementLabel || "";
    const thought = saved.reflectionText || "";
    const audioBtn = saved.audioUrl ? voiceBtnHTML() : "";
    const empty = (!value && !thought)
      ? `<p class="vb-empty-line">아직 나의 우리문화 생각이 없어요.</p>
         <p class="vb-prose-note">앞에서 가장 소중한 가치를 고르면 이 마지막 페이지에 생겨요.</p>`
      : "";
    return pageStageHTML(`
      <h2 class="vb-page-title">내가 지키고 싶은 우리 문화의 가치</h2>
      <p class="vb-finale-value">${escapeHtml(value || "아직 고르지 않았어요.")}</p>
      <div class="vb-prose">
        <p class="vb-prose-kicker">나의 생각</p>
        <p class="vb-prose-line sent-lines">${escapeHtml(thought || "아직 남긴 생각이 없어요.")}</p>
      </div>
      ${audioBtn}
      ${empty}
      ${pageNavHTML({
        nextLabel: "완성 표지",
        extra: tocLinkHTML()
      })}
    `, { currentActivity: rec?.activity || saved.selectedActivity || "", showRail: true });
  }

  function viewHTML(st, catalog) {
    const ui = ensureBookUi(st);
    if (ui.view === "toc") return tocHTML(st, catalog);
    if (ui.view === "album") return albumHTML(st, catalog);
    if (ui.view === "page") return activityPageHTML(st, catalog, ui.pageIndex);
    if (ui.view === "summary" || ui.view === "choose") return summaryHTML(st, catalog);
    if (ui.view === "why") return whyHTML(st, catalog);
    if (ui.view === "result") return resultHTML(st, catalog);
    if (ui.view === "done") return coverHTML(st, catalog, "done");
    return coverHTML(st, catalog);
  }


  function startSpeech(input) {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec || !input) return;
    try { if (_recognition) _recognition.stop(); } catch (_) {}
    _recognition = new Rec();
    _recognition.lang = "ko-KR";
    _recognition.interimResults = false;
    _recognition.maxAlternatives = 1;
    _recognition.onresult = (ev) => {
      const said = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
      if (!said) return;
      const cur = input.value.trim();
      input.value = cur ? `${cur} ${said}` : said;
      input.dispatchEvent(new Event("input"));
    };
    _recognition.onerror = () => {};
    try { _recognition.start(); } catch (_) {}
  }

  function playVoice(url) {
    if (!url) return;
    if (_audio) {
      try { _audio.pause(); } catch (_) {}
    }
    _audio = new Audio(url);
    _audio.play().catch(() => {});
  }

  function goView(view, pageIndex, dir) {
    if (_transitioning) return;
    const st = getState();
    if (!st) return;
    setView(view, pageIndex);
    paint(dir || "next");
  }

  function bindCover() {
    const btn = $("#vbOpenBtn");
    if (btn) btn.onclick = () => {
      playClick();
      goView("toc", 0, "open");
    };
    bindAlbumOpen("open");
  }

  function bindAlbumOpen(dir) {
    const btn = $("#vbAlbumOpenBtn");
    if (!btn) return;
    btn.onclick = () => {
      playClick();
      goView("album", 0, dir || "next");
    };
  }

  function bindAlbum(st, catalog) {
    _root.querySelectorAll("[data-treasure-route]").forEach((btn) => {
      btn.onclick = () => {
        const route = btn.getAttribute("data-treasure-route") || "";
        const acquired = btn.classList.contains("is-on");
        playClick();
        if (!acquired) {
          if (isViewOnly()) return;
          if (route && _ctx && typeof _ctx.goToActivity === "function") {
            _ctx.goToActivity(route);
          }
          return;
        }
        const idx = Number(btn.getAttribute("data-page"));
        if (Number.isNaN(idx) || idx < 0) return;
        goView("page", idx, "next");
      };
    });
    const prev = $("#vbPrevBtn");
    if (prev) prev.onclick = () => {
      playClick();
      goView("cover", 0, "prev");
    };
    const next = $("#vbNextBtn");
    if (next) next.onclick = () => {
      playClick();
      goView("toc", 0, "next");
    };
  }

  function bindToc(st, catalog) {
    _root.querySelectorAll("[data-page]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        goView("page", Number(btn.getAttribute("data-page")) || 0, "next");
      };
    });
    const summary = $("#vbSummaryCard");
    if (summary) summary.onclick = () => {
      playClick();
      goView("summary", 0, "next");
    };
    const prev = $("#vbPrevBtn");
    if (prev) prev.onclick = () => {
      playClick();
      goView("cover", 0, "prev");
    };
    const next = $("#vbNextBtn");
    if (next) next.onclick = () => {
      playClick();
      goView("page", 0, "next");
    };
    bindAlbumOpen("next");
  }

  function bindPage(st, catalog) {
    const ui = ensureBookUi(st);
    const idx = ui.pageIndex || 0;
    const doneCount = catalog.filter((item) => pageStatus(st, item.activity) === "complete").length;
    const prev = $("#vbPrevBtn");
    if (prev) prev.onclick = () => {
      playClick();
      if (idx <= 0) goView("toc", 0, "prev");
      else goView("page", idx - 1, "prev");
    };
    const next = $("#vbNextBtn");
    if (next) next.onclick = () => {
      playClick();
      if (idx < catalog.length - 1) goView("page", idx + 1, "next");
      else if (doneCount >= 1) goView("summary", 0, "next");
    };
    const toc = $("#vbTocBtn");
    if (toc) toc.onclick = () => {
      playClick();
      goView("toc", 0, "prev");
    };
    const voice = $("#vbVoiceBtn");
    if (voice) {
      const rec = recordFor(st, catalog[idx]?.activity);
      voice.onclick = () => {
        playClick();
        if (rec?.audioUrl) playVoice(rec.audioUrl);
      };
    }
    _root.querySelectorAll(".vb-mark[data-page]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        goView("page", Number(btn.getAttribute("data-page")) || 0, "next");
      };
    });
    const item = catalog[idx];
    const playBtn = $("#vbPlayBtn");
    if (playBtn && item) {
      playBtn.onclick = () => {
        playClick();
        if (_ctx && typeof _ctx.goToActivity === "function") _ctx.goToActivity(item.route);
      };
    }
    const recordBtn = $("#vbRecordBtn");
    if (recordBtn && item) {
      recordBtn.onclick = () => {
        playClick();
        if (_ctx && typeof _ctx.startReflection === "function") _ctx.startReflection(item.route);
      };
    }
  }

  function bindSummary(st, catalog) {
    _root.querySelectorAll(".vb-tag[data-activity]").forEach((btn) => {
      btn.onclick = () => {
        if (isViewOnly()) return;
        playClick();
        const activity = btn.getAttribute("data-activity") || "";
        const rec = completeRecords(st, catalog).find((item) => item.activity === activity);
        if (!rec) return;
        st.finalCultureReflection = {
          ...(st.finalCultureReflection || {}),
          selectedActivity: rec.activity,
          selectedValue: rec.valueLabel || rec.selectedElementLabel || "",
          createdAt: (st.finalCultureReflection && st.finalCultureReflection.createdAt) || null
        };
        save();
        paint("none");
      };
    });
    const prev = $("#vbPrevBtn");
    if (prev) prev.onclick = () => {
      playClick();
      goView("page", Math.max(0, catalog.length - 1), "prev");
    };
    const next = $("#vbNextBtn");
    if (next) next.onclick = () => {
      if (!(st.finalCultureReflection && st.finalCultureReflection.selectedActivity)) return;
      playClick();
      goView("why", 0, "next");
    };
    const toc = $("#vbTocBtn");
    if (toc) toc.onclick = () => {
      playClick();
      goView("toc", 0, "prev");
    };
  }

  function syncWhyFields(st) {
    const ui = ensureBookUi(st);
    const want = $("#vbWantInput");
    const reason = $("#vbReasonInput");
    ui.whyWant = want ? want.value.trim() : "";
    ui.whyReason = reason ? reason.value.trim() : "";
  }

  function bindWhy(st, catalog) {
    const want = $("#vbWantInput");
    const reason = $("#vbReasonInput");
    const onInput = () => syncWhyFields(st);
    if (want) want.addEventListener("input", onInput);
    if (reason) reason.addEventListener("input", onInput);
    const talk = $("#vbTalkBtn");
    if (talk) talk.onclick = () => {
      playClick();
      startSpeech(reason || want);
    };
    const prev = $("#vbPrevBtn");
    if (prev) prev.onclick = () => {
      syncWhyFields(st);
      playClick();
      goView("summary", 0, "prev");
    };
    const next = $("#vbNextBtn");
    if (next) next.onclick = () => {
      if (isViewOnly()) {
        playClick();
        goView("result", 0, "next");
        return;
      }
      syncWhyFields(st);
      const ui = ensureBookUi(st);
      const rec = completeRecords(st, catalog).find((item) => item.activity === st.finalCultureReflection?.selectedActivity);
      const wantLine = ui.whyWant || preciousLine(rec?.valueLabel || rec?.selectedElementLabel || "");
      const reasonLine = ui.whyReason ? `왜냐하면 ${ui.whyReason} 때문이에요.` : "";
      st.finalCultureReflection = {
        selectedActivity: rec?.activity || st.finalCultureReflection?.selectedActivity || "",
        selectedValue: rec?.valueLabel || rec?.selectedElementLabel || st.finalCultureReflection?.selectedValue || "",
        wantText: ui.whyWant,
        reasonText: ui.whyReason,
        reflectionText: [wantLine, reasonLine].filter(Boolean).join(" "),
        audioUrl: st.finalCultureReflection?.audioUrl || null,
        createdAt: new Date().toISOString()
      };
      save();
      playClick();
      goView("result", 0, "next");
    };
    const toc = $("#vbTocBtn");
    if (toc) toc.onclick = () => {
      syncWhyFields(st);
      playClick();
      goView("toc", 0, "prev");
    };
  }

  function bindResult(st) {
    const prev = $("#vbPrevBtn");
    if (prev) prev.onclick = () => {
      playClick();
      goView("why", 0, "prev");
    };
    const next = $("#vbNextBtn");
    if (next) next.onclick = () => {
      playClick();
      goView("done", 0, "next");
    };
    const toc = $("#vbTocBtn");
    if (toc) toc.onclick = () => {
      playClick();
      goView("toc", 0, "prev");
    };
    const voice = $("#vbVoiceBtn");
    if (voice) voice.onclick = () => {
      playClick();
      if (st.finalCultureReflection?.audioUrl) playVoice(st.finalCultureReflection.audioUrl);
    };
  }

  function bindDone() {
    const btn = $("#vbReplayBtn");
    if (btn) btn.onclick = () => {
      playClick();
      goView("toc", 0, "open");
    };
    bindAlbumOpen("open");
  }

  function bindMarks() {
    if (!_root) return;
    _root.querySelectorAll(".vb-mark[data-page]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        goView("page", Number(btn.getAttribute("data-page")) || 0, "next");
      };
    });
  }

  function bindHeaderAlbum(st) {
    const btn = $("#vbAlbumHeadBtn");
    if (!btn) return;
    const ui = ensureBookUi(st);
    const onAlbum = ui.view === "album";
    const hide = ui.view === "cover" || ui.view === "done";
    btn.hidden = hide;
    btn.textContent = onAlbum ? "목차로" : "보물 모아보기";
    btn.onclick = () => {
      playClick();
      goView(onAlbum ? "toc" : "album", 0, onAlbum ? "prev" : "next");
    };
  }

  function bindCurrent(st, catalog) {
    const ui = ensureBookUi(st);
    if (ui.view === "cover") bindCover();
    else if (ui.view === "toc") bindToc(st, catalog);
    else if (ui.view === "album") bindAlbum(st, catalog);
    else if (ui.view === "page") bindPage(st, catalog);
    else if (ui.view === "summary" || ui.view === "choose") bindSummary(st, catalog);
    else if (ui.view === "why") bindWhy(st, catalog);
    else if (ui.view === "result") bindResult(st);
    else if (ui.view === "done") bindDone();
    bindHeaderAlbum(st);
    bindMarks();
  }

  function applyEnterAnim(dir) {
    const sheet = $("#vbSheet");
    if (!sheet || dir === "none") return;
    sheet.classList.remove("is-leave", "is-leave-open", "is-enter-next", "is-enter-prev", "is-enter-open");
    const enterClass = dir === "open"
      ? "is-enter-open"
      : (dir === "prev" ? "is-enter-prev" : "is-enter-next");
    sheet.classList.add(enterClass);
    later(() => sheet.classList.remove(enterClass), TRANSITION_MS + 40);
  }

  function resetHeaderPos() {
    const header = _root && _root.querySelector(".vb-header");
    if (!header) return;
    header.style.left = "";
    header.style.width = "";
    header.style.top = "";
    header.style.position = "";
    header.style.zIndex = "";
    header.style.margin = "";
  }

  function syncArtLayer() {
    const img = $("#vbArt");
    const layer = $("#vbArtLayer");
    const stage = $("#vbArtStage");
    if (!img || !layer || !stage) return;
    const ir = img.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    if (ir.width < 2 || ir.height < 2 || sr.width < 2 || sr.height < 2) return;
    const w = ir.width;
    const h = ir.height;
    const imageLeft = ir.left - sr.left;
    const imageTop = ir.top - sr.top;
    layer.style.width = `${w}px`;
    layer.style.height = `${h}px`;
    layer.style.left = `${imageLeft}px`;
    layer.style.top = `${imageTop}px`;

    const header = _root && _root.querySelector(".vb-header");
    const overlay = _root && _root.querySelector(".vb-overlay");
    if (!header || !overlay) return;
    const or = overlay.getBoundingClientRect();
    const view = _root.getAttribute("data-view") || "";
    const cover = view === "cover" || view === "done";
    const insetL = cover ? 0.30 : 0.09;
    const insetR = cover ? 0.22 : 0.09;
    header.style.position = "absolute";
    header.style.zIndex = "5";
    header.style.margin = "0";
    header.style.left = `${sr.left - or.left + imageLeft + w * insetL}px`;
    header.style.width = `${Math.max(160, w * (1 - insetL - insetR))}px`;
    header.style.top = `${Math.max(8, sr.top - or.top + imageTop + h * 0.018)}px`;
  }

  /**
   * 활동 페이지의 질문·응답 글자 크기를 페이지에 맞춘다.
   * 보통은 크게 두고, 응답이 길어 페이지를 넘칠 때만 조금씩(최대 28%) 줄인다.
   */
  function fitSpread() {
    const body = _root && _root.querySelector(".vb-page-body");
    const spread = body && body.querySelector(".vb-spread");
    if (!spread) return;
    let fit = 1;
    spread.style.setProperty("--vb-fit", "1");
    for (let k = 0; k < 10 && body.scrollHeight > body.clientHeight + 1 && fit > 0.72; k += 1) {
      fit -= 0.03;
      spread.style.setProperty("--vb-fit", fit.toFixed(2));
    }
  }

  function scheduleFit() {
    const raf = window.requestAnimationFrame || ((f) => setTimeout(f, 16));
    // 문장 묶기(sentence-wrap.js)가 끝난 뒤에 한 번 더 맞춘다
    raf(() => raf(fitSpread));
    setTimeout(fitSpread, 180);
  }

  function watchArt() {
    scheduleFit();
    const img = $("#vbArt");
    const stage = $("#vbArtStage");
    if (img) {
      if (img.complete && img.naturalWidth) syncArtLayer();
      else img.addEventListener("load", syncArtLayer, { once: true });
    }
    window.addEventListener("resize", syncArtLayer);
    if (!window.__vbFitResize) {
      window.__vbFitResize = true;
      window.addEventListener("resize", () => scheduleFit());
    }
    if (_artObs) {
      try { _artObs.disconnect(); } catch (_) {}
      _artObs = null;
    }
    if (stage && typeof ResizeObserver !== "undefined") {
      _artObs = new ResizeObserver(() => syncArtLayer());
      _artObs.observe(stage);
    }
  }

  function paint(dir) {
    const st = getState();
    if (!st || !_root) return;
    syncFromState(st);
    const catalog = buildCatalog(st);
    const ui = ensureBookUi(st);
    if (ui.view === "choose") ui.view = "summary";
    if (ui.view === "page") {
      ui.pageIndex = Math.max(0, Math.min(ui.pageIndex, Math.max(0, catalog.length - 1)));
    }
    _root.setAttribute("data-view", ui.view || "cover");
    const html = viewHTML(st, catalog);
    const sheet = $("#vbSheet");
    if (!sheet) {
      _root.innerHTML = `<div class="vb-sheet" id="vbSheet">${html}</div>`;
      bindCurrent(st, catalog);
      watchArt();
      return;
    }
    if (!dir || dir === "none") {
      sheet.innerHTML = html;
      bindCurrent(st, catalog);
      watchArt();
      return;
    }
    _transitioning = true;
    sheet.classList.add(dir === "open" ? "is-leave-open" : "is-leave");
    later(() => {
      sheet.innerHTML = html;
      sheet.classList.remove("is-leave", "is-leave-open");
      applyEnterAnim(dir);
      bindCurrent(st, catalog);
      watchArt();
      _transitioning = false;
    }, TRANSITION_MS);
  }

  function ensureShell() {
    if (!_appEl) return null;
    _appEl.innerHTML = `
      <div class="vb-screen" id="value-guardian-book">
        <div class="vb-bg"></div>
        <div class="vb-overlay">
          <header class="vb-header">
            <span class="vb-header-space" aria-hidden="true"></span>
            <p class="vb-header-title">${escapeHtml((_ctx && _ctx.headerTitle) || "나의 수호책")}</p>
            <button type="button" class="vb-btn vb-btn--ghost" id="vbAlbumHeadBtn">보물 모아보기</button>
          </header>
          <div class="vb-sheet" id="vbSheet"></div>
        </div>
      </div>
    `;
    _root = _appEl.querySelector("#value-guardian-book");
    if (_root && isViewOnly()) _root.setAttribute("data-readonly", "true");
    return _root;
  }

  function openActivityPage(st, activity, menus) {
    if (!st) return;
    ensureBookUi(st);
    const catalog = buildCatalog(st, menus);
    const idx = catalog.findIndex((item) => item.activity === activity);
    st.valueBook.view = idx >= 0 ? "page" : "toc";
    st.valueBook.pageIndex = Math.max(0, idx);
  }

  window.ValueGuardianBook = {
    render(app, ctx) {
      _ctx = ctx || null;
      _appEl = app;
      stopAll();
      const st = getState();
      if (st) {
        syncFromState(st);
        ensureBookUi(st);
      }
      ensureShell();
      paint("none");
    },
    stop: stopAll,
    syncFromState,
    getProgress,
    upsertRecord,
    displayAnswer,
    displayQuestion,
    recordFromHanokExplorer,
    normalizeRecord,
    isCompleteRecord,
    pageStatus,
    openActivityPage,
    activityKeyByRoute: ACTIVITY_KEY_BY_ROUTE
  };
})();
