# Firebase 설정 (한옥마을 + 수호대 학급/저장)

이 프로젝트는 Firebase Firestore를 두 가지에 사용합니다.

- **한옥마을** 실시간 공유 (`hanok_houses`)
- **수호대** 학급 등록·학생 진행 저장·온라인 접속·온라인 윷놀이 (`kculture_classrooms`, `kculture_presence`, `kculture_yut_rooms`)

설정하지 않아도 게임은 정상 작동합니다. (각각 이 기기 저장 모드로 동작)

## 1. Firebase 프로젝트 만들기

1. https://console.firebase.google.com 접속 후 구글 계정으로 로그인
2. "프로젝트 추가" 클릭 → 프로젝트 이름 입력 (예: `kculture-guard`) → 계속
3. Google Analytics는 "사용 안 함"으로 선택해도 무방 → "프로젝트 만들기"

## 2. Firestore 데이터베이스 만들기

1. 왼쪽 메뉴에서 "빌드" → "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 위치는 `asia-northeast3 (서울)` 선택 권장
4. 보안 규칙은 우선 "테스트 모드로 시작"을 선택 (아래 3단계에서 규칙 교체)

## 3. 보안 규칙 설정 (교실용) — **필수**

> `Missing or insufficient permissions` 오류가 나면 **규칙이 게시되지 않았거나**, 예전 테스트 모드 규칙이 만료된 상태입니다.  
> 반드시 아래 규칙을 **전체 교체**한 뒤 **게시** 버튼을 눌러주세요.

