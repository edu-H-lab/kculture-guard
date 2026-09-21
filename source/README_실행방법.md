# 우리 문화 수호대 — 실행 방법

대상: 초등학교 1학년 / 웹애플리케이션 (시작 파일: `program/index.html`)

## 제출 폴더 구조

```
document/   연구보고서(hwp·pdf), 주요 화면 이미지 (우리문화수호대-번호.png, 1300×1000)
media/      image · movie · sound : 프로그램에서 쓰는 그림·영상·소리 (원본 해상도)
            멀티미디어_교육자료_목록.xlsx : 자료 목록과 출처
program/    실행용 웹앱 (개발한 폴더 구조 그대로). 시작 파일 index.html
  1_실행하기.bat              AI 없이 바로 실행 (localhost:8756)
  2_AI포함_실행하기.bat        AI 포함 실행 (localhost:8780) — 권장
  AI_실행_안내.txt            AI 포함 실행 설정 방법 (자세히)
source/     program 과 겹치지 않는 개발 소스
  server/   생각친구·교사용 AI 분석 서버 (Node.js, node_modules 포함)
  scripts/  로컬 실행 서버(dev-server.ps1), 단청 문양 생성 스크립트
  docs/     Firebase 설정, 생각친구 프롬프트, 인트로 제작 메모
  firestore.rules      Firebase 보안 규칙
  thinkfriend_eval.json 생각친구 응답 평가 자료
  wrangler.toml, _redirects  웹 배포 설정 (Cloudflare Pages, program 폴더를 사이트 루트로)
```

## 실행 방법 (둘 중 하나를 고르세요)

### 방법 A. AI 포함 실행 (권장) — `program/2_AI포함_실행하기.bat`

생각친구가 학생 답변에 맞춰 AI로 대화하고, 교사용 AI 분석 버튼까지 모두 사용할 수 있는 방법입니다.

**최초 1회만 설정하면 이후에는 bat 파일을 두 번 누르기만 하면 됩니다.**

1. [Node.js](https://nodejs.org) (LTS 버전) 설치 — 이미 설치되어 있다면 건너뜁니다.
2. [Gemini API 키 발급](https://aistudio.google.com/apikey) (구글 계정으로 무료 발급)
3. `source/server/.env.example` 파일을 같은 폴더에 복사해 파일 이름을 `.env` 로 바꿉니다.
4. `.env` 파일을 메모장으로 열어 아래 두 줄을 채웁니다.
   ```
   THINKING_FRIEND_PROVIDER=gemini
   GEMINI_API_KEY=발급받은_키_붙여넣기
   ```
5. `program/2_AI포함_실행하기.bat` 을 두 번 누릅니다.
   → 잠시 뒤 브라우저에서 **http://localhost:8780** 이 자동으로 열립니다.
   → 실행 중인 검은 창을 닫으면 프로그램이 멈춥니다.

npm install 은 필요 없습니다 (`source/server/node_modules` 에 이미 포함되어 있습니다).
자세한 설정 방법과 자주 묻는 질문은 `program/AI_실행_안내.txt` 를 참고하세요.

API 키를 설정하지 않고 이 bat 파일을 실행해도 프로그램은 열립니다. 다만 그 경우
생각친구는 정해진 질문·정리 문장으로만 동작하고, 교사용 AI 분석 버튼은 비활성 상태입니다.

### 방법 B. AI 없이 바로 실행 — `program/1_실행하기.bat`

설정 없이 즉시 실행됩니다 (**http://localhost:8756**). 마이크(애국가 부르기)·카메라도 정상 동작합니다.
생각친구는 정해진 질문과 정리 문장으로 동작하고, 교사용 AI 분석 버튼은 쓸 수 없습니다.

(`program/index.html` 을 파일로 직접 열 수도 있지만, 그러면 브라우저가 마이크를 막을 수 있어
1_실행하기.bat 사용을 권장합니다.)

## 심사용 입장

첫 화면 → 「심사용 입장」 → 교사 화면 또는 학생 1~5번으로 바로 들어갈 수 있습니다.
(심사용 가상 학급에는 가상 학생 15명의 활동 기록이 미리 들어 있습니다.)

## 개인정보 및 보안

- 학생 이름은 AI로 보내지 않습니다 (s1, s2 … 로만 구분).
- 개발자의 Gemini API 키가 든 `.env` 파일은 보안을 위해 제출하지 않았습니다.
  AI 기능을 사용해 보려면 위 [방법 A]의 순서대로 심사위원 본인의 무료 키를 발급해 `.env` 에 입력해 주세요.

## 온라인 배포 (GitHub + Vercel)

웹앱 그림·영상은 Vercel CDN으로, 생각친구·교사용 AI는 `/api` 함수로 올라갑니다.

1. GitHub 저장소에 이 폴더를 푸시합니다.
2. [Vercel](https://vercel.com/new)에서 그 저장소를 Import 합니다.
3. Project Settings → Environment Variables 에 아래를 넣습니다.
   ```
   THINKING_FRIEND_PROVIDER=gemini
   GEMINI_API_KEY=발급받은_키
   GEMINI_MODEL=gemini-2.0-flash
   ```
4. 배포 주소는 `https://(프로젝트).vercel.app/app.html` 입니다.
   `program/index.html` 의 `ONLINE_URL` 을 이 주소로 바꿔 두면 USB에서 실행 버튼이 온라인으로 연결됩니다.
