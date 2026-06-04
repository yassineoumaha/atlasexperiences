"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation, Loader2 } from "lucide-react";
import { nearestCity, inMorocco } from "@/lib/geo";
import { track } from "@/lib/analytics";

/**
 * Asks the browser for the user's location (with explicit consent via the
 * native permission prompt), finds the nearest Morocco city, and filters the
 * listing to it — "Experiences near you in Agadir". No coordinates are stored
 * or sent anywhere; resolution happens entirely client-side.
 */
export function NearMeButton({ locale, label }: { locale: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function locate() {
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support location.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const city = nearestCity(latitude, longitude);
        setLoading(false);
        if (!city) {
          setError("Couldn't match your location to a city.");
          return;
        }
        track("near_me_used", { city: city.slug, inMorocco: inMorocco(latitude, longitude) });
        const params = new URLSearchParams({ city: city.slug, near: "1" });
        router.push(`/${locale}/experiences?${params.toString()}`);
      },
      (err) => {
        setLoading(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. You can still pick a city manually."
            : "Couldn't get your location. Try picking a city below.",
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={locate}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-accent hover:brightness-105 text-accent-foreground font-bold px-4 h-11 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        {label ?? "Experiences near me"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
