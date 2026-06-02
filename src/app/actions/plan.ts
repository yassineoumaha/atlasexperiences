"use server";

import { generateItinerary, type TripInput, type Itinerary } from "@/lib/trip-planner";
import { CATEGORIES, type ExperienceCategory } from "@/lib/experiences-data";

const VALID_CATEGORIES = new Set(Object.keys(CATEGORIES));
const VALID_STYLES = new Set(["budget", "balanced", "premium"]);

/** Validate + run the trip planner. Returns the itinerary or an error. */
export async function planTripAction(
  raw: TripInput,
): Promise<{ itinerary: Itinerary; error: null } | { itinerary: null; error: string }> {
  const days = Math.min(Math.max(Math.round(raw.days), 1), 21);
  const budgetUsd = Math.max(Math.round(raw.budgetUsd), 0);
  const interests = (raw.interests ?? []).filter((c): c is ExperienceCategory =>
    VALID_CATEGORIES.has(c),
  );
  const style = VALID_STYLES.has(raw.style) ? raw.style : "balanced";

  if (!raw.arrivalCity) {
    return { itinerary: null, error: "Please choose an arrival city." };
  }

  try {
    const itinerary = await generateItinerary({
      days,
      budgetUsd,
      interests,
      arrivalCity: raw.arrivalCity,
      style,
    });
    if (itinerary.days.every((d) => d.items.length === 0)) {
      return {
        itinerary: null,
        error: "No matching experiences yet — try widening your interests or budget.",
      };
    }
    return { itinerary, error: null };
  } catch {
    return { itinerary: null, error: "Could not build an itinerary. Please try again." };
  }
}
