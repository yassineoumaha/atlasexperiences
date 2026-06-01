"use server";

import { subscribeNewsletter } from "@/lib/supabase/queries";

export async function subscribeAction(email: string, locale: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email address." };
  }
  const { error } = await subscribeNewsletter(email, locale);
  if (error === "already_subscribed") {
    return { success: true, error: null }; // Silently succeed
  }
  if (error) {
    return { success: false, error: "Something went wrong. Try again." };
  }
  return { success: true, error: null };
}
