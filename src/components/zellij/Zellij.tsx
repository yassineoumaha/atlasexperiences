/**
 * Imourig zellij motif components.
 * Decorative Moroccan geometric accents (zellij star/seal + border band).
 * Pure SVG, currentColor-driven so they adapt to light/dark + context color.
 */

type SizeProps = { className?: string; size?: number };

/** 8-point zellij star / khatim seal — use as a brand accent or bullet. */
export function ZellijStar({ className = "", size = 24 }: SizeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M50 6 L61 28 L85 28 L67 45 L75 72 L50 58 L25 72 L33 45 L15 28 L39 28 Z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path
        d="M50 16 L72 38 L72 70 L50 90 L28 70 L28 38 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}

/** Horizontal zellij border band — geometric section divider. */
export function ZellijDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`zellij-divider w-full ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}

/** Faint tiled zellij texture wrapper — wrap a section for subtle background. */
export function ZellijBackdrop({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="zellij-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
