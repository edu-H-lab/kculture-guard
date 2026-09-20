/**
 * K-culture 수호대 Firebase 연동 모듈
 * firebase-config.js(HANOK_FIREBASE_CONFIG) 설정을 사용합니다.
 */
(function () {
  const CLASSROOMS = "kculture_classrooms";
  const PRESENCE = "kculture_presence";
  const YUT_ROOMS = "kculture_yut_rooms";

  let _db = null;
  let _fbReady = false;
  let _fbTried = false;

  function init() {
    if (_fbTried) return _fbReady;
    _fbTried = true;
    try {
      const cfg = window.HANOK_FIREBASE_CONFIG;
      const hasConfig = cfg && cfg.apiKey && cfg.projectId;
      const hasSdk = window.firebase && typeof window.firebase.initializeApp === "function";
      if (!hasConfig || !hasSdk) {
        _fbReady = false;
        return false;
      }
      const app = window.firebase.apps && window.firebase.apps.length
        ? window.firebase.app()
        : window.firebase.initializeApp(cfg);
      _db = window.firebase.firestore(app);
      _fbReady = true;
    } catch (err) {
      console.warn("[???] Firebase ??? ?? � ???? ??? ?????.", err);
      _db = null;
      _fbReady = false;
    }
    return _fbReady;
  }

  function isReady() {
    return init();
  }

  function normalizeClassroomRecord(classKey, classroom) {
    // 학교이름·학년·반은 저장하지 않아요. 학급은 랜덤 학급코드(classKey)로만 구분돼요.
    const resolvedKey = String(classKey || classroom.classKey || classroom.classCode || "").trim();
    const students = (Array.isArray(classroom.students) ? classroom.students : [])
      .filter((student) => student?.accountId && student?.name)
      .map((student) => ({
        number: parseInt(String(student.number ?? "").replace(/\D/g, ""), 10) || 0,
        name: String(student.name).trim(),
        accountId: String(student.accountId).trim()
      }));
    const registeredAccountIds = {};
    students.forEach((student) => {
      registeredAccountIds[student.accountId] = true;
    });
    const out = {
      classKey: resolvedKey,
      classCode: resolvedKey,
      students,
      registeredAccountIds,
      updatedAt: classroom.updatedAt || new Date().toISOString()
    };
    // 교사가 정한 활동 열기 설정 (없으면 예전 학급 → 모두 열림)
    if (classroom.activityAccess && typeof classroom.activityAccess === "object") {
      out.activityAccess = cleanAccess(classroom.activityAccess);
    }
    return out;
  }

  function cleanAccess(raw) {
    const out = {};
    Object.keys(raw || {}).forEach((route) => {
      if (/^stage\d+_a\d+$/.test(route)) out[route] = raw[route] === true;
    });
    return out;
  }

  async function saveClassroom(classroom) {
    if (!init()) return false;
    const classKey = String(classroom.classKey || classroom.classCode || "").trim();
    if (!classKey) {
      console.warn("[수호대] 학급 저장 실패: classKey(학급코드) 없음");
      return false;
    }
    const payload = normalizeClassroomRecord(classKey, classroom);
    try {
      const ref = _db.collection(CLASSROOMS).doc(classKey);
      if (!payload.activityAccess) {
        // 활동 열기 설정은 교사가 따로 저장한다. 다른 저장(학생 등록 등)이 지우지 않게 기존 값을 잇고,
        // 처음 만드는 학급은 모든 활동을 잠근 상태로 시작한다.
        let existing = null;
        try {
          const snap = await ref.get();
          existing = snap.exists ? snap.data() : null;
        } catch (_) {}
        if (existing && existing.activityAccess) payload.activityAccess = cleanAccess(existing.activityAccess);
        else if (!existing) payload.activityAccess = {};
      }
      await ref.set(payload);
      return true;
    } catch (err) {
      console.warn("[수호대] 학급 저장 실패:", err);
      console.warn("[수호대] 저장 시도 데이터:", payload);
      console.warn("[수호대] Firebase 콘솔 → Firestore → 규칙 탭에서 firestore.rules 내용을 붙여넣고 '게시'했는지 확인하세요.");
      throw err;
    }
  }

  async function getClassroom(classKey) {
    try {
      if (!init()) return null;
      const snap = await _db.collection(CLASSROOMS).doc(classKey).get();
      if (!snap.exists) return null;
      return { ...snap.data(), classKey: snap.id };
    } catch (err) {
      console.warn("[수호대] 학급 조회 실패:", err);
      return null;
    }
  }

  async function saveStudentProgress(classKey, accountId, payload) {
    try {
      if (!init()) return false;
      await _db.collection(CLASSROOMS).doc(classKey)
        .collection("progress").doc(accountId)
        .set(payload, { merge: true });
      return true;
    } catch (err) {
      console.warn("[수호대] 진행 저장 실패:", err);
      return false;
    }
  }

  async function loadStudentProgress(classKey, accountId) {
    try {
      if (!init()) return null;
      const snap = await _db.collection(CLASSROOMS).doc(classKey)
        .collection("progress").doc(accountId).get();
      return snap.exists ? snap.data() : null;
    } catch (err) {
      console.warn("[수호대] 진행 조회 실패:", err);
      console.warn("[수호대] 학급키:", classKey, "계정:", accountId);
      return null;
    }
  }

  async function getClassProgressMap(classKey) {
    if (!init()) return {};
    try {
      const result = {};
      const snap = await _db.collection(CLASSROOMS).doc(classKey).collection("progress").get();
      snap.forEach((doc) => {
        result[doc.id] = doc.data();
      });
      return result;
    } catch (err) {
      console.warn("[수호대] 학급 진행 일괄 조회 실패:", err);
      console.warn("[수호대] Firebase 콘솔 → Firestore → 규칙에서 progress 읽기 규칙(classroomExists)을 게시했는지 확인하세요.");
      throw err;
    }
  }

  function subscribeClassProgress(classKey, onChange) {
    if (!init()) {
      onChange({});
      return () => {};
    }
    return _db.collection(CLASSROOMS).doc(classKey).collection("progress").onSnapshot(
      (snap) => {
        const result = {};
        snap.forEach((doc) => {
          result[doc.id] = doc.data();
        });
        onChange(result);
      },
      (err) => {
        console.warn("[수호대] 학급 진행 구독 실패:", err);
        onChange({});
      }
    );
  }

  async function upsertClassroom(classKey, payload) {
    if (!init()) return false;
    const ref = _db.collection(CLASSROOMS).doc(classKey);
    const snap = await ref.get();
    const merged = normalizeClassroomRecord(classKey, {
      ...(snap.exists ? snap.data() : {}),
      ...payload,
      classKey
    });
    await ref.set(merged);
    return true;
  }

  async function deleteStudent(classKey, accountId) {
    if (!init()) return false;
    const classRef = _db.collection(CLASSROOMS).doc(classKey);
    const snap = await classRef.get();
    if (!snap.exists) return false;
    const classroom = snap.data() || {};
    const nextStudents = (classroom.students || []).filter((student) => student.accountId !== accountId);
    const payload = normalizeClassroomRecord(classKey, {
      ...classroom,
      students: nextStudents,
      updatedAt: new Date().toISOString()
    });
    await classRef.set(payload);
    await classRef.collection("progress").doc(accountId).delete().catch(() => {});
    await _db.collection(PRESENCE).doc(`${classKey}_${accountId}`).delete().catch(() => {});
    return true;
  }

  async function deleteClassroom(classKey) {
    if (!init()) return false;
    const classRef = _db.collection(CLASSROOMS).doc(classKey);
    const progressSnap = await classRef.collection("progress").get();
    await Promise.all(progressSnap.docs.map((doc) => doc.ref.delete().catch(() => {})));
    const presenceSnap = await _db.collection(PRESENCE).where("classKey", "==", classKey).get();
    await Promise.all(presenceSnap.docs.map((doc) => doc.ref.delete().catch(() => {})));
    await classRef.delete();
    return true;
  }

  async function setPresence(classKey, accountId, profile) {
    if (!init()) return false;
    try {
      await _db.collection(PRESENCE).doc(`${classKey}_${accountId}`).set({
        classKey,
        accountId,
        name: profile.name || "",
        lastSeen: window.firebase.firestore.FieldValue.serverTimestamp(),
        lastSeenClientAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn("[수호대] 접속 상태 저장 실패:", err);
      console.warn("[수호대] 접속 저장 시도:", { classKey, accountId });
      return false;
    }
  }

  async function clearPresence(classKey, accountId) {
    if (!init()) return;
    try {
      await _db.collection(PRESENCE).doc(`${classKey}_${accountId}`).delete();
    } catch (_) {}
  }

  function subscribeClassPresence(classKey, onChange) {
    if (!init()) {
      onChange([]);
      return () => {};
    }
    return _db.collection(PRESENCE).where("classKey", "==", classKey).onSnapshot(
      (snap) => {
        const now = Date.now();
        const online = [];
        snap.forEach((doc) => {
          const data = doc.data();
          const lastServer = data.lastSeen?.toMillis?.() || 0;
          const lastClient = data.lastSeenClientAt ? Date.parse(data.lastSeenClientAt) : 0;
          const last = Number.isFinite(lastServer) && lastServer > 0 ? lastServer : (Number.isFinite(lastClient) ? lastClient : 0);
          if (now - last < 120000) online.push(data);
        });
        onChange(online);
      },
      (err) => {
        console.warn("[수호대] 접속 현황 구독 실패:", err);
        onChange([]);
      }
    );
  }

  function subscribeClassroom(classKey, onChange) {
    if (!init()) {
      onChange(null);
      return () => {};
    }
    return _db.collection(CLASSROOMS).doc(classKey).onSnapshot(
      (snap) => onChange(snap.exists ? { ...snap.data(), classKey: snap.id } : null),
      (err) => {
        console.warn("[수호대] 학급 정보 구독 실패:", err);
        onChange(null);
      }
    );
  }

  async function upsertYutRoom(roomId, payload) {
    if (!init()) return false;
    await _db.collection(YUT_ROOMS).doc(roomId).set(payload, { merge: true });
    return true;
  }

  /** merge 없이 필드를 통째로 바꿔, 빈 firstRolls 같은 값이 실제로 지워지게 함 */
  async function runYutRoomTransaction(roomId, mutator) {
    if (!init()) return null;
    const ref = _db.collection(YUT_ROOMS).doc(roomId);
    return _db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return null;
      const room = { id: snap.id, ...snap.data() };
      const patch = mutator(room);
      if (!patch || typeof patch !== "object") return room;
      tx.update(ref, patch);
      return { ...room, ...patch };
    });
  }

  async function createYutRoom(payload) {
    if (!init()) return null;
    const ref = _db.collection(YUT_ROOMS).doc();
    await ref.set({
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
      updatedAt: payload.updatedAt || new Date().toISOString()
    });
    return ref.id;
  }

  async function getClassPresence(classKey) {
    if (!init()) return [];
    const snap = await _db.collection(PRESENCE).where("classKey", "==", classKey).get();
    const now = Date.now();
    const online = [];
    snap.forEach((doc) => {
      const data = doc.data() || {};
      const lastServer = data.lastSeen?.toMillis?.() || 0;
      const lastClient = data.lastSeenClientAt ? Date.parse(data.lastSeenClientAt) : 0;
      const last = Number.isFinite(lastServer) && lastServer > 0
        ? lastServer
        : (Number.isFinite(lastClient) ? lastClient : 0);
      if (now - last < 120000) online.push(data);
    });
    return online;
  }

  async function listJoinableYutRooms(classKey) {
    if (!init()) return [];
    const snap = await _db.collection(YUT_ROOMS)
      .where("classKey", "==", classKey)
      .get();
    const rooms = [];
    snap.forEach((doc) => {
      const data = doc.data() || {};
      // 종료된 방(closed / over)은 목록에서 제외
      if (data.status === "closed" || data.phase === "over") return;
      if (data.status !== "waiting" && data.status !== "playing" && data.status !== "token_pick") return;
      const players = Array.isArray(data.players) ? data.players : [];
      if (!players.length) return;
      rooms.push({ id: doc.id, ...data });
    });
    return rooms;
  }

  /** 접속 중이 아닌 플레이어를 방에서 제거하고, 빈 방/중단된 진행 방은 종료 처리 */
  async function pruneYutRoomsByPresence(classKey, onlineAccountIds) {
    if (!init()) return [];
    const onlineSet = new Set(onlineAccountIds || []);
    let rooms = [];
    try {
      rooms = await listJoinableYutRooms(classKey);
    } catch (err) {
      console.warn("[수호대] 윷놀이 방 목록 조회 실패:", err);
      return [];
    }
    const visible = [];
    await Promise.all(rooms.map(async (room) => {
      try {
        const players = Array.isArray(room.players) ? room.players : [];
        const onlinePlayers = players.filter((p) => onlineSet.has(p.accountId));
        const hostStillOnline = onlinePlayers.some((p) => p.accountId === room.hostAccountId);
        // Firestore 규칙상 hostAccountId는 5자리 계정이어야 하므로 빈 문자열로 쓰지 않음
        const hostAccountId = hostStillOnline
          ? room.hostAccountId
          : (onlinePlayers[0]?.accountId || room.hostAccountId || "");

        // 접속 중인 사람이 없으면 종료된 방으로 처리 (목록에는 안 보임)
        if (!onlinePlayers.length) {
          if (hostAccountId && /^\d{5}$/.test(String(hostAccountId))) {
            await upsertYutRoom(room.id, {
              players: [],
              hostAccountId,
              status: "closed",
              phase: "over",
              updatedAt: new Date().toISOString()
            }).catch(() => {});
          }
          return;
        }

        const wasPlaying = room.status === "playing" || room.status === "token_pick";
        // 진행 중 누군가가 나갔으면(접속 끊김) 게임 종료로 간주
        if (wasPlaying && onlinePlayers.length < players.length) {
          await upsertYutRoom(room.id, {
            players: onlinePlayers,
            hostAccountId,
            status: "closed",
            phase: "over",
            updatedAt: new Date().toISOString()
          }).catch(() => {});
          return;
        }

        if (onlinePlayers.length !== players.length || hostAccountId !== room.hostAccountId) {
          const payload = {
            players: onlinePlayers,
            hostAccountId,
            updatedAt: new Date().toISOString()
          };
          if (room.status === "waiting") {
            const nextPick = onlinePlayers.findIndex((p) => ![1, 2, 3].includes(Number(p.tokenId)));
            payload.phase = nextPick < 0 ? "lobby" : "token_pick_turn";
            payload.tokenPickIndex = nextPick < 0 ? 0 : nextPick;
          }
          await upsertYutRoom(room.id, payload).catch(() => {});
        }

        visible.push({
          ...room,
          players: onlinePlayers,
          hostAccountId
        });
      } catch (err) {
        console.warn("[수호대] 윷놀이 방 정리 실패:", room?.id, err);
      }
    }));
    return visible;
  }

  async function getYutRoom(roomId) {
    if (!init()) return null;
    const snap = await _db.collection(YUT_ROOMS).doc(roomId).get();
    if (!snap.exists) return null;
    return { id: roomId, ...snap.data() };
  }

  function subscribeYutRoom(roomId, onChange) {
    if (!init()) {
      onChange(null);
      return () => {};
    }
    return _db.collection(YUT_ROOMS).doc(roomId).onSnapshot(
      (snap) => onChange(snap.exists ? { id: roomId, ...snap.data() } : null),
      () => onChange(null)
    );
  }

  async function removeYutPlayer(roomId, accountId) {
    if (!init()) return false;
    const ref = _db.collection(YUT_ROOMS).doc(roomId);
    const snap = await ref.get();
    if (!snap.exists) return false;
    const data = snap.data() || {};
    const players = (data.players || []).filter((p) => p.accountId !== accountId);
    const hostAccountId = data.hostAccountId === accountId
      ? (players[0]?.accountId || data.hostAccountId || "")
      : (data.hostAccountId || "");
    const status = players.length ? (data.status || "waiting") : "closed";
    let phase = players.length ? (data.phase || "lobby") : "over";
    let tokenPickIndex = data.tokenPickIndex || 0;
    if (players.length && data.status === "waiting") {
      const nextPick = players.findIndex((p) => ![1, 2, 3].includes(Number(p.tokenId)));
      phase = nextPick < 0 ? "lobby" : "token_pick_turn";
      tokenPickIndex = nextPick < 0 ? 0 : nextPick;
    }
    const nextTurn = Math.min(data.turnIndex || 0, Math.max(players.length - 1, 0));
    await ref.set({
      players,
      hostAccountId,
      status,
      phase,
      tokenPickIndex,
      turnIndex: nextTurn,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  }

  /** 교사: 학급 전체 활동 열기 설정 저장 */
  async function setActivityAccess(classKey, access) {
    try {
      if (!init() || !classKey) return false;
      await _db.collection(CLASSROOMS).doc(classKey).set({
        activityAccess: cleanAccess(access),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("[수호대] 활동 열기 저장 실패:", err);
      return false;
    }
  }

  // ---- 교사용 AI 분석 결과 (kculture_classrooms/{classKey}/analyses/{activity}) ----
  function analysisDocId(activity) {
    return String(activity || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  }

  async function saveAnalysis(classKey, activity, doc) {
    try {
      if (!init() || !classKey || !analysisDocId(activity)) return false;
      await _db.collection(CLASSROOMS).doc(classKey)
        .collection("analyses").doc(analysisDocId(activity))
        .set(JSON.parse(JSON.stringify(doc)));
      return true;
    } catch (err) {
      console.warn("[수호대] 교사용 분석 저장 실패 (Firestore 규칙에 analyses 가 게시됐는지 확인하세요):", err);
      return false;
    }
  }

  async function loadAnalysis(classKey, activity) {
    try {
      if (!init() || !classKey || !analysisDocId(activity)) return null;
      const snap = await _db.collection(CLASSROOMS).doc(classKey)
        .collection("analyses").doc(analysisDocId(activity)).get();
      return snap.exists ? snap.data() : null;
    } catch (err) {
      console.warn("[수호대] 교사용 분석 불러오기 실패:", err);
      return null;
    }
  }

  async function listAnalyses(classKey) {
    try {
      if (!init() || !classKey) return {};
      const snap = await _db.collection(CLASSROOMS).doc(classKey).collection("analyses").get();
      const out = {};
      snap.forEach((d) => { out[d.id] = d.data(); });
      return out;
    } catch (err) {
      console.warn("[수호대] 교사용 분석 목록 실패:", err);
      return {};
    }
  }

  window.KCultureFirebase = {
    setActivityAccess,
    saveAnalysis,
    loadAnalysis,
    listAnalyses,
    init,
    isReady,
    saveClassroom,
    getClassroom,
    saveStudentProgress,
    loadStudentProgress,
    getClassProgressMap,
    subscribeClassProgress,
    upsertClassroom,
    deleteStudent,
    deleteClassroom,
    setPresence,
    clearPresence,
    getClassPresence,
    subscribeClassPresence,
    subscribeClassroom,
    upsertYutRoom,
    runYutRoomTransaction,
    createYutRoom,
    listJoinableYutRooms,
    pruneYutRoomsByPresence,
    getYutRoom,
    subscribeYutRoom,
    removeYutPlayer
  };
})();
