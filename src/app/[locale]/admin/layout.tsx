import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import AdminShell, { type AdminNavItem } from "./AdminShell";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) redirect(`/${locale}/auth/login`);

  const nav: AdminNavItem[] = [
    { href: `/${locale}/admin`,              label: "Dashboard",     icon: "LayoutDashboard" },
    { href: `/${locale}/admin/operators`,    label: "Operators",     icon: "Users" },
    { href: `/${locale}/admin/experiences`,  label: "Experiences",   icon: "Star" },
    { href: `/${locale}/admin/bookings`,     label: "Bookings",      icon: "ShoppingBag" },
    { href: `/${locale}/admin/reviews`,      label: "Reviews",       icon: "CheckSquare" },
    { href: `/${locale}/admin/newsletter`,   label: "Newsletter",    icon: "Mail" },
    { href: `/${locale}/admin/announcements`,label: "Announcements", icon: "Megaphone" },
    { href: `/${locale}/admin/suggestions`,  label: "Suggestions",   icon: "Lightbulb" },
  ];

  const signOut = (
    <form action={signOutAction.bind(null, locale)}>
      <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-sm">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </form>
  );

  return (
    <AdminShell locale={locale} email={user.email || ""} nav={nav} signOut={signOut}>
      {children}
    </AdminShell>
  );
}
