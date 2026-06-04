"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, FileText, Loader2 } from "lucide-react";
import { LEGAL_VERSION, LEGAL_EFFECTIVE_LABEL, LEGAL_CONSENT_KEY } from "@/lib/legal";
import { recordLegalConsentAction } from "@/app/actions/legal";

// Routes a visitor must be able to read BEFORE consenting — never gate these,
// otherwise the "review our terms" links loop straight back to the gate.
const ALLOWED_WHILE_PENDING = ["/terms", "/privacy", "/affiliate-disclosure"];

/**
 * Hard-block consent gate. On first visit — and again whenever LEGAL_VERSION
 * changes — a full-screen modal requires the visitor to accept the Terms &
 * Privacy Policy before using the platform. Acceptance is stored locally for
 * everyone, and recorded server-side for logged-in users (best-effort).
 *
 * SSR note: localStorage is read in an effect, so nothing blocks until the
 * client confirms consent is missing/outdated — avoids a hydration flash for
 * the (common) already-consented case by rendering null until checked.
 */
export default function LegalConsentGate({ locale }: { locale: string }) {
  const [needsConsent, setNeedsConsent] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [agreed, setAgreed] = useState(false); // click-wrap: affirmative tick
  const pathname = usePathname();

  // Strip the locale prefix so "/en/terms" matches "/terms".
  const pathWithoutLocale = "/" + (pathname || "").split("/").slice(2).join("/");
  const onLegalPage = ALLOWED_WHILE_PENDING.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/"),
  );

  useEffect(() => {
    const stored = localStorage.getItem(LEGAL_CONSENT_KEY);
    // Consent check must run client-side (localStorage unavailable in SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNeedsConsent(stored !== LEGAL_VERSION);
    setChecked(true);
  }, []);

  // Lock body scroll while the gate is open (but never on the legal pages,
  // which must stay readable and scrollable before consent).
  useEffect(() => {
    if (needsConsent && checked && !onLegalPage) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [needsConsent, checked, onLegalPage]);

  async function accept() {
    if (!agreed) return; // click-wrap guard
    setSaving(true);
    localStorage.setItem(LEGAL_CONSENT_KEY, LEGAL_VERSION);
    // Record server-side for logged-in users; harmless no-op for anonymous.
    try { await recordLegalConsentAction(LEGAL_VERSION); } catch { /* non-blocking */ }
    setSaving(false);
    setNeedsConsent(false);
  }

  // Don't gate the legal pages themselves — visitors must be able to read the
  // Terms/Privacy they're being asked to accept.
  if (onLegalPage) return null;
  if (!checked || !needsConsent) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-gate-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="bg-gradient-to-br from-[oklch(0.30_0.10_264)] to-[oklch(0.40_0.12_40)] text-white p-6">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 id="legal-gate-title" className="text-2xl font-black">Welcome to Imourig</h2>
          <p className="text-white/80 text-sm mt-1">
            Before you continue, please review and accept our terms.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-foreground/80 text-sm leading-relaxed">
            Please review our Terms &amp; Conditions and Privacy Policy. They explain how the
            marketplace works, that operators are independent third parties, and how we handle
            your data under Morocco Law 09-08 and EU GDPR. Tick the box below to confirm.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/terms`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold border border-input text-foreground/80 hover:bg-muted/40 px-3 py-2 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" /> Read Terms
            </Link>
            <Link
              href={`/${locale}/privacy`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold border border-input text-foreground/80 hover:bg-muted/40 px-3 py-2 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" /> Read Privacy Policy
            </Link>
          </div>

          {/* Click-wrap: an explicit, affirmative tick is required before the
              accept button is enabled — strengthens enforceability. */}
          <label className="flex items-start gap-3 cursor-pointer select-none rounded-xl border border-input p-3 hover:bg-muted/30 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)] cursor-pointer"
            />
            <span className="text-sm text-foreground/80 leading-snug">
              I have read and agree to the{" "}
              <Link href={`/${locale}/terms`} target="_blank" className="text-primary font-semibold underline">Terms &amp; Conditions</Link>{" "}
              and{" "}
              <Link href={`/${locale}/privacy`} target="_blank" className="text-primary font-semibold underline">Privacy Policy</Link>.
            </span>
          </label>

          <button
            onClick={accept}
            disabled={saving || !agreed}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:brightness-105 text-accent-foreground font-bold py-3.5 rounded-xl transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            I Agree &amp; Continue
          </button>

          <p className="text-muted-foreground text-xs text-center">
            Agreement version {LEGAL_EFFECTIVE_LABEL}. You can withdraw consent anytime by contacting us.
          </p>
        </div>
      </div>
    </div>
  );
}
