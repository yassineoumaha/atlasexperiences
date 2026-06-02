import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://imourig.com";
const LOCALES = ["en", "fr", "es", "ar"];

const STATIC_PATHS = [
  "",
  "/experiences",
  "/map",
  "/blog",
  "/about",
  "/contact",
  "/tips",
  "/plan",
  "/world-cup-2030",
  "/affiliate-disclosure",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for all locales
  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic: published experiences
  try {
    const supabase = await createClient();
    const { data: experiences } = await (supabase as unknown as any)
      .from("experiences")
      .select("slug, updated_at")
      .eq("published", true)
      .eq("approved", true);

    if (experiences) {
      for (const exp of experiences) {
        for (const locale of LOCALES) {
          entries.push({
            url: `${SITE_URL}/${locale}/experiences/${exp.slug}`,
            lastModified: exp.updated_at ? new Date(exp.updated_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  } catch {}

  // Dynamic: published blog posts
  try {
    const supabase = await createClient();
    const { data: posts } = await (supabase as unknown as any)
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true);

    if (posts) {
      for (const post of posts) {
        for (const locale of LOCALES) {
          entries.push({
            url: `${SITE_URL}/${locale}/blog/${post.slug}`,
            lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  } catch {}

  return entries;
}
