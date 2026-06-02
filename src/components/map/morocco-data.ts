// Static geographic data for the Morocco discovery map.
// Extracted from MoroccoMap.tsx so the client component stays focused on rendering.

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CityInfo {
  name: string;
  emoji: string;
  tagline: string;
  bestFor: string[];
  bestSeason: string;
  climate: string;
  mustSee: string[];
  avgTemp: string;
  slug: string;
  lng: number;
  lat: number;
}

export interface RegionInfo {
  id: string;
  label: string;
  lng: number;
  lat: number;
  color: string;
  cities: CityInfo[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const REGIONS: RegionInfo[] = [
  {
    id: "tanger", label: "Tanger-Tétouan-Rif",
    lng: -5.63, lat: 35.4, color: "#3b82f6",
    cities: [
      { name: "Tangier",       emoji: "⚓", lng: -5.8,   lat: 35.76, tagline: "Gateway between Africa and Europe",             bestFor: ["History", "Day trips to Spain", "Literary heritage", "Beach"],      bestSeason: "Apr–Oct",            climate: "Mediterranean, mild sea breeze",              avgTemp: "18°C avg", mustSee: ["Cape Spartel & Hercules Caves", "Kasbah medina", "American Legation museum"],                                         slug: "Tangier" },
      { name: "Asilah",        emoji: "🎨", lng: -6.035, lat: 35.465,tagline: "Whitewashed murals and Atlantic charm",           bestFor: ["Art", "Photography", "Beach", "Day trips"],                        bestSeason: "Apr–Oct",            climate: "Mediterranean coast, warm summers",           avgTemp: "18°C avg", mustSee: ["Painted medina walls", "Portuguese ramparts", "Asilah Arts Festival (Aug)"],                                      slug: "Asilah" },
      { name: "Chefchaouen",   emoji: "💙", lng: -5.267, lat: 35.167,tagline: "The iconic Blue City in the Rif Mountains",       bestFor: ["Photography", "Hiking", "Culture", "Relaxation"],                  bestSeason: "Apr–Jun · Sep–Oct",  climate: "Mountain Mediterranean, cooler than coast",   avgTemp: "16°C avg", mustSee: ["Blue painted medina", "Ras el-Ma spring", "Spanish mosque viewpoint", "Rif mountain trails"],                       slug: "Chefchaouen" },
      { name: "Tetouan",       emoji: "🕌", lng: -5.368, lat: 35.578,tagline: "UNESCO medina — most intact Hispano-Moorish city", bestFor: ["History", "Architecture", "Culture", "Day trip base"],             bestSeason: "Apr–Oct",            climate: "Mediterranean, mild",                         avgTemp: "17°C avg", mustSee: ["Tetouan medina (UNESCO)", "Royal Palace square", "Archaeological museum"],                                         slug: "Tetouan" },
      { name: "Larache",       emoji: "🏺", lng: -6.156, lat: 35.193,tagline: "Lixus Roman ruins on the Atlantic coast",          bestFor: ["Roman ruins", "Beach", "Fishing village", "Off-the-beaten-path"], bestSeason: "Apr–Oct",            climate: "Mediterranean coast, warm",                   avgTemp: "17°C avg", mustSee: ["Lixus Roman ruins (oldest in Morocco)", "Loukos lagoon birding", "Larache medina"],                                    slug: "Larache" },
      { name: "Akchour",       emoji: "🌊", lng: -5.181, lat: 35.239,tagline: "Rif waterfalls and natural rock bridge",           bestFor: ["Waterfall hiking", "Swimming", "Nature", "Trekking"],              bestSeason: "Mar–Jun · Sep–Oct",  climate: "Mountain Rif, lush and cool",                 avgTemp: "16°C avg", mustSee: ["Akchour Waterfalls (2-tier)", "Bridge of God rock arch", "Canyon swim pools"],                                        slug: "Akchour" },
    ],
  },
  {
    id: "oriental", label: "Oriental",
    lng: -3.43, lat: 35.21, color: "#8b5cf6",
    cities: [
      { name: "Al Hoceima",    emoji: "🏝", lng: -3.93,  lat: 35.25, tagline: "Hidden gem of the Mediterranean coast",           bestFor: ["Beach", "Snorkeling", "Hiking", "Off-the-beaten-path"],           bestSeason: "Jun–Sep",            climate: "Mediterranean, hot dry summers",              avgTemp: "19°C avg", mustSee: ["Al Hoceima National Park", "Quemado Beach", "Alhucemas island"],                                                      slug: "Al Hoceima" },
      { name: "Nador",         emoji: "🌊", lng: -2.93,  lat: 35.17, tagline: "Mediterranean lagoon and border gateway",          bestFor: ["Beach", "Lagoon", "Local culture", "Seafood"],                    bestSeason: "May–Sep",            climate: "Mediterranean, warm and dry",                 avgTemp: "19°C avg", mustSee: ["Marchica Lagoon", "Cap des Trois Fourches", "Beni Enzar medina"],                                                  slug: "Nador" },
      { name: "Oujda",         emoji: "🌆", lng: -1.91,  lat: 34.68, tagline: "Eastern gateway city and university hub",          bestFor: ["Culture", "Music", "Day trips to Algeria border", "Food"],        bestSeason: "Apr–Jun · Sep–Oct",  climate: "Continental semi-arid, hot summers",          avgTemp: "18°C avg", mustSee: ["Oujda medina", "Sidi Yahia oasis", "Beni Snassen mountains"],                                                    slug: "Oujda" },
    ],
  },
  {
    id: "rabat", label: "Rabat-Salé",
    lng: -6.85, lat: 34.02, color: "#10b981",
    cities: [
      { name: "Rabat",         emoji: "🏛", lng: -6.85,  lat: 34.02, tagline: "The quiet, refined capital of Morocco",           bestFor: ["History", "Museums", "Architecture", "Cultural events"],          bestSeason: "Apr–Jun · Sep–Oct",  climate: "Mediterranean, mild and pleasant",            avgTemp: "17°C avg", mustSee: ["Hassan Tower", "Kasbah des Oudayas", "Chellah necropolis", "Mohammed VI Museum"],                                       slug: "Rabat" },
    ],
  },
  {
    id: "casa", label: "Casablanca-Settat",
    lng: -8.38, lat: 33.19, color: "#f59e0b",
    cities: [
      { name: "Casablanca",    emoji: "🌆", lng: -7.61,  lat: 33.59, tagline: "Morocco's modern business capital",               bestFor: ["Business travel", "Art Deco", "Seafood", "Corniche"],             bestSeason: "Mar–Jun · Sep–Nov",  climate: "Mediterranean, mild",                         avgTemp: "18°C avg", mustSee: ["Hassan II Mosque", "Corniche & Ain Diab", "Art Deco Habous quarter"],                                                slug: "Casablanca" },
      { name: "El Jadida",     emoji: "🏰", lng: -8.5,   lat: 33.25, tagline: "Portuguese fortress city on the Atlantic",        bestFor: ["History", "Beach", "Architecture", "Day trips"],                  bestSeason: "Apr–Oct",            climate: "Atlantic coast, mild year-round",             avgTemp: "17°C avg", mustSee: ["Portuguese Cistern (UNESCO)", "Mazagan old town", "El Jadida beach"],                                               slug: "El Jadida" },
      { name: "Oualidia",      emoji: "🦪", lng: -9.04,  lat: 32.74, tagline: "Morocco's oyster capital — sheltered lagoon paradise", bestFor: ["Oysters & seafood", "Swimming", "Lagoon kayaking", "Weekend escape"], bestSeason: "Apr–Oct",       climate: "Atlantic coast, cool and pleasant",           avgTemp: "17°C avg", mustSee: ["Fresh oyster farm visits", "Oualidia lagoon swim", "Clifftop sunset walks"],                                         slug: "Oualidia" },
    ],
  },
  {
    id: "fes", label: "Fès-Meknès",
    lng: -5.22, lat: 33.82, color: "#ef4444",
    cities: [
      { name: "Fez",           emoji: "🕌", lng: -4.99,  lat: 34.04, tagline: "The oldest medieval city in the world",           bestFor: ["History", "Architecture", "Traditional crafts", "Culture"],       bestSeason: "Mar–May · Sep–Nov",  climate: "Mediterranean, cold winters, hot summers",    avgTemp: "17°C avg", mustSee: ["Fes el-Bali medina (UNESCO)", "Chouara tanneries", "Al-Qarawiyyin mosque"],                                           slug: "Fez" },
      { name: "Meknes",        emoji: "🕍", lng: -5.55,  lat: 33.9,  tagline: "The overlooked imperial city — fewer crowds than Fez", bestFor: ["History", "Architecture", "Day trips to Volubilis", "Local culture"], bestSeason: "Mar–May · Sep–Nov", climate: "Mediterranean, cold winters, hot summers",   avgTemp: "17°C avg", mustSee: ["Bab Mansour gate", "Volubilis Roman ruins", "Moulay Ismail Mausoleum"],                                             slug: "Meknes" },
      { name: "Ifrane",        emoji: "🌲", lng: -5.11,  lat: 33.52, tagline: "The Switzerland of Morocco — skiing and cedar forests", bestFor: ["Skiing", "Hiking", "Cedar forest", "Cool summer escape"],        bestSeason: "Dec–Feb for ski · Jun–Sep for hiking", climate: "Mountain, cold winters, cool summers", avgTemp: "11°C avg", mustSee: ["Michlifen ski resort", "Barbary macaque cedar forest", "Dayet Aoua lake"],                              slug: "Ifrane" },
    ],
  },
  {
    id: "marrakech", label: "Marrakech-Safi",
    lng: -8.73, lat: 31.65, color: "#ec4899",
    cities: [
      { name: "Marrakech",     emoji: "🌹", lng: -7.99,  lat: 31.63, tagline: "The Red City — Morocco's beating heart",           bestFor: ["Culture", "Food", "Souks", "Palaces"],                            bestSeason: "Mar–May · Sep–Nov",  climate: "Hot desert, very hot summers",                avgTemp: "20°C avg", mustSee: ["Jemaa el-Fna square", "Majorelle Garden", "Bahia Palace", "Medina souks"],                                              slug: "Marrakech" },
      { name: "Imlil",         emoji: "⛰",  lng: -7.92,  lat: 31.14, tagline: "Gateway to Mount Toubkal — Africa's highest peak", bestFor: ["Trekking", "Hiking", "Berber culture", "Mountain scenery"],        bestSeason: "Apr–Jun · Sep–Nov",  climate: "Mountain, cool year-round, snow in winter",   avgTemp: "12°C avg", mustSee: ["Mount Toubkal summit (4,167m)", "Aremd Berber village", "Sidi Chamharouch waterfall"],                                 slug: "Imlil" },
      { name: "Essaouira",     emoji: "🌊", lng: -9.77,  lat: 31.51, tagline: "The windy city — art, fishing, and kitesurfing",   bestFor: ["Windsurfing", "Kitesurfing", "Art", "Photography"],               bestSeason: "Apr–Oct",            climate: "Coastal, cool and windy year-round",          avgTemp: "18°C avg", mustSee: ["Blue medina ramparts (UNESCO)", "Mogador island", "Fish port", "Gnawa music scene"],                                     slug: "Essaouira" },
      { name: "Safi",          emoji: "🏄", lng: -9.24,  lat: 32.3,  tagline: "World-class surf breaks and pottery quarter",      bestFor: ["Surfing", "Kitesurfing", "Pottery crafts", "Seafood"],            bestSeason: "Oct–Apr for surf",   climate: "Atlantic coast, windy and mild",              avgTemp: "17°C avg", mustSee: ["Safi surf breaks (point breaks)", "Pottery Hill quarter", "Dar el-Bahar fortress"],                                      slug: "Safi" },
    ],
  },
  {
    id: "beni", label: "Béni Mellal-Khénifra",
    lng: -6.57, lat: 31.96, color: "#14b8a6",
    cities: [
      { name: "Azilal",        emoji: "💧", lng: -6.57,  lat: 31.96, tagline: "Ouzoud Waterfalls — Morocco's most spectacular cascades", bestFor: ["Waterfalls", "Hiking", "Nature", "Photography"],             bestSeason: "Mar–Jun · Sep–Oct",  climate: "Mountain, hot summers, mild spring",          avgTemp: "18°C avg", mustSee: ["Ouzoud Waterfalls (110m)", "Barbary macaque monkeys", "Bin el-Ouidane lake"],                                        slug: "Azilal" },
      { name: "Beni Mellal",   emoji: "🌄", lng: -6.36,  lat: 32.34, tagline: "Atlas foothills with ancient kasbahs and springs",  bestFor: ["Day trips", "Waterfalls", "Kasbahs", "Local culture"],            bestSeason: "Mar–Jun · Sep–Oct",  climate: "Semi-arid, hot summers, mild winters",        avgTemp: "17°C avg", mustSee: ["Kasbah de Beni Mellal", "Ain Asserdoun springs", "Ouzoud day trip"],                                              slug: "Beni Mellal" },
    ],
  },
  {
    id: "draa", label: "Drâa-Tafilalet",
    lng: -5.69, lat: 31.06, color: "#f97316",
    cities: [
      { name: "Merzouga",      emoji: "🏜", lng: -4.01,  lat: 31.1,  tagline: "Gateway to the Sahara — Erg Chebbi dunes",         bestFor: ["Sahara tours", "Camel treks", "Stargazing", "Desert camping"],    bestSeason: "Oct–Apr",            climate: "Saharan, extreme heat in summer, cold nights",avgTemp: "22°C avg", mustSee: ["Erg Chebbi dunes (150m high)", "Overnight luxury desert camp", "Khamlia gnawa village"],                                 slug: "Merzouga" },
      { name: "Ouarzazate",    emoji: "🎬", lng: -6.89,  lat: 30.92, tagline: "Hollywood of Africa — Atlas Studios and ancient kasbahs", bestFor: ["Film tourism", "Kasbahs", "Desert gateway", "Photography"],   bestSeason: "Mar–May · Sep–Nov",  climate: "Desert, hot days and cool nights",            avgTemp: "20°C avg", mustSee: ["Aït Benhaddou (UNESCO)", "Atlas Film Studios (Gladiator, GoT)", "Fint Oasis"],                                    slug: "Ouarzazate" },
      { name: "Tinghir",       emoji: "🏔", lng: -5.53,  lat: 31.52, tagline: "Todgha Gorge — towering 300m limestone canyon",    bestFor: ["Rock climbing", "Gorge walks", "Photography", "Berber culture"],  bestSeason: "Mar–May · Sep–Nov",  climate: "High desert, hot summers, cold nights",       avgTemp: "18°C avg", mustSee: ["Todgha Gorge walls (300m)", "Tinghir palmerie", "Tamtatouche village"],                                           slug: "Tinghir" },
      { name: "Zagora",        emoji: "🐫", lng: -5.84,  lat: 30.33, tagline: "Draa Valley — caravan route to Timbuktu",          bestFor: ["Desert experience", "Oasis villages", "Date palms", "Camel treks"], bestSeason: "Oct–Mar",          climate: "Desert, extreme heat in summer",              avgTemp: "23°C avg", mustSee: ["Draa Valley palmerie", "Amezrou kasbah", "Tamegroute library"],                                                  slug: "Zagora" },
      { name: "M'Hamid",       emoji: "🐪", lng: -5.72,  lat: 29.82, tagline: "End of the road — gateway to the Sahara proper",   bestFor: ["Camel trekking", "Desert camping", "Erg Chigaga dunes", "Stargazing"], bestSeason: "Oct–Mar",        climate: "Deep Sahara, extreme summer heat, cold nights",avgTemp: "24°C avg",mustSee: ["Erg Chigaga dunes (60km remote)", "Multi-day camel caravan treks", "Draa River oasis palms"],                          slug: "Zagora" },
      { name: "Midelt",        emoji: "🍎", lng: -4.74,  lat: 32.68, tagline: "Apple orchards between the Atlas ranges",          bestFor: ["Hiking", "Off-road 4x4", "Rock climbing", "Fossils"],             bestSeason: "Jun–Oct",            climate: "High plateau, cold winters, warm summers",    avgTemp: "14°C avg", mustSee: ["Cirque de Jaffar gorge", "Jbel Ayachi summit", "Fossil and mineral market"],                                        slug: "Midelt" },
    ],
  },
  {
    id: "souss", label: "Souss-Massa",
    lng: -9.57, lat: 30.05, color: "#06b6d4",
    cities: [
      { name: "Agadir",        emoji: "🏖", lng: -9.59,  lat: 30.42, tagline: "Morocco's beach capital — sun 300 days a year",    bestFor: ["Surf", "Beach", "Family holidays", "Resorts"],                   bestSeason: "Year-round, peak May–Oct", climate: "Semi-arid, warm and sunny",              avgTemp: "22°C avg", mustSee: ["Agadir beach promenade", "Souss Massa National Park (flamingos)", "Central fish market"],                              slug: "Agadir" },
      { name: "Taghazout",     emoji: "🏄", lng: -9.71,  lat: 30.54, tagline: "The surf mecca of North Africa",                   bestFor: ["Surfing", "Yoga retreats", "Backpackers", "Digital nomads"],      bestSeason: "Oct–Apr for surf · May–Sep for beginners", climate: "Coastal, mild, consistent swell", avgTemp: "20°C avg", mustSee: ["Anchor Point (legendary long right)", "Hash Point break", "Tamraght village", "Banana Beach"],                   slug: "Agadir" },
      { name: "Taroudant",     emoji: "🏺", lng: -8.88,  lat: 30.47, tagline: "Little Marrakech — ancient ramparts without the crowds", bestFor: ["History", "Souks", "Cycling the ramparts", "Local culture"],  bestSeason: "Oct–Apr",            climate: "Hot semi-arid, very hot summers",             avgTemp: "22°C avg", mustSee: ["17km mud-brick city walls", "Argan oil souk", "Tiout oasis hike"],                                                   slug: "Taroudant" },
      { name: "Tiznit",        emoji: "💎", lng: -9.73,  lat: 29.7,  tagline: "Silver jewelry capital of the south",              bestFor: ["Shopping", "Silverwork crafts", "Day trip base", "Medina walk"],  bestSeason: "Oct–Apr",            climate: "Semi-arid, warm and dry",                     avgTemp: "19°C avg", mustSee: ["Silversmith souk (best in Morocco)", "Medina ramparts", "Aglou beach (20min)"],                                     slug: "Tiznit" },
      { name: "Mirleft",       emoji: "🌅", lng: -10.04, lat: 29.59, tagline: "Hidden surf village — unspoiled Atlantic beaches",  bestFor: ["Surfing", "Sunsets", "Swimming", "Off-the-beaten-path"],          bestSeason: "Apr–Oct",            climate: "Atlantic coast, warm and sunny",              avgTemp: "19°C avg", mustSee: ["Plage Sauvage cliffs", "Three Fingers rock arch", "Sidi Mohammed beach"],                                           slug: "Mirleft" },
      { name: "Sidi Ifni",     emoji: "🏛", lng: -10.17, lat: 29.38, tagline: "Art Deco ghost town on a clifftop",                 bestFor: ["History", "Beach", "Photography", "Surfing"],                     bestSeason: "Apr–Oct",            climate: "Atlantic coast, cool fog in summer",          avgTemp: "19°C avg", mustSee: ["Spanish Art Deco centre", "Legzira Arches (red stone arches)", "Weekly souk (Sunday)"],                              slug: "Sidi Ifni" },
      { name: "Paradise Valley",emoji: "🏊",lng: -9.53,  lat: 30.59, tagline: "Hidden gorge with natural swimming pools",          bestFor: ["Cliff jumping", "Swimming", "Hiking", "Day trip from Agadir"],   bestSeason: "Mar–Oct",            climate: "Coastal mountain, warm and sheltered",        avgTemp: "22°C avg", mustSee: ["Natural rock pools & waterfall", "Palm gorge canyon walk", "Cliff jumping spots"],                                    slug: "Agadir" },
      { name: "Tafraout",      emoji: "🪨", lng: -8.98,  lat: 29.72, tagline: "Pink granite boulders in the Anti-Atlas",           bestFor: ["Rock climbing", "Hiking", "Almond blossom (Feb)", "Photography"], bestSeason: "Feb–Apr · Oct–Nov",  climate: "Mountain semi-arid, cool nights",             avgTemp: "18°C avg", mustSee: ["Painted rocks (Belgian artist)", "Ameln Valley almond trees", "Agard Oudad rock (Lion's Face)"],                   slug: "Tafraout" },
      { name: "Imouzzer",       emoji: "💧", lng: -9.481, lat: 30.673,tagline: "Bridal Veil waterfall cascading through argan forest — 70km from Agadir", bestFor: ["Waterfalls", "Hiking", "Argan oil", "Day trip from Agadir"], bestSeason: "Jan–May (peak flow) · Jun–Sep (cool escape)", climate: "Mediterranean mountain, cooler than coast, rainy winters", avgTemp: "22°C summer · 14°C winter", mustSee: ["Cascades d'Imouzzer (Bridal Veil waterfall)", "Assif Tamraght natural pools", "Local argan & honey cooperative", "Anti-Atlas forest trails"], slug: "Agadir" },
      { name: "Imsouane",       emoji: "🌊", lng: -9.823, lat: 30.847,tagline: "The longest right-hand wave in Africa — a legendary surf village", bestFor: ["Surfing", "Yoga retreats", "Sunsets", "Fishing village"], bestSeason: "Oct–Apr for surf · May–Sep for beginners", climate: "Atlantic coast, mild and breezy year-round", avgTemp: "20°C avg", mustSee: ["The Bay (longest right-hander in Africa, 700m+)", "Cathedral wave (powerful reef break)", "Sunrise from the lighthouse cliff", "Fresh-catch fish grill at the port"], slug: "Agadir" },
    ],
  },
  {
    id: "dakhla", label: "Dakhla",
    lng: -15.93, lat: 23.69, color: "#84cc16",
    cities: [
      { name: "Dakhla",        emoji: "🪁", lng: -15.93, lat: 23.69, tagline: "World-class kitesurfing at the edge of the Sahara", bestFor: ["Kitesurfing", "Windsurfing", "Fishing", "Off-the-beaten-path"],  bestSeason: "Nov–Mar for kite · year-round otherwise", climate: "Saharan coast, warm and very windy", avgTemp: "21°C avg", mustSee: ["Dakhla lagoon (kite spot)", "Dragon Island sandbar", "Flamingo colony", "White Dune"],                         slug: "Dakhla" },
    ],
  },
];

// All cities flat list for search
export const ALL_CITIES: (CityInfo & { regionId: string; regionLabel: string; regionColor: string })[] = REGIONS.flatMap(r =>
  r.cities.map(c => ({ ...c, regionId: r.id, regionLabel: r.label, regionColor: r.color }))
);
