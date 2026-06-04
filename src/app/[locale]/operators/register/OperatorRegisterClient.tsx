"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Shield, TrendingUp, Users } from "lucide-react";
import { EXPERIENCE_CITIES, CATEGORY_LIST } from "@/lib/experiences-data";
import { registerOperatorAction } from "@/app/actions/operators";
import { track } from "@/lib/analytics";
import type { Dictionary } from "@/lib/dictionaries";

const LANGUAGES = ["English", "French", "Arabic", "Spanish", "German", "Italian", "Dutch"];

export default function OperatorRegisterClient({ locale, dict }: { locale: string; dict: Dictionary }) {
  const d = dict.operators;
  const r = d.register;
  const lang = d.languages;
  const catLabels = dict.categories;
  const [step, setStep] = useState<"intro" | "form" | "done">("intro");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", city: "Agadir", bio: "", phone: "", whatsapp: "",
    languages: ["English"] as string[], years_experience: 1,
    categories: [] as string[], email: "", password: "",
    // Compliance (Morocco): collected at signup, copies verified during review.
    license_number: "",
  });
  // Compliance attestations — must be ticked to submit.
  const [attest, setAttest] = useState({ licences: false, docs: false });

  function toggleLanguage(l: string) {
    setForm((f) => ({ ...f, languages: f.languages.includes(l) ? f.languages.filter((x) => x !== l) : [...f.languages, l] }));
  }
  function toggleCategory(c: string) {
    setForm((f) => ({ ...f, categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.categories.length === 0) { alert(r.errNoCategory); return; }
    if (!attest.licences || !attest.docs) {
      alert(r.errNoAttest);
      return;
    }
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
      if (!userId) { alert(r.errSignupFailed); setLoading(false); return; }

      // Create the operator profile server-side (service role) so it lands as a
      // pending operator even when email confirmation leaves the client without
      // a session — an anon-client insert here would be denied by RLS.
      const res = await registerOperatorAction({
        userId,
        business_name: form.business_name,
        city: form.city,
        bio: form.bio,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        languages: form.languages,
        years_experience: form.years_experience,
        license_number: form.license_number,
      });

      if (!res.ok) { alert(res.error); setLoading(false); return; }

      track("operator_signup", { city: form.city });
      setStep("done");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : r.errGeneric);
    }
    setLoading(false);
  }

  if (step === "done") return (
    <div className="pt-20 min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-foreground mb-2">{r.doneTitle}</h2>
        <p className="text-foreground/80 mb-4">{r.doneBody}</p>
        <p className="text-muted-foreground text-sm mb-6">{r.doneEmail}</p>
        <Link href={`/${locale}/portal`} className="bg-accent hover:brightness-105 text-white font-bold px-6 py-3 rounded-xl transition-colors">
          {r.donePortal}
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
    <div className="pt-16 min-h-screen bg-card">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-amber-400/30 text-amber-300 text-sm px-4 py-1.5 rounded-full mb-5">
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
                <div key={b.title} className="flex items-start gap-4 bg-muted/40 border border-border rounded-2xl p-5">
                  <div className="w-10 h-10 bg-amber-100 text-primary rounded-xl flex items-center justify-center shrink-0">{b.icon}</div>
                  <div>
                    <h3 className="font-black text-foreground mb-1">{b.title}</h3>
                    <p className="text-muted-foreground text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-12">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-foreground/80">{r.compareFeature}</th>
                    <th className="text-center px-5 py-3 font-semibold text-foreground/80">{r.compareOther}</th>
                    <th className="text-center px-5 py-3 font-bold text-primary">{r.compareUs}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {[
                    [r.rowCommission, r.rowCommissionOther, r.rowCommissionUs],
                    [r.rowFee,        r.rowFeeOther,        r.rowFeeUs],
                    [r.rowSeo,        r.rowSeoOther,        r.rowSeoUs],
                    [r.rowLang,       r.rowLangOther,       r.rowLangUs],
                    [r.rowContact,    r.rowContactOther,    r.rowContactUs],
                    [r.rowPayout,     r.rowPayoutOther,     r.rowPayoutUs],
                  ].map(([feature, them, us]) => (
                    <tr key={feature} className="hover:bg-muted/40">
                      <td className="px-5 py-3 font-medium text-foreground/80">{feature}</td>
                      <td className="px-5 py-3 text-center text-muted-foreground">{them}</td>
                      <td className="px-5 py-3 text-center font-semibold text-emerald-600">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center">
              <button onClick={() => setStep("form")}
                className="bg-accent hover:brightness-105 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg">
                {d.joinBtn}
              </button>
              <p className="text-muted-foreground text-sm mt-3">{d.joinNote}</p>
            </div>
          </>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-foreground">{r.formTitle}</h2>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-foreground/80 text-sm uppercase tracking-wide">{r.sectionAccount}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">{r.email} *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">{r.password} *</label>
                  <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder={r.passwordPlaceholder} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-foreground/80 text-sm uppercase tracking-wide">{r.sectionBusiness}</h3>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">{r.businessName} *</label>
                <input required value={form.business_name} onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
                  placeholder={r.businessNamePlaceholder} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">{r.baseCity} *</label>
                  <select value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card">
                    {EXPERIENCE_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">{r.yearsExperience}</label>
                  <input type="number" min={1} max={40} value={form.years_experience}
                    onChange={(e) => setForm((f) => ({ ...f, years_experience: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">{r.phone} *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder={r.phonePlaceholder} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/80 mb-1">{r.whatsapp}</label>
                  <input type="tel" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder={r.whatsappPlaceholder} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">{r.shortBio}</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3} placeholder={r.shortBioPlaceholder}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none bg-card" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-3">{r.activityCategories} *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LIST.filter((c) => c.key !== "other").map((cat) => (
                  <button key={cat.key} type="button" onClick={() => toggleCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.categories.includes(cat.key) ? "bg-accent text-white border-amber-500" : "bg-card text-foreground/80 border-border hover:border-amber-300"
                    }`}>
                    {cat.emoji} {catLabels[cat.key]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-3">{r.languagesSpoken}</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button key={l} type="button" onClick={() => toggleLanguage(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.languages.includes(l) ? "bg-accent text-white border-amber-500" : "bg-card text-foreground/80 border-border hover:border-amber-300"
                    }`}>
                    {lang[l as keyof typeof lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance documents (Morocco) */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1">{r.complianceTitle}</label>
              <p className="text-muted-foreground text-xs mb-4">{r.complianceIntro}</p>

              <div className="mb-4">
                <label className="block text-xs font-medium text-foreground/80 mb-1">
                  {r.registrationNumber}
                </label>
                <input
                  type="text"
                  value={form.license_number}
                  onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}
                  placeholder={r.registrationPlaceholder}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-card"
                />
              </div>

              <div className="space-y-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-foreground/80">
                  <input type="checkbox" checked={attest.licences}
                    onChange={(e) => setAttest((a) => ({ ...a, licences: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]" />
                  {r.attestLicences}
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-foreground/80">
                  <input type="checkbox" checked={attest.docs}
                    onChange={(e) => setAttest((a) => ({ ...a, docs: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]" />
                  {r.attestDocs}
                </label>
              </div>
            </div>

            <div className="bg-accent/10 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
              {r.commissionNoticePre} <strong>{r.commissionNoticeBold}</strong>{r.commissionNoticePost}{" "}
              <Link href={`/${locale}/terms`} className="underline">{r.termsLink}</Link>.
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-accent hover:brightness-105 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? r.submitting : r.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
