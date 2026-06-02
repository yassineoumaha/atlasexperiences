import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Globe, Clock } from "lucide-react";
import type { OperatorRow } from "@/lib/supabase/types";
import type { Locale } from "@/lib/dictionaries";
import { VerifiedBadge } from "./VerifiedBadge";
import { cn } from "@/lib/utils";

/**
 * "Offered by" operator card — the trust surface that tells travelers WHO
 * delivers an experience (an operator, not Atlas). Reused on the experience
 * detail page and anywhere we attribute inventory to its operator.
 *
 * Accepts a partial operator so it works with both the full row (detail page)
 * and the lightweight listing join.
 */
type OperatorCardData = Pick<OperatorRow, "business_name" | "slug" | "verified"> &
  Partial<
    Pick<
      OperatorRow,
      | "avatar_url" | "city" | "bio" | "languages"
      | "avg_rating" | "review_count" | "years_experience" | "response_time"
    >
  >;

export function OperatorCard({
  operator,
  locale,
  heading = "Offered by",
  className,
}: {
  operator: OperatorCardData;
  locale: Locale;
  heading?: string;
  className?: string;
}) {
  return (
    <div className={cn("border border-border rounded-2xl p-5 shadow-sm bg-card", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        {heading}
      </h2>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center text-accent-foreground text-2xl font-black shrink-0 overflow-hidden">
          {operator.avatar_url
            ? <Image src={operator.avatar_url} alt={operator.business_name} width={64} height={64} className="object-cover w-full h-full" />
            : operator.business_name?.[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-black text-foreground text-lg truncate">{operator.business_name}</h3>
            {operator.verified && <VerifiedBadge size="sm" />}
          </div>

          {/* Trust stats row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-2">
            {operator.city && (
              <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{operator.city}</span>
            )}
            {typeof operator.avg_rating === "number" && operator.avg_rating > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-foreground">{operator.avg_rating.toFixed(1)}</span>
                {operator.review_count ? <span>({operator.review_count})</span> : null}
              </span>
            )}
            {operator.years_experience ? (
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{operator.years_experience} yrs</span>
            ) : null}
          </div>

          {operator.bio && <p className="text-foreground/70 text-sm mb-3 line-clamp-3">{operator.bio}</p>}

          {operator.languages && operator.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {operator.languages.map((l) => (
                <span key={l} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  <Globe className="w-3 h-3" /> {l}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/${locale}/operators/${operator.slug}`}
            className="inline-block text-primary text-sm font-semibold hover:underline"
          >
            View all experiences by {operator.business_name} →
          </Link>
        </div>
      </div>
    </div>
  );
}
