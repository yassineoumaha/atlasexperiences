"use client";

import { useState } from "react";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Loader2, Lightbulb } from "lucide-react";
import Link from "next/link";

const TYPES = [
  { value: "feature",  label: "💡 New Feature Idea",      desc: "Something you'd like added to the platform" },
  { value: "content",  label: "📍 Area / Place to Cover",  desc: "A spot, beach, or neighborhood we should feature" },
  { value: "operator", label: "🏄 Operator to Invite",     desc: "A local guide or instructor we should reach out to" },
  { value: "bug",      label: "🐛 Something is Broken",    desc: "A bug or broken page you found" },
  { value: "other",    label: "💬 Other Feedback",          desc: "Anything else on your mind" },
];

export default function SuggestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "feature", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.message.length < 15) return;
    setLoading(true);
    const supabase = createClient();
    await (supabase as unknown as any).from("suggestions").insert({
      sender_name: form.name || null,
      sender_email: form.email || null,
      type: form.type,
      message: form.message,
    });
    setDone(true);
    setLoading(false);
  }

  if (done) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-stone-900 mb-2">Thank you!</h2>
        <p className="text-stone-500 mb-6">We read every suggestion and use them to improve Imourig. The best ideas get replied to directly.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href={`/${locale}/experiences`}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
            Browse Experiences
          </Link>
          <button onClick={() => { setDone(false); setForm({ name: "", email: "", type: "feature", message: "" }); }}
            className="border border-stone-200 text-stone-600 font-medium px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
            Submit Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">Share a Suggestion</h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto">
            Traveler or operator — tell us what you&apos;d like to see on Imourig.
            We read everything.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Type of suggestion</label>
            <div className="space-y-2">
              {TYPES.map(t => (
                <label key={t.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    form.type === t.value ? "border-amber-400 bg-amber-50" : "border-stone-100 hover:border-stone-200"
                  }`}>
                  <input type="radio" name="type" value={t.value} checked={form.type === t.value}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="mt-0.5 accent-amber-500" />
                  <div>
                    <div className="font-bold text-stone-800 text-sm">{t.label}</div>
                    <div className="text-stone-400 text-xs">{t.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1">
              Your message <span className="text-red-400">*</span>
            </label>
            <textarea
              required value={form.message} minLength={15}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4} placeholder="Describe your idea in as much detail as you like..."
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none"
            />
            <p className="text-right text-xs text-stone-300 mt-0.5">{form.message.length} / 15 min</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Your name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Optional"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Email for reply</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Optional"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400" />
            </div>
          </div>

          <button type="submit" disabled={loading || form.message.length < 15}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Sending..." : "Send Suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
}
