"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { use } from "react";

export default function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends the user back here with a hash fragment containing the session
  useEffect(() => {
    async function handleHash() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      // getSession will pick up the recovery token from the URL hash
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setSessionReady(true);
    }
    handleHash();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => router.push(`/${locale}/auth/login`), 3000);
    }
    setLoading(false);
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">Verifying reset link&hellip;</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center mb-6">
            <img src="/logo.png" alt="Atlas Experiences" className="h-20 w-auto [mix-blend-mode:multiply]" />
          </Link>
          <h1 className="text-2xl font-black text-stone-900">Set a new password</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-lg font-black text-stone-900 mb-2">Password updated</h2>
              <p className="text-stone-500 text-sm">Redirecting you to sign in&hellip;</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-stone-700 text-sm font-medium mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-3 border border-stone-200 rounded-xl outline-none focus:border-amber-400 transition-colors text-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 text-sm font-medium mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl outline-none focus:border-amber-400 transition-colors text-stone-800"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
