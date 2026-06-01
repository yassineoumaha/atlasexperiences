"use client";

import { useState } from "react";
import { Mail, CheckCircle, MapPin, Compass, Star } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";

interface Props { dict: Dictionary; }

const PERKS = [
  { icon: MapPin,   text: "Hidden gems locals keep secret" },
  { icon: Star,     text: "Exclusive early-access deals" },
  { icon: Compass,  text: "Monthly Morocco travel guides" },
];

export default function NewsletterSection({ dict }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <section className="relative py-24 overflow-hidden">
      {/* Background — warm Sahara gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700" />

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Newsletter
            </div>
            <h2
              className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight section-title"
            >
              {dict.newsletter.title}
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">{dict.newsletter.subtitle}</p>

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
                <h3 className="text-white font-black text-xl mb-2">{dict.newsletter.success}</h3>
                <p className="text-white/70 text-sm">Check your inbox — your first Morocco guide is on its way.</p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-black text-lg mb-6">Join {">"}5,000 Morocco travelers</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={dict.newsletter.placeholder}
                    className="w-full px-5 py-4 rounded-xl outline-none text-stone-800 placeholder-stone-400 bg-white text-base shadow-sm focus:ring-2 focus:ring-white/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-60 shadow-sm hover:shadow-lg active:scale-[0.98]"
                  >
                    {loading ? "Subscribing…" : dict.newsletter.subscribe}
                  </button>
                </form>

                {error && (
                  <p className="text-white/80 text-sm mt-3 bg-white/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <p className="text-white/50 text-xs mt-4 text-center">{dict.newsletter.privacy}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
