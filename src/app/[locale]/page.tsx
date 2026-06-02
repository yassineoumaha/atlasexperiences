import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import ExperiencesSection from "@/components/sections/ExperiencesSection";
import MarketplaceHero from "@/components/sections/MarketplaceHero";
import TrustSection from "@/components/sections/TrustSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TestimonialsStrip from "@/components/sections/TestimonialsStrip";
import StatsSection from "@/components/sections/StatsSection";
import { getDictionary } from "@/lib/dictionaries";
import { ZellijDivider } from "@/components/zellij/Zellij";
import { ScrollScene } from "@/components/sketch/ScrollScene";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <MarketplaceHero locale={locale as Locale} dict={dict} />

      <TrustSection dict={dict} />

      <ZellijDivider />

      {/* Stats — a wave swells and a surfer rides across */}
      <div className="relative overflow-hidden isolate bg-background">
        <ScrollScene scene="surf" direction="ltr" colorClass="text-foreground" />
        <div className="relative z-10"><StatsSection /></div>
      </div>

      <ZellijDivider />

      {/* Experiences — mountain biker climbs across the ridge */}
      <div className="relative overflow-hidden isolate bg-muted/30">
        <ScrollScene scene="adventure" direction="rtl" colorClass="text-foreground" />
        <div className="relative z-10"><ExperiencesSection locale={locale as Locale} dict={dict} /></div>
      </div>

      <ZellijDivider />

      <TestimonialsStrip
        title={dict.testimonials.title}
        subtitle={dict.testimonials.subtitle}
        featuredLabel={dict.testimonials.featured}
        featuredSub={dict.testimonials.featuredSub}
      />

      <NewsletterSection dict={dict} />
    </>
  );
}
