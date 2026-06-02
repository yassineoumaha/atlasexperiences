import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://imourig.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/en/admin",
          "/fr/admin",
          "/es/admin",
          "/ar/admin",
          "/en/auth",
          "/fr/auth",
          "/es/auth",
          "/ar/auth",
          "/en/portal",
          "/fr/portal",
          "/es/portal",
          "/ar/portal",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
