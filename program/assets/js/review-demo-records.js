/**
 * 심사용 가상 학급 — 가치수호록 가상 기록 (생각친구 2차 설계: ①떠올리기 ②생각하기 ③나와 연결)
 *
 * 교사용 대시보드·교사용 분석 시연용입니다. 실제 저장 구조(value-reflection-flow.js guidedPersist)와 같게 만듭니다.
 *  - 1~5번(수호·대한·민국·우리·나라): 완료한 활동 중 일부만 기록
 *  - 6~15번(학생1~학생10): 14개 활동 모두 기록
 *
 * 학생마다 답하는 경향을 다르게 두었습니다.
 *  수호·학생1·학생10: 자기 말로 자주 씀 / 학생4·대한: 보기를 여러 개 고름 / 학생5: 건너뛰거나 막힘
 *  학생6: 말로 답함 / 학생7: 다른 친구와 다른 생각 / 나머지: 주로 보기 선택
 */
(function () {
  "use strict";

  // 활동별 학생이 직접 쓴 말 — c: ②생각하기, t: ③나와 연결(학생마다 다른 표현), odd: 다른 관점(②)
  const OWN = {
    taegeukgi: { c: ["빨강 파랑이 손잡고 있는 것 같아서요", "둘이 싸우지 말고 친하게 지내라고요", "빙글빙글 같이 도는 것 같아요"],
      t: ["태극기를 접을 때 조심히 접어요", "광복절에 우리 집 베란다에 달아요", "태극기 그림을 반듯하게 그려요"], odd: "해님이랑 달님 같아요" },
    mugunghwa: { c: ["매일 새 꽃이 피니까 지치지 않는 것 같아요", "여름 내내 피어서 씩씩해 보여요", "꽃이 져도 또 피니까요"],
      t: ["수영을 끝까지 배우고 싶어요", "피아노를 매일 연습할래요", "받아쓰기 100점 받을 때까지요"], odd: "벌레가 먹어도 또 피어서요" },
    anthem: { c: ["모두 같은 노래를 부르면 한 가족 같아서요", "선생님이랑 친구들이랑 목소리가 맞아서요", "다 같이 부르면 떨리지 않아요"],
      t: ["우리 반 모두 친구", "싸워도 금방 화해해요", "같이 하면 할 수 있어"], odd: "선수들이 힘내라고요" },
    money: { c: ["사람들이 잊지 않으려고요", "돈을 쓸 때마다 생각나라고요", "우리나라를 지켜 줘서 고마워서요"],
      t: ["김치", "호랑이", "우리 학교"], odd: "우리 반 친구들 얼굴을 넣으면 모두 소중하니까요" },
    hangul: { c: ["글을 모르는 사람이 속상할까 봐서요", "한자가 너무 어려워서요", "누구나 편지를 쓰라고요"],
      t: ["엄마한테 편지를 못 써요", "동화책을 못 읽어요", "친구 이름을 못 불러요"], odd: "게임 설명을 못 읽어요" },
    hanok: { c: ["온돌은 불을 한 번 때면 오래 따뜻해요", "마루는 바람이 지나가서 시원해요", "겨울에는 방에 모여서 지냈을 것 같아요"],
      t: ["마루가 있으면 여름에 누워 있을래요", "마당에 텃밭을 만들고 싶어요", "내 방 창문을 창호지로 하고 싶어요"], odd: "마당에서 곡식을 말렸대요" },
    dancheong: { c: ["비가 와도 나무가 썩지 말라고요", "궁궐은 임금님 집이라 멋있어야 해서요", "알록달록하면 기분이 좋아서요"],
      t: ["우리 교실 게시판", "내 우산", "할머니 부채"], odd: "휴대폰 케이스" },
    hanbok: { c: ["옷고름을 묶는 게 신기해요", "치마가 돌면 꽃처럼 펴져요", "색이 여러 개라 무지개 같아요"],
      t: ["할머니 생신날", "학예회 날", "가족사진 찍는 날"], odd: "태권도 대회 날" },
    bibimbap: { c: ["싫어하는 나물도 같이 먹게 돼요", "고소한 맛이랑 매운맛이 같이 나요", "색깔이 예뻐서 먹고 싶어져요"],
      t: ["친구가 속상할 때 같이 있어 줘요", "순서를 잘 지켜요", "새 친구한테 먼저 말 걸어요"], odd: "고추장이 다 섞어 줘서요" },
    holiday: { c: ["멀리 사는 가족을 만나려고요", "할머니가 기다리시니까요", "같이 송편 만들려고요"],
      t: ["할아버지 오래오래 사세요", "이모 보고 싶었어요", "용돈 감사합니다"], odd: "돌아가신 할아버지를 기억하려고요" },
    yut: { c: ["혼자 하면 재미없으니까요", "편이 있으면 같이 응원할 수 있어요", "여럿이 하면 더 시끄럽고 신나요"],
      t: ["우리 편 최고야", "아직 안 끝났어", "모 한 번이면 돼"], odd: "지면 속상하지만 다음에 또 하면 돼요" },
    ttakji: { c: ["그때는 게임기가 없었어요", "종이는 집에 많으니까요", "내가 만든 거라 더 아끼게 돼요"],
      t: ["딱지치기, 이기면 하이파이브해요", "딱지치기, 같이 웃을 수 있어서요", "둘 다 좋은데 딱지가 더 시끄러워서 재밌어요"], odd: "우유갑으로 접으면 더 튼튼해요" },
    minyo: { c: ["경기아리랑은 할머니 노래 같고 진도아리랑은 잔치 노래 같아요", "진도아리랑은 뛰고 싶고 경기아리랑은 눕고 싶어요", "진도아리랑이 더 빨라요"],
      t: ["사는 곳이 달라서요", "사람들이 다르게 불러서요", "말이 조금 달라서요"], odd: "둘 다 끝에 아리랑이 나와요" },
    talchum: { c: ["얼굴을 가리면 부끄럽지 않아서요", "양반을 놀려도 안 들키려고요", "잔치 때 다 같이 웃으려고요"],
      t: ["호랑이 탈 쓰고 어흥 춤", "할머니 탈 쓰고 꼬부랑 춤", "로봇 탈 쓰고 삐걱 춤"], odd: "나쁜 사람을 혼내 주려고요" }
  };

  const ACTIVITY_ORDER = ["taegeukgi", "mugunghwa", "anthem", "money", "hangul", "hanok", "dancheong",
    "hanbok", "bibimbap", "holiday", "yut", "ttakji", "minyo", "talchum"];

  // 0~4: 기존 로그인 학생, 5~14: 학생1~학생10
  const PROFILE = [
    { writer: 2 },            // 수호
    { multi: true },          // 대한
    {},                       // 민국
    { writer: 3 },            // 우리
    { skip: 3 },              // 나라
    { writer: 23, edit: true }, // 학생1
    {},                       // 학생2
    { writer: 2, sometimes: true }, // 학생3
    { multi: true },          // 학생4
    { skip: 2, stuck: true }, // 학생5
    { voice: true },          // 학생6
    { unique: true },         // 학생7
    {},                       // 학생8
    { stuck: true },          // 학생9
    { writer: 3, edit: true } // 학생10
  ];

  // 1~5번 학생이 가치수호록을 쓴 활동 (완료 활동 중 일부)
  const BASE_ACTIVITIES = {
    1: ["taegeukgi", "anthem", "hanok", "dancheong", "bibimbap", "holiday", "yut", "minyo", "talchum"],
    2: ["mugunghwa", "hangul", "hanbok", "holiday", "yut", "minyo"],
    3: ["taegeukgi", "money", "dancheong", "bibimbap", "holiday"],
    4: ["anthem", "money", "hanok", "hanbok", "holiday", "ttakji"],
    5: ["mugunghwa", "hangul", "bibimbap", "talchum"]
  };

  const M = "assets/review-demo/";
  const BASE_MEDIA = {
    "1:anthem": { audio: M + "voice-suho-anthem.wav" },
    "2:minyo": { audio: M + "voice-jiho-minyo.wav" },
    "4:holiday": { audio: M + "voice-haeun-holiday.wav" }
  };

  // 가치수호책 마지막 쪽
  const FINALE = {
    1: ["holiday", "송편 빚기를 지키고 싶어요.", "가족이 모여 서로 건강을 빌어 주기"],
    6: ["taegeukgi", "태극기를 소중히 여기고 싶어요.", "서로 달라도 함께 어울리는 뜻이 좋기"],
    7: ["hanok", "한옥의 마루를 지키고 싶어요.", "여름에 시원하기"],
    8: ["hangul", "한글을 소중히 쓰고 싶어요.", "세종대왕이 백성을 사랑해서 만들었기"],
    9: ["holiday", "명절에 가족이 모이는 것을 이어가고 싶어요.", "가족이 함께 웃을 수 있기"],
    10: ["bibimbap", "비빔밥을 지키고 싶어요.", "여러 가지를 골고루 먹을 수 있기"],
    11: ["minyo", "진도아리랑을 계속 부르고 싶어요.", "신나기"],
    12: ["money", "우리나라를 빛낸 사람들을 기억하고 싶어요.", "잊지 않아야 하기"],
    13: ["mugunghwa", "무궁화를 지키고 싶어요.", "계속 피어나기"],
    14: ["yut", "윷놀이를 계속하고 싶어요.", "친구랑 하면 재밌기"],
    15: ["dancheong", "단청 무늬를 우리 반에 이어가고 싶어요.", "우리 교실을 예쁘게 꾸밀 수 있기"]
  };

  function Q() { return (typeof window !== "undefined" && window.ThinkFriendQuestions) || null; }

  function hash(a, b, c) {
    let h = 2166136261;
    const str = `${a}|${b}|${c}`;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  // 앞 보기일수록 많이 고르도록 가중치
  function pickWeighted(choices, seed, unique) {
    const list = choices.slice();
    if (unique) return list[list.length - 1 - (seed % Math.min(2, list.length))];
    const weights = list.map((_, i) => [6, 4, 3, 2, 1, 1, 1][i] || 1);
    const total = weights.reduce((s, w) => s + w, 0);
    let r = seed % total;
    for (let i = 0; i < list.length; i += 1) {
      if (r < weights[i]) return list[i];
      r -= weights[i];
    }
    return list[0];
  }

  function isoHoursAgo(hours) {
    return new Date(Date.now() - hours * 3600 * 1000).toISOString();
  }

  function emptyAnswer() {
    return { picked: [], text: "", skipped: false, stuck: 0, offtopicUsed: false };
  }

  /** 학생(idx 0~14)의 한 활동 답 3개 만들기 */
  function answersFor(idx, activity, entry) {
    const pf = PROFILE[idx] || {};
    const own = OWN[activity] || { c: [""], t: [""], odd: "" };
    // 같은 단계에 쓰는 학생끼리 표현이 겹치지 않도록 학생별 순번을 둔다
    const OFFSET = { 0: 0, 7: 1, 5: 2, 3: 0, 14: 1 };
    const variant = (list) => list[((OFFSET[idx] || 0) + activity.length) % list.length];
    return entry.steps.map((step, si) => {
      const a = emptyAnswer();
      const seed = hash(idx, activity, si);
      const pick = pickWeighted(step.choices, seed, pf.unique && si > 0);
      a.picked = [pick];
      if (pf.multi && si > 0 && seed % 2 === 0) {
        const second = pickWeighted(step.choices, seed + 7, false);
        if (second !== pick) a.picked.push(second);
      }
      // 자기 말로 쓰기
      const writeStep = pf.writer === 23 ? (si === 1 || si === 2) : (pf.writer === si + 1);
      if (writeStep && !(pf.sometimes && seed % 2)) {
        a.text = si === 1 ? variant(own.c) : variant(own.t);
        if (si === 1 && seed % 3 === 0) a.picked = []; // 보기 없이 자기 말만
      }
      if (pf.unique && si === 1) { a.picked = []; a.text = own.odd; }
      // 건너뛰기·막힘
      if (pf.skip && si === pf.skip - 1 && seed % 3 === 0) {
        a.picked = []; a.text = ""; a.skipped = true;
      }
      if (pf.stuck && si === 1 && seed % 2 === 0) a.stuck = 1;
      return a;
    });
  }

  function buildRecord(idx, activity, activityIndex, media) {
    const GQ = Q();
    const entry = GQ && GQ.get(activity);
    if (!entry) return null;
    const pf = PROFILE[idx] || {};
    const answers = answersFor(idx, activity, entry);
    const inputVoice = !!pf.voice;
    const turns = entry.steps.map((step, i) => {
      const a = answers[i];
      const answer = a.skipped ? "" : [a.picked.join(", "), a.text].filter(Boolean).join(" / ");
      return {
        strategy: step.type,
        question: step.q,
        answer,
        picked: a.picked.slice(),
        inputType: a.text ? (inputVoice ? "voice" : "text") : "choice",
        source: a.text ? "free_response" : "choice",
        skipped: a.skipped
      };
    });
    const summary = GQ.composeSummary(entry, answers);
    const edited = !!pf.edit && hash(idx, activity, "e") % 2 === 0;
    const finalAnswer = edited ? `${summary} 다음에 친구들과 또 해 보고 싶어요.` : summary;
    const firstPick = (answers[0].picked || [])[0] || turns[0].answer || "";
    const photoUrl = null; // 사진으로 응답하기는 없음
    const audioUrl = media && media.audio ? media.audio : null;
    const responseType = audioUrl || inputVoice ? "voice" : "text";
    const createdAt = isoHoursAgo((13 - activityIndex) * 24 + (idx % 15) * 1.3 + 2);
    const tf = {
      activityId: entry.id,
      valueQuestion: entry.core,
      grade: "1",
      initialAnswer: turns[0].answer,
      thinkingFriendTurns: turns,
      confirmedMeanings: [],
      finalSummary: summary,
      finalAnswer,
      studentApproved: true,
      editingFinal: false,
      action: "FINISH",
      strategy: "finish",
      guided: { answers, summarySource: "client_template" }
    };
    return {
      activity,
      activityTitle: entry.title,
      activityId: entry.id,
      valueQuestion: entry.core,
      selectedElement: "",
      selectedElementLabel: firstPick,
      valueLabel: firstPick,
      initialAnswer: turns[0].answer,
      thinkingFriendTurns: turns,
      confirmedMeanings: [],
      finalSummary: summary,
      finalAnswer,
      studentApproved: true,
      studentEdited: edited,
      inputMode: responseType,
      reflectionText: finalAnswer,
      audioUrl,
      photoUrl,
      representativeImage: photoUrl || "",
      responseType,
      followUpQuestion: turns[2].question,
      followUpLabel: turns[2].answer,
      extraAnswer: "",
      summaryText: summary,
      thinkFriend: tf,
      status: "complete",
      createdAt,
      isReviewSeed: true
    };
  }

  function makeFinale(number, records) {
    const item = FINALE[Number(number)];
    if (!item) return null;
    const [activity, wantText, reason] = item;
    const rec = (records || []).find((r) => r.activity === activity);
    if (!rec) return null;
    return {
      selectedActivity: activity,
      selectedValue: rec.valueLabel || "",
      wantText,
      reasonText: reason,
      reflectionText: `${wantText} 왜냐하면 ${reason} 때문이에요.`,
      audioUrl: null,
      createdAt: isoHoursAgo(3 + Number(number))
    };
  }

  const STUDENT_COUNT = 10;

  /** 학생1~학생10 (index 1~10): 14개 활동 모두 */
  function buildRecords(index) {
    const i = Number(index);
    if (!(i >= 1 && i <= STUDENT_COUNT)) return [];
    return ACTIVITY_ORDER.map((act, ai) => buildRecord(4 + i, act, ai, null)).filter(Boolean);
  }

  function buildFinale(index, records) {
    return makeFinale(5 + Number(index), records);
  }

  /** 1~5번 학생: 완료한 활동(routes) 중 일부만 */
  const ROUTE_BY_ACTIVITY = {
    taegeukgi: "stage1_a1", mugunghwa: "stage1_a2", anthem: "stage1_a3", money: "stage1_a4",
    hangul: "stage2_a1", hanok: "stage2_a2", dancheong: "stage2_a3",
    hanbok: "stage3_a1", bibimbap: "stage3_a2", holiday: "stage3_a3",
    yut: "stage4_a1", ttakji: "stage4_a2", minyo: "stage4_a3", talchum: "stage4_a4"
  };

  function buildBaseRecords(number, routes) {
    const n = Number(number);
    const list = BASE_ACTIVITIES[n] || [];
    const allowed = Array.isArray(routes) ? new Set(routes) : null;
    return list
      .filter((act) => !allowed || allowed.has(ROUTE_BY_ACTIVITY[act]))
      .map((act) => buildRecord(n - 1, act, ACTIVITY_ORDER.indexOf(act), BASE_MEDIA[`${n}:${act}`]))
      .filter(Boolean);
  }

  function buildBaseFinale(number, records) {
    return makeFinale(number, records);
  }

  const api = { STUDENT_COUNT, buildRecords, buildFinale, buildBaseRecords, buildBaseFinale };
  if (typeof window !== "undefined") window.ReviewDemoRecords = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
