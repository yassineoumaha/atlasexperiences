import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getExperienceBySlug, getExperienceMeta } from "@/lib/db";
import { CATEGORIES, CANCELLATION_LABELS } from "@/lib/experiences-data";
import { Star, Clock, Users, MapPin, CheckCircle, X, ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/dictionaries";
import BookingWidget from "@/components/BookingWidget";
import { OperatorCard } from "@/components/operator/OperatorCard";
import { ScrollScene } from "@/components/sketch/ScrollScene";
import { SCENES, type SceneKey } from "@/components/sketch/scenes";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getExperienceMeta(slug);
  if (!data) return {};
  const description = data.description?.slice(0, 200);
  const ogImage = data.images?.[0];
  return {
    title: data.title,
    description,
    alternates: { canonical: `/${locale}/experiences/${slug}` },
    openGraph: {
      title: `${data.title} | Imourig`,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage, alt: data.title }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: `${data.title} | Imourig`,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const result = await getExperienceBySlug(slug);
  if (!result) notFound();
  const { experience, reviews, related } = result;
  const operator = experience.operators;

  const cat = CATEGORIES[experience.category as keyof typeof CATEGORIES];
  const scene: SceneKey = (experience.category in SCENES ? experience.category : "desert") as SceneKey;

  return (
    <div className="relative pt-16 min-h-screen bg-background pb-24 lg:pb-0 overflow-hidden isolate">
      {/* Context-aware living scene for this experience's activity */}
      <ScrollScene scene={scene} direction="ltr" colorClass="text-foreground" mode="intro" />
      {/* Image gallery */}
      <div className="relative z-10 h-[50vh] min-h-[360px] bg-muted overflow-hidden">
        {experience.images?.[0] ? (
          <Image src={experience.images[0]} alt={experience.title} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">{cat?.emoji}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-7xl mx-auto">
          <Link href={`/${locale}/experiences`} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Experiences
          </Link>
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit mb-2 border ${cat?.bgColor}`}>
            {cat?.emoji} {cat?.label}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{experience.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{experience.city}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{experience.duration_hours} hours</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {experience.max_group_size} people</span>
            {experience.avg_rating && experience.review_count > 0 ? (
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{experience.avg_rating} ({experience.review_count})</span>
            ) : (
              <span className="text-white/60">New experience</span>
            )}
          </div>
        </div>
        {/* Thumbnail strip */}
        {experience.images?.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {experience.images.slice(1, 4).map((img: string, i: number) => (
              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-white/50">
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </div>
            ))}
            {experience.images.length > 4 && (
              <div className="w-14 h-14 rounded-lg bg-black/50 flex items-center justify-center text-white text-xs font-bold border-2 border-white/50">
                +{experience.images.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-black text-foreground mb-3">About This Experience</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">{experience.description}</p>
            </div>

            {/* Highlights */}
            {experience.highlights?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-foreground mb-3">Highlights</h2>
                <ul className="space-y-2">
                  {experience.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-foreground/80">
                      <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's included / not included */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {experience.includes?.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                  <h3 className="font-black text-emerald-900 mb-3">Included</h3>
                  <ul className="space-y-1.5">
                    {experience.includes.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-emerald-700 text-sm">
                        <CheckCircle className="w-4 h-4 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {experience.excludes?.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <h3 className="font-black text-red-900 mb-3">Not Included</h3>
                  <ul className="space-y-1.5">
                    {experience.excludes.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-red-600 text-sm">
                        <X className="w-4 h-4 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* What to bring */}
            {experience.what_to_bring?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-foreground mb-3">What to Bring</h2>
                <div className="flex flex-wrap gap-2">
                  {experience.what_to_bring.map((item: string, i: number) => (
                    <span key={i} className="bg-muted text-foreground/80 text-sm px-3 py-1.5 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting point */}
            {experience.meeting_point && (
              <div className="flex items-start gap-3 bg-muted border border-border rounded-2xl p-4">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-0.5">Meeting Point</h3>
                  <p className="text-foreground/70 text-sm">{experience.meeting_point}</p>
                </div>
              </div>
            )}

            {/* Cancellation policy */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <h3 className="font-bold text-blue-900 mb-1">Cancellation Policy</h3>
              <p className="text-blue-700 text-sm">{CANCELLATION_LABELS[experience.cancellation] ?? experience.cancellation}</p>
            </div>

            {/* Operator profile — who delivers this experience (not Atlas) */}
            {operator && <OperatorCard operator={operator} locale={locale as Locale} />}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-stone-900">
                  Reviews {reviews.length > 0 && <span className="text-muted-foreground font-normal">({reviews.length})</span>}
                </h2>
                {experience.avg_rating && experience.review_count > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-black text-foreground">{experience.avg_rating}</span>
                    <span className="text-muted-foreground text-sm">/ 5</span>
                  </div>
                )}
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-muted border border-border rounded-2xl p-4">
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      {r.title && <h4 className="font-bold text-foreground mb-1">{r.title}</h4>}
                      <p className="text-foreground/80 text-sm">{r.body}</p>
                      <p className="text-muted-foreground text-xs mt-2">— {r.display_name} · {new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm bg-muted rounded-xl p-4 text-center">No reviews yet — be the first to book!</p>
              )}
            </div>

            {/* Related experiences */}
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-foreground mb-4">Similar Experiences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((exp) => (
                    <Link key={exp.id} href={`/${locale}/experiences/${exp.slug}`}
                      className="flex gap-3 bg-muted border border-border rounded-xl p-3 hover:border-accent transition-colors group">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {exp.images?.[0]
                          ? <Image src={exp.images[0]} alt={exp.title} fill className="object-cover" sizes="80px" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">{CATEGORIES[exp.category as keyof typeof CATEGORIES]?.emoji}</div>}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">{exp.title}</h4>
                        <p className="text-muted-foreground text-xs mt-0.5">{exp.city} · {exp.duration_hours}h</p>
                        <p className="text-primary font-black text-sm mt-1">${exp.price_per_person}<span className="text-muted-foreground font-normal">/person</span></p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking widget sidebar */}
          <div id="book">
            <BookingWidget experience={experience} operator={operator} locale={locale} />
          </div>
        </div>
      </div>

      {/* Sticky mobile booking bar */}
      <div className="sticky-mobile-bar lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 py-3 pb-safe flex items-center justify-between gap-4">
        <div>
          <span className="text-xl font-black text-foreground">${experience.price_per_person}</span>
          <span className="text-muted-foreground text-xs"> / person</span>
        </div>
        <a
          href="#book"
          className="flex-1 max-w-[14rem] text-center bg-accent hover:brightness-105 text-accent-foreground font-bold min-h-[3rem] inline-flex items-center justify-center rounded-xl transition-all"
        >
          Request to Book
        </a>
      </div>
    </div>
  );
}
