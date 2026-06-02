import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OperatorRow, ExperienceRow, BookingRow } from "@/lib/supabase/types";

/** An operator's own experience row (dashboard listing table). */
export type OwnExperience = Pick<
  ExperienceRow,
  | "id" | "title" | "category" | "city" | "price_per_person"
  | "approved" | "published" | "avg_rating" | "review_count" | "total_bookings"
>;

/** A booking received by the operator, joined with its experience title. */
export type OperatorBooking = Pick<
  BookingRow,
  | "id" | "traveler_name" | "traveler_email" | "traveler_phone"
  | "requested_date" | "group_size" | "operator_payout" | "status" | "created_at"
> & { experiences: Pick<ExperienceRow, "title"> | null };

/** Everything the operator dashboard needs for one operator, in one round-trip. */
export async function getOperatorDashboard(operatorId: string): Promise<{
  operator: OperatorRow | null;
  experiences: OwnExperience[];
  bookings: OperatorBooking[];
}> {
  const supabase = await createClient();
  const [opRes, expRes, bookRes] = await Promise.all([
    supabase.from("operators").select("*").eq("id", operatorId).single(),
    supabase
      .from("experiences")
      .select("id, title, category, city, price_per_person, approved, published, avg_rating, review_count, total_bookings")
      .eq("operator_id", operatorId)
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("id, traveler_name, traveler_email, traveler_phone, requested_date, group_size, operator_payout, status, created_at, experiences(title)")
      .eq("operator_id", operatorId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    operator: (opRes.data as OperatorRow | null) ?? null,
    experiences: (expRes.data as OwnExperience[] | null) ?? [],
    // `experiences(title)` is an embedded select; FK metadata is absent from
    // the hand-written schema, so assert the shape through `unknown`.
    bookings: (bookRes.data as unknown as OperatorBooking[] | null) ?? [],
  };
}
