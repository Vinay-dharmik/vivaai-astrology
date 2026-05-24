import { notFound } from "next/navigation";
import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog/posts";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { InArticleAd } from "@/components/ui/AdBanner";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return seoMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
  });
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// Simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.JSX.Element[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { elements.push(<br key={key++} />); continue; }

    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={key++} className="font-sora font-bold text-lg text-white mt-6 mb-3">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={key++} className="font-sora font-semibold text-base text-gold-200 mt-4 mb-2">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("| ")) {
      // Table row — simplified display
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      if (cells.some((c) => c.match(/^-+$/))) continue; // skip separator row
      const isHeader = elements[elements.length - 1]?.key === undefined;
      elements.push(
        <div key={key++} className={`grid grid-cols-3 gap-2 text-xs ${isHeader ? "text-gold-200 font-semibold border-b border-gold-400/20 pb-1 mb-1" : "text-[var(--text-secondary)]"} py-1`}>
          {cells.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      );
    } else if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*\s*[-—]\s*(.+)$/);
      if (match) {
        elements.push(
          <div key={key++} className="text-sm text-[var(--text-secondary)] mb-1 flex gap-2">
            <span className="text-gold-400">•</span>
            <span><strong className="text-gold-200">{match[1]}</strong> — {match[2]}</span>
          </div>
        );
      } else {
        elements.push(<div key={key++} className="text-sm text-[var(--text-secondary)] mb-1 flex gap-2"><span className="text-gold-400">•</span><span>{renderInline(trimmed.slice(2))}</span></div>);
      }
    } else if (trimmed.match(/^\d+\.\s/)) {
      elements.push(
        <div key={key++} className="text-sm text-[var(--text-secondary)] mb-1 flex gap-2">
          <span className="text-gold-400 font-semibold w-5 shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
          <span>{renderInline(trimmed.replace(/^\d+\.\s/, ""))}</span>
        </div>
      );
    } else {
      elements.push(<p key={key++} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{renderInline(trimmed)}</p>);
    }
  }
  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Handle bold, links
  const parts = text.split(/(\*\*[^*]+\*\*|\[.+?\]\(.+?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-gold-200">{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return <Link key={i} href={linkMatch[2]} className="text-gold-400 hover:underline">{linkMatch[1]}</Link>;
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const currentIdx = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prev = currentIdx > 0 ? BLOG_POSTS[currentIdx - 1] : null;
  const next = currentIdx < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIdx + 1] : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "VivaAI Astrology", url: "https://vivaai.in" },
    publisher: { "@type": "Organization", name: "VivaAI Astrology", url: "https://vivaai.in" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://vivaai.in/blog/${slug}` },
  };

  return (
    <article className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title.length > 40 ? post.title.substring(0, 37) + "..." : post.title }]} />
      <div className="mb-8">
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
          <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-gold-400" />{post.category}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
        </div>
        <h1 className="font-sora font-extrabold text-2xl sm:text-3xl gold-text mb-3">{post.title}</h1>
        <p className="text-[var(--text-muted)]">{post.description}</p>
      </div>

      <div className="glass-card-bright p-6 sm:p-8">
        {renderContent(post.content)}
      </div>

      {/* Ad placement */}
      <InArticleAd />

      {/* Social sharing */}
      <div className="flex justify-center mt-6">
        <ShareButtons
          title={post.title}
          text={post.description}
          url={`https://vivaai.in/blog/${slug}`}
        />
      </div>

      {/* Navigation */}
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {prev && (
          <Link href={`/blog/${prev.slug}`} className="glass-card p-4 group hover:border-gold-400/40 transition">
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-1"><ArrowLeft className="w-3 h-3" /> Previous</div>
            <div className="text-sm font-semibold text-white group-hover:text-gold-400 transition">{prev.title}</div>
          </Link>
        )}
        {next && (
          <Link href={`/blog/${next.slug}`} className="glass-card p-4 group hover:border-gold-400/40 transition text-right sm:col-start-2">
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 justify-end mb-1">Next <ArrowRight className="w-3 h-3" /></div>
            <div className="text-sm font-semibold text-white group-hover:text-gold-400 transition">{next.title}</div>
          </Link>
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-8 glass-card p-6">
        <h2 className="font-sora font-bold text-lg gold-text mb-2">Ready to explore your stars?</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Get your free Vedic birth chart with detailed analysis.</p>
        <Link href="/kundali" className="gold-btn px-6 py-2 text-sm">Generate Free Kundali</Link>
      </div>
    </article>
  );
}
