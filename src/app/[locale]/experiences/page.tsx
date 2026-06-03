import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { listExperiences, type ExperienceFilters, type ExperienceSort } from "@/lib/db";
import {
  CATEGORIES, CATEGORY_LIST, EXPERIENCE_CITIES,
  DURATION_BUCKETS, PRICE_BUCKETS,
} from "@/lib/experiences-data";
import { Star, Clock, Users, MapPin } from "lucide-react";
import SchemaScript from "@/components/SchemaScript";
import { DiscoveryFilters } from "@/components/experience/DiscoveryFilters";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { ScrollScene } from "@/components/sketch/ScrollScene";
import { SCENES, type SceneKey } from "@/components/sketch/scenes";

function sceneFor(category?: string): SceneKey {
  if (category && category in SCENES) return category as SceneKey;
  return "desert";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Morocco Experiences & Activities — Book Local Experts",
    description:
      "Book authentic Morocco experiences directly from local experts. Surf lessons, Sahara tours, cooking classes, hammam, hiking and more — 100% verified local operators.",
    keywords: ["Morocco activities", "Morocco experiences", "Morocco tours", "surf lessons Morocco", "Sahara tour", "Morocco cooking class"],
    alternates: { canonical: `/${locale}/experiences` },
  };
}

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Morocco Experiences & Activities",
  description: "Book authentic Morocco experiences from verified local operators.",
};

export default async function ExperiencesPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string; city?: string;
    duration?: string; price?: string; language?: string;
    verified?: string; sort?: string;
  }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const sp = await searchParams;
  const { category, city } = sp;

  // Map URL buckets → concrete numeric filters for the data layer.
  const durationBucket = DURATION_BUCKETS.find((b) => b.key === sp.duration);
  const priceBucket = PRICE_BUCKETS.find((b) => b.key === sp.price);
  const validSorts: ExperienceSort[] = ["recommended", "rated", "popular", "newest"];

  const filters: ExperienceFilters = {
    category,
    city,
    maxDuration: durationBucket && durationBucket.maxHours < 9999 ? durationBucket.maxHours : undefined,
    minPrice: priceBucket?.min,
    maxPrice: priceBucket?.max,
    language: sp.language || undefined,
    verifiedOnly: sp.verified === "1",
    sort: validSorts.includes(sp.sort as ExperienceSort) ? (sp.sort as ExperienceSort) : "recommended",
  };

  const [experiences, dict] = await Promise.all([
    listExperiences(filters),
    getDictionary(locale as Locale),
  ]);
  const d = dict.experiences;
  const common = dict.common;
  const f = dict.filters;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <SchemaScript schema={schema} />

      {/* Hero — context-aware living scene for the chosen category */}
      <div className="relative overflow-hidden isolate bg-gradient-to-br from-[oklch(0.30_0.10_264)] via-[oklch(0.34_0.10_280)] to-[oklch(0.40_0.12_40)] text-white py-20 px-4">
        <div className="zellij-bg absolute inset-0 opacity-[0.08] mix-blend-screen" aria-hidden="true" />
        <ScrollScene scene={sceneFor(category)} direction="ltr" colorClass="text-white" mode="intro" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-amber-200 text-sm px-4 py-1.5 rounded-full mb-5">
            ✅ {d.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">{d.title}</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">{d.noViator}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Category filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            <Link
              href={`/${locale}/experiences`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                !category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground/70 border-border hover:border-primary"
              }`}
            >
              🌍 {dict.hero.searchCategory}
            </Link>
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.key}
                href={`/${locale}/experiences?category=${cat.key}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  category === cat.key ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground/70 border-border hover:border-primary"
                }`}
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* City filter — horizontal scroll on mobile, wrap on desktop */}
        <div className="flex md:flex-wrap gap-2 mb-8 overflow-x-auto md:overflow-visible no-scrollbar pb-1">
          <Link href={`/${locale}/experiences${category ? `?category=${category}` : ""}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!city ? "bg-accent text-accent-foreground border-accent" : "text-muted-foreground border-border hover:border-accent"}`}>
            {dict.hero.searchCity}
          </Link>
          {EXPERIENCE_CITIES.map((c) => (
            <Link key={c}
              href={`/${locale}/experiences?${category ? `category=${category}&` : ""}city=${c}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${city === c ? "bg-accent text-accent-foreground border-accent" : "text-muted-foreground border-border hover:border-accent"}`}>
              {c}
            </Link>
          ))}
        </div>

        {/* Advanced discovery filters + sort */}
        <DiscoveryFilters
          labels={{
            filters: f.filters,
            verifiedOnly: f.verifiedOnly,
            sortBy: f.sortBy,
            clear: f.clear,
            duration: f.duration,
            price: f.price,
            language: f.language,
            any: f.any,
          }}
        />

        {/* Results */}
        {experiences.length === 0 ? (
          <div className="text-center py-20">
            <Image src="/logo.png" alt="Imourig" width={1066} height={320} className="h-14 w-auto mx-auto mb-4" />
            <h2 className="text-xl font-black text-foreground mb-2">{d.noResults}</h2>
            <p className="text-muted-foreground mb-6">{d.noResultsSub}</p>
            <Link href={`/${locale}/operators/register`}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              {d.listCta}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-5">
              {experiences.length} {experiences.length !== 1 ? d.countPlural : d.count} {d.found}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {experiences.map((exp) => (
                <Link key={exp.id} href={`/${locale}/experiences/${exp.slug}`}
                  className="group tile-card bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {exp.images?.[0] ? (
                      <Image src={exp.images[0]} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {CATEGORIES[exp.category as keyof typeof CATEGORIES]?.emoji ?? "✨"}
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${CATEGORIES[exp.category as keyof typeof CATEGORIES]?.bgColor}`}>
                      {CATEGORIES[exp.category as keyof typeof CATEGORIES]?.emoji} {CATEGORIES[exp.category as keyof typeof CATEGORIES]?.label}
                    </div>
                    {exp.featured && (
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                        {common.featured}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-black text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" /> {exp.city}
                      <span>·</span>
                      <Clock className="w-3 h-3" /> {exp.duration_hours}h
                      <span>·</span>
                      <Users className="w-3 h-3" /> max {exp.max_group_size}
                    </div>
                    {exp.avg_rating && exp.review_count > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-foreground">{exp.avg_rating}</span>
                        <span>({exp.review_count})</span>
                      </div>
                    )}
                    {exp.operators && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <div className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center text-accent-foreground font-bold text-xs">
                          {exp.operators.business_name?.[0]}
                        </div>
                        {exp.operators.business_name}
                        {exp.operators.verified && <span className="text-emerald-500">✓</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-black text-foreground">${exp.price_per_person}</span>
                        <span className="text-muted-foreground text-xs">{common.perPerson}</span>
                      </div>
                      <span className="bg-accent group-hover:brightness-105 text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        {common.book}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Operator CTA banner */}
        <div className="mt-16 bg-gradient-to-r from-[oklch(0.30_0.10_264)] to-[oklch(0.40_0.12_40)] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-1">{d.operatorCta}</h3>
            <p className="text-white/70">{d.operatorCtaSub}</p>
          </div>
          <Link href={`/${locale}/operators/register`}
            className="shrink-0 bg-accent hover:brightness-105 text-accent-foreground font-bold px-6 min-h-[3rem] inline-flex items-center rounded-xl transition-colors whitespace-nowrap">
            {d.listBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
