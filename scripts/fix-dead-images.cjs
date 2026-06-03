// One-off: replace two dead Pexels photos (390051, 7438979) that were seeded
// into operators.cover_url and experiences.images, causing /_next/image 404s.
// Surgical — touches only rows that contain the dead IDs. Safe to re-run.
//
// Usage: node scripts/fix-dead-images.cjs

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const file = path.join(__dirname, "..", ".env.local");
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}
const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const admin = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// dead id -> working replacement id (same theme)
const REPLACE = {
  "390051": "1654489",   // surf
  "7438979": "4198015",  // food / cooking
};

// Swap the photo id inside any Pexels URL, preserving its query params.
function fixUrl(u) {
  if (typeof u !== "string") return u;
  for (const [dead, live] of Object.entries(REPLACE)) {
    if (u.includes(`/photos/${dead}/`)) {
      return u
        .replace(`/photos/${dead}/`, `/photos/${live}/`)
        .replace(`pexels-photo-${dead}.`, `pexels-photo-${live}.`);
    }
  }
  return u;
}

(async () => {
  let opFixed = 0;
  let expFixed = 0;

  // ── operators.cover_url + avatar_url ──────────────────────────────
  const { data: ops, error: opErr } = await admin
    .from("operators")
    .select("id, cover_url, avatar_url");
  if (opErr) throw opErr;
  for (const op of ops || []) {
    const cover = fixUrl(op.cover_url);
    const avatar = fixUrl(op.avatar_url);
    if (cover !== op.cover_url || avatar !== op.avatar_url) {
      const { error } = await admin
        .from("operators")
        .update({ cover_url: cover, avatar_url: avatar })
        .eq("id", op.id);
      if (error) throw error;
      opFixed++;
    }
  }

  // ── experiences.images (text[] / jsonb array) ─────────────────────
  const { data: exps, error: expErr } = await admin
    .from("experiences")
    .select("id, images");
  if (expErr) throw expErr;
  for (const exp of exps || []) {
    if (!Array.isArray(exp.images)) continue;
    const next = exp.images.map(fixUrl);
    const changed = next.some((v, i) => v !== exp.images[i]);
    if (changed) {
      const { error } = await admin
        .from("experiences")
        .update({ images: next })
        .eq("id", exp.id);
      if (error) throw error;
      expFixed++;
    }
  }

  console.log(`Done. Fixed ${opFixed} operator row(s) and ${expFixed} experience row(s).`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
