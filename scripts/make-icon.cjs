// Generates src/app/icon.png — Imourig zellij star app icon.
const sharp = require("sharp");
const { writeFileSync } = require("fs");
const { join } = require("path");
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <g transform="translate(256,256)">
    <path d="M0,-150 L44,-66 L150,-66 L74,8 L110,150 L0,72 L-110,150 L-74,8 L-150,-66 L-44,-66 Z" fill="#fbbf24" fill-opacity="0.25"/>
    <path d="M0,-110 L96,-14 L96,118 L0,170 L-96,118 L-96,-14 Z" fill="none" stroke="#fbbf24" stroke-width="18"/>
    <circle cx="0" cy="14" r="30" fill="#fbbf24"/>
  </g>
</svg>`;
(async () => {
  const out = join(__dirname, "..", "src", "app", "icon.png");
  const png = await sharp(Buffer.from(svg)).resize(512,512).png().toBuffer();
  writeFileSync(out, png);
  console.log("wrote", out, png.length, "bytes");
})();
