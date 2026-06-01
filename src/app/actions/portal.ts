"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Db = { from: (t: string) => any };

// Ensures the authenticated user owns the experience before mutating
async function getOwnedExperience(experienceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const db = supabase as unknown as Db;
  const { data: exp } = await db
    .from("experiences")
    .select("id, operator_id")
    .eq("id", experienceId)
    .single();

  if (!exp || exp.operator_id !== user.id) {
    throw new Error("Forbidden");
  }

  return { db, exp };
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
