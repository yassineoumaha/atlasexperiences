import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { MapPin, ArrowRight, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Morocco Destinations — Imourig",
  description: "Explore all Morocco destinations — from Marrakech medinas to Sahara dunes, Atlantic surf towns, and mountain retreats.",
};

const WEATHER_LABELS: Record<string, { label: string; emoji: string }> = {
  hot:    { label: "Hot & sunny",  emoji: "☀️" },
  warm:   { label: "Warm",         emoji: "🌤" },
  cool:   { label: "Cool",         emoji: "🌥" },
  desert: { label: "Desert heat",  emoji: "🏜" },
  windy:  { label: "Windy coast",  emoji: "🌬" },
  cold:   { label: "Cold mountains", emoji: "❄️" },
};

async function getDestinations() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any)
      .from("destinations")
      .select("id, name, slug, description, hero_image, weather, avg_stay, region, filters, featured")
      .order("featured", { ascending: false })
      .order("name", { ascending: true });
    return (data as any[]) ?? [];
  } catch {
    return [];
  }
}

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const destinations = await getDestinations();

  const featured = destinations.filter((d: any) => d.featured);
  const rest = destinations.filter((d: any) => !d.featured);

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-16 px-4 text-center">
        <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <Compass className="w-4 h-4" /> Morocco Destinations
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Where will you go?</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          {destinations.length > 0
            ? `${destinations.length} destinations across Morocco — from the Sahara to the Atlantic.`
            : "Explore Morocco's most captivating destinations."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-400 mb-2">Destinations coming soon</h2>
            <p className="text-stone-400 text-sm mb-6">We&apos;re building our destination guides. Check back soon.</p>
            <Link
              href={`/${locale}/map`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Explore the Map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-500 rounded-full inline-block" />
                  Featured Destinations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((dest: any) => (
                    <DestCard key={dest.id} dest={dest} locale={locale} />
                  ))}
                </div>
              </div>
            )}

            {/* All destinations */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-stone-300 rounded-full inline-block" />
                  All Destinations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {rest.map((dest: any) => (
                    <DestCard key={dest.id} dest={dest} locale={locale} small />
                  ))}
                </div>
              </div>
            )}

            {/* Map CTA */}
            <div className="mt-12 bg-stone-900 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg mb-1">Prefer an interactive map?</h3>
                <p className="text-white/60 text-sm">Click any city to discover climate, activities, and local tips.</p>
              </div>
              <Link
                href={`/${locale}/map`}
                className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Open Map <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DestCard({ dest, locale, small = false }: { dest: any; locale: string; small?: boolean }) {
  const weather = WEATHER_LABELS[dest.weather] ?? { label: dest.weather, emoji: "🌍" };

  return (
    <Link
      href={`/${locale}/destinations/${dest.slug}`}
      className="group rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      {dest.hero_image ? (
        <div className={`overflow-hidden ${small ? "h-40" : "h-52"}`}>
          <img
            src={dest.hero_image}
            alt={dest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className={`bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center ${small ? "h-40" : "h-52"}`}>
          <MapPin className="w-10 h-10 text-amber-400" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-black text-stone-900 group-hover:text-amber-600 transition-colors ${small ? "text-base" : "text-lg"}`}>
            {dest.name}
          </h3>
          <span className="text-lg">{weather.emoji}</span>
        </div>
        <p className="text-stone-400 text-xs leading-relaxed line-clamp-2 mb-3">{dest.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {(dest.filters ?? []).slice(0, 2).map((f: string) => (
              <span key={f} className="text-[10px] bg-stone-50 border border-stone-200 text-stone-500 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
          <span className="text-xs text-stone-400 flex items-center gap-1">
            {dest.avg_stay}d avg <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
