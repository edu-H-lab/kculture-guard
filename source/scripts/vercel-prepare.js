/**
 * Vercel 빌드: program/ 을 public/ 으로 복사해 CDN에서 웹앱을 제공한다.
 * (Vercel에서 express.static 은 동작하지 않음)
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../..");
const src = path.join(root, "program");
const dest = path.join(root, "public");

if (!fs.existsSync(path.join(src, "index.html"))) {
  throw new Error("program/index.html 을 찾지 못했습니다.");
}
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("copied program -> public");
