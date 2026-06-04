"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendEmail, emailConfigured } from "@/lib/email";
import { LEGAL_VERSION, LEGAL_EFFECTIVE_LABEL } from "@/lib/legal";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.atlasexperiences.world";

/**
 * Record that the current logged-in user accepted a given legal version.
 * Anonymous visitors are a no-op (their consent lives in localStorage only).
 * Uses the service-role client so the upsert isn't blocked by RLS.
 */
export async function recordLegalConsentAction(version: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: true }; // anonymous — nothing to persist server-side

  const db = await createAdminClient();
  const { error } = await db.from("legal_consents").upsert(
    {
      user_id: user.id,
      version,
      email: user.email ?? null,
      accepted_at: new Date().toISOString(),
    },
    { onConflict: "user_id,version" },
  );
  if (error) {
    // Don't block the UI on a logging failure; surface in server logs only.
    console.error("recordLegalConsent failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}

/**
 * Admin-only: email every account holder that the Terms/Privacy have been
 * updated to the current LEGAL_VERSION. Returns counts. If no email provider
 * is connected (RESEND_API_KEY unset), it reports how many WOULD be notified
 * so you can verify the audience before wiring email — nothing is sent.
 *
 * Run this after bumping LEGAL_VERSION. (The in-app re-consent gate fires
 * automatically regardless of email.)
 */
export async function notifyLegalUpdateAction(): Promise<{
  ok: boolean;
  recipients: number;
  sent: number;
  emailReady: boolean;
  error?: string;
}> {
  // Gate to admins.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return { ok: false, recipients: 0, sent: 0, emailReady: emailConfigured(), error: "Not authorized" };
  }

  // Gather all account-holder emails (paginated).
  const db = await createAdminClient();
  const emails: string[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { ok: false, recipients: 0, sent: 0, emailReady: emailConfigured(), error: error.message };
    const batch = (data?.users ?? []).map((u) => u.email).filter((e): e is string => !!e);
    emails.push(...batch);
    if (!data || data.users.length < 200) break;
  }
  const unique = [...new Set(emails)];

  if (!emailConfigured()) {
    // Dormant mode: report the audience, send nothing.
    return { ok: true, recipients: unique.length, sent: 0, emailReady: false };
  }

  const subject = `Imourig — our Terms & Privacy Policy were updated (${LEGAL_EFFECTIVE_LABEL})`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#1c1917">
      <h2 style="color:#b45309">We've updated our terms</h2>
      <p>Hello,</p>
      <p>We've made changes to our <strong>Terms &amp; Conditions</strong> and <strong>Privacy Policy</strong>,
      effective ${LEGAL_EFFECTIVE_LABEL} (version ${LEGAL_VERSION}). The next time you visit Imourig
      you'll be asked to review and accept them.</p>
      <p>
        <a href="${SITE_URL}/en/terms" style="color:#b45309">Read the Terms</a> ·
        <a href="${SITE_URL}/en/privacy" style="color:#b45309">Read the Privacy Policy</a>
      </p>
      <p style="color:#78716c;font-size:13px">If you have questions, reply to this email or contact legal@imourig.com.</p>
    </div>`;

  // Send in small batches to respect provider rate limits.
  let sent = 0;
  for (const to of unique) {
    const r = await sendEmail({ to, subject, html });
    if (r.sent) sent++;
  }
  return { ok: true, recipients: unique.length, sent, emailReady: true };
}
