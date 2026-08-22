import { notFound } from "next/navigation";
import Link from "next/link";
import { seoMeta } from "@/lib/seo/metadata";
import { BLOG_POSTS, EDITORIAL_POSTS, getPostBySlug } from "@/lib/blog/posts";
import { AUTHOR, authorJsonLd, SOURCES } from "@/lib/author";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight, BookOpen, HelpCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { InArticleAd } from "@/components/ui/AdBanner";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  // Auto-derive keywords from slug, category, and title words
  const slugWords = slug.split("-").filter(w => w.length > 3);
  const titleWords = post.title.toLowerCase().split(/[\s—:,&]+/).filter(w => w.length > 3);
  const autoKeywords = [...new Set([...slugWords, ...titleWords, post.category.toLowerCase(), "vedic astrology", "astrology guide"])];
  return seoMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    keywords: autoKeywords,
    noindex: post.generated,
  });
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

type Block =
  | { type: "el"; el: React.JSX.Element }
  | { type: "table"; rows: string[][] };

// Simple markdown-like renderer. Tables are accumulated into a real <table>
// with a column count taken from the header row, so 2-, 3- and 4-column tables
// all render correctly instead of being forced into a fixed grid.
function renderContent(content: string) {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let key = 0;
  let tableRows: string[][] | null = null;

  const flushTable = () => {
    if (tableRows && tableRows.length) blocks.push({ type: "table", rows: tableRows });
    tableRows = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("|")) {
      const cells = trimmed.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.some((c) => c.match(/^:?-+:?$/))) continue; // separator row
      if (!tableRows) tableRows = [];
      tableRows.push(cells);
      continue;
    }
    flushTable();

    if (!trimmed) { blocks.push({ type: "el", el: <div key={key++} className="h-2" /> }); continue; }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "el", el: <h2 key={key++} className="font-sora font-bold text-xl text-white mt-8 mb-3">{renderInline(trimmed.slice(3))}</h2> });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "el", el: <h3 key={key++} className="font-sora font-semibold text-base text-gold-200 mt-5 mb-2">{renderInline(trimmed.slice(4))}</h3> });
    } else if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*\s*[-—:]?\s*(.*)$/);
      if (match && match[2]) {
        blocks.push({ type: "el", el: (
          <div key={key++} className="text-[15px] text-[var(--text-secondary)] mb-1.5 flex gap-2">
            <span className="text-gold-400">•</span>
            <span><strong className="text-gold-200">{match[1]}</strong> — {renderInline(match[2])}</span>
          </div>
        ) });
      } else {
        blocks.push({ type: "el", el: <div key={key++} className="text-[15px] text-[var(--text-secondary)] mb-1.5 flex gap-2"><span className="text-gold-400">•</span><span>{renderInline(trimmed.slice(2))}</span></div> });
      }
    } else if (trimmed.startsWith("- ")) {
      blocks.push({ type: "el", el: <div key={key++} className="text-[15px] text-[var(--text-secondary)] mb-1.5 flex gap-2"><span className="text-gold-400">•</span><span>{renderInline(trimmed.slice(2))}</span></div> });
    } else if (trimmed.match(/^\d+\.\s/)) {
      blocks.push({ type: "el", el: (
        <div key={key++} className="text-[15px] text-[var(--text-secondary)] mb-1.5 flex gap-2">
          <span className="text-gold-400 font-semibold w-5 shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
          <span>{renderInline(trimmed.replace(/^\d+\.\s/, ""))}</span>
        </div>
      ) });
    } else {
      blocks.push({ type: "el", el: <p key={key++} className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-4">{renderInline(trimmed)}</p> });
    }
  }
  flushTable();

  return blocks.map((b, i) => {
    if (b.type === "el") return b.el;
    const [header, ...body] = b.rows;
    return (
      <div key={`t${i}`} className="my-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gold-400/30">
              {header.map((c, j) => <th key={j} className="text-left text-gold-200 font-semibold py-2 pr-4 align-top">{renderInline(c)}</th>)}
            </tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className="border-b border-white/5">
                {row.map((c, j) => <td key={j} className="text-[var(--text-secondary)] py-2 pr-4 align-top">{renderInline(c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
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

  // Navigate within editorial articles only — templated posts are reference
  // pages and shouldn't be threaded into the reading sequence.
  const currentIdx = EDITORIAL_POSTS.findIndex((p) => p.slug === slug);
  const prev = currentIdx > 0 ? EDITORIAL_POSTS[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < EDITORIAL_POSTS.length - 1 ? EDITORIAL_POSTS[currentIdx + 1] : null;

  const citedSources = (post.sources ?? []).map((k) => SOURCES[k]).filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: authorJsonLd(),
    publisher: {
      "@type": "Organization",
      name: "VivaAI Astrology",
      url: "https://vivaai.in",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://vivaai.in/blog/${slug}` },
    ...(citedSources.length
      ? { citation: citedSources.map((s) => `${s.title} — ${s.author}`) }
      : {}),
  };

  const faqJsonLd = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <article className="section-container py-12 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title.length > 40 ? post.title.substring(0, 37) + "..." : post.title }]} />
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
          <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-gold-400" />{post.category}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
          {post.updated && post.updated !== post.date && (
            <span className="flex items-center gap-1 text-gold-200/70">Updated {post.updated}</span>
          )}
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
        </div>
        <h1 className="font-sora font-extrabold text-2xl sm:text-3xl gold-text mb-3">{post.title}</h1>
        <p className="text-[var(--text-muted)]">{post.description}</p>
        <div className="mt-3 text-xs text-[var(--text-muted)]">
          By <Link href="/about" className="text-gold-300 hover:underline">{AUTHOR.name}</Link> — {AUTHOR.role}
        </div>
      </div>

      <div className="glass-card-bright p-6 sm:p-8">
        {renderContent(post.content)}
      </div>

      {/* FAQ — rendered on-page and emitted as FAQPage structured data above */}
      {post.faqs?.length ? (
        <section className="mt-8">
          <h2 className="font-sora font-bold text-lg gold-text mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gold-400" /> Frequently asked questions
          </h2>
          <div className="space-y-3">
            {post.faqs.map((f, i) => (
              <details key={i} className="glass-card p-4 group">
                <summary className="font-semibold text-white cursor-pointer list-none flex items-start gap-2">
                  <span className="text-gold-400 mt-0.5">Q.</span>{f.q}
                </summary>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2 pl-6">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sources — lets a reader trace each rule back to a named text */}
      {citedSources.length ? (
        <section className="mt-8">
          <h2 className="font-sora font-bold text-lg gold-text mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-400" /> Sources
          </h2>
          <ul className="space-y-2">
            {citedSources.map((s) => (
              <li key={s.key} className="text-sm text-[var(--text-secondary)]">
                <span className="text-gold-200 font-semibold">{s.title}</span>
                {s.author ? <span className="text-[var(--text-muted)]"> — {s.author}</span> : null}
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">{s.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Author card — who wrote this and on what basis (E-E-A-T) */}
      <section className="mt-8 glass-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-9 h-9 rounded-full bg-gold-400/15 text-gold-200 flex items-center justify-center font-semibold text-sm">
            {AUTHOR.name.split(" ").map((n) => n[0]).join("")}
          </span>
          <div>
            <div className="text-sm font-semibold text-white">{AUTHOR.name}</div>
            <div className="text-xs text-[var(--text-muted)]">{AUTHOR.role}</div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{AUTHOR.shortBio}</p>
        <ul className="mt-2 space-y-1">
          {AUTHOR.credentials.map((c, i) => (
            <li key={i} className="text-xs text-[var(--text-muted)] flex gap-2"><span className="text-gold-400">•</span><span>{c}</span></li>
          ))}
        </ul>
        <Link href="/about" className="inline-block mt-3 text-xs text-gold-300 hover:underline">More about the author and method →</Link>
      </section>

      {/* Ad placement — editorial articles only */}
      {!post.generated && <InArticleAd />}

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
