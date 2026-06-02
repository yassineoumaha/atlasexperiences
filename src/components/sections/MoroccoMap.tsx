"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { MapPin, Sun, Thermometer, Star, ArrowRight, ChevronLeft, X, Search } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { REGIONS, ALL_CITIES, type CityInfo, type RegionInfo } from "@/components/map/morocco-data";

// ── Map dict type ──────────────────────────────────────────────────────────────

interface MapDict {
  title: string;
  subtitle: string;
  hover: string;
  hoverSub: string;
  allCities: string;
  bestFor: string;
  bestTime: string;
  mustSee: string;
  climate: string;
  browseBtn: string;
  legend1: string;
  legend2: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoroccoMap({ locale, dict }: { locale: string; dict: MapDict }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<
    { marker: Marker; el: HTMLElement; inner: HTMLElement | null; cityName: string; color: string }[]
  >([]);

  const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_CITIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.bestFor.some(b => b.toLowerCase().includes(q)) ||
        c.regionLabel.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const handleRegionClick = useCallback((region: RegionInfo) => {
    setSelectedRegion(prev => (prev?.id === region.id ? null : region));
    setSelectedCity(null);
    setSearchQuery("");
  }, []);

  const handleCitySelect = useCallback((city: CityInfo) => {
    setSelectedCity(city);
    setSearchQuery("");
    // Fly map to city
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [city.lng, city.lat], zoom: 9, duration: 900 });
    }
  }, []);

  // Init MapLibre
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let map: MapLibreMap;
    import("maplibre-gl").then(maplibregl => {
      map = new maplibregl.Map({
        container: mapContainer.current!,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [-7.0, 30.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.setMaxBounds([[-18, 20.5], [-0.8, 36.5]]);
      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);

        REGIONS.forEach(region => {
          region.cities.forEach(city => {
            // Outer wrapper: fixed 32×32 box — MapLibre anchors this, never transforms it
            const el = document.createElement("div");
            el.style.cssText = `
              width: 32px; height: 32px;
              display: flex; align-items: center; justify-content: center;
              cursor: pointer;
            `;

            // Inner circle: this is what scales/colors on hover
            const inner = document.createElement("div");
            inner.style.cssText = `
              width: 26px; height: 26px;
              background: white;
              border: 2.5px solid ${region.color};
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-size: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.18);
              transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
              transform-origin: center center;
              will-change: transform;
            `;
            inner.innerHTML = `<span style="line-height:1;pointer-events:none">${city.emoji}</span>`;
            el.title = city.name;
            el.appendChild(inner);

            el.addEventListener("click", () => {
              const reg = REGIONS.find(r => r.cities.some(c => c.name === city.name)) ?? region;
              setSelectedRegion(reg);
              setSelectedCity(city);
            });
            el.addEventListener("mouseenter", () => {
              if (el.getAttribute("data-selected") !== "true") {
                inner.style.transform = "scale(1.25)";
                inner.style.background = region.color;
                inner.style.boxShadow = `0 3px 12px rgba(0,0,0,0.25)`;
              }
            });
            el.addEventListener("mouseleave", () => {
              if (el.getAttribute("data-selected") !== "true") {
                inner.style.transform = "scale(1)";
                inner.style.background = "white";
                inner.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
              }
            });

            const marker = new maplibregl.Marker({ element: el, anchor: "center" })
              .setLngLat([city.lng, city.lat])
              .addTo(map);

            markersRef.current.push({ marker, el, inner, cityName: city.name, color: region.color });
          });
        });
      });
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync selected city marker visual — only scale inner, never the outer wrapper
  useEffect(() => {
    markersRef.current.forEach(({ el, inner, cityName, color }) => {
      const isSelected = selectedCity?.name === cityName;
      el.setAttribute("data-selected", isSelected ? "true" : "false");
      if (inner) {
        inner.style.transform = isSelected ? "scale(1.35)" : "scale(1)";
        inner.style.background = isSelected ? color : "white";
        inner.style.boxShadow = isSelected
          ? `0 0 0 3px ${color}44, 0 4px 14px rgba(0,0,0,0.28)`
          : "0 2px 8px rgba(0,0,0,0.18)";
      }
    });
  }, [selectedCity]);

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">{dict.title}</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-6">{dict.subtitle}</p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cities, activities, regions…"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-stone-900 text-sm outline-none bg-white shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="relative max-w-md mx-auto mt-2 z-20">
              <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden text-left">
                {searchResults.map(city => (
                  <button
                    key={`${city.regionId}-${city.name}`}
                    onClick={() => {
                      const region = REGIONS.find(r => r.id === city.regionId)!;
                      setSelectedRegion(region);
                      handleCitySelect(city);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors"
                  >
                    <span className="text-xl">{city.emoji}</span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-bold text-stone-900 text-sm">{city.name}</div>
                      <div className="text-stone-400 text-xs truncate">{city.regionLabel}</div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-32 justify-end">
                      {city.bestFor.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab switcher for mobile */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-0 lg:hidden">
        <div className="flex rounded-xl bg-stone-100 p-1 gap-1">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "map" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
          >
            🗺 Map
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "list" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
          >
            📋 City List
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Map */}
          <div
            className={`flex-1 rounded-3xl shadow-sm border border-stone-100 overflow-hidden ${activeTab === "list" ? "hidden lg:block" : ""}`}
            style={{ minHeight: 560 }}
          >
            <div ref={mapContainer} className="w-full h-full" style={{ minHeight: 560 }} />
          </div>

          {/* Sidebar */}
          <div className={`lg:w-80 xl:w-96 flex flex-col gap-4 ${activeTab === "map" ? "hidden lg:flex" : "flex"}`}>

            {/* City detail card */}
            {selectedCity ? (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="bg-gradient-to-br from-stone-900 to-amber-900 text-white p-5">
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="flex items-center gap-1 text-white/60 hover:text-white text-xs mb-3 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    {selectedRegion?.label}
                  </button>
                  <div className="text-4xl mb-1">{selectedCity.emoji}</div>
                  <h2 className="text-2xl font-black">{selectedCity.name}</h2>
                  <p className="text-white/80 text-sm mt-1 leading-relaxed">{selectedCity.tagline}</p>
                </div>
                <div className="p-5 space-y-4">
                  <InfoRow icon={<Thermometer className="w-4 h-4 text-orange-500" />} label={dict.climate}>
                    {selectedCity.climate} · {selectedCity.avgTemp}
                  </InfoRow>
                  <InfoRow icon={<Sun className="w-4 h-4 text-amber-500" />} label={dict.bestTime}>
                    {selectedCity.bestSeason}
                  </InfoRow>

                  <div>
                    <div className="font-bold text-stone-800 text-sm mb-2">{dict.bestFor}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCity.bestFor.map(tag => (
                        <span key={tag} className="bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-100">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-stone-800 text-sm mb-2 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {dict.mustSee}
                    </div>
                    <ul className="space-y-1">
                      {selectedCity.mustSee.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-stone-500">
                          <span className="text-amber-400 mt-0.5 shrink-0">→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/${locale}/experiences?city=${encodeURIComponent(selectedCity.slug)}`}
                    className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    {dict.browseBtn} · {selectedCity.name} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            ) : selectedRegion ? (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-5 border-b border-stone-100 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: selectedRegion.color }} />
                      <h2 className="font-black text-stone-800 text-lg leading-tight">{selectedRegion.label}</h2>
                    </div>
                    <p className="text-stone-400 text-xs">{selectedRegion.cities.length} destination{selectedRegion.cities.length !== 1 ? "s" : ""} — tap to explore</p>
                  </div>
                  <button onClick={() => { setSelectedRegion(null); setSelectedCity(null); }} className="text-stone-300 hover:text-stone-600 transition-colors mt-0.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-stone-50 max-h-96 overflow-y-auto">
                  {selectedRegion.cities.map(city => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50 transition-colors text-left group"
                    >
                      <span className="text-2xl">{city.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-stone-800 text-sm group-hover:text-amber-700 transition-colors">{city.name}</div>
                        <div className="text-stone-400 text-xs truncate">{city.tagline}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {city.bestFor.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 text-center">
                <MapPin className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                <p className="font-bold text-stone-400 mb-1">{dict.hover}</p>
                <p className="text-stone-300 text-sm">{dict.hoverSub}</p>
              </div>
            )}

            {/* Region selector */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-4">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">{dict.allCities}</p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(region => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionClick(region)}
                    className="text-xs px-3 py-1.5 rounded-full font-medium border transition-colors flex items-center gap-1.5"
                    style={
                      selectedRegion?.id === region.id
                        ? { background: region.color, color: "#fff", borderColor: region.color }
                        : { background: "#fafaf9", color: "#57534e", borderColor: "#e7e5e4" }
                    }
                  >
                    <span>{region.cities[0].emoji}</span>
                    {region.label}
                    <span className="opacity-60">({region.cities.length})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 bg-white rounded-3xl border border-stone-100 shadow-sm divide-x divide-stone-100 text-center py-4">
              <div>
                <div className="font-black text-stone-900 text-xl">{ALL_CITIES.length}</div>
                <div className="text-stone-400 text-xs mt-0.5">Cities</div>
              </div>
              <div>
                <div className="font-black text-stone-900 text-xl">{REGIONS.length}</div>
                <div className="text-stone-400 text-xs mt-0.5">Regions</div>
              </div>
              <div>
                <div className="font-black text-stone-900 text-xl">🇲🇦</div>
                <div className="text-stone-400 text-xs mt-0.5">Morocco</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="font-bold text-stone-800 text-sm mb-0.5">{label}</div>
        <div className="text-stone-500 text-xs">{children}</div>
      </div>
    </div>
  );
}
