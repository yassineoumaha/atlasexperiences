"use server";

import { createAdminClient } from "@/lib/supabase/server";

/**
 * Create the operator profile + user_profile row for a newly signed-up operator.
 *
 * Runs server-side with the service-role client so the insert succeeds even
 * when email confirmation is enabled (in which case the just-signed-up user has
 * no active session yet, and the anon-client insert would be denied by RLS —
 * the bug that made new operators never appear in the admin queue).
 */
export interface RegisterOperatorInput {
  userId: string;
  business_name: string;
  city: string;
  bio?: string;
  phone: string;
  whatsapp?: string;
  languages: string[];
  years_experience: number;
  license_number?: string;
}

export async function registerOperatorAction(
  input: RegisterOperatorInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.userId || !input.business_name?.trim() || !input.city || !input.phone?.trim()) {
    return { ok: false, error: "Missing required fields." };
  }

  const slug =
    input.business_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50) + "-" + Date.now().toString(36);

  const db = await createAdminClient();

  const { error: opError } = await db.from("operators").insert({
    id: input.userId,
    business_name: input.business_name.trim(),
    slug,
    city: input.city,
    bio: input.bio?.trim() || null,
    phone: input.phone.trim(),
    whatsapp: input.whatsapp?.trim() || input.phone.trim(),
    languages: input.languages?.length ? input.languages : ["English"],
    years_experience: input.years_experience || 1,
    license_number: input.license_number?.trim() || null,
    verified: false,
    verification_status: "pending",
    commission_rate: 10,
  });

  if (opError) {
    // 23505 = unique_violation (operator already exists for this user) — treat as success.
    if (opError.code === "23505") return { ok: true };
    console.error("[registerOperator] operator insert error", opError);
    return { ok: false, error: "Could not create your operator profile. Please contact support." };
  }

  await db.from("user_profiles").upsert({
    id: input.userId,
    display_name: input.business_name.trim(),
    role: "lister",
  });

  return { ok: true };
}
