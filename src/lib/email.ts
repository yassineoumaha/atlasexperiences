import "server-only";

/**
 * Minimal email seam. If RESEND_API_KEY is set, sends via Resend's HTTP API
 * (no SDK dependency — just fetch). If not set, it logs and no-ops so the rest
 * of the app keeps working until you connect a provider.
 *
 * To activate: create a Resend account, verify your sending domain, then set
 * in Vercel env:
 *   RESEND_API_KEY=re_xxxxxxxx
 *   EMAIL_FROM="Imourig <noreply@yourdomain.com>"
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Imourig <noreply@imourig.com>";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
}

export interface SendResult {
  sent: boolean;
  skipped?: boolean;
  error?: string;
}

/** True when an email provider is configured. */
export function emailConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", msg.to);
    return { sent: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: EMAIL_FROM, to: msg.to, subject: msg.subject, html: msg.html }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { sent: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown email error" };
  }
}
