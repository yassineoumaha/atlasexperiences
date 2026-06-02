"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Sparkles, MapPin, Star, Wand2, BadgeCheck } from "lucide-react";
import { planTripAction } from "@/app/actions/plan";
import { CATEGORY_LIST, EXPERIENCE_CITIES, type ExperienceCategory } from "@/lib/experiences-data";
import { track } from "@/lib/analytics";
import type { Itinerary, TravelStyle } from "@/lib/trip-planner";
import type { Locale } from "@/lib/dictionaries";

const STYLES: { key: TravelStyle; label: string; hint: string }[] = [
  { key: "budget", label: "Budget", hint: "Stretch every dirham" },
  { key: "balanced", label: "Balanced", hint: "A bit of everything" },
  { key: "premium", label: "Premium", hint: "Comfort & top operators" },
];

export function TripPlannerClient({ locale }: { locale: Locale }) {
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState(800);
  const [arrivalCity, setArrivalCity] = useState("Marrakech");
  const [style, setStyle] = useState<TravelStyle>("balanced");
  const [interests, setInterests] = useState<ExperienceCategory[]>(["desert", "culture"]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleInterest(c: ExperienceCategory) {
    setInterests((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function onGenerate() {
    setError(null);
    track("trip_plan_generate", { days, budget, arrival: arrivalCity, style, interests: interests.join(",") });
    startTransition(async () => {
      const res = await planTripAction({ days, budgetUsd: budget, interests, arrivalCity, style });
      if (res.error) { setError(res.error); setItinerary(null); }
      else { setItinerary(res.itinerary); }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Inputs */}
      <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
        <h2 className="font-black text-foreground text-lg mb-5 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-accent" /> Your trip
        </h2>

        {/* Days */}
        <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Days: <span className="text-accent">{days}</span></label>
        <input type="range" min={1} max={21} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full mb-5 accent-[var(--accent)]" />

        {/* Budget */}
        <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Budget (USD): <span className="text-accent">${budget}</span></label>
        <input type="range" min={100} max={5000} step={50} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mb-5 accent-[var(--accent)]" />

        {/* Arrival city */}
        <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Arrival city</label>
        <select value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)} className="w-full mb-5 rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          {EXPERIENCE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Style */}
        <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Travel style</label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {STYLES.map((s) => (
            <button key={s.key} type="button" onClick={() => setStyle(s.key)}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-colors ${style === s.key ? "border-accent bg-accent/10 text-accent-foreground" : "border-border text-foreground/70 hover:border-accent/50"}`}
              title={s.hint}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Interests */}
        <label className="block text-sm font-semibold text-foreground/80 mb-2">Interests</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORY_LIST.map((c) => (
            <button key={c.key} type="button" onClick={() => toggleInterest(c.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${interests.includes(c.key) ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/70 hover:border-primary"}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <button type="button" onClick={onGenerate} disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:brightness-105 text-accent-foreground font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-60">
          <Sparkles className="w-4 h-4" /> {isPending ? "Building your trip…" : "Plan My Morocco Trip"}
        </button>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        {!itinerary ? (
          <div className="border border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
            <Sparkles className="w-10 h-10 mb-3 opacity-40" />
            <p className="font-medium">Set your preferences and we&apos;ll build a day-by-day plan from verified operators.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Summary */}
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground">Estimated activities cost</p>
                <p className="text-2xl font-black text-foreground">${itinerary.totalEstimate}
                  <span className={`ml-2 text-xs font-semibold ${itinerary.withinBudget ? "text-emerald-600" : "text-orange-600"}`}>
                    {itinerary.withinBudget ? "within budget" : "over budget"}
                  </span>
                </p>
              </div>
              {itinerary.verifiedShare > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">
                  <BadgeCheck className="w-4 h-4" /> {Math.round(itinerary.verifiedShare * 100)}% verified operators
                </span>
              )}
            </div>

            {itinerary.days.map((day) => (
              <div key={day.day} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-black flex items-center justify-center">{day.day}</span>
                  <h3 className="font-black text-foreground flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" />{day.city}</h3>
                </div>
                {day.items.length === 0 ? (
                  <p className="text-muted-foreground text-sm pl-9">Free day — explore {day.city} at your own pace.</p>
                ) : (
                  <div className="space-y-2 pl-9">
                    {day.items.map((item) => (
                      <Link key={item.id} href={`/${locale}/experiences/${item.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 hover:border-accent/50 transition-colors group">
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            {item.operatorName}
                            {item.operatorVerified && <BadgeCheck className="w-3 h-3 text-emerald-500" />}
                            <span>·</span>{item.durationHours}h
                          </p>
                        </div>
                        <span className="font-black text-foreground text-sm shrink-0">${item.pricePerPerson}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link href={`/${locale}/experiences`} className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
              <Star className="w-4 h-4" /> Browse all experiences →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
