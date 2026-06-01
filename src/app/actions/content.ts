"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

// â”€â”€â”€ Operator profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function updateOperatorProfileAction(data: {
  business_name?: string;
  bio?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  languages?: string[];
  years_experience?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const db = await createAdminClient();
  const { error } = await (db as unknown as any).from("operators").update({ ...data, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) return { error: error.message };
  return { error: null };
}

// â”€â”€â”€ Experience reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function submitExperienceReviewAction(data: {
  experience_id: string;
  rating: number;
  title?: string;
  body: string;
  booking_id?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to leave a review." };

  const db = supabase as unknown as any;
  const { data: profile } = await db.from("user_profiles").select("display_name").eq("id", user.id).single();

  const { error } = await (db as unknown as any).from("experience_reviews").insert({
    ...data,
    user_id: user.id,
    display_name: profile?.display_name || user.email?.split("@")[0] || "Traveler",
    approved: false,
  });
  if (error) {
    if (error.code === "23505") return { error: "You have already reviewed this experience." };
    return { error: error.message };
  }
  return { error: null };
}
