"use client";

import { useEffect, useRef } from "react";
import { SCENES, type SceneKey } from "./scenes";

interface ScrollSceneProps {
  scene: SceneKey;
  /** which way the rider travels across the screen */
  direction?: "ltr" | "rtl";
  colorClass?: string;
  className?: string;
  /**
   * "scroll"  — mid-page: scene swells in, rider crosses, fades out as you scroll past (scrubbed).
   * "intro"   — hero / above-the-fold: scene is visible immediately and gently animates
   *             on a loop + light parallax. Use this at the TOP of a page.
   */
  mode?: "scroll" | "intro";
}

export function ScrollScene({
  scene,
  direction = "ltr",
  colorClass = "text-primary",
  className = "",
  mode = "scroll",
}: ScrollSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const Scene = SCENES[scene];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const wave = host.querySelector<SVGGElement>(".scene-wave");
    const rider = host.querySelector<SVGGElement>(".scene-rider");
    const dist = direction === "ltr" ? 1 : -1;

    // Always make it visible (so it never "disappears"); motion is the enhancement.
    host.style.opacity = "1";

    if (reduce || isMobile) return; // static, but visible

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const gsap = gsapMod.default;

      if (mode === "intro") {
        // Hero: gentle, continuous life — no scroll needed to see it.
        if (cancelled) return;
        ctx = gsap.context(() => {
          gsap.fromTo(host, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" });
          if (rider) {
            gsap.fromTo(rider, { xPercent: -14 * dist }, { xPercent: 14 * dist, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
            gsap.to(rider, { yPercent: -3, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true });
          }
          if (wave) gsap.to(wave, { yPercent: -4, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true });
        }, host);
        return;
      }

      // mode === "scroll": tie to scroll position with scrub.
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // start visible at a base level, then choreograph with scroll
        gsap.set(host, { opacity: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: host.parentElement ?? host,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
        tl.fromTo(host, { yPercent: 16, opacity: 0.4 }, { yPercent: 0, opacity: 1, ease: "power2.out", duration: 1.2 }, 0);
        if (wave) tl.fromTo(wave, { yPercent: 10 }, { yPercent: -6, ease: "none", duration: 4 }, 0);
        if (rider) tl.fromTo(rider, { xPercent: -22 * dist, rotate: -2 * dist }, { xPercent: 24 * dist, rotate: 2 * dist, ease: "none", duration: 4 }, 0);
        tl.to(host, { opacity: 0.25, yPercent: -14, ease: "power2.in", duration: 1.1 }, 3.1);
      }, host);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [direction, mode]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{ opacity: mode === "intro" ? 1 : 0 }}
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${colorClass} ${className}`}
    >
      <Scene className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] sm:w-full h-full opacity-[0.42] dark:opacity-[0.5]" />
    </div>
  );
}
