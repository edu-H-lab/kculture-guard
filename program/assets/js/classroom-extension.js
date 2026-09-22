/**
 * 교실확장활동 — 오프라인 수업 작품을 사진으로 올려
 * 우리 반 친구들과 좋아요·댓글로 응원하는 게시판
 *
 * app.js: window.ClassroomExtension = { render, stop, seedReviewDemo }
 */
(function () {
  "use strict";

  const STORE_KEY = "kculture_classroom_works_v1";
  const COLLECTION = "classroom_works";
  const MAX_CAPTION = 60;
  const MAX_COMMENT = 40;
  const MAX_COMMENTS = 40;
  const STARTERS = ["멋져요!", "잘했어요!", "예뻐요!", "대단해요!", "응원해요!"];
  const CAPTION_HINTS = ["오늘 만든 작품이에요.", "친구들과 함께 만들었어요.", "우리 반이 만든 거예요."];

  let _appEl = null;
  let _ctx = null;
  let _unsub = null;
  let _works = [];
  let _cameraStream = null;
  let _ui = {
    view: "board",
    filter: "all",
    workId: "",
    photoDraft: "",
    caption: "",
    activityId: "classroom",
    commentDraft: "",
    quickCommentId: "",
    busy: false
  };

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function photoSrc(url) {
    return typeof assetUrl === "function"
      ? assetUrl(url)
      : String(url || "").replace(/\.(png|jpe?g)(\?[^#]*)?$/i, ".webp$2");
  }

  function playClick() {
    if (_ctx && typeof _ctx.playSound === "function") _ctx.playSound("click.mp3");
  }

  function user() {
    return (_ctx && typeof _ctx.getUser === "function") ? (_ctx.getUser() || {}) : {};
  }

  function activities() {
    return (_ctx && typeof _ctx.getActivities === "function") ? (_ctx.getActivities() || []) : [];
  }

  function activityTitle(id) {
    const found = activities().find((item) => item.id === id);
    return (found && found.title) || "우리 교실";
  }

  function myId() {
    const me = user();
    if (me.isTeacher) return `teacher_${me.classKey || "local"}`;
    return me.accountId || "guest";
  }

  function myName() {
    const me = user();
    return (me.name || "").trim() || (me.isTeacher ? "선생님" : "나");
  }

  function classKey() {
    return user().classKey || "local";
  }

  function db() {
    if (!window.KCultureFirebase?.isReady()) return null;
    try {
      const cfg = window.HANOK_FIREBASE_CONFIG;
      const app = window.firebase?.apps?.length ? window.firebase.app() : window.firebase.initializeApp(cfg);
      return window.firebase.firestore(app);
    } catch (_) {
      return null;
    }
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveLocal(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (_) {}
  }

  function classWorks(list) {
    const key = classKey();
    return (list || []).filter((item) => !item.classKey || item.classKey === key);
  }

  function stopSync() {
    if (_unsub) {
      try { _unsub(); } catch (_) {}
      _unsub = null;
    }
  }

  function startSync() {
    stopSync();
    const key = classKey();
    const fire = db();
    if (fire) {
      try {
        _unsub = fire.collection(COLLECTION).where("classKey", "==", key).onSnapshot((snap) => {
          const list = [];
          snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
          _works = list;
          saveLocal(mergeLocalRemote(loadLocal(), list));
          if (_appEl && _ui.view !== "compose") paint();
        }, () => {
          _works = classWorks(loadLocal());
          if (_appEl && _ui.view !== "compose") paint();
        });
        return;
      } catch (_) {}
    }
    _works = classWorks(loadLocal());
  }

  function mergeLocalRemote(local, remote) {
    const byId = {};
    classWorks(local).forEach((item) => { if (item?.id) byId[item.id] = item; });
    (remote || []).forEach((item) => { if (item?.id) byId[item.id] = item; });
    const others = (local || []).filter((item) => item?.classKey && item.classKey !== classKey());
    return others.concat(Object.values(byId));
  }

  async function upsertWork(work) {
    const local = loadLocal();
    const idx = local.findIndex((item) => item.id === work.id);
    if (idx >= 0) local[idx] = work; else local.push(work);
    saveLocal(local);
    const i = _works.findIndex((item) => item.id === work.id);
    if (i >= 0) _works[i] = work; else _works.push(work);
    const fire = db();
    if (fire) {
      try {
        await fire.collection(COLLECTION).doc(work.id).set(work, { merge: true });
      } catch (err) {
        console.warn("[교실확장활동] 서버 저장 실패 — 이 기기에는 저장되었어요.", err);
      }
    }
    return work;
  }

  async function removeWork(workId) {
    _works = _works.filter((item) => item.id !== workId);
    saveLocal(loadLocal().filter((item) => item.id !== workId));
    const fire = db();
    if (fire) {
      try { await fire.collection(COLLECTION).doc(workId).delete(); } catch (_) {}
    }
  }

  function compressImage(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const max = 960;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try { resolve(canvas.toDataURL("image/jpeg", 0.72)); }
        catch (_) { resolve(dataUrl); }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function sortWorks(list) {
    return (list || []).slice().sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }

  function filteredWorks() {
    const list = sortWorks(_works);
    if (_ui.filter && _ui.filter !== "all") {
      return list.filter((item) => item.activityId === _ui.filter);
    }
    return list;
  }

  function timeLabel(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}.${dd}`;
  }

  function likedByMe(work) {
    return (work.likedBy || []).includes(myId());
  }

  function canDelete(work) {
    const me = user();
    return !!(me.isTeacher || work.accountId === myId());
  }

  function findWork(workId) {
    return _works.find((item) => item.id === workId) || null;
  }

  function currentWork() {
    return findWork(_ui.workId);
  }

  function goBoard() {
    stopCameraCapture();
    _ui.view = "board";
    _ui.workId = "";
    _ui.photoDraft = "";
    _ui.commentDraft = "";
    paint();
  }

  function goCompose() {
    stopCameraCapture();
    _ui.view = "compose";
    _ui.photoDraft = "";
    _ui.caption = "";
    const acts = activities();
    _ui.activityId = acts[0]?.id || "";
    _ui.quickCommentId = "";
    paint();
  }

  function goDetail(workId) {
    _ui.view = "detail";
    _ui.workId = workId;
    _ui.commentDraft = "";
    _ui.quickCommentId = "";
    paint();
  }

  function headerHTML(title, extra) {
    // 전역 「홈」「우리반 게시판」으로 이동하므로 내부 뒤로가기 버튼은 두지 않는다.
    return `
      <header class="cx-header">
        <span class="cx-header-space" aria-hidden="true"></span>
        <h1 class="cx-title">${escapeHtml(title)}</h1>
        ${extra || `<span class="cx-header-space"></span>`}
      </header>
    `;
  }

  function commentListHTML(work, limit) {
    const comments = Array.isArray(work.comments) ? work.comments : [];
    const shown = Number.isFinite(limit) ? comments.slice(-limit) : comments;
    if (!shown.length) {
      return `<li class="cx-empty-line">첫 응원 댓글을 남겨 보세요.</li>`;
    }
    return shown.map((item) => `
      <li class="cx-comment">
        <strong>${escapeHtml(item.name || "친구")}</strong>
        <span>${escapeHtml(item.text)}</span>
      </li>
    `).join("");
  }

  function starterHTML(attr) {
    return STARTERS.map((text) => `<button type="button" class="cx-hint" ${attr}="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join("");
  }

  function commentFormHTML(workId, inputId, btnId, starterAttr) {
    return `
      <div class="cx-hints">${starterHTML(starterAttr)}</div>
      <div class="cx-comment-form">
        <input id="${inputId}" class="cx-input" maxlength="${MAX_COMMENT}" placeholder="응원 댓글을 남겨요" value="${escapeHtml(_ui.commentDraft)}" />
        <button type="button" class="cx-btn cx-btn--accent" id="${btnId}" data-comment-work="${escapeHtml(workId)}">달기</button>
      </div>
    `;
  }

  function boardHTML() {
    const works = filteredWorks();
    const acts = activities().filter((item) => item.id !== "classroom");
    const sampleIds = new Set(
      (_works || [])
        .filter((item) => item && (item.isReviewSeed || item.photoUrl))
        .map((item) => item.activityId)
        .filter((id) => id && id !== "classroom" && id !== "all")
    );
    const cards = works.map((work) => {
      const liked = likedByMe(work);
      const open = _ui.quickCommentId === work.id;
      const comments = Array.isArray(work.comments) ? work.comments : [];
      return `
      <article class="cx-card">
        <button type="button" class="cx-card-photo" data-work-id="${escapeHtml(work.id)}">
          <img src="${escapeHtml(photoSrc(work.photoUrl))}" alt="${escapeHtml(work.caption || work.name)}" loading="lazy" decoding="async" />
        </button>
        <div class="cx-card-meta">
          <span class="cx-card-name">${escapeHtml(work.name || "친구")}${work.number ? ` · ${work.number}번` : ""}</span>
          <span class="cx-card-tag">${escapeHtml(activityTitle(work.activityId))}</span>
        </div>
        ${work.caption ? `<p class="cx-card-caption">${escapeHtml(work.caption)}</p>` : ""}
        <div class="cx-card-bar">
          <button type="button" class="cx-like${liked ? " is-on" : ""}" data-like-id="${escapeHtml(work.id)}">${liked ? "❤️" : "🤍"} 좋아요 ${work.likes || 0}</button>
          <button type="button" class="cx-card-comment${open ? " is-on" : ""}" data-open-comment="${escapeHtml(work.id)}">💬 댓글 ${comments.length}</button>
        </div>
        <ul class="cx-card-comments">${commentListHTML(work, 2)}</ul>
        ${open ? `<div class="cx-card-composer">${commentFormHTML(work.id, "cxQuickCommentInput", "cxQuickCommentBtn", "data-quick-comment")}</div>` : ""}
      </article>
    `;
    }).join("");
    if (_ui.filter === "classroom") _ui.filter = "all";
    const filters = [`<button type="button" class="cx-chip${_ui.filter === "all" ? " is-on" : ""}" data-filter="all">전체</button>`]
      .concat(acts.map((item) => {
        const hasSample = sampleIds.has(item.id);
        const on = _ui.filter === item.id;
        return `<button type="button" class="cx-chip${on ? " is-on" : ""}${hasSample ? " has-works" : ""}" data-filter="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`;
      }))
      .join("");
    return `
      ${headerHTML("교실확장활동")}
      <p class="cx-lead">친구들이 올린 작품에 좋아요를 누르고, 댓글로 서로 응원해요.</p>
      <div class="cx-filters">${filters}</div>
      <div class="cx-grid">${cards || `<p class="cx-empty">아직 올라온 작품이 없어요. 오늘 만든 작품을 첫 번째로 올려 보세요!</p>`}</div>
      ${user().isTeacher ? "" : `<button type="button" class="cx-fab" id="cxFabBtn">📷 작품 올리기</button>`}
    `;
  }

  function composeHTML() {
    const acts = activities().filter((item) => item.id !== "classroom");
    const chips = acts.map((item) => `
      <button type="button" class="cx-chip${_ui.activityId === item.id ? " is-on" : ""}" data-activity="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>
    `).join("");
    const hints = CAPTION_HINTS.map((text) => `<button type="button" class="cx-hint" data-caption="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join("");
    return `
      ${headerHTML("작품 올리기")}
      <p class="cx-lead">오프라인 수업에서 만든 작품을 사진으로 남겨 우리 반 게시판에 올려요.</p>
      <p class="cx-kicker">어떤 활동과 이어진 작품인가요?</p>
      <div class="cx-filters">${chips}</div>
      <div class="cx-compose-photo">
        ${_ui.photoDraft
          ? `<img src="${escapeHtml(_ui.photoDraft)}" alt="올릴 작품 사진" />`
          : `<p>사진을 찍거나 앨범에서 고르세요.</p>`}
      </div>
      <div class="cx-photo-actions">
        <button type="button" class="cx-btn cx-btn--accent" id="cxCameraBtn">📷 사진 찍기</button>
        <button type="button" class="cx-btn cx-btn--ghost" id="cxAlbumBtn">🖼️ 앨범에서 고르기</button>
      </div>
      <input id="cxCameraInput" class="cx-file" type="file" accept="image/*" capture="environment" />
      <input id="cxAlbumInput" class="cx-file" type="file" accept="image/*" />
      <label class="cx-field">한 줄 소개
        <input id="cxCaptionInput" class="cx-input" maxlength="${MAX_CAPTION}" placeholder="오늘 만든 작품이에요." value="${escapeHtml(_ui.caption)}" />
      </label>
      <div class="cx-hints">${hints}</div>
      <button type="button" class="cx-btn cx-btn--save" id="cxPostBtn" ${_ui.photoDraft ? "" : "disabled"}>게시판에 올리기</button>
    `;
  }

  function detailHTML(work) {
    if (!work) return `<p class="cx-empty">작품을 찾지 못했어요.</p>`;
    const liked = likedByMe(work);
    return `
      ${headerHTML("작품 보기")}
      <article class="cx-detail">
        <img class="cx-detail-photo" src="${escapeHtml(photoSrc(work.photoUrl))}" alt="${escapeHtml(work.caption || work.name)}" />
        <div class="cx-detail-who">
          <p class="cx-detail-name">${escapeHtml(work.name || "친구")}${work.number ? ` · ${work.number}번` : ""}</p>
          <p class="cx-detail-tag">${escapeHtml(activityTitle(work.activityId))} · ${escapeHtml(timeLabel(work.createdAt))}</p>
        </div>
        ${work.caption ? `<p class="cx-detail-caption">${escapeHtml(work.caption)}</p>` : ""}
        <div class="cx-detail-actions">
          <button type="button" class="cx-like${liked ? " is-on" : ""}" data-like-id="${escapeHtml(work.id)}">${liked ? "❤️" : "🤍"} 좋아요 ${work.likes || 0}</button>
          ${canDelete(work) ? `<button type="button" class="cx-btn cx-btn--ghost" id="cxDeleteBtn">삭제</button>` : ""}
        </div>
        <section class="cx-comments">
          <h2>댓글 ${(work.comments || []).length}</h2>
          <ul>${commentListHTML(work)}</ul>
          ${commentFormHTML(work.id, "cxCommentInput", "cxCommentBtn", "data-comment")}
        </section>
      </article>
    `;
  }

  function paint() {
    if (!_appEl) return;
    const inner = _ui.view === "compose"
      ? composeHTML()
      : _ui.view === "detail"
        ? detailHTML(currentWork())
        : boardHTML();
    _appEl.innerHTML = `
      <div class="cx-screen" id="classroomExtension">
        <div class="cx-bg"></div>
        <div class="cx-overlay">${inner}</div>
      </div>
    `;
    bind();
  }

  function readFile(input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      compressImage(String(reader.result || "")).then((src) => {
        _ui.photoDraft = src;
        paint();
      });
    };
    try { reader.readAsDataURL(file); } catch (_) {}
  }

  function stopCameraCapture() {
    if (_cameraStream) {
      try { _cameraStream.getTracks().forEach((track) => track.stop()); } catch (_) {}
      _cameraStream = null;
    }
    const overlay = document.getElementById("cxCameraOverlay");
    if (overlay) overlay.remove();
  }

  function fallbackCameraFilePicker() {
    const cameraInput = document.getElementById("cxCameraInput");
    if (!cameraInput) return;
    try { cameraInput.value = ""; } catch (_) {}
    cameraInput.click();
  }

  async function openCameraCapture() {
    stopCameraCapture();
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      if (window.Swal) {
        Swal.fire({
          icon: "info",
          title: "카메라를 열 수 없어요",
          text: "이 환경에서는 카메라 대신 사진을 고를 수 있어요.",
          confirmButtonText: "사진 고르기"
        }).then(() => fallbackCameraFilePicker());
      } else {
        fallbackCameraFilePicker();
      }
      return;
    }

    let stream = null;
    try {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 960 }
          }
        });
      } catch (_) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      }
    } catch (err) {
      console.warn("[교실확장활동] 카메라 연결 실패", err);
      if (window.Swal) {
        Swal.fire({
          icon: "warning",
          title: "카메라 연결 실패",
          text: "카메라 권한을 허용해 주거나, 앨범에서 사진을 골라 주세요.",
          confirmButtonText: "앨범에서 고르기"
        }).then(() => {
          const albumInput = document.getElementById("cxAlbumInput");
          if (albumInput) {
            try { albumInput.value = ""; } catch (_) {}
            albumInput.click();
          }
        });
      } else {
        fallbackCameraFilePicker();
      }
      return;
    }

    _cameraStream = stream;
    const overlay = document.createElement("div");
    overlay.id = "cxCameraOverlay";
    overlay.className = "cx-camera-overlay";
    overlay.innerHTML = `
      <div class="cx-camera-panel" role="dialog" aria-label="사진 찍기">
        <video id="cxCameraVideo" class="cx-camera-video" playsinline autoplay muted></video>
        <p class="cx-camera-hint">작품을 화면에 맞춘 뒤 촬영 버튼을 누르세요.</p>
        <div class="cx-camera-actions">
          <button type="button" class="cx-btn cx-btn--ghost" id="cxCameraCancelBtn">취소</button>
          <button type="button" class="cx-btn cx-btn--accent" id="cxCameraShutterBtn">📷 촬영</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const video = document.getElementById("cxCameraVideo");
    if (video) {
      video.srcObject = stream;
      try { await video.play(); } catch (_) {}
    }

    const cancel = document.getElementById("cxCameraCancelBtn");
    if (cancel) {
      cancel.onclick = () => {
        playClick();
        stopCameraCapture();
      };
    }
    const shutter = document.getElementById("cxCameraShutterBtn");
    if (shutter) {
      shutter.onclick = () => {
        playClick();
        const v = document.getElementById("cxCameraVideo");
        if (!v || !v.videoWidth) return;
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        let dataUrl = "";
        try { dataUrl = canvas.toDataURL("image/jpeg", 0.92); } catch (_) { dataUrl = ""; }
        stopCameraCapture();
        if (!dataUrl) return;
        compressImage(dataUrl).then((src) => {
          _ui.photoDraft = src;
          paint();
        });
      };
    }
  }

  function bind() {
    const upload = document.getElementById("cxUploadBtn");
    const fab = document.getElementById("cxFabBtn");
    [upload, fab].forEach((btn) => {
      if (btn) btn.onclick = () => { playClick(); goCompose(); };
    });
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        _ui.filter = btn.getAttribute("data-filter") || "all";
        paint();
      };
    });
    document.querySelectorAll("[data-work-id]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        goDetail(btn.getAttribute("data-work-id"));
      };
    });
    document.querySelectorAll("[data-like-id]").forEach((btn) => {
      btn.onclick = (event) => {
        event.stopPropagation();
        toggleLike(btn.getAttribute("data-like-id"));
      };
    });
    document.querySelectorAll("[data-open-comment]").forEach((btn) => {
      btn.onclick = (event) => {
        event.stopPropagation();
        playClick();
        const id = btn.getAttribute("data-open-comment") || "";
        _ui.quickCommentId = _ui.quickCommentId === id ? "" : id;
        _ui.commentDraft = "";
        paint();
        const input = document.getElementById("cxQuickCommentInput");
        if (input) input.focus();
      };
    });
    document.querySelectorAll("[data-activity]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        _ui.activityId = btn.getAttribute("data-activity") || activities()[0]?.id || "";
        paint();
      };
    });
    document.querySelectorAll("[data-caption]").forEach((btn) => {
      btn.onclick = () => {
        playClick();
        _ui.caption = btn.getAttribute("data-caption") || "";
        const input = document.getElementById("cxCaptionInput");
        if (input) input.value = _ui.caption;
      };
    });
    const caption = document.getElementById("cxCaptionInput");
    if (caption) caption.oninput = () => { _ui.caption = caption.value; };
    const cameraBtn = document.getElementById("cxCameraBtn");
    const albumBtn = document.getElementById("cxAlbumBtn");
    const cameraInput = document.getElementById("cxCameraInput");
    const albumInput = document.getElementById("cxAlbumInput");
    if (cameraBtn) {
      cameraBtn.onclick = () => {
        playClick();
        openCameraCapture();
      };
    }
    if (cameraInput) {
      cameraInput.onchange = () => readFile(cameraInput);
    }
    if (albumBtn && albumInput) {
      albumBtn.onclick = () => { playClick(); try { albumInput.value = ""; } catch (_) {} albumInput.click(); };
      albumInput.onchange = () => readFile(albumInput);
    }
    const post = document.getElementById("cxPostBtn");
    if (post) post.onclick = () => postWork();
    const del = document.getElementById("cxDeleteBtn");
    if (del) del.onclick = () => deleteCurrent();
    const commentInput = document.getElementById("cxCommentInput") || document.getElementById("cxQuickCommentInput");
    if (commentInput) commentInput.oninput = () => { _ui.commentDraft = commentInput.value; };
    const submitComment = (workId, text) => {
      const input = document.getElementById("cxCommentInput") || document.getElementById("cxQuickCommentInput");
      addComment(workId, text || (input && input.value) || _ui.commentDraft);
    };
    document.querySelectorAll("[data-comment]").forEach((btn) => {
      btn.onclick = () => {
        const workId = document.getElementById("cxCommentBtn")?.getAttribute("data-comment-work") || _ui.workId;
        submitComment(workId, btn.getAttribute("data-comment") || "");
      };
    });
    document.querySelectorAll("[data-quick-comment]").forEach((btn) => {
      btn.onclick = () => {
        submitComment(_ui.quickCommentId, btn.getAttribute("data-quick-comment") || "");
      };
    });
    const commentBtn = document.getElementById("cxCommentBtn");
    if (commentBtn) commentBtn.onclick = () => submitComment(commentBtn.getAttribute("data-comment-work"));
    const quickBtn = document.getElementById("cxQuickCommentBtn");
    if (quickBtn) quickBtn.onclick = () => submitComment(quickBtn.getAttribute("data-comment-work"));
  }

  async function postWork() {
    if (_ui.busy || !_ui.photoDraft) return;
    playClick();
    _ui.busy = true;
    const me = user();
    const work = {
      id: `${classKey()}_${myId()}_${Date.now()}`,
      classKey: classKey(),
      accountId: myId(),
      name: myName(),
      number: me.number || "",
      activityId: _ui.activityId || "classroom",
      caption: String(_ui.caption || "").trim().slice(0, MAX_CAPTION),
      photoUrl: _ui.photoDraft,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    await upsertWork(work);
    _ui.busy = false;
    goDetail(work.id);
  }

  async function toggleLike(workId) {
    const work = findWork(workId || _ui.workId);
    if (!work || _ui.busy) return;
    playClick();
    const id = myId();
    const likedBy = Array.isArray(work.likedBy) ? work.likedBy.slice() : [];
    const has = likedBy.includes(id);
    const next = {
      ...work,
      likedBy: has ? likedBy.filter((item) => item !== id) : likedBy.concat([id])
    };
    next.likes = next.likedBy.length;
    _ui.busy = true;
    await upsertWork(next);
    _ui.busy = false;
    paint();
  }

  async function addComment(workId, text) {
    const work = findWork(workId || _ui.workId);
    const value = String(text || "").trim().slice(0, MAX_COMMENT);
    if (!work || !value || _ui.busy) return;
    playClick();
    const comments = Array.isArray(work.comments) ? work.comments.slice() : [];
    comments.push({
      id: `${Date.now()}`,
      accountId: myId(),
      name: myName(),
      text: value,
      createdAt: new Date().toISOString()
    });
    if (comments.length > MAX_COMMENTS) comments.splice(0, comments.length - MAX_COMMENTS);
    _ui.busy = true;
    await upsertWork({ ...work, comments });
    _ui.commentDraft = "";
    _ui.busy = false;
    paint();
  }

  async function deleteCurrent() {
    const work = currentWork();
    if (!work || !canDelete(work) || _ui.busy) return;
    playClick();
    _ui.busy = true;
    await removeWork(work.id);
    _ui.busy = false;
    goBoard();
  }

  function reviewDemoCatalogs() {
    return [
      {
        activityId: "stage1_a1",
        caption: "태극기를 만들었어요.",
        files: ["taegeukgi-01.jpg", "taegeukgi-02.jpg", "taegeukgi-03.jpg"]
      },
      {
        activityId: "stage1_a2",
        caption: "클레이로 무궁화를 만들었어요.",
        files: [
          "mugunghwa-01.jpg", "mugunghwa-02.jpg", "mugunghwa-03.jpg", "mugunghwa-04.jpg", "mugunghwa-05.jpg",
          "mugunghwa-06.jpg", "mugunghwa-07.jpg", "mugunghwa-08.jpg", "mugunghwa-09.jpg", "mugunghwa-10.jpg"
        ]
      },
      {
        activityId: "stage1_a4",
        caption: "화폐를 디자인해 봤어요.",
        files: ["money-01.jpg", "money-02.jpg", "money-03.jpg", "money-04.jpg", "money-05.jpg"]
      },
      {
        activityId: "stage2_a3",
        caption: "전통 문양 노리개를 만들었어요.",
        files: ["norigae-01.jpg", "norigae-02.jpg", "norigae-03.jpg", "norigae-04.jpg", "norigae-05.jpg"]
      },
      {
        activityId: "stage3_a1",
        caption: "한복을 접어 만들었어요.",
        files: ["hanbok-01.jpg", "hanbok-02.jpg", "hanbok-03.jpg", "hanbok-04.jpg", "hanbok-05.jpg"]
      },
      {
        activityId: "stage3_a3",
        caption: "명절 음식을 만들었어요.",
        files: [
          "holiday-01.jpg", "holiday-02.jpg", "holiday-03.jpg", "holiday-04.jpg", "holiday-05.jpg",
          "holiday-06.jpg", "holiday-07.jpg", "holiday-08.jpg", "holiday-09.jpg", "holiday-10.jpg"
        ]
      },
      {
        activityId: "stage4_a4",
        caption: "탈을 만들었어요.",
        files: [
          "mask-01.jpg", "mask-02.jpg", "mask-03.jpg", "mask-04.jpg", "mask-05.jpg",
          "mask-06.jpg", "mask-07.jpg", "mask-08.jpg", "mask-09.jpg"
        ]
      }
    ];
  }

  function expectedReviewSeedIds(key) {
    const ids = new Set();
    reviewDemoCatalogs().forEach((cat) => {
      cat.files.forEach((_, fileIdx) => {
        ids.add(`review_${key}_${cat.activityId}_${fileIdx + 1}`);
      });
    });
    return ids;
  }

  function purgeObsoleteReviewSeeds(key, keepIds) {
    const keep = keepIds instanceof Set ? keepIds : new Set(keepIds || []);
    // 예전 형식(사진 없는 초기 3건 등) 명시 삭제
    ["REVIEW_01", "REVIEW_02", "REVIEW_03"].forEach((suffix) => keep.delete(`review_${key}_${suffix}`));
    const existing = loadLocal();
    const orphans = existing.filter((item) =>
      item && item.classKey === key && item.isReviewSeed && item.id && !keep.has(item.id)
    );
    const legacyIds = ["REVIEW_01", "REVIEW_02", "REVIEW_03"].map((suffix) => `review_${key}_${suffix}`);
    legacyIds.forEach((id) => {
      if (!orphans.some((item) => item.id === id)) orphans.push({ id, classKey: key, isReviewSeed: true });
    });
    if (!orphans.length) return;
    const orphanIds = new Set(orphans.map((item) => item.id));
    saveLocal(existing.filter((item) => !orphanIds.has(item.id)));
    if (_appEl && classKey() === key) {
      _works = (_works || []).filter((item) => !orphanIds.has(item.id));
    }
    const fire = db();
    if (fire) {
      orphanIds.forEach((id) => {
        fire.collection(COLLECTION).doc(id).delete().catch(() => {});
      });
    }
  }

  function seedReviewDemo(key, specs, seedVersion) {
    if (!key || !Array.isArray(specs) || !specs.length) return;
    const version = Number(seedVersion) || 1;
    const keepIds = expectedReviewSeedIds(key);
    purgeObsoleteReviewSeeds(key, keepIds);

    const existing = loadLocal();
    const already = existing.some((item) =>
      item.classKey === key && item.isReviewSeed && Number(item.seedVersion) === version
    );
    if (already) return;

    const now = Date.now();
    const starters = STARTERS.slice();
    const catalogs = reviewDemoCatalogs();

    const roster = specs.slice().sort((a, b) => Number(a.number) - Number(b.number));
    const seeds = [];
    let seq = 0;
    catalogs.forEach((cat) => {
      cat.files.forEach((file, fileIdx) => {
        const student = roster[seq % roster.length] || {};
        const accountId = student.accountId || `REVIEW_${String(student.number || 1).padStart(2, "0")}`;
        const peerA = roster[(seq + 1) % roster.length];
        const peerB = roster[(seq + 2) % roster.length];
        const likeCount = 1 + (seq % 4);
        const likedBy = [];
        if (peerA?.accountId) likedBy.push(peerA.accountId);
        if (likeCount >= 2 && peerB?.accountId) likedBy.push(peerB.accountId);
        if (likeCount >= 3) likedBy.push(`teacher_${key}`);
        const comments = [];
        if (seq % 3 === 0 && peerA) {
          comments.push({
            id: `c_${seq}_1`,
            accountId: peerA.accountId,
            name: peerA.name || "친구",
            text: starters[seq % starters.length],
            createdAt: new Date(now - (seq + 1) * 900000).toISOString()
          });
        }
        if (seq % 5 === 0 && peerB) {
          comments.push({
            id: `c_${seq}_2`,
            accountId: peerB.accountId,
            name: peerB.name || "친구",
            text: starters[(seq + 2) % starters.length],
            createdAt: new Date(now - (seq + 1) * 600000).toISOString()
          });
        }
        seeds.push({
          id: `review_${key}_${cat.activityId}_${fileIdx + 1}`,
          classKey: key,
          accountId,
          name: student.name || "",
          number: Number(student.number) || 0,
          activityId: cat.activityId,
          caption: cat.caption,
          photoUrl: (typeof assetUrl === "function"
            ? assetUrl(`assets/review-demo/works/${file}`)
            : String(`assets/review-demo/works/${file}`).replace(/\.(png|jpe?g)(\?[^#]*)?$/i, ".webp$2")),
          likes: likedBy.length,
          likedBy,
          comments,
          createdAt: new Date(now - (seq + 1) * 480000).toISOString(),
          isReviewSeed: true,
          seedVersion: version
        });
        seq += 1;
      });
    });

    const kept = existing.filter((item) => !(item.classKey === key && item.isReviewSeed));
    saveLocal(kept.concat(seeds));
    if (_appEl && classKey() === key) _works = classWorks(loadLocal());

    const fire = db();
    if (fire) {
      // 새 시드만 merge — 예전 시드는 purgeObsoleteReviewSeeds에서 삭제
      seeds.forEach((work) => {
        fire.collection(COLLECTION).doc(work.id).set(work, { merge: true }).catch(() => {});
      });
    }
  }

  window.ClassroomExtension = {
    render(app, ctx) {
      _ctx = ctx || null;
      _appEl = app;
      _ui.view = "board";
      _ui.workId = "";
      _ui.photoDraft = "";
      _ui.commentDraft = "";
      _ui.quickCommentId = "";
      startSync();
      if (!_works.length) _works = classWorks(loadLocal());
      paint();
    },
    stop() {
      stopCameraCapture();
      stopSync();
      _appEl = null;
    },
    isBoardView() {
      return _ui.view === "board";
    },
    goBoardView() {
      if (!_appEl) return false;
      if (_ui.view === "board") return false;
      goBoard();
      return true;
    },
    seedReviewDemo
  };
})();
