"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X, BadgeCheck } from "lucide-react";
import {
  DURATION_BUCKETS,
  PRICE_BUCKETS,
  EXPERIENCE_LANGUAGES,
  SORT_OPTIONS,
} from "@/lib/experiences-data";
import { track } from "@/lib/analytics";

/**
 * URL-driven discovery filter bar. Every control writes to the query string
 * and navigates, so the page stays a server component and filtered views are
 * shareable / indexable. Region & category live in the existing chip rows;
 * this bar adds duration, price, language, verified-only and sort.
 */
export function DiscoveryFilters({
  labels,
}: {
  labels: { filters: string; verifiedOnly: string; sortBy: string; clear: string; duration: string; price: string; language: string; any: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const verifiedOnly = params.get("verified") === "1";
  const activeCount = ["duration", "price", "language", "verified"].filter((k) => params.get(k)).length;

  const select =
    "appearance-none rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground/80 outline-none cursor-pointer hover:border-primary transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-8">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70">
        <SlidersHorizontal className="w-4 h-4" /> {labels.filters}
      </span>

      {/* Duration */}
      <select className={select} value={params.get("duration") ?? ""} onChange={(e) => setParam("duration", e.target.value || null)} aria-label={labels.duration}>
        <option value="">{labels.duration}: {labels.any}</option>
        {DURATION_BUCKETS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
      </select>

      {/* Price */}
      <select className={select} value={params.get("price") ?? ""} onChange={(e) => setParam("price", e.target.value || null)} aria-label={labels.price}>
        <option value="">{labels.price}: {labels.any}</option>
        {PRICE_BUCKETS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
      </select>

      {/* Language */}
      <select className={select} value={params.get("language") ?? ""} onChange={(e) => setParam("language", e.target.value || null)} aria-label={labels.language}>
        <option value="">{labels.language}: {labels.any}</option>
        {EXPERIENCE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>

      {/* Verified only */}
      <button
        type="button"
        onClick={() => {
          const next = !verifiedOnly;
          setParam("verified", next ? "1" : null);
          if (next) track("search", { filter: "verified_only" });
        }}
        aria-pressed={verifiedOnly}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors border ${
          verifiedOnly
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-card text-foreground/70 border-border hover:border-emerald-300"
        }`}
      >
        <BadgeCheck className="w-4 h-4" /> {labels.verifiedOnly}
      </button>

      <div className="flex-1" />

      {/* Sort */}
      <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        {labels.sortBy}
        <select className={select} value={params.get("sort") ?? "recommended"} onChange={(e) => setParam("sort", e.target.value)} aria-label={labels.sortBy}>
          {SORT_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </label>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => {
            // Keep category & city chips; clear only the advanced filters.
            const next = new URLSearchParams(params.toString());
            ["duration", "price", "language", "verified", "sort"].forEach((k) => next.delete(k));
            router.push(`${pathname}?${next.toString()}`, { scroll: false });
          }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" /> {labels.clear}
        </button>
      )}
    </div>
  );
}
