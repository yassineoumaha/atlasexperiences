import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, MapPin, Sun, Clock, ArrowRight, Star } from "lucide-react";

async function getDestination(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any)
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .single();
    return data as any ?? null;
  } catch {
    return null;
  }
}

async function getProperties(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any)
      .from("properties")
      .select("id, name, type, rating, review_count, price_from, currency, image, amenities, booking_url, description")
      .eq("destination_slug", slug)
      .eq("approved", true)
      .order("featured", { ascending: false })
      .order("rating", { ascending: false })
      .limit(6);
    return (data as any[]) ?? [];
  } catch {
    return [];
  }
}

async function getDestinationExperiences(region: string) {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any)
      .from("experiences")
      .select("id, title, slug, category, city, price_per_person, images, avg_rating, duration_hours")
      .eq("published", true)
      .eq("approved", true)
      .ilike("city", `%${region}%`)
      .limit(6);
    return (data as any[]) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestination(slug);
  if (!dest) return { title: "Destination not found — Imourig" };
  return {
    title: `${dest.name}, Morocco — Imourig`,
    description: dest.description,
    openGraph: dest.hero_image ? { images: [dest.hero_image] } : undefined,
  };
}

const WEATHER_LABELS: Record<string, { label: string; emoji: string }> = {
  hot:    { label: "Hot & sunny",      emoji: "☀️" },
  warm:   { label: "Warm",             emoji: "🌤" },
  cool:   { label: "Cool",             emoji: "🌥" },
  desert: { label: "Desert climate",   emoji: "🏜" },
  windy:  { label: "Windy coastline",  emoji: "🌬" },
  cold:   { label: "Cold mountains",   emoji: "❄️" },
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  riad: "Riad", villa: "Villa", hotel: "Hotel", resort: "Resort",
  guesthouse: "Guesthouse", apartment: "Apartment",
};

export default async function DestinationPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const dest = await getDestination(slug);
  if (!dest) notFound();

  const [properties, experiences] = await Promise.all([
    getProperties(slug),
    getDestinationExperiences(dest.name),
  ]);

  const weather = WEATHER_LABELS[dest.weather] ?? { label: dest.weather, emoji: "🌍" };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {dest.hero_image ? (
          <img src={dest.hero_image} alt={dest.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-200 to-stone-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <Link
            href={`/${locale}/destinations`}
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> All Destinations
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">{dest.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {dest.region}</span>
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4" /> {weather.emoji} {weather.label}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {dest.avg_stay} days avg stay</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section>
              <h2 className="text-2xl font-black text-stone-900 mb-3">About {dest.name}</h2>
              <p className="text-stone-600 leading-relaxed">{dest.description}</p>
              {(dest.filters ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {dest.filters.map((f: string) => (
                    <span key={f} className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Experiences */}
            {experiences.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-black text-stone-900">Experiences in {dest.name}</h2>
                  <Link
                    href={`/${locale}/experiences?city=${encodeURIComponent(dest.name)}`}
                    className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    See all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experiences.map((exp: any) => (
                    <Link
                      key={exp.id}
                      href={`/${locale}/experiences/${exp.slug}`}
                      className="group flex gap-4 p-4 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all"
                    >
                      {exp.images?.[0] ? (
                        <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={exp.images[0]} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="w-20 h-16 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-2xl">🗺️</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors leading-snug line-clamp-2 mb-1">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-3 text-stone-400 text-xs">
                          {exp.avg_rating && (
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {exp.avg_rating}
                            </span>
                          )}
                          <span>{exp.duration_hours}h</span>
                          <span className="font-semibold text-stone-700">${exp.price_per_person}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Properties */}
            {properties.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-stone-900 mb-5">Where to Stay</h2>
                <div className="space-y-4">
                  {properties.map((prop: any) => (
                    <div key={prop.id} className="flex gap-4 p-4 rounded-xl border border-stone-100">
                      {prop.image ? (
                        <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0">
                          <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-20 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-2xl">🏨</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-stone-900 text-sm leading-snug">{prop.name}</h3>
                            <span className="text-xs text-stone-400">{PROPERTY_TYPE_LABELS[prop.type] ?? prop.type}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-amber-600 font-black text-sm">{prop.price_from} {prop.currency}</div>
                            <div className="text-stone-400 text-xs">/ night</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-stone-700">{prop.rating}</span>
                          {prop.review_count > 0 && <span className="text-xs text-stone-400">({prop.review_count} reviews)</span>}
                        </div>
                        <a
                          href={prop.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                        >
                          View on booking site <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick facts */}
            <div className="bg-stone-50 rounded-2xl p-6">
              <h3 className="font-black text-stone-900 text-sm uppercase tracking-wider mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Region</span>
                  <span className="font-medium text-stone-800">{dest.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Climate</span>
                  <span className="font-medium text-stone-800">{weather.emoji} {weather.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Avg stay</span>
                  <span className="font-medium text-stone-800">{dest.avg_stay} days</span>
                </div>
                {experiences.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Experiences</span>
                    <span className="font-medium text-stone-800">{experiences.length} listed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Explore CTA */}
            <Link
              href={`/${locale}/experiences?city=${encodeURIComponent(dest.name)}`}
              className="flex items-center justify-between gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-4 rounded-2xl transition-colors group"
            >
              <span>Find experiences here</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Map link */}
            <Link
              href={`/${locale}/map`}
              className="flex items-center justify-between gap-3 bg-stone-900 hover:bg-stone-800 text-white font-bold px-5 py-4 rounded-2xl transition-colors group"
            >
              <span>Open Interactive Map</span>
              <MapPin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
