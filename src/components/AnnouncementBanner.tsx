"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "promo";
  link_url?: string | null;
  link_label?: string | null;
}

const STYLES = {
  info:    { bg: "bg-blue-600",    icon: Info },
  warning: { bg: "bg-orange-500",  icon: AlertTriangle },
  success: { bg: "bg-emerald-600", icon: CheckCircle },
  promo:   { bg: "bg-amber-500",   icon: Megaphone },
};

export default function AnnouncementBanner({ announcements }: { announcements: Announcement[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = announcements.filter(a => !dismissed.includes(a.id));
  if (!visible.length) return null;

  const a = visible[0];
  const { bg, icon: Icon } = STYLES[a.type] ?? STYLES.info;

  return (
    <div className={`${bg} text-white text-sm z-50 relative`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Icon className="w-4 h-4 shrink-0" />
        <p className="flex-1 text-center font-medium leading-snug">
          {a.message}
          {a.link_url && a.link_label && (
            <Link href={a.link_url} className="underline ml-2 font-bold hover:opacity-80 transition-opacity">
              {a.link_label} →
            </Link>
          )}
        </p>
        <button
          onClick={() => setDismissed(d => [...d, a.id])}
          className="shrink-0 -mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg opacity-70 hover:opacity-100 hover:bg-white/15 transition-all"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
