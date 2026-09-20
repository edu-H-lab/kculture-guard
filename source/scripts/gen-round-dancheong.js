const fs = require("fs");
const cx = 250, cy = 250;

function wedge(r1, r2, i) {
  const d2r = (x) => (x * Math.PI) / 180;
  const a1 = d2r(i * 45 - 22.5);
  const a2 = d2r((i + 1) * 45 - 22.5);
  const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  return `M ${p(r1, a1)} L ${p(r2, a1)} A ${r2} ${r2} 0 0 1 ${p(r2, a2)} L ${p(r1, a2)} A ${r1} ${r1} 0 0 0 ${p(r1, a1)} Z`;
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500" aria-label="둥근 단청 문양">
  <rect width="500" height="500" fill="#faf6ef"/>
  <circle cx="250" cy="250" r="236" fill="none" stroke="#000000" stroke-width="6"/>
  <circle cx="250" cy="250" r="218" fill="none" stroke="#000000" stroke-width="2"/>
`;

for (let i = 0; i < 8; i++) {
  svg += `  <path class="dc-zone" data-zone="ring-outer-${i}" d="${wedge(148, 218, i)}" fill="#f0ebe3" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/>\n`;
}
for (let i = 0; i < 8; i++) {
  svg += `  <path class="dc-zone" data-zone="ring-mid-${i}" d="${wedge(88, 142, i)}" fill="#f0ebe3" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/>\n`;
}
svg += `  <rect class="dc-zone" data-zone="inner-square" x="148" y="148" width="204" height="204" fill="#f0ebe3" stroke="#000" stroke-width="3"/>
  <polygon class="dc-zone" data-zone="inner-diamond" points="250,168 332,250 250,332 168,250" fill="#f0ebe3" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
  <circle class="dc-zone" data-zone="center" cx="250" cy="250" r="38" fill="#f0ebe3" stroke="#000" stroke-width="3"/>
  <circle cx="250" cy="250" r="28" fill="none" stroke="#000" stroke-width="2"/>
</svg>
`;

fs.writeFileSync("assets/images/dancheong/dancheong_round_pattern_absolute_500.svg", svg);
console.log("done");
