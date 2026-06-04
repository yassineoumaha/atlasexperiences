// Diagnostic v2: inspect operators with only real columns + compare what the
// admin client vs anon client see. Read-only.
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
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

(async () => {
  console.log("=== OPERATORS via SERVICE ROLE (select *) ===");
  const { data: ops, error } = await admin.from("operators").select("*").order("created_at", { ascending: false });
  if (error) console.log("ERROR:", error.message);
  console.log(`count: ${ops?.length ?? 0}`);
  if (ops?.[0]) console.log("columns:", Object.keys(ops[0]).join(", "));
  for (const o of ops || []) {
    console.log(`  ${o.business_name} | verified=${o.verified} status=${o.verification_status} id=${o.id}`);
  }

  console.log("\n=== OPERATORS via ANON (what public/RLS sees) ===");
  const { data: aops, error: aerr } = await anon.from("operators").select("id, business_name, verified");
  if (aerr) console.log("ERROR:", aerr.message);
  console.log(`count: ${aops?.length ?? 0}`);
  for (const o of aops || []) console.log(`  ${o.business_name} verified=${o.verified}`);

  console.log("\n=== EXPERIENCES via ANON (published+approved, what listing sees) ===");
  const { data: aexps, error: aeerr } = await anon
    .from("experiences").select("id, title").eq("published", true).eq("approved", true);
  if (aeerr) console.log("ERROR:", aeerr.message);
  console.log(`count: ${aexps?.length ?? 0}`);
})().catch((e) => { console.error(e); process.exit(1); });
