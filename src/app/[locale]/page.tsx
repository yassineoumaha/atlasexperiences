import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import ExperiencesSection from "@/components/sections/ExperiencesSection";
import MarketplaceHero from "@/components/sections/MarketplaceHero";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TestimonialsStrip from "@/components/sections/TestimonialsStrip";
import StatsSection from "@/components/sections/StatsSection";
import { getDictionary } from "@/lib/dictionaries";
import { ZellijDivider } from "@/components/zellij/Zellij";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <MarketplaceHero locale={locale as Locale} dict={dict} />
      <StatsSection />
      <ZellijDivider />
      <ExperiencesSection locale={locale as Locale} dict={dict} />
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
