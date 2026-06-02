import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceRow, OperatorRow } from "@/lib/supabase/types";
import type { ExperienceCategory } from "@/lib/experiences-data";

/**
 * Trip-planner engine — "Plan My Morocco Trip".
 *
 * This is the rules-based v1: a deterministic itinerary builder that draws
 * exclusively from real marketplace inventory and prioritizes verified
 * operators. The public entry point `generateItinerary` is intentionally the
 * only seam the UI depends on, so a later OpenAI-backed planner can replace
 * the body (same input/output contract) without touching callers.
 */

export type TravelStyle = "budget" | "balanced" | "premium";

export interface TripInput {
  days: number;
  budgetUsd: number;
  interests: ExperienceCategory[];
  arrivalCity: string;
  style: TravelStyle;
}

export interface ItineraryItem {
  id: string;
  title: string;
  slug: string;
  city: string;
  category: string;
  durationHours: number;
  pricePerPerson: number;
  image: string | null;
  operatorName: string | null;
  operatorVerified: boolean;
}

export interface ItineraryDay {
  day: number;
  city: string;
  items: ItineraryItem[];
}

export interface Itinerary {
  days: ItineraryDay[];
  totalEstimate: number;
  withinBudget: boolean;
  verifiedShare: number; // 0..1 fraction of picks from verified operators
}

type PlannerRow = Pick<
  ExperienceRow,
  "id" | "title" | "slug" | "city" | "category" | "duration_hours"
  | "price_per_person" | "images" | "avg_rating"
> & { operators: Pick<OperatorRow, "business_name" | "verified"> | null };

const PLANNER_SELECT =
  "id, title, slug, city, category, duration_hours, price_per_person, images, avg_rating, operators(business_name, verified)";

function toItem(r: PlannerRow): ItineraryItem {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    city: r.city,
    category: r.category,
    durationHours: r.duration_hours,
    pricePerPerson: r.price_per_person,
    image: r.images?.[0] ?? null,
    operatorName: r.operators?.business_name ?? null,
    operatorVerified: r.operators?.verified ?? false,
  };
}

/** Per-day spend ceiling derived from total budget and travel style. */
function dailyBudget(input: TripInput): number {
  const perDay = input.budgetUsd / Math.max(input.days, 1);
  // Reserve a portion for lodging/food not booked here.
  const activityShare = input.style === "premium" ? 0.6 : input.style === "balanced" ? 0.45 : 0.3;
  return perDay * activityShare;
}

/**
 * Build a day-by-day itinerary from live, approved inventory.
 * Verified operators rank first; the arrival city anchors early days.
 */
export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  const supabase = await createClient();

  // Pull a generous pool of candidate experiences in the chosen interests.
  // Quality-first by experience signals; verified operators are floated to
  // the front of the pool in-memory below.
  let query = supabase
    .from("experiences")
    .select(PLANNER_SELECT)
    .eq("published", true)
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .order("total_bookings", { ascending: false })
    .limit(120);

  if (input.interests.length > 0) {
    query = query.in("category", input.interests as ExperienceRow["category"][]);
  }

  const { data } = await query;
  const pool = ((data as unknown as PlannerRow[] | null) ?? []).map(toItem);

  // Verified operators float to the front of the candidate pool.
  pool.sort((a, b) => Number(b.operatorVerified) - Number(a.operatorVerified));

  const capPerDay = dailyBudget(input);
  const used = new Set<string>();
  const days: ItineraryDay[] = [];
  let total = 0;
  let verifiedPicks = 0;
  let totalPicks = 0;

  for (let d = 1; d <= input.days; d++) {
    // Days 1–2 anchor to the arrival city when inventory allows.
    const anchorCity = d <= 2 ? input.arrivalCity : undefined;
    const dayItems: ItineraryItem[] = [];
    let daySpend = 0;

    const ordered = [...pool].sort((a, b) => {
      if (anchorCity) {
        const ac = a.city === anchorCity ? 0 : 1;
        const bc = b.city === anchorCity ? 0 : 1;
        if (ac !== bc) return ac - bc;
      }
      return 0;
    });

    for (const item of ordered) {
      if (used.has(item.id)) continue;
      if (dayItems.length >= 2) break; // up to 2 experiences/day
      if (daySpend + item.pricePerPerson > capPerDay && dayItems.length > 0) continue;
      dayItems.push(item);
      used.add(item.id);
      daySpend += item.pricePerPerson;
      total += item.pricePerPerson;
      totalPicks++;
      if (item.operatorVerified) verifiedPicks++;
    }

    days.push({
      day: d,
      city: dayItems[0]?.city ?? input.arrivalCity,
      items: dayItems,
    });
  }

  return {
    days,
    totalEstimate: total,
    withinBudget: total <= input.budgetUsd,
    verifiedShare: totalPicks > 0 ? verifiedPicks / totalPicks : 0,
  };
}
