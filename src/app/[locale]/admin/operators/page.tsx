import { createAdminClient } from "@/lib/supabase/server";
import { verifyOperatorAction, deleteOperatorAction } from "@/app/actions/admin";
import { CheckCircle, Trash2, Phone, Globe } from "lucide-react";

export default async function AdminOperatorsPage() {
  const db = await createAdminClient();
  const { data: operators } = await db.from("operators").select("*").order("created_at", { ascending: false });

  const pending  = operators?.filter((o) => !o.verified) ?? [];
  const verified = operators?.filter((o) => o.verified) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-foreground">Operators</h1>
        <div className="flex gap-2 text-sm">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">{pending.length} pending</span>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{verified.length} verified</span>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-orange-600 text-sm uppercase tracking-wide mb-4">Awaiting Verification ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((op) => (
              <div key={op.id} className="bg-card border border-orange-100 rounded-2xl p-5 shadow-sm flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-foreground text-lg">{op.business_name}</h3>
                  <div className="text-muted-foreground text-sm space-y-0.5 mt-1">
                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{op.phone}</div>
                    <div>📍 {op.city} · {op.years_experience} yr{op.years_experience !== 1 ? "s" : ""} exp</div>
                    {op.languages?.length > 0 && (
                      <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{op.languages.join(", ")}</div>
                    )}
                    {op.bio && <p className="text-xs text-muted-foreground italic mt-1 max-w-sm">{op.bio}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={verifyOperatorAction.bind(null, op.id)}>
                    <button type="submit" className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      <CheckCircle className="w-4 h-4" /> Verify
                    </button>
                  </form>
                  <form action={deleteOperatorAction.bind(null, op.id)}>
                    <button type="submit" className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      <Trash2 className="w-4 h-4" /> Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-bold text-foreground/80 text-sm uppercase tracking-wide mb-4">All Operators ({operators?.length ?? 0})</h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Business</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">City</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Phone</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground/80">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {operators?.map((op) => (
              <tr key={op.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">{op.business_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{op.city}</td>
                <td className="px-4 py-3 text-muted-foreground">{op.phone}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${op.verified ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    {op.verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(op.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <form action={deleteOperatorAction.bind(null, op.id)}>
                    <button type="submit" className="text-stone-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!operators || operators.length === 0) && (
          <div className="py-12 text-center text-muted-foreground text-sm">No operators yet.</div>
        )}
      </div>
    </div>
  );
}
