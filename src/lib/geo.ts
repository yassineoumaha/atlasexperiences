import { ALL_CITIES } from "@/components/map/morocco-data";

/** Great-circle distance between two lat/lng points, in kilometres. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface NearestCity {
  name: string;
  slug: string;
  distanceKm: number;
}

/**
 * Find the Morocco city closest to a coordinate. Returns the city plus the
 * distance, so the UI can say "near you in Agadir (12 km)" — and a caller can
 * decide whether the user is even plausibly in Morocco (see `inMorocco`).
 */
export function nearestCity(lat: number, lng: number): NearestCity | null {
  let best: NearestCity | null = null;
  for (const c of ALL_CITIES) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (!best || d < best.distanceKm) {
      best = { name: c.name, slug: c.slug, distanceKm: Math.round(d) };
    }
  }
  return best;
}

/** Rough bounding box for Morocco (incl. Western Sahara) — used to warn users
 *  who aren't actually in the country that "near me" won't be meaningful. */
export function inMorocco(lat: number, lng: number): boolean {
  return lat >= 20.5 && lat <= 36.5 && lng >= -18 && lng <= -0.8;
}
