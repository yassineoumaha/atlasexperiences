import {
  ShieldCheck,
  BadgeCheck,
  Tag,
  Lock,
  Compass,
  Star,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { ZellijStar } from "@/components/zellij/Zellij";

/**
 * Trust / "Why Imourig" section — frames the marketplace problem, our
 * solution, and the six trust pillars travelers care about. Static copy,
 * fully localized via `dict.trustSection`.
 */
export default function TrustSection({ dict }: { dict: Dictionary }) {
  const t = dict.trustSection;

  const PILLARS = [
    { icon: ShieldCheck, title: t.pillar1Title, desc: t.pillar1Desc },
    { icon: BadgeCheck, title: t.pillar2Title, desc: t.pillar2Desc },
    { icon: Tag, title: t.pillar3Title, desc: t.pillar3Desc },
    { icon: Lock, title: t.pillar4Title, desc: t.pillar4Desc },
    { icon: Compass, title: t.pillar5Title, desc: t.pillar5Desc },
    { icon: Star, title: t.pillar6Title, desc: t.pillar6Desc },
  ];

  return (
    <section className="py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
            <ZellijStar size={16} className="text-accent" /> {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground section-title mb-6">
            {t.heading}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{t.problem}</p>
          <p className="text-foreground/80 leading-relaxed font-medium">{t.solution}</p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/40"
            >
              <span className="shrink-0 w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-foreground mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
