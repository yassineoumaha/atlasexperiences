"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, Shield, ChevronDown, AtSign, Share2, Play } from "lucide-react";
import { CATEGORY_LIST, EXPERIENCE_CITIES } from "@/lib/experiences-data";
import type { Locale, Dictionary } from "@/lib/dictionaries";
import { ZellijStar } from "@/components/zellij/Zellij";

const CITY_COUNT = EXPERIENCE_CITIES.length;

// Immersive Morocco hero — full-viewport with parallax-ready background
const HERO_PHOTOS = [
  "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
];

const INFO_PHOTO = "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";

export default function MarketplaceHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [bgIdx] = useState(0);

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
        <img
          src={HERO_PHOTOS[bgIdx]}
          alt="Morocco"
          className="w-full h-full object-cover object-[83%_center]"
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

          <p className="text-white/75 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed fade-in-up fade-in-up-delay-2">
            {dict.hero.subheadline}
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white/96 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mb-10 fade-in-up fade-in-up-delay-3"
          >
            <div className="relative flex-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3.5 text-stone-700 text-sm outline-none rounded-xl bg-stone-50 border border-stone-100 pr-8 cursor-pointer"
              >
                <option value="">{dict.hero.searchCategory}</option>
                {CATEGORY_LIST.map((c) => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>

            <div className="relative flex-1">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none px-4 py-3.5 text-stone-700 text-sm outline-none rounded-xl bg-stone-50 border border-stone-100 pr-8 cursor-pointer"
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

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 text-sm fade-in-up fade-in-up-delay-3">
            <span className="flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-white/90">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" /> {dict.hero.trustVerified}
            </span>
            <span className="flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-white/90">
              <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" /> {dict.hero.trustRated}
            </span>
            <span className="flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-white/90">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" /> {CITY_COUNT} cities
            </span>
          </div>
        </div>
      </div>

      {/* ── Info card (bedimcode bottom-right overlay) ──── */}
      <div className="absolute bottom-8 right-6 hidden lg:flex items-center gap-3 bg-amber-500/90 backdrop-blur-sm text-white px-5 py-4 z-10 rounded-2xl shadow-xl max-w-xs">
        <div className="img-hover-zoom w-24 h-16 rounded-xl overflow-hidden shrink-0">
          <img src={INFO_PHOTO} alt="Morocco experience" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="block text-xs font-semibold opacity-80 mb-0.5">Top rated this week</span>
          <span className="text-sm font-bold leading-tight">Sahara Sunset Camel Trek</span>
          <Link
            href={`/${locale}/experiences`}
            className="flex items-center gap-1 text-xs mt-1 opacity-80 hover:opacity-100 transition-opacity"
          >
            See all experiences →
          </Link>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
