/**
 * 생각친구 질문 설계안 (2차) — thinkfriend_questions_v2.docx
 *
 * 활동마다: 핵심 질문(core) + ① 사실적(fact) ② 개념적(concept) ③ 논쟁적·전이(transfer)
 * 각 단계: 질문(q), 보기(choices, 4~5개), 정리 문장 틀(say)
 *
 * say 틀 표기
 *   {a}      고른 보기/아이 말을 그대로 (여러 개면 "A, B")
 *   {a:을}   받침에 맞춰 을/를   (이·은·와·으로·이었어요 도 같은 방식)
 *   {a:에는} 그대로 붙임 (받침 무관)
 *   map      보기별로 따로 쓸 문장이 필요할 때 (보기 → 완성 문장)
 * 정리 문장 2번(② 개념적)은 "~라고 생각해요"로 끝맺는다.
 */
(function () {
  "use strict";

  const QUESTIONS = {
    "1-1": {
      key: "taegeukgi", route: "stage1_a1", title: "태극기 세우기",
      core: "우리나라 태극기는 왜 이런 무늬일까?",
      steps: [
        { type: "fact", q: "태극기에 어떤 색과 무늬가 있었어?",
          choices: ["하얀 바탕", "빨강·파랑 동그라미", "까만 막대기", "네 모서리 무늬"],
          say: "태극기에는 {a:이} 있어요." },
        { type: "concept", q: "가운데 빨강과 파랑은 왜 꼭 붙어 있을까?",
          choices: ["사이좋게 어울리라고", "서로 도우라고", "하나로 뭉치라고", "예뻐 보이라고"],
          say: "빨강과 파랑이 꼭 붙어 있는 건 {a} 그런 거라고 생각해요." },
        { type: "transfer", q: "태극기를 소중히 여기려면 어떻게 해야 할까?",
          choices: ["국경일에 달아요", "기쁜 날에 달아요", "반듯하게 달아요", "태극기의 뜻을 기억해요"],
          say: "태극기를 소중히 여기려면 {a.}",
          map: {
            "국경일에 달아요": "태극기를 소중히 여기려면 국경일에 태극기를 달아요.",
            "기쁜 날에 달아요": "태극기를 소중히 여기려면 기쁜 날에 태극기를 달아요.",
            "반듯하게 달아요": "태극기를 소중히 여기려면 반듯하게 달아요.",
            "태극기의 뜻을 기억해요": "태극기를 소중히 여기려면 태극기의 뜻을 기억해요."
          } }
      ]
    },
    "1-2": {
      key: "mugunghwa", route: "stage1_a2", title: "무궁화 피우기",
      core: "왜 무궁화가 우리나라 꽃이 되었을까?",
      steps: [
        { type: "fact", q: "무궁화는 어떤 색깔이었어?",
          choices: ["분홍색", "하얀색", "가운데가 빨간색", "보라색"],
          say: "무궁화는 {a:이었어요}." },
        { type: "concept", q: "100일 넘게 계속 피는 무궁화, 우리나라와 어디가 닮았을까?",
          choices: ["힘이 세서", "포기하지 않아서", "끝없이 이어져서", "힘들어도 다시 일어나서"],
          say: "무궁화는 {a} 우리나라와 닮았다고 생각해요." },
        { type: "transfer", q: "너도 무궁화처럼 끝까지 오래 해보고 싶은 일이 있어?",
          choices: ["줄넘기", "책 읽기", "글씨 쓰기", "그림 그리기", "악기 연주"],
          say: "나도 무궁화처럼 {a:을} 끝까지 해 보고 싶어요." }
      ]
    },
    "1-3": {
      key: "anthem", route: "stage1_a3", title: "애국가 부르기",
      core: "왜 중요한 날에는 애국가를 함께 부를까?",
      steps: [
        { type: "fact", q: "애국가를 어디에서 들어 봤어?",
          choices: ["축구·야구 경기", "올림픽", "학교 행사", "텔레비전"],
          say: "애국가를 {a}에서 들어 봤어요." },
        { type: "concept", q: "중요한 날에는 왜 애국가를 다 같이 부를까?",
          choices: ["다 같이 한마음이 되려고", "나라를 아끼는 마음이라서", "우리나라의 노래라서", "함께 힘을 내려고"],
          say: "중요한 날에 애국가를 다 같이 부르는 건 {a} 그런 거라고 생각해요." },
        { type: "transfer", q: "우리 반 노래를 만든다면 어떤 말을 넣고 싶어?",
          choices: ["사이좋게 지내요", "서로 도와요", "함께 웃어요", "우리 반 최고"],
          say: "우리 반 노래에는 '{a}'라는 말을 넣고 싶어요." }
      ]
    },
    "1-4": {
      key: "money", route: "stage1_a4", title: "화폐 속 이야기",
      core: "우리나라 화폐에는 어떤 그림이 있을까?",
      steps: [
        { type: "fact", q: "돈에서 어떤 사람을 만났어?",
          choices: ["세종대왕", "이순신", "신사임당", "이황", "이이"],
          say: "돈에서 {a:을} 만났어요." },
        { type: "concept", q: "왜 그분들을 돈에 넣었을까?",
          choices: ["훌륭한 일을 해서", "많은 사람을 도와서", "모두 본받으라고", "오래 기억하려고", "유명해서"],
          say: "그분들을 돈에 넣은 건 {a} 그런 거라고 생각해요." },
        { type: "transfer", q: "우리나라를 알리는 새 돈을 만든다면 무엇을 넣고 싶어?",
          choices: ["한글", "태극기", "무궁화", "한복", "독도"],
          say: "우리나라를 알리는 새 돈에는 {a:을} 넣고 싶어요." }
      ]
    },
    "2-1": {
      key: "hangul", route: "stage2_a1", title: "한글 조각 맞추기",
      core: "한글은 누가 왜 만들었을까?",
      steps: [
        { type: "fact", q: "자음·모음 조각으로 어떤 낱말을 만들었어?",
          choices: ["서울", "한글", "한복", "무궁화", "태극기", "김치"],
          say: "한글 조각으로 '{a}' 낱말을 만들었어요." },
        { type: "concept", q: "세종대왕은 왜 한글을 만들었을까?",
          choices: ["글자가 어려워서", "모두 읽고 쓰라고", "백성을 사랑해서", "마음을 글로 쓰라고"],
          say: "세종대왕은 {a} 한글을 만들었다고 생각해요." },
        { type: "transfer", q: "한글이 없다면 어떤 게 힘들까?",
          choices: ["책을 못 읽어요", "편지를 못 써요", "내 이름을 못 써요", "간판을 못 읽어요"],
          say: "한글이 없다면 {a.}" }
      ]
    },
    "2-2": {
      key: "hanok", route: "stage2_a2", title: "한옥 세우기",
      core: "한옥은 지금의 우리집과 어떻게 다를까?",
      steps: [
        { type: "fact", q: "한옥에서 어떤 곳을 봤어?",
          choices: ["기와지붕", "마루", "마당", "온돌방", "창호지 문"],
          say: "한옥에서 {a:을} 봤어요." },
        { type: "concept", q: "한옥에서는 여름과 겨울을 어떻게 지냈을까?",
          choices: ["여름엔 마루에서 시원하게", "겨울엔 온돌로 따뜻하게", "처마가 햇빛을 가려 줘", "흙벽이 더위와 추위를 막아 줘"],
          say: "한옥에서 여름과 겨울을 지낸 방법은 '{a}'라고 생각해요.",
          map: {
            "여름엔 마루에서 시원하게": "한옥에서는 여름에 마루에서 시원하게 지냈다고 생각해요.",
            "겨울엔 온돌로 따뜻하게": "한옥에서는 겨울에 온돌로 따뜻하게 지냈다고 생각해요.",
            "처마가 햇빛을 가려 줘": "한옥은 처마가 햇빛을 가려 줘서 여름에 시원했다고 생각해요.",
            "흙벽이 더위와 추위를 막아 줘": "한옥은 흙벽이 더위와 추위를 막아 줬다고 생각해요."
          } },
        { type: "transfer", q: "우리 집에 한옥처럼 바꾸고 싶은 곳은?",
          choices: ["마당", "마루", "온돌방", "창호지 문", "기와지붕"],
          say: "우리 집에도 한옥처럼 {a:이} 있으면 좋겠어요." }
      ]
    },
    "2-3": {
      key: "dancheong", route: "stage2_a3", title: "단청 색칠하기",
      core: "우리나라 문양은 어떻게 생겼을까?",
      steps: [
        { type: "fact", q: "단청에 어떤 색을 칠했어?",
          choices: ["빨강", "파랑", "초록", "노랑", "흰색"],
          say: "단청에 {a:을} 칠했어요." },
        { type: "concept", q: "옛날 사람들은 왜 나무 건물에 색을 칠했을까?",
          choices: ["예쁘게 하려고", "나무가 안 상하게", "벌레가 못 오게", "귀한 건물이라서"],
          say: "옛날 사람들은 {a} 나무 건물에 색을 칠했다고 생각해요." },
        { type: "transfer", q: "단청 무늬로 내 물건을 꾸민다면 무엇을 꾸밀래?",
          choices: ["필통", "공책", "가방", "내 방 문", "부채"],
          say: "단청 무늬로 {a:을} 꾸미고 싶어요." }
      ]
    },
    "3-1": {
      key: "hanbok", route: "stage3_a1", title: "한복 입히기",
      core: "한복의 다양한 색과 모양에 대해 알아볼까?",
      steps: [
        { type: "fact", q: "어떤 색 한복을 골랐어?",
          choices: ["빨간색", "노란색", "분홍색", "파란색", "초록색"],
          say: "나는 {a} 한복을 골랐어요." },
        { type: "concept", q: "한복은 지금 내 옷이랑 뭐가 달라?",
          choices: ["넉넉해", "색이 알록달록해", "옷고름이 있어", "치마가 길고 풍성해", "소매가 넓어"],
          say: "한복이 지금 내 옷과 다른 점은 '{a}'라고 생각해요." },
        { type: "transfer", q: "한복을 입으면 좋은 날은 언제일까?",
          choices: ["설날", "추석", "결혼식", "돌잔치", "내 생일"],
          say: "{a:에} 한복을 입으면 좋겠어요." }
      ]
    },
    "3-2": {
      key: "bibimbap", route: "stage3_a2", title: "비빔밥 만들기",
      core: "우리나라 음식에는 어떤 것들이 있을까?",
      steps: [
        { type: "fact", q: "비빔밥에 무엇을 넣었어? (여러 개 골라도 돼)",
          choices: ["당근", "고사리", "콩나물", "애호박", "소고기", "달걀", "고추장"],
          say: "비빔밥에 {a:을} 넣었어요." },
        { type: "concept", q: "여러 재료를 섞으면 왜 더 맛있을까?",
          choices: ["맛이 어울려서", "골고루 먹어서", "색이 예뻐서", "여러 맛이 한 번에 나서"],
          say: "여러 재료를 섞으면 {a} 더 맛있다고 생각해요." },
        { type: "transfer", q: "우리 반도 비빔밥처럼 잘 어울리려면 어떻게 할까?",
          choices: ["서로 도와요", "양보해요", "같이 놀아요", "친구 말을 잘 들어요", "웃으며 인사해요"],
          say: "우리 반도 비빔밥처럼 잘 어울리려면 {a.}" }
      ]
    },
    "3-3": {
      key: "holiday", route: "stage3_a3", title: "설날과 추석",
      core: "명절에만 하는 일은 무엇이 있을까?",
      steps: [
        { type: "fact", q: "설날이나 추석에 하는 일, 하나만 말해줄래?",
          choices: ["세배", "떡국 먹기", "송편 빚기", "강강술래", "성묘", "연날리기"],
          say: "명절에는 {a:을} 해요." },
        { type: "concept", q: "명절에는 왜 가족이 다 모일까?",
          choices: ["보고 싶어서", "고마움을 나누려고", "함께 음식을 먹으려고", "조상님께 인사하려고", "건강을 빌어 주려고"],
          say: "명절에 가족이 다 모이는 건 {a} 그런 거라고 생각해요." },
        { type: "transfer", q: "이번 명절에 가족에게 어떤 인사를 하고 싶어?",
          choices: ["새해 복 많이 받으세요", "건강하세요", "고맙습니다", "사랑해요"],
          say: "이번 명절에 가족에게 '{a}'라고 인사하고 싶어요." }
      ]
    },
    "4-1": {
      key: "yut", route: "stage4_a1", title: "윷놀이",
      core: "윷놀이는 언제 어떻게 할까?",
      steps: [
        { type: "fact", q: "도, 개, 걸, 윷, 모 중에 뭐가 나왔어?",
          choices: ["도", "개", "걸", "윷", "모"],
          say: "윷을 던졌더니 {a:이} 나왔어요." },
        { type: "concept", q: "윷놀이는 왜 여럿이 편을 나눠서 할까?",
          choices: ["함께 해서 신나서", "힘을 모으려고", "많은 사람이 같이 놀려고", "서로 응원하려고", "이기려고"],
          say: "윷놀이는 {a} 편을 나눠서 한다고 생각해요." },
        { type: "transfer", q: "지고 있을 때 우리 편에게 뭐라고 말해줄까?",
          choices: ["괜찮아!", "다음엔 모가 나올 거야", "끝까지 해 보자", "같이 힘내자", "재밌으면 됐어"],
          say: "지고 있을 때 우리 편에게 '{a}'라고 말해 주고 싶어요." }
      ]
    },
    "4-2": {
      key: "ttakji", route: "stage4_a2", title: "딱지접기",
      core: "딱지접기는 어떻게 할까?",
      steps: [
        { type: "fact", q: "딱지를 다 접으니 어떤 모양이 됐어?",
          choices: ["네모 모양", "납작한 모양", "두 가지 색이 섞였어", "딱딱해졌어"],
          say: "딱지를 다 접으니 {a:이} 됐어요.",
          map: {
            "두 가지 색이 섞였어": "딱지를 다 접으니 두 가지 색이 섞였어요.",
            "딱딱해졌어": "딱지를 다 접으니 딱딱해졌어요."
          } },
        { type: "concept", q: "옛날 아이들은 왜 종이로 장난감을 만들었을까?",
          choices: ["장난감이 없어서", "만드는 게 재밌어서", "종이는 구하기 쉬워서", "친구랑 같이 놀려고"],
          say: "옛날 아이들은 {a} 종이로 장난감을 만들었다고 생각해요." },
        { type: "transfer", q: "게임이랑 딱지치기, 친구랑 더 친해지는 건 뭘까?",
          choices: ["딱지치기, 얼굴 보고 놀아서", "게임, 멀리 있어도 놀 수 있어서", "둘 다 좋아", "놀이마다 달라"],
          say: "친구랑 더 친해지는 건 '{a}'라고 생각해요." }
      ]
    },
    "4-3": {
      key: "minyo", route: "stage4_a3", title: "우리민요 얼쑤!",
      core: "두 아리랑은 어떻게 다를까? 지역마다 아리랑이 왜 다를까?",
      steps: [
        { type: "fact", q: "두 아리랑 중에 어떤 게 더 좋았어?",
          choices: ["경기아리랑", "진도아리랑", "둘 다 좋아", "장단 치기가 제일 좋아"],
          say: "두 아리랑 중에 {a:이} 더 좋았어요.",
          map: {
            "둘 다 좋아": "두 아리랑이 둘 다 좋았어요.",
            "장단 치기가 제일 좋아": "장단 치기가 제일 좋았어요."
          } },
        { type: "concept", q: "두 노래는 느낌이 어떻게 달랐어?",
          choices: ["경기아리랑은 느리고, 진도아리랑은 신나요", "경기아리랑은 조금 슬프고, 진도아리랑은 흥겨워요", "진도아리랑이 어깨가 더 들썩여요", "경기아리랑이 따라 부르기 더 쉬워요"],
          say: "두 노래는 '{a}' 하고 느낌이 달랐다고 생각해요.",
          map: {
            "경기아리랑은 느리고, 진도아리랑은 신나요": "경기아리랑은 느리고, 진도아리랑은 신난다고 생각해요.",
            "경기아리랑은 조금 슬프고, 진도아리랑은 흥겨워요": "경기아리랑은 조금 슬프고, 진도아리랑은 흥겹다고 생각해요.",
            "진도아리랑이 어깨가 더 들썩여요": "진도아리랑이 어깨가 더 들썩인다고 생각해요.",
            "경기아리랑이 따라 부르기 더 쉬워요": "경기아리랑이 따라 부르기 더 쉽다고 생각해요."
          } },
        { type: "transfer", q: "지역마다 아리랑이 왜 다를까?",
          choices: ["사는 곳이 달라서", "사람들이 다르게 불러서", "말이 조금 달라서", "신나는 곳과 느린 곳이 있어서"],
          say: "{a} 지역마다 아리랑이 다르다고 생각해요." }
      ]
    },
    "4-4": {
      key: "talchum", route: "stage4_a4", title: "탈춤놀이",
      core: "탈과 어울리는 동작은 어떤 것이 있을까?",
      steps: [
        { type: "fact", q: "따라 해 본 동작 중에 뭐가 제일 재밌었어?",
          choices: ["앉았다 일어서기(불림)", "어깨에 손 얹기(고개잡이)", "다리 번쩍 들기(다리들기)", "무릎에 발 붙이기(황소걸음)", "팔 들고 한 발 서기(외사위)"],
          say: "탈춤에서 {a:이} 제일 재밌었어요." },
        { type: "concept", q: "옛날 사람들은 왜 탈을 쓰고 춤췄을까?",
          choices: ["하고 싶은 말을 하려고", "재밌으려고", "다른 사람이 되어 보려고", "사람들을 웃게 하려고"],
          say: "옛날 사람들은 {a} 탈을 쓰고 춤췄다고 생각해요." },
        { type: "transfer", q: "너라면 어떤 탈을 쓰고 무슨 춤을 출래?",
          choices: ["웃는 탈, 신나는 춤", "화난 탈, 씩씩한 춤", "양반탈, 느린 춤", "동물 탈, 깡충 춤"],
          say: "나라면 {a:을} 추고 싶어요." }
      ]
    }
  };

  const STEP_LABELS = { fact: "① 떠올리기", concept: "② 생각하기", transfer: "③ 나와 연결" };
  // 질문·보기·정리에 쓰지 않을 말 (설계안 1장)
  const BANNED_WORDS = ["의미", "가치", "전통", "상징", "계승", "소중함", "자긍심"];

  function hasBatchim(word) {
    const s = String(word || "").replace(/[^가-힣0-9]+$/g, "");
    const ch = s.charAt(s.length - 1);
    if (!ch) return false;
    if (/[0-9]/.test(ch)) return /[013678]/.test(ch);
    const code = ch.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return false;
    return (code - 0xac00) % 28 !== 0;
  }
  function batchimIsRieul(word) {
    const s = String(word || "").replace(/[^가-힣]+$/g, "");
    const code = s.charCodeAt(s.length - 1);
    return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 8;
  }

  const JOSA = {
    "이": ["이", "가"], "을": ["을", "를"], "은": ["은", "는"], "와": ["과", "와"],
    "으로": ["으로", "로"], "이었어요": ["이었어요", "였어요"], "이에요": ["이에요", "예요"]
  };

  function withJosa(word, josa) {
    if (!josa) return word;
    const pair = JOSA[josa];
    if (!pair) return `${word}${josa}`; // 에는, 에 등은 그대로 붙인다
    if (josa === "으로" && batchimIsRieul(word)) return `${word}로`;
    return `${word}${hasBatchim(word) ? pair[0] : pair[1]}`;
  }

  function joinItems(items) {
    const list = (items || []).map((t) => String(t || "").trim()).filter(Boolean);
    if (list.length <= 1) return list[0] || "";
    if (list.length === 2) return `${withJosa(list[0], "와")} ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, ${list[list.length - 1]}`;
  }

  function endSentence(text) {
    let t = String(text || "").trim().replace(/[.!?~]+$/g, "");
    if (!t) return "";
    if (!/[요다]$/.test(t)) t += "요";
    return `${t}.`;
  }

  /** 아이 말(자유 입력)을 짧은 '~요' 문장으로 */
  function childSentence(text) {
    let t = String(text || "").replace(/\s+/g, " ").trim().replace(/[.!?~]+$/g, "");
    if (!t) return "";
    t = t.replace(/조케/g, "좋게").replace(/조아/g, "좋아").replace(/조은/g, "좋은").replace(/이뻐/g, "예뻐")
      .replace(/시퍼/g, "싶어").replace(/시포/g, "싶어").replace(/([가-힣])수있/g, "$1 수 있").replace(/됬/g, "됐");
    if (/[요다]$/.test(t)) return `${t}.`;
    if (/서$/.test(t)) return `${t} 좋아요.`;
    // 받침 없는 끝말(지내, 도와줘, 멋져…)은 '요'를 붙이고, 받침 있는 이름말은 '이에요'
    if (!hasBatchim(t) || /(었|았|했|겠|있|없|싶)$/.test(t)) return `${t}요.`;
    return `${withJosa(t, "이에요")}.`;
  }

  /** 한 단계의 정리 문장 (고른 보기 → 틀, 자유 입력 → 아이 말 그대로 다듬기) */
  function stepSentence(step, answer) {
    if (!step || !answer || answer.skipped) return "";
    const picked = (answer.picked || []).filter(Boolean);
    const text = String(answer.text || "").trim();
    if (!picked.length && text && step.type === "concept") {
      // ② 개념적 답은 "~라고 생각해요"로 끝맺는다
      const t = childSentence(text).replace(/\s*좋아요\.$/, "").replace(/[.]$/, "").replace(/요$/, "");
      if (/(서|고|려고|라서|니까|해서)$/.test(t)) return `${t} 그런 거라고 생각해요.`;
      return `'${t}'라고 생각해요.`;
    }
    if (!picked.length && text) return childSentence(text);
    if (!picked.length) return "";
    const map = step.map || {};
    const mapped = picked.filter((p) => map[p]);
    const plain = picked.filter((p) => !map[p]);
    const parts = [];
    if (plain.length) parts.push(fillTemplate(step.say, plain));
    mapped.forEach((p) => parts.push(map[p]));
    let out = parts.join(" ");
    if (text) out += ` ${childSentence(text)}`;
    return out.trim();
  }

  function fillTemplate(tpl, items) {
    // 이름말(보기가 낱말)은 "A와 B", 말끝이 있는 보기(서로 도와요, ~라고)는 "A, B"로 잇는다
    const nounJoin = joinItems(items);
    const list = (items || []).map((t) => String(t || "").trim()).filter(Boolean);
    const commaJoin = list.join(", ");
    return String(tpl || "{a.}")
      .replace(/\{a\.\}/g, () => endSentence(list.map((x) => x.replace(/[.!?~]+$/g, "")).join(", ")))
      .replace(/\{a:([^}]+)\}/g, (_, josa) => withJosa(nounJoin, josa))
      .replace(/\{a\}/g, commaJoin);
  }

  function composeSummary(entry, answers) {
    if (!entry) return "";
    const lines = entry.steps.map((step, i) => stepSentence(step, (answers || [])[i])).filter(Boolean);
    if (!lines.length) return "아직 잘 모르겠어요.";
    return lines.join(" ");
  }

  const KEY_TO_ID = {};
  const ROUTE_TO_ID = {};
  Object.keys(QUESTIONS).forEach((id) => {
    KEY_TO_ID[QUESTIONS[id].key] = id;
    ROUTE_TO_ID[QUESTIONS[id].route] = id;
  });

  const API = {
    QUESTIONS,
    STEP_LABELS,
    BANNED_WORDS,
    get(idOrKeyOrRoute) {
      const raw = String(idOrKeyOrRoute || "").replace(/_hoist$/, "");
      const id = QUESTIONS[raw] ? raw : (KEY_TO_ID[raw] || ROUTE_TO_ID[raw] || "");
      return id ? Object.assign({ id }, QUESTIONS[id]) : null;
    },
    withJosa,
    joinItems,
    stepSentence,
    composeSummary,
    childSentence
  };

  if (typeof window !== "undefined") window.ThinkFriendQuestions = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})();
