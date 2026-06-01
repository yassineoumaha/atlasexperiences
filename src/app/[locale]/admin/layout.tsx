import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";
import { LayoutDashboard, Users, Star, Mail, ShoppingBag, CheckSquare, LogOut, ExternalLink, Megaphone, Lightbulb } from "lucide-react";

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

  const nav = [
    { href: `/${locale}/admin`,             label: "Dashboard",    icon: LayoutDashboard },
    { href: `/${locale}/admin/operators`,   label: "Operators",    icon: Users },
    { href: `/${locale}/admin/experiences`, label: "Experiences",  icon: Star },
    { href: `/${locale}/admin/bookings`,    label: "Bookings",     icon: ShoppingBag },
    { href: `/${locale}/admin/reviews`,       label: "Reviews",       icon: CheckSquare },
    { href: `/${locale}/admin/newsletter`,   label: "Newsletter",    icon: Mail },
    { href: `/${locale}/admin/announcements`,label: "Announcements", icon: Megaphone },
    { href: `/${locale}/admin/suggestions`,  label: "Suggestions",   icon: Lightbulb },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="w-52 bg-stone-900 text-white fixed inset-y-0 left-0 flex flex-col z-40">
        <div className="p-5 border-b border-stone-800">
          <Link href={`/${locale}`} className="flex items-center">
            <img src="/logo.png" alt="Atlas Experiences" className="h-8 w-auto" />
          </Link>
          <div className="text-stone-500 text-xs mt-0.5">Admin</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-sm font-medium">
              <item.icon className="w-4 h-4 shrink-0" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-stone-800 space-y-1">
          <Link href={`/${locale}`} target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-500 hover:text-white hover:bg-stone-800 transition-colors text-xs">
            <ExternalLink className="w-3.5 h-3.5" /> View site
          </Link>
          <div className="px-3 py-1 text-stone-600 text-xs truncate">{user.email}</div>
          <form action={signOutAction.bind(null, locale)}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 ml-52 p-8 min-h-screen">{children}</main>
    </div>
  );
}
