/**
 * Single source of truth for the legal agreement version.
 *
 * Bump LEGAL_VERSION whenever you make a material change to the Terms or
 * Privacy Policy. Everyone (anonymous visitors and logged-in users) will be
 * re-prompted to accept on their next visit, and — once an email provider is
 * connected — every account holder is emailed about the update.
 *
 * Use a date-style version so it self-documents when it last changed.
 */
export const LEGAL_VERSION = "2026-06-04";

/** Human-readable label shown in the consent UI. */
export const LEGAL_EFFECTIVE_LABEL = "4 June 2026";

/** localStorage key holding the version a visitor last accepted. */
export const LEGAL_CONSENT_KEY = "imourig_legal_consent";
