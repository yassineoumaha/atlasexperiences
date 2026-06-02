import Link from "next/link";
import { Compass } from "lucide-react";

export default function LocaleNotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-muted/40">
      <div className="text-center px-4 max-w-lg">
        <div className="text-7xl font-black text-amber-500 mb-2">404</div>
        <img src="/logo.png" alt="Imourig" className="h-16 w-auto mx-auto mb-6" />
        <h1 className="text-2xl font-black text-foreground mb-3">This page got lost in the Sahara</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Maybe it was a desert mirage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/en"
            className="bg-accent hover:brightness-105 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/en/experiences"
            className="flex items-center justify-center gap-2 border border-input text-foreground/80 hover:border-amber-400 hover:text-primary font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Compass className="w-4 h-4" /> Browse Experiences
          </Link>
        </div>
      </div>
    </div>
  );
}
