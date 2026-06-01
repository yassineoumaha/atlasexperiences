import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, CANCELLATION_LABELS } from "@/lib/experiences-data";
import { Star, Clock, Users, MapPin, CheckCircle, X, ArrowLeft, Globe, Phone, MessageCircle } from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any).from("experiences").select("title, description").eq("slug", slug).single() as { data: { title: string; description: string } | null; error: unknown };
    if (!data) return {};
    return { title: data.title, description: data.description?.slice(0, 155) };
  } catch { return {}; }
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let experience: any = null;
  let operator: any = null;
  let reviews: any[] = [];
  let related: any[] = [];

  try {
    const supabase = await createClient();
    const { data: exp } = await (supabase as unknown as any)
      .from("experiences")
      .select(`*, operators(*)`)
      .eq("slug", slug)
      .eq("published", true)
      .eq("approved", true)
      .single();

    if (!exp) notFound();
    experience = exp;
    operator = exp.operators;

    const [reviewsRes, relatedRes] = await Promise.all([
      supabase.from("experience_reviews").select("*").eq("experience_id", exp.id).eq("approved", true).order("created_at", { ascending: false }).limit(8),
      supabase.from("experiences").select("id, title, slug, category, city, price_per_person, images, avg_rating, duration_hours").eq("category", exp.category).eq("published", true).eq("approved", true).neq("id", exp.id).limit(4),
    ]);
    reviews = reviewsRes.data ?? [];
    related = relatedRes.data ?? [];
  } catch {
    notFound();
  }

  const cat = CATEGORIES[experience.category as keyof typeof CATEGORIES];

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Image gallery */}
      <div className="relative h-[50vh] min-h-[360px] bg-stone-100 overflow-hidden">
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
            {experience.avg_rating && (
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{experience.avg_rating} ({experience.review_count})</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-black text-stone-900 mb-3">About This Experience</h2>
              <p className="text-stone-600 leading-relaxed text-lg">{experience.description}</p>
            </div>

            {/* Highlights */}
            {experience.highlights?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-stone-900 mb-3">Highlights</h2>
                <ul className="space-y-2">
                  {experience.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-stone-700">
                      <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
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
                <h2 className="text-xl font-black text-stone-900 mb-3">What to Bring</h2>
                <div className="flex flex-wrap gap-2">
                  {experience.what_to_bring.map((item: string, i: number) => (
                    <span key={i} className="bg-stone-100 text-stone-700 text-sm px-3 py-1.5 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting point */}
            {experience.meeting_point && (
              <div className="flex items-start gap-3 bg-stone-50 border border-stone-100 rounded-2xl p-4">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-stone-900 mb-0.5">Meeting Point</h3>
                  <p className="text-stone-600 text-sm">{experience.meeting_point}</p>
                </div>
              </div>
            )}

            {/* Cancellation policy */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <h3 className="font-bold text-blue-900 mb-1">Cancellation Policy</h3>
              <p className="text-blue-700 text-sm">{CANCELLATION_LABELS[experience.cancellation] ?? experience.cancellation}</p>
            </div>

            {/* Operator profile */}
            {operator && (
              <div className="border border-stone-100 rounded-2xl p-5 shadow-sm">
                <h2 className="text-xl font-black text-stone-900 mb-4">Your Guide / Operator</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 text-2xl font-black shrink-0 overflow-hidden">
                    {operator.avatar_url
                      ? <Image src={operator.avatar_url} alt={operator.business_name} width={64} height={64} className="object-cover w-full h-full" />
                      : operator.business_name?.[0]
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-stone-900 text-lg">{operator.business_name}</h3>
                      {operator.verified && (
                        <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    {operator.city && <p className="text-stone-400 text-sm mb-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{operator.city}</p>}
                    {operator.bio && <p className="text-stone-600 text-sm mb-3">{operator.bio}</p>}
                    <div className="flex flex-wrap gap-2">
                      {operator.languages?.map((l: string) => (
                        <span key={l} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          <Globe className="w-3 h-3" /> {l}
                        </span>
                      ))}
                    </div>
                    {operator.slug && (
                      <Link href={`/${locale}/operators/${operator.slug}`}
                        className="inline-block mt-3 text-amber-600 text-sm font-semibold hover:underline">
                        View all experiences by {operator.business_name} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-stone-900">
                  Reviews {reviews.length > 0 && <span className="text-stone-400 font-normal">({reviews.length})</span>}
                </h2>
                {experience.avg_rating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-black text-stone-900">{experience.avg_rating}</span>
                    <span className="text-stone-400 text-sm">/ 5</span>
                  </div>
                )}
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />
                        ))}
                      </div>
                      {r.title && <h4 className="font-bold text-stone-900 mb-1">{r.title}</h4>}
                      <p className="text-stone-600 text-sm">{r.body}</p>
                      <p className="text-stone-400 text-xs mt-2">— {r.display_name} · {new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 text-sm bg-stone-50 rounded-xl p-4 text-center">No reviews yet — be the first to book!</p>
              )}
            </div>

            {/* Related experiences */}
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-stone-900 mb-4">Similar Experiences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((exp: any) => (
                    <Link key={exp.id} href={`/${locale}/experiences/${exp.slug}`}
                      className="flex gap-3 bg-stone-50 border border-stone-100 rounded-xl p-3 hover:border-amber-200 transition-colors group">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        {exp.images?.[0]
                          ? <Image src={exp.images[0]} alt={exp.title} fill className="object-cover" sizes="80px" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">{CATEGORIES[exp.category as keyof typeof CATEGORIES]?.emoji}</div>}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 text-sm line-clamp-2 group-hover:text-amber-600 transition-colors">{exp.title}</h4>
                        <p className="text-stone-400 text-xs mt-0.5">{exp.city} · {exp.duration_hours}h</p>
                        <p className="text-amber-600 font-black text-sm mt-1">${exp.price_per_person}<span className="text-stone-400 font-normal">/person</span></p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking widget sidebar */}
          <div>
            <BookingWidget experience={experience} operator={operator} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
