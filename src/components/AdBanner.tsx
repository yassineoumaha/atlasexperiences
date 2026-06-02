// Tasteful ad placement component
// To activate Google AdSense: set NEXT_PUBLIC_ADSENSE_CLIENT in .env.local
// and replace the placeholder div with the actual AdSense script tag

import Link from "next/link";

interface AdBannerProps {
  slot: "sidebar" | "article-end" | "taxis-inline";
  className?: string;
}

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const isConfigured = !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  const dimensions = {
    "sidebar":       "min-h-[250px] w-full max-w-[300px]",
    "article-end":   "min-h-[90px] w-full max-w-[728px] mx-auto",
    "taxis-inline":  "min-h-[90px] w-full",
  };

  return (
    <div className={`${dimensions[slot]} ${className}`} aria-label="Advertisement">
      {isConfigured ? (
        // Replace this div with your AdSense ins tag:
        // <ins className="adsbygoogle" data-ad-client="..." data-ad-slot="..." />
        <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-xs">
          Ad
        </div>
      ) : (
        <div className="w-full h-full bg-muted/40 border border-dashed border-input rounded-xl flex flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="text-muted-foreground/60 text-xs font-medium uppercase tracking-wide">Advertisement</span>
          <span className="text-muted-foreground text-xs">
            Interested in advertising on Imourig?{" "}
            <Link href="/en/contact" className="text-amber-500 hover:underline">Get in touch</Link>
          </span>
        </div>
      )}
    </div>
  );
}
