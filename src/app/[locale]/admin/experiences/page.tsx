import { createAdminClient } from "@/lib/supabase/server";
import { approveExperienceAction, rejectExperienceAction, toggleExperienceFeaturedAction, deleteExperienceAction } from "@/app/actions/admin";
import { CheckCircle, XCircle, Star, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/experiences-data";

export default async function AdminExperiencesPage() {
  const db = await createAdminClient();
  const { data: experiences } = await db
    .from("experiences")
    .select("*, operators(business_name)")
    .order("created_at", { ascending: false });

  const pending  = experiences?.filter((e: any) => !e.approved) ?? [];
  const approved = experiences?.filter((e: any) => e.approved) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-foreground">Experiences</h1>
        <div className="flex gap-2 text-sm">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">{pending.length} pending</span>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{approved.length} live</span>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-orange-600 text-sm uppercase tracking-wide mb-4">Awaiting Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((exp: any) => {
              const cat = CATEGORIES[exp.category as keyof typeof CATEGORIES];
              return (
                <div key={exp.id} className="bg-card border border-orange-100 rounded-2xl p-5 shadow-sm flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cat?.emoji}</span>
                      <h3 className="font-black text-foreground">{exp.title}</h3>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {exp.operators?.business_name} · {exp.city} · {exp.duration_hours}h · ${exp.price_per_person}/person
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 max-w-lg line-clamp-2">{exp.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveExperienceAction.bind(null, exp.id)}>
                      <button type="submit" className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    </form>
                    <form action={rejectExperienceAction.bind(null, exp.id)}>
                      <button type="submit" className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="font-bold text-foreground/80 text-sm uppercase tracking-wide mb-4">All Experiences ({experiences?.length ?? 0})</h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Operator</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">City</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground/80">Price</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground/80">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground/80">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {experiences?.map((exp: any) => (
              <tr key={exp.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground max-w-xs"><p className="line-clamp-1">{exp.title}</p></td>
                <td className="px-4 py-3 text-muted-foreground">{exp.operators?.business_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{exp.city}</td>
                <td className="px-4 py-3 text-right font-bold text-foreground">${exp.price_per_person}</td>
                <td className="px-4 py-3 text-center">
                  <form action={exp.approved ? rejectExperienceAction.bind(null, exp.id) : approveExperienceAction.bind(null, exp.id)}>
                    <button type="submit" className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${exp.approved ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}>
                      {exp.approved ? "Live" : "Pending"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-center">
                  <form action={toggleExperienceFeaturedAction.bind(null, exp.id, exp.featured)}>
                    <button type="submit" className={`transition-colors ${exp.featured ? "text-accent" : "text-stone-200 hover:text-amber-400"}`}>
                      <Star className={`w-4 h-4 ${exp.featured ? "fill-amber-500" : ""}`} />
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={deleteExperienceAction.bind(null, exp.id)}>
                    <button type="submit" className="text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!experiences || experiences.length === 0) && (
          <div className="py-12 text-center text-muted-foreground text-sm">No experiences yet.</div>
        )}
      </div>
    </div>
  );
}
