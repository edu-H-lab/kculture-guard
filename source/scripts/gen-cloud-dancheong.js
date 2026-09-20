const fs = require("fs");

const FILL = "#f0ebe3";
const STROKE = "#000000";
const LEFT = 48;
const RIGHT = 452;
const WIDTH = RIGHT - LEFT;

function scallop(cx, yTop, yBot, halfW, zoneId) {
  const x0 = Math.max(LEFT, cx - halfW);
  const x1 = Math.min(RIGHT, cx + halfW);
  const hw = (x1 - x0) / 2;
  const mid = (x0 + x1) / 2;
  const yArc = yTop;
  const d = [
    `M ${x0} ${yBot}`,
    `L ${x0} ${yArc + hw * 0.12}`,
    `Q ${x0} ${yArc} ${mid} ${yArc}`,
    `Q ${x1} ${yArc} ${x1} ${yArc + hw * 0.12}`,
    `L ${x1} ${yBot}`,
    "Z"
  ].join(" ");
  return `  <path class="dc-zone" data-zone="${zoneId}" d="${d}" fill="${FILL}" stroke="${STROKE}" stroke-width="2.5" stroke-linejoin="round"/>\n`;
}

function cloudTier({ yTop, yBot, bumps, halfW, shift = 0, prefix }) {
  let out = "";
  const step = WIDTH / bumps;
  for (let i = 0; i < bumps; i++) {
    const cx = LEFT + step * (i + 0.5) + shift;
    out += scallop(cx, yTop, yBot, halfW, `${prefix}-${i}`);
  }
  return out;
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500" aria-label="구름 단청 문양">
  <rect width="500" height="500" fill="#faf6ef"/>
  <rect x="16" y="16" width="468" height="468" fill="none" stroke="${STROKE}" stroke-width="5"/>
  <rect x="28" y="28" width="444" height="444" fill="none" stroke="${STROKE}" stroke-width="2"/>

  <rect class="dc-zone" data-zone="sky" x="${LEFT}" y="40" width="${WIDTH}" height="88" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>
`;

// 둥근 호가 겹쳐 쌓인 구름 4층 (위→아래)
svg += cloudTier({ yTop: 112, yBot: 162, bumps: 3, halfW: 66, prefix: "cloud-4" });
svg += cloudTier({ yTop: 158, yBot: 232, bumps: 4, halfW: 56, shift: -22, prefix: "cloud-3" });
svg += cloudTier({ yTop: 226, yBot: 310, bumps: 5, halfW: 46, prefix: "cloud-2" });
svg += cloudTier({ yTop: 304, yBot: 392, bumps: 6, halfW: 38, shift: -14, prefix: "cloud-1" });

svg += `  <rect class="dc-zone" data-zone="ground" x="${LEFT}" y="392" width="${WIDTH}" height="52" fill="${FILL}" stroke="${STROKE}" stroke-width="2"/>
`;

[[88, 218], [412, 218]].forEach(([cx, y], side) => {
  svg += scallop(cx, y - 30, y + 48, 32, `side-${side}-0`);
  svg += scallop(cx, y + 16, y + 82, 26, `side-${side}-1`);
});

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
