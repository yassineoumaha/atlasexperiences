// One-off generator for public/og-image.png. Run: node scripts/make-og.cjs
// Composites the real Imourig star mark (src/app/icon.png) onto the dark card.
const sharp = require("sharp");
const { join } = require("path");

const C = { amber: "#F59E0B", amberL: "#FBBF24", dark: "#1c1917", brown: "#451a03" };

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.dark}"/>
      <stop offset="100%" stop-color="${C.brown}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0"   width="1200" height="12" fill="${C.amber}"/>
  <rect x="0" y="618" width="1200" height="12" fill="${C.amber}"/>
  <text x="300" y="262" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="900" fill="${C.amber}">Imourig</text>
  <text x="302" y="318" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="${C.amberL}" letter-spacing="6">MOROCCAN EXPERIENCES</text>
  <text x="150" y="440" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="400" fill="#d6d3d1">Authentic Morocco, direct from locals.</text>
  <text x="150" y="508" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="${C.amberL}">Book directly with verified local guides &#183; no middleman</text>
</svg>`;

(async () => {
  const out = join(__dirname, "..", "public", "og-image.png");
  const mark = await sharp(join(__dirname, "..", "src", "app", "icon.png"))
    .resize(190, 190, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: mark, left: 100, top: 150 }])
    .png()
    .toFile(out);
  console.log("wrote", out);
})();
