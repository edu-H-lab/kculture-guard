/**
 * STAGE 2-2 한옥 탐방 — 모델하우스형 메인맵 + 2단계 세부 탐방
 *
 * 1단계: 메인맵 → 안채/사랑채/부엌/뒷간/마당
 * 2단계: 안채·부엌·마당 안에서 마루·방·창호지·온돌·황토벽·기와 등을 살펴봄
 * 세부 탐방 완료 후 기존 HanokGame(한옥 만들기)으로 연결
 *
 * app.js 인터페이스: window.HanokTour = { render(app, ctx), stop(), createDefaultState() }
 */
(function () {
  "use strict";

  const HANOK_IMG_VER = "8";

  const HANOK_SCENES = {
    map: "assets/hanok/hanok-03-map.png",
    courtyard: "assets/hanok/hanok-04-courtyard.png",
    anchae: "assets/hanok/hanok-05-anchae.png",
    sarangchae: "assets/hanok/hanok-06-sarangchae.png",
    kitchen: "assets/hanok/hanok-07-kitchen.png",
    maru: "assets/hanok/hanok-08-maru.png",
    room: "assets/hanok/hanok-09-room.png",
    hanjiWindow: "assets/hanok/hanok-10-hanji-window.png",
    ondol: "assets/hanok/hanok-11-ondol.png",
    hwangtoWall: "assets/hanok/hanok-12-hwangto-wall.png",
    giwaRoof: "assets/hanok/hanok-13-giwa-roof.png",
    dwitgan: "assets/hanok/hanok-14-dwitgan.png",
    dwitganInside: "assets/hanok/hanok-15-dwitgan-inside.png"
  };

  /* 메인맵 파일이 없으면 탑뷰 전경으로 대체 */
  const HANOK_SCENE_FALLBACKS = {
    map: "assets/hanok/hanok-03-topview.png"
  };

  const HANOK_HOTSPOTS = [
    {
      id: "anchae",
      label: "안채",
      left: 50,
      top: 30,
      scene: "anchae",
      blurb: "가족들이 주로 생활하던 공간이에요.",
      enterLabel: "안채 살펴보기"
    },
    {
      id: "sarangchae",
      label: "사랑채",
      left: 20,
      top: 39,
      scene: "sarangchae",
      blurb: "손님을 맞고 생활하던 공간이에요.",
      enterLabel: "사랑채 살펴보기"
    },
    {
      id: "kitchen",
      label: "부엌",
      left: 68,
      top: 40,
      scene: "kitchen",
      blurb: "음식을 만들고 아궁이에 불을 피우던 곳이에요.",
      enterLabel: "부엌 살펴보기"
    },
    {
      id: "dwitgan",
      label: "뒷간",
      left: 87,
      top: 31,
      scene: "dwitgan",
      blurb: "옛날 집의 화장실은 집 밖에 따로 있었어요.",
      enterLabel: "뒷간 살펴보기"
    },
    {
      id: "courtyard",
      label: "마당",
      left: 50,
      top: 58,
      scene: "courtyard",
      blurb: "한옥의 여러 공간을 이어 주는 넓은 곳이에요.",
      enterLabel: "마당 살펴보기"
    }
  ];

  const HANOK_DWITGAN_DOOR = {
    left: 60,
    top: 38,
    width: 13,
    height: 30
  };

  const HANOK_DETAIL_SCENES = {
    maru: {
      id: "maru",
      label: "마루",
      parent: "anchae",
      question: "마루는 왜 바닥보다 높게 만들었을까요?",
      hint: "직접 살펴보며 생각해 보세요.",
      discovery: "마루는 바람이 잘 통하고 더운 날 시원하게 지내는 데 도움이 되었어요.",
      lookOnScene: true
    },
    room: {
      id: "room",
      label: "방",
      parent: "anchae"
    },
    hanjiWindow: {
      id: "hanjiWindow",
      label: "창호지",
      parent: "room",
      question: "창호지 창문으로 빛이 들어올까요?",
      hint: "직접 살펴보며 생각해 보세요.",
      discovery: "창호지는 햇빛을 부드럽게 들어오게 해 주어요."
    },
    ondol: {
      id: "ondol",
      label: "온돌",
      parent: "room",
      question: "불을 피우면 방바닥은 어떻게 따뜻해질까요?",
      hint: "아궁이에서 방바닥까지 따라가 보세요.",
      discovery: "아궁이의 열이 방바닥 아래를 지나가면서 방을 따뜻하게 했어요.",
      heatFlow: true
    },
    hwangtoWall: {
      id: "hwangtoWall",
      label: "황토벽",
      parent: "anchae",
      question: "한옥의 벽에는 왜 흙을 발랐을까요?",
      hint: "직접 살펴보며 생각해 보세요.",
      discovery: "한옥은 흙, 나무, 돌 같은 자연 재료를 많이 사용했어요."
    },
    giwaRoof: {
      id: "giwaRoof",
      label: "기와지붕",
      parent: "anchae",
      question: "기와는 왜 지붕 위에 올렸을까요?",
      hint: "직접 살펴보며 생각해 보세요.",
      discovery: "기와는 비와 눈으로부터 집을 지켜 주어요."
    },
    dwitganInside: {
      id: "dwitganInside",
      label: "뒷간",
      parent: "dwitgan",
      question: "지금 우리가 사용하는 화장실과 무엇이 다를까요?",
      hint: "비교해 보며 생각해 보세요."
    }
  };

  const HANOK_SCENE_MARKERS = {
    anchae: [
      { id: "maru", label: "마루", left: 48, top: 64, scene: "maru" },
      { id: "room", label: "방", left: 50, top: 46, scene: "room" },
      { id: "hwangtoWall", label: "황토벽", left: 16, top: 48, scene: "hwangtoWall" },
      { id: "giwaRoof", label: "기와지붕", left: 68, top: 24, scene: "giwaRoof" }
    ],
    courtyard: [
      { id: "hwangtoWall", label: "황토벽", left: 22, top: 46, scene: "hwangtoWall" },
      { id: "giwaRoof", label: "기와지붕", left: 50, top: 28, scene: "giwaRoof" }
    ],
    kitchen: [
      { id: "agungi", label: "아궁이", left: 48, top: 64, card: "agungi" }
    ],
    room: [
      { id: "hanjiWindow", label: "창호지", left: 54, top: 44, scene: "hanjiWindow" },
      { id: "ondol", label: "온돌", left: 48, top: 74, scene: "ondol" }
    ]
  };

  /* 온돌 단면: 아궁이(오른쪽) → 구들(바닥 아래) → 굴뚝(왼쪽 바깥) */
  const HANOK_ONDOL_ARROWS = [
    { left: 78, top: 72, rotate: 168, delay: 0 },
    { left: 66, top: 70, rotate: 172, delay: 0.16 },
    { left: 54, top: 68, rotate: 176, delay: 0.32 },
    { left: 40, top: 67, rotate: 178, delay: 0.48 },
    { left: 24, top: 67, rotate: 180, delay: 0.64 },
    { left: 14, top: 63, rotate: 250, delay: 0.8 },
    { left: 12, top: 46, rotate: 270, delay: 0.96 },
    { left: 12, top: 28, rotate: 270, delay: 1.12 }
  ];
  const HANOK_ONDOL_WARM_ARROWS = [
    { left: 58, top: 58, rotate: 270, delay: 0.4 },
    { left: 46, top: 57, rotate: 270, delay: 0.56 }
  ];

  const PLACE_IDS = HANOK_HOTSPOTS.map((h) => h.id);
  const DETAIL_IDS = ["maru", "room", "hanjiWindow", "ondol", "hwangtoWall", "giwaRoof", "dwitganInside"];
  const ANCHAE_DETAIL_IDS = ["maru", "room", "hanjiWindow", "ondol", "hwangtoWall", "giwaRoof"];
  const TRANSITION_MS = 380;

  let _ctx = null;
  let _appEl = null;
  let _root = null;
  let timers = [];
  let resizeObs = null;
  let transitioning = false;

  const $ = (sel) => (_root ? _root.querySelector(sel) : null);

  function later(fn, ms) {
    const t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  }

  function playClick() {
    if (_ctx && _ctx.playSound) _ctx.playSound("click.mp3");
  }

  function emptyDetails() {
    return {
      maru: false,
      room: false,
      hanjiWindow: false,
      ondol: false,
      hwangtoWall: false,
      giwaRoof: false,
      dwitganInside: false
    };
  }

  function createDefaultState() {
    return {
      scene: "map",
      fromScene: null,
      building: false,
      completePopupShown: false,
      detailCompletePopupShown: false,
      visitedHanokPlaces: {
        anchae: false,
        sarangchae: false,
        kitchen: false,
        dwitgan: false,
        courtyard: false
      },
      visitedHanokDetails: emptyDetails()
    };
  }

  function tourState() {
    if (!_ctx) return createDefaultState();
    const s = _ctx.getState();
    if (!s.hanokTour) s.hanokTour = createDefaultState();
    const t = s.hanokTour;
    if (!t.visitedHanokPlaces) t.visitedHanokPlaces = createDefaultState().visitedHanokPlaces;
    PLACE_IDS.forEach((id) => {
      if (typeof t.visitedHanokPlaces[id] !== "boolean") t.visitedHanokPlaces[id] = false;
    });
    if (!t.visitedHanokDetails) t.visitedHanokDetails = emptyDetails();
    DETAIL_IDS.forEach((id) => {
      if (typeof t.visitedHanokDetails[id] !== "boolean") t.visitedHanokDetails[id] = false;
    });
    if (!t.scene) t.scene = "map";
    return t;
  }

  function withVer(src) {
    const path = String(src || "").replace(/\.(png|jpe?g)(\?[^#]*)?$/i, ".webp$2");
    return `${path}?v=${HANOK_IMG_VER}`;
  }

  function sceneSrc(key) {
    return withVer(HANOK_SCENES[key] || HANOK_SCENES.map);
  }

  function imgTag(key, alt) {
    const src = sceneSrc(key);
    const fallback = HANOK_SCENE_FALLBACKS[key];
    const fbAttr = fallback
      ? ` onerror="this.onerror=null;this.src='${withVer(fallback)}'"`
      : "";
    return `<img class="ht-img" src="${src}" alt="${alt}" draggable="false"${fbAttr} />`;
  }

  function visitedCount() {
    const v = tourState().visitedHanokPlaces;
    return PLACE_IDS.reduce((n, id) => n + (v[id] ? 1 : 0), 0);
  }

  function allVisited() {
    return visitedCount() >= PLACE_IDS.length;
  }

  function detailCount() {
    const v = tourState().visitedHanokDetails;
    return ANCHAE_DETAIL_IDS.reduce((n, id) => n + (v[id] ? 1 : 0), 0);
  }

  function allDetailsVisited() {
    return detailCount() >= ANCHAE_DETAIL_IDS.length;
  }

  function markVisited(placeId) {
    if (!PLACE_IDS.includes(placeId)) return;
    const t = tourState();
    if (!t.visitedHanokPlaces[placeId]) {
      t.visitedHanokPlaces[placeId] = true;
      if (_ctx && _ctx.saveProgress) _ctx.saveProgress();
    }
  }

  function markDetail(detailId) {
    if (!DETAIL_IDS.includes(detailId)) return;
    const t = tourState();
    if (!t.visitedHanokDetails[detailId]) {
      t.visitedHanokDetails[detailId] = true;
      if (_ctx && _ctx.saveProgress) _ctx.saveProgress();
    }
  }

  function hotspotById(id) {
    return HANOK_HOTSPOTS.find((h) => h.id === id) || null;
  }

  function sceneTitle(sceneId) {
    if (sceneId === "dwitganInside") return "뒷간";
    if (HANOK_DETAIL_SCENES[sceneId]) return HANOK_DETAIL_SCENES[sceneId].label;
    const h = HANOK_HOTSPOTS.find((x) => x.scene === sceneId);
    return h ? h.label : "";
  }

  function stopAll() {
    timers.forEach(clearTimeout);
    timers = [];
    transitioning = false;
    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }
    window.removeEventListener("resize", syncImageLayer);
    window.removeEventListener("orientationchange", syncImageLayer);
  }

  function ensureShell() {
    let host = document.getElementById("hanok-tour");
    if (host && _appEl.contains(host)) {
      _root = host;
      return host;
    }
    if (_ctx && _ctx.sceneTemplate) {
      _appEl.innerHTML = _ctx.sceneTemplate(
        "STAGE 2-2 한옥 세우기",
        `<div id="hanok-tour" class="ht-root"></div>`
      );
      if (_ctx.setupNavigationAndHelp) {
        _ctx.setupNavigationAndHelp("궁금한 곳의 이름을 눌러 한옥을 둘러보세요.");
      }
      host = _appEl.querySelector("#hanok-tour");
    } else {
      host = _appEl;
      host.id = "hanok-tour";
      host.classList.add("ht-root");
    }
    _root = host;
    return host;
  }

  function progressHTML() {
    const n = visitedCount();
    const total = PLACE_IDS.length;
    const buildBtn = (n >= total && allDetailsVisited())
      ? `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htBuildBtn">한옥 만들기</button>`
      : "";
    return `
      <div class="ht-progress" aria-live="polite">
        <p class="ht-progress-title">한옥 탐방</p>
        <p class="ht-progress-count">${total}곳 중 ${n}곳을 살펴봤어요.</p>
        ${buildBtn}
      </div>
    `;
  }

  function anchaeProgressHTML() {
    const n = detailCount();
    const total = ANCHAE_DETAIL_IDS.length;
    const buildBtn = (n >= total && allVisited())
      ? `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htBuildBtn">한옥 만들기</button>`
      : "";
    return `
      <div class="ht-progress ht-progress--detail" aria-live="polite">
        <p class="ht-progress-title">안채 탐방</p>
        <p class="ht-progress-count">${n} / ${total}곳</p>
        ${buildBtn}
      </div>
    `;
  }

  function markerHTML(m, visited) {
    return `
      <button type="button"
        class="ht-marker${visited ? " is-visited" : ""}"
        data-place="${m.id}"
        data-scene="${m.scene || ""}"
        data-card="${m.card || ""}"
        style="left:${m.left}%;top:${m.top}%"
        aria-label="${m.label}${visited ? ", 살펴본 곳" : ""}">
        ${m.label}
      </button>
    `;
  }

  function isMarkerVisited(m) {
    const t = tourState();
    if (t.visitedHanokDetails && t.visitedHanokDetails[m.id]) return true;
    if (m.id === "agungi" && t.visitedHanokDetails.ondol) return true;
    return false;
  }

  function markersFor(sceneId) {
    const list = HANOK_SCENE_MARKERS[sceneId] || [];
    return list.map((m) => markerHTML(m, isMarkerVisited(m))).join("");
  }

  function navHTML(buttons) {
    return `
      <div class="ht-nav">
        ${buttons.map((b) =>
          `<button type="button" class="ht-text-btn" data-nav="${b.scene}">${b.label}</button>`
        ).join("")}
      </div>
    `;
  }

  function mapHTML() {
    const t = tourState();
    const markers = HANOK_HOTSPOTS.map((h) =>
      markerHTML(h, !!t.visitedHanokPlaces[h.id])
    ).join("");
    return `
      <div class="ht-scene" data-scene="map">
        <div class="ht-stage">
          ${imgTag("map", "한옥 마당 배치도")}
          <div class="ht-layer" id="htLayer">${markers}</div>
        </div>
        <div class="ht-guide">
          <p class="ht-guide-title">한옥을 둘러봐요!</p>
          <p class="ht-guide-sub">궁금한 곳의 이름을 눌러 살펴보세요.</p>
        </div>
        ${progressHTML()}
        <div class="ht-modal hidden" id="htPlaceModal" hidden></div>
        <div class="ht-modal hidden" id="htDoneModal" hidden></div>
      </div>
    `;
  }

  function askHTML(def) {
    if (!def || !def.question) return "";
    const look = def.discovery
      ? `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htLookBtn">살펴보기</button>`
      : "";
    return `
      <div class="ht-ask">
        <p class="ht-ask-name">${def.label}</p>
        <p class="ht-ask-q">${def.question}</p>
        ${def.hint ? `<p class="ht-ask-sub">${def.hint}</p>` : ""}
        ${look}
      </div>
    `;
  }

  function ondolHeatHTML() {
    const arrowSvg = `<svg viewBox="0 0 40 32" aria-hidden="true"><path d="M3 5 L34 16 L3 27 L11 16 Z" fill="#ff6a00" stroke="#fff8e6" stroke-width="2.6" stroke-linejoin="round"/></svg>`;
    const warmSvg = `<svg viewBox="0 0 40 32" aria-hidden="true"><path d="M3 5 L34 16 L3 27 L11 16 Z" fill="#ffb020" stroke="#fff8e6" stroke-width="2.6" stroke-linejoin="round"/></svg>`;
    const arrows = HANOK_ONDOL_ARROWS.map((a) =>
      `<span class="ht-heat-arrow" style="left:${a.left}%;top:${a.top}%;--ht-rot:${a.rotate}deg;--ht-delay:${a.delay}s">${arrowSvg}</span>`
    ).join("");
    const warm = HANOK_ONDOL_WARM_ARROWS.map((a) =>
      `<span class="ht-heat-arrow ht-heat-arrow--warm" style="left:${a.left}%;top:${a.top}%;--ht-rot:${a.rotate}deg;--ht-delay:${a.delay}s">${warmSvg}</span>`
    ).join("");
    return `
      <div class="ht-heat" aria-hidden="true">
        ${arrows}${warm}
        <span class="ht-heat-caption" style="left:86%;top:80%">열기</span>
      </div>`;
  }

  function sceneNav(sceneId) {
    const def = HANOK_DETAIL_SCENES[sceneId];
    const from = tourState().fromScene;
    if (sceneId === "dwitgan") {
      return navHTML([{ label: "한옥 지도 보기", scene: "map" }]);
    }
    if (sceneId === "dwitganInside") {
      return navHTML([
        { label: "뒷간으로 돌아가기", scene: "dwitgan" },
        { label: "한옥 지도 보기", scene: "map" }
      ]);
    }
    if (sceneId === "sarangchae" || sceneId === "courtyard" || sceneId === "kitchen" || sceneId === "anchae") {
      return navHTML([{ label: "한옥 지도 보기", scene: "map" }]);
    }
    if (sceneId === "hanjiWindow") {
      return navHTML([
        { label: "방으로 돌아가기", scene: "room" },
        { label: "안채로 돌아가기", scene: "anchae" },
        { label: "한옥 지도 보기", scene: "map" }
      ]);
    }
    if (sceneId === "ondol") {
      const btns = [];
      if (from === "kitchen") btns.push({ label: "부엌으로 돌아가기", scene: "kitchen" });
      else btns.push({ label: "방으로 돌아가기", scene: "room" });
      btns.push({ label: "안채로 돌아가기", scene: "anchae" });
      btns.push({ label: "한옥 지도 보기", scene: "map" });
      return navHTML(btns);
    }
    if (sceneId === "hwangtoWall" || sceneId === "giwaRoof") {
      const btns = [];
      if (from === "courtyard") btns.push({ label: "마당으로 돌아가기", scene: "courtyard" });
      btns.push({ label: "안채로 돌아가기", scene: "anchae" });
      btns.push({ label: "한옥 지도 보기", scene: "map" });
      return navHTML(btns);
    }
    if (def && def.parent) {
      const parentLabel = sceneTitle(def.parent);
      return navHTML([
        { label: `${parentLabel}로 돌아가기`, scene: def.parent },
        { label: "한옥 지도 보기", scene: "map" }
      ]);
    }
    return navHTML([{ label: "한옥 지도 보기", scene: "map" }]);
  }

  function sceneHTML(sceneId) {
    const title = sceneTitle(sceneId);
    const def = HANOK_DETAIL_SCENES[sceneId];
    const door = sceneId === "dwitgan"
      ? `<button type="button" class="ht-door" id="htDwitganDoor"
           style="left:${HANOK_DWITGAN_DOOR.left}%;top:${HANOK_DWITGAN_DOOR.top}%;width:${HANOK_DWITGAN_DOOR.width}%;height:${HANOK_DWITGAN_DOOR.height}%"
           aria-label="뒷간 문">
           <span class="ht-marker ht-marker--door">문</span>
         </button>`
      : "";
    const heat = def && def.heatFlow ? ondolHeatHTML() : "";
    const extra = sceneId === "sarangchae"
      ? `<div class="ht-ask">
           <p class="ht-ask-name">사랑채</p>
           <p class="ht-ask-q">손님을 맞거나 생활하던 공간이에요.</p>
           <p class="ht-ask-sub">안채와 사랑채는 무엇이 다를까요?</p>
         </div>`
      : "";
    const ask = askHTML(def);
    const name = (ask || extra) ? "" : `<div class="ht-place-name">${title}</div>`;
    const progress = sceneId === "anchae" ? anchaeProgressHTML() : "";
    return `
      <div class="ht-scene" data-scene="${sceneId}">
        <div class="ht-stage" id="htStage">
          ${imgTag(sceneId, title)}
          <div class="ht-layer" id="htLayer">${markersFor(sceneId)}${door}${heat}</div>
        </div>
        ${name}
        ${ask}
        ${extra}
        ${progress}
        ${sceneNav(sceneId)}
        <div class="ht-modal hidden" id="htPlaceModal" hidden></div>
        <div class="ht-modal hidden" id="htDoorModal" hidden></div>
        <div class="ht-modal hidden" id="htFindModal" hidden></div>
        <div class="ht-modal hidden" id="htDoneModal" hidden></div>
      </div>
    `;
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

  function showModal(el, html) {
    if (!el) return;
    el.innerHTML = html;
    el.hidden = false;
    el.classList.remove("hidden");
  }

  function hideModal(el) {
    if (!el) return;
    el.classList.add("hidden");
    el.hidden = true;
    el.innerHTML = "";
  }

  function bindDelegated(id, fn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      playClick();
      fn(e);
    });
  }

  function bindNav() {
    if (!_root) return;
    _root.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (transitioning) return;
        playClick();
        goScene(btn.getAttribute("data-nav"));
      });
    });
  }

  function placeIntroCard(h) {
    return `
      <div class="ht-card" role="dialog" aria-labelledby="htCardTitle">
        <p class="ht-card-title" id="htCardTitle">${h.label}</p>
        <p class="ht-card-body">${h.blurb}</p>
        <button type="button" class="ht-text-btn ht-text-btn--accent" id="htEnterPlace">${h.enterLabel}</button>
        <button type="button" class="ht-text-btn ht-text-btn--quiet" id="htCloseCard">닫기</button>
      </div>
    `;
  }

  function bindMap() {
    const t = tourState();
    $$markers().forEach((btn) => {
      btn.addEventListener("click", () => {
        if (transitioning) return;
        playClick();
        const h = hotspotById(btn.dataset.place);
        if (!h) return;
        openPlaceIntro(h);
      });
    });
    const modal = $("#htPlaceModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) hideModal(modal);
      });
    }
    bindDelegated("htBuildBtn", startBuilding);
    if (allVisited() && !t.completePopupShown) {
      later(() => {
        if (tourState().scene !== "map") return;
        if (tourState().completePopupShown) return;
        tourState().completePopupShown = true;
        showPlaceCompletePopup();
      }, 450);
    }
  }

  function openPlaceIntro(h) {
    const modal = $("#htPlaceModal");
    showModal(modal, placeIntroCard(h));
    bindDelegated("htEnterPlace", () => {
      hideModal(modal);
      goScene(h.scene, { placeId: h.id });
    });
    bindDelegated("htCloseCard", () => hideModal(modal));
  }

  function $$markers() {
    return _root ? Array.from(_root.querySelectorAll(".ht-marker[data-place]")) : [];
  }

  function showPlaceCompletePopup() {
    const modal = $("#htDoneModal");
    if (!modal) return;
    const readyToBuild = allVisited() && allDetailsVisited();
    showModal(modal, `
      <div class="ht-card" role="dialog" aria-labelledby="htDoneTitle">
        <p class="ht-card-title" id="htDoneTitle">${readyToBuild ? "한옥을 모두 살펴보았어요!" : "한옥의 여러 공간을 모두 살펴보았어요!"}</p>
        <p class="ht-card-body">${readyToBuild ? "이제 직접 한옥을 지어 볼까요?" : "안채 안에서 마루와 방도 더 살펴볼 수 있어요."}</p>
        ${readyToBuild
          ? `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htDoneBuild">한옥 만들기</button>`
          : `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htDoneAnchae">안채 살펴보기</button>`}
        <button type="button" class="ht-text-btn ht-text-btn--quiet" id="htDoneClose">닫기</button>
      </div>
    `);
    bindDelegated("htDoneBuild", startBuilding);
    bindDelegated("htDoneAnchae", () => {
      hideModal(modal);
      goScene("anchae", { placeId: "anchae" });
    });
    bindDelegated("htDoneClose", () => hideModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal(modal);
    });
  }

  function showDetailCompletePopup() {
    const modal = $("#htDoneModal");
    if (!modal) return;
    const readyToBuild = allVisited() && allDetailsVisited();
    showModal(modal, `
      <div class="ht-card" role="dialog" aria-labelledby="htDoneTitle">
        <p class="ht-card-title" id="htDoneTitle">${readyToBuild ? "한옥을 모두 살펴보았어요!" : "안채의 여러 곳을 살펴보았어요!"}</p>
        <p class="ht-card-body">${readyToBuild ? "이제 직접 한옥을 지어 볼까요?" : "한옥 지도에서 아직 안 본 곳도 살펴보세요."}</p>
        ${readyToBuild
          ? `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htDoneBuild">한옥 만들기</button>`
          : `<button type="button" class="ht-text-btn ht-text-btn--accent" id="htDoneMap">한옥 지도 보기</button>`}
        <button type="button" class="ht-text-btn ht-text-btn--quiet" id="htDoneClose">닫기</button>
      </div>
    `);
    bindDelegated("htDoneBuild", startBuilding);
    bindDelegated("htDoneMap", () => {
      hideModal(modal);
      goScene("map");
    });
    bindDelegated("htDoneClose", () => hideModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal(modal);
    });
  }

  function showDiscovery(def) {
    const modal = $("#htFindModal");
    if (!modal || !def || !def.discovery) return;
    showModal(modal, `
      <div class="ht-card" role="dialog" aria-labelledby="htFindTitle">
        <p class="ht-card-title" id="htFindTitle">${def.label}</p>
        <p class="ht-card-body">${def.discovery}</p>
        <button type="button" class="ht-text-btn ht-text-btn--accent" id="htFindOk">알겠어요</button>
      </div>
    `);
    bindDelegated("htFindOk", () => hideModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal(modal);
    });
  }

  function bindLook(def) {
    if (!def) return;
    bindDelegated("htLookBtn", () => showDiscovery(def));
    if (def.lookOnScene) {
      const stage = $("#htStage");
      if (stage) {
        stage.addEventListener("click", (e) => {
          if (e.target.closest(".ht-marker, .ht-door, .ht-nav, .ht-ask, .ht-modal")) return;
          playClick();
          showDiscovery(def);
        });
      }
    }
  }

  function bindSceneMarkers(sceneId) {
    $$markers().forEach((btn) => {
      btn.addEventListener("click", () => {
        if (transitioning) return;
        playClick();
        const card = btn.dataset.card;
        const next = btn.dataset.scene;
        if (card === "agungi") {
          openAgungiCard();
          return;
        }
        if (next) goScene(next, { detailId: next, from: sceneId });
      });
    });
  }

  function openAgungiCard() {
    const modal = $("#htPlaceModal");
    showModal(modal, `
      <div class="ht-card" role="dialog" aria-labelledby="htCardTitle">
        <p class="ht-card-title" id="htCardTitle">아궁이</p>
        <p class="ht-card-body">여기서 불을 피워 음식을 만들고 방을 따뜻하게 했어요.</p>
        <button type="button" class="ht-text-btn ht-text-btn--accent" id="htEnterOndol">온돌 구조 살펴보기</button>
        <button type="button" class="ht-text-btn ht-text-btn--quiet" id="htCloseCard">닫기</button>
      </div>
    `);
    bindDelegated("htEnterOndol", () => {
      hideModal(modal);
      goScene("ondol", { detailId: "ondol", from: "kitchen" });
    });
    bindDelegated("htCloseCard", () => hideModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal(modal);
    });
  }

  function bindDwitganDoor() {
    const door = $("#htDwitganDoor");
    if (!door) return;
    door.addEventListener("click", () => {
      if (transitioning) return;
      playClick();
      showModal($("#htDoorModal"), `
        <div class="ht-card" role="dialog" aria-labelledby="htDoorTitle">
          <p class="ht-card-title" id="htDoorTitle">안도 살펴볼까요?</p>
          <button type="button" class="ht-text-btn ht-text-btn--accent" id="htEnterInside">안으로 들어가기</button>
          <button type="button" class="ht-text-btn ht-text-btn--quiet" id="htCloseDoor">닫기</button>
        </div>
      `);
      bindDelegated("htEnterInside", () => {
        hideModal($("#htDoorModal"));
        goScene("dwitganInside", { detailId: "dwitganInside", from: "dwitgan" });
      });
      bindDelegated("htCloseDoor", () => hideModal($("#htDoorModal")));
    });
    const doorModal = $("#htDoorModal");
    if (doorModal) {
      doorModal.addEventListener("click", (e) => {
        if (e.target === doorModal) hideModal(doorModal);
      });
    }
  }

  function bindPlace(sceneId) {
    bindNav();
    bindSceneMarkers(sceneId);
    bindDelegated("htBuildBtn", startBuilding);
    bindDwitganDoor();
    const def = HANOK_DETAIL_SCENES[sceneId];
    bindLook(def);

    if (sceneId === "anchae" && allDetailsVisited() && !tourState().detailCompletePopupShown) {
      later(() => {
        if (tourState().scene !== "anchae") return;
        if (tourState().detailCompletePopupShown) return;
        tourState().detailCompletePopupShown = true;
        showDetailCompletePopup();
      }, 450);
    }
  }

  function applyEnterAnim() {
    const scene = $(".ht-scene");
    if (!scene) return;
    scene.classList.add("is-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scene.classList.remove("is-enter"));
    });
  }

  function paint(opts) {
    const entering = !!(opts && opts.entering);
    const host = ensureShell();
    const sceneId = tourState().scene || "map";
    host.innerHTML = sceneId === "map" ? mapHTML() : sceneHTML(sceneId);
    if (sceneId === "map") bindMap();
    else bindPlace(sceneId);
    watchLayer();
    if (entering) applyEnterAnim();
  }

  function goScene(nextScene, opts) {
    if (transitioning) return;
    opts = opts || {};
    const scene = $(".ht-scene");
    const run = () => {
      transitioning = false;
      const t = tourState();
      t.scene = nextScene;
      if (opts.from) t.fromScene = opts.from;
      if (opts.placeId) markVisited(opts.placeId);
      if (opts.detailId) markDetail(opts.detailId);
      paint({ entering: true });
    };
    if (!scene) {
      run();
      return;
    }
    transitioning = true;
    scene.classList.add("is-out");
    later(run, TRANSITION_MS);
  }

  function startBuilding() {
    const t = tourState();
    t.building = true;
    t.scene = "map";
    if (_ctx && _ctx.saveProgress) _ctx.saveProgress();
    stopAll();
    if (_ctx && typeof _ctx.startBuilding === "function") {
      _ctx.startBuilding();
      return;
    }
    if (window.HanokGame && window.HanokGame.render) {
      window.HanokGame.render(_appEl, _ctx);
    }
  }

  window.HanokTour = {
    render(app, ctx) {
      _ctx = ctx || null;
      _appEl = app;
      stopAll();
      const t = tourState();
      if (t.building && _ctx && typeof _ctx.startBuilding === "function") {
        _ctx.startBuilding();
        return;
      }
      if (!t.scene) t.scene = "map";
      paint();
    },
    stop: stopAll,
    createDefaultState,
    HANOK_SCENES,
    HANOK_HOTSPOTS,
    HANOK_DETAIL_SCENES,
    HANOK_SCENE_MARKERS
  };
})();
