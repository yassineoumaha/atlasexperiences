import { createAdminClient } from "@/lib/supabase/server";
import { deleteSubscriberAction } from "@/app/actions/admin";
import { Mail, Trash2, Globe } from "lucide-react";

export default async function AdminNewsletterPage() {
  const supabase = await createAdminClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const byLocale = subscribers?.reduce((acc: any, s: any) => {
    acc[s.locale] = (acc[s.locale] || 0) + 1;
    return acc;
  }, {}) ?? {};

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-foreground">Newsletter Subscribers</h1>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-sm">
          {count ?? 0} total
        </span>
      </div>

      {/* Stats by locale */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {["en","fr","es","ar"].map((locale) => (
          <div key={locale} className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-foreground">{byLocale[locale] ?? 0}</div>
            <div className="text-muted-foreground text-sm uppercase">{locale}</div>
          </div>
        ))}
      </div>

      {/* Export hint */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 mb-6 text-accent-foreground text-sm">
        To export: Supabase Dashboard → Table Editor → newsletter_subscribers → Export CSV
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-foreground/80">Email</th>
              <th className="text-left px-5 py-3 font-semibold text-foreground/80">
                <Globe className="w-4 h-4 inline" /> Locale
              </th>
              <th className="text-left px-5 py-3 font-semibold text-foreground/80">Subscribed</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {subscribers?.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-stone-300 shrink-0" />
                    <a href={`mailto:${sub.email}`} className="text-foreground/80 hover:text-primary transition-colors">
                      {sub.email}
                    </a>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="bg-muted text-foreground/80 px-2 py-0.5 rounded-full text-xs uppercase">
                    {sub.locale}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">
                  {new Date(sub.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <form action={deleteSubscriberAction.bind(null, sub.id)}>
                    <button type="submit" className="text-stone-200 hover:text-red-500 transition-colors"
                      title="Unsubscribe">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subscribers || subscribers.length === 0) && (
          <div className="py-12 text-center text-muted-foreground text-sm">No subscribers yet.</div>
        )}
      </div>
    </div>
  );
}
