"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

type Db = { from: (t: string) => any };
const db = async (): Promise<Db> => (await createAdminClient()) as unknown as Db;

// ─── Operators ────────────────────────────────────────────────────────────────

export async function verifyOperatorAction(id: string) {
  const d = await db();
  await d.from("operators").update({ verified: true }).eq("id", id);
  revalidatePath("/admin/operators");
}

export async function deleteOperatorAction(id: string) {
  const d = await db();
  await d.from("operators").delete().eq("id", id);
  revalidatePath("/admin/operators");
}

// ─── Experiences ──────────────────────────────────────────────────────────────

export async function approveExperienceAction(id: string) {
  const d = await db();
  await d.from("experiences").update({ approved: true }).eq("id", id);
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
}

export async function rejectExperienceAction(id: string) {
  const d = await db();
  await d.from("experiences").update({ approved: false, published: false }).eq("id", id);
  revalidatePath("/admin/experiences");
}

export async function toggleExperienceFeaturedAction(id: string, current: boolean) {
  const d = await db();
  await d.from("experiences").update({ featured: !current }).eq("id", id);
  revalidatePath("/admin/experiences");
}

export async function deleteExperienceAction(id: string) {
  const d = await db();
  await d.from("experiences").delete().eq("id", id);
  revalidatePath("/admin/experiences");
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function markBookingCompletedAction(id: string) {
  const d = await db();
  await d.from("bookings").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/bookings");
}

export async function markBookingCancelledAction(id: string) {
  const d = await db();
  await d.from("bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/bookings");
}

export async function markBookingInvoicedAction(id: string) {
  const d = await db();
  await d.from("bookings").update({ operator_invoiced: true }).eq("id", id);
  revalidatePath("/admin/bookings");
}

export async function markBookingPaidAction(id: string) {
  const d = await db();
  await d.from("bookings").update({ operator_paid: true }).eq("id", id);
  revalidatePath("/admin/bookings");
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function approveExpReviewAction(id: string) {
  const d = await db();
  await d.from("experience_reviews").update({ approved: true }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function deleteExpReviewAction(id: string) {
  const d = await db();
  await d.from("experience_reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function deleteSubscriberAction(id: string) {
  const d = await db();
  await d.from("newsletter_subscribers").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
}
