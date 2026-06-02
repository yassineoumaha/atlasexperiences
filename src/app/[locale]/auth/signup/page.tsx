"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { use } from "react";

export default function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("locale", locale);
    const result = await signUpAction(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center mb-6">
            <img src="/logo.png" alt="Imourig" className="h-20 w-auto" />
          </Link>
          <h1 className="text-2xl font-black text-foreground">Create your account</h1>
          <p className="text-muted-foreground mt-1">Save trips, compare hotels, plan smarter</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-bold text-foreground text-lg mb-2">Check your inbox</h3>
              <p className="text-muted-foreground text-sm">
                We sent a confirmation link to your email. Click it to activate your account.
              </p>
              <Link
                href={`/${locale}/auth/login`}
                className="inline-block mt-6 text-primary font-medium hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
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
                    className="w-full pl-10 pr-4 min-h-[3rem] border border-input rounded-xl outline-none focus:border-primary transition-colors text-foreground"
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
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 min-h-[3rem] border border-input rounded-xl outline-none focus:border-primary transition-colors text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/80"
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
                className="w-full bg-accent hover:brightness-105 disabled:opacity-60 text-accent-foreground min-h-[3rem] rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-muted-foreground text-xs text-center">
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          )}

          {!success && (
            <p className="text-center text-muted-foreground text-sm mt-6">
              Already have an account?{" "}
              <Link href={`/${locale}/auth/login`} className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
