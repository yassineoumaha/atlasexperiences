"use client";

import { useRef } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  country: string;
  flag: string;
  experience: string;
  quote: string;
}

// Deterministic warm-toned gradient per reviewer, derived from the name — so
// the initials avatar is colorful and stable without reusing any stock photo.
const AVATAR_GRADIENTS = [
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-violet-500 to-purple-600",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "James R.",
    country: "United Kingdom",
    flag: "🇬🇧",
    experience: "Sahara Camel Trek – Merzouga",
    quote: "Three nights under the stars in the Sahara with a guide who felt like family. Nothing like anything I'd experienced before. Imourig made it effortless to book.",
  },
  {
    id: "t2",
    name: "Sofia M.",
    country: "Spain",
    flag: "🇪🇸",
    experience: "Surf Lessons – Taghazout",
    quote: "I'd never surfed before. Within two days I was standing up. The instructor was patient, the waves were perfect, and the price was a third of what I paid in Biarritz.",
  },
  {
    id: "t3",
    name: "Amara K.",
    country: "United States",
    flag: "🇺🇸",
    experience: "Cooking Class – Marrakech Medina",
    quote: "Our host took us to the souk at 8am to buy the ingredients, then we cooked a feast. That tagine recipe is now a staple at home. Best half-day I've spent anywhere.",
  },
  {
    id: "t4",
    name: "Lukas B.",
    country: "Germany",
    flag: "🇩🇪",
    experience: "Chefchaouen Photography Walk",
    quote: "I'm a travel photographer and this was the best guided photo tour I've done. The guide knew every alley and the best light times. Came back with 400 keeper shots.",
  },
  {
    id: "t5",
    name: "Yuki T.",
    country: "Japan",
    flag: "🇯🇵",
    experience: "Fes Medina Walking Tour",
    quote: "The medina is impossibly complex but our guide made it feel like home. We discovered riads, workshops, and cafes no tourist would find alone. Absolutely unmissable.",
  },
];

function QuoteCard({ t, index }: { t: Testimonial; index: number }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div className="flex-shrink-0 w-72 sm:w-80 rounded-2xl bg-stone-800/60 border border-stone-700/60 p-6 flex flex-col">
      <Quote className="w-7 h-7 text-amber-400/70 mb-4" />

      {/* 5-star rating */}
      <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-white/85 text-sm leading-relaxed flex-1 mb-5">“{t.quote}”</p>

      <div className="flex items-center gap-3 pt-4 border-t border-stone-700/60">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-sm shrink-0`}
          aria-hidden="true"
        >
          {initials(t.name)}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-white text-sm flex items-center gap-1.5">
            {t.name} <span className="text-base leading-none">{t.flag}</span>
          </div>
          <div className="text-amber-400/90 text-xs truncate">{t.experience}</div>
        </div>
      </div>
    </div>
  );
}

interface StripProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  featuredLabel?: string;
  featuredSub?: string;
}

export default function TestimonialsStrip({ eyebrow, title, subtitle, featuredLabel, featuredSub }: StripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section className="py-16 bg-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="block text-amber-400 font-semibold text-sm mb-2 uppercase tracking-wider">
              {eyebrow ?? "Travelers say"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white section-title">
              {title ?? "Real travelers.\nReal experiences."}
            </h2>
            <p className="text-stone-400 mt-2">
              {subtitle ?? "What our community says — in their own words."}
            </p>
          </div>

          {/* Scroll controls */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll testimonials left"
              className="w-10 h-10 rounded-xl border border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll testimonials right"
              className="w-10 h-10 rounded-xl border border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={t.id} className="snap-start">
              <QuoteCard t={t} index={i} />
            </div>
          ))}

          {/* "Be featured" placeholder */}
          <div className="snap-start flex-shrink-0 w-72 sm:w-80 rounded-2xl border-2 border-dashed border-stone-700 flex flex-col items-center justify-center text-center p-8 min-h-[20rem]">
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-stone-300 font-bold mb-1">{featuredLabel ?? "Want to be featured?"}</p>
            <p className="text-stone-500 text-sm leading-relaxed">
              {featuredSub ?? "Loved your experience? Share a short video and we'll feature you here."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
