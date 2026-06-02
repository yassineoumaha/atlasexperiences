"use client";

import { useEffect, useRef } from "react";
import { SCENES, type SceneKey } from "./scenes";

interface ScrollSceneProps {
  scene: SceneKey;
  /** which way the rider travels across the screen */
  direction?: "ltr" | "rtl";
  colorClass?: string;
  className?: string;
}

/**
 * A living activity scene that animates with scroll position (GSAP scrub):
 *   - the wave/landscape swells UP from behind the content
 *   - the rider (surfer/biker/…) travels ACROSS
 *   - then the whole scene drifts past and fades out
 *
 * GSAP is dynamically imported (client-only). On mobile or reduced-motion we
 * render a calm static scene (no scroll work) for performance.
 */
export function ScrollScene({
  scene,
  direction = "ltr",
  colorClass = "text-primary",
  className = "",
}: ScrollSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const Scene = SCENES[scene];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Static, gently-visible fallback — no scroll animation.
    if (reduce || isMobile) {
      host.style.opacity = "1";
      return;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const wave = host.querySelector<SVGGElement>(".scene-wave");
      const rider = host.querySelector<SVGGElement>(".scene-rider");
      const dist = direction === "ltr" ? 1 : -1;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: host.parentElement ?? host,
            start: "top bottom",   // section top reaches viewport bottom
            end: "bottom top",     // section bottom reaches viewport top
            scrub: 1.4,            // tie to scroll w/ smooth trailing
          },
        });

        // 1) swell up + fade in
        tl.fromTo(host, { opacity: 0, yPercent: 18 }, { opacity: 1, yPercent: 0, ease: "power2.out", duration: 1.2 }, 0);
        // 2) wave breathes upward a touch
        if (wave) tl.fromTo(wave, { yPercent: 10 }, { yPercent: -6, ease: "none", duration: 4 }, 0);
        // 3) rider travels across the scene
        if (rider) tl.fromTo(rider, { xPercent: -22 * dist, rotate: -2 * dist }, { xPercent: 24 * dist, rotate: 2 * dist, ease: "none", duration: 4 }, 0);
        // 4) flow past and dissipate near the end
        tl.to(host, { opacity: 0, yPercent: -14, ease: "power2.in", duration: 1.1 }, 3.1);
      }, host);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [direction]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${colorClass} ${className}`}
    >
      <Scene className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] sm:w-full h-full opacity-[0.16] dark:opacity-[0.22]" />
    </div>
  );
}
