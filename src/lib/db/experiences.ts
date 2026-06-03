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

// `!inner` forces the operator join so filtering on operators.verified works.
const LISTING_SELECT_VERIFIED =
  "*, operators!inner(business_name, avatar_url, verified, slug, avg_rating, ranking_score)";

const CARD_SELECT =
  "id, title, slug, category, city, price_per_person, images, avg_rating, review_count, duration_hours, operators(business_name, verified)";

/** Sort options surfaced in the discovery UI. */
export type ExperienceSort = "recommended" | "rated" | "popular" | "newest";

/** Full discovery filter set. All optional; absent filters are not applied. */
export interface ExperienceFilters {
  category?: string;
  city?: string;
  /** Max duration in hours (e.g. 3 = half-day, 6 = full-day). */
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
  /** Spoken language the experience must offer (matches `languages` array). */
  language?: string;
  /** Only experiences from Atlas-verified operators. */
  verifiedOnly?: boolean;
  sort?: ExperienceSort;
}

/** Public listing — filtered and sorted for the discovery page. */
export async function listExperiences(
  filters: ExperienceFilters = {},
  limit = 48,
): Promise<ExperienceWithOperator[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("experiences")
      .select(filters.verifiedOnly ? LISTING_SELECT_VERIFIED : LISTING_SELECT)
      .eq("published", true)
      .eq("approved", true);

    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category as ExperienceRow["category"]);
    }
    if (filters.city) query = query.eq("city", filters.city);
    if (filters.maxDuration) query = query.lte("duration_hours", filters.maxDuration);
    if (typeof filters.minPrice === "number") query = query.gte("price_per_person", filters.minPrice);
    if (typeof filters.maxPrice === "number") query = query.lte("price_per_person", filters.maxPrice);
    if (filters.language) query = query.contains("languages", [filters.language]);
    if (filters.verifiedOnly) query = query.eq("operators.verified", true);

    // Featured always floats first; the chosen sort orders the rest.
    query = query.order("featured", { ascending: false });
    switch (filters.sort) {
      case "rated":
        query = query.order("avg_rating", { ascending: false, nullsFirst: false });
        break;
      case "popular":
        query = query.order("total_bookings", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "recommended":
      default:
        // NB: ranking_score lives on the operators table, not experiences —
        // ordering an experiences query by it errors out in PostgREST and the
        // whole listing comes back empty. Rank by real experience columns.
        query = query
          .order("avg_rating", { ascending: false, nullsFirst: false })
          .order("total_bookings", { ascending: false });
    }

    const { data, error } = await query.limit(limit);
    // A query error (e.g. ordering by a non-existent column) must not silently
    // masquerade as "no experiences" — log it so the empty state is honest.
    if (error) console.error("listExperiences query error:", error.message);
    // The hand-written schema carries no FK metadata, so the embedded
    // `operators(...)` select can't be inferred — assert the known shape.
    return (data as unknown as ExperienceWithOperator[] | null) ?? [];
  } catch (e) {
    console.error("listExperiences failed:", e);
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

/** Lightweight metadata lookup (title/description/images) for generateMetadata. */
export async function getExperienceMeta(
  slug: string,
): Promise<Pick<ExperienceRow, "title" | "description" | "images" | "city" | "category"> | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("experiences")
      .select("title, description, images, city, category")
      .eq("slug", slug)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

/** An operator profile joined with its published experiences. */
export type OperatorWithExperiences = OperatorRow & {
  experiences: ExperienceCard[];
};

/** Public operator profile by slug, with their live experiences. */
export async function getOperatorBySlug(
  slug: string,
): Promise<OperatorWithExperiences | null> {
  try {
    const supabase = await createClient();
    const { data: operator } = await supabase
      .from("operators")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!operator) return null;

    const { data: experiences } = await supabase
      .from("experiences")
      .select(CARD_SELECT)
      .eq("operator_id", operator.id)
      .eq("published", true)
      .eq("approved", true)
      .order("featured", { ascending: false })
      .order("total_bookings", { ascending: false })
      .limit(48);

    return {
      ...(operator as OperatorRow),
      experiences: (experiences as unknown as ExperienceCard[] | null) ?? [],
    };
  } catch {
    return null;
  }
}

/** Lightweight name/bio lookup for an operator's generateMetadata. */
export async function getOperatorMeta(
  slug: string,
): Promise<Pick<OperatorRow, "business_name" | "bio" | "city"> | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("operators")
      .select("business_name, bio, city")
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
