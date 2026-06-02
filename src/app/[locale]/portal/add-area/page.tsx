"use client";

import { useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Plus, X, Loader2, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { EXPERIENCE_CITIES } from "@/lib/experiences-data";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AddAreaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    city: "Agadir", area_name: "", description: "",
    best_for: [""] as string[],
    best_months: [] as string[],
    tips: [""] as string[],
  });

  function setListItem(field: "best_for" | "tips", i: number, val: string) {
    setForm(f => { const a = [...f[field]]; a[i] = val; return { ...f, [field]: a }; });
  }
  function addItem(field: "best_for" | "tips") {
    setForm(f => ({ ...f, [field]: [...f[field], ""] }));
  }
  function removeItem(field: "best_for" | "tips", i: number) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, j) => j !== i) }));
  }
  function toggleMonth(m: string) {
    setForm(f => ({ ...f, best_months: f.best_months.includes(m) ? f.best_months.filter(x => x !== m) : [...f.best_months, m] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${locale}/auth/login`); return; }
    const { error } = await (supabase as unknown as any).from("operator_areas").insert({
      operator_id:  user.id,
      city:         form.city,
      area_name:    form.area_name,
      description:  form.description,
      best_for:     form.best_for.filter(Boolean),
      best_months:  form.best_months,
      tips:         form.tips.filter(Boolean),
      published:    true,
    });
    if (!error) setDone(true);
    setSaving(false);
  }

  if (done) return (
    <div className="pt-20 min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-foreground mb-2">Area Guide Published!</h2>
        <p className="text-muted-foreground mb-6">Your local knowledge is now live and helping travelers discover {form.area_name}.</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/${locale}/portal`} className="bg-accent hover:brightness-105 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">My Portal</Link>
          <button onClick={() => { setDone(false); setForm({ city: "Agadir", area_name: "", description: "", best_for: [""], best_months: [], tips: [""] }); }}
            className="border border-input text-foreground/80 font-medium px-5 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">Add Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-muted/40">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${locale}/portal`} className="text-muted-foreground hover:text-foreground/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" /> Add Local Area Guide
            </h1>
            <p className="text-muted-foreground text-sm">Share your insider knowledge of a spot, beach, or neighborhood</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basics */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">City *</label>
                <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary">
                  {EXPERIENCE_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Area / Spot Name *</label>
                <input required value={form.area_name} onChange={e => setForm(f => ({ ...f, area_name: e.target.value }))}
                  placeholder="e.g. Anza Beach, Taghazout Point"
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} placeholder="What makes this area special? Describe the vibe, what to expect, who it's good for..."
                className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none" />
            </div>
          </div>

          {/* Best for */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Best For</span>
              <button type="button" onClick={() => addItem("best_for")}
                className="flex items-center gap-1 text-xs text-primary hover:text-accent-foreground font-medium">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.best_for.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input value={item} onChange={e => setListItem("best_for", i, e.target.value)}
                    placeholder="e.g. Beginner surfers, Sunset views, Local food"
                    className="flex-1 border border-input rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  {form.best_for.length > 1 && (
                    <button type="button" onClick={() => removeItem("best_for", i)}
                      className="text-stone-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Best months */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Best Months to Visit</span>
            <div className="flex flex-wrap gap-2">
              {MONTHS.map(m => (
                <button key={m} type="button" onClick={() => toggleMonth(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    form.best_months.includes(m)
                      ? "bg-accent text-white border-amber-500"
                      : "bg-card text-foreground/80 border-input hover:border-amber-300"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Local Tips</span>
              <button type="button" onClick={() => addItem("tips")}
                className="flex items-center gap-1 text-xs text-primary hover:text-accent-foreground font-medium">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.tips.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input value={item} onChange={e => setListItem("tips", i, e.target.value)}
                    placeholder="e.g. Free parking by the lighthouse, avoid August crowds"
                    className="flex-1 border border-input rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  {form.tips.length > 1 && (
                    <button type="button" onClick={() => removeItem("tips", i)}
                      className="text-stone-300 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-accent hover:brightness-105 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base">
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? "Publishing..." : "Publish Area Guide"}
          </button>
        </form>
      </div>
    </div>
  );
}
