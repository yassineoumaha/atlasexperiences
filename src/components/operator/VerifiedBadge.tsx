import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Atlas Verified badge — the platform's core trust signal.
 *
 * Shown on operator cards, profiles, and experience pages for any operator
 * whose `verification_status` is "verified". Three sizes cover the contexts:
 * `sm` for inline chips on cards, `md` for profile headers, `lg` for hero.
 */
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { wrap: string; icon: string; text: string }> = {
  sm: { wrap: "gap-1 px-2 py-0.5 text-xs", icon: "w-3 h-3", text: "text-xs" },
  md: { wrap: "gap-1.5 px-2.5 py-1 text-sm", icon: "w-4 h-4", text: "text-sm" },
  lg: { wrap: "gap-2 px-3.5 py-1.5 text-base", icon: "w-5 h-5", text: "text-base" },
};

export function VerifiedBadge({
  size = "md",
  label = "Atlas Verified",
  className,
}: {
  size?: Size;
  label?: string;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/70",
        s.wrap,
        className,
      )}
      title="This operator passed Atlas identity, business and license verification."
    >
      <BadgeCheck className={cn(s.icon, "shrink-0")} aria-hidden="true" />
      <span className={s.text}>{label}</span>
    </span>
  );
}

/**
 * Status pill for operator-facing surfaces (dashboard, admin) — reflects the
 * full pending/verified/rejected lifecycle, not just the verified case.
 */
export function VerificationStatusPill({
  status,
}: {
  status: "pending" | "verified" | "rejected";
}) {
  if (status === "verified") return <VerifiedBadge size="sm" />;
  const map = {
    pending: { label: "Verification pending", cls: "bg-orange-100 text-orange-700 ring-orange-200/70" },
    rejected: { label: "Verification rejected", cls: "bg-red-100 text-red-700 ring-red-200/70" },
  } as const;
  const { label, cls } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1", cls)}>
      {label}
    </span>
  );
}
