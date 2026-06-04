import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { LegalDoc } from "@/lib/legal-content";

/**
 * Renders a translated (AR/FR) legal document from structured content, with a
 * prominent DRAFT banner making clear it is not yet legally reviewed and that
 * the English version is authoritative.
 */
export default function LocalizedLegalDoc({
  title,
  lastUpdated,
  doc,
  englishHref,
  isRTL,
}: {
  title: string;
  lastUpdated: string;
  doc: LegalDoc;
  englishHref: string;
  isRTL: boolean;
}) {
  return (
    <div className="pt-20 min-h-screen bg-card" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm mb-6">{lastUpdated}</p>

        {/* DRAFT / not-legally-reviewed banner */}
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-sm text-red-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{doc.draftNotice}</p>
            <p className="mt-1">
              <Link href={englishHref} className="underline font-semibold">{doc.authoritativeNote}</Link>
            </p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-black text-foreground mb-3">{s.heading}</h2>
              {s.body.map((b, i) =>
                b.type === "p" ? (
                  <p key={i} className="text-foreground/80 mb-2">{b.text}</p>
                ) : (
                  <ul key={i} className={`space-y-1 text-foreground/80 mb-2 ${isRTL ? "pr-5" : "pl-5"} list-disc`}>
                    {b.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
