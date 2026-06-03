"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Star, Mail, ShoppingBag, CheckSquare,
  ExternalLink, Megaphone, Lightbulb, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  LayoutDashboard, Users, Star, Mail, ShoppingBag, CheckSquare, Megaphone, Lightbulb,
} as const;

export interface AdminNavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

/**
 * Responsive admin chrome. Desktop: fixed sidebar. Mobile: a top bar with a
 * hamburger that slides the sidebar in as an overlay drawer, so the content
 * gets the full width instead of being shoved 208px right off-screen.
 */
export default function AdminShell({
  locale,
  email,
  nav,
  signOut,
  children,
}: {
  locale: string;
  email: string;
  nav: AdminNavItem[];
  signOut: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const SidebarBody = (
    <>
      <div className="p-5 border-b border-stone-800 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Imourig" width={1066} height={320} className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="lg:hidden text-stone-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-stone-800 text-white" : "text-stone-300 hover:text-white hover:bg-stone-800",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-stone-800 space-y-1">
        <Link
          href={`/${locale}`}
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View site
        </Link>
        <div className="px-3 py-1 text-stone-400 text-xs truncate">{email}</div>
        {signOut}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-foreground text-white px-4 h-14">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-1.5 -ml-1.5">
          <Menu className="w-6 h-6" />
        </button>
        <Image src="/logo.png" alt="Imourig" width={1066} height={320} className="h-7 w-auto" />
        <span className="text-xs text-stone-400">Admin</span>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex w-52 bg-foreground text-white fixed inset-y-0 left-0 flex-col z-40">
        {SidebarBody}
      </aside>

      {/* Mobile drawer + backdrop */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 max-w-[80%] bg-foreground text-white flex flex-col shadow-2xl">
            {SidebarBody}
          </aside>
        </div>
      )}

      {/* Content — full width on mobile, offset only on desktop */}
      <main className="lg:ml-52 p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
    </div>
  );
}
