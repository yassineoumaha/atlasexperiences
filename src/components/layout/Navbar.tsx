"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ZellijStar } from "@/components/zellij/Zellij";

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
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  // Transparent over hero only at top of page; solid (themed) once scrolled.
  const overHero = !scrolled && !mobileOpen;
  const linkBase = "nav-link px-1 py-2 text-sm font-semibold transition-colors duration-200";
  const linkColor = overHero
    ? "text-white/90 hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
    : "text-foreground/70 hover:text-foreground";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">

            {/* Logo / wordmark */}
            <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
              <ZellijStar
                size={28}
                className={overHero ? "text-amber-400" : "text-primary"}
              />
              <span
                className={cn(
                  "font-heading font-black text-xl tracking-tight transition-colors",
                  overHero ? "text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]" : "text-foreground"
                )}
              >
                Imourig
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn(linkBase, linkColor)}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle className={overHero ? "text-white/80 hover:text-white hover:bg-white/10" : ""} />

              {/* Language picker */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 h-10 rounded-lg text-sm font-semibold transition-colors",
                    overHero
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span>{LOCALES[locale]?.flag ?? "🌐"}</span>
                  <span className="uppercase text-xs">{locale}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", langOpen && "rotate-180")} />
                </button>

                {langOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-popover text-popover-foreground rounded-2xl shadow-xl border border-border py-2 z-50 overflow-hidden">
                    {Object.entries(LOCALES).map(([code, { label, flag }]) => (
                      <Link
                        key={code}
                        href={`/${code}`}
                        onClick={() => setLangOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          code === locale
                            ? "bg-accent/15 text-accent-foreground font-bold"
                            : "hover:bg-muted"
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

              <Link
                href={`/${locale}/portal`}
                className={cn(
                  "px-3 h-10 inline-flex items-center rounded-lg text-sm font-semibold transition-colors",
                  overHero
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {dict.nav.portal}
              </Link>

              {/* CTA — saffron accent */}
              <Link
                href={`/${locale}/operators/register`}
                className="group inline-flex items-center gap-1.5 bg-accent hover:brightness-105 text-accent-foreground px-4 h-10 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                {dict.nav.listFree}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle className={overHero ? "text-white/90 hover:text-white hover:bg-white/10" : ""} />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                  overHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
                )}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[80%] max-w-xs bg-background shadow-2xl transition-transform duration-300 flex flex-col",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-border">
            <span className="flex items-center gap-2 font-heading font-black text-lg text-foreground">
              <ZellijStar size={24} className="text-primary" /> Imourig
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 min-h-[3rem] rounded-xl text-foreground font-semibold hover:bg-accent/10 hover:text-accent-foreground transition-colors group"
              >
                {link.label}
                <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            <Link
              href={`/${locale}/portal`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 min-h-[3rem] rounded-xl text-foreground font-semibold hover:bg-accent/10 transition-colors group"
            >
              {dict.nav.portal}
              <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            </Link>

            <div className="pt-3 border-t border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-4 mb-2">Language</p>
              <div className="grid grid-cols-2 gap-2 px-1">
                {Object.entries(LOCALES).map(([code, { label, flag }]) => (
                  <Link
                    key={code}
                    href={`/${code}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 min-h-[2.75rem] px-3 rounded-xl text-sm font-semibold transition-colors",
                      code === locale
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground/70 hover:bg-muted/70"
                    )}
                  >
                    <span>{flag}</span>
                    <span className="text-xs">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-border pb-safe">
            <Link
              href={`/${locale}/operators/register`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-accent hover:brightness-105 text-accent-foreground font-bold min-h-[3rem] rounded-xl transition-all"
            >
              {dict.nav.listFree}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
