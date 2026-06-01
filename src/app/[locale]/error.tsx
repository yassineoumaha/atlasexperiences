"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service when integrated
    console.error("[Atlas Experiences error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-stone-500 mb-8">
          An unexpected error occurred. Our team has been notified. You can try
          refreshing the page or go back home.
        </p>
        {error.digest && (
          <p className="text-xs text-stone-400 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/en"
            className="flex items-center gap-2 border border-stone-200 text-stone-600 hover:bg-stone-100 font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" /> Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
