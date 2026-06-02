import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { TripPlannerClient } from "./TripPlannerClient";

export const metadata: Metadata = {
  title: "Plan My Morocco Trip — AI Itinerary from Verified Operators | Imourig",
  description:
    "Tell us your days, budget and interests and we'll build a day-by-day Morocco itinerary from verified local operators — desert, surf, culture, food and more.",
};

export default async function PlanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.30_0.10_264)] via-[oklch(0.34_0.10_280)] to-[oklch(0.40_0.12_40)] text-white py-16 px-4">
        <div className="zellij-bg absolute inset-0 opacity-[0.08] mix-blend-screen" aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Plan My Morocco Trip</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            A day-by-day itinerary built from real, verified-operator inventory — tuned to your days, budget and interests.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TripPlannerClient locale={locale as Locale} />
      </div>
    </div>
  );
}
