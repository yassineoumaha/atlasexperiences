import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, CATEGORY_LIST, EXPERIENCE_CITIES } from "@/lib/experiences-data";
import { Star, Clock, Users, MapPin } from "lucide-react";
import SchemaScript from "@/components/SchemaScript";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";

export const metadata: Metadata = {
  title: "Morocco Experiences & Activities — Book Local Experts",
  description:
    "Book authentic Morocco experiences directly from local experts. Surf lessons, Sahara tours, cooking classes, hammam, hiking and more — 100% verified local operators.",
  keywords: ["Morocco activities", "Morocco experiences", "Morocco tours", "surf lessons Morocco", "Sahara tour", "Morocco cooking class"],
};

async function getExperiences(category?: string, city?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("experiences")
      .select(`*, operators(business_name, avatar_url, verified, slug, avg_rating, ranking_score)`)
      .eq("published", true)
      .eq("approved", true)
      .order("featured", { ascending: false })
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .order("total_bookings", { ascending: false });
    if (category && category !== "all") query = query.eq("category", category);
    if (city) query = query.eq("city", city);
    const { data } = await query.limit(48);
    return data ?? [];
  } catch { return []; }
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
  searchParams: Promise<{ category?: string; city?: string }>;
}) {
  const { locale } = await params;
  const { category, city } = await searchParams;
  const [experiences, dict] = await Promise.all([
    getExperiences(category, city),
    getDictionary(locale as Locale),
  ]);
  const d = dict.experiences;
  const common = dict.common;

  return (
    <div className="pt-16 min-h-screen bg-white">
      <SchemaScript schema={schema} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm px-4 py-1.5 rounded-full mb-5">
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
                !category ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              🌍 {dict.hero.searchCategory}
            </Link>
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.key}
                href={`/${locale}/experiences?category=${cat.key}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  category === cat.key ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* City filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/${locale}/experiences${category ? `?category=${category}` : ""}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${!city ? "bg-amber-500 text-white border-amber-500" : "text-stone-500 border-stone-200 hover:border-amber-300"}`}>
            {dict.hero.searchCity}
          </Link>
          {EXPERIENCE_CITIES.map((c) => (
            <Link key={c}
              href={`/${locale}/experiences?${category ? `category=${category}&` : ""}city=${c}`}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${city === c ? "bg-amber-500 text-white border-amber-500" : "text-stone-500 border-stone-200 hover:border-amber-300"}`}>
              {c}
            </Link>
          ))}
        </div>

        {/* Results */}
        {experiences.length === 0 ? (
          <div className="text-center py-20">
            <img src="/logo.png" alt="Imourig" className="h-14 w-auto mx-auto mb-4 [mix-blend-mode:multiply]" />
            <h2 className="text-xl font-black text-stone-900 mb-2">{d.noResults}</h2>
            <p className="text-stone-500 mb-6">{d.noResultsSub}</p>
            <Link href={`/${locale}/operators/register`}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              {d.listCta}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-stone-500 text-sm mb-5">
              {experiences.length} {experiences.length !== 1 ? d.countPlural : d.count} {d.found}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {experiences.map((exp: any) => (
                <Link key={exp.id} href={`/${locale}/experiences/${exp.slug}`}
                  className="group bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
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
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {common.featured}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-black text-stone-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                      <MapPin className="w-3 h-3" /> {exp.city}
                      <span>·</span>
                      <Clock className="w-3 h-3" /> {exp.duration_hours}h
                      <span>·</span>
                      <Users className="w-3 h-3" /> max {exp.max_group_size}
                    </div>
                    {exp.avg_rating && exp.review_count > 0 && (
                      <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-stone-700">{exp.avg_rating}</span>
                        <span>({exp.review_count})</span>
                      </div>
                    )}
                    {exp.operators && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                        <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xs">
                          {exp.operators.business_name?.[0]}
                        </div>
                        {exp.operators.business_name}
                        {exp.operators.verified && <span className="text-emerald-500">✓</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-black text-stone-900">${exp.price_per_person}</span>
                        <span className="text-stone-400 text-xs">{common.perPerson}</span>
                      </div>
                      <span className="bg-amber-500 group-hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
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
        <div className="mt-16 bg-gradient-to-r from-stone-900 to-amber-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-1">{d.operatorCta}</h3>
            <p className="text-white/70">{d.operatorCtaSub}</p>
          </div>
          <Link href={`/${locale}/operators/register`}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
            {d.listBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
