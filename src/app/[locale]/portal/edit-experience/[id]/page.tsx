"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Upload, Plus, X, Loader2, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { CATEGORY_LIST, EXPERIENCE_CITIES } from "@/lib/experiences-data";

const LANGUAGES = ["English", "French", "Arabic", "Spanish", "German"];

type FormState = {
  title: string;
  category: string;
  city: string;
  description: string;
  price_per_person: number;
  price_group: string;
  duration_hours: number;
  max_group_size: number;
  min_age: number;
  languages: string[];
  meeting_point: string;
  cancellation: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  what_to_bring: string[];
  images: string[];
};

const EMPTY: FormState = {
  title: "",
  category: "surf",
  city: "Agadir",
  description: "",
  price_per_person: 50,
  price_group: "",
  duration_hours: 2,
  max_group_size: 8,
  min_age: 0,
  languages: ["English"],
  meeting_point: "",
  cancellation: "24h",
  highlights: [""],
  includes: [""],
  excludes: [""],
  what_to_bring: [""],
  images: [],
};

function ensureList(v: unknown): string[] {
  const arr = Array.isArray(v) ? (v as string[]).filter(Boolean) : [];
  return arr.length ? arr : [""];
}

export default function EditExperiencePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [approved, setApproved] = useState(false);

  const [form, setForm] = useState<FormState>(EMPTY);

  // Load the existing experience (RLS restricts to the owner's own rows)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${locale}/auth/login?next=/${locale}/portal/edit-experience/${id}`); return; }

      const { data, error: err } = await (supabase as unknown as any)
        .from("experiences")
        .select("*")
        .eq("id", id)
        .eq("operator_id", user.id)
        .single();

      if (cancelled) return;

      if (err || !data) {
        setLoadError("This listing could not be found, or you don't have permission to edit it.");
        setLoading(false);
        return;
      }

      setApproved(Boolean(data.approved));
      setForm({
        title: data.title ?? "",
        category: data.category ?? "surf",
        city: data.city ?? "Agadir",
        description: data.description ?? "",
        price_per_person: data.price_per_person ?? 50,
        price_group: data.price_group != null ? String(data.price_group) : "",
        duration_hours: data.duration_hours ?? 2,
        max_group_size: data.max_group_size ?? 8,
        min_age: data.min_age ?? 0,
        languages: Array.isArray(data.languages) && data.languages.length ? data.languages : ["English"],
        meeting_point: data.meeting_point ?? "",
        cancellation: data.cancellation ?? "24h",
        highlights: ensureList(data.highlights),
        includes: ensureList(data.includes),
        excludes: ensureList(data.excludes),
        what_to_bring: ensureList(data.what_to_bring),
        images: Array.isArray(data.images) ? data.images : [],
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id, locale, router]);

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

    const { error: err } = await (supabase as unknown as any)
      .from("experiences")
      .update({
        title: form.title,
        category: form.category,
        city: form.city,
        description: form.description,
        price_per_person: form.price_per_person,
        price_group: form.price_group ? parseInt(form.price_group) : null,
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
        // Significant edits go back through review
        approved: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("operator_id", user.id);

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setSuccess(true);
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this listing permanently? This cannot be undone.")) return;
    setDeleting(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${locale}/auth/login`); return; }

    const { error: err } = await (supabase as unknown as any)
      .from("experiences")
      .delete()
      .eq("id", id)
      .eq("operator_id", user.id);

    if (err) {
      setError(err.message);
      setDeleting(false);
      return;
    }
    router.push(`/${locale}/portal`);
  }

  if (loading) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (loadError) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-black text-stone-900 mb-2">Can&apos;t edit this listing</h2>
        <p className="text-stone-600 mb-6">{loadError}</p>
        <Link href={`/${locale}/portal`} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  if (success) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-stone-900 mb-2">Changes Saved!</h2>
        <p className="text-stone-600 mb-6">Your updated listing will be reviewed and re-approved within 48 hours before going live again.</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/${locale}/portal`} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
            My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${locale}/portal`} className="text-stone-400 hover:text-stone-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-stone-900">Edit Listing</h1>
            <p className="text-stone-400 text-sm">
              {approved ? "Edits are re-reviewed within 48h before going live" : "Pending review · edits keep it in the queue"}
            </p>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basics */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-700 text-xs uppercase tracking-widest">Basics</h3>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. 2-Hour Surf Lesson in Taghazout"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white">
                  {CATEGORY_LIST.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">City *</label>
                <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white">
                  {EXPERIENCE_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} placeholder="Describe your experience. What will travelers do? What makes it special?"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none bg-white" />
            </div>
          </div>

          {/* Pricing & logistics */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-700 text-xs uppercase tracking-widest">Pricing & Logistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Price/person (USD) *</label>
                <input type="number" min={1} value={form.price_per_person}
                  onChange={e => setForm(f => ({ ...f, price_per_person: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Group price (opt.)</label>
                <input type="number" min={1} value={form.price_group}
                  onChange={e => setForm(f => ({ ...f, price_group: e.target.value }))}
                  placeholder="Private"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Duration (hours)</label>
                <input type="number" min={0.5} step={0.5} value={form.duration_hours}
                  onChange={e => setForm(f => ({ ...f, duration_hours: parseFloat(e.target.value) || 1 }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Max group size</label>
                <input type="number" min={1} value={form.max_group_size}
                  onChange={e => setForm(f => ({ ...f, max_group_size: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Meeting point</label>
                <input value={form.meeting_point} onChange={e => setForm(f => ({ ...f, meeting_point: e.target.value }))}
                  placeholder="e.g. Taghazout main beach car park"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Cancellation policy</label>
                <select value={form.cancellation} onChange={e => setForm(f => ({ ...f, cancellation: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white">
                  <option value="free_cancel">Free cancellation anytime</option>
                  <option value="24h">Free up to 24h before</option>
                  <option value="48h">Free up to 48h before</option>
                  <option value="no_refund">Non-refundable</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-2">Languages spoken</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <button key={l} type="button" onClick={() => toggleLanguage(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.languages.includes(l) ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lists: highlights, includes, excludes, what to bring */}
          {(["highlights", "includes", "excludes", "what_to_bring"] as const).map(field => (
            <div key={field} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-stone-700 text-xs uppercase tracking-widest">
                  {field === "what_to_bring" ? "What to Bring" : field.charAt(0).toUpperCase() + field.slice(1)}
                </h3>
                <button type="button" onClick={() => addListItem(field)}
                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form[field].map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input value={item} onChange={e => updateListItem(field, idx, e.target.value)}
                      placeholder={field === "highlights" ? "e.g. Learn to stand up on your first wave" : field === "includes" ? "e.g. Surfboard and wetsuit" : field === "excludes" ? "e.g. Transport to beach" : "e.g. Sunscreen, towel"}
                      className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white" />
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
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-stone-700 text-xs uppercase tracking-widest mb-3">Photos (up to 8)</h3>
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
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 rounded-xl p-5 cursor-pointer hover:border-amber-300 transition-colors">
              {uploadingImages
                ? <><Loader2 className="w-5 h-5 animate-spin text-amber-500" /><span className="text-amber-600 text-sm">Uploading...</span></>
                : <><Upload className="w-5 h-5 text-stone-400" /><span className="text-stone-500 text-sm">Upload photos ({form.images.length}/8)</span></>
              }
              <input type="file" accept="image/*" multiple disabled={uploadingImages || form.images.length >= 8} onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
            Editing a listing sends it back for review and temporarily hides it from travelers until re-approved (within 48h).
          </div>

          <button type="submit" disabled={saving || deleting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-lg py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button type="button" onClick={handleDelete} disabled={saving || deleting}
            className="w-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2">
            {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            {deleting ? "Deleting..." : "Delete Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
