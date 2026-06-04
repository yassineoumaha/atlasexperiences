import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Star, ShoppingBag, Mail, Clock, CheckCircle, DollarSign, ShieldCheck } from "lucide-react";
import LegalNotifyButton from "./LegalNotifyButton";
import { LEGAL_VERSION, LEGAL_EFFECTIVE_LABEL } from "@/lib/legal";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const db = await createAdminClient();

  const [operators, pendingOps, experiences, pendingExp, bookings, pendingBook, revenue, subscribers] = await Promise.all([
    db.from("operators").select("id", { count: "exact", head: true }),
    db.from("operators").select("id", { count: "exact", head: true }).eq("verified", false),
    db.from("experiences").select("id", { count: "exact", head: true }).eq("approved", true),
    db.from("experiences").select("id", { count: "exact", head: true }).eq("approved", false),
    db.from("bookings").select("id", { count: "exact", head: true }),
    db.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("bookings").select("platform_fee").eq("status", "completed"),
    db.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
  ]);

  const totalRevenue = (revenue.data ?? []).reduce((s: number, b: { platform_fee: number | null }) => s + (b.platform_fee ?? 0), 0);

  const stats = [
    { label: "Operators",        value: operators.count ?? 0,  badge: pendingOps.count,  color: "bg-blue-100 text-blue-700",    icon: Users,       href: `/${locale}/admin/operators` },
    { label: "Live Experiences", value: experiences.count ?? 0, badge: pendingExp.count, color: "bg-emerald-100 text-emerald-700", icon: Star,      href: `/${locale}/admin/experiences` },
    { label: "Bookings",         value: bookings.count ?? 0,   badge: pendingBook.count, color: "bg-amber-100 text-accent-foreground",   icon: ShoppingBag, href: `/${locale}/admin/bookings` },
    { label: "Platform Revenue", value: `$${totalRevenue}`,    badge: null,              color: "bg-purple-100 text-purple-700", icon: DollarSign,  href: `/${locale}/admin/bookings` },
    { label: "Subscribers",      value: subscribers.count ?? 0, badge: null,             color: "bg-muted text-foreground/80",   icon: Mail,        href: `/${locale}/admin/newsletter` },
  ];

  const urgent = [
    { label: "Operators awaiting verification", value: pendingOps.count ?? 0,  href: `/${locale}/admin/operators`,   color: "text-orange-600" },
    { label: "Experiences awaiting approval",   value: pendingExp.count ?? 0,  href: `/${locale}/admin/experiences`, color: "text-orange-600" },
    { label: "Pending booking requests",        value: pendingBook.count ?? 0, href: `/${locale}/admin/bookings`,    color: "text-red-600" },
  ];

  const totalUrgent = (pendingOps.count ?? 0) + (pendingExp.count ?? 0) + (pendingBook.count ?? 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        {totalUrgent > 0 && (
          <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-bold">
            {totalUrgent} item{totalUrgent > 1 ? "s" : ""} need attention
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all group relative">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-foreground">{s.value}</div>
            <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
            {s.badge != null && s.badge > 0 && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {s.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mb-8">
        <h2 className="font-black text-foreground mb-4">Action Required</h2>
        <div className="space-y-2">
          {urgent.map(item => (
            <Link key={item.label} href={item.href}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors">
              <span className={`text-sm font-medium ${item.value > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {item.value > 0
                ? <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 ${item.color}`}>{item.value}</span>
                : <CheckCircle className="w-4 h-4 text-emerald-400" />}
            </Link>
          ))}
        </div>
      </div>

      {/* Legal updates */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mb-8">
        <h2 className="font-black text-foreground mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent" /> Legal & Consent</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Current agreement version: <strong>{LEGAL_VERSION}</strong> (effective {LEGAL_EFFECTIVE_LABEL}).
          After changing the Terms or Privacy Policy, bump <code>LEGAL_VERSION</code> in <code>src/lib/legal.ts</code> —
          everyone is re-prompted to accept automatically. Then notify account holders below.
        </p>
        <LegalNotifyButton version={LEGAL_VERSION} />
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Setup Checklist</h3>
        <ul className="space-y-2 text-sm text-accent-foreground">
          {[
            "Run experiences_schema.sql in Supabase SQL Editor",
            "Run chat_schema.sql in Supabase SQL Editor",
            "Set ADMIN_EMAILS in .env.local to your email",
            "Replace +212600000000 with your real WhatsApp number",
            "Replace hello@imourig.com with your real email",
            "Set up Buy Me a Coffee and PayPal links in DonateButton.tsx",
            "Point your domain and update NEXT_PUBLIC_SITE_URL before going live",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2"><span className="text-amber-400 shrink-0">☐</span>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
