import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { BlogPostRow } from "@/lib/supabase/types";

/** A blog post summary for listing cards (no full content). */
export type BlogPostCard = Pick<
  BlogPostRow,
  "id" | "title" | "slug" | "excerpt" | "image" | "category" | "read_time" | "published_at" | "author"
>;

/** Published posts, newest first. */
export async function listBlogPosts(limit = 24): Promise<BlogPostCard[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, image, category, read_time, published_at, author")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data as BlogPostCard[] | null) ?? [];
  } catch {
    return [];
  }
}

/** A single published post, including full HTML content. */
export async function getBlogPost(slug: string): Promise<BlogPostRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, image, category, read_time, published_at, author")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return (data as BlogPostRow | null) ?? null;
  } catch {
    return null;
  }
}
