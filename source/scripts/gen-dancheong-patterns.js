const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PATTERNS = {
  coloring: "assets/images/dancheong/dancheong_coloring_absolute_500.svg",
  round: "assets/images/dancheong/dancheong_round_pattern_absolute_500.svg"
};

const inline = {};
for (const [id, rel] of Object.entries(PATTERNS)) {
  inline[id] = fs.readFileSync(path.join(ROOT, rel), "utf8").trim();
}

const out = `window.DANCHEONG_SVG_INLINE = ${JSON.stringify(inline, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, "assets/js/dancheong-patterns.js"), out);
console.log("patterns:", Object.keys(inline).join(", "));
