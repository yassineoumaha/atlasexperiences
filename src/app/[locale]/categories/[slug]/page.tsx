import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { listExperiences } from "@/lib/db";
import { CATEGORIES, EXPERIENCE_CITIES, type ExperienceCategory } from "@/lib/experiences-data";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { ExperienceCardTile } from "@/components/experience/ExperienceCardTile";
import { TrackView } from "@/components/analytics/TrackView";
import SchemaScript from "@/components/SchemaScript";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://imourig.com";

/** URL slugs map to internal category keys (kebab-case, human-friendly). */
const SLUG_TO_CATEGORY: Record<string, ExperienceCategory> = {
  "desert-tours": "desert",
  surfing: "surf",
  hiking: "adventure",
  "food-experiences": "food",
  "cultural-tours": "culture",
  "private-drivers": "transport",
  transfers: "transport",
  wellness: "wellness",
  "water-sports": "water",
  "photography-tours": "photography",
  "day-trips": "day-trip",
};

function categoryForSlug(slug: string): ExperienceCategory | null {
  return SLUG_TO_CATEGORY[slug] ?? (slug in CATEGORIES ? (slug as ExperienceCategory) : null);
}

export function generateStaticParams() {
  return Object.keys(SLUG_TO_CATEGORY).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryForSlug(slug);
  if (!cat) return {};
  const meta = CATEGORIES[cat];
  return {
    title: `${meta.label} in Morocco — Verified Operators | Imourig`,
    description: `${meta.description}. Book ${meta.label.toLowerCase()} in Morocco from Atlas-verified local operators, with transparent pricing and real reviews.`,
    alternates: { canonical: `${SITE_URL}/en/categories/${slug}` },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const cat = categoryForSlug(slug);
  if (!cat) notFound();

  const meta = CATEGORIES[cat];
  const [experiences, dict] = await Promise.all([
    listExperiences({ category: cat, sort: "recommended" }),
    getDictionary(locale as Locale),
  ]);
  const common = dict.common;

  const faqs = [
    {
      q: `Are ${meta.label.toLowerCase()} operators on Imourig verified?`,
      a: `Yes. Operators offering ${meta.label.toLowerCase()} are checked through Atlas verification — identity, business registration and tourism license — before they can list.`,
    },
    {
      q: `How do I book ${meta.label.toLowerCase()} in Morocco?`,
      a: `Browse the listings below, open an experience, and send a booking request directly to the operator. You pay nothing until the operator confirms.`,
    },
    {
      q: `Which cities offer ${meta.label.toLowerCase()}?`,
      a: `${meta.label} experiences are available across Morocco, including ${EXPERIENCE_CITIES.slice(0, 6).join(", ")} and more.`,
    },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${meta.label} in Morocco`,
      description: meta.description,
      numberOfItems: experiences.length,
      itemListElement: experiences.slice(0, 20).map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/${locale}/experiences/${e.slug}`,
        name: e.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <SchemaScript schema={schema} />
      <TrackView event="category_view" props={{ category: cat, slug }} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.30_0.10_264)] via-[oklch(0.34_0.10_280)] to-[oklch(0.40_0.12_40)] text-white py-16 px-4">
        <div className="zellij-bg absolute inset-0 opacity-[0.08] mix-blend-screen" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-3">{meta.emoji}</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">{meta.label} in Morocco</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">{meta.description} — from Atlas-verified local operators.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {experiences.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-4">No {meta.label.toLowerCase()} listed yet — new operators are joining all the time.</p>
            <Link href={`/${locale}/experiences`} className="text-primary font-semibold hover:underline">Browse all experiences →</Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-5">{experiences.length} verified {meta.label.toLowerCase()} experiences</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
              {experiences.map((exp) => (
                <ExperienceCardTile key={exp.id} exp={exp} locale={locale as Locale}
                  perPersonLabel={common.perPerson} bookLabel={common.book} featuredLabel={common.featured} />
              ))}
            </div>
          </>
        )}

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-foreground mb-5">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-card border border-border rounded-2xl p-5">
                <summary className="font-bold text-foreground cursor-pointer list-none flex justify-between items-center">
                  {f.q}<span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Internal links to destinations */}
        <section className="border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Popular destinations</h2>
          <div className="flex flex-wrap gap-2">
            {["Marrakech", "Agadir", "Essaouira", "Fez", "Merzouga", "Chefchaouen"].map((c) => (
              <Link key={c} href={`/${locale}/destinations/${c.toLowerCase()}`}
                className="text-sm bg-card border border-border rounded-full px-3.5 py-1.5 text-foreground/70 hover:border-primary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
