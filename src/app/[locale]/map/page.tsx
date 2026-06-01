import type { Metadata } from "next";
import MoroccoMap from "@/components/sections/MoroccoMap";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Interactive Morocco Map — Explore Cities & Regions",
  description:
    "Explore Morocco interactively. Hover over any city to discover climate, activities, best season, and local tips. Click to browse experiences.",
};

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  return <MoroccoMap locale={locale} dict={dict.map} />;
}
