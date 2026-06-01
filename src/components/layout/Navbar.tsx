"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/dictionaries";

const LOCALES: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  fr: { label: "Français", flag: "🇫🇷" },
  es: { label: "Español", flag: "🇪🇸" },
  ar: { label: "العربية", flag: "🇲🇦" },
};

export default function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => setLangOpen(false);
    if (langOpen) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [langOpen]);

  const navLinks = [
    { href: `/${locale}/experiences`, label: dict.nav.browse },
    { href: `/${locale}/map`,         label: dict.nav.map },
    { href: `/${locale}/about`,       label: dict.nav.about },
  ];

  const isDark = !scrolled && !mobileOpen;
  const linkBase = "nav-link px-1 py-1 text-sm font-semibold transition-colors duration-200";
  const linkColor = isDark
    ? "text-white/90 hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
    : "text-stone-600 hover:text-stone-900";

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────── */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
          scrolled
            ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-stone-100"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Atlas Experiences"
                className={cn(
                  "h-11 w-auto transition-all duration-300",
                  scrolled ? "[mix-blend-mode:multiply]" : "[mix-blend-mode:screen] brightness-110"
                )}
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(linkBase, linkColor)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language picker */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                    isDark
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span>{LOCALES[locale]?.flag ?? "🌐"}</span>
                  <span className="uppercase text-xs">{locale}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", langOpen && "rotate-180")} />
                </button>

                {langOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 overflow-hidden">
                    {Object.entries(LOCALES).map(([code, { label, flag }]) => (
                      <Link
                        key={code}
                        href={`/${code}`}
                        onClick={() => setLangOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          code === locale
                            ? "bg-amber-50 text-amber-700 font-bold"
                            : "text-stone-600 hover:bg-stone-50"
                        )}
                      >
                        <span className="text-base">{flag}</span>
                        <span>{label}</span>
                        {code === locale && <span className="ml-auto text-xs">✓</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Portal */}
              <Link
                href={`/${locale}/portal`}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                  isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                )}
              >
                {dict.nav.portal}
              </Link>

              {/* CTA */}
              <Link
                href={`/${locale}/operators/register`}
                className="group flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-amber-200 hover:shadow-md"
              >
                {dict.nav.listFree}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className={cn(
                "md:hidden p-2 rounded-xl transition-colors",
                scrolled ? "text-stone-700 hover:bg-stone-100" : "text-white hover:bg-white/10"
              )}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 flex flex-col",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <img src="/logo.png" alt="Atlas Experiences" className="h-10 w-auto [mix-blend-mode:multiply]" />
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-stone-700 font-semibold hover:bg-amber-50 hover:text-amber-700 transition-colors group"
              >
                {link.label}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            <Link
              href={`/${locale}/portal`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-stone-700 font-semibold hover:bg-amber-50 hover:text-amber-700 transition-colors group"
            >
              {dict.nav.portal}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Language row */}
            <div className="pt-3 border-t border-stone-100">
              <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold px-4 mb-2">Language</p>
              <div className="grid grid-cols-2 gap-2 px-1">
                {Object.entries(LOCALES).map(([code, { label, flag }]) => (
                  <Link
                    key={code}
                    href={`/${code}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors",
                      code === locale
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    <span>{flag}</span>
                    <span className="text-xs">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 py-4 border-t border-stone-100">
            <Link
              href={`/${locale}/operators/register`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              {dict.nav.listFree}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
