/**
 * program 폴더(웹앱) 위치 찾기
 * - 개발할 때: 프로젝트/server  → 프로젝트/program
 * - 제출 폴더:  제출/source/server → 제출/program
 * 환경 변수 PROGRAM_DIR 로 직접 정할 수도 있다.
 */
const path = require("path");
const fs = require("fs");

const candidates = [
  process.env.PROGRAM_DIR,
  path.join(__dirname, "../../program"),
  path.join(__dirname, "../../../program")
].filter(Boolean);

const found = candidates.find((dir) => {
  try { return fs.existsSync(path.join(dir, "index.html")); } catch (_) { return false; }
});

module.exports = found || candidates[candidates.length - 2];
