"use client";

import { useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { notifyLegalUpdateAction } from "@/app/actions/legal";

/**
 * Admin control to notify all account holders that the legal docs changed.
 * Shows a confirmation count first; if no email provider is connected it tells
 * the admin how many WOULD be reached without sending anything.
 */
export default function LegalNotifyButton({ version }: { version: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    if (!confirm(`Notify all account holders about the legal update (version ${version})?`)) return;
    setLoading(true);
    setResult(null);
    const r = await notifyLegalUpdateAction();
    setLoading(false);
    if (!r.ok) {
      setResult(r.error ?? "Failed.");
      return;
    }
    if (!r.emailReady) {
      setResult(`Email provider not connected. ${r.recipients} account holder(s) would be notified once RESEND_API_KEY is set. (The in-app re-consent prompt is already active for everyone.)`);
    } else {
      setResult(`Sent to ${r.sent} of ${r.recipients} account holder(s).`);
    }
  }

  return (
    <div>
      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
        Notify users of legal update
      </button>
      {result && <p className="text-sm text-muted-foreground mt-2">{result}</p>}
    </div>
  );
}
