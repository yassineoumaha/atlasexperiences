"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVITY_SKETCHES, type SketchKey } from "./sketches";

type Side = "left" | "right";

interface ScrollSketchProps {
  sketch: SketchKey;
  side?: Side;
  /** tint class, e.g. "text-primary". Defaults to a faint foreground. */
  colorClass?: string;
  /** base opacity (0-100 tailwind step via className recommended instead) */
  className?: string;
}

/**
 * A single line-art activity sketch that "draws itself" when scrolled into view
 * and gently parallax-drifts. Sits in a section's background (absolute).
 *
 * - Draw + parallax only run when motion is allowed and viewport is >= md.
 * - On mobile / reduced-motion it renders a static faint sketch (no JS scroll work).
 */
export function ScrollSketch({
  sketch,
  side = "right",
  colorClass = "text-foreground",
  className = "",
}: ScrollSketchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [enabled, setEnabled] = useState(false); // motion + desktop
  const [offset, setOffset] = useState(0);

  const Sketch = ACTIVITY_SKETCHES[sketch];

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqDesktop = window.matchMedia("(min-width: 768px)");
    const on = !mqReduce.matches && mqDesktop.matches;
    setEnabled(on);
    if (!on) {
      setDrawn(true); // show statically
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setDrawn(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    // Parallax via rAF-throttled scroll
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -1 (below) .. 1 (above); drift up to ~40px
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        setOffset(Math.max(-1, Math.min(1, progress)) * 40);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 ${
        side === "right" ? "right-0 lg:right-[4%]" : "left-0 lg:left-[4%]"
      } -translate-y-1/2 w-[min(46vw,520px)] ${colorClass} ${className}`}
      style={enabled ? { transform: `translateY(calc(-50% + ${offset}px))` } : undefined}
    >
      <Sketch className={`sketch-draw ${drawn ? "is-drawn" : ""} w-full h-auto`} />
    </div>
  );
}
