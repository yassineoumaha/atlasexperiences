// One-off generator for public/og-image.png. Run: node scripts/make-og.cjs
const sharp = require("sharp");
const { writeFileSync } = require("fs");
const { join } = require("path");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="12" fill="url(#amber)"/>
  <rect x="0" y="618" width="1200" height="12" fill="url(#amber)"/>
  <text x="100" y="250" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="900" fill="#ffffff">Atlas <tspan fill="#f59e0b">Experiences</tspan></text>
  <text x="100" y="335" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="400" fill="#d6d3d1">Authentic Morocco, direct from locals.</text>
  <text x="100" y="430" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#fbbf24">39 destinations &#183; verified local operators &#183; no middleman</text>
</svg>`;

(async () => {
  const out = join(__dirname, "..", "public", "og-image.png");
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(out, png);
  console.log("wrote", out, png.length, "bytes");
})();
