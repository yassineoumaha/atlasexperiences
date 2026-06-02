import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

async function getPost(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any)
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, image, category, read_time, published_at, author")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data as any ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found — Imourig" };
  return {
    title: `${post.title} — Imourig Blog`,
    description: post.excerpt ?? post.title,
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const post = await getPost(slug);
  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="pt-20 min-h-screen bg-card">
      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Cover image */}
      {post.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="rounded-2xl overflow-hidden h-64 sm:h-80">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Category */}
        {post.category && (
          <span className="inline-flex text-xs font-semibold text-amber-700 bg-accent/10 border border-accent/30 px-2.5 py-0.5 rounded-full mb-4">
            {post.category}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-8 pb-8 border-b border-border">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {post.author}
            </span>
          )}
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {publishedDate}
            </span>
          )}
          {post.read_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.read_time} min read
            </span>
          )}
        </div>

        {/* Content */}
        {post.content ? (
          <div
            className="prose prose-stone prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-muted-foreground italic">Full article coming soon.</p>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-primary hover:text-amber-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> More articles
          </Link>
        </div>
      </article>
    </div>
  );
}
