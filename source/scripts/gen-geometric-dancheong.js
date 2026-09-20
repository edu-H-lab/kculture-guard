const fs = require("fs");

const FILL = "#f0ebe3";
const BG = "#faf6ef";
const STROKE = "#000000";
const L = 46;
const STEP = 136;
const R = L + STEP * 3;
const M = L + STEP;
const M2 = L + STEP * 2;
const CX = L + STEP * 1.5;
const CY = L + STEP * 1.5;

function rect(x, y, w, h, zone) {
  return `  <rect class="dc-zone" data-zone="${zone}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${FILL}" stroke="${STROKE}" stroke-width="2.5"/>\n`;
}

function tri(points, zone) {
  return `  <polygon class="dc-zone" data-zone="${zone}" points="${points}" fill="${FILL}" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round"/>\n`;
}

function cornerCell(x, y, size, prefix) {
  const x2 = x + size;
  const y2 = y + size;
  return [
    tri(`${x},${y} ${x2},${y} ${x2},${y2}`, `${prefix}-a`),
    tri(`${x},${y} ${x2},${y2} ${x},${y2}`, `${prefix}-b`)
  ].join("");
}

function edgeHStripes(x, y, w, h, prefix) {
  const n = 3;
  const sh = h / n;
  let out = "";
  for (let i = 0; i < n; i++) {
    out += rect(x, y + i * sh, w, sh - 1, `${prefix}-${i}`);
  }
  return out;
}

function edgeVStripes(x, y, w, h, prefix) {
  const n = 3;
  const sw = w / n;
  let out = "";
  for (let i = 0; i < n; i++) {
    out += rect(x + i * sw, y, sw - 1, h, `${prefix}-${i}`);
  }
  return out;
}

function centerCell() {
  const x = M;
  const y = M;
  const x2 = M2;
  const y2 = M2;
  const cx = CX;
  const cy = CY;
  return [
    tri(`${x},${y} ${x2},${y} ${cx},${cy}`, "center-n"),
    tri(`${x2},${y} ${x2},${y2} ${cx},${cy}`, "center-e"),
    tri(`${x2},${y2} ${x},${y2} ${cx},${cy}`, "center-s"),
    tri(`${x},${y2} ${x},${y} ${cx},${cy}`, "center-w")
  ].join("");
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500" aria-label="기하 단청 문양">
  <rect width="500" height="500" fill="${BG}"/>
  <rect x="18" y="18" width="464" height="464" fill="none" stroke="${STROKE}" stroke-width="4"/>
  <rect x="30" y="30" width="440" height="440" fill="none" stroke="${STROKE}" stroke-width="2"/>
`;

// 모서리 — 대각선(사선) 2분할
svg += cornerCell(L, L, STEP, "corner-tl");
svg += cornerCell(M2, L, STEP, "corner-tr");
svg += cornerCell(L, M2, STEP, "corner-bl");
svg += cornerCell(M2, M2, STEP, "corner-br");

// 상·하 가로 줄무늬 / 좌·우 세로 줄무늬
svg += edgeHStripes(M, L, STEP, STEP, "edge-top");
svg += edgeHStripes(M, M2, STEP, STEP, "edge-bottom");
svg += edgeVStripes(L, M, STEP, STEP, "edge-left");
svg += edgeVStripes(M2, M, STEP, STEP, "edge-right");

// 중앙 — 십자 + 사선 삼각형
svg += centerCell();

// 격자·대각 장식선 (클릭 불가)
const deco = [];
for (let i = 0; i <= 3; i++) {
  const p = L + i * STEP;
  deco.push(`<line x1="${p}" y1="${L}" x2="${p}" y2="${R}" stroke="${STROKE}" stroke-width="1.5"/>`);
  deco.push(`<line x1="${L}" y1="${p}" x2="${R}" y2="${p}" stroke="${STROKE}" stroke-width="1.5"/>`);
}
deco.push(`<line x1="${M}" y1="${M}" x2="${M2}" y2="${M2}" stroke="${STROKE}" stroke-width="1.5"/>`);
deco.push(`<line x1="${M2}" y1="${M}" x2="${M}" y2="${M2}" stroke="${STROKE}" stroke-width="1.5"/>`);
svg += `  <g fill="none" pointer-events="none">${deco.join("")}</g>\n`;
svg += "</svg>\n";

const outPath = "assets/images/dancheong/dancheong_round_pattern_absolute_500.svg";
fs.writeFileSync(outPath, svg);

const coloring = fs.readFileSync("assets/images/dancheong/dancheong_coloring_absolute_500.svg", "utf8").trim();
const round = fs.readFileSync(outPath, "utf8").trim();
fs.writeFileSync(
  "assets/js/dancheong-patterns.js",
  `window.DANCHEONG_SVG_INLINE = {\n  coloring: ${JSON.stringify(coloring)},\n  round: ${JSON.stringify(round)}\n};\n`
);

console.log("zones:", (svg.match(/data-zone="/g) || []).length);
