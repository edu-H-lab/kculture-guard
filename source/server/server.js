const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// 서버 로그를 logs/server.log 파일에도 남긴다 (문제 확인용)
const fs = require("fs");
try {
  const logDir = path.join(__dirname, "logs");
  fs.mkdirSync(logDir, { recursive: true });
  const logFile = path.join(logDir, "server.log");
  const tee = (orig, level) => (...args) => {
    try {
      const line = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
      fs.appendFileSync(logFile, `[${new Date().toLocaleString("ko-KR")}] ${level} ${line}\n`);
    } catch (_) {}
    orig(...args);
  };
  console.log = tee(console.log.bind(console), "LOG");
  console.warn = tee(console.warn.bind(console), "WARN");
  console.error = tee(console.error.bind(console), "ERR");
} catch (_) {}
const api = require("./api/thinking-friend");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT || 8780);
const STATIC_ROOT = require("./lib/programDir");

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

app.get("/api/thinking-friend/health", api.handleHealth);
app.post("/api/thinking-friend", (req, res, next) => {
  Promise.resolve(api.handleTurn(req, res)).catch(next);
});
app.post("/api/thinking-friend/summary", (req, res, next) => {
  Promise.resolve(api.handleSummary(req, res)).catch(next);
});

// 2차 설계안: 정해진 3단계 질문 (thinkfriend_questions_v2.docx)
app.post("/api/thinking-friend/guided/react", (req, res, next) => {
  Promise.resolve(api.handleGuidedReact(req, res)).catch(next);
});
app.post("/api/thinking-friend/guided/summary", (req, res, next) => {
  Promise.resolve(api.handleGuidedSummary(req, res)).catch(next);
});

// 교사용 분석 3단계: AI 분석
app.post("/api/teacher-analysis", (req, res, next) => {
  Promise.resolve(api.handleTeacherAnalysis(req, res)).catch(next);
});

app.use(express.static(STATIC_ROOT));

app.use((err, _req, res, _next) => {
  console.warn("[ThinkFriend] api error:", err && err.message);
  const mock = require("./lib/ai/mockProvider");
  res.json(mock.easyFallback({}));
});

app.listen(PORT, "0.0.0.0", () => {
  const provider = process.env.THINKING_FRIEND_PROVIDER || "mock";
  console.log(`생각친구 서버 http://localhost:${PORT}  (provider=${provider})`);
});
