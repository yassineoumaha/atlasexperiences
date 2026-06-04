/**
 * Typed analytics event layer for Imourig.
 *
 * `track(event, props)` forwards to GA4 (`window.gtag`) when it's loaded and
 * the user has consented; otherwise it no-ops. Vercel Analytics runs
 * separately (traffic + Web Vitals) via <Analytics/> in the root layout.
 *
 * Safe to import and call from any client component — it never throws and
 * never assumes gtag exists.
 */

/** Marketplace conversion + discovery events we care about. */
export type AnalyticsEvent =
  // homepage
  | "hero_cta_explore"
  | "hero_cta_become_operator"
  // discovery
  | "search"
  | "near_me_used"
  | "experience_view"
  | "operator_profile_view"
  | "category_view"
  | "destination_view"
  // operator funnel
  | "operator_signup"
  | "verification_apply"
  // booking / leads
  | "booking_start"
  | "booking_step_details"
  | "lead_submit"
  | "booking_complete"
  // engagement
  | "whatsapp_click"
  | "trip_plan_generate";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    // GA4 global. Optional — only present after the consented script loads.
    gtag?: (command: "event" | "config" | "js" | "consent", ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Fire a typed analytics event. No-ops on the server or before GA loads. */
export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, props ?? {});
}

/** Has the user granted analytics consent? (reads the cookie-consent store) */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("imourig_cookie_consent");
    if (!raw) return false;
    return JSON.parse(raw)?.analytics === true;
  } catch {
    return false;
  }
}
