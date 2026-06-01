"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateOperatorProfileAction } from "@/app/actions/content";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const ROLES = [
  { value: "traveler",  label: "Traveler",          desc: "Explore Morocco, save trips, leave reviews" },
  { value: "blogger",   label: "Blogger / Writer",  desc: "Submit articles and travel guides for review" },
  { value: "lister",    label: "Property Lister",   desc: "List your riad, hotel, or guesthouse" },
];

export default function PortalSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    display_name: "", bio: "", role: "traveler",
    website: "", social_instagram: "", social_twitter: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("user_profiles").select("*").eq("id", user.id).single()
        .then(({ data }: any) => {
          if (data) setForm({
            display_name: data.display_name || "",
            bio: data.bio || "",
            role: data.role || "traveler",
            website: data.website || "",
            social_instagram: data.social_instagram || "",
            social_twitter: data.social_twitter || "",
          });
          setLoading(false);
        });
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateOperatorProfileAction(form);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="pt-24 flex justify-center"><div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${locale}/portal`} className="text-stone-400 hover:text-stone-700"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-black text-stone-900">Account Settings</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Profile</h2>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Display Name</label>
              <input value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                placeholder="Your name" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3} placeholder="Tell travelers about yourself..." className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none bg-white" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Website</label>
                <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://..." className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Instagram</label>
                <input value={form.social_instagram} onChange={(e) => setForm((f) => ({ ...f, social_instagram: e.target.value }))}
                  placeholder="@handle" className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 bg-white" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-stone-700 text-sm uppercase tracking-wide mb-4">Account Role</h2>
            <div className="space-y-3">
              {ROLES.map((r) => (
                <label key={r.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.role === r.value ? "border-amber-400 bg-amber-50" : "border-stone-100 hover:border-stone-200"}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-800">{r.label}</div>
                    <div className="text-stone-500 text-xs">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
