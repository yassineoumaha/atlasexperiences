// Category definitions for the marketplace

export type ExperienceCategory =
  | "surf" | "desert" | "culture" | "food" | "wellness"
  | "adventure" | "water" | "photography" | "transport" | "day-trip" | "other";

export interface CategoryMeta {
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Record<ExperienceCategory, CategoryMeta> = {
  surf:        { label: "Surf",           emoji: "🏄", description: "Lessons, coaching & surf guiding", color: "text-blue-700",   bgColor: "bg-blue-50 border-blue-200" },
  desert:      { label: "Desert",         emoji: "🐪", description: "Sahara tours, camel treks & camps", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  culture:     { label: "Culture",        emoji: "🕌", description: "Medina walks, historic tours & crafts", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  food:        { label: "Food & Cooking", emoji: "🍽️", description: "Cooking classes, food tours & markets", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" },
  wellness:    { label: "Wellness",       emoji: "🧖", description: "Hammam, yoga, meditation & spa", color: "text-teal-700",   bgColor: "bg-teal-50 border-teal-200" },
  adventure:   { label: "Adventure",      emoji: "🧗", description: "Hiking, trekking & quad biking", color: "text-red-700",    bgColor: "bg-red-50 border-red-200" },
  water:       { label: "Water Sports",   emoji: "🪁", description: "Kitesurfing, paddleboarding & diving", color: "text-cyan-700",  bgColor: "bg-cyan-50 border-cyan-200" },
  photography: { label: "Photography",    emoji: "📸", description: "Photo walks, drone tours & workshops", color: "text-stone-700", bgColor: "bg-stone-50 border-stone-200" },
  transport:   { label: "Transport",      emoji: "🚕", description: "Private transfers & airport pickups", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  "day-trip":  { label: "Day Trips",      emoji: "🗺️", description: "Full-day excursions from major cities", color: "text-indigo-700", bgColor: "bg-indigo-50 border-indigo-200" },
  other:       { label: "Other",          emoji: "✨", description: "Unique local experiences", color: "text-stone-600",  bgColor: "bg-stone-50 border-stone-200" },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([key, meta]) => ({
  key: key as ExperienceCategory,
  ...meta,
}));

export const CANCELLATION_LABELS: Record<string, string> = {
  free_cancel: "Free cancellation anytime",
  "24h":       "Free cancellation up to 24h before",
  "48h":       "Free cancellation up to 48h before",
  no_refund:   "Non-refundable",
};

// Platform commission rate
export const PLATFORM_COMMISSION = 0.10; // 10%

// Languages experiences are commonly offered in (for the discovery filter)
export const EXPERIENCE_LANGUAGES = [
  "English", "French", "Arabic", "Spanish", "German", "Italian", "Berber",
];

// Duration buckets for the discovery filter — value is the max hours (lte).
export const DURATION_BUCKETS: { key: string; label: string; maxHours: number }[] = [
  { key: "short",   label: "Up to 3h",   maxHours: 3 },
  { key: "halfday", label: "Half day (≤5h)", maxHours: 5 },
  { key: "fullday", label: "Full day (≤9h)", maxHours: 9 },
  { key: "multiday", label: "Multi-day (24h+)", maxHours: 9999 },
];

// Price buckets (USD per person) for the discovery filter.
export const PRICE_BUCKETS: { key: string; label: string; min?: number; max?: number }[] = [
  { key: "budget", label: "Under $30", max: 30 },
  { key: "mid",    label: "$30–$75", min: 30, max: 75 },
  { key: "premium", label: "$75–$150", min: 75, max: 150 },
  { key: "luxury", label: "$150+", min: 150 },
];

export const SORT_OPTIONS: { key: string; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "rated",       label: "Highest Rated" },
  { key: "popular",     label: "Most Popular" },
  { key: "newest",      label: "Newest" },
];

// All cities on the platform — kept in sync with MoroccoMap.tsx REGIONS data
export const EXPERIENCE_CITIES = [
  // Tanger-Tétouan-Rif
  "Tangier", "Asilah", "Chefchaouen", "Tetouan", "Larache", "Akchour",
  // Oriental
  "Al Hoceima", "Nador", "Oujda",
  // Rabat-Salé
  "Rabat",
  // Casablanca-Settat
  "Casablanca", "El Jadida", "Oualidia",
  // Fès-Meknès
  "Fez", "Meknes", "Ifrane",
  // Marrakech-Safi
  "Marrakech", "Imlil", "Essaouira", "Safi",
  // Béni Mellal-Khénifra
  "Azilal", "Beni Mellal",
  // Drâa-Tafilalet
  "Merzouga", "Ouarzazate", "Tinghir", "Zagora", "M'Hamid", "Midelt",
  // Souss-Massa
  "Agadir", "Taghazout", "Taroudant", "Tiznit", "Mirleft", "Sidi Ifni", "Paradise Valley", "Tafraout", "Imouzzer", "Imsouane",
  // Dakhla
  "Dakhla",
];
