import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["maplibre-gl"],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cf.bstatic.com" },
      { protocol: "https", hostname: "q-xx.bstatic.com" },
      // Supabase Storage (user-uploaded images)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Improve server component error messages in production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
  async redirects() {
    return [
      // Legacy/marketing link consolidation → the real operator onboarding route.
      // Covers both the bare path and the locale-prefixed form.
      { source: "/for-operators", destination: "/en/operators/register", permanent: true },
      { source: "/:locale/for-operators", destination: "/:locale/operators/register", permanent: true },
    ];
  },
};

export default nextConfig;
