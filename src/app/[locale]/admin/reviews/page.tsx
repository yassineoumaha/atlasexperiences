import { createAdminClient } from "@/lib/supabase/server";
import { approveExpReviewAction, deleteExpReviewAction } from "@/app/actions/admin";
import { CheckCircle, Trash2, Star } from "lucide-react";
import type { ExperienceReviewRow } from "@/lib/supabase/types";

// Embedded `experiences(...)` join — name the row shape explicitly.
type AdminReviewRow = ExperienceReviewRow & { experiences: { title: string } | null };

export default async function AdminReviewsPage() {
  const db = await createAdminClient();
  const { data } = await db
    .from("experience_reviews")
    .select("*, experiences(title)")
    .order("created_at", { ascending: false });
  const reviews = (data as unknown as AdminReviewRow[] | null) ?? [];

  const pending  = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-foreground">Experience Reviews</h1>
        <div className="flex gap-2 text-sm">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">{pending.length} pending</span>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{approved.length} live</span>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-orange-600 text-sm uppercase tracking-wide mb-4">Awaiting Approval</h2>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="bg-card border border-orange-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />)}
                    </div>
                    {r.title && <h4 className="font-bold text-foreground">{r.title}</h4>}
                    <p className="text-foreground/80 text-sm">{r.body}</p>
                    <p className="text-muted-foreground text-xs mt-1">by {r.display_name} · for <strong>{r.experiences?.title}</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveExpReviewAction.bind(null, r.id)}>
                      <button type="submit" className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    </form>
                    <form action={deleteExpReviewAction.bind(null, r.id)}>
                      <button type="submit" className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <h2 className="font-bold text-foreground/80 text-sm uppercase tracking-wide mb-4">Live Reviews ({approved.length})</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground/80">Review</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground/80">Experience</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground/80">Author</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground/80">Rating</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {approved.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 text-foreground/80 max-w-xs"><p className="line-clamp-2">{r.body}</p></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{r.experiences?.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.display_name}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <form action={deleteExpReviewAction.bind(null, r.id)}>
                        <button type="submit" className="text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {(!reviews || reviews.length === 0) && (
        <div className="bg-muted/40 border border-border rounded-2xl p-12 text-center text-muted-foreground">No reviews yet.</div>
      )}
    </div>
  );
}
