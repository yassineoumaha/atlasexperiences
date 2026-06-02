import { createAdminClient } from "@/lib/supabase/server";
import { Lightbulb, CheckCircle } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  new:      "bg-blue-100 text-blue-700",
  reviewed: "bg-muted text-foreground/80",
  planned:  "bg-purple-100 text-purple-700",
  done:     "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-600",
};

const TYPE_EMOJI: Record<string, string> = {
  feature: "💡", bug: "🐛", content: "📍", operator: "🏄", other: "💬",
};

export default async function SuggestionsAdminPage() {
  const db = await createAdminClient();
  const { data: suggestions } = await db
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false });

  const byStatus = {
    new:      (suggestions ?? []).filter((s: any) => s.status === "new"),
    reviewed: (suggestions ?? []).filter((s: any) => s.status === "reviewed"),
    planned:  (suggestions ?? []).filter((s: any) => s.status === "planned"),
    done:     (suggestions ?? []).filter((s: any) => s.status === "done"),
    declined: (suggestions ?? []).filter((s: any) => s.status === "declined"),
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-black text-foreground">Suggestions</h1>
        <span className="bg-blue-100 text-blue-700 text-sm px-3 py-0.5 rounded-full font-medium">{byStatus.new.length} new</span>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Message</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">From</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground/80">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground/80">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {(suggestions ?? []).map((s: any) => (
              <tr key={s.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 text-xl">{TYPE_EMOJI[s.type] ?? "💬"}</td>
                <td className="px-4 py-3 text-foreground/80 max-w-sm">
                  <p className="line-clamp-2">{s.message}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  <div>{s.sender_name || "Anonymous"}</div>
                  {s.sender_email && <div className="text-stone-300">{s.sender_email}</div>}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[s.status] ?? STATUS_STYLE.new}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!suggestions || suggestions.length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No suggestions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
