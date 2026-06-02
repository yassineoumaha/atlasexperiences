import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/experiences-data";
import type { ExperienceCard } from "@/lib/db";
import type { Locale } from "@/lib/dictionaries";

/**
 * Shared experience tile used on the listing grid, operator profiles, SEO
 * landing pages and trip-planner results. Optionally renders the operator
 * attribution chip (hidden on an operator's own profile, where it's redundant).
 */
export function ExperienceCardTile({
  exp,
  locale,
  showOperator = true,
  perPersonLabel = "/ person",
  bookLabel = "Book",
  featuredLabel = "Featured",
}: {
  exp: ExperienceCard & { featured?: boolean };
  locale: Locale;
  showOperator?: boolean;
  perPersonLabel?: string;
  bookLabel?: string;
  featuredLabel?: string;
}) {
  const cat = CATEGORIES[exp.category as keyof typeof CATEGORIES];
  return (
    <Link
      href={`/${locale}/experiences/${exp.slug}`}
      className="group tile-card bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {exp.images?.[0] ? (
          <Image src={exp.images[0]} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">{cat?.emoji ?? "✨"}</div>
        )}
        <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${cat?.bgColor}`}>
          {cat?.emoji} {cat?.label}
        </div>
        {exp.featured && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            {featuredLabel}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-black text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">{exp.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" /> {exp.city}
          <span>·</span>
          <Clock className="w-3 h-3" /> {exp.duration_hours}h
        </div>
        {exp.avg_rating && exp.review_count > 0 ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-bold text-foreground">{exp.avg_rating}</span>
            <span>({exp.review_count})</span>
          </div>
        ) : null}
        {showOperator && exp.operators && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Users className="w-3 h-3" />
            {exp.operators.business_name}
            {exp.operators.verified && <span className="text-emerald-500">✓</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-foreground">${exp.price_per_person}</span>
            <span className="text-muted-foreground text-xs">{perPersonLabel}</span>
          </div>
          <span className="bg-accent group-hover:brightness-105 text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
            {bookLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
