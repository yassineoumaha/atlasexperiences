"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Play, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  country: string;
  flag: string;
  experience: string;
  quote: string;
  videoUrl?: string;
  poster: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "James R.",
    country: "UK",
    flag: "🇬🇧",
    experience: "Sahara Camel Trek – Merzouga",
    quote: "Three nights under the stars in the Sahara with a guide who felt like family. Nothing like anything I'd experienced before. Imourig made it effortless to book.",
    poster: "https://images.pexels.com/photos/1009861/pexels-photo-1009861.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    id: "t2",
    name: "Sofia M.",
    country: "Spain",
    flag: "🇪🇸",
    experience: "Surf Lessons – Taghazout",
    quote: "I'd never surfed before. Within two days I was standing up. The instructor was patient, the waves were perfect, and the price was a third of what I paid in Biarritz.",
    poster: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    id: "t3",
    name: "Amara K.",
    country: "USA",
    flag: "🇺🇸",
    experience: "Cooking Class – Marrakech Medina",
    quote: "Our host took us to the souk at 8am to buy the ingredients, then we cooked a feast. That tagine recipe is now a staple at home. Best half-day I've spent anywhere.",
    poster: "https://images.pexels.com/photos/5560779/pexels-photo-5560779.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    id: "t4",
    name: "Lukas B.",
    country: "Germany",
    flag: "🇩🇪",
    experience: "Chefchaouen Photography Walk",
    quote: "I'm a travel photographer and this was the best guided photo tour I've done. The guide knew every alley and the best light times. Came back with 400 keeper shots.",
    poster: "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    id: "t5",
    name: "Yuki T.",
    country: "Japan",
    flag: "🇯🇵",
    experience: "Fes Medina Walking Tour",
    quote: "The medina is impossibly complex but our guide made it feel like home. We discovered riads, workshops, and cafes no tourist would find alone. Absolutely unmissable.",
    poster: "https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
];

function VideoCard({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handlePlay() {
    if (!t.videoUrl) return;
    setPlaying(true);
    videoRef.current?.play();
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-xl group flex-shrink-0 w-72 sm:w-80">
      {/* Image / video */}
      <div className="relative h-64 overflow-hidden">
        {t.videoUrl ? (
          <video
            ref={videoRef}
            src={t.videoUrl}
            poster={t.poster}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={t.poster}
            alt={t.name}
            fill
            sizes="(max-width: 640px) 288px, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

        {t.videoUrl && !playing && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-14 h-14 glass rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </button>
        )}

        {t.videoUrl && playing && (
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        )}

        {/* Flag */}
        <div className="absolute top-3 left-3 text-2xl">{t.flag}</div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Quote className="w-5 h-5 text-amber-400 mb-3" />
        <p className="text-white/80 text-sm leading-relaxed line-clamp-3 mb-4">{t.quote}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-bold text-white text-sm">{t.name}</div>
            <div className="text-stone-400 text-xs">{t.country}</div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 text-xs font-semibold">{t.experience}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StripProps {
  title?: string;
  subtitle?: string;
  featuredLabel?: string;
  featuredSub?: string;
}

export default function TestimonialsStrip({ title, subtitle, featuredLabel, featuredSub }: StripProps) {
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
              Travelers say
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
              className="w-10 h-10 rounded-xl border border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
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
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="snap-start">
              <VideoCard t={t} />
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
