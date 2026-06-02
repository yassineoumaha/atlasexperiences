import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import ExperiencesSection from "@/components/sections/ExperiencesSection";
import MarketplaceHero from "@/components/sections/MarketplaceHero";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TestimonialsStrip from "@/components/sections/TestimonialsStrip";
import StatsSection from "@/components/sections/StatsSection";
import { getDictionary } from "@/lib/dictionaries";
import { ZellijDivider } from "@/components/zellij/Zellij";
import { ScrollSketch } from "@/components/sketch/ScrollSketch";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <MarketplaceHero locale={locale as Locale} dict={dict} />

      {/* Stats — surfer sketch drifting behind */}
      <div className="relative overflow-hidden">
        <ScrollSketch sketch="surf" side="right" colorClass="text-primary" className="opacity-[0.07] dark:opacity-[0.12]" />
        <StatsSection />
      </div>

      <ZellijDivider />

      {/* Experiences — biker + hiker sketches */}
      <div className="relative overflow-hidden">
        <ScrollSketch sketch="adventure" side="left" colorClass="text-terracotta" className="opacity-[0.07] dark:opacity-[0.12]" />
        <ScrollSketch sketch="hiking" side="right" colorClass="text-secondary" className="opacity-[0.06] dark:opacity-[0.11] top-[78%]" />
        <ExperiencesSection locale={locale as Locale} dict={dict} />
      </div>

      <ZellijDivider />

      <div className="relative overflow-hidden">
        <ScrollSketch sketch="desert" side="left" colorClass="text-accent" className="opacity-[0.06] dark:opacity-[0.12]" />
        <TestimonialsStrip
          title={dict.testimonials.title}
          subtitle={dict.testimonials.subtitle}
          featuredLabel={dict.testimonials.featured}
          featuredSub={dict.testimonials.featuredSub}
        />
      </div>

      <NewsletterSection dict={dict} />
    </>
  );
}
