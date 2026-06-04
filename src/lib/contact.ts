/**
 * Single source of truth for the business WhatsApp / phone number.
 *
 * Change it here and every link/label across the site updates. Keep the raw
 * digits in international format (country code first, no `+`, no spaces) — that
 * is exactly what wa.me URLs expect.
 */

/** Digits only, international format — used directly in wa.me links. */
export const WHATSAPP_NUMBER = "212636182986";

/** Human-readable form for display, e.g. "+212 636 182 986". */
export const WHATSAPP_DISPLAY = "+212 636 182 986";

/**
 * Build a WhatsApp chat link with an optional pre-filled message.
 * @param message Plain text; it is URL-encoded for you.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
