import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { listExperiences } from "@/lib/db";
import { EXPERIENCE_CITIES, CATEGORY_LIST } from "@/lib/experiences-data";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { ExperienceCardTile } from "@/components/experience/ExperienceCardTile";
import { TrackView } from "@/components/analytics/TrackView";
import SchemaScript from "@/components/SchemaScript";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://imourig.com";

/** Resolve a URL city slug (lowercased, hyphenated) to the canonical city name. */
function cityForSlug(slug: string): string | null {
  const norm = slug.toLowerCase().replace(/-/g, " ");
  return EXPERIENCE_CITIES.find((c) => c.toLowerCase() === norm) ?? null;
}

const FEATURED_DESTINATIONS = ["Marrakech", "Agadir", "Essaouira", "Fez", "Merzouga", "Chefchaouen", "Tangier", "Ouarzazate"];

export function generateStaticParams() {
  return FEATURED_DESTINATIONS.map((c) => ({ city: c.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const name = cityForSlug(city);
  if (!name) return {};
  return {
    title: `Things to Do in ${name}, Morocco — Verified Operators | Imourig`,
    description: `Discover and book the best experiences in ${name} from Atlas-verified local operators — tours, activities and adventures with transparent pricing and real reviews.`,
    alternates: { canonical: `${SITE_URL}/en/destinations/${city}` },
  };
}

export default async function DestinationLandingPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  if (!hasLocale(locale)) notFound();
  const name = cityForSlug(city);
  if (!name) notFound();

  const [experiences, dict] = await Promise.all([
    listExperiences({ city: name, sort: "recommended" }),
    getDictionary(locale as Locale),
  ]);
  const common = dict.common;

  // Categories that actually have inventory in this city (for internal links).
  const presentCategories = [...new Set(experiences.map((e) => e.category))];

  const faqs = [
    {
      q: `What are the best things to do in ${name}?`,
      a: `${name} offers a range of verified experiences on Imourig — browse the listings below, all from Atlas-verified local operators.`,
    },
    {
      q: `Are the operators in ${name} verified?`,
      a: `Every operator listing experiences in ${name} passes Atlas verification: identity, business registration and tourism license.`,
    },
    {
      q: `Do I pay when I book in ${name}?`,
      a: `You send a booking request to the operator and pay nothing until they confirm. Pricing is shown transparently up front.`,
    },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Things to do in ${name}`,
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
      <TrackView event="destination_view" props={{ city: name }} />

      <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.30_0.10_264)] via-[oklch(0.34_0.10_280)] to-[oklch(0.40_0.12_40)] text-white py-16 px-4">
        <div className="zellij-bg absolute inset-0 opacity-[0.08] mix-blend-screen" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Things to Do in {name}</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">Verified-operator experiences in {name}, Morocco — book directly, pay nothing until confirmed.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {experiences.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-4">No experiences listed in {name} yet — check back soon.</p>
            <Link href={`/${locale}/experiences`} className="text-primary font-semibold hover:underline">Browse all experiences →</Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-5">{experiences.length} verified experiences in {name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
              {experiences.map((exp) => (
                <ExperienceCardTile key={exp.id} exp={exp} locale={locale as Locale}
                  perPersonLabel={common.perPerson} bookLabel={common.book} featuredLabel={common.featured} />
              ))}
            </div>
          </>
        )}

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

        {/* Internal links to categories present in this city */}
        {presentCategories.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Browse {name} by category</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LIST.filter((c) => presentCategories.includes(c.key)).map((c) => (
                <Link key={c.key} href={`/${locale}/experiences?category=${c.key}&city=${name}`}
                  className="text-sm bg-card border border-border rounded-full px-3.5 py-1.5 text-foreground/70 hover:border-primary transition-colors">
                  {c.emoji} {c.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
