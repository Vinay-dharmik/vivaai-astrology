"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Save, Eye, ArrowLeft, Sparkles, Clock, Tag, FileText, Copy, CheckCheck, Download } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "vivaai_blog_drafts";

interface Draft {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
  status: "draft" | "published";
  date: string;
  savedAt: string;
}

function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveDraftToStorage(draft: Draft) {
  const drafts = loadDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);
  if (idx >= 0) drafts[idx] = draft;
  else drafts.unshift(draft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export default function NewBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Basics");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [postStatus, setPostStatus] = useState<"draft" | "published">("draft");
  const [draftId] = useState(() => `draft_${Date.now()}`);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  // Auto-generate slug from title
  useEffect(() => {
    setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }, [title]);

  // Auto-generate meta title if empty
  useEffect(() => {
    if (!metaTitle && title) setMetaTitle(title.slice(0, 60));
  }, [title, metaTitle]);

  // Auto-save to localStorage every 30s when content changes
  useEffect(() => {
    if (!title && !content) return;
    const t = setTimeout(() => handleSave("auto"), 30000);
    return () => clearTimeout(t);
  }, [title, content, description]);

  const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const handleSave = useCallback((mode: "auto" | "manual" = "manual") => {
    if (!title) return;
    const draft: Draft = {
      id: draftId,
      title, slug, category, description, content,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || description,
      status: postStatus,
      date: new Date().toISOString().split("T")[0],
      savedAt: new Date().toLocaleString("en-IN"),
    };
    saveDraftToStorage(draft);
    if (mode === "manual") { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }, [draftId, title, slug, category, description, content, metaTitle, metaDesc, postStatus]);

  // Generate TypeScript code snippet for manual publishing
  const generateCode = (): string => {
    const escContent = content.replace(/`/g, "\\`").replace(/\${/g, "\\${");
    return `// Add this to src/lib/blog/generated-posts.ts (or posts.ts MANUAL_POSTS array)
{
  slug: "${slug}",
  title: \`${title}\`,
  description: \`${description}\`,
  date: "${new Date().toISOString().split("T")[0]}",
  category: "${category}",
  readTime: "${readTime}",
  content: \`${escContent}\`,
},`;
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generateCode()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "blog-post"}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (status === "loading" || !session) {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/vinayd/blogs" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-sora font-bold text-xl text-white">New Blog Post</h1>
            <p className="text-xs text-gray-500">{wordCount} words • {readTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition">
            <Eye className="w-4 h-4" /> Export
          </button>
          <button onClick={() => handleSave("manual")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gold-400 text-black hover:bg-gold-500 transition">
            {saved ? <><CheckCheck className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Draft</>}
          </button>
        </div>
      </div>

      {/* Export panel */}
      {showExport && (
        <div className="rounded-xl border border-gold-400/30 p-5 space-y-3" style={{ background: "rgba(15,15,30,0.9)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-sora font-semibold text-sm text-gold-200">Publish This Post</h3>
            <span className="text-xs text-gray-500">Step 1: Copy → Step 2: Paste into posts.ts → Step 3: Deploy</span>
          </div>
          <p className="text-xs text-gray-400">Since there&apos;s no database, copy the generated TypeScript snippet below and paste it into <code className="text-gold-400 bg-white/5 px-1 py-0.5 rounded">src/lib/blog/posts.ts</code> inside the <code className="text-gold-400 bg-white/5 px-1 py-0.5 rounded">MANUAL_POSTS</code> array. Then redeploy.</p>
          <pre className="text-xs text-gray-400 bg-black/40 rounded-lg p-4 overflow-x-auto max-h-48 font-mono leading-relaxed whitespace-pre-wrap">
            {generateCode()}
          </pre>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gold-400/20 text-gold-400 hover:bg-gold-400/30 transition">
              {copied ? <><CheckCheck className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
            </button>
            <button type="button" onClick={handleDownloadCode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition">
              <Download className="w-4 h-4" /> Download .ts
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="w-full text-2xl font-bold text-white bg-transparent border-0 outline-none placeholder-gray-600 font-sora" />
        <p className="text-xs text-gray-600 mt-1 font-mono">vivaai.in/blog/{slug || "your-post-slug"}</p>
      </div>

      {/* Meta Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-gold-400/40">
            {["Basics","Zodiac","Planets","Houses","Transits","Doshas","Relationships","Numerology","Remedies"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Status</label>
          <select value={postStatus} onChange={(e) => setPostStatus(e.target.value as "draft" | "published")}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-gold-400/40">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Description (shown in blog list)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
          placeholder="Brief description of the post..."
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/40 resize-none" />
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-500">Content (Markdown supported: ## H2, ### H3, - list, **bold**)</label>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" /> {readTime}
            <span>•</span>
            <FileText className="w-3 h-3" /> {wordCount} words
          </div>
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={22}
          placeholder={`Write your blog post in Markdown...\n\n## Introduction\n\nYour opening paragraph here.\n\n## Section 1\n\nContent...\n\n### Sub-section\n\n- Bullet point\n- Another point\n\n**Key term** — explanation here.`}
          className="w-full px-4 py-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/40 resize-y font-mono leading-relaxed" />
      </div>

      {/* SEO Fields */}
      <div className="rounded-xl border border-white/10 p-5 space-y-4" style={{ background: "rgba(15,15,30,0.8)" }}>
        <h3 className="font-sora font-semibold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" /> SEO Settings
        </h3>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Meta Title ({metaTitle.length}/60)</label>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-gold-400/40" />
          {metaTitle.length > 60 && <p className="text-xs text-red-400 mt-1">Too long — keep under 60 characters</p>}
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Meta Description ({metaDesc.length}/160)</label>
          <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-gold-400/40 resize-none" />
          {metaDesc.length > 160 && <p className="text-xs text-red-400 mt-1">Too long — keep under 160 characters</p>}
        </div>
        <div className="bg-white/[0.02] rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Google Search Preview</p>
          <p className="text-blue-400 text-sm font-medium truncate">{metaTitle || title || "Post Title"}</p>
          <p className="text-emerald-400 text-xs font-mono">vivaai.in/blog/{slug || "post-slug"}</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{metaDesc || description || "Post description..."}</p>
        </div>
      </div>

      {/* Draft list */}
      <DraftList currentId={draftId} onLoad={(d) => {
        setTitle(d.title); setSlug(d.slug); setCategory(d.category);
        setDescription(d.description); setContent(d.content);
        setMetaTitle(d.metaTitle); setMetaDesc(d.metaDesc); setPostStatus(d.status);
      }} />
    </div>
  );
}

function DraftList({ currentId, onLoad }: { currentId: string; onLoad: (d: Draft) => void }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { if (open) setDrafts(loadDrafts().filter((d) => d.id !== currentId)); }, [open, currentId]);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-gray-500 hover:text-gold-400 transition underline">
        Load a saved draft ({loadDrafts().length - 1 > 0 ? loadDrafts().length - 1 : 0} saved)
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 p-4" style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-300">Saved Drafts</p>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-white">Close</button>
      </div>
      {drafts.length === 0
        ? <p className="text-xs text-gray-600">No other drafts saved yet.</p>
        : drafts.map((d) => (
          <div key={d.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm text-white">{d.title || "Untitled"}</p>
              <p className="text-xs text-gray-500">{d.category} • {d.savedAt}</p>
            </div>
            <button type="button" onClick={() => { onLoad(d); setOpen(false); }}
              className="text-xs text-gold-400 hover:underline">Load</button>
          </div>
        ))
      }
    </div>
  );
}
