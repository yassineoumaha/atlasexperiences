import { createClient } from "@/lib/supabase/server";
import { EXPERIENCE_CITIES } from "@/lib/experiences-data";

async function getPlatformStats() {
  try {
    const supabase = await createClient();
    const [operatorsRes, experiencesRes, destinationsRes] = await Promise.all([
      (supabase as unknown as any).from("operators").select("id", { count: "exact", head: true }).eq("verified", true),
      (supabase as unknown as any).from("experiences").select("id", { count: "exact", head: true }).eq("published", true).eq("approved", true),
      (supabase as unknown as any).from("destinations").select("id", { count: "exact", head: true }),
    ]);
    return {
      operators: (operatorsRes.count as number) ?? 0,
      experiences: (experiencesRes.count as number) ?? 0,
      destinations: (destinationsRes.count as number) ?? 0,
    };
  } catch {
    return { operators: 0, experiences: 0, destinations: 0 };
  }
}

export default async function StatsSection() {
  const stats = await getPlatformStats();

  const ADVANTAGES = [
    { icon: "🤝", text: "Book directly with local operators — no Viator markup" },
    { icon: "✅", text: "Every operator personally verified before listing" },
    { icon: "💬", text: "Real-time chat with your guide before booking" },
  ];

  const STATS = [
    {
      value: stats.operators > 0 ? `${stats.operators}` : "—",
      label: "Local\nOperators",
      desc: "Verified guides",
      show: true,
    },
    {
      value: stats.experiences > 0 ? `${stats.experiences}` : "—",
      label: "Authentic\nExperiences",
      desc: "Listed & approved",
      show: true,
    },
    {
      value: `${EXPERIENCE_CITIES.length}`,
      label: "Moroccan\nDestinations",
      desc: "Across all regions",
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
              Why Imourig
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground section-title mb-4">
              Authentic Morocco,<br />
              <span className="text-accent">direct from locals.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
              We connect travelers directly with vetted local operators — no inflated prices,
              no middlemen. Just genuine Morocco experiences at honest rates.
            </p>

            {/* Live stats — only shown when we have real data */}
            {hasData && (
              <div className="grid grid-cols-3 gap-6 mb-10">
                {STATS.map(({ value, label, desc }) => (
                  <div key={label} className="text-center sm:text-left">
                    <div className="stat-number text-foreground mb-1">{value}</div>
                    <span className="block text-muted-foreground text-sm leading-snug whitespace-pre-line">{label}</span>
                    <span className="block text-muted-foreground/70 text-xs mt-0.5">{desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Platform advantages */}
            <div className="space-y-3">
              {ADVANTAGES.map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                  <p className="text-foreground/80 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: overlapping image composition */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="img-hover-zoom w-64 sm:w-72 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.pexels.com/photos/1009861/pexels-photo-1009861.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                  alt="Morocco experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-36 sm:w-44 h-48 sm:h-56 rounded-xl overflow-hidden shadow-2xl border-4 border-white img-hover-zoom">
                <img
                  src="https://images.pexels.com/photos/5560779/pexels-photo-5560779.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop"
                  alt="Moroccan cooking"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
