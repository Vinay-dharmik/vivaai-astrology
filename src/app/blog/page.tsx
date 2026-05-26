import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { Calendar, Clock, Tag } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";

export const metadata = seoMeta({
  title: "Astrology Blog — 50+ Expert Vedic Astrology Articles & Guides",
  description: "Expert articles on Vedic astrology, Kundali, zodiac signs, planets, houses, doshas, numerology & more. Learn astrology from comprehensive, easy-to-understand guides.",
  path: "/blog",
});

export default function BlogPage() {
  // Get unique categories
  const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category))).sort();

  return (
    <div className="section-container py-12 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <div className="text-center mb-8">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Astrology Blog</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          {BLOG_POSTS.length}+ expert articles on Vedic astrology, zodiac signs, planetary effects, and more.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(cat => (
          <a key={cat} href={`#cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs px-4 py-1.5 rounded-full border border-gold-400/20 text-gold-200 hover:bg-gold-400/10 hover:border-gold-400/40 transition">
            {cat}
          </a>
        ))}
      </div>

      {/* Posts grouped by category */}
      {categories.map((cat, catIdx) => {
        const catPosts = BLOG_POSTS.filter(p => p.category === cat);
        return (
          <div key={cat} id={`cat-${cat.toLowerCase().replace(/\s+/g, "-")}`} className="mb-10">
            <h2 className="font-sora font-bold text-lg gold-text mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" /> {cat} <span className="text-xs text-[var(--text-muted)] font-normal">({catPosts.length} articles)</span>
            </h2>
            <div className="space-y-3">
              {catPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="glass-card p-4 sm:p-5 block group hover:border-gold-400/40 transition-all">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-1.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-gold-400 transition mb-1">{post.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{post.description}</p>
                </Link>
              ))}
            </div>
            {catIdx === 1 && <InArticleAd />}
          </div>
        );
      })}
      <InArticleAd />
    </div>
  );
}
