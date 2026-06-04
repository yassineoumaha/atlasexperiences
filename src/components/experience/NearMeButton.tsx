"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation, Loader2, Info } from "lucide-react";
import { nearestCity, inMorocco } from "@/lib/geo";
import { track } from "@/lib/analytics";

/**
 * "Experiences near me" locator.
 *
 * 1. Asks the browser for GPS (native permission prompt). No coordinates are
 *    stored or sent anywhere — the nearest Morocco city is resolved client-side.
 * 2. If GPS is denied / unavailable / times out, it transparently falls back to
 *    coarse IP-based location (`/api/geo`, served from Vercel edge geo headers),
 *    so the button still works without permission.
 * 3. If both fail, it shows clear recovery guidance and scrolls the user to the
 *    manual city picker.
 */
export function NearMeButton({ locale, label }: { locale: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<{ text: string; tone: "info" | "error" } | null>(null);

  function go(
    citySlug: string,
    source: "gps" | "ip",
    extra?: Record<string, string | number | boolean | undefined>,
  ) {
    track("near_me_used", { city: citySlug, source, ...extra });
    const params = new URLSearchParams({ city: citySlug, near: "1" });
    router.push(`/${locale}/experiences?${params.toString()}`);
  }

  /** Coarse IP fallback. Returns true if it navigated. */
  async function tryIpFallback(): Promise<boolean> {
    try {
      const res = await fetch("/api/geo", { cache: "no-store" });
      if (!res.ok) return false;
      const data: { city?: string; inMorocco?: boolean } = await res.json();
      if (!data.city) return false;
      go(data.city, "ip", { inMorocco: data.inMorocco });
      return true;
    } catch {
      return false;
    }
  }

  function scrollToPicker() {
    document.getElementById("city-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function denied(message: string) {
    // Permission denied or GPS failed — try IP before giving up.
    const navigated = await tryIpFallback();
    if (navigated) return;
    setLoading(false);
    setHint({ text: message, tone: "error" });
    scrollToPicker();
  }

  function locate() {
    setLoading(true);
    setHint(null);

    if (!("geolocation" in navigator)) {
      void denied("Your browser can't share location. Pick a city below ↓");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const city = nearestCity(latitude, longitude);
        if (!city) {
          void denied("Couldn't match your location to a city. Pick one below ↓");
          return;
        }
        setLoading(false);
        go(city.slug, "gps", { inMorocco: inMorocco(latitude, longitude) });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          // Don't surface a scary error yet — quietly try IP. Only if THAT
          // also fails do we explain how to re-enable the prompt.
          void denied(
            "Location is blocked. Tap the 🔒 icon in your address bar → Location → Allow, then try again — or pick a city below ↓",
          );
        } else {
          void denied("Couldn't get your location. Pick a city below ↓");
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={locate}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-accent hover:brightness-105 text-accent-foreground font-bold px-4 h-11 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        {label ?? "Experiences near me"}
      </button>
      {hint && (
        <span
          className={`inline-flex items-start gap-1.5 text-xs max-w-xs leading-relaxed ${
            hint.tone === "error" ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground"
          }`}
        >
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {hint.text}
        </span>
      )}
    </div>
  );
}
