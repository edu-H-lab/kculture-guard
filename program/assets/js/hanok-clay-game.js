/**
 * STAGE 2-2 한옥 집짓기 — 말랑말랑 클레이 버전 (v1)
 *
 * 흐름:
 *   장인 도깨비 스토리 팝업 → 6단계 미니게임
 *   (주춧돌 찾기 → 톱질 벌목·기둥 드래그 → 온돌 잇기 → 황토 캐기·바르기
 *    → 대패질·창호지 → 기와 한 장씩 얹기)
 *   → 컨페티 엔딩 → 미션 완료
 *
 * 이름짓기/한옥마을(Firebase 하이브리드)은 기존 hanok-game.js에서 이식.
 * 기존 파일(assets/js/hanok-game.js)은 백업으로 그대로 남아 있으며,
 * index.html에서 로드 대상만 이 파일로 바뀌었습니다.
 *
 * app.js 인터페이스: window.HanokGame = { render(app, ctx), stop(), createDefaultState() }
 * 단독 실행: 페이지에 #hanok-app 요소가 있으면 스스로 부팅 (hanok-adventure.html 참고)
 */
(function () {
  "use strict";

  /* ================= 0. 클레이 스타일 CSS 주입 ================= */
  const HK_CSS = `
.hk-wrap{max-width:1100px;margin:0 auto;height:100%;max-height:100%;padding:4px 10px 8px;display:grid;
  grid-template-columns:minmax(0,1.12fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;
  font-family:'Jua','Comic Sans MS',sans-serif;color:#5b4632;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.hk-wrap *{box-sizing:border-box}
.hk-header{text-align:center;padding:2px 0 0;grid-column:1 / -1}
.hk-title{font-size:clamp(1.5rem,4.5vw,2.2rem);color:#7a4f28;margin:0;
  text-shadow:0 2px 0 rgba(255,255,255,.7), 0 6px 14px rgba(122,79,40,.18);letter-spacing:.02em}
.hk-sub{margin:4px 0 0;color:#8a6b48;font-size:clamp(1.18rem,3.2vw,1.48rem);font-weight:700;letter-spacing:.01em}
.hk-chips{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px}
.hk-chip{padding:10px 20px;border-radius:999px;font-size:clamp(1.22rem,3.2vw,1.55rem);font-weight:800;
  background:linear-gradient(145deg,#fffdf6,#f3e8d0);color:#b7a07f;
  box-shadow:0 4px 8px rgba(122,79,40,.12), inset 0 2px 4px rgba(255,255,255,.9), inset 0 -3px 5px rgba(122,79,40,.08);
  transition:transform .25s, background .25s}
.hk-chip.act{background:linear-gradient(145deg,#ffdf94,#ffb95c);color:#7a4f28;transform:scale(1.05);
  box-shadow:0 6px 14px rgba(230,150,50,.35), inset 0 2px 4px rgba(255,255,255,.8), inset 0 -3px 6px rgba(160,90,20,.18)}
.hk-chip.done{background:linear-gradient(145deg,#c8ecb0,#92d476);color:#3f6b2a}
.hk-card{background:linear-gradient(150deg,#fffdf8,#f8eeda);border-radius:26px;
  box-shadow:0 14px 28px rgba(122,79,40,.16), inset 0 -8px 14px rgba(122,79,40,.06), inset 0 8px 14px rgba(255,255,255,.85)}
.hk-scene{min-height:0;min-width:0;padding:8px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hk-scene svg{width:100%;height:100%;max-height:none;display:block}
.hk-panel{min-height:0;min-width:0;padding:8px 12px 12px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.hk-panel .hk-mg{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.hk-mg svg{max-height:min(42dvh,320px);width:auto;max-width:100%;margin-left:auto;margin-right:auto}
.hk-mg svg#hk-hill-svg{max-height:min(20dvh,150px)}
.hk-inst{font-size:clamp(1.15rem,3.2vw,1.45rem);color:#7a4f28;text-align:center;margin:0 0 10px;line-height:1.5}
.hk-inst b{color:#e07b39}
.hk-btn{font-family:inherit;font-size:1.15rem;color:#fff;border:none;cursor:pointer;
  padding:13px 30px;border-radius:20px;touch-action:manipulation;user-select:none;
  background:linear-gradient(160deg,#ffb45c,#f2833a);
  box-shadow:0 8px 0 #cf6524, 0 14px 20px rgba(207,101,36,.3), inset 0 3px 6px rgba(255,255,255,.5);
  text-shadow:0 2px 3px rgba(160,70,10,.3);transition:transform .08s, box-shadow .08s}
.hk-btn:active{transform:translateY(6px);box-shadow:0 2px 0 #cf6524, 0 6px 10px rgba(207,101,36,.3), inset 0 3px 6px rgba(255,255,255,.5)}
.hk-btn.grn{background:linear-gradient(160deg,#9fdb70,#6cbb45);box-shadow:0 8px 0 #4f9330, 0 14px 20px rgba(90,150,50,.3), inset 0 3px 6px rgba(255,255,255,.5)}
.hk-btn.grn:active{box-shadow:0 2px 0 #4f9330, 0 6px 10px rgba(90,150,50,.3), inset 0 3px 6px rgba(255,255,255,.5)}
.hk-btn.sm{font-size:.95rem;padding:9px 20px;border-radius:15px}
.hk-overlay{position:fixed;inset:0;z-index:60;padding:18px;background:rgba(90,58,28,.42);backdrop-filter:blur(3px);
  display:flex;align-items:center;justify-content:center;animation:hkFade .3s both;font-family:'Jua','Comic Sans MS',sans-serif}
.hk-pop{max-width:520px;width:100%;padding:24px 26px 22px;text-align:center;position:relative;
  background:linear-gradient(150deg,#fffdf8,#f9efdc);border-radius:30px;
  box-shadow:0 22px 44px rgba(60,35,10,.35), inset 0 -10px 16px rgba(122,79,40,.07), inset 0 10px 16px rgba(255,255,255,.9);
  animation:hkPopIn .5s cubic-bezier(.34,1.56,.64,1) both}
.hk-pop-badge{display:inline-block;padding:5px 16px;border-radius:999px;font-size:.85rem;color:#fff;
  background:linear-gradient(150deg,#8fc7ee,#5b9bd4);
  box-shadow:0 4px 8px rgba(70,120,180,.3), inset 0 2px 3px rgba(255,255,255,.6);margin-bottom:8px}
.hk-pop h2{margin:6px 0 4px;color:#7a4f28;font-size:clamp(1.45rem,3.4vw,1.75rem)}
.hk-pop p{margin:10px 0 16px;font-size:clamp(1.15rem,2.8vw,1.4rem);line-height:1.75;color:#6b543c}
.hk-pop #hk-story-text{
  text-align:left;word-break:keep-all;overflow-wrap:break-word;letter-spacing:.01em;
  padding:4px 6px 2px;line-height:1.8;white-space:pre-line;
}
.hk-goblin{width:148px;height:148px;margin:0 auto;animation:hkBob 2.2s ease-in-out infinite}
.hk-goblin img,.hk-goblin svg{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(120,70,30,.25))}
.hk-toast{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:20;
  max-width:92%;padding:9px 18px;border-radius:18px;font-size:.95rem;color:#7a4f28;white-space:nowrap;
  background:linear-gradient(150deg,#fff8e6,#ffe9bd);
  box-shadow:0 8px 16px rgba(122,79,40,.22), inset 0 2px 4px rgba(255,255,255,.9);
  opacity:0;pointer-events:none;transition:opacity .25s, transform .25s}
.hk-toast.show{opacity:1;transform:translateX(-50%) translateY(-4px)}
.iso-layer{opacity:0;pointer-events:none}
.iso-layer.on{opacity:1;animation:hkPopIn .55s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:50% 92%}
.hk-ghost{position:fixed;z-index:99;pointer-events:none;width:96px;filter:drop-shadow(0 10px 10px rgba(60,35,10,.35))}
.hk-ghost svg{width:100%;height:auto}
.hk-dropzone{position:absolute;border:4px dashed rgba(240,150,60,.75);border-radius:22px;z-index:10;
  background:rgba(255,220,150,.18);pointer-events:none;opacity:0;transition:opacity .2s}
.hk-dropzone.show{opacity:1;animation:hkPulse 1s ease-in-out infinite}
.hk-mg svg{width:100%;height:auto;display:block;border-radius:18px;max-height:min(42dvh,320px)}
.hk-progressbar{height:14px;border-radius:999px;background:#efe3cc;box-shadow:inset 0 3px 6px rgba(122,79,40,.18);overflow:hidden;margin:4px auto;max-width:340px}
.hk-progressbar > div{height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,#ffce6b,#f2833a);transition:width .25s cubic-bezier(.34,1.56,.64,1)}
.hk-count{text-align:center;font-size:.92rem;color:#a1855f;margin:2px 0}
.hk-count b{color:#e07b39;font-size:1.1rem}
.hk-ondol{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:2px}
.hk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:min(240px,52vw)}
.hk-tile{aspect-ratio:1;border-radius:16px;cursor:pointer;position:relative;touch-action:manipulation;
  background:linear-gradient(150deg,#cfd8de,#aab7c0);
  box-shadow:0 6px 0 #8797a2, 0 10px 14px rgba(80,100,115,.28), inset 0 3px 5px rgba(255,255,255,.55);
  transition:transform .12s;display:flex;align-items:center;justify-content:center}
.hk-tile:active{transform:translateY(3px)}
.hk-tile .flame{width:52%;opacity:0;transition:opacity .3s}
.hk-tile.hot{background:linear-gradient(150deg,#ffc46a,#f28434);
  box-shadow:0 6px 0 #c95f1d, 0 10px 18px rgba(230,130,40,.45), inset 0 3px 5px rgba(255,255,255,.6);
  animation:hkGlow 1.4s ease-in-out infinite}
.hk-tile.hot .flame{opacity:1;animation:hkFlick .5s ease-in-out infinite alternate}
.hk-endcap{width:48px;flex:none}
.hk-endcap svg{width:100%;height:auto}
.hk-walls{display:flex;gap:8px;justify-content:center;margin-top:2px}
.hk-wallbox{position:relative;border-radius:18px;overflow:hidden;flex:none;
  border:4px dashed #d9b98c;background:repeating-linear-gradient(45deg,#f9f1e2,#f9f1e2 10px,#f3e7d0 10px,#f3e7d0 20px)}
.hk-wallbox canvas{display:block;touch-action:none;cursor:crosshair;width:min(110px,30vw)!important;height:auto!important}
.hk-wallbox .pct{position:absolute;top:6px;right:10px;font-size:.9rem;color:#a1703a;background:rgba(255,250,238,.85);
  padding:2px 10px;border-radius:999px;box-shadow:0 2px 5px rgba(122,79,40,.2);pointer-events:none}
.hk-doors{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.hk-cell{cursor:pointer;transition:fill .25s}
@keyframes hkFade{from{opacity:0}to{opacity:1}}
@keyframes hkPopIn{0%{transform:scale(.25);opacity:0}55%{transform:scale(1.12);opacity:1}75%{transform:scale(.96)}100%{transform:scale(1);opacity:1}}
@keyframes hkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes hkPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@keyframes hkWobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}
@keyframes hkShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
@keyframes hkSquash{0%{transform:scale(1,1)}40%{transform:scale(1.12,.82)}100%{transform:scale(1,1)}}
@keyframes hkFlick{from{transform:scale(1) rotate(-3deg)}to{transform:scale(1.12) rotate(3deg)}}
@keyframes hkGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18)}}
@keyframes hkEmber{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes hkSmoke{0%{transform:translateY(0) scale(.6);opacity:.7}100%{transform:translateY(-46px) scale(1.5);opacity:0}}
@keyframes hkFloatUp{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-56px);opacity:0}}
@keyframes hkCurl{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(50px,52px) rotate(230deg);opacity:0}}
@keyframes hkFall{0%{transform:rotate(0)}100%{transform:rotate(78deg)}}
.hk-wrap .wobble{animation:hkWobble .45s ease-in-out}
.hk-wrap .shake{animation:hkShake .4s ease-in-out}
.hk-wrap .squash{animation:hkSquash .28s ease-out;transform-box:fill-box;transform-origin:50% 100%}
.hk-wrap .ember{animation:hkEmber 1.5s ease-in-out infinite}
.hk-wrap .flame-anim,.hk-scene .flame-anim{animation:hkFlick .45s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.hk-wrap .smoke-anim{animation:hkSmoke 2.6s ease-out infinite}
.hk-wrap .hanji-glow{animation:hkGlow 3s ease-in-out infinite}
.hk-float{position:absolute;font-size:1.3rem;color:#e07b39;pointer-events:none;animation:hkFloatUp .8s ease-out both;text-shadow:0 2px 0 #fff}
#hk-tile-stack{width:108px!important;height:96px!important;margin:6px auto!important}
#hk-saw-zone svg{max-height:min(22dvh,170px)}
@media (max-height:620px){
  .hk-chip{padding:8px 16px;font-size:clamp(1.12rem,2.8vw,1.35rem)}
}
@media (max-width:560px){
  .hk-wrap{grid-template-columns:1fr;grid-template-rows:auto auto minmax(0,1fr);gap:8px}
  .hk-scene{min-height:180px}
  .hk-scene svg{height:auto;max-height:min(32dvh,220px)}
}
@media (min-width:600px) and (max-height:1024px),(min-width:600px) and (max-width:1024px){
  .hk-wrap{padding:2px 8px 6px;gap:8px;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}
  .hk-title{font-size:clamp(1.1rem,2.5vw,1.5rem)}
  .hk-sub{font-size:clamp(1.1rem,2.6vw,1.32rem);margin:2px 0 0}
  .hk-chip{padding:9px 18px;font-size:clamp(1.18rem,2.8vw,1.42rem);margin-top:2px}
  .hk-scene{padding:6px}
  .hk-scene svg{max-height:none;height:100%}
  .hk-panel{padding:6px 10px 10px}
  .hk-inst{font-size:clamp(1.12rem,2.6vw,1.38rem);margin:0 0 8px}
  .hk-btn{font-size:.95rem;padding:9px 22px;border-radius:16px}
  .hk-btn.sm{font-size:.82rem;padding:7px 14px}
  .hk-mg svg{max-height:min(36dvh,280px)}
  .hk-mg svg#hk-hill-svg{max-height:min(28dvh,200px)}
  #hk-saw-zone svg{max-height:min(28dvh,220px)}
  .hk-pop{padding:16px 18px 16px;border-radius:22px}
  .hk-pop h2{font-size:1.4rem}
  .hk-pop p{font-size:1.18rem;margin:8px 0 12px;line-height:1.75}
  .hk-pop #hk-story-text{text-align:left;word-break:keep-all;line-height:1.85;white-space:pre-line;letter-spacing:.01em}
  .hk-goblin{width:132px;height:132px}
  .hk-progressbar{height:10px;margin:2px auto}
  .hk-wallbox canvas{width:min(90px,26vw)!important}
}
`;
  function injectCSS() {
    if (document.getElementById("hk-clay-style")) return;
    const s = document.createElement("style");
    s.id = "hk-clay-style";
    s.textContent = HK_CSS;
    document.head.appendChild(s);
  }

  /* ================= 1. 공용 상태/유틸 ================= */
  let _ctx = null, _appEl = null, root = null;
  let timers = [], rafId = 0, actx = null, phaseIdx = 0;
  let _standaloneState = null;

  /* 한옥마을 (기존 hanok-game.js에서 이식) */
  const VILLAGE_KEY = "kculture_hanok_village_v1";
  const GUEST_KEY = "kculture_hanok_guest_id";
  const FIRESTORE_COLLECTION = "hanok_houses";
  const VILLAGE_COLS = 6;
  let _unsubscribeVillage = null, _villageCache = [], _db = null, _fbTried = false, _fbReady = false;

  const $  = (sel) => root ? root.querySelector(sel) : null;
  const $$ = (sel) => root ? Array.from(root.querySelectorAll(sel)) : [];
  function later(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }

  function clayStop() {
    timers.forEach(clearTimeout); timers = [];
    if (rafId) cancelAnimationFrame(rafId); rafId = 0;
    document.querySelectorAll(".hk-overlay,.hk-ghost,#hk-confetti").forEach(el => el.remove());
  }
  function stopAll() {
    clayStop();
    stopVillageSync();
  }

  function hanokState() {
    if (_ctx) return _ctx.getState().hanok;
    if (!_standaloneState) _standaloneState = createDefaultState();
    return _standaloneState;
  }
  function createDefaultState() {
    return { phase: "game", complete: false, registered: false, houseName: "" };
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function popupOk(title, body, icon) {
    if (window.Swal) return Swal.fire(title, body, icon);
    try { alert(title + "\n" + body); } catch (e) { /* 무시 */ }
    return Promise.resolve();
  }

  function playSnd(name) { if (_ctx && _ctx.playSound) _ctx.playSound(name); }

  function missionReady() {
    const h = hanokState();
    return !!(h.complete || (_ctx && _ctx.isMissionRouteCompleted && _ctx.isMissionRouteCompleted("stage2_a2")));
  }
  function bindMission() {
    if (!_ctx || !_ctx.bindMissionCompleteBtn) return;
    _ctx.bindMissionCompleteBtn(
      "stage2_a2",
      missionReady(),
      "한옥을 완성하면 미션이 완료돼요!",
      () => {
        _ctx.getState().solved.hanok = true;
        _ctx.saveProgress();
      }
    );
  }

  /* ================= 2. 마을 저장소 (Firebase + 로컬 하이브리드, 기존 이식) ================= */
  function loadVillageLocal() {
    try {
      const raw = localStorage.getItem(VILLAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }
  function saveVillageLocal(list) {
    try { localStorage.setItem(VILLAGE_KEY, JSON.stringify(list)); } catch (_) { /* 무시 */ }
  }
  function initFirebase() {
    if (_fbTried) return _fbReady;
    _fbTried = true;
    try {
      const cfg = window.HANOK_FIREBASE_CONFIG;
      const hasConfig = cfg && cfg.apiKey && cfg.projectId;
      const hasSdk = window.firebase && typeof window.firebase.initializeApp === "function";
      if (!hasConfig || !hasSdk) { _fbReady = false; return false; }
      const app = window.firebase.apps && window.firebase.apps.length
        ? window.firebase.app()
        : window.firebase.initializeApp(cfg);
      _db = window.firebase.firestore(app);
      _fbReady = true;
    } catch (err) {
      console.warn("[한옥마을] Firebase 초기화 실패 — 이 기기 저장 모드로 전환합니다.", err);
      _db = null; _fbReady = false;
    }
    return _fbReady;
  }
  function isSharedMode() { return initFirebase(); }

  function myBuilderCode() {
    const code = _ctx && _ctx.getState().code;
    if (code) return String(code);
    let guest = localStorage.getItem(GUEST_KEY);
    if (!guest) {
      guest = "guest_" + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(GUEST_KEY, guest);
    }
    return guest;
  }
  function computeRows(count) {
    return Math.max(4, Math.ceil((count + 1) / VILLAGE_COLS));
  }
  function findFreeSlot(list, keepId) {
    const rows = computeRows(list.length);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < VILLAGE_COLS; x++) {
        const occupied = list.some((h) => h.gridX === x && h.gridY === y && h.id !== keepId);
        if (!occupied) return { x, y };
      }
    }
    return { x: list.length % VILLAGE_COLS, y: Math.floor(list.length / VILLAGE_COLS) };
  }
  function startVillageSync(onChange) {
    stopVillageSync();
    if (isSharedMode()) {
      try {
        _unsubscribeVillage = _db.collection(FIRESTORE_COLLECTION).onSnapshot(
          (snap) => {
            const list = [];
            snap.forEach((doc) => list.push(Object.assign({ id: doc.id }, doc.data())));
            _villageCache = list;
            saveVillageLocal(list);
            onChange(list);
          },
          (err) => {
            console.warn("[한옥마을] 실시간 동기화 오류 — 이 기기에 저장된 마을을 보여줘요.", err);
            _villageCache = loadVillageLocal();
            onChange(_villageCache);
          }
        );
        return;
      } catch (err) { console.warn(err); }
    }
    _villageCache = loadVillageLocal();
    onChange(_villageCache);
  }
  function stopVillageSync() {
    if (_unsubscribeVillage) { _unsubscribeVillage(); _unsubscribeVillage = null; }
  }
  async function upsertHouse(house) {
    const local = loadVillageLocal();
    const idx = local.findIndex((h) => h.id === house.id);
    if (idx >= 0) local[idx] = house; else local.push(house);
    saveVillageLocal(local);
    _villageCache = local;
    if (isSharedMode()) {
      try {
        await _db.collection(FIRESTORE_COLLECTION).doc(house.id).set(house, { merge: true });
      } catch (err) {
        console.warn("[한옥마을] 서버 저장 실패 — 이 기기에는 저장되었어요.", err);
      }
    }
    return house;
  }
  async function likeHouse(house, code) {
    const likedBy = house.likedBy || [];
    if (likedBy.includes(code) || house.id === code) return house;
    const updated = Object.assign({}, house, {
      likes: (house.likes || 0) + 1,
      likedBy: likedBy.concat([code])
    });
    const local = loadVillageLocal();
    const idx = local.findIndex((h) => h.id === house.id);
    if (idx >= 0) { local[idx] = updated; saveVillageLocal(local); }
    if (isSharedMode()) {
      try {
        await _db.collection(FIRESTORE_COLLECTION).doc(house.id).set(
          { likes: updated.likes, likedBy: updated.likedBy },
          { merge: true }
        );
      } catch (err) {
        console.warn("[한옥마을] 좋아요 서버 반영 실패 — 이 기기에는 반영되었어요.", err);
      }
    }
    return updated;
  }

  /* ================= 3. 사운드 (WebAudio 뿅뿅 효과음) ================= */
  function beep(freq0, freq1, dur, type, vol) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(40, freq1), t + dur);
      g.gain.setValueAtTime(vol || 0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) { /* 소리 실패는 무시 */ }
  }
  const sfx = {
    pop:  () => beep(300, 660, 0.14, "sine"),
    zing: () => beep(500, 1300, 0.2, "triangle"),
    tap:  () => beep(520, 420, 0.07, "sine", 0.1),
    thud: () => beep(160, 70, 0.22, "sine", 0.25),
    no:   () => beep(220, 130, 0.25, "square", 0.07),
    yay:  () => { beep(523, 523, 0.12, "triangle"); later(() => beep(659, 659, 0.12, "triangle"), 110); later(() => beep(784, 784, 0.22, "triangle"), 220); },
    fire: () => beep(180, 420, 0.3, "sawtooth", 0.06)
  };

  /* ================= 4. 안내 캐릭터 (곰) ================= */
  function goblinSVG() {
    return `<img src="assets/images/character/bear.webp" alt="곰" draggable="false" />`;
  }

  /* ================= 5. 아이소메트릭 한옥 씬 ================= */
  const PX = [190, 320, 450];       // 기둥/주춧돌 x좌표
  function sceneSVG() {
    const stones = PX.map((x, i) => `
      <g id="hk-stone-${i}" class="iso-layer">
        <ellipse cx="${x}" cy="352" rx="27" ry="7" fill="rgba(60,40,20,.18)"/>
        <path d="M${x - 25} 350 Q${x - 29} 328 ${x - 15} 322 L${x + 15} 322 Q${x + 29} 328 ${x + 25} 350 Q${x} 359 ${x - 25} 350 Z" fill="url(#gStone)"/>
        <ellipse cx="${x}" cy="323" rx="16" ry="4.5" fill="#dfe5e9"/>
        <ellipse cx="${x - 9}" cy="334" rx="6" ry="9" fill="rgba(255,255,255,.35)"/>
      </g>`).join("");

    const pillars = PX.map((x, i) => `
      <g id="hk-pillar-${i}" class="iso-layer">
        <rect x="${x - 13}" y="200" width="26" height="128" rx="12" fill="url(#gWood)"/>
        <rect x="${x + 2}" y="204" width="8" height="120" rx="4" fill="rgba(80,45,15,.16)"/>
        <ellipse cx="${x}" cy="201" rx="13" ry="5" fill="#c98d55"/>
      </g>`).join("");

    return `
    <svg viewBox="0 0 640 470" xmlns="http://www.w3.org/2000/svg" id="hk-iso-svg">
      <defs>
        <radialGradient id="gGrass" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stop-color="#b8e08c"/><stop offset="100%" stop-color="#8cc763"/>
        </radialGradient>
        <linearGradient id="gStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e6ebee"/><stop offset="100%" stop-color="#9fadb8"/>
        </linearGradient>
        <linearGradient id="gStoneTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e9e2d2"/><stop offset="100%" stop-color="#cdc2ab"/>
        </linearGradient>
        <linearGradient id="gStoneFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c7bca6"/><stop offset="100%" stop-color="#a89c85"/>
        </linearGradient>
        <linearGradient id="gWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#d8a066"/><stop offset="55%" stop-color="#c08048"/><stop offset="100%" stop-color="#a56834"/>
        </linearGradient>
        <linearGradient id="gWoodH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d8a066"/><stop offset="100%" stop-color="#a56834"/>
        </linearGradient>
        <linearGradient id="gOchre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e5aa72"/><stop offset="100%" stop-color="#c98650"/>
        </linearGradient>
        <linearGradient id="gRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5d6b7d"/><stop offset="100%" stop-color="#38414f"/>
        </linearGradient>
        <linearGradient id="gHanji" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffbef"/><stop offset="100%" stop-color="#f7ecd2"/>
        </linearGradient>
        <radialGradient id="gEmber" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#ffd257"/><stop offset="100%" stop-color="#f0742c"/>
        </radialGradient>
        <linearGradient id="gDeck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#efce9d"/><stop offset="100%" stop-color="#d8ab6e"/>
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#6b4a2a" flood-opacity="0.22"/>
        </filter>
      </defs>

      <!-- ===== 항상 보이는 땅 + 기단 (집터 템플릿) ===== -->
      <g id="hk-ground">
        <ellipse cx="320" cy="404" rx="266" ry="54" fill="rgba(90,120,60,.25)"/>
        <ellipse cx="320" cy="398" rx="262" ry="54" fill="url(#gGrass)"/>
        <ellipse cx="150" cy="382" rx="26" ry="8" fill="#a4d67e" opacity=".8"/>
        <ellipse cx="505" cy="420" rx="30" ry="9" fill="#a4d67e" opacity=".8"/>
        <g transform="translate(96 402)"><circle r="4" fill="#ff9d7a"/><circle cx="7" r="4" fill="#ff9d7a"/><circle cx="3.5" cy="-6" r="4" fill="#ff9d7a"/><circle cx="3.5" cy="-2" r="2.6" fill="#ffe07a"/></g>
        <g transform="translate(548 398)"><circle r="4" fill="#b78ae8"/><circle cx="7" r="4" fill="#b78ae8"/><circle cx="3.5" cy="-6" r="4" fill="#b78ae8"/><circle cx="3.5" cy="-2" r="2.6" fill="#ffe07a"/></g>
        <rect x="126" y="372" width="388" height="26" rx="13" fill="url(#gStoneFront)" filter="url(#soft)"/>
        <rect x="114" y="352" width="412" height="30" rx="15" fill="url(#gStoneTop)"/>
        <ellipse cx="220" cy="360" rx="20" ry="4" fill="rgba(255,255,255,.4)"/>
        <ellipse cx="430" cy="364" rx="24" ry="4" fill="rgba(255,255,255,.3)"/>
      </g>

      <!-- ===== 1. 주춧돌 ===== -->
      <g id="hk-L-stones">${stones}</g>

      <!-- ===== 3. 온돌 (기둥 뒤 바닥층) ===== -->
      <g id="hk-L-ondol" class="iso-layer">
        <rect x="146" y="336" width="348" height="18" rx="9" fill="url(#gDeck)"/>
        <rect x="210" y="352" width="56" height="11" rx="5.5" fill="url(#gEmber)" class="ember"/>
        <rect x="292" y="352" width="56" height="11" rx="5.5" fill="url(#gEmber)" class="ember" style="animation-delay:.4s"/>
        <rect x="374" y="352" width="56" height="11" rx="5.5" fill="url(#gEmber)" class="ember" style="animation-delay:.8s"/>
        <path d="M142 398 L142 380 Q142 368 154 368 L170 368 Q182 368 182 380 L182 398 Z" fill="#4a3a2c"/>
        <g class="flame-anim">
          <path d="M162 396 Q150 384 158 373 Q160 380 165 381 Q162 372 170 366 Q170 378 176 382 Q179 390 172 396 Z" fill="#f28434"/>
          <path d="M163 395 Q157 388 162 380 Q166 386 168 388 Q170 392 167 395 Z" fill="#ffd257"/>
        </g>
        <rect x="524" y="262" width="26" height="118" rx="12" fill="#c98650"/>
        <rect x="519" y="254" width="36" height="14" rx="7" fill="#a5683a"/>
        <circle cx="537" cy="240" r="8" fill="#dfe3e6" class="smoke-anim"/>
        <circle cx="545" cy="248" r="6" fill="#e8ebee" class="smoke-anim" style="animation-delay:.9s"/>
        <circle cx="530" cy="246" r="5" fill="#eef0f2" class="smoke-anim" style="animation-delay:1.7s"/>
      </g>

      <!-- ===== 2. 기둥과 보 ===== -->
      <g id="hk-L-pillars">
        ${pillars}
        <g id="hk-beam" class="iso-layer">
          <rect x="140" y="164" width="360" height="18" rx="9" fill="#a5683a"/>
          <rect x="148" y="176" width="344" height="30" rx="14" fill="url(#gWoodH)"/>
          <ellipse cx="230" cy="186" rx="26" ry="4" fill="rgba(255,255,255,.3)"/>
          <ellipse cx="410" cy="190" rx="26" ry="4" fill="rgba(255,255,255,.25)"/>
        </g>
      </g>

      <!-- ===== 4. 황토벽 ===== -->
      <g id="hk-L-walls">
        <g id="hk-wall-0" class="iso-layer">
          <rect x="203" y="206" width="104" height="136" rx="10" fill="url(#gOchre)"/>
          <ellipse cx="232" cy="240" rx="14" ry="7" fill="rgba(255,255,255,.22)"/>
          <ellipse cx="278" cy="300" rx="16" ry="8" fill="rgba(120,70,30,.12)"/>
        </g>
        <g id="hk-wall-1" class="iso-layer">
          <rect x="333" y="206" width="104" height="136" rx="10" fill="url(#gOchre)"/>
          <ellipse cx="364" cy="290" rx="14" ry="7" fill="rgba(255,255,255,.22)"/>
          <ellipse cx="406" cy="238" rx="16" ry="8" fill="rgba(120,70,30,.12)"/>
        </g>
      </g>

      <!-- ===== 5. 창호 문 ===== -->
      <g id="hk-L-doors">
        ${[255, 385].map((cx, i) => `
        <g id="hk-door-${i}" class="iso-layer">
          <rect x="${cx - 36}" y="218" width="72" height="112" rx="8" fill="#8a5a34"/>
          <rect x="${cx - 29}" y="225" width="58" height="98" rx="5" fill="url(#gHanji)" class="hanji-glow"/>
          <g stroke="#8a5a34" stroke-width="4" stroke-linecap="round">
            <line x1="${cx - 10}" y1="225" x2="${cx - 10}" y2="323"/>
            <line x1="${cx + 10}" y1="225" x2="${cx + 10}" y2="323"/>
            <line x1="${cx - 29}" y1="250" x2="${cx + 29}" y2="250"/>
            <line x1="${cx - 29}" y1="274" x2="${cx + 29}" y2="274"/>
            <line x1="${cx - 29}" y1="298" x2="${cx + 29}" y2="298"/>
          </g>
          <circle cx="${cx + (i ? -18 : 18)}" cy="286" r="4" fill="#5c3a1c"/>
        </g>`).join("")}
      </g>

      <!-- ===== 6. 기와지붕 (기와 한 장씩 얹기: 바탕 → 기와판 6칸 → 마감 장식) ===== -->
      ${(() => {
        const qp = (a, c, b, t) => [
          (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0],
          (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]
        ];
        const eave  = t => qp([92, 192], [320, 224], [548, 192], t);
        const ridge = t => qp([184, 112], [320, 98], [456, 112], t);
        const mid   = t => { const e = eave(t), r = ridge(t); return [(e[0] + r[0]) / 2, (e[1] + r[1]) / 2 - 3]; };
        const line = (fn, t0, t1, n) => Array.from({ length: n + 1 }, (_, k) => fn(t0 + (t1 - t0) * k / n));
        const cellPath = (bot, top, t0, t1) => {
          const pts = line(bot, t0, t1, 6).concat(line(top, t1, t0, 6));
          return "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";
        };
        const rows = [[eave, mid], [mid, ridge]];
        let slots = "", tiles = "";
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
          const i = r * 3 + c, t0 = c / 3, t1 = (c + 1) / 3;
          const d = cellPath(rows[r][0], rows[r][1], t0, t1);
          const vline = t => {
            const p0 = rows[r][0](t), p1 = rows[r][1](t);
            return `<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" stroke="rgba(20,28,38,.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
          };
          slots += `<g id="hk-rslot-${i}" class="iso-layer"><path d="${d}" fill="rgba(90,110,130,.14)" stroke="rgba(240,150,60,.85)" stroke-width="3" stroke-dasharray="8 7" stroke-linejoin="round"/></g>`;
          tiles += `<g id="hk-rtile-${i}" class="iso-layer"><path d="${d}" fill="url(#gRoof)" stroke="#2c3542" stroke-width="2" stroke-linejoin="round"/>${vline(t0 + (t1 - t0) / 3)}${vline(t0 + (t1 - t0) * 2 / 3)}</g>`;
        }
        const wadang = [118, 162, 208, 256, 304, 352, 400, 446, 490, 526].map(x => {
          const t = (x - 92) / 456, p = eave(t);
          return `<circle cx="${x}" cy="${p[1].toFixed(1)}" r="5.5" fill="#f5f0e6" stroke="#c9bda3" stroke-width="1.5"/>`;
        }).join("");
        const rafters = [0.14, 0.3, 0.5, 0.7, 0.86].map(t => {
          const e = eave(t), rg = ridge(t);
          return `<path d="M${e[0].toFixed(1)} ${e[1].toFixed(1)} L${rg[0].toFixed(1)} ${rg[1].toFixed(1)}" stroke="rgba(120,75,30,.4)" stroke-width="4" stroke-linecap="round"/>`;
        }).join("");
        return `
        <g id="hk-roof-base" class="iso-layer">
          <path d="M120 206 Q320 236 520 206 L510 218 Q320 246 130 218 Z" fill="rgba(50,35,15,.22)"/>
          <path d="M92 192 Q320 224 548 192 L456 112 Q320 98 184 112 Z" fill="url(#gDeck)" filter="url(#soft)"/>
          ${rafters}
        </g>
        <g id="hk-roof-slotswrap">${slots}</g>
        <g id="hk-roof-tileswrap">${tiles}</g>
        <g id="hk-roof-trim" class="iso-layer">
          <path d="M92 192 L184 112 M548 192 L456 112" stroke="#232c38" stroke-width="7" stroke-linecap="round"/>
          <path d="M178 114 Q320 98 462 114" stroke="#232c38" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="M92 192 Q320 224 548 192" stroke="#f5f0e6" stroke-width="9" fill="none" stroke-linecap="round"/>
          ${wadang}
          <ellipse cx="255" cy="140" rx="30" ry="8" fill="rgba(255,255,255,.12)"/>
        </g>`;
      })()}

      <!-- 해 -->
      <g transform="translate(72 64)">
        <circle r="26" fill="#ffd257"/><circle r="26" fill="#ffbe3d" opacity=".4"/>
        <circle cx="-8" cy="-4" r="4" fill="#7a4f28" opacity=".55"/><circle cx="8" cy="-4" r="4" fill="#7a4f28" opacity=".55"/>
        <path d="M-7 6 Q0 12 7 6" stroke="#7a4f28" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
      </g>
    </svg>`;
  }

  /* 레이어 등장 연출 */
  function reveal(id, delay) {
    later(() => {
      const el = document.getElementById(id);
      if (el) { el.classList.add("on"); sfx.pop(); }
    }, delay || 0);
  }

  /* ================= 6. 단계 정의 / 레이아웃 / 스토리 ================= */
  const PHASES = [
    { chip: "주춧돌", title: "1단계 · 주춧돌 놓기",
      story: "한옥은 땅 위에 그냥 기둥을 세우지 않아.\n단단한 '주춧돌'을 먼저 놓아 나무가 썩지 않게 보호한단다!",
      run: phaseStones },
    { chip: "기둥", title: "2단계 · 기둥과 보 세우기",
      story: "시멘트 아파트와 달리 한옥은 자연에서 온 나무로 뼈대를 만들지.\n못을 쓰지 않고 끼워 맞춰서 지진에도 강하단다!",
      run: phasePillars },
    { chip: "온돌", title: "3단계 · 온돌 깔기",
      story: "방바닥 아래에 돌(구들장)을 깔고 아궁이에 불을 지피는 '온돌'이야.\n숨은 연기는 빠져나가고, 따뜻한 온기만 오래 남지!",
      run: phaseOndol },
    { chip: "황토벽", title: "4단계 · 황토벽 채우기",
      story: "황토는 스스로 숨을 쉬는 살아있는 흙이야!\n방 안의 습도를 조절해 주어 여름에는 시원하고 겨울에는 따뜻하게 해주지.",
      run: phaseMud },
    { chip: "창호", title: "5단계 · 문틀과 창호지",
      story: "창문에 바르는 '창호지(종이)'는 바람은 통하게 해 줘.\n햇빛은 은은하고 부드럽게 감싸 안아준단다.",
      run: phaseHanji },
    { chip: "기와", title: "6단계 · 기와지붕 올리기",
      story: "마지막으로 아름다운 곡선의 '기와지붕'을 올려 집을 완성하자.\n지붕의 처마 곡선은 햇빛의 각도를 조절하는 완벽한 과학이란다!",
      run: phaseRoof }
  ];

  function layoutHTML() {
    const chips = PHASES.map((p, i) => `<span class="hk-chip" id="hk-chip-${i}">${i + 1}. ${p.chip}</span>`).join("");
    return `
    <div class="hk-wrap">
      <header class="hk-header">
        <p class="hk-sub">도깨비가 무너뜨린 한옥을 다시 세우자!</p>
        <div class="hk-chips">${chips}</div>
      </header>
      <section class="hk-card hk-scene" id="hanok-iso-scene">
        ${sceneSVG()}
        <div class="hk-dropzone" id="hk-dropzone"></div>
        <div class="hk-toast" id="hk-toast-scene"></div>
      </section>
      <section class="hk-card hk-panel" id="hk-panel">
        <p class="hk-inst">곰이 오고 있어요...</p>
      </section>
    </div>`;
  }

  function setChip(i) {
    PHASES.forEach((_, k) => {
      const c = document.getElementById("hk-chip-" + k);
      if (!c) return;
      c.classList.toggle("act", k === i);
      c.classList.toggle("done", k < i);
      if (k < i && !c.textContent.startsWith("✓")) c.textContent = "✓ " + PHASES[k].chip;
    });
  }

  function panel(html) { const p = $("#hk-panel"); if (p) p.innerHTML = html; return p; }

  let toastTimer = 0;
  function toast(msg, inScene) {
    let el = inScene ? $("#hk-toast-scene") : $("#hk-toast-panel");
    if (!el && !inScene) {
      el = document.createElement("div");
      el.className = "hk-toast"; el.id = "hk-toast-panel";
      const p = $("#hk-panel"); if (!p) return; p.appendChild(el);
    }
    if (!el) return;
    el.textContent = "🔨 " + msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
    timers.push(toastTimer);
  }

  function showStory(idx, onStart) {
    const ph = PHASES[idx];
    const ov = document.createElement("div");
    ov.className = "hk-overlay";
    ov.innerHTML = `
      <div class="hk-pop">
        <span class="hk-pop-badge">곰의 이야기</span>
        <div class="hk-goblin">${goblinSVG()}</div>
        <h2>${ph.title}</h2>
        <p id="hk-story-text"></p>
        <button class="hk-btn" id="hk-story-go">좋아, 시작! ✨</button>
      </div>`;
    document.body.appendChild(ov);
    const txtEl = ov.querySelector("#hk-story-text");
    const full = ph.story;
    let ci = 0;
    (function typeNext() {
      if (!txtEl.isConnected) return;
      txtEl.textContent = full.slice(0, ++ci);
      if (ci < full.length) later(typeNext, 26);
    })();
    ov.querySelector("#hk-story-go").addEventListener("pointerdown", () => {
      sfx.zing();
      ov.remove();
      onStart();
    });
  }

  function startPhase(i) {
    phaseIdx = i;
    setChip(i);
    showStory(i, () => PHASES[i].run(() => {
      setChip(i + 1);
      if (i + 1 < PHASES.length) later(() => startPhase(i + 1), 1400);
      else later(finale, 1200);
    }));
  }

  /* 드래그 헬퍼 (터치/마우스 겸용) */
  function makeDraggable(el, ghostHTML, getTargets, onDrop) {
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      const ghost = document.createElement("div");
      ghost.className = "hk-ghost";
      ghost.innerHTML = ghostHTML;
      document.body.appendChild(ghost);
      el.style.opacity = ".35";
      const place = (e) => {
        ghost.style.left = (e.clientX - 48) + "px";
        ghost.style.top = (e.clientY - 34) + "px";
      };
      place(ev);
      const move = (e) => { e.preventDefault(); place(e); };
      const up = (e) => {
        document.removeEventListener("pointermove", move);
        ghost.remove();
        el.style.opacity = "1";
        let hit = null;
        for (const t of getTargets()) {
          const dx = e.clientX - t.x, dy = e.clientY - t.y;
          if (Math.hypot(dx, dy) < t.r) { hit = t; break; }
        }
        onDrop(hit, el);
      };
      document.addEventListener("pointermove", move, { passive: false });
      document.addEventListener("pointerup", up, { once: true });
    });
  }

  /* ==============================================================
     미니게임 1단계 — 주춧돌: 강가에서 평평한 돌 3개 찾기
     ============================================================== */
  function phaseStones(done) {
    const STONES = [
      { x: 92,  y: 160, kind: "flat"  },
      { x: 198, y: 196, kind: "round" },
      { x: 296, y: 148, kind: "pointy"},
      { x: 382, y: 196, kind: "flat"  },
      { x: 472, y: 150, kind: "round" },
      { x: 532, y: 200, kind: "flat"  }
    ];
    const stoneShape = (s, i) => {
      const c = ["#c3ccd3", "#b3bfc9", "#cdd5da"][i % 3];
      if (s.kind === "flat") return `
        <g class="hk-river-stone" data-i="${i}" style="cursor:pointer">
          <ellipse cx="${s.x}" cy="${s.y + 26}" rx="30" ry="7" fill="rgba(50,60,70,.2)"/>
          <path d="M${s.x - 28} ${s.y + 24} Q${s.x - 32} ${s.y - 2} ${s.x - 16} ${s.y - 6} L${s.x + 16} ${s.y - 6} Q${s.x + 32} ${s.y - 2} ${s.x + 28} ${s.y + 24} Q${s.x} ${s.y + 33} ${s.x - 28} ${s.y + 24} Z" fill="${c}"/>
          <ellipse cx="${s.x}" cy="${s.y - 5}" rx="17" ry="5" fill="#e8edf0"/>
          <ellipse cx="${s.x - 10}" cy="${s.y + 8}" rx="6" ry="9" fill="rgba(255,255,255,.4)"/>
        </g>`;
      if (s.kind === "round") return `
        <g class="hk-river-stone" data-i="${i}" style="cursor:pointer">
          <ellipse cx="${s.x}" cy="${s.y + 26}" rx="26" ry="6" fill="rgba(50,60,70,.2)"/>
          <ellipse cx="${s.x}" cy="${s.y + 2}" rx="26" ry="26" fill="${c}"/>
          <ellipse cx="${s.x - 8}" cy="${s.y - 7}" rx="8" ry="10" fill="rgba(255,255,255,.45)"/>
        </g>`;
      return `
        <g class="hk-river-stone" data-i="${i}" style="cursor:pointer">
          <ellipse cx="${s.x}" cy="${s.y + 26}" rx="26" ry="6" fill="rgba(50,60,70,.2)"/>
          <path d="M${s.x - 24} ${s.y + 25} Q${s.x - 18} ${s.y - 4} ${s.x} ${s.y - 22} Q${s.x + 18} ${s.y - 4} ${s.x + 24} ${s.y + 25} Q${s.x} ${s.y + 32} ${s.x - 24} ${s.y + 25} Z" fill="${c}"/>
          <ellipse cx="${s.x - 6}" cy="${s.y + 4}" rx="5" ry="9" fill="rgba(255,255,255,.4)"/>
        </g>`;
    };

    panel(`
      <div class="hk-mg">
        <p class="hk-inst">기둥을 받칠 수 있게 위가 <b>평평한 돌</b> 3개를 찾아 눌러 줘!</p>
        <div class="hk-count">찾은 주춧돌 <b id="hk-stone-found">0</b> / 3</div>
        <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gRiver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#9dd6f2"/><stop offset="100%" stop-color="#5fb3e0"/>
            </linearGradient>
            <linearGradient id="gSand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f6e3b8"/><stop offset="100%" stop-color="#eccf96"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="600" height="250" rx="18" fill="url(#gSand)"/>
          <path d="M0 0 H600 V86 Q450 116 300 92 Q150 68 0 100 Z" fill="url(#gRiver)"/>
          <path d="M40 46 Q70 38 100 46" stroke="rgba(255,255,255,.7)" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M420 34 Q450 26 480 34" stroke="rgba(255,255,255,.6)" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M230 60 Q260 52 290 60" stroke="rgba(255,255,255,.55)" stroke-width="5" fill="none" stroke-linecap="round"/>
          ${STONES.map(stoneShape).join("")}
        </svg>
      </div>`);

    let found = 0;
    $$(".hk-river-stone").forEach((g) => {
      g.addEventListener("pointerdown", () => {
        const i = +g.dataset.i;
        if (g.dataset.used) return;
        if (STONES[i].kind === "flat") {
          g.dataset.used = "1";
          g.style.transformBox = "fill-box";
          g.style.transformOrigin = "50% 100%";
          g.classList.add("squash");
          g.style.filter = "drop-shadow(0 0 10px rgba(120,220,90,.9))";
          sfx.pop();
          found++;
          const cnt = $("#hk-stone-found"); if (cnt) cnt.textContent = found;
          toast(["오~ 반질반질 평평한 돌이야!", "완벽해! 기둥이 좋아하겠는걸?", "찾았다! 마지막 주춧돌!"][found - 1]);
          reveal("hk-stone-" + (found - 1), 250);
          if (found === 3) { sfx.yay(); later(done, 900); }
        } else {
          g.style.transformBox = "fill-box";
          g.style.transformOrigin = "50% 100%";
          g.classList.remove("wobble"); void g.getBoundingClientRect();
          g.classList.add("wobble");
          sfx.no();
          toast("앗! 위가 울퉁불퉁해서 기둥이 미끄러지겠어~");
        }
      });
    });
  }

  /* ==============================================================
     미니게임 2단계 — 기둥: 톱질 스와이프 벌목 → 통나무 드래그해 세우기
     ============================================================== */
  function phasePillars(done) {
    const logSVG = `
      <svg viewBox="0 0 96 60" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="16" width="84" height="30" rx="15" fill="#c08048"/>
        <rect x="6" y="16" width="84" height="12" rx="6" fill="rgba(255,255,255,.25)"/>
        <ellipse cx="12" cy="31" rx="9" ry="15" fill="#e8bd8a"/>
        <circle cx="12" cy="31" r="5" fill="#c08048"/>
      </svg>`;

    /* --- A: 톱질 스와이프로 벌목 --- */
    const STROKES = 8;          // 나무 한 그루당 필요한 쓱싹 횟수
    let logsGot = 0;
    const treeSVG = `
      <g id="hk-tree" style="transform-box:fill-box;transform-origin:60% 96%">
        <rect x="107" y="108" width="26" height="86" rx="12" fill="#a56834"/>
        <circle cx="120" cy="74" r="44" fill="#7cc74e"/>
        <circle cx="87" cy="96" r="30" fill="#8fd75f"/>
        <circle cx="155" cy="94" r="30" fill="#6cbb45"/>
        <circle cx="105" cy="60" r="10" fill="rgba(255,255,255,.3)"/>
      </g>`;
    const sawSVG = `
      <g id="hk-saw">
        <rect x="46" y="146" width="118" height="15" rx="4" fill="#d7dde2" stroke="#9aa6b0" stroke-width="2"/>
        <path d="M50 161 l7 6 7 -6 7 6 7 -6 7 6 7 -6 7 6 7 -6 7 6 7 -6 7 6 7 -6 7 6 7 -6" fill="none" stroke="#9aa6b0" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="160" y="139" width="38" height="28" rx="12" fill="#c08048"/>
        <rect x="166" y="145" width="26" height="16" rx="8" fill="rgba(255,255,255,.25)"/>
      </g>`;

    function sawPanel() {
      panel(`
        <div class="hk-mg" style="text-align:center">
          <p class="hk-inst">톱을 잡고 <b>좌 ↔ 우로 쓱싹쓱싹</b> 문질러서 나무를 베자! (${logsGot + 1}번째 나무 / 3그루)</p>
          <div class="hk-progressbar"><div id="hk-saw-bar"></div></div>
          <div id="hk-saw-zone" style="position:relative;max-width:380px;margin:0 auto;touch-action:none;cursor:ew-resize">
            <svg viewBox="0 0 240 210" style="max-width:240px;margin:0 auto;display:block">
              <ellipse cx="120" cy="200" rx="62" ry="8" fill="rgba(90,120,60,.3)"/>
              ${treeSVG}
              ${sawSVG}
            </svg>
            <div style="font-size:1.15rem;pointer-events:none">👈 쓱싹쓱싹 👉</div>
          </div>
          <div id="hk-log-tray" style="display:flex;gap:8px;justify-content:center;min-height:52px;margin-top:8px">
            ${Array.from({ length: logsGot }, () => `<div style="width:88px">${logSVG}</div>`).join("")}
          </div>
        </div>`);

      const zone = $("#hk-saw-zone"), saw = $("#hk-saw"), bar = $("#hk-saw-bar"), tree = $("#hk-tree");
      let sawing = false, lastX = 0, run = 0, dir = 0, strokes = 0, off = 0, felled = false;

      function sawdust() {
        const p = document.createElement("div");
        p.style.cssText = "position:absolute;left:" + (44 + Math.random() * 14) + "%;top:60%;width:9px;height:9px;border-radius:50%;background:#e8c496;pointer-events:none;animation:hkCurl .7s ease-in both";
        zone.appendChild(p);
        later(() => p.remove(), 750);
      }
      function stroke() {
        if (felled) return;
        strokes++;
        sfx.tap();
        sawdust();
        tree.classList.remove("shake"); void tree.getBoundingClientRect(); tree.classList.add("shake");
        if (bar) bar.style.width = Math.min(100, strokes / STROKES * 100) + "%";
        if (strokes >= STROKES) fell();
      }
      function fell() {
        felled = true; sawing = false;
        logsGot++;
        sfx.thud();
        tree.style.animation = "hkFall .9s ease-in both";
        toast(["쓱싹쓱싹… 쿵! 첫 목재 완성!", "쿵! 톱질 실력이 장인급인걸?", "쿵! 좋은 나무 세 그루 준비 끝!"][logsGot - 1]);
        if (logsGot < 3) later(sawPanel, 1300);
        else { sfx.yay(); later(dragStage, 1100); }
      }
      zone.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        sawing = true; lastX = e.clientX; run = 0; dir = 0;
        try { zone.setPointerCapture(e.pointerId); } catch (err) { /* 무시 */ }
      });
      zone.addEventListener("pointermove", (e) => {
        if (!sawing || felled) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        if (dx === 0) return;
        off = Math.max(-40, Math.min(40, off + dx * 0.6));
        if (saw) saw.style.transform = "translateX(" + off + "px)";
        const d = dx > 0 ? 1 : -1;
        if (d === dir) run += Math.abs(dx);
        else {
          if (dir !== 0 && run > 24) stroke();   // 방향이 바뀌는 순간 = 쓱싹 1회
          dir = d; run = Math.abs(dx);
        }
      });
      const stopSaw = () => { sawing = false; off = 0; if (saw) saw.style.transform = ""; };
      zone.addEventListener("pointerup", stopSaw);
      zone.addEventListener("pointercancel", stopSaw);
    }
    sawPanel();

    /* --- B: 통나무를 주춧돌 위로 드래그 --- */
    function dragStage(placedCnt) {
      let placedN = placedCnt || 0;
      panel(`
        <div class="hk-mg" style="text-align:center">
          <p class="hk-inst">통나무를 <b>주춧돌 위</b>로 끌어다 놓아 기둥을 세워 줘!<br><span style="font-size:1.05rem;color:#a1855f">(위쪽 집터의 반짝이는 돌로 슝~)</span></p>
          <div id="hk-log-dock" style="display:flex;gap:14px;justify-content:center;margin-top:14px"></div>
          <p style="color:#a1855f;font-size:.9rem;margin-top:14px">세운 기둥 <b style="color:#e07b39" id="hk-pillar-cnt">${placedN}</b> / 3</p>
        </div>`);
      const dock = $("#hk-log-dock");
      const usedSlots = new Set();
      for (let s = 0; s < placedN; s++) usedSlots.add(s);

      function targets() {
        const list = [];
        for (let s = 0; s < 3; s++) {
          if (usedSlots.has(s)) continue;
          const st = document.getElementById("hk-stone-" + s);
          if (!st) continue;
          const r = st.getBoundingClientRect();
          list.push({ id: s, x: r.left + r.width / 2, y: r.top + r.height / 2, r: 96 });
        }
        return list;
      }

      for (let i = placedN; i < 3; i++) {
        const item = document.createElement("div");
        item.style.cssText = "width:104px;cursor:grab";
        item.innerHTML = logSVG;
        dock.appendChild(item);
        makeDraggable(item, logSVG, targets, (hit, el) => {
          if (hit) {
            usedSlots.add(hit.id);
            el.remove();
            placedN++;
            sfx.zing();
            reveal("hk-pillar-" + hit.id, 60);
            toast("징~! 기둥이 쏙 끼워졌어!", true);
            const c = $("#hk-pillar-cnt"); if (c) c.textContent = placedN;
            if (placedN === 3) {
              later(() => {
                reveal("hk-beam", 0);
                sfx.thud();
                toast("커다란 '보'까지 쿵! 뼈대 완성!", true);
                later(done, 1000);
              }, 700);
            }
          } else {
            el.classList.remove("shake"); void el.getBoundingClientRect(); el.classList.add("shake");
            sfx.no();
            toast("주춧돌 위에 살포시 놓아 줘~");
          }
        });
      }
    }
  }

  /* ==============================================================
     미니게임 3단계 — 온돌: 3x3 타일을 이어 아궁이→굴뚝 불길 연결
     ============================================================== */
  function phaseOndol(done) {
    const flameSVG = `
      <svg class="flame" viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 42 Q4 32 10 16 Q13 24 18 25 Q14 12 24 2 Q23 16 31 22 Q36 34 26 41 Q23 43 20 42 Z" fill="#ffdd66"/>
        <path d="M20 40 Q12 33 16 24 Q19 30 22 31 Q24 36 21 40 Z" fill="#fff3c0"/>
      </svg>`;
    panel(`
      <div class="hk-mg" style="text-align:center">
        <p class="hk-inst">아궁이 불이 <b>굴뚝까지</b> 지나가도록 차가운 구들장을 눌러 덥혀 줘!<br><span style="font-size:1.05rem;color:#a1855f">불 옆에 붙어 있는 돌만 뜨거워질 수 있어요</span></p>
        <div class="hk-ondol">
          <div class="hk-endcap">
            <svg viewBox="0 0 64 90">
              <path d="M8 88 L8 46 Q8 30 24 30 L40 30 Q56 30 56 46 L56 88 Z" fill="#4a3a2c"/>
              <g class="flame-anim">
                <path d="M32 84 Q16 70 24 52 Q27 62 33 63 Q29 48 41 38 Q40 56 50 62 Q54 74 44 83 Z" fill="#f28434"/>
                <path d="M33 82 Q25 74 30 62 Q34 70 37 72 Q39 78 35 82 Z" fill="#ffd257"/>
              </g>
              <text x="32" y="20" text-anchor="middle" font-size="13" fill="#7a4f28">아궁이</text>
            </svg>
          </div>
          <div class="hk-grid" id="hk-grid"></div>
          <div class="hk-endcap">
            <svg viewBox="0 0 64 90">
              <rect x="22" y="26" width="20" height="60" rx="10" fill="#c98650"/>
              <rect x="17" y="18" width="30" height="12" rx="6" fill="#a5683a"/>
              <circle cx="32" cy="10" r="6" fill="#dfe3e6" class="smoke-anim"/>
            </svg>
            <div style="font-size:.8rem;color:#7a4f28">굴뚝</div>
          </div>
        </div>
      </div>`);

    // 입구: (2,0) 아궁이 옆 / 출구: (0,2) 굴뚝 쪽
    const ENTRY = [2, 0], EXIT = [0, 2];
    const hot = Array.from({ length: 3 }, () => [false, false, false]);
    const grid = $("#hk-grid");
    const cells = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const d = document.createElement("div");
      d.className = "hk-tile";
      d.innerHTML = flameSVG;
      d.dataset.r = r; d.dataset.c = c;
      grid.appendChild(d);
      cells.push(d);
    }
    cells[ENTRY[0] * 3 + ENTRY[1]].style.outline = "4px solid rgba(242,132,52,.55)";
    cells[EXIT[0] * 3 + EXIT[1]].style.outline = "4px solid rgba(120,160,220,.55)";

    function canHeat(r, c) {
      if (r === ENTRY[0] && c === ENTRY[1]) return true;
      const near = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
      return near.some(([rr, cc]) => rr >= 0 && rr < 3 && cc >= 0 && cc < 3 && hot[rr][cc]);
    }
    grid.addEventListener("pointerdown", (e) => {
      const tile = e.target.closest(".hk-tile");
      if (!tile) return;
      const r = +tile.dataset.r, c = +tile.dataset.c;
      if (hot[r][c]) return;
      if (canHeat(r, c)) {
        hot[r][c] = true;
        tile.classList.add("hot");
        sfx.fire(); sfx.pop();
        if (r === EXIT[0] && c === EXIT[1]) {
          sfx.yay();
          toast("따끈따끈~ 불길이 굴뚝까지 이어졌어!");
          later(() => {
            reveal("hk-L-ondol", 0);
            toast("방바닥이 뜨끈뜨끈해졌다!", true);
            later(done, 1100);
          }, 700);
        }
      } else {
        tile.classList.remove("shake"); void tile.getBoundingClientRect(); tile.classList.add("shake");
        sfx.no();
        toast("불은 이어져야 번져요! 뜨거운 돌 옆부터 눌러 줘");
      }
    });
  }

  /* ==============================================================
     미니게임 4단계 — 황토벽: 흙 언덕 15번 두드리기 → 벽 문질러 바르기
     ============================================================== */
  function phaseMud(done) {
    panel(`
      <div class="hk-mg" style="text-align:center">
        <p class="hk-inst">말랑말랑 황토 언덕을 <b>15번</b> 두드려서 반죽을 모으자!</p>
        <div class="hk-count">황토 반죽 <b id="hk-mud-cnt">0</b> / 15</div>
        <div class="hk-progressbar"><div id="hk-mud-bar"></div></div>
        <svg viewBox="0 0 320 190" style="max-width:340px;margin:0 auto;cursor:pointer" id="hk-hill-svg">
          <defs>
            <radialGradient id="gMud" cx="45%" cy="28%" r="85%">
              <stop offset="0%" stop-color="#e8b57e"/><stop offset="100%" stop-color="#c07f42"/>
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="172" rx="130" ry="14" fill="rgba(120,80,30,.2)"/>
          <g id="hk-hill" style="transform-box:fill-box;transform-origin:50% 100%">
            <path d="M30 170 Q40 96 96 66 Q160 30 226 68 Q284 100 290 170 Z" fill="url(#gMud)"/>
            <ellipse cx="118" cy="80" rx="22" ry="12" fill="rgba(255,255,255,.3)"/>
            <circle cx="98" cy="120" r="4" fill="rgba(90,50,10,.2)"/>
            <circle cx="210" cy="108" r="5" fill="rgba(90,50,10,.2)"/>
            <circle cx="164" cy="140" r="4" fill="rgba(90,50,10,.2)"/>
            <circle cx="140" cy="98" r="6" fill="#8b5a2b" opacity=".85"/><circle cx="186" cy="98" r="6" fill="#8b5a2b" opacity=".85"/>
            <path d="M148 122 Q163 132 178 122" stroke="#8b5a2b" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
          </g>
        </svg>
      </div>`);

    let taps = 0;
    const hillSvg = $("#hk-hill-svg"), hill = $("#hk-hill");
    hillSvg.addEventListener("pointerdown", (e) => {
      if (taps >= 15) return;
      taps++;
      sfx.tap();
      hill.classList.remove("squash"); void hill.getBoundingClientRect(); hill.classList.add("squash");
      const cnt = $("#hk-mud-cnt"); if (cnt) cnt.textContent = taps;
      const bar = $("#hk-mud-bar"); if (bar) bar.style.width = (taps / 15 * 100) + "%";
      const fl = document.createElement("div");
      fl.className = "hk-float";
      fl.textContent = "🟤 +1";
      const pr = $("#hk-panel").getBoundingClientRect();
      fl.style.left = (e.clientX - pr.left - 10) + "px";
      fl.style.top = (e.clientY - pr.top - 20) + "px";
      $("#hk-panel").appendChild(fl);
      later(() => fl.remove(), 800);
      if (taps === 15) { sfx.yay(); toast("반죽 완성! 이제 벽에 쓱쓱 발라 보자"); later(rubStage, 900); }
    });

    /* --- B: 벽 문지르기 --- */
    function rubStage() {
      panel(`
        <div class="hk-mg" style="text-align:center">
          <p class="hk-inst">기둥 사이 빈 곳을 <b>손가락으로 쓱쓱 문질러</b> 황토를 발라 줘!</p>
          <div class="hk-walls">
            <div class="hk-wallbox"><canvas width="160" height="200" style="width:min(150px,38vw);height:auto"></canvas><span class="pct">0%</span></div>
            <div class="hk-wallbox"><canvas width="160" height="200" style="width:min(150px,38vw);height:auto"></canvas><span class="pct">0%</span></div>
          </div>
        </div>`);

      const CW = 160, CH = 200, GC = 8, GR = 10, cw = CW / GC, ch = CH / GR;
      const wallsDone = [false, false];
      $$(".hk-wallbox").forEach((box, wi) => {
        const cv = box.querySelector("canvas"), ctx = cv.getContext("2d");
        const pctEl = box.querySelector(".pct");
        const marked = new Set();
        let drawing = false;
        function paint(e) {
          const r = cv.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width * CW;
          const y = (e.clientY - r.top) / r.height * CH;
          const shades = ["#d99a63", "#cf8f58", "#e2a771", "#d4925a"];
          ctx.beginPath();
          ctx.fillStyle = shades[(Math.random() * shades.length) | 0];
          ctx.arc(x, y, 15 + Math.random() * 7, 0, Math.PI * 2);
          ctx.fill();
          for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
            const gx = Math.floor(x / cw) + dx, gy = Math.floor(y / ch) + dy;
            if (gx >= 0 && gx < GC && gy >= 0 && gy < GR) marked.add(gy * GC + gx);
          }
          const pct = Math.min(100, Math.round(marked.size / (GC * GR) * 100 / 0.92));
          pctEl.textContent = pct + "%";
          if (pct >= 100 && !wallsDone[wi]) {
            wallsDone[wi] = true;
            ctx.fillStyle = "#d99a63"; ctx.fillRect(0, 0, CW, CH);
            box.style.borderColor = "#8fd75f";
            sfx.pop();
            reveal("hk-wall-" + wi, 150);
            toast(wi === 0 ? "한쪽 벽 완성! 반대쪽도 쓱쓱~" : "숨 쉬는 황토벽 완성!");
            if (wallsDone[0] && wallsDone[1]) { sfx.yay(); later(done, 1000); }
          }
        }
        cv.addEventListener("pointerdown", (e) => { drawing = true; cv.setPointerCapture(e.pointerId); paint(e); sfx.tap(); });
        cv.addEventListener("pointermove", (e) => { if (drawing) paint(e); });
        cv.addEventListener("pointerup", () => { drawing = false; });
        cv.addEventListener("pointercancel", () => { drawing = false; });
      });
    }
  }

  /* ==============================================================
     미니게임 5단계 — 창호: 대패 밀기(스와이프) → 창호지 살살 바르기(탭)
     ============================================================== */
  function phaseHanji(done) {
    const plankPaths = [
      "M14 34 L34 22 L58 34 L84 20 L110 34 L138 22 L162 34 L188 21 L214 34 L240 23 L266 34 L286 26 L286 66 L14 66 Z",
      "M14 32 L60 26 L110 32 L164 25 L216 32 L262 27 L286 30 L286 66 L14 66 Z",
      "M14 30 Q150 24 286 30 L286 66 L14 66 Z"
    ];
    panel(`
      <div class="hk-mg" style="text-align:center">
        <p class="hk-inst">까끌까끌한 나무를 <b>옆으로 쓱— 밀어서</b> 매끈한 문틀을 만들자! (3번)</p>
        <div class="hk-count">대패질 <b id="hk-plane-cnt">0</b> / 3</div>
        <div id="hk-plank-zone" style="position:relative;max-width:400px;margin:10px auto;touch-action:none;cursor:ew-resize">
          <svg viewBox="0 0 300 80">
            <defs>
              <linearGradient id="gPlank" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#d8a066"/><stop offset="100%" stop-color="#b0763f"/>
              </linearGradient>
            </defs>
            <ellipse cx="150" cy="72" rx="140" ry="6" fill="rgba(120,80,30,.18)"/>
            <path id="hk-plank" d="${plankPaths[0]}" fill="url(#gPlank)"/>
            <path d="M30 46 Q150 42 270 46" stroke="rgba(90,50,10,.25)" stroke-width="3" fill="none"/>
          </svg>
          <div style="position:absolute;top:-6px;left:0;right:0;text-align:center;font-size:1.4rem;pointer-events:none" id="hk-swipe-hint">👉 쓱—</div>
        </div>
      </div>`);

    let passes = 0, startX = null, maxDx = 0;
    const zone = $("#hk-plank-zone");
    zone.addEventListener("pointerdown", (e) => { startX = e.clientX; maxDx = 0; zone.setPointerCapture(e.pointerId); });
    zone.addEventListener("pointermove", (e) => { if (startX !== null) maxDx = Math.max(maxDx, Math.abs(e.clientX - startX)); });
    zone.addEventListener("pointerup", () => {
      const need = zone.getBoundingClientRect().width * 0.45;
      if (startX !== null && maxDx > need && passes < 3) {
        passes++;
        sfx.zing();
        $("#hk-plane-cnt").textContent = passes;
        $("#hk-plank").setAttribute("d", plankPaths[Math.min(2, passes)]);
        const curl = document.createElement("div");
        curl.textContent = "🌀";
        curl.style.cssText = "position:absolute;top:6px;left:56%;font-size:1.5rem;pointer-events:none;animation:hkCurl .8s ease-in both";
        zone.appendChild(curl);
        later(() => curl.remove(), 850);
        toast(["쓱싹! 결이 살아나네~", "쓱쓱! 점점 매끈매끈!", "반질반질 문틀 완성!"][passes - 1]);
        if (passes === 3) { sfx.yay(); later(paperStage, 900); }
      } else if (startX !== null && maxDx <= need) {
        toast("조금 더 길—게 밀어 볼까?");
        sfx.no();
      }
      startX = null;
    });

    /* --- B: 창호지 바르기 --- */
    function paperStage() {
      const doorSVG = (di) => {
        let cells = "";
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
          cells += `<rect class="hk-cell" data-d="${di}" data-i="${r * 2 + c}" x="${14 + c * 46}" y="${14 + r * 42}" width="42" height="38" rx="4" fill="rgba(60,40,20,.35)"/>`;
        }
        return `
        <svg viewBox="0 0 120 160" style="width:min(150px,38vw)">
          <rect x="2" y="2" width="116" height="156" rx="10" fill="#8a5a34"/>
          <rect x="10" y="10" width="100" height="140" rx="6" fill="#6e441f"/>
          ${cells}
          <g stroke="#8a5a34" stroke-width="3" pointer-events="none">
            <line x1="60" y1="10" x2="60" y2="150"/>
            <line x1="10" y1="54" x2="110" y2="54"/>
            <line x1="10" y1="96" x2="110" y2="96"/>
          </g>
        </svg>`;
      };
      panel(`
        <div class="hk-mg" style="text-align:center">
          <p class="hk-inst">문살 한 칸 한 칸 <b>살~살 눌러서</b> 창호지를 발라 줘!<br><span style="font-size:1.05rem;color:#a1855f">너무 빨리 두드리면 종이가 찢어져요!</span></p>
          <div class="hk-count">바른 칸 <b id="hk-paper-cnt">0</b> / 12</div>
          <div class="hk-doors">${doorSVG(0)}${doorSVG(1)}</div>
        </div>`);

      let papered = 0, lastTap = 0;
      $$(".hk-cell").forEach((cell) => {
        cell.addEventListener("pointerdown", () => {
          if (cell.dataset.on) return;
          const now = performance.now();
          if (now - lastTap < 170) {
            lastTap = now;
            cell.setAttribute("fill", "rgba(230,120,110,.55)");
            cell.classList.remove("shake"); void cell.getBoundingClientRect(); cell.classList.add("shake");
            sfx.no();
            toast("찌익—! 살살~ 천천히 발라야 해!");
            later(() => { if (!cell.dataset.on) cell.setAttribute("fill", "rgba(60,40,20,.35)"); }, 500);
            return;
          }
          lastTap = now;
          cell.dataset.on = "1";
          cell.setAttribute("fill", "#fdf6e0");
          cell.style.filter = "drop-shadow(0 0 6px rgba(255,240,190,.9))";
          sfx.pop();
          papered++;
          $("#hk-paper-cnt").textContent = papered;
          if (papered === 12) {
            sfx.yay();
            toast("은은~한 빛이 스며드는 창호 완성!");
            later(() => {
              reveal("hk-door-0", 0);
              reveal("hk-door-1", 350);
              later(done, 1100);
            }, 700);
          }
        });
      });
    }
  }

  /* ==============================================================
     미니게임 6단계 — 기와지붕: 기와를 한 장씩 드래그해 얹기
     ============================================================== */
  function phaseRoof(done) {
    const tileMini = `
      <svg viewBox="0 0 120 62" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 46 Q60 56 110 46 L104 18 Q60 10 16 18 Z" fill="#4a5568" stroke="#2c3542" stroke-width="2" stroke-linejoin="round"/>
        <path d="M42 14 Q40 30 38 48 M82 14 Q84 30 86 48" stroke="rgba(20,28,38,.4)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M10 46 Q60 56 110 46" stroke="#f5f0e6" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="45" cy="24" rx="14" ry="5" fill="rgba(255,255,255,.15)"/>
      </svg>`;
    const TOTAL = 6;
    const placed = Array(TOTAL).fill(false);
    let count = 0;

    // 서까래 지붕 바탕 먼저 등장 → 점선 칸 안내
    reveal("hk-roof-base", 250);
    later(() => {
      for (let i = 0; i < TOTAL; i++) {
        const s = document.getElementById("hk-rslot-" + i);
        if (s) s.classList.add("on");
      }
    }, 900);

    panel(`
      <div class="hk-mg" style="text-align:center">
        <p class="hk-inst">기와를 <b>한 장씩</b> 지붕의 점선 칸으로 옮겨 얹자!<br><span style="font-size:1.05rem;color:#a1855f">진짜 기와처럼 아래 줄부터 차곡차곡!</span></p>
        <div class="hk-count">얹은 기와 <b id="hk-rtile-cnt">0</b> / ${TOTAL}</div>
        <div id="hk-tile-stack" style="position:relative;width:132px;height:118px;margin:12px auto;cursor:grab;animation:hkBob 2.2s ease-in-out infinite"></div>
      </div>`);

    function drawStack() {
      const st = $("#hk-tile-stack");
      if (!st) return;
      st.innerHTML = "";
      for (let k = 0; k < TOTAL - count; k++) {
        const d = document.createElement("div");
        d.style.cssText = "position:absolute;left:0;right:0;bottom:" + (k * 11) + "px;pointer-events:none";
        d.innerHTML = tileMini;
        st.appendChild(d);
      }
    }
    drawStack();

    function targets() {
      const list = [];
      for (let i = 0; i < TOTAL; i++) {
        if (placed[i]) continue;
        const s = document.getElementById("hk-rslot-" + i);
        if (!s) continue;
        const r = s.getBoundingClientRect();
        list.push({ id: i, x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.max(58, r.width / 2 + 12) });
      }
      return list;
    }

    makeDraggable($("#hk-tile-stack"), tileMini, targets, (hit, el) => {
      if (!hit) {
        el.classList.remove("shake"); void el.getBoundingClientRect(); el.classList.add("shake");
        sfx.no();
        toast("지붕 위 점선 칸에 살포시 얹어 줘~");
        return;
      }
      const i = hit.id;
      if (i >= 3 && !placed[i - 3]) {           // 윗줄은 같은 열 아랫줄부터
        sfx.no();
        toast("기와는 아래 줄부터 차곡차곡 얹어야 해!");
        return;
      }
      placed[i] = true;
      count++;
      const s = document.getElementById("hk-rslot-" + i);
      if (s) s.style.display = "none";
      reveal("hk-rtile-" + i, 0);
      toast(["한 장!", "두 장! 착착~", "세 장!", "네 장!", "다섯 장! 거의 다 됐어!", "마지막 기와!"][count - 1], true);
      const c = $("#hk-rtile-cnt"); if (c) c.textContent = count;
      drawStack();
      if (count === TOTAL) {
        const st = $("#hk-tile-stack"); if (st) st.style.pointerEvents = "none";
        later(() => {
          reveal("hk-roof-trim", 0);
          sfx.thud();
          toast("우와… 처마 곡선이 정말 아름다워!", true);
          panel(`<p class="hk-inst" style="margin-top:100px">🎉 한옥이 완성되어 갑니다...</p>`);
          later(done, 1100);
        }, 700);
      }
    });
  }

  /* ================= 7. 컨페티 ================= */
  function confetti() {
    const cv = document.createElement("canvas");
    cv.id = "hk-confetti";
    cv.style.cssText = "position:fixed;inset:0;z-index:70;pointer-events:none";
    cv.width = innerWidth; cv.height = innerHeight;
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d");
    const colors = ["#f2833a", "#ffd257", "#8fd75f", "#8fc7ee", "#e0684a", "#b78ae8", "#fff3d6"];
    const parts = Array.from({ length: 140 }, () => ({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.5,
      w: 7 + Math.random() * 8, h: 5 + Math.random() * 6,
      vy: 2.2 + Math.random() * 3.4, vx: -1.6 + Math.random() * 3.2,
      rot: Math.random() * Math.PI, vr: -0.14 + Math.random() * 0.28,
      c: colors[(Math.random() * colors.length) | 0]
    }));
    const t0 = performance.now();
    (function anim(now) {
      if (!cv.isConnected) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (now - t0 < 3600) requestAnimationFrame(anim);
      else cv.remove();
    })(t0);
  }

  /* ================= 8. 엔딩 ================= */
  function finale() {
    sfx.yay(); later(sfx.yay, 400);
    confetti();
    setChip(PHASES.length);
    panel(`<p class="hk-inst" style="margin-top:100px">🏠 자연에서 구한 돌, 나무, 흙, 종이로 한옥을 완성했어! 🎉</p>`);
    later(() => {
      const ov = document.createElement("div");
      ov.className = "hk-overlay";
      ov.innerHTML = `
        <div class="hk-pop">
          <span class="hk-pop-badge">🎊 한옥 완성 🎊</span>
          <div class="hk-goblin">${goblinSVG()}</div>
          <h2>축하합니다!</h2>
          <p>자연에서 구한 <b style="color:#8797a2">돌</b>, <b style="color:#c08048">나무</b>, <b style="color:#d99a63">흙</b>, <b style="color:#d4b96a">종이</b>로<br>한옥을 완성했어!</p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="hk-btn sm" id="hk-replay">🔄 처음부터 다시</button>
            <button class="hk-btn grn" id="hk-finish">확인!</button>
          </div>
        </div>`;
      document.body.appendChild(ov);
      ov.querySelector("#hk-replay").addEventListener("pointerdown", () => {
        ov.remove();
        startClay();
      });
      ov.querySelector("#hk-finish").addEventListener("pointerdown", () => {
        ov.remove();
        const h = hanokState();
        h.complete = true;
        h.phase = "game";
        if (_ctx) {
          bindMission();
        } else {
          if (window.state && window.state.solved) window.state.solved.hanok = true;
          if (window.render) window.render();
        }
      });
    }, 1400);
  }

  /* ================= 9. 이름 짓기 + 우리들의 한옥마을 (기존 이식) ================= */
  function renderName() {
    const h = hanokState();
    _appEl.innerHTML = _ctx.sceneTemplate("우리 집 이름 짓기", `
      <div class="section-card hanok-game">
        <p class="hanok-msg">완성된 한옥에게 멋진 이름을 지어주세요!</p>
        <div class="hanok-name-preview">🏯</div>
        <input type="text" class="hanok-name-input" id="hanokNameInput"
          maxlength="20" placeholder="예: 민우의 따뜻한 기와집" value="${escapeHtml(h.houseName || "")}" />
        <button type="button" class="btn primary" id="hanokRegisterBtn">한옥마을에 등록하기</button>
      </div>
    `);
    if (_ctx.setupNavigationAndHelp) _ctx.setupNavigationAndHelp("집 이름을 적고 등록 버튼을 눌러 마을에 지어보세요!");
    document.getElementById("hanokRegisterBtn").onclick = async () => {
      const input = document.getElementById("hanokNameInput");
      const name = input.value.trim();
      if (!name) {
        popupOk("이름을 지어주세요!", "예: 민우의 따뜻한 기와집", "info");
        return;
      }
      const btn = document.getElementById("hanokRegisterBtn");
      btn.disabled = true;
      btn.textContent = "마을에 짓는 중...";

      const code = myBuilderCode();
      const existing = _villageCache.find((v) => v.id === code);
      const slot = existing ? { x: existing.gridX, y: existing.gridY } : findFreeSlot(_villageCache, code);
      const house = {
        id: code,
        name,
        builder: code,
        likes: existing ? existing.likes || 0 : 0,
        likedBy: existing ? existing.likedBy || [] : [],
        gridX: slot.x,
        gridY: slot.y,
        createdAt: existing ? existing.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await upsertHouse(house);
      h.houseName = name;
      h.registered = true;
      playSnd("correct.mp3");
      popupOk("완성!", `"${name}"이(가) 한옥마을에 지어졌어요!`, "success").then(() => nextPhase("village"));
    };
  }

  function fbBadge() {
    return isSharedMode()
      ? '<span class="hanok-sync-badge hanok-sync-badge--on">🌐 친구들과 실시간 공유중</span>'
      : '<span class="hanok-sync-badge">📱 이 기기에만 저장 중</span>';
  }

  function renderVillage() {
    const code = myBuilderCode();
    _appEl.innerHTML = _ctx.sceneTemplate("우리들의 한옥마을", `
      <div class="section-card hanok-game">
        <p class="hanok-msg" id="hanokVillageMsg">마을을 불러오는 중...</p>
        <p class="hanok-learn">친구들이 지은 한옥을 눌러 구경하고 ❤️ 좋아요를 눌러 응원해 주세요! ${fbBadge()}</p>
        <div class="hanok-village-grid" id="hanokVillageGrid" style="--village-cols:${VILLAGE_COLS}"></div>
        <div class="hanok-village-actions">
          <button type="button" class="btn" id="hanokRebuildBtn">🔨 다시 짓기</button>
        </div>
        <div class="hanok-village-detail hidden" id="hanokVillageDetail"></div>
      </div>
    `);
    if (_ctx.setupNavigationAndHelp) _ctx.setupNavigationAndHelp("우리들의 한옥마을에서 친구들의 집을 구경해 보세요!");

    document.getElementById("hanokRebuildBtn").onclick = () => {
      nextPhase("game");
    };

    startVillageSync((list) => drawVillageGrid(list, code));
  }

  function drawVillageGrid(village, code) {
    const grid = document.getElementById("hanokVillageGrid");
    const msg = document.getElementById("hanokVillageMsg");
    if (!grid || !msg) return;

    const myHouse = village.find((v) => v.id === code);
    msg.textContent = myHouse
      ? `"${myHouse.name}"이(가) 마을에서 반짝이고 있어요!`
      : "아직 등록된 내 한옥이 없어요. 다시 지어보세요!";

    const rows = computeRows(village.length);
    const cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < VILLAGE_COLS; x++) {
        const house = village.find((v) => v.gridX === x && v.gridY === y);
        if (house) {
          const liked = (house.likedBy || []).includes(code);
          cells.push(`
            <button type="button" class="hanok-village-house ${house.id === code ? "mine" : ""}"
              data-house-id="${house.id}">
              <span class="hanok-village-roof">🏠</span>
              <span class="hanok-village-name">${escapeHtml(house.name)}</span>
              <span class="hanok-village-likes">❤️ ${house.likes || 0}</span>
              ${liked ? '<span class="hanok-village-liked">✔️</span>' : ""}
            </button>
          `);
        } else {
          cells.push(`<div class="hanok-village-empty">🌳</div>`);
        }
      }
    }
    grid.innerHTML = cells.join("");

    document.querySelectorAll(".hanok-village-house").forEach((btn) => {
      btn.onclick = () => showHouseDetail(btn.dataset.houseId, code);
    });
  }

  function showHouseDetail(houseId, code) {
    const house = _villageCache.find((v) => v.id === houseId);
    const detail = document.getElementById("hanokVillageDetail");
    if (!house || !detail) return;
    const liked = (house.likedBy || []).includes(code);
    const isMine = house.id === code;

    detail.classList.remove("hidden");
    detail.innerHTML = `
      <div class="hanok-detail-card">
        <h3>🏡 ${escapeHtml(house.name)}</h3>
        <p>좋아요 ${house.likes || 0}개</p>
        <button type="button" class="btn primary" id="hanokLikeBtn" ${liked || isMine ? "disabled" : ""}>
          ${isMine ? "내가 지은 집이에요" : liked ? "이미 응원했어요!" : "❤️ 응원하기"}
        </button>
      </div>
    `;
    const likeBtn = document.getElementById("hanokLikeBtn");
    if (likeBtn && !liked && !isMine) {
      likeBtn.onclick = async () => {
        likeBtn.disabled = true;
        const updated = await likeHouse(house, code);
        playSnd("correct.mp3");
        const idx = _villageCache.findIndex((v) => v.id === house.id);
        if (idx >= 0) _villageCache[idx] = updated;
        drawVillageGrid(_villageCache, code);
        showHouseDetail(houseId, code);
      };
    }
  }

  /* ================= 10. 라우팅 / 진입점 ================= */
  function nextPhase(phase) {
    hanokState().phase = phase;
    routeRender();
  }

  function routeRender() {
    stopAll();
    const h = hanokState();
    if (h.phase === "name" || h.phase === "village") h.phase = "game";
    startClay();
  }

  function startClay() {
    injectCSS();
    clayStop();
    let host = _appEl;
    if (_ctx && _ctx.sceneTemplate) {
      _appEl.innerHTML = _ctx.sceneTemplate("STAGE 2-2 한옥 세우기", `<div id="hanok-embed" class="hanok-clay-embed"></div>`);
      if (_ctx.setupNavigationAndHelp) _ctx.setupNavigationAndHelp("도깨비가 무너뜨린 한옥을 다시 세우자!");
      host = _appEl.querySelector("#hanok-embed");
    }
    root = host;
    root.innerHTML = layoutHTML();
    setChip(0);
    if (_ctx) bindMission();
    later(() => startPhase(0), 500);
  }

  window.HanokGame = {
    render(app, ctx) {
      _ctx = ctx || null;
      _appEl = app;
      injectCSS();
      if (_ctx && !_ctx.getState().hanok) {
        _ctx.getState().hanok = this.createDefaultState();
      }
      /* 구버전 상태(phase:"story" 등)와의 호환: 게임 진행형 phase는 모두 game으로 */
      const h = hanokState();
      if (h.phase !== "game") h.phase = "game";
      routeRender();
    },
    stop: stopAll,
    createDefaultState
  };

  /* standalone 실행: app.js 프레임워크가 없으면 스스로 부팅 (hanok-adventure.html) */
  if (document.getElementById("hanok-app")) {
    window.HanokGame.render(document.getElementById("hanok-app"), null);
  }
})();
