// Seed demo operators + experiences so the marketplace looks populated for testers.
// Usage: node scripts/seed-demo.cjs
// Reads SUPABASE keys from .env.local. Uses the service-role key (bypasses RLS).
//
// Idempotent-ish: demo operators use fixed emails; if they already exist we reuse them.
// To wipe demo data later: node scripts/seed-demo.cjs --clean

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// ── load .env.local ──────────────────────────────────────────────
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

const px = (id, w = 1200, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

// ── demo operators ───────────────────────────────────────────────
const OPERATORS = [
  {
    email: "demo.surf@atlasexperiences.world",
    business_name: "Taghazout Surf Collective",
    slug: "taghazout-surf-collective",
    city: "Taghazout",
    bio: "Local surf school run by Taghazout-born instructors. ISA-certified, small groups, all gear included.",
    whatsapp: "212600000001",
    languages: ["English", "French", "Arabic"],
    years_experience: 9,
    avatar_url: px(1654698, 200, 200),
    cover_url: px(390051, 1200, 400),
  },
  {
    email: "demo.desert@atlasexperiences.world",
    business_name: "Sahara Nomad Tours",
    slug: "sahara-nomad-tours",
    city: "Merzouga",
    bio: "Berber-owned desert outfit. Camel treks, luxury bivouacs, and stargazing in the Erg Chebbi dunes.",
    whatsapp: "212600000002",
    languages: ["English", "French", "Arabic", "Spanish"],
    years_experience: 14,
    avatar_url: px(3889855, 200, 200),
    cover_url: px(1703314, 1200, 400),
  },
  {
    email: "demo.food@atlasexperiences.world",
    business_name: "Marrakech Medina Kitchen",
    slug: "marrakech-medina-kitchen",
    city: "Marrakech",
    bio: "Hands-on Moroccan cooking classes in a restored riad, plus guided souk spice tours.",
    whatsapp: "212600000003",
    languages: ["English", "French"],
    years_experience: 7,
    avatar_url: px(3201921, 200, 200),
    cover_url: px(7438979, 1200, 400),
  },
  {
    email: "demo.culture@atlasexperiences.world",
    business_name: "Fes Heritage Walks",
    slug: "fes-heritage-walks",
    city: "Fes",
    bio: "Licensed cultural guides leading walking tours of the Fes el Bali medina, tanneries and madrasas.",
    whatsapp: "212600000004",
    languages: ["English", "French", "Arabic"],
    years_experience: 11,
    avatar_url: px(2387873, 200, 200),
    cover_url: px(4502973, 1200, 400),
  },
];

// experiences keyed by operator email
const EXPERIENCES = {
  "demo.surf@atlasexperiences.world": [
    {
      title: "Beginner Surf Lesson in Taghazout (2 hours)", category: "surf", city: "Taghazout",
      description: "Catch your first wave with patient local instructors on Taghazout's gentle beach breaks. Soft-top boards and wetsuits included. Max 4 students per coach.",
      price_per_person: 45, duration_hours: 2, max_group_size: 6, featured: true,
      highlights: ["Stand up on your first session", "ISA-certified local coaches", "All gear + photos included"],
      includes: ["Surfboard & wetsuit", "Beach insurance", "Bottled water"],
      excludes: ["Transport to beach", "Lunch"],
      what_to_bring: ["Swimwear", "Towel", "Sunscreen"],
      images: [px(390051), px(1654698), px(1430677)],
    },
    {
      title: "Full-Day Surf Safari — 3 Secret Spots", category: "surf", city: "Taghazout",
      description: "Chase the best swell of the day across three breaks along the Agadir coast with a 4x4 and a guide who knows where the waves are working.",
      price_per_person: 95, duration_hours: 7, max_group_size: 5, featured: false,
      highlights: ["4x4 spot-hopping", "Lunch in a fishing village", "Intermediate / advanced"],
      includes: ["Board & wetsuit", "4x4 transport", "Lunch"], excludes: ["Tips"],
      what_to_bring: ["Swimwear", "Towel"], images: [px(1430677), px(390051)],
    },
  ],
  "demo.desert@atlasexperiences.world": [
    {
      title: "Overnight Camel Trek & Desert Camp — Erg Chebbi", category: "desert", city: "Merzouga",
      description: "Ride camels into the dunes at golden hour, watch the sunset from the highest crest, then sleep under the stars in a Berber camp with dinner, music and breakfast.",
      price_per_person: 120, duration_hours: 18, max_group_size: 12, featured: true,
      highlights: ["Sunset camel trek", "Private desert bivouac", "Berber drumming + tagine dinner", "Sunrise over the dunes"],
      includes: ["Camel ride", "Camp accommodation", "Dinner & breakfast", "Guide"],
      excludes: ["Drinks", "Sandboard rental"],
      what_to_bring: ["Warm layer for night", "Scarf", "Headlamp"],
      images: [px(1703314), px(3889855), px(3293148)],
    },
    {
      title: "Sunset Quad Bike Adventure in the Dunes", category: "adventure", city: "Merzouga",
      description: "Blast across the desert pistes on a quad bike with a guide, ending at a dune for the Sahara sunset and mint tea.",
      price_per_person: 55, duration_hours: 2, max_group_size: 8, featured: false,
      highlights: ["Quad bike + briefing", "Golden-hour photo stop", "Mint tea"],
      includes: ["Quad & helmet", "Guide", "Tea"], excludes: ["Transport to base"],
      what_to_bring: ["Sunglasses", "Scarf"], images: [px(2128249), px(1703314)],
    },
  ],
  "demo.food@atlasexperiences.world": [
    {
      title: "Moroccan Cooking Class in a Marrakech Riad", category: "food", city: "Marrakech",
      description: "Shop for spices in the souk with your chef, then cook a full Moroccan meal — tagine, salads and mint tea — in a beautiful riad courtyard, and eat what you make.",
      price_per_person: 60, duration_hours: 4, max_group_size: 10, featured: true,
      highlights: ["Guided spice-souk walk", "Cook a 3-course meal", "Recipe booklet to take home"],
      includes: ["All ingredients", "Riad venue", "The meal you cook", "Apron"],
      excludes: ["Hotel pickup"], what_to_bring: ["An appetite"],
      images: [px(7438979), px(5560763), px(4040692)],
    },
    {
      title: "Marrakech Street Food Evening Tour", category: "food", city: "Marrakech",
      description: "Eat your way through Jemaa el-Fnaa and the back-alley stalls locals love — from grilled skewers to msemen and fresh juices — with a guide who knows the vendors.",
      price_per_person: 40, duration_hours: 3, max_group_size: 8, featured: false,
      highlights: ["6+ tastings", "Jemaa el-Fnaa by night", "Vegetarian option"],
      includes: ["All food tastings", "Guide"], excludes: ["Alcohol"],
      what_to_bring: ["Comfortable shoes"], images: [px(4040692), px(7438979)],
    },
  ],
  "demo.culture@atlasexperiences.world": [
    {
      title: "Fes Medina Walking Tour — Tanneries & Madrasas", category: "culture", city: "Fes",
      description: "Get lost (with a guide) in the world's largest car-free medina. Visit the famous Chouara tanneries, the Bou Inania madrasa, and artisan workshops.",
      price_per_person: 35, duration_hours: 4, max_group_size: 12, featured: true,
      highlights: ["Chouara tanneries viewpoint", "Bou Inania madrasa", "Artisan workshops", "Licensed local guide"],
      includes: ["Licensed guide", "Tannery entry"], excludes: ["Lunch", "Purchases"],
      what_to_bring: ["Comfortable shoes", "Water"],
      images: [px(4502973), px(2387873), px(3290068)],
    },
    {
      title: "Chefchaouen Blue City Day Trip from Fes", category: "day-trip", city: "Chefchaouen",
      description: "A scenic drive into the Rif mountains to wander the cobalt-blue lanes of Chefchaouen, with free time to shop, photograph and lunch.",
      price_per_person: 70, duration_hours: 10, max_group_size: 14, featured: false,
      highlights: ["The famous blue medina", "Rif mountain scenery", "Free time + guide"],
      includes: ["Transport", "Guide"], excludes: ["Lunch"],
      what_to_bring: ["Camera", "Walking shoes"], images: [px(3290068), px(4502973)],
    },
  ],
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 70);
}

