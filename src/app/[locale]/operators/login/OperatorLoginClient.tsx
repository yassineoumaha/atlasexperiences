"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, Store, ArrowRight, TrendingUp, ShieldCheck, Wallet } from "lucide-react";
import { signInAction } from "@/app/actions/auth";
import type { Locale } from "@/lib/dictionaries";

/**
 * Operator-branded sign-in — the entry point when someone opens "Portal"
 * while logged out. Tailored to operators (not the generic traveler login):
 * "Sign In" is the primary action; "Join the team" sits clearly below for
 * those not yet registered. Sends the user back to the portal on success.
 */
const PERKS = [
  { icon: TrendingUp, text: "Only 10% commission — keep more of every booking" },
  { icon: ShieldCheck, text: "Atlas Verified badge builds traveler trust" },
  { icon: Wallet, text: "Get paid directly — no platform lock-in" },
];

export default function OperatorLoginClient({ locale }: { locale: Locale }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("locale", locale);
    formData.append("next", `/${locale}/portal`);
    const result = await signInAction(formData);
    // signInAction redirects on success; only errors return here.
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand / value panel — desktop */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.30_0.12_264)] via-[oklch(0.36_0.12_290)] to-[oklch(0.44_0.13_40)] p-12 text-white">
        <div className="zellij-bg absolute inset-0 opacity-[0.1] mix-blend-screen" aria-hidden="true" />
        <Link href={`/${locale}`} className="relative">
          <Image src="/logo.png" alt="Imourig" width={1066} height={320} className="h-9 w-auto brightness-0 invert" priority />
        </Link>
        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-amber-200 text-sm px-3.5 py-1.5 rounded-full mb-5">
            <Store className="w-4 h-4" /> Operator Portal
          </span>
          <h2 className="font-heading font-black text-4xl leading-tight mb-3">Welcome back, partner.</h2>
          <p className="text-white/70 text-lg max-w-sm mb-8">Manage your experiences, booking requests and profile — all in one place.</p>
          <ul className="space-y-3 max-w-sm">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-white/85 text-sm">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center"><Icon className="w-4 h-4" /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-white/40 text-sm">🇲🇦 The trusted marketplace for verified Moroccan operators</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <Image src="/logo.png" alt="Imourig" width={1066} height={320} className="h-10 w-auto mx-auto" />
            </Link>
            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              <Store className="w-3.5 h-3.5" /> Operator Portal
            </span>
          </div>

          <h1 className="text-2xl font-black text-foreground text-center lg:text-left">Sign in to your portal</h1>
          <p className="text-muted-foreground mt-1 mb-8 text-center lg:text-left">Access your experiences, bookings and operator profile.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-foreground/80 text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input name="email" type="email" required autoComplete="email" placeholder="you@example.com"
                  className="w-full pl-10 pr-4 min-h-[3rem] border border-input rounded-xl outline-none focus:border-primary transition-colors text-foreground bg-background" />
              </div>
            </div>

            <div>
              <label className="block text-foreground/80 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" placeholder="••••••••"
                  className="w-full pl-10 pr-10 min-h-[3rem] border border-input rounded-xl outline-none focus:border-primary transition-colors text-foreground bg-background" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-accent hover:brightness-105 disabled:opacity-60 text-accent-foreground min-h-[3rem] rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-right mt-3">
            <Link href={`/${locale}/auth/forgot-password`} className="text-muted-foreground hover:text-foreground text-xs">
              Forgot your password?
            </Link>
          </p>

          {/* Join the team — the clear secondary path for non-operators */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Not a partner yet?</p>
            <Link href={`/${locale}/operators/register`}
              className="group flex items-center justify-between gap-3 w-full border border-border hover:border-primary rounded-xl px-4 py-3 transition-colors">
              <span className="flex items-center gap-2 font-semibold text-foreground">
                <Store className="w-4 h-4 text-primary" /> Join the team — become an operator
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
            <p className="text-xs text-muted-foreground mt-2">Free to list · 10% commission · no monthly fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
