/**
 * 14개 활동의 가치수호록 + ThinkFriend 데이터
 * 엔진은 thinking-friend-engine.js 하나, 활동 데이터만 여기 둔다.
 */
(function () {
  "use strict";

  const KEY_BY_ID = {
    "1-1": "taegeukgi",
    "1-2": "mugunghwa",
    "1-3": "anthem",
    "1-4": "money",
    "2-1": "hangul",
    "2-2": "hanok",
    "2-3": "dancheong",
    "3-1": "hanbok",
    "3-2": "bibimbap",
    "3-3": "holiday",
    "4-1": "yut",
    "4-2": "ttakji",
    "4-3": "minyo",
    "4-4": "talchum"
  };

  const ROUTE_BY_KEY = {
    taegeukgi: "stage1_a1",
    mugunghwa: "stage1_a2",
    anthem: "stage1_a3",
    money: "stage1_a4",
    hangul: "stage2_a1",
    hanok: "stage2_a2",
    dancheong: "stage2_a3",
    hanbok: "stage3_a1",
    bibimbap: "stage3_a2",
    holiday: "stage3_a3",
    yut: "stage4_a1",
    ttakji: "stage4_a2",
    minyo: "stage4_a3",
    talchum: "stage4_a4"
  };

  const thinkingFriendActivities = {
    "1-1": {
      id: "1-1",
      stage: 1,
      title: "태극기 세우기·게양하기",
      valueQuestion: "태극기에서 가장 기억에 남는 무늬의 의미는 무엇일까?",
      allowedKnowledge: [
        "태극기 가운데에는 태극 문양이 있다",
        "네 모서리에는 건·곤·감·리가 있다",
        "태극기에는 흰색, 빨간색, 파란색, 검은색이 사용된다",
        "태극기는 우리나라를 나타내는 상징이다"
      ],
      concepts: ["상징", "태극기의 의미", "우리나라를 나타내는 것", "소중히 여기기"],
      choicePool: [
        { label: "태극 문양", value: "taegeuk" },
        { label: "건·곤·감·리", value: "trigrams" },
        { label: "흰 바탕", value: "white_background" },
        { label: "태극기의 색", value: "colors" },
        { label: "다른 생각", value: "other" }
      ],
      thinkingGoals: [
        "태극기에서 어떤 무늬나 색을 관찰했는지 말하기",
        "그 무늬가 무엇을 나타내는지 자신의 말로 설명하기",
        "왜 그 부분이 기억에 남는지 근거 말하기",
        "태극기가 우리나라를 나타낸다는 상징과 연결하기"
      ],
      followUpExamples: {
        recall: "가운데 무늬와 네 모서리 무늬 중 뭐가 더 기억나?",
        clarify: "그 부분의 어떤 모습이 기억났어?",
        reason: "왜 그 부분이 마음에 들었어?",
        value: "태극기를 왜 소중히 다뤄야 한다고 생각해?"
      }
    },
    "1-2": {
      id: "1-2",
      stage: 1,
      title: "무궁화 피우기",
      valueQuestion: "무궁화의 어떤 점이 우리나라 꽃과 잘 어울린다고 생각해?",
      allowedKnowledge: [
        "무궁화는 우리나라를 나타내는 꽃이다",
        "무궁화에는 여러 색과 모양이 있다",
        "무궁화는 오랫동안 피고 또 피는 특징이 있다"
      ],
      concepts: ["나라를 나타내는 상징", "무궁화의 특징", "자연과 상징"],
      choicePool: [
        { label: "꽃 모양", value: "shape" },
        { label: "꽃 색깔", value: "color" },
        { label: "계속 피는 모습", value: "blooming" },
        { label: "다른 생각", value: "other" }
      ],
      thinkingGoals: [
        "무궁화의 모양·색·피는 모습 중 무엇을 보았는지 말하기",
        "그 특징이 우리나라 꽃과 어떻게 어울리는지 설명하기",
        "오래 피고 또 피는 모습과 나라를 나타내는 마음을 연결하기"
      ],
      followUpExamples: {
        recall: "꽃의 모양, 색, 피는 모습 중 뭐가 가장 기억나?",
        clarify: "그 모습의 어떤 점이 마음에 들었어?",
        reason: "왜 그 특징이 우리나라 꽃과 잘 어울린다고 생각해?",
        value: "무궁화를 보면 어떤 마음이 들었어?"
      }
    },
    "1-3": {
      id: "1-3",
      stage: 1,
      title: "애국가 부르기",
      valueQuestion: "애국가를 함께 부르면 어떤 느낌이 들까?",
      allowedKnowledge: [
        "애국가는 우리나라를 나타내는 노래이다",
        "중요한 행사에서 여러 사람이 함께 애국가를 부르기도 한다",
        "애국가 가사에는 우리나라의 자연과 모습이 담겨 있다"
      ],
      concepts: ["함께 부르는 노래", "나라를 나타내는 상징", "공동체", "느낌과 마음"],
      choicePool: [
        { label: "함께하는 느낌", value: "together" },
        { label: "힘이 나는 느낌", value: "energy" },
        { label: "우리나라가 생각남", value: "country" },
        { label: "아직 잘 모르겠어", value: "unsure" }
      ],
      thinkingGoals: [
        "애국가를 부를 때 든 느낌을 구체적으로 말하기",
        "혼자 부를 때와 함께 부를 때의 차이를 비교하기",
        "그 느낌이 우리나라를 생각하는 마음과 어떻게 이어지는지 말하기"
      ],
      followUpExamples: {
        recall: "혼자 부르는 것과 함께 부르는 것 중 어떤 게 더 기억나?",
        clarify: "어떤 순간에 그런 느낌이 들었어?",
        reason: "왜 여러 사람이 함께 노래하면 그런 느낌이 들까?",
        value: "우리나라를 소중히 여기는 마음은 어떻게 나타낼 수 있을까?"
      }
    },
    "1-4": {
      id: "1-4",
      stage: 1,
      title: "화폐 속 이야기",
      valueQuestion: "새로운 돈을 만든다면 어떤 그림을 넣고 싶어?",
      allowedKnowledge: [
        "우리나라 화폐에는 인물이 그려져 있다",
        "화폐에는 문화유산과 여러 그림이 들어 있다",
        "화폐에는 우리나라의 이야기를 담을 수 있다"
      ],
      concepts: ["화폐와 문화", "나라를 나타내는 이미지", "무엇을 기억하고 남길 것인가"],
      choicePool: [
        { label: "사람", value: "person" },
        { label: "문화유산", value: "heritage" },
        { label: "우리나라 자연", value: "nature" },
        { label: "전통문화", value: "culture" },
        { label: "내가 고른 다른 것", value: "other" }
      ],
      thinkingGoals: [
        "새 돈에 넣고 싶은 그림을 구체적으로 고르기",
        "왜 많은 사람이 그것을 기억하면 좋은지 말하기",
        "그 그림이 우리나라를 어떻게 보여 주는지 생각하기",
        "다른 문화 대신 그것을 고른 까닭을 설명하기"
      ],
      followUpExamples: {
        recall: "사람, 문화유산, 자연 중 하나를 골라볼래?",
        clarify: "어떤 모습을 그림으로 넣고 싶어?",
        reason: "왜 그것을 화폐에 넣고 싶어?",
        transfer: "그 돈을 본 사람이 우리나라에 대해 무엇을 알면 좋겠어?"
      }
    },
    "2-1": {
      id: "2-1",
      stage: 2,
      title: "한글 조각 맞추기",
      valueQuestion: "한글의 어떤 점을 외국인에게 자랑하고 싶어?",
      allowedKnowledge: [
        "한글은 세종대왕이 백성을 위해 만들었다",
        "한글은 자음과 모음으로 이루어진다",
        "자음과 모음을 모아 여러 글자를 만들 수 있다"
      ],
      concepts: ["한글을 만든 까닭", "글자의 원리", "소통", "한글의 가치"],
      choicePool: [
        { label: "자음과 모음", value: "letters" },
        { label: "글자를 만드는 방법", value: "system" },
        { label: "배우기 쉬운 점", value: "easy_to_learn" },
        { label: "세종대왕이 만든 까닭", value: "purpose" },
        { label: "다른 생각", value: "other" }
      ],
      thinkingGoals: [
        "한글의 어떤 점을 자랑하고 싶은지 고르기",
        "자음과 모음으로 글자를 만드는 원리를 자신의 말로 설명하기",
        "외국 친구에게 어떻게 알려 줄지 생각하기",
        "한글이 우리 생활에 어떤 도움이 되는지 말하기"
      ],
      followUpExamples: {
        recall: "한글을 만든 사람, 모양, 만드는 방법 중 뭐가 기억나?",
        clarify: "그 점의 어떤 부분이 신기했어?",
        reason: "왜 그 점을 자랑하고 싶어?",
        transfer: "한글이 없었다면 우리 생활은 어떻게 달라졌을까?"
      }
    },
    "2-2": {
      id: "2-2",
      stage: 2,
      title: "한옥 세우기",
      valueQuestion: "한옥의 좋은 점 중 우리집에도 쓰고 싶은 것은 무엇일까?",
      allowedKnowledge: [
        "한옥에는 마루와 온돌이 있다",
        "한옥에는 나무, 흙, 창호지 등이 사용된다",
        "한옥은 우리나라의 계절과 생활에 맞게 만들어졌다"
      ],
      concepts: ["한옥과 오늘날 집 비교", "자연환경과 생활", "전통의 지혜", "오늘날에 적용하기"],
      choicePool: [
        { label: "마루", value: "maru" },
        { label: "온돌", value: "ondol" },
        { label: "창호지", value: "changhoji" },
        { label: "자연 재료", value: "natural_material" },
        { label: "다른 생각", value: "other" }
      ],
      thinkingGoals: [
        "한옥에서 마음에 남는 부분을 구체적으로 고르기",
        "그 부분이 계절이나 생활과 어떻게 관련되는지 말하기",
        "오늘날 집과 한옥을 비교하며 무엇이 다른지 살펴보기",
        "우리 집에 쓴다면 어떤 변화가 있을지 예측하기"
      ],
      followUpExamples: {
        recall: "마루, 온돌, 창호지 중 가장 기억나는 건 뭐야?",
        clarify: "그것의 어떤 점이 좋아?",
        reason: "왜 오늘날 집에도 있으면 좋겠다고 생각해?",
        apply: "우리 집에 넣는다면 어디에 쓰고 싶어?",
        transfer: "그렇게 바꾸면 우리 생활이 어떻게 달라질까?"
      }
    },
    "2-3": {
      id: "2-3",
      stage: 2,
      title: "단청 색칠하기",
      valueQuestion: "우리나라 문양을 어디에 새롭게 사용해 보고 싶어?",
      allowedKnowledge: [
        "우리나라 전통문화에는 여러 색과 모양의 문양이 있다",
        "문양은 건물, 기와, 도자기 등 여러 곳에서 볼 수 있다",
        "같은 모양이 반복되거나 서로 어울려 사용되기도 한다"
      ],
      concepts: ["전통 문양", "반복과 아름다움", "전통을 새롭게 활용하기"],
      choicePool: [
        { label: "옷", value: "clothes" },
        { label: "가방", value: "bag" },
        { label: "신발", value: "shoes" },
        { label: "우리 교실", value: "classroom" },
        { label: "우리 집", value: "home" },
        { label: "다른 곳", value: "other" }
      ],
      thinkingGoals: [
        "오늘 본 문양의 모양과 색을 관찰해 말하기",
        "그 문양을 어디에 새롭게 쓰고 싶은지 고르기",
        "옛 문양을 지금 물건에 쓰면 느낌이 어떻게 달라질지 예측하기"
      ],
      followUpExamples: {
        recall: "오늘 본 문양 중 가장 기억나는 건 어떤 모양이야?",
        clarify: "그 문양을 어디에 넣고 싶어?",
        reason: "왜 그 물건과 잘 어울릴 것 같아?",
        transfer: "옛날 문양을 새롭게 사용하면 어떤 느낌이 날까?"
      }
    },
    "3-1": {
      id: "3-1",
      stage: 3,
      title: "한복 입히기",
      valueQuestion: "내가 입고 싶은 한복은 어떤 모습일까?",
      allowedKnowledge: [
        "한복에는 여러 색과 모양이 있다",
        "한복에는 저고리, 치마, 바지 등이 있다",
        "오늘날에는 전통 한복을 새롭게 바꾸어 입기도 한다"
      ],
      concepts: ["전통 의복", "색과 모양", "나의 취향", "전통과 변화"],
      choicePool: [
        { label: "내가 좋아하는 색", value: "color" },
        { label: "치마 한복", value: "skirt" },
        { label: "바지 한복", value: "pants" },
        { label: "전통 모습", value: "traditional" },
        { label: "새롭게 바꾼 한복", value: "modern" }
      ],
      thinkingGoals: [
        "입고 싶은 한복의 색과 모양을 구체적으로 그리기",
        "전통 모습과 새롭게 바꾼 모습 중 어디에 가까운지 비교하기",
        "왜 그 모습이 나에게 맞는지 말하기"
      ],
      followUpExamples: {
        recall: "어떤 색이나 모양의 한복이 기억나?",
        clarify: "어떤 색과 모양으로 만들고 싶어?",
        reason: "왜 그런 한복을 입고 싶어?",
        apply: "한복을 더 편하게 바꾼다면 무엇을 바꾸고 싶어?"
      }
    },
    "3-2": {
      id: "3-2",
      stage: 3,
      title: "비빔밥 요리하기",
      valueQuestion: "다른 사람에게 소개하고 싶은 우리나라 음식은 무엇일까?",
      allowedKnowledge: [
        "우리나라에는 비빔밥, 김치, 떡 등 여러 음식이 있다",
        "우리 음식에는 여러 재료와 맛, 색이 사용된다",
        "음식은 사람들의 생활과 문화를 보여주기도 한다"
      ],
      concepts: ["우리나라 음식", "재료와 맛", "음식과 문화", "다른 사람에게 소개하기"],
      choicePool: [
        { label: "비빔밥", value: "bibimbap" },
        { label: "김치", value: "kimchi" },
        { label: "떡", value: "tteok" },
        { label: "불고기", value: "bulgogi" },
        { label: "내가 아는 다른 음식", value: "other" }
      ],
      thinkingGoals: [
        "소개하고 싶은 우리나라 음식을 고르기",
        "맛·색·재료 중 어떤 점이 좋은지 관찰해 말하기",
        "처음 먹는 친구에게 어떻게 소개할지 생각하기"
      ],
      followUpExamples: {
        recall: "오늘 본 음식 중 먹어보고 싶은 것을 골라볼래?",
        clarify: "그 음식의 어떤 점이 좋아?",
        reason: "왜 다른 사람에게 소개하고 싶어?",
        transfer: "처음 먹는 친구에게 어떻게 소개해 주고 싶어?"
      }
    },
    "3-3": {
      id: "3-3",
      stage: 3,
      title: "설날과 추석",
      valueQuestion: "앞으로도 이어가고 싶은 명절 풍습은 무엇일까?",
      allowedKnowledge: [
        "설날에는 세배와 떡국 등의 풍습이 있다",
        "추석에는 송편과 성묘 등의 풍습이 있다",
        "명절에는 가족이 모이고 여러 놀이를 하기도 한다"
      ],
      concepts: ["명절", "가족과 공동체", "전통 풍습", "이어가기"],
      choicePool: [
        { label: "세배", value: "bow" },
        { label: "떡국", value: "tteokguk" },
        { label: "송편", value: "songpyeon" },
        { label: "가족과 함께하기", value: "family" },
        { label: "전통놀이", value: "play" },
        { label: "성묘", value: "seongmyo" }
      ],
      thinkingGoals: [
        "이어가고 싶은 명절 풍습을 고르기",
        "그 풍습이 가족과 어떤 관련이 있는지 말하기",
        "모습이 조금 바뀌어도 그 마음을 이어갈 수 있는지 생각하기"
      ],
      followUpExamples: {
        recall: "먹는 것과 놀이 중 뭐가 더 기억나?",
        clarify: "그 풍습에서 어떤 점이 좋아?",
        reason: "왜 앞으로도 이어졌으면 좋겠어?",
        transfer: "모습이 조금 달라져도 이 풍습을 계속 이어갈 수 있을까?"
      }
    },
    "4-1": {
      id: "4-1",
      stage: 4,
      title: "윷놀이",
      valueQuestion: "윷놀이에서 이기려면 행운과 생각 중 무엇이 더 중요할까?",
      allowedKnowledge: [
        "윷을 던지면 도, 개, 걸, 윷, 모가 나온다",
        "윷말을 어떻게 움직일지 선택할 수 있다",
        "업기와 지름길 같은 전략을 사용할 수 있다"
      ],
      concepts: ["운", "선택", "전략", "놀이에서의 판단"],
      choicePool: [
        { label: "운", value: "luck" },
        { label: "생각과 전략", value: "strategy" },
        { label: "둘 다", value: "both" },
        { label: "아직 잘 모르겠어", value: "unsure" }
      ],
      thinkingGoals: [
        "윷놀이에서 운과 생각 중 어디에 무게를 두는지 말하기",
        "같은 윷이 나와도 말 움직임에 따라 결과가 달라질 수 있는지 살펴보기",
        "자신의 주장과 반대되는 상황을 떠올려 다시 생각해 보기",
        "이기려면 어떤 선택이 필요한지 예측하기"
      ],
      followUpExamples: {
        recall: "윷이 잘 나오는 것과 말을 잘 움직이는 것 중 뭐가 기억나?",
        clarify: "어떤 순간에 그렇게 느꼈어?",
        reason: "왜 그게 더 중요하다고 생각해?",
        compare: "같은 윷이 나와도 결과가 달라질 수 있을까?"
      }
    },
    "4-2": {
      id: "4-2",
      stage: 4,
      title: "딱지접기",
      valueQuestion: "좋은 딱지를 만들려면 무엇이 중요할까?",
      allowedKnowledge: [
        "딱지는 종이를 순서에 따라 접어 만든다",
        "접는 방법에 따라 모양과 단단함이 달라진다",
        "딱지의 크기와 무게도 놀이에 영향을 줄 수 있다"
      ],
      concepts: ["만드는 방법과 결과", "단단함", "크기와 무게", "좋은 딱지의 조건"],
      choicePool: [
        { label: "접는 방법", value: "folding" },
        { label: "단단함", value: "firmness" },
        { label: "크기", value: "size" },
        { label: "무게", value: "weight" },
        { label: "모양", value: "shape" }
      ],
      thinkingGoals: [
        "좋은 딱지에 중요하다고 생각한 점을 고르기",
        "접는 방법·크기·무게가 결과에 어떤 영향을 주는지 비교하기",
        "가장 무겁거나 큰 딱지가 항상 좋은지 반례를 생각해 보기"
      ],
      followUpExamples: {
        recall: "딱지를 만들면서 가장 신경 쓴 건 뭐였어?",
        clarify: "그 점이 어떻게 달라졌어?",
        reason: "왜 그것이 중요하다고 생각해?",
        compare: "가장 무거운 딱지가 항상 가장 좋은 딱지일까?"
      }
    },
    "4-3": {
      id: "4-3",
      stage: 4,
      title: "우리민요 얼쑤!",
      valueQuestion: "두 아리랑 중 더 마음에 드는 것은 무엇이고 왜 그럴까?",
      allowedKnowledge: [
        "경기아리랑과 진도아리랑은 느낌과 장단이 다르다",
        "장단에 따라 노래의 느낌이 달라질 수 있다",
        "민요는 사람들이 함께 부르며 이어온 노래이다"
      ],
      concepts: ["장단", "노래의 느낌", "지역에 따른 차이", "민요의 다양성"],
      choicePool: [
        { label: "경기아리랑", value: "gyeonggi" },
        { label: "진도아리랑", value: "jindo" },
        { label: "둘 다", value: "both" },
        { label: "아직 잘 모르겠어", value: "unsure" }
      ],
      thinkingGoals: [
        "두 아리랑 중 더 마음에 드는 것을 고르기",
        "빠르기·장단·느낌이 어떻게 다른지 비교하기",
        "그 느낌이 마음에 든 까닭을 자신의 말로 설명하기"
      ],
      followUpExamples: {
        recall: "더 빠르게 느껴진 것과 더 느리게 느껴진 것 중 뭐가 기억나?",
        clarify: "어떤 느낌이 가장 마음에 들었어?",
        reason: "왜 그 아리랑이 더 마음에 들었어?",
        compare: "두 아리랑의 장단이나 느낌은 어떻게 달랐어?"
      }
    },
    "4-4": {
      id: "4-4",
      stage: 4,
      title: "탈춤놀이",
      valueQuestion: "내가 탈춤을 만든다면 어떤 느낌의 동작을 넣고 싶어?",
      allowedKnowledge: [
        "탈에는 여러 표정과 모양이 있다",
        "탈춤에서는 몸을 크게 움직이는 동작이 사용된다",
        "탈과 동작을 이용해 느낌을 표현할 수 있다"
      ],
      concepts: ["몸짓과 표현", "탈과 동작", "느낌 전달", "나만의 표현"],
      choicePool: [
        { label: "신나는 동작", value: "exciting" },
        { label: "웃긴 동작", value: "funny" },
        { label: "힘찬 동작", value: "powerful" },
        { label: "천천히 움직이는 동작", value: "slow" },
        { label: "내가 만든 동작", value: "custom" }
      ],
      thinkingGoals: [
        "넣고 싶은 동작의 느낌을 구체적으로 말하기",
        "고른 탈의 표정과 어떤 몸짓이 어울리는지 연결하기",
        "말하지 않고 몸짓만으로 느낌을 전하는 방법을 창작해 보기"
      ],
      followUpExamples: {
        recall: "오늘 해본 동작 중 가장 기억나는 건 뭐야?",
        clarify: "그 동작은 어떤 느낌이야?",
        reason: "왜 그 동작이 탈과 잘 어울린다고 생각해?",
        transfer: "말하지 않고 몸짓만으로도 느낌을 전할 수 있을까?"
      }
    }
  };

  Object.keys(thinkingFriendActivities).forEach((id) => {
    const pack = thinkingFriendActivities[id];
    pack.activityKey = KEY_BY_ID[id];
    pack.route = ROUTE_BY_KEY[pack.activityKey];
  });

  const THINKING_STEPS = {
    "1-1": ["observe", "remember", "meaning"],
    "1-2": ["feature", "liked", "fit"],
    "1-3": ["together", "feel", "reason"],
    "1-4": ["choose", "reason", "show"],
    "2-1": ["feature", "wonder", "boast"],
    "2-2": ["feature", "good", "today"],
    "2-3": ["pattern", "liked", "use"],
    "3-1": ["look", "reason", "wear"],
    "3-2": ["food", "feature", "introduce"],
    "3-3": ["custom", "reason", "continue"],
    "4-1": ["play", "luck-or-thought", "evidence"],
    "4-2": ["make", "important", "condition"],
    "4-3": ["compare", "difference", "feel"],
    "4-4": ["observe", "move", "create"]
  };
  Object.keys(thinkingFriendActivities).forEach((id) => {
    thinkingFriendActivities[id].thinkingSteps = THINKING_STEPS[id] || ["feature", "reason", "value"];
  });

  const ACTIVITY_EXPERIENCE = {
    "1-1": "학생은 태극기를 직접 세우고 게양하며, 가운데 태극과 네 모서리 무늬, 색을 눈으로 관찰했다.",
    "1-2": "학생은 무궁화를 피우며 꽃의 모양, 색깔, 오래 피고 또 피는 모습을 직접 보았다.",
    "1-3": "학생은 애국가를 듣고 따라 부르며, 혼자 부를 때와 함께 부를 때의 느낌을 경험했다.",
    "1-4": "학생은 우리나라 화폐 속 인물과 그림을 살펴본 뒤, 새로운 돈에 무엇을 넣을지 생각해 보았다.",
    "2-1": "학생은 자음과 모음 조각을 맞춰 한글 글자를 직접 만들어 보았다.",
    "2-2": "학생은 한옥을 살펴보고 마루·온돌·창호지 등을 탐색하며 오늘날 집과 비교해 보았다.",
    "2-3": "학생은 우리나라 문양을 관찰하고 색칠하며, 그 문양을 어디에 쓰고 싶은지 생각해 보았다.",
    "3-1": "학생은 한복의 색과 모양을 비교하고, 입고 싶은 모습을 골라 보았다.",
    "3-2": "학생은 우리나라 음식을 살펴보고 재료와 맛, 색을 관찰했다.",
    "3-3": "학생은 설날과 추석에 하는 일을 살펴보고, 자신의 명절 경험을 떠올려 보았다.",
    "4-1": "학생은 윷을 던지고 말을 움직이며 윷놀이를 직접 해 보았다.",
    "4-2": "학생은 종이를 접어 딱지를 직접 만들고 놀아 보았다.",
    "4-3": "학생은 경기아리랑과 진도아리랑을 실제로 듣고, 장단과 느낌의 차이를 비교했다.",
    "4-4": "학생은 탈의 표정을 보고 몸동작을 직접 움직여 보며 탈춤을 경험했다."
  };
  Object.keys(thinkingFriendActivities).forEach((id) => {
    thinkingFriendActivities[id].activityExperience = ACTIVITY_EXPERIENCE[id] || "";
  });

  const ID_BY_KEY = Object.keys(KEY_BY_ID).reduce((map, id) => {
    map[KEY_BY_ID[id]] = id;
    return map;
  }, {});
  const ID_BY_ROUTE = Object.keys(ROUTE_BY_KEY).reduce((map, key) => {
    map[ROUTE_BY_KEY[key]] = ID_BY_KEY[key];
    return map;
  }, {});

  const ThinkingFriendActivitiesAPI = {
    packs: thinkingFriendActivities,
    keyById: KEY_BY_ID,
    idByKey: ID_BY_KEY,
    idByRoute: ID_BY_ROUTE,
    routeByKey: ROUTE_BY_KEY,
    get(idOrKeyOrRoute) {
      const raw = String(idOrKeyOrRoute || "");
      if (thinkingFriendActivities[raw]) return thinkingFriendActivities[raw];
      const id = ID_BY_KEY[raw] || ID_BY_ROUTE[raw.replace(/_hoist$/, "")] || "";
      return thinkingFriendActivities[id] || null;
    }
  };

  if (typeof window !== "undefined") window.ThinkingFriendActivities = ThinkingFriendActivitiesAPI;
  if (typeof module !== "undefined" && module.exports) module.exports = ThinkingFriendActivitiesAPI;
})();
