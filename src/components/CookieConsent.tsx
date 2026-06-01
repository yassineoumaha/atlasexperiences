"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ChevronDown, ChevronUp, Check } from "lucide-react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "atlas_maroc_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function saveConsent(state: ConsentState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, timestamp: new Date().toISOString() }));
    setVisible(false);
    // Fire analytics only if consented
    if (state.analytics && typeof window !== "undefined") {
      // Analytics initialization would go here
    }
  }

  function acceptAll() {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  }

  function rejectAll() {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  }

  function saveCustom() {
    saveConsent(consent);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-stone-900 text-base">Cookies & Privacy</h3>
              <p className="text-stone-500 text-xs mt-0.5">
                We use cookies in compliance with <strong>Morocco Law 09-08</strong> (CNDP) and <strong>EU GDPR</strong>.
                Essential cookies are always active. Analytics cookies help us improve the site.
              </p>
            </div>
            <button onClick={rejectAll} className="text-stone-300 hover:text-stone-500 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Expand for settings */}
          {expanded && (
            <div className="mb-4 space-y-3 border-t border-stone-100 pt-4">
              {[
                { key: "necessary" as const, label: "Strictly Necessary", desc: "Authentication sessions, security. Cannot be disabled.", locked: true },
                { key: "analytics" as const, label: "Analytics", desc: "Aggregate usage data to improve the platform. No personal tracking.", locked: false },
                { key: "marketing" as const, label: "Marketing", desc: "Personalised recommendations from our travel partners.", locked: false },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-3">
                  <button
                    type="button"
                    disabled={item.locked}
                    onClick={() => !item.locked && setConsent((c) => ({ ...c, [item.key]: !c[item.key] }))}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors shrink-0 mt-0.5 ${
                      consent[item.key]
                        ? "bg-amber-500 justify-end"
                        : "bg-stone-200 justify-start"
                    } ${item.locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full mx-1 shadow-sm" />
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                      {item.label}
                      {item.locked && <span className="text-stone-400 font-normal">(always on)</span>}
                    </div>
                    <div className="text-stone-400 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptAll}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-xl text-sm font-bold transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
            >
              Reject Non-Essential
            </button>
            {expanded ? (
              <button
                onClick={saveCustom}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Preferences
              </button>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className="border border-stone-200 text-stone-500 hover:bg-stone-50 py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center gap-1"
              >
                Manage <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>

          <p className="text-stone-400 text-xs mt-3 text-center">
            By accepting you consent to our{" "}
            <Link href="/en/cookie-policy" className="underline hover:text-stone-600">Cookie Policy</Link>
            {" "}and{" "}
            <Link href="/en/privacy" className="underline hover:text-stone-600">Privacy Policy</Link>.
            CNDP Declaration No. D-939-2025.
          </p>
        </div>
      </div>
    </div>
  );
}
