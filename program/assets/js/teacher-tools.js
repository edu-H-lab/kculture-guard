/**
 * 교사용 도구 — 수업 가이드 패널, 학급 가치수호록 열람
 *
 * app.js: window.TeacherTools = { guideButtonHTML, bindGuideButton, syncGuideOverlay, renderValuesHTML, bindValuesPanel }
 */
(function () {
  "use strict";

  const LESSON_GUIDES = {
    stage1_a1: {
      activityTitle: "태극기 세우기 · 게양하기",
      lessons: [
        { title: "태극기 다는 날", pages: "12-23" },
        { title: "태극기가 펄럭", pages: "24-25" }
      ],
      extensions: [
        "달력에 태극기를 다는 날을 표시하고, 그날에는 왜 태극기를 다는지 이야기해 보세요.",
        "태극기의 색깔과 무늬를 찾아 색칠한 뒤, 짝에게 태극기를 소개해 보세요.",
        "우리 모둠·우리 반을 나타내는 상징(깃발·마크)을 직접 만들고, 그 안에 담은 뜻을 발표해 보세요.",
        "다른 나라 국기 사진을 몇 개 보여주고, 색과 무늬에 담긴 뜻을 짝과 추측해 보세요.",
        "완성한 우리 반 상징 그림을 사진으로 찍어 앱의 '교실 게시판'에 올리고, 친구 작품에 댓글로 응원해 보세요."
      ]
    },
    stage1_a2: {
      activityTitle: "무궁화 피우기",
      lessons: [
        { title: "무궁화가 활짝", pages: "26-27" },
        { title: "태극기와 무궁화", pages: "28-29" }
      ],
      extensions: [
        "학교 화단이나 그림에서 무궁화를 찾아보고, 꽃잎 모양을 손바닥으로 표현해 보세요.",
        "나라의 상징(태극기·무궁화)을 교실 게시판에 모아 ‘우리 상징’ 코너를 만들어 보세요.",
        "내가 끝까지 열심히 해 본 일을 한 가지 떠올려 그림일기로 남겨 보세요.",
        "무궁화 꽃잎을 색종이로 접거나 오려 교실 화분(또는 벽면)을 꾸며 보세요.",
        "‘100일 동안 계속 피는 꽃’처럼, 내가 100일 동안 꾸준히 해보고 싶은 일을 정해 학급 약속판에 적어 보세요."
      ]
    },
    stage1_a3: {
      activityTitle: "애국가 부르기",
      lessons: [
        { title: "태극기가 펄럭", pages: "24-25" }
      ],
      extensions: [
        "애국가 1절을 함께 따라 부르고, 가사 속 낱말을 그림으로 표현해 보세요.",
        "중요한 날에는 왜 애국가를 부르는지, 모둠에서 한 문장으로 말해 보세요.",
        "우리 반만의 '반가(班歌)'나 구호를 만들어 아침 시간에 함께 외쳐 보세요.",
        "운동회·입학식처럼 다 같이 노래를 부르는 순간을 떠올리며, 그때 느낀 마음을 이야기해 보세요.",
        "애국가 가사에 어울리는 그림을 모둠별로 나눠 그려 이어 붙이고, 학급 전시로 꾸며 보세요."
      ]
    },
    stage1_a4: {
      activityTitle: "화폐 속 이야기",
      lessons: [
        { title: "우리나라 화폐", pages: "30-31" }
      ],
      extensions: [
        "지갑이나 그림 속 돈에서 인물을 찾아보고, 그 사람이 왜 그려져 있는지 이야기해 보세요.",
        "내가 화폐에 넣고 싶은 사람을 그려 짧은 소개를 붙여 보세요.",
        "우리 반에서 본받고 싶은 친구나 가족을 한 명씩 떠올려 '우리 반 인물 카드'를 만들어 보세요.",
        "우리 학교(또는 마을)를 대표할 그림을 그려 '우리 학교 기념 동전'을 디자인해 보세요.",
        "오래오래 기억하고 싶은 우리 반의 순간을 사진이나 그림으로 남겨 학급 앨범을 만들어 보세요."
      ]
    },
    stage2_a1: {
      activityTitle: "한글 조각 맞추기",
      lessons: [
        { title: "우리 한글", pages: "34-35" }
      ],
      extensions: [
        "내 이름과 짝의 이름을 한글로 또박또박 써 보고, 소리 내어 읽어 보세요.",
        "한글이 쉬운 까닭을 한 가지 떠올려, 교실에 ‘우리 한글 자랑’ 종이를 붙여 보세요.",
        "짝에게 하고 싶은 고마운 말을 한글 편지로 써서 전해 보세요.",
        "자음·모음 카드를 몸으로 표현해 친구가 맞히는 몸으로 말해요 놀이를 해 보세요.",
        "친구에게 쓴 짧은 응원 편지를 앱의 ‘교실 게시판’에 올려 서로 읽어 보세요."
      ]
    },
    stage2_a2: {
      activityTitle: "한옥 세우기",
      lessons: [
        { title: "우리 한옥", pages: "50-51" }
      ],
      extensions: [
        "우리 집과 한옥을 비교하는 그림을 그리고, 닮은 점·다른 점을 말해 보세요.",
        "온돌·마루·창호지 중 하나를 골라 역할극으로 ‘한옥의 지혜’를 소개해 보세요.",
        "더운 날·추운 날 우리 집에서 하는 지혜로운 행동(환기, 이불 등)을 찾아 발표해 보세요.",
        "상자나 블록으로 우리 지역 날씨에 어울리는 ‘나만의 집’을 만들어 보세요.",
        "세계 여러 나라의 전통 집 사진을 보고, 그 나라 날씨와 집 모양이 어떻게 닮았는지 짝과 이야기해 보세요."
      ]
    },
    stage2_a3: {
      activityTitle: "단청 색칠하기",
      lessons: [
        { title: "우리나라 문양", pages: "32-33" }
      ],
      extensions: [
        "오방색 종이로 단청 문양을 꾸며 교실 문 위에 띠를 만들어 보세요.",
        "내가 만든 문양에 이름을 붙이고, 어떤 느낌을 주고 싶었는지 이야기해 보세요.",
        "내 물건(필통, 신발주머니)에 어울리는 나만의 무늬를 디자인해 보세요.",
        "같은 무늬를 반복해서 찍는 도장·스탬프 놀이로 규칙적인 무늬를 만들어 보세요.",
        "학교 안에서 아름다움과 쓰임을 함께 가진 것(안내판, 벽화 등)을 찾아 사진으로 남겨 보세요."
      ]
    },
    stage3_a1: {
      activityTitle: "한복 입히기",
      lessons: [
        { title: "우리 한복", pages: "38-39" }
      ],
      extensions: [
        "저고리·치마·바지·고름 순서를 말판 놀이로 맞춰 보세요.",
        "색동 종이로 한복 옷을 접거나 붙여, 나만의 한복 인형을 꾸며 보세요.",
        "요즘 자주 입는 옷과 한복을 비교해, 편한 점·예쁜 점을 각각 찾아보세요.",
        "색동 색깔의 순서를 관찰하고, 같은 규칙으로 팔찌나 종이띠를 만들어 보세요.",
        "'오늘날에 맞게 바뀐 한복(생활한복)' 사진을 보여주고, 무엇이 바뀌고 무엇이 그대로인지 이야기해 보세요."
      ]
    },
    stage3_a2: {
      activityTitle: "비빔밥 만들기",
      lessons: [
        { title: "우리나라 음식", pages: "36-37" }
      ],
      extensions: [
        "내가 넣고 싶은 나물을 그려 ‘모둠 비빔밥 메뉴판’을 만들어 보세요.",
        "여러 가지를 골고루 섞어 먹는 까닭을 이야기하고, 편식하지 않기 약속을 해 보세요.",
        "서로 다른 성격의 친구들이 모둠으로 어우러져 잘 해낸 경험을 떠올려 발표해 보세요.",
        "여러 색 종이를 골고루 오려 붙여 ‘조화로운 그림’을 함께 완성해 보세요.",
        "우리 반에서 서로 다른 역할(줄반장, 우유당번 등)이 어떻게 어우러져 하루를 만드는지 이야기해 보세요."
      ]
    },
    stage3_a3: {
      activityTitle: "설날과 추석",
      lessons: [
        { title: "우리나라 명절", pages: "42-43" }
      ],
      extensions: [
        "세배 인사를 짝과 연습하고, 명절에 하는 일을 그림일기로 남겨 보세요.",
        "우리 가족 명절 이야기를 한 가지씩 나누고, 교실에 ‘우리 명절’ 지도를 붙여 보세요.",
        "우리 반만의 ‘매주 반복하는 약속(풍습)’을 하나 정해 실천해 보세요. (예: 매주 금요일 고마운 말 나누기)",
        "다른 나라의 명절이나 기념일을 하나 조사해 우리나라 명절과 비교해 보세요.",
        "멀리 사는 가족에게 마음을 전하는 나만의 방법(영상통화, 편지 등)을 이야기해 보세요."
      ]
    },
    stage4_a1: {
      activityTitle: "윷놀이",
      lessons: [
        { title: "우리나라 놀이", pages: "40-41" }
      ],
      extensions: [
        "교실 바닥에 큰 윷판을 그리고 모둠 대결을 해 보세요.",
        "도·개·걸·윷·모 이름을 외치며, 함께 놀이할 때 지켜야 할 약속을 정해 보세요.",
        "우리 모둠만의 새로운 놀이 규칙을 한 가지 만들어 친구들과 시도해 보세요.",
        "놀이에서 진 친구에게 어떤 말을 해주면 좋을지 역할극으로 연습해 보세요.",
        "앱의 온라인 윷놀이를 함께 하고, 그날의 소감을 짝과 나누어 보세요."
      ]
    },
    stage4_a2: {
      activityTitle: "딱지접기",
      lessons: [
        { title: "딱지치기", pages: "66-67" }
      ],
      extensions: [
        "색종이로 딱지를 접어 친구와 딱지치기를 하고, 이긴 딱지를 자랑해 보세요.",
        "딱지를 접는 순서를 그림으로 그려 후배나 짝에게 알려 주세요.",
        "버리는 종이나 상자로 만들 수 있는 나만의 놀잇감을 하나 발명해 보세요.",
        "딱지치기를 하며 친해진 친구에게 고마운 마음을 짧은 쪽지로 전해 보세요.",
        "요즘 하는 놀이와 딱지치기의 같은 점·다른 점을 비교해 이야기해 보세요."
      ]
    },
    stage4_a3: {
      activityTitle: "우리민요 얼쑤!",
      lessons: [
        { title: "우리나라 민요", pages: "44-45" }
      ],
      extensions: [
        "아리랑 한 소절을 따라 부르고, 장단에 맞춰 손뼉을 쳐 보세요.",
        "경기 아리랑과 진도 아리랑의 느낌을 몸동작으로 비교해 보세요.",
        "같은 노래를 모둠마다 다르게(느리게/빠르게/신나게) 불러 보고 느낌을 비교해 보세요.",
        "우리 지역(고장)의 노래나 민요가 있다면 함께 찾아 불러 보세요.",
        "친구가 좋아하는 노래를 한 곡씩 소개하며, 저마다 다른 취향을 존중하는 시간을 가져 보세요."
      ]
    },
    stage4_a4: {
      activityTitle: "탈춤놀이",
      lessons: [
        { title: "우리나라 탈춤", pages: "46-47" }
      ],
      extensions: [
        "종이로 간단한 탈을 만들어 표정을 바꿔 가며 걸어 보세요.",
        "탈춤 기본 동작을 따라 하고, 탈의 기분에 맞는 움직임을 친구에게 보여 주세요.",
        "말 없이 몸짓과 표정만으로 감정을 표현하는 몸짓 스무고개 놀이를 해 보세요.",
        "내 기분을 나타내는 나만의 탈(가면)을 그려 소개해 보세요.",
        "모둠별로 짧은 몸짓극을 만들어 학급 발표회에서 보여 주세요."
      ]
    }
  };

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/`/g, "&#96;");
  }

  function isStudentPhoto(url) {
    const src = String(url || "");
    if (!src) return false;
    if (src.indexOf("data:") === 0 || src.indexOf("blob:") === 0) return true;
    if (src.indexOf("assets/review-demo/") === 0) return true;
    return src.indexOf("assets/") !== 0;
  }

  function baseRoute(route) {
    const m = String(route || "").match(/^(stage\d+_a\d+)/);
    return m ? m[1] : String(route || "");
  }

  function activityCatalog(stageMenus) {
    const keyByRoute = (window.ValueGuardianBook && window.ValueGuardianBook.activityKeyByRoute) || {};
    const list = [];
    if (!stageMenus || typeof stageMenus !== "object") return list;
    Object.keys(stageMenus).sort((a, b) => Number(a) - Number(b)).forEach((stageKey) => {
      const stage = stageMenus[stageKey];
      (stage?.activities || []).forEach((act) => {
        if (!act?.route) return;
        list.push({
          route: act.route,
          label: act.label,
          image: act.image || "",
          activity: keyByRoute[act.route] || act.route,
          stageNum: Number(stageKey),
          stageTitle: stage.title || ""
        });
      });
    });
    return list;
  }

  function getGuide(route) {
    return LESSON_GUIDES[baseRoute(route)] || null;
  }

  function inquiryQuestion(route) {
    if (typeof window.getActivityQuestion === "function") {
      const data = window.getActivityQuestion(route);
      return data && data.question ? data.question : "";
    }
    return "";
  }

  function reflectionConfig(routeOrActivity) {
    if (!window.ValueReflectionFlow || typeof window.ValueReflectionFlow.getConfig !== "function") return null;
    return window.ValueReflectionFlow.getConfig(routeOrActivity);
  }

  function activityKeyFor(route) {
    if (window.ValueReflectionFlow && typeof window.ValueReflectionFlow.activityKeyForRoute === "function") {
      return window.ValueReflectionFlow.activityKeyForRoute(baseRoute(route));
    }
    return "";
  }

  function guideButtonHTML() {
    return `<button type="button" class="act-btn lesson-guide-btn" id="lessonGuideBtn">📖 수업 가이드</button>`;
  }

  function guidePanelHTML(route, opts) {
    opts = opts || {};
    const guide = getGuide(route);
    const label = opts.activityLabel || guide?.activityTitle || "이 활동";
    if (!guide) {
      return `
        <aside class="tguide-panel" role="dialog" aria-labelledby="tguideTitle">
          <header class="tguide-head">
            <h2 id="tguideTitle">수업 가이드</h2>
            <button type="button" class="tguide-close" id="tguideCloseBtn" aria-label="닫기">닫기</button>
          </header>
          <p class="tguide-empty">이 활동의 수업 가이드가 아직 없어요.</p>
        </aside>
      `;
    }
    const lessons = (guide.lessons || []).map((item) => `
      <li>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.pages)}쪽</span>
      </li>
    `).join("");
    const extensions = (guide.extensions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `
      <aside class="tguide-panel" role="dialog" aria-labelledby="tguideTitle">
        <header class="tguide-head">
          <div>
            <p class="tguide-kicker">수업 가이드</p>
            <h2 id="tguideTitle">${escapeHtml(label)}</h2>
          </div>
          <button type="button" class="tguide-close" id="tguideCloseBtn" aria-label="닫기">닫기</button>
        </header>
        <section class="tguide-block">
          <h3>연계 교과서</h3>
          <ul class="tguide-lessons">${lessons}</ul>
        </section>
        ${goalConceptsHTML(route)}
        ${coreQuestionHTML(route)}
        ${inquiryQuestionsHTML(route)}
        <section class="tguide-block">
          <h3>교실 추천 활동</h3>
          <ol class="tguide-qlist">${extensions}</ol>
        </section>
      </aside>
    `;
  }

  // ---------- 수업 가이드: 핵심 질문 · 목표 개념 · 탐구 질문 ----------
  function guidedEntryFor(route) {
    const GQ = window.ThinkFriendQuestions;
    return GQ && typeof GQ.get === "function" ? GQ.get(baseRoute(route)) : null;
  }

  function lessonFor(route) {
    const L = window.TeacherLessonQuestions;
    return L && typeof L.get === "function" ? L.get(route) : null;
  }

  /** 가치수호록 핵심 질문 + 생각친구가 실제로 묻는 ①②③ */
  function coreQuestionHTML(route) {
    const entry = guidedEntryFor(route);
    if (!entry) return "";
    const labels = ["① 떠올리기", "② 생각하기", "③ 나와 연결"];
    return `
      <section class="tguide-block">
        <h3>핵심 질문</h3>
        <p class="tguide-quote">${escapeHtml(entry.core)}</p>
        <p class="tguide-sub">학생 앱의 생각친구는 이 핵심 질문을 세 단계로 나누어 물어요.</p>
        <ol class="tguide-steps">
          ${entry.steps.map((st, i) => `<li><span class="tguide-step">${labels[i] || ""}</span>${escapeHtml(st.q)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  /** 수업 목표 개념: 핵심 아이디어 · 핵심 개념 · 일반화 · 관련 개념 */
  function goalConceptsHTML(route) {
    const lesson = lessonFor(route);
    const entry = guidedEntryFor(route);
    const T = window.TeacherTargetIdeas;
    const ideas = entry && T && typeof T.get === "function" ? T.get(entry.key) : null;
    const unit = (window.TeacherLessonQuestions && window.TeacherLessonQuestions.UNIT) || null;
    if (!lesson && !ideas) return "";
    return `
      <section class="tguide-block">
        <h3>수업 목표 개념</h3>
        ${unit ? `<p class="tguide-bigidea"><span>핵심 아이디어</span>${escapeHtml(unit.bigIdea)}</p>` : ""}
        ${lesson && lesson.coreConcepts ? `
          <div class="tguide-row"><span class="tguide-label">핵심 개념</span>
            <span class="tguide-chips">${lesson.coreConcepts.map((c) => `<b>${escapeHtml(c)}</b>`).join("")}</span></div>` : ""}
        ${lesson && lesson.generalization ? `
          <div class="tguide-row"><span class="tguide-label">일반화</span>
            <p class="tguide-general">${escapeHtml(lesson.generalization)}</p></div>` : ""}
        ${ideas ? `
          <div class="tguide-row tguide-row--col"><span class="tguide-label">관련 개념 <small>(수업분석의 ‘수업 목표 개념’과 같아요)</small></span>
            <ul class="tguide-ideas">
              ${ideas.ideas.map((i) => `<li><strong>${escapeHtml(i.label)}</strong><span>${escapeHtml(i.desc)}</span></li>`).join("")}
            </ul>
          </div>
          ${ideas.guideNote ? `<p class="tguide-note">지도 중점 · ${escapeHtml(ideas.guideNote)}</p>` : ""}
          <p class="tguide-src">근거: ${escapeHtml(ideas.source || "교사용 지도서")}</p>` : ""}
      </section>
    `;
  }

  /** 탐구 질문: 사실적 · 개념적 · 논쟁적/전이적 (앱 질문 + 지도서 발문 + 추가 예시) */
  function inquiryQuestionsHTML(route) {
    const lesson = lessonFor(route);
    if (!lesson) return "";
    const entry = guidedEntryFor(route);
    const live = entry ? entry.steps.map((st) => st.q) : [];
    const groups = [
      { key: "fact", title: "사실적 질문", desc: "무엇을 보고, 하고, 알게 되었는지 떠올려요.", step: 0 },
      { key: "concept", title: "개념적 질문", desc: "왜 그럴까? 뜻과 까닭을 생각해요.", step: 1 },
      { key: "debate", title: "논쟁적 · 전이적 질문", desc: "서로 다른 생각을 나누거나(논쟁), 내 생활로 이어 봐요(전이).", step: 2 }
    ];
    const srcTag = (item) => item.src === "app"
      ? `<em class="tguide-tag tguide-tag--app">앱 질문</em>`
      : item.src === "guide" ? `<em class="tguide-tag tguide-tag--guide">지도서</em>` : "";
    const kindTag = (item) => item.kind === "debate"
      ? `<em class="tguide-tag tguide-tag--debate">논쟁</em>`
      : item.kind === "transfer" ? `<em class="tguide-tag tguide-tag--transfer">전이</em>` : "";
    return `
      <section class="tguide-block">
        <h3>추가 탐구 질문</h3>
        <p class="tguide-sub"><em class="tguide-tag tguide-tag--app">앱 질문</em>은 학생 앱의 생각친구가 실제로 묻는 질문, <em class="tguide-tag tguide-tag--guide">지도서</em>는 지도서 발문 예시, 표시 없는 것은 더 해 볼 수 있는 질문이에요.</p>
        ${groups.map((g) => `
          <div class="tguide-qgroup tguide-qgroup--${g.key}">
            <h4>${g.title}</h4>
            <p class="tguide-qdesc">${g.desc}</p>
            <ul>
              ${(lesson[g.key] || []).map((item) => {
                const q = item.src === "app" && live[g.step] ? live[g.step] : item.q;
                return `<li>${kindTag(item)}${escapeHtml(q)}${srcTag(item)}</li>`;
              }).join("")}
            </ul>
          </div>
        `).join("")}
      </section>
    `;
  }

  function closeGuide() {
    const overlay = document.getElementById("teacherLessonGuide");
    if (overlay) overlay.remove();
    document.removeEventListener("keydown", onGuideKey);
  }

  function onGuideKey(e) {
    if (e.key === "Escape") closeGuide();
  }

  function openGuide(route, opts) {
    opts = opts || {};
    closeGuide();
    const overlay = document.createElement("div");
    overlay.id = "teacherLessonGuide";
    overlay.className = "tguide-overlay";
    overlay.dataset.route = baseRoute(route);
    overlay.dataset.source = opts.source || "activity";
    overlay.innerHTML = guidePanelHTML(route, opts);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeGuide();
    });
    document.body.appendChild(overlay);
    const closeBtn = overlay.querySelector("#tguideCloseBtn");
    if (closeBtn) closeBtn.onclick = () => closeGuide();
    document.addEventListener("keydown", onGuideKey);
    return overlay;
  }

  function toggleGuide(route, opts) {
    const overlay = document.getElementById("teacherLessonGuide");
    if (overlay && overlay.dataset.route === baseRoute(route)) {
      closeGuide();
      return false;
    }
    openGuide(route, opts);
    return true;
  }

  function bindGuideButton(opts) {
    opts = opts || {};
    const btn = document.getElementById("lessonGuideBtn");
    if (!btn) return;
    btn.onclick = (e) => {
      e.stopPropagation();
      if (typeof opts.playSound === "function") opts.playSound("click.mp3");
      const route = opts.route || btn.dataset.route || "";
      toggleGuide(route, {
        source: opts.source || "activity",
        inquiryQuestion: opts.inquiryQuestion,
        activityLabel: opts.activityLabel
      });
    };
  }

  function syncGuideOverlay(stateCurrent, isDashboard) {
    const overlay = document.getElementById("teacherLessonGuide");
    if (!overlay) return;
    const src = overlay.dataset.source || "activity";
    const route = overlay.dataset.route || "";
    if (src === "dashboard") {
      if (!isDashboard) closeGuide();
      return;
    }
    if (baseRoute(stateCurrent) !== route) closeGuide();
  }

  function fakeProgressState(progress) {
    const st = {
      valueRecords: Array.isArray(progress?.valueRecords) ? progress.valueRecords.slice() : [],
      hanokExplorer: progress?.hanokExplorer || null,
      valueReflection: null,
      finalCultureReflection: progress?.finalCultureReflection
        ? { ...progress.finalCultureReflection }
        : null,
      completedMissions: (progress?.completedMissions && typeof progress.completedMissions === "object")
        ? { ...progress.completedMissions }
        : {},
      treasures: (progress?.treasures && typeof progress.treasures === "object")
        ? { ...progress.treasures }
        : {}
    };
    if (window.ValueGuardianBook && typeof window.ValueGuardianBook.syncFromState === "function") {
      window.ValueGuardianBook.syncFromState(st);
    }
    if (window.ValueGuardianBook && typeof window.ValueGuardianBook.normalizeRecord === "function") {
      st.valueRecords = (st.valueRecords || [])
        .map((item) => window.ValueGuardianBook.normalizeRecord(item))
        .filter(Boolean);
    }
    return st;
  }

  function bookStateFromProgress(progress) {
    const st = fakeProgressState(progress);
    const finale = st.finalCultureReflection || null;
    st.valueBook = {
      view: "cover",
      pageIndex: 0,
      whyWant: finale?.wantText || "",
      whyReason: finale?.reasonText || ""
    };
    return st;
  }

  function isCompleteRecord(rec) {
    if (window.ValueGuardianBook && typeof window.ValueGuardianBook.isCompleteRecord === "function") {
      return window.ValueGuardianBook.isCompleteRecord(rec);
    }
    return !!(rec && (rec.status === "complete" || rec.reflectionText || rec.selectedElementLabel || rec.photoUrl));
  }

  function thoughtOf(rec) {
    if (window.ValueGuardianBook && typeof window.ValueGuardianBook.displayAnswer === "function") {
      return window.ValueGuardianBook.displayAnswer(rec);
    }
    return String((rec && (rec.finalAnswer || rec.finalSummary || rec.reflectionText || rec.initialAnswer)) || "").trim();
  }

  function recordFor(records, activity) {
    return (records || []).find((item) => item && item.activity === activity) || null;
  }

  function classRows(classroom, progressMap) {
    return (classroom?.students || [])
      .slice()
      .sort((a, b) => Number(a.number) - Number(b.number))
      .map((student) => {
        const progress = progressMap?.[student.accountId] || {};
        const st = fakeProgressState(progress);
        return {
          student,
          progress,
          records: st.valueRecords || [],
          finalCultureReflection: st.finalCultureReflection || null
        };
      });
  }

  function responseBadge(rec) {
    const type = rec?.responseType || "";
    if (type === "voice" || rec?.audioUrl) return "말로";
    if (rec?.reflectionText) return "글로";
    return "선택";
  }

  function mediaHTML(rec) {
    if (!rec) return "";
    const bits = [];
    if (rec.audioUrl) {
      bits.push(`<audio class="tval-audio" controls src="${escapeAttr(rec.audioUrl)}"></audio>`);
    }
    return bits.length ? `<div class="tval-media">${bits.join("")}</div>` : "";
  }

  function studentRecordCard(rec, activityLabel) {
    if (!isCompleteRecord(rec)) {
      return `
        <article class="tval-card tval-card--empty">
          <h4>${escapeHtml(activityLabel)}</h4>
          <p>아직 우리 문화 수호책을 남기지 않았어요.</p>
        </article>
      `;
    }
    const found = rec.selectedElementLabel || rec.valueLabel || "-";
    const thought = (window.ValueGuardianBook && typeof window.ValueGuardianBook.displayAnswer === "function")
      ? window.ValueGuardianBook.displayAnswer(rec)
      : (rec.finalAnswer || rec.finalSummary || rec.reflectionText || rec.initialAnswer || "");
    return `
      <article class="tval-card">
        <div class="tval-card-top">
          <h4>${escapeHtml(activityLabel)}</h4>
          <span class="tval-badge">${escapeHtml(responseBadge(rec))}</span>
        </div>
        <p class="tval-kicker">① 배운 내용</p>
        <p class="tval-line">${escapeHtml(found)}</p>
        ${thought ? `<p class="tval-kicker">② 내 생각</p><p class="tval-line">${escapeHtml(thought)}</p>` : ""}
        ${mediaHTML(rec)}
      </article>
    `;
  }

  function modePillsHTML(mode) {
    const items = [
      { id: "student", label: "학생별" },
      { id: "activity", label: "활동별" },
      { id: "flow", label: "📈 수업 전체 흐름" }
    ];
    return `
      <div class="tval-modes" role="tablist" aria-label="우리 문화 수호책 열람 방식">
        ${items.map((item) => `
          <button type="button" class="tval-mode${mode === item.id ? " is-on" : ""}" data-value-mode="${item.id}">
            ${item.label}
          </button>
        `).join("")}
      </div>
    `;
  }

  function activityGridHTML(catalog, rows, selectedActivity, stageImage) {
    return `
      <div class="tval-act-grid">
        ${catalog.map((item) => {
          const done = rows.filter((row) => isCompleteRecord(recordFor(row.records, item.activity))).length;
          const total = rows.length;
          const on = selectedActivity === item.activity ? " is-on" : "";
          const img = typeof stageImage === "function" ? stageImage(item.stageNum, item.image) : "";
          return `
            <button type="button" class="tval-act-card${on}" data-value-activity="${escapeAttr(item.activity)}">
              ${img ? `<img src="${escapeAttr(img)}" alt="" />` : ""}
              <span class="tval-act-label">${escapeHtml(item.label)}</span>
              <span class="tval-act-count">완성 ${done} / ${total}</span>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function rosterHTML(rows, catalog) {
    const total = catalog.length;
    return `
      <p class="tval-hint">학생을 누르면 그 학생의 수호책을 볼 수 있어요.</p>
      <div class="tval-roster">
        ${rows.map((row) => {
          const done = catalog.filter((item) => isCompleteRecord(recordFor(row.records, item.activity))).length;
          const s = row.student;
          return `
            <button type="button" class="tval-person" data-value-student="${escapeAttr(s.accountId)}">
              <span class="tval-person-num">${escapeHtml(s.number)}</span>
              <span class="tval-person-name">${escapeHtml(s.name)}</span>
              <span class="tval-person-count">${done} / ${total}</span>
            </button>
          `;
        }).join("") || `<p class="tval-empty">아직 등록된 학생이 없어요.</p>`}
      </div>
    `;
  }

  function studentDetailHTML(row, catalog) {
    const s = row.student;
    const cards = catalog.map((item) => studentRecordCard(recordFor(row.records, item.activity), item.label)).join("");
    return `
      <div class="tval-detail-head">
        <button type="button" class="btn ghost tval-back" data-value-back="student">◀ 명단</button>
        <h3>${escapeHtml(s.number)}번 ${escapeHtml(s.name)}</h3>
      </div>
      <div class="tval-card-list">${cards}</div>
    `;
  }

  function activitySubTabsHTML(sub) {
    const items = [
      { id: "analysis", label: "📊 우리 반 분석" },
      { id: "list", label: "📝 학생 응답 모아보기" }
    ];
    return `
      <div class="tval-subtabs" role="tablist" aria-label="활동 보기 방식">
        ${items.map((item) => `
          <button type="button" class="tval-subtab${sub === item.id ? " is-on" : ""}" data-value-sub="${item.id}">${item.label}</button>
        `).join("")}
      </div>
    `;
  }

  function activityAnalysisHTML(item, rows) {
    if (!window.TeacherAnalysis || typeof window.TeacherAnalysis.renderHTML !== "function") {
      return `<p class="tval-empty">분석 도구를 불러오지 못했어요. 새로고침해 주세요.</p>`;
    }
    const config = reflectionConfig(item.activity) || reflectionConfig(item.route) || {};
    return window.TeacherAnalysis.renderHTML(item, rows, config, { isCompleteRecord, recordFor, thoughtOf, classKey: _currentClassKey });
  }

  function coreQuestionOf(item) {
    const GQ = window.ThinkFriendQuestions;
    const q = GQ && typeof GQ.get === "function" ? (GQ.get(item.activity) || GQ.get(item.route)) : null;
    if (q && q.core) return q.core;
    const config = reflectionConfig(item.activity) || reflectionConfig(item.route) || {};
    return config.valueQuestion || "";
  }

  function activityStudentListHTML(item, rows, sub) {
    sub = sub === "list" ? "list" : "analysis";
    const cards = rows.map((row) => {
      const rec = recordFor(row.records, item.activity);
      const s = row.student;
      const complete = isCompleteRecord(rec);
      return `
        <article class="tval-card${complete ? "" : " tval-card--empty"}">
          <div class="tval-card-top">
            <h4>${escapeHtml(s.number)}번 ${escapeHtml(s.name)}</h4>
            <span class="tval-badge">${complete ? escapeHtml(responseBadge(rec)) : "미작성"}</span>
          </div>
          ${complete
            ? `
              <p class="tval-kicker">① 배운 내용</p>
              <p class="tval-line">${escapeHtml(rec.selectedElementLabel || rec.valueLabel || "-")}</p>
              ${thoughtOf(rec) ? `<p class="tval-kicker">② 내 생각</p><p class="tval-line">${escapeHtml(thoughtOf(rec))}</p>` : ""}
              ${mediaHTML(rec)}
            `
            : `<p>아직 이 활동의 우리 문화 수호책이 없어요.</p>`}
        </article>
      `;
    }).join("");
    const done = rows.filter((row) => isCompleteRecord(recordFor(row.records, item.activity))).length;
    return `
      <div class="tval-detail-head">
        <button type="button" class="btn ghost tval-back" data-value-back="activity">◀ 활동 목록</button>
        <h3>${escapeHtml(item.label)}</h3>
        <p class="tval-sub">완성 ${done} / ${rows.length}</p>
        ${coreQuestionOf(item) ? `<p class="tval-core-q">핵심 질문 · ${escapeHtml(coreQuestionOf(item))}</p>` : ""}
        <button type="button" class="btn tval-open-guide" data-open-guide="${escapeAttr(item.route)}">📖 수업 가이드</button>
      </div>
      ${activitySubTabsHTML(sub)}
      ${sub === "analysis" ? activityAnalysisHTML(item, rows) : `<div class="tval-card-list">${cards}</div>`}
    `;
  }

  function tallyHTML(item, rows, config) {
    const choices = ((config && config.choices) || []).map((choice) => {
      if (choice && typeof choice === "object") {
        return { id: String(choice.id || choice.label), label: String(choice.label || choice.id) };
      }
      return { id: String(choice), label: String(choice) };
    });
    const counts = {};
    const names = {};
    rows.forEach((row) => {
      const rec = recordFor(row.records, item.activity);
      if (!isCompleteRecord(rec)) return;
      const label = rec.selectedElementLabel || rec.valueLabel || rec.selectedElement || "기타";
      counts[label] = (counts[label] || 0) + 1;
      if (!names[label]) names[label] = [];
      names[label].push(`${row.student.number}번 ${row.student.name}`);
    });
    const labels = choices.length
      ? Array.from(new Set(choices.map((c) => c.label).concat(Object.keys(counts))))
      : Object.keys(counts);
    const max = Math.max(1, ...labels.map((label) => counts[label] || 0));
    if (!labels.length) {
      return `<p class="tval-empty">아직 고른 학생이 없어요.</p>`;
    }
    return `
      <ul class="tval-tally">
        ${labels.map((label) => {
          const n = counts[label] || 0;
          const pct = Math.round((n / max) * 100);
          return `
            <li>
              <div class="tval-tally-row">
                <strong>${escapeHtml(label)}</strong>
                <span>${n}명</span>
              </div>
              <div class="tval-bar"><span style="width:${pct}%"></span></div>
              ${n ? `<p class="tval-names">${escapeHtml((names[label] || []).join(", "))}</p>` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    `;
  }

  function thoughtListHTML(item, rows) {
    const cards = rows
      .filter((row) => {
        const rec = recordFor(row.records, item.activity);
        return isCompleteRecord(rec) && (thoughtOf(rec) || rec.audioUrl);
      })
      .map((row) => {
        const rec = recordFor(row.records, item.activity);
        const s = row.student;
        return `
          <article class="tval-card">
            <div class="tval-card-top">
              <h4>${escapeHtml(s.number)}번 ${escapeHtml(s.name)}</h4>
              <span class="tval-badge">${escapeHtml(responseBadge(rec))}</span>
            </div>
            ${thoughtOf(rec) ? `<p class="tval-line">${escapeHtml(thoughtOf(rec))}</p>` : ""}
            ${mediaHTML(rec)}
          </article>
        `;
      }).join("");
    return cards || `<p class="tval-empty">아직 생각을 남긴 학생이 없어요.</p>`;
  }

  function questionDetailHTML(item, rows) {
    const config = reflectionConfig(item.activity) || reflectionConfig(item.route) || {};
    const valueQ = config.valueQuestion || config.step1Question || "오늘 활동에서 무엇을 느꼈을까?";
    return `
      <div class="tval-detail-head">
        <button type="button" class="btn ghost tval-back" data-value-back="question">◀ 활동 목록</button>
        <h3>${escapeHtml(item.label)}</h3>
        <button type="button" class="btn tval-open-guide" data-open-guide="${escapeAttr(item.route)}">📖 수업 가이드</button>
      </div>
      <section class="tval-qblock">
        <h4>${escapeHtml(valueQ)}</h4>
        ${tallyHTML(item, rows, config)}
        <div class="tval-card-list">${thoughtListHTML(item, rows)}</div>
      </section>
    `;
  }

  let _currentClassKey = "";

  function renderValuesHTML(opts) {
    opts = opts || {};
    const classroom = opts.classroom || {};
    _currentClassKey = String(classroom.classKey || classroom.classCode || "");
    const progressMap = opts.progressMap || {};
    const view = opts.view || { mode: "student", studentAccountId: "", activity: "" };
    const catalog = activityCatalog(opts.stageMenus);
    const rows = classRows(classroom, progressMap);
    // 질문별 보기는 활동별로 합쳤다 (활동마다 핵심 질문이 하나라서 1:1)
    const mode = view.mode === "question" ? "activity" : (view.mode || "student");
    let body = "";

    if (mode === "student") {
      body = rosterHTML(rows, catalog);
    } else if (mode === "flow") {
      body = window.TeacherAnalysis && typeof window.TeacherAnalysis.renderFlowHTML === "function"
        ? window.TeacherAnalysis.renderFlowHTML(catalog, rows, { isCompleteRecord, recordFor, thoughtOf, classKey: _currentClassKey })
        : `<p class="tval-empty">분석 도구를 불러오지 못했어요. 새로고침해 주세요.</p>`;
    } else if (mode === "activity") {
      const item = catalog.find((act) => act.activity === view.activity);
      body = item
        ? activityStudentListHTML(item, rows, view.sub)
        : activityGridHTML(catalog, rows, view.activity, opts.stageImage);
    } else {
      const item = catalog.find((act) => act.activity === view.activity);
      body = item
        ? questionDetailHTML(item, rows)
        : activityGridHTML(catalog, rows, view.activity, opts.stageImage);
    }

    return `
      <div class="tval-panel" id="teacherValuesPanel">
        ${modePillsHTML(mode)}
        ${body}
      </div>
    `;
  }

  function bindValuesPanel(root, handlers) {
    handlers = handlers || {};
    if (!root) return;
    root.querySelectorAll("[data-value-mode]").forEach((btn) => {
      btn.onclick = () => handlers.onMode && handlers.onMode(btn.dataset.valueMode);
    });
    root.querySelectorAll("[data-value-student]").forEach((btn) => {
      btn.onclick = () => handlers.onStudent && handlers.onStudent(btn.dataset.valueStudent);
    });
    root.querySelectorAll("[data-value-activity]").forEach((btn) => {
      btn.onclick = () => handlers.onActivity && handlers.onActivity(btn.dataset.valueActivity);
    });
    root.querySelectorAll("[data-value-sub]").forEach((btn) => {
      btn.onclick = () => handlers.onSub && handlers.onSub(btn.dataset.valueSub);
    });
    root.querySelectorAll("[data-value-back]").forEach((btn) => {
      btn.onclick = () => handlers.onBack && handlers.onBack(btn.dataset.valueBack);
    });
    root.querySelectorAll("[data-open-guide]").forEach((btn) => {
      btn.onclick = () => handlers.onGuide && handlers.onGuide(btn.dataset.openGuide);
    });
  }

  window.TeacherTools = {
    LESSON_GUIDES,
    getGuide,
    guideButtonHTML,
    bindGuideButton,
    openGuide,
    closeGuide,
    toggleGuide,
    syncGuideOverlay,
    renderValuesHTML,
    bindValuesPanel,
    activityCatalog,
    bookStateFromProgress
  };
})();
