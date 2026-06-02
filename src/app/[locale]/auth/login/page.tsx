"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { use } from "react";
import { ZellijStar } from "@/components/zellij/Zellij";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(urlError);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("locale", locale);
    const result = await signInAction(formData);
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Decorative zellij panel — desktop only */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.34_0.14_264)] via-[oklch(0.38_0.12_290)] to-[oklch(0.46_0.13_40)] p-12 text-white">
        <div className="zellij-bg absolute inset-0 opacity-[0.1] mix-blend-screen" aria-hidden="true" />
        <Link href={`/${locale}`} className="relative flex items-center gap-2 font-heading font-black text-2xl">
          <ZellijStar size={32} className="text-amber-300" /> Imourig
        </Link>
        <div className="relative">
          <h2 className="font-heading font-black text-4xl leading-tight mb-3">Welcome back to authentic Morocco.</h2>
          <p className="text-white/70 text-lg max-w-sm">Sign in to manage your bookings, saved trips and experiences — direct from local operators.</p>
        </div>
        <p className="relative text-white/40 text-sm">🇲🇦 Made for Morocco</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6 font-heading font-black text-2xl text-foreground">
              <ZellijStar size={28} className="text-primary" /> Imourig
            </Link>
          </div>
          <h1 className="text-2xl font-black text-foreground text-center lg:text-left">Welcome back</h1>
          <p className="text-muted-foreground mt-1 mb-8 text-center lg:text-left">Sign in to access your bookings and saved trips</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-foreground/80 text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 min-h-[3rem] border border-input rounded-xl outline-none focus:border-primary transition-colors text-foreground bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground/80 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 min-h-[3rem] border border-input rounded-xl outline-none focus:border-primary transition-colors text-foreground bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:brightness-105 disabled:opacity-60 text-accent-foreground min-h-[3rem] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              No account?{" "}
              <Link href={`/${locale}/auth/signup`} className="text-primary font-medium hover:underline">
                Create one free
              </Link>
            </p>
            <p>
              <Link href={`/${locale}/auth/forgot-password`} className="text-muted-foreground hover:text-foreground text-xs">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
