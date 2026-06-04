"use client";

import { useState } from "react";
import { Mail, CheckCircle, MapPin, Compass, Star } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";

interface Props { dict: Dictionary; }

export default function NewsletterSection({ dict }: Props) {
  const n = dict.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PERKS = [
    { icon: MapPin,  text: n.perk1 },
    { icon: Star,    text: n.perk2 },
    { icon: Compass, text: n.perk3 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    const { subscribeAction } = await import("@/app/actions/newsletter");
    const locale = window.location.pathname.split("/")[1] || "en";
    const result = await subscribeAction(email, locale);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* Background — Majorelle blue → terracotta, zellij-textured */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.42_0.18_264)] via-[oklch(0.46_0.16_300)] to-[oklch(0.54_0.15_38)]" />

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      {/* Zellij texture */}
      <div className="zellij-bg absolute inset-0 opacity-[0.08] mix-blend-screen pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> {n.badge}
            </div>
            <h2
              className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight section-title"
            >
              {n.title}
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">{n.subtitle}</p>

            {/* Perks */}
            <div className="space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-black text-xl mb-2">{n.success}</h3>
                <p className="text-white/70 text-sm">{n.successSub}</p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-black text-lg mb-1">{n.formTitle}</h3>
                <p className="text-white/70 text-sm mb-6">{n.formSub}</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={n.placeholder}
                    className="w-full px-5 py-4 rounded-xl outline-none text-stone-800 placeholder-stone-400 bg-white text-base shadow-sm focus:ring-2 focus:ring-white/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:brightness-105 text-accent-foreground px-6 min-h-[3.25rem] rounded-xl font-bold transition-all disabled:opacity-60 shadow-sm active:scale-[0.98]"
                  >
                    {loading ? n.subscribing : n.subscribe}
                  </button>
                </form>

                {error && (
                  <p className="text-white/80 text-sm mt-3 bg-white/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <p className="text-white/50 text-xs mt-4 text-center">{n.privacy}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
