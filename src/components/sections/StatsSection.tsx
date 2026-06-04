import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { EXPERIENCE_CITIES } from "@/lib/experiences-data";
import type { Dictionary } from "@/lib/dictionaries";

async function getPlatformStats() {
  try {
    const supabase = await createClient();
    const [operatorsRes, experiencesRes] = await Promise.all([
      supabase.from("operators").select("id", { count: "exact", head: true }).eq("verified", true),
      supabase.from("experiences").select("id", { count: "exact", head: true }).eq("published", true).eq("approved", true),
    ]);
    return {
      operators: operatorsRes.count ?? 0,
      experiences: experiencesRes.count ?? 0,
    };
  } catch {
    return { operators: 0, experiences: 0 };
  }
}

export default async function StatsSection({ dict }: { dict: Dictionary }) {
  const stats = await getPlatformStats();
  const t = dict.stats;

  const STATS = [
    {
      value: stats.operators > 0 ? `${stats.operators}` : "—",
      label: t.operators,
      desc: t.operatorsDesc,
      show: true,
    },
    {
      value: stats.experiences > 0 ? `${stats.experiences}` : "—",
      label: t.experiences,
      desc: t.experiencesDesc,
      show: true,
    },
    {
      value: `${EXPERIENCE_CITIES.length}`,
      label: t.destinations,
      desc: t.destinationsDesc,
      show: true,
    },
  ];

  const hasData = true;

  return (
    <section className="py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: why us + stats */}
          <div>
            <span className="block text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
              {t.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground section-title mb-8">
              {t.heading1}<br />
              <span className="text-accent">{t.heading2}</span>
            </h2>

            {/* Live stats — only shown when we have real data */}
            {hasData && (
              <div className="grid grid-cols-3 gap-6">
                {STATS.map(({ value, label, desc }) => (
                  <div key={label} className="text-center sm:text-left">
                    <div className="stat-number text-foreground mb-1">{value}</div>
                    <span className="block text-muted-foreground text-sm leading-snug whitespace-pre-line">{label}</span>
                    <span className="block text-muted-foreground/70 text-xs mt-0.5">{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: overlapping image composition */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="img-hover-zoom relative w-64 sm:w-72 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/1009861/pexels-photo-1009861.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                  alt="Morocco experience"
                  fill
                  sizes="(max-width: 640px) 256px, 288px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-36 sm:w-44 h-48 sm:h-56 rounded-xl overflow-hidden shadow-2xl border-4 border-white img-hover-zoom">
                <Image
                  src="https://images.pexels.com/photos/5560779/pexels-photo-5560779.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop"
                  alt="Moroccan cooking"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
