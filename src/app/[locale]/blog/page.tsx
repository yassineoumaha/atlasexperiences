import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Morocco Travel Blog — Atlas Experiences",
  description: "Real guides, itineraries, safety tips and insider knowledge about travelling in Morocco.",
};

async function getBlogPosts() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as unknown as any)
      .from("blog_posts")
      .select("id, title, slug, excerpt, image, category, read_time, published_at, author")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(24);
    return (data as any[]) ?? [];
  } catch {
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  itinerary: "bg-blue-50 text-blue-700 border-blue-200",
  safety: "bg-amber-50 text-amber-700 border-amber-200",
  food: "bg-orange-50 text-orange-700 border-orange-200",
  culture: "bg-purple-50 text-purple-700 border-purple-200",
  budget: "bg-emerald-50 text-emerald-700 border-emerald-200",
  transport: "bg-teal-50 text-teal-700 border-teal-200",
};

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const posts = await getBlogPosts();

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-16 px-4 text-center">
        <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider mb-4">
          <BookOpen className="w-4 h-4" /> Morocco Travel Blog
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Real guides, honest tips.</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Itineraries, safety guides, cost breakdowns and local knowledge — written by people who&apos;ve actually been there.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-400 mb-2">No articles yet</h2>
            <p className="text-stone-400 text-sm mb-6">Be the first to contribute — share your Morocco travel knowledge.</p>
            <Link
              href={`/${locale}/portal/submit-blog`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Write an Article <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {posts[0] && (
              <Link
                href={`/${locale}/blog/${posts[0].slug}`}
                className="group block mb-12 rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {posts[0].image ? (
                    <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                      <img
                        src={posts[0].image}
                        alt={posts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-amber-400" />
                    </div>
                  )}
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs uppercase tracking-wider mb-3">
                      Featured
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 group-hover:text-amber-600 transition-colors mb-3 leading-tight">
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && (
                      <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-3">{posts[0].excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-stone-400 text-xs">
                      {posts[0].author && <span>{posts[0].author}</span>}
                      {posts[0].read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {posts[0].read_time} min read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post: any) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {post.image ? (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-stone-300" />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category && (
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border mb-3 ${CATEGORY_COLORS[post.category] ?? "bg-stone-50 text-stone-600 border-stone-200"}`}>
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-600 transition-colors leading-snug mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-stone-400 text-xs leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 text-stone-400 text-xs">
                      {post.author && <span>{post.author}</span>}
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.read_time} min
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Write CTA */}
            <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-stone-900 text-lg mb-1">Know Morocco well?</h3>
                <p className="text-stone-500 text-sm">Share your experience — write a guide or trip report.</p>
              </div>
              <Link
                href={`/${locale}/portal/submit-blog`}
                className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Write an Article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
