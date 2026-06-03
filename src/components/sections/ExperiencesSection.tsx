import Link from "next/link";
import Image from "next/image";
import { listFeaturedExperiences } from "@/lib/db";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/experiences-data";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/dictionaries";
import { ZellijDivider } from "@/components/zellij/Zellij";

interface Props { locale: Locale; dict: Dictionary; }

// Category cards with Morocco-specific destination images
const DISCOVER_CARDS = [
  { key: "desert",    label: "Sahara Desert",     img: "https://images.pexels.com/photos/1703314/pexels-photo-1703314.jpeg?auto=compress&cs=tinysrgb&w=400&h=560&fit=crop" },
  { key: "surf",      label: "Atlantic Coast",     img: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400&h=560&fit=crop" },
  { key: "culture",   label: "Imperial Cities",    img: "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=400&h=560&fit=crop" },
  { key: "food",      label: "Moroccan Cuisine",   img: "https://images.pexels.com/photos/5560779/pexels-photo-5560779.jpeg?auto=compress&cs=tinysrgb&w=400&h=560&fit=crop" },
  { key: "wellness",  label: "Hammam & Spa",       img: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400&h=560&fit=crop" },
  { key: "adventure", label: "Atlas Mountains",    img: "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=400&h=560&fit=crop" },
];

export default async function ExperiencesSection({ locale, dict }: Props) {
  const experiences = await listFeaturedExperiences();
  const d = dict.experiences;
  const c = dict.common;

  return (
    <>
      {/* ══ DISCOVER SECTION (bedimcode discover pattern) ══════════════════ */}
      <section className="py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="block text-primary font-semibold text-sm mb-2 uppercase tracking-wider">
                {d.badge}
              </span>
              <h2
                className="text-3xl sm:text-4xl text-foreground section-title"
              >
                Discover the most<br />
                <span className="text-accent">attractive places</span>
              </h2>
            </div>
            <Link
              href={`/${locale}/map`}
              className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm font-semibold transition-colors"
            >
              Explore map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal scroll carousel — bedimcode discover pattern */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-scroll no-scrollbar">
            {DISCOVER_CARDS.map((card) => (
              <Link
                key={card.key}
                href={`/${locale}/experiences?category=${card.key}`}
                className="discover-card snap-start flex-shrink-0 w-44 sm:w-52 h-72 sm:h-80 rounded-2xl group relative overflow-hidden"
              >
                <Image
                  src={card.img}
                  alt={card.label}
                  fill
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-bold text-base leading-tight">{card.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCES SECTION (place-card + grid patterns) ══════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="block text-primary font-semibold text-sm mb-2 uppercase tracking-wider">
                ✅ {d.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl text-foreground section-title">
                {d.title}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl">{d.noViator}</p>
            </div>
            <Link
              href={`/${locale}/experiences`}
              className="hidden sm:flex items-center gap-1.5 text-primary font-semibold hover:brightness-110 transition-colors text-sm"
            >
              {c.seeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
            {CATEGORY_LIST.slice(0, 7).map((cat) => (
              <Link
                key={cat.key}
                href={`/${locale}/experiences?category=${cat.key}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-card hover:bg-accent/10 border border-border hover:border-accent rounded-full text-sm font-medium text-foreground/70 hover:text-accent-foreground min-h-[2.5rem] transition-all whitespace-nowrap"
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>

          {/* Place-card grid (bedimcode place pattern) */}
          {experiences.length === 0 ? (
            /* Fallback: category showcase using place-card overlay style */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {DISCOVER_CARDS.slice(0, 8).map((card) => (
                <Link
                  key={card.key}
                  href={`/${locale}/experiences?category=${card.key}`}
                  className="place-card tile-card h-56 sm:h-64 group"
                >
                  <Image
                    src={card.img}
                    alt={card.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="place-img object-cover"
                  />
                  <div className="place-overlay" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-base mb-0.5">{card.label}</h3>
                      <span className="text-white/70 text-xs">Morocco</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent group-hover:brightness-105 flex items-center justify-center transition-colors rounded-tl-xl">
                    <ArrowRight className="w-4 h-4 text-accent-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Real place cards from database */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {experiences.map((exp) => {
                const cat = CATEGORIES[exp.category as keyof typeof CATEGORIES];
                return (
                  <Link
                    key={exp.id}
                    href={`/${locale}/experiences/${exp.slug}`}
                    className="place-card tile-card h-60 sm:h-72 group"
                  >
                    {exp.images?.[0] ? (
                      <Image
                        src={exp.images[0]}
                        alt={exp.title}
                        fill
                        className="place-img object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-200 text-5xl">
                        {cat?.emoji}
                      </div>
                    )}
                    <div className="place-overlay" />

                    {/* Top: rating */}
                    <div className="absolute top-0 left-0 w-full flex items-start justify-between p-3">
                      {exp.avg_rating && (
                        <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {exp.avg_rating}
                        </span>
                      )}
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${cat?.bgColor ?? "bg-stone-100"} ml-auto`}>
                        {cat?.emoji}
                      </span>
                    </div>

                    {/* Bottom: info */}
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-1">{exp.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/70 text-xs">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.city}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exp.duration_hours}h</span>
                        </div>
                        <span className="text-white font-black text-sm">${exp.price_per_person}</span>
                      </div>
                    </div>

                    {/* Arrow button */}
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent group-hover:brightness-105 flex items-center justify-center transition-colors rounded-tl-xl">
                      <ArrowRight className="w-4 h-4 text-accent-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-border">
            <Link
              href={`/${locale}/experiences`}
              className="flex items-center gap-2 bg-primary hover:brightness-110 text-primary-foreground font-bold px-6 min-h-[3rem] rounded-xl transition-colors"
            >
              Browse all experiences <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Local operator CTA — no commission details shown here */}
            <div className="flex items-center gap-4 bg-accent/10 border border-accent/30 rounded-2xl px-6 py-4">
              <div>
                <p className="font-bold text-foreground text-sm">{d.operatorCta}</p>
                <p className="text-muted-foreground text-xs">List your experiences and reach international travelers.</p>
              </div>
              <Link
                href={`/${locale}/operators/register`}
                className="shrink-0 bg-accent hover:brightness-105 text-accent-foreground font-bold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap min-h-[2.5rem] inline-flex items-center"
              >
                List Free →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
