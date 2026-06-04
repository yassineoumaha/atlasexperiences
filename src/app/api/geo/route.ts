import { NextRequest, NextResponse } from "next/server";
import { nearestCity, inMorocco } from "@/lib/geo";

/**
 * IP-based location fallback for the "Experiences near me" button.
 *
 * When the browser's GPS permission is denied (or unavailable), the client
 * falls back to this endpoint. It reads the coarse, city-level coordinates
 * Vercel attaches to every request from its edge network — no third-party API,
 * no API key, and nothing is stored. IP geolocation is approximate (city, not
 * street), which is exactly the precision the "nearest city" filter needs.
 *
 * Returns the nearest Morocco city, or 404 if no location could be derived
 * (e.g. running locally where the Vercel geo headers are absent).
 */
export async function GET(request: NextRequest) {
  const lat = parseFloat(request.headers.get("x-vercel-ip-latitude") ?? "");
  const lng = parseFloat(request.headers.get("x-vercel-ip-longitude") ?? "");
  const country = request.headers.get("x-vercel-ip-country") ?? null;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "Location unavailable from network." },
      { status: 404 },
    );
  }

  const city = nearestCity(lat, lng);
  if (!city) {
    return NextResponse.json(
      { error: "Could not match location to a city." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    city: city.slug,
    name: city.name,
    distanceKm: city.distanceKm,
    inMorocco: inMorocco(lat, lng),
    country,
    source: "ip",
  });
}
