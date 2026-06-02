"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ExperienceRow } from "@/lib/supabase/types";
import { ArrowLeft, Upload, Plus, X, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { CATEGORY_LIST, EXPERIENCE_CITIES } from "@/lib/experiences-data";

const LANGUAGES = ["English", "French", "Arabic", "Spanish", "German"];

export default function CreateExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "surf",
    city: "Agadir",
    description: "",
    price_per_person: 50,
    price_group: "",
    duration_hours: 2,
    max_group_size: 8,
    min_age: 0,
    languages: ["English"] as string[],
    meeting_point: "",
    cancellation: "24h",
    highlights: [""] as string[],
    includes: [""] as string[],
    excludes: [""] as string[],
    what_to_bring: [""] as string[],
    images: [] as string[],
  });

  function toggleLanguage(l: string) {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(l)
        ? f.languages.filter(x => x !== l)
        : [...f.languages, l],
    }));
  }

  function updateListItem(field: "highlights" | "includes" | "excludes" | "what_to_bring", idx: number, val: string) {
    setForm(f => {
      const arr = [...f[field]];
      arr[idx] = val;
      return { ...f, [field]: arr };
    });
  }

  function addListItem(field: "highlights" | "includes" | "excludes" | "what_to_bring") {
    setForm(f => ({ ...f, [field]: [...f[field], ""] }));
  }

  function removeListItem(field: "highlights" | "includes" | "excludes" | "what_to_bring", idx: number) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (form.images.length + files.length > 8) {
      alert("Maximum 8 images per experience.");
      return;
    }
    setUploadingImages(true);
    const supabase = createClient();
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data } = await supabase.storage.from("experiences").upload(path, file, { upsert: false });
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from("experiences").getPublicUrl(data.path);
        setForm(f => ({ ...f, images: [...f.images, publicUrl] }));
      }
    }
    setUploadingImages(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${locale}/auth/login`); return; }

    const slug = form.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) + "-" + Date.now().toString(36);

    const { error: err } = await supabase.from("experiences").insert({
      operator_id: user.id,
      title: form.title,
      slug,
      category: form.category as ExperienceRow["category"],
      city: form.city,
      description: form.description,
      price_per_person: form.price_per_person,
      price_group: form.price_group ? parseInt(form.price_group as string) : null,
      duration_hours: form.duration_hours,
      max_group_size: form.max_group_size,
      min_age: form.min_age,
      languages: form.languages,
      meeting_point: form.meeting_point || null,
      cancellation: form.cancellation,
      highlights: form.highlights.filter(Boolean),
      includes: form.includes.filter(Boolean),
      excludes: form.excludes.filter(Boolean),
      what_to_bring: form.what_to_bring.filter(Boolean),
      images: form.images,
      published: true,
      approved: false, // awaits admin approval
    });

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setSuccess(true);
    setSaving(false);
  }

  if (success) return (
    <div className="pt-20 min-h-screen bg-muted/40 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-foreground mb-2">Experience Submitted!</h2>
        <p className="text-foreground/80 mb-6">Our team will review and approve your listing within 48 hours. You'll receive an email once it's live.</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/${locale}/portal`} className="bg-accent hover:brightness-105 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
            My Dashboard
          </Link>
          <button onClick={() => { setSuccess(false); setForm({ title: "", category: "surf", city: "Agadir", description: "", price_per_person: 50, price_group: "", duration_hours: 2, max_group_size: 8, min_age: 0, languages: ["English"], meeting_point: "", cancellation: "24h", highlights: [""], includes: [""], excludes: [""], what_to_bring: [""], images: [] }); }}
            className="border border-input text-foreground/80 font-bold px-5 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">
            Add Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-muted/40">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${locale}/portal`} className="text-muted-foreground hover:text-foreground/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-foreground">Create a New Listing</h1>
            <p className="text-muted-foreground text-sm">Reviewed within 48h · Goes live after approval</p>
          </div>
        </div>

        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basics */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground/80 text-xs uppercase tracking-widest">Basics</h3>
            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. 2-Hour Surf Lesson in Taghazout"
                className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card">
                  {CATEGORY_LIST.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">City *</label>
                <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card">
                  {EXPERIENCE_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} placeholder="Describe your experience. What will travelers do? What makes it special?"
                className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none bg-card" />
            </div>
          </div>

          {/* Pricing & logistics */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground/80 text-xs uppercase tracking-widest">Pricing & Logistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Price/person (USD) *</label>
                <input type="number" min={1} value={form.price_per_person}
                  onChange={e => setForm(f => ({ ...f, price_per_person: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Group price (opt.)</label>
                <input type="number" min={1} value={form.price_group}
                  onChange={e => setForm(f => ({ ...f, price_group: e.target.value }))}
                  placeholder="Private"
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Duration (hours)</label>
                <input type="number" min={0.5} step={0.5} value={form.duration_hours}
                  onChange={e => setForm(f => ({ ...f, duration_hours: parseFloat(e.target.value) || 1 }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Max group size</label>
                <input type="number" min={1} value={form.max_group_size}
                  onChange={e => setForm(f => ({ ...f, max_group_size: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Meeting point</label>
                <input value={form.meeting_point} onChange={e => setForm(f => ({ ...f, meeting_point: e.target.value }))}
                  placeholder="e.g. Taghazout main beach car park"
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/80 mb-1">Cancellation policy</label>
                <select value={form.cancellation} onChange={e => setForm(f => ({ ...f, cancellation: e.target.value }))}
                  className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card">
                  <option value="free_cancel">Free cancellation anytime</option>
                  <option value="24h">Free up to 24h before</option>
                  <option value="48h">Free up to 48h before</option>
                  <option value="no_refund">Non-refundable</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-2">Languages spoken</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <button key={l} type="button" onClick={() => toggleLanguage(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.languages.includes(l) ? "bg-accent text-white border-amber-500" : "bg-card text-foreground/80 border-input hover:border-amber-300"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lists: highlights, includes, excludes, what to bring */}
          {(["highlights", "includes", "excludes", "what_to_bring"] as const).map(field => (
            <div key={field} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground/80 text-xs uppercase tracking-widest">
                  {field === "what_to_bring" ? "What to Bring" : field.charAt(0).toUpperCase() + field.slice(1)}
                </h3>
                <button type="button" onClick={() => addListItem(field)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-accent-foreground font-medium">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form[field].map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input value={item} onChange={e => updateListItem(field, idx, e.target.value)}
                      placeholder={field === "highlights" ? "e.g. Learn to stand up on your first wave" : field === "includes" ? "e.g. Surfboard and wetsuit" : field === "excludes" ? "e.g. Transport to beach" : "e.g. Sunscreen, towel"}
                      className="flex-1 border border-input rounded-xl px-3 py-2 text-sm outline-none focus:border-primary bg-card" />
                    {form[field].length > 1 && (
                      <button type="button" onClick={() => removeListItem(field, idx)}
                        className="text-stone-300 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Photos */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground/80 text-xs uppercase tracking-widest mb-3">Photos (up to 8)</h3>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-input rounded-xl p-5 cursor-pointer hover:border-amber-300 transition-colors">
              {uploadingImages
                ? <><Loader2 className="w-5 h-5 animate-spin text-accent" /><span className="text-primary text-sm">Uploading...</span></>
                : <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground text-sm">Upload photos ({form.images.length}/8)</span></>
              }
              <input type="file" accept="image/*" multiple disabled={uploadingImages || form.images.length >= 8} onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-xs text-accent-foreground">
            After approval, travelers can find and book your experience on Imourig.
            You'll receive booking requests by email. Imourig invoices <strong>10% of confirmed bookings</strong> monthly.
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-accent hover:brightness-105 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
