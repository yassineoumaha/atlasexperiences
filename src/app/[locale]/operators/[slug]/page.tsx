import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MapPin, Clock, Star, Globe, MessageCircle, Mail, Calendar } from "lucide-react";
import { getOperatorBySlug, getOperatorMeta } from "@/lib/db";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { VerifiedBadge } from "@/components/operator/VerifiedBadge";
import { ExperienceCardTile } from "@/components/experience/ExperienceCardTile";
import { TrackView } from "@/components/analytics/TrackView";
import SchemaScript from "@/components/SchemaScript";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const op = await getOperatorMeta(slug);
  if (!op) return {};
  const where = op.city ? ` in ${op.city}` : "";
  return {
    title: `${op.business_name} — Verified Morocco Operator${where} | Imourig`,
    description: op.bio?.slice(0, 155) ?? `Book verified experiences with ${op.business_name}${where} on Imourig.`,
  };
}

export default async function OperatorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const [operator, dict] = await Promise.all([
    getOperatorBySlug(slug),
    getDictionary(locale as Locale),
  ]);
  if (!operator) notFound();

  const common = dict.common;
  const liveCount = operator.experiences.length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: operator.business_name,
    description: operator.bio ?? undefined,
    image: operator.cover_url ?? operator.avatar_url ?? undefined,
    address: operator.city ? { "@type": "PostalAddress", addressLocality: operator.city, addressCountry: "MA" } : undefined,
    aggregateRating:
      operator.avg_rating && operator.review_count
        ? { "@type": "AggregateRating", ratingValue: operator.avg_rating, reviewCount: operator.review_count }
        : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <SchemaScript schema={schema} />
      <TrackView event="operator_profile_view" props={{ slug, verified: operator.verified }} />

      {/* Cover */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-muted">
        {operator.cover_url ? (
          <Image src={operator.cover_url} alt={operator.business_name} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.30_0.10_264)] via-[oklch(0.34_0.10_280)] to-[oklch(0.40_0.12_40)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Identity header — pulled up over the cover */}
        <div className="relative -mt-16 mb-10 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-28 h-28 rounded-3xl bg-card border-4 border-card shadow-xl flex items-center justify-center text-4xl font-black text-accent-foreground overflow-hidden shrink-0">
            {operator.avatar_url
              ? <Image src={operator.avatar_url} alt={operator.business_name} width={112} height={112} className="object-cover w-full h-full" />
              : operator.business_name[0]}
          </div>

          <div className="flex-1 pt-2 sm:pt-16">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground">{operator.business_name}</h1>
              {operator.verified && <VerifiedBadge size="md" />}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
              {operator.city && <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{operator.city}</span>}
              {operator.avg_rating && operator.review_count > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-foreground">{operator.avg_rating.toFixed(1)}</span>
                  <span>({operator.review_count} reviews)</span>
                </span>
              ) : null}
              {(operator.years_experience || operator.founded_year) && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {operator.years_experience
                    ? `${operator.years_experience} yrs operating`
                    : `Since ${operator.founded_year}`}
                </span>
              )}
              {operator.response_time && (
                <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />Responds {operator.response_time}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main: bio + experiences */}
          <div className="lg:col-span-2 space-y-8">
            {operator.bio && (
              <section>
                <h2 className="text-xl font-black text-foreground mb-3">About</h2>
                <p className="text-foreground/75 leading-relaxed whitespace-pre-line">{operator.bio}</p>
              </section>
            )}

            <section>
              <h2 className="text-xl font-black text-foreground mb-4">
                Experiences offered {liveCount > 0 && <span className="text-muted-foreground font-normal">({liveCount})</span>}
              </h2>
              {liveCount === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
                  <p>This operator has no live experiences right now. Check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {operator.experiences.map((exp) => (
                    <ExperienceCardTile
                      key={exp.id}
                      exp={exp}
                      locale={locale as Locale}
                      showOperator={false}
                      perPersonLabel={common.perPerson}
                      bookLabel={common.book}
                      featuredLabel={common.featured}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: trust + contact */}
          <aside className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-foreground mb-3">Contact operator</h3>
              <div className="space-y-2">
                {operator.whatsapp && (
                  <a
                    href={`https://wa.me/${operator.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                )}
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center justify-center gap-2 border border-input text-foreground/80 hover:bg-muted font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" /> Send a message
                </Link>
              </div>
            </div>

            {operator.service_regions && operator.service_regions.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-foreground mb-3">Service regions</h3>
                <div className="flex flex-wrap gap-2">
                  {operator.service_regions.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 text-xs bg-muted text-foreground/70 px-2.5 py-1 rounded-full">
                      <MapPin className="w-3 h-3" /> {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {operator.languages && operator.languages.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-foreground mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {operator.languages.map((l) => (
                    <span key={l} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                      <Globe className="w-3 h-3" /> {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {operator.verified && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <VerifiedBadge size="sm" className="mb-2" />
                <p className="text-emerald-800/80 text-xs leading-relaxed">
                  Atlas verified this operator&apos;s identity, business registration and tourism license.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
