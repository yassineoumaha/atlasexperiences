import { createClient } from "./server";

export async function subscribeNewsletter(email: string, locale: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email, locale });
  if (error) {
    if (error.code === "23505") return { error: "already_subscribed" };
    return { error: error.message };
  }
  return { error: null };
}
