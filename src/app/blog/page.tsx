import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { Calendar, Clock, Tag } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InArticleAd } from "@/components/ui/AdBanner";

export const metadata = seoMeta({
  title: "Astrology Blog — Vedic Astrology Articles & Guides",
  description: "Expert articles on Vedic astrology, Kundali, doshas, nakshatras, numerology & more. Learn astrology from comprehensive, easy-to-understand guides.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="section-container py-12 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <div className="text-center mb-10">
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl gold-text mb-3">Astrology Blog</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Expert articles, guides, and insights on Vedic astrology, Kundali, doshas, and more.
        </p>
      </div>

      <div className="space-y-4">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="glass-card p-5 sm:p-6 block group hover:border-gold-400/40 transition-all">
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-2">
              <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-gold-400" />{post.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            </div>
            <h2 className="font-sora font-bold text-lg text-white group-hover:text-gold-400 transition mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{post.description}</p>
          </Link>
        ))}
      </div>
      <InArticleAd />
    </div>
  );
}
