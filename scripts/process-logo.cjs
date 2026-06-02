// Processes the AI-generated logo into the full Imourig brand set.
// Strips the white background via EDGE FLOOD-FILL (so white *inside* the
// star mark is preserved), then emits the wide logo, icon, apple-icon, favicon.
// Run from project root:  node scripts/process-logo.cjs
const sharp = require("sharp");
const { writeFileSync } = require("fs");
const { join } = require("path");

const SRC = "public/images/imourig-source.png.png";
const WHITE_THRESHOLD = 238; // pixels with all channels >= this are "background-white"

async function loadRGBA(path) {
  const img = sharp(path).ensureAlpha();
  const { width, height } = await img.metadata();
  const data = await img.raw().toBuffer(); // RGBA
  return { data, width, height };
}

// Flood-fill transparency inward from every border pixel that is near-white.
function stripWhiteByEdgeFlood({ data, width, height }) {
  const isWhite = (i) =>
    data[i] >= WHITE_THRESHOLD && data[i + 1] >= WHITE_THRESHOLD && data[i + 2] >= WHITE_THRESHOLD;

  const visited = new Uint8Array(width * height);
  const stack = [];
  const pushIfEdge = (x, y) => stack.push([x, y]);
  for (let x = 0; x < width; x++) { pushIfEdge(x, 0); pushIfEdge(x, height - 1); }
  for (let y = 0; y < height; y++) { pushIfEdge(0, y); pushIfEdge(width - 1, y); }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const p = y * width + x;
    if (visited[p]) continue;
    const i = p * 4;
    if (!isWhite(i)) continue;     // boundary of the background region
    visited[p] = 1;
    data[i + 3] = 0;               // make transparent
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return { data, width, height };
}

async function toPng(rgba) {
  return sharp(rgba.data, { raw: { width: rgba.width, height: rgba.height, channels: 4 } }).png();
}

// Find the bounding box of non-transparent pixels (to crop tightly).
function bbox({ data, width, height }) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

(async () => {
  const rgba = stripWhiteByEdgeFlood(await loadRGBA(SRC));
  const transparent = await (await toPng(rgba)).toBuffer();

  // 1. Wide logo — trimmed to content, transparent
  const box = bbox(rgba);
  const wide = await sharp(transparent)
    .extract({ left: box.left, top: box.top, width: box.width, height: box.height })
    .resize({ height: 320 })            // crisp at 2x of an 80px display
    .png()
    .toBuffer();
  writeFileSync(join(__dirname, "..", "public", "logo.png"), wide);

  // 2. Icon (star mark only) — the mark sits in the left square region.
  //    Crop the left square of the original (height-sized square from the left).
  const sq = Math.min(box.height, box.width);
  const iconSrc = await sharp(transparent)
    .extract({ left: box.left, top: box.top, width: sq, height: sq })
    .png()
    .toBuffer();
  await sharp(iconSrc).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(join(__dirname, "..", "src", "app", "icon.png"));

  // 3. Apple icon — star on solid charcoal, rounded, 180
  const appleStar = await sharp(iconSrc).resize(132, 132, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: "#1C1917" } })
    .composite([{ input: appleStar, gravity: "center" }])
    .png().toFile(join(__dirname, "..", "src", "app", "apple-icon.png"));

  // 4. Favicon (32) PNG buffer for the .ico step
  const fav32 = await sharp(iconSrc).resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  writeFileSync(join(__dirname, "..", "public", "favicon-32.png"), fav32);

  const meta = await sharp(wide).metadata();
  console.log("logo.png        ", meta.width + "x" + meta.height, wide.length, "bytes");
  console.log("icon.png        512x512");
  console.log("apple-icon.png  180x180");
  console.log("favicon-32.png  32x32 (for .ico)");
  console.log("content bbox:", box);
})();