async function findOrCreateUser(email) {
  // page through users to find an existing one
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
  const existing = list?.users?.find((u) => u.email === email);
  if (existing) return existing.id;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: "DemoOperator!2026",
    user_metadata: { demo: true },
  });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  return data.user.id;
}

async function clean() {
  console.log("Cleaning demo data…");
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
  const demo = (list?.users || []).filter((u) => u.email?.endsWith("@atlasexperiences.world") && u.email.startsWith("demo."));
  for (const u of demo) {
    await admin.from("experiences").delete().eq("operator_id", u.id);
    await admin.from("operators").delete().eq("id", u.id);
    await admin.auth.admin.deleteUser(u.id);
    console.log("  removed", u.email);
  }
  console.log("Done.");
}

async function seed() {
  let expCount = 0;
  for (const op of OPERATORS) {
    const id = await findOrCreateUser(op.email);
    const { error: opErr } = await admin.from("operators").upsert({
      id,
      business_name: op.business_name,
      slug: op.slug,
      bio: op.bio,
      city: op.city,
      whatsapp: op.whatsapp,
      phone: op.whatsapp,
      languages: op.languages,
      years_experience: op.years_experience,
      avatar_url: op.avatar_url,
      cover_url: op.cover_url,
      verified: true,
    }, { onConflict: "id" });
    if (opErr) throw new Error(`operator ${op.slug}: ${opErr.message}`);
    console.log("operator ✓", op.business_name);

    for (const e of EXPERIENCES[op.email]) {
      const slug = `${slugify(e.title)}-${id.slice(0, 6)}`;
      const { error: eErr } = await admin.from("experiences").upsert({
        operator_id: id,
        title: e.title,
        slug,
        category: e.category,
        description: e.description,
        highlights: e.highlights,
        includes: e.includes,
        excludes: e.excludes,
        what_to_bring: e.what_to_bring,
        city: e.city,
        duration_hours: e.duration_hours,
        max_group_size: e.max_group_size,
        price_per_person: e.price_per_person,
        languages: op.languages,
        images: e.images,
        featured: !!e.featured,
        published: true,
        approved: true,
        avg_rating: (4 + Math.random()).toFixed(2),
        review_count: Math.floor(8 + Math.random() * 40),
        total_bookings: Math.floor(5 + Math.random() * 60),
      }, { onConflict: "slug" });
      if (eErr) throw new Error(`experience "${e.title}": ${eErr.message}`);
      expCount++;
      console.log("   experience ✓", e.title);
    }
  }
  console.log(`\nSeeded ${OPERATORS.length} operators and ${expCount} experiences.`);
}

(async () => {
  try {
    if (process.argv.includes("--clean")) await clean();
    else await seed();
  } catch (err) {
    console.error("\nSEED FAILED:", err.message);
    process.exit(1);
  }
})();
