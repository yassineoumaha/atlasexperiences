import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceRow, OperatorRow, ExperienceReviewRow } from "@/lib/supabase/types";

/**
 * Typed read queries for the experiences marketplace.
 *
 * These run on the server with the anon client (RLS enforced) and always
 * fail soft — a DB hiccup returns an empty result rather than throwing,
 * so a transient Supabase error never takes down a public page.
 */

/** An experience joined with a partial operator profile (listing select). */
export type ExperienceWithOperator = ExperienceRow & {
  operators: Pick<
    OperatorRow,
    "business_name" | "avatar_url" | "verified" | "slug" | "avg_rating" | "ranking_score"
  > | null;
};

/** An experience joined with the full operator profile (detail page). */
export type ExperienceWithFullOperator = ExperienceRow & {
  operators: OperatorRow | null;
};

/** A summary card used on listing grids. */
export type ExperienceCard = Pick<
  ExperienceRow,
  | "id" | "title" | "slug" | "category" | "city"
  | "price_per_person" | "images" | "avg_rating" | "review_count" | "duration_hours"
> & {
  operators: Pick<OperatorRow, "business_name" | "verified"> | null;
};

const LISTING_SELECT =
  "*, operators(business_name, avatar_url, verified, slug, avg_rating, ranking_score)";

const CARD_SELECT =
  "id, title, slug, category, city, price_per_person, images, avg_rating, review_count, duration_hours, operators(business_name, verified)";

/** Public listing — optionally filtered by category and/or city. */
export async function listExperiences(
  filters: { category?: string; city?: string } = {},
  limit = 48,
): Promise<ExperienceWithOperator[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("experiences")
      .select(LISTING_SELECT)
      .eq("published", true)
      .eq("approved", true)
      .order("featured", { ascending: false })
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .order("total_bookings", { ascending: false });
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category as ExperienceRow["category"]);
    }
    if (filters.city) query = query.eq("city", filters.city);
    const { data } = await query.limit(limit);
    // The hand-written schema carries no FK metadata, so the embedded
    // `operators(...)` select can't be inferred — assert the known shape.
    return (data as unknown as ExperienceWithOperator[] | null) ?? [];
  } catch {
    return [];
  }
}

/** Featured experiences for the homepage strip. */
export async function listFeaturedExperiences(limit = 8): Promise<ExperienceCard[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("experiences")
      .select(CARD_SELECT)
      .eq("published", true)
      .eq("approved", true)
      .eq("featured", true)
      .order("total_bookings", { ascending: false })
      .limit(limit);
    return (data as unknown as ExperienceCard[] | null) ?? [];
  } catch {
    return [];
  }
}

/** Single published experience with its operator, reviews and related items. */
export async function getExperienceBySlug(slug: string): Promise<{
  experience: ExperienceWithFullOperator;
  reviews: ExperienceReviewRow[];
  related: ExperienceCard[];
} | null> {
  try {
    const supabase = await createClient();
    const { data: exp } = await supabase
      .from("experiences")
      .select("*, operators(*)")
      .eq("slug", slug)
      .eq("published", true)
      .eq("approved", true)
      .single();
    if (!exp) return null;
    const experience = exp as unknown as ExperienceWithFullOperator;

    const [reviewsRes, relatedRes] = await Promise.all([
      supabase
        .from("experience_reviews")
        .select("*")
        .eq("experience_id", experience.id)
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("experiences")
        .select(CARD_SELECT)
        .eq("category", experience.category)
        .eq("published", true)
        .eq("approved", true)
        .neq("id", experience.id)
        .limit(4),
    ]);

    return {
      experience,
      reviews: (reviewsRes.data as ExperienceReviewRow[] | null) ?? [],
      related: (relatedRes.data as unknown as ExperienceCard[] | null) ?? [],
    };
  } catch {
    return null;
  }
}

/** Lightweight title/description lookup for generateMetadata. */
export async function getExperienceMeta(
  slug: string,
): Promise<Pick<ExperienceRow, "title" | "description"> | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("experiences")
      .select("title, description")
      .eq("slug", slug)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

/** Counts for the homepage stats band. */
export async function getPlatformStats(): Promise<{ operators: number; experiences: number }> {
  try {
    const supabase = await createClient();
    const [operatorsRes, experiencesRes] = await Promise.all([
      supabase.from("operators").select("id", { count: "exact", head: true }).eq("verified", true),
      supabase
        .from("experiences")
        .select("id", { count: "exact", head: true })
        .eq("published", true)
        .eq("approved", true),
    ]);
    return {
      operators: operatorsRes.count ?? 0,
      experiences: experiencesRes.count ?? 0,
    };
  } catch {
    return { operators: 0, experiences: 0 };
  }
}
