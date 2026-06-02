import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";
import { unpublishExperienceAction, publishExperienceAction, deleteOwnExperienceAction } from "@/app/actions/portal";
import { Plus, Calendar, Star, TrendingUp, Eye, Clock, CheckCircle, Pencil, Trash2, EyeOff } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-orange-100 text-orange-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-600",
};

export default async function PortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Auth guard is handled by portal/layout.tsx — user is guaranteed here
  const db = supabase as unknown as any;
  const [opRes, expRes, bookRes] = await Promise.all([
    db.from("operators").select("*").eq("id", user!.id).single(),
    db.from("experiences").select("id, title, category, city, price_per_person, approved, published, avg_rating, review_count, total_bookings").eq("operator_id", user!.id).order("created_at", { ascending: false }),
    db.from("bookings").select("id, traveler_name, traveler_email, traveler_phone, requested_date, group_size, operator_payout, status, created_at, experiences(title)").eq("operator_id", user!.id).order("created_at", { ascending: false }).limit(20),
  ]);

  const operator = opRes.data;

  const experiences = expRes.data ?? [];
  const bookings = bookRes.data ?? [];
  const totalEarnings = bookings.filter((b: any) => b.status === "completed").reduce((sum: number, b: any) => sum + (b.operator_payout ?? 0), 0);
  const pendingBookings = bookings.filter((b: any) => b.status === "pending").length;
  const liveExperiences = experiences.filter((e: any) => e.approved && e.published).length;

  return (
    <div className="pt-20 min-h-screen bg-muted/40">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-foreground">{operator.business_name}</h1>
              {operator.verified
                ? <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium"><CheckCircle className="w-3 h-3" /> Verified</span>
                : <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Pending verification</span>
              }
            </div>
            <p className="text-muted-foreground text-sm">{operator.city} · {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${locale}/portal/settings`} className="border border-input text-foreground/80 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Settings</Link>
            <form action={signOutAction.bind(null, locale)}>
              <button type="submit" className="border border-input text-foreground/80 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">Sign Out</button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Live Listings", value: liveExperiences, icon: Eye, color: "text-emerald-600" },
            { label: "Total Listings", value: experiences.length, icon: TrendingUp, color: "text-blue-600" },
            { label: "New Bookings", value: pendingBookings, icon: Clock, color: "text-orange-600" },
            { label: "Total Earned", value: `$${totalEarnings}`, icon: Star, color: "text-primary" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-muted-foreground text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href={`/${locale}/portal/create-experience`}
            className="flex items-center justify-center gap-3 bg-accent hover:brightness-105 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-sm">
            <Plus className="w-5 h-5" /> Add New Experience
          </Link>
          <Link href={`/${locale}/portal/add-area`}
            className="flex items-center justify-center gap-3 bg-foreground hover:bg-stone-800 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-sm">
            <span className="text-lg">📍</span> Share a Local Area Guide
          </Link>
        </div>

        {/* My Listings */}
        <div className="mb-10">
          <h2 className="font-black text-foreground text-lg mb-4">My Listings ({experiences.length})</h2>
          {experiences.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              <div className="text-4xl mb-3">🏄</div>
              <p className="font-medium mb-3">No listings yet</p>
              <Link href={`/${locale}/portal/create-experience`} className="text-primary font-bold text-sm hover:underline">Create your first listing →</Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground/80">Experience</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground/80 hidden sm:table-cell">City</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground/80">Price</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground/80">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground/80 hidden md:table-cell">Bookings</th>
                    <th className="text-center px-4 py-3 font-semibold text-foreground/80">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {experiences.map((exp: any) => (
                    <tr key={exp.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium text-foreground max-w-[180px] truncate">{exp.title}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{exp.city}</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">${exp.price_per_person}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          exp.approved && exp.published ? "bg-emerald-100 text-emerald-700"
                          : exp.approved && !exp.published ? "bg-muted text-muted-foreground"
                          : "bg-orange-100 text-orange-700"
                        }`}>
                          {exp.approved && exp.published ? "Live" : exp.approved ? "Hidden" : "Under Review"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground font-medium hidden md:table-cell">{exp.total_bookings}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/${locale}/portal/edit-experience/${exp.id}`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground/80 hover:bg-muted transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          {exp.approved && (
                            exp.published ? (
                              <form action={unpublishExperienceAction.bind(null, exp.id, locale)}>
                                <button type="submit" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/10 transition-colors" title="Hide listing">
                                  <EyeOff className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            ) : (
                              <form action={publishExperienceAction.bind(null, exp.id, locale)}>
                                <button type="submit" className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Make live">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            )
                          )}
                          <form action={deleteOwnExperienceAction.bind(null, exp.id, locale)}>
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                              onClick={(e) => { if (!confirm("Delete this experience? This cannot be undone.")) e.preventDefault(); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking Requests */}
        <div>
          <h2 className="font-black text-foreground text-lg mb-4">
            Booking Requests
            {pendingBookings > 0 && <span className="ml-2 bg-orange-100 text-orange-700 text-sm px-2 py-0.5 rounded-full font-medium">{pendingBookings} new</span>}
          </h2>
          {bookings.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Booking requests appear here when travelers book your experiences.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => (
                <div key={b.id} className={`bg-card border rounded-2xl p-5 shadow-sm ${b.status === "pending" ? "border-orange-200" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{b.traveler_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[b.status] ?? "bg-muted text-muted-foreground"}`}>{b.status}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{b.experiences?.title}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                        <span>📅 {new Date(b.requested_date).toLocaleDateString()}</span>
                        <span>👥 {b.group_size} person{b.group_size !== 1 ? "s" : ""}</span>
                        <span>📧 {b.traveler_email}</span>
                        {b.traveler_phone && <span>📱 {b.traveler_phone}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-foreground text-lg">${b.operator_payout}</div>
                      <div className="text-muted-foreground text-xs">your payout (after 10%)</div>
                      {b.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <a href={`mailto:${b.traveler_email}?subject=Booking Confirmed — ${b.experiences?.title}&body=Hi ${b.traveler_name},%0A%0AYour booking for ${new Date(b.requested_date).toLocaleDateString()} is confirmed!`}
                            className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> Confirm by Email
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
