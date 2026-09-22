const toAsset = (path) => (typeof assetUrl === "function"
  ? assetUrl(path)
  : String(path || "").replace(/\.(png|jpe?g)(\?[^#]*)?$/i, ".webp$2"));
const IMG = (name) => toAsset(`assets/images/${name}`);
const BIBIMBAP_IMG = (name) => toAsset(`assets/images/bibimbap/${name}`);
const HOLIDAY_IMG = (name) => toAsset(`assets/images/holiday/${name}?v=2`);

/** 돌솥 위 레이어 쌓임 순서 (아래 → 위). 밥이 가장 아래, 고추장이 가장 위 */
const BIBIMBAP_LAYER_ORDER = [
  "rice", "carrot", "fern", "radish",
  "bean-sprout", "beef", "zucchini", "egg", "sesame-oil", "gochujang"
];
const BIBIMBAP_LAYER_FILES = {
  rice: "layer-rice.png",
  carrot: "layer-carrot.png",
  zucchini: "layer-zucchini.png",
  fern: "layer-fern.png",
  radish: "layer-radish.png",
  "bean-sprout": "layer-beansprout.png",
  beef: "layer-beef.png",
  egg: "layer-egg.png",
  "sesame-oil": "layer-sesame.png",
  gochujang: "layer-gochujang.png"
};
const HANBOK_IMG = (name) => toAsset(`assets/images/hanbok/${name}`);
const STAGE_IMG = (stageNum, file) => toAsset(`assets/images/stage${stageNum}/${file}?v=rev316`);
const YUT_IMG = (name) => toAsset(`assets/images/yut/${name}`);
const TG_IMG = (name) => toAsset(`assets/images/taegukgi/${name}`);
const MONEY_IMG = (name) => toAsset(`assets/images/money/화폐/${name}`);
const MONEY_POP_IMG = (name) => toAsset(`assets/images/money/${encodeURIComponent(name)}`);
const MUGU_IMG = (name) => toAsset(`assets/images/mugunghwa/${encodeURIComponent(name)}`);
const MUGU_PART_IMG = (name) => toAsset(`assets/images/mugunghwa/parts/${encodeURIComponent(name)}`);
const CHAR_IMG = (name) => toAsset(`assets/images/character/${name}`);
const ANTHEM_IMG = (name) => toAsset(`assets/images/anthem/${name}`);
const DANCHEONG_IMG = (name) => toAsset(`assets/images/dancheong/${name}`);
const SND = (name) => `assets/sounds/${name}`;
const INTRO_VIDEO = "assets/videos/intro/intro2.mp4";
const HANGUL_ORIGIN_VIDEO = "assets/videos/hangul/hangul-origin.mp4";
const DDAKJI_VIDEO = (file) => `assets/images/ddakji/${encodeURIComponent(file)}`;
const TREASURE_IMG = (name) => toAsset(`assets/images/treasures/${name}`);

/** 멀티미디어_교육자료_목록.xlsx 비고(출처 등). 확보 사진만 표시하고 개발 자료는 넣지 않음. */
const PHOTO_SOURCE = {
  "달밤에 핀 매화(e뮤지엄, 공공누리1유형).jpg": "출처(e뮤지엄)",
  "묵포도도(간송미술문화재단).jpeg": "출처(간송미술문화재단)",
  "초충도병풍-한국민족문화대백과,공공누리1유형.jpg": "출처(한국민족문화대백과)",
  "수박과여치-한국민족문화대백과,공공누리1유형.jpg": "출처(한국민족문화대백과)",
  "맨드라미와개구리-한국민족문화대백과,공공누리1유형.jpg": "출처(한국민족문화대백과)",
  "오죽헌(e뮤지엄, 공공누리 4유형).jpg": "출처(e뮤지엄)",
  "천상열차분야지도 (e뮤지엄, 공공누리1유형).jpg": "출처(e뮤지엄)",
  "풍죽도-위키디피아 커먼즈,퍼블릭도메인.jpg": "출처(위키미디어 커먼즈)",
  "혼천의(e뮤지엄,공공누리1유형).jpg": "출처(e뮤지엄)",
  "서울 문묘 명륜당(국가유산포털,공공누리open).jpg": "출처(국가유산포털)",
  "용비어천가 권8의 권수(국가유산포털).jpg": "출처(국가유산포털)",
  "보현산천문대망원경(한국향토문화대전).jpeg": "출처(한국향토문화대전)",
  "1000.jpg": "출처(한국은행 화폐박물관)",
  "1000_back.jpg": "출처(한국은행 화폐박물관)",
  "1000p.png": "출처(한국은행 화폐박물관)",
  "10000.jpg": "출처(한국은행 화폐박물관)",
  "10000_back.jpg": "출처(한국은행 화폐박물관)",
  "10000p.png": "출처(한국은행 화폐박물관)",
  "5000.jpg": "출처(한국은행 화폐박물관)",
  "5000_back.jpg": "출처(한국은행 화폐박물관)",
  "5000p.png": "출처(한국은행 화폐박물관)",
  "50000.jpg": "출처(한국은행 화폐박물관)",
  "50000_back.jpg": "출처(한국은행 화폐박물관)",
  "50000p.png": "출처(한국은행 화폐박물관)",
  "완성.png": "출처(행정안전부)",
  "국회회의장(대한민국국회,공공누리open).JPG": "출처(대한민국국회)",
  "대한민국여권(외교부 여권 안내, 공공누리 0유형).png": "출처(외교부)",
  "법원(서울고등법원).jpeg": "출처(서울고등법원)",
  "대통령휘장-공공누리open.jpg": "출처(공공누리)",
  "백단심계1.jpg": "출처(행정안전부)",
  "백단심계3.jpg": "출처(행정안전부)",
  "홍단심계1.jpg": "출처(행정안전부)",
  "홍단심계4.jpg": "출처(행정안전부)"
};

function photoCreditHTML(file) {
  const src = PHOTO_SOURCE[file];
  if (!src) return "";
  const safe = String(src).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  return `<span class="photo-credit">${safe}</span>`;
}

/** 미션 성공 시 되찾는 국보 보물 (14종) */
const MISSION_TREASURES = {
  stage1_a1: { key: "mireuk_bodhisattva_half", name: "금동미륵보살반가사유상", image: "mireuk_bodhisattva_half.png" },
  stage1_a2: { key: "baekje_golden_incense_burner", name: "백제 금동대향로", image: "baekje_golden_incense_burner.png" },
  stage1_a3: { key: "daedongyeojido", name: "대동여지도", image: "daedongyeojido.png" },
  stage1_a4: { key: "sangpyeong_tongbo_coin", name: "상평통보 엽전", image: "sangpyeong_tongbo_coin.png" },
  stage2_a1: { key: "hunminjeongeum", name: "훈민정음 해례본", image: "hunminjeongeum.png" },
  stage2_a2: { key: "muryeong_stone_beast", name: "무령왕릉 석수(돌짐승)", image: "muryeong_stone_beast.png" },
  stage2_a3: { key: "celadon_inlaid_maebyeong", name: "상감청자 매병", image: "celadon_inlaid_maebyeong.png" },
  stage3_a1: { key: "hwangnamdaechong_gold_crown", name: "황남대총 북분 금관", image: "hwangnamdaechong_gold_crown.png" },
  stage3_a2: { key: "white_porcelain_moon_jar", name: "백자 달항아리", image: "white_porcelain_moon_jar.png" },
  stage3_a3: { key: "kim_hongdo_folk_painting_album", name: "김홍도 풍속화 화첩", image: "kim_hongdo_folk_painting_album.png" },
  stage4_a1: { key: "horse_rider_figurine", name: "기마인물형 토기", image: "horse_rider_figurine.png" },
  stage4_a2: { key: "face_pattern_roof_tiles", name: "얼굴무늬 수막새", image: "face_pattern_roof_tiles.png" },
  stage4_a3: { key: "emile_bell", name: "성덕대왕신종(에밀레종)", image: "emile_bell.png" },
  stage4_a4: { key: "hahoe_mask", name: "안동 하회탈", image: "hahoe_mask.png" }
};

function createDefaultTreasures() {
  const treasures = {};
  Object.values(MISSION_TREASURES).forEach(({ key }) => {
    treasures[key] = false;
  });
  return treasures;
}

function treasuresFromProgress(progress) {
  const treasures = createDefaultTreasures();
  if (progress?.treasures && typeof progress.treasures === "object") {
    Object.entries(progress.treasures).forEach(([key, owned]) => {
      if (key in treasures) treasures[key] = !!owned;
    });
  }
  if (progress?.completedMissions && typeof progress.completedMissions === "object") {
    Object.entries(progress.completedMissions).forEach(([route, done]) => {
      if (!done) return;
      const treasure = MISSION_TREASURES[normalizeMissionRoute(route)];
      if (treasure) treasures[treasure.key] = true;
    });
  }
  if (treasures.gyeongju_silla_sword) {
    treasures.daedongyeojido = true;
    delete treasures.gyeongju_silla_sword;
  }
  return treasures;
}

function getTreasureAlbumList(treasures = state.treasures) {
  const source = treasures || state.treasures;
  return Object.entries(MISSION_TREASURES).map(([route, treasure]) => {
    const stageMatch = route.match(/^stage(\d)/);
    const actMatch = route.match(/_a(\d)$/);
    const stageNum = stageMatch ? Number(stageMatch[1]) : 0;
    const actNum = actMatch ? Number(actMatch[1]) : 0;
    const menu = STAGE_MENUS[stageNum];
    const missionLabel = menu?.activities?.[actNum - 1]?.label || route;
    return {
      route,
      ...treasure,
      missionLabel,
      stageNum,
      acquired: !!source[treasure.key]
    };
  });
}

function countAcquiredTreasures(treasures = state.treasures) {
  return getTreasureAlbumList(treasures).filter((item) => item.acquired).length;
}

// 윷놀이 이미지 에셋 (assets/images/yut/)
const YUT_ASSETS = {
  stickFront: "stick-front.png", // 둥근 면(볼·X표식) — down일 때
  stickBack: "stick-back.png",   // 평평한 면(편) — up일 때
  mat: "mat.png",
  board: "board.png"
};
const YUT_TOKENS = {
  1: { file: "token1.png", name: "토끼" },
  2: { file: "token2.png", name: "호랑이" },
  3: { file: "token3.png", name: "곰" }
};
const YUT_DOKKAEBI_TOKEN = "token-dokkaebi.png";
function yutAssetVars() {
  const y = state.yut;
  const tokenYou = y?.tokenYou || 1;
  const map = {
    "--img-front": "stickFront", "--img-back": "stickBack", "--img-mat": "mat",
    "--img-board": "board"
  };
  const vars = Object.keys(map)
    .filter((k) => YUT_ASSETS[map[k]])
    .map((k) => `${k}:url('${YUT_IMG(YUT_ASSETS[map[k]])}')`);
  vars.push(`--img-you:url('${YUT_IMG(YUT_TOKENS[tokenYou].file)}')`);
  vars.push(`--img-ai:url('${YUT_IMG(YUT_DOKKAEBI_TOKEN)}')`);
  return vars.join(";");
}

/** 스테이지별 활동 선택 (배경 위 이미지 클릭) */
const STAGE_MENUS = {
  1: {
    title: "STAGE 1. 우리나라 상징을 찾아라!",
    help: "원하는 활동을 골라서 시작해보자!",
    activities: [
      { route: "stage1_a1", label: "태극기 세우기", image: "taegeukgi.png" },
      { route: "stage1_a2", label: "무궁화 피우기", image: "mugunghwa.png" },
      { route: "stage1_a3", label: "애국가 부르기", image: "anthem.png" },
      { route: "stage1_a4", label: "화폐 속 이야기", image: "money.png" }
    ]
  },
  2: {
    title: "STAGE 2. 한글과 한옥을 지켜라!",
    help: "원하는 활동을 골라 시작하자!",
    activities: [
      { route: "stage2_a1", label: "한글 조각 맞추기", image: "hangul.png" },
      { route: "stage2_a2", label: "한옥 세우기", image: "hanok.png" },
      { route: "stage2_a3", label: "단청 색칠하기", image: "dancheong.png" }
    ]
  },
  3: {
    title: "STAGE 3. 우리의 맛과 멋을 살려라!",
    help: "활동을 골라서 시작해보자!",
    activities: [
      { route: "stage3_a1", label: "한복 입히기", image: "hanbok.png" },
      { route: "stage3_a2", label: "비빔밥 만들기", image: "bibimbap.png" },
      { route: "stage3_a3", label: "설날과 추석", image: "holiday.png" }
    ]
  },
  4: {
    title: "STAGE 4. 전통놀이 한판승부!",
    help: "전통놀이 활동을 골라 시작해보자!",
    activities: [
      { route: "stage4_a1", label: "윷놀이", image: "yut.png" },
      { route: "stage4_a2", label: "딱지접기", image: "ddakji.png" },
      { route: "stage4_a3", label: "우리민요 얼쑤!", image: "minyo.png" },
      { route: "stage4_a4", label: "탈춤놀이", image: "talchum.png" }
    ]
  }
};

const QUESTION_IMG = (name) => toAsset(`assets/images/question/${name}?v=2`);

/** 활동 시작 직전 탐구 질문 (정답 입력 없음 — 활동 속에서 스스로 발견) */
const activityQuestions = {
  stage1_a1: { question: "우리나라 태극기는 왜 이런 무늬일까?", image: "taegeukgi.png" },
  stage1_a2: { question: "왜 무궁화가 우리나라 꽃이 되었을까?", image: "mugunghwa.png" },
  stage1_a3: { question: "왜 중요한 날에는 애국가를 함께 부를까?", image: "anthem.png" },
  stage1_a4: { question: "우리나라 화폐에는 어떤 그림이 있을까?", image: "money.png" },
  stage2_a1: { question: "한글은 누가 왜 만들었을까?", image: "hangul.png" },
  stage2_a2: { question: "한옥은 지금의 우리집과 어떻게 다를까?", image: "hanok.png" },
  stage2_a3: { question: "우리나라 문양은 어떻게 생겼을까?", image: "dancheong.png" },
  stage3_a1: { question: "한복의 다양한 색과 모양에 대해 알아볼까?", image: "hanbok.png" },
  stage3_a2: { question: "우리나라 음식에는 어떤 것들이 있을까?", image: "bibimbap.png" },
  stage3_a3: { question: "명절에만 하는 일은 무엇이 있을까?", image: "holiday.png" },
  stage4_a1: { question: "윷놀이는 언제 어떻게 할까?", image: "yut.png" },
  stage4_a2: { question: "딱지접기는 어떻게 할까?", image: "ddakji.png" },
  stage4_a3: { question: "두 아리랑은 어떻게 다를까?\n지역마다 아리랑이 왜 다를까?", image: "minyo.png" },
  stage4_a4: { question: "탈과 어울리는 동작은 어떤 것이 있을까?", image: "talchum.png" }
};

let skipActivityIntro = false;
let lastActivityIntroKey = null;
let _renderLock = 0;

const state = {
  code: "",
  loggedIn: false,
  loginFlow: "select",
  loginType: "",
  saveEnabled: false,
  studentMode: "",
  userProfile: null,
  current: "main",
  difficulty: "easy",
  solved: {
    tg: false, anthem: false, money: false, mugunghwa: false,
    hangul: false, hanok: false,
    hanbok: false, bibimbap: false, holiday: false,
    yut: false, ttakji: false, rhythm: false
  },
  rhythm: { screen: "song", song: null, level: 1 },
  rhythmProgress: {
    gyeonggi: { unlocked: 1, cleared: [false, false, false] },
    jindo: { unlocked: 1, cleared: [false, false, false] },
    complete: false
  },
  food: { screen: "cook", dish: "bibimbap" },
  foodProgress: { bibimbap: false },
  hanbok: null,
  yut: null,
  ttakjiStep: -1,
  ttakjiWatched: null,
  talchumStep: 0,
  talchumPhase: "masks",
  talchumMasks: null,
  completedMissions: {},
  treasures: createDefaultTreasures(),
  anthem: null,
  mugu: null,
  teacherAlbumView: null,
  teacherBookView: null,
  teacherDashTab: "status",
  teacherValueView: { mode: "student", studentAccountId: "", activity: "" },
  valueRecords: [],
  finalCultureReflection: null,
  valueBook: null,
  valueReflection: null
};

const app = document.querySelector("#app");
const SAVE_KEY = "kculture_guard_save_v1";
const CLASSROOM_AUTH_KEY = "kculture_guard_classroom_auth_v1";
const RECENT_TEACHER_CLASSES_KEY = "kculture_guard_recent_teacher_classes_v1";
/** 교사 PC에만 두는 학생 실명(클라우드·학생 기기로 올리지 않음) */
const TEACHER_STUDENT_NAMES_KEY = "kculture_guard_teacher_student_names_v1";

function loadAllTeacherStudentNames() {
  try {
    const raw = localStorage.getItem(TEACHER_STUDENT_NAMES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function loadTeacherStudentNames(classKey) {
  const key = String(classKey || "").trim();
  if (!key) return {};
  const all = loadAllTeacherStudentNames();
  const map = all[key];
  return map && typeof map === "object" ? map : {};
}

function getTeacherStudentName(classKey, accountId) {
  const map = loadTeacherStudentNames(classKey);
  const name = map[accountId];
  return typeof name === "string" ? name.trim() : "";
}

function setTeacherStudentName(classKey, accountId, name) {
  const key = String(classKey || "").trim();
  const id = String(accountId || "").trim();
  if (!key || !id) return;
  const all = loadAllTeacherStudentNames();
  const map = { ...(all[key] && typeof all[key] === "object" ? all[key] : {}) };
  const trimmed = String(name || "").trim().slice(0, 20);
  if (trimmed) map[id] = trimmed;
  else delete map[id];
  if (Object.keys(map).length) all[key] = map;
  else delete all[key];
  try {
    localStorage.setItem(TEACHER_STUDENT_NAMES_KEY, JSON.stringify(all));
  } catch (_) {}
}

function removeTeacherStudentName(classKey, accountId) {
  setTeacherStudentName(classKey, accountId, "");
}

function clearTeacherStudentNamesForClass(classKey) {
  const key = String(classKey || "").trim();
  if (!key) return;
  const all = loadAllTeacherStudentNames();
  if (!all[key]) return;
  delete all[key];
  try {
    localStorage.setItem(TEACHER_STUDENT_NAMES_KEY, JSON.stringify(all));
  } catch (_) {}
}

function loadClassroomAuth() {
  try {
    const raw = localStorage.getItem(CLASSROOM_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.students)) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function saveClassroomAuth(payload) {
  localStorage.setItem(CLASSROOM_AUTH_KEY, JSON.stringify(payload));
}

function clearClassroomAuth() {
  localStorage.removeItem(CLASSROOM_AUTH_KEY);
}

function loadRecentTeacherClasses() {
  try {
    const raw = localStorage.getItem(RECENT_TEACHER_CLASSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.classCode).slice(0, 5);
  } catch (_) {
    return [];
  }
}

function saveRecentTeacherClassCode(classroom) {
  const classCode = classroom?.classKey || classroom?.classCode;
  if (!classCode) return;
  const prev = loadRecentTeacherClasses().filter((item) => item.classCode !== classCode);
  const next = [{
    classCode,
    updatedAt: new Date().toISOString()
  }, ...prev].slice(0, 5);
  localStorage.setItem(RECENT_TEACHER_CLASSES_KEY, JSON.stringify(next));
}

// 학급을 묶는 키는 학교이름이 아니라 교사에게 발급되는 랜덤 학급코드예요.
// (개인정보 최소화: Firebase에는 학교이름·학년·반이 저장되지 않아요.)
function buildClassKey(classCode) {
  return String(classCode).trim();
}

function generateClassCode() {
  const code = Math.floor(Math.random() * 9000) + 1000;
  return String(code);
}

async function generateUniqueClassCode() {
  for (let i = 0; i < 25; i++) {
    const code = generateClassCode();
    const existing = await findClassroom(code).catch(() => null);
    if (!existing) return code;
  }
  return `${generateClassCode()}${String(Date.now()).slice(-2)}`;
}

function buildStudentAccountId(classCode, studentNum) {
  return `${String(classCode).trim()}_${String(studentNum).padStart(2, "0")}`;
}

function classroomLabel(classroom) {
  if (isReviewDemoClassroom(classroom)) return "심사초등학교 1학년 1반";
  const code = classroom?.classKey || classroom?.classCode || "";
  return `학급코드 ${code}`;
}

function isSaveEnabled() {
  return state.saveEnabled === true;
}

function getStudentSaveKey() {
  const classKey = state.userProfile?.classKey || state.userProfile?.classCode;
  if (!classKey || !state.userProfile?.accountId) return SAVE_KEY;
  return `${SAVE_KEY}_${classKey}_${state.userProfile.accountId}`;
}

function syncValueRecordsFromActivities() {
  if (window.ValueGuardianBook?.syncFromState) {
    window.ValueGuardianBook.syncFromState(state);
  }
}

function getProgressPayload() {
  syncValueRecordsFromActivities();
  // 저장(학습 상황)에는 「찾은 보물」·「수호책 기록」만 남긴다.
  // 활동을 얼마나 진행했는지(중간 단계)는 저장하지 않아서, 나갔다 들어오면 항상 처음부터 다시 시작한다.
  return {
    difficulty: state.difficulty,
    completedMissions: state.completedMissions,
    treasures: state.treasures,
    valueRecords: Array.isArray(state.valueRecords) ? state.valueRecords : [],
    finalCultureReflection: state.finalCultureReflection || null,
    updatedAt: new Date().toISOString()
  };
}

function applyProgressPayload(parsed) {
  if (!parsed || typeof parsed !== "object") return;
  // 「찾은 보물」·「수호책 기록」·「게시판 작품」만 불러오고,
  // 활동을 얼마나 진행했는지(solved/중간 단계)는 불러오지 않는다 — 항상 활동 처음부터 시작.
  if (parsed.difficulty) state.difficulty = parsed.difficulty;
  if (parsed.completedMissions) state.completedMissions = { ...parsed.completedMissions };
  if (parsed.treasures) state.treasures = { ...createDefaultTreasures(), ...parsed.treasures };
  if (state.treasures.gyeongju_silla_sword) {
    state.treasures.daedongyeojido = true;
    delete state.treasures.gyeongju_silla_sword;
  }
  Object.entries(state.completedMissions).forEach(([route, done]) => {
    if (!done) return;
    const treasure = MISSION_TREASURES[normalizeMissionRoute(route)];
    if (treasure) state.treasures[treasure.key] = true;
  });
  // 리듬·비빔밥·한옥탐방 등 활동 중간 진행 상태는 더 이상 불러오지 않는다(세션 진행 상태는 항상 초기화).
  if (Array.isArray(parsed.valueRecords)) {
    state.valueRecords = parsed.valueRecords
      .map((item) => (window.ValueGuardianBook?.normalizeRecord
        ? window.ValueGuardianBook.normalizeRecord(item)
        : item))
      .filter(Boolean);
  } else {
    state.valueRecords = [];
  }
  if (parsed.finalCultureReflection && typeof parsed.finalCultureReflection === "object") {
    state.finalCultureReflection = parsed.finalCultureReflection;
  } else {
    state.finalCultureReflection = null;
  }
  // valueReflection(질문 응답 중 상태)도 활동 진행 상태이므로 불러오지 않고 항상 초기화한다.
  state.valueReflection = null;
  syncValueRecordsFromActivities();
}

function resetSessionProgress() {
  state.solved = {
    tg: false, anthem: false, money: false, mugunghwa: false,
    hangul: false, hanok: false,
    hanbok: false, bibimbap: false, holiday: false,
    yut: false, ttakji: false, rhythm: false
  };
  state.mugu = null;
  state.rhythm = { screen: "song", song: null, level: 1 };
  state.rhythmProgress = {
    gyeonggi: { unlocked: 1, cleared: [false, false, false] },
    jindo: { unlocked: 1, cleared: [false, false, false] },
    complete: false
  };
  state.food = { screen: "cook", dish: "bibimbap" };
  state.foodProgress = { bibimbap: false };
  state.hanbok = null;
  state.yut = null;
  state.ttakjiStep = -1;
  state.ttakjiWatched = null;
  state.talchumStep = 0;
  state.talchumPhase = "masks";
  state.completedMissions = {};
  state.treasures = createDefaultTreasures();
  state.valueRecords = [];
  state.finalCultureReflection = null;
  state.valueBook = null;
  state.valueReflection = null;
}

async function loadStudentProgress() {
  if (!isSaveEnabled() || !state.userProfile) return;
  const classKey = state.userProfile.classKey || state.userProfile.classCode;
  const { accountId } = state.userProfile;
  let parsed = null;
  try {
    if (window.KCultureFirebase?.isReady()) {
      parsed = await window.KCultureFirebase.loadStudentProgress(classKey, accountId);
    }
  } catch (_) {}
  if (!parsed) {
    try {
      const raw = localStorage.getItem(getStudentSaveKey());
      if (raw) parsed = JSON.parse(raw);
    } catch (_) {}
  }
  applyProgressPayload(parsed);
}

function loadSave() {
  if (!isSaveEnabled()) return;
  try {
    const raw = localStorage.getItem(getStudentSaveKey());
    if (!raw) return;
    applyProgressPayload(JSON.parse(raw));
  } catch (_) {}
}

function saveProgress() {
  if (!isSaveEnabled()) return;
  const payload = getProgressPayload();
  try {
    localStorage.setItem(getStudentSaveKey(), JSON.stringify(payload));
  } catch (_) {}
  if (window.KCultureFirebase?.isReady() && state.userProfile) {
    const classKey = state.userProfile.classKey || state.userProfile.classCode;
    const { accountId } = state.userProfile;
    window.KCultureFirebase.saveStudentProgress(classKey, accountId, payload).catch(() => {});
  }
}

function clearProgress() {
  if (!isSaveEnabled()) return;
  localStorage.removeItem(getStudentSaveKey());
  resetSessionProgress();
}

let _presenceUnsub = null;
let _classAccessUnsub = null;
let _presenceHeartbeat = null;
let _onlineCount = 0;
let _onlineList = [];
let _presenceSelfAccountId = "";
let _presenceLocalLastSeenAt = 0;
let _yutRoomUnsub = null;
let _teacherDashboardUnsubs = [];

function updateOnlineBadge() {
  const el = document.getElementById("onlineBadge");
  if (!el) return;
  el.textContent = `👥 우리반 접속중 ${_onlineCount}명`;
  if (!el.dataset.boundOnline) {
    el.dataset.boundOnline = "1";
    el.onclick = () => {
      playSound("click.mp3");
      showOnlineClassmatesPopup();
    };
  }
}

function startOnlineSession() {
  if (!isSaveEnabled() || !state.userProfile) return;
  const classKey = state.userProfile.classKey || state.userProfile.classCode;
  const { accountId, name } = state.userProfile;
  _presenceSelfAccountId = accountId;
  _presenceLocalLastSeenAt = Date.now();
  const applyList = (online) => {
    const list = withReviewDemoPresence(online, state.userProfile);
    const hasMe = list.some((item) => item?.accountId === _presenceSelfAccountId);
    if (!hasMe && _presenceSelfAccountId && Date.now() - _presenceLocalLastSeenAt < 130000) {
      list.push({
        accountId: _presenceSelfAccountId,
        name: state.userProfile?.name || "",
        number: state.userProfile?.number
      });
    }
    _onlineList = list;
    _onlineCount = list.length;
    updateOnlineBadge();
  };
  applyList([]);
  const fb = window.KCultureFirebase;
  if (!fb?.isReady()) return;
  const pingPresence = () => {
    _presenceLocalLastSeenAt = Date.now();
    fb.setPresence(classKey, accountId, { name }).catch(() => {});
  };
  pingPresence();
  _presenceHeartbeat = setInterval(() => {
    pingPresence();
  }, 60000);
  _presenceUnsub = fb.subscribeClassPresence(classKey, (online) => {
    applyList(online);
  });
  // 교사가 활동을 열거나 닫으면 바로 반영 (활동 고르는 화면이면 다시 그림)
  if (_classAccessUnsub) { try { _classAccessUnsub(); } catch (_) {} }
  _classAccessUnsub = fb.subscribeClassroom(classKey, (classroom) => {
    if (!classroom) return;
    const next = normalizeActivityAccess(classroom.activityAccess);
    const changed = JSON.stringify(next) !== JSON.stringify(state.classActivityAccess || null);
    state.classActivityAccess = next;
    if (changed && /_menu$/.test(String(state.current || ""))) render();
  });
}

function stopOnlineSession() {
  if (_presenceHeartbeat) {
    clearInterval(_presenceHeartbeat);
    _presenceHeartbeat = null;
  }
  if (_presenceUnsub) {
    _presenceUnsub();
    _presenceUnsub = null;
  }
  if (_classAccessUnsub) {
    try { _classAccessUnsub(); } catch (_) {}
    _classAccessUnsub = null;
  }
  if (window.KCultureFirebase?.isReady() && state.userProfile) {
    const classKey = state.userProfile.classKey || state.userProfile.classCode;
    const { accountId } = state.userProfile;
    window.KCultureFirebase.clearPresence(classKey, accountId);
  }
  _onlineCount = 0;
  _onlineList = [];
  _presenceSelfAccountId = "";
  _presenceLocalLastSeenAt = 0;
}

function stopYutOnlineSync({ leaveRoom = false } = {}) {
  if (_yutRoomUnsub) {
    _yutRoomUnsub();
    _yutRoomUnsub = null;
  }
  if (leaveRoom && state.yutOnline?.roomId && state.userProfile?.accountId && window.KCultureFirebase?.isReady()) {
    window.KCultureFirebase.removeYutPlayer(state.yutOnline.roomId, state.userProfile.accountId).catch(() => {});
  }
  state.yutOnline = null;
}

function yutOnlineLeaveToRoomPick() {
  const rooms = state.yutOnline?.availableRooms || [];
  stopYutOnlineSync({ leaveRoom: true });
  state.yutOnline = { mode: "room_pick", availableRooms: rooms };
  yutOnlineFetchWaitingRooms().then((list) => {
    if (state.current !== "stage4_a1" || state.yutOnline?.mode !== "room_pick") return;
    state.yutOnline.availableRooms = list;
    render();
  }).catch(() => {});
}

function resetLoginSession() {
  stopTeacherDashboardSync();
  stopYutOnlineSync({ leaveRoom: true });
  stopOnlineSession();
  if (window.ClassroomExtension) window.ClassroomExtension.stop();
  state.loggedIn = false;
  state.loginFlow = "select";
  state.loginType = "";
  state.saveEnabled = false;
  state.studentMode = "";
  state.userProfile = null;
  state.code = "";
  state.current = "main";
  state.teacherAlbumView = null;
  state.teacherBookView = null;
  state.teacherDashTab = "status";
  state.teacherValueView = { mode: "student", studentAccountId: "", activity: "" };
  resetSessionProgress();
  clearNavHistory();
}

async function findClassroom(classKey) {
  if (!classKey) return null;
  if (window.KCultureFirebase?.isReady()) {
    const remote = await window.KCultureFirebase.getClassroom(classKey);
    if (remote) return remote;
  }
  const local = loadClassroomAuth();
  if ((local?.classKey || local?.classCode) === classKey) return local;
  return null;
}

async function createClassroomWithCode(classCode) {
  const classKey = buildClassKey(classCode);
  const classroom = {
    classKey,
    classCode: classKey,
    students: [],
    registeredAccountIds: {},
    updatedAt: new Date().toISOString()
  };
  if (window.KCultureFirebase?.isReady()) {
    await window.KCultureFirebase.saveClassroom(classroom).catch(() => {});
  }
  saveClassroomAuth(classroom);
  saveRecentTeacherClassCode(classroom);
  return classroom;
}

function buildRegisteredAccountIdMap(students = []) {
  const registeredAccountIds = {};
  students.forEach((student) => {
    if (student?.accountId) registeredAccountIds[student.accountId] = true;
  });
  return registeredAccountIds;
}

async function ensureStudentRegisteredInClassroom(classroom, student) {
  const students = Array.isArray(classroom.students) ? classroom.students.slice() : [];
  const existingIndex = students.findIndex((item) => item.accountId === student.accountId);
  if (existingIndex >= 0) students[existingIndex] = { ...students[existingIndex], ...student };
  else students.push(student);

  const nextClassroom = {
    ...classroom,
    students,
    registeredAccountIds: buildRegisteredAccountIdMap(students),
    updatedAt: new Date().toISOString()
  };

  if (window.KCultureFirebase?.isReady()) {
    try {
      await window.KCultureFirebase.saveClassroom(nextClassroom);
    } catch (err) {
      console.warn("[수호대] 학생 등록 저장 실패:", err);
      console.warn("[수호대] Firebase 콘솔 → Firestore → 규칙 탭에서 firestore.rules 내용을 붙여넣고 '게시'했는지 확인하세요.");
    }
  }
  updateLocalClassroom(nextClassroom);
  return nextClassroom;
}

function removeLocalStudentProgress(classCode, accountId) {
  try {
    localStorage.removeItem(`${SAVE_KEY}_${classCode}_${accountId}`);
  } catch (_) {}
}

function updateLocalClassroom(classroom) {
  const local = loadClassroomAuth();
  if (!local || (local.classKey || local.classCode) !== (classroom.classKey || classroom.classCode)) return;
  saveClassroomAuth({
    ...classroom,
    registeredAccountIds: buildRegisteredAccountIdMap(classroom.students),
    updatedAt: new Date().toISOString()
  });
}

async function deleteStudentAccountFromClassroom(classCode, accountId) {
  const classroom = await findClassroom(classCode);
  if (!classroom) return { ok: false, message: "학급 정보를 찾지 못했어요." };

  const nextStudents = (classroom.students || []).filter((student) => student.accountId !== accountId);
  if (nextStudents.length === classroom.students.length) {
    return { ok: false, message: "이미 삭제된 학생 계정이에요." };
  }

  const nextClassroom = {
    ...classroom,
    students: nextStudents,
    registeredAccountIds: buildRegisteredAccountIdMap(nextStudents),
    updatedAt: new Date().toISOString()
  };

  let cloudSynced = false;
  if (window.KCultureFirebase?.isReady()) {
    try {
      cloudSynced = await window.KCultureFirebase.deleteStudent(classCode, accountId);
    } catch (_) {
      cloudSynced = false;
    }
  }

  updateLocalClassroom(nextClassroom);
  removeLocalStudentProgress(classCode, accountId);
  removeTeacherStudentName(classCode, accountId);
  return { ok: true, cloudSynced };
}

async function deleteClassroomAccount(classKey) {
  let cloudSynced = false;
  if (window.KCultureFirebase?.isReady()) {
    try {
      cloudSynced = await window.KCultureFirebase.deleteClassroom(classKey);
    } catch (_) {
      cloudSynced = false;
    }
  }

  const local = loadClassroomAuth();
  if ((local?.classKey || local?.classCode) === classKey) {
    (local.students || []).forEach((student) => removeLocalStudentProgress(classKey, student.accountId));
    clearClassroomAuth();
  }
  clearTeacherStudentNamesForClass(classKey);
  return { ok: true, cloudSynced };
}

function getSavedProgressByAccountId(accountId) {
  try {
    const classKey = state.userProfile?.classKey || state.userProfile?.classCode;
    const key = `${SAVE_KEY}_${classKey}_${accountId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/** 디지털연구대회 심사용 가상 학급 — 교사 대시보드와 학생 체험을 바로 볼 수 있게 준비 */
const REVIEW_DEMO = {
  classCode: "REVIEW",
  seedVersion: 15,
  playerNumber: 1,
  playerName: "수호",
  onlineNumbers: [1, 2, 3]
};

const REVIEW_DEMO_MEDIA = {
  voiceSuhoAnthem: "assets/review-demo/voice-suho-anthem.wav",
  voiceMinseoHangul: "assets/review-demo/voice-minseo-hangul.wav",
  voiceHaeunHoliday: "assets/review-demo/voice-haeun-holiday.wav",
  voiceJihoMinyo: "assets/review-demo/voice-jiho-minyo.wav"
};

function reviewDemoClassKey() {
  return buildClassKey(REVIEW_DEMO.classCode);
}

function reviewDemoAccountId(number) {
  return buildStudentAccountId(REVIEW_DEMO.classCode, number);
}

function isReviewDemoClassroom(classroom) {
  if (!classroom) return false;
  return (classroom.classKey || classroom.classCode) === REVIEW_DEMO.classCode;
}

function isReviewDemoSession() {
  return isReviewDemoClassroom(state.userProfile);
}

function getReviewDemoOnlineEntries() {
  const onlineNumbers = new Set(REVIEW_DEMO.onlineNumbers || []);
  return getReviewDemoStudentSpecs()
    .filter((item) => onlineNumbers.has(item.number))
    .map((item) => ({
      accountId: reviewDemoAccountId(item.number),
      name: item.name,
      number: item.number
    }));
}

function withReviewDemoPresence(online, classroom) {
  if (isReviewDemoClassroom(classroom || state.userProfile)) {
    const entries = getReviewDemoOnlineEntries();
    const me = state.userProfile;
    if (me && me.accountId && !entries.some((item) => item.accountId === me.accountId)) {
      entries.push({
        accountId: me.accountId,
        name: me.name || "학생",
        number: me.number
      });
    }
    return entries;
  }
  return Array.isArray(online) ? online.slice() : [];
}

function getClassmateDirectory() {
  if (isReviewDemoClassroom(state.userProfile)) {
    return getReviewDemoAllStudentSpecs().map((item) => ({
      number: item.number,
      name: item.name,
      accountId: reviewDemoAccountId(item.number)
    }));
  }
  const classroom = loadClassroomAuth();
  return Array.isArray(classroom?.students) ? classroom.students.slice() : [];
}

function showOnlineClassmatesPopup() {
  const classmates = getClassmateDirectory()
    .slice()
    .sort((a, b) => Number(a.number) - Number(b.number));
  const onlineIds = new Set((_onlineList || []).map((item) => item.accountId).filter(Boolean));
  const myId = state.userProfile?.accountId || _presenceSelfAccountId;
  const rows = classmates.length
    ? classmates
    : (_onlineList || []).map((item) => ({
        accountId: item.accountId,
        name: item.name || "친구",
        number: item.number
      }));
  const onlineRows = [];
  const offlineRows = [];
  rows.forEach((student) => {
    const isOnline = classmates.length ? onlineIds.has(student.accountId) : true;
    const me = student.accountId === myId ? " (나)" : "";
    const numberLabel = Number.isFinite(Number(student.number)) ? `${student.number}번 ` : "";
    const line = `${numberLabel}${student.name || "친구"}${me}`;
    if (isOnline) onlineRows.push(line);
    else offlineRows.push(line);
  });
  const onlineHtml = onlineRows.length
    ? `<ul class="online-presence-list">${onlineRows.map((line) => `<li>🟢 ${line}</li>`).join("")}</ul>`
    : `<p class="small">지금 접속 중인 친구가 없어요.</p>`;
  const offlineHtml = offlineRows.length
    ? `<p class="small" style="margin-top:12px;">아직 안 들어온 친구</p>
       <ul class="online-presence-list online-presence-list--off">${offlineRows.map((line) => `<li>⚪ ${line}</li>`).join("")}</ul>`
    : "";
  Swal.fire({
    title: "우리반 접속중",
    html: `
      <p>지금 <strong>${onlineRows.length}명</strong>이 접속 중이에요.</p>
      ${onlineHtml}
      ${offlineHtml}
    `,
    confirmButtonText: "확인"
  });
}

function reviewHoursAgo(hours) {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

function reviewValueRecord(activity, title, choice, value, text, hoursAgo, extra) {
  const kind = extra?.type || "text";
  return {
    activity,
    activityTitle: title,
    selectedElement: choice,
    selectedElementLabel: choice,
    valueLabel: value,
    reflectionText: text || "",
    photoUrl: extra?.photo || null,
    audioUrl: extra?.audio || null,
    representativeImage: extra?.photo || "",
    responseType: kind,
    status: "complete",
    createdAt: reviewHoursAgo(hoursAgo)
  };
}

function reviewDemoHanokExplorer(valueRecords) {
  const rec = (valueRecords || []).find((item) => item && item.activity === "hanok");
  if (!rec) {
    return {
      journalSaved: false,
      phase: "done",
      selectedHanokValue: "",
      selectedHanokValueLabel: ""
    };
  }
  return {
    journalSaved: true,
    phase: "done",
    selectedHanokValue: rec.selectedElement,
    selectedHanokValueLabel: rec.selectedElementLabel,
    reflectionText: rec.finalAnswer,
    createdAt: rec.createdAt,
    journal: { ...rec }
  };
}

function buildReviewDemoProgress(spec) {
  const demoRecords = window.ReviewDemoRecords;
  let valueRecords = [];
  let finalCultureReflection = null;
  if (demoRecords && spec.demoIndex) {
    valueRecords = demoRecords.buildRecords(spec.demoIndex);
    finalCultureReflection = demoRecords.buildFinale(spec.demoIndex, valueRecords);
  } else if (demoRecords?.buildBaseRecords) {
    // 기존 로그인 학생(1~5번): 완료한 활동 중 일부만 가치수호록 작성
    valueRecords = demoRecords.buildBaseRecords(spec.number, spec.routes);
    finalCultureReflection = demoRecords.buildBaseFinale(spec.number, valueRecords);
  }
  const solvedKeyByRoute = {
    stage1_a1: "tg",
    stage1_a2: "mugunghwa",
    stage1_a3: "anthem",
    stage1_a4: "money",
    stage2_a1: "hangul",
    stage2_a2: "hanok",
    stage3_a1: "hanbok",
    stage3_a2: "bibimbap",
    stage3_a3: "holiday",
    stage4_a1: "yut",
    stage4_a2: "ttakji",
    stage4_a3: "rhythm"
  };
  const completedMissions = {};
  Object.keys(MISSION_TREASURES).forEach((route) => {
    completedMissions[route] = false;
  });
  const treasures = createDefaultTreasures();
  const solved = {
    tg: false, anthem: false, money: false, mugunghwa: false,
    hangul: false, hanok: false,
    hanbok: false, bibimbap: false, holiday: false,
    yut: false, ttakji: false, rhythm: false
  };
  (spec.routes || []).forEach((route) => {
    completedMissions[route] = true;
    const treasure = MISSION_TREASURES[route];
    if (treasure) treasures[treasure.key] = true;
    const solvedKey = solvedKeyByRoute[route];
    if (solvedKey) solved[solvedKey] = true;
  });
  return {
    difficulty: "easy",
    solved,
    completedMissions,
    treasures,
    rhythmProgress: {
      gyeonggi: { unlocked: solved.rhythm ? 3 : 1, cleared: solved.rhythm ? [true, true, false] : [false, false, false] },
      jindo: { unlocked: solved.rhythm ? 2 : 1, cleared: [!!solved.rhythm, false, false] },
      complete: !!solved.rhythm
    },
    foodProgress: { bibimbap: !!solved.bibimbap },
    hanokExplorer: solved.hanok
      ? reviewDemoHanokExplorer(valueRecords)
      : null,
    valueRecords,
    finalCultureReflection,
    isReviewSeed: true,
    reviewSeedVersion: REVIEW_DEMO.seedVersion,
    updatedAt: spec.updatedAt || new Date().toISOString()
  };
}

function getReviewDemoStudentSpecs() {
  return [
    {
      number: 1,
      name: "수호",
      updatedAt: reviewHoursAgo(2),
      routes: Object.keys(MISSION_TREASURES)
    },
    {
      number: 2,
      name: "대한",
      updatedAt: reviewHoursAgo(18),
      routes: [
        "stage1_a1", "stage1_a2", "stage1_a3",
        "stage2_a1", "stage2_a2",
        "stage3_a1", "stage3_a3",
        "stage4_a1", "stage4_a2", "stage4_a3"
      ]
    },
    {
      number: 3,
      name: "민국",
      updatedAt: reviewHoursAgo(40),
      routes: [
        "stage1_a1", "stage1_a2", "stage1_a4",
        "stage2_a1", "stage2_a3",
        "stage3_a2", "stage3_a3",
        "stage4_a1", "stage4_a4"
      ]
    },
    {
      number: 4,
      name: "우리",
      updatedAt: reviewHoursAgo(72),
      routes: [
        "stage1_a1", "stage1_a3", "stage1_a4",
        "stage2_a1", "stage2_a2", "stage2_a3",
        "stage3_a1", "stage3_a2", "stage3_a3",
        "stage4_a2"
      ]
    },
    {
      number: 5,
      name: "나라",
      updatedAt: reviewHoursAgo(26),
      routes: [
        "stage1_a2", "stage1_a3", "stage1_a4",
        "stage2_a1", "stage2_a2",
        "stage3_a1", "stage3_a2",
        "stage4_a1", "stage4_a3", "stage4_a4"
      ]
    }
  ];
}

/** 교사용 대시보드 시연용 추가 가상 학생 10명 (로그인 버튼 없음) — 6번 학생1 ~ 15번 학생10 */
function getReviewDemoExtraStudentSpecs() {
  const count = window.ReviewDemoRecords?.STUDENT_COUNT || 10;
  const routes = Object.keys(MISSION_TREASURES);
  const specs = [];
  for (let i = 1; i <= count; i += 1) {
    specs.push({
      number: 5 + i,
      name: `학생${i}`,
      demoIndex: i,
      loginEnabled: false,
      updatedAt: reviewHoursAgo(3 + i * 2),
      routes
    });
  }
  return specs;
}

/** 학급 명단·진행 기록용: 로그인 가능한 5명 + 추가 가상 학생 10명 */
function getReviewDemoAllStudentSpecs() {
  return getReviewDemoStudentSpecs().concat(getReviewDemoExtraStudentSpecs());
}

async function seedReviewProgressIfEmpty(classKey, accountId, payload) {
  const localKey = `${SAVE_KEY}_${classKey}_${accountId}`;
  let local = null;
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) local = JSON.parse(raw);
  } catch (_) {}
  const staleLocal = !local || Number(local.reviewSeedVersion) !== REVIEW_DEMO.seedVersion;
  if (staleLocal) {
    try { localStorage.setItem(localKey, JSON.stringify(payload)); } catch (_) {}
  }
  if (window.KCultureFirebase?.isReady()) {
    try {
      const remote = await window.KCultureFirebase.loadStudentProgress(classKey, accountId);
      const staleRemote = !remote || Number(remote.reviewSeedVersion) !== REVIEW_DEMO.seedVersion;
      if (staleRemote) await window.KCultureFirebase.saveStudentProgress(classKey, accountId, payload);
    } catch (_) {}
  }
}

async function ensureReviewDemoClassroom() {
  const classKey = reviewDemoClassKey();
  const specs = getReviewDemoAllStudentSpecs();
  const seededStudents = specs.map((item) => ({
    number: item.number,
    name: item.name,
    accountId: reviewDemoAccountId(item.number)
  }));

  let classroom = await findClassroom(classKey);

  const byId = {};
  (classroom?.students || []).forEach((student) => {
    if (student?.accountId) byId[student.accountId] = student;
  });
  seededStudents.forEach((student) => {
    byId[student.accountId] = { ...byId[student.accountId], ...student };
  });
  const students = Object.values(byId).sort((a, b) => Number(a.number) - Number(b.number));
  const nextClassroom = {
    classKey,
    classCode: classKey,
    students,
    registeredAccountIds: buildRegisteredAccountIdMap(students),
    isReviewDemo: true,
    reviewSeedVersion: REVIEW_DEMO.seedVersion,
    // 심사 때 모든 활동을 해 볼 수 있게 기본은 모두 열림 (교사가 바꾼 설정은 그대로 둔다)
    activityAccess: normalizeActivityAccess(classroom?.activityAccess) || fullActivityAccess(true),
    updatedAt: new Date().toISOString()
  };

  if (window.KCultureFirebase?.isReady()) {
    try { await window.KCultureFirebase.saveClassroom(nextClassroom); } catch (_) {}
  }
  saveClassroomAuth(nextClassroom);
  saveRecentTeacherClassCode(nextClassroom);

  for (const spec of specs) {
    await seedReviewProgressIfEmpty(
      classKey,
      reviewDemoAccountId(spec.number),
      buildReviewDemoProgress(spec)
    );
  }
  if (window.ClassroomExtension?.seedReviewDemo) {
    window.ClassroomExtension.seedReviewDemo(
      classKey,
      getReviewDemoAllStudentSpecs().map((item) => ({
        number: item.number,
        name: item.name,
        accountId: reviewDemoAccountId(item.number)
      })),
      REVIEW_DEMO.seedVersion
    );
  }
  return nextClassroom;
}

async function enterReviewDemoTeacher() {
  Swal.fire({
    title: "심사용 학급을 준비하고 있어요...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading()
  });
  try {
    const classroom = await ensureReviewDemoClassroom();
    Swal.close();
    saveClassroomAuth(classroom);
    saveRecentTeacherClassCode(classroom);
    state.loggedIn = true;
    state.loginType = "teacher";
    state.studentMode = "";
    state.saveEnabled = false;
    state.userProfile = {
      classKey: classroom.classKey
    };
    state.code = classroom.classKey;
    state.teacherDashTab = "status";
    state.current = "main";
    clearNavHistory();
    playSound("login_success.mp3");
    render();
  } catch (err) {
    console.error("[수호대] 심사용 교사 입장 실패:", err);
    Swal.fire("앗!", "심사용 학급을 준비하지 못했어요. 다시 시도해 주세요.", "error");
  }
}

async function enterReviewDemoStudent(number) {
  const specs = getReviewDemoStudentSpecs();
  const spec = specs.find((item) => item.number === Number(number)) || specs[0];
  Swal.fire({
    title: "심사용 학생 계정을 준비하고 있어요...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading()
  });
  try {
    const classroom = await ensureReviewDemoClassroom();
    const matched = (classroom.students || []).find((item) => item.number === spec.number)
      || {
        number: spec.number,
        name: spec.name,
        accountId: reviewDemoAccountId(spec.number)
      };
    Swal.close();
    completeRegisteredStudentLogin(classroom, matched, classroom.classKey);
    state.current = "main";
    resetSessionProgress();
    await loadStudentProgress();
    startOnlineSession();
    Swal.close();
    playSound("login_success.mp3");
    render();
  } catch (err) {
    console.error("[수호대] 심사용 학생 입장 실패:", err);
    Swal.fire("앗!", "심사용 학생 계정을 준비하지 못했어요. 다시 시도해 주세요.", "error");
  }
}

async function loadTeacherDashboardData(classKey, schoolInfo) {
  const classroom = await findClassroom(classKey, schoolInfo);
  if (!classroom) return null;

  if (!Array.isArray(classroom.students)) classroom.students = [];
  if (state.loginType === "teacher") {
    saveClassroomAuth({
      ...classroom,
      registeredAccountIds: buildRegisteredAccountIdMap(classroom.students),
      updatedAt: new Date().toISOString()
    });
  } else if (classroom.classKey || classroom.classCode) {
    updateLocalClassroom(classroom);
  }

  let progressMap = {};
  if (window.KCultureFirebase?.isReady()) {
    try {
      const resolvedKey = classroom.classKey || classroom.classCode || classKey;
      progressMap = await window.KCultureFirebase.getClassProgressMap(resolvedKey);
    } catch (err) {
      console.warn("[수호대] 교사용 대시보드 진행 불러오기 실패:", err);
      progressMap = {};
    }
  }

  classroom.students.forEach((student) => {
    if (!progressMap[student.accountId]) {
      const local = getSavedProgressByAccountId(student.accountId);
      if (local) progressMap[student.accountId] = local;
    }
  });

  return { classroom, progressMap };
}

function stopTeacherDashboardSync() {
  _teacherDashboardUnsubs.forEach((unsub) => {
    try { unsub(); } catch (_) {}
  });
  _teacherDashboardUnsubs = [];
}

function ensureTeacherValueView() {
  if (!state.teacherValueView || typeof state.teacherValueView !== "object") {
    state.teacherValueView = { mode: "student", studentAccountId: "", activity: "" };
  }
  if (state.teacherDashTab !== "values" && state.teacherDashTab !== "access") state.teacherDashTab = "status";
  if (!state.teacherValueView.mode) state.teacherValueView.mode = "student";
  if (typeof state.teacherValueView.studentAccountId !== "string") state.teacherValueView.studentAccountId = "";
  if (typeof state.teacherValueView.activity !== "string") state.teacherValueView.activity = "";
  return state.teacherValueView;
}

/** 학급 현황: 한 학생의 활동별 완료·미완료 */
function showStudentMissionStatus(student, progress, classroom) {
  const done = progress?.completedMissions || {};
  const access = normalizeActivityAccess(classroom?.activityAccess);
  const doneList = [];
  const todoList = [];
  Object.keys(STAGE_MENUS).sort((a, b) => Number(a) - Number(b)).forEach((stageKey) => {
    (STAGE_MENUS[stageKey].activities || []).forEach((act) => {
      const item = { stage: Number(stageKey), label: act.label, route: act.route, closed: access ? !access[act.route] : false };
      (done[act.route] ? doneList : todoList).push(item);
    });
  });
  const classKey = classroom?.classKey || classroom?.classCode || "";
  const realName = getTeacherStudentName(classKey, student.accountId);
  const titleName = realName ? `${student.number}번 ${student.name} (${realName})` : `${student.number}번 ${student.name}`;
  const li = (item, mark) => `<li><span class="tms-mark">${mark}</span><span class="tms-stage">${item.stage}단계</span> ${item.label}${item.closed ? ` <span class="tms-closed">🔒 아직 안 열림</span>` : ""}</li>`;
  Swal.fire({
    title: titleName,
    html: `
      <div class="teacher-mission-status">
        <p class="tms-sum">완료 <strong>${doneList.length}</strong>개 · 아직 <strong>${todoList.length}</strong>개</p>
        <div class="tms-cols">
          <section><h4>✅ 완료한 활동</h4>${doneList.length ? `<ul>${doneList.map((i) => li(i, "✅")).join("")}</ul>` : `<p class="tms-empty">아직 없어요.</p>`}</section>
          <section><h4>⬜ 아직 안 한 활동</h4>${todoList.length ? `<ul>${todoList.map((i) => li(i, "⬜")).join("")}</ul>` : `<p class="tms-empty">모두 끝냈어요! 🎉</p>`}</section>
        </div>
      </div>
    `,
    width: 640,
    confirmButtonText: "닫기"
  });
}

/** 활동 열기 탭 */
function activityAccessHTML(classroom) {
  const access = normalizeActivityAccess(classroom?.activityAccess);
  const openCount = access ? Object.values(access).filter(Boolean).length : allActivityRoutes().length;
  const stages = Object.keys(STAGE_MENUS).sort((a, b) => Number(a) - Number(b)).map((stageKey) => {
    const menu = STAGE_MENUS[stageKey];
    const rows = (menu.activities || []).map((act) => {
      const on = access ? !!access[act.route] : true;
      return `
        <li class="access-row${on ? " is-on" : ""}">
          <img src="${STAGE_IMG(Number(stageKey), act.image)}" alt="" />
          <span class="access-label">${act.label}</span>
          <button type="button" class="access-toggle" data-access-route="${act.route}" aria-pressed="${on}" aria-label="${act.label} ${on ? "닫기" : "열기"}">
            <span class="access-knob"></span><span class="access-text">${on ? "열림" : "닫힘"}</span>
          </button>
        </li>
      `;
    }).join("");
    return `
      <section class="access-stage">
        <div class="access-stage-head">
          <h4>${menu.title}</h4>
          <div class="access-stage-btns">
            <button type="button" class="btn ghost" data-access-stage="${stageKey}" data-access-value="1">모두 열기</button>
            <button type="button" class="btn ghost" data-access-stage="${stageKey}" data-access-value="0">모두 닫기</button>
          </div>
        </div>
        <ul class="access-list">${rows}</ul>
      </section>
    `;
  }).join("");
  return `
    <div class="access-panel" id="activityAccessPanel">
      <p class="access-lead">
        켜 둔 활동만 우리 반 학생들이 들어갈 수 있어요. 닫은 활동은 학생 화면에 🔒로 보여요.
        이미 한 활동의 기록과 수호책은 닫아도 그대로 볼 수 있어요.
      </p>
      <div class="access-summary">
        <strong>${openCount} / ${allActivityRoutes().length}개 열림</strong>
        ${access ? "" : `<span class="access-legacy">예전에 만든 학급이라 지금은 모든 활동이 열려 있어요.</span>`}
        <span class="access-save" id="activityAccessSave"></span>
        <span class="access-all">
          <button type="button" class="btn" data-access-all="1">전체 열기</button>
          <button type="button" class="btn ghost" data-access-all="0">전체 닫기</button>
        </span>
      </div>
      ${stages}
    </div>
  `;
}

function bindActivityAccessPanel(classroom, classKey, redraw) {
  const panel = document.getElementById("activityAccessPanel");
  if (!panel) return;
  const current = () => normalizeActivityAccess(classroom.activityAccess) || fullActivityAccess(true);
  const apply = (next) => {
    playSound("click.mp3");
    classroom.activityAccess = next;
    saveClassroomAuth({
      ...classroom,
      registeredAccountIds: buildRegisteredAccountIdMap(classroom.students || []),
      updatedAt: new Date().toISOString()
    });
    redraw();
    const note = document.getElementById("activityAccessSave");
    const fb = window.KCultureFirebase;
    if (!fb?.isReady() || typeof fb.setActivityAccess !== "function") {
      if (note) note.textContent = "📱 이 기기에 저장됨";
      return;
    }
    if (note) note.textContent = "저장 중…";
    fb.setActivityAccess(classroom.classKey || classroom.classCode || classKey, next).then((ok) => {
      const el = document.getElementById("activityAccessSave");
      if (el) el.textContent = ok ? "☁️ 학생들에게 바로 적용됐어요" : "⚠️ 저장하지 못했어요. 새로고침 후 다시 해 주세요.";
    });
  };
  panel.querySelectorAll("[data-access-route]").forEach((btn) => {
    btn.onclick = () => {
      const next = current();
      const route = btn.dataset.accessRoute;
      next[route] = !next[route];
      apply(next);
    };
  });
  panel.querySelectorAll("[data-access-stage]").forEach((btn) => {
    btn.onclick = () => {
      const next = current();
      const open = btn.dataset.accessValue === "1";
      (STAGE_MENUS[btn.dataset.accessStage]?.activities || []).forEach((act) => { next[act.route] = open; });
      apply(next);
    };
  });
  panel.querySelectorAll("[data-access-all]").forEach((btn) => {
    btn.onclick = () => apply(fullActivityAccess(btn.dataset.accessAll === "1"));
  });
}

function renderTeacherDashboardTable(classroom, progressMap, onlineAccountIds) {
  const onlineSet = onlineAccountIds instanceof Set ? onlineAccountIds : new Set();
  const view = ensureTeacherValueView();
  const tab = state.teacherDashTab === "values" || state.teacherDashTab === "access" ? state.teacherDashTab : "status";
  const classKey = classroom.classKey || classroom.classCode || "";
  const teacherNames = loadTeacherStudentNames(classKey);
  const rows = (classroom.students || [])
    .slice()
    .sort((a, b) => a.number - b.number)
    .map((student) => {
      const progress = progressMap[student.accountId];
      const missionCount = progress?.completedMissions
        ? Object.values(progress.completedMissions).filter(Boolean).length
        : 0;
      const last = progress?.updatedAt ? new Date(progress.updatedAt).toLocaleString("ko-KR") : "-";
      const onlineLabel = onlineSet.has(student.accountId) ? "🟢 접속중" : "⚪ 미접속";
  const realName = teacherNames[student.accountId] || "";
      const safeRealName = String(realName)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
      return `
        <tr>
          <td>${student.number}</td>
          <td>
            <button type="button" class="teacher-student-name-btn" data-account-id="${student.accountId}" title="수호책 보기">
              ${student.name}
            </button>
          </td>
          <td>${student.accountId}</td>
          <td>${onlineLabel}</td>
          <td><button type="button" class="teacher-mission-btn" data-account-id="${student.accountId}" title="활동별 완료 여부 보기">${missionCount} / ${allActivityRoutes().length}</button></td>
          <td>${last}</td>
          <td class="teacher-realname-cell">
            <input
              type="text"
              class="teacher-realname-input"
              data-account-id="${student.accountId}"
              maxlength="20"
              placeholder="이름 입력"
              value="${safeRealName}"
              title="이 기기에만 저장됩니다"
            />
            ${isReviewDemoClassroom(classroom) ? "" : `<button type="button" class="btn ghost teacher-student-delete-btn" data-account-id="${student.accountId}">삭제</button>`}
          </td>
        </tr>
      `;
    }).join("");

  const cloud = window.KCultureFirebase?.isReady()
    ? "☁️ Firebase 연결됨"
    : "📱 오프라인(기기 저장)";
  const onlineCount = onlineSet.size;
  const studentCount = (classroom.students || []).length;
  const valuesHTML = (tab === "values" && window.TeacherTools)
    ? window.TeacherTools.renderValuesHTML({
        classroom,
        progressMap,
        view,
        stageMenus: STAGE_MENUS,
        stageImage: STAGE_IMG
      })
    : "";
  const statusHTML = `
      <p class="small" style="margin:8px 0 0;">학생 <strong>별명</strong>을 누르면 수호책을 볼 수 있어요. <strong>이름</strong>은 선생님이 이 기기에만 적어 두는 메모예요(클라우드·학생 기기로 올라가지 않아요).</p>
      <div style="overflow:auto;margin-top:10px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">번호</th>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">별명</th>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">개인계정번호</th>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">접속</th>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">완료 미션</th>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">최근 저장</th>
              <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">이름</th>
            </tr>
          </thead>
          <tbody id="teacherDashboardBody">${rows || `<tr><td colspan="7" style="padding:12px;">아직 등록된 학생이 없어요. 학생이 학급 계정으로 로그인하면 자동 등록됩니다.</td></tr>`}</tbody>
        </table>
      </div>
  `;

  app.innerHTML = sceneTemplate(tab === "values" ? "수업활동분석" : tab === "access" ? "활동 열기" : "학급관리", `
    <div class="section-card" id="teacherDashboardRoot">
      <h3>${classroomLabel(classroom)}</h3>
      ${isReviewDemoClassroom(classroom) ? `<p class="review-demo-banner">심사용 가상 학급이에요. 수호·대한·민국·우리·나라 모두 심사용 학생으로 들어가 볼 수 있어요. 별명을 눌러 진행 상황을 확인해 보세요.</p>` : ""}
      <p>${cloud} · 등록 학생 ${studentCount}명 · 현재 접속 ${onlineCount}명</p>
      <div class="teacher-dash-tabs" role="tablist">
        <button type="button" class="teacher-dash-tab${tab === "status" ? " is-on" : ""}" data-dash-tab="status">학급 현황</button>
        <button type="button" class="teacher-dash-tab${tab === "values" ? " is-on" : ""}" data-dash-tab="values">수업활동분석</button>
        <button type="button" class="teacher-dash-tab${tab === "access" ? " is-on" : ""}" data-dash-tab="access">🔓 활동 열기</button>
      </div>
      ${tab === "values" ? valuesHTML : tab === "access" ? activityAccessHTML(classroom) : statusHTML}
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" id="refreshTeacherDashboardBtn">새로고침</button>
        ${isReviewDemoClassroom(classroom) ? "" : `<button class="btn ghost" id="deleteClassroomBtn">학급 삭제</button>`}
        <button class="btn" data-go="main">홈으로</button>
      </div>
    </div>
  `);
  setupNavigationAndHelp(tab === "values"
    ? "학생별, 활동별로 수업 활동 분석을 볼 수 있어요."
    : tab === "access"
      ? "켜 둔 활동만 우리 반 학생들이 들어갈 수 있어요."
      : "별명을 누르면 수호책을, 이름 칸에는 선생님만 보는 학생 이름을 적을 수 있어요(이 기기에만 저장).");
}

function getSessionBadgeHtml() {
  if (state.studentMode === "free") {
    return `<div class="home-status"><div class="session-badge session-badge--guest" id="sessionBadge">🎮 체험 모드 · 저장 안 됨</div></div>`;
  }
  if (state.studentMode === "registered") {
    const cloud = window.KCultureFirebase?.isReady();
    const review = isReviewDemoSession()
      ? `<div class="session-badge session-badge--review">🔎 심사용</div>`
      : "";
    const saveLabel = cloud ? "☁️ 클라우드 저장" : "📱 이 기기 저장";
    const online = cloud
      ? `<button type="button" class="session-badge session-badge--online" id="onlineBadge" title="접속 중인 친구 보기">👥 우리반 접속중 0명</button>`
      : "";
    return `
      <div class="home-status">
        ${review}
        ${online}
        <div class="session-badge session-badge--save" id="sessionBadge">${saveLabel}</div>
      </div>
    `;
  }
  if (state.loginType === "teacher") {
    const cloud = window.KCultureFirebase?.isReady();
    const review = isReviewDemoSession()
      ? `<div class="session-badge session-badge--review">🔎 심사용</div>`
      : "";
    return `
      <div class="home-status">
        ${review}
        <div class="session-badge session-badge--teacher" id="sessionBadge">${cloud ? "☁️ 학급 온라인 연결" : "📱 학급 로컬 등록"}</div>
      </div>
    `;
  }
  return "";
}

function renderTeacherDashboard() {
  stopTeacherDashboardSync();
  state.teacherBookView = null;

  const schoolInfo = state.userProfile || loadClassroomAuth() || {};
  const classKey = schoolInfo.classKey || schoolInfo.classCode;
  if (!classKey) {
    Swal.fire("앗!", "학급 정보가 없어. 먼저 교사용에서 학급을 등록해줘!", "warning");
    state.current = "main";
    render();
    return;
  }

  app.innerHTML = sceneTemplate("학급관리", `
    <div class="section-card">
      <h3>학급 로딩 중...</h3>
      <p>학생 진행 상황을 불러오고 있어요.</p>
      <button class="btn" data-go="main">홈으로</button>
    </div>
  `);
  setupNavigationAndHelp("학급관리에서 학생별 진행 상황을 확인할 수 있어요.");

  let dashboardClassroom = null;
  let dashboardProgressMap = {};
  let dashboardOnlineIds = new Set();

  const refreshDashboardView = () => {
    if (!dashboardClassroom) return;
    renderTeacherDashboardTable(dashboardClassroom, dashboardProgressMap, dashboardOnlineIds);
    bindTeacherDashboardActions(dashboardClassroom, classKey, dashboardProgressMap, dashboardOnlineIds);
  };

  loadTeacherDashboardData(classKey, schoolInfo).then((result) => {
    if (!result) {
      app.innerHTML = sceneTemplate("학급관리", `
        <div class="section-card">
          <h3>학급 정보를 찾지 못했어요.</h3>
          <p>학급 등록을 다시 진행해 주세요.</p>
          <button class="btn" data-go="main">홈으로</button>
        </div>
      `);
      setupNavigationAndHelp("학급 등록 후 다시 확인해 주세요.");
      return;
    }

    dashboardClassroom = result.classroom;
    dashboardProgressMap = result.progressMap;
    if (isReviewDemoClassroom(dashboardClassroom)) {
      dashboardOnlineIds = new Set(getReviewDemoOnlineEntries().map((item) => item.accountId));
    }
    refreshDashboardView();

    const fb = window.KCultureFirebase;
    const resolvedKey = dashboardClassroom.classKey || dashboardClassroom.classCode || classKey;
    if (fb?.isReady()) {
      _teacherDashboardUnsubs.push(
        fb.subscribeClassroom(resolvedKey, (remoteClassroom) => {
          if (!remoteClassroom) return;
          dashboardClassroom = remoteClassroom;
          if (!Array.isArray(dashboardClassroom.students)) dashboardClassroom.students = [];
          if (state.loginType === "teacher") {
            saveClassroomAuth({
              ...dashboardClassroom,
              registeredAccountIds: buildRegisteredAccountIdMap(dashboardClassroom.students),
              updatedAt: new Date().toISOString()
            });
          }
          refreshDashboardView();
        })
      );
      _teacherDashboardUnsubs.push(
        fb.subscribeClassPresence(resolvedKey, (online) => {
          const merged = withReviewDemoPresence(online, dashboardClassroom);
          dashboardOnlineIds = new Set(merged.map((item) => item.accountId).filter(Boolean));
          refreshDashboardView();
        })
      );
      _teacherDashboardUnsubs.push(
        fb.subscribeClassProgress(resolvedKey, (progressMap) => {
          dashboardProgressMap = progressMap || {};
          refreshDashboardView();
        })
      );
    }
  });
}

function bindTeacherDashboardActions(classroom, classKey, progressMap = {}, onlineAccountIds) {
  const redraw = () => {
    renderTeacherDashboardTable(classroom, progressMap, onlineAccountIds);
    bindTeacherDashboardActions(classroom, classKey, progressMap, onlineAccountIds);
  };
  const refreshBtn = document.getElementById("refreshTeacherDashboardBtn");
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      playSound("click.mp3");
      renderTeacherDashboard();
    };
  }
  app.querySelectorAll("[data-dash-tab]").forEach((btn) => {
    btn.onclick = () => {
      playSound("click.mp3");
      const want = btn.dataset.dashTab;
      state.teacherDashTab = want === "values" || want === "access" ? want : "status";
      redraw();
    };
  });
  app.querySelectorAll(".teacher-mission-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      playSound("click.mp3");
      const accountId = btn.dataset.accountId;
      const student = (classroom.students || []).find((item) => item.accountId === accountId);
      if (student) showStudentMissionStatus(student, progressMap[accountId], classroom);
    };
  });
  bindActivityAccessPanel(classroom, classKey, redraw);
  app.querySelectorAll(".teacher-value-open-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      playSound("click.mp3");
      const accountId = btn.dataset.accountId;
      const student = (classroom.students || []).find((item) => item.accountId === accountId);
      if (!student) return;
      openTeacherStudentBook(student, progressMap[accountId]);
    };
  });
  // 수업 전체 흐름 → 활동별 분석 화면으로 바로 이동
  window.__openTeacherActivityAnalysis = (activity) => {
    playSound("click.mp3");
    state.teacherValueView = { mode: "activity", studentAccountId: "", activity: activity || "", sub: "analysis" };
    redraw();
  };
  if (window.TeacherTools) {
    window.TeacherTools.bindValuesPanel(document.getElementById("teacherValuesPanel"), {
      onMode: (mode) => {
        playSound("click.mp3");
        state.teacherValueView = { mode: mode || "student", studentAccountId: "", activity: "" };
        redraw();
      },
      onStudent: (accountId) => {
        playSound("click.mp3");
        const student = (classroom.students || []).find((item) => item.accountId === accountId);
        if (!student) return;
        openTeacherStudentBook(student, progressMap[accountId]);
      },
      onActivity: (activity) => {
        playSound("click.mp3");
        state.teacherValueView = { ...(state.teacherValueView || {}), activity: activity || "" };
        redraw();
      },
      onSub: (sub) => {
        playSound("click.mp3");
        state.teacherValueView = { ...(state.teacherValueView || {}), sub: sub === "list" ? "list" : "analysis" };
        redraw();
      },
      onBack: (which) => {
        playSound("click.mp3");
        if (!state.teacherValueView) ensureTeacherValueView();
        if (which === "student") state.teacherValueView.studentAccountId = "";
        else state.teacherValueView.activity = "";
        redraw();
      },
      onGuide: (route) => {
        playSound("click.mp3");
        const base = activityBaseRoute(route);
        const item = STAGE_MENUS[Number(String(base).match(/^stage(\d+)/)?.[1])]
          ?.activities?.find((act) => act.route === base);
        window.TeacherTools.openGuide(base, {
          source: "dashboard",
          inquiryQuestion: getActivityQuestion(base)?.question || "",
          activityLabel: item?.label || window.TeacherTools.getGuide(base)?.activityTitle || ""
        });
      }
    });
  }
  app.querySelectorAll(".teacher-student-name-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const accountId = btn.dataset.accountId;
      const student = (classroom.students || []).find((item) => item.accountId === accountId);
      if (!student) return;
      openTeacherStudentBook(student, progressMap[accountId]);
    };
  });
  app.querySelectorAll(".teacher-realname-input").forEach((input) => {
    const saveName = () => {
      setTeacherStudentName(classKey, input.dataset.accountId, input.value);
      input.value = getTeacherStudentName(classKey, input.dataset.accountId);
    };
    input.addEventListener("change", saveName);
    input.addEventListener("blur", saveName);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.blur();
      }
    });
  });
  app.querySelectorAll(".teacher-student-delete-btn").forEach((btn) => {
    btn.onclick = async () => {
      const accountId = btn.dataset.accountId;
      const confirm = await Swal.fire({
        title: "학생 계정 삭제",
        text: `개인계정번호 ${accountId} 학생을 삭제할까요?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소"
      });
      if (!confirm.isConfirmed) return;
      const resultDelete = await deleteStudentAccountFromClassroom(classKey, accountId);
      if (!resultDelete.ok) {
        Swal.fire("앗!", resultDelete.message, "warning");
        return;
      }
      Swal.fire("완료!", resultDelete.cloudSynced ? "학생 계정을 클라우드에서 삭제했어요." : "학생 계정을 로컬에서 삭제했어요.", "success");
      renderTeacherDashboard();
    };
  });
  const deleteClassroomBtn = document.getElementById("deleteClassroomBtn");
  if (deleteClassroomBtn) {
    deleteClassroomBtn.onclick = async () => {
      const confirm = await Swal.fire({
        title: "학급 삭제",
        html: `<p><strong>${classroomLabel(classroom)}</strong> 학급과 학생 계정을 전부 삭제할까요?</p><p class="small">삭제 후 복구할 수 없어요.</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "학급 삭제",
        cancelButtonText: "취소"
      });
      if (!confirm.isConfirmed) return;
      await deleteClassroomAccount(classroom.classKey || classroom.classCode);
      Swal.fire("완료!", "학급 정보를 삭제했어요.", "success");
      resetLoginSession();
      render();
    };
  }
}

function closeTeacherStudentBook() {
  state.teacherBookView = null;
  state.teacherDashTab = "values";
  state.teacherValueView = { mode: "student", studentAccountId: "", activity: "" };
  state.current = "teacher_dashboard";
  render();
}

function openTeacherStudentBook(student, progress) {
  if (!student) return;
  const bookState = window.TeacherTools && typeof window.TeacherTools.bookStateFromProgress === "function"
    ? window.TeacherTools.bookStateFromProgress(progress)
    : {
        valueRecords: Array.isArray(progress?.valueRecords) ? progress.valueRecords.slice() : [],
        hanokExplorer: progress?.hanokExplorer || null,
        finalCultureReflection: progress?.finalCultureReflection || null,
        completedMissions: progress?.completedMissions || {},
        valueBook: { view: "cover", pageIndex: 0, whyWant: "", whyReason: "" }
      };
  state.teacherBookView = {
    accountId: student.accountId,
    name: student.name,
    number: student.number,
    bookState
  };
  state.teacherDashTab = "values";
  state.current = "teacher_student_book";
  render();
}

function completeRegisteredStudentLogin(classroom, matched, classKey) {
  const resolvedKey = classroom.classKey || classroom.classCode || classKey;
  state.loggedIn = true;
  state.loginType = "student";
  state.studentMode = "registered";
  state.saveEnabled = true;
  state.userProfile = {
    classKey: resolvedKey,
    accountId: matched.accountId,
    name: matched.name,
    number: matched.number
  };
  state.code = `${resolvedKey}-${matched.accountId}`;
  state.classActivityAccess = normalizeActivityAccess(classroom.activityAccess);
  state.current = "intro";
  clearNavHistory();
}

async function enterRegisteredStudent(classKey, accountId, studentName) {
  try {
    const classroom = await findClassroom(classKey);
    if (!classroom) {
      Swal.fire("앗!", "학급 정보를 찾을 수 없어. 교사에게 학급코드를 확인해줘!", "warning");
      return;
    }
    const matched = classroom.students.find((student) =>
      student.accountId === accountId && student.name === studentName
    );
    if (!matched) {
      Swal.fire("앗!", "개인계정번호 또는 별명이 맞지 않아!", "warning");
      return;
    }
    completeRegisteredStudentLogin(classroom, matched, classKey);
    await loadStudentProgress();
    startOnlineSession();
    playSound("login_success.mp3");
    render();
  } catch (err) {
    console.error("[수호대] 학생 로그인 처리 실패:", err);
    Swal.fire("앗!", "로그인 처리 중 오류가 발생했어. 다시 시도해줘!", "error");
  }
}

async function enterRegisteredStudentByCode(classCode, studentNumber, nickname) {
  try {
    const classKey = buildClassKey(classCode);
    const classroom = await findClassroom(classKey);
    if (!classroom) {
      Swal.fire("앗!", "학급코드를 찾을 수 없어. 선생님께 학급코드를 다시 확인해줘!", "warning");
      return;
    }

    const accountId = buildStudentAccountId(classKey, Number(studentNumber));
    const normalizedStudent = {
      number: Number(studentNumber),
      name: nickname.trim(),
      accountId
    };
    const updatedClassroom = await ensureStudentRegisteredInClassroom(classroom, normalizedStudent);

    completeRegisteredStudentLogin(updatedClassroom, normalizedStudent, updatedClassroom.classKey || updatedClassroom.classCode);
    await loadStudentProgress();
    startOnlineSession();
    playSound("login_success.mp3");
    render();
  } catch (err) {
    console.error("[수호대] 학생 로그인 처리 실패:", err);
    Swal.fire("앗!", "로그인 처리 중 오류가 발생했어. 다시 시도해줘!", "error");
  }
}

function enterFreeStudent(nickname) {
  state.loggedIn = true;
  state.loginType = "student";
  state.studentMode = "free";
  state.saveEnabled = false;
  state.userProfile = { name: nickname || "게스트" };
  state.code = "free";
  state.current = "intro";
  clearNavHistory();
  resetSessionProgress();
  playSound("login_success.mp3");
  render();
}

const SOUND_ALIASES = {
  "click.mp3": "click.wav",
  "correct.mp3": "taegeukgi-complete.wav",
  "wrong.mp3": "taegeukgi-bounce.wav",
  "snap.mp3": "taegeukgi-snap.wav",
  "artifact.mp3": "taegeukgi-fanfare.wav"
};

let _activeSoundAudio = null;
function playSoftClickFallback() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(280, now + 0.14);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.17);
}

function playSound(fileOrFiles) {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  const resolveSoundPath = (file) => {
    if (typeof file === "string" && file.includes("/")) return file;
    return SND(SOUND_ALIASES[file] || file);
  };
  if (_activeSoundAudio) {
    _activeSoundAudio.pause();
    _activeSoundAudio.currentTime = 0;
    _activeSoundAudio = null;
  }
  const tryPlay = (idx) => {
    if (idx >= files.length) {
      const isClick = files.some((f) => f === "click.mp3" || f === "click.wav" || String(f).endsWith("/click.mp3") || String(f).endsWith("/click.wav"));
      if (isClick) playSoftClickFallback();
      return;
    }
    const audio = new Audio(resolveSoundPath(files[idx]));
    audio.volume = (files[idx] === "click.mp3" || files[idx] === "click.wav") ? 0.65 : 1;
    _activeSoundAudio = audio;
    audio.onended = () => {
      if (_activeSoundAudio === audio) _activeSoundAudio = null;
    };
    audio.play().catch(() => {
      if (_activeSoundAudio === audio) _activeSoundAudio = null;
      tryPlay(idx + 1);
    });
  };
  tryPlay(0);
}

let _lastSpeakText = "";
let _lastSpeakAt = 0;
let _speakTextToken = 0;
function speakLine(text, file = "voice_default.mp3") {
  const now = Date.now();
  if (text === _lastSpeakText && now - _lastSpeakAt < 3500) return;
  _lastSpeakText = text;
  _lastSpeakAt = now;
  playSound(file);
}

function plainTextFromHtml(text) {
  return String(text || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickKoreanVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find((v) => v.lang === "ko-KR")
    || voices.find((v) => String(v.lang).toLowerCase().startsWith("ko"))
    || null;
}

function isCoarsePointer() {
  return document.documentElement.classList.contains("is-tablet")
    || window.matchMedia("(pointer: coarse)").matches
    || window.matchMedia("(any-pointer: coarse)").matches
    || (navigator.maxTouchPoints || 0) > 1;
}

function markSpeakButtons(speaking) {
  ["moneyReplay", "hgVoice", "inquiryListenBtn"].forEach((id) => {
    document.getElementById(id)?.classList.toggle("is-speaking", !!speaking);
  });
}

function stopSpeechVoice() {
  try { window.speechSynthesis?.cancel(); } catch (_) {}
  markSpeakButtons(false);
}

function prepareSpeechEngine() {
  const synth = window.speechSynthesis;
  if (!synth) return;
  try { synth.getVoices(); } catch (_) {}
  try {
    const warm = new SpeechSynthesisUtterance(" ");
    warm.lang = "ko-KR";
    warm.volume = 0;
    warm.rate = 2;
    synth.speak(warm);
    synth.cancel();
  } catch (_) {}
}

function speakTextKorean(text) {
  const raw = plainTextFromHtml(text);
  if (!raw) return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  const token = (_speakTextToken += 1);
  try { synth.cancel(); } catch (_) {}
  markSpeakButtons(false);

  const utter = new SpeechSynthesisUtterance(raw);
  utter.lang = "ko-KR";
  utter.rate = 0.9;
  utter.pitch = 1.05;
  const voice = pickKoreanVoice();
  if (voice) utter.voice = voice;
  utter.onstart = () => { if (token === _speakTextToken) markSpeakButtons(true); };
  utter.onend = () => { if (token === _speakTextToken) markSpeakButtons(false); };
  utter.onerror = () => { if (token === _speakTextToken) markSpeakButtons(false); };

  try { synth.speak(utter); } catch (_) {}
  // iPad/Safari는 speak 직후 pause/resume을 해야 실제로 재생되는 경우가 많음
  if (isCoarsePointer()) {
    try {
      synth.pause();
      synth.resume();
    } catch (_) {}
  }
}

function bindSpeakButton(el, getText) {
  if (!el) return;
  let spokenAt = 0;
  const fire = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - spokenAt < 350) return;
    spokenAt = now;
    prepareSpeechEngine();
    speakTextKorean(typeof getText === "function" ? getText() : getText);
  };
  el.addEventListener("pointerup", fire);
  el.addEventListener("click", fire);
}

if (window.speechSynthesis?.getVoices) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    window.speechSynthesis.getVoices();
  });
}
document.addEventListener("pointerdown", prepareSpeechEngine, { capture: true, once: true });

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getStageNumber() {
  const match = state.current.match(/^stage(\d)/);
  return match ? match[1] : null;
}

function isActivityScreen() {
  return /^stage\d+_a\d+(_hoist)?$/.test(state.current);
}

function getActivityMenuRoute() {
  const m = state.current.match(/^(stage\d+)_a\d+(?:_hoist)?$/);
  return m ? `${m[1]}_menu` : null;
}

function getActivityQuestion(route) {
  const base = activityBaseRoute(route || state.current);
  return activityQuestions[base] || null;
}

function syncActivityIntroGate() {
  const key = activityBaseRoute(state.current);
  if (key !== lastActivityIntroKey) {
    skipActivityIntro = false;
    lastActivityIntroKey = key;
  }
}

function isActivityIntroVisible() {
  const cur = state.current;
  const base = activityBaseRoute(cur);
  return !!(getActivityQuestion(base) && cur === base && !skipActivityIntro);
}

function beginActivityFromIntro() {
  stopSpeechVoice();
  playSound("click.mp3");
  skipActivityIntro = true;
  render();
}

function escapeInquiryText(text) {
  return String(text || "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function renderActivityQuestion(route) {
  const base = activityBaseRoute(route || state.current);
  const data = getActivityQuestion(base);
  if (!data) {
    skipActivityIntro = true;
    render();
    return;
  }
  const stageNum = getStageNumber();
  const menu = getActivityMenuRoute();
  const question = escapeInquiryText(data.question).replace(/\n/g, "<br>");
  const bg = stageNum ? IMG(`stage${stageNum}-bg.png`) : IMG("stage1-bg.png");
  const card = data.image
    ? `<div class="inquiry-card inquiry-card--image">
         <img class="inquiry-card-img" src="${QUESTION_IMG(data.image)}" alt="${question.replace(/<br>/g, " ")}" />
       </div>`
    : `<div class="inquiry-card">
         <p class="inquiry-kicker">오늘의 탐구 질문</p>
         <p class="inquiry-question">${question}</p>
       </div>`;

  app.innerHTML = `
    <div class="stage-screen stage-screen--menu inquiry-stage">
      <img class="stage-bg" src="${bg}" alt="" decoding="async" fetchpriority="low" />
      <div class="stage-overlay stage-overlay--menu inquiry-overlay">
        <div class="activity-toolbar">
          <button type="button" class="act-btn act-tl" id="activityMenuBtn" data-menu="${menu || "main"}">◀ 활동 선택</button>
          ${teacherLessonGuideButtonHTML(base)}
        </div>
        <div class="inquiry-screen">
          <h2 class="inquiry-heading">💡 생각해 볼까요?</h2>
          ${card}
          <button type="button" class="inquiry-listen-btn" id="inquiryListenBtn">🔊 질문 듣기</button>
          <button type="button" class="inquiry-start-btn" id="inquiryStartBtn">▶ 활동 시작하기</button>
        </div>
      </div>
    </div>
  `;

  bindSpeakButton(document.getElementById("inquiryListenBtn"), data.question);
  const startBtn = document.getElementById("inquiryStartBtn");
  if (startBtn) startBtn.onclick = () => beginActivityFromIntro();
}

/* ───────────── 전역 ◀ 이전 버튼 (왼쪽 하단) ───────────── */
const LOGIN_BACK_PARENT = {
  select: null,
  teacher: "select",
  teacher_select: "teacher",
  teacher_setup: "teacher_select",
  teacher_existing: "teacher_select",
  student: "select",
  student_registered: "student",
  student_free: "student",
  review: "select"
};

let navHistory = [];
let lastNavKey = null;
let skipNavHistoryPush = false;

function getNavKey() {
  if (!state.loggedIn) return `login:${state.loginFlow || "select"}`;
  return `screen:${state.current}`;
}

function clearNavHistory() {
  navHistory = [];
  skipNavHistoryPush = true;
}

function rememberNavHistory() {
  const key = getNavKey();
  if (skipNavHistoryPush) {
    skipNavHistoryPush = false;
    lastNavKey = key;
    updateGlobalBackButton();
    updateGlobalNextButton();
    return;
  }
  if (lastNavKey != null && lastNavKey !== key) {
    navHistory.push(lastNavKey);
    if (navHistory.length > 40) navHistory.shift();
  }
  lastNavKey = key;
  updateGlobalBackButton();
  updateGlobalNextButton();
}

function getHierarchicalBackTarget() {
  if (!state.loggedIn) {
    const parent = LOGIN_BACK_PARENT[state.loginFlow || "select"];
    return parent != null ? `login:${parent}` : null;
  }
  const cur = state.current;
  if (cur === "stage1_a1_hoist") return "screen:stage1_a1";
  if (/^stage\d+_a\d+/.test(cur)) {
    const menu = getActivityMenuRoute();
    return menu ? `screen:${menu}` : "screen:main";
  }
  if (/^stage\d+_menu$/.test(cur)) return "screen:main";
  if (cur === "teacher_student_album" || cur === "teacher_student_book") return "screen:teacher_dashboard";
  if (cur === "teacher_dashboard" || cur === "treasure_album" || cur === "value_book" || cur === "classroom_extension") return "screen:main";
  if (cur === "intro") return "login:select";
  if (cur === "main") return "login:select";
  return null;
}

function canGoBack() {
  if (state.valueReflection?.active) return true;
  if (tryPeekInternalBack()) return true;
  if (navHistory.length > 0) return true;
  return getHierarchicalBackTarget() != null;
}

function activityNavInfo() {
  if (isActivityIntroVisible()) return null;
  const cur = state.current;

  if (cur === "stage1_a1" || cur === "stage1_a1_hoist") {
    const h = state.tgHoist || { phase: "match", currentHoliday: TG_HOLIDAYS[0].id };
    let index = 0;
    if (cur === "stage1_a1_hoist") {
      if (h.phase !== "hoist") index = 1;
      else {
        const holIdx = TG_HOLIDAYS.findIndex((x) => x.id === h.currentHoliday);
        index = 2 + Math.max(0, holIdx);
      }
    }
    return {
      index,
      length: 2 + TG_HOLIDAYS.length,
      apply(i) {
        if (i <= 0) {
          state.current = "stage1_a1";
          return;
        }
        const hoist = tgHoistInit();
        state.current = "stage1_a1_hoist";
        if (i === 1) {
          hoist.phase = "match";
          return;
        }
        const holIdx = Math.min(TG_HOLIDAYS.length - 1, i - 2);
        hoist.phase = "hoist";
        hoist.currentHoliday = TG_HOLIDAYS[holIdx].id;
        hoist.poleComplete = false;
        hoist.lastSpoken = null;
      }
    };
  }

  if (cur === "stage1_a2") {
    const m = muguInit();
    return {
      index: muguNavIndex(m),
      length: muguNavSteps().length,
      apply(i, dir) { muguApplyNavStep(m, muguNavSteps()[i], dir); }
    };
  }

  if (cur === "stage1_a3") {
    const a = getAnthemState();
    let index = 0;
    if (a.screen === "play") index = 1;
    else if (a.screen === "result" || a.finished) index = 2;
    return {
      index,
      length: 3,
      apply(i) {
        stopAnthemGame();
        a.playing = false;
        if (i <= 0) {
          a.screen = "intro";
          a.finished = false;
        } else if (i === 1) {
          a.screen = "play";
          a.finished = false;
        } else {
          a.screen = "result";
          a.finished = true;
        }
      }
    };
  }

  if (cur === "stage1_a4") {
    const m = moneyInit();
    return {
      index: moneyNavIndex(m),
      length: moneyNavSteps().length,
      apply(i) { moneyApplyNavStep(m, i); }
    };
  }

  if (cur === "stage2_a1") {
    if (state.hangulQuiz == null) state.hangulQuiz = 0;
    if (state.hangulPhase !== "puzzle") state.hangulPhase = "video";
    const quizLen = HANGUL_QUIZZES.length;
    const index = state.hangulPhase === "video"
      ? 0
      : 1 + Math.max(0, Math.min(state.hangulQuiz, quizLen - 1));
    return {
      index,
      length: 1 + quizLen,
      apply(i) {
        stopHangulVideo();
        if (i <= 0) {
          state.hangulPhase = "video";
          state.hangulQuiz = 0;
          return;
        }
        state.hangulPhase = "puzzle";
        state.hangulQuiz = Math.max(0, Math.min(i - 1, quizLen - 1));
      }
    };
  }

  if (cur === "stage2_a2") {
    // 인트로 → 탐방(장소 순서) → 만들기(과정 순서) → 이후(비교 등)
    const tourLen = (window.HanokTour && typeof window.HanokTour.getGuideLength === "function")
      ? window.HanokTour.getGuideLength()
      : 13;
    const buildLen = (window.HanokGame && typeof window.HanokGame.getPhaseCount === "function")
      ? window.HanokGame.getPhaseCount()
      : 6;
    const stepsLen = 2 + tourLen + buildLen + 1; // exterior, gate, tour..., build..., after
    const e = state.hanokExplorer || {};
    const phase = e.phase || "exterior";
    let index = 0;
    if (phase === "exterior") index = 0;
    else if (phase === "gate") index = 1;
    else if (phase === "exploring") {
      const gi = (window.HanokTour && typeof window.HanokTour.getGuideIndex === "function")
        ? window.HanokTour.getGuideIndex(state.hanokTour)
        : (state.hanokTour?.guideIndex || 0);
      index = 2 + Math.max(0, Math.min(gi, tourLen - 1));
    } else if (phase === "building") {
      const bi = state.hanok?.clayPhase ?? (
        (window.HanokGame && typeof window.HanokGame.getPhaseIndex === "function")
          ? window.HanokGame.getPhaseIndex()
          : 0
      );
      index = 2 + tourLen + Math.max(0, Math.min(bi, buildLen - 1));
    } else {
      index = stepsLen - 1; // bridge·compare·choose·reflect·journal·done
    }
    return {
      index,
      length: stepsLen,
      apply(i) {
        const nextIdx = Math.max(0, Math.min(i, stepsLen - 1));
        if (!state.hanokExplorer && window.HanokExplorer) {
          state.hanokExplorer = window.HanokExplorer.createDefaultState();
        }
        if (!state.hanokTour && window.HanokTour) {
          state.hanokTour = window.HanokTour.createDefaultState();
        }
        if (!state.hanok && window.HanokGame) {
          state.hanok = window.HanokGame.createDefaultState();
        }
        if (!state.hanokExplorer) return;

        if (nextIdx === 0) {
          state.hanokExplorer.phase = "exterior";
          if (state.hanokTour) state.hanokTour.building = false;
          return;
        }
        if (nextIdx === 1) {
          state.hanokExplorer.phase = "gate";
          if (state.hanokTour) state.hanokTour.building = false;
          return;
        }
        if (nextIdx < 2 + tourLen) {
          const guideIdx = nextIdx - 2;
          state.hanokExplorer.phase = "exploring";
          if (state.hanokTour) state.hanokTour.building = false;
          if (window.HanokTour && typeof window.HanokTour.applyGuideStep === "function") {
            window.HanokTour.applyGuideStep(guideIdx, state.hanokTour);
          } else if (state.hanokTour) {
            state.hanokTour.guideIndex = guideIdx;
          }
          return;
        }
        if (nextIdx < 2 + tourLen + buildLen) {
          const buildIdx = nextIdx - 2 - tourLen;
          state.hanokExplorer.phase = "building";
          if (state.hanokTour) {
            state.hanokTour.building = true;
            state.hanokTour.guideIndex = tourLen - 1;
          }
          if (!state.hanok && window.HanokGame) {
            state.hanok = window.HanokGame.createDefaultState();
          }
          if (state.hanok) {
            state.hanok.clayPhase = buildIdx;
            state.hanok.phase = "game";
          }
          return;
        }
        // after: 만들기 다음 — 비교(bridge)로
        if (state.hanokTour) state.hanokTour.building = true;
        state.hanokExplorer.phase = "bridge";
      }
    };
  }

  if (cur === "stage2_a3") {
    // 완료 여부와 상관없이 pick → 문양1 → 문양2 → 자랑 → 갤러리 이동 가능
    const dc = state.dancheong || createDefaultDancheongState();
    const patternCount = DANCHEONG_PATTERNS.length;
    const length = 1 + patternCount + 2; // pick + patterns + share + gallery
    let index = 0;
    if (dc.phase === "color") {
      const p = DANCHEONG_PATTERNS.findIndex((x) => x.id === dc.currentPattern);
      index = 1 + Math.max(0, p);
    } else if (dc.phase === "share") index = 1 + patternCount;
    else if (dc.phase === "gallery") index = 1 + patternCount + 1;
    else index = 0;
    return {
      index,
      length,
      apply(i) {
        if (!state.dancheong) state.dancheong = createDefaultDancheongState();
        const nextIdx = Math.max(0, Math.min(i, length - 1));
        if (nextIdx <= 0) {
          state.dancheong.phase = "pick";
          state.dancheong.currentPattern = null;
          return;
        }
        if (nextIdx <= patternCount) {
          state.dancheong.phase = "color";
          state.dancheong.currentPattern = DANCHEONG_PATTERNS[nextIdx - 1].id;
          return;
        }
        if (nextIdx === 1 + patternCount) {
          state.dancheong.phase = "share";
          return;
        }
        state.dancheong.phase = "gallery";
      }
    };
  }

  if (cur === "stage3_a1") {
    // 옷입히기 → 자랑 → 갤러리 (완료·등록 여부와 상관없이 이동)
    const hb = ensureHanbokState();
    let index = 0;
    if (hb.phase === "share") index = 1;
    else if (hb.phase === "gallery") index = 2;
    return {
      index,
      length: 3,
      apply(i) {
        if (i <= 0) {
          hb.phase = "dress";
          return;
        }
        if (i === 1) {
          hb.phase = "share";
          return;
        }
        hb.phase = "gallery";
      }
    };
  }

  if (cur === "stage3_a2") {
    // 비빔밥: 요리 화면 한 단계 (다음 → 수호책)
    return {
      index: 0,
      length: 1,
      apply() {
        ensureFoodState();
        state.food.screen = "cook";
      }
    };
  }

  if (cur === "stage3_a3") {
    const h = state.holiday || createDefaultHolidayState();
    const length = HOLIDAY_CARDS.length + 1;
    const index = h.done >= h.total ? length - 1 : Math.max(0, Math.min(h.index, HOLIDAY_CARDS.length - 1));
    return {
      index,
      length,
      apply(i) {
        if (!state.holiday) state.holiday = createDefaultHolidayState();
        if (i >= HOLIDAY_CARDS.length) {
          state.holiday.index = HOLIDAY_CARDS.length;
          state.holiday.done = HOLIDAY_CARDS.length;
        } else {
          state.holiday.index = i;
          state.holiday.done = i;
        }
      }
    };
  }

  if (cur === "stage4_a1") {
    const canOnline = state.studentMode === "registered" && window.KCultureFirebase?.isReady();
    const mode = state.yutOnline?.mode;

    if (canOnline && mode === "online") {
      return {
        index: 2,
        length: 3,
        apply(i) {
          const rooms = state.yutOnline?.availableRooms || [];
          stopYutOnlineSync({ leaveRoom: true });
          if (i <= 0) return;
          state.yutOnline = { mode: "room_pick", availableRooms: rooms };
        }
      };
    }

    const prefix = [];
    if (canOnline) prefix.push("mode");
    if (mode === "room_pick") prefix.push("room_pick");
    const screens = prefix.concat(["token", "choose", "play", "over"]);
    const y = state.yut;
    let name = "token";
    if (canOnline && !mode) name = "mode";
    else if (mode === "room_pick") name = "room_pick";
    else if (!y || y.phase === "token") name = "token";
    else if (y.phase === "choose") name = "choose";
    else if (y.phase === "over") name = "over";
    else name = "play";
    return {
      index: Math.max(0, screens.indexOf(name)),
      length: screens.length,
      apply(i) {
        const nextName = screens[i];
        if (nextName === "mode") {
          stopYutOnlineSync({ leaveRoom: true });
          return;
        }
        if (nextName === "room_pick") {
          const rooms = state.yutOnline?.availableRooms || [];
          stopYutOnlineSync({ leaveRoom: true });
          state.yutOnline = { mode: "room_pick", availableRooms: rooms };
          return;
        }
        if (state.yutOnline?.mode === "online") stopYutOnlineSync({ leaveRoom: true });
        if (canOnline) state.yutOnline = { mode: "offline" };
        if (!state.yut) yutNewGame();
        if (nextName === "token") {
          state.yut.phase = "token";
        } else if (nextName === "choose") {
          if (!state.yut.tokenYou) state.yut.tokenYou = 1;
          state.yut.phase = "choose";
        } else if (nextName === "play") {
          if (!state.yut.tokenYou) state.yut.tokenYou = 1;
          state.yut.phase = "throw";
        } else {
          state.yut.phase = "over";
        }
      }
    };
  }

  if (cur === "stage4_a2") {
    const step = state.ttakjiStep == null ? -1 : state.ttakjiStep;
    return {
      index: step + 1,
      length: TTAKJI_STEPS.length + 1,
      apply(i) { state.ttakjiStep = i - 1; }
    };
  }

  if (cur === "stage4_a3") {
    const r = state.rhythm || { screen: "song", song: null, level: 1 };
    const hasSemachi = r.level === 3 || r.screen === "semachi";
    const screens = hasSemachi
      ? ["song", "levels", "semachi", "play", "ending"]
      : ["song", "levels", "play", "ending"];
    let index = screens.indexOf(r.screen);
    if (index < 0) index = 0;
    return {
      index,
      length: screens.length,
      apply(i) {
        stopRhythmGame();
        stopSemachiPractice();
        if (!state.rhythm) state.rhythm = { screen: "song", song: null, level: 1 };
        if (!state.rhythm.song) state.rhythm.song = "gyeonggi";
        state.rhythm.screen = screens[i];
      }
    };
  }

  if (cur === "stage4_a4") {
    if (state.talchumStep == null) state.talchumStep = 0;
    if (!state.talchumPhase) state.talchumPhase = "masks";
    const danceLen = TALCHUM_MOVES.length;
    const phase = state.talchumPhase === "dance" ? "dance" : "masks";
    const index = phase === "masks" ? 0 : 1 + Math.max(0, Math.min(state.talchumStep, danceLen - 1));
    return {
      index,
      length: 1 + danceLen,
      apply(i) {
        if (i <= 0) {
          state.talchumPhase = "masks";
          stopTalchumGame();
          return;
        }
        state.talchumPhase = "dance";
        state.talchumStep = Math.max(0, Math.min(i - 1, danceLen - 1));
      }
    };
  }

  return null;
}

function tryPeekInternalBack() {
  if (!state.loggedIn) return false;
  const info = activityNavInfo();
  return !!(info && info.index > 0);
}

function tryInternalBack() {
  return activityGoNav(-1);
}

function tryPeekInternalNext() {
  if (!state.loggedIn) return false;
  const info = activityNavInfo();
  return !!(info && info.index < info.length - 1);
}

function tryInternalNext() {
  return activityGoNav(1);
}

function activityGoNav(dir) {
  if (!state.loggedIn) return false;
  const info = activityNavInfo();
  if (!info) return false;
  // 모든 활동은 끝까지 풀지 않아도 「다음」으로 자유롭게 넘어갈 수 있다.
  if (dir === 1 && state.current === "stage4_a4" && (state.talchumPhase || "masks") !== "dance") {
    goToTalchumDanceWithWearPick();
    return true;
  }
  const next = info.index + dir;
  if (next < 0) return false;
  if (next >= info.length) {
    // 끝에서는 goToNextScreen이 수호책·다음 활동을 처리한다. 여기서 미션완료로 가로채지 않는다.
    return false;
  }
  // 탈춤 따라하기 중에는 동작만 바꾸고 카메라/인식은 유지
  if (state.current === "stage4_a4" && state.talchumPhase === "dance" && talchumGame?.selectMove) {
    const nextDance = info.index + dir;
    if (nextDance >= 1 && nextDance < info.length) {
      skipNavHistoryPush = true;
      info.apply(nextDance, dir);
      talchumGame.selectMove(nextDance - 1);
      updateGlobalBackButton();
      updateGlobalNextButton();
      return true;
    }
  }
  stopActiveActivityMedia();
  skipNavHistoryPush = true;
  info.apply(next, dir);
  render();
  return true;
}

function applyNavTarget(target) {
  skipNavHistoryPush = true;
  if (target.startsWith("login:")) {
    stopActiveActivityMedia();
    const flow = target.slice(6);
    if (state.loggedIn) {
      resetLoginSession();
      state.loginFlow = flow === "select" ? "select" : flow;
    } else {
      state.loginFlow = flow;
    }
    render();
    return;
  }
  if (target.startsWith("screen:")) {
    stopActiveActivityMedia();
    state.current = target.slice(7);
    render();
  }
}

async function goToPreviousScreen() {
  // 가치수호록(문화수호책 질문) 화면에서는 해당 활동의 마지막 장면으로 돌아간다.
  if (state.valueReflection?.active) {
    playSound("click.mp3");
    const route = normalizeMissionRoute(state.valueReflection.route || state.current);
    state.valueReflection.active = false;
    state.valueReflection.pending = false;
    // 「다음」을 다시 누르기 전에는 수호록을 자동으로 다시 열지 않음
    state.valueReflection.dismissedByBack = true;
    if (window.ValueReflectionFlow) window.ValueReflectionFlow.stop();
    if (route && MISSION_TREASURES[route]) state.current = route;
    skipNavHistoryPush = true;
    render();
    return;
  }

  if (tryInternalBack()) {
    playSound("click.mp3");
    return;
  }

  if (navHistory.length > 0) {
    playSound("click.mp3");
    const prev = navHistory.pop();
    // 로그인↔게임 경계를 넘을 때는 확인
    if (state.loggedIn && prev.startsWith("login:")) {
      const res = await Swal.fire({
        title: "로그인 화면으로",
        text: "로그인 화면으로 나갈까요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "나가기",
        cancelButtonText: "취소"
      });
      if (!res.isConfirmed) {
        navHistory.push(prev);
        return;
      }
    }
    applyNavTarget(prev);
    return;
  }

  const fallback = getHierarchicalBackTarget();
  if (!fallback) return;

  if (state.loggedIn && fallback.startsWith("login:")) {
    const res = await Swal.fire({
      title: "로그인 화면으로",
      text: "로그인 화면으로 나갈까요?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "나가기",
      cancelButtonText: "취소"
    });
    if (!res.isConfirmed) return;
  }

  playSound("click.mp3");
  applyNavTarget(fallback);
}

function updateGlobalBackButton() {
  const btn = document.getElementById("globalBackBtn");
  if (!btn) return;
  if (state.current === "intro") {
    btn.hidden = true;
    return;
  }
  btn.disabled = !canGoBack();
  btn.hidden = false;
}

function updateGlobalNextButton() {
  const btn = document.getElementById("globalNextBtn");
  if (!btn) return;
  if (state.current === "intro") {
    btn.hidden = true;
    return;
  }
  const loggedIn = !!state.loggedIn;
  // 활동 「다음」으로 펼친 내 수호책에서는 「다음」으로 다음 활동까지 이어 간다
  const bookFromActivity = state.current === "value_book" && !!state.valueBookFromRoute;
  if (!bookFromActivity
    && (state.current === "value_book" || state.current === "teacher_student_book" || state.current === "classroom_extension")) {
    btn.hidden = true;
    return;
  }
  // 수호책 질문 중에도 「다음」표시 (이미 기록이 있거나 건너뛸 때 사용)
  if (state.valueReflection?.pending && !state.valueReflection?.active) {
    btn.hidden = true;
    return;
  }
  btn.hidden = !loggedIn;
  btn.disabled = !loggedIn || !canGoNext();
}

function activityBaseRoute(route) {
  const m = String(route).match(/^(stage\d+_a\d+)/);
  return m ? m[1] : route;
}

/* ───────────── 활동 열기(교사가 학급 전체에 활동별로 권한 조절) ─────────────
 * 학급 문서의 activityAccess = { stage1_a1: true, ... }
 *  - 값이 없는 예전 학급: 모든 활동 열림
 *  - 새로 만든 학급: {} → 모든 활동 잠김, 교사가 하나씩 연다
 * 교사·체험 모드·심사용이 아닌 "학급 학생"에게만 적용한다. 이미 한 활동의 기록·수호책은 그대로 볼 수 있다. */
function allActivityRoutes() {
  return Object.keys(MISSION_TREASURES);
}

function normalizeActivityAccess(raw) {
  if (!raw || typeof raw !== "object") return null;
  const out = {};
  allActivityRoutes().forEach((route) => { out[route] = raw[route] === true; });
  return out;
}

function fullActivityAccess(open) {
  const out = {};
  allActivityRoutes().forEach((route) => { out[route] = !!open; });
  return out;
}

function isActivityRouteKey(route) {
  return /^stage\d+_a\d+/.test(String(route || ""));
}

function isActivityOpenForStudent(route) {
  if (state.loginType !== "student" || state.studentMode !== "registered") return true;
  const access = state.classActivityAccess;
  if (!access) return true;
  return access[activityBaseRoute(route)] === true;
}

function getNextActivityRoute() {
  const cur = state.current;
  if (cur === "intro") return "main";
  if (cur === "main") return "stage1_menu";
  if (cur === "teacher_student_album" || cur === "teacher_student_book") return "teacher_dashboard";
  if (cur === "treasure_album" || cur === "teacher_dashboard" || cur === "value_book" || cur === "classroom_extension") return "main";
  const menuMatch = String(cur).match(/^stage(\d+)_menu$/);
  if (menuMatch) {
    const acts = STAGE_MENUS[Number(menuMatch[1])]?.activities;
    return acts?.[0]?.route || null;
  }
  const actMatch = String(cur).match(/^stage(\d+)_a(\d+)/);
  if (actMatch) {
    const stage = Number(actMatch[1]);
    const acts = STAGE_MENUS[stage]?.activities || [];
    const base = activityBaseRoute(cur);
    const idx = acts.findIndex((a) => a.route === base);
    if (idx >= 0 && idx < acts.length - 1) return acts[idx + 1].route;
    if (stage < 4) return `stage${stage + 1}_menu`;
    return "main";
  }
  return null;
}

function canGoNext() {
  if (!state.loggedIn) return false;
  if (isActivityIntroVisible()) return false;
  // 수호책 질문 중: 저장이 끝난 뒤에만 「다음」으로 다음 활동 이동
  // (정리·확인 중에 나가면 최종 정리가 안 된 것처럼 보임)
  if (state.valueReflection?.active) {
    return state.valueReflection.step === "saved";
  }
  const info = activityNavInfo();
  if (info) {
    // 완료·기록 여부와 상관없이 내부 단계 또는 다음 활동으로 이동 가능
    if (info.index < info.length - 1) return true;
    if (getNextActivityRoute() != null) return true;
    // 마지막 활동이어도 수호책 질문을 열 수 있음
    if (isActivityScreen()) return true;
    return false;
  }
  return getNextActivityRoute() != null;
}

/* 이미 기록이 있는 활동: 내가 쓴 수호책 페이지를 펼쳐 준다.
 * 수호책에서 「다음」을 누르면 다음 활동으로 이어진다. */
function openValueBookForActivity(route) {
  const r = normalizeMissionRoute(route || state.current);
  const activity = activityKeyForRoute(r);
  if (!activity || !window.ValueGuardianBook || typeof window.ValueGuardianBook.openActivityPage !== "function") {
    return false;
  }
  stopActiveActivityMedia();
  pauseValueReflection();
  window.ValueGuardianBook.openActivityPage(state, activity, STAGE_MENUS);
  state.valueBookFromRoute = r;
  state.current = "value_book";
  render();
  return true;
}

function leaveValueReflectionToNext() {
  const savedRoute = normalizeMissionRoute(state.valueReflection?.route || state.current);
  if (window.ValueReflectionFlow) window.ValueReflectionFlow.stop();
  pauseValueReflection();
  stopActiveActivityMedia();
  const next = getNextActivityRouteFrom(savedRoute) || "main";
  if (/^stage\d+_a\d+$/.test(next)) resetActivityState(next);
  state.current = next;
  render();
}

function goToNextScreen() {
  if (!canGoNext()) return;
  playSound("click.mp3");

  // 수호책 질문 중 「다음」→ 저장 완료 후에만 다음 활동
  if (state.valueReflection?.active) {
    if (state.valueReflection.step !== "saved") return;
    leaveValueReflectionToNext();
    return;
  }

  // 활동 「다음」으로 펼친 내 수호책 → 다음 활동
  if (state.current === "value_book" && state.valueBookFromRoute) {
    const from = state.valueBookFromRoute;
    state.valueBookFromRoute = null;
    stopActiveActivityMedia();
    const nextFromBook = getNextActivityRouteFrom(from) || "main";
    if (/^stage\d+_a\d+$/.test(nextFromBook)) resetActivityState(nextFromBook);
    state.current = nextFromBook;
    render();
    return;
  }

  const info = activityNavInfo();
  const currentRoute = normalizeMissionRoute(state.current);

  // 1) 활동 내부 단계가 남아 있으면 무조건 한 단계만 전진 (완료·기록 무시)
  if (info && info.index < info.length - 1) {
    if (tryInternalNext()) return;
  }

  // 2) 활동 마지막: 기록이 있으면 내가 쓴 수호책 페이지를, 없으면 수호책 질문을 연다
  if (isActivityScreen() && (!info || info.index >= info.length - 1)) {
    if (hasCompleteValueRecord(currentRoute)) {
      if (openValueBookForActivity(currentRoute)) return;
    }
    if (beginValueReflection(currentRoute, { fromNext: true, force: true })) return;
  }

  // 3) 수호책을 열 수 없으면 다음 활동으로
  stopActiveActivityMedia();
  const next = getNextActivityRoute();
  if (!next) return;
  if (/^stage\d+_a\d+$/.test(next)) resetActivityState(next);
  state.current = next;
  render();
}

function isTeacherLogin() {
  return state.loginType === "teacher";
}

function teacherLessonGuideButtonHTML(route) {
  if (!isTeacherLogin() || !window.TeacherTools) return "";
  const base = activityBaseRoute(route || state.current);
  if (!window.TeacherTools.getGuide(base)) return "";
  return window.TeacherTools.guideButtonHTML();
}

function bindTeacherLessonGuideButton(route) {
  if (!isTeacherLogin() || !window.TeacherTools) return;
  const base = activityBaseRoute(route || state.current);
  const item = STAGE_MENUS[Number(String(base).match(/^stage(\d+)/)?.[1])]
    ?.activities?.find((act) => act.route === base);
  window.TeacherTools.bindGuideButton({
    route: base,
    source: state.current === "teacher_dashboard" ? "dashboard" : "activity",
    playSound,
    inquiryQuestion: getActivityQuestion(base)?.question || "",
    activityLabel: item?.label || window.TeacherTools.getGuide(base)?.activityTitle || ""
  });
}

function activityToolbarHTML() {
  const menu = getActivityMenuRoute();
  return `
    <div class="activity-toolbar">
      <button type="button" class="act-btn act-tl" id="activityMenuBtn" data-menu="${menu}">◀ 활동 선택</button>
      ${teacherLessonGuideButtonHTML()}
      <button type="button" class="act-btn act-tr" id="retryActivityBtn">↺ 다시 하기</button>
    </div>
  `;
}

function resetActivityState(route) {
  // 보물(완료 기록)은 유지하고, 활동을 다시 시작할 때는 진행 상태(내부 단계·정답 여부)를 항상 처음으로 되돌린다.
  if (route === "stage1_a1" || route === "stage1_a1_hoist") {
    state.tgPlaced = null;
    state.tgHoist = null;
    state.solved.tg = false;
  }
  if (route === "stage2_a1") {
    stopHangulVideo();
    state.hangulPhase = "video";
    state.hangulQuiz = 0;
    state.hangulSolved = [];
    state.solved.hangul = false;
  }
  if (route === "stage2_a2") {
    if (window.HanokGame) state.hanok = window.HanokGame.createDefaultState();
    if (window.HanokTour) state.hanokTour = window.HanokTour.createDefaultState();
    if (window.HanokExplorer) state.hanokExplorer = window.HanokExplorer.createDefaultState();
  }
  if (route === "stage2_a3") state.dancheong = createDefaultDancheongState();
  if (route === "stage3_a1") {
    state.hanbok = createDefaultHanbokState();
    state.solved.hanbok = false;
  }
  if (route === "stage4_a1") {
    yutCancelAI();
    state.yut = null;
    stopYutOnlineSync({ leaveRoom: true });
    state.solved.yut = false;
  }
  if (route === "stage4_a2") {
    state.ttakjiStep = -1;
    state.solved.ttakji = false;
  }
  if (route === "stage4_a3") {
    stopRhythmGame();
    stopSemachiPractice();
    state.rhythm = { screen: "song", song: null, level: 1 };
    state.rhythmProgress = {
      gyeonggi: { unlocked: 1, cleared: [false, false, false] },
      jindo: { unlocked: 1, cleared: [false, false, false] },
      complete: false
    };
    state.solved.rhythm = false;
  }
  if (route === "stage3_a3") {
    state.holiday = createDefaultHolidayState();
    state.solved.holiday = false;
  }
  if (route === "stage4_a4") {
    state.talchumStep = 0;
    state.talchumPhase = "masks";
    state.talchumMasks = createDefaultTalchumMaskState();
  }
  if (route === "stage1_a3") {
    stopAnthemGame();
    state.anthem = createDefaultAnthemState();
    state.solved.anthem = false;
  }
  if (route === "stage1_a4") {
    state.money = createDefaultMoneyState();
    state.solved.money = false;
  }
  if (route === "stage1_a2") {
    state.mugu = createDefaultMuguState();
    state.solved.mugunghwa = false;
  }
  if (route === "stage3_a2") {
    state.food = { screen: "cook", dish: "bibimbap" };
    state.foodProgress = { bibimbap: false };
    state.solved.bibimbap = false;
  }
}

function normalizeMissionRoute(route) {
  const match = String(route).match(/^(stage\d+_a\d+)/);
  return match ? match[1] : route;
}

function koreanObjectParticle(word) {
  if (!word) return "을";
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "을";
  return (code - 0xac00) % 28 === 0 ? "를" : "을";
}

function closeMissionClearOverlay() {
  const el = document.getElementById("missionClearOverlay");
  if (el) el.remove();
}

function showTreasureRewardPopup(treasure) {
  closeMissionClearOverlay();
  const particle = koreanObjectParticle(treasure?.name);
  const sparkles = Array.from({ length: 16 }, (_, i) =>
    `<span class="mission-clear-sparkle" style="--i:${i}"></span>`
  ).join("");
  const overlay = document.createElement("div");
  overlay.id = "missionClearOverlay";
  overlay.className = "mission-clear-overlay";
  overlay.innerHTML = `
    <div class="mission-clear-card">
      <div class="mission-clear-burst" aria-hidden="true">${sparkles}</div>
      <div class="mission-clear-medal">
        <span class="mission-clear-glow"></span>
        <span class="mission-clear-shine"></span>
        ${treasure
          ? `<img class="mission-clear-img" src="${TREASURE_IMG(treasure.image)}" alt="${treasure.name}" />`
          : `<span class="mission-clear-star">⭐</span>`}
      </div>
      <p class="mission-clear-badge">미션 완료!</p>
      <h2 class="mission-clear-name">${treasure ? treasure.name : "보물을 되찾았어!"}</h2>
      <p class="mission-clear-text">${treasure
        ? `장난꾸러기 도깨비에게서<br><strong>${treasure.name}</strong>${particle} 되찾았어!`
        : "미션을 모두 끝냈어!"}</p>
      <div class="mission-clear-actions">
        <button type="button" class="btn primary" id="missionClearAlbum">보물 모아보기</button>
        <button type="button" class="btn ghost" id="missionClearClose">계속하기</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("is-on"));
  overlay.querySelector("#missionClearAlbum").onclick = () => {
    closeMissionClearOverlay();
    openGuardianBook("album");
  };
  overlay.querySelector("#missionClearClose").onclick = () => {
    closeMissionClearOverlay();
    playSound("click.mp3");
  };
}

function showTreasureDetail(entry) {
  const particle = koreanObjectParticle(entry.name);
  Swal.fire({
    title: entry.name,
    html: `
      <p class="treasure-detail-mission">${entry.missionLabel} 미션에서 되찾음</p>
      <div class="treasure-reward-frame">
        <img class="treasure-reward-img" src="${TREASURE_IMG(entry.image)}" alt="${entry.name}" />
      </div>
      <p class="treasure-detail-story">
        장난꾸러기 도깨비에게서 빼앗긴 <strong>${entry.name}</strong>${particle}
        무사히 되찾아 보물도감에 보관 중이에요!
      </p>
    `,
    confirmButtonText: "닫기",
    width: "min(92vw, 480px)",
    customClass: { popup: "treasure-reward-popup" }
  });
}

/** 보물도감 카드 → 해당 미션 활동 화면으로 이동 */
function goToTreasureActivity(route) {
  const r = normalizeMissionRoute(route);
  if (!r || !MISSION_TREASURES[r]) return;
  playSound("click.mp3");
  stopActiveActivityMedia();
  if (r === "stage4_a3") {
    stopRhythmGame();
    stopSemachiPractice();
    if (!state.rhythm) state.rhythm = { screen: "song", song: null, level: 1 };
    if (state.rhythm.screen === "play" || state.rhythm.screen === "semachi") {
      state.rhythm.screen = state.rhythm.song ? "levels" : "song";
    }
  }
  if (r === "stage4_a1" && state.yutOnline?.mode === "online") {
    stopYutOnlineSync({ leaveRoom: true });
  }
  // 보물도감에서 다시 들어갈 때도 활동을 처음부터 시작한다.
  resetActivityState(r);
  state.current = r;
  render();
}

function isMissionRouteCompleted(route) {
  return !!state.completedMissions[normalizeMissionRoute(route)];
}

function isActivityMissionReady(route) {
  const r = normalizeMissionRoute(route || state.current);
  if (r === "stage1_a1") return !!(state.solved?.tg || state.tgHoist?.allDone);
  if (r === "stage1_a2") {
    const m = state.mugu;
    // 이전 완료(solved)만으로 ready가 되면 다시하기·스토리 중에도 「다음」이 가치수호록으로 가로채진다.
    return !!(m?.phase === "done"
      || (m?.phase === "photo" && m.photoFound && m.photoIdx >= MUGU_PHOTOS.length - 1));
  }
  if (r === "stage1_a3") {
    return !!(state.solved?.anthem
      || state.anthem?.listenComplete
      || (Number(state.anthem?.bestScore) >= ANTHEM_PASS_SCORE));
  }
  if (r === "stage1_a4") return !!state.solved?.money;
  if (r === "stage2_a1") return !!state.solved?.hangul;
  if (r === "stage2_a2") {
    if (window.HanokExplorer) return !!state.hanokExplorer?.journalSaved;
    return !!(state.solved?.hanok || state.hanok?.complete);
  }
  if (r === "stage2_a3") return dancheongMissionReady(state.dancheong);
  if (r === "stage3_a1") return hanbokMissionReady(state.hanbok || createDefaultHanbokState());
  if (r === "stage3_a2") return isOurFoodMissionReady();
  if (r === "stage3_a3") {
    const h = state.holiday;
    return !!(state.solved?.holiday || (h && h.total && h.done >= h.total));
  }
  if (r === "stage4_a1") return !!(state.solved?.yut || state.yut?.phase === "over" || state.yutOnline?.room?.phase === "over");
  if (r === "stage4_a2") return !!state.solved?.ttakji;
  if (r === "stage4_a3") return !!(state.rhythmProgress?.complete || state.solved?.rhythm || state.rhythm?.screen === "ending");
  if (r === "stage4_a4") return !!(talchumGame?.done);
  return false;
}

function bindMissionCompleteBtn(route, activityReady, _notReadyMsg, onFirstComplete) {
  if (!activityReady) return;
  const missionRoute = normalizeMissionRoute(route);
  if (isMissionRouteCompleted(missionRoute)) return;
  requestMissionComplete(missionRoute, onFirstComplete);
}

function requestMissionComplete(route, onFirstComplete) {
  const missionRoute = normalizeMissionRoute(route);
  if (isMissionRouteCompleted(missionRoute)) return false;
  if (onFirstComplete) onFirstComplete();
  // 모든 활동 공통: 활동을 마쳐도 여기서 화면을 가로채거나 보물을 주지 않는다.
  // 「다음」 → 수호책 질문 → 저장(onReflectionSaved)에서 보물을 준다.
  return false;
}

function completeMission(missionKey) {
  const route = normalizeMissionRoute(missionKey);
  if (state.completedMissions[route]) return false;
  state.completedMissions[route] = true;

  const treasure = MISSION_TREASURES[route];
  if (treasure) state.treasures[treasure.key] = true;

  try { saveProgress(); } catch (_) {}
  try { if (window.Swal) Swal.close(); } catch (_) {}
  try { showTreasureRewardPopup(treasure || null); } catch (_) {}
  try { playSound(treasure ? "artifact.mp3" : "correct.mp3"); } catch (_) {}
  return true;
}

function activityKeyForRoute(route) {
  const r = normalizeMissionRoute(route);
  if (window.ValueReflectionFlow && typeof window.ValueReflectionFlow.activityKeyForRoute === "function") {
    return window.ValueReflectionFlow.activityKeyForRoute(r);
  }
  return "";
}

function hasCompleteValueRecord(routeOrActivity) {
  const activity = activityKeyForRoute(routeOrActivity) || routeOrActivity;
  const rec = (state.valueRecords || []).find((item) => item && item.activity === activity);
  if (window.ValueGuardianBook && typeof window.ValueGuardianBook.isCompleteRecord === "function") {
    return window.ValueGuardianBook.isCompleteRecord(rec);
  }
  return !!(rec && (rec.status === "complete" || rec.reflectionText || rec.selectedElementLabel || rec.photoUrl));
}

function needsValueReflection(route) {
  if (!window.ValueReflectionFlow) return false;
  const r = normalizeMissionRoute(route);
  if (!r) return false;
  if (state.valueReflection && state.valueReflection.step === "saved") return false;
  // 기록 완료 여부와 상관없이 「다음」에서 다시 답할 수 있다.
  if (r === "stage2_a2") {
    const phase = state.hanokExplorer?.phase || "exterior";
    // 탐방·만들기 중에는 수호책을 열지 않는다. 만들기 이후(비교·선택 등) 「다음」에서 연다.
    if (phase === "exterior" || phase === "gate" || phase === "exploring" || phase === "building") {
      return false;
    }
    return true;
  }
  return true;
}

function pauseValueReflection() {
  if (!state.valueReflection) return;
  state.valueReflection.active = false;
  if (state.valueReflection.step === "saved" || state.valueReflection.status === "complete") {
    state.valueReflection.pending = false;
    return;
  }
  if (window.ValueReflectionFlow) window.ValueReflectionFlow.stop();
}

function beginValueReflection(route, opts) {
  opts = opts || {};
  if (!window.ValueReflectionFlow) return false;
  const r = normalizeMissionRoute(route || state.current);
  const activity = activityKeyForRoute(r);
  if (!activity) return false;
  // 「다음」으로 열 때(fromNext/force)는 이미 기록이 있어도 새 답변을 받는다.
  const allowAgain = !!(opts.force || opts.fromNext === true);
  if (hasCompleteValueRecord(r) && !(state.valueReflection && state.valueReflection.step === "saved") && !allowAgain) {
    return false;
  }
  // 「이전」으로 활동을 다시 본 뒤에는, 「다음」으로 명시적으로 열 때만 수호록을 재개한다.
  if (state.valueReflection?.dismissedByBack && !opts.force && opts.fromNext !== true) {
    return false;
  }
  const existing = state.valueReflection;
  const sameDraft = existing
    && existing.activity === activity
    && existing.status !== "complete"
    && existing.step !== "saved"
    && !allowAgain;
  if (sameDraft) {
    existing.active = true;
    existing.pending = false;
    existing.route = r;
    existing.dismissedByBack = false;
  } else {
    const pre = {};
    if (activity === "hanok" && state.hanokExplorer) {
      const e = state.hanokExplorer;
      if (e.selectedHanokValue) {
        pre.selectedId = e.selectedHanokValue;
        const cfg = window.ValueReflectionFlow.getConfig("hanok");
        const choice = (cfg?.choices || []).find((item) => item.id === e.selectedHanokValue);
        pre.selectedLabel = (choice && choice.label) || e.selectedHanokValueLabel || "";
        pre.valueLabel = (choice && (choice.valueLabel || choice.label)) || pre.selectedLabel;
      }
    }
    state.valueReflection = window.ValueReflectionFlow.createDefaultState({
      route: r,
      activity,
      ...pre
    });
    state.valueReflection.active = true;
    state.valueReflection.pending = false;
    state.valueReflection.status = "draft";
    state.valueReflection.dismissedByBack = false;
  }
  try { saveProgress(); } catch (_) {}
  if (opts.render !== false) render();
  return true;
}

function getNextActivityRouteFrom(route) {
  const cur = route || state.current;
  const actMatch = String(cur).match(/^stage(\d+)_a(\d+)/);
  if (actMatch) {
    const stage = Number(actMatch[1]);
    const acts = STAGE_MENUS[stage]?.activities || [];
    const base = activityBaseRoute(cur);
    const idx = acts.findIndex((a) => a.route === base);
    if (idx >= 0 && idx < acts.length - 1) return acts[idx + 1].route;
    if (stage < 4) return `stage${stage + 1}_menu`;
    return "main";
  }
  return getNextActivityRoute();
}

if (window.ValueReflectionFlow) {
  window.ValueReflectionFlow.start = (route, opts) => {
    const r = normalizeMissionRoute(route);
    if (r) state.current = r;
    return beginValueReflection(r, opts);
  };
}

function renderValueReflectionFlow() {
  if (!window.ValueReflectionFlow) return;
  window.ValueReflectionFlow.render(app, {
    getState: () => state,
    saveProgress,
    playSound,
    sceneTemplate,
    onReflectionSaved: (savedRoute) => {
      try {
        if (!isMissionRouteCompleted(savedRoute)) completeMission(savedRoute);
      } catch (_) {}
      updateGlobalNextButton();
      updateGlobalBackButton();
    },
    openValueBook: (activity) => {
      const fromRoute = normalizeMissionRoute(state.valueReflection?.route || state.current);
      pauseValueReflection();
      if (window.ValueGuardianBook && typeof window.ValueGuardianBook.openActivityPage === "function") {
        window.ValueGuardianBook.openActivityPage(state, activity, STAGE_MENUS);
      }
      if (fromRoute && MISSION_TREASURES[fromRoute]) state.valueBookFromRoute = fromRoute;
      state.current = "value_book";
      render();
    },
    goNextActivity: (savedRoute) => {
      pauseValueReflection();
      stopActiveActivityMedia();
      const next = getNextActivityRouteFrom(savedRoute) || "main";
      if (/^stage\d+_a\d+$/.test(next)) resetActivityState(next);
      state.current = next;
      render();
    }
  });
}

function showValueReflectionIfActive() {
  if (!window.ValueReflectionFlow || !state.valueReflection?.active) return false;
  const flowRoute = normalizeMissionRoute(state.valueReflection.route || "");
  const here = normalizeMissionRoute(state.current);
  if (here !== flowRoute) return false;
  renderValueReflectionFlow();
  relocateScreenButtonsToGlobalNav();
  setupActivityControls();
  rememberNavHistory();
  updateGlobalBackButton();
  updateGlobalNextButton();
  return true;
}

function setupActivityControls() {
  if (!isActivityScreen()) return;

  const menuBtn = document.getElementById("activityMenuBtn");
  if (menuBtn) {
    menuBtn.onclick = () => {
      const menu = menuBtn.dataset.menu;
      playSound("click.mp3");
      stopActiveActivityMedia();
      if (state.current === "stage4_a3" && state.rhythm) {
        if (state.rhythm.screen === "play" || state.rhythm.screen === "semachi") {
          state.rhythm.screen = state.rhythm.song ? "levels" : "song";
        }
      }
      state.current = menu || getActivityMenuRoute() || "main";
      render();
    };
  }

  const retry = document.getElementById("retryActivityBtn");
  if (retry) {
    retry.onclick = () => {
      resetActivityState(state.current);
      playSound("click.mp3");
      render();
    };
  }

  bindTeacherLessonGuideButton();
}

function sceneTemplate(title, body) {
  const stageNum = getStageNumber();
  const isActivity = isActivityScreen();
  const header = isActivity
    ? `<div class="stage-header stage-header--activity"><h2 class="title stage-title">${title}</h2></div>`
    : `
    <div class="stage-header">
      <span class="btn header-spacer" aria-hidden="true">🔊</span>
      <h2 class="title stage-title">${title}</h2>
      <button class="btn" id="helpBtn">🔊</button>
    </div>
  `;

  if (stageNum) {
    return `
      <div class="stage-screen">
        <img class="stage-bg" src="${IMG(`stage${stageNum}-bg.png`)}" alt="스테이지 배경" decoding="async" fetchpriority="low" />
        <div class="stage-overlay">
          ${isActivity ? activityToolbarHTML() : ""}
          <div class="stage-panel ${isActivity ? "stage-panel--activity" : ""}">
            ${header}
            ${body}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="center">
      <div class="panel">
        ${header}
        ${body}
      </div>
    </div>
  `;
}

function render() {
  _renderLock += 1;
  try {
    renderScreen();
  } finally {
    _renderLock -= 1;
  }
}

function renderScreen() {
  hideTgTooltip();
  document.body.classList.toggle("logged-out", !state.loggedIn);
  // 이전 화면에서 전역 바로 옮겨둔 버튼을 렌더 전에 먼저 제거.
  // 남겨두면 같은 id의 새 버튼 대신 곧 삭제될 옛 버튼에 클릭 핸들러가 묶여
  // "◀ 활동 선택"·"↺ 다시 하기"가 먹통이 되는 문제가 생긴다.
  document.querySelectorAll(".global-nav .global-nav-item--screen").forEach((el) => el.remove());
  if (!state.loggedIn) {
    renderLogin();
    relocateScreenButtonsToGlobalNav();
    rememberNavHistory();
    return;
  }
  if (isActivityRouteKey(state.current) && !isActivityOpenForStudent(state.current)) {
    const stageNum = (String(state.current).match(/^stage(\d+)/) || [])[1] || "1";
    state.current = `stage${stageNum}_menu`;
    setTimeout(() => {
      try {
        Swal.fire({ icon: "info", title: "🔒 아직 열리지 않은 활동이에요", text: "선생님이 활동을 열어 주면 할 수 있어요.", confirmButtonText: "알겠어요" });
      } catch (_) {}
    }, 0);
  }
  if (state.current !== "teacher_dashboard") stopTeacherDashboardSync();
  if (window.TeacherTools) {
    window.TeacherTools.syncGuideOverlay(state.current, state.current === "teacher_dashboard");
  }
  if (state.current !== "stage4_a1") {
    if (state.yutOnline?.mode === "online") stopYutOnlineSync({ leaveRoom: true });
    else if (state.yutOnline?.mode === "room_pick") state.yutOnline = null;
  }
  if (state.current !== "stage4_a2") stopTtakjiVideo();
  if (state.current !== "stage4_a3") stopRhythmGame();
  if (state.current !== "stage4_a4") stopTalchumGame();
  if (state.current !== "stage1_a3") stopAnthemGame();
  if (state.current !== "stage2_a1") stopHangulVideo();
  if (state.current !== "stage1_a4" && state.current !== "stage2_a1") stopSpeechVoice();
  if (state.current !== "stage2_a2") {
    if (window.HanokGame) window.HanokGame.stop();
    if (window.HanokTour) window.HanokTour.stop();
    if (window.HanokExplorer) window.HanokExplorer.stop();
  }
  if (state.current !== "stage2_a3") stopDancheongGallerySync();
  if (state.current !== "stage3_a1") stopHanbokGallerySync();
  if (state.current !== "value_book" && state.current !== "teacher_student_book" && window.ValueGuardianBook) window.ValueGuardianBook.stop();
  if (state.current !== "value_book") state.valueBookFromRoute = null;
  if (state.current !== "classroom_extension" && window.ClassroomExtension) window.ClassroomExtension.stop();
  syncActivityIntroGate();
  if (state.valueReflection?.active) {
    if (showValueReflectionIfActive()) return;
    pauseValueReflection();
  }
  if (isActivityIntroVisible()) {
    renderActivityQuestion(state.current);
    relocateScreenButtonsToGlobalNav();
    setupActivityControls();
    rememberNavHistory();
    updateGlobalNextButton();
    return;
  }
  if (window.ValueReflectionFlow) window.ValueReflectionFlow.stop();
  const routes = {
    main: renderMain,
    intro: renderIntro,
    teacher_dashboard: renderTeacherDashboard,
    teacher_student_album: renderTeacherStudentAlbum,
    teacher_student_book: renderTeacherStudentBook,
    stage1_menu: renderStage1Menu,
    stage1_a1: renderStage1Act1,
    stage1_a1_hoist: renderStage1Act1Hoist,
    stage1_a2: renderStage1Act2,
    stage1_a3: renderStage1Act3,
    stage1_a4: renderStage1Act4,
    stage2_menu: renderStage2Menu,
    stage2_a1: renderStage2Act1,
    stage2_a2: renderStage2Act2,
    stage2_a3: renderStage2Act3,
    stage3_menu: renderStage3Menu,
    stage3_a1: renderStage3Act1,
    stage3_a2: renderStage3Act2,
    stage3_a3: renderStage3Act3,
    stage4_menu: renderStage4Menu,
    stage4_a1: renderStage4Act1,
    stage4_a2: renderStage4Act2,
    stage4_a3: renderStage4Act3,
    stage4_a4: renderStage4Act4,
    treasure_album: renderTreasureAlbum,
    value_book: renderValueBook,
    classroom_extension: renderClassroomExtension
  };
  (routes[state.current] || renderMain)();
  // 버튼을 전역 바로 옮긴 뒤에 핸들러를 붙여, 옮기기 전 옛 노드에 묶이는 일을 방지
  relocateScreenButtonsToGlobalNav();
  setupActivityControls();
  rememberNavHistory();
  // 수호책 질문·미션 완료는 「다음」 버튼을 실제로 눌렀을 때만 연다(goToNextScreen).
  // 여기서 매 렌더링마다 자동으로 열면, 활동에 막 들어오기만 해도(특히 내부 단계가 없는
  // 비빔밥 등) 활동 화면 대신 수호책 질문이 바로 뜨는 문제가 생긴다.
  if (showValueReflectionIfActive()) return;
  updateGlobalBackButton();
  updateGlobalNextButton();
}

// 화면별 상단 버튼(◀ 활동 선택, ↺ 다시 하기, 📊 대시보드)을
// 항상 떠 있는 전역 버튼 바 안으로 옮겨 홈·종료 버튼 옆에 나란히 배치
function relocateScreenButtonsToGlobalNav() {
  const leftBar = document.getElementById("globalNavLeft");
  const leftTopRow = document.getElementById("globalNavTopRow") || leftBar;
  const rightBar = document.getElementById("globalNavRight");
  if (!leftBar || !rightBar) return;

  // 이전 화면에서 옮겨온 버튼 제거 (render가 #app만 갈아끼우므로 직접 정리)
  document.querySelectorAll(".global-nav .global-nav-item--screen").forEach((el) => el.remove());

  const move = (el, bar, before) => {
    if (!el) return;
    el.classList.add("global-nav-item", "global-nav-item--screen");
    el.removeAttribute("style");
    bar.insertBefore(el, before || null);
  };

  // 왼쪽 상단 행: 홈 → 학급관리 → 우리반 게시판 순서
  const classExtBtn = document.getElementById("globalClassExtBtn");
  move(document.querySelector("#app .act-tl"), leftTopRow, classExtBtn);
  move(document.querySelector("#app #teacherDashboardBtn"), leftTopRow, classExtBtn);
  // 오른쪽 바: 전체화면·종료 버튼 왼쪽 옆에 배치
  move(document.querySelector("#app #lessonGuideBtn"), rightBar, rightBar.firstElementChild);
  move(document.querySelector("#app .act-tr"), rightBar, rightBar.firstElementChild);
}

function renderLogin() {
  const isTeacherFlow = state.loginFlow === "teacher";
  const isTeacherSelectFlow = state.loginFlow === "teacher_select";
  const isTeacherSetupFlow = state.loginFlow === "teacher_setup";
  const isTeacherExistingFlow = state.loginFlow === "teacher_existing";
  const isStudentSelectFlow = state.loginFlow === "student";
  const isStudentRegisteredFlow = state.loginFlow === "student_registered";
  const isStudentFreeFlow = state.loginFlow === "student_free";
  const isReviewFlow = state.loginFlow === "review";
  const currentClassroom = loadClassroomAuth();
  const recentTeacherClasses = loadRecentTeacherClasses();
  const firebaseReady = window.KCultureFirebase?.isReady?.();

  const loginBody = isTeacherFlow
    ? `
      <h1 class="title">교사용 로그인</h1>
      <p class="sub">교사용 마스터키를 입력해주세요.</p>
      <input id="masterKeyInput" class="code-input" type="password" maxlength="20" placeholder="마스터키 입력" />
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="teacherLoginBtn" class="btn primary">다음</button>
        <button id="backToLoginTypeBtn" class="btn ghost">◀ 로그인 유형 선택</button>
      </div>
    `
    : isTeacherSelectFlow
      ? `
      <h1 class="title">교사용 메뉴</h1>
      <p class="sub">신규 학급 생성 또는 기존 학급 로그인 중 선택해주세요.</p>
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="teacherCreateClassBtn" class="btn primary">신규 학급 생성</button>
        <button id="teacherExistingClassBtn" class="btn">기존 학급 로그인</button>
        <button id="backToTeacherMasterBtn" class="btn ghost">◀ 마스터키 입력으로</button>
      </div>
    `
    : isTeacherSetupFlow
      ? `
      <h1 class="title">신규 학급 생성</h1>
      <p class="sub">버튼을 누르면 우리 반만의 학급코드가 발급돼요. 이 코드를 학생들에게 알려주면 학생들이 그 코드로 로그인할 수 있어요.</p>
      <div style="margin-top:12px;padding:10px;border:1px dashed rgba(255,255,255,.45);border-radius:12px;background:rgba(255,255,255,.08);">
        <p class="small" style="margin:0;">학교 이름이나 학년·반은 입력하지 않아요. 개인정보를 최소화하기 위해 학급은 랜덤 코드로만 구분돼요.</p>
        <p class="small" style="margin:6px 0 0;">학생은 로그인 시 <b>학급코드 + 번호 + 별명</b>을 입력해 자동으로 우리 반에 연결돼요.</p>
        <p class="small" style="margin:6px 0 0;">${firebaseReady ? "☁️ Firebase 연결됨 — 학급 정보가 온라인에 저장됩니다." : "📱 Firebase 미설정 — 이 기기에만 학급이 저장됩니다."}</p>
      </div>
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="registerClassBtn" class="btn primary">학급코드 발급받고 입장</button>
        <button id="backToTeacherLoginBtn" class="btn ghost">◀ 교사용 로그인으로</button>
      </div>
    `
      : isTeacherExistingFlow
        ? `
      <h1 class="title">기존 학급 로그인</h1>
      <p class="sub">학급코드를 입력하면 해당 학급으로 로그인돼요.</p>
      <input id="teacherClassCodeInput" class="code-input" maxlength="10" placeholder="학급코드" value="${currentClassroom?.classKey || currentClassroom?.classCode || ""}" />
      ${recentTeacherClasses.length
        ? `
      <div style="margin-top:12px;">
        <p class="small" style="margin:0 0 8px;">최근 학급 빠른 선택</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${recentTeacherClasses.map((item) => `
            <button type="button" class="btn ghost recentTeacherClassBtn" data-class-code="${item.classCode || ""}" style="padding:6px 10px;">
              학급코드 ${item.classCode || ""}
            </button>
          `).join("")}
        </div>
      </div>
      `
        : ""}
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="teacherExistingLoginBtn" class="btn primary">학급 로그인</button>
        <button id="backToTeacherSelectBtn" class="btn ghost">◀ 교사용 메뉴로</button>
      </div>
      <p class="small" style="text-align:center;margin-top:8px;">Firebase 연결 시 클라우드 학급 정보를 우선 사용합니다.</p>
    `
      : isStudentRegisteredFlow
        ? `
      <h1 class="title">학급 계정 로그인</h1>
      <p class="sub">선생님이 알려준 학급코드와 내 번호, 별명을 입력하세요.</p>
      <input id="studentClassCodeInput" class="code-input" maxlength="10" placeholder="학급코드" />
      <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <input id="studentNumberInput" class="code-input" maxlength="2" inputmode="numeric" placeholder="번호" />
        <input id="studentNameInput" class="code-input" maxlength="20" placeholder="별명" />
      </div>
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="studentLoginBtn" class="btn primary">입장</button>
        <button id="backToStudentSelectBtn" class="btn ghost">◀ 학생 로그인 선택</button>
      </div>
    `
        : isStudentFreeFlow
          ? `
      <h1 class="title">자유 입장</h1>
      <p class="sub">계정 없이 바로 플레이할 수 있어요. 단, 진행 상황은 저장되지 않아요.</p>
      <input id="guestNicknameInput" class="code-input" maxlength="20" placeholder="별명" />
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="freeLoginBtn" class="btn primary">바로 입장</button>
        <button id="backToStudentSelectBtn" class="btn ghost">◀ 학생 로그인 선택</button>
      </div>
      <p class="small" style="text-align:center">저장·온라인 플레이는 학급 계정 로그인에서 이용할 수 있어요.</p>
    `
          : isStudentSelectFlow
            ? `
      <h1 class="title">학생용 로그인</h1>
      <p class="sub">입장 방법을 선택해주세요.</p>
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="studentRegisteredBtn" class="btn primary">학급 계정으로 입장</button>
        <button id="studentFreeBtn" class="btn">자유 입장 (저장 없음)</button>
        <button id="backToLoginTypeBtn" class="btn ghost">◀ 로그인 유형 선택</button>
      </div>
      <p class="small" style="text-align:center;margin-top:8px;">학급 계정: 저장 + 온라인 연결 · 자유 입장: 체험용</p>
    `
            : isReviewFlow
              ? `
      <h1 class="title">심사용 입장</h1>
      <p class="sub">디지털연구대회 심사를 위한 가상 학급입니다. 진행 상황이 미리 들어 있어요.</p>
      <div class="review-demo-card">
        <p><strong>심사초등학교</strong> 1학년 1반</p>
        <p>가상 학생 5명 모두 학생으로 들어가 볼 수 있어요.</p>
        <p class="small">1번 수호 · 2번 대한 · 3번 민국 · 4번 우리 · 5번 나라</p>
      </div>
      <div style="margin-top:14px;display:grid;gap:10px;">
        <button id="reviewTeacherBtn" class="btn primary">심사용 교사로 보기</button>
        <p class="small" style="margin:4px 0 0;text-align:center;">심사용 학생으로 해보기</p>
        <div class="review-demo-students">
          ${getReviewDemoStudentSpecs().map((item) => (
            `<button type="button" class="btn" data-review-student="${item.number}">${item.number}번 ${item.name}</button>`
          )).join("")}
        </div>
        <button id="backToLoginTypeBtn" class="btn ghost">◀ 로그인 유형 선택</button>
      </div>
    `
              : `
      <div class="login-actions">
        <button id="studentTypeBtn" class="btn login-type-btn login-type-btn--student">학생용 로그인</button>
        <button id="teacherTypeBtn" class="btn login-type-btn login-type-btn--teacher">교사용 로그인</button>
      </div>
    `;

  const isSelectFlow = !isTeacherFlow && !isTeacherSelectFlow && !isTeacherSetupFlow
    && !isTeacherExistingFlow && !isStudentSelectFlow && !isStudentRegisteredFlow && !isStudentFreeFlow && !isReviewFlow;

  app.innerHTML = `
    <div class="home-screen login-screen${isSelectFlow ? " login-screen--select" : ""}">
      <img class="home-bg" src="${IMG("home-bg.png")}" alt="홈 배경" />
      <div class="home-overlay">
        ${isSelectFlow ? `
        <div class="login-event-badge">제 20회 디지털연구대회 /SW.AI분과</div>
        <div class="login-hero">
          <h1 class="home-title">우리 문화 수호대</h1>
          <p class="home-grade">초등학교 1학년</p>
        </div>
        <div class="login-review-solo login-wrap panel">
          <button id="reviewTypeBtn" class="btn login-type-btn login-type-btn--review">심사용 입장</button>
        </div>
        <div class="login-wrap panel">
          ${loginBody}
        </div>
        ` : `
        <div class="login-wrap panel">
          ${loginBody}
        </div>
        `}
      </div>
    </div>
  `;

  if (isTeacherFlow) {
    const input = document.getElementById("masterKeyInput");
    document.getElementById("teacherLoginBtn").onclick = () => {
      const value = input.value.trim();
      if (value !== "teach7") {
        Swal.fire("앗!", "교사용 마스터키가 올바르지 않아!", "warning");
        return;
      }
      state.loginFlow = "teacher_select";
      render();
    };
    document.getElementById("backToLoginTypeBtn").onclick = () => {
      state.loginFlow = "select";
      render();
    };
    return;
  }

  if (isTeacherSelectFlow) {
    document.getElementById("teacherCreateClassBtn").onclick = () => {
      state.loginFlow = "teacher_setup";
      render();
    };
    document.getElementById("teacherExistingClassBtn").onclick = () => {
      state.loginFlow = "teacher_existing";
      render();
    };
    document.getElementById("backToTeacherMasterBtn").onclick = () => {
      state.loginFlow = "teacher";
      render();
    };
    return;
  }

  if (isTeacherSetupFlow) {
    document.getElementById("registerClassBtn").onclick = async () => {
      const classCode = await generateUniqueClassCode();
      const classroomAuth = await createClassroomWithCode(classCode);

      let cloudSaved = false;
      if (window.KCultureFirebase?.isReady()) {
        try {
          cloudSaved = await window.KCultureFirebase.upsertClassroom(classCode, classroomAuth);
        } catch (_) {
          cloudSaved = false;
        }
      }

      state.loggedIn = true;
      state.loginType = "teacher";
      state.studentMode = "";
      state.saveEnabled = false;
      state.userProfile = { classKey: classCode };
      state.code = classCode;
      state.current = "intro";
      clearNavHistory();

      Swal.fire({
        icon: "success",
        title: "학급 등록 완료!",
        html: `
          <div style="text-align:left">
            <p>우리 반 학급코드는</p>
            <p style="font-size:28px;font-weight:800;letter-spacing:2px;text-align:center;margin:8px 0;">${classCode}</p>
            <p>이 코드를 학생들에게 알려주세요.</p>
            <p>${cloudSaved ? "☁️ Firebase에 학급 정보가 저장되었어요." : "📱 이 기기에만 학급 정보가 저장되었어요."}</p>
            <p style="margin-top:8px;">학생 로그인 입력: 학급코드 + 번호 + 별명</p>
          </div>
        `,
        confirmButtonText: "시작하기"
      }).then(() => {
        playSound("login_success.mp3");
        render();
      });
    };

    document.getElementById("backToTeacherLoginBtn").onclick = () => {
      state.loginFlow = "teacher";
      render();
    };
    return;
  }

  if (isTeacherExistingFlow) {
    const classCodeInput = document.getElementById("teacherClassCodeInput");
    app.querySelectorAll(".recentTeacherClassBtn").forEach((btn) => {
      btn.onclick = () => {
        classCodeInput.value = btn.dataset.classCode || "";
      };
    });
    document.getElementById("teacherExistingLoginBtn").onclick = async () => {
      const classCode = classCodeInput.value.trim();
      if (!classCode) return Swal.fire("앗!", "학급코드를 입력해줘!", "warning");

      const classKey = buildClassKey(classCode);
      const classroom = await findClassroom(classKey);
      if (!classroom) {
        return Swal.fire("앗!", "해당 학급코드를 찾을 수 없어!", "warning");
      }

      saveClassroomAuth(classroom);
      saveRecentTeacherClassCode(classroom);
      state.loggedIn = true;
      state.loginType = "teacher";
      state.studentMode = "";
      state.saveEnabled = false;
      state.userProfile = {
        classKey: classroom.classKey || classroom.classCode
      };
      state.code = classroom.classKey || classroom.classCode;
      state.current = "intro";
      clearNavHistory();
      playSound("login_success.mp3");
      render();
    };
    document.getElementById("backToTeacherSelectBtn").onclick = () => {
      state.loginFlow = "teacher_select";
      render();
    };
    return;
  }

  if (isStudentRegisteredFlow) {
    const classCodeInput = document.getElementById("studentClassCodeInput");
    const numberInput = document.getElementById("studentNumberInput");
    const nameInput = document.getElementById("studentNameInput");
    [numberInput].forEach((input) => {
      input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
    });
    document.getElementById("studentLoginBtn").onclick = async () => {
      const classCode = classCodeInput.value.trim();
      const studentNumber = numberInput.value.trim();
      const nickname = nameInput.value.trim();

      if (!classCode) {
        return Swal.fire("앗!", "학급코드를 입력해줘!", "warning");
      }
      if (!/^\d{1,2}$/.test(studentNumber)) {
        return Swal.fire("앗!", "번호는 숫자 1~2자리로 입력해줘!", "warning");
      }
      if (!nickname) {
        return Swal.fire("앗!", "별명을 입력해줘!", "warning");
      }
      await enterRegisteredStudentByCode(classCode, studentNumber, nickname);
    };
    document.getElementById("backToStudentSelectBtn").onclick = () => {
      state.loginFlow = "student";
      render();
    };
    return;
  }

  if (isStudentFreeFlow) {
    document.getElementById("freeLoginBtn").onclick = () => {
      const nickname = document.getElementById("guestNicknameInput").value.trim();
      enterFreeStudent(nickname);
    };
    document.getElementById("backToStudentSelectBtn").onclick = () => {
      state.loginFlow = "student";
      render();
    };
    return;
  }

  if (isStudentSelectFlow) {
    document.getElementById("studentRegisteredBtn").onclick = () => {
      state.loginFlow = "student_registered";
      render();
    };
    document.getElementById("studentFreeBtn").onclick = () => {
      state.loginFlow = "student_free";
      render();
    };
    document.getElementById("backToLoginTypeBtn").onclick = () => {
      state.loginFlow = "select";
      render();
    };
    return;
  }

  if (isReviewFlow) {
    document.getElementById("reviewTeacherBtn").onclick = () => {
      enterReviewDemoTeacher();
    };
    document.querySelectorAll("[data-review-student]").forEach((btn) => {
      btn.onclick = () => {
        enterReviewDemoStudent(Number(btn.getAttribute("data-review-student")));
      };
    });
    document.getElementById("backToLoginTypeBtn").onclick = () => {
      state.loginFlow = "select";
      render();
    };
    return;
  }

  document.getElementById("teacherTypeBtn").onclick = () => {
    state.loginFlow = "teacher";
    render();
  };
  document.getElementById("studentTypeBtn").onclick = () => {
    state.loginFlow = "student";
    render();
  };
  document.getElementById("reviewTypeBtn").onclick = () => {
    state.loginFlow = "review";
    render();
  };
}

function renderIntro() {
  app.innerHTML = `
    <div class="intro-screen">
      <video
        class="intro-video"
        id="introVideo"
        src="${INTRO_VIDEO}"
        preload="auto"
        autoplay
        playsinline
      ></video>
      <button type="button" class="intro-skip-btn" id="introSkipBtn">
        건너뛰기 ›
      </button>
      <button type="button" class="intro-play-btn" id="introPlayBtn" hidden>
        ▶ 인트로 영상 재생
      </button>
      <div class="intro-video-error" id="introVideoError" hidden>
        <p>인트로 영상을 불러오지 못했어요.</p>
        <button type="button" class="btn primary" id="introFallbackStart">계속하기</button>
      </div>
    </div>
  `;

  const video = document.getElementById("introVideo");
  const playBtn = document.getElementById("introPlayBtn");
  const skipBtn = document.getElementById("introSkipBtn");
  const errorPanel = document.getElementById("introVideoError");
  let promptOpened = false;

  const showStartPrompt = async () => {
    if (promptOpened || state.current !== "intro") return;
    promptOpened = true;
    try { video.pause(); } catch (_) {}
    skipBtn.hidden = true;
    playBtn.hidden = true;
    const result = await Swal.fire({
      title: "모험을 시작할 준비가 되었나요?",
      text: "보물을 찾으러 떠나려면 시작 버튼을 눌러주세요",
      icon: "info",
      confirmButtonText: "시작",
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    if (!result.isConfirmed) return;
    state.current = "main";
    clearNavHistory();
    playSound("click.mp3");
    render();
  };

  skipBtn.onclick = () => {
    playSound("click.mp3");
    showStartPrompt();
  };

  video.addEventListener("ended", showStartPrompt, { once: true });
  video.addEventListener("error", () => {
    video.hidden = true;
    playBtn.hidden = true;
    skipBtn.hidden = true;
    errorPanel.hidden = false;
    document.getElementById("introFallbackStart").onclick = showStartPrompt;
  }, { once: true });

  const playIntro = () => {
    video.play()
      .then(() => { playBtn.hidden = true; })
      .catch(() => { playBtn.hidden = false; });
  };
  playBtn.onclick = playIntro;
  playIntro();
}

function renderMain() {
  const treasureCount = countAcquiredTreasures();
  const treasureTotal = getTreasureAlbumList().length;
  const sessionBadges = getSessionBadgeHtml();
  const bookProgress = window.ValueGuardianBook?.getProgress
    ? window.ValueGuardianBook.getProgress(state, STAGE_MENUS)
    : { complete: 0, total: 14 };
  const studentBookName = (state.userProfile?.name || "").trim();
  const bookBtnTitle = state.loginType === "teacher"
    ? ((!studentBookName || studentBookName === "나" || studentBookName === "선생님")
      ? "선생님의 우리 문화 수호책"
      : `${studentBookName}의 우리 문화 수호책`)
    : ((!studentBookName || studentBookName === "나")
      ? "나의 우리 문화 수호책"
      : `${studentBookName}의 우리 문화 수호책`);
  // 교사·심사용도 홈에서 자신의 문화 수호책을 열 수 있다.
  const bookBtn = `<button type="button" class="value-book-home-btn${(bookProgress.complete > 0 || treasureCount > 0) ? " is-ready" : ""}" id="valueBookBtn">
        <span class="value-book-home-icon" aria-hidden="true">📖</span>
        <span class="value-book-home-text">
          <span class="value-book-home-title">${bookBtnTitle}</span>
          <span class="value-book-home-progress">
            <span class="value-book-stat">보물 ${treasureCount}/${treasureTotal}</span>
            <span class="value-book-stat">기록 ${bookProgress.complete}/${bookProgress.total}</span>
          </span>
        </span>
      </button>`;
  app.innerHTML = `
    <div class="home-screen">
      <img class="home-bg" src="${IMG("home-bg.png")}" alt="홈 배경" />
      <div class="home-overlay">
        ${state.loginType === "teacher"
          ? `<div class="home-teacher-tools">
               <button type="button" class="corner-btn" id="teacherDashboardBtn">📊 학급관리</button>
             </div>`
          : ""}
        <div class="home-center">
          ${sessionBadges}
          <h1 class="home-title">우리 문화 수호대</h1>
          <p class="home-grade">초등학교 1학년</p>
          <div class="home-tool-btns">${bookBtn}</div>
          <div class="hub-wrap">
            <img class="home-character" src="${CHAR_IMG("HOME-CHARAC.png")}" alt="수호대 친구들 화이팅" draggable="false" />
            <button class="stage-node s1" data-go="stage1_menu" aria-label="스테이지 1">
              <img src="${IMG("stage1-icon.png")}" alt="스테이지1" />
              <span class="label">우리나라 상징을 찾아라!</span>
            </button>
            <button class="stage-node s2" data-go="stage2_menu" aria-label="스테이지 2">
              <img src="${IMG("stage2-icon.png")}" alt="스테이지2" />
              <span class="label">한글과 한옥을 지켜라!</span>
            </button>
            <button class="stage-node s3" data-go="stage3_menu" aria-label="스테이지 3">
              <img src="${IMG("stage3-icon.png")}" alt="스테이지3" />
              <span class="label">우리의 맛과 멋을 살려라!</span>
            </button>
            <button class="stage-node s4" data-go="stage4_menu" aria-label="스테이지 4">
              <img src="${IMG("stage4-icon.png")}" alt="스테이지4" />
              <span class="label">전통놀이 한판승부!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  app.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => {
    state.current = b.dataset.go;
    playSound("click.mp3");
    render();
  });
  const albumBtn = document.getElementById("treasureAlbumBtn");
  if (albumBtn) {
    albumBtn.onclick = () => {
      openGuardianBook("cover");
    };
  }
  const valueBookBtn = document.getElementById("valueBookBtn");
  if (valueBookBtn) {
    valueBookBtn.onclick = () => {
      openGuardianBook("cover");
    };
  }
  const teacherDashboardBtn = document.getElementById("teacherDashboardBtn");
  if (teacherDashboardBtn) {
    teacherDashboardBtn.onclick = () => {
      state.teacherDashTab = "status";
      state.current = "teacher_dashboard";
      playSound("click.mp3");
      render();
    };
  }
  if (state.studentMode === "registered") updateOnlineBadge();
}

function classroomActivityList() {
  const shorts = {
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
  const list = [];
  Object.keys(STAGE_MENUS).forEach((num) => {
    (STAGE_MENUS[num].activities || []).forEach((act) => {
      list.push({ id: act.route, title: shorts[act.label] || act.label });
    });
  });
  return list;
}

function renderClassroomExtension() {
  if (!window.ClassroomExtension) {
    state.current = "main";
    render();
    return;
  }
  if (isReviewDemoSession() && window.ClassroomExtension.seedReviewDemo) {
    window.ClassroomExtension.seedReviewDemo(
      state.userProfile?.classKey || reviewDemoClassKey(),
      getReviewDemoAllStudentSpecs().map((item) => ({
        number: item.number,
        name: item.name,
        accountId: reviewDemoAccountId(item.number)
      })),
      REVIEW_DEMO.seedVersion
    );
  }
  window.ClassroomExtension.render(app, {
    playSound,
    getUser: () => ({
      loginType: state.loginType,
      isTeacher: state.loginType === "teacher",
      name: (state.userProfile?.name || "").trim() || (state.loginType === "teacher" ? "선생님" : "나"),
      accountId: state.userProfile?.accountId || (state.loginType === "teacher" ? "teacher" : "guest"),
      number: state.userProfile?.number || "",
      classKey: state.userProfile?.classKey || state.userProfile?.classCode || "local",
      saveEnabled: isSaveEnabled(),
      isReviewDemo: isReviewDemoSession()
    }),
    getActivities: classroomActivityList,
    goHome: () => {
      state.current = "main";
      render();
    }
  });
  setupNavigationAndHelp("친구들이 올린 작품에 좋아요를 누르고, 댓글로 서로 응원해요.");
}

function openGuardianBook(view) {
  const ui = (state.valueBook && typeof state.valueBook === "object") ? state.valueBook : {};
  state.valueBook = {
    view: view || "cover",
    pageIndex: Number(ui.pageIndex) || 0,
    whyWant: ui.whyWant || "",
    whyReason: ui.whyReason || ""
  };
  state.current = "value_book";
  playSound("click.mp3");
  render();
}

function renderValueBook() {
  if (!window.ValueGuardianBook) {
    state.current = state.loginType === "teacher" ? "teacher_dashboard" : "main";
    render();
    return;
  }
  const viewing = (state.current === "teacher_student_book" && state.loginType === "teacher")
    ? state.teacherBookView
    : null;
  if (state.current === "teacher_student_book" && !viewing) {
    state.current = "teacher_dashboard";
    render();
    return;
  }
  window.ValueGuardianBook.render(app, {
    getState: () => (viewing ? viewing.bookState : state),
    saveProgress: viewing ? () => {} : saveProgress,
    viewOnly: !!viewing,
    playSound,
    getStudentName: () => (viewing
      ? (viewing.name || "").trim()
      : (state.userProfile?.name || "").trim()) || "나",
    homeLabel: viewing ? "◀ 학급관리" : "◀ 홈으로",
    headerTitle: viewing
      ? `${viewing.name}의 수호책`
      : (state.loginType === "teacher" ? "선생님의 수호책" : "나의 수호책"),
    getStageMenus: () => STAGE_MENUS,
    stageImage: (stageNum, file) => STAGE_IMG(stageNum, file),
    getTreasureList: () => getTreasureAlbumList(
      viewing
        ? treasuresFromProgress(viewing.bookState)
        : state.treasures
    ),
    treasureSrc: TREASURE_IMG,
    goHome: () => {
      pauseValueReflection();
      if (viewing) {
        closeTeacherStudentBook();
        return;
      }
      state.current = "main";
      render();
    },
    goToActivity: (route) => {
      if (viewing) return;
      pauseValueReflection();
      skipActivityIntro = true;
      state.current = route;
      render();
    },
    startReflection: (route) => {
      if (viewing) return;
      skipActivityIntro = true;
      lastActivityIntroKey = activityBaseRoute(route);
      state.current = route;
      beginValueReflection(route, { force: true, fromNext: true });
    }
  });
}

function renderTeacherStudentBook() {
  if (state.loginType !== "teacher" || !state.teacherBookView) {
    state.teacherBookView = null;
    state.current = state.loginType === "teacher" ? "teacher_dashboard" : "main";
    render();
    return;
  }
  renderValueBook();
}

function renderTeacherStudentAlbum() {
  if (state.loginType !== "teacher" || !state.teacherAlbumView) {
    state.teacherAlbumView = null;
    state.current = state.loginType === "teacher" ? "teacher_dashboard" : "main";
    render();
    return;
  }
  renderTreasureAlbum();
}

function renderTreasureAlbum() {
  const viewing = state.current === "teacher_student_album" ? state.teacherAlbumView : null;
  const treasures = viewing?.treasures || state.treasures;
  const items = getTreasureAlbumList(treasures);
  const acquired = countAcquiredTreasures(treasures);
  const total = items.length;
  const allDone = acquired >= total;
  const ownerName = viewing?.name || "";
  const viewOnly = !!viewing;

  const cards = items.map((entry) => {
    if (entry.acquired) {
      return `
        <button type="button" class="treasure-card treasure-card--owned" data-route="${entry.route}" data-treasure-key="${entry.key}" aria-label="${entry.name} — ${entry.missionLabel} 미션">
          <div class="treasure-card-frame">
            <img src="${TREASURE_IMG(entry.image)}" alt="${entry.name}" loading="lazy" />
            <span class="treasure-card-badge">✨</span>
          </div>
          <span class="treasure-card-name">${entry.name}</span>
          <span class="treasure-card-mission">${entry.missionLabel} 미션</span>
        </button>
      `;
    }
    return `
      <button type="button" class="treasure-card treasure-card--locked" data-route="${entry.route}" aria-label="${entry.missionLabel} 미션으로 가서 되찾기">
        <div class="treasure-card-frame">
          <img class="treasure-card-silhouette" src="${TREASURE_IMG(entry.image)}" alt="" loading="lazy" />
        </div>
        <span class="treasure-card-name">${entry.missionLabel}</span>
        <span class="treasure-card-mission">눌러서 미션 하러 가기</span>
      </button>
    `;
  }).join("");

  app.innerHTML = `
    <div class="treasure-album-screen">
      <div class="treasure-album-bg"></div>
      <div class="treasure-album-overlay">
        <header class="treasure-album-header">
          <button type="button" class="btn ghost treasure-album-back">${viewOnly ? "◀ 학급관리" : "◀ 홈으로"}</button>
          <div class="treasure-album-heading">
            <h1 class="treasure-album-title">${viewOnly ? `📜 ${ownerName}의 보물도감` : "📜 보물도감"}</h1>
            <p class="treasure-album-sub">
              ${viewOnly
                ? (allDone
                  ? `🎉 ${ownerName} 학생이 14개의 국보 보물을 모두 되찾았어요!`
                  : `${ownerName} 학생이 되찾은 대한민국 국보 보물이에요.`)
                : (allDone
                  ? "🎉 도깨비가 가져간 14개의 국보 보물을 모두 되찾았어요!"
                  : "도깨비에게서 되찾은 대한민국 국보 보물을 모아두는 곳이에요.")}
            </p>
          </div>
          <div class="treasure-album-progress" aria-label="보물 수집 진행">
            <span class="treasure-album-progress-num">${acquired}</span>
            <span class="treasure-album-progress-sep">/</span>
            <span class="treasure-album-progress-total">${total}</span>
            <span class="treasure-album-progress-label">보물 되찾음</span>
          </div>
        </header>
        <div class="treasure-album-grid">${cards}</div>
      </div>
    </div>
  `;

  const backBtn = app.querySelector(".treasure-album-back");
  if (backBtn) {
    backBtn.onclick = (e) => {
      e.stopPropagation();
      playSound("click.mp3");
      if (viewOnly) state.teacherAlbumView = null;
      state.current = viewOnly ? "teacher_dashboard" : "main";
      render();
    };
  }

  app.querySelectorAll(".treasure-card[data-route]").forEach((btn) => {
    btn.onclick = () => {
      const entry = items.find((item) => item.route === btn.dataset.route);
      if (viewOnly) {
        if (entry?.acquired) showTreasureDetail(entry);
        else {
          Swal.fire({
            title: "아직 되찾지 못했어요",
            text: `${ownerName} 학생은 ${entry?.missionLabel || "이"} 미션을 아직 끝내지 않았어요.`,
            icon: "info",
            confirmButtonText: "확인"
          });
        }
        return;
      }
      goToTreasureActivity(btn.dataset.route);
    };
  });
}

function setupNavigationAndHelp(helpText) {
  const home = document.querySelector("[data-go='main']");
  if (home) home.onclick = () => { state.current = "main"; render(); };
  const help = document.getElementById("helpBtn");
  if (help) help.onclick = () => speakLine(helpText, "guide.mp3");
}

function renderStageActivityMenu(stageNum) {
  const menu = STAGE_MENUS[stageNum];
  if (!menu) return;
  const count = menu.activities.length;
  const gridClass = count === 3
    ? "activity-picker-grid activity-picker-grid--three"
    : "activity-picker-grid";
  const cards = menu.activities.map((act) => {
    const locked = !isActivityOpenForStudent(act.route);
    return `
    <button type="button" class="activity-picker${locked ? " is-locked" : ""}" data-go="${act.route}"${locked ? ` aria-label="${act.label} (아직 열리지 않았어요)"` : ""}>
      <img class="activity-picker-img" src="${STAGE_IMG(stageNum, act.image)}" alt="${act.label}" />
      <span class="activity-picker-label">${act.label}</span>
      ${locked ? `<span class="activity-picker-lock" aria-hidden="true">🔒</span>` : ""}
    </button>
  `;
  }).join("");

  app.innerHTML = `
    <div class="stage-screen stage-screen--menu">
      <img class="stage-bg" src="${IMG(`stage${stageNum}-bg.png`)}" alt="" decoding="async" fetchpriority="low" />
      <div class="stage-overlay stage-overlay--menu">
        <div class="activity-picker-screen">
          <div class="activity-picker-header">
            <span class="activity-picker-help header-spacer" aria-hidden="true">🔊</span>
            <h2 class="activity-picker-title">${menu.title}</h2>
            <button type="button" class="activity-picker-help" id="helpBtn">🔊</button>
          </div>
          <p class="activity-picker-hint">활동을 골라 주세요</p>
          <div class="${gridClass}">${cards}</div>
        </div>
      </div>
    </div>
  `;
  setupNavigationAndHelp(menu.help);
}

function dragSetup(pieceSelector = ".piece", zoneSelector = ".drop-zone") {
  let dragged = null;
  document.querySelectorAll(pieceSelector).forEach((el) => {
    el.draggable = true;
    el.ondragstart = () => dragged = el;
    el.onclick = () => {
      Swal.fire({ icon: "info", title: "조각 안내", text: el.dataset.info || "멋진 조각이야!" });
      playSound("piece_info.mp3");
    };
  });
  document.querySelectorAll(zoneSelector).forEach((zone) => {
    zone.ondragover = (e) => e.preventDefault();
    zone.ondrop = (e) => {
      e.preventDefault();
      if (!dragged) return;
      if (zone.dataset.accept === dragged.dataset.type) {
        zone.appendChild(dragged);
        dragged.classList.add("ok");
        playSound("snap.mp3");
      } else {
        playSound("wrong.mp3");
      }
      checkCurrentStageSolved();
    };
  });
}

function checkCurrentStageSolved() {
  const all = [...document.querySelectorAll(".drop-zone[data-accept]")];
  const complete = all.length && all.every((z) => z.querySelector(".piece"));
  if (complete) {
    if (state.current === "stage1") state.solved.tg = true;
    if (state.current === "stage2") state.solved.hangul = true;
    if (state.current === "stage3") state.solved.hanbok = true;
    Swal.fire("성공!", "착! 딱 맞췄어!", "success");
    saveProgress();
  }
}

function difficultyNumber(base, normal, hard) {
  if (state.difficulty === "hard") return hard;
  if (state.difficulty === "normal") return normal;
  return base;
}

function openReport() {
  const solvedEntries = Object.entries(state.solved);
  const count = solvedEntries.filter(([, v]) => v).length;
  const lines = solvedEntries.map(([k, v]) => `${k}: ${v ? "완료" : "미완료"}`);
  const saveNote = isSaveEnabled() ? "" : "\n※ 체험 모드: 진행 기록은 저장되지 않습니다.";
  const text = [
    "우리 문화 수호대 학습 리포트",
    `인증코드: ${state.code || "-"}`,
    `난이도: ${state.difficulty}`,
    `완료 수: ${count}/9`,
    ...lines,
    saveNote
  ].join("\n");
  Swal.fire({
    title: "진행 리포트",
    html: `<div style="text-align:left;white-space:pre-line">${text}</div>`,
    showDenyButton: true,
    showCancelButton: isSaveEnabled(),
    denyButtonText: "리포트 저장",
    confirmButtonText: "닫기",
    cancelButtonText: "기록 초기화"
  }).then((res) => {
    if (res.isDenied) downloadReport(text);
    if (res.dismiss === Swal.DismissReason.cancel && isSaveEnabled()) {
      clearProgress();
      saveProgress();
      render();
    }
  });
}

function downloadReport(text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `kculture-report-${state.code || "guest"}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function renderStage1Menu() {
  renderStageActivityMenu(1);
}

/* ───────────── 태극기 (건·곤·감·리 + 태극) ───────────── */
// ▼ 에셋·사운드 파일명 (assets/images/taegukgi/, assets/sounds/ 에서 교체 가능)
const TG_ASSETS = {
  frame: "frame-empty.svg",
  taeguk: "taeguk.png",
  geon: "geon.png",
  gon: "gon.png",
  gam: "gam.png",
  ri: "ri.png",
  taegukgi: "taegukgi.png",
  flag: "flag.png",
  bg: "taegukgi-bg.png"
};
const TG_SOUNDS = {
  snap: "taegeukgi-snap.wav",
  bounce: "taegeukgi-bounce.wav",
  complete: "taegeukgi-complete.wav"
};
// 슬롯 위치 (%) — frame-empty.svg(900×600) 기준
const TG_SLOTS = [
  { id: "taeguk", left: 32, top: 17, w: 36, h: 66 },
  { id: "geon", left: -0.75, top: -1.75, w: 31.5, h: 49.5 },
  { id: "gon", left: 69.25, top: 52.25, w: 31.5, h: 49.5 },
  { id: "gam", left: 69.25, top: -1.75, w: 31.5, h: 49.5 },
  { id: "ri", left: -0.75, top: 52.25, w: 31.5, h: 49.5 }
];
function tgCreatePlacedPiece(pieceId) {
  const piece = TG_PIECES.find((p) => p.id === pieceId);
  const s = TG_SLOTS.find((x) => x.id === pieceId);
  const rotationByPiece = { geon: -45, gon: -45, gam: 45, ri: 45 };
  const el = document.createElement("div");
  el.className = "tg-placed-piece";
  el.dataset.name = piece.name;
  el.dataset.meaning = piece.meaning;
  el.dataset.voice = piece.voice || "";
  el.dataset.voiceFile = Array.isArray(piece.voiceFile) ? piece.voiceFile.join("|") : "";
  el.style.left = s.left + "%";
  el.style.top = s.top + "%";
  el.style.width = s.w + "%";
  el.style.height = s.h + "%";
  const img = document.createElement("img");
  img.src = TG_IMG(TG_ASSETS[piece.img]);
  img.alt = piece.name;
  img.draggable = false;
  if (rotationByPiece[pieceId]) {
    img.style.transform = `rotate(${rotationByPiece[pieceId]}deg)`;
  }
  el.appendChild(img);
  return el;
}
// ▼ 조각 설명 (말풍선·TTS). img 키는 TG_ASSETS와 연결.
const TG_PIECES = [
  {
    id: "taeguk", name: "태극", meaning: "조화", img: "taeguk",
    tip: "빨간색은 위(하늘), 파란색은 아래(땅)! 음과 양의 조화야!",
    voice: "빨간색은 위 하늘, 파란색은 아래 땅! 음과 양의 조화야!",
    voiceFile: ["assets/audio/taegeukgi/taegeuk-taeguk-explanation.mp3"]
  },
  {
    id: "geon", name: "건", meaning: "하늘", img: "geon",
    tip: "하늘을 뜻하는 '건'이야! ☰ 세 줄 모두 굵은 선.",
    voice: "하늘을 뜻하는 건!",
    voiceFile: ["assets/audio/taegeukgi/taegeuk-geon-explanation.mp3"]
  },
  {
    id: "gon", name: "곤", meaning: "땅", img: "gon",
    tip: "땅을 뜻하는 '곤'이야! ☷ 세 줄 모두 끊어진 선.",
    voice: "땅을 뜻하는 곤!",
    voiceFile: ["assets/audio/taegeukgi/taegeuk-gon-explanation.mp3"]
  },
  {
    id: "gam", name: "감", meaning: "물", img: "gam",
    tip: "물을 뜻하는 '감'이야! ☵ 가운데만 굵은 선.",
    voice: "물을 뜻하는 감!",
    voiceFile: ["assets/audio/taegeukgi/taegeuk-gam-explanation.mp3"]
  },
  {
    id: "ri", name: "리", meaning: "불", img: "ri",
    tip: "불을 뜻하는 '리'야! ☲ 가운데만 끊어진 선.",
    voice: "불을 뜻하는 리!",
    voiceFile: ["assets/audio/taegeukgi/taegeuk-ri-explanation.mp3"]
  }
];
const TG_FIELD = {
  id: "field", name: "흰 바탕", meaning: "평화",
  voice: "흰 바탕은 평화를 뜻해요!",
  voiceFile: []
};

function ensureTgTooltip() {
  let tip = document.getElementById("tgTooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "tgTooltip";
    tip.className = "tg-tooltip";
    tip.hidden = true;
    document.body.appendChild(tip);
  }
  return tip;
}

function hideTgTooltip() {
  const tip = document.getElementById("tgTooltip");
  if (tip) tip.hidden = true;
}

function showTgTooltip(el, name, meaning) {
  if (!el || !meaning) return;
  const tip = ensureTgTooltip();
  tip.innerHTML = `<strong>${name}</strong><span>${meaning}</span>`;
  tip.hidden = false;
  tip.classList.remove("tg-tooltip--below");
  const rect = el.getBoundingClientRect();
  tip.style.left = `${rect.left + rect.width / 2}px`;
  if (rect.top > 88) {
    tip.style.top = `${rect.top - 8}px`;
    tip.style.transform = "translate(-50%, -100%)";
  } else {
    tip.classList.add("tg-tooltip--below");
    tip.style.top = `${rect.bottom + 8}px`;
    tip.style.transform = "translate(-50%, 0)";
  }
}

function tgActivityShell(body) {
  return `
    <div class="tg-activity-shell">
      <div class="tg-activity-body">${body}</div>
    </div>
  `;
}

function bindTgBoardToTrayHeight() {
  const tray = document.getElementById("tgTray");
  const board = document.getElementById("tgBoard");
  const play = document.querySelector(".tg-play");
  if (!tray || !board || !play) return;
  const apply = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      board.style.width = "";
      board.style.height = "";
      tray.style.width = "";
      tray.style.height = "";
      tray.style.flex = "";
      play.style.width = "";
      return;
    }
    const header = document.querySelector(".stage-header--activity");
    const targetW = Math.round((header || play).getBoundingClientRect().width);
    if (targetW < 80) return;
    play.style.width = `${targetW}px`;
    const gap = parseFloat(getComputedStyle(play).columnGap || getComputedStyle(play).gap) || 18;
    const inner = Math.max(targetW - gap, 80);
    let boardW = Math.round(inner * 15 / 19);
    let trayW = inner - boardW;
    let boardH = Math.round(boardW * 2 / 3);
    const headerBottom = header ? header.getBoundingClientRect().bottom : 80;
    const hintEl = document.getElementById("tgHint");
    const hintH = hintEl && !hintEl.hidden ? hintEl.getBoundingClientRect().height + 10 : 8;
    const availH = Math.floor(window.innerHeight - headerBottom - hintH - 12);
    if (availH > 120 && boardH > availH) {
      const scale = availH / boardH;
      boardW = Math.round(boardW * scale);
      trayW = Math.round(trayW * scale);
      boardH = availH;
    }
    board.style.width = `${boardW}px`;
    board.style.height = `${boardH}px`;
    tray.style.width = `${trayW}px`;
    tray.style.flex = `0 0 ${trayW}px`;
    tray.style.height = `${boardH}px`;
  };
  apply();
  requestAnimationFrame(apply);
  if (typeof ResizeObserver !== "function") return;
  const ro = new ResizeObserver(apply);
  const header = document.querySelector(".stage-header--activity");
  if (header) ro.observe(header);
  const panel = document.querySelector(".stage-panel--activity");
  if (panel) ro.observe(panel);
}

function renderStage1Act1() {
  const trayHTML = TG_PIECES.map((p, i) => {
    const rot = [-6, 4, -3, 5, -4][i];
    const voiceFile = Array.isArray(p.voiceFile) ? p.voiceFile.join("|") : "";
    return `<div class="tg-piece" draggable="true" data-id="${p.id}" data-name="${p.name}" data-meaning="${p.meaning}" data-tip="${p.tip}" data-voice="${p.voice}" data-voice-file="${voiceFile}"
      style="--rot:${rot}deg"><img src="${TG_IMG(TG_ASSETS[p.img])}" alt="${p.name}" /><span class="tg-plabel">${p.name}</span></div>`;
  }).join("");
  const slotsHTML = TG_SLOTS.map((s) => {
    const p = TG_PIECES.find((x) => x.id === s.id);
    const voiceFile = p && Array.isArray(p.voiceFile) ? p.voiceFile.join("|") : "";
    return `<div class="tg-slot" data-accept="${s.id}" data-name="${p.name}" data-meaning="${p.meaning}" data-voice="${p.voice}" data-voice-file="${voiceFile}"
      style="left:${s.left}%;top:${s.top}%;width:${s.w}%;height:${s.h}%"></div>`;
  }).join("");

  app.innerHTML = sceneTemplate("STAGE 1-1 태극기 세우기", tgActivityShell(`
    <div class="tg-game">
      <div class="tg-play">
        <div class="tg-board-wrap">
          <div class="tg-board" id="tgBoard">
            <img class="tg-frame" src="${TG_IMG(TG_ASSETS.frame)}" alt="태극기 틀" />
            <div class="tg-board-art" id="tgBoardArt"></div>
            <div class="tg-field-hotspot" data-name="${TG_FIELD.name}" data-meaning="${TG_FIELD.meaning}" data-voice="${TG_FIELD.voice}"></div>
            ${slotsHTML}
            <div class="tg-glow" id="tgGlow" hidden></div>
          </div>
        </div>
        <div class="tg-tray" id="tgTray">
          ${trayHTML}
        </div>
      </div>
      <p class="tg-hint" id="tgHint">조각을 탭해서 고른 뒤 자리를 탭하거나, 끌어다 놓아요!</p>
      <div class="tg-suho-talk" id="tgSuhoTalk" hidden>
        <img class="tg-suho-talk-char" src="${IMG("suho-main.png")}" alt="수호" />
        <div class="tg-suho-talk-bubble">
          <p class="tg-suho-talk-text" id="tgSuhoTalkText"></p>
        </div>
        <button type="button" class="btn primary" id="tgSuhoTalkNext">다음 ▶</button>
      </div>
    </div>
  `));
  setupNavigationAndHelp("건·곤·감·리와 태극 문양을 맞는 자리에 놓아 태극기를 완성해보자!");
  bindTgBoardToTrayHeight();

  const board = document.getElementById("tgBoard");
  let dragging = null;
  let selected = null;
  let placed = 0;

  const speakPieceVoice = (piece) => {
    if (!piece.dataset.spoken && piece.dataset.voice) {
      piece.dataset.spoken = "1";
      const voiceFiles = piece.dataset.voiceFile
        ? piece.dataset.voiceFile.split("|").map((x) => x.trim()).filter(Boolean)
        : [];
      speakLine(piece.dataset.voice, voiceFiles.length ? voiceFiles : "voice_default.mp3");
    }
  };

  const bindPartHover = (el, { playVoice = true } = {}) => {
    el.addEventListener("mouseenter", () => {
      showTgTooltip(el, el.dataset.name, el.dataset.meaning);
      if (playVoice && !el.classList.contains("filled")) speakPieceVoice(el);
    });
    el.addEventListener("mouseleave", () => {
      hideTgTooltip();
      delete el.dataset.spoken;
    });
  };

  const selectPiece = (piece) => {
    if (piece.classList.contains("placed")) return;
    if (selected === piece) {
      selected.classList.remove("tg-selected");
      selected = null;
      return;
    }
    if (selected) selected.classList.remove("tg-selected");
    selected = piece;
    piece.classList.add("tg-selected", "tg-pulse");
    speakPieceVoice(piece);
    playSound("click.mp3");
  };

  const tryPlace = (piece, slot) => {
    if (!piece || piece.classList.contains("placed")) return;
    if (piece.dataset.id === slot.dataset.accept) {
      const placedEl = tgCreatePlacedPiece(slot.dataset.accept);
      board.appendChild(placedEl);
      bindPartHover(placedEl, { playVoice: false });
      piece.classList.add("placed");
      piece.classList.remove("tg-selected");
      piece.setAttribute("draggable", "false");
      slot.classList.add("filled");
      playSound(TG_SOUNDS.snap);
      placed++;
      if (selected === piece) selected = null;
      if (placed >= TG_PIECES.length) tgComplete();
    } else {
      playSound(TG_SOUNDS.bounce);
      piece.classList.add("tg-wrong");
      slot.classList.add("tg-slot-wrong");
      setTimeout(() => {
        piece.classList.remove("tg-wrong");
        slot.classList.remove("tg-slot-wrong");
      }, 450);
    }
  };

  document.querySelectorAll(".tg-piece").forEach((piece) => {
    piece.addEventListener("dragstart", (e) => {
      dragging = piece;
      e.dataTransfer.effectAllowed = "move";
      hideTgTooltip();
    });
    piece.addEventListener("dragend", () => { dragging = null; });
    piece.addEventListener("mouseenter", () => {
      showTgTooltip(piece, piece.dataset.name, piece.dataset.meaning);
      if (!piece.classList.contains("placed")) {
        speakPieceVoice(piece);
        piece.classList.add("tg-pulse");
      }
    });
    piece.addEventListener("mouseleave", () => {
      hideTgTooltip();
      if (piece !== selected) piece.classList.remove("tg-pulse");
      delete piece.dataset.spoken;
    });
    // 모바일 터치 대안: 조각을 탭해서 고른 뒤, 자리를 탭하면 놓을 수 있어요.
    piece.addEventListener("click", () => {
      selectPiece(piece);
      showTgTooltip(piece, piece.dataset.name, piece.dataset.meaning);
    });
  });

  document.querySelectorAll(".tg-slot").forEach((slot) => {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (!slot.classList.contains("filled")) slot.classList.add("over");
    });
    slot.addEventListener("dragleave", () => slot.classList.remove("over"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("over");
      if (slot.classList.contains("filled")) return;
      if (!dragging || dragging.classList.contains("placed")) return;
      tryPlace(dragging, slot);
    });
    slot.addEventListener("click", () => {
      if (slot.classList.contains("filled")) return;
      if (selected) tryPlace(selected, slot);
    });
  });
  const fieldHotspot = document.querySelector(".tg-field-hotspot");
  if (fieldHotspot) bindPartHover(fieldHotspot, { playVoice: false });

  function tgComplete() {
    board.classList.add("tg-lit");
    document.getElementById("tgGlow").hidden = false;
    playSound(TG_SOUNDS.complete);
    document.getElementById("tgTray").style.opacity = "0.45";
    document.getElementById("tgTray").style.pointerEvents = "none";
    const hint = document.getElementById("tgHint");
    if (hint) hint.hidden = true;
    const talk = document.getElementById("tgSuhoTalk");
    const talkText = document.getElementById("tgSuhoTalkText");
    const talkNext = document.getElementById("tgSuhoTalkNext");
    const lines = ["와! 태극기를 완성했어!", "태극기 다는 날은 언제일까?"];
    let lineIdx = 0;
    talkText.innerHTML = eojeolHTML(lines[0]);
    talk.hidden = false;
    talkNext.onclick = () => {
      playSound("click.mp3");
      lineIdx += 1;
      if (lineIdx >= lines.length) {
        state.tgHoist = { phase: "match", matched: [], completed: [], currentHoliday: null, allDone: false };
        state.current = "stage1_a1_hoist";
        render();
        return;
      }
      talkText.innerHTML = eojeolHTML(lines[lineIdx]);
    };
  }
}

/* ───────────── 태극기 게양하기 (stage1_a1_hoist) ───────────── */
// ▼ 국경일 데이터 (추후 수정·추가 가능)
const TG_HOLIDAYS = [
  { id: "samil", name: "삼일절", month: 3, day: 1, type: "celebration",
    voice: "정답! 3월 1일은 독립운동을 기념하는 삼일절이야!",
    explain: "3월 1일 삼일절은 1919년 3·1 운동을 기념하는 날이야. 우리나라가 독립을 위해 함께 외친 소중한 날이지!" },
  { id: "hyeonchung", name: "현충일", month: 6, day: 6, type: "memorial",
    voice: "정답! 6월 6일은 나라를 위해 돌아가신 분들을 기억하는 현충일이야!",
    explain: "6월 6일 현충일은 나라를 위해 희생하신 분들을 기억하고 추모하는 날이야. 태극기는 조금 내려 게양해요." },
  { id: "jeheon", name: "제헌절", month: 7, day: 17, type: "celebration",
    voice: "정답! 7월 17일은 우리 헌법이 만들어진 제헌절이야!",
    explain: "7월 17일 제헌절은 대한민국 헌법이 제정된 날을 기념하는 국경일이야!" },
  { id: "gwangbok", name: "광복절", month: 8, day: 15, type: "celebration",
    voice: "정답! 8월 15일은 우리나라가 빛을 되찾은 광복절이야!",
    explain: "8월 15일 광복절은 1945년 우리나라가 일본의 식민 통치에서 벗어난 날을 기념하는 날이야!" },
  { id: "gaecheon", name: "개천절", month: 10, day: 3, type: "celebration",
    voice: "정답! 10월 3일은 단군왕검이 세운 나라를 기념하는 개천절이야!",
    explain: "10월 3일 개천절은 단군왕검이 고조선을 세운 날을 기념하는 국경일이야!" },
  { id: "hangul", name: "한글날", month: 10, day: 9, type: "celebration",
    voice: "정답! 10월 9일은 우리 글자 한글을 기념하는 한글날이야!",
    explain: "10월 9일 한글날은 세종대왕이 훈민정음(한글)을 반포한 날을 기념하는 날이야!" }
];
const TG_HOIST_SOUNDS = { fanfare: "taegeukgi-fanfare.wav", snap: "taegeukgi-snap.wav" };
// scene(#tgPoleScene) = taegukgi-bg.png(1672×941) 비율. 깃대는 배경 중앙.
const TG_HOIST_BG_ASPECT = 1672 / 941;
const TG_HOIST_LAYOUT = {
  poleX: 50.5,
  flagHeight: 26,
  flagPadLeft: 7.66,
  flagPadTop: 15.31,
  celebrationVisibleY: 13.4,
  memorialVisibleY: 31.2,
  startVisibleY: 58,
  tolerancePx: 16
};

function tgHoistFlagBoxSize() {
  const L = TG_HOIST_LAYOUT;
  const flagH = L.flagHeight;
  const flagW = flagH / TG_HOIST_BG_ASPECT;
  return { flagW, flagH };
}

function tgHoistFlagLeftPct() {
  const L = TG_HOIST_LAYOUT;
  const { flagW } = tgHoistFlagBoxSize();
  return L.poleX - (L.flagPadLeft / 100) * flagW;
}

function tgHoistFlagTopPct(visibleTop) {
  const L = TG_HOIST_LAYOUT;
  return visibleTop - (L.flagPadTop / 100) * L.flagHeight;
}

function tgHoistFlagTopCss(type) {
  const L = TG_HOIST_LAYOUT;
  const vis = type === "memorial" ? L.memorialVisibleY : L.celebrationVisibleY;
  return tgHoistFlagTopPct(vis) + "%";
}

function tgHoistTargetTopPx(scene, topCss) {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;left:0;top:${topCss};width:0;height:0;pointer-events:none`;
  scene.appendChild(probe);
  const y = probe.getBoundingClientRect().top;
  probe.remove();
  return y;
}

function tgHoistForType(type) {
  if (type === "memorial") {
    return {
      guide: "슬픈 날이니까 깃봉에서 한 칸 내려서 달아보자.",
      wrongMsg: "슬픈 날에는 깃봉에서 한 칸 내려서 달아야 해! 다시 해보자."
    };
  }
  return {
    guide: "기쁜 날이니까 하늘 높이 바짝 달아보자!",
    wrongMsg: "기쁜 날에는 깃봉 맨 꼭대기까지 바짝 올려 달아야 해! 다시 해보자."
  };
}

function tgWhenHoistImagesReady(scene, cb) {
  const imgs = scene.querySelectorAll(".tg-pole-bg, .tg-flag-draggable img");
  let pending = imgs.length || 1;
  const done = () => {
    if (--pending > 0) return;
    requestAnimationFrame(() => requestAnimationFrame(cb));
  };
  imgs.forEach((img) => {
    if (img.complete) done();
    else { img.onload = done; img.onerror = done; }
  });
}

function tgApplyHoistLayout(scene, flag) {
  const L = TG_HOIST_LAYOUT;
  const { flagW, flagH } = tgHoistFlagBoxSize();
  flag.style.height = flagH + "%";
  flag.style.width = flagW + "%";
  flag.style.left = tgHoistFlagLeftPct() + "%";
  return {
    startTop: tgHoistFlagTopPct(L.startVisibleY),
    tolerancePx: L.tolerancePx
  };
}

function bindTgHoistFit() {
  const scene = document.getElementById("tgPoleScene");
  const hoist = document.querySelector(".tg-hoist-pole");
  const flag = document.getElementById("tgFlagDrag");
  if (!scene || !hoist) return;
  const apply = () => {
    const header = document.querySelector(".stage-header--activity");
    const headerBottom = header ? header.getBoundingClientRect().bottom : 64;
    const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    const parent = hoist.parentElement || hoist;
    const availW = Math.max(160, Math.floor(parent.getBoundingClientRect().width));
    const bottomSafe = 72;
    const fit = () => {
      const availH = Math.max(140, Math.floor(vh - headerBottom - bottomSafe));
      let h = availH;
      let w = h * TG_HOIST_BG_ASPECT;
      if (w > availW) {
        w = availW;
        h = w / TG_HOIST_BG_ASPECT;
      }
      return { w: Math.round(w), h: Math.round(h) };
    };
    const size = fit();
    hoist.style.width = size.w + "px";
    scene.style.width = size.w + "px";
    scene.style.height = size.h + "px";
    if (flag) tgApplyHoistLayout(scene, flag);
  };
  hoist._tgFit = apply;
  apply();
  requestAnimationFrame(apply);
  if (window._tgHoistFit) {
    window.removeEventListener("resize", window._tgHoistFit);
    if (window.visualViewport) window.visualViewport.removeEventListener("resize", window._tgHoistFit);
  }
  window._tgHoistFit = apply;
  window.addEventListener("resize", apply);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", apply);
  if (typeof ResizeObserver !== "function") return;
  const ro = new ResizeObserver(apply);
  const header = document.querySelector(".stage-header--activity");
  if (header) ro.observe(header);
  const body = hoist.parentElement;
  if (body) ro.observe(body);
}

function tgHoistRemaining(h) {
  return TG_HOLIDAYS.filter((x) => !(h.completed || []).includes(x.id));
}

function tgHoistBindNextBtn(h) {
  const backBtn = document.getElementById("tgHoistBackMatch");
  if (!backBtn) return;
  const remaining = tgHoistRemaining(h);
  if (!h.poleComplete || !remaining.length) {
    backBtn.hidden = true;
    return;
  }
  backBtn.textContent = "다음 국경일 게양하기 ▶";
  backBtn.hidden = false;
  backBtn.onclick = () => {
    playSound("click.mp3");
    h.currentHoliday = remaining[0].id;
    h.poleComplete = false;
    h.lastSpoken = null;
    h.phase = "hoist";
    render();
  };
}
function tgHoistInit() {
  if (!state.tgHoist) {
    state.tgHoist = { phase: "match", matched: [], completed: [], currentHoliday: null, allDone: false };
  }
  if (!Array.isArray(state.tgHoist.matched)) state.tgHoist.matched = [];
  return state.tgHoist;
}

function renderStage1Act1Hoist() {
  const h = tgHoistInit();
  if (h.phase === "match") renderTgHoistMatch(h);
  else renderTgHoistPole(h);
}

function tgDrawMatchLine(board, svg, dateId) {
  const dEl = board.querySelector(`.tg-match-date[data-id="${dateId}"]`);
  const nEl = board.querySelector(`.tg-match-name[data-id="${dateId}"]`);
  if (!dEl || !nEl) return;
  const br = board.getBoundingClientRect();
  const dr = dEl.getBoundingClientRect();
  const nr = nEl.getBoundingClientRect();
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", String(nr.right - br.left));
  line.setAttribute("y1", String(nr.top + nr.height / 2 - br.top));
  line.setAttribute("x2", String(dr.left - br.left));
  line.setAttribute("y2", String(dr.top + dr.height / 2 - br.top));
  line.setAttribute("class", "tg-match-line ok");
  svg.appendChild(line);
}

function renderTgHoistMatch(h) {
  if (!h.matchDates || !h.matchNames) {
    h.matchDates = shuffleArray(TG_HOLIDAYS.map((x) => ({ id: x.id, label: `${x.month}월 ${x.day}일` })));
    h.matchNames = shuffleArray(TG_HOLIDAYS.map((x) => ({ id: x.id, label: x.name, type: x.type })));
  }
  const matched = h.matched || [];
  const datesHTML = h.matchDates.map((d) =>
    `<button type="button" class="tg-match-box tg-match-date${matched.includes(d.id) ? " done" : ""}" data-id="${d.id}">${d.label}</button>`
  ).join("");
  const namesHTML = h.matchNames.map((n) =>
    `<button type="button" class="tg-match-box tg-match-name${matched.includes(n.id) ? " done" : ""}" data-id="${n.id}">${n.label}</button>`
  ).join("");

  const matchGuide = matched.length
    ? `잘했어! ${matched.length}개나 연결했네. 나머지 짝도 찾아볼까?`
    : "국경일 이름이랑 날짜를 짝지어 볼까? 상자를 눌러서 같은 것끼리 연결해 봐!";
  app.innerHTML = sceneTemplate("STAGE 1-1 태극기 세우기", tgActivityShell(`
    <div class="tg-hoist tg-hoist-match">
      <div class="tg-hoist-talk">
        <img class="tg-hoist-talk-char" src="${IMG("suho-main.png")}" alt="수호" />
        <div class="tg-hol-bubble" id="tgMatchMsg">${eojeolHTML(matchGuide)}</div>
      </div>
      <div class="tg-match-board" id="tgMatchBoard">
        <svg class="tg-match-lines" id="tgMatchSvg"></svg>
        <div class="tg-match-col tg-match-col--name">${namesHTML}</div>
        <div class="tg-match-col tg-match-col--date">${datesHTML}</div>
      </div>
    </div>
  `));
  setupNavigationAndHelp("날짜와 국경일 이름을 짝지어 연결해보자!");
  tgHoistMissionBtn(h.allDone);

  const board = document.getElementById("tgMatchBoard");
  const svg = document.getElementById("tgMatchSvg");
  const msg = document.getElementById("tgMatchMsg");
  let selId = null;
  let selKind = null;

  const redrawLines = () => {
    svg.innerHTML = "";
    matched.forEach((id) => tgDrawMatchLine(board, svg, id));
  };
  requestAnimationFrame(redrawLines);

  const goHoistIfDone = () => {
    if (matched.length < TG_HOLIDAYS.length) return;
    setEojeolHTML(msg, "와, 전부 연결했어! 이제 태극기를 달아볼까?");
    setTimeout(() => {
      h.phase = "hoist";
      h.currentHoliday = TG_HOLIDAYS.find((x) => !h.completed.includes(x.id))?.id || TG_HOLIDAYS[0].id;
      h.poleComplete = false;
      h.lastSpoken = null;
      render();
    }, 1400);
  };
  if (matched.length >= TG_HOLIDAYS.length) {
    goHoistIfDone();
    return;
  }

  const clearSel = () => {
    selId = null;
    selKind = null;
    board.querySelectorAll(".tg-match-box").forEach((b) => b.classList.remove("sel"));
  };

  const pickBox = (btn, kind) => {
    if (btn.classList.contains("done")) return;
    const id = btn.dataset.id;
    if (!selId || selKind === kind) {
      board.querySelectorAll(`.tg-match-${kind}`).forEach((b) => b.classList.remove("sel"));
      btn.classList.add("sel");
      selId = id;
      selKind = kind;
      setEojeolHTML(msg, kind === "name"
        ? "좋아! 이제 맞는 날짜를 눌러 봐!"
        : "좋아! 이제 맞는 국경일 이름을 눌러 봐!");
      return;
    }
    if (id === selId) {
      const hol = TG_HOLIDAYS.find((x) => x.id === id);
      if (!matched.includes(id)) matched.push(id);
      h.matched = matched;
      tgDrawMatchLine(board, svg, id);
      board.querySelectorAll(`.tg-match-date[data-id="${id}"], .tg-match-name[data-id="${id}"]`)
        .forEach((b) => { b.classList.add("done"); b.classList.remove("sel"); });
      playSound(TG_SOUNDS.snap);
      setEojeolHTML(msg, hol.voice);
      speakLine(hol.voice);
      selId = null;
      selKind = null;
      goHoistIfDone();
    } else {
      playSound("wrong.mp3");
      btn.classList.add("wrong");
      setEojeolHTML(msg, "앗, 짝이 안 맞아. 다시 연결해 보자!");
      setTimeout(() => btn.classList.remove("wrong"), 450);
      clearSel();
    }
  };

  board.querySelectorAll(".tg-match-date").forEach((btn) => {
    btn.onclick = () => pickBox(btn, "date");
  });
  board.querySelectorAll(".tg-match-name").forEach((btn) => {
    btn.onclick = () => pickBox(btn, "name");
  });
}

function renderTgHoistPole(h) {
  const hol = TG_HOLIDAYS.find((x) => x.id === h.currentHoliday) || TG_HOLIDAYS[0];
  const cfg = tgHoistForType(hol.type);
  const hoistTalk = `${hol.explain || hol.voice} ${cfg.guide}`;
  app.innerHTML = sceneTemplate("STAGE 1-1 태극기 세우기", tgActivityShell(`
    <div class="tg-hoist tg-hoist-pole">
      <div class="tg-hoist-talk">
        <img class="tg-hoist-talk-char" src="${IMG("suho-main.png")}" alt="수호" />
        <div class="tg-hol-bubble" id="tgHolBubble">${eojeolHTML(hoistTalk)}</div>
      </div>
      <div class="tg-pole-scene" id="tgPoleScene">
        <img class="tg-pole-bg" src="${TG_IMG(TG_ASSETS.bg)}" alt="" draggable="false" />
        <div class="tg-flag-draggable" id="tgFlagDrag">
          <img src="${TG_IMG(TG_ASSETS.flag)}" alt="태극기" draggable="false" />
        </div>
      </div>
      <button type="button" class="btn primary tg-hoist-back-match" id="tgHoistBackMatch" hidden>다음 국경일 게양하기 ▶</button>
    </div>
  `));
  setupNavigationAndHelp("태극기를 잡고 깃대에 맞게 올리거나 내려보자!");
  tgHoistMissionBtn(h.allDone);
  tgHoistBindNextBtn(h);

  const speakKey = `hoist-${hol.id}`;
  if (!h.poleComplete && h.lastSpoken !== speakKey) {
    h.lastSpoken = speakKey;
    speakLine(hoistTalk);
  }

  const scene = document.getElementById("tgPoleScene");
  const flag = document.getElementById("tgFlagDrag");
  const hoistEl = document.querySelector(".tg-hoist-pole");
  const refitHoist = () => { if (hoistEl && typeof hoistEl._tgFit === "function") hoistEl._tgFit(); };
  flag.querySelector("img").addEventListener("dragstart", (e) => e.preventDefault());
  const snap = {
    targetTopCss: tgHoistFlagTopCss(hol.type === "memorial" ? "memorial" : "celebration"),
    tolerancePx: TG_HOIST_LAYOUT.tolerancePx,
    startTop: tgHoistFlagTopPct(TG_HOIST_LAYOUT.startVisibleY)
  };
  let dragging = false, startY = 0, startTop = snap.startTop;

  const applyHoistLayout = () => {
    const m = tgApplyHoistLayout(scene, flag);
    snap.targetTopCss = tgHoistFlagTopCss(hol.type === "memorial" ? "memorial" : "celebration");
    snap.tolerancePx = m.tolerancePx;
    snap.startTop = m.startTop;
    flag.style.top = (h.poleComplete ? parseFloat(snap.targetTopCss) : snap.startTop) + "%";
    startTop = snap.startTop;
    if (h.poleComplete) {
      flag.classList.add("snapped");
      scene.classList.add("tg-wind");
      flag.style.pointerEvents = "none";
    }
  };
  bindTgHoistFit();
  tgWhenHoistImagesReady(scene, () => {
    applyHoistLayout();
    refitHoist();
  });

  if (h.poleComplete) return;

  const onMove = (clientY) => {
    if (!dragging) return;
    const rect = scene.getBoundingClientRect();
    const dy = clientY - startY;
    const pct = Math.max(8, Math.min(68, startTop + (dy / rect.height) * 100));
    flag.style.top = pct + "%";
  };

  const onEnd = () => {
    if (!dragging) return;
    dragging = false;
    flag.classList.remove("dragging");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onEnd);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onEnd);
    const flagTopPx = flag.getBoundingClientRect().top;
    const targetPx = tgHoistTargetTopPx(scene, snap.targetTopCss);
    const ok = Math.abs(flagTopPx - targetPx) <= snap.tolerancePx;
    if (ok) {
      flag.style.top = snap.targetTopCss;
      flag.classList.add("snapped");
      playSound(TG_HOIST_SOUNDS.snap);
      document.getElementById("tgPoleScene").classList.add("tg-wind");
      if (!h.completed.includes(hol.id)) h.completed.push(hol.id);
      h.poleComplete = true;
      if (h.completed.length >= TG_HOLIDAYS.length) {
        h.allDone = true;
        playSound(TG_HOIST_SOUNDS.fanfare);
        state.solved.tg = true;
        saveProgress();
        tgHoistMissionBtn(true);
      } else {
        Swal.fire("게양 성공! 🎉", `${hol.name} 태극기를 올바르게 게양했어요!`, "success");
      }
      tgHoistBindNextBtn(h);
      refitHoist();
      flag.style.pointerEvents = "none";
      const okBubble = document.getElementById("tgHolBubble");
      if (okBubble) setEojeolHTML(okBubble, `잘했어! ${hol.name} 태극기를 제대로 달았네!`);
    } else {
      playSound("wrong.mp3");
      flag.style.top = snap.startTop + "%";
      const badBubble = document.getElementById("tgHolBubble");
      if (badBubble) setEojeolHTML(badBubble, cfg.wrongMsg);
      Swal.fire("다시 해보자!", cfg.wrongMsg, "info");
      speakLine(cfg.wrongMsg);
    }
  };

  const onMouseMove = (e) => onMove(e.clientY);
  const onTouchMove = (e) => { e.preventDefault(); onMove(e.touches[0].clientY); };

  flag.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragging = true;
    startY = e.clientY;
    startTop = parseFloat(flag.style.top) || snap.startTop;
    flag.classList.add("dragging");
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onEnd);
  });
  flag.addEventListener("touchstart", (e) => {
    e.preventDefault();
    dragging = true;
    startY = e.touches[0].clientY;
    startTop = parseFloat(flag.style.top) || snap.startTop;
    flag.classList.add("dragging");
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  }, { passive: false });
}

function tgHoistMissionBtn(enabled) {
  bindMissionCompleteBtn(
    "stage1_a1",
    enabled,
    "게양 미션을 모두 완료하면 보물을 되찾을 수 있어요!",
    () => { state.solved.tg = true; saveProgress(); }
  );
}

/* ───────────── 무궁화 피우기 (이야기 → 개화 게임 → 사진 찾기) ───────────── */
// ▼ 스토리 삽화: assets/images/mugunghwa/ 실사 사진 사용
const MUGU_STORY = [
  { img: "백단심계1.jpg", line: "얘들아, 이 예쁜 꽃 이름을 아니? 바로 우리나라를 상징하는 나라꽃, 무궁화야!" },
  { img: "홍단심계1.jpg", line: "무궁화는 '다함이 없다'는 뜻의 '무궁'과 꽃 '화'가 합쳐진 이름이야. 여름부터 가을까지 100일 넘게 매일매일 새 꽃이 피고 진단다!" },
  { img: "백단심계3.jpg", line: "무궁화는 품종에 따라 조금씩 달라. 꽃잎 안쪽이 하얗고 가운데가 붉으면 '백단심', 꽃잎 전체가 진한 분홍이면 '홍단심'이라고 불러." },
  { img: "홍단심계4.jpg", line: "이렇게 소중한 무궁화는 애국가 가사 '무궁화 삼천리 화려강산'에도 나오고, 나라를 상징하는 여러 곳에도 숨어 있어. 이제 무궁화를 직접 피워보고, 어디에 숨어 있는지 함께 찾아보자!" }
];

// ▼ 개화 게임 부위 (완성 순서: 꽃받침 → 꽃잎 → 꽃술). 암술·수술은 하나로 묶어 '꽃술'로 다뤄요.
// layers는 assets/images/mugunghwa/parts/ 의 위치 지정 완료 레이어(1254×1254, 서로 겹치면 완성 사진과 정렬됨)
const MUGU_PARTS = [
  { id: "calyx", name: "꽃받침", tip: "꽃 전체를 아래에서 받쳐주는 초록색 부분이야!", icon: "icon-calyx.png", layers: ["layer-calyx.png"] },
  { id: "petal", name: "꽃잎", tip: "무궁화는 꽃잎이 5장! 서로 겹치며 동그랗게 펼쳐져.", icon: "icon-petal.png", layers: ["layer-petal-1.png", "layer-petal-2.png", "layer-petal-3.png", "layer-petal-4.png", "layer-petal-5.png"] },
  { id: "gotsul", name: "꽃술", tip: "암술과 수술을 함께 '꽃술'이라고 불러. 꽃가루도 만들고 씨앗도 만드는 아주 중요한 부분이야!", icon: "icon-gotsul.png", layers: ["layer-gotsul.png"] }
];
const MUGU_COMPLETE_IMG = "완성.png";

function muguIconHTML(part) {
  return `<div class="mugu-part-art"><img src="${MUGU_PART_IMG(part.icon)}" alt="${part.name}" draggable="false" /></div>`;
}
function muguLayerImgHTML(file) {
  return `<img class="mugu-layer" src="${MUGU_PART_IMG(file)}" alt="" draggable="false" />`;
}
function muguBoardArtHTML(m) {
  const layers = [];
  if (m.gameStage > 0 || (m.gameStage === 0 && m.gameAck)) layers.push(MUGU_PARTS[0].layers[0]);
  const petalsShown = m.gameStage > 1 ? 5 : (m.gameStage === 1 ? m.petalsPlaced : 0);
  for (let i = 0; i < petalsShown; i++) layers.push(MUGU_PARTS[1].layers[i]);
  if (m.gameStage === 2 && m.gameAck) layers.push(MUGU_PARTS[2].layers[0]);
  return layers.map(muguLayerImgHTML).join("");
}

// ▼ 사진 속 무궁화 찾기 — hotspot 좌표(%)는 assets/images/mugunghwa/ 원본 사진 기준
const MUGU_PHOTOS = [
  {
    file: "국회회의장(대한민국국회,공공누리open).JPG",
    hotspots: [{ left: 46, top: 22, w: 10, h: 14 }],
    caption: "국회 회의장 정면 배지 한가운데를 무궁화 꽃잎이 감싸고 있어! 대한민국 국회를 나타내는 국회 배지야."
  },
  {
    file: "대한민국여권(외교부 여권 안내, 공공누리 0유형).png",
    hotspots: [{ left: 55, top: 6, w: 32, h: 24 }],
    caption: "여권 표지 오른쪽 위에 새겨진 무궁화 문양! 우리나라를 대표하는 문서에도 무궁화가 함께해."
  },
  {
    file: "법원(서울고등법원).jpeg",
    hotspots: [{ left: 51, top: 32, w: 16, h: 22 }],
    caption: "법원 건물 가운데 둥근 문장에는 책과 함께 무궁화 무늬가 그려져 있어. 공정한 재판을 상징하는 법원의 상징이야."
  },
  {
    file: "대통령휘장-공공누리open.jpg",
    hotspots: [{ left: 40, top: 26, w: 10, h: 12 }],
    caption: "황금빛 봉황 장식 가운데, 아래쪽에 자리한 꽃 모양이 바로 무궁화 문양이야!"
  }
];

function createDefaultMuguState() {
  return {
    phase: "story",   // story -> game -> photo -> done
    storyIdx: 0,
    gameStage: 0,     // 0 꽃받침, 1 꽃잎, 2 꽃술
    gameAck: false,   // 현재 부위 완성 후 "다음" 대기 중
    petalsPlaced: 0,
    photoIdx: 0,
    photoWrong: 0,
    photoFound: false
  };
}
function muguInit() {
  if (!state.mugu) state.mugu = createDefaultMuguState();
  return state.mugu;
}

function muguNavSteps() {
  const steps = [];
  for (let i = 0; i < MUGU_STORY.length; i++) steps.push({ phase: "story", storyIdx: i });
  steps.push({ phase: "game" });
  for (let i = 0; i < MUGU_PHOTOS.length; i++) steps.push({ phase: "photo", photoIdx: i });
  // 완료 중간화면 없이 마지막 사진 다음 → 바로 생각친구 질문
  return steps;
}

function muguNavIndex(m) {
  const phase = m.phase || "story";
  if (phase === "story") return Math.max(0, Number(m.storyIdx) || 0);
  if (phase === "game") return MUGU_STORY.length;
  if (phase === "photo") return MUGU_STORY.length + 1 + Math.max(0, Number(m.photoIdx) || 0);
  return MUGU_STORY.length + 1 + MUGU_PHOTOS.length;
}

function muguApplyNavStep(m, step, dir) {
  const fromPhase = m.phase;
  m.phase = step.phase;
  if (step.phase === "story") {
    m.storyIdx = step.storyIdx;
    return;
  }
  if (step.phase === "game") {
    if (fromPhase !== "game") {
      m.gameStage = 0;
      m.gameAck = false;
      m.petalsPlaced = 0;
    }
    return;
  }
  if (step.phase === "photo") {
    m.photoIdx = step.photoIdx;
    m.photoWrong = 0;
    m.photoFound = dir < 0 && fromPhase === "done";
    return;
  }
  if (step.phase === "done") {
    m.photoIdx = MUGU_PHOTOS.length - 1;
    m.photoFound = true;
    state.solved.mugunghwa = true;
    saveProgress();
  }
}

function muguGoNav(dir) {
  const m = muguInit();
  const steps = muguNavSteps();
  const nextIdx = muguNavIndex(m) + dir;
  if (nextIdx < 0 || nextIdx >= steps.length) return false;
  muguApplyNavStep(m, steps[nextIdx], dir);
  render();
  return true;
}

function muguMissionBtn(ready) {
  bindMissionCompleteBtn(
    "stage1_a2",
    ready,
    "이야기 → 무궁화 피우기 게임 → 사진 찾기를 모두 마치면 보물을 되찾을 수 있어요!",
    () => { state.solved.mugunghwa = true; saveProgress(); }
  );
}

function renderStage1Act2() {
  const m = muguInit();
  if (m.phase === "done") {
    // 예전 세션·이전 버튼으로 돌아온 경우: 빈 완료화면 대신 마지막 사진 장면
    m.phase = "photo";
    m.photoIdx = MUGU_PHOTOS.length - 1;
    m.photoFound = true;
    renderMuguPhoto(m);
    return;
  }
  if (m.phase === "game") renderMuguGame(m);
  else if (m.phase === "photo") renderMuguPhoto(m);
  else renderMuguStory(m);
}

function muguEojeolHTML(text) {
  return eojeolHTML(text, "mugu-eojeol");
}

function eojeolHTML(text, className = "eojeol") {
  return String(text).trim().split(/\s+/).filter(Boolean)
    .map((word) => `<span class="${className}">${word}</span>`)
    .join("");
}

function setEojeolHTML(el, text, className = "eojeol") {
  if (!el) return;
  el.innerHTML = eojeolHTML(text, className);
}

function renderMuguStory(m) {
  const slide = MUGU_STORY[m.storyIdx];
  const isLast = m.storyIdx >= MUGU_STORY.length - 1;

  app.innerHTML = sceneTemplate("STAGE 1-2 무궁화 피우기", `
    <div class="section-card mugu-story">
      <div class="mugu-story-frame">
        <img class="mugu-story-img" src="${MUGU_IMG(slide.img)}" alt="무궁화" draggable="false" />
        ${photoCreditHTML(slide.img)}
      </div>
      <div class="mugu-story-talk">
        <img class="mugu-story-talk-char" src="${CHAR_IMG("rabbit.png")}" alt="토끼" />
        <div class="mugu-bubble mugu-bubble--story">
          <p class="mugu-bubble-text">${muguEojeolHTML(slide.line)}</p>
        </div>
      </div>
      <button type="button" class="btn primary mugu-next" id="muguStoryNext">${isLast ? "무궁화 피우러 가기 ▶" : "다음 ▶"}</button>
    </div>
  `);
  setupNavigationAndHelp("무궁화 이야기를 들어보자!");
  muguMissionBtn(false);
  speakLine(slide.line, "voice_default.mp3");

  document.getElementById("muguStoryNext").onclick = () => {
    playSound("click.mp3");
    if (isLast) m.phase = "game"; else m.storyIdx += 1;
    render();
  };
}

function renderMuguGame(m) {
  const part = MUGU_PARTS[m.gameStage];
  const isLastStage = m.gameStage === MUGU_PARTS.length - 1;
  const showComplete = isLastStage && m.gameAck;

  const boardArtHTML = showComplete
    ? `<img class="mugu-layer mugu-complete-photo" src="${MUGU_IMG(MUGU_COMPLETE_IMG)}" alt="완성된 무궁화" draggable="false" />`
    : muguBoardArtHTML(m);

  const trayCount = part.id === "petal" ? (5 - m.petalsPlaced) : 1;
  const trayHTML = m.gameAck ? "" : Array.from({ length: trayCount }, () =>
    `<div class="mugu-piece" draggable="true">
      ${muguIconHTML(part)}
      <span class="mugu-plabel">${part.name}</span>
    </div>`
  ).join("");

  const ackHTML = m.gameAck ? `
    <div class="mugu-bubble mugu-bubble--ack">
      <span class="mugu-bubble-icon">✅</span>
      <p class="mugu-bubble-text"><strong>${part.name} 완성!</strong> ${part.tip}</p>
    </div>
    <button type="button" class="btn primary mugu-next" id="muguGameNext">${isLastStage ? "사진 속 무궁화 찾으러 가기 ▶" : "다음 ▶"}</button>
  ` : `<p class="mugu-hint">${part.name}${koreanObjectParticle(part.name)} 탭하거나 끌어다 놓아 무궁화를 피워보자! (${part.id === "petal" ? `${m.petalsPlaced} / 5` : "0 / 1"})</p>`;

  app.innerHTML = sceneTemplate("STAGE 1-2 무궁화 피우기", `
    <div class="section-card mugu-game">
      <div class="mugu-board-wrap">
        <div class="mugu-board" id="muguBoard">
          <div class="mugu-stem"></div>
          <div class="mugu-board-art">${boardArtHTML}${showComplete ? photoCreditHTML(MUGU_COMPLETE_IMG) : ""}</div>
        </div>
        ${ackHTML}
      </div>
      <div class="mugu-tray" id="muguTray">${trayHTML}</div>
    </div>
  `);
  setupNavigationAndHelp("꽃받침 → 꽃잎 → 꽃술 순서로 무궁화를 피워보자!");
  muguMissionBtn(false);

  if (m.gameAck) {
    document.getElementById("muguGameNext").onclick = () => {
      playSound("click.mp3");
      if (isLastStage) m.phase = "photo";
      else { m.gameStage += 1; m.gameAck = false; }
      render();
    };
    return;
  }

  const placeCurrent = () => {
    playSound(TG_SOUNDS.snap);
    if (part.id === "petal") {
      m.petalsPlaced += 1;
      if (m.petalsPlaced >= 5) m.gameAck = true;
    } else {
      m.gameAck = true;
    }
    render();
  };

  let dragging = null;
  document.querySelectorAll(".mugu-piece").forEach((piece) => {
    piece.addEventListener("dragstart", (e) => { dragging = piece; e.dataTransfer.effectAllowed = "move"; });
    piece.addEventListener("dragend", () => { dragging = null; });
    piece.addEventListener("click", () => placeCurrent());
  });
  const board = document.getElementById("muguBoard");
  board.addEventListener("dragover", (e) => { e.preventDefault(); board.classList.add("over"); });
  board.addEventListener("dragleave", () => board.classList.remove("over"));
  board.addEventListener("drop", (e) => {
    e.preventDefault();
    board.classList.remove("over");
    if (!dragging) return;
    placeCurrent();
  });
}

function muguHotspotHit(xPct, yPct, hotspot, pad) {
  return xPct >= hotspot.left - pad && xPct <= hotspot.left + hotspot.w + pad &&
    yPct >= hotspot.top - pad && yPct <= hotspot.top + hotspot.h + pad;
}
function muguHotspotHTML(hotspot, cls) {
  return `<div class="mugu-highlight ${cls}" style="left:${hotspot.left}%;top:${hotspot.top}%;width:${hotspot.w}%;height:${hotspot.h}%"></div>`;
}

function bindMuguPhotoFit() {
  const game = document.querySelector(".mugu-photo-game");
  const slot = game && game.querySelector(".mugu-photo-slot");
  const frame = document.getElementById("muguPhotoFrame");
  const img = frame && frame.querySelector(".mugu-photo-img");
  if (!game || !slot || !frame || !img) return;

  const apply = () => {
    const rect = slot.getBoundingClientRect();
    const availH = Math.max(40, Math.floor(rect.height));
    const availW = Math.max(40, Math.floor(rect.width));
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh || availH < 40 || availW < 40) return;
    const aspect = nw / nh;
    let w = availW;
    let h = w / aspect;
    if (h > availH) {
      h = availH;
      w = h * aspect;
    }
    if (w > availW) {
      w = availW;
      h = w / aspect;
    }
    frame.style.width = Math.round(w) + "px";
    frame.style.height = Math.round(h) + "px";
    frame.classList.add("is-fitted");
  };

  const run = () => {
    apply();
    requestAnimationFrame(apply);
  };

  if (img.complete && img.naturalWidth) run();
  else img.addEventListener("load", run, { once: true });

  if (window._muguPhotoFit) {
    window.removeEventListener("resize", window._muguPhotoFit);
    if (window.visualViewport) window.visualViewport.removeEventListener("resize", window._muguPhotoFit);
  }
  if (window._muguPhotoFitRO) window._muguPhotoFitRO.disconnect();
  window._muguPhotoFit = run;
  window.addEventListener("resize", run);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", run);
  if (typeof ResizeObserver !== "function") return;
  const ro = new ResizeObserver(run);
  window._muguPhotoFitRO = ro;
  ro.observe(slot);
  const header = document.querySelector(".stage-header--activity");
  if (header) ro.observe(header);
}

function renderMuguPhoto(m) {
  const photo = MUGU_PHOTOS[m.photoIdx];
  const isLast = m.photoIdx >= MUGU_PHOTOS.length - 1;
  const highlightHTML = m.photoFound
    ? photo.hotspots.map((h) => muguHotspotHTML(h, "mugu-highlight--active")).join("")
    : (m.photoWrong >= 3
      ? photo.hotspots.map((h) => muguHotspotHTML(h, "mugu-highlight--hint")).join("")
      : "");

  app.innerHTML = sceneTemplate("STAGE 1-2 무궁화 피우기", `
    <div class="section-card mugu-photo-game">
      <div class="mugu-photo-slot">
        <div class="mugu-photo-frame${m.photoWrong && !m.photoFound ? " mugu-photo-shake" : ""}" id="muguPhotoFrame">
          <img class="mugu-photo-img" src="${MUGU_IMG(photo.file)}" alt="사진 속 무궁화 찾기" draggable="false" />
          ${photoCreditHTML(photo.file)}
          ${highlightHTML}
        </div>
      </div>
      <div class="mugu-story-talk">
        <img class="mugu-story-talk-char" src="${CHAR_IMG("rabbit.png")}" alt="토끼" />
        <div class="mugu-bubble mugu-bubble--story">
          <div class="mugu-bubble-text">${muguEojeolHTML(m.photoFound ? photo.caption : "사진 속에서 무궁화 문양을 찾아 탭해보자!")}${m.photoFound ? `<button type="button" class="mugu-photo-next" id="muguPhotoNext">${isLast ? "완료!" : "다음 사진 ▶"}</button>` : ""}</div>
        </div>
      </div>
    </div>
  `);
  setupNavigationAndHelp("사진 속에서 무궁화 문양을 찾아 탭해보자!");
  muguMissionBtn(false);
  bindMuguPhotoFit();

  if (m.photoFound) {
    speakLine(photo.caption, "voice_default.mp3");
    document.getElementById("muguPhotoNext").onclick = () => {
      playSound("click.mp3");
      if (isLast) {
        m.phase = "done";
        state.solved.mugunghwa = true;
        saveProgress();
        beginValueReflection("stage1_a2", { fromNext: true, force: true });
        return;
      }
      m.photoIdx += 1;
      m.photoWrong = 0;
      m.photoFound = false;
      render();
    };
    return;
  }

  document.getElementById("muguPhotoFrame").addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    if (photo.hotspots.some((h) => muguHotspotHit(xPct, yPct, h, 2))) {
      m.photoFound = true;
      playSound(TG_SOUNDS.complete);
    } else {
      m.photoWrong += 1;
      playSound(TG_SOUNDS.bounce);
    }
    render();
  });
}

function renderMuguDone(m) {
  // 완료 중간화면은 쓰지 않음 — 바로 생각친구 질문으로
  m.phase = "done";
  state.solved.mugunghwa = true;
  saveProgress();
  beginValueReflection("stage1_a2", { fromNext: true, force: true });
}

/** STAGE 1-3 애국가 — 월드컵 시상식 노래방 활동 */
const ANTHEM_AUDIO_FILE = "anthem.mp3";
const ANTHEM_BG_VIDEO = "anthem-background.mp4";
const ANTHEM_PASS_SCORE = 50;
const ANTHEM_MAX_PLAY_SECONDS = 68;
const ANTHEM_FALLBACK_DURATION = ANTHEM_MAX_PLAY_SECONDS;
const ANTHEM_FADE_OUT_MS = 450;
const ANTHEM_PLAYBACK_GAIN = 5;
const ANTHEM_VOCAL_START_SECONDS = 14;
const ANTHEM_LYRIC_LINES = [
  "동해물과 백두산이 마르고 닳도록",
  "하느님이 보우하사 우리나라 만세",
  "무궁화 삼천리 화려강산",
  "대한사람 대한으로 길이 보전하세"
];

function buildAnthemLyrics(duration) {
  // 14초까지는 간주, 이후 줄 길이(글자 수) 비율대로 더 천천히 하이라이트한다.
  const intro = Math.min(ANTHEM_VOCAL_START_SECONDS, Math.max(0, duration - 8));
  const outro = Math.min(1.2, duration * 0.02);
  const vocalSpan = Math.max(10, duration - intro - outro);
  const lineCount = ANTHEM_LYRIC_LINES.length;
  const gap = Math.min(1.4, vocalSpan * 0.045);
  const usableSpan = Math.max(8, vocalSpan - gap * (lineCount - 1));
  const weights = ANTHEM_LYRIC_LINES.map((line) => Math.max(1, line.replace(/\s+/g, "").length));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let cursor = intro;
  return ANTHEM_LYRIC_LINES.map((text, idx) => {
    const lineDuration = usableSpan * (weights[idx] / totalWeight);
    const start = cursor;
    const end = idx === lineCount - 1 ? duration - outro * 0.35 : start + lineDuration;
    cursor = end + gap;
    return { text, start, end, verse: 1 };
  });
}

function getAnthemDuration() {
  if (anthemGame?.duration) return anthemGame.duration;
  const aState = state.anthem;
  if (aState?.duration) return aState.duration;
  return ANTHEM_FALLBACK_DURATION;
}

function getAnthemLyrics() {
  if (anthemGame?.lyrics) return anthemGame.lyrics;
  const aState = state.anthem;
  if (aState?.lyrics) return aState.lyrics;
  return buildAnthemLyrics(getAnthemDuration());
}

function getAnthemScoreLyrics() {
  return getAnthemLyrics();
}

function getAnthemKaraokeWidth() {
  const maxChars = Math.max(...ANTHEM_LYRIC_LINES.map((line) => line.replace(/\s+/g, "").length), 20);
  const widthCh = Math.max(44, Math.min(64, maxChars + 22));
  return `${widthCh}ch`;
}

function fadeOutHtmlAudio(audio, durationMs = ANTHEM_FADE_OUT_MS, gainNode = null) {
  if (!audio || typeof audio.pause !== "function") return Promise.resolve();
  const startVolume = gainNode
    ? gainNode.gain.value
    : (Number.isFinite(audio.volume) ? audio.volume : 1);
  if (startVolume <= 0) {
    audio.pause();
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - startedAt) / Math.max(1, durationMs));
      const next = Math.max(0, startVolume * (1 - p));
      if (gainNode) gainNode.gain.value = next;
      else audio.volume = next;
      if (p < 1) {
        requestAnimationFrame(step);
        return;
      }
      audio.pause();
      if (gainNode) gainNode.gain.value = startVolume;
      else audio.volume = startVolume;
      resolve();
    };
    requestAnimationFrame(step);
  });
}

function setupAnthemPlaybackAudio(audio) {
  audio.muted = false;
  audio.volume = 1;
  return audio;
}

async function loadAnthemAudioElement(audio) {
  if (audio.readyState >= 2 && !audio.error) return true;
  await new Promise((resolve) => {
    const done = () => resolve();
    audio.addEventListener("canplaythrough", done, { once: true });
    audio.addEventListener("error", done, { once: true });
    audio.load();
  });
  return !audio.error;
}

let anthemUnlockCtx = null;
function unlockAnthemAudioOnGesture() {
  if (!anthemUnlockCtx) {
    anthemUnlockCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (anthemUnlockCtx.state === "suspended") anthemUnlockCtx.resume();
}

async function startAnthemMp3Playback(onFinish) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  await ctx.resume();
  anthemGame.audioCtx = ctx;
  anthemGame.useSynth = false;

  let buffer;
  try {
    const res = await fetch(SND(ANTHEM_AUDIO_FILE));
    if (!res.ok) throw new Error("fetch failed");
    buffer = await ctx.decodeAudioData(await res.arrayBuffer());
  } catch (_) {
    const audio = setupAnthemPlaybackAudio(new Audio(SND(ANTHEM_AUDIO_FILE)));
    if (!(await loadAnthemAudioElement(audio))) throw new Error("load failed");
    const duration = audio.duration && isFinite(audio.duration)
      ? Math.min(audio.duration, ANTHEM_MAX_PLAY_SECONDS)
      : ANTHEM_FALLBACK_DURATION;
    applyAnthemTiming(duration);
    anthemGame.audio = audio;
    anthemGame.audioGain = null;
    anthemGame.bufferSource = null;
    await audio.play();
    startAnthemCeremonyVideo();
    bindAnthemPlaybackLoop(audio, onFinish);
    return;
  }

  const duration = Math.min(buffer.duration, ANTHEM_MAX_PLAY_SECONDS);
  applyAnthemTiming(duration);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = ANTHEM_PLAYBACK_GAIN;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0, 0, duration);

  anthemGame.bufferSource = source;
  anthemGame.audioGain = gain;
  anthemGame.trackStartedAt = ctx.currentTime;

  const track = {
    get currentTime() {
      if (!anthemGame?.trackStartedAt) return 0;
      return Math.max(0, ctx.currentTime - anthemGame.trackStartedAt);
    },
    paused: false,
    ended: false,
    pause() {
      try { source.stop(); } catch (_) {}
      this.paused = true;
      this.ended = true;
    }
  };
  anthemGame.audio = track;

  const tick = () => {
    if (!anthemGame || anthemGame.ended) return;
    const t = track.currentTime;
    const progress = Math.min(1, t / duration);
    updateAnthemUI(t, progress);
    anthemGame._waveSkip = (anthemGame._waveSkip || 0) ^ 1;
    if (!anthemGame._waveSkip && anthemGame.liveCanvas && anthemGame.analyser) {
      const buf = new Uint8Array(anthemGame.analyser.frequencyBinCount);
      anthemGame.analyser.getByteTimeDomainData(buf);
      const canvasCtx = anthemGame.liveCanvas.getContext("2d");
      const w = anthemGame.liveCanvas.width;
      const h = anthemGame.liveCanvas.height;
      canvasCtx.fillStyle = "#1a1a2e";
      canvasCtx.fillRect(0, 0, w, h);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#fbbf24";
      canvasCtx.beginPath();
      const slice = w / buf.length;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 255) * h;
        const x = i * slice;
        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
      }
      canvasCtx.stroke();
    }
    if (!track.ended && t < duration) {
      anthemGame.raf = requestAnimationFrame(tick);
      return;
    }
    if (!track.ended) {
      track.ended = true;
      cancelAnimationFrame(anthemGame?.raf || 0);
      fadeOutHtmlAudio(track, ANTHEM_FADE_OUT_MS, gain).finally(() => onFinish());
    }
  };

  source.onended = () => {
    if (track.ended) return;
    track.ended = true;
    cancelAnimationFrame(anthemGame?.raf || 0);
    onFinish();
  };

  anthemGame.raf = requestAnimationFrame(tick);
  startAnthemCeremonyVideo();
}

function describeMicError(err) {
  const name = err?.name || "";
  if (name === "InsecureContextError") {
    if (location.protocol === "file:") {
      return {
        title: "마이크 사용 불가",
        text: "파일을 직접 열면(file://) 브라우저가 마이크를 차단해요. program 폴더의 ‘1_실행하기.bat’을 두 번 눌러 열어 주세요."
      };
    }
    return {
      title: "마이크 사용 불가",
      text: `지금 주소(${location.origin})는 브라우저가 마이크를 차단하는 주소예요. https:// 또는 http://localhost 로 접속해야 마이크를 쓸 수 있어요.`
    };
  }
  if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
    return {
      title: "마이크 권한 필요",
      text: "브라우저가 마이크 권한을 거부했어요. 주소창 왼쪽 자물쇠(또는 카메라/마이크) 아이콘을 눌러 마이크를 '허용'으로 바꾼 뒤 새로고침해 주세요."
    };
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError" || name === "OverconstrainedError") {
    return {
      title: "마이크 없음",
      text: "연결된 마이크를 찾지 못했어요. 마이크가 꽂혀 있는지, 시스템 설정에서 사용 가능한지 확인해 주세요."
    };
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return {
      title: "마이크 사용 중",
      text: "다른 프로그램이 마이크를 사용하고 있어요. 다른 앱(줌, 녹음기 등)을 닫고 다시 시도해 주세요."
    };
  }
  return {
    title: "마이크 오류",
    text: `마이크를 준비하지 못했어요. (${name || err?.message || "알 수 없는 오류"}) 원곡은 계속 재생돼요!`
  };
}

async function setupAnthemMicrophone(statusEl) {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    const err = new Error("insecure context");
    err.name = "InsecureContextError";
    throw err;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  anthemGame.stream = stream;
  const micCtx = new (window.AudioContext || window.webkitAudioContext)();
  anthemGame.micCtx = micCtx;
  const micSource = micCtx.createMediaStreamSource(stream);
  anthemGame.analyser = micCtx.createAnalyser();
  anthemGame.analyser.fftSize = 2048;
  micSource.connect(anthemGame.analyser);
  const dest = micCtx.createMediaStreamDestination();
  micSource.connect(dest);
  const recorder = new MediaRecorder(dest.stream);
  anthemGame.recorder = recorder;
  anthemGame.chunks = [];
  recorder.ondataavailable = (e) => { if (e.data.size) anthemGame.chunks.push(e.data); };
  recorder.start(100);
  if (anthemGame.audioCtx?.state === "suspended") {
    await anthemGame.audioCtx.resume();
  }
  if (statusEl) statusEl.textContent = "원곡에 맞춰 애국가를 불러보세요!";
}

function preloadAnthemMetadata() {
  const aState = getAnthemState();
  if (aState.duration && aState.lyrics) return Promise.resolve(aState);
  return new Promise((resolve) => {
    const audio = new Audio(SND(ANTHEM_AUDIO_FILE));
    const done = (duration) => {
      aState.duration = duration;
      aState.lyrics = buildAnthemLyrics(duration);
      resolve(aState);
    };
    audio.addEventListener("loadedmetadata", () => {
      const d = audio.duration && isFinite(audio.duration)
        ? Math.min(audio.duration, ANTHEM_MAX_PLAY_SECONDS)
        : ANTHEM_FALLBACK_DURATION;
      done(d);
    }, { once: true });
    audio.addEventListener("error", () => done(ANTHEM_FALLBACK_DURATION), { once: true });
    audio.load();
  });
}

function applyAnthemTiming(duration) {
  const lyrics = buildAnthemLyrics(duration);
  if (anthemGame) {
    anthemGame.duration = duration;
    anthemGame.lyrics = lyrics;
  }
  const aState = getAnthemState();
  aState.duration = duration;
  aState.lyrics = lyrics;
  return lyrics;
}

let anthemGame = null;

function createDefaultAnthemState() {
  return {
    mode: "sing",
    screen: "intro",
    score: 0,
    bestScore: 0,
    lastResult: null,
    listenComplete: false,
    recordingUrl: null,
    playing: false,
    finished: false
  };
}

function getAnthemState() {
  if (!state.anthem) state.anthem = createDefaultAnthemState();
  return state.anthem;
}

async function stopAnthemGame() {
  if (!anthemGame) return;
  const game = anthemGame;
  anthemGame = null;
  if (game.raf) cancelAnimationFrame(game.raf);
  stopAnthemCeremonyVideo();
  if (game.bufferSource) {
    try { game.bufferSource.stop(); } catch (_) {}
  }
  if (game.audio) {
    game.audio.onended = null;
    game.audio.ontimeupdate = null;
    if (typeof game.audio.pause === "function") game.audio.pause();
    if (!game.bufferSource) {
      await fadeOutHtmlAudio(game.audio, ANTHEM_FADE_OUT_MS, game.audioGain);
    }
  }
  if (game.audioCtx) game.audioCtx.close().catch(() => {});
  if (game.playbackAudio) {
    await fadeOutHtmlAudio(game.playbackAudio, 300);
    game.playbackAudio = null;
  }
  if (game.stream) {
    game.stream.getTracks().forEach((t) => t.stop());
  }
  if (game.recorder && game.recorder.state !== "inactive") {
    try { game.recorder.stop(); } catch (_) {}
  }
  if (game.micCtx) game.micCtx.close().catch(() => {});
  if (game.refCtx) game.refCtx.close().catch(() => {});
  game.ended = true;
}

async function cancelAnthemPlayback(statusText = "재생을 멈췄어요.") {
  const aState = getAnthemState();
  await stopAnthemGame();
  aState.playing = false;
  aState.screen = "intro";
  const startBtn = document.getElementById("anthemStartBtn");
  const replayBtn = document.getElementById("anthemReplayBtn");
  const stopBtn = document.getElementById("anthemStopBtn");
  const statusEl = document.getElementById("anthemStatus");
  if (startBtn) startBtn.disabled = false;
  if (replayBtn) replayBtn.disabled = !aState.recordingUrl;
  if (stopBtn) stopBtn.disabled = true;
  if (statusEl) statusEl.textContent = statusText;
}

function anthemMissionBtn(enabled) {
  bindMissionCompleteBtn(
    "stage1_a3",
    enabled,
    "애국가를 50점 이상으로 부르거나, 마이크 없이 끝까지 들으면 보물을 되찾을 수 있어요!",
    () => { state.solved.anthem = true; saveProgress(); }
  );
}

function getAnthemLineIndex(t) {
  const lyrics = getAnthemLyrics();
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (t >= lyrics[i].start) return i;
  }
  return 0;
}

function renderAnthemKaraokeHTML(t) {
  const lyrics = getAnthemLyrics();
  const idx = getAnthemLineIndex(t);
  return lyrics.map((line, i) => {
    let cls = "anthem-karaoke-line";
    if (i < idx) cls += " anthem-karaoke-line--past";
    else if (i === idx) cls += " anthem-karaoke-line--active";
    else cls += " anthem-karaoke-line--future";
    const progress = i === idx
      ? Math.min(1, (t - line.start) / Math.max(0.1, line.end - line.start))
      : i < idx ? 1 : 0;
    return `<p class="${cls}" data-line="${i}"><span class="anthem-karaoke-fill" style="width:${Math.round(progress * 100)}%"></span><span class="anthem-karaoke-text">${line.text}</span></p>`;
  }).join("");
}

function updateAnthemUI(t, progress) {
  const karaoke = document.getElementById("anthemKaraoke");
  if (karaoke) {
    const lyrics = getAnthemLyrics();
    const idx = getAnthemLineIndex(t);
    let lines = karaoke.querySelectorAll(".anthem-karaoke-line");
    // 처음이거나 줄 수가 바뀌었을 때만 HTML 전체 재생성
    if (lines.length !== lyrics.length) {
      karaoke.innerHTML = renderAnthemKaraokeHTML(t);
      lines = karaoke.querySelectorAll(".anthem-karaoke-line");
    }
    const prevIdx = anthemGame?._karaokeIdx;
    if (prevIdx !== idx) {
      lines.forEach((el, i) => {
        el.classList.toggle("anthem-karaoke-line--past", i < idx);
        el.classList.toggle("anthem-karaoke-line--active", i === idx);
        el.classList.toggle("anthem-karaoke-line--future", i > idx);
        const fill = el.querySelector(".anthem-karaoke-fill");
        if (fill && i < idx) fill.style.width = "100%";
        if (fill && i > idx) fill.style.width = "0%";
      });
      if (anthemGame) anthemGame._karaokeIdx = idx;
    }
    const active = lines[idx];
    if (active) {
      const line = lyrics[idx];
      const p = line
        ? Math.min(1, (t - line.start) / Math.max(0.1, line.end - line.start))
        : 0;
      const fill = active.querySelector(".anthem-karaoke-fill");
      if (fill) fill.style.width = `${Math.round(p * 100)}%`;
    }
  }
  const timeEl = document.getElementById("anthemTime");
  if (timeEl) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    const stamp = `${m}:${s}`;
    if (timeEl.textContent !== stamp) timeEl.textContent = stamp;
  }
}

function renderAnthemCeremonyHTML() {
  return `<div class="anthem-ceremony" aria-hidden="true">
    <video class="anthem-ceremony-video" id="anthemCeremonyVideo"
      src="${ANTHEM_IMG(ANTHEM_BG_VIDEO)}"
      muted playsinline loop preload="metadata"></video>
  </div>`;
}

function startAnthemCeremonyVideo() {
  const video = document.getElementById("anthemCeremonyVideo");
  if (!video) return;
  video.defaultMuted = true;
  video.muted = true;
  video.volume = 0;
  video.loop = true;
  video.currentTime = 0;
  // 배경 영상만 무음 재생. 애국가 mp3 재생과 분리한다.
  video.play().catch(() => {});
  if (anthemGame) anthemGame.ceremonyVideo = video;
}

function stopAnthemCeremonyVideo() {
  const video = document.getElementById("anthemCeremonyVideo") || anthemGame?.ceremonyVideo;
  if (!video) return;
  video.pause();
  video.currentTime = 0;
}

function getRmsEnvelope(buffer, windowSec) {
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate;
  const win = Math.max(1, Math.floor(sr * windowSec));
  const env = [];
  for (let i = 0; i < data.length; i += win) {
    let sum = 0;
    const end = Math.min(i + win, data.length);
    for (let j = i; j < end; j++) sum += data[j] * data[j];
    env.push(Math.sqrt(sum / (end - i)));
  }
  return env;
}

function normalizeEnvelope(env) {
  const max = Math.max(...env, 0.0001);
  return env.map((v) => v / max);
}

function computeEnvelopeCorrelation(a, b) {
  const len = Math.min(a.length, b.length);
  if (!len) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function computeLineEnergyScore(refBuf, userBuf, windowSec, scoreLyrics) {
  const refEnv = normalizeEnvelope(getRmsEnvelope(refBuf, windowSec));
  const userEnv = normalizeEnvelope(getRmsEnvelope(userBuf, windowSec));
  let matched = 0;
  let total = 0;
  scoreLyrics.forEach((line) => {
    const rStart = Math.floor(line.start / windowSec);
    const rEnd = Math.ceil(line.end / windowSec);
    let refEnergy = 0;
    let userEnergy = 0;
    for (let i = rStart; i < rEnd && i < refEnv.length; i++) {
      refEnergy += refEnv[i];
      if (i < userEnv.length) userEnergy += userEnv[i];
    }
    if (refEnergy > 0.15) {
      total++;
      if (userEnergy / refEnergy > 0.35) matched++;
    }
  });
  return total ? matched / total : 0;
}

async function decodeAudioBuffer(ctx, source) {
  if (source instanceof AudioBuffer) return source;
  if (source instanceof Blob) {
    const ab = await source.arrayBuffer();
    return ctx.decodeAudioData(ab);
  }
  const res = await fetch(source);
  const ab = await res.arrayBuffer();
  return ctx.decodeAudioData(ab);
}

async function buildAnthemReferenceBuffer(ctx, duration, lyrics) {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  const lineNotes = [
    [392, 440, 494, 523],
    [523, 587, 659, 587],
    [494, 523, 587, 659],
    [587, 523, 494, 440]
  ];
  lyrics.forEach((line, li) => {
    const notes = lineNotes[li % lineNotes.length];
    const seg = (line.end - line.start) / notes.length;
    notes.forEach((freq, ni) => {
      const start = Math.floor((line.start + ni * seg) * sampleRate);
      const end = Math.floor((line.start + (ni + 1) * seg) * sampleRate);
      for (let i = start; i < end && i < length; i++) {
        const t = (i - start) / sampleRate;
        const attack = Math.min(1, t * 8);
        const release = Math.min(1, (seg - t) * 8);
        data[i] += 0.22 * Math.sin(2 * Math.PI * freq * t) * attack * release;
      }
    });
  });
  return buffer;
}

async function getAnthemReferenceBuffer(ctx, audioEl) {
  try {
    const url = (audioEl?.src && audioEl.src && !audioEl.src.endsWith("/") && audioEl.src.includes("."))
      ? audioEl.src
      : SND(ANTHEM_AUDIO_FILE);
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const ab = await res.arrayBuffer();
    return ctx.decodeAudioData(ab.slice(0));
  } catch (_) {
    return buildAnthemReferenceBuffer(ctx, getAnthemDuration(), getAnthemLyrics());
  }
}

async function getAnthemReferenceBufferForScoring(ctx, audioEl, mode) {
  const full = await getAnthemReferenceBuffer(ctx, audioEl);
  if (mode !== "sing") return full;
  const scoreLyrics = getAnthemScoreLyrics();
  const end = scoreLyrics[scoreLyrics.length - 1]?.end || full.duration;
  const ctx2 = new AudioContext();
  try {
    const trimSamples = Math.min(full.length, Math.ceil(end * full.sampleRate));
    const trimmed = ctx2.createBuffer(full.numberOfChannels, trimSamples, full.sampleRate);
    for (let ch = 0; ch < full.numberOfChannels; ch++) {
      trimmed.copyToChannel(full.getChannelData(ch).slice(0, trimSamples), ch);
    }
    return trimmed;
  } finally {
    ctx2.close().catch(() => {});
  }
}

async function scoreAnthemRecording(userBlob, audioEl, mode) {
  const ctx = new AudioContext();
  const scoreLyrics = getAnthemScoreLyrics();
  const scoreEnd = scoreLyrics[scoreLyrics.length - 1]?.end || getAnthemDuration();
  try {
    const [refBuf, userBuf] = await Promise.all([
      getAnthemReferenceBufferForScoring(ctx, audioEl, mode),
      decodeAudioBuffer(ctx, userBlob)
    ]);
    const windowSec = 0.12;
    const refEnv = normalizeEnvelope(getRmsEnvelope(refBuf, windowSec));
    const userEnv = normalizeEnvelope(getRmsEnvelope(userBuf, windowSec));
    const corr = computeEnvelopeCorrelation(refEnv, userEnv);
    const lineMatch = computeLineEnergyScore(refBuf, userBuf, windowSec, scoreLyrics);
    const durationRatio = Math.min(1, userBuf.duration / Math.max(1, scoreEnd * 0.7));
    const raw = corr * 45 + lineMatch * 40 + durationRatio * 15;
    return Math.round(Math.min(100, Math.max(0, raw)));
  } finally {
    ctx.close().catch(() => {});
  }
}

function drawAnthemWaveform(canvas, refEnv, userEnv) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const mid = h / 2;
  const drawEnv = (env, color, yOffset) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    env.forEach((v, i) => {
      const x = (i / Math.max(1, env.length - 1)) * w;
      const y = yOffset - v * (h * 0.35);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };
  ctx.fillStyle = "#888";
  ctx.font = "11px sans-serif";
  ctx.fillText("원곡", 4, 14);
  ctx.fillText("내 목소리", 4, mid + 14);
  if (refEnv?.length) drawEnv(refEnv, "#3b82f6", h * 0.25);
  if (userEnv?.length) drawEnv(userEnv, "#ef4444", h * 0.75);
}

function bindAnthemPlaybackLoop(audio, onFinish) {
  const tick = () => {
    if (!anthemGame || anthemGame.ended) return;
    const t = audio.currentTime || 0;
    const maxDuration = getAnthemDuration();
    const progress = Math.min(1, t / maxDuration);
    updateAnthemUI(t, progress);
    // 파형 캔버스는 매 프레임이 아니라 2프레임에 1번만 그려 태블릿 GPU 부하를 줄임
    anthemGame._waveSkip = (anthemGame._waveSkip || 0) ^ 1;
    if (!anthemGame._waveSkip && anthemGame.liveCanvas && anthemGame.analyser) {
      const buf = new Uint8Array(anthemGame.analyser.frequencyBinCount);
      anthemGame.analyser.getByteTimeDomainData(buf);
      const ctx = anthemGame.liveCanvas.getContext("2d");
      const w = anthemGame.liveCanvas.width;
      const h = anthemGame.liveCanvas.height;
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fbbf24";
      ctx.beginPath();
      const slice = w / buf.length;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 255) * h;
        const x = i * slice;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (!audio.paused && !audio.ended) {
      if (t >= maxDuration) {
        audio.onended = null;
        cancelAnimationFrame(anthemGame?.raf || 0);
        fadeOutHtmlAudio(audio, ANTHEM_FADE_OUT_MS, anthemGame?.audioGain).finally(() => onFinish());
        return;
      }
      anthemGame.raf = requestAnimationFrame(tick);
    }
  };
  audio.ontimeupdate = () => { if (!anthemGame?.raf) anthemGame.raf = requestAnimationFrame(tick); };
  audio.onended = () => {
    cancelAnimationFrame(anthemGame?.raf || 0);
    onFinish();
  };
  anthemGame.raf = requestAnimationFrame(tick);
}

async function startAnthemActivity(mode) {
  const aState = getAnthemState();
  aState.mode = mode;
  aState.screen = "play";
  aState.playing = true;
  aState.finished = false;
  aState.score = 0;

  const startBtn = document.getElementById("anthemStartBtn");
  const replayBtn = document.getElementById("anthemReplayBtn");
  const stopBtn = document.getElementById("anthemStopBtn");
  const scorePanel = document.getElementById("anthemScorePanel");
  const statusEl = document.getElementById("anthemStatus");
  if (startBtn) startBtn.disabled = true;
  if (replayBtn) replayBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;
  if (scorePanel) scorePanel.hidden = true;
  if (statusEl) statusEl.textContent = "애국가 재생 중…";

  await stopAnthemGame();
  anthemGame = { ended: false, mode, chunks: [] };

  const liveCanvas = document.getElementById("anthemLiveWave");
  if (liveCanvas && mode === "sing") anthemGame.liveCanvas = liveCanvas;

  async function finishAnthem() {
    if (!anthemGame || anthemGame.finished) return;
    anthemGame.finished = true;
    stopAnthemCeremonyVideo();
    aState.playing = false;
    aState.finished = true;
    aState.screen = "result";

    if (anthemGame.recorder && anthemGame.recorder.state !== "inactive") {
      await new Promise((res) => {
        anthemGame.recorder.onstop = res;
        anthemGame.recorder.stop();
      });
    }
    if (anthemGame.stream) anthemGame.stream.getTracks().forEach((t) => t.stop());

    const sangWithMic = mode === "sing" && anthemGame.chunks.length;
    let score = 0;
    if (sangWithMic) {
      const blob = new Blob(anthemGame.chunks, { type: "audio/webm" });
      if (aState.recordingUrl) URL.revokeObjectURL(aState.recordingUrl);
      aState.recordingUrl = URL.createObjectURL(blob);
      if (statusEl) statusEl.textContent = "파형 분석 중…";
      score = await scoreAnthemRecording(blob, null, mode);
    }

    aState.lastResult = sangWithMic ? "sing" : "listen";
    if (sangWithMic) {
      aState.score = score;
      aState.bestScore = Math.max(aState.bestScore, score);
      if (score >= ANTHEM_PASS_SCORE) state.solved.anthem = true;
    } else {
      aState.score = 0;
      aState.listenComplete = true;
      state.solved.anthem = true;
    }
    saveProgress();

    const scoreTitle = document.getElementById("anthemScoreTitle");
    const scoreVal = document.getElementById("anthemScoreVal");
    const scoreMsg = document.getElementById("anthemScoreMsg");
    if (scorePanel) scorePanel.hidden = false;
    if (sangWithMic) {
      if (scoreTitle) scoreTitle.textContent = "채점 결과";
      if (scoreVal) {
        scoreVal.hidden = false;
        scoreVal.textContent = `${score}점`;
      }
      if (scoreMsg) {
        if (score >= ANTHEM_PASS_SCORE) {
          scoreMsg.textContent = "50점 이상! 미션 완료!";
          playSound("correct.mp3");
        } else {
          scoreMsg.textContent = "다시 도전해 보세요! 50점 이상이면 미션 완료!";
          playSound("wrong.mp3");
        }
      }
      if (statusEl) statusEl.textContent = "노래가 끝났어요! 내 노래를 들어볼까요?";
    } else {
      const listenMsg = "끝까지 들었어요! 학교, 운동회, 뉴스, 올림픽…<br>애국가를 어디서 들어 봤는지 생각해 보자!";
      if (scoreTitle) scoreTitle.textContent = "애국가를 들었어요";
      if (scoreVal) {
        scoreVal.hidden = true;
        scoreVal.textContent = "";
      }
      if (scoreMsg) scoreMsg.innerHTML = listenMsg;
      if (statusEl) statusEl.textContent = "애국가를 모두 들었어요!";
      Swal.fire({
        title: "애국가를 끝까지 들었어요!",
        html: listenMsg,
        icon: "success",
        confirmButtonText: "알겠어요"
      }).then(() => {
        anthemMissionBtn(true);
      });
    }
    if (startBtn) startBtn.disabled = false;
    if (replayBtn) replayBtn.disabled = !aState.recordingUrl;
    if (stopBtn) stopBtn.disabled = true;

    if (sangWithMic) {
      const compareCanvas = document.getElementById("anthemCompareWave");
      if (compareCanvas) {
        compareCanvas.hidden = false;
        const ctx = new AudioContext();
        const blob = new Blob(anthemGame.chunks, { type: "audio/webm" });
        Promise.all([
          getAnthemReferenceBuffer(ctx, null),
          decodeAudioBuffer(ctx, blob)
        ]).then(([refBuf, userBuf]) => {
          drawAnthemWaveform(
            compareCanvas,
            normalizeEnvelope(getRmsEnvelope(refBuf, 0.12)),
            normalizeEnvelope(getRmsEnvelope(userBuf, 0.12))
          );
          ctx.close().catch(() => {});
        }).catch(() => ctx.close().catch(() => {}));
      }
    }

    if (sangWithMic) anthemMissionBtn(aState.bestScore >= ANTHEM_PASS_SCORE);
    updateAnthemUI(getAnthemDuration(), 1);
  }

  async function beginSynthPlayback() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    anthemGame.refCtx = ctx;
    const duration = getAnthemDuration();
    const lyrics = getAnthemLyrics();
    const buf = await buildAnthemReferenceBuffer(ctx, duration, lyrics);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = ANTHEM_PLAYBACK_GAIN;
    src.connect(gain);
    gain.connect(ctx.destination);
    anthemGame.synthSource = src;
    anthemGame.synthGain = gain;
    anthemGame.synthStartedAt = ctx.currentTime;
    anthemGame.useSynth = true;
    src.start();
    anthemGame.audio = {
      currentTime: 0,
      paused: false,
      ended: false,
      src: "",
      pause: () => { try { src.stop(); } catch (_) {} }
    };
    const fakeTick = () => {
      if (!anthemGame || anthemGame.ended) return;
      const t = ctx.currentTime - anthemGame.synthStartedAt;
      anthemGame.audio.currentTime = t;
      updateAnthemUI(t, Math.min(1, t / getAnthemDuration()));
      if (t < getAnthemDuration()) anthemGame.raf = requestAnimationFrame(fakeTick);
      else finishAnthem();
    };
    anthemGame.raf = requestAnimationFrame(fakeTick);
    startAnthemCeremonyVideo();
    if (statusEl) statusEl.textContent = "음원을 불러오지 못해 안내 멜로디로 진행해요.";
  }

  try {
    await startAnthemMp3Playback(finishAnthem);
    if (statusEl) {
      statusEl.textContent = mode === "sing"
        ? "원곡에 맞춰 애국가를 불러보세요!"
        : "애국가를 듣고 가사를 따라 읽어보세요!";
    }
  } catch (_) {
    await beginSynthPlayback();
    if (mode === "sing") {
      try {
        await setupAnthemMicrophone(statusEl);
      } catch (err) {
        const info = describeMicError(err);
        Swal.fire(info.title, info.text, "info");
      }
    }
    return;
  }

  if (mode === "sing") {
    try {
      await setupAnthemMicrophone(statusEl);
    } catch (err) {
      if (statusEl) statusEl.textContent = "마이크를 사용할 수 없어요. 원곡에 맞춰 따라 불러보세요!";
      const info = describeMicError(err);
      Swal.fire(info.title, info.text, "info");
    }
  }
}

function playAnthemRecording() {
  const aState = getAnthemState();
  if (!aState.recordingUrl) {
    Swal.fire("알림", "아직 녹음된 노래가 없어요. 노래부르기 모드로 먼저 불러보세요!", "info");
    return;
  }
  if (anthemGame?.playbackAudio) {
    anthemGame.playbackAudio.pause();
    anthemGame.playbackAudio = null;
  }
  const playback = new Audio(aState.recordingUrl);
  anthemGame = anthemGame || {};
  anthemGame.playbackAudio = playback;
  playback.play().catch(() => Swal.fire("재생 실패", "녹음 파일을 재생할 수 없어요.", "error"));
  const statusEl = document.getElementById("anthemStatus");
  if (statusEl) statusEl.textContent = "내가 부른 애국가 재생 중…";
  playback.onended = () => {
    if (statusEl) statusEl.textContent = "재생이 끝났어요!";
  };
}

function renderStage1Act3() {
  const aState = getAnthemState();
  const missionReady = aState.bestScore >= ANTHEM_PASS_SCORE
    || aState.listenComplete
    || !!state.solved.anthem;

  app.innerHTML = sceneTemplate("STAGE 1-3 애국가 부르기", `
    <div class="section-card anthem-activity">
      <div class="anthem-main">
        <div class="anthem-col anthem-col--media">
          <div id="anthemCeremony">${renderAnthemCeremonyHTML()}</div>
          <div class="anthem-karaoke-wrap">
            <div class="anthem-karaoke-header">
              <span class="anthem-time" id="anthemTime">0:00</span>
            </div>
            <div class="anthem-karaoke" id="anthemKaraoke">${renderAnthemKaraokeHTML(0)}</div>
          </div>
        </div>
        <div class="anthem-col anthem-col--panel">
          <div class="anthem-story">
            <p class="anthem-story-lead">🏆 올림픽에서 우리나라가 우승했어요!</p>
            <p class="anthem-story-sub">다함께 애국가를 부르며 축하해요.</p>
          </div>
          <div class="anthem-mode-tabs" role="tablist">
            <button type="button" class="anthem-mode-btn ${aState.mode === "sing" ? "active" : ""}" data-mode="sing" role="tab">🎤 노래부르기</button>
            <button type="button" class="anthem-mode-btn ${aState.mode === "listen" ? "active" : ""}" data-mode="listen" role="tab">👂 듣기</button>
          </div>
          <p class="anthem-mode-hint" id="anthemModeHint">${aState.mode === "sing"
    ? "마이크로 원곡과 내 목소리를 비교해 점수를 받아요!"
    : "마이크 없이 들어요. 끝까지 들으면 미션을 완료할 수 있어요!"}</p>
          <div class="anthem-wave-area">
            <canvas id="anthemLiveWave" class="anthem-wave-canvas" width="600" height="80" ${aState.mode !== "sing" ? 'hidden' : ""}></canvas>
            <canvas id="anthemCompareWave" class="anthem-wave-canvas anthem-wave-canvas--compare" width="600" height="100" hidden></canvas>
          </div>
          <p class="anthem-status" id="anthemStatus">버튼을 눌러 ${aState.mode === "sing" ? "노래를 시작" : "듣기를 시작"}해 보세요!</p>
          <div class="anthem-controls">
            <button type="button" class="btn primary" id="anthemStartBtn">${aState.mode === "sing" ? "🎤 노래 시작" : "▶ 듣기 시작"}</button>
            <button type="button" class="btn" id="anthemStopBtn" disabled>⏹ 정지</button>
            <button type="button" class="btn" id="anthemReplayBtn" disabled>🔊 내 노래 듣기</button>
          </div>
          <div class="anthem-score-panel" id="anthemScorePanel" ${aState.finished ? "" : "hidden"}>
            <p class="anthem-score-title" id="anthemScoreTitle">${aState.lastResult === "listen" ? "애국가를 들었어요" : "채점 결과"}</p>
            <p class="anthem-score-val" id="anthemScoreVal" ${aState.lastResult === "listen" ? "hidden" : ""}>${aState.lastResult === "listen" ? "" : (aState.score ? aState.score + "점" : "—")}</p>
            <p class="anthem-score-msg" id="anthemScoreMsg">${aState.lastResult === "listen"
    ? "끝까지 들었어요! 학교, 운동회, 뉴스, 올림픽…<br>애국가를 어디서 들어 봤는지 생각해 보자!"
    : (aState.bestScore >= ANTHEM_PASS_SCORE
      ? "50점 이상! 미션 완료!"
      : "50점 이상이면 미션 완료!")}</p>
          </div>
        </div>
      </div>
    </div>
  `);

  setupNavigationAndHelp(
    aState.mode === "sing"
      ? "원곡에 맞춰 애국가를 따라 불러보자! 50점 이상이면 미션 완료!"
      : "애국가를 끝까지 들으면 미션 완료! 가사를 따라 읽고, 어디서 들어 봤는지도 생각해 보자!"
  );
  setupActivityControls();

  document.querySelectorAll(".anthem-mode-btn").forEach((btn) => {
    btn.onclick = async () => {
      if (aState.playing) await cancelAnthemPlayback("재생을 멈추고 모드를 변경했어요.");
      aState.mode = btn.dataset.mode;
      playSound("click.mp3");
      render();
    };
  });

  document.getElementById("anthemStartBtn").onclick = () => {
    unlockAnthemAudioOnGesture();
    const compareCanvas = document.getElementById("anthemCompareWave");
    if (compareCanvas) compareCanvas.hidden = aState.mode !== "sing";
    startAnthemActivity(aState.mode);
  };

  document.getElementById("anthemStopBtn").onclick = async () => {
    playSound("click.mp3");
    await cancelAnthemPlayback();
  };

  document.getElementById("anthemReplayBtn").onclick = () => {
    playSound("click.mp3");
    playAnthemRecording();
  };

  if (aState.recordingUrl) {
    document.getElementById("anthemReplayBtn").disabled = false;
  }

  preloadAnthemMetadata().then((loaded) => {
    const karaoke = document.getElementById("anthemKaraoke");
    if (karaoke) karaoke.innerHTML = renderAnthemKaraokeHTML(0);
  });

  anthemMissionBtn(missionReady);
}


/** STAGE 1-4 화폐 탐색 — 오만원 → 만원 → 오천원 → 천원 순 */
const MONEY_BILLS = [
  {
    amount: 50000,
    label: "오만원",
    front: "50000.jpg",
    back: "50000_back.jpg",
    backRotate: -90,
    person: {
      name: "신사임당",
      trait: "조선 시대의 훌륭한 화가이자 어머니",
      box: { l: 58, t: 12, w: 38, h: 75 },
      line: "나는 신사임당이야. 시, 글씨, 그림을 좋아하고 그림을 잘 그려서 유명해. 율곡 이이의 어머니이기도 해."
    },
    frontHeritage: [
      {
        name: "묵포도도",
        box: { l: 40, t: 18, w: 20, h: 65 },
        line: "이 그림은 내가 포도송이와 넝쿨을 그린 묵포도도야. 포도알처럼 좋은 일이 주렁주렁 많아지고, 열심히 노력해서 달콤한 열매를 맺고, 긴 넝쿨처럼 우리 가족 모두 쑥쑥 잘되기를 바라는 따뜻한 마음이 담겨 있어.",
        popImage: "묵포도도(간송미술문화재단).jpeg"
      }
    ],
    backHeritage: [
      /* box 좌표는 회전 전 원본(가로) 지폐 이미지 기준 */
      {
        name: "월매도",
        box: { l: 8, t: 8, w: 28, h: 80 },
        line: "어몽룡이 그린 '달밤에 핀 매화'야. 어몽룡은 매화 그림을 잘 그리는 화가로 유명했어.",
        popImage: "달밤에 핀 매화(e뮤지엄, 공공누리1유형).jpg"
      },
      {
        name: "풍죽도",
        box: { l: 32, t: 12, w: 30, h: 75 },
        line: "화가 이정이 그린 풍죽도야. 바람에 흔들리는 대나무를 움직이듯 그렸지. 화가 이정은 대나무 그림을 잘 그리는 것으로 유명했어.",
        popImage: "풍죽도-위키디피아 커먼즈,퍼블릭도메인.jpg"
      }
    ]
  },
  {
    amount: 10000,
    label: "만원",
    front: "10000.jpg",
    back: "10000_back.jpg",
    person: {
      name: "세종대왕",
      trait: "한글을 만든 위대한 왕",
      box: { l: 56, t: 10, w: 40, h: 78 },
      line: "나는 우리나라인 조선의 임금, 세종대왕이야. 옛날에는 한자가 너무 어려워서 글을 못 읽고 답답해하는 백성들이 많았어. 그래서 \"누구나 쉽고 재미있게 배워서 자기 생각을 표현하면 좋겠다!\" 하는 마음으로 한글을 만들었단다."
    },
    frontHeritage: [
      {
        name: "일월오봉도",
        box: { l: 32, t: 48, w: 28, h: 28 },
        line: "일월오봉도는 임금님이 앉는 의자 바로 뒤에 세워두던 특별한 그림이야. 해와 달은 낮과 밤 언제나 나라를 환하게 밝혀준다는 뜻이란다. 다섯 개의 산과 소나무는 우리 나라가 오래오래 튼튼하고 푸르게 지켜지기를 바라는 마음이지."
      },
      {
        name: "용비어천가",
        box: { l: 22, t: 12, w: 38, h: 38 },
        line: "용비어천가는 제일 처음 한글로 쓴 책이야. 임금을 용으로 표현하여 조선이 훌륭한 나라이고, 뿌리 깊은 나무 처럼 앞으로의 왕들도 흔들리지 않는 나라를 잘 지켜나가기를 바라는 마음이 담겨 있어.",
        popImage: "용비어천가 권8의 권수(국가유산포털).jpg"
      }
    ],
    backHeritage: [
      {
        name: "혼천의",
        box: { l: 6, t: 22, w: 42, h: 65 },
        line: "혼천의는 해, 달, 별이 어떻게 움직이는지 알아보고 시간과 계절을 확인하던 ‘조선시대의 천문 시계’야.",
        popImage: "혼천의(e뮤지엄,공공누리1유형).jpg"
      },
      {
        name: "천상열차분야지도",
        box: { l: 18, t: 8, w: 45, h: 45 },
        line: "천상열차분야지도는 별자리가 새겨진 오래된 별 지도야. 별자리를 통해 계절의 변화를 알아내어 씨앗을 심을 때를 정했단다.",
        popImage: "천상열차분야지도 (e뮤지엄, 공공누리1유형).jpg"
      },
      {
        name: "보현산망원경",
        box: { l: 50, t: 40, w: 23, h: 58 },
        line: "보현산천문대 망원경은 ‘우리나라에서 가장 큰 망원경’이야. 아주 멀리 있는 별도 관찰할 수 있어.",
        popImage: "보현산천문대망원경(한국향토문화대전).jpeg"
      }
    ]
  },
  {
    amount: 5000,
    label: "오천원",
    front: "5000.jpg",
    back: "5000_back.jpg",
    person: {
      name: "율곡 이이",
      trait: "배움과 덕을 중시한 조선 시대의 학자",
      box: { l: 54, t: 10, w: 42, h: 78 },
      line: "나는 율곡 이이란다. 나는 멋진 그림을 그리시는 신사임당 어머니의 아들로 태어나, 사람들을 돕고 나라를 지키려고 책을 정말 열심히 읽었던 학자야. 너희도 나처럼 궁금한 것을 재미있게 공부하는 지혜로운 어린이가 되었으면 좋겠어!"
    },
    frontHeritage: [
      {
        name: "오죽헌",
        box: { l: 28, t: 50, w: 32, h: 48 },
        line: "오죽헌은 어머니인 신사임당과 내가 태어나고 자란 집이야. 우리나라에 남아있는 조선시대 건물 중에서 가장 오래된 나무 집 중 하나란다.",
        popImage: "오죽헌(e뮤지엄, 공공누리 4유형).jpg"
      },
      {
        name: "오죽",
        box: { l: 28, t: 13, w: 32, h: 40 },
        line: "집 주변에 줄기가 검은색인 대나무(오죽)가 많이 자라서 '오죽헌'이라는 이름이 붙었어."
      }
    ],
    backHeritage: [
      {
        name: "초충도 병풍",
        box: { l: 12, t: 8, w: 72, h: 82 },
        line: "이 그림은 어머니인 신사임당이 그린 초충도 병풍에 있는 그림이야. 8개의 그림 중에서 2개의 그림이 여기에 있어.",
        popImage: "초충도병풍-한국민족문화대백과,공공누리1유형.jpg"
      },
      {
        name: "수박과 여치",
        box: { l: 10, t: 15, w: 35, h: 80 },
        line: "이건 &lt;수박과 여치&gt; 그림이야. 수박덩굴처럼 자손이 건강하고 행복하게 살기를 바라는 마음이 담겨 있어.",
        popImage: "수박과여치-한국민족문화대백과,공공누리1유형.jpg"
      },
      {
        name: "맨드라미와 개구리",
        box: { l: 45, t: 20, w: 25, h: 75 },
        line: "이건 &lt;맨드라미와 개구리&gt; 그림이야. 맨드라미는 공부를 열심히 해서 세상에서 이름을 널리 알리라는 뜻이 담겨 있어.",
        popImage: "맨드라미와개구리-한국민족문화대백과,공공누리1유형.jpg"
      }
    ]
  },
  {
    amount: 1000,
    label: "천원",
    front: "1000.jpg",
    back: "1000_back.jpg",
    person: {
      name: "퇴계 이황",
      trait: "조선 시대의 유학자이자 스승",
      box: { l: 54, t: 10, w: 42, h: 78 },
      line: "안녕 조선시대의 학자인 이황이란다. 나는 책을 열심히 읽는 것만큼이나 다른 사람을 배려하고 바른 예의를 지키는 마음을 가장 중요하게 생각했단다. 너희도 친구들에게 따뜻하고 고운 마음을 나눠주는 어린이가 되길 바랄게!"
    },
    frontHeritage: [
      {
        name: "명륜당",
        box: { l: 20, t: 50, w: 42, h: 33 },
        line: "성균관 명륜당은 조선시대 최고의 학교야. 나는 이곳에서 바른 마음과 공부를 가르쳤단다.",
        popImage: "서울 문묘 명륜당(국가유산포털,공공누리open).jpg"
      },
      {
        name: "매화",
        box: { l: 26, t: 12, w: 32, h: 36 },
        line: "나는 추운 겨울 눈 속에서 가장 먼저 예쁘게 피어나는 매화를 친구처럼 좋아했어. 어려움 속에서도 바른 마음을 잃지 않는 선비의 모습과 닮았다고 생각하거든."
      }
    ],
    backHeritage: [
      {
        name: "계상정거도",
        box: { l: 8, t: 20, w: 58, h: 65 },
        line: "이 그림은 화가 '정선'이 도산서원을 그린 &lt;계상정거도&gt;야."
      },
      {
        name: "도산서원",
        box: { l: 42, t: 38, w: 18, h: 42 },
        line: "도산서원은 내가 유생들을 가르치며 학문을 연구했던 곳이야. 집 안에 앉아 있는 나를 찾아 볼래?"
      }
    ]
  }
];

const MONEY_QUIZZES = [
  {
    q: "오만 원권 앞면에 그려진 인물은 누구일까요?",
    choices: ["신사임당", "세종대왕", "이황", "이이"],
    a: "신사임당"
  },
  {
    q: "만 원권 앞면에 있는 왕은 누구일까요?",
    choices: ["세종대왕", "정조", "태조", "광해군"],
    a: "세종대왕"
  },
  {
    q: "천 원권 앞면에 있는 학자는 누구일까요?",
    choices: ["퇴계 이황", "율곡 이이", "정약용", "김유신"],
    a: "퇴계 이황"
  },
  {
    q: "만 원권 뒷면에 그려진 하늘 관측 기구의 이름은?",
    choices: ["혼천의", "측우대", "자격루", "해시계"],
    a: "혼천의"
  },
  {
    q: "오천 원권 뒷면에 그려진 신사임당의 그림 이름은?",
    choices: ["초충도", "묵포도도", "월매도", "일월오봉도"],
    a: "초충도"
  }
];

function createDefaultMoneyState() {
  return {
    phase: "tour",
    billIdx: 0,
    stepIdx: 0,
    lastSpoken: null,
    quizQueue: [0, 1, 2, 3, 4],
    quizPos: 0,
    quizWrong: [],
    quizCorrect: []
  };
}

function moneyInit() {
  const defaults = createDefaultMoneyState();
  if (!state.money || typeof state.money !== "object") {
    state.money = defaults;
  } else {
    state.money = { ...defaults, ...state.money };
  }
  if (!["tour", "quiz", "done"].includes(state.money.phase)) state.money.phase = "tour";
  state.money.billIdx = Math.max(0, Math.min(MONEY_BILLS.length - 1, Number(state.money.billIdx) || 0));
  state.money.stepIdx = Math.max(0, Number(state.money.stepIdx) || 0);
  state.money.quizPos = Math.max(0, Number(state.money.quizPos) || 0);
  if (!Array.isArray(state.money.quizQueue) || !state.money.quizQueue.length) {
    state.money.quizQueue = MONEY_QUIZZES.map((_, q) => q);
  }
  if (!Array.isArray(state.money.quizWrong)) state.money.quizWrong = [];
  if (!Array.isArray(state.money.quizCorrect)) state.money.quizCorrect = [];
  const stepCount = moneyBillSteps(MONEY_BILLS[state.money.billIdx]).length;
  if (state.money.stepIdx >= stepCount) state.money.stepIdx = Math.max(0, stepCount - 1);
  return state.money;
}

function moneyTourCounts() {
  return MONEY_BILLS.map((bill) => moneyBillSteps(bill).length);
}

function moneyNavSteps() {
  const steps = [];
  MONEY_BILLS.forEach((bill, billIdx) => {
    const n = moneyBillSteps(bill).length;
    for (let stepIdx = 0; stepIdx < n; stepIdx++) steps.push({ phase: "tour", billIdx, stepIdx });
  });
  // 퀴즈는 탐색 다음 화면으로만 진입. 완료(done) 단계는 퀴즈를 실제로 맞혔을 때만 들어간다.
  steps.push({ phase: "quiz", quizPos: 0 });
  return steps;
}

function moneyNavIndex(m) {
  if (m.phase === "done" || m.phase === "quiz") {
    return moneyTourCounts().reduce((n, c) => n + c, 0);
  }
  const billIdx = Math.max(0, Number(m.billIdx) || 0);
  const stepIdx = Math.max(0, Number(m.stepIdx) || 0);
  return moneyTourCounts().slice(0, billIdx).reduce((n, c) => n + c, 0) + stepIdx;
}

function moneyApplyNavStep(m, index) {
  const steps = moneyNavSteps();
  const step = steps[Math.max(0, Math.min(steps.length - 1, index))];
  if (!step) return;
  m.lastSpoken = null;
  if (step.phase === "tour") {
    m.phase = "tour";
    m.billIdx = step.billIdx;
    m.stepIdx = step.stepIdx;
    return;
  }
  // 퀴즈 화면으로만 이동. 보물/완료는 moneyQuizComplete에서만 처리한다.
  // (이미 풀었더라도 「다음」으로 퀴즈 화면에 다시 들어갈 수 있다)
  m.phase = "quiz";
  if (!Array.isArray(m.quizQueue) || !m.quizQueue.length) {
    m.quizQueue = MONEY_QUIZZES.map((_, q) => q);
  }
  if (!Array.isArray(m.quizWrong)) m.quizWrong = [];
  if (!Array.isArray(m.quizCorrect)) m.quizCorrect = [];
  m.quizPos = Math.max(0, Math.min((m.quizQueue.length || 1) - 1, Number(m.quizPos) || 0));
  m.billIdx = MONEY_BILLS.length - 1;
  m.stepIdx = Math.max(0, moneyBillSteps(MONEY_BILLS[m.billIdx]).length - 1);
}

function moneyBillSteps(bill) {
  const steps = [{ kind: "person", side: "front", ...bill.person }];
  bill.frontHeritage.forEach((h) => steps.push({ kind: "heritage", side: "front", ...h }));
  bill.backHeritage.forEach((h) => steps.push({ kind: "heritage", side: "back", ...h }));
  return steps;
}

function moneyHighlightStyle(box) {
  return `left:${box.l}%;top:${box.t}%;width:${box.w}%;height:${box.h}%;`;
}

/** 원본(가로) 지폐 좌표 → 화면에 보이는 회전 후 좌표 (-90: 왼쪽 90°) */
function moneyRotateDisplayBox(box, degrees) {
  if (degrees === -90) {
    return {
      l: box.t,
      t: 100 - box.l - box.w,
      w: box.h,
      h: box.w
    };
  }
  return box;
}

function bindMoneyBillFit() {
  const wrap = document.querySelector(".money-bill-wrap");
  const stage = wrap?.closest(".money-bill-stage");
  const layout = wrap?.closest(".money-tour-layout");
  const sidePanel = layout?.querySelector(".money-side-panel");
  if (!wrap || !stage) return;

  const isRotated = wrap.classList.contains("money-bill-wrap--rotate-left");
  const isRowLayout = layout?.classList.contains("money-tour-layout--row");
  const ROTATE_VISUAL_RATIO = 2.05;

  const apply = () => {
    const stageRect = stage.getBoundingClientRect();
    const layoutRect = layout?.getBoundingClientRect();
    const bubblePanel = layout?.querySelector(".money-side-panel");
    const bottomReserve = 112;
    let bubbleReserve = isRowLayout ? 0 : 168;
    if (!isRowLayout && bubblePanel) {
      const bubbleRect = bubblePanel.getBoundingClientRect();
      if (bubbleRect.height > 0) bubbleReserve = bubbleRect.height + 20;
    }
    const viewportAvailH = Math.max(
      140,
      window.innerHeight - stageRect.top - bottomReserve - bubbleReserve
    );

    let availH = viewportAvailH;
    if (isRowLayout && sidePanel && !isRotated) {
      const sideRect = sidePanel.getBoundingClientRect();
      if (sideRect.height > 0) availH = Math.min(availH, sideRect.height);
    } else if (!isRotated && layoutRect?.height > 0) {
      availH = Math.min(availH, layoutRect.height - bubbleReserve);
    }

    const maxWByCol = isRowLayout
      ? (layoutRect ? Math.min(Math.max(280, layoutRect.width * 0.72), 980) : 980)
      : (layoutRect
        ? Math.min(Math.max(260, layoutRect.width * 0.94), 960)
        : Math.min(960, window.innerWidth * 0.92));
    const img = wrap.querySelector(".money-bill-img");
    const aspect = img?.naturalWidth && img?.naturalHeight
      ? img.naturalWidth / img.naturalHeight
      : 2.1;

    let wrapW;
    if (isRotated) {
      wrapW = Math.min(availH / ROTATE_VISUAL_RATIO, maxWByCol, 980);
    } else {
      wrapW = Math.min(availH * aspect, maxWByCol, 960, window.innerWidth * 0.92);
    }
    wrapW = Math.floor(Math.max(isRotated ? 280 : 280, wrapW));
    wrap.style.width = `${wrapW}px`;
    wrap.style.maxHeight = isRotated ? `${Math.floor(wrapW * ROTATE_VISUAL_RATIO)}px` : "";
  };

  const run = () => {
    apply();
    requestAnimationFrame(apply);
  };

  const img = wrap.querySelector(".money-bill-img");
  if (img?.complete && img.naturalWidth) run();
  else if (img) img.addEventListener("load", run, { once: true });
  else run();

  if (window._moneyBillFit) {
    window.removeEventListener("resize", window._moneyBillFit);
    if (window.visualViewport) window.visualViewport.removeEventListener("resize", window._moneyBillFit);
  }
  if (window._moneyBillFitRO) window._moneyBillFitRO.disconnect();

  window._moneyBillFit = run;
  window.addEventListener("resize", run);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", run);

  window._moneyBillFitRO = new ResizeObserver(run);
  window._moneyBillFitRO.observe(stage);
  if (layout) window._moneyBillFitRO.observe(layout);
  if (sidePanel) window._moneyBillFitRO.observe(sidePanel);
}

function showMoneyPopImage(title, file) {
  Swal.fire({
    title,
    html: `<div class="money-pop-frame">${photoCreditHTML(file)}<img class="money-pop-img" src="${MONEY_POP_IMG(file)}" alt="${title}" draggable="false" /></div>`,
    confirmButtonText: "닫기",
    width: "min(92vw, 560px)",
    customClass: { popup: "money-pop-popup" }
  });
}

function moneySentenceHTML(text) {
  const parts = String(text).trim().split(/(?<=\.)\s+/).filter(Boolean);
  return parts.map((s) => `<span class="money-sentence">${s}</span>`).join("");
}

function moneyAdvanceTour(m) {
  const bill = MONEY_BILLS[m.billIdx];
  const steps = moneyBillSteps(bill);
  m.stepIdx += 1;
  m.lastSpoken = null;
  if (m.stepIdx >= steps.length) {
    m.billIdx += 1;
    m.stepIdx = 0;
    if (m.billIdx >= MONEY_BILLS.length) {
      m.phase = "quiz";
      m.quizQueue = [0, 1, 2, 3, 4];
      m.quizPos = 0;
      m.quizWrong = [];
      m.quizCorrect = [];
    }
  }
}

function moneyQuizComplete() {
  hideMoneyQuizToast();
  const m = moneyInit();
  m.phase = "done";
  state.solved.money = true;
  saveProgress();
  if (!isMissionRouteCompleted("stage1_a4")) requestMissionComplete("stage1_a4");
  render();
}

function moneyMissionBtn(m) {
  const ready = !!state.solved?.money || isMissionRouteCompleted("stage1_a4");
  bindMissionCompleteBtn(
    "stage1_a4",
    ready,
    "화폐를 모두 살펴보고 퀴즈 5문제를 맞히면 ⭐ 미션완료!",
    () => { state.solved.money = true; saveProgress(); }
  );
}

function renderMoneyTour(m) {
  const bill = MONEY_BILLS[m.billIdx];
  const steps = moneyBillSteps(bill);
  const step = steps[m.stepIdx];
  const side = step.side;
  const billFile = side === "front" ? bill.front : bill.back;
  const imgSrc = MONEY_IMG(billFile);
  const sideLabel = side === "front" ? "앞면" : "뒷면";
  const showPersonPop = step.kind === "person" && side === "front";
  const personBase = `${bill.amount}p`;
  const personPopHTML = showPersonPop
    ? `<img class="money-person-pop" src="${MONEY_IMG(personBase + ".png")}" alt="${bill.person.name} 강조 이미지" draggable="false"
         onerror="if(this.dataset.triedJpg!=='1'){this.dataset.triedJpg='1';this.src='${MONEY_IMG(personBase + ".jpg")}';return;}if(this.dataset.triedJpeg!=='1'){this.dataset.triedJpeg='1';this.src='${MONEY_IMG(personBase + ".jpeg")}';return;}if(this.dataset.triedWebp!=='1'){this.dataset.triedWebp='1';this.src='${MONEY_IMG(personBase + ".webp")}';return;}this.style.display='none';" />`
    : "";

  const rotateBack = bill.backRotate && side === "back";
  const layoutRow = bill.amount === 50000 && side === "back";
  const stageExtra = [
    side === "back" ? "money-bill-stage--back" : "",
    rotateBack ? "money-bill-stage--portrait-back" : ""
  ].filter(Boolean).join(" ");
  const tapHint = step.popImage ? `<span class="money-highlight-tap" aria-hidden="true">👆</span>` : "";
  const displayBox = rotateBack ? moneyRotateDisplayBox(step.box, -90) : step.box;
  const imgLayer = `
          <img class="money-bill-img" src="${imgSrc}" alt="${bill.label} ${sideLabel}" draggable="false" />
          ${personPopHTML}`;
  const highlightLayer = `
          <div class="money-highlight money-highlight--active${step.popImage ? " money-highlight--clickable" : ""}" id="moneyHighlight" style="${moneyHighlightStyle(displayBox)}"${step.popImage ? ` role="button" tabindex="0" aria-label="${step.name} 자세히 보기"` : ""}>
            ${tapHint}
            <span class="money-highlight-label">${step.name}</span>
          </div>`;

  app.innerHTML = sceneTemplate("STAGE 1-4 화폐 속 이야기", `
    <div class="money-game money-game--tour">
      <div class="money-tour-layout${layoutRow ? " money-tour-layout--row" : ""}">
        <div class="money-bill-stage${stageExtra ? ` ${stageExtra}` : ""}">
          <div class="money-bill-wrap${rotateBack ? " money-bill-wrap--rotate-left" : ""}">
            ${rotateBack ? `<div class="money-bill-rotated">${imgLayer}</div>${highlightLayer}` : `${imgLayer}${highlightLayer}`}
            ${photoCreditHTML(billFile)}
          </div>
        </div>
        <div class="money-side-panel">
          <div class="money-bubble" id="moneyBubble">
            <p class="money-bubble-text">${moneySentenceHTML(step.line)}</p>
            <button type="button" class="btn sm money-replay" id="moneyReplay" aria-label="말상자 읽어 주기">🔊</button>
          </div>
        </div>
      </div>
    </div>
  `);
  setupNavigationAndHelp("화폐 속 인물과 문화유산 설명을 들어보자!");
  stopSpeechVoice();
  moneyMissionBtn(m);

  bindSpeakButton(document.getElementById("moneyReplay"), () => step.line);
  const highlight = document.getElementById("moneyHighlight");
  if (highlight && step.popImage) {
    const openPop = () => {
      playSound("click.mp3");
      showMoneyPopImage(step.name, step.popImage);
    };
    highlight.onclick = openPop;
    highlight.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPop();
      }
    };
  }
  bindMoneyBillFit();
}

function ensureMoneyQuizOverlay() {
  let toast = document.getElementById("moneyQuizToast");
  let confetti = document.getElementById("moneyQuizConfetti");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "moneyQuizToast";
    toast.className = "money-quiz-toast";
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  if (!confetti) {
    confetti = document.createElement("div");
    confetti.id = "moneyQuizConfetti";
    confetti.className = "money-quiz-confetti";
    confetti.setAttribute("aria-hidden", "true");
    document.body.appendChild(confetti);
  }
  return { toast, confetti };
}

function hideMoneyQuizToast() {
  const toast = document.getElementById("moneyQuizToast");
  if (!toast) return;
  toast.classList.remove("is-show");
  toast.innerHTML = "";
}

function launchMoneyQuizConfetti() {
  ensureMoneyQuizOverlay();
  const host = document.getElementById("moneyQuizConfetti");
  if (!host) return;
  host.innerHTML = "";
  const colors = ["#7ee787", "#ffd84d", "#ff9f68", "#7eddd4", "#ffb3d9", "#9be7ff"];
  for (let i = 0; i < 52; i++) {
    const p = document.createElement("span");
    p.className = "money-quiz-confetti-piece";
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 0.4}s`;
    p.style.setProperty("--tx", `${(Math.random() - 0.5) * 240}px`);
    p.style.setProperty("--rot", `${Math.random() * 720}deg`);
    host.appendChild(p);
  }
  window.setTimeout(() => { host.innerHTML = ""; }, 2400);
}

function showMoneyQuizToast(type, message, onContinue) {
  const { toast } = ensureMoneyQuizOverlay();
  const toastType = type === "correct" ? "ok" : type === "complete" ? "complete" : "retry";
  const btnLabel = type === "correct" ? "계속!" : type === "complete" ? "확인!" : "다시 해볼게요";
  const icon = type === "correct" || type === "complete"
    ? `<span class="money-quiz-star" aria-hidden="true">${type === "complete" ? "🎉" : "⭐"}</span>`
    : "";
  toast.className = `money-quiz-toast money-quiz-toast--${toastType} is-show`;
  toast.innerHTML = `
    <div class="money-quiz-toast-inner">
      ${icon}
      <p class="money-quiz-toast-msg">${message}</p>
      <button type="button" class="money-quiz-toast-btn">${btnLabel}</button>
    </div>
  `;
  const btn = toast.querySelector(".money-quiz-toast-btn");
  if (!btn) {
    onContinue();
    return;
  }
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideMoneyQuizToast();
    onContinue();
  }, { once: true });
}

function showMoneyQuizAllClear() {
  const m = moneyInit();
  renderMoneyQuiz(m, { allComplete: true });
  launchMoneyQuizConfetti();
  playSound("correct.mp3");
  showMoneyQuizToast(
    "complete",
    "와! 화폐 퀴즈 5문제를 모두 맞혔어! 정말 멋져!",
    () => moneyQuizComplete()
  );
}

function moneyQuizAfterAnswer(ok, qIndex) {
  const m = moneyInit();
  if (!ok) {
    if (!m.quizWrong.includes(qIndex)) m.quizWrong.push(qIndex);
    render();
    return;
  }
  m.quizWrong = m.quizWrong.filter((i) => i !== qIndex);
  if (!m.quizCorrect.includes(qIndex)) m.quizCorrect.push(qIndex);
  m.quizPos += 1;

  if (m.quizCorrect.length >= MONEY_QUIZZES.length) {
    showMoneyQuizAllClear();
    return;
  }

  if (m.quizPos >= m.quizQueue.length) {
    if (m.quizWrong.length > 0) {
      m.quizQueue = [...m.quizWrong];
      m.quizWrong = [];
      m.quizPos = 0;
      showMoneyQuizToast("retry", "틀린 문제를 다시 풀어보자!", () => render());
    } else {
      render();
    }
  } else {
    render();
  }
}

function renderMoneyQuiz(m, opts = {}) {
  const allComplete = !!opts.allComplete;
  if (!allComplete) hideMoneyQuizToast();
  ensureMoneyQuizOverlay();
  const qIndex = m.quizQueue[Math.min(m.quizPos, m.quizQueue.length - 1)];
  const quiz = MONEY_QUIZZES[qIndex];
  const qNum = Math.min(m.quizPos + 1, m.quizQueue.length);
  const correctCount = allComplete ? MONEY_QUIZZES.length : m.quizCorrect.length;
  const progressPct = Math.max(0, Math.min(100, (correctCount / MONEY_QUIZZES.length) * 100));
  const choiceTones = ["mint", "yellow", "orange", "sky"];
  const shuffledChoices = allComplete ? [] : shuffleArray([...quiz.choices]);
  const choicesHTML = allComplete
    ? `<p class="money-quiz-all-clear">5문제를 모두 맞혔어요! 🎉</p>`
    : shuffledChoices.map((c, i) =>
      `<button type="button" class="money-quiz-choice money-quiz-choice--${choiceTones[i % choiceTones.length]}" data-a="${c}">${c}</button>`
    ).join("");
  const questionHTML = allComplete
    ? `<p class="money-quiz-q money-quiz-q--done">퀴즈 완료!</p>`
    : `<p class="money-quiz-q"><span class="money-quiz-num">${qNum}.</span> ${quiz.q}</p>`;

  app.innerHTML = sceneTemplate("STAGE 1-4 화폐 속 이야기 퀴즈", `
    <div class="money-game money-game--quiz${allComplete ? " money-game--quiz-done" : ""}">
      <div class="money-quiz-progress">
        <div class="money-quiz-progress-track">
          <div class="money-quiz-progress-fill" style="width:${progressPct}%"></div>
          <img class="money-quiz-progress-char" src="${CHAR_IMG("suho.png")}" alt="" style="--quiz-progress:${progressPct}" draggable="false" />
        </div>
      </div>
      <div class="money-quiz-card${allComplete ? " money-quiz-card--done" : ""}">
        ${questionHTML}
        <div class="money-quiz-choices">${choicesHTML}</div>
      </div>
    </div>
  `);
  setupNavigationAndHelp("화폐에 대해 배운 내용으로 퀴즈를 풀어보자!");
  moneyMissionBtn(m);

  if (allComplete) return;

  document.querySelectorAll(".money-quiz-choice").forEach((btn) => {
    btn.onclick = () => {
      if (btn.disabled) return;
      document.querySelectorAll(".money-quiz-choice").forEach((b) => { b.disabled = true; });
      const ok = btn.dataset.a === quiz.a;
      if (ok) {
        playSound("correct.mp3");
        launchMoneyQuizConfetti();
        showMoneyQuizToast("correct", "정답이에요! 잘했어!", () => moneyQuizAfterAnswer(true, qIndex));
      } else {
        playSound("wrong.mp3");
        showMoneyQuizToast("retry", "아쉬워요! 다시 해볼까요?", () => moneyQuizAfterAnswer(false, qIndex));
      }
    };
  });
}

function renderStage1Act4() {
  const m = moneyInit();
  if (m.phase === "quiz") {
    stopSpeechVoice();
    renderMoneyQuiz(m);
  } else {
    hideMoneyQuizToast();
    if (m.phase === "done") {
      stopSpeechVoice();
    app.innerHTML = sceneTemplate("STAGE 1-4 화폐 속 이야기", `
      <div class="money-game money-game--done">
        <p class="money-done-msg">🎉 화폐 탐색과 퀴즈를 모두 완료했어요!</p>
        <p class="sub">↺ 다시 하기로 처음부터 연습할 수 있어요.</p>
      </div>
    `);
    setupNavigationAndHelp("화폐 활동을 다시 연습해보자!");
    moneyMissionBtn(m);
    } else {
      renderMoneyTour(m);
    }
  }
}

function renderStage2Menu() {
  renderStageActivityMenu(2);
}

/* ───────────── 한글 퍼즐 (자음·모음 낱자 드래그) ───────────── */
let hangulVideoEl = null;

function stopHangulVideo() {
  const video = hangulVideoEl || document.getElementById("hangulOriginVideo");
  hangulVideoEl = null;
  if (!video) return;
  try { video.pause(); } catch (_) {}
  try {
    video.removeAttribute("src");
    video.load();
  } catch (_) {}
}

function beginHangulPuzzleFromVideo() {
  stopHangulVideo();
  playSound("click.mp3");
  state.hangulPhase = "puzzle";
  if (state.hangulQuiz == null) state.hangulQuiz = 0;
  render();
}

function renderHangulOriginVideo() {
  stopHangulVideo();
  app.innerHTML = sceneTemplate("STAGE 2-1 한글은 어떻게 만들어졌을까", `
    <div class="section-card hangul-video-screen">
      <p class="hangul-video-lead">한글이 어떻게 만들어졌는지 영상을 보고, 한글 조각 맞추기를 해 보자!</p>
      <div class="hangul-video-frame">
        <video
          id="hangulOriginVideo"
          class="hangul-origin-video"
          src="${HANGUL_ORIGIN_VIDEO}"
          controls
          playsinline
          webkit-playsinline
          preload="metadata"
        ></video>
      </div>
      <button type="button" class="btn primary hangul-video-next" id="hangulVideoNext">한글 조각 맞추기 ▶</button>
    </div>
  `);
  setupNavigationAndHelp("영상을 본 뒤 한글 조각 맞추기를 시작해 보자!");
  bindMissionCompleteBtn("stage2_a1", !!state.solved.hangul);

  const video = document.getElementById("hangulOriginVideo");
  hangulVideoEl = video;
  if (video) {
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.play().catch(() => {});
  }
  const nextBtn = document.getElementById("hangulVideoNext");
  if (nextBtn) nextBtn.onclick = beginHangulPuzzleFromVideo;
}

// ▼ 퀴즈는 여기서 자유롭게 수정/추가하세요 (q: 문제, a: 정답 단어). 우리나라 관련 7문제.
const HANGUL_QUIZZES = [
  { q: "우리나라의 수도는 어디일까요?", a: "서울" },
  { q: "세종대왕이 만든 우리 고유의 글자는?", a: "한글" },
  { q: "우리나라 전통 옷의 이름은?", a: "한복" },
  { q: "우리나라를 상징하는 나라꽃은?", a: "무궁화" },
  { q: "태극 무늬가 그려진 우리나라 국기의 이름은?", a: "태극기" },
  { q: "설날에 윷을 던지며 즐기는 전통 놀이는?", a: "윷놀이" },
  { q: "배추로 담그는 우리나라 대표 발효 음식은?", a: "김치" }
];

// 낱자 → 파일 키 (자음/모음 로마자). 에셋 파일명 규칙: assets/images/hangul/<key>.svg
const JAMO_KEY = {
  "ㄱ": "g", "ㄲ": "gg", "ㄴ": "n", "ㄷ": "d", "ㄸ": "dd", "ㄹ": "r", "ㅁ": "m",
  "ㅂ": "b", "ㅃ": "bb", "ㅅ": "s", "ㅆ": "ss", "ㅇ": "ng", "ㅈ": "j", "ㅉ": "jj",
  "ㅊ": "ch", "ㅋ": "k", "ㅌ": "t", "ㅍ": "p", "ㅎ": "h",
  "ㅏ": "a", "ㅐ": "ae", "ㅑ": "ya", "ㅒ": "yae", "ㅓ": "eo", "ㅔ": "e", "ㅕ": "yeo",
  "ㅖ": "ye", "ㅗ": "o", "ㅘ": "wa", "ㅙ": "wae", "ㅚ": "oe", "ㅛ": "yo", "ㅜ": "u",
  "ㅝ": "wo", "ㅞ": "we", "ㅟ": "wi", "ㅠ": "yu", "ㅡ": "eu", "ㅢ": "ui", "ㅣ": "i"
};
// 만들어 둔 낱자 에셋 (이 목록에 있으면 이미지 사용, 없으면 글자 타일로 자동 폴백)
const HANGUL_ASSET_SET = new Set([
  "ㄱ", "ㄴ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅊ", "ㅌ", "ㅎ",
  "ㅏ", "ㅐ", "ㅓ", "ㅗ", "ㅘ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"
]);
const HANGUL_IMG = (name) => toAsset(`assets/images/hangul/${name}`);
const HG_VOWELS = new Set(["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"]);
/** 초성 오른쪽(옆)에 오는 모음 — ㅏ·ㅓ 계열·ㅣ. 나머지(ㅗ·ㅜ·ㅡ 계열)는 초성 아래 */
const HG_JUNG_BESIDE = new Set(["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅣ"]);

const HG_CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const HG_JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const HG_JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

function decomposeSyllable(ch) {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return [ch];
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  const out = [HG_CHO[cho], HG_JUNG[jung]];
  if (jong > 0) out.push(HG_JONG[jong]);
  return out;
}
function decomposeWord(word) {
  return [...word].map(decomposeSyllable);
}
function hangulVowelBeside(jung) {
  return HG_JUNG_BESIDE.has(jung);
}
function hangulSyllableHTML(syl, si, slotHTML) {
  const jung = syl[1];
  const hasJong = syl.length > 2;
  const beside = hangulVowelBeside(jung);
  const layoutCls = beside ? "hg-layout--beside" : "hg-layout--below";
  const jongRow = hasJong ? `<div class="hg-row hg-bottom">${slotHTML(si, 2)}</div>` : "";

  if (beside) {
    const top = `<div class="hg-row hg-top">${slotHTML(si, 0)}${slotHTML(si, 1)}</div>`;
    return `<div class="hg-syllable ${layoutCls}"><div class="hg-body">${top}</div>${jongRow}</div>`;
  }
  const stack = `<div class="hg-body hg-stack">${slotHTML(si, 0)}${slotHTML(si, 1)}</div>`;
  return `<div class="hg-syllable ${layoutCls}">${stack}${jongRow}</div>`;
}
function hangulTileHTML(jamo, extraClass) {
  const cls = `hg-tile ${HG_VOWELS.has(jamo) ? "vowel" : "consonant"} ${extraClass || ""}`;
  if (HANGUL_ASSET_SET.has(jamo) && JAMO_KEY[jamo]) {
    return `<span class="${cls}"><img src="${HANGUL_IMG(JAMO_KEY[jamo] + ".svg")}" alt="${jamo}" draggable="false" /></span>`;
  }
  return `<span class="${cls}">${jamo}</span>`;
}

function hangulProgressPct() {
  const solved = Array.isArray(state.hangulSolved) ? state.hangulSolved.length : 0;
  return Math.max(0, Math.min(100, (solved / HANGUL_QUIZZES.length) * 100));
}

function showHangulSolveBurst(host) {
  if (!host) return;
  host.querySelector(".hg-solve-burst")?.remove();
  const burst = document.createElement("div");
  burst.className = "hg-solve-burst";
  burst.setAttribute("aria-hidden", "true");
  burst.innerHTML = "<span>⭐</span><span>✨</span><span>🎉</span><span>✨</span><span>⭐</span>";
  host.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1400);
}

function hangulPaintProgress() {
  const pct = hangulProgressPct();
  const fill = document.getElementById("hgProgressFill");
  const char = document.getElementById("hgProgressChar");
  if (fill) fill.style.width = `${pct}%`;
  if (char) char.style.setProperty("--quiz-progress", String(pct));
}

function renderHangulPuzzle() {
  if (state.hangulQuiz == null || state.hangulQuiz >= HANGUL_QUIZZES.length) state.hangulQuiz = 0;
  if (!Array.isArray(state.hangulSolved)) state.hangulSolved = [];
  hideMoneyQuizToast();
  const progressPct = hangulProgressPct();

  app.innerHTML = sceneTemplate("STAGE 2-1 한글 조각 맞추기", `
    <div class="hangul-game">
      <div class="money-quiz-progress hg-progress">
        <div class="money-quiz-progress-track">
          <div class="money-quiz-progress-fill" id="hgProgressFill" style="width:${progressPct}%"></div>
          <img class="money-quiz-progress-char" id="hgProgressChar" src="${CHAR_IMG("rabbit.png")}" alt="" style="--quiz-progress:${progressPct}" draggable="false" />
        </div>
      </div>
      <div class="hg-quizbar">
        <button id="hgVoice" class="btn sm">🔊 문제 듣기</button>
      </div>
      <p class="hg-question" id="hgQuestion"></p>
      <div class="hg-answer" id="hgAnswer"></div>
      <p class="hg-status" id="hgStatus"></p>
      <div class="hg-tray" id="hgTray"></div>
    </div>
  `);
  setupNavigationAndHelp("자음·모음 낱자를 끌어와 정답 단어를 완성해보자!");
  bindMissionCompleteBtn("stage2_a1", !!state.solved.hangul);

  let selected = null; // 클릭(터치) 보조 선택용 tile element

  function startQuiz() {
    stopSpeechVoice();
    document.querySelector(".hangul-game")?.classList.remove("is-solved");
    document.getElementById("hgAnswer")?.classList.remove("is-solved");
    const quiz = HANGUL_QUIZZES[state.hangulQuiz];
    const syllables = decomposeWord(quiz.a); // [[자모...], ...]
    // 정답에 필요한 낱자 목록 + 방해 낱자
    const needed = syllables.flat();
    const pool = [...HANGUL_ASSET_SET].filter((j) => !needed.includes(j));
    shuffleArray(pool);
    const distractors = pool.slice(0, Math.min(3, pool.length));
    const tiles = shuffleArray([...needed, ...distractors]).map((j, idx) => ({ id: idx, jamo: j, used: false }));
    // filled[s][k] = jamo or null
    const filled = syllables.map((syl) => syl.map(() => null));

    const answerEl = document.getElementById("hgAnswer");
    const trayEl = document.getElementById("hgTray");
    const statusEl = document.getElementById("hgStatus");
    document.getElementById("hgQuestion").innerHTML =
      `<span class="hg-q-num">${state.hangulQuiz + 1}.</span> ${quiz.q}`;
    hangulPaintProgress();

    function place(si, ki, tile) {
      if (tile.used || filled[si][ki]) return;
      if (tile.jamo !== syllables[si][ki]) {
        playSound("wrong.mp3");
        statusEl.textContent = "";
        showMoneyQuizToast("retry", "다시 생각해볼까요?", () => {});
        return;
      }
      filled[si][ki] = tile.jamo;
      tile.used = true;
      selected = null;
      playSound("snap.mp3");
      statusEl.textContent = "";
      paint();
      if (filled.every((syl) => syl.every((x) => x))) onSolved();
    }

    function onSolved() {
      statusEl.textContent = "";
      const isLast = state.hangulQuiz >= HANGUL_QUIZZES.length - 1;
      if (!state.hangulSolved.includes(state.hangulQuiz)) state.hangulSolved.push(state.hangulQuiz);
      hangulPaintProgress();
      answerEl.classList.add("is-solved");
      document.querySelector(".hangul-game")?.classList.add("is-solved");
      showHangulSolveBurst(answerEl);
      launchMoneyQuizConfetti();
      playSound(isLast ? "taegeukgi-fanfare.wav" : "correct.mp3");
      showMoneyQuizToast(
        isLast ? "complete" : "correct",
        isLast ? "한글 퀴즈를 모두 맞혔어! 정말 멋져!" : "정답이에요! 잘했어!",
        () => {
          if (!isLast) {
            state.hangulQuiz++;
            startQuiz();
          } else {
            state.solved.hangul = true;
            saveProgress();
            bindMissionCompleteBtn("stage2_a1", true);
          }
        }
      );
    }

    function slotHTML(si, ki) {
      const f = filled[si][ki];
      return `<div class="hg-slot${f ? " filled" : ""}" data-si="${si}" data-ki="${ki}">${f ? hangulTileHTML(f) : ""}</div>`;
    }

    function paint() {
      // 정답 칸 — 모음에 따라 초성 옆/아래 + 받침(아래) 한글 음절 배치
      answerEl.innerHTML = syllables.map((syl, si) => hangulSyllableHTML(syl, si, slotHTML)).join("");
      // 낱자 트레이
      trayEl.innerHTML = tiles.map((t) =>
        t.used ? "" : `<button class="hg-traytile${selected && selected.id === t.id ? " sel" : ""}" data-id="${t.id}">${hangulTileHTML(t.jamo)}</button>`
      ).join("");

      // 이벤트 (드래그 + 클릭 보조)
      trayEl.querySelectorAll(".hg-traytile").forEach((btn) => {
        const tile = tiles[+btn.dataset.id];
        btn.draggable = true;
        btn.addEventListener("dragstart", () => { window.__hgDrag = tile; });
        btn.onclick = () => { selected = selected && selected.id === tile.id ? null : tile; paint(); };
      });
      answerEl.querySelectorAll(".hg-slot").forEach((slot) => {
        const si = +slot.dataset.si, ki = +slot.dataset.ki;
        slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("over"); });
        slot.addEventListener("dragleave", () => slot.classList.remove("over"));
        slot.addEventListener("drop", (e) => {
          e.preventDefault();
          slot.classList.remove("over");
          if (window.__hgDrag) { place(si, ki, window.__hgDrag); window.__hgDrag = null; }
        });
        slot.onclick = () => { if (selected) place(si, ki, selected); };
      });
    }

    statusEl.textContent = "";
    paint();
  }

  bindSpeakButton(document.getElementById("hgVoice"), () => HANGUL_QUIZZES[state.hangulQuiz].q);

  startQuiz();
}

function renderStage2Act1() {
  if (state.hangulPhase !== "puzzle") state.hangulPhase = "video";
  if (state.hangulPhase === "video") {
    renderHangulOriginVideo();
    return;
  }
  stopHangulVideo();
  renderHangulPuzzle();
}

function renderStage2Act2() {
  if (!state.hanokTour && window.HanokTour) {
    state.hanokTour = window.HanokTour.createDefaultState();
  }
  if (!state.hanokExplorer && window.HanokExplorer) {
    state.hanokExplorer = window.HanokExplorer.createDefaultState();
  }

  const hanokCtx = {
    sceneTemplate,
    setupNavigationAndHelp,
    bindMissionCompleteBtn: (route, activityReady, msg, onFirstComplete) => {
      // 이번 세션에서 한옥 만들기를 끝냈을 때만 비교 단계로 넘어간다.
      // (심사용처럼 미션이 이미 완료된 계정에서 만들기 화면을 건너뛰지 않도록)
      if (
        activityReady
        && window.HanokExplorer
        && !state.hanokExplorer?.journalSaved
        && state.hanokExplorer?.phase === "building"
        && state.hanok?.complete
      ) {
        state.hanokExplorer.phase = "bridge";
        if (state.hanokTour) state.hanokTour.building = true;
        saveProgress();
        render();
        return;
      }
      bindMissionCompleteBtn(route, activityReady, msg, onFirstComplete);
    },
    getState: () => state,
    saveProgress,
    playSound,
    speakLine,
    isMissionRouteCompleted,
    startExploring: () => {
      if (state.hanokExplorer) state.hanokExplorer.phase = "exploring";
      if (state.hanokTour) state.hanokTour.building = false;
      saveProgress();
      render();
    },
    startBuilding: () => {
      if (state.hanokTour) state.hanokTour.building = true;
      if (state.hanokExplorer) state.hanokExplorer.phase = "building";
      saveProgress();
      render();
    },
    finishHanok: () => {
      saveProgress();
      render();
    },
    beginValueReflection: (route, opts) => beginValueReflection(route, opts)
  };

  if (window.HanokExplorer && ["reflect", "journal"].includes(state.hanokExplorer?.phase)
      && !state.hanokExplorer?.journalSaved
      && window.ValueReflectionFlow) {
    beginValueReflection("stage2_a2", { render: false, fromNext: true, force: true });
    renderValueReflectionFlow();
    return;
  }

  if (window.HanokExplorer && window.HanokExplorer.shouldHandle(state)) {
    window.HanokExplorer.render(app, hanokCtx);
    return;
  }

  if (window.HanokTour && state.hanokTour && !state.hanokTour.building) {
    window.HanokTour.render(app, hanokCtx);
    return;
  }

  startHanokBuilding(hanokCtx);
}

function startHanokBuilding(ctx) {
  if (state.hanokTour) state.hanokTour.building = true;
  if (state.hanokExplorer) state.hanokExplorer.phase = "building";
  if (window.HanokTour) window.HanokTour.stop();
  if (window.HanokExplorer) window.HanokExplorer.stop();
  if (!window.HanokGame) {
    app.innerHTML = sceneTemplate("STAGE 2-2 한옥 세우기", `
      <div class="section-card"><p class="sub">한옥 게임을 불러오지 못했어요. 새로고침해 주세요.</p></div>
    `);
    setupNavigationAndHelp("페이지를 새로고침해 주세요.");
    return;
  }
  window.HanokGame.render(app, ctx || {
    sceneTemplate,
    setupNavigationAndHelp,
    bindMissionCompleteBtn,
    getState: () => state,
    saveProgress,
    playSound,
    speakLine,
    isMissionRouteCompleted
  });
}

/** 단청 전통 물감 팔레트 10색 */
const DANCHEONG_PALETTE = [
  { id: "yangcheong", name: "청색", color: "#0066A3" },
  { id: "jangdan", name: "적색", color: "#E64C3C" },
  { id: "samcheong", name: "황색", color: "#F39C12" },
  { id: "jibun", name: "백색", color: "#F5F6FA" },
  { id: "meok", name: "흑색", color: "#2C3E50" },
  { id: "hayeop", name: "녹색", color: "#2E7D32" },
  { id: "seokgan", name: "진홍", color: "#8B261D" },
  { id: "noerok", name: "연청색", color: "#5BB383" },
  { id: "jajeok", name: "자색", color: "#6D214F" },
  { id: "dahwang", name: "홍색", color: "#F3A3B5" }
];

const DANCHEONG_PATTERNS = [
  { id: "coloring", name: "연꽃 단청", file: "dancheong_coloring_absolute_500.svg", autoZones: true },
  { id: "round", name: "기하 단청", file: "dancheong_round_pattern_absolute_500.svg" }
];

const DANCHEONG_EMPTY_FILL = "#f0ebe3";

function createDefaultDancheongState() {
  return {
    phase: "pick",
    currentPattern: null,
    selectedColor: DANCHEONG_PALETTE[0].color,
    completed: [],
    fills: {},
    previews: {},
    registered: false
  };
}

function dancheongAllColored(dc) {
  return Array.isArray(dc?.completed) && dc.completed.length >= DANCHEONG_PATTERNS.length;
}

function dancheongMissionReady(dc) {
  return dancheongAllColored(dc) && !!dc?.registered;
}

function dancheongMissionBtn(enabled) {
  bindMissionCompleteBtn(
    "stage2_a3",
    enabled,
    "단청 문양을 2개 색칠하고 우리반 전시회에 올리면 보물을 되찾을 수 있어요!"
  );
}

function captureDancheongPreview(svg) {
  if (!svg) return "";
  const clone = svg.cloneNode(true);
  clone.removeAttribute("style");
  clone.classList.remove("dancheong-svg");
  clone.setAttribute("width", "500");
  clone.setAttribute("height", "500");
  clone.querySelectorAll("[style]").forEach((el) => {
    if (el.style && el.style.cursor) el.style.cursor = "";
  });
  return clone.outerHTML;
}

function dancheongApplyFillsToSvgHtml(svgHtml, pattern, fills) {
  const wrap = document.createElement("div");
  wrap.innerHTML = svgHtml;
  const svg = wrap.querySelector("svg");
  if (!svg) return svgHtml;
  if (pattern.autoZones) prepareDancheongAutoZones(svg, pattern.id);
  else {
    svg.querySelectorAll(".dc-zone").forEach((el) => {
      if (isDancheongEmptyFill(el.getAttribute("fill"))) el.setAttribute("fill", DANCHEONG_EMPTY_FILL);
    });
  }
  Object.entries(fills || {}).forEach(([zoneId, color]) => {
    const el = svg.querySelector(`.dc-zone[data-zone="${zoneId}"]`);
    if (el && color) el.setAttribute("fill", color);
  });
  svg.setAttribute("width", "500");
  svg.setAttribute("height", "500");
  return svg.outerHTML;
}

function dancheongPreviewHtml(pattern, dc) {
  if (dc.previews?.[pattern.id]) return dc.previews[pattern.id];
  const inline = window.DANCHEONG_SVG_INLINE?.[pattern.id];
  if (!inline) return "";
  const fills = dc.fills?.[pattern.id];
  if (fills && Object.keys(fills).length) return dancheongApplyFillsToSvgHtml(inline, pattern, fills);
  return inline;
}

function dancheongArtistId() {
  const p = state.userProfile;
  const classKey = p?.classKey || p?.classCode || "local";
  const accountId = p?.accountId || state.code || "guest";
  return `${classKey}__${accountId}`;
}

function dancheongArtistName() {
  return (state.userProfile?.name || "").trim() || "나";
}

function dancheongClassKey() {
  return state.userProfile?.classKey || state.userProfile?.classCode || "local";
}

const DANCHEONG_GALLERY_KEY = "kculture_dancheong_gallery_v1";
let _dancheongGalleryUnsub = null;
let _dancheongGalleryCache = [];

function stopDancheongGallerySync() {
  if (_dancheongGalleryUnsub) {
    _dancheongGalleryUnsub();
    _dancheongGalleryUnsub = null;
  }
}

function loadDancheongGalleryLocal() {
  try {
    const raw = localStorage.getItem(DANCHEONG_GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveDancheongGalleryLocal(list) {
  try {
    localStorage.setItem(DANCHEONG_GALLERY_KEY, JSON.stringify(list));
  } catch (_) {}
}

function dancheongGalleryDb() {
  if (!window.KCultureFirebase?.isReady()) return null;
  try {
    const cfg = window.HANOK_FIREBASE_CONFIG;
    const app = window.firebase?.apps?.length ? window.firebase.app() : window.firebase.initializeApp(cfg);
    return window.firebase.firestore(app);
  } catch (_) {
    return null;
  }
}

function startDancheongGallerySync(onChange) {
  stopDancheongGallerySync();
  const classKey = dancheongClassKey();
  const db = dancheongGalleryDb();
  if (db) {
    try {
      _dancheongGalleryUnsub = db.collection("dancheong_gallery")
        .where("classKey", "==", classKey)
        .onSnapshot((snap) => {
          const list = [];
          snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
          _dancheongGalleryCache = list;
          saveDancheongGalleryLocal(list);
          onChange(list);
        }, () => {
          _dancheongGalleryCache = loadDancheongGalleryLocal().filter((x) => x.classKey === classKey);
          onChange(_dancheongGalleryCache);
        });
      return;
    } catch (_) {}
  }
  _dancheongGalleryCache = loadDancheongGalleryLocal().filter((x) => !x.classKey || x.classKey === classKey);
  onChange(_dancheongGalleryCache);
}

async function upsertDancheongGalleryWork(work) {
  const local = loadDancheongGalleryLocal();
  const idx = local.findIndex((x) => x.id === work.id);
  if (idx >= 0) local[idx] = work; else local.push(work);
  saveDancheongGalleryLocal(local);
  _dancheongGalleryCache = local;
  const db = dancheongGalleryDb();
  if (db) {
    try {
      await db.collection("dancheong_gallery").doc(work.id).set(work, { merge: true });
    } catch (err) {
      console.warn("[단청 전시회] 서버 저장 실패 — 이 기기에는 저장되었어요.", err);
    }
  }
  return work;
}

async function likeDancheongGalleryWork(work, myId) {
  const likedBy = work.likedBy || [];
  if (likedBy.includes(myId) || work.id === myId) return work;
  const updated = { ...work, likes: (work.likes || 0) + 1, likedBy: likedBy.concat([myId]) };
  await upsertDancheongGalleryWork(updated);
  return updated;
}

function dancheongBrushSvgMarkup(color) {
  const paint = color || DANCHEONG_PALETTE[0].color;
  const light = paint.toLowerCase() === "#f5f6fa" || paint.toLowerCase() === "#ffffff";
  const bristleStroke = light ? "#555" : "#1a1a1a";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M3 12 L3 3 L18 3 C22 3 24 7 22 11 L12 17 L3 14 Z" fill="${paint}" stroke="${bristleStroke}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M12 17 L22 11 L24 15 L14 21 Z" fill="#a0a0a0" stroke="#555" stroke-width="1"/>
    <path d="M14 21 L24 15 L29 28 L19 30 Z" fill="#c8954a" stroke="#5c3d1e" stroke-width="1.3" stroke-linejoin="round"/>
  </svg>`;
}

function dancheongBrushCursor(color) {
  return `url("data:image/svg+xml,${encodeURIComponent(dancheongBrushSvgMarkup(color))}") 4 4, auto`;
}

function removeDancheongBrushPointer() {
  const el = document.getElementById("dcBrushPointer");
  if (el) el.remove();
}

function ensureDancheongBrushPointer() {
  let el = document.getElementById("dcBrushPointer");
  if (!el) {
    el = document.createElement("div");
    el.id = "dcBrushPointer";
    el.className = "dancheong-brush-pointer";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

function applyDancheongBrushCursor(color) {
  const cur = dancheongBrushCursor(color);
  const wrap = document.getElementById("dcCanvas");
  if (wrap) {
    wrap.style.cursor = cur;
    wrap.querySelectorAll(".dc-zone").forEach((zone) => { zone.style.cursor = cur; });
  }
  const pointer = ensureDancheongBrushPointer();
  pointer.innerHTML = dancheongBrushSvgMarkup(color);
}

function bindDancheongBrushPointer(wrap) {
  if (!wrap) return;
  const pointer = ensureDancheongBrushPointer();
  let hideTimer = 0;
  const shouldFloat = (e) => e.pointerType !== "mouse" || document.documentElement.classList.contains("is-tablet");
  const hide = () => pointer.classList.remove("is-on");
  const move = (e) => {
    if (!shouldFloat(e)) {
      hide();
      return;
    }
    clearTimeout(hideTimer);
    pointer.classList.add("is-on");
    pointer.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 8}px, 0)`;
  };
  wrap.addEventListener("pointerdown", move);
  wrap.addEventListener("pointermove", move);
  wrap.addEventListener("pointerup", () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 280);
  });
  wrap.addEventListener("pointercancel", hide);
  wrap.addEventListener("pointerleave", hide);
}

function dancheongThumbSrc(pattern) {
  const inline = window.DANCHEONG_SVG_INLINE?.[pattern.id];
  if (inline) return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inline)}`;
  return DANCHEONG_IMG(pattern.file);
}

function loadDancheongSvgText(url, patternId) {
  const inline = window.DANCHEONG_SVG_INLINE?.[patternId];
  if (inline) return Promise.resolve(inline);
  return new Promise((resolve, reject) => {
    fetch(url).then((r) => {
      if (r.ok) return r.text();
      throw new Error("fetch failed");
    }).then(resolve).catch(() => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = () => (xhr.status === 200 || xhr.status === 0 ? resolve(xhr.responseText) : reject());
      xhr.onerror = reject;
      xhr.send();
    });
  });
}

function isDancheongEmptyFill(fill) {
  const f = (fill || "").toLowerCase().trim();
  return !f || f === "none" || f === "#ffffff" || f === "#fff" || f === "white" || f === DANCHEONG_EMPTY_FILL;
}

function prepareDancheongAutoZones(svg, patternId) {
  let i = 0;
  svg.querySelectorAll("path, circle, rect, ellipse, polygon").forEach((el) => {
    if (el.classList.contains("dc-zone") && el.dataset.zone) return;
    const fill = (el.getAttribute("fill") || "").toLowerCase().trim();
    // 선만 있는 장식(fill="none")·배경은 색칠 칸에서 제외. 태블릿에서 3px 선을 못 눌러 완료가 안 되던 원인.
    if (!fill || fill === "none") return;
    if (!isDancheongEmptyFill(fill)) return;
    if (el.tagName === "rect" && el.getAttribute("width") === "500" && el.getAttribute("height") === "500") return;
    el.classList.add("dc-zone");
    el.dataset.zone = `${patternId}-${i++}`;
    el.setAttribute("fill", DANCHEONG_EMPTY_FILL);
  });
}

function syncDancheongCanvasToPalette() {
  const wrap = document.getElementById("dcCanvas");
  const palette = document.getElementById("dcPalette");
  if (!wrap || !palette) return;
  const h = Math.round(palette.getBoundingClientRect().height);
  if (h < 80) return;
  wrap.style.width = `${h}px`;
  wrap.style.height = `${h}px`;
}

function bindDancheongCanvasFit() {
  syncDancheongCanvasToPalette();
  if (window._dancheongCanvasRO) window._dancheongCanvasRO.disconnect();
  const palette = document.getElementById("dcPalette");
  if (!palette || typeof ResizeObserver === "undefined") return;
  window._dancheongCanvasRO = new ResizeObserver(() => syncDancheongCanvasToPalette());
  window._dancheongCanvasRO.observe(palette);
}

function bindDancheongZones(svg, pattern, patternFills, dc, statusEl, onComplete) {
  svg.classList.add("dancheong-svg");
  if (pattern.autoZones) prepareDancheongAutoZones(svg, pattern.id);
  else {
    svg.querySelectorAll(".dc-zone").forEach((el) => {
      if (isDancheongEmptyFill(el.getAttribute("fill"))) el.setAttribute("fill", DANCHEONG_EMPTY_FILL);
    });
  }

  function checkComplete() {
    const zones = svg.querySelectorAll(".dc-zone");
    return zones.length > 0 && [...zones].every((z) => {
      const id = z.dataset.zone;
      return patternFills[id] && !isDancheongEmptyFill(patternFills[id]);
    });
  }

  let finishing = false;
  function paintZone(zone) {
    if (!zone || finishing) return;
    const zoneId = zone.dataset.zone;
    if (!zoneId) return;
    if (!dc.selectedColor) {
      statusEl.textContent = "먼저 물감 팔레트에서 색을 골라주세요!";
      return;
    }
    zone.setAttribute("fill", dc.selectedColor);
    patternFills[zoneId] = dc.selectedColor;
    dc.fills[pattern.id] = patternFills;
    playSound("snap.mp3");
    statusEl.textContent = "";
    if (checkComplete()) {
      finishing = true;
      onComplete();
    }
  }

  function zoneFromPoint(clientX, clientY) {
    if (clientX == null || clientY == null) return null;
    const stack = typeof document.elementsFromPoint === "function"
      ? (document.elementsFromPoint(clientX, clientY) || [])
      : [];
    const hit = stack.find((el) => el.classList && el.classList.contains("dc-zone") && svg.contains(el));
    if (hit) return hit;
    if (typeof svg.createSVGPoint !== "function" || !svg.getScreenCTM) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const local = pt.matrixTransform(ctm.inverse());
    const zones = svg.querySelectorAll(".dc-zone");
    for (let i = zones.length - 1; i >= 0; i--) {
      const zone = zones[i];
      try {
        if (typeof zone.isPointInFill === "function" && zone.isPointInFill(local)) return zone;
      } catch (_) {}
    }
    return null;
  }

  function zoneFromEvent(e) {
    const raw = e.target;
    if (raw && raw.classList && raw.classList.contains("dc-zone") && svg.contains(raw)) return raw;
    if (raw && typeof raw.closest === "function") {
      const closest = raw.closest(".dc-zone");
      if (closest && svg.contains(closest)) return closest;
    }
    return zoneFromPoint(e.clientX, e.clientY);
  }

  svg.querySelectorAll(".dc-zone").forEach((zone) => {
    const zoneId = zone.dataset.zone;
    if (patternFills[zoneId]) {
      zone.setAttribute("fill", patternFills[zoneId]);
    }
    zone.style.pointerEvents = "visibleFill";
    zone.style.cursor = "pointer";
  });

  let lastPaintAt = 0;
  let lastZoneId = "";
  const onPaint = (e) => {
    if (e.pointerType === "mouse" && e.button != null && e.button !== 0) return;
    const zone = zoneFromEvent(e);
    if (!zone) return;
    const zoneId = zone.dataset.zone || "";
    const now = Date.now();
    if (zoneId && zoneId === lastZoneId && now - lastPaintAt < 160) return;
    lastPaintAt = now;
    lastZoneId = zoneId;
    if (e.cancelable) e.preventDefault();
    paintZone(zone);
  };
  const wrap = document.getElementById("dcCanvas") || svg;
  wrap.addEventListener("pointerdown", onPaint);
  wrap.addEventListener("click", onPaint);
  applyDancheongBrushCursor(dc.selectedColor);
  bindDancheongBrushPointer(wrap);
}

function renderDancheongShare(dc) {
  // 색칠·등록 여부와 상관없이 「다음」으로 이 화면을 지나갈 수 있다.
  // (심사·체험처럼 활동을 다 안 해도 수호책 질문으로 이어지게)
  const ready = dancheongAllColored(dc);
  const arts = ready
    ? DANCHEONG_PATTERNS.map((p) => {
      const art = dancheongPreviewHtml(p, dc);
      return `<div class="dancheong-share-card">
      <div class="dancheong-pick-art">${art || `<img src="${dancheongThumbSrc(p)}" alt="${p.name}" />`}</div>
      <span class="dancheong-pick-label">${p.name}</span>
    </div>`;
    }).join("")
    : `<p class="dancheong-bubble-text" style="text-align:center;margin:12px 0 4px;">아직 단청을 다 색칠하지 않았어요. 「다음」을 누르면 생각 친구 질문으로 갈 수 있어요.</p>`;
  app.innerHTML = sceneTemplate("우리반 단청 전시회", `
    <div class="section-card dancheong-game dancheong-game--share">
      <div class="dancheong-talk">
        <img class="dancheong-talk-char" src="${CHAR_IMG("suho.png")}" alt="수호" draggable="false" />
        <div class="dancheong-bubble">
          <p class="dancheong-bubble-text">${ready
            ? "색칠한 단청을 우리반 전시회에 올리면, 친구들이 만든 단청도 함께 구경할 수 있어!"
            : "단청 색칠은 나중에 해도 괜찮아. 「다음」을 누르면 생각 친구와 이야기해 보자!"}</p>
        </div>
      </div>
      <div class="dancheong-share-preview">${arts}</div>
      ${ready ? `<button type="button" class="btn primary" id="dcRegisterBtn">전시회에 올리기</button>` : ""}
      <button type="button" class="btn" id="dcShareBack">◀ 문양 고르기로</button>
    </div>
  `);
  setupNavigationAndHelp(ready
    ? "내가 색칠한 단청을 우리반 전시회에 올려 친구들과 구경해보자!"
    : "「다음」을 누르면 생각 친구 질문으로 이어져요.");
  dancheongMissionBtn(dancheongMissionReady(dc));
  document.getElementById("dcShareBack").onclick = () => {
    dc.phase = "pick";
    playSound("click.mp3");
    renderStage2Act3();
  };
  if (!ready) {
    relocateScreenButtonsToGlobalNav();
    setupActivityControls();
    return;
  }
  document.getElementById("dcRegisterBtn").onclick = async () => {
    const btn = document.getElementById("dcRegisterBtn");
    btn.disabled = true;
    btn.textContent = "올리는 중...";
    const existing = _dancheongGalleryCache.find((x) => x.id === dancheongArtistId());
    const work = {
      id: dancheongArtistId(),
      classKey: dancheongClassKey(),
      name: dancheongArtistName(),
      fills: dc.fills,
      previews: dc.previews,
      likes: existing ? existing.likes || 0 : 0,
      likedBy: existing ? existing.likedBy || [] : [],
      updatedAt: new Date().toISOString()
    };
    await upsertDancheongGalleryWork(work);
    dc.registered = true;
    playSound("correct.mp3");
    Swal.fire("올렸어요!", "우리반 단청 전시회에서 친구들 작품도 구경해 보세요!", "success").then(() => {
      dc.phase = "gallery";
      renderStage2Act3();
    });
  };
  setupActivityControls();
}

function dancheongWorkArtHtml(work, pattern) {
  if (work?.previews?.[pattern.id]) return work.previews[pattern.id];
  const inline = window.DANCHEONG_SVG_INLINE?.[pattern.id];
  if (inline && work?.fills?.[pattern.id]) return dancheongApplyFillsToSvgHtml(inline, pattern, work.fills[pattern.id]);
  if (inline) return inline;
  return "";
}

function renderDancheongGallery(dc) {
  // 전시회 등록 여부와 상관없이 마지막 단계로 머물 수 있게 한다.
  // 등록 전이면 빈 전시회를 보여주고, 「다음」에서 수호책 질문이 열린다.
  const myId = dancheongArtistId();
  const canBrowse = dancheongAllColored(dc) && !!dc.registered;
  app.innerHTML = sceneTemplate("우리반 단청 전시회", `
    <div class="section-card dancheong-game dancheong-game--gallery">
      <div class="dancheong-talk">
        <img class="dancheong-talk-char" src="${CHAR_IMG("suho.png")}" alt="수호" draggable="false" />
        <div class="dancheong-bubble">
          <p class="dancheong-bubble-text">${canBrowse
            ? "친구들이 색칠한 단청을 눌러 구경하고, 마음에 들면 하트를 눌러 응원해 줘!"
            : "전시회는 단청을 색칠하고 올린 뒤에 구경할 수 있어요. 「다음」을 누르면 생각 친구 질문으로 가요!"}</p>
        </div>
      </div>
      <p class="dancheong-gallery-status" id="dcGalleryStatus">${canBrowse ? "전시회를 불러오는 중..." : "아직 올린 단청이 없어요. 「다음」으로 질문을 이어 보세요."}</p>
      <div class="dancheong-gallery-grid" id="dcGalleryGrid"></div>
      <div class="dancheong-gallery-detail hidden" id="dcGalleryDetail"></div>
      <div class="dancheong-gallery-actions">
        <button type="button" class="btn" id="dcGalleryBack">◀ 내 단청으로</button>
      </div>
    </div>
  `);
  setupNavigationAndHelp(canBrowse
    ? "우리반 친구들이 색칠한 단청을 구경해보자!"
    : "「다음」을 누르면 생각 친구 질문으로 이어져요.");
  dancheongMissionBtn(dancheongMissionReady(dc));
  document.getElementById("dcGalleryBack").onclick = () => {
    stopDancheongGallerySync();
    dc.phase = "pick";
    playSound("click.mp3");
    renderStage2Act3();
  };
  if (!canBrowse) {
    relocateScreenButtonsToGlobalNav();
    setupActivityControls();
    return;
  }

  function drawGallery(list) {
    const status = document.getElementById("dcGalleryStatus");
    const grid = document.getElementById("dcGalleryGrid");
    if (!status || !grid) return;
    const works = [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0) || String(a.name).localeCompare(String(b.name), "ko"));
    status.textContent = works.length
      ? `우리반 단청 ${works.length}점`
      : "아직 올라온 단청이 없어요. 내가 먼저 올려 보자!";
    grid.innerHTML = works.map((work) => {
      const thumbs = DANCHEONG_PATTERNS.map((p) =>
        `<div class="dancheong-gallery-thumb">${dancheongWorkArtHtml(work, p)}</div>`
      ).join("");
      const mine = work.id === myId ? " mine" : "";
      return `<button type="button" class="dancheong-gallery-card${mine}" data-id="${work.id}">
        <div class="dancheong-gallery-thumbs">${thumbs}</div>
        <span class="dancheong-gallery-name">${String(work.name || "친구").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))}</span>
        <span class="dancheong-gallery-likes">❤️ ${work.likes || 0}</span>
      </button>`;
    }).join("");
    grid.querySelectorAll(".dancheong-gallery-card").forEach((btn) => {
      btn.onclick = () => showDancheongGalleryDetail(btn.dataset.id, myId);
    });
  }

  startDancheongGallerySync(drawGallery);
  setupActivityControls();
}

function showDancheongGalleryDetail(workId, myId) {
  const work = _dancheongGalleryCache.find((x) => x.id === workId);
  const box = document.getElementById("dcGalleryDetail");
  if (!work || !box) return;
  const name = String(work.name || "친구").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arts = DANCHEONG_PATTERNS.map((p) =>
    `<div class="dancheong-share-card">
      <div class="dancheong-pick-art">${dancheongWorkArtHtml(work, p)}</div>
      <span class="dancheong-pick-label">${p.name}</span>
    </div>`
  ).join("");
  const liked = (work.likedBy || []).includes(myId);
  const canLike = work.id !== myId && !liked;
  box.classList.remove("hidden");
  box.innerHTML = `
    <h3>${name}의 단청</h3>
    <div class="dancheong-share-preview">${arts}</div>
    <p>❤️ ${work.likes || 0}</p>
    ${canLike ? `<button type="button" class="btn primary" id="dcLikeBtn">하트 보내기</button>` : `<p class="sub">${work.id === myId ? "내가 올린 작품이에요." : "이미 응원했어요!"}</p>`}
  `;
  const likeBtn = document.getElementById("dcLikeBtn");
  if (likeBtn) {
    likeBtn.onclick = async () => {
      likeBtn.disabled = true;
      const updated = await likeDancheongGalleryWork(work, myId);
      const idx = _dancheongGalleryCache.findIndex((x) => x.id === work.id);
      if (idx >= 0) _dancheongGalleryCache[idx] = updated;
      playSound("snap.mp3");
      showDancheongGalleryDetail(workId, myId);
    };
  }
}

function renderStage2Act3() {
  removeDancheongBrushPointer();
  if (!state.dancheong) state.dancheong = createDefaultDancheongState();
  const dc = state.dancheong;
  if (!dc.fills || typeof dc.fills !== "object") dc.fills = {};
  if (!dc.previews || typeof dc.previews !== "object") dc.previews = {};
  if (!Array.isArray(dc.completed)) dc.completed = [];

  if (dc.phase === "gallery") return renderDancheongGallery(dc);
  if (dc.phase === "share") return renderDancheongShare(dc);

  if (dc.phase === "pick") {
    const allDone = dc.completed.length >= DANCHEONG_PATTERNS.length;
    const talk = allDone
      ? "와, 두 문양을 모두 색칠했구나! 이제 우리반 친구들 작품도 모아볼까?"
      : "단청은 궁궐이나 절의 나무 건물에 오방색으로 그림을 그려서, 나무를 보호하고 예쁘게 꾸미는 우리 전통 그림이야. 마음에 드는 문양을 골라 색칠해보자!";
    app.innerHTML = sceneTemplate("STAGE 2-3 단청 색칠하기", `
      <div class="section-card dancheong-game dancheong-game--pick">
        <div class="dancheong-talk">
          <img class="dancheong-talk-char" src="${CHAR_IMG("suho.png")}" alt="수호" draggable="false" />
          <div class="dancheong-bubble">
            <p class="dancheong-bubble-text">${talk}</p>
          </div>
        </div>
        <div class="dancheong-picker">
          ${DANCHEONG_PATTERNS.map((p) => {
            const done = dc.completed.includes(p.id);
            const art = dancheongPreviewHtml(p, dc);
            return `
              <button type="button" class="dancheong-pick-card${done ? " done" : ""}" data-id="${p.id}">
                <div class="dancheong-pick-art">${art || `<img src="${dancheongThumbSrc(p)}" alt="${p.name}" draggable="false" />`}</div>
                <span class="dancheong-pick-label">${p.name}</span>
                ${done ? '<span class="dancheong-pick-badge">완료 ✓</span>' : ""}
              </button>`;
          }).join("")}
        </div>
        ${allDone ? `<button type="button" class="btn primary dancheong-gallery-enter" id="dcEnterShare">우리반 단청 모아보기</button>` : ""}
      </div>
    `);
    setupNavigationAndHelp("단청에 쓰이는 전통 문양을 골라 예쁘게 색칠해보자!");
    dancheongMissionBtn(dancheongMissionReady(dc));
    if (!allDone) speakLine(talk, "voice_default.mp3");

    document.querySelectorAll(".dancheong-pick-card").forEach((card) => {
      card.onclick = () => {
        dc.currentPattern = card.dataset.id;
        dc.phase = "color";
        if (!dc.fills[dc.currentPattern]) dc.fills[dc.currentPattern] = {};
        playSound("click.mp3");
        renderStage2Act3();
      };
    });
    const enterBtn = document.getElementById("dcEnterShare");
    if (enterBtn) {
      enterBtn.onclick = () => {
        playSound("click.mp3");
        dc.phase = dc.registered ? "gallery" : "share";
        renderStage2Act3();
      };
    }
    setupActivityControls();
    return;
  }

  const pattern = DANCHEONG_PATTERNS.find((p) => p.id === dc.currentPattern);
  if (!pattern) { dc.phase = "pick"; return renderStage2Act3(); }

  app.innerHTML = sceneTemplate("STAGE 2-3 단청 색칠하기", `
    <div class="section-card dancheong-game dancheong-game--color">
      <div class="dancheong-color-head">
        <button type="button" class="btn sm" id="dcBackPick">◀ 문양 고르기</button>
        <span class="dancheong-pattern-name">${pattern.name}</span>
        <span class="dancheong-progress">완료 ${dc.completed.length} / 2</span>
      </div>
      <p class="dancheong-hint">물감을 고른 뒤, 문양 칸을 눌러 색칠하세요!</p>
      <div class="dancheong-workspace">
        <div class="dancheong-canvas-wrap" id="dcCanvas"></div>
        <div class="dancheong-palette" id="dcPalette">
          <p class="dancheong-palette-title">🎨 물감 팔레트</p>
          ${DANCHEONG_PALETTE.map((c) => `
            <button type="button" class="dancheong-swatch${dc.selectedColor === c.color ? " sel" : ""}"
              data-color="${c.color}" title="${c.name}" aria-label="${c.name}">
              <span class="dancheong-swatch-color" style="background:${c.color}"></span>
              <span class="dancheong-swatch-name">${c.name}</span>
            </button>`).join("")}
        </div>
      </div>
      <p class="dancheong-status" id="dcStatus"></p>
    </div>
  `);
  setupNavigationAndHelp("전통 단청 물감으로 문양을 예쁘게 색칠해보자!");
  dancheongMissionBtn(dancheongMissionReady(dc));

  document.getElementById("dcBackPick").onclick = () => {
    dc.phase = "pick";
    playSound("click.mp3");
    renderStage2Act3();
  };

  document.querySelectorAll(".dancheong-swatch").forEach((sw) => {
    sw.onclick = () => {
      dc.selectedColor = sw.dataset.color;
      playSound("click.mp3");
      document.querySelectorAll(".dancheong-swatch").forEach((s) => s.classList.toggle("sel", s.dataset.color === dc.selectedColor));
      applyDancheongBrushCursor(dc.selectedColor);
    };
  });

  setupActivityControls();
  bindDancheongCanvasFit();

  const canvas = document.getElementById("dcCanvas");
  const statusEl = document.getElementById("dcStatus");
  const patternFills = dc.fills[pattern.id] || {};

  function onPatternComplete() {
    if (dc.completed.includes(pattern.id)) return;
    dc.completed.push(pattern.id);
    const svg = canvas.querySelector("svg");
    const preview = captureDancheongPreview(svg);
    if (preview) dc.previews[pattern.id] = preview;
    playSound("correct.mp3");
    statusEl.textContent = `${pattern.name} 색칠 완료! 🎉`;
    if (dc.completed.length >= DANCHEONG_PATTERNS.length) {
      Swal.fire("대단해요!", "두 문양을 모두 색칠했어요! 우리반 친구들 단청도 모아볼까요?", "success").then(() => {
        dc.phase = "share";
        renderStage2Act3();
      });
    } else {
      Swal.fire("잘했어요!", "다른 문양도 색칠해보세요!", "success").then(() => {
        dc.phase = "pick";
        renderStage2Act3();
      });
    }
  }

  loadDancheongSvgText(DANCHEONG_IMG(pattern.file), pattern.id)
    .then((svgText) => {
      canvas.innerHTML = svgText;
      const svg = canvas.querySelector("svg");
      if (!svg) return;
      bindDancheongZones(svg, pattern, patternFills, dc, statusEl, onPatternComplete);
      bindDancheongCanvasFit();
      if (dc.completed.includes(pattern.id)) {
        statusEl.textContent = "이 문양은 이미 완료했어요. 다시 색칠해도 괜찮아요!";
      }
    })
    .catch(() => {
      canvas.innerHTML = `<p class="sub">문양을 불러오지 못했어요.</p>`;
    });
}

function renderStage3Menu() {
  renderStageActivityMenu(3);
}

const HANBOK_CLOTHES = [
  { id: "girl-ayam", doll: "girl", slot: "head", name: "아얌", icon: "girl-icon-ayam.png", layer: "girl-layer-ayam.png" },
  { id: "girl-baeja", doll: "girl", slot: "outer", name: "배자", icon: "girl-icon-baeja.png", layer: "girl-layer-baeja.png" },
  { id: "girl-jeogori1", doll: "girl", slot: "top", name: "저고리", icon: "girl-icon-jeogori1.png", layer: "girl-layer-jeogori1.png" },
  { id: "girl-jeogori2", doll: "girl", slot: "top", name: "저고리", icon: "girl-icon-jeogori2.png", layer: "girl-layer-jeogori2.png" },
  { id: "girl-jeogori3", doll: "girl", slot: "top", name: "저고리", icon: "girl-icon-jeogori3.png", layer: "girl-layer-jeogori3.png" },
  { id: "girl-chima1", doll: "girl", slot: "bottom", name: "치마", icon: "girl-icon-chima1.png", layer: "girl-layer-chima1.png" },
  { id: "girl-chima2", doll: "girl", slot: "bottom", name: "치마", icon: "girl-icon-chima2.png", layer: "girl-layer-chima2.png" },
  { id: "girl-chima3", doll: "girl", slot: "bottom", name: "치마", icon: "girl-icon-chima3.png", layer: "girl-layer-chima3.png" },
  { id: "girl-daengi", doll: "girl", slot: "hair", name: "댕기", icon: "girl-icon-daengi.png", layer: "girl-layer-daengi.png" },
  { id: "girl-shoe1", doll: "girl", slot: "shoe", name: "당혜", icon: "girl-icon-shoe1.png", layer: "girl-layer-shoe1.png" },
  { id: "girl-shoe2", doll: "girl", slot: "shoe", name: "당혜", icon: "girl-icon-shoe2.png", layer: "girl-layer-shoe2.png" },
  { id: "girl-norigae1", doll: "girl", slot: "acc", name: "노리개", icon: "girl-icon-norigae1.png", layer: "girl-icon-norigae1.png", useIconAsLayer: true },
  { id: "girl-norigae2", doll: "girl", slot: "acc", name: "노리개", icon: "girl-icon-norigae2.png", layer: "girl-icon-norigae2.png", useIconAsLayer: true },
  { id: "boy-gat", doll: "boy", slot: "head", name: "갓", icon: "boy-icon-gat.png", layer: "boy-layer-gat.png" },
  { id: "boy-baeja", doll: "boy", slot: "outer", name: "배자", icon: "boy-icon-baeja.png", layer: "boy-layer-baeja.png" },
  { id: "boy-jeogori1", doll: "boy", slot: "top", name: "저고리", icon: "boy-icon-jeogori1.png", layer: "boy-layer-jeogori1.png" },
  { id: "boy-jeogori2", doll: "boy", slot: "top", name: "저고리", icon: "boy-icon-jeogori2.png", layer: "boy-layer-jeogori2.png" },
  { id: "boy-jeogori3", doll: "boy", slot: "top", name: "저고리", icon: "boy-icon-jeogori3.png", layer: "boy-layer-jeogori3.png" },
  { id: "boy-baji1", doll: "boy", slot: "bottom", name: "바지", icon: "boy-icon-baji1.png", layer: "boy-layer-baji1.png" },
  { id: "boy-baji2", doll: "boy", slot: "bottom", name: "바지", icon: "boy-icon-baji2.png", layer: "boy-layer-baji2.png" },
  { id: "boy-baji3", doll: "boy", slot: "bottom", name: "바지", icon: "boy-icon-baji3.png", layer: "boy-layer-baji3.png" },
  { id: "boy-shoe", doll: "boy", slot: "shoe", name: "당혜", icon: "boy-icon-shoe.png", layer: "boy-layer-shoe.png" }
];

const GIRL_HANBOK_GROUPS = [
  ["girl-ayam"],
  ["girl-baeja"],
  ["girl-jeogori1", "girl-jeogori2", "girl-jeogori3"],
  ["girl-chima1", "girl-chima2", "girl-chima3"],
  ["girl-daengi"],
  ["girl-shoe1", "girl-shoe2"],
  ["girl-norigae1", "girl-norigae2"]
];

const HANBOK_REQUIRED_SLOTS = ["top", "bottom", "shoe"];

// 한복 레이어 위치·크기 보정 (doll-stage 기준)
// 기본값: { x: 0, y: 0, scale: 1 }
const HANBOK_LAYER_OFFSETS = {
  "girl-jeogori1": { x: -0.8, y: 5, scale: 1.05 },
  "girl-jeogori3": { x: 0, y: 8, scale: 1 },
  "girl-shoe1": { x: 1, y: 0, scale: 1 },
  "girl-shoe2": { x: 1, y: 0, scale: 1 },
  "girl-norigae1": { x: -22, y: -25, scale: 1.3 },
  "girl-norigae2": { x: -22, y: -25, scale: 1.3 },
  "boy-shoe": { x: 2, y: 0, scale: 1 },
  "boy-gat": { x: 3, y: -24, scale: 1.03 }
};

function getHanbokCloth(clothId) {
  return HANBOK_CLOTHES.find((c) => c.id === clothId);
}

function applyHanbokLayerOffset(layer, clothId) {
  const offset = HANBOK_LAYER_OFFSETS[clothId] || { x: 0, y: 0, scale: 1 };
  const { x = 0, y = 0, scale = 1 } = offset;
  if (x !== 0 || y !== 0 || scale !== 1) {
    layer.style.transformOrigin = "top center";
    layer.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  } else {
    layer.style.transform = "";
    layer.style.transformOrigin = "";
  }
  layer.style.left = "";
  layer.style.top = "";
}

function applyHanbokLayerStyle(layer, clothId) {
  const cloth = getHanbokCloth(clothId);
  layer.classList.remove("doll-layer--icon-acc");

  if (cloth?.useIconAsLayer) {
    layer.classList.add("doll-layer--icon-acc");
    const offset = HANBOK_LAYER_OFFSETS[clothId] || { x: 0, y: 0, scale: 1 };
    layer.style.setProperty("--icon-acc-x", `${offset.x}px`);
    layer.style.setProperty("--icon-acc-y", `${offset.y}px`);
    layer.style.setProperty("--icon-acc-scale", String(offset.scale ?? 1));
    layer.style.transform = "";
    layer.style.transformOrigin = "";
    layer.style.left = "";
    layer.style.top = "";
    layer.style.width = "";
    layer.style.height = "";
    return;
  }

  layer.style.removeProperty("--icon-acc-x");
  layer.style.removeProperty("--icon-acc-y");
  layer.style.removeProperty("--icon-acc-scale");
  applyHanbokLayerOffset(layer, clothId);
}

function clearHanbokLayerOffset(layer) {
  layer.classList.remove("doll-layer--icon-acc");
  layer.style.left = "";
  layer.style.top = "";
  layer.style.width = "";
  layer.style.height = "";
  layer.style.transform = "";
  layer.style.transformOrigin = "";
  layer.style.removeProperty("--icon-acc-x");
  layer.style.removeProperty("--icon-acc-y");
  layer.style.removeProperty("--icon-acc-scale");
}

function hanbokTrayItemHTML(c) {
  return `
    <div class="hanbok-cloth-item" draggable="true" tabindex="0"
      data-id="${c.id}" data-doll="${c.doll}" data-slot="${c.slot}"
      data-layer="${c.layer}" data-name="${c.name}"
      aria-label="${c.name}">
      <img src="${HANBOK_IMG(c.icon)}" alt="${c.name}" />
    </div>
  `;
}

function createDefaultHanbokState() {
  return {
    phase: "dress",
    outfits: { girl: {}, boy: {} },
    registered: false
  };
}

function ensureHanbokState() {
  if (!state.hanbok) state.hanbok = createDefaultHanbokState();
  const hb = state.hanbok;
  if (!hb.outfits || typeof hb.outfits !== "object") hb.outfits = { girl: {}, boy: {} };
  if (!hb.outfits.girl || typeof hb.outfits.girl !== "object") hb.outfits.girl = {};
  if (!hb.outfits.boy || typeof hb.outfits.boy !== "object") hb.outfits.boy = {};
  if (!hb.phase) hb.phase = "dress";
  return hb;
}

function hanbokDollReady(outfit) {
  return HANBOK_REQUIRED_SLOTS.every((slot) => !!outfit?.[slot]);
}

function hanbokOutfitsComplete(outfits) {
  return hanbokDollReady(outfits?.girl) && hanbokDollReady(outfits?.boy);
}

function hanbokMissionReady(hb) {
  return hanbokOutfitsComplete(hb?.outfits) && !!hb?.registered;
}

function hanbokMissionBtn(enabled) {
  bindMissionCompleteBtn(
    "stage3_a1",
    enabled,
    "남녀 한복에 저고리·하의·신발을 입히고 우리반 패션쇼에 올리면 보물을 되찾을 수 있어요!"
  );
}

function hanbokLayerInlineStyle(cloth) {
  if (!cloth) return "";
  const offset = HANBOK_LAYER_OFFSETS[cloth.id] || { x: 0, y: 0, scale: 1 };
  if (cloth.useIconAsLayer) {
    return `--icon-acc-x:${offset.x}px;--icon-acc-y:${offset.y}px;--icon-acc-scale:${offset.scale ?? 1}`;
  }
  const { x = 0, y = 0, scale = 1 } = offset;
  if (x !== 0 || y !== 0 || scale !== 1) {
    return `transform-origin:top center;transform:translate(${x}px,${y}px) scale(${scale})`;
  }
  return "";
}

function hanbokDollPreviewHTML(doll, outfits) {
  const slots = doll === "girl"
    ? ["bottom", "shoe", "top", "outer", "head", "hair", "acc"]
    : ["bottom", "shoe", "top", "outer", "head"];
  const label = doll === "girl" ? "여아" : "남아";
  const base = doll === "girl" ? "base-girl.png" : "base-boy.png";
  const layers = slots.map((slot) => {
    const clothId = outfits?.[doll]?.[slot];
    const cloth = clothId ? getHanbokCloth(clothId) : null;
    if (!cloth) return `<img class="doll-layer" data-slot="${slot}" alt="" hidden />`;
    const src = HANBOK_IMG(cloth.useIconAsLayer ? cloth.icon : cloth.layer);
    const accClass = cloth.useIconAsLayer ? " doll-layer--icon-acc" : "";
    const style = hanbokLayerInlineStyle(cloth);
    return `<img class="doll-layer${accClass}" data-slot="${slot}" src="${src}" alt="${cloth.name}" style="${style}" />`;
  }).join("");
  return `
    <div class="doll-wrap hanbok-preview-doll" data-doll="${doll}">
      <p class="doll-label">${label}</p>
      <div class="doll-stage hanbok-preview-stage">
        <img class="doll-base" src="${HANBOK_IMG(base)}" alt="${label}" />
        ${layers}
      </div>
    </div>
  `;
}

function hanbokPairPreviewHTML(outfits) {
  return `<div class="hanbok-share-preview">
    ${hanbokDollPreviewHTML("girl", outfits)}
    ${hanbokDollPreviewHTML("boy", outfits)}
  </div>`;
}

function escapeGalleryName(name) {
  return String(name || "친구").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

const HANBOK_GALLERY_KEY = "kculture_hanbok_gallery_v1";
let _hanbokGalleryUnsub = null;
let _hanbokGalleryCache = [];

function stopHanbokGallerySync() {
  if (_hanbokGalleryUnsub) {
    _hanbokGalleryUnsub();
    _hanbokGalleryUnsub = null;
  }
}

function loadHanbokGalleryLocal() {
  try {
    const raw = localStorage.getItem(HANBOK_GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveHanbokGalleryLocal(list) {
  try {
    localStorage.setItem(HANBOK_GALLERY_KEY, JSON.stringify(list));
  } catch (_) {}
}

function hanbokGalleryDb() {
  return dancheongGalleryDb();
}

function startHanbokGallerySync(onChange) {
  stopHanbokGallerySync();
  const classKey = dancheongClassKey();
  const db = hanbokGalleryDb();
  if (db) {
    try {
      _hanbokGalleryUnsub = db.collection("hanbok_gallery")
        .where("classKey", "==", classKey)
        .onSnapshot((snap) => {
          const list = [];
          snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
          _hanbokGalleryCache = list;
          saveHanbokGalleryLocal(list);
          onChange(list);
        }, () => {
          _hanbokGalleryCache = loadHanbokGalleryLocal().filter((x) => x.classKey === classKey);
          onChange(_hanbokGalleryCache);
        });
      return;
    } catch (_) {}
  }
  _hanbokGalleryCache = loadHanbokGalleryLocal().filter((x) => !x.classKey || x.classKey === classKey);
  onChange(_hanbokGalleryCache);
}

async function upsertHanbokGalleryWork(work) {
  const local = loadHanbokGalleryLocal();
  const idx = local.findIndex((x) => x.id === work.id);
  if (idx >= 0) local[idx] = work; else local.push(work);
  saveHanbokGalleryLocal(local);
  _hanbokGalleryCache = local;
  const db = hanbokGalleryDb();
  if (db) {
    try {
      await db.collection("hanbok_gallery").doc(work.id).set(work, { merge: true });
    } catch (err) {
      console.warn("[한복 패션쇼] 서버 저장 실패 — 이 기기에는 저장되었어요.", err);
    }
  }
  return work;
}

async function likeHanbokGalleryWork(work, myId) {
  const likedBy = work.likedBy || [];
  if (likedBy.includes(myId) || work.id === myId) return work;
  const updated = { ...work, likes: (work.likes || 0) + 1, likedBy: likedBy.concat([myId]) };
  await upsertHanbokGalleryWork(updated);
  return updated;
}

function renderHanbokShare(hb) {
  if (!hanbokOutfitsComplete(hb.outfits)) {
    hb.phase = "dress";
    return renderHanbokDress(hb);
  }
  app.innerHTML = sceneTemplate("우리반 한복 패션쇼", `
    <div class="section-card dancheong-game dancheong-game--share hanbok-fashion">
      <div class="dancheong-talk">
        <img class="dancheong-talk-char" src="${CHAR_IMG("suho.png")}" alt="수호" draggable="false" />
        <div class="dancheong-bubble">
          <p class="dancheong-bubble-text">남녀 한복을 모두 입혔구나! 우리반 패션쇼에 올리면 친구들 한복도 함께 구경할 수 있어!</p>
        </div>
      </div>
      ${hanbokPairPreviewHTML(hb.outfits)}
      <button type="button" class="btn primary" id="hbRegisterBtn">패션쇼에 올리기</button>
      ${hb.registered ? `<button type="button" class="btn" id="hbShareGallery">패션쇼 구경하기</button>` : ""}
      <button type="button" class="btn" id="hbShareBack">◀ 다시 입히기</button>
    </div>
  `);
  setupNavigationAndHelp("내가 입힌 한복을 우리반 패션쇼에 올려 친구들과 구경해보자!");
  hanbokMissionBtn(hanbokMissionReady(hb));
  document.getElementById("hbShareBack").onclick = () => {
    hb.phase = "dress";
    playSound("click.mp3");
    renderStage3Act1();
  };
  const galleryBtn = document.getElementById("hbShareGallery");
  if (galleryBtn) {
    galleryBtn.onclick = () => {
      hb.phase = "gallery";
      playSound("click.mp3");
      renderStage3Act1();
    };
  }
  document.getElementById("hbRegisterBtn").onclick = async () => {
    const btn = document.getElementById("hbRegisterBtn");
    btn.disabled = true;
    btn.textContent = "올리는 중...";
    const existing = _hanbokGalleryCache.find((x) => x.id === dancheongArtistId());
    const work = {
      id: dancheongArtistId(),
      classKey: dancheongClassKey(),
      name: dancheongArtistName(),
      outfits: {
        girl: { ...(hb.outfits.girl || {}) },
        boy: { ...(hb.outfits.boy || {}) }
      },
      likes: existing ? existing.likes || 0 : 0,
      likedBy: existing ? existing.likedBy || [] : [],
      updatedAt: new Date().toISOString()
    };
    await upsertHanbokGalleryWork(work);
    hb.registered = true;
    state.solved.hanbok = true;
    saveProgress();
    playSound("correct.mp3");
    Swal.fire("올렸어요!", "우리반 한복 패션쇼에서 친구들 작품도 구경해 보세요!", "success").then(() => {
      hb.phase = "gallery";
      renderStage3Act1();
    });
  };
  relocateScreenButtonsToGlobalNav();
  setupActivityControls();
}

function renderHanbokGallery(hb) {
  if (!hanbokOutfitsComplete(hb.outfits) || !hb.registered) {
    hb.phase = hanbokOutfitsComplete(hb.outfits) ? "share" : "dress";
    return renderStage3Act1();
  }
  const myId = dancheongArtistId();
  app.innerHTML = sceneTemplate("우리반 한복 패션쇼", `
    <div class="section-card dancheong-game dancheong-game--gallery hanbok-fashion">
      <div class="dancheong-talk">
        <img class="dancheong-talk-char" src="${CHAR_IMG("suho.png")}" alt="수호" draggable="false" />
        <div class="dancheong-bubble">
          <p class="dancheong-bubble-text">친구들이 입힌 한복을 눌러 구경하고, 마음에 들면 하트를 눌러 응원해 줘!</p>
        </div>
      </div>
      <p class="dancheong-gallery-status" id="hbGalleryStatus">패션쇼를 불러오는 중...</p>
      <div class="dancheong-gallery-grid" id="hbGalleryGrid"></div>
      <div class="dancheong-gallery-detail hidden" id="hbGalleryDetail"></div>
      <div class="dancheong-gallery-actions">
        <button type="button" class="btn" id="hbGalleryBack">◀ 다시 입히기</button>
      </div>
    </div>
  `);
  setupNavigationAndHelp("우리반 친구들이 입힌 한복을 구경해보자!");
  hanbokMissionBtn(hanbokMissionReady(hb));
  document.getElementById("hbGalleryBack").onclick = () => {
    stopHanbokGallerySync();
    hb.phase = "dress";
    playSound("click.mp3");
    renderStage3Act1();
  };

  function drawGallery(list) {
    const status = document.getElementById("hbGalleryStatus");
    const grid = document.getElementById("hbGalleryGrid");
    if (!status || !grid) return;
    const works = [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0) || String(a.name).localeCompare(String(b.name), "ko"));
    status.textContent = works.length
      ? `우리반 한복 ${works.length}벌`
      : "아직 올라온 한복이 없어요. 내가 먼저 올려 보자!";
    grid.innerHTML = works.map((work) => {
      const mine = work.id === myId ? " mine" : "";
      return `<button type="button" class="dancheong-gallery-card${mine}" data-id="${work.id}">
        <div class="dancheong-gallery-thumbs hanbok-gallery-thumbs">
          ${hanbokDollPreviewHTML("girl", work.outfits)}
          ${hanbokDollPreviewHTML("boy", work.outfits)}
        </div>
        <span class="dancheong-gallery-name">${escapeGalleryName(work.name)}</span>
        <span class="dancheong-gallery-likes">❤️ ${work.likes || 0}</span>
      </button>`;
    }).join("");
    grid.querySelectorAll(".dancheong-gallery-card").forEach((btn) => {
      btn.onclick = () => showHanbokGalleryDetail(btn.dataset.id, myId);
    });
  }

  startHanbokGallerySync(drawGallery);
  relocateScreenButtonsToGlobalNav();
  setupActivityControls();
}

function showHanbokGalleryDetail(workId, myId) {
  const work = _hanbokGalleryCache.find((x) => x.id === workId);
  const box = document.getElementById("hbGalleryDetail");
  if (!work || !box) return;
  const name = escapeGalleryName(work.name);
  const liked = (work.likedBy || []).includes(myId);
  const canLike = work.id !== myId && !liked;
  box.classList.remove("hidden");
  box.innerHTML = `
    <h3>${name}의 한복</h3>
    ${hanbokPairPreviewHTML(work.outfits)}
    <p>❤️ ${work.likes || 0}</p>
    ${canLike ? `<button type="button" class="btn primary" id="hbLikeBtn">하트 보내기</button>` : `<p class="sub">${work.id === myId ? "내가 올린 작품이에요." : "이미 응원했어요!"}</p>`}
  `;
  const likeBtn = document.getElementById("hbLikeBtn");
  if (likeBtn) {
    likeBtn.onclick = async () => {
      likeBtn.disabled = true;
      const updated = await likeHanbokGalleryWork(work, myId);
      const idx = _hanbokGalleryCache.findIndex((x) => x.id === work.id);
      if (idx >= 0) _hanbokGalleryCache[idx] = updated;
      playSound("snap.mp3");
      showHanbokGalleryDetail(workId, myId);
    };
  }
}

function renderStage3Act1() {
  const hb = ensureHanbokState();
  if (hb.phase === "share") return renderHanbokShare(hb);
  if (hb.phase === "gallery") return renderHanbokGallery(hb);
  return renderHanbokDress(hb);
}

function renderHanbokDress(hb) {
  const girlItems = HANBOK_CLOTHES.filter((c) => c.doll === "girl").map(hanbokTrayItemHTML).join("");
  const boyItems = HANBOK_CLOTHES.filter((c) => c.doll === "boy").map(hanbokTrayItemHTML).join("");

  app.innerHTML = sceneTemplate("STAGE 3-1 한복 입히기", `
    <div class="hanbok-game">
      <p id="hanbokMsg" class="pill">남녀 모두 저고리, 하의, 신발을 입히면 ‘다 입었어요’ 버튼이 켜져요! 배자·갓·노리개도 더 입혀도 돼요.</p>
      <div class="doll-area">
        <div class="doll-wrap" id="girlDoll" data-doll="girl">
          <p class="doll-label">여아</p>
          <div class="doll-stage drop-zone">
            <img class="doll-base" src="${HANBOK_IMG("base-girl.png")}" alt="여아" />
            <img class="doll-layer" data-slot="bottom" src="" alt="" hidden />
            <img class="doll-layer" data-slot="shoe" src="" alt="" hidden />
            <img class="doll-layer" data-slot="top" src="" alt="" hidden />
            <img class="doll-layer" data-slot="outer" src="" alt="" hidden />
            <img class="doll-layer" data-slot="head" src="" alt="" hidden />
            <img class="doll-layer" data-slot="hair" src="" alt="" hidden />
            <img class="doll-layer" data-slot="acc" src="" alt="" hidden />
          </div>
        </div>
        <div class="doll-wrap" id="boyDoll" data-doll="boy">
          <p class="doll-label">남아</p>
          <div class="doll-stage drop-zone">
            <img class="doll-base" src="${HANBOK_IMG("base-boy.png")}" alt="남아" />
            <img class="doll-layer" data-slot="bottom" src="" alt="" hidden />
            <img class="doll-layer" data-slot="shoe" src="" alt="" hidden />
            <img class="doll-layer" data-slot="top" src="" alt="" hidden />
            <img class="doll-layer" data-slot="outer" src="" alt="" hidden />
            <img class="doll-layer" data-slot="head" src="" alt="" hidden />
          </div>
        </div>
      </div>
      <div class="hanbok-tray-columns">
        <div class="hanbok-tray-col hanbok-tray-col--girl">
          <p class="tray-col-label">👧 여자용</p>
          <button type="button" class="hanbok-tray-varrow" id="girlTrayUp" aria-label="여자용 위로">▲</button>
          <div class="hanbok-tray-viewport hanbok-tray-viewport--v" id="girlTrayViewport">
            <div class="hanbok-tray hanbok-tray--v">${girlItems}</div>
          </div>
          <button type="button" class="hanbok-tray-varrow" id="girlTrayDown" aria-label="여자용 아래로">▼</button>
        </div>
        <div class="hanbok-tray-col hanbok-tray-col--boy">
          <p class="tray-col-label">👦 남자용</p>
          <button type="button" class="hanbok-tray-varrow" id="boyTrayUp" aria-label="남자용 위로">▲</button>
          <div class="hanbok-tray-viewport hanbok-tray-viewport--v" id="boyTrayViewport">
            <div class="hanbok-tray hanbok-tray--v">${boyItems}</div>
          </div>
          <button type="button" class="hanbok-tray-varrow" id="boyTrayDown" aria-label="남자용 아래로">▼</button>
        </div>
      </div>
      <button type="button" class="btn primary hanbok-done-btn" id="hanbokDoneBtn" disabled>다 입었어요!</button>
    </div>
  `);
  setupNavigationAndHelp("남녀 모두 저고리, 하의, 신발을 입힌 뒤 ‘다 입었어요’를 눌러 우리반 패션쇼에 올려 보자!");
  hanbokMissionBtn(hanbokMissionReady(hb));
  setupHanbokDressing(hb);
  setupHanbokTrayScroll();
  setupHanbokTrayTooltips();
  relocateScreenButtonsToGlobalNav();
  setupActivityControls();
}

function setupHanbokTrayTooltips() {
  let tip = document.getElementById("hanbokTrayTooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "hanbokTrayTooltip";
    tip.className = "hanbok-tray-tooltip";
    tip.hidden = true;
    document.body.appendChild(tip);
  }

  const hideTip = () => { tip.hidden = true; };

  const showTip = (el) => {
    if (el.classList.contains("used")) return;
    tip.textContent = el.dataset.name;
    tip.hidden = false;
    const rect = el.getBoundingClientRect();
    const isGirl = !!el.closest(".hanbok-tray-col--girl");
    if (isGirl) {
      tip.style.left = `${rect.right + 12}px`;
      tip.style.top = `${rect.top + rect.height / 2}px`;
      tip.style.transform = "translateY(-50%)";
    } else {
      tip.style.left = `${rect.left - 12}px`;
      tip.style.top = `${rect.top + rect.height / 2}px`;
      tip.style.transform = "translate(-100%, -50%)";
    }
  };

  document.querySelectorAll(".hanbok-cloth-item").forEach((el) => {
    el.addEventListener("mouseenter", () => showTip(el));
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", () => showTip(el));
    el.addEventListener("blur", hideTip);
    el.addEventListener("dragstart", hideTip);
  });
}

function setupHanbokTrayScroll() {
  const step = 88;
  const bindVertical = (upId, downId, viewId) => {
    document.getElementById(upId).onclick = () => {
      document.getElementById(viewId).scrollBy({ top: -step, behavior: "smooth" });
      playSound("click.mp3");
    };
    document.getElementById(downId).onclick = () => {
      document.getElementById(viewId).scrollBy({ top: step, behavior: "smooth" });
      playSound("click.mp3");
    };
  };
  bindVertical("girlTrayUp", "girlTrayDown", "girlTrayViewport");
  bindVertical("boyTrayUp", "boyTrayDown", "boyTrayViewport");
}

function setupHanbokDressing(hb) {
  hb = hb || ensureHanbokState();
  const dressed = new Set();
  const msg = document.getElementById("hanbokMsg");
  const doneBtn = document.getElementById("hanbokDoneBtn");
  let selectedCloth = null;

  const clearClothSelection = () => {
    if (selectedCloth) selectedCloth.classList.remove("hb-selected");
    selectedCloth = null;
  };

  const selectCloth = (item) => {
    if (item.classList.contains("used")) return;
    if (selectedCloth === item) { clearClothSelection(); return; }
    clearClothSelection();
    selectedCloth = item;
    item.classList.add("hb-selected");
    playSound("click.mp3");
    msg.textContent = `${item.dataset.name} 선택! 인형을 탭해서 입혀 주세요.`;
  };

  const clearSlotSiblings = (item) => {
    document.querySelectorAll(
      `.hanbok-cloth-item[data-doll="${item.dataset.doll}"][data-slot="${item.dataset.slot}"]`
    ).forEach((el) => {
      if (el.dataset.id === item.dataset.id) return;
      el.classList.remove("used");
      el.draggable = true;
      dressed.delete(el.dataset.id);
    });
  };

  const isDollDone = (doll) => HANBOK_REQUIRED_SLOTS.every((slot) => {
    const layer = document.querySelector(`.doll-wrap[data-doll="${doll}"] .doll-layer[data-slot="${slot}"]`);
    return !!(layer && !layer.hidden && layer.dataset.clothId);
  });
  const isGirlDone = () => isDollDone("girl");
  const isBoyDone = () => isDollDone("boy");
  const syncOutfits = () => {
    const next = { girl: {}, boy: {} };
    document.querySelectorAll(".doll-layer[data-cloth-id]").forEach((layer) => {
      if (layer.hidden || !layer.dataset.clothId) return;
      const doll = layer.closest(".doll-wrap")?.dataset.doll;
      const slot = layer.dataset.slot;
      if (!doll || !slot || !next[doll]) return;
      next[doll][slot] = layer.dataset.clothId;
    });
    hb.outfits = next;
  };
  const updateDoneBtn = () => {
    const ready = isGirlDone() && isBoyDone();
    if (doneBtn) {
      doneBtn.disabled = !ready;
      doneBtn.setAttribute("aria-disabled", ready ? "false" : "true");
    }
    if (ready) {
      msg.textContent = "저고리, 하의, 신발을 모두 입혔어요! ‘다 입었어요’를 눌러 패션쇼에 올려 보자!";
    }
  };

  if (doneBtn) {
    doneBtn.onclick = () => {
      if (!(isGirlDone() && isBoyDone())) return;
      syncOutfits();
      hb.phase = "share";
      playSound("correct.mp3");
      renderStage3Act1();
    };
  }

  const undressCloth = (clothId) => {
    const trayItem = document.querySelector(`.hanbok-cloth-item[data-id="${clothId}"]`);
    if (!trayItem) return false;

    const { doll, slot, name } = trayItem.dataset;
    const zone = document.querySelector(`.doll-wrap[data-doll="${doll}"] .doll-stage`);
    const slotLayer = zone?.querySelector(`.doll-layer[data-slot="${slot}"]`);
    if (!slotLayer || slotLayer.dataset.clothId !== clothId) return false;

    slotLayer.src = "";
    slotLayer.alt = "";
    slotLayer.hidden = true;
    slotLayer.draggable = false;
    slotLayer.classList.remove("layer-on", "dragging");
    clearHanbokLayerOffset(slotLayer);
    delete slotLayer.dataset.clothId;

    trayItem.classList.remove("used");
    trayItem.draggable = true;
    dressed.delete(clothId);

    msg.textContent = `${name} 벗었어!`;
    playSound("click.mp3");
    syncOutfits();
    updateDoneBtn();
    return true;
  };

  const dressItemOnDoll = (zone, item, quiet) => {
    if (!item || item.classList.contains("used")) return;

    const doll = zone.closest(".doll-wrap").dataset.doll;
    if (item.dataset.doll !== doll) {
      playSound("wrong.mp3");
      msg.textContent = "앗! 다른 인형 옷이야!";
      return;
    }
    if (dressed.has(item.dataset.id)) return;

    clearSlotSiblings(item);

    const slotLayer = zone.querySelector(`.doll-layer[data-slot="${item.dataset.slot}"]`);
    if (!slotLayer) return;

    const cloth = getHanbokCloth(item.dataset.id);
    slotLayer.src = HANBOK_IMG(cloth?.useIconAsLayer ? cloth.icon : item.dataset.layer);
    slotLayer.alt = item.dataset.name;
    slotLayer.hidden = false;
    slotLayer.draggable = true;
    slotLayer.dataset.clothId = item.dataset.id;
    slotLayer.classList.add("layer-on");
    applyHanbokLayerStyle(slotLayer, item.dataset.id);

    item.classList.add("used");
    item.draggable = false;
    dressed.add(item.dataset.id);

    if (!quiet) {
      msg.textContent = `${item.dataset.name} 착!`;
      playSound("snap.mp3");
      zone.classList.add("doll-bounce");
      setTimeout(() => zone.classList.remove("doll-bounce"), 400);
    }
    syncOutfits();
    updateDoneBtn();
    window.__draggingCloth = null;
    clearClothSelection();
  };

  document.querySelectorAll(".hanbok-cloth-item").forEach((el, i) => {
    el.style.animationDelay = `${i * 0.12}s`;
    el.addEventListener("dragstart", (e) => {
      if (el.classList.contains("used")) { e.preventDefault(); return; }
      window.__draggingCloth = el;
      window.__draggingLayer = null;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", el.dataset.id);
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      if (!el.classList.contains("used")) window.__draggingCloth = null;
    });
    // 모바일 터치 대안: 옷을 탭해서 고르고(다시 탭하면 선택 해제),
    // 이미 입은 옷을 탭하면 바로 벗겨요.
    el.addEventListener("click", () => {
      if (el.classList.contains("used")) {
        undressCloth(el.dataset.id);
      } else {
        selectCloth(el);
      }
    });
  });

  document.querySelectorAll(".doll-layer").forEach((layer) => {
    layer.addEventListener("dragstart", (e) => {
      if (!layer.dataset.clothId || layer.hidden) {
        e.preventDefault();
        return;
      }
      window.__draggingLayer = layer;
      window.__draggingCloth = null;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", layer.dataset.clothId);
      layer.classList.add("dragging");
    });
    layer.addEventListener("dragend", () => {
      layer.classList.remove("dragging");
      window.__draggingLayer = null;
    });
    layer.addEventListener("dragover", (e) => {
      if (!window.__draggingCloth) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      layer.closest(".doll-stage")?.classList.add("drag-over");
    });
    layer.addEventListener("dragleave", () => {
      layer.closest(".doll-stage")?.classList.remove("drag-over");
    });
    layer.addEventListener("drop", (e) => {
      if (!window.__draggingCloth) return;
      e.preventDefault();
      const zone = layer.closest(".doll-stage");
      zone?.classList.remove("drag-over");
      dressItemOnDoll(zone, window.__draggingCloth);
    });
    // 모바일 터치 대안: 입고 있는 옷을 탭하면 바로 벗겨요.
    // 단, 트레이에서 옷을 고른 상태라면 벗기지 않고 그 옷을 입혀요.
    layer.addEventListener("click", () => {
      if (selectedCloth) {
        dressItemOnDoll(layer.closest(".doll-stage"), selectedCloth);
        return;
      }
      if (layer.dataset.clothId && !layer.hidden) undressCloth(layer.dataset.clothId);
    });
  });

  document.querySelectorAll(".doll-stage").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      if (!window.__draggingCloth) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      dressItemOnDoll(zone, window.__draggingCloth);
    });
    // 모바일 터치 대안: 옷을 탭해서 고른 뒤 인형을 탭하면 입혀져요.
    zone.addEventListener("click", (e) => {
      if (e.target.closest(".doll-layer:not([hidden])")) return;
      if (selectedCloth) dressItemOnDoll(zone, selectedCloth);
    });
  });

  document.querySelectorAll(".hanbok-tray-col").forEach((col) => {
    const doll = col.classList.contains("hanbok-tray-col--girl") ? "girl" : "boy";
    col.addEventListener("dragover", (e) => {
      const layer = window.__draggingLayer;
      if (!layer?.dataset.clothId) return;
      const trayItem = document.querySelector(`.hanbok-cloth-item[data-id="${layer.dataset.clothId}"]`);
      if (!trayItem || trayItem.dataset.doll !== doll) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      col.classList.add("tray-drag-over");
    });
    col.addEventListener("dragleave", (e) => {
      if (!col.contains(e.relatedTarget)) col.classList.remove("tray-drag-over");
    });
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("tray-drag-over");
      const layer = window.__draggingLayer;
      if (!layer?.dataset.clothId) return;
      const trayItem = document.querySelector(`.hanbok-cloth-item[data-id="${layer.dataset.clothId}"]`);
      if (!trayItem || trayItem.dataset.doll !== doll) {
        playSound("wrong.mp3");
        msg.textContent = "앗! 다른 인형 옷이야!";
        return;
      }
      undressCloth(layer.dataset.clothId);
      window.__draggingLayer = null;
    });
  });

  ["girl", "boy"].forEach((doll) => {
    Object.values(hb.outfits?.[doll] || {}).forEach((clothId) => {
      const item = document.querySelector(`.hanbok-cloth-item[data-id="${clothId}"]`);
      const zone = document.querySelector(`.doll-wrap[data-doll="${doll}"] .doll-stage`);
      if (item && zone) dressItemOnDoll(zone, item, true);
    });
  });
  updateDoneBtn();
}

function ensureFoodState() {
  if (!state.food) state.food = { screen: "cook", dish: "bibimbap" };
  if (!state.foodProgress) state.foodProgress = { bibimbap: false };
  return state.food;
}

function isOurFoodMissionReady() {
  return !!(state.foodProgress?.bibimbap || state.solved?.bibimbap);
}

function bindOurFoodMissionBtn() {
  bindMissionCompleteBtn(
    "stage3_a2",
    isOurFoodMissionReady(),
    "비빔밥을 만들면 보물을 되찾을 수 있어요!",
    () => {
      state.solved.bibimbap = true;
      saveProgress();
    }
  );
}

function completeOurFoodDish() {
  if (!state.foodProgress) state.foodProgress = { bibimbap: false };
  state.foodProgress.bibimbap = true;
  state.solved.bibimbap = true;
  saveProgress();
  bindOurFoodMissionBtn();
}

function renderStage3Act2() {
  ensureFoodState();
  return renderBibimbapCook();
}

function renderBibimbapCook() {
  const ingredients = [
    { key: "rice", name: "밥", msg: "밥 톡!", img: "rice.png" },
    { key: "carrot", name: "당근", msg: "당근 송송!", img: "carrot.png" },
    { key: "fern", name: "고사리", msg: "고사리 송송!", img: "fern.png" },
    { key: "radish", name: "무", msg: "무 송송!", img: "radish.png" },
    { key: "bean-sprout", name: "콩나물", msg: "콩나물 송송!", img: "bean-sprout.png" },
    { key: "beef", name: "소고기", msg: "소고기 송송!", img: "beef.png" },
    { key: "zucchini", name: "애호박", msg: "애호박 송송!", img: "zucchini.png" },
    { key: "egg", name: "계란", msg: "계란 탁!", img: "egg.png" },
    { key: "sesame-oil", name: "참기름", msg: "참기름 뿌릴락!", img: "sesame-oil.png" },
    { key: "gochujang", name: "고추장", msg: "고추장 톡!", img: "gochujang.png" }
  ];
  const trayRow1 = ingredients.slice(0, 5).map((ing) => `
    <div class="ingredient-item" draggable="true"
      data-key="${ing.key}" data-name="${ing.name}" data-msg="${ing.msg}"
      data-img="${ing.img}">
      <img src="${BIBIMBAP_IMG(ing.img)}" alt="${ing.name}" />
    </div>
  `).join("");
  const trayRow2 = ingredients.slice(5).map((ing) => `
    <div class="ingredient-item" draggable="true"
      data-key="${ing.key}" data-name="${ing.name}" data-msg="${ing.msg}"
      data-img="${ing.img}">
      <img src="${BIBIMBAP_IMG(ing.img)}" alt="${ing.name}" />
    </div>
  `).join("");

  app.innerHTML = sceneTemplate("STAGE 3-2 비빔밥 만들기", `
    <div class="section-card bibimbap-game">
      <p id="cookMsg" class="pill bibimbap-msg">밥부터 탭하거나 끌어서 돌솥에 넣어 주세요!</p>
      <div class="pot-area">
        <div class="pot-zone drop-zone" id="pot">
          <img class="pot-img" src="${BIBIMBAP_IMG("stone-pot.png")}" alt="돌솥" />
          <div class="pot-layers" id="potLayers"></div>
          <img class="pot-done hidden" id="potDone" src="${BIBIMBAP_IMG("bibimbap-done.png")}" alt="완성 비빔밥" />
        </div>
      </div>
      <div class="ingredient-tray" id="ingredientTray">
        <div class="ingredient-row">${trayRow1}</div>
        <div class="ingredient-row">${trayRow2}</div>
      </div>
    </div>
  `);
  setupNavigationAndHelp("밥부터 탭하거나 끌어서 가운데 돌솥에 넣고, 재료를 차례로 올려보자!");
  bindOurFoodMissionBtn();
  setupBibimbapCooking();
}

function bibimbapLayerZIndex(key) {
  const idx = BIBIMBAP_LAYER_ORDER.indexOf(key);
  return idx >= 0 ? idx + 1 : 1;
}

function placeBibimbapLayer(potLayers, key, alt) {
  const layerFile = BIBIMBAP_LAYER_FILES[key];
  if (!layerFile) return null;

  const layer = document.createElement("img");
  layer.className = "pot-layer";
  layer.dataset.key = key;
  layer.src = BIBIMBAP_IMG(layerFile);
  layer.alt = alt || key;
  layer.style.zIndex = bibimbapLayerZIndex(key);

  const siblings = [...potLayers.querySelectorAll(".pot-layer")];
  const insertBefore = siblings.find(
    (el) => bibimbapLayerZIndex(el.dataset.key) > bibimbapLayerZIndex(key)
  );
  if (insertBefore) potLayers.insertBefore(layer, insertBefore);
  else potLayers.appendChild(layer);

  return layer;
}

function setupBibimbapCooking() {
  const pot = document.getElementById("pot");
  const potLayers = document.getElementById("potLayers");
  const potDone = document.getElementById("potDone");
  const TOTAL_INGREDIENTS = 10;
  const added = new Set();

  const addIngredient = (item) => {
    if (!item || item.classList.contains("used")) return;
    const key = item.dataset.key;
    if (added.has(key)) return;

    placeBibimbapLayer(potLayers, key, item.dataset.name);

    item.classList.add("used");
    item.classList.remove("dragging");
    item.draggable = false;
    added.add(key);

    document.getElementById("cookMsg").textContent = item.dataset.msg || `${item.dataset.name} 송송!`;
    playSound("cook_ok.mp3");
    pot.classList.add("pot-bounce");
    setTimeout(() => pot.classList.remove("pot-bounce"), 400);

    if (added.size >= TOTAL_INGREDIENTS) {
      completeOurFoodDish();
      setTimeout(() => {
        if (potDone) potDone.classList.remove("hidden");
        if (document.getElementById("missionClearOverlay")) return;
        Swal.fire("냠냠!", "맛있는 비빔밥 완성!", "success");
      }, 400);
    }
  };

  document.querySelectorAll("#ingredientTray .ingredient-item").forEach((el, i) => {
    el.style.animationDelay = `${i * 0.15}s`;
    el.addEventListener("dragstart", (e) => {
      if (el.classList.contains("used")) {
        e.preventDefault();
        return;
      }
      window.__draggingFood = el;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", el.dataset.key);
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      if (!el.classList.contains("used")) window.__draggingFood = null;
    });
    // 모바일 터치 대안: 재료를 탭하면 바로 돌솥에 들어가요.
    el.addEventListener("click", () => addIngredient(el));
  });

  pot.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    pot.classList.add("drag-over");
  });
  pot.addEventListener("dragleave", () => pot.classList.remove("drag-over"));
  pot.addEventListener("drop", (e) => {
    e.preventDefault();
    pot.classList.remove("drag-over");
    const item = window.__draggingFood;
    addIngredient(item);
    window.__draggingFood = null;
  });
}

const HOLIDAY_CARDS = [
  {
    id: "seollal-date",
    type: "seollal",
    img: "seollal-date.png",
    label: "설날",
    info: "설날은 음력 1월 1일이에요. 한 해가 시작되는 날이지요."
  },
  {
    id: "seollal-sebae",
    type: "seollal",
    img: "seollal-sebae.png",
    label: "세배",
    info: "새해를 맞아 웃어른께 세배를 하고 복을 빌어요."
  },
  {
    id: "seollal-tteokguk",
    type: "seollal",
    img: "seollal-tteokguk.png",
    label: "떡국",
    info: "설날 아침에 가족과 함께 떡국을 먹으며 나이를 한 살 더 먹어요."
  },
  {
    id: "seollal-bokjori",
    type: "seollal",
    img: "seollal-bokjori.png",
    label: "복조리와 복주머니",
    info: "복을 담는 복조리와 복주머니로 새해의 행운을 기원해요."
  },
  {
    id: "seollal-deokdam",
    type: "seollal",
    img: "seollal-deokdam.png",
    label: "새해 인사",
    info: "웃어른께서 “건강하고 행복하렴!” 하고 따뜻한 덕담을 전해요."
  },
  {
    id: "seollal-kite-top",
    type: "seollal",
    img: "seollal-kite-top.png",
    label: "연날리기와 팽이치기",
    info: "설날에는 연을 날리고 팽이를 치며 신나게 놀아요."
  },
  {
    id: "chuseok-date",
    type: "chuseok",
    img: "chuseok-date.png",
    label: "추석",
    info: "추석은 음력 8월 15일, 보름달이 가장 밝은 한가위예요."
  },
  {
    id: "chuseok-songpyeon",
    type: "chuseok",
    img: "chuseok-songpyeon.png",
    label: "송편",
    info: "햇곡식으로 반달 모양 송편을 빚어 가족과 나눠 먹어요."
  },
  {
    id: "chuseok-harvest",
    type: "chuseok",
    img: "chuseok-harvest.png",
    label: "햇곡식과 햇과일",
    info: "가을에 거둔 햇곡식과 햇과일에 감사하는 날이에요."
  },
  {
    id: "chuseok-beolcho",
    type: "chuseok",
    img: "chuseok-beolcho.png",
    label: "벌초와 성묘",
    info: "조상님 묘의 풀을 베고 찾아뵙는 벌초와 성묘를 해요."
  },
  {
    id: "chuseok-ganggangsullae",
    type: "chuseok",
    img: "chuseok-ganggangsullae.png",
    label: "강강술래",
    info: "둥근 달 아래에서 손을 잡고 강강술래를 하며 풍년을 기뻐해요."
  }
];

function holidayPlacedCardHTML(item) {
  return `<img src="${HOLIDAY_IMG(item.img)}" alt="${item.label}" draggable="false" />`;
}

function createDefaultHolidayState() {
  return {
    queue: shuffleArray([...HOLIDAY_CARDS]),
    index: 0,
    done: 0,
    total: HOLIDAY_CARDS.length
  };
}

function normalizeHolidayState() {
  const validIds = new Set(HOLIDAY_CARDS.map((item) => item.id));
  const queue = state.holiday?.queue;
  const queueOk = Array.isArray(queue)
    && queue.length === HOLIDAY_CARDS.length
    && queue.every((item) => item && validIds.has(item.id));
  if (!queueOk || Number(state.holiday?.total) !== HOLIDAY_CARDS.length) {
    state.holiday = createDefaultHolidayState();
  }
}

function renderStage3Act3() {
  normalizeHolidayState();
  if (!state.holiday) state.holiday = createDefaultHolidayState();
  const { done, total } = state.holiday;
  const allDone = done >= total;

  app.innerHTML = sceneTemplate("STAGE 3-3 설날과 추석", `
    <div class="holiday-game">
      <p class="pill holiday-msg" id="holidayMsg">
        ${allDone
          ? "모든 카드를 맞췄어요!"
          : "가운데 카드를 보고 설날이면 왼쪽, 추석이면 오른쪽으로 끌어놓아요!"}
      </p>
      <div class="holiday-board" id="holidayBoard">
        <div class="holiday-zone holiday-zone--seollal drop-zone" data-type="seollal" aria-label="설날">
          <img class="holiday-zone-bg" src="${HOLIDAY_IMG("seollal-bg.png")}" alt="" draggable="false" />
          <span class="holiday-zone-label">설날</span>
          <div class="holiday-zone-stack" id="holidayStackSeollal"></div>
        </div>
        <div class="holiday-zone holiday-zone--chuseok drop-zone" data-type="chuseok" aria-label="추석">
          <img class="holiday-zone-bg" src="${HOLIDAY_IMG("chuseok-bg.png")}" alt="" draggable="false" />
          <span class="holiday-zone-label">추석</span>
          <div class="holiday-zone-stack" id="holidayStackChuseok"></div>
        </div>
        <div class="holiday-card-wrap" id="holidayCardWrap" ${allDone ? "hidden" : ""}>
          <div class="holiday-card" id="holidayCard" draggable="true">
            <img src="" alt="" draggable="false" />
          </div>
        </div>
      </div>
      <div class="holiday-info-panel" id="holidayInfoPanel" hidden>
        <p class="holiday-info-text" id="holidayInfoText"></p>
      </div>
      <p class="holiday-progress" id="holidayProgress">${done} / ${total}</p>
    </div>
  `);
  setupNavigationAndHelp("가운데 카드를 보고 설날·추석 중 어디 명절인지 맞혀보자!");
  bindMissionCompleteBtn(
    "stage3_a3",
    !!state.solved.holiday,
    `카드 ${HOLIDAY_CARDS.length}장을 모두 맞히면 보물을 되찾을 수 있어요!`
  );
  if (!allDone) setupHolidayDragGame();
}

function setupHolidayDragGame() {
  const board = document.getElementById("holidayBoard");
  const card = document.getElementById("holidayCard");
  const cardWrap = document.getElementById("holidayCardWrap");
  const msg = document.getElementById("holidayMsg");
  const progress = document.getElementById("holidayProgress");
  if (!board || !card || !cardWrap || !state.holiday) return;

  const cardImg = card.querySelector("img");
  const infoPanel = document.getElementById("holidayInfoPanel");
  const infoText = document.getElementById("holidayInfoText");
  const zones = [...board.querySelectorAll(".holiday-zone")];
  let locked = false;
  let dragMoved = false;

  const currentCard = () => state.holiday.queue[state.holiday.index];

  const hideInfoPanel = () => {
    if (!infoPanel) return;
    infoPanel.hidden = true;
    infoPanel.classList.remove("popup");
  };

  const showInfoPanel = (text) => {
    if (!infoPanel || !infoText) return;
    infoText.textContent = text;
    infoPanel.hidden = false;
    infoPanel.classList.remove("popup");
    void infoPanel.offsetWidth;
    infoPanel.classList.add("popup");
  };

  const updateProgress = () => {
    if (progress) progress.textContent = `${state.holiday.done} / ${state.holiday.total}`;
  };

  const liftCardToBody = () => {
    if (card.parentElement !== document.body) {
      document.body.appendChild(card);
    }
  };

  const restoreCardToWrap = () => {
    if (card.parentElement !== cardWrap) {
      cardWrap.appendChild(card);
    }
  };

  const resetCardStyles = () => {
    restoreCardToWrap();
    card.style.transition = "";
    card.style.position = "";
    card.style.left = "";
    card.style.top = "";
    card.style.transform = "";
    card.style.zIndex = "";
    card.style.pointerEvents = "";
    card.style.opacity = "";
    card.style.width = "";
  };

  const hidePlayCard = () => {
    cardWrap.hidden = true;
    card.style.display = "none";
    if (card.parentElement === document.body) card.remove();
  };

  const showCurrentCard = () => {
    const item = currentCard();
    if (!item) {
      hidePlayCard();
      hideInfoPanel();
      return;
    }
    cardWrap.hidden = false;
    card.style.display = "";
    card.dataset.type = item.type;
    cardImg.src = HOLIDAY_IMG(item.img);
    cardImg.alt = item.label;
    card.classList.remove("dragging", "correct-fly", "fly-left", "fly-right", "wrong-shake");
    resetCardStyles();
    cardWrap.classList.remove("popup");
    void cardWrap.offsetWidth;
    cardWrap.classList.add("popup");
    showInfoPanel(item.info);
  };

  const finishActivity = () => {
    hidePlayCard();
    hideInfoPanel();
    state.solved.holiday = true;
    saveProgress();
    if (msg) msg.textContent = "모든 카드를 맞췄어요!";
    bindMissionCompleteBtn("stage3_a3", true);
    render();
  };

  const placeCardInZone = (zone, item, onComplete) => {
    const stack = zone.querySelector(".holiday-zone-stack");
    if (!stack) {
      onComplete();
      return;
    }

    const placed = document.createElement("div");
    placed.className = "holiday-card holiday-card--placed";
    placed.innerHTML = holidayPlacedCardHTML(item);
    stack.appendChild(placed);

    const fromRect = card.getBoundingClientRect();
    const toRect = placed.getBoundingClientRect();
    placed.style.visibility = "hidden";

    card.classList.remove("dragging", "wrong-shake", "correct-fly", "fly-left", "fly-right");
    card.style.width = `${fromRect.width}px`;
    card.style.transition = "left .55s cubic-bezier(.4,0,.2,1), top .55s cubic-bezier(.4,0,.2,1), transform .55s cubic-bezier(.4,0,.2,1)";
    card.style.position = "fixed";
    card.style.left = `${fromRect.left + fromRect.width / 2}px`;
    card.style.top = `${fromRect.top + fromRect.height / 2}px`;
    card.style.transform = "translate(-50%, -50%)";
    card.style.zIndex = "1000";
    card.style.pointerEvents = "none";
    liftCardToBody();

    const scale = toRect.width / fromRect.width;
    let finished = false;

    const finishPlace = () => {
      if (finished) return;
      finished = true;
      placed.style.visibility = "";
      placed.classList.add("landed");
      card.style.opacity = "0";
      onComplete();
      requestAnimationFrame(() => {
        if (state.holiday && state.holiday.index >= state.holiday.queue.length) {
          hidePlayCard();
          return;
        }
        resetCardStyles();
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.left = `${toRect.left + toRect.width / 2}px`;
        card.style.top = `${toRect.top + toRect.height / 2}px`;
        card.style.transform = `translate(-50%, -50%) scale(${scale})`;
      });
    });

    card.addEventListener("transitionend", finishPlace, { once: true });
    setTimeout(finishPlace, 650);
  };

  const handleAnswer = (zoneType) => {
    if (locked) return;
    const item = currentCard();
    if (!item) return;

    if (zoneType === item.type) {
      locked = true;
      hideInfoPanel();
      playSound("correct.mp3");
      const zone = zones.find((z) => z.dataset.type === zoneType);
      placeCardInZone(zone, item, () => {
        state.holiday.done += 1;
        state.holiday.index += 1;
        updateProgress();
        locked = false;
        if (state.holiday.index >= state.holiday.queue.length) {
          hidePlayCard();
          finishActivity();
        } else {
          showCurrentCard();
        }
      });
    } else {
      playSound("wrong.mp3");
      card.classList.add("wrong-shake");
      setTimeout(() => card.classList.remove("wrong-shake"), 520);
      Swal.fire("다시!", "설날인지 추석인지 한 번 더 생각해보자!", "error");
    }
  };

  card.addEventListener("dragstart", (e) => {
    if (locked) {
      e.preventDefault();
      return;
    }
    hideInfoPanel();
    dragMoved = false;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.dataset.type || "");
    card.classList.add("dragging");
  });
  card.addEventListener("drag", () => { dragMoved = true; });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    zones.forEach((z) => z.classList.remove("drag-over"));
  });

  zones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      handleAnswer(zone.dataset.type);
    });
    zone.addEventListener("click", () => {
      if (dragMoved) return;
      handleAnswer(zone.dataset.type);
    });
  });

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  card.addEventListener("pointerdown", (e) => {
    if (locked || e.button > 0) return;
    hideInfoPanel();
    card.draggable = false;
    pointerId = e.pointerId;
    dragMoved = false;
    card.setPointerCapture(pointerId);
    card.classList.add("dragging");
    startX = e.clientX;
    startY = e.clientY;
    const rect = card.getBoundingClientRect();
    originX = rect.left + rect.width / 2;
    originY = rect.top + rect.height / 2;
    card.style.transition = "none";
    card.style.width = `${rect.width}px`;
    card.style.position = "fixed";
    card.style.left = `${originX}px`;
    card.style.top = `${originY}px`;
    card.style.transform = "translate(-50%, -50%)";
    card.style.zIndex = "1000";
    liftCardToBody();
  });

  card.addEventListener("pointermove", (e) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) dragMoved = true;
    card.style.left = `${originX + dx}px`;
    card.style.top = `${originY + dy}px`;
    zones.forEach((zone) => {
      const r = zone.getBoundingClientRect();
      const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      zone.classList.toggle("drag-over", over);
    });
  });

  const endPointerDrag = (e) => {
    if (e.pointerId !== pointerId) return;
    try { card.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
    pointerId = null;
    card.draggable = true;
    card.classList.remove("dragging");
    let hitType = null;
    zones.forEach((zone) => {
      zone.classList.remove("drag-over");
      const r = zone.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        hitType = zone.dataset.type;
      }
    });
    resetCardStyles();
    if (hitType && dragMoved) handleAnswer(hitType);
  };

  card.addEventListener("pointerup", endPointerDrag);
  card.addEventListener("pointercancel", endPointerDrag);

  showCurrentCard();
}

const YUT_NAME = { 1: "도", 2: "개", 3: "걸", 4: "윷", 5: "모" };
const yutChipLabel = (move) => `${YUT_NAME[move]} (${move}칸)`;

function yutPanelTokenRow(owner, count) {
  if (!count) return '<span class="yut-token-row empty" aria-hidden="true"></span>';
  const cls = owner === "you" ? "you" : "ai";
  const icons = Array.from({ length: count }, () => `<span class="yut-panel-token ${cls}"></span>`).join("");
  return `<span class="yut-token-row">${icons}</span>`;
}

function yutPanelTokenRowByToken(tokenId, count, owner = "you") {
  if (!count) return '<span class="yut-token-row empty" aria-hidden="true"></span>';
  const cls = owner === "you" ? "you" : "ai";
  const tokenFile = YUT_TOKENS[tokenId]?.file || YUT_TOKENS[1].file;
  const icons = Array.from({ length: count }, () => `<span class="yut-panel-token ${cls}" style="background-image:url('${YUT_IMG(tokenFile)}')"></span>`).join("");
  return `<span class="yut-token-row">${icons}</span>`;
}

function yutTurnTokenHTML(turn) {
  const cls = turn === "you" ? "you" : "ai";
  const label = turn === "you" ? "나" : "도깨비";
  return `<span class="yut-turn-token ${cls}" role="img" aria-label="${label} 차례"></span>`;
}

// 윷가락 4개 시뮬레이션 (각 50% 평평) → 평평한 개수로 도·개·걸·윷·모
function rollYut() {
  const flats = [];
  for (let i = 0; i < 4; i++) flats.push(Math.random() < 0.5);
  const flat = flats.filter(Boolean).length;
  const byFlat = {
    0: { name: "모", move: 5 },
    1: { name: "도", move: 1 },
    2: { name: "개", move: 2 },
    3: { name: "걸", move: 3 },
    4: { name: "윷", move: 4 }
  };
  return Object.assign({ flats }, byFlat[flat]);
}

// 담요 위 윷가락 4개가 던져지는 애니메이션을 보여준 뒤 콜백 실행
function yutShowThrow(flats, cb) {
  const cont = document.querySelector(".yut-mat .yut-sticks");
  if (!cont) { if (cb) cb(); return; }
  cont.classList.add("throwing");
  cont.innerHTML = flats.map((_, i) =>
    `<div class="yut-stick clay spin" style="${yutStickVars(i)};animation-delay:${(i * 0.04).toFixed(2)}s">${YUT_STICK_FACES}</div>`
  ).join("");
  const sticks = cont.querySelectorAll(".yut-stick");
  setTimeout(() => {
    sticks.forEach((s, i) => {
      s.classList.remove("spin");
      s.classList.add(flats[i] ? "up" : "down");
    });
  }, 950);
  setTimeout(() => { cont.classList.remove("throwing"); if (cb) cb(); }, 1500);
}

/* ───────────────── 윷놀이 엔진 ───────────────── */
// 노드 좌표(%). 0=출발·도착 표시(노랑, 말 없음), 1=첫 진입 칸(노랑 바로 위 하얀 원), 5=우상 …
const YUT_NODES = (() => {
  const N = {};
  const set = (id, x, y) => { N[id] = { x, y }; };
  set(0, 81.02, 75.60); set(1, 81.82, 62.52); set(2, 81.26, 51.12); set(3, 82.22, 40.27); set(4, 81.34, 28.63); set(5, 81.10, 11.08);
  set(6, 66.51, 13.80); set(7, 55.02, 13.88); set(8, 43.30, 13.72); set(9, 31.26, 13.72); set(10, 13.40, 12.28);
  set(11, 16.19, 27.91); set(12, 15.15, 41.87); set(13, 15.07, 53.19); set(14, 14.91, 63.88); set(15, 15.79, 74.00);
  set(16, 30.06, 79.19); set(17, 41.71, 78.23); set(18, 55.42, 78.47); set(19, 66.03, 79.35);
  set(20, 66.03, 27.99); set(21, 57.58, 36.60); set(22, 48.48, 42.66); set(23, 59.73, 58.05); set(24, 66.43, 65.95);
  set(25, 26.00, 25.04); set(26, 37.00, 36.68); set(27, 39.39, 58.37); set(28, 28.39, 65.79);
  return N;
})();
const YUT_CORNERS = new Set([0, 5, 10, 15, 22]);
const YUT_HOME = 99;
// 컬러 큰 원에 멈춘 뒤 다음 윷에서 나가는 지름길 (5·10)
const YUT_SHORTCUT_EXIT = { 5: 20, 10: 25 };

function yutN(v) { return Number(v); }

// 모서리·중앙(컬러 큰 원)에 멈춰 있을 때 직전 칸 추정 (nodeApproach 없을 때)
function yutDefaultPrev(cur) {
  const c = yutN(cur);
  if (c === 5) return 4;
  if (c === 10) return 9;
  if (c === 22) return 21;
  return null;
}

function yutGetApproach(pos, approach) {
  if (!approach || pos < 0) return null;
  const a = approach[pos] ?? approach[String(pos)];
  return a == null ? null : yutN(a);
}

// moveStart=이번 윷 시작 칸. 컬러 큰 원(5·10·22)에 멈춘 뒤에만 지름길. 파랑(15)은 항상 바깥.
function yutNext(prev, cur, moveStart) {
  const ms = yutN(moveStart);
  const c = yutN(cur);
  const p = prev == null ? null : yutN(prev);

  if (c === 5 && ms === 5) return p === 6 ? 4 : YUT_SHORTCUT_EXIT[5];
  if (c === 10 && ms === 10) return p === 11 ? 9 : YUT_SHORTCUT_EXIT[10];
  // 보라(22)에 멈춘 뒤: 항상 23(도착 방향)
  if (c === 22 && ms === 22) return 23;

  if (c === 5) return p === 6 ? 4 : 6;
  if (c === 10) return p === 11 ? 9 : 11;
  if (c === 15) return p === 16 ? 14 : 16;
  // 같은 윷으로 22를 지나칠 때: 연두쪽(21→27), 분홍쪽(26→23)
  if (c === 22) {
    if (p === 21) return 27;
    return 23;
  }
  const map = { 19: YUT_HOME, 24: YUT_HOME, 20: 21, 21: 22, 23: 24, 25: 26, 26: 22, 27: 28, 28: 15 };
  if (c in map) return map[c];
  return c + 1;
}
// state 변경 없이 이동 계산 (AI 미리보기·실제 이동 공용)
function yutMoveCalc(start, steps, approach) {
  const moveStart = yutN(start);
  let cur = moveStart;
  let prev = yutGetApproach(moveStart, approach) ?? yutDefaultPrev(moveStart);
  for (let i = 0; i < steps; i++) {
    if (cur === -1) {
      prev = -1;
      cur = yutNext(-1, 0, moveStart);
      continue;
    }
    const n = yutNext(prev, cur, moveStart);
    prev = cur; cur = n;
    if (cur === YUT_HOME) return { dest: YUT_HOME, landPrev: prev };
  }
  return { dest: cur, landPrev: prev };
}

function yutMove(start, steps) {
  return yutMoveCalc(start, steps, state.yut?.nodeApproach).dest;
}

function yutRecordApproach(dest, landPrev) {
  if (!state.yut || dest < 0 || dest === YUT_HOME) return;
  if (!state.yut.nodeApproach) state.yut.nodeApproach = {};
  state.yut.nodeApproach[dest] = landPrev;
}

function yutCancelAI() {
  if (state.yut) state.yut.aiSeq = (state.yut.aiSeq || 0) + 1;
}

function yutScheduleAI(fn, ms) {
  if (!state.yut) return;
  const seq = (state.yut.aiSeq || 0) + 1;
  state.yut.aiSeq = seq;
  setTimeout(() => {
    if (state.current !== "stage4_a1" || !state.yut || state.yut.aiSeq !== seq) return;
    fn();
  }, ms);
}
function yutGroups(owner) {
  const set = new Set();
  state.yut.pieces[owner].forEach((p) => { if (p !== YUT_HOME) set.add(p); });
  return [...set];
}
function yutNewGame(first = "you") {
  yutCancelAI();
  _yutBoardResultShown = "";
  const tokenYou = state.yut?.tokenYou || null;
  state.yut = {
    phase: tokenYou ? "choose" : "token",
    first,
    turn: first,
    tokenYou,
    pieces: { you: [-1, -1, -1, -1], ai: [-1, -1, -1, -1] },
    homed: { you: 0, ai: 0 },
    pending: [],
    bonus: 0,
    sel: null,
    lastName: "-",
    lastFlats: null,
    nodeApproach: {},
    aiSeq: 0
  };
}

// 윷가락 1면 — up/down 클래스로 이미지 교체 (3D 뒤집기 대신)
const YUT_STICK_FACES = '<div class="face"></div>';

// 윷가락이 펼쳐질 가로 위치/기울기 (인덱스별 부채꼴)
function yutStickVars(i) {
  const tx = ((i - 1.5) * 8).toFixed(0);
  const rz = ((i - 1.5) * 7).toFixed(0);
  return `--tx:${tx}px;--rz:${rz}deg`;
}

// 담요 위 윷가락 4개 (정지 상태) HTML. up=평평한 면(표식없음)이 위
function yutSticksHTML(flats) {
  const f = flats || [true, true, true, true];
  return f.map((fl, i) => `<div class="yut-stick clay ${fl ? "up" : "down"}" style="${yutStickVars(i)}">${YUT_STICK_FACES}</div>`).join("");
}

let _yutBoardResultShown = "";

function yutThrowResultHTML(name) {
  const label = String(name || "").trim();
  if (!label || label === "-") {
    _yutBoardResultShown = "";
    return "";
  }
  const moveByName = { 도: 1, 개: 2, 걸: 3, 윷: 4, 모: 5 };
  const move = moveByName[label];
  const isNew = label !== _yutBoardResultShown;
  _yutBoardResultShown = label;
  return `<div class="yut-mat-result${isNew ? " pop" : ""}" aria-live="polite">
    <span class="yut-mat-result-name">${label}</span>
    ${move ? `<span class="yut-mat-result-move">${move}칸</span>` : ""}
  </div>`;
}

const YUT_CLICK_ARROW = '<span class="yut-move-arrow" aria-hidden="true"></span>';

function yutBoardHTML() {
  const y = state.yut;
  const interactive = y.phase === "move" && y.turn === "you";
  const movable = interactive ? new Set(yutGroups("you").filter((p) => p !== -1).map(String)) : new Set();
  const nodes = Object.keys(YUT_NODES).map((id) => {
    const p = YUT_NODES[id];
    const big = YUT_CORNERS.has(+id) ? " big" : "";
    const start = +id === 0 ? " start" : "";
    return `<div class="yut-node${big}${start}" style="left:${p.x}%;top:${p.y}%"></div>`;
  }).join("");
  const tokens = [];
  ["you", "ai"].forEach((owner) => {
    const byPos = {};
    y.pieces[owner].forEach((pos) => { if (pos >= 0 && pos !== YUT_HOME) byPos[pos] = (byPos[pos] || 0) + 1; });
    Object.keys(byPos).forEach((pos) => {
      const p = YUT_NODES[pos];
      if (!p) return;
      const cnt = byPos[pos];
      const click = owner === "you" && movable.has(pos) ? " clickable" : "";
      tokens.push(`<div class="yut-token ${owner}${click}" data-group="${pos}" style="left:${p.x}%;top:${p.y}%">${cnt > 1 ? `<span class="yut-token-badge">${cnt}</span>` : ""}${click ? YUT_CLICK_ARROW : ""}</div>`);
    });
  });
  return `<div class="yut-board">${nodes}${tokens.join("")}</div>`;
}

function yutTokenPickHTML() {
  const sel = state.yut?.tokenYou;
  const opts = Object.keys(YUT_TOKENS).map((id) => {
    const t = YUT_TOKENS[id];
    const on = +id === sel ? " sel" : "";
    return `<button type="button" class="yut-token-opt${on}" data-token="${id}" aria-pressed="${+id === sel}">
      <img src="${YUT_IMG(t.file)}" alt="${t.name} 말">
      <span>${t.name}</span>
    </button>`;
  }).join("");
  return `<div class="yut-token-pick"><p class="yut-token-pick-title">어떤 말로 놀까요?</p><div class="yut-token-options">${opts}</div></div>`;
}

function yutOnlineNextTurnIndex(players, fromIndex) {
  if (!players.length) return 0;
  let idx = fromIndex;
  for (let i = 0; i < players.length; i++) {
    idx = (idx + 1) % players.length;
    if (!players[idx].finished) return idx;
  }
  return fromIndex;
}

function yutOnlineSubscribeRoom(roomId) {
  if (_yutRoomUnsub) _yutRoomUnsub();
  _yutRoomUnsub = window.KCultureFirebase.subscribeYutRoom(roomId, (room) => {
    if (!state.yutOnline) return;
    const prevPhase = state.yutOnline.room?.phase;
    state.yutOnline.room = room;
    if (room?.phase === "throw" && prevPhase === "token_pick_turn" && room?.startedAt) {
      Swal.fire("게임시작!", "모든 플레이어가 말을 선택해 게임을 시작합니다!", "success");
    }
    if (state.current === "stage4_a1") render();
  });
}

function yutOnlineMakePlayer() {
  return {
    accountId: state.userProfile.accountId,
    name: state.userProfile.name || `${state.userProfile.number || ""}번`,
    tokenId: null,
    pieces: [-1, -1, -1, -1],
    homed: 0,
    finished: false
  };
}

function yutOnlineGroups(player) {
  const set = new Set();
  (player?.pieces || []).forEach((p) => {
    if (p !== YUT_HOME) set.add(p);
  });
  return [...set];
}

function yutOnlineCanEnter(player) {
  return (player?.pieces || []).some((p) => p === -1);
}

function yutOnlineHasToken(player) {
  return [1, 2, 3].includes(Number(player?.tokenId));
}

function yutOnlineNextTokenPickIndex(players) {
  return (players || []).findIndex((p) => !yutOnlineHasToken(p));
}

function yutOnlineAllTokensPicked(players) {
  return (players || []).length >= 2 && (players || []).every((p) => yutOnlineHasToken(p));
}

function yutOnlineHostName(room) {
  const hostId = room?.hostAccountId;
  const host = (room?.players || []).find((p) => p.accountId === hostId);
  return host?.name || "알 수 없음";
}

function yutOnlinePlayerNames(room) {
  const names = (room?.players || [])
    .map((p) => String(p?.name || "").trim())
    .filter(Boolean);
  return names.length ? names.join(", ") : "없음";
}

function yutOnlineRoomListStatus(room) {
  if (room?.status === "playing" || room?.status === "token_pick") return "진행중";
  if ((room?.players || []).length >= 3) return "가득 참";
  return "대기중";
}

function yutOnlineCanJoinListedRoom(room) {
  return room?.status === "waiting" && (room?.players || []).length < 3;
}

async function yutOnlineFetchWaitingRooms() {
  if (!(state.userProfile?.classKey || state.userProfile?.classCode)) return [];
  const fb = window.KCultureFirebase;
  if (!fb?.isReady()) return [];
  const classKey = state.userProfile.classKey || state.userProfile.classCode;
  const meId = state.userProfile.accountId;
  try {
    let onlineIds = new Set();
    try {
      const presence = await fb.getClassPresence(classKey);
      onlineIds = new Set((presence || []).map((p) => p.accountId).filter(Boolean));
    } catch (err) {
      console.warn("[수호대] 접속 현황 조회 실패:", err);
    }
    // 방 목록을 보는 본인은 접속 중으로 포함
    if (meId) onlineIds.add(meId);

    if (typeof fb.pruneYutRoomsByPresence === "function") {
      return (await fb.pruneYutRoomsByPresence(classKey, [...onlineIds]))
        .slice()
        .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
    }

    const rooms = await fb.listJoinableYutRooms(classKey);
    return rooms
      .map((room) => ({
        ...room,
        players: (room.players || []).filter((p) => onlineIds.has(p.accountId))
      }))
      .filter((room) => (room.players || []).length > 0)
      .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
  } catch (err) {
    console.warn("[수호대] 윷놀이 방 목록 불러오기 실패:", err);
    return [];
  }
}

async function yutOnlineJoinRoom(roomId) {
  const fb = window.KCultureFirebase;
  const me = yutOnlineMakePlayer();
  const room = await fb.getYutRoom(roomId);
  if (!room || room.status !== "waiting") return false;
  const players = Array.isArray(room.players) ? room.players.slice() : [];
  const existsIdx = players.findIndex((p) => p.accountId === me.accountId);
  if (existsIdx < 0 && players.length >= 3) return false;
  if (existsIdx < 0) players.push(me);
  else players[existsIdx] = { ...players[existsIdx], name: me.name };
  await fb.upsertYutRoom(roomId, {
    players,
    phase: room.status === "waiting"
      ? (yutOnlineNextTokenPickIndex(players) < 0 ? "lobby" : "token_pick_turn")
      : room.phase,
    tokenPickIndex: room.status === "waiting"
      ? Math.max(0, yutOnlineNextTokenPickIndex(players))
      : (room.tokenPickIndex || 0),
    updatedAt: new Date().toISOString()
  });
  state.yutOnline = {
    mode: "online",
    roomId,
    room: null,
    roomLabel: room.displayName || "윷놀이 온라인 대결",
    availableRooms: state.yutOnline?.availableRooms || []
  };
  yutOnlineSubscribeRoom(roomId);
  return true;
}

async function yutOnlineCreateRoom() {
  if (!(state.userProfile?.classKey || state.userProfile?.classCode) || !state.userProfile?.accountId) return false;
  const fb = window.KCultureFirebase;
  if (!fb?.isReady()) return false;
  const classKey = state.userProfile.classKey || state.userProfile.classCode;
  const rooms = await yutOnlineFetchWaitingRooms();
  const waitingCount = rooms.filter((room) => room.status === "waiting").length;
  const displayIndex = waitingCount + 1;
  const displayName = `윷놀이 온라인 대결 ${displayIndex}`;
  const roomId = await fb.createYutRoom({
    classKey,
    status: "waiting",
    phase: "token_pick_turn",
    displayName,
    hostAccountId: state.userProfile.accountId,
    players: [yutOnlineMakePlayer()],
    turnIndex: 0,
    tokenPickIndex: 0,
    lastRoll: "-"
  });
  if (!roomId) return false;
  state.yutOnline = {
    mode: "online",
    roomId,
    room: null,
    roomLabel: displayName,
    availableRooms: rooms
  };
  yutOnlineSubscribeRoom(roomId);
  return true;
}

async function yutOnlineStartGame() {
  const room = state.yutOnline?.room;
  if (!room) return;
  const players = (room.players || []).slice();
  if (players.length < 2) {
    Swal.fire("앗!", "2명 이상 모여야 시작할 수 있어요.", "warning");
    return;
  }
  if (!yutOnlineAllTokensPicked(players)) {
    Swal.fire("앗!", "모두 말을 고른 뒤에 시작할 수 있어요.", "warning");
    return;
  }
  await window.KCultureFirebase.upsertYutRoom(state.yutOnline.roomId, {
    status: "playing",
    phase: "first_roll",
    players: players.map((p) => ({
      ...p,
      pieces: [-1, -1, -1, -1],
      homed: 0,
      finished: false
    })),
    turnIndex: 0,
    lastRoll: "-",
    pending: [],
    bonus: 0,
    selectedResultIndex: 0,
    nodeApproach: {},
    lastName: "-",
    lastFlats: [true, true, true, true],
    firstCandidates: players.map((p) => p.accountId),
    firstRolls: {},
    tokenPickIndex: 0,
    actionMessage: "선/후 결정을 시작합니다. 각자 윷을 던져 주세요.",
    updatedAt: new Date().toISOString()
  });
}

function yutOnlineFirstCandidates(room, players) {
  const list = (room?.firstCandidates || []).filter(Boolean);
  if (list.length) return list;
  return (players || room?.players || []).map((p) => p.accountId).filter(Boolean);
}

function yutOnlineResolveFirstTurn(room, players, firstRolls, firstCandidates) {
  const ids = (players || []).map((p) => p.accountId).filter(Boolean);
  const candidates = (firstCandidates || ids).filter((id) => ids.includes(id));
  if (!candidates.length) return null;
  if (!candidates.every((id) => Number(firstRolls?.[id]?.move) > 0)) return null;

  const entries = players.map((p) => ({
    player: p,
    move: Number(firstRolls[p.accountId]?.move || 0)
  }));
  if (entries.some((e) => e.move <= 0)) return null;

  const moveSet = new Set(entries.map((e) => e.move));
  if (moveSet.size === entries.length) {
    const ordered = entries.slice().sort((a, b) => b.move - a.move).map((e) => e.player);
    return {
      players: ordered,
      phase: "throw",
      tokenPickIndex: 0,
      turnIndex: 0,
      firstCandidates: [],
      firstRolls: {},
      lastRoll: "선/후 결정 완료",
      actionMessage: `${ordered[0]?.name || "첫 번째 플레이어"}부터 윷을 던집니다.`
    };
  }

  const byMove = new Map();
  entries.forEach((e) => {
    const list = byMove.get(e.move) || [];
    list.push(e.player.accountId);
    byMove.set(e.move, list);
  });
  const tied = [...byMove.entries()]
    .filter(([, list]) => list.length > 1)
    .sort((a, b) => b[0] - a[0])[0];
  const tiedIds = tied ? tied[1] : ids;
  const nextRolls = { ...(firstRolls || {}) };
  tiedIds.forEach((id) => { delete nextRolls[id]; });

  return {
    phase: "first_roll",
    firstCandidates: tiedIds,
    firstRolls: nextRolls,
    lastRoll: "동점! 다시 던지기",
    actionMessage: "같은 결과가 나와서 다시 던집니다."
  };
}

async function yutOnlinePickToken(tokenId) {
  const room = state.yutOnline?.room;
  if (!room) return;
  const meId = state.userProfile?.accountId;
  const players = (room.players || []).slice();
  const waitingPick = room.status === "waiting";
  const playingPick = room.status === "playing" && room.phase === "token_pick_turn";
  if (!waitingPick && !playingPick) return;
  if (waitingPick && room.phase !== "token_pick_turn") return;
  const pickIndex = Number(room.tokenPickIndex || 0);
  const picker = players[pickIndex];
  if (!picker || picker.accountId !== meId) return;
  const used = new Set(players.map((p) => p.tokenId).filter((id) => [1, 2, 3].includes(Number(id))));
  if (used.has(tokenId)) {
    Swal.fire("앗!", "이미 다른 친구가 선택한 말이야!", "warning");
    return;
  }
  players[pickIndex] = { ...picker, tokenId };
  const nextPick = yutOnlineNextTokenPickIndex(players);
  const everyonePicked = nextPick < 0;
  const tokenName = YUT_TOKENS[tokenId]?.name || "말";
  const nextPicker = everyonePicked ? null : players[nextPick];
  await window.KCultureFirebase.upsertYutRoom(state.yutOnline.roomId, {
    players,
    status: waitingPick ? "waiting" : "playing",
    phase: everyonePicked
      ? (waitingPick ? "lobby" : "throw")
      : "token_pick_turn",
    tokenPickIndex: everyonePicked ? 0 : nextPick,
    turnIndex: waitingPick ? 0 : (room.turnIndex || 0),
    startedAt: (!waitingPick && everyonePicked) ? new Date().toISOString() : (room.startedAt || null),
    actionMessage: everyonePicked
      ? (waitingPick
        ? "모두 말을 골랐어요. 방장이 게임 시작을 눌러 주세요."
        : "모든 플레이어가 말을 선택했습니다.")
      : `${picker.name}이(가) ${tokenName}를 골랐어요. 다음은 ${nextPicker?.name || "다음 친구"} 차례예요.`,
    updatedAt: new Date().toISOString()
  });
}

async function yutOnlineRollForFirst() {
  if (!state.yutOnline?.room || !state.userProfile?.accountId) return;
  const fb = window.KCultureFirebase;
  const room = state.yutOnline.room;
  if (room.status !== "playing" || room.phase !== "first_roll") return;
  const meId = state.userProfile.accountId;
  const players = (room.players || []).slice();
  const firstCandidates = yutOnlineFirstCandidates(room, players);
  if (!firstCandidates.includes(meId)) return;
  if ((room.firstRolls || {})[meId]) return;

  const roll = rollYut();
  playSound("yut_throw.mp3");
  const firstBtn = document.getElementById("yutOnlineFirstRollBtn");
  if (firstBtn) firstBtn.disabled = true;
  await new Promise((resolve) => yutShowThrow(roll.flats, resolve));

  try {
    const patch = await fb.runYutRoomTransaction(state.yutOnline.roomId, (live) => {
      if (!live || live.status !== "playing" || live.phase !== "first_roll") return null;
      const livePlayers = live.players || [];
      const candidates = yutOnlineFirstCandidates(live, livePlayers);
      if (!candidates.includes(meId)) return null;
      const firstRolls = { ...(live.firstRolls || {}) };
      if (firstRolls[meId]) return null;
      firstRolls[meId] = { move: roll.move, name: roll.name };
      const baseUpdate = {
        firstRolls,
        lastName: roll.name,
        lastFlats: roll.flats,
        lastRoll: `${state.userProfile.name || "나"} 선후: ${roll.name}`,
        actionMessage: `${state.userProfile.name || "누군가"}가 선/후 결정을 위해 ${roll.name}를 던졌습니다.`,
        updatedAt: new Date().toISOString()
      };
      const resolved = yutOnlineResolveFirstTurn(live, livePlayers, firstRolls, candidates);
      return resolved ? { ...baseUpdate, ...resolved } : baseUpdate;
    });
    if (patch && state.yutOnline) state.yutOnline.room = { ...state.yutOnline.room, ...patch };
  } catch (_) {
    if (firstBtn) firstBtn.disabled = false;
  }
}

async function yutOnlineRollAndMove() {
  if (!state.yutOnline?.room || !state.userProfile?.accountId) return;
  const fb = window.KCultureFirebase;
  const room = state.yutOnline.room;
  const players = (room.players || []).slice();
  const meId = state.userProfile.accountId;
  const turnPlayer = players[room.turnIndex];
  if (!turnPlayer || turnPlayer.accountId !== meId) return;
  if (room.phase === "over" || room.status !== "playing" || room.phase !== "throw") return;

  const roll = rollYut();
  playSound("yut_throw.mp3");
  const rollBtn = document.getElementById("yutOnlineRollBtn");
  if (rollBtn) rollBtn.disabled = true;
  await new Promise((resolve) => yutShowThrow(roll.flats, resolve));
  const idx = players.findIndex((p) => p.accountId === meId);
  if (idx < 0) return;
  const pending = Array.isArray(room.pending) ? room.pending.slice() : [];
  pending.push(roll.move);
  const nextPhase = (roll.move === 4 || roll.move === 5) ? "throw" : "move";
  await fb.upsertYutRoom(state.yutOnline.roomId, {
    pending,
    selectedResultIndex: 0,
    phase: nextPhase,
    lastName: roll.name,
    lastFlats: roll.flats,
    lastRoll: `${turnPlayer.name}: ${roll.name}`,
    updatedAt: new Date().toISOString()
  });
}

function yutOnlineApplyMove(room, players, playerIdx, groupPos, resultIdx) {
  const me = { ...players[playerIdx], pieces: (players[playerIdx].pieces || []).slice() };
  const pending = Array.isArray(room.pending) ? room.pending.slice() : [];
  const step = pending[resultIdx];
  if (step == null) return null;
  const approach = room.nodeApproach || {};
  const { dest, landPrev } = yutMoveCalc(groupPos, step, approach);

  if (groupPos === -1) {
    const i = me.pieces.indexOf(-1);
    if (i < 0) return null;
    me.pieces[i] = dest;
  } else {
    me.pieces = me.pieces.map((p) => (p === groupPos ? dest : p));
  }
  const nodeApproach = { ...approach };
  if (dest >= 0 && dest !== YUT_HOME) nodeApproach[dest] = landPrev;

  let bonus = Number(room.bonus || 0);
  players[playerIdx] = me;

  if (dest !== YUT_HOME) {
    players.forEach((p, idx) => {
      if (idx === playerIdx) return;
      const pieces = (p.pieces || []).slice();
      let captured = false;
      for (let i = 0; i < pieces.length; i++) {
        if (pieces[i] === dest) {
          pieces[i] = -1;
          captured = true;
        }
      }
      if (captured) {
        bonus += 1;
        players[idx] = { ...p, pieces, homed: pieces.filter((x) => x === YUT_HOME).length, finished: false };
      }
    });
  }

  pending.splice(resultIdx, 1);
  const homed = me.pieces.filter((x) => x === YUT_HOME).length;
  players[playerIdx] = { ...me, homed, finished: homed >= 4 };

  return { players, pending, nodeApproach, bonus };
}

async function yutOnlineSelectResultChip(resultIdx) {
  const room = state.yutOnline?.room;
  const meId = state.userProfile?.accountId;
  if (!room || room.phase !== "move") return;
  const turnPlayer = (room.players || [])[room.turnIndex];
  if (!turnPlayer || turnPlayer.accountId !== meId) return;
  await window.KCultureFirebase.upsertYutRoom(state.yutOnline.roomId, {
    selectedResultIndex: Math.max(0, Number(resultIdx) || 0),
    updatedAt: new Date().toISOString()
  });
}

async function yutOnlineMovePiece(groupPos) {
  const room = state.yutOnline?.room;
  const meId = state.userProfile?.accountId;
  if (!room || room.status !== "playing" || room.phase !== "move") return;
  const players = (room.players || []).map((p) => ({ ...p }));
  const turnPlayer = players[room.turnIndex];
  if (!turnPlayer || turnPlayer.accountId !== meId) return;
  const resultIdx = Math.max(0, Number(room.selectedResultIndex || 0));
  const applied = yutOnlineApplyMove(room, players, room.turnIndex, groupPos, resultIdx);
  if (!applied) return;

  const me = applied.players[room.turnIndex];
  const phaseOver = me.finished || applied.players.filter((p) => !p.finished).length <= 1;
  let nextTurn = room.turnIndex;
  let nextPhase = "move";
  let nextBonus = applied.bonus;

  if (!phaseOver && applied.pending.length === 0) {
    if (nextBonus > 0) {
      nextBonus -= 1;
      nextPhase = "throw";
    } else {
      nextTurn = yutOnlineNextTurnIndex(applied.players, room.turnIndex);
      nextPhase = "throw";
    }
  }

  const updatePayload = {
    players: applied.players,
    pending: applied.pending,
    nodeApproach: applied.nodeApproach,
    bonus: nextBonus,
    selectedResultIndex: 0,
    turnIndex: nextTurn,
    phase: phaseOver ? "over" : nextPhase,
    status: phaseOver ? "closed" : "playing",
    updatedAt: new Date().toISOString()
  };
  await window.KCultureFirebase.upsertYutRoom(state.yutOnline.roomId, updatePayload);

  if (phaseOver && me.accountId === meId && me.finished) {
    state.solved.yut = true;
    saveProgress();
    bindMissionCompleteBtn("stage4_a1", true);
  }
}

function yutOnlineBoardHTML(room) {
  const players = room?.players || [];
  if (!players.length) return "<p class='sub'>참가한 친구가 아직 없어요.</p>";
  const meId = state.userProfile?.accountId;
  const rows = players.map((p, i) => {
    const token = YUT_TOKENS[p.tokenId];
    const tokenName = token?.name || "말 선택 전";
    const tokenImg = token
      ? `<img src="${YUT_IMG(token.file)}" alt="${tokenName}" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;margin-right:6px;">`
      : "";
    const homed = Number(p.homed || 0);
    const waiting = (p.pieces || []).filter((x) => x === -1).length;
    const picked = !!token;
    const posText = p.finished
      ? "완주!"
      : picked
        ? `골인 ${homed}/4 · 대기 ${waiting}`
        : "말을 고르는 중";
    const turn = room.turnIndex === i && room.phase !== "over" ? " (차례)" : "";
    const mine = p.accountId === meId ? " style='font-weight:800;'" : "";
    return `<li${mine}>${tokenImg}${p.name} · ${tokenName}${picked ? ` - ${posText}` : ""}${turn}</li>`;
  }).join("");
  return `<ul style="margin:0;padding-left:18px;line-height:1.6;">${rows}</ul>`;
}

const YUT_ONLINE_PATH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function yutOnlineBoardMapHTML(room) {
  const nodes = Object.keys(YUT_NODES).map((id) => {
    const p = YUT_NODES[id];
    const big = YUT_CORNERS.has(+id) ? " big" : "";
    const start = +id === 0 ? " start" : "";
    return `<div class="yut-node${big}${start}" style="left:${p.x}%;top:${p.y}%"></div>`;
  }).join("");
  const players = room?.players || [];
  const interactive = room?.status === "playing"
    && room?.phase === "move"
    && (room?.players || [])[room?.turnIndex || 0]?.accountId === state.userProfile?.accountId;
  const selected = Number(room?.selectedResultIndex || 0);
  const pending = Array.isArray(room?.pending) ? room.pending : [];
  const selectedStep = pending[selected];
  const me = players.find((p) => p.accountId === state.userProfile?.accountId);
  const movable = interactive && selectedStep != null
    ? new Set(yutOnlineGroups(me).filter((pos) => {
      if (pos === -1) return yutOnlineCanEnter(me);
      return true;
    }).map(String))
    : new Set();
  const tokenDots = [];
  players.forEach((p, idx) => {
    const byPos = {};
    (p.pieces || []).forEach((pos) => {
      if (pos >= 0 && pos !== YUT_HOME) byPos[pos] = (byPos[pos] || 0) + 1;
    });
    Object.keys(byPos).forEach((posKey) => {
      const point = YUT_NODES[posKey];
      if (!point) return;
      const mineCls = p.accountId === state.userProfile?.accountId ? " you" : " ai";
      const clickable = p.accountId === state.userProfile?.accountId && movable.has(posKey) ? " clickable" : "";
      const tokenFile = YUT_TOKENS[p.tokenId]?.file || YUT_TOKENS[1].file;
      tokenDots.push(`<div class="yut-token${mineCls}${clickable}" data-online-group="${posKey}" style="left:${point.x}%;top:${point.y}%;background-image:url('${YUT_IMG(tokenFile)}')" title="${p.name}">${byPos[posKey] > 1 ? `<span class="yut-token-badge">${byPos[posKey]}</span>` : ""}${clickable ? YUT_CLICK_ARROW : ""}</div>`);
    });
  });
  return `<div class="yut-board">${nodes}${tokenDots.join("")}</div>`;
}

function renderStage4Menu() {
  renderStageActivityMenu(4);
}

function renderStage4Act1() {
  const canOnline = state.studentMode === "registered" && window.KCultureFirebase?.isReady();
  if (canOnline && !state.yutOnline?.mode) {
    app.innerHTML = sceneTemplate("STAGE 4-1 윷놀이", `
      <div class="section-card">
        <h3>윷놀이 모드 선택</h3>
        <p>혼자 플레이(컴퓨터 대전) 또는 우리반 온라인전을 선택하세요.</p>
        <div style="display:grid;gap:10px;">
          <button class="btn primary" id="yutOfflineModeBtn">도깨비와 대결</button>
          <button class="btn" id="yutOnlineModeBtn">우리반 친구들과 대결</button>
        </div>
      </div>
    `);
    setupNavigationAndHelp("우리반 친구들과 온라인 윷놀이도 할 수 있어요.");
    document.getElementById("yutOfflineModeBtn").onclick = () => {
      state.yutOnline = { mode: "offline" };
      yutNewGame();
      render();
    };
    document.getElementById("yutOnlineModeBtn").onclick = async () => {
      // 방이 없어도 방 선택 화면(새 방 만들기)은 항상 열어 둔다
      const rooms = await yutOnlineFetchWaitingRooms();
      state.yutOnline = { mode: "room_pick", availableRooms: rooms };
      render();
    };
    return;
  }

  if (canOnline && state.yutOnline?.mode === "room_pick") {
    const rooms = Array.isArray(state.yutOnline.availableRooms) ? state.yutOnline.availableRooms : [];
    const roomRows = rooms.length
      ? rooms.map((room) => {
        const count = (room.players || []).length;
        const statusText = yutOnlineRoomListStatus(room);
        const canJoin = yutOnlineCanJoinListedRoom(room);
        const hostName = yutOnlineHostName(room);
        const playerNames = yutOnlinePlayerNames(room);
        const label = room.displayName || "윷놀이 온라인 대결";
        const joinLabel = statusText === "진행중" ? "진행중" : (statusText === "가득 참" ? "가득 참" : "참가하기");
        return `
          <div class="yut-room-row" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 12px;border:1px solid rgba(0,0,0,.08);border-radius:12px;background:rgba(255,255,255,.55);">
            <div style="min-width:0;">
              <div style="font-weight:800;">${label}</div>
              <div class="sub" style="margin-top:2px;">상태: ${statusText} · ${count}/3명</div>
              <div class="sub" style="margin-top:2px;">방장: ${hostName}</div>
              <div class="sub" style="margin-top:2px;">친구: ${playerNames}</div>
            </div>
            <button class="btn sm yutOnlineJoinRoomBtn" data-room-id="${room.id}" ${canJoin ? "" : "disabled"}>${joinLabel}</button>
          </div>`;
      }).join("")
      : `<p class="sub" style="margin:0;">진행 중이거나 대기 중인 방이 없어요. 아래에서 새 방을 만들어 보세요!</p>`;
    app.innerHTML = sceneTemplate("STAGE 4-1 윷놀이", `
      <div class="section-card">
        <h3>방 선택</h3>
        <p>이미 만들어진 방에 참가하거나, 새로운 방을 만들 수 있어요. (최대 3명)</p>
        <div style="display:grid;gap:8px;margin:12px 0;">
          ${roomRows}
        </div>
        <div style="display:grid;gap:10px;margin-top:14px;">
          <button class="btn primary" id="yutOnlineCreateRoomBtn">새로운 방 만들기</button>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn" id="yutOnlineRefreshRoomsBtn">새로고침</button>
            <button class="btn ghost" id="yutOnlineRoomPickBackBtn">뒤로</button>
          </div>
        </div>
      </div>
    `);
    setupNavigationAndHelp("방장 이름을 보고 참가하거나, 새 방을 만들어 친구를 기다려요.");
    app.querySelectorAll(".yutOnlineJoinRoomBtn").forEach((btn) => {
      btn.onclick = async () => {
        const roomId = btn.dataset.roomId;
        btn.disabled = true;
        const ok = await yutOnlineJoinRoom(roomId);
        if (!ok) {
          btn.disabled = false;
          Swal.fire("앗!", "방에 참가하지 못했어. 방이 가득 찼거나 이미 시작됐을 수 있어요.", "warning");
          try {
            state.yutOnline.availableRooms = await yutOnlineFetchWaitingRooms();
          } catch { /* keep previous list */ }
          render();
          return;
        }
        render();
      };
    });
    document.getElementById("yutOnlineCreateRoomBtn").onclick = async (e) => {
      const createBtn = e.currentTarget;
      createBtn.disabled = true;
      const ok = await yutOnlineCreateRoom();
      if (!ok) {
        createBtn.disabled = false;
        return Swal.fire("앗!", "새 방을 만들지 못했어. 다시 시도해줘!", "warning");
      }
      render();
    };
    document.getElementById("yutOnlineRefreshRoomsBtn").onclick = async () => {
      const rooms = await yutOnlineFetchWaitingRooms();
      state.yutOnline.availableRooms = rooms;
      render();
    };
    document.getElementById("yutOnlineRoomPickBackBtn").onclick = () => {
      state.yutOnline = null;
      render();
    };
    return;
  }

  if (canOnline && state.yutOnline?.mode === "online") {
    const room = state.yutOnline.room;
    if (!room) {
      app.innerHTML = sceneTemplate("STAGE 4-1 윷놀이 (온라인)", `
        <div class="section-card">
          <h3>온라인 방 연결 중...</h3>
          <p>방 정보를 불러오는 중이에요. 잠시만 기다려 주세요.</p>
          <button class="btn ghost" id="yutOnlineLeaveBtn">방 나가기</button>
        </div>
      `);
      setupNavigationAndHelp("방 연결이 끝나면 자동으로 온라인 윷놀이 화면으로 바뀝니다.");
      const leaveBtn = document.getElementById("yutOnlineLeaveBtn");
      if (leaveBtn) leaveBtn.onclick = () => {
        yutOnlineLeaveToRoomPick();
        render();
      };
      return;
    }
    const meId = state.userProfile?.accountId;
    const myIndex = (room?.players || []).findIndex((p) => p.accountId === meId);
    const isMyTurn = room && myIndex >= 0 && room.turnIndex === myIndex && room.phase !== "over";
    const isHost = !!room && room.hostAccountId === meId;
    const winner = room?.phase === "over" ? (room.players || []).find((p) => p.finished) : null;
    const statusLabel = room?.status === "waiting"
      ? (room?.phase === "token_pick_turn" ? "말 고르는 중" : "대기중")
      : room?.phase === "token_pick_turn"
        ? "말 선택중"
        : room?.phase === "first_roll"
          ? "선/후 결정"
        : room?.phase === "throw"
          ? "윷 던지기"
          : room?.phase === "move"
            ? "말 이동"
            : room?.phase === "over"
              ? "게임 종료"
              : "진행중";
    const allPicked = yutOnlineAllTokensPicked(room?.players || []);
    const canStart = isHost && room?.status === "waiting" && allPicked;
    const pickPhase = room?.phase === "token_pick_turn";
    const usedTokens = new Set((room?.players || []).map((p) => Number(p.tokenId)).filter((id) => [1, 2, 3].includes(id)));
    const picker = pickPhase
      ? (room.players || [])[Number(room.tokenPickIndex || 0)]
      : null;
    const myPickTurn = !!(picker && picker.accountId === meId);
    const tokenOptions = pickPhase
      ? [1, 2, 3].map((id) => {
        const taken = usedTokens.has(id);
        const t = YUT_TOKENS[id];
        return `<button type="button" class="yut-token-opt yutOnlinePickBtn" data-token="${id}" ${(!myPickTurn || taken) ? "disabled" : ""}>
          <img src="${YUT_IMG(t.file)}" alt="${t.name} 말">
          <span>${t.name}${taken ? " 선택됨" : ""}</span>
        </button>`;
      }).join("")
      : "";
    const firstCandidates = yutOnlineFirstCandidates(room, room?.players || []);
    const firstRolls = room?.firstRolls || {};
    const onlinePlayers = (room?.players || []).slice();
    const mePlayer = onlinePlayers.find((p) => p.accountId === meId) || null;
    const canEnterOnline = room?.phase === "move" && isMyTurn && mePlayer && yutOnlineCanEnter(mePlayer);
    const panelRows = onlinePlayers.map((p) => {
      const isMe = p.accountId === meId;
      const owner = isMe ? "you" : "ai";
      const label = isMe ? "내" : (p.name || "상대");
      const homed = Number(p.homed || 0);
      const waiting = (p.pieces || []).filter((x) => x === -1).length;
      return {
        owner,
        label,
        tokenId: p.tokenId || 1,
        homed,
        waiting
      };
    });
    const canRollFirst = room?.phase === "first_roll"
      && firstCandidates.includes(meId)
      && !firstRolls[meId];
    const firstRollAgain = canRollFirst && String(room?.lastRoll || "").includes("다시");
    const firstRollBtnLabel = firstRollAgain ? "다시 던지기 🎲" : "선/후 결정 윷 던지기 🎲";
    const isPlayingScreen = room?.status === "playing" || room?.phase === "over";
    if (isPlayingScreen) {
      app.innerHTML = sceneTemplate("STAGE 4-1 윷놀이 (온라인)", `
        <div class="yut-game" style="${yutAssetVars()}">
          <div class="yut-left">
            <div class="yut-mat">
              <div class="yut-sticks">${yutSticksHTML(room?.lastFlats)}</div>
              ${yutThrowResultHTML(room?.lastName)}
            </div>
            <div class="yut-actions" id="yutActions">
              ${room?.phase === "token_pick_turn" ? `<div class="yut-token-pick"><div class="yut-token-options">${tokenOptions}</div></div>` : ""}
              ${room?.phase === "first_roll" ? `<button class="btn primary" id="yutOnlineFirstRollBtn" ${canRollFirst ? "" : "disabled"}>${firstRollBtnLabel}</button>` : ""}
              ${room?.phase === "throw" ? `<button class="btn primary" id="yutOnlineRollBtn" ${isMyTurn ? "" : "disabled"}>윷 던지기 🎲</button>` : ""}
            </div>
            <p class="yut-status" id="yutStatus">
              ${winner
    ? `🏆 ${winner.name} 승리!`
    : (room?.phase === "first_roll")
      ? (firstRollAgain
        ? "같은 결과가 나왔어요. 다시 던져 주세요!"
        : (canRollFirst
          ? "선/후를 정하기 위해 윷을 던져 주세요."
          : (firstRolls[meId]
            ? "다른 친구가 던지기를 기다리는 중..."
            : "동점인 친구가 다시 던지는 중이에요.")))
    : (room?.phase === "token_pick_turn" && picker)
      ? (picker.accountId === meId ? "내 차례예요. 말을 선택하세요." : `${picker.name}가 말을 선택하는 중입니다.`)
    : (room?.phase === "move" && isMyTurn)
      ? "오프라인 규칙과 동일: 결과 칩을 고르고 옮길 말을 선택하세요."
      : (room?.phase === "throw" && isMyTurn)
        ? "내 차례예요! 윷을 던지세요."
        : (room?.phase === "throw" && (room.players || [])[room.turnIndex])
          ? `${(room.players || [])[room.turnIndex].name}가 윷을 던지는 중입니다.`
          : (room?.phase === "move" && (room.players || [])[room.turnIndex])
            ? `${(room.players || [])[room.turnIndex].name}가 말을 이동하는 중입니다.`
            : (room?.actionMessage || "친구 차례를 기다리는 중...")}
            </p>
          </div>
          <div class="yut-right">
            ${yutOnlineBoardMapHTML(room)}
            <div class="yut-panel">
              <div class="yut-statusbar">
                <span class="yut-turn">상태 <b>${statusLabel}</b></span>
                <span class="yut-last">최근 <b>${room?.lastRoll || "-"}</b></span>
              </div>
              <div class="yut-homes">
                ${panelRows.map((row) => `<div class="yut-panel-row"><span class="yut-panel-label">${row.label} 골인</span>${yutPanelTokenRowByToken(row.tokenId, row.homed, row.owner)}</div>`).join("")}
              </div>
              ${room?.phase === "move"
    ? `<div class="yut-results" style="margin-top:8px;">결과 칩: ${(room.pending || []).map((r, i) => `<button class="yut-chip${Number(room.selectedResultIndex || 0) === i ? " sel" : ""} yutOnlineChipBtn" data-i="${i}" ${isMyTurn ? "" : "disabled"}>${yutChipLabel(r)}</button>`).join("") || "<span class='sub'>-</span>"}</div>`
    : ""}
              ${room?.phase === "first_roll"
    ? `<div class="yut-results" style="margin-top:8px;">선/후 결과: ${(room.players || []).map((p) => `${p.name} ${firstRolls[p.accountId]?.name || "-"}`).join(" · ")}</div>`
    : ""}
              <div style="margin-top:8px;">
                ${yutOnlineBoardHTML(room)}
              </div>
              <div class="yut-trays" style="margin-top:8px;">
                ${panelRows.map((row) => `<div class="yut-tray"><span class="yut-panel-label">${row.label} 대기</span>${yutPanelTokenRowByToken(row.tokenId, row.waiting, row.owner)}${row.owner === "you" && canEnterOnline ? '<button class="btn ghost sm yut-enter-hint" id="yutOnlineEnterBtn">말 꺼내기</button>' : ""}</div>`).join("")}
              </div>
              <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn" id="yutOnlineRefreshBtn">새로고침</button>
                <button class="btn ghost" id="yutOnlineLeaveBtn">방 나가기</button>
              </div>
            </div>
          </div>
        </div>
      `);
      setupNavigationAndHelp("기존 윷놀이 화면과 비슷한 보드에서 온라인전을 진행해요.");
    } else {
      app.innerHTML = sceneTemplate("STAGE 4-1 윷놀이 (온라인)", `
        <div class="section-card">
          <h3>우리반 온라인전 (최대 3명)</h3>
          <p>대결 이름: <strong>${state.yutOnline.roomLabel || room?.displayName || "윷놀이 온라인 대결"}</strong> · 상태: <strong>${statusLabel}</strong></p>
          <p>먼저 들어온 순서대로 말을 고르고, 모두 고르면 방장이 게임을 시작해요.</p>
          ${yutOnlineBoardHTML(room)}
          <p style="margin-top:12px;font-weight:800;">
            ${picker
              ? (myPickTurn ? "내 차례예요. 말을 고르세요!" : `${picker.name}이(가) 말을 고르는 중이에요.`)
              : (allPicked
                ? "모두 말을 골랐어요. 방장이 게임 시작을 눌러 주세요."
                : "친구를 기다리는 중이에요.")}
          </p>
          ${tokenOptions ? `<div class="yut-token-pick" style="margin-top:8px;"><div class="yut-token-options">${tokenOptions}</div></div>` : ""}
          ${isHost && room?.status === "waiting" && (room?.players || []).length >= 2 && !allPicked
            ? `<p class="sub">모두 말을 고르면 게임 시작 버튼이 켜져요.</p>`
            : ""}
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            ${room?.status === "waiting" ? `<button class="btn primary" id="yutOnlineStartBtn" ${canStart ? "" : "disabled"}>게임 시작</button>` : ""}
            <button class="btn" id="yutOnlineRefreshBtn">새로고침</button>
            <button class="btn ghost" id="yutOnlineLeaveBtn">방 나가기</button>
          </div>
        </div>
      `);
      setupNavigationAndHelp("먼저 들어온 친구부터 말을 고르고, 모두 고르면 방장이 게임을 시작해요.");
    }
    const startBtn = document.getElementById("yutOnlineStartBtn");
    if (startBtn) startBtn.onclick = () => yutOnlineStartGame();
    app.querySelectorAll(".yutOnlinePickBtn").forEach((btn) => {
      btn.onclick = () => yutOnlinePickToken(Number(btn.dataset.token));
      if (!(picker && picker.accountId === meId)) btn.disabled = true;
    });
    const rollBtn = document.getElementById("yutOnlineRollBtn");
    if (rollBtn) rollBtn.onclick = () => yutOnlineRollAndMove();
    const firstRollBtn = document.getElementById("yutOnlineFirstRollBtn");
    if (firstRollBtn) firstRollBtn.onclick = () => yutOnlineRollForFirst();
    app.querySelectorAll(".yutOnlineChipBtn").forEach((btn) => {
      btn.onclick = () => yutOnlineSelectResultChip(Number(btn.dataset.i));
    });
    app.querySelectorAll(".yut-token.clickable[data-online-group]").forEach((token) => {
      token.onclick = () => yutOnlineMovePiece(Number(token.dataset.onlineGroup));
    });
    const enterBtn = document.getElementById("yutOnlineEnterBtn");
    if (enterBtn) enterBtn.onclick = () => yutOnlineMovePiece(-1);
    const refreshBtn = document.getElementById("yutOnlineRefreshBtn");
    if (refreshBtn) refreshBtn.onclick = async () => {
      if (state.yutOnline?.roomId && window.KCultureFirebase?.isReady()) {
        state.yutOnline.room = await window.KCultureFirebase.getYutRoom(state.yutOnline.roomId);
      }
      render();
    };
    const leaveBtn = document.getElementById("yutOnlineLeaveBtn");
    if (leaveBtn) leaveBtn.onclick = () => {
      yutOnlineLeaveToRoomPick();
      render();
    };
    return;
  }

  if (!state.yut || !state.yut.pieces) yutNewGame();
  const y = state.yut;
  const offYou = y.pieces.you.filter((p) => p === -1).length;
  const offAi = y.pieces.ai.filter((p) => p === -1).length;
  const youCanEnter = y.phase === "move" && y.turn === "you" && offYou > 0;
  const chips = y.pending.length
    ? y.pending.map((r, i) => `<button class="yut-chip${y.sel === i ? " sel" : ""}" data-i="${i}" ${y.turn === "you" && y.phase === "move" ? "" : "disabled"}>${yutChipLabel(r)}</button>`).join("")
    : '<span class="sub">-</span>';

  app.innerHTML = sceneTemplate("STAGE 4-1 윷놀이", `
    <div class="yut-game" style="${yutAssetVars()}">
      <div class="yut-left">
        <div class="yut-mat">
          <div class="yut-sticks">${yutSticksHTML(y.lastFlats)}</div>
          ${yutThrowResultHTML(y.lastName)}
        </div>
        <div class="yut-actions" id="yutActions"></div>
        <p class="yut-status" id="yutStatus"></p>
      </div>
      <div class="yut-right">
        ${yutBoardHTML()}
        <div class="yut-panel">
          <div class="yut-statusbar">
            <span class="yut-turn">차례 ${yutTurnTokenHTML(y.turn)}</span>
            <span class="yut-last">윷 <b>${y.lastName}</b></span>
          </div>
          <div class="yut-homes">
            <div class="yut-panel-row"><span class="yut-panel-label">골인</span>${yutPanelTokenRow("you", y.homed.you)}</div>
            <div class="yut-panel-row"><span class="yut-panel-label">골인</span>${yutPanelTokenRow("ai", y.homed.ai)}</div>
          </div>
          <div class="yut-results">결과 칩: ${chips}</div>
          <div class="yut-trays">
            <div class="yut-tray"><span class="yut-panel-label">대기</span>${yutPanelTokenRow("you", offYou)} ${youCanEnter ? '<button class="btn ghost sm yut-enter-hint" id="yutEnter">말 꺼내기</button>' : ""}</div>
            <div class="yut-tray"><span class="yut-panel-label">대기</span>${yutPanelTokenRow("ai", offAi)}</div>
          </div>
        </div>
      </div>
    </div>
  `);
  setupNavigationAndHelp("도깨비와 윷놀이 대결! 윷을 던지고, 결과로 옮길 말을 골라보자!");
  bindMissionCompleteBtn("stage4_a1", !!state.solved.yut);

  const actions = document.getElementById("yutActions");
  const status = document.getElementById("yutStatus");

  if (y.phase === "token") {
    actions.innerHTML = yutTokenPickHTML();
    status.textContent = "토끼, 호랑이, 곰 중 말을 골라요!";
    document.querySelectorAll(".yut-token-opt").forEach((btn) => {
      btn.onclick = () => {
        const pick = +btn.dataset.token;
        state.yut.tokenYou = pick;
        state.yut.phase = "choose";
        render();
      };
    });
    return;
  }
  if (y.phase === "choose") {
    actions.innerHTML = `${yutTokenPickHTML()}<div class="yut-first-pick">
      <button class="btn primary" id="yutFirst">선 (내가 먼저)</button>
      <button class="btn" id="yutSecond">후 (도깨비 먼저)</button>
    </div>`;
    status.textContent = "선·후를 골라 시작해요!";
    document.querySelectorAll(".yut-token-opt").forEach((btn) => {
      btn.onclick = () => {
        const pick = +btn.dataset.token;
        state.yut.tokenYou = pick;
        render();
      };
    });
    document.getElementById("yutFirst").onclick = () => { yutNewGame("you"); state.yut.phase = "throw"; render(); };
    document.getElementById("yutSecond").onclick = () => { yutNewGame("ai"); state.yut.phase = "ai"; render(); yutScheduleAI(yutAIThrow, 500); };
    return;
  }
  if (y.phase === "over") { status.textContent = "게임 종료! 다시 들어오면 새 게임이 시작돼요."; return; }

  if (y.turn === "you" && y.phase === "throw") {
    actions.innerHTML = '<button class="btn primary" id="yutThrow">윷 던지기 🎲</button>';
    document.getElementById("yutThrow").onclick = yutThrowPlayer;
    status.textContent = y.pending.length ? "윷 또는 모! 한 번 더 던지세요!" : "윷을 던지세요!";
  } else if (y.turn === "you" && y.phase === "move") {
    status.textContent = y.pending.length > 1 ? "결과 칩을 고르고, 옮길 말을 클릭하세요!" : "옮길 말을 클릭하세요!";
    document.querySelectorAll(".yut-chip").forEach((c) => { c.onclick = () => { state.yut.sel = +c.dataset.i; render(); }; });
    document.querySelectorAll(".yut-token.clickable").forEach((t) => { t.onclick = () => yutPlayerMove(+t.dataset.group); });
    const enter = document.getElementById("yutEnter");
    if (enter) enter.onclick = () => yutPlayerMove(-1);
  } else {
    status.textContent = "도깨비가 윷을 던지는 중... 👹";
  }
}

// 결과(resIdx)를 owner의 groupPos 말(무리)에 적용
function yutApply(owner, groupPos, resIdx) {
  const y = state.yut;
  const r = y.pending[resIdx];
  const opp = owner === "you" ? "ai" : "you";
  const { dest, landPrev } = yutMoveCalc(groupPos, r, y.nodeApproach);
  if (groupPos === -1) {
    const i = y.pieces[owner].indexOf(-1);
    if (i >= 0) y.pieces[owner][i] = dest;
  } else {
    y.pieces[owner] = y.pieces[owner].map((p) => (p === groupPos ? dest : p));
  }
  yutRecordApproach(dest, landPrev);
  y.pending.splice(resIdx, 1);
  let captured = false;
  if (dest !== YUT_HOME) {
    y.pieces[opp] = y.pieces[opp].map((p) => { if (p === dest) { captured = true; return -1; } return p; });
    if (captured) { y.bonus++; playSound("yut_throw.mp3"); }
  }
  y.homed.you = y.pieces.you.filter((p) => p === YUT_HOME).length;
  y.homed.ai = y.pieces.ai.filter((p) => p === YUT_HOME).length;
  return { captured, homed: dest === YUT_HOME };
}

function yutThrowPlayer() {
  const y = state.yut;
  if (y.turn !== "you" || y.phase !== "throw" || y.throwing) return;
  y.throwing = true;
  const r = rollYut();
  playSound("yut_throw.mp3");
  const btn = document.getElementById("yutThrow");
  if (btn) btn.disabled = true;
  yutShowThrow(r.flats, () => {
    y.throwing = false;
    y.pending.push(r.move);
    y.lastName = r.name;
    y.lastFlats = r.flats;
    if (r.move !== 4 && r.move !== 5) { y.phase = "move"; y.sel = 0; }
    render();
  });
}

function yutPlayerMove(pos) {
  const y = state.yut;
  if (y.phase !== "move" || y.turn !== "you") return;
  const idx = y.sel != null ? y.sel : 0;
  if (y.pending[idx] == null) return;
  yutApply("you", pos, idx);
  if (y.homed.you >= 4) { y.phase = "over"; render(); yutAnnounce("you"); return; }
  if (y.pending.length === 0) {
    if (y.bonus > 0) { y.bonus--; y.phase = "throw"; }
    else { yutEndTurn("ai"); return; }
  }
  y.sel = y.pending.length ? 0 : null;
  render();
}

function yutEndTurn(next) {
  const y = state.yut;
  y.turn = next;
  y.pending = [];
  y.sel = null;
  y.bonus = 0;
  if (next === "ai") { y.phase = "ai"; render(); yutScheduleAI(yutAIThrow, 600); }
  else { y.phase = "throw"; render(); }
}

function yutProgress(p) { return p === -1 ? 0 : p === YUT_HOME ? 200 : p; }

function yutAIThrow() {
  if (state.current !== "stage4_a1" || !state.yut || state.yut.turn !== "ai" || state.yut.phase !== "ai") return;
  const y = state.yut;
  const r = rollYut();
  playSound("yut_throw.mp3");
  yutShowThrow(r.flats, () => {
    if (state.current !== "stage4_a1" || !state.yut || state.yut.turn !== "ai") return;
    y.pending.push(r.move);
    y.lastName = r.name;
    y.lastFlats = r.flats;
    render();
    if (r.move === 4 || r.move === 5) yutScheduleAI(yutAIThrow, 450);
    else yutScheduleAI(yutAIStep, 450);
  });
}

function yutAIStep() {
  if (state.current !== "stage4_a1" || !state.yut || state.yut.turn !== "ai") return;
  const y = state.yut;
  if (y.pending.length === 0) {
    if (y.bonus > 0) { y.bonus--; yutScheduleAI(yutAIThrow, 500); return; }
    yutEndTurn("you");
    return;
  }
  const r = y.pending[0];
  const groups = yutGroups("ai");
  if (!groups.length) { yutEndTurn("you"); return; }
  let best = groups[0], bs = -Infinity;
  for (const p of groups) {
    const { dest } = yutMoveCalc(p, r, y.nodeApproach);
    let s = yutProgress(dest);
    if (dest !== YUT_HOME && y.pieces.you.includes(dest)) s += 100;
    if (dest === YUT_HOME) s += 60;
    if (p === -1) s += 3;
    if (s > bs) { bs = s; best = p; }
  }
  yutApply("ai", best, 0);
  if (y.homed.ai >= 4) { y.phase = "over"; render(); yutAnnounce("ai"); return; }
  render();
  yutScheduleAI(yutAIStep, 850);
}

function yutAnnounce(winner) {
  if (winner === "you") {
    state.solved.yut = true;
    saveProgress();
    bindMissionCompleteBtn("stage4_a1", true);
  } else {
    Swal.fire("아쉬워요", "도깨비가 이겼어요. 다시 도전해봐요!", "info");
  }
}

/* ───────────── 딱지접기: 4단계 영상 따라하기 (assets/images/ddakji/) ───────────── */
const TTAKJI_STEPS = [
  {
    name: "색종이 준비",
    desc: "서로 다른 색 정사각형 색종이 2장을 준비하고 반으로 접어요.",
    file: "ddakji-step1.mp4"
  },
  {
    name: "삼각 날개 접기",
    desc: "양 쪽 끝을 대각선으로 접어요.",
    file: "ddakji-step2.mp4"
  },
  {
    name: "사각접기",
    desc: "날개 끝을 사각형 모양으로 접어요.",
    file: "ddakji-step3.mp4"
  },
  {
    name: "딱지 완성",
    desc: "두 장의 종이를 (+)모양으로 겹쳐 튀어나온 날개를 틈에 끼워 완성해요.",
    file: "ddakji-step4.mp4"
  }
];

let ttakjiGame = null;

function hideTtakjiPraise() {
  const praise = document.getElementById("ttakjiPraise");
  if (!praise) return;
  praise.hidden = true;
  praise.classList.add("hidden");
  const host = document.getElementById("ttakjiPraiseHost");
  if (host && praise.parentElement !== host) host.appendChild(praise);
}

function isTtakjiVideoFinished(video) {
  if (!video) return false;
  if (video.ended) return true;
  const duration = video.duration;
  const t = video.currentTime;
  if (!Number.isFinite(duration) || duration <= 0) return false;
  if (!Number.isFinite(t) || t < 0.5) return false;
  return duration - t <= 0.4;
}

function stopTtakjiVideo() {
  hideTtakjiPraise();
  if (!ttakjiGame) return;
  const { mainVideo, onFullscreenChange } = ttakjiGame;
  if (onFullscreenChange) {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
  }
  if (mainVideo) {
    mainVideo.pause();
    mainVideo.removeAttribute("src");
    mainVideo.removeAttribute("srcObject");
    mainVideo.load();
  }
  ttakjiGame = null;
}

function renderStage4Act2() {
  stopTtakjiVideo();
  if (!Array.isArray(state.ttakjiWatched) || state.ttakjiWatched.length !== TTAKJI_STEPS.length) {
    state.ttakjiWatched = TTAKJI_STEPS.map(() => false);
  }
  if (state.ttakjiStep == null || state.ttakjiStep >= TTAKJI_STEPS.length) state.ttakjiStep = -1;

  const watchedCount = state.ttakjiWatched.filter(Boolean).length;
  const expanded = state.ttakjiStep >= 0;
  const activeStep = expanded ? TTAKJI_STEPS[state.ttakjiStep] : null;

  app.innerHTML = sceneTemplate("STAGE 4-2 딱지접기", `
    <div class="ttakji-tutorial">
      <div class="ttakji-viewport ${expanded ? "expanded" : ""}" id="ttakjiViewport">
        <div class="ttakji-viewport-placeholder ${expanded ? "hidden" : ""}" id="ttakjiPlaceholder">
          <div class="ttakji-intro-talk">
            <div class="ttakji-intro-bear-wrap">
              <img class="ttakji-intro-bear" src="${CHAR_IMG("bear.png")}" alt="곰" draggable="false" />
            </div>
            <div class="ttakji-intro-bubble">
              <p class="ttakji-intro-text">우리 딱지를 접어 친구들과 딱지치기를 해 볼까?</p>
              <p class="ttakji-intro-text">색종이 2장을 준비해.</p>
              <p class="ttakji-intro-text">아래 단계 버튼을 차례로 눌러 따라 접어보자.</p>
            </div>
          </div>
        </div>
        <div class="ttakji-player ${expanded ? "open" : ""}" id="ttakjiPlayer">
          <video id="ttakjiMainVideo" class="ttakji-main-video" playsinline webkit-playsinline preload="metadata"></video>
          <div class="ttakji-player-info">
            <div class="ttakji-stepname" id="ttakjiStepName">${activeStep ? `${state.ttakjiStep + 1}. ${activeStep.name}` : ""}</div>
            <div class="ttakji-stepdesc" id="ttakjiStepDesc">${activeStep ? activeStep.desc : ""}</div>
          </div>
          <button type="button" class="btn primary ttakji-replay-btn hidden" id="ttakjiReplay">다시 보기</button>
          <button type="button" class="btn primary ttakji-finish-btn hidden" id="ttakjiFinish">완성!</button>
        </div>
      </div>
      <div class="ttakji-grid" id="ttakjiGrid">
        ${TTAKJI_STEPS.map((s, idx) => `
          <div class="ttakji-card ${state.ttakjiWatched[idx] ? "done" : ""} ${state.ttakjiStep === idx ? "active" : ""}" data-step="${idx}">
            <button type="button" class="ttakji-card-btn" data-step="${idx}" aria-label="${idx + 1}단계 ${s.name}">
              <span class="ttakji-card-num">${idx + 1}</span>
              <span class="ttakji-card-label">${s.name}</span>
            </button>
            <div class="ttakji-card-preview" aria-hidden="true">
              <span class="ttakji-thumb-static">▶ ${idx + 1}</span>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="ttakji-progress" id="ttakjiProg">${watchedCount} / ${TTAKJI_STEPS.length} 단계 완료</div>
      <div id="ttakjiPraiseHost">
        <div class="ttakji-praise hidden" id="ttakjiPraise" hidden>
          <div class="ttakji-praise-card">
            <div class="ttakji-praise-talk">
              <img class="ttakji-praise-bear" src="${CHAR_IMG("bear.png")}" alt="곰" draggable="false" />
              <div class="ttakji-praise-bubble">
                <p class="ttakji-praise-text">딱지를 참 잘 만들었구나!</p>
                <p class="ttakji-praise-text">이제 친구들과 딱지치기 해볼까?</p>
              </div>
            </div>
            <button type="button" class="btn primary ttakji-praise-done" id="ttakjiPraiseDone">딱지접기 완성!</button>
          </div>
        </div>
      </div>
    </div>
  `);
  setupNavigationAndHelp("4단계 영상을 모두 끝까지 본 뒤, 완성 버튼을 눌러 보물을 되찾자!");
  bindMissionCompleteBtn("stage4_a2", !!state.solved.ttakji);

  const mainVideo = document.getElementById("ttakjiMainVideo");
  const replayBtn = document.getElementById("ttakjiReplay");
  const finishBtn = document.getElementById("ttakjiFinish");
  const praise = document.getElementById("ttakjiPraise");
  const praiseDone = document.getElementById("ttakjiPraiseDone");
  const viewport = document.getElementById("ttakjiViewport");
  const placeholder = document.getElementById("ttakjiPlaceholder");
  const player = document.getElementById("ttakjiPlayer");
  const nameEl = document.getElementById("ttakjiStepName");
  const descEl = document.getElementById("ttakjiStepDesc");
  const progEl = document.getElementById("ttakjiProg");

  mainVideo.playsInline = true;
  mainVideo.setAttribute("playsinline", "");
  mainVideo.setAttribute("webkit-playsinline", "true");
  ttakjiGame = { mainVideo, videoEndHandled: false, onFullscreenChange: null };

  const updateCards = () => {
    const count = state.ttakjiWatched.filter(Boolean).length;
    progEl.textContent = `${count} / ${TTAKJI_STEPS.length} 단계 완료`;
    document.querySelectorAll(".ttakji-card").forEach((card, idx) => {
      card.classList.toggle("done", state.ttakjiWatched[idx]);
      card.classList.toggle("active", state.ttakjiStep === idx);
    });
  };

  const hideEndButtons = () => {
    replayBtn.classList.add("hidden");
    finishBtn.classList.add("hidden");
    player.classList.remove("ttakji-player--ended");
  };

  const showEndButtons = () => {
    replayBtn.classList.remove("hidden");
    if (state.ttakjiWatched.every(Boolean)) finishBtn.classList.remove("hidden");
    else finishBtn.classList.add("hidden");
    player.classList.add("ttakji-player--ended");
  };

  const playStepVideo = (idx, { restart = true } = {}) => {
    const step = TTAKJI_STEPS[idx];
    if (!step) return;
    state.ttakjiStep = idx;
    playSound("click.mp3");
    if (ttakjiGame) ttakjiGame.videoEndHandled = true;
    hideEndButtons();
    hideTtakjiPraise();
    viewport.classList.add("expanded");
    placeholder.classList.add("hidden");
    player.classList.add("open");
    nameEl.textContent = `${idx + 1}. ${step.name}`;
    descEl.textContent = step.desc;
    updateCards();

    const src = DDAKJI_VIDEO(step.file);
    if (mainVideo.getAttribute("src") !== src) {
      mainVideo.pause();
      mainVideo.src = src;
      mainVideo.load();
    }
    if (restart) {
      try { mainVideo.currentTime = 0; } catch (_) {}
    }
    if (ttakjiGame) ttakjiGame.videoEndHandled = false;
    mainVideo.play().catch(() => {});
  };

  const markWatched = (idx) => {
    if (!state.ttakjiWatched[idx]) {
      state.ttakjiWatched[idx] = true;
      updateCards();
      playSound("paper_fold.mp3");
    }
  };

  const handleTtakjiVideoEnded = () => {
    if (ttakjiGame?.videoEndHandled) return;
    if (!isTtakjiVideoFinished(mainVideo) && !mainVideo.ended) return;
    if (ttakjiGame) ttakjiGame.videoEndHandled = true;
    try { mainVideo.pause(); } catch (_) {}
    if (state.ttakjiStep >= 0) markWatched(state.ttakjiStep);
    showEndButtons();
  };

  const showPraise = () => {
    if (!praise) return;
    try { mainVideo.pause(); } catch (_) {}
    hideEndButtons();
    document.body.appendChild(praise);
    praise.hidden = false;
    praise.classList.remove("hidden");
    playSound("correct.mp3");
  };

  mainVideo.addEventListener("ended", handleTtakjiVideoEnded);
  mainVideo.addEventListener("timeupdate", () => {
    if (isTtakjiVideoFinished(mainVideo)) handleTtakjiVideoEnded();
  });
  mainVideo.addEventListener("pause", () => {
    if (isTtakjiVideoFinished(mainVideo)) handleTtakjiVideoEnded();
  });
  mainVideo.addEventListener("webkitendfullscreen", handleTtakjiVideoEnded);
  ttakjiGame.onFullscreenChange = () => {
    if (isTtakjiVideoFinished(mainVideo)) handleTtakjiVideoEnded();
  };
  document.addEventListener("fullscreenchange", ttakjiGame.onFullscreenChange);

  replayBtn.onclick = () => {
    if (ttakjiGame) ttakjiGame.videoEndHandled = true;
    hideEndButtons();
    try { mainVideo.currentTime = 0; } catch (_) {}
    if (ttakjiGame) ttakjiGame.videoEndHandled = false;
    mainVideo.play().catch(() => {});
  };

  finishBtn.onclick = () => {
    if (!state.ttakjiWatched.every(Boolean)) return;
    showPraise();
  };

  if (praiseDone) {
    praiseDone.onclick = () => {
      hideTtakjiPraise();
      state.solved.ttakji = true;
      saveProgress();
      bindMissionCompleteBtn("stage4_a2", true);
    };
  }

  document.getElementById("ttakjiGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step]");
    if (!btn) return;
    playStepVideo(Number(btn.dataset.step));
  });

  if (expanded) playStepVideo(state.ttakjiStep, { restart: false });
}

function renderStage4Act3() {
  if (!state.rhythm) state.rhythm = { screen: "song", song: null, level: 1 };

  const screens = {
    song: renderRhythmSongSelect,
    levels: renderRhythmLevelSelect,
    semachi: renderRhythmSemachiPractice,
    play: renderRhythmPlay,
    ending: renderRhythmEnding
  };
  (screens[state.rhythm.screen] || renderRhythmSongSelect)();
}

/* ───── 탈춤놀이: 저스트 댄스식 모션 게임 (MediaPipe Pose + 장구 장단) ─────
  * 참고: 초등학교 음악 탈춤 기본 동작.
 * 동작 가이드 샘플 영상: assets/images/talchum/*.mp4 (메인 화면)
 * 유저 PiP: 카메라 미러 영상
 * 점수: 현재 샘플 동작과 사용자 자세 일치도로 계산
 */

// BlazePose 33 landmark 인덱스
const TC_LM = {
  nose: 0,
  Lshoulder: 11, Rshoulder: 12,
  Lelbow: 13, Relbow: 14,
  Lwrist: 15, Rwrist: 16,
  Lhip: 23, Rhip: 24,
  Lknee: 25, Rknee: 26,
  Lankle: 27, Rankle: 28
};

const TC_PASS = 0.22;          // 통과 일치도(초등용 — 낮을수록 쉬움)
const TC_LENIENCY = 1.2;       // 감지 점수 보정
const TC_ADVANCE_MS = 700;     // 이 시간만큼 맞추면 다음 동작
const TC_MIN_MOVE_MS = 900;    // 동작당 최소 체류 시간
const TC_REACTION_GRACE_MS = 900; // 동작 시작 후 반응 유예 시간
const TC_MATCH_MEMORY_MS = 550;   // 최근 일치도 기억(살짝 늦어도 인정)
const TC_COUNTIN_SEC = 3;      // 시작 카운트다운(초)
const TC_CYCLE = 1.6;          // 한 장단(초)

const tcClamp = (v, a, b) => Math.min(b, Math.max(a, v));
const tcLerp = (a, b, t) => a + (b - a) * t;
const tcDist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
function tcVisible(lm, ...idx) {
  return idx.every((i) => lm[i] && (lm[i].visibility == null || lm[i].visibility > 0.15));
}
function tcShoulderWidth(lm) {
  return tcDist(lm[TC_LM.Lshoulder], lm[TC_LM.Rshoulder]) || 0.001;
}

// 탈춤 기본 5동작 감지 (교과서 기준). landmarks → 0~1 일치도, 어린이용으로 아주 후하게.

// 1. 불림 — 앉았다 일어서기(스쿼트). 무릎 굽혀 엉덩이 낮추기.
function tcDetectBulleum(lm) {
  if (!tcVisible(lm, TC_LM.Lhip, TC_LM.Rhip, TC_LM.Lknee, TC_LM.Rknee)) return null;
  const sw = tcShoulderWidth(lm);
  const thighL = (lm[TC_LM.Lknee].y - lm[TC_LM.Lhip].y) / sw;
  const thighR = (lm[TC_LM.Rknee].y - lm[TC_LM.Rhip].y) / sw;
  return tcClamp((1.45 - Math.min(thighL, thighR)) / 0.8, 0, 1);
}

// 2. 고개잡이 — 양손을 어깨에 얹기.
function tcDetectGogaejabi(lm) {
  if (!tcVisible(lm, TC_LM.Lshoulder, TC_LM.Rshoulder, TC_LM.Lwrist, TC_LM.Rwrist)) return null;
  const sw = tcShoulderWidth(lm);
  const dL = tcDist(lm[TC_LM.Lwrist], lm[TC_LM.Lshoulder]) / sw;
  const dR = tcDist(lm[TC_LM.Rwrist], lm[TC_LM.Rshoulder]) / sw;
  return tcClamp((0.8 - Math.max(dL, dR)) / 0.6, 0, 1);
}

// 3. 다리들기 — 한쪽 무릎을 90도(엉덩이 높이)로 들기.
function tcDetectDarideulgi(lm) {
  const sw = tcShoulderWidth(lm);
  if (tcVisible(lm, TC_LM.Lhip, TC_LM.Rhip, TC_LM.Lknee, TC_LM.Rknee)) {
    const upL = (lm[TC_LM.Lhip].y - lm[TC_LM.Lknee].y) / sw;
    const upR = (lm[TC_LM.Rhip].y - lm[TC_LM.Rknee].y) / sw;
    return tcClamp((Math.max(upL, upR) + 0.75) / 0.7, 0, 1);
  }
  if (tcVisible(lm, TC_LM.Lankle, TC_LM.Rankle)) {
    const liftL = (lm[TC_LM.Rankle].y - lm[TC_LM.Lankle].y) / sw;
    const liftR = (lm[TC_LM.Lankle].y - lm[TC_LM.Rankle].y) / sw;
    return tcClamp(Math.max(liftL, liftR) / 0.4, 0, 1);
  }
  return null;
}

// 4. 황소걸음 — 한 발을 반대쪽 무릎(오금)에 붙이기.
function tcDetectHwangso(lm) {
  if (!tcVisible(lm, TC_LM.Lknee, TC_LM.Rknee, TC_LM.Lankle, TC_LM.Rankle)) return null;
  const sw = tcShoulderWidth(lm);
  const d1 = tcDist(lm[TC_LM.Lankle], lm[TC_LM.Rknee]) / sw;
  const d2 = tcDist(lm[TC_LM.Rankle], lm[TC_LM.Lknee]) / sw;
  return tcClamp((0.95 - Math.min(d1, d2)) / 0.85, 0, 1);
}

// 5. 외사위 — 한 다리 들고 한 팔을 머리 위로.
function tcDetectOesawi(lm) {
  if (!tcVisible(lm, TC_LM.Lshoulder, TC_LM.Rshoulder, TC_LM.Lwrist, TC_LM.Rwrist)) return null;
  const sw = tcShoulderWidth(lm);
  const upL = (lm[TC_LM.Lshoulder].y - lm[TC_LM.Lwrist].y) / sw;
  const upR = (lm[TC_LM.Rshoulder].y - lm[TC_LM.Rwrist].y) / sw;
  const arm = tcClamp(Math.max(upL, upR) / 0.7, 0, 1);
  let leg = 0.6;
  if (tcVisible(lm, TC_LM.Lhip, TC_LM.Rhip, TC_LM.Lknee, TC_LM.Rknee)) {
    const lgL = (lm[TC_LM.Lhip].y - lm[TC_LM.Lknee].y) / sw;
    const lgR = (lm[TC_LM.Rhip].y - lm[TC_LM.Rknee].y) / sw;
    leg = tcClamp((Math.max(lgL, lgR) + 0.85) / 0.8, 0, 1);
  }
  return arm * 0.65 + leg * 0.35;
}

// 픽토그램(저스트 댄스풍 실루엣). 동작마다 두 자세(a→b)를 장단에 맞춰 오가며 시범 재생.
const TC_FIG_BASE = {
  head: { x: 100, y: 34 }, neck: { x: 100, y: 60 },
  shL: { x: 74, y: 74 }, shR: { x: 126, y: 74 },
  elL: { x: 64, y: 110 }, elR: { x: 136, y: 110 },
  wrL: { x: 60, y: 144 }, wrR: { x: 140, y: 144 },
  hipL: { x: 86, y: 152 }, hipR: { x: 114, y: 152 },
  knL: { x: 84, y: 202 }, knR: { x: 116, y: 202 },
  anL: { x: 82, y: 248 }, anR: { x: 118, y: 248 }
};
const TC_FIG_KEYS = Object.keys(TC_FIG_BASE);
// reps: 한 장단에 몇 번 반복, a: 시작 자세, b: 동작 자세 (미지정 관절은 기본 자세)
const TC_MOVE_FRAMES = {
  bulleum: {
    reps: 2,
    a: {},
    b: {
      head: { x: 100, y: 54 }, neck: { x: 100, y: 80 },
      shL: { x: 74, y: 94 }, shR: { x: 126, y: 94 },
      elL: { x: 48, y: 104 }, elR: { x: 152, y: 104 },
      wrL: { x: 26, y: 118 }, wrR: { x: 174, y: 118 },
      hipL: { x: 82, y: 170 }, hipR: { x: 118, y: 170 },
      knL: { x: 60, y: 206 }, knR: { x: 140, y: 206 },
      anL: { x: 78, y: 248 }, anR: { x: 122, y: 248 }
    }
  },
  gogaejabi: {
    reps: 2,
    a: {
      elL: { x: 58, y: 98 }, elR: { x: 142, y: 98 },
      wrL: { x: 78, y: 84 }, wrR: { x: 122, y: 84 }
    },
    b: {
      head: { x: 100, y: 58 }, neck: { x: 100, y: 82 },
      shL: { x: 74, y: 96 }, shR: { x: 126, y: 96 },
      elL: { x: 58, y: 110 }, elR: { x: 142, y: 110 },
      wrL: { x: 78, y: 96 }, wrR: { x: 122, y: 96 },
      hipL: { x: 86, y: 162 }, hipR: { x: 114, y: 162 },
      knL: { x: 78, y: 204 }, knR: { x: 122, y: 204 }
    }
  },
  darideulgi: {
    reps: 2,
    a: { wrL: { x: 56, y: 138 }, wrR: { x: 144, y: 138 } },
    b: {
      wrL: { x: 56, y: 138 }, wrR: { x: 144, y: 138 },
      knR: { x: 142, y: 152 }, anR: { x: 142, y: 198 }
    }
  },
  hwangso: {
    reps: 1,
    a: { knR: { x: 118, y: 190 }, anR: { x: 92, y: 202 } },
    b: { knL: { x: 82, y: 190 }, anL: { x: 108, y: 202 } }
  },
  oesawi: {
    reps: 1,
    a: {},
    b: {
      head: { x: 96, y: 42 }, neck: { x: 100, y: 64 },
      elL: { x: 50, y: 96 }, wrL: { x: 30, y: 110 },
      elR: { x: 130, y: 44 }, wrR: { x: 96, y: 22 },
      knR: { x: 140, y: 152 }, anR: { x: 140, y: 198 }
    }
  }
};

const TC_FIG_CONNS = [
  ["neck", "hipMid"], ["shL", "shR"], ["hipL", "hipR"],
  ["shL", "elL"], ["elL", "wrL"], ["shR", "elR"], ["elR", "wrR"],
  ["hipL", "knL"], ["knL", "anL"], ["hipR", "knR"], ["knR", "anR"]
];

// 컨테이너에 움직이는 실루엣을 만들고, apply(joints)로 매 프레임 갱신
function tcCreateFigure(container, accent = "#ff2d78") {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 200 260");
  svg.setAttribute("class", "tc-pose-svg");
  const g = document.createElementNS(NS, "g");
  g.setAttribute("stroke", accent);
  g.setAttribute("stroke-width", "14");
  g.setAttribute("stroke-linecap", "round");
  g.setAttribute("stroke-linejoin", "round");
  g.setAttribute("fill", "none");
  const lines = TC_FIG_CONNS.map(() => {
    const l = document.createElementNS(NS, "line");
    g.appendChild(l);
    return l;
  });
  svg.appendChild(g);
  const head = document.createElementNS(NS, "circle");
  head.setAttribute("r", "20");
  head.setAttribute("fill", accent);
  svg.appendChild(head);
  container.innerHTML = "";
  container.appendChild(svg);
  return {
    apply(j) {
      const pts = { ...j, hipMid: { x: (j.hipL.x + j.hipR.x) / 2, y: (j.hipL.y + j.hipR.y) / 2 } };
      TC_FIG_CONNS.forEach(([a, b], i) => {
        const l = lines[i];
        l.setAttribute("x1", pts[a].x); l.setAttribute("y1", pts[a].y);
        l.setAttribute("x2", pts[b].x); l.setAttribute("y2", pts[b].y);
      });
      head.setAttribute("cx", j.head.x); head.setAttribute("cy", j.head.y);
    }
  };
}

// 동작 key + 진행시간(초) → 보간된 관절 자세
function tcFigureJoints(key, clock) {
  const fr = TC_MOVE_FRAMES[key] || TC_MOVE_FRAMES.bulleum;
  const aFull = { ...TC_FIG_BASE, ...fr.a };
  const bFull = { ...TC_FIG_BASE, ...fr.b };
  const phase = (((clock / TC_CYCLE) * fr.reps) % 1 + 1) % 1;
  const t = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
  const out = {};
  for (const k of TC_FIG_KEYS) {
    out[k] = { x: tcLerp(aFull[k].x, bFull[k].x, t), y: tcLerp(aFull[k].y, bFull[k].y, t) };
  }
  return out;
}

const TALCHUM_MOVES = [
  { key: "bulleum", name: "불림", desc: "악사를 부르며 앉았다 일어서기", detect: tcDetectBulleum },
  { key: "gogaejabi", name: "고개잡이", desc: "양손을 어깨에 얹고 무릎 굽히기", detect: tcDetectGogaejabi },
  { key: "darideulgi", name: "다리들기", desc: "다리를 90도로 번쩍 들기", detect: tcDetectDarideulgi },
  { key: "hwangso", name: "황소걸음", desc: "한 발을 반대쪽 무릎에 붙이기", detect: tcDetectHwangso },
  { key: "oesawi", name: "외사위", desc: "한 다리 들고 한 팔 머리 위로", detect: tcDetectOesawi }
];
const TC_VIDEO = (name) => toAsset(`assets/images/talchum/${name}`);
const TC_MOVE_VIDEOS = {
  bulleum: "bulim.mp4",
  gogaejabi: "gogaejabi.mp4",
  darideulgi: "baldeulgi.mp4",
  hwangso: "hwangso.mp4",
  oesawi: "oesawi.mp4"
};

// 굿거리풍 장단 한 장단 패턴 (장단 길이 비율, 장구 소리)
const TC_JANGDAN = [
  { f: 0.0, t: "deong" },
  { f: 0.25, t: "deok" },
  { f: 0.5, t: "kung" },
  { f: 0.75, t: "deok" },
  { f: 0.875, t: "deok" }
];

let talchumGame = null;

function tcScheduleJanggu(ctx, type, time) {
  const buffer = jangguBuffers?.[type];
  if (!buffer) return;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.value = JANGGU_HIT_GAIN * 0.3;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.onended = () => { src.disconnect(); gain.disconnect(); src.onended = null; };
  src.start(time);
}

function completeTalchumMission() {
  if (talchumGame?.finishGame) {
    talchumGame.finishGame();
    return;
  }
  bindMissionCompleteBtn("stage4_a4", true);
}

function stopTalchumGame() {
  if (!talchumGame) return;
  const g = talchumGame;
  talchumGame = null;
  try { if (g.rafId) cancelAnimationFrame(g.rafId); } catch (_) {}
  try { if (g.schedTimer) clearInterval(g.schedTimer); } catch (_) {}
  try {
    if (g.stream) g.stream.getTracks().forEach((t) => { try { t.stop(); } catch (_) {} });
  } catch (_) {}
  try {
    if (g.landmarker && g.landmarker.close) g.landmarker.close();
  } catch (_) {}
  try {
    if (g.maskCanvas) {
      const ctx = g.maskCanvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, g.maskCanvas.width, g.maskCanvas.height);
    }
  } catch (_) {}
  try {
    if (g.video) {
      g.video.pause();
      g.video.srcObject = null;
    }
  } catch (_) {}
  try {
    if (g.sampleVideo) {
      g.sampleVideo.pause();
      g.sampleVideo.removeAttribute("src");
      g.sampleVideo.load();
    }
  } catch (_) {}
}

/** 화면 이탈 시 돌아가는 활동(영상·카메라·오디오) 정리 — 예외가 나도 네비게이션은 계속 */
function stopGimbapVoice() {
  stopSpeechVoice();
}

/** 화면 이탈 시 돌아가는 활동(영상·카메라·오디오) 정리 — 예외가 나도 네비게이션은 계속 */
function stopActiveActivityMedia() {
  try { stopTalchumGame(); } catch (_) {}
  try { stopTtakjiVideo(); } catch (_) {}
  try { stopHangulVideo(); } catch (_) {}
  try { stopRhythmGame(); } catch (_) {}
  try { stopSemachiPractice(); } catch (_) {}
  try { stopAnthemGame(); } catch (_) {}
  try { if (window.HanokGame) window.HanokGame.stop(); } catch (_) {}
  try { if (window.HanokTour) window.HanokTour.stop(); } catch (_) {}
  try { if (window.HanokExplorer) window.HanokExplorer.stop(); } catch (_) {}
  try { removeDancheongBrushPointer(); } catch (_) {}
  try { stopHanbokGallerySync(); } catch (_) {}
  try { stopGimbapVoice(); } catch (_) {}
  try { if (window.ValueReflectionFlow) window.ValueReflectionFlow.stop(); } catch (_) {}
}

/** 태블릿에서는 감지 주기를 늘려 카메라+샘플영상+포즈인식 부하를 줄임 */
function tcDetectIntervalMs() {
  return (navigator.maxTouchPoints || 0) > 1 ? 100 : 50;
}

function tcCameraConstraints() {
  // 기본 카메라(풀HD) 대신 인식에 충분한 해상도만 요청 — 태블릿 디코딩/전송 부하 감소
  return {
    video: {
      facingMode: "user",
      width: { ideal: 480, max: 640 },
      height: { ideal: 360, max: 480 },
      frameRate: { ideal: 20, max: 24 }
    },
    audio: false
  };
}

async function tcInitModels() {
  const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs");
  const fileset = await vision.FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  const posePath =
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
  const mk = async (delegate) => {
    const landmarker = await vision.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: posePath, delegate },
      runningMode: "VIDEO",
      numPoses: 1
    });
    return { landmarker };
  };
  try {
    return await mk("GPU");
  } catch (_) {
    return await mk("CPU");
  }
}

const TALCHUM_MASKS = [
  { id: "yangban", name: "양반탈", file: "yangban.png" },
  { id: "gaksi", name: "각시탈", file: "gaksi.png" },
  { id: "malttugi", name: "말뚝이탈", file: "malttugi.png" },
  { id: "saja", name: "사자탈", file: "saja.png" }
];
const TALCHUM_MASK_TRAITS = [
  "수줍다", "익살스럽다", "거만하다", "용감하다", "무섭다", "착하다",
  "화났다", "슬프다", "신난다", "웃기다", "점잖다", "씩씩하다",
  "부드럽다", "장난스럽다", "위엄있다", "귀엽다", "든든하다", "재빠르다",
  "고집세다", "따뜻하다", "사납다", "느긋하다", "부끄럽다", "얌전하다"
];

function createDefaultTalchumMaskState() {
  return {
    names: {},
    traits: { yangban: [], gaksi: [], malttugi: [], saja: [] },
    wearId: null
  };
}

function ensureTalchumMaskState() {
  if (!state.talchumMasks || typeof state.talchumMasks !== "object") {
    state.talchumMasks = createDefaultTalchumMaskState();
  }
  if (!state.talchumMasks.names) state.talchumMasks.names = {};
  if (!state.talchumMasks.traits) {
    state.talchumMasks.traits = { yangban: [], gaksi: [], malttugi: [], saja: [] };
  }
  if (!("wearId" in state.talchumMasks)) state.talchumMasks.wearId = null;
  TALCHUM_MASKS.forEach((mask) => {
    if (!Array.isArray(state.talchumMasks.traits[mask.id])) {
      state.talchumMasks.traits[mask.id] = [];
    }
  });
  return state.talchumMasks;
}

function talchumMaskNamesComplete(data) {
  return TALCHUM_MASKS.every((mask) => data.names && data.names[mask.id] === mask.id);
}

function talchumWearMaskId() {
  const data = ensureTalchumMaskState();
  if (data.wearId && TALCHUM_MASKS.some((m) => m.id === data.wearId)) return data.wearId;
  return null;
}

function promptTalchumWearSelect() {
  const picks = TALCHUM_MASKS.map((mask) => `
    <button type="button" class="tc-wear-pick-btn" data-wear-id="${mask.id}">
      <img src="${TC_VIDEO(mask.file)}" alt="${mask.name}" draggable="false" />
      <span>${mask.name}</span>
    </button>
  `).join("");
  return new Promise((resolve) => {
    let settled = false;
    const finish = (id) => {
      if (settled) return;
      settled = true;
      resolve(id || null);
    };
    Swal.fire({
      title: "어떤 탈을 쓰고 춤출까요?",
      html: `<p class="tc-wear-pick-lead">마음에 드는 탈을 골라 주세요!</p><div class="tc-wear-pick-grid">${picks}</div>`,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "닫기",
      customClass: { popup: "tc-wear-pick-popup" },
      didOpen: (popup) => {
        popup.querySelectorAll("[data-wear-id]").forEach((btn) => {
          btn.addEventListener("click", () => {
            playSound("click.mp3");
            const id = btn.dataset.wearId;
            Swal.close();
            finish(id);
          });
        });
      }
    }).then((result) => {
      if (!settled) finish(null);
      if (result.isDismissed) finish(null);
    });
  });
}

async function goToTalchumDanceWithWearPick() {
  const st = ensureTalchumMaskState();
  if (!talchumMaskNamesComplete(st)) {
    await Swal.fire("조금 더!", "탈 이름을 모두 알맞게 놓아 주세요.", "info");
    return false;
  }
  const wearId = await promptTalchumWearSelect();
  if (!wearId) return false;
  st.wearId = wearId;
  playSound("click.mp3");
  state.talchumPhase = "dance";
  state.talchumStep = 0;
  try { stopActiveActivityMedia(); } catch (_) {}
  render();
  updateGlobalBackButton();
  updateGlobalNextButton();
  return true;
}

function renderTalchumMaskExplore() {
  const data = ensureTalchumMaskState();
  const usedNames = new Set(Object.values(data.names || {}).filter(Boolean));
  const namePool = TALCHUM_MASKS.filter((mask) => !usedNames.has(mask.id));
  const canNext = talchumMaskNamesComplete(data);
  const cards = TALCHUM_MASKS.map((mask) => {
    const placedNameId = data.names[mask.id] || "";
    const placedName = TALCHUM_MASKS.find((item) => item.id === placedNameId);
    const nameOk = placedNameId === mask.id;
    const traits = (data.traits[mask.id] || []).map((label, i) => `
      <button type="button" class="tc-mask-chip tc-mask-chip--trait is-placed" data-mask-id="${mask.id}" data-trait-idx="${i}">${label}</button>
    `).join("");
    return `
      <article class="tc-mask-card" data-mask-slot="${mask.id}">
        <div class="tc-mask-photo-wrap">
          <img class="tc-mask-photo" src="${TC_VIDEO(mask.file)}" alt="${mask.name}" draggable="false" />
        </div>
        <div class="tc-mask-drop tc-mask-drop--name${placedName ? (nameOk ? " is-ok" : " is-bad") : ""}" data-drop="name" data-mask-id="${mask.id}">
          ${placedName
            ? `<button type="button" class="tc-mask-chip tc-mask-chip--name is-placed" data-name-id="${placedName.id}" data-mask-id="${mask.id}">${placedName.name}</button>`
            : `<span class="tc-mask-drop-hint">이름 놓기</span>`}
        </div>
        <div class="tc-mask-drop tc-mask-drop--trait" data-drop="trait" data-mask-id="${mask.id}">
          ${traits || `<span class="tc-mask-drop-hint">성격 놓기</span>`}
        </div>
      </article>
    `;
  }).join("");

  app.innerHTML = sceneTemplate("STAGE 4-4 탈춤놀이", `
    <div class="section-card game-area tc-mask-explore">
      <p class="tc-mask-lead"><strong>탈을 자세히 살펴봅시다. 탈의 이름은 무엇일까요? 탈이 나타내는 인물은 어떤 성격일까요?</strong></p>
      <p class="tc-mask-sub">탈의 이름과 성격을 클릭하여 탈 사진 아래로 끌고 오세요.</p>
      <div class="tc-mask-grid">${cards}</div>
      <div class="tc-mask-pools">
        <div class="tc-mask-pool">
          <p class="tc-mask-pool-title">탈 이름</p>
          <div class="tc-mask-pool-row" id="tcMaskNamePool">
            ${namePool.map((mask) => `
              <button type="button" class="tc-mask-chip tc-mask-chip--name" draggable="true" data-chip="name" data-name-id="${mask.id}">${mask.name}</button>
            `).join("")}
          </div>
        </div>
        <div class="tc-mask-pool">
          <p class="tc-mask-pool-title">성격 (여러 번 쓸 수 있어요)</p>
          <div class="tc-mask-pool-row" id="tcMaskTraitPool">
            ${TALCHUM_MASK_TRAITS.map((label) => `
              <button type="button" class="tc-mask-chip tc-mask-chip--trait" draggable="true" data-chip="trait" data-trait="${label}">${label}</button>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="tc-mask-actions">
        <button type="button" class="btn primary" id="tcMaskNextBtn"${canNext ? "" : " disabled"}>
          탈춤 따라하기
        </button>
      </div>
    </div>
  `);
  setupNavigationAndHelp("탈 사진을 살펴보고 이름과 성격을 알맞게 놓아 보자! 성격은 마음대로 골라도 괜찮아.");

  let dragPayload = null;
  let selectedPayload = null;

  const clearChipSelection = () => {
    selectedPayload = null;
    document.querySelectorAll(".tc-mask-chip.is-selected").forEach((el) => el.classList.remove("is-selected"));
    document.querySelectorAll(".tc-mask-drop.is-target").forEach((el) => el.classList.remove("is-target"));
  };

  const applyPayloadToZone = (payload, zone) => {
    if (!payload || !zone) return false;
    const maskId = zone.dataset.maskId;
    const dropKind = zone.dataset.drop;
    const st = ensureTalchumMaskState();
    if (dropKind === "name" && payload.kind === "name" && payload.nameId) {
      if (payload.nameId !== maskId) {
        playSound("wrong.mp3");
        return true;
      }
      Object.keys(st.names).forEach((key) => {
        if (st.names[key] === payload.nameId) delete st.names[key];
      });
      st.names[maskId] = payload.nameId;
      playSound("snap.mp3");
      renderTalchumMaskExplore();
      return true;
    }
    if (dropKind === "trait" && payload.kind === "trait" && payload.trait) {
      if (!Array.isArray(st.traits[maskId])) st.traits[maskId] = [];
      st.traits[maskId].push(payload.trait);
      playSound("snap.mp3");
      renderTalchumMaskExplore();
      return true;
    }
    return false;
  };

  const highlightTargets = (payload) => {
    document.querySelectorAll(".tc-mask-drop.is-target").forEach((el) => el.classList.remove("is-target"));
    if (!payload) return;
    const dropKind = payload.kind === "name" ? "name" : "trait";
    document.querySelectorAll(`.tc-mask-drop[data-drop="${dropKind}"]`).forEach((el) => el.classList.add("is-target"));
  };

  document.querySelectorAll(".tc-mask-chip[draggable='true']").forEach((chip) => {
    const makePayload = () => ({
      kind: chip.dataset.chip,
      nameId: chip.dataset.nameId || "",
      trait: chip.dataset.trait || ""
    });
    chip.addEventListener("dragstart", (e) => {
      clearChipSelection();
      dragPayload = makePayload();
      try {
        e.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
        e.dataTransfer.effectAllowed = "copyMove";
      } catch (_) {}
      chip.classList.add("is-dragging");
    });
    chip.addEventListener("dragend", () => {
      chip.classList.remove("is-dragging");
      dragPayload = null;
    });
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      const payload = makePayload();
      if (
        selectedPayload &&
        selectedPayload.kind === payload.kind &&
        selectedPayload.nameId === payload.nameId &&
        selectedPayload.trait === payload.trait
      ) {
        clearChipSelection();
        return;
      }
      clearChipSelection();
      selectedPayload = payload;
      chip.classList.add("is-selected");
      highlightTargets(payload);
      playSound("click.mp3");
    });
  });

  document.querySelectorAll(".tc-mask-drop").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("is-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("is-over");
      let payload = dragPayload;
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) payload = JSON.parse(raw);
      } catch (_) {}
      applyPayloadToZone(payload, zone);
      dragPayload = null;
    });
    zone.addEventListener("click", (e) => {
      if (!selectedPayload) return;
      if (e.target.closest(".tc-mask-chip.is-placed")) return;
      applyPayloadToZone(selectedPayload, zone);
    });
  });

  document.querySelectorAll(".tc-mask-chip.is-placed[data-name-id]").forEach((chip) => {
    chip.onclick = (e) => {
      e.stopPropagation();
      const st = ensureTalchumMaskState();
      const maskId = chip.dataset.maskId;
      if (maskId && st.names[maskId]) delete st.names[maskId];
      playSound("click.mp3");
      renderTalchumMaskExplore();
    };
  });
  document.querySelectorAll(".tc-mask-chip.is-placed[data-trait-idx]").forEach((chip) => {
    chip.onclick = (e) => {
      e.stopPropagation();
      const st = ensureTalchumMaskState();
      const maskId = chip.dataset.maskId;
      const idx = Number(chip.dataset.traitIdx);
      if (maskId && Array.isArray(st.traits[maskId]) && !Number.isNaN(idx)) {
        st.traits[maskId].splice(idx, 1);
      }
      playSound("click.mp3");
      renderTalchumMaskExplore();
    };
  });

  const nextBtn = document.getElementById("tcMaskNextBtn");
  if (nextBtn) {
    nextBtn.onclick = () => {
      goToTalchumDanceWithWearPick();
    };
  }
}

function renderStage4Act4() {
  if ((state.talchumPhase || "masks") !== "dance") {
    renderTalchumMaskExplore();
    return;
  }
  stopTalchumGame();
  app.innerHTML = sceneTemplate("STAGE 4-4 탈춤놀이", `
    <div class="section-card game-area talchum-game">
      <div class="tc-hud">
        <span class="tc-score" id="tcScore">0점</span>
        <span class="tc-combo" id="tcCombo"></span>
      </div>
      <div class="tc-stage">
        <video id="tcSampleVideo" class="tc-main-video" playsinline loop muted preload="metadata"></video>
        <div class="tc-move-overlay">
          <div class="tc-move-name" id="tcName">${TALCHUM_MOVES[0].name}</div>
          <div class="tc-move-desc" id="tcDesc">${TALCHUM_MOVES[0].desc}</div>
          <div class="tc-next" id="tcNext">아래 버튼으로 동작을 골라 보세요</div>
        </div>
        <div class="tc-pip-wrap">
          <video id="talchumVideo" class="tc-pip-video" playsinline muted></video>
          <canvas id="tcMaskCanvas" class="tc-pip-mask-canvas" aria-hidden="true"></canvas>
        </div>
        <div class="tc-rating" id="tcRating"></div>
        <div class="tc-count" id="tcCount"></div>
        <div class="talchum-status" id="talchumStatus">샘플 영상을 보며 준비해요! 시작을 누르면 따라하기가 시작돼요 😊</div>
        <div class="talchum-progress"><div class="talchum-progress-fill" id="tcGauge"></div></div>
      </div>
      <div class="talchum-steps" id="talchumSteps"></div>
      <div class="talchum-controls">
        <button class="btn primary" id="tcStart" disabled>▶ 시작</button>
      </div>
    </div>
  `);
  setupNavigationAndHelp("연습할 동작을 골라 샘플 영상을 보며 따라 해 보자! 잘 맞추면 다음 동작으로 넘어가요!");

  const video = document.getElementById("talchumVideo");
  const nameEl = document.getElementById("tcName");
  const descEl = document.getElementById("tcDesc");
  const nextEl = document.getElementById("tcNext");
  const scoreEl = document.getElementById("tcScore");
  const comboEl = document.getElementById("tcCombo");
  const statusEl = document.getElementById("talchumStatus");
  const gaugeEl = document.getElementById("tcGauge");
  const stepsEl = document.getElementById("talchumSteps");
  const ratingEl = document.getElementById("tcRating");
  const countEl = document.getElementById("tcCount");
  const sampleVideoEl = document.getElementById("tcSampleVideo");
  const startBtn = document.getElementById("tcStart");
  const pipWrapEl = document.querySelector(".tc-pip-wrap");
  const maskCanvas = document.getElementById("tcMaskCanvas");
  if (pipWrapEl) pipWrapEl.classList.add("hidden");

  const wearId = talchumWearMaskId() || "yangban";
  const wearMeta = TALCHUM_MASKS.find((m) => m.id === wearId) || TALCHUM_MASKS[0];
  const wearImg = new Image();
  wearImg.decoding = "async";
  // new Image()는 DOM <img> 폴백을 못 받으므로, webp→png 후보를 직접 시도한다.
  {
    const preferred = TC_VIDEO(wearMeta.file);
    const pool = (typeof assetCandidates === "function"
      ? assetCandidates(preferred)
      : [preferred, String(preferred).replace(/\.webp(\?[^#]*)?$/i, ".png$1")]).filter(Boolean);
    let tryIdx = 0;
    const tryLoad = () => {
      if (tryIdx >= pool.length) return;
      const url = pool[tryIdx];
      tryIdx += 1;
      wearImg.onerror = tryLoad;
      wearImg.src = url;
    };
    wearImg.onload = () => { wearImg.onerror = null; };
    tryLoad();
  }

  talchumGame = {
    video, sampleVideo: sampleVideoEl, stream: null, landmarker: null,
    maskCanvas, maskCtx: maskCanvas ? maskCanvas.getContext("2d") : null,
    wearImg, wearId: wearMeta.id, lastFaceLm: null,
    rafId: null, schedTimer: null, started: false, done: false,
    lastTs: 0, lastDetectTs: 0,
    songStart: 0, curIdx: -1, selectedIdx: 0, seg: null, finalized: {},
    score: 0, combo: 0, nextCycleStart: 0,
    displayIdx: 0, confEMA: null, matchAccum: 0, moveStartTs: 0,
    countInStart: 0, moveStarted: false, confTrail: [],
    _lastStatus: "", _lastGaugePct: -1,
    selectMove: null, finishGame: null
  };

  const syncMaskCanvasSize = () => {
    const g = talchumGame;
    if (!g?.maskCanvas || !pipWrapEl) return;
    const rect = pipWrapEl.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (g.maskCanvas.width !== w || g.maskCanvas.height !== h) {
      g.maskCanvas.width = w;
      g.maskCanvas.height = h;
    }
  };

  const drawWornMask = (lm) => {
    const g = talchumGame;
    if (!g?.maskCtx || !g.maskCanvas || !g.video) return;
    syncMaskCanvasSize();
    const ctx = g.maskCtx;
    const cw = g.maskCanvas.width;
    const ch = g.maskCanvas.height;
    ctx.clearRect(0, 0, cw, ch);
    if (!lm || !g.wearImg?.complete || !g.wearImg.naturalWidth) return;

    const vw = g.video.videoWidth || 1;
    const vh = g.video.videoHeight || 1;
    const cover = Math.max(cw / vw, ch / vh);
    const dw = vw * cover;
    const dh = vh * cover;
    const ox = (cw - dw) / 2;
    const oy = (ch - dh) / 2;
    const toX = (p) => ox + p.x * dw;
    const toY = (p) => oy + p.y * dh;

    const nose = lm[0];
    const leftEye = lm[2];
    const rightEye = lm[5];
    const leftEar = lm[7];
    const rightEar = lm[8];
    if (!nose || !leftEye || !rightEye) return;

    const earSpan = (leftEar && rightEar)
      ? Math.hypot(toX(leftEar) - toX(rightEar), toY(leftEar) - toY(rightEar))
      : Math.hypot(toX(leftEye) - toX(rightEye), toY(leftEye) - toY(rightEye)) * 2.2;
    const eyeSpan = Math.hypot(toX(leftEye) - toX(rightEye), toY(leftEye) - toY(rightEye));
    const faceW = Math.max(earSpan * 1.55, eyeSpan * 3.1);
    const faceH = faceW * (g.wearImg.naturalHeight / g.wearImg.naturalWidth);
    // Pose 좌우는 사람 기준이라 전면 카메라 영상에서는 왼쪽 눈이 화면 오른쪽에 있다.
    // 사람 왼쪽→오른쪽 벡터로 돌리면 약 180°가 되어 탈이 거꾸로 그려진다.
    let angle = Math.atan2(toY(leftEye) - toY(rightEye), toX(leftEye) - toX(rightEye));
    if (angle > Math.PI / 2) angle -= Math.PI;
    else if (angle < -Math.PI / 2) angle += Math.PI;
    const cx = toX(nose);
    const cy = toY(nose) - faceH * 0.08;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.drawImage(g.wearImg, -faceW / 2, -faceH * 0.45, faceW, faceH);
    ctx.restore();
  };

  const renderSteps = (activeIdx) => {
    stepsEl.innerHTML = TALCHUM_MOVES.map((m, i) => {
      const cls = gStepCls(i, activeIdx);
      return `<button type="button" class="talchum-step-btn ${cls}" data-tc-step="${i}" aria-pressed="${i === activeIdx}">
        <span class="talchum-step-num">${i + 1}</span>
        <span class="talchum-step-label">${m.name}</span>
      </button>`;
    }).join("");
  };
  const gStepCls = (i, activeIdx) => {
    const g = talchumGame;
    if (g?.finalized[i]) return "done";
    if (i === activeIdx) return "current";
    return "";
  };
  const showMove = (idx) => {
    const m = TALCHUM_MOVES[idx];
    if (!m) return;
    nameEl.textContent = m.name;
    descEl.textContent = m.desc;
    nextEl.textContent = "아래 버튼으로 동작을 바꿀 수 있어요";
    const vidFile = TC_MOVE_VIDEOS[m.key];
    if (sampleVideoEl && vidFile) {
      const src = TC_VIDEO(vidFile);
      if (sampleVideoEl.getAttribute("src") !== src) {
        sampleVideoEl.pause();
        sampleVideoEl.src = src;
        sampleVideoEl.load();
      }
      sampleVideoEl.play().catch(() => {});
    }
    renderSteps(idx);
  };
  const selectMove = (idx) => {
    const g = talchumGame;
    if (!g || g.done || idx < 0 || idx >= TALCHUM_MOVES.length) return;
    if (g.moveStarted && g.curIdx >= 0 && g.curIdx !== idx) finalizeSegment(g.curIdx);
    g.selectedIdx = idx;
    g.curIdx = idx;
    g.displayIdx = idx;
    state.talchumStep = idx;
    g.seg = { matched: 0, total: 0, peak: 0 };
    g.matchAccum = 0;
    g.moveStartTs = performance.now();
    g.confEMA = null;
    g.confTrail = [];
    gaugeEl.style.width = "0%";
    g._lastGaugePct = 0;
    gaugeEl.classList.remove("hit");
    showMove(idx);
  };
  const popRating = (text, cls) => {
    ratingEl.textContent = text;
    ratingEl.className = `tc-rating show ${cls}`;
    setTimeout(() => { if (ratingEl) ratingEl.className = "tc-rating"; }, 900);
  };
  const startMove = state.talchumStep == null ? 0 : state.talchumStep;
  state.talchumStep = startMove;
  selectMove(startMove);
  stepsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tc-step]");
    if (!btn) return;
    selectMove(Number(btn.dataset.tcStep));
  });

  const finalizeSegment = (idx) => {
    const g = talchumGame;
    if (!g || idx < 0 || idx >= TALCHUM_MOVES.length || g.finalized[idx] || !g.seg) return;
    g.finalized[idx] = true;
    const ratio = g.seg.total > 0 ? g.seg.matched / g.seg.total : 0;
    let pts, text, cls;
    if (ratio >= 0.35) { pts = 1000; text = "완벽! 🌟"; cls = "perfect"; }
    else if (ratio >= 0.2) { pts = 600; text = "좋아요! ✨"; cls = "good"; }
    else if (ratio >= 0.08) { pts = 300; text = "좋아 👍"; cls = "ok"; }
    else { pts = 100; text = "다음도 화이팅! 💪"; cls = "miss"; }
    if (ratio >= 0.2) { g.combo += 1; pts += g.combo * 50; } else { g.combo = 0; }
    g.score += pts;
    scoreEl.textContent = `${g.score}점`;
    comboEl.textContent = g.combo >= 2 ? `${g.combo} 콤보!` : "";
    popRating(text, cls);
    if (ratio >= 0.2) playSound("click.mp3");
    renderSteps(g.curIdx);
  };

  const finishGame = () => {
    const g = talchumGame;
    if (!g) {
      bindMissionCompleteBtn("stage4_a4", true);
      return;
    }
    if (g.done) {
      bindMissionCompleteBtn("stage4_a4", true);
      return;
    }
    if (g.curIdx >= 0) finalizeSegment(g.curIdx);
    g.done = true;
    state.talchumStep = TALCHUM_MOVES.length - 1;
    bindMissionCompleteBtn("stage4_a4", true);
    if (!document.getElementById("missionClearOverlay")) {
      const score = g.score || 0;
      const stars = score >= 4000 ? "⭐⭐⭐" : score >= 2500 ? "⭐⭐" : score >= 1000 ? "⭐" : "✨";
      Swal.fire("탈춤 한마당 끝! 🎭", `${stars}<br>점수: <b>${score}점</b><br>멋진 탈춤이었어요!`, "success");
    }
    setTimeout(() => {
      if (talchumGame === g) stopTalchumGame();
    }, 80);
  };

  const advanceMove = () => {
    const g = talchumGame;
    if (!g || g.done) return;
    finalizeSegment(g.curIdx);
    const nextIdx = g.curIdx + 1;
    if (nextIdx >= TALCHUM_MOVES.length) {
      finishGame();
      return;
    }
    g.curIdx = nextIdx;
    g.selectedIdx = nextIdx;
    g.displayIdx = nextIdx;
    state.talchumStep = nextIdx;
    g.seg = { matched: 0, total: 0, peak: 0 };
    g.matchAccum = 0;
    g.moveStartTs = performance.now();
    g.confEMA = null;
    g.confTrail = [];
    gaugeEl.style.width = "0%";
    gaugeEl.classList.remove("hit");
    showMove(nextIdx);
  };

  const loop = () => {
    const g = talchumGame;
    if (!g || g.done) return;
    g.rafId = requestAnimationFrame(loop);

    const now = performance.now();
    const dt = g.lastTs ? now - g.lastTs : 0;
    g.lastTs = now;

    let inMove = false;
    if (g.started) {
      if (!g.moveStarted) {
        const left = TC_COUNTIN_SEC - (now - g.countInStart) / 1000;
        if (left > 0) {
          countEl.textContent = String(Math.max(1, Math.ceil(left)));
        } else {
          countEl.textContent = "";
          g.moveStarted = true;
          g.curIdx = g.selectedIdx;
          g.displayIdx = g.selectedIdx;
          g.seg = { matched: 0, total: 0, peak: 0 };
          g.moveStartTs = now;
          g.matchAccum = 0;
          g.confTrail = [];
          showMove(g.selectedIdx);
          sampleVideoEl.play().catch(() => {});
        }
      } else {
        countEl.textContent = "";
        g.displayIdx = g.curIdx;
        inMove = g.curIdx >= 0;
      }
    }

    const canDetect = g.landmarker && video.readyState >= 2 && (now - g.lastDetectTs >= tcDetectIntervalMs());

    const trailPeak = g.confTrail.length ? Math.max(...g.confTrail.map((v) => v.c)) : 0;
    const confForMatch = g.confEMA == null ? (trailPeak > 0 ? trailPeak : null) : Math.max(g.confEMA, trailPeak);

    if (inMove && g.seg) {
      g.seg.total += dt;
      const matching = confForMatch != null && confForMatch >= TC_PASS;
      if (matching) g.seg.matched += dt;
      if (confForMatch != null) g.seg.peak = Math.max(g.seg.peak, confForMatch);

      const progress = tcClamp(g.matchAccum / TC_ADVANCE_MS, 0, 1);
      const pct = Math.round(progress * 100);
      if (g._lastGaugePct !== pct) {
        g._lastGaugePct = pct;
        gaugeEl.style.width = `${pct}%`;
      }
      gaugeEl.classList.toggle("hit", matching);

      if (matching) g.matchAccum += dt;
      else {
        const elapsed = now - g.moveStartTs;
        if (elapsed > TC_REACTION_GRACE_MS) {
          g.matchAccum = Math.max(0, g.matchAccum - dt * 0.2);
        }
      }

      const elapsed = now - g.moveStartTs;
      if (elapsed >= TC_MIN_MOVE_MS && g.matchAccum >= TC_ADVANCE_MS) {
        g.matchAccum = 0;
        advanceMove();
        if (!talchumGame || talchumGame.done) return;
      }
    } else if (g.started && !g.moveStarted) {
      gaugeEl.style.width = "0%";
    }

    if (canDetect) {
      g.lastDetectTs = now;
      let result;
      try { result = g.landmarker.detectForVideo(video, now); } catch (_) { result = null; }
      const lm = result?.landmarks?.[0];
      g.lastFaceLm = lm || null;
      drawWornMask(lm);
      const move = TALCHUM_MOVES[g.displayIdx];
      const raw = (lm && move) ? move.detect(lm) : null;
      if (raw == null) g.confEMA = null;
      else {
        const adj = tcClamp(raw * TC_LENIENCY, 0, 1);
        g.confEMA = g.confEMA == null ? adj : g.confEMA * 0.45 + adj * 0.55;
      }
      g.confTrail.push({ t: now, c: g.confEMA ?? 0 });
      g.confTrail = g.confTrail.filter((v) => now - v.t <= TC_MATCH_MEMORY_MS);
    } else if (g.lastFaceLm) {
      drawWornMask(g.lastFaceLm);
    } else {
      drawWornMask(null);
    }
    const latestTrailPeak = g.confTrail.length ? Math.max(...g.confTrail.map((v) => v.c)) : 0;
    const conf = g.confEMA == null ? (latestTrailPeak > 0 ? latestTrailPeak : null) : Math.max(g.confEMA, latestTrailPeak);

    let nextStatus;
    if (!g.moveStarted) nextStatus = "곧 시작해요! 자세를 잡아 보세요 😊";
    else if (!g.landmarker || video.readyState < 2) nextStatus = "카메라 프레임을 확인 중이에요... 📷";
    else if (conf == null) nextStatus = "온몸이 보이도록 한 걸음 뒤로! 👀";
    else if (conf >= TC_PASS) nextStatus = "잘하고 있어요! 그대로! 💪";
    else nextStatus = "영상처럼 따라 해 봐요! 🎭";
    if (g._lastStatus !== nextStatus) {
      g._lastStatus = nextStatus;
      statusEl.textContent = nextStatus;
    }
  };

  const startSong = async () => {
    const g = talchumGame;
    if (!g || g.started) return;
    startBtn.disabled = true;
    statusEl.textContent = "카메라와 동작 인식을 준비 중... ⏳";
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(tcCameraConstraints());
      } catch (_) {
        // 일부 기기는 해상도/프레임 제약을 거부함 → 기본 전면 카메라로 재시도
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      }
      if (!talchumGame) { stream.getTracks().forEach((t) => t.stop()); return; }
      talchumGame.stream = stream;
      video.srcObject = stream;
      await video.play();
      const { landmarker } = await tcInitModels();
      if (!talchumGame) {
        stream.getTracks().forEach((t) => t.stop());
        if (landmarker.close) landmarker.close();
        return;
      }
      talchumGame.landmarker = landmarker;
    } catch (err) {
      statusEl.textContent = "카메라를 쓸 수 없어요. 카메라 권한을 허용해 주세요. 📷";
      startBtn.disabled = false;
      return;
    }
    await ensureJangguBuffers();
    const ctx = getJangguAudioContext();
    await ctx.resume().catch(() => {});
    if (pipWrapEl) pipWrapEl.classList.remove("hidden");
    g.songStart = ctx.currentTime + 0.15;
    g.nextCycleStart = g.songStart;
    g.started = true;
    g.countInStart = performance.now();
    g.moveStarted = false;
    g.curIdx = -1;
    startBtn.disabled = true;
    startBtn.style.display = "none";
    if (!g.rafId) loop();
    g.schedTimer = setInterval(() => {
      if (!talchumGame || !talchumGame.started || talchumGame.done) return;
      const c = getJangguAudioContext();
      while (g.nextCycleStart < c.currentTime + 0.3) {
        if (g.nextCycleStart >= g.songStart - 0.01) {
          for (const p of TC_JANGDAN) tcScheduleJanggu(c, p.t, g.nextCycleStart + p.f * TC_CYCLE);
        }
        g.nextCycleStart += TC_CYCLE;
      }
    }, 60);
  };
  startBtn.onclick = startSong;
  startBtn.disabled = false;
  if (talchumGame) {
    talchumGame.selectMove = selectMove;
    talchumGame.finishGame = finishGame;
  }
}

const RHYTHM_PASS_SCORES = { 1: 100, 2: 300, 3: 500 };

function getRhythmPassScore(level) {
  return RHYTHM_PASS_SCORES[level] ?? 70;
}
const RHYTHM_HIT_WINDOW = 0.48;
/** 판정 구간(초) — 창 안에서 3단계 고정 점수 */
const RHYTHM_HIT_TIER_PERFECT = RHYTHM_HIT_WINDOW / 3;
const RHYTHM_HIT_TIER_GOOD = (RHYTHM_HIT_WINDOW / 3) * 2;
const RHYTHM_SCORE_PERFECT = 20;
const RHYTHM_SCORE_GOOD = 15;
const RHYTHM_SCORE_OK = 10;
const RHYTHM_FALL_TIME = 1.6;
/** 옆 채·별 cue: 실제 히트보다 빠르게(아이 반응 시간 보정) */
const RHYTHM_STICK_CUE_LEAD = 0.52;
const RHYTHM_STICK_CUE_HOLD = 0.10;
const RHYTHM_SOUND_CHAR = { deong: "덩", kung: "쿵", deok: "덕" };
const RHYTHM_SOUND_LABEL_MS = 700;

function rhythmJangguSparkleZonesHTML() {
  return `
    <div class="rhythm-stick-sparkle-zone rhythm-stick-sparkle-zone--left" id="jangguSparkleLeft" aria-hidden="true">
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--1">✨</i>
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--2">⭐</i>
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--3">💫</i>
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--4">✨</i>
    </div>
    <div class="rhythm-stick-sparkle-zone rhythm-stick-sparkle-zone--right" id="jangguSparkleRight" aria-hidden="true">
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--1">✨</i>
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--2">⭐</i>
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--3">💫</i>
      <i class="rhythm-stick-sparkle-piece rhythm-stick-sparkle-piece--4">✨</i>
    </div>
  `;
}
/** hitTime 이후 노트·글자가 화면에 머무는 시간(초) — 입력과 무관 */
const RHYTHM_NOTE_PEAK_HOLD = RHYTHM_SOUND_LABEL_MS / 1000;
/** 장구 타격음 — assets/sounds/janggu_*.mp3 (없으면 wav 폴백) */
const JANGGU_SOUNDS = {
  deong: "janggu_deong.mp3",
  kung: "janggu_kung.mp3",
  deok: "janggu_deok.mp3"
};
/** 파일명이 다를 때 순서대로 시도 */
const JANGGU_SOUND_FALLBACKS = {
  deong: ["janggu_deong.mp3", "janggu_deong.wav", "deong.wav"],
  kung: ["janggu_kung.mp3", "janggu_kung.wav", "kung.wav"],
  deok: ["janggu_deok.mp3", "janggu_deok.wav", "deok.wav"]
};

/** 1단계: 1칸(인덱스 0) */
const RHYTHM_LEVEL1_CELL_INDICES = [0];
/** 2단계: 1·4·7칸 → 인덱스 0·3·6 */
const RHYTHM_LEVEL2_CELL_INDICES = [0, 3, 6];
/** 3단계 세마치: 1·4·6·7·8칸 → 인덱스 0·3·5·6·7 */
const RHYTHM_LEVEL3_CELL_INDICES = [0, 3, 5, 6, 7];

/** 정간 인덱스(0~8) → 장구 음 종류 (deong/kung/deok) */
const LEVEL1_CELL_SOUND = { 0: "deong" };
const LEVEL2_CELL_SOUND = { 0: "kung", 3: "deok", 6: "deok" };
const LEVEL3_CELL_SOUND = {
  0: "deong",
  3: "deong",
  5: "deok",
  6: "kung",
  7: "deok"
};
/** wav가 작을 때 Web Audio로 증폭 (1 = 원음, 2~3 권장) */
const JANGGU_HIT_GAIN = 3;

let jangguBuffers = null;
let jangguBufferPromise = null;
let jangguAudioCtx = null;
/** 타입별 기본 URL (재생 객체는 매 히트마다 새로 생성) */
let jangguUrlByType = null;

function getJangguAudioContext() {
  if (!jangguAudioCtx) {
    jangguAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (jangguAudioCtx.state === "suspended") {
    jangguAudioCtx.resume().catch(() => {});
  }
  return jangguAudioCtx;
}

function playJangguSynth(type) {
  const ctx = getJangguAudioContext();
  const now = ctx.currentTime;
  const profiles = {
    deong: { freq: 95, dur: 0.22, gain: 0.85 },
    kung: { freq: 155, dur: 0.13, gain: 0.8 },
    deok: { freq: 240, dur: 0.09, gain: 0.75 }
  };
  const p = profiles[type] || profiles.deong;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const master = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(p.freq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, p.freq * 0.45), now + p.dur);
  env.gain.setValueAtTime(p.gain, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + p.dur);
  master.gain.value = JANGGU_HIT_GAIN;
  osc.connect(env);
  env.connect(master);
  master.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + p.dur + 0.02);
}

function getJangguFileCandidates(type) {
  return JANGGU_SOUND_FALLBACKS[type] || [JANGGU_SOUNDS[type]];
}

function getJangguPrimaryUrl(type) {
  if (!jangguUrlByType) jangguUrlByType = {};
  if (jangguUrlByType[type]) return jangguUrlByType[type];
  jangguUrlByType[type] = SND(getJangguFileCandidates(type)[0]);
  return jangguUrlByType[type];
}

/** 재생 종료 후 HTML Audio 인스턴스 해제 */
function disposeJangguHtmlHit(hit) {
  hit.onended = null;
  hit.onerror = null;
  try { hit.pause(); } catch { /* ignore */ }
  hit.currentTime = 0;
  hit.removeAttribute("src");
  try { hit.load(); } catch { /* ignore */ }
  if (typeof hit.remove === "function") hit.remove();
}

/** 히트마다 new Audio — 이전 재생과 겹쳐도 즉시 터짐 */
function playJangguHtmlOverlap(type, fileIndex = 0) {
  const files = getJangguFileCandidates(type);
  const file = files[fileIndex];
  if (!file) {
    playJangguSynth(type);
    return;
  }
  const hit = new Audio(SND(file));
  hit.volume = 1;
  hit.preload = "auto";
  const tryNext = () => {
    disposeJangguHtmlHit(hit);
    if (fileIndex + 1 < files.length) playJangguHtmlOverlap(type, fileIndex + 1);
    else playJangguSynth(type);
  };
  hit.addEventListener("ended", () => disposeJangguHtmlHit(hit), { once: true });
  hit.addEventListener("error", tryNext, { once: true });
  hit.play().catch(tryNext);
}

/** Web Audio — BufferSource를 매 히트마다 새로 생성해 레이어 중첩 */
function playJangguBufferOverlap(type) {
  const buffer = jangguBuffers?.[type];
  if (!buffer) return false;
  const ctx = getJangguAudioContext();
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = JANGGU_HIT_GAIN;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
    source.onended = null;
  };
  source.start(0);
  return true;
}

async function ensureJangguBuffers() {
  if (jangguBuffers) return jangguBuffers;
  if (jangguBufferPromise) return jangguBufferPromise;
  jangguBufferPromise = (async () => {
    const ctx = getJangguAudioContext();
    const buffers = {};
    for (const type of Object.keys(JANGGU_SOUNDS)) {
      const candidates = getJangguFileCandidates(type);
      for (const file of candidates) {
        try {
          const res = await fetch(SND(file));
          if (!res.ok) continue;
          const data = await res.arrayBuffer();
          buffers[type] = await ctx.decodeAudioData(data.slice(0));
          jangguUrlByType = jangguUrlByType || {};
          jangguUrlByType[type] = SND(file);
          break;
        } catch {
          /* 다음 후보 */
        }
      }
    }
    jangguBuffers = buffers;
    return buffers;
  })();
  return jangguBufferPromise;
}

/** 입력 방식 → 재생 음 (노트 종류와 무관) */
const JANGGU_INPUT_SOUND = {
  both: "deong",
  gunggeul: "kung",
  yeol: "deok"
};

function playJangguSound(type) {
  if (!Object.prototype.hasOwnProperty.call(JANGGU_SOUNDS, type)) type = "deong";
  initJangguSounds();
  getJangguAudioContext().resume().catch(() => {});
  if (playJangguBufferOverlap(type)) return;
  playJangguHtmlOverlap(type);
}

function initJangguSounds() {
  for (const type of Object.keys(JANGGU_SOUNDS)) getJangguPrimaryUrl(type);
  getJangguAudioContext();
  ensureJangguBuffers().catch(() => {});
}

/** 난이도 + 정간 인덱스(0~8) → 장구 음 종류 */
function getJangguSoundByCellIndex(level, cellIndex) {
  if (level === 1) return LEVEL1_CELL_SOUND[cellIndex] ?? "deong";
  if (level === 2) return LEVEL2_CELL_SOUND[cellIndex] ?? "deok";
  return LEVEL3_CELL_SOUND[cellIndex] ?? "deong";
}

function getJangguSticksBySoundType(soundType) {
  if (soundType === "deong") return ["gunggeul", "yeol"];
  if (soundType === "kung") return ["gunggeul"];
  return ["yeol"];
}

/** 진도 등 레거시 숫자 배열용 — 루프 i로 cellIndex 추론 (경기 아리랑은 사용 안 함) */
function inferLegacyCellIndex(level, loopIndex) {
  if (level === 1) return 0;
  const indices = level === 2 ? RHYTHM_LEVEL2_CELL_INDICES : RHYTHM_LEVEL3_CELL_INDICES;
  return indices[loopIndex % indices.length];
}

/**
 * 리듬 히트 스펙 정규화 — hitTime + cellIndex(0~8) 필수
 * spawnTime은 hitTime마다 독립 역산 (7·8칸 연속 겹침 방지)
 */
function normalizeRhythmHitSpec(spec, level, loopIndex) {
  if (spec != null && typeof spec === "object" && spec.hitTime != null) {
    let cellIndex = spec.cellIndex;
    if (cellIndex == null && spec.slot != null) cellIndex = spec.slot - 1;
    if (cellIndex == null) cellIndex = inferLegacyCellIndex(level, loopIndex);
    const hitTime = formatRhythmTime(spec.hitTime);
    return {
      hitTime,
      cellIndex,
      spawnTime: getRhythmNoteSpawnTime(hitTime)
    };
  }
  const hitTime = formatRhythmTime(spec);
  const cellIndex = inferLegacyCellIndex(level, loopIndex);
  return {
    hitTime,
    cellIndex,
    spawnTime: getRhythmNoteSpawnTime(hitTime)
  };
}

function getRhythmNoteEndTime(noteSpec) {
  if (noteSpec != null && typeof noteSpec === "object") return noteSpec.hitTime;
  return noteSpec;
}

function mapLevel1HitSpecs(hits) {
  return hits.map((t) => {
    const hitTime = formatRhythmTime(typeof t === "object" ? t.hitTime : t);
    return { hitTime, cellIndex: 0, spawnTime: getRhythmNoteSpawnTime(hitTime) };
  });
}

const JEONGGANBO_CELLS = 9;

const RHYTHM_TUNE_REVISION = 32;
let rhythmGame = null;

/** 노트가 타겟에 닿기 전 대기·확대 시간(초). 스폰 시각 = hitTime − 이 값 */
function getRhythmNoteSpawnOffset() {
  return RHYTHM_FALL_TIME;
}

function getRhythmNoteSpawnTime(hitTime) {
  return hitTime - getRhythmNoteSpawnOffset();
}

/** 리듬 타임스탬프 — 마디 내 비율 연산 후만 반올림 (칸 간격 누적 오차 방지) */
function formatRhythmTime(t) {
  return Math.round(t * 1e6) / 1e6;
}

/** 슬롯 내 마디 startTime / endTime (4등분, endTime = 다음 마디 시작 또는 슬롯 끝) */
function getMeasureBounds(slotStart, slotEnd, measureIndex, measureCount = 4) {
  const slotDuration = slotEnd - slotStart;
  const measureDuration = slotDuration / measureCount;
  const startTime = slotStart + measureIndex * measureDuration;
  const endTime = measureIndex < measureCount - 1
    ? slotStart + (measureIndex + 1) * measureDuration
    : slotEnd;
  return { startTime, endTime, measureDuration: endTime - startTime };
}

function formatJeongganboRatioHitTime(startTime, endTime, cellIndex) {
  return formatRhythmTime(getJeongganboRatioCellTime(startTime, endTime, cellIndex));
}
/** 9정간 비율 기반 절대 시각 — targetTime = start + (end−start)/9 × cellIndex */
function getJeongganboRatioCellTime(startTime, endTime, cellIndex) {
  const duration = endTime - startTime;
  return startTime + (duration / JEONGGANBO_CELLS) * cellIndex;
}

function getJgMeasureCells(measure) {
  return measure.cells ?? measure;
}

/** 정간보 9칸 격자 hitTime — getJeongganboRatioCellTime 결과(= cell.t). 가사 char 무관 */
function resolveJeongganboCellHitTime(measure, cellIndex) {
  const cells = getJgMeasureCells(measure);
  const stored = cells[cellIndex]?.t;
  if (stored != null) return stored;
  const startTime = getJgMeasureStart(measure);
  const endTime = getJgMeasureEnd(measure);
  return formatJeongganboRatioHitTime(startTime, endTime, cellIndex);
}

/** hitTime → spawnTime 단방향 파이프라인 (정간보·노트 공통) */
function createJeongganboRhythmHitSpec(measure, cellIndex) {
  const hitTime = resolveJeongganboCellHitTime(measure, cellIndex);
  return {
    hitTime,
    cellIndex,
    spawnTime: getRhythmNoteSpawnTime(hitTime),
    fromJeongganbo: true
  };
}

/** 상단 정간보 칸이 노란색(sung)으로 켜지는 절대 시각 — isJgCellSung과 동일 소스 */
function getJgCellHighlightTime(measure, cellIndex) {
  return resolveJeongganboCellHitTime(measure, cellIndex);
}

function getRhythmLevelCellIndices(level) {
  if (level === 1) return RHYTHM_LEVEL1_CELL_INDICES;
  if (level === 2) return RHYTHM_LEVEL2_CELL_INDICES;
  return RHYTHM_LEVEL3_CELL_INDICES;
}

function getJgMeasureStart(measure) {
  if (measure.startTime != null) return measure.startTime;
  const cells = getJgMeasureCells(measure);
  return cells[0]?.t ?? 0;
}

function getJgMeasureEnd(measure, fallbackDuration) {
  if (measure.endTime != null) return measure.endTime;
  const start = getJgMeasureStart(measure);
  return start + (fallbackDuration ?? 0);
}

/**
 * 마디(기본 2초) 단위 노트 히트 시각 생성
 * - 1단계: 마디 시작마다 1회 (첫 히트 firstHit, barDuration 간격)
 * - 2단계: 9칸 중 1·4·7칸
 * - 3단계: 정간 인덱스 0·3·5·6·7 (덩·덩·덕·쿵·덕)
 */
function buildRhythmNoteHitTimes({ firstHit, barDuration, barEnd, level, level3CellIndices = RHYTHM_LEVEL3_CELL_INDICES, lastHit }) {
  const hits = [];
  for (let barStart = firstHit; barStart <= barEnd; barStart += barDuration) {
    if (level === 1) {
      hits.push({ hitTime: formatRhythmTime(barStart), cellIndex: 0 });
    } else if (level === 2) {
      const barEndTime = barStart + barDuration;
      for (const cellIndex of RHYTHM_LEVEL2_CELL_INDICES) {
        hits.push({
          hitTime: formatRhythmTime(getJeongganboRatioCellTime(barStart, barEndTime, cellIndex)),
          cellIndex
        });
      }
    } else if (level === 3) {
      const barEndTime = barStart + barDuration;
      for (const cellIndex of level3CellIndices) {
        hits.push({
          hitTime: formatRhythmTime(getJeongganboRatioCellTime(barStart, barEndTime, cellIndex)),
          cellIndex
        });
      }
    }
  }
  if (level === 1 && lastHit != null) {
    const final = hits[hits.length - 1];
    if (final == null || final.hitTime < lastHit - 0.001) {
      hits.push({ hitTime: formatRhythmTime(lastHit), cellIndex: 0 });
    }
  }
  return hits;
}

function buildRhythmLevelNotes(rhythmConfig) {
  if (rhythmConfig.jeongganbo) {
    const level3Indices = rhythmConfig.level3CellIndices ?? RHYTHM_LEVEL3_CELL_INDICES;
    return {
      1: extractJeongganboRhythmHits(rhythmConfig.jeongganbo, RHYTHM_LEVEL1_CELL_INDICES),
      2: extractJeongganboRhythmHits(rhythmConfig.jeongganbo, RHYTHM_LEVEL2_CELL_INDICES),
      3: extractJeongganboRhythmHits(rhythmConfig.jeongganbo, level3Indices)
    };
  }
  const level1Raw = rhythmConfig.level1Hits
    ? rhythmConfig.level1Hits.map((t) => +Number(t).toFixed(3))
    : buildRhythmNoteHitTimes({ ...rhythmConfig, level: 1 });
  const level1 = mapLevel1HitSpecs(level1Raw);
  const level2 = rhythmConfig.level2Hits
    ? rhythmConfig.level2Hits.map((t) => +Number(t).toFixed(3))
    : rhythmConfig.level1Hits
      ? buildJeongganboLevel2Hits(level1Raw, rhythmConfig.barDuration ?? 2)
      : buildRhythmNoteHitTimes({ ...rhythmConfig, level: 2 });
  const level3Indices = rhythmConfig.level3CellIndices ?? RHYTHM_LEVEL3_CELL_INDICES;
  const level3 = rhythmConfig.level3Hits
    ? rhythmConfig.level3Hits.map((t) => +Number(t).toFixed(3))
    : rhythmConfig.level1Hits
      ? buildJeongganboLevel3Hits(level1Raw, level3Indices, rhythmConfig.barDuration ?? 2)
      : buildRhythmNoteHitTimes({ ...rhythmConfig, level: 3, level3CellIndices: level3Indices });
  return {
    1: level1,
    2: level2,
    3: level3
  };
}

/** (진도 등) level1Hits 기반 — endTime = barStart + barDuration 비율 공식 */
function getJeongganboCellTime(barStart, cellNum, barDuration) {
  return getJeongganboRatioCellTime(barStart, barStart + barDuration, cellNum - 1);
}

function buildJeongganboMeasureSlotHits(level1Hits, cellIndices, barDuration = 2) {
  const hits = [];
  for (let i = 0; i < level1Hits.length; i++) {
    const barStart = level1Hits[i];
    const barEnd = barStart + barDuration;
    for (const cellIndex of cellIndices) {
      const hitTime = formatRhythmTime(getJeongganboRatioCellTime(barStart, barEnd, cellIndex));
      hits.push({ hitTime, cellIndex, spawnTime: getRhythmNoteSpawnTime(hitTime) });
    }
  }
  return hits;
}

function buildJeongganboLevel2Hits(level1Hits, barDuration = 2) {
  return buildJeongganboMeasureSlotHits(level1Hits, RHYTHM_LEVEL2_CELL_INDICES, barDuration);
}

function buildJeongganboLevel3Hits(level1Hits, cellIndices = RHYTHM_LEVEL3_CELL_INDICES, barDuration = 2) {
  return buildJeongganboMeasureSlotHits(level1Hits, cellIndices, barDuration);
}

/**
 * 정간보 순회 — 9칸 격자 인덱스만 기준 (cell.char·공백·대시 무관, 절대 스킵 없음)
 * hitTime = cell.t (= getJeongganboRatioCellTime), spawnTime = hitTime − RHYTHM_FALL_TIME
 */
function extractJeongganboRhythmHits(jeongganbo, cellIndices) {
  const indexSet = new Set(cellIndices);
  const hits = [];
  for (const line of jeongganbo) {
    for (const measure of line.measures) {
      for (let cellIndex = 0; cellIndex < JEONGGANBO_CELLS; cellIndex++) {
        if (!indexSet.has(cellIndex)) continue;
        hits.push(createJeongganboRhythmHitSpec(measure, cellIndex));
      }
    }
  }
  hits.sort((a, b) => a.hitTime - b.hitTime || a.cellIndex - b.cellIndex);
  return hits;
}

/** 재생 시점에 정간보 타임라인과 노트 hitTime을 강제 동기화 */
function resolveRhythmHitSpecs(song, level) {
  if (song.jeongganbo?.length) {
    const level3Indices = song.rhythm?.level3CellIndices ?? RHYTHM_LEVEL3_CELL_INDICES;
    const cellIndices = level === 3 ? level3Indices : getRhythmLevelCellIndices(level);
    return extractJeongganboRhythmHits(song.jeongganbo, cellIndices);
  }
  return song.notes?.[level] ?? [];
}

/** 정간보 토큰 → 칸 문자 */
function parseJgCellToken(token) {
  if (token == null || token === "" || token === " ") return { char: "" };
  if (token === "-") return { char: "—" };
  return { char: String(token) };
}

/**
 * 정간보 빌더 — 슬롯 × 9정간 (마디 수는 slot.measures.length로 자동 산출)
 * - measureDur 지정 시: slot end = start + 마디수 × measureDur (슬롯 사이 간주 공백 허용, 진도용)
 * - measureDur 미지정 시: slot end = 다음 슬롯 시작(연속 타일링, 경기용)
 * 각 마디: startTime/endTime 경계 → targetTime = start + (end−start)/9 × index
 */
function buildGyeonggiJeongganbo({ slotStarts, slots, measureDur }) {
  return slots.map((slot, slotIdx) => {
    const start = slotStarts[slotIdx];
    const measureCount = slot.measures.length;
    const end = measureDur != null
      ? start + measureCount * measureDur
      : slotIdx < slotStarts.length - 1
        ? slotStarts[slotIdx + 1]
        : start + (slotStarts[slotIdx] - slotStarts[slotIdx - 1]);

    const measures = slot.measures.map((row, mIdx) => {
      const { startTime, endTime } = getMeasureBounds(start, end, mIdx, measureCount);
      const cells = row.map((token, cellIndex) => {
        const { char } = parseJgCellToken(token);
        return {
          char,
          cellIndex,
          slot: cellIndex + 1,
          t: formatJeongganboRatioHitTime(startTime, endTime, cellIndex)
        };
      });
      return { startTime, endTime, cells };
    });

    return {
      text: slot.text,
      slotIndex: slotIdx,
      start: formatRhythmTime(start),
      end: formatRhythmTime(end),
      measureDur: formatRhythmTime((end - start) / measureCount),
      measures
    };
  });
}

/**
 * 경기 아리랑 — 세마치 정간보 4슬롯 × 4마디 = 16마디 × 9칸 (장단 16번)
 * slotStarts: 음원(gyeonggi_arirang.mp3) 실측 박자 기반. 실제 한 마디(장단)=1.962s,
 * 슬롯(4마디)=7.848s. (기존 7.8s 가정은 곡 끝에서 −0.18s 누적 드리프트 → 점점 빨라짐)
 */
const GYEONGGI_ARIRANG_CONFIG = {
  slotStarts: [8.1, 15.948, 23.796, 31.644],
  slots: [
    {
      text: "아리랑 아리랑 아라리요",
      measures: [
        ["아", " ", " ", "-", " ", " ", "리", "랑", "-"],
        ["아", " ", " ", "-", " ", " ", "리", "랑", "-"],
        ["아", " ", " ", "라", "-", "-", "리", " ", "-"],
        ["요", " ", " ", "-", " ", " ", " ", " ", "-"]
      ]
    },
    {
      text: "아리랑 고개로 넘어간다",
      measures: [
        ["아", " ", " ", "-", " ", " ", "리", "랑", "-"],
        ["고", " ", " ", "개", "-", " ", "로", " ", "-"],
        ["넘", " ", " ", "-", " ", " ", "어", "간", "-"],
        ["다", " ", " ", "-", " ", " ", " ", " ", "-"]
      ]
    },
    {
      text: "나를 버리고 가시는 님은",
      measures: [
        ["나", " ", " ", "-", " ", " ", "를", " ", " "],
        ["버", " ", " ", " ", " ", " ", "리", " ", "고"],
        ["가", " ", " ", " ", " ", " ", "시", "는", "임"],
        ["-", " ", "은", " ", " ", " ", "-", "-", "-"]
      ]
    },
    {
      text: "십리도 못가서 발병 난다",
      measures: [
        ["십", " ", " ", "-", " ", " ", "리", "도", "-"],
        ["못", " ", " ", "-", " ", " ", "가", " ", "서"],
        ["발", " ", " ", "-", " ", " ", "병", "난", "-"],
        ["다", " ", " ", "-", " ", " ", " ", " ", "-"]
      ]
    }
  ]
};

const GYEONGGI_JEONGGANBO = buildGyeonggiJeongganbo(GYEONGGI_ARIRANG_CONFIG);
const GYEONGGI_VOCAL_START = GYEONGGI_ARIRANG_CONFIG.slotStarts[0];
const GYEONGGI_VOCAL_END = GYEONGGI_JEONGGANBO[GYEONGGI_JEONGGANBO.length - 1].end;

const GYEONGGI_RHYTHM = {
  firstHit: GYEONGGI_VOCAL_START,
  vocalStart: GYEONGGI_VOCAL_START,
  barEnd: GYEONGGI_VOCAL_END,
  slotStarts: GYEONGGI_ARIRANG_CONFIG.slotStarts,
  level3CellIndices: RHYTHM_LEVEL3_CELL_INDICES,
  jeongganbo: GYEONGGI_JEONGGANBO
};

/**
 * 진도 아리랑 — 세마치 수기 정간보. 음원(jindo_arirang.mp3) 실측: 노래 시작 7.81s, 한 마디(장단) 1.832s.
 * 가사 음절을 세마치 박(칸 0·3·6 = 강박)에 맞춰 직접 배치 — "-"는 음 늘임(붙임), " "는 빈칸.
 * (반주 온셋이 0.2s 간격으로 촘촘해 자동 음절 분리가 불가 → 박 기준 수기 배치)
 */
const JINDO_REFRAIN_A = [
  ["아", " ", "리", "아", " ", "리", "랑", "-", "-"],
  ["쓰", " ", "리", "쓰", " ", "리", "랑", "-", "-"],
  ["아", " ", "라", " ", "리", " ", "가", "-", "-"],
  ["났", " ", " ", "네", "-", "-", "-", " ", " "]
];
const JINDO_REFRAIN_B = [
  ["아", " ", " ", "리", " ", " ", "랑", "-", "-"],
  ["음", " ", " ", "음", " ", " ", "음", "-", "-"],
  ["아", " ", "라", " ", "리", " ", "가", "-", "-"],
  ["났", " ", " ", "네", "-", "-", "-", " ", " "]
];
// verse는 메기는소리/받는소리 두 줄 → 각 줄 1슬롯 = 4마디(화면당 4박스)
const JINDO_VERSE_1A = [
  ["문", " ", " ", "경", "-", "-", "새", "-", "-"],
  ["재", " ", " ", "는", "-", "-", "-", " ", " "],
  ["왠", " ", " ", "고", "-", "-", "-", " ", " "],
  ["갠", " ", " ", "가", "-", "-", "-", " ", " "]
];
const JINDO_VERSE_1B = [
  ["구", " ", " ", "부", "-", "-", "야", "-", "-"],
  ["구", " ", "부", "구", " ", "부", "가", "-", "-"],
  ["눈", " ", " ", "물", "-", "-", "이", "-", "-"],
  ["난", " ", " ", "다", "-", "-", "-", " ", " "]
];
const JINDO_VERSE_2A = [
  ["노", " ", " ", "다", "-", "-", "-", " ", " "],
  ["가", " ", " ", "세", "-", "-", "-", " ", " "],
  ["노", " ", " ", "다", "-", "-", "나", "-", "-"],
  ["가", " ", " ", "세", "-", "-", "-", " ", " "]
];
const JINDO_VERSE_2B = [
  ["저", " ", " ", "달", "-", "-", "이", "-", "-"],
  ["떴", " ", "다", "지", "도", "-", "록", "-", "-"],
  ["노", " ", " ", "다", "-", "-", "나", "-", "-"],
  ["가", " ", " ", "세", "-", "-", "-", " ", " "]
];

// 10줄 × 4마디 = 40마디, 7.81~81s 연속(간주 없음). 한 줄 = 4마디 = 화면 4박스.
const JINDO_ARIRANG_CONFIG = {
  measureDur: 1.832,
  slotStarts: [7.81, 15.138, 22.466, 29.794, 37.122, 44.45, 51.778, 59.106, 66.434, 73.762],
  slots: [
    { text: "아리 아리랑 쓰리 쓰리랑 아라리가 났네", measures: JINDO_REFRAIN_A },
    { text: "아리랑 음음음 아라리가 났네", measures: JINDO_REFRAIN_B },
    { text: "문경새재는 왠 고갠가", measures: JINDO_VERSE_1A },
    { text: "구부야 구부구부가 눈물이난다", measures: JINDO_VERSE_1B },
    { text: "아리 아리랑 쓰리 쓰리랑 아라리가 났네", measures: JINDO_REFRAIN_A },
    { text: "아리랑 음음음 아라리가 났네", measures: JINDO_REFRAIN_B },
    { text: "노다 가세 노다나 가세", measures: JINDO_VERSE_2A },
    { text: "저 달이 떴다 지도록 노다나 가세", measures: JINDO_VERSE_2B },
    { text: "아리 아리랑 쓰리 쓰리랑 아라리가 났네", measures: JINDO_REFRAIN_A },
    { text: "아리랑 음음음 아라리가 났네", measures: JINDO_REFRAIN_B }
  ]
};

const JINDO_JEONGGANBO = buildGyeonggiJeongganbo(JINDO_ARIRANG_CONFIG);
const JINDO_VOCAL_START = JINDO_ARIRANG_CONFIG.slotStarts[0];
const JINDO_VOCAL_END = JINDO_JEONGGANBO[JINDO_JEONGGANBO.length - 1].end;

const JINDO_RHYTHM = {
  firstHit: JINDO_VOCAL_START,
  vocalStart: JINDO_VOCAL_START,
  barEnd: JINDO_VOCAL_END,
  slotStarts: JINDO_ARIRANG_CONFIG.slotStarts,
  level3CellIndices: RHYTHM_LEVEL3_CELL_INDICES,
  jeongganbo: JINDO_JEONGGANBO
};

function parseLyricTimeline(lines) {
  return lines.map(({ text, syllables }) => ({
    text,
    syllables: syllables.map(([t, char]) => {
      const time = +Number(t).toFixed(3);
      if (char === " ") return { t: time, char: " ", space: true };
      return { t: time, char };
    })
  }));
}

function buildJeongganboNoteFromSpec(spec, level, logicalIndex) {
  const cellIndex = spec.cellIndex;
  const hitTime = spec.hitTime;
  const spawnTime = hitTime - getRhythmNoteSpawnOffset();
  const soundType = getJangguSoundByCellIndex(level, cellIndex);
  const sticks = getJangguSticksBySoundType(soundType);
  const noteKey = `n-${logicalIndex}-c${cellIndex}`;
  const groupId = sticks.length > 1 ? noteKey : null;
  return sticks.map((stick) => ({
    id: `${noteKey}-${stick}`,
    hitTime,
    cellIndex,
    spawnTime,
    stick,
    soundType,
    groupId,
    logicalIndex,
    judged: false,
    hit: false,
    hitTierPoints: 0,
    hitPoints: 0,
    el: null
  }));
}

function buildNoteStates(hitSpecs, level) {
  const notes = [];
  hitSpecs.forEach((spec, i) => {
    if (spec?.fromJeongganbo) {
      notes.push(...buildJeongganboNoteFromSpec(spec, level, i));
      return;
    }
    const { hitTime, cellIndex, spawnTime } = normalizeRhythmHitSpec(spec, level, i);
    const soundType = getJangguSoundByCellIndex(level, cellIndex);
    const sticks = getJangguSticksBySoundType(soundType);
    const noteKey = `n-${i}-c${cellIndex}`;
    const groupId = sticks.length > 1 ? noteKey : null;
    sticks.forEach((stick) => {
      notes.push({
        id: `${noteKey}-${stick}`,
        hitTime,
        cellIndex,
        spawnTime,
        stick,
        soundType,
        groupId,
        logicalIndex: i,
        judged: false,
        hit: false,
        hitTierPoints: 0,
        hitPoints: 0,
        el: null
      });
    });
  });
  return notes;
}

function getRhythmEndTime(song, level) {
  const lastNote = song.notes[level]?.at(-1);
  const noteEnd = lastNote != null ? getRhythmNoteEndTime(lastNote) : song.vocalStart;
  let lyricEnd = song.vocalStart;
  if (song.jeongganbo?.length) {
    const lastSlot = song.jeongganbo.at(-1);
    lyricEnd = lastSlot?.end ?? lyricEnd;
  } else if (song.lyrics?.length) {
    lyricEnd = song.lyrics.reduce((max, line) => {
      const last = line.syllables.at(-1);
      return last ? Math.max(max, last.t) : max;
    }, song.vocalStart);
  }
  return Math.max(noteEnd, lyricEnd) + 1.5;
}

const RHYTHM_SONGS = {
  gyeonggi: {
    id: "gyeonggi",
    title: "경기 아리랑",
    audioFile: "gyeonggi_arirang.mp3",
    vocalStart: GYEONGGI_VOCAL_START,
    lyrics: [],
    rhythm: GYEONGGI_RHYTHM,
    notes: buildRhythmLevelNotes(GYEONGGI_RHYTHM),
    jeongganbo: GYEONGGI_JEONGGANBO
  },
  jindo: {
    id: "jindo",
    title: "진도 아리랑",
    audioFile: "jindo_arirang.mp3",
    vocalStart: JINDO_VOCAL_START,
    lyrics: [],
    rhythm: JINDO_RHYTHM,
    notes: buildRhythmLevelNotes(JINDO_RHYTHM),
    jeongganbo: JINDO_JEONGGANBO
  }
};

const RHYTHM_LEVELS = [
  { level: 1, label: "1단계: 한 마디에 딱 1번 크게 치기" },
  { level: 2, label: "2단계: 한마디에 3 박" },
  { level: 3, label: "3단계: 진짜 세마치 장단" }
];

/** 세마치 장단 연습 — 한 마디(2초) 9칸 패턴: 덩--덩-덕쿵덕- */
const SEMACHI_REFERENCE_BAR = 2;
const SEMACHI_COUNT_IN_STEP_SEC = 1;
const SEMACHI_COUNT_IN_LABELS = ["3", "2", "1", "시작!"];
const SEMACHI_DEMO_BARS = 2;
/** 따라 연습 타격 수 (세마치 5박 × 3마디 + 1박 = 16박) */
const SEMACHI_PRACTICE_HIT_COUNT = 16;
const SEMACHI_HIT_WINDOW = 0.45;
const SEMACHI_PATTERN = [
  { char: "덩", sound: "deong" },
  { char: "-", sound: null },
  { char: "-", sound: null },
  { char: "덩", sound: "deong" },
  { char: "-", sound: null },
  { char: "덕", sound: "deok" },
  { char: "쿵", sound: "kung" },
  { char: "덕", sound: "deok" },
  { char: "-", sound: null }
];

let semachiPractice = null;

function getSemachiBarDuration(song) {
  if (song?.id === "jindo") return JINDO_ARIRANG_CONFIG.measureDur;
  if (song?.id === "gyeonggi") {
    const line = song.jeongganbo?.[0];
    return line?.measureDur ?? 1.962;
  }
  return SEMACHI_REFERENCE_BAR;
}

function getSemachiTiming(song) {
  const barDuration = getSemachiBarDuration(song);
  return {
    songId: song?.id,
    barDuration,
    demoBars: SEMACHI_DEMO_BARS,
    practiceHitCount: SEMACHI_PRACTICE_HIT_COUNT
  };
}

function getSemachiCountInDuration() {
  return SEMACHI_COUNT_IN_LABELS.length * SEMACHI_COUNT_IN_STEP_SEC;
}

function getSemachiSpawnOffset(barDuration) {
  return getRhythmNoteSpawnOffset() * (barDuration / SEMACHI_REFERENCE_BAR);
}

function getSemachiPlayStart(_timing) {
  return getSemachiCountInDuration();
}

function getSemachiSessionTime(session) {
  if (!session.running || session.clockAnchor == null) return 0;
  return getJangguAudioContext().currentTime - session.clockAnchor;
}

function stopSemachiPractice() {
  if (!semachiPractice) return;
  if (semachiPractice.rafId) cancelAnimationFrame(semachiPractice.rafId);
  if (semachiPractice.soundTimers) {
    semachiPractice.soundTimers.forEach((id) => clearTimeout(id));
  }
  if (semachiPractice.keyHandler) {
    document.removeEventListener("keydown", semachiPractice.keyHandler);
  }
  clearSemachiNotesZone();
  clearRhythmStickCues();
  semachiPractice = null;
}

function renderSemachiPatternHTML(activeCell = -1, sungCells = new Set()) {
  const cells = SEMACHI_PATTERN.map((cell, i) => {
    const isHit = cell.sound != null;
    const cls = [
      "semachi-cell",
      isHit ? "semachi-cell--hit" : "semachi-cell--rest",
      i === activeCell ? "semachi-cell--active" : "",
      sungCells.has(i) ? "semachi-cell--sung" : ""
    ].filter(Boolean).join(" ");
    const display = cell.char === "-" ? "·" : cell.char;
    return `<div class="${cls}" data-cell="${i}">${display}</div>`;
  }).join("");
  return `<div class="semachi-pattern-grid" id="semachiPattern">${cells}</div>`;
}

function buildSemachiHitSchedule(barCount, playStart, timing) {
  const barDur = timing.barDuration;
  const hits = [];
  for (let b = 0; b < barCount; b++) {
    const barStart = playStart + b * barDur;
    const barEnd = barStart + barDur;
    for (const cellIndex of RHYTHM_LEVEL3_CELL_INDICES) {
      hits.push({
        cellIndex,
        time: getJeongganboRatioCellTime(barStart, barEnd, cellIndex),
        soundType: SEMACHI_PATTERN[cellIndex].sound
      });
    }
  }
  return hits;
}

function buildSemachiPracticeHits(playStart, timing) {
  const hitsPerBar = RHYTHM_LEVEL3_CELL_INDICES.length;
  const barCount = Math.ceil(SEMACHI_PRACTICE_HIT_COUNT / hitsPerBar);
  return buildSemachiHitSchedule(barCount, playStart, timing)
    .slice(0, SEMACHI_PRACTICE_HIT_COUNT);
}

function getSemachiSessionEndTime(hits, timing, fallbackEnd) {
  const lastHit = hits.at(-1)?.time;
  if (lastHit == null) return fallbackEnd;
  return lastHit + RHYTHM_NOTE_PEAK_HOLD + 0.5;
}

function getSemachiActiveCell(t, timing) {
  const playStart = getSemachiPlayStart(timing);
  const barDur = timing.barDuration;
  if (t < playStart) return -1;
  const inBar = (t - playStart) % barDur;
  return Math.min(8, Math.floor(inBar / (barDur / JEONGGANBO_CELLS)));
}

function updateSemachiPatternDOM(activeCell, sungCells) {
  const grid = document.getElementById("semachiPattern");
  if (!grid) return;
  grid.querySelectorAll(".semachi-cell").forEach((el, i) => {
    el.classList.toggle("semachi-cell--active", i === activeCell);
    el.classList.toggle("semachi-cell--sung", sungCells.has(i));
  });
}

function setSemachiStatus(text) {
  const el = document.getElementById("semachiStatus");
  if (el) el.textContent = text;
}

function setSemachiFeedback(text, type = "good") {
  const el = document.getElementById("semachiFeedback");
  if (!el) return;
  el.textContent = text;
  el.className = `semachi-feedback semachi-feedback--${type}`;
}

function semachiStickForSound(soundType) {
  if (soundType === "deong") return "both";
  if (soundType === "kung") return "gunggeul";
  return "yeol";
}

function buildSemachiNoteStates(hits, barDuration) {
  const spawnOffset = getSemachiSpawnOffset(barDuration);
  const notes = [];
  hits.forEach((h, i) => {
    const soundType = h.soundType;
    const sticks = getJangguSticksBySoundType(soundType);
    const noteKey = `semachi-${i}-${h.time}`;
    const groupId = sticks.length > 1 ? noteKey : null;
    const hitTime = h.time;
    const spawnTime = hitTime - spawnOffset;
    sticks.forEach((stick) => {
      notes.push({
        id: `${noteKey}-${stick}`,
        hitTime,
        spawnTime,
        stick,
        soundType,
        groupId,
        peakTriggered: false,
        el: null
      });
    });
  });
  return notes;
}

function clearSemachiNotesZone() {
  const zone = document.getElementById("semachiNotes");
  if (zone) zone.innerHTML = "";
}

function syncSemachiNotes(session, t) {
  session.notes.forEach((note) => {
    if (!note.peakTriggered && t >= note.hitTime) {
      note.peakTriggered = true;
      spawnRhythmSoundLabel(note, session, "semachiNotes");
    }
  });
  updateRhythmStickCues(session.notes, t);
}

function scheduleSemachiDemoSounds(session) {
  const ctx = getJangguAudioContext();
  session.soundTimers = [];
  session.hits.forEach((h) => {
    const when = session.clockAnchor + h.time;
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    const id = setTimeout(() => {
      if (semachiPractice !== session || !session.running) return;
      if (session.fired.has(h.time)) return;
      session.fired.add(h.time);
      playJangguSound(h.soundType);
      session.sungCells.add(h.cellIndex);
    }, delayMs);
    session.soundTimers.push(id);
  });
}

function semachiLoop(session) {
  if (semachiPractice !== session) return;
  const t = getSemachiSessionTime(session);
  const activeCell = getSemachiActiveCell(t, session.timing);
  updateSemachiPatternDOM(activeCell, session.sungCells);
  syncSemachiNotes(session, t);

  const playStart = getSemachiPlayStart(session.timing);
  if (t < playStart) {
    const step = Math.min(
      SEMACHI_COUNT_IN_LABELS.length - 1,
      Math.floor(t / SEMACHI_COUNT_IN_STEP_SEC)
    );
    if (step !== session.lastCountBeat) {
      session.lastCountBeat = step;
      setSemachiStatus(SEMACHI_COUNT_IN_LABELS[step]);
    }
  } else if (t < session.endTime) {
    setSemachiStatus(session.mode === "demo" ? "시범을 들어 보세요." : "따라 쳐 보세요!");
  }

  if (t >= session.endTime) {
    session.running = false;
    session.onComplete?.();
    return;
  }
  session.rafId = requestAnimationFrame(() => semachiLoop(session));
}

function startSemachiSession(mode, onComplete, song) {
  stopSemachiPractice();
  initJangguSounds();
  const ctx = getJangguAudioContext();
  ctx.resume().catch(() => {});

  const timing = (mode === "practice"
    && state.rhythm?.semachiTiming
    && state.rhythm.semachiTiming.songId === song?.id)
    ? state.rhythm.semachiTiming
    : getSemachiTiming(song);

  const barCount = mode === "demo" ? timing.demoBars : null;
  const playStart = getSemachiPlayStart(timing);
  const hits = mode === "practice"
    ? buildSemachiPracticeHits(playStart, timing)
    : buildSemachiHitSchedule(barCount, playStart, timing);
  const endTime = mode === "practice"
    ? getSemachiSessionEndTime(hits, timing, playStart + timing.barDuration)
    : playStart + barCount * timing.barDuration + 0.3;

  const session = {
    mode,
    songId: song?.id,
    timing,
    running: true,
    clockAnchor: ctx.currentTime,
    barCount: mode === "demo" ? barCount : Math.ceil(SEMACHI_PRACTICE_HIT_COUNT / RHYTHM_LEVEL3_CELL_INDICES.length),
    playStart,
    endTime,
    hits,
    notes: [],
    shownLabels: new Set(),
    fired: new Set(),
    sungCells: new Set(),
    scoredHits: new Set(),
    soundTimers: [],
    good: 0,
    lastCountBeat: -1,
    onComplete,
    rafId: null,
    keyHandler(e) {
      if (semachiPractice !== session || session.mode !== "practice" || !session.running) return;
      if (e.code === "Space") {
        e.preventDefault();
        semachiPracticeInput("both");
      } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        e.preventDefault();
        semachiPracticeInput("gunggeul");
      } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        e.preventDefault();
        semachiPracticeInput("yeol");
      }
    }
  };

  session.notes = buildSemachiNoteStates(session.hits, timing.barDuration);
  clearSemachiNotesZone();

  semachiPractice = session;
  if (mode === "demo") {
    scheduleSemachiDemoSounds(session);
  }
  if (mode === "practice") {
    document.addEventListener("keydown", session.keyHandler);
  }
  setSemachiStatus(mode === "demo" ? "시범이 시작됐어요." : "따라 쳐 보세요!");
  session.rafId = requestAnimationFrame(() => semachiLoop(session));
}

function semachiPracticeInput(stick) {
  const session = semachiPractice;
  if (!session || session.mode !== "practice" || !session.running) return;
  const t = getSemachiSessionTime(session);
  const soundType = JANGGU_INPUT_SOUND[stick] ?? "deong";
  playJangguSound(soundType);
  bounceRhythmTarget(stick === "both" ? "both" : stick);

  let best = null;
  let bestDiff = Infinity;
  for (const h of session.hits) {
    if (session.scoredHits.has(h.time)) continue;
    const expected = semachiStickForSound(h.soundType);
    if (stick !== expected) continue;
    const diff = Math.abs(t - h.time);
    if (diff <= SEMACHI_HIT_WINDOW && diff < bestDiff) {
      best = h;
      bestDiff = diff;
    }
  }

  if (best) {
    session.scoredHits.add(best.time);
    session.good++;
    session.sungCells.add(best.cellIndex);
    updateSemachiPatternDOM(getSemachiActiveCell(t, session.timing), session.sungCells);
    setSemachiFeedback("좋아요!", "good");
  } else {
    setSemachiFeedback("아쉬워요!", "miss");
  }
}

function renderRhythmSemachiPractice() {
  const songId = state.rhythm.song;
  const song = RHYTHM_SONGS[songId];
  if (!song) {
    state.rhythm.screen = "song";
    return renderStage4Act3();
  }

  app.innerHTML = rhythmSceneTemplate(`${song.title} — 세마치 장단 연습`, `
    <div class="rhythm-menu-card rhythm-semachi-card">
      <p class="rhythm-menu-desc">
        3단계는 <strong>세마치 장단</strong>이에요!<br />
        한 마디 안에서 <strong>덩 · · 덩 · 덕 쿵 덕 ·</strong> 순서로 쳐요.<br />
        연습을 마친 뒤 <strong>${song.title}</strong>에 맞춰 장단을 연주해요.
      </p>
      ${renderSemachiPatternHTML()}
      <p class="semachi-pattern-caption">덩 &nbsp; - &nbsp; - &nbsp; 덩 &nbsp; - &nbsp; 덕 &nbsp; 쿵 &nbsp; 덕 &nbsp; -</p>
      <p class="semachi-status" id="semachiStatus">시범을 듣고 따라 연습해 보세요.</p>
      <p class="semachi-feedback" id="semachiFeedback"></p>
      <div class="rhythm-playfield semachi-playfield">
        <div class="rhythm-note-zone" id="semachiNotes"></div>
        <div class="rhythm-janggu-area">
          ${rhythmJangguSparkleZonesHTML()}
          <img class="rhythm-janggu-img" src="${IMG("janggu.png")}" alt="장구" />
          <button type="button" class="rhythm-stick-target rhythm-stick-target--gunggeul" id="semachiTargetGunggeul" aria-label="궁글채 치기">
            <img src="${IMG("note_gunggeul.png")}" alt="궁글채" />
          </button>
          <button type="button" class="rhythm-stick-target rhythm-stick-target--yeol" id="semachiTargetYeol" aria-label="열채 치기">
            <img src="${IMG("note_yeol.png")}" alt="열채" />
          </button>
          <button type="button" class="rhythm-stick-target rhythm-stick-target--both" id="semachiTargetBoth" aria-label="양쪽 치기 (덩)">
          </button>
        </div>
      </div>
      <p class="rhythm-hint">덩: 스페이스 또는 가운데 원, 쿵: ←, 덕: →<br />또는 화면 북채 터치</p>
      <div class="semachi-actions">
        <button type="button" class="btn primary" id="semachiDemoBtn">▶ 시범 보기</button>
        <button type="button" class="btn" id="semachiTryBtn">따라 연습</button>
        <button type="button" class="btn primary hidden" id="semachiStartL3">🎵 노래에 맞춰 연주하기!</button>
      </div>
      <button type="button" class="btn rhythm-back-btn" id="semachiBack">◀ 레벨 선택</button>
    </div>
  `);
  setupNavigationAndHelp("세마치 장단 덩--덩-덕쿵덕- 패턴을 익힌 뒤, 노래에 맞춰 장단을 연주해 보자!");

  const demoBtn = document.getElementById("semachiDemoBtn");
  const tryBtn = document.getElementById("semachiTryBtn");
  const startL3 = document.getElementById("semachiStartL3");

  const setButtonsEnabled = (demo, practice, start) => {
    if (demoBtn) demoBtn.disabled = !demo;
    if (tryBtn) tryBtn.disabled = !practice;
    if (startL3) startL3.classList.toggle("hidden", !start);
  };

  setButtonsEnabled(true, true, false);

  const hasSemachiReady = state.rhythm?.semachiTiming?.songId === song.id;
  if (hasSemachiReady) {
    setSemachiStatus("연습을 마쳤어요. 이제 노래에 맞춰 장단을 연주해 보세요.");
    setButtonsEnabled(true, true, true);
  }

  const semachiStickHandler = (stick) => {
    if (semachiPractice?.mode === "practice" && semachiPractice.running) {
      semachiPracticeInput(stick);
    } else {
      playJangguSound(JANGGU_INPUT_SOUND[stick] ?? "deong");
      bounceRhythmTarget(stick === "both" ? "both" : stick);
    }
  };
  const bindSemachiTarget = (el, stick) => {
    if (!el) return;
    const fire = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      semachiStickHandler(stick);
    };
    if (window.PointerEvent) {
      el.addEventListener("pointerdown", fire);
      // 터치·마우스는 pointerdown에서 처리. 손을 뗄 때 오는 click이
      // 한 번 더 실행돼 두 번 소리 나는 것을 막고, 키보드 입력(detail=0)만 허용.
      el.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.detail !== 0) return;
        semachiStickHandler(stick);
      });
    } else {
      el.addEventListener("touchstart", (e) => {
        e.preventDefault();
        semachiStickHandler(stick);
      }, { passive: false });
      el.addEventListener("click", (e) => {
        e.preventDefault();
        semachiStickHandler(stick);
      });
    }
  };
  bindSemachiTarget(document.getElementById("semachiTargetGunggeul"), "gunggeul");
  bindSemachiTarget(document.getElementById("semachiTargetYeol"), "yeol");
  bindSemachiTarget(document.getElementById("semachiTargetBoth"), "both");

  demoBtn.onclick = () => {
    playSound("click.mp3");
    setButtonsEnabled(false, false, false);
    setSemachiFeedback("");
    startSemachiSession("demo", () => {
      if (semachiPractice) {
        state.rhythm.semachiTiming = { ...semachiPractice.timing, songId: song.id };
      }
      setSemachiStatus("시범이 끝났어요. 따라 연습해 보세요!");
      setButtonsEnabled(true, true, false);
    }, song);
  };

  tryBtn.onclick = () => {
    playSound("click.mp3");
    setButtonsEnabled(false, false, false);
    setSemachiFeedback("");
    startSemachiSession("practice", () => {
      const session = semachiPractice;
      const total = session?.hits?.length ?? 0;
      const good = session?.good ?? 0;
      const passed = total > 0 && good >= Math.ceil(total * 0.6);
      // 연습 점수와 관계없이 노래 연주 버튼을 열어 줌 (다시 연습도 가능)
      if (passed) {
        setSemachiStatus("잘했어요! 이제 노래에 맞춰 장단을 연주해 보세요.");
        setSemachiFeedback(`${good} / ${total}박 성공!`, "good");
      } else {
        setSemachiStatus("연습이 끝났어요. 더 연습하거나 노래에 맞춰 연주해 보세요!");
        setSemachiFeedback(`${good} / ${total}박 — 다시 연습해도 괜찮아요.`, "miss");
      }
      setButtonsEnabled(true, true, true);
    }, song);
  };

  if (startL3) {
    startL3.onclick = () => {
      playSound("click.mp3");
      stopSemachiPractice();
      state.rhythm.level = 3;
      state.rhythm.screen = "play";
      preloadRhythmAudio(songId);
      render();
    };
  }

  document.getElementById("semachiBack").onclick = () => {
    playSound("click.mp3");
    stopSemachiPractice();
    state.rhythm.screen = "levels";
    render();
  };
}

function getRhythmSongProgress(songId) {
  return state.rhythmProgress[songId] || { unlocked: 1, cleared: [false, false, false] };
}

function rhythmSceneTemplate(title, body, compact = false) {
  const header = compact
    ? `<div class="rhythm-stage-header rhythm-stage-header--compact"><h2 class="rhythm-stage-title">${title}</h2></div>`
    : `<div class="rhythm-stage-header"><h2 class="rhythm-stage-title">${title}</h2></div>`;
  return `
    <div class="stage-screen rhythm-stage">
      <img class="stage-bg" src="${IMG("stage4-bg.png")}" alt="" decoding="async" fetchpriority="low" />
      <div class="rhythm-stage-overlay">
        ${activityToolbarHTML()}
        ${header}
        ${body}
      </div>
    </div>
  `;
}

function stopRhythmGame() {
  if (!rhythmGame) return;
  if (rhythmGame.rafId) cancelAnimationFrame(rhythmGame.rafId);
  if (rhythmGame.audio) {
    if (rhythmGame.onTimeUpdate) {
      rhythmGame.audio.removeEventListener("timeupdate", rhythmGame.onTimeUpdate);
    }
    rhythmGame.audio.pause();
    rhythmGame.audio.onended = null;
    rhythmGame.audio.src = "";
    if (rhythmGame.audio === state.rhythmPreload) {
      state.rhythmPreload = null;
    }
  }
  if (rhythmGame.keyHandler) {
    document.removeEventListener("keydown", rhythmGame.keyHandler);
  }
  if (rhythmGame.onResize) {
    window.removeEventListener("resize", rhythmGame.onResize);
  }
  rhythmGame.ended = true;
  clearRhythmStickCues();
  rhythmGame = null;
}

function createRhythmAudio(song) {
  const audio = new Audio(SND(song.audioFile));
  audio.preload = "auto";
  return audio;
}

function getRhythmAudioTime(game) {
  if (!game?.audio || !game.started) return 0;
  return game.audio.currentTime;
}


function getJeongganboLineRange(line) {
  if (line.start != null && line.end != null) return { start: line.start, end: line.end };
  const times = line.measures.flatMap((m) => getJgMeasureCells(m).map((c) => c.t).filter((t) => t != null));
  if (!times.length) return { start: 0, end: 0 };
  return { start: times[0], end: times[times.length - 1] };
}

function getActiveMeasureIndex(measures, t) {
  for (let i = measures.length - 1; i >= 0; i--) {
    if (t >= getJgMeasureStart(measures[i])) return i;
  }
  return 0;
}

function isJgCellSung(cell, t, phase) {
  if (phase === "future") return false;
  if (cell.t == null) return false;
  return t >= cell.t;
}

function renderJeongganboMeasure(measure, t, options = {}) {
  const { phase = "current" } = options;
  const cells = getJgMeasureCells(measure);
  const lyricCells = cells.map((cell, i) => {
    const sung = isJgCellSung(cell, t, phase);
    const slot = i + 1;
    const groupEnd = slot % 3 === 0;
    const empty = !cell.char;
    const display = empty ? "\u00a0" : cell.char;
    const tAttr = cell.t != null ? ` data-t="${cell.t}"` : "";
    return `<div class="jg-cell jg-cell--lyric${groupEnd ? " jg-cell--dae" : ""}${empty ? " jg-cell--empty" : ""}${sung ? " sung" : ""}"${tAttr}>${display}</div>`;
  }).join("");

  return `
    <div class="jg-measure jg-measure--${phase}" data-mstart="${measure.start ?? ""}" data-mend="${measure.end ?? ""}">
      <div class="jg-accent" aria-hidden="true">&lt;</div>
      <div class="jg-lyric-row">${lyricCells}</div>
    </div>`;
}

function syncJeongganboSungDOM(root, line, t) {
  if (!root || !line) return;
  const activeIdx = getActiveMeasureIndex(line.measures, t);
  root.querySelectorAll(".jg-measure").forEach((el, i) => {
    const phase = i < activeIdx ? "past" : i === activeIdx ? "current" : "future";
    el.classList.toggle("jg-measure--past", phase === "past");
    el.classList.toggle("jg-measure--current", phase === "current");
    el.classList.toggle("jg-measure--future", phase === "future");
    el.querySelectorAll(".jg-cell--lyric").forEach((cell) => {
      const ct = cell.dataset.t;
      const sung = phase !== "future" && ct != null && t >= Number(ct);
      cell.classList.toggle("sung", sung);
    });
  });
}

function renderJeongganboLine(line, t) {
  const activeIdx = getActiveMeasureIndex(line.measures, t);
  return `<div class="jg-score-line">
    <p class="jg-slot-title">${line.text || ""}</p>
    <div class="jg-measures">${line.measures.map((m, i) => {
      const phase = i < activeIdx ? "past" : i === activeIdx ? "current" : "future";
      return renderJeongganboMeasure(m, t, { phase });
    }).join("")}</div>
  </div>`;
}

function getActiveJeongganboLine(jeongganbo, t, vocalStart) {
  if (!jeongganbo.length) return null;
  if (t < vocalStart) return jeongganbo[0];
  for (let i = jeongganbo.length - 1; i >= 0; i--) {
    const line = jeongganbo[i];
    const start = line.start ?? getJeongganboLineRange(line).start;
    if (t >= start) return line;
  }
  return jeongganbo[0];
}

function renderJeongganboLyricsHTML(jeongganbo, t, vocalStart) {
  const line = getActiveJeongganboLine(jeongganbo, t, vocalStart);
  if (!line) return "";

  const introHtml = t < vocalStart ? `<p class="rhythm-lyric-intro">♪ 간주 중...</p>` : "";
  return `${introHtml}<div class="jg-score">${renderJeongganboLine(line, t)}</div>`;
}

function getLineTimeRange(line) {
  const syllables = line.syllables.filter((s) => !s.space);
  if (!syllables.length) return { start: 0, end: 0 };
  return { start: syllables[0].t, end: syllables[syllables.length - 1].t };
}

function getActiveLyricLine(lyrics, t, vocalStart) {
  if (!lyrics.length) return null;
  if (t < vocalStart) return lyrics[0];
  for (let i = lyrics.length - 1; i >= 0; i--) {
    const { start } = getLineTimeRange(lyrics[i]);
    if (t >= start) return lyrics[i];
  }
  return lyrics[0];
}

function renderRhythmLyricsHTML(lyrics, t, vocalStart, jeongganbo) {
  if (jeongganbo?.length) return renderJeongganboLyricsHTML(jeongganbo, t, vocalStart);

  const line = getActiveLyricLine(lyrics, t, vocalStart);
  if (!line) return "";

  const chars = line.syllables.map((s) => {
    if (s.space) return `<span class="rhythm-syllable rhythm-syllable--space"> </span>`;
    const sung = t >= s.t;
    return `<span class="rhythm-syllable${sung ? " sung" : ""}">${s.char}</span>`;
  }).join("");

  const introHtml = t < vocalStart ? `<p class="rhythm-lyric-intro">♪ 간주 중...</p>` : "";
  return `${introHtml}<div class="rhythm-lyric-line">${chars}</div>`;
}

function updateRhythmLyricsDOM(game, t) {
  const el = document.getElementById("rhythmLyrics");
  if (!el) return;
  const jb = game.song.jeongganbo;
  if (jb?.length) {
    const line = getActiveJeongganboLine(jb, t, game.vocalStart);
    const lineKey = line ? `${line.start}|${line.text || ""}` : "";
    const showIntro = t < game.vocalStart;
    if (game._lyricKey !== lineKey || game._lyricIntro !== showIntro || !el.querySelector(".jg-score")) {
      game._lyricKey = lineKey;
      game._lyricIntro = showIntro;
      el.innerHTML = renderJeongganboLyricsHTML(jb, t, game.vocalStart);
      return;
    }
    syncJeongganboSungDOM(el, line, t);
    return;
  }

  const line = getActiveLyricLine(game.song.lyrics, t, game.vocalStart);
  const lineKey = line ? `${getLineTimeRange(line).start}|${line.syllables?.length || 0}` : "";
  const showIntro = t < game.vocalStart;
  if (game._lyricKey !== lineKey || game._lyricIntro !== showIntro || !el.querySelector(".rhythm-lyric-line")) {
    game._lyricKey = lineKey;
    game._lyricIntro = showIntro;
    el.innerHTML = renderRhythmLyricsHTML(game.song.lyrics, t, game.vocalStart, null);
    return;
  }
  if (!line) return;
  const spans = el.querySelectorAll(".rhythm-syllable:not(.rhythm-syllable--space)");
  let si = 0;
  line.syllables.forEach((s) => {
    if (s.space) return;
    const span = spans[si++];
    if (span) span.classList.toggle("sung", t >= s.t);
  });
}

function syncRhythmNotes(game, t) {
  game.notes.forEach((note) => {
    if (!note.peakTriggered && t >= note.hitTime) {
      note.peakTriggered = true;
      spawnRhythmSoundLabel(note, game);
    }
  });
  updateRhythmStickCues(game.notes, t);

  const logicalHits = new Map();
  game.notes.forEach((n) => {
    const key = n.groupId || n.id;
    if (!logicalHits.has(key)) logicalHits.set(key, []);
    logicalHits.get(key).push(n);
  });

  for (const [key, group] of logicalHits) {
    const hitTime = group[0].hitTime;
    if (t <= hitTime + RHYTHM_HIT_WINDOW) continue;
    if (group.every((n) => n.hit)) continue;
    if (game.missedGroups?.has(key)) continue;
    if (!game.missedGroups) game.missedGroups = new Set();
    game.missedGroups.add(key);

    group.forEach((n) => {
      if (n.judged && n.hit) return;
      n.judged = true;
    });
    showRhythmFeedback("아쉬워요!", "miss");
  }
  updateRhythmHudScore(game.notes);
}

function onRhythmTimeUpdate(game) {
  if (!rhythmGame || rhythmGame !== game || game.ended || !game.started) return;
  const t = game.audio.currentTime;
  if (t >= game.endTime) finishRhythmGame();
}

function rhythmVisualLoop(game) {
  if (!rhythmGame || rhythmGame !== game || game.ended || !game.started) return;
  const t = game.audio.currentTime;
  updateRhythmLyricsDOM(game, t);
  syncRhythmNotes(game, t);
  game.rafId = requestAnimationFrame(() => rhythmVisualLoop(game));
}

function showRhythmFeedback(text, type = "good") {
  const el = document.getElementById("rhythmFeedback");
  if (!el) return;
  el.textContent = text;
  el.className = `rhythm-feedback rhythm-feedback--${type}`;
  clearTimeout(showRhythmFeedback._timer);
  showRhythmFeedback._timer = setTimeout(() => {
    if (el.textContent === text) el.textContent = "";
  }, 900);
}

function setRhythmStickCueClass(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("rhythm-target--cue", !!on);
}

function setRhythmSparkleZoneCue(side, on) {
  const id = side === "left" ? "jangguSparkleLeft" : "jangguSparkleRight";
  const el = document.getElementById(id);
  if (el) el.classList.toggle("rhythm-sparkle-zone--cue", !!on);
}

function clearRhythmSparkleZones() {
  ["jangguSparkleLeft", "jangguSparkleRight"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("rhythm-sparkle-zone--cue", "rhythm-sparkle-zone--hit");
  });
}

function flashRhythmSparkleZone(side) {
  const id = side === "left" ? "jangguSparkleLeft" : "jangguSparkleRight";
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("rhythm-sparkle-zone--hit");
  void el.offsetWidth;
  el.classList.add("rhythm-sparkle-zone--hit");
  setTimeout(() => el.classList.remove("rhythm-sparkle-zone--hit"), 560);
}

function clearRhythmStickCues() {
  ["rhythmTargetGunggeul", "rhythmTargetYeol", "rhythmTargetBoth",
    "semachiTargetGunggeul", "semachiTargetYeol", "semachiTargetBoth"]
    .forEach((id) => setRhythmStickCueClass(id, false));
  clearRhythmSparkleZones();
}

/** 칠 시각보다 조금 먼저 옆 궁채·북채를 키워 반응 시간을 맞춤 */
function updateRhythmStickCues(notes, t) {
  const cue = { gunggeul: false, yeol: false };
  (notes || []).forEach((note) => {
    if (note.stick !== "gunggeul" && note.stick !== "yeol") return;
    if (t >= note.hitTime - RHYTHM_STICK_CUE_LEAD && t <= note.hitTime + RHYTHM_STICK_CUE_HOLD) {
      cue[note.stick] = true;
    }
  });
  setRhythmStickCueClass("rhythmTargetGunggeul", cue.gunggeul);
  setRhythmStickCueClass("rhythmTargetYeol", cue.yeol);
  setRhythmStickCueClass("semachiTargetGunggeul", cue.gunggeul);
  setRhythmStickCueClass("semachiTargetYeol", cue.yeol);
  const bothCue = cue.gunggeul && cue.yeol;
  setRhythmStickCueClass("rhythmTargetBoth", bothCue);
  setRhythmStickCueClass("semachiTargetBoth", bothCue);
  setRhythmSparkleZoneCue("left", cue.gunggeul);
  setRhythmSparkleZoneCue("right", cue.yeol);
}

function flashRhythmStickAtHit(soundType) {
  if (soundType === "deong") {
    flashRhythmSparkleZone("left");
    flashRhythmSparkleZone("right");
    return;
  }
  if (soundType === "kung") flashRhythmSparkleZone("left");
  if (soundType === "deok") flashRhythmSparkleZone("right");
}

function bounceRhythmTarget(stick) {
  const targetMap = {
    gunggeul: ["rhythmTargetGunggeul", "semachiTargetGunggeul"],
    yeol: ["rhythmTargetYeol", "semachiTargetYeol"]
  };
  const keys = stick === "both" ? ["gunggeul", "yeol"]
    : stick === "gunggeul" ? ["gunggeul"]
    : stick === "yeol" ? ["yeol"] : [];
  keys.forEach((key) => {
    (targetMap[key] || []).forEach((id) => {
      const target = document.getElementById(id);
      if (!target) return;
      const img = target.querySelector("img");
      target.classList.remove("rhythm-target--bounce");
      if (img) img.classList.remove("rhythm-target-img--bounce");
      void target.offsetWidth;
      target.classList.add("rhythm-target--bounce");
      if (img) img.classList.add("rhythm-target-img--bounce");
    });
  });
}

function findNearestRhythmNote(notes, t, stick) {
  let best = null;
  let bestDiff = Infinity;
  for (const note of notes) {
    if (note.stick !== stick) continue;
    const diff = Math.abs(t - note.hitTime);
    if (diff < bestDiff) {
      best = note;
      bestDiff = diff;
    }
  }
  return { note: best, diff: bestDiff };
}

function findScorableRhythmNote(notes, t, stick) {
  let best = null;
  let bestDiff = Infinity;
  for (const note of notes) {
    if (note.judged || note.stick !== stick) continue;
    const diff = Math.abs(t - note.hitTime);
    if (diff <= RHYTHM_HIT_WINDOW && diff < bestDiff) {
      best = note;
      bestDiff = diff;
    }
  }
  return { note: best, diff: bestDiff };
}

function getRhythmHitFeedback(points) {
  if (points >= RHYTHM_SCORE_PERFECT) return { text: "완벽!", type: "good" };
  if (points >= RHYTHM_SCORE_GOOD) return { text: "참 잘했어요!", type: "good" };
  if (points >= RHYTHM_SCORE_OK) return { text: "좋아요!", type: "good" };
  return { text: "아쉬워요!", type: "miss" };
}

/** 타이밍 오차(초) → 고정 점수: 20 / 15 / 10 / 0 */
function getRhythmHitPoints(diff) {
  if (diff > RHYTHM_HIT_WINDOW) return 0;
  if (diff <= RHYTHM_HIT_TIER_PERFECT) return RHYTHM_SCORE_PERFECT;
  if (diff <= RHYTHM_HIT_TIER_GOOD) return RHYTHM_SCORE_GOOD;
  return RHYTHM_SCORE_OK;
}

function calcRhythmScore(notes) {
  if (!notes.length) return 0;
  const groups = new Map();
  notes.forEach((n) => {
    const key = n.groupId || n.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(n);
  });
  let total = 0;
  for (const group of groups.values()) {
    total += group.reduce((sum, n) => sum + (n.hitPoints || 0), 0);
  }
  return Math.round(total);
}

function updateRhythmHudScore(notes) {
  const el = document.getElementById("rhythmHudScore");
  if (el) el.textContent = `${calcRhythmScore(notes)}점`;
}

function spawnRhythmSoundLabel(note, game, notesId = "rhythmNotes") {
  const zone = document.getElementById(notesId);
  if (!zone) return;
  const key = note.groupId || note.id;
  if (game.shownLabels?.has(key)) return;
  if (!game.shownLabels) game.shownLabels = new Set();
  game.shownLabels.add(key);

  const char = RHYTHM_SOUND_CHAR[note.soundType];
  if (!char) return;

  const el = document.createElement("div");
  el.className = `rhythm-sound-label rhythm-sound-label--${note.soundType}`;
  el.textContent = char;
  el.setAttribute("aria-hidden", "true");
  zone.appendChild(el);
  flashRhythmStickAtHit(note.soundType);
  setTimeout(() => el.remove(), RHYTHM_SOUND_LABEL_MS);
}

function processRhythmStickHit(stick) {
  if (!rhythmGame || !rhythmGame.started || rhythmGame.ended) return;
  const t = getRhythmAudioTime(rhythmGame);
  const notes = rhythmGame.notes;

  const scorable = findScorableRhythmNote(notes, t, stick);
  if (!scorable.note) {
    const nearest = findNearestRhythmNote(notes, t, stick);
    if (nearest.note && nearest.diff <= RHYTHM_HIT_WINDOW * 1.3) {
      showRhythmFeedback("아쉬워요!", "miss");
    }
    return;
  }

  const note = scorable.note;
  const tierPoints = getRhythmHitPoints(scorable.diff);
  note.judged = true;
  note.hit = true;
  note.hitTierPoints = tierPoints;

  if (note.groupId) {
    const group = notes.filter((n) => n.groupId === note.groupId);
    if (group.every((n) => n.hit)) {
      const combinedPoints = Math.min(...group.map((n) => n.hitTierPoints ?? 0));
      group.forEach((n) => { n.hitPoints = 0; });
      group[0].hitPoints = combinedPoints;
      const fb = getRhythmHitFeedback(combinedPoints);
      showRhythmFeedback(fb.text, fb.type);
    }
  } else {
    note.hitPoints = tierPoints;
    const fb = getRhythmHitFeedback(tierPoints);
    showRhythmFeedback(fb.text, fb.type);
  }
  updateRhythmHudScore(notes);
}

function rhythmHitInput(stick = "both") {
  const soundType = JANGGU_INPUT_SOUND[stick] ?? "deong";
  playJangguSound(soundType);
  bounceRhythmTarget(stick === "both" ? "both" : stick);

  if (stick === "both") {
    processRhythmStickHit("gunggeul");
    processRhythmStickHit("yeol");
  } else {
    processRhythmStickHit(stick);
  }
}

function finishRhythmGame() {
  if (!rhythmGame || rhythmGame.ended) return;
  rhythmGame.ended = true;
  if (rhythmGame.rafId) cancelAnimationFrame(rhythmGame.rafId);
  clearRhythmStickCues();
  if (rhythmGame.audio) {
    if (rhythmGame.onTimeUpdate) {
      rhythmGame.audio.removeEventListener("timeupdate", rhythmGame.onTimeUpdate);
    }
    rhythmGame.audio.pause();
  }
  const score = calcRhythmScore(rhythmGame.notes);
  const songId = state.rhythm.song;
  const level = state.rhythm.level;
  const prog = getRhythmSongProgress(songId);

  const passScore = getRhythmPassScore(level);

  if (score >= passScore) {
    prog.cleared[level - 1] = true;
    if (level < 3 && prog.unlocked < level + 1) prog.unlocked = level + 1;
    state.rhythmProgress[songId] = prog;
    if (level === 3) {
      state.rhythmProgress.complete = true;
      state.solved.rhythm = true;
    }
    saveProgress();

    if (level === 3) {
      state.rhythm.screen = "ending";
      stopRhythmGame();
      render();
    } else {
      Swal.fire({
        title: `${level}단계 성공!`,
        html: `<p>점수 <strong>${score}점</strong></p><p>🔓 ${level + 1}단계가 열렸어요!</p>`,
        icon: "success",
        confirmButtonText: "레벨 선택으로"
      }).then(() => {
        state.rhythm.screen = "levels";
        stopRhythmGame();
        render();
      });
    }
  } else {
    Swal.fire({
      title: "아쉽다!",
      html: `<p>점수 <strong>${score}점</strong> (${passScore}점 이상 필요)</p><p>다시 도전해 볼까?</p>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "다시 도전",
      cancelButtonText: "레벨 선택"
    }).then((res) => {
      stopRhythmGame();
      if (res.isConfirmed) {
        state.rhythm.screen = "play";
        render();
      } else {
        state.rhythm.screen = "levels";
        render();
      }
    });
  }
}

function bindRhythmStickTarget(el, stick) {
  if (!el) return;
  const fire = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    rhythmHitInput(stick);
  };
  if (window.PointerEvent) {
    el.addEventListener("pointerdown", fire);
    // 터치·마우스는 pointerdown에서 이미 처리됨. 터치의 경우 손을 뗄 때
    // click이 뒤늦게 한 번 더 오므로(두 번 소리 원인) 여기서는
    // 키보드(Enter/Space, detail=0)로 누른 경우만 처리한다.
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.detail !== 0) return;
      rhythmHitInput(stick);
    });
  } else {
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      rhythmHitInput(stick);
    }, { passive: false });
    el.addEventListener("click", (e) => {
      e.preventDefault();
      rhythmHitInput(stick);
    });
  }
}

function startRhythmGameplay(song, level) {
  stopRhythmGame();
  const hitTimes = resolveRhythmHitSpecs(song, level);
  if (!hitTimes?.length) return;

  const notes = buildNoteStates(hitTimes, level);
  const audio = createRhythmAudio(song);

  const game = {
    song,
    level,
    notes,
    logicalHitCount: hitTimes.length,
    missedGroups: new Set(),
    shownLabels: new Set(),
    audio,
    vocalStart: song.vocalStart,
    endTime: getRhythmEndTime(song, level),
    started: false,
    ended: false,
    rafId: null,
    onTimeUpdate: null,
    keyHandler(e) {
      if (e.code === "Space") {
        e.preventDefault();
        rhythmHitInput("both");
      } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        e.preventDefault();
        rhythmHitInput("gunggeul");
      } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        e.preventDefault();
        rhythmHitInput("yeol");
      }
    }
  };
  rhythmGame = game;

  const firstJgCell = song.jeongganbo?.[0]?.measures?.[0]?.cells?.[0]
    ?? song.jeongganbo?.[0]?.measures?.[0]?.[0];
  const firstSyllable = song.lyrics?.[0]?.syllables?.find((s) => !s.space);
  const firstLyric = firstJgCell
    ? `${firstJgCell.char}@${firstJgCell.t}s`
    : firstSyllable ? `${firstSyllable.char}@${firstSyllable.t}s` : "—";
  console.info(
    `[우리민요] 데이터 rev.${RHYTHM_TUNE_REVISION} | ${song.title} | vocalStart=${song.vocalStart}s | 첫 가사=${firstLyric} | 1단계 첫 노트=${getRhythmNoteEndTime(song.notes?.[1]?.[0])}s`
  );

  const isLive = () => rhythmGame === game && !game.ended;

  game.onTimeUpdate = () => onRhythmTimeUpdate(game);
  audio.addEventListener("timeupdate", game.onTimeUpdate);

  document.addEventListener("keydown", game.keyHandler);

  const targetGunggeul = document.getElementById("rhythmTargetGunggeul");
  const targetYeol = document.getElementById("rhythmTargetYeol");
  bindRhythmStickTarget(targetGunggeul, "gunggeul");
  bindRhythmStickTarget(targetYeol, "yeol");
  bindRhythmStickTarget(document.getElementById("rhythmTargetBoth"), "both");

  initJangguSounds();

  const begin = () => {
    if (!isLive() || game.started) return;
    game.started = true;
    initJangguSounds();
    getJangguAudioContext().resume().catch(() => {});
    ensureJangguBuffers().catch(() => {});
    const overlay = document.getElementById("rhythmStartOverlay");
    if (overlay) overlay.classList.add("hidden");

    audio.currentTime = 0;
    onRhythmTimeUpdate(game);
    rhythmVisualLoop(game);

    audio.play().catch(() => {});
  };

  const startBtn = document.getElementById("rhythmStartBtn");
  if (startBtn) startBtn.onclick = begin;

  audio.onended = () => {
    if (!isLive()) return;
    finishRhythmGame();
  };
}

function renderRhythmSongSelect() {
  app.innerHTML = rhythmSceneTemplate("우리민요 얼쑤! — 곡 선택", `
    <div class="rhythm-menu-card rhythm-menu-card--songs">
      <p class="rhythm-menu-desc">연주할 민요를 골라 주세요.</p>
      <div class="rhythm-song-grid">
        <button type="button" class="rhythm-song-btn" data-song="gyeonggi">
          <span class="rhythm-song-icon">🎵</span>
          <strong>경기 아리랑</strong>
        </button>
        <button type="button" class="rhythm-song-btn" data-song="jindo">
          <span class="rhythm-song-icon">🎶</span>
          <strong>진도 아리랑</strong>
        </button>
      </div>
    </div>
  `);
  setupNavigationAndHelp("민요 곡을 하나 골라 보자!");

  document.querySelectorAll("[data-song]").forEach((btn) => {
    btn.onclick = () => {
      state.rhythm.song = btn.dataset.song;
      state.rhythm.semachiTiming = null;
      state.rhythm.screen = "levels";
      preloadRhythmAudio(state.rhythm.song);
      playSound("click.mp3");
      render();
    };
  });
}

function preloadRhythmAudio(songId) {
  const song = RHYTHM_SONGS[songId];
  if (!song) return;
  if (state.rhythmPreload?._rhythmSongId === songId && state.rhythmPreload.src) return;
  state.rhythmPreload = createRhythmAudio(song);
  state.rhythmPreload._rhythmSongId = songId;
  state.rhythmPreload.load();
}

function renderRhythmLevelSelect() {
  const songId = state.rhythm.song;
  const song = RHYTHM_SONGS[songId];
  if (!song) {
    state.rhythm.screen = "song";
    return renderStage4Act3();
  }
  const prog = getRhythmSongProgress(songId);

  const levelButtons = RHYTHM_LEVELS.map(({ level, label }) => {
    const unlocked = level <= prog.unlocked;
    const cleared = prog.cleared[level - 1];
    const status = cleared ? "✅ " : unlocked ? "" : "🔒 ";
    const cls = unlocked ? "rhythm-level-btn" : "rhythm-level-btn locked";
    return `
      <button type="button" class="${cls}" data-level="${level}" ${unlocked ? "" : "disabled"}>
        ${status}${label}
      </button>
    `;
  }).join("");

  app.innerHTML = rhythmSceneTemplate(`${song.title} — 레벨 도전`, `
    <div class="rhythm-menu-card">
      <p class="rhythm-menu-desc">1단계 100점 · 2단계 300점 · 3단계 500점 이상이면 클리어!</p>
      <div class="rhythm-level-list">${levelButtons}</div>
      <button type="button" class="btn rhythm-back-btn" id="rhythmBackSong">◀ 곡 다시 고르기</button>
    </div>
  `);
  setupNavigationAndHelp("열린 단계부터 차례대로 도전해 보자!");

  document.querySelectorAll(".rhythm-level-btn:not(.locked)").forEach((btn) => {
    btn.onclick = () => {
      const level = Number(btn.dataset.level);
      state.rhythm.level = level;
      state.rhythm.screen = level === 3 ? "semachi" : "play";
      playSound("click.mp3");
      render();
    };
  });
  document.getElementById("rhythmBackSong").onclick = () => {
    state.rhythm.screen = "song";
    playSound("click.mp3");
    render();
  };
}

function renderRhythmPlay() {
  const songId = state.rhythm.song;
  const level = state.rhythm.level;
  const song = RHYTHM_SONGS[songId];
  if (!song) {
    state.rhythm.screen = "song";
    return renderStage4Act3();
  }
  const levelInfo = RHYTHM_LEVELS.find((l) => l.level === level);
  const playTitle = level === 3
    ? `${song.title} — 노래에 맞춰 장단 연주`
    : (levelInfo?.label || "리듬 플레이");

  app.innerHTML = rhythmSceneTemplate(playTitle, `
    <div class="rhythm-game">
      <div class="rhythm-lyrics-wrap">
        <div class="rhythm-lyrics" id="rhythmLyrics">${renderRhythmLyricsHTML(song.lyrics, 0, song.vocalStart, song.jeongganbo)}</div>
      </div>
      <div class="rhythm-hud">
        <span class="rhythm-hud-level">${levelInfo?.label || ""}</span>
        <span class="rhythm-hud-score" id="rhythmHudScore">0점</span>
        <span class="rhythm-feedback" id="rhythmFeedback"></span>
      </div>
      <div class="rhythm-playfield">
        <div class="rhythm-note-zone" id="rhythmNotes"></div>
        <div class="rhythm-janggu-area">
          ${rhythmJangguSparkleZonesHTML()}
          <img class="rhythm-janggu-img" src="${IMG("janggu.png")}" alt="장구" />
          <button type="button" class="rhythm-stick-target rhythm-stick-target--gunggeul" id="rhythmTargetGunggeul" aria-label="궁글채 치기">
            <img src="${IMG("note_gunggeul.png")}" alt="궁글채" />
          </button>
          <button type="button" class="rhythm-stick-target rhythm-stick-target--yeol" id="rhythmTargetYeol" aria-label="열채 치기">
            <img src="${IMG("note_yeol.png")}" alt="열채" />
          </button>
          <button type="button" class="rhythm-stick-target rhythm-stick-target--both" id="rhythmTargetBoth" aria-label="양쪽 치기 (덩)">
          </button>
        </div>
      </div>
      <p class="rhythm-hint">덩: 스페이스 또는 가운데 원, 쿵: ←, 덕: →<br />또는 화면 북채 터치</p>
      <div class="rhythm-start-overlay" id="rhythmStartOverlay">
        <button type="button" class="btn primary rhythm-start-btn" id="rhythmStartBtn">▶ 시작!</button>
      </div>
    </div>
  `, true);
  setupNavigationAndHelp("가사와 장구 사이 노트가 크게 보이는 타이밍에 맞춰 쳐 보자! 스페이스=덩, ←=쿵, →=덕!");
  startRhythmGameplay(song, level);
}

function renderRhythmEnding() {
  app.innerHTML = rhythmSceneTemplate("수호대 엔딩", `
    <div class="rhythm-menu-card rhythm-ending-card">
      <div class="certificate">
        <h3>🎉 K-Culture 수호대 인증서</h3>
        <p>우리민요 얼쑤! 3단계 모두 클리어!</p>
        <p>전통놀이 한판승부를 완수했어요.</p>
        <p><strong>이름: 용감한 수호대원</strong></p>
      </div>
      <p class="rhythm-ending-msg">축제 마당이 다시 환하게 빛났어요! 수호대원, 정말 멋졌어요!</p>
      <p class="rhythm-ending-hint">「다음」을 눌러 수호책 질문에 답해 보자!</p>
      <button type="button" class="btn primary" id="rhythmEndingNext">수호책 질문으로 ▶</button>
    </div>
  `);
  setupNavigationAndHelp("「다음」을 눌러 수호책 질문에 답해 보자!");
  playSound("correct.mp3");
  bindMissionCompleteBtn("stage4_a3", true);
  const goBook = () => {
    playSound("click.mp3");
    beginValueReflection("stage4_a3", { fromNext: true, force: true });
  };
  const nextBtn = document.getElementById("rhythmEndingNext");
  if (nextBtn) nextBtn.onclick = goBook;
}

app.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-go]");
  if (btn) {
    if (btn.classList.contains("activity-picker")) playSound("click.mp3");
    if (btn.dataset.go === "stage4_a3") {
      stopRhythmGame();
      stopSemachiPractice();
      if (state.rhythm?.screen === "play" || state.rhythm?.screen === "semachi") {
        state.rhythm.screen = state.rhythm.song ? "levels" : "song";
      }
    }
    // 활동 선택 화면에서 활동으로 새로 들어갈 때는 항상 처음부터 시작한다(나갔다 들어오면 이어하기 없음).
    if (/^stage\d+_a\d+$/.test(btn.dataset.go)) {
      resetActivityState(btn.dataset.go);
    }
    state.current = btn.dataset.go;
    render();
  }
});

function getFullscreenElement() {
  return document.fullscreenElement
    || document.webkitFullscreenElement
    || document.msFullscreenElement
    || null;
}

function canUseFullscreen() {
  const el = document.documentElement;
  return !!(
    el.requestFullscreen
    || el.webkitRequestFullscreen
    || el.webkitRequestFullScreen
    || el.msRequestFullscreen
  );
}

function requestAppFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.webkitRequestFullScreen) return el.webkitRequestFullScreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
  return Promise.reject(new Error("fullscreen unsupported"));
}

function exitAppFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.webkitCancelFullScreen) return document.webkitCancelFullScreen();
  if (document.msExitFullscreen) return document.msExitFullscreen();
  return Promise.reject(new Error("fullscreen unsupported"));
}

function updateDisplayModeButton() {
  const btn = document.getElementById("displayModeBtn");
  if (!btn) return;
  const isFs = !!getFullscreenElement();
  btn.classList.toggle("is-fullscreen", isFs);
  btn.setAttribute("aria-label", isFs ? "창 모드로 보기" : "전체화면으로 보기");
  btn.title = isFs ? "창 모드" : "전체화면";
  const icon = btn.querySelector(".display-mode-btn__icon");
  const label = btn.querySelector(".display-mode-btn__label");
  if (icon) icon.textContent = isFs ? "❐" : "⛶";
  if (label) label.textContent = isFs ? "창 모드" : "전체화면";
}

function initDisplayModeToggle() {
  const btn = document.getElementById("displayModeBtn");
  if (!btn) return;

  if (!canUseFullscreen()) {
    btn.hidden = true;
    return;
  }

  updateDisplayModeButton();

  btn.addEventListener("click", async () => {
    try {
      if (getFullscreenElement()) {
        await exitAppFullscreen();
      } else {
        await requestAppFullscreen();
      }
    } catch (_) {
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "info",
          title: "전체화면을 사용할 수 없어요",
          text: "이 브라우저에서는 전체화면이 막혀 있을 수 있어요. 브라우저 메뉴에서 전체화면을 켜 보세요.",
          confirmButtonText: "확인"
        });
      }
    } finally {
      updateDisplayModeButton();
    }
  });

  ["fullscreenchange", "webkitfullscreenchange", "MSFullscreenChange"].forEach((evt) => {
    document.addEventListener(evt, updateDisplayModeButton);
  });
}

/* ───────────── 터치 드래그 지원 ─────────────
 * HTML5 드래그앤드롭(dragstart/dragover/drop)은 마우스에서만 동작한다.
 * 터치 화면에서도 draggable 요소를 손가락으로 끌 수 있도록,
 * 터치 이벤트를 기존 드래그 이벤트로 변환해 준다.
 * (한복 입히기, 태극기, 무궁화, 비빔밥 만들기 등 모든 드래그 게임 공통)
 */
(function enableTouchDragDrop() {
  if (!("ontouchstart" in window) && navigator.maxTouchPoints === 0) return;

  const DRAG_THRESHOLD = 8; // px — 이보다 적게 움직이면 탭(클릭)으로 처리
  let source = null;
  let dataTransfer = null;
  let ghost = null;
  let lastTarget = null;
  let lastOverAccepted = false;
  let dragStarted = false;
  let startX = 0;
  let startY = 0;

  const makeDataTransfer = () => {
    const store = {};
    return {
      effectAllowed: "move",
      dropEffect: "move",
      types: [],
      setData(type, value) { store[type] = String(value); },
      getData(type) { return store[type] ?? ""; },
      clearData() { for (const k of Object.keys(store)) delete store[k]; },
      setDragImage() {}
    };
  };

  const fireDragEvent = (type, target, touch) => {
    const ev = new Event(type, { bubbles: true, cancelable: true });
    ev.dataTransfer = dataTransfer;
    if (touch) {
      ev.clientX = touch.clientX;
      ev.clientY = touch.clientY;
    }
    target.dispatchEvent(ev);
    return ev;
  };

  const makeGhost = (el, touch) => {
    const rect = el.getBoundingClientRect();
    const g = el.cloneNode(true);
    g.style.position = "fixed";
    g.style.left = `${rect.left}px`;
    g.style.top = `${rect.top}px`;
    g.style.width = `${rect.width}px`;
    g.style.height = `${rect.height}px`;
    g.style.margin = "0";
    g.style.opacity = "0.75";
    g.style.pointerEvents = "none";
    g.style.zIndex = "99999";
    g.style.transition = "none";
    g.dataset.touchDragGhost = "1";
    document.body.appendChild(g);
    moveGhost(g, touch);
    return g;
  };

  const moveGhost = (g, touch) => {
    const w = g.offsetWidth;
    const h = g.offsetHeight;
    g.style.left = `${touch.clientX - w / 2}px`;
    g.style.top = `${touch.clientY - h / 2}px`;
  };

  const targetUnderTouch = (touch) => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    return el && el !== ghost ? el : null;
  };

  const cleanup = () => {
    if (ghost) ghost.remove();
    source = null;
    dataTransfer = null;
    ghost = null;
    lastTarget = null;
    lastOverAccepted = false;
    dragStarted = false;
  };

  document.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    const el = e.target.closest('[draggable="true"]');
    if (!el) return;
    source = el;
    dragStarted = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (!source || e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (!dragStarted) {
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

      dataTransfer = makeDataTransfer();
      const startEv = fireDragEvent("dragstart", source, touch);
      if (startEv.defaultPrevented) { cleanup(); return; }
      dragStarted = true;
      ghost = makeGhost(source, touch);
    }

    e.preventDefault(); // 드래그 중 화면 스크롤 방지
    moveGhost(ghost, touch);

    const target = targetUnderTouch(touch);
    if (lastTarget && lastTarget !== target) {
      fireDragEvent("dragleave", lastTarget, touch);
      lastOverAccepted = false;
    }
    if (target) {
      const overEv = fireDragEvent("dragover", target, touch);
      lastOverAccepted = overEv.defaultPrevented;
    }
    lastTarget = target;
  }, { passive: false });

  const onTouchEnd = (e) => {
    if (!source) return;
    if (!dragStarted) { source = null; return; } // 탭 → 기존 클릭 처리에 맡김

    const touch = e.changedTouches[0];
    const target = targetUnderTouch(touch);
    if (target && lastOverAccepted) {
      fireDragEvent("drop", target, touch);
    } else if (lastTarget) {
      fireDragEvent("dragleave", lastTarget, touch);
    }
    fireDragEvent("dragend", source, touch);
    e.preventDefault(); // 드래그 후 이어지는 click 발생 방지
    cleanup();
  };

  document.addEventListener("touchend", onTouchEnd, { passive: false });
  document.addEventListener("touchcancel", () => {
    if (dragStarted && source) fireDragEvent("dragend", source);
    cleanup();
  });
})();

function initGlobalNav() {
  const homeBtn = document.getElementById("globalHomeBtn");
  if (homeBtn) {
    homeBtn.onclick = () => {
      if (!state.loggedIn || state.current === "main") return;
      playSound("click.mp3");
      stopActiveActivityMedia();
      pauseValueReflection();
      clearNavHistory();
      state.teacherAlbumView = null;
      state.teacherBookView = null;
      state.current = "main";
      render();
    };
  }
  const classExtBtn = document.getElementById("globalClassExtBtn");
  if (classExtBtn) {
    classExtBtn.onclick = () => {
      if (!state.loggedIn) return;
      if (state.current === "classroom_extension") {
        // 작품 올리기·상세 화면에서는 게시판 목록으로 돌아가기
        if (window.ClassroomExtension?.goBoardView?.()) playSound("click.mp3");
        return;
      }
      playSound("click.mp3");
      stopActiveActivityMedia();
      pauseValueReflection();
      state.teacherAlbumView = null;
      state.teacherBookView = null;
      state.current = "classroom_extension";
      render();
    };
  }
  const exitBtn = document.getElementById("globalExitBtn");
  if (exitBtn) {
    exitBtn.onclick = async () => {
      if (!state.loggedIn) return;
      const res = await Swal.fire({
        title: "게임 종료",
        text: "로그인 화면으로 나갈까요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "나가기",
        cancelButtonText: "취소"
      });
      if (!res.isConfirmed) return;
      stopActiveActivityMedia();
      resetLoginSession();
      render();
    };
  }
  const backBtn = document.getElementById("globalBackBtn");
  if (backBtn) {
    backBtn.onclick = () => {
      if (backBtn.disabled) return;
      goToPreviousScreen();
    };
  }
  const nextBtn = document.getElementById("globalNextBtn");
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (nextBtn.disabled || nextBtn.hidden) return;
      goToNextScreen();
    };
  }
  updateGlobalBackButton();
  updateGlobalNextButton();
}

initGlobalNav();
initDisplayModeToggle();
render();
