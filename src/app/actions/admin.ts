"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

const db = () => createAdminClient();

// Supabase's JS client never throws on a failed write — it returns { error }.
// Swallowing that made admin deletes look like no-ops (the row stayed and the
// page just revalidated). Throwing surfaces the real DB message to the UI.
function check(error: { message: string } | null, what: string) {
  if (error) throw new Error(`${what} failed: ${error.message}`);
}

// Admin pages live under the dynamic [locale] segment, so revalidatePath needs
// the route pattern plus the "page" type — a literal "/admin/operators" matches
// no real route and silently revalidates nothing.
const ADMIN = {
  operators:   () => revalidatePath("/[locale]/admin/operators", "page"),
  experiences: () => revalidatePath("/[locale]/admin/experiences", "page"),
  bookings:    () => revalidatePath("/[locale]/admin/bookings", "page"),
  reviews:     () => revalidatePath("/[locale]/admin/reviews", "page"),
  newsletter:  () => revalidatePath("/[locale]/admin/newsletter", "page"),
};
const publicExperiences = () => revalidatePath("/[locale]/experiences", "page");

// ─── Operators ────────────────────────────────────────────────────────────────

export async function verifyOperatorAction(id: string) {
  const d = await db();
  const { error } = await d.from("operators").update({ verified: true, verification_status: "verified" }).eq("id", id);
  check(error, "Verify operator");
  ADMIN.operators();
}

export async function deleteOperatorAction(id: string) {
  const d = await db();
  const { error } = await d.from("operators").delete().eq("id", id);
  check(error, "Delete operator");
  ADMIN.operators();
}

// ─── Experiences ──────────────────────────────────────────────────────────────

export async function approveExperienceAction(id: string) {
  const d = await db();
  const { error } = await d.from("experiences").update({ approved: true }).eq("id", id);
  check(error, "Approve experience");
  ADMIN.experiences();
  publicExperiences();
}

export async function rejectExperienceAction(id: string) {
  const d = await db();
  const { error } = await d.from("experiences").update({ approved: false, published: false }).eq("id", id);
  check(error, "Reject experience");
  ADMIN.experiences();
  publicExperiences();
}

export async function toggleExperienceFeaturedAction(id: string, current: boolean) {
  const d = await db();
  const { error } = await d.from("experiences").update({ featured: !current }).eq("id", id);
  check(error, "Toggle featured");
  ADMIN.experiences();
  publicExperiences();
}

export async function deleteExperienceAction(id: string) {
  const d = await db();
  const { error } = await d.from("experiences").delete().eq("id", id);
  check(error, "Delete experience");
  ADMIN.experiences();
  publicExperiences();
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function markBookingCompletedAction(id: string) {
  const d = await db();
  const { error } = await d.from("bookings").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
  check(error, "Mark booking completed");
  ADMIN.bookings();
}

export async function markBookingCancelledAction(id: string) {
  const d = await db();
  const { error } = await d.from("bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", id);
  check(error, "Cancel booking");
  ADMIN.bookings();
}

export async function markBookingInvoicedAction(id: string) {
  const d = await db();
  const { error } = await d.from("bookings").update({ operator_invoiced: true }).eq("id", id);
  check(error, "Mark booking invoiced");
  ADMIN.bookings();
}

export async function markBookingPaidAction(id: string) {
  const d = await db();
  const { error } = await d.from("bookings").update({ operator_paid: true }).eq("id", id);
  check(error, "Mark booking paid");
  ADMIN.bookings();
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function approveExpReviewAction(id: string) {
  const d = await db();
  const { error } = await d.from("experience_reviews").update({ approved: true }).eq("id", id);
  check(error, "Approve review");
  ADMIN.reviews();
}

export async function deleteExpReviewAction(id: string) {
  const d = await db();
  const { error } = await d.from("experience_reviews").delete().eq("id", id);
  check(error, "Delete review");
  ADMIN.reviews();
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function deleteSubscriberAction(id: string) {
  const d = await db();
  const { error } = await d.from("newsletter_subscribers").delete().eq("id", id);
  check(error, "Delete subscriber");
  ADMIN.newsletter();
}