Firestore Database → **규칙** 탭에서 아래 내용으로 **전체 교체**하세요.  
(프로젝트 폴더의 `firestore.rules` 파일과 동일합니다.)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function buildClassKey(schoolName, grade, classNumber) {
      return schoolName + '|' + grade + '|' + string(classNumber);
    }

    function isValidAccountId(id) {
      return id is string && id.matches('^\\d{5}$');
    }

    function classroomExists(classKey) {
      return exists(/databases/$(database)/documents/kculture_classrooms/$(classKey));
    }

    function classroomData(classKey) {
      return get(/databases/$(database)/documents/kculture_classrooms/$(classKey)).data;
    }

    function isRegisteredStudent(classKey, accountId) {
      return classroomExists(classKey)
             && ('registeredAccountIds' in classroomData(classKey))
             && accountId in classroomData(classKey).registeredAccountIds;
    }

    function isValidClassroom(classKey) {
      let data = request.resource.data;
      return data.schoolName is string
             && data.schoolName.size() > 0
             && data.schoolName.size() <= 30
             && data.grade is string
             && data.grade.size() >= 1
             && data.grade.size() <= 2
             && data.classNumber is number
             && data.classNumber >= 1
             && data.classNumber <= 99
             && classKey == buildClassKey(data.schoolName, data.grade, data.classNumber)
             && data.students is list
             && data.students.size() <= 50
             && data.registeredAccountIds is map;
    }

    function isValidProgress() {
      let data = request.resource.data;
      return (!('difficulty' in data) || data.difficulty in ['easy', 'normal', 'hard'])
             && (!('score' in data) || (data.score is number && data.score >= 0 && data.score <= 999999))
             && (!('solved' in data) || data.solved is map)
             && (!('completedMissions' in data) || data.completedMissions is map)
             && (!('treasures' in data) || data.treasures is map)
             && (!('rhythmProgress' in data) || data.rhythmProgress is map);
    }

    function isValidPresence(presenceId) {
      let data = request.resource.data;
      return data.classKey is string
             && data.accountId is string
             && isValidAccountId(data.accountId)
             && data.name is string
             && data.name.size() <= 20
             && presenceId == data.classKey + '_' + data.accountId
             && classroomExists(data.classKey)
             && isRegisteredStudent(data.classKey, data.accountId);
    }

    function isValidYutRoom() {
      let data = request.resource.data;
      return data.classKey is string
             && data.hostAccountId is string
             && isValidAccountId(data.hostAccountId)
             && data.players is list
             && data.players.size() <= 3
             && data.status is string
             && data.status in ['waiting', 'token_pick', 'playing', 'closed'];
    }

    match /hanok_houses/{houseId} {
      allow read: if true;
      allow write: if request.resource.data.name is string
                   && request.resource.data.name.size() > 0
                   && request.resource.data.name.size() <= 20
                   && request.resource.data.likes is number
                   && request.resource.data.likes >= 0;
    }

    match /kculture_classrooms/{classKey} {
      allow read: if true;
      allow create, update: if isValidClassroom(classKey);
      allow delete: if false;

      match /progress/{accountId} {
        allow read: if classroomExists(classKey);
        allow create, update: if isValidAccountId(accountId)
                              && isRegisteredStudent(classKey, accountId)
                              && isValidProgress();
        allow delete: if false;
      }
    }

    match /kculture_presence/{presenceId} {
      allow read: if true;
      allow create, update: if isValidPresence(presenceId);
      allow delete: if true;
    }

    match /kculture_yut_rooms/{roomId} {
      allow read: if true;
      allow create, update: if isValidYutRoom();
      allow delete: if false;
    }
  }
}
```

### 규칙 게시 확인

1. Firebase 콘솔 → **Firestore Database** → **규칙** 탭
2. 위 내용 붙여넣기
3. **게시** 클릭 (저장만 하고 게시 안 하면 적용 안 됨)
4. 게시 후 1~2분 기다렸다가 게임 **Ctrl+Shift+R** 새로고침

### 자주 하는 실수

| 증상 | 원인 |
|------|------|
| `Missing or insufficient permissions` | 규칙 미게시, 테스트 모드 만료, 예전 규칙 사용 |
| 접속중은 보이는데 완료 미션·점수·최근 저장이 안 바뀜 | `progress` 읽기 규칙이 문서 ID 조건만 있어 학급 전체 조회가 거부됨 → `classroomExists(classKey)`로 게시 필요 |
| 학생 저장 실패 → 접속도 실패 | 학생이 Firebase에 등록되지 않아 presence 규칙도 거부 |
| Realtime Database 규칙 수정 | **Firestore Database** 규칙을 수정해야 함 |

### 규칙 요약

| 컬렉션 | 읽기 | 쓰기 |
|--------|------|------|
| `hanok_houses` | 모두 | 이름·좋아요 형식 검증 |
| `kculture_classrooms` | 모두 | 학교/학급/학생 명단 형식 검증, 삭제 불가 |
| `kculture_classrooms/.../progress` | 학급이 존재할 때 | **등록된 학생**만, 진행 데이터 형식 검증 |
| `kculture_presence` | 모두 | 등록된 학생만, 문서 ID = `{학급키}_{개인계정번호}` |
| `kculture_yut_rooms` | 모두 | 최대 3명 윷놀이 방 데이터 검증 |

### 교실용 전제

- Firebase Authentication 없이도 교실 활동이 가능하도록 만든 **최소 검증 규칙**입니다.
- 학급코드를 아는 사람은 학급 정보를 읽을 수 있습니다. (학생 로그인에 필요)
- 진행 저장·접속 표시는 `registeredAccountIds`에 등록된 학생만 가능합니다.
- 외부 공개 서비스로 확장할 때는 Firebase Authentication을 추가하는 것을 권장합니다.

## 4. 색인(인덱스) 안내

`kculture_presence`, `kculture_yut_rooms`에서 `classKey`로 조회합니다. 처음 실행 시 Firestore 콘솔에
색인 생성 링크가 뜨면 안내에 따라 **단일 필드 색인**을 만들어 주세요.

- 컬렉션: `kculture_presence`
- 필드: `classKey` (오름차순)
- 컬렉션: `kculture_yut_rooms`
- 필드: `classKey` (오름차순)

## 5. 웹 앱 등록 & 설정값 받기

1. 프로젝트 개요 옆의 톱니바퀴(프로젝트 설정) → "일반" 탭
2. 하단 "내 앱" 섹션에서 웹 아이콘(</>) 클릭 → 앱 닉네임 입력 → 앱 등록
3. "Firebase SDK 추가" 화면에 나오는 `firebaseConfig` 객체를 복사

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

## 6. 프로젝트에 적용하기

`assets/js/firebase-config.js` 파일을 열어 값을 채워 넣으세요.

```js
window.HANOK_FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

저장 후 새로고침하면:

- 한옥마을: **🌐 친구들과 실시간 공유중** 배지
- 수호대 학급 계정: **☁️ 클라우드 저장**, **👥 우리 반 접속 N명** 배지

(빈 값이면 각각 이 기기 저장 모드로 동작합니다.)

## 7. 동작 확인 체크리스트

1. 교사용 로그인 → 학급 등록 → 학급코드·학생 개인계정번호 확인
2. Firestore 콘솔에서 `kculture_classrooms/{학급코드}` 문서 생성 확인
3. 학생 **학급 계정** 로그인 → 미션 진행 → `progress` 하위 문서 저장 확인
4. 다른 기기에서 같은 학급코드로 로그인 → 진행 불러오기 확인
5. 학생 **자유 입장** → 저장 없이 플레이 (Firestore에 progress 없음)

## 참고

- 별도 서버 없이 정적 HTML/JS만으로 동작합니다.
- Firebase 오류 시 게임은 멈추지 않고 이 기기 저장 모드로 전환됩니다.
- 자유 입장(체험 모드) 학생은 Firestore에 아무것도 저장하지 않습니다.
