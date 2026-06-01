"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Shield, TrendingUp, Users } from "lucide-react";
import { EXPERIENCE_CITIES, CATEGORY_LIST } from "@/lib/experiences-data";
import type { Dictionary } from "@/lib/dictionaries";

const LANGUAGES = ["English", "French", "Arabic", "Spanish", "German", "Italian", "Dutch"];

export default function OperatorRegisterClient({ locale, dict }: { locale: string; dict: Dictionary }) {
  const d = dict.operators;
  const [step, setStep] = useState<"intro" | "form" | "done">("intro");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", city: "Agadir", bio: "", phone: "", whatsapp: "",
    languages: ["English"] as string[], years_experience: 1,
    categories: [] as string[], email: "", password: "",
  });

  function toggleLanguage(l: string) {
    setForm((f) => ({ ...f, languages: f.languages.includes(l) ? f.languages.filter((x) => x !== l) : [...f.languages, l] }));
  }
  function toggleCategory(c: string) {
    setForm((f) => ({ ...f, categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.categories.length === 0) { alert("Please select at least one activity category."); return; }
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { display_name: form.business_name } },
      });
      if (authError) { alert(authError.message); setLoading(false); return; }

      const userId = authData.user?.id;
      if (!userId) { alert("Sign up failed. Please try again."); setLoading(false); return; }

      const slug = form.business_name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50) + "-" + Date.now().toString(36);

      await (supabase as unknown as any).from("operators").insert({
        id: userId, business_name: form.business_name, slug,
        city: form.city, bio: form.bio, phone: form.phone, whatsapp: form.whatsapp || form.phone,
        languages: form.languages, years_experience: form.years_experience,
        verified: false, commission_rate: 10,
      });

      await (supabase as unknown as any).from("user_profiles").upsert({
        id: userId, display_name: form.business_name, role: "lister",
      });

      setStep("done");
    } catch (err: any) {
      alert(err?.message ?? "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (step === "done") return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-stone-900 mb-2">Application Received!</h2>
        <p className="text-stone-600 mb-4">
          Our team will review and verify your operator profile within 48 hours.
          Once approved, you can log in and create your experience listings.
        </p>
        <p className="text-stone-500 text-sm mb-6">
          Check your email to confirm your account, then use the Portal to start adding experiences.
        </p>
        <Link href={`/${locale}/portal`} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
          Go to My Portal
        </Link>
      </div>
    </div>
  );

  const BENEFITS = [
    { icon: <TrendingUp className="w-5 h-5" />, title: d.benefit2Title, desc: d.benefit2Desc },
    { icon: <Users className="w-5 h-5" />, title: d.benefit3Title, desc: d.benefit3Desc },
    { icon: <Shield className="w-5 h-5" />, title: d.benefit4Title, desc: d.benefit4Desc },
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm px-4 py-1.5 rounded-full mb-5">
            🆓 {d.registerBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">{d.registerTitle}</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">{d.registerSub}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === "intro" && (
          <>
            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-4 bg-stone-50 border border-stone-100 rounded-2xl p-5">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">{b.icon}</div>
                  <div>
                    <h3 className="font-black text-stone-900 mb-1">{b.title}</h3>
                    <p className="text-stone-500 text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm mb-12">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-stone-600">Feature</th>
                    <th className="text-center px-5 py-3 font-semibold text-stone-600">Other Platforms</th>
                    <th className="text-center px-5 py-3 font-bold text-amber-600">Atlas Experiences</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {[
                    ["Commission rate",         "20–30%",      "10% ✅"],
                    ["Monthly fee",             "$29+ listing fee", "Free ✅"],
                    ["Morocco SEO focus",       "Global, diluted", "Morocco-only ✅"],
                    ["Arabic/French support",   "Limited",     "4 languages ✅"],
                    ["Direct traveler contact", "Through platform", "WhatsApp / direct ✅"],
                    ["Payout timing",           "Weekly delays",  "Monthly invoice ✅"],
                  ].map(([feature, them, us]) => (
                    <tr key={feature} className="hover:bg-stone-50">
                      <td className="px-5 py-3 font-medium text-stone-700">{feature}</td>
                      <td className="px-5 py-3 text-center text-stone-400">{them}</td>
                      <td className="px-5 py-3 text-center font-semibold text-emerald-600">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center">
              <button onClick={() => setStep("form")}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg">
                {d.joinBtn}
              </button>
              <p className="text-stone-400 text-sm mt-3">{d.joinNote}</p>
            </div>
          </>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-stone-900">Create Your Operator Account</h2>

            <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Password *</label>
                  <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Business Info</h3>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Business / Guide Name *</label>
                <input required value={form.business_name} onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
                  placeholder="e.g. Youssef Surf Academy" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Base City *</label>
                  <select value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white">
                    {EXPERIENCE_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Years of Experience</label>
                  <input type="number" min={1} max={40} value={form.years_experience}
                    onChange={(e) => setForm((f) => ({ ...f, years_experience: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+212..." className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">WhatsApp</label>
                  <input type="tel" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="Same as phone?" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Short Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3} placeholder="Tell travelers about yourself and your experience in Morocco..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none bg-white" />
              </div>
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-3">Activity Categories *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LIST.filter((c) => c.key !== "other").map((cat) => (
                  <button key={cat.key} type="button" onClick={() => toggleCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.categories.includes(cat.key) ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"
                    }`}>
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-3">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button key={l} type="button" onClick={() => toggleLanguage(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.languages.includes(l) ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
              By registering, you agree to pay Atlas Experiences <strong>10% of each confirmed booking value</strong>, invoiced monthly.
              Free to list. No payment until you earn. See our <Link href={`/${locale}/terms`} className="underline">Terms & Conditions</Link>.
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Creating your account..." : "Create Operator Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
