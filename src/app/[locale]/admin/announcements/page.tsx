"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Megaphone, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

const TYPES = [
  { value: "info",    label: "Info",    color: "bg-blue-100 text-blue-700" },
  { value: "promo",   label: "Promo",   color: "bg-amber-100 text-accent-foreground" },
  { value: "success", label: "Success", color: "bg-emerald-100 text-emerald-700" },
  { value: "warning", label: "Warning", color: "bg-orange-100 text-orange-700" },
];

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ message: "", type: "promo", link_url: "", link_label: "", expires_at: "" });
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setAnnouncements(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await (supabase as unknown as any).from("announcements").insert({
      message: form.message,
      type: form.type,
      link_url: form.link_url || null,
      link_label: form.link_label || null,
      expires_at: form.expires_at || null,
      active: true,
    });
    setForm({ message: "", type: "promo", link_url: "", link_label: "", expires_at: "" });
    await load();
    setSaving(false);
  }

  async function toggle(id: string, current: boolean) {
    await (supabase as unknown as any).from("announcements").update({ active: !current }).eq("id", id);
    await load();
  }

  async function remove(id: string) {
    await (supabase as unknown as any).from("announcements").delete().eq("id", id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Megaphone className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-black text-foreground">Announcements</h1>
      </div>

      {/* Create form */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-8">
        <h2 className="font-bold text-foreground/80 mb-4 text-sm uppercase tracking-wide">New Announcement</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="flex gap-3">
            <input required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Announcement text shown to all visitors..."
              className="flex-1 border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-card">
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
              placeholder="Link URL (optional)"
              className="border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
            <input value={form.link_label} onChange={e => setForm(f => ({ ...f, link_label: e.target.value }))}
              placeholder="Link label (optional)"
              className="border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
            <input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
              className="border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={saving || !form.message}
            className="flex items-center gap-2 bg-accent hover:brightness-105 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Post Announcement
          </button>
        </form>
      </div>

      {/* List */}
      <div className="space-y-3">
        {announcements.map(a => {
          const t = TYPES.find(x => x.value === a.type) ?? TYPES[0];
          return (
            <div key={a.id} className={`bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4 ${a.active ? "border-border" : "border-stone-50 opacity-50"}`}>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${t.color}`}>{t.label}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.message}</p>
                {a.link_url && <p className="text-xs text-muted-foreground truncate">{a.link_label} → {a.link_url}</p>}
                {a.expires_at && <p className="text-xs text-muted-foreground">Expires: {new Date(a.expires_at).toLocaleDateString()}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle(a.id, a.active)} className="text-muted-foreground hover:text-foreground/80 transition-colors">
                  {a.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => remove(a.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {announcements.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">No announcements yet. Create one above.</div>
        )}
      </div>
    </div>
  );
}
