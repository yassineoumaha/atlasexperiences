"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Ensures the authenticated user owns the experience before mutating
async function getOwnedExperience(experienceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: exp } = await supabase
    .from("experiences")
    .select("id, operator_id")
    .eq("id", experienceId)
    .single();

  if (!exp || exp.operator_id !== user.id) {
    throw new Error("Forbidden");
  }

  return { db: supabase, exp };
}

// Verifies the authenticated user owns the booking (via its operator_id)
async function getOwnedBooking(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, operator_id, experience_id, status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.operator_id !== user.id) throw new Error("Forbidden");
  return { db: supabase, booking };
}

export async function confirmBookingAction(bookingId: string, locale: string) {
  const { db, booking } = await getOwnedBooking(bookingId);
  if (booking.status !== "pending") return; // idempotent — already handled

  await db
    .from("bookings")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", bookingId);

  // Increment the experience's booking counter (drives "Most Popular" + stats).
  const { data: exp } = await db
    .from("experiences")
    .select("total_bookings")
    .eq("id", booking.experience_id)
    .single();
  if (exp) {
    await db
      .from("experiences")
      .update({ total_bookings: (exp.total_bookings ?? 0) + 1 })
      .eq("id", booking.experience_id);
  }

  revalidatePath(`/${locale}/portal`);
}

export async function declineBookingAction(bookingId: string, locale: string) {
  const { db, booking } = await getOwnedBooking(bookingId);
  if (booking.status !== "pending") return;

  await db
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString(), cancellation_reason: "Declined by operator" })
    .eq("id", bookingId);

  revalidatePath(`/${locale}/portal`);
}

export async function unpublishExperienceAction(experienceId: string, locale: string) {
  const { db } = await getOwnedExperience(experienceId);
  await db.from("experiences").update({ published: false }).eq("id", experienceId);
  revalidatePath(`/${locale}/portal`);
}

export async function publishExperienceAction(experienceId: string, locale: string) {
  const { db } = await getOwnedExperience(experienceId);
  await db.from("experiences").update({ published: true }).eq("id", experienceId);
  revalidatePath(`/${locale}/portal`);
}

export async function deleteOwnExperienceAction(experienceId: string, locale: string) {
  const { db } = await getOwnedExperience(experienceId);
  // Check no active bookings exist first
  const { data: active } = await db
    .from("bookings")
    .select("id")
    .eq("experience_id", experienceId)
    .in("status", ["pending", "confirmed"])
    .limit(1);

  if (active && active.length > 0) {
    throw new Error("Cannot delete: active bookings exist for this experience.");
  }

  await db.from("experiences").delete().eq("id", experienceId);
  revalidatePath(`/${locale}/portal`);
  redirect(`/${locale}/portal`);
}
