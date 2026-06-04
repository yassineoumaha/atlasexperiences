"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, Shield, ChevronDown, AtSign, Share2, Play, Compass, Store } from "lucide-react";
import { CATEGORY_LIST, EXPERIENCE_CITIES } from "@/lib/experiences-data";
import type { Locale, Dictionary } from "@/lib/dictionaries";
import { ZellijStar } from "@/components/zellij/Zellij";
import { track } from "@/lib/analytics";

const CITY_COUNT = EXPERIENCE_CITIES.length;

// Immersive Morocco hero — full-viewport with parallax-ready background
const HERO_PHOTOS = [
  "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
];

/** A real featured experience used for the hero spotlight (null until seeded). */
export interface HeroSpotlight {
  title: string;
  slug: string;
  city: string;
  image: string | null;
  rating: number | null;
}

export default function MarketplaceHero({
  locale,
  dict,
  spotlight,
}: {
  locale: Locale;
  dict: Dictionary;
  spotlight?: HeroSpotlight | null;
}) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [bgIdx] = useState(0);

  // Prefer a real operator's photo for the hero background; fall back to stock
  // only when no featured experience has been published yet.
  const heroBg = spotlight?.image ?? HERO_PHOTOS[bgIdx];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    router.push(`/${locale}/experiences${params.toString() ? "?" + params.toString() : ""}`);
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Full-screen background ─────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src={heroBg}
          alt={spotlight ? `${spotlight.title} — ${spotlight.city}` : "Morocco"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[83%_center]"
        />
        {/* Multi-layer gradient for depth, with a Majorelle tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.30_0.12_264)]/40 via-transparent to-[oklch(0.40_0.10_40)]/30" />
        {/* Faint zellij texture overlay */}
        <div className="zellij-bg absolute inset-0 opacity-[0.07] mix-blend-screen" aria-hidden="true" />
      </div>

      {/* ── Social sidebar (bedimcode pattern) ─────────── */}
      <div className="absolute left-6 bottom-1/3 hidden lg:flex flex-col gap-4 z-10">
        {[
          { href: "https://instagram.com", icon: AtSign, label: "Instagram" },
          { href: "https://facebook.com",  icon: Share2, label: "Facebook" },
          { href: "https://youtube.com",   icon: Play,   label: "YouTube" },
        ].map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}
        {/* Vertical line */}
        <div className="w-px h-12 bg-white/30 mx-auto" />
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div className="relative flex-1 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 pt-28 pb-24 lg:pb-32">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass text-white/90 text-sm px-4 py-1.5 rounded-full mb-7 fade-in-up">
            <ZellijStar size={16} className="text-amber-400" /> {dict.hero.badge}
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl text-white mb-5 leading-[1.05] fade-in-up fade-in-up-delay-1"
            style={{ fontFamily: "Raleway, sans-serif", fontWeight: 900 }}
          >
            {dict.hero.headline}
            <br />
            <span className="text-amber-400">{dict.hero.highlight}</span>
          </h1>

          <p className="text-white/75 text-lg sm:text-xl max-w-2xl mb-8 leading-relaxed fade-in-up fade-in-up-delay-2">
            {dict.hero.subheadline}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 fade-in-up fade-in-up-delay-2">
            <Link
              href={`/${locale}/experiences`}
              onClick={() => track("hero_cta_explore")}
              className="inline-flex items-center justify-center gap-2 bg-accent hover:brightness-105 text-accent-foreground font-bold px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" /> {dict.hero.ctaExplore}
            </Link>
            <Link
              href={`/${locale}/operators/register`}
              onClick={() => track("hero_cta_become_operator")}
              className="inline-flex items-center justify-center gap-2 glass text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all active:scale-95"
            >
              <Store className="w-4 h-4" /> {dict.hero.ctaOperator}
            </Link>
          </div>

          {/* Search — tappable category chips + a slim city refinement.
              Chips set the category; the button (or tapping a chip) searches. */}
          <div className="max-w-2xl mb-10 fade-in-up fade-in-up-delay-3">
            {/* Category chips — the primary, mobile-friendly discovery action */}
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar -mx-1 px-1">
              {CATEGORY_LIST.map((c) => {
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(active ? "" : c.key)}
                    aria-pressed={active}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                      active
                        ? "bg-accent text-accent-foreground shadow-md"
                        : "glass text-white/90 hover:bg-white/20"
                    }`}
                  >
                    <span>{c.emoji}</span> {dict.categories[c.key]}
                  </button>
                );
              })}
            </div>

            {/* City refinement + search */}
            <form
              onSubmit={handleSearch}
              className="bg-white/96 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label={dict.hero.searchCity}
                  className="w-full appearance-none pl-9 pr-8 py-3.5 text-stone-700 text-sm outline-none rounded-xl bg-stone-50 border border-stone-100 cursor-pointer"
                >
                  <option value="">{dict.hero.searchCity}</option>
                  {EXPERIENCE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="bg-accent hover:brightness-105 text-accent-foreground font-bold px-6 min-h-[3rem] rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-md active:scale-95"
              >
                <Search className="w-4 h-4" /> {dict.hero.searchBtn}
              </button>
            </form>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 text-sm fade-in-up fade-in-up-delay-3">
            <span className="flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-white/90">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" /> {dict.hero.trustVerified}
            </span>
            <span className="flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-white/90">
              <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" /> {dict.hero.trustRated}
            </span>
            <span className="flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-white/90">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" /> {CITY_COUNT} {dict.hero.citiesSuffix}
            </span>
          </div>
        </div>
      </div>

      {/* ── Spotlight card — a real featured experience, not a placeholder.
            Hidden entirely until at least one is published. ──────────── */}
      {spotlight && (
        <Link
          href={`/${locale}/experiences/${spotlight.slug}`}
          className="group absolute bottom-8 right-6 hidden lg:flex items-center gap-3 bg-amber-500/90 backdrop-blur-sm text-white px-5 py-4 z-10 rounded-2xl shadow-xl max-w-xs hover:bg-amber-500 transition-colors"
        >
          {spotlight.image && (
            <div className="img-hover-zoom w-24 h-16 rounded-xl overflow-hidden shrink-0">
              <Image src={spotlight.image} alt={spotlight.title} width={96} height={64} sizes="96px" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <span className="flex items-center gap-1 text-xs font-semibold opacity-80 mb-0.5">
              {spotlight.rating ? (
                <><Star className="w-3 h-3 fill-white" /> {dict.hero.spotlightTopRated} · {spotlight.rating}</>
              ) : (
                <>{dict.hero.spotlightFeatured}</>
              )}
            </span>
            <span className="block text-sm font-bold leading-tight truncate">{spotlight.title}</span>
            <span className="flex items-center gap-1 text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
              {dict.hero.spotlightView}
            </span>
          </div>
        </Link>
      )}

      {/* ── Scroll indicator ───────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
