"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Save, Eye, ArrowLeft, Sparkles, Clock, Tag, Link2, FileText } from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  // Auto-generate slug from title
  useEffect(() => {
    setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }, [title]);

  // Auto-generate meta title
  useEffect(() => {
    if (!metaTitle) setMetaTitle(title);
  }, [title, metaTitle]);

  const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

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
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gold-400 text-black hover:bg-gold-500 transition">
            <Save className="w-4 h-4" /> {postStatus === "draft" ? "Save Draft" : "Publish"}
          </button>
        </div>
      </div>

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
            {["Basics","Zodiac","Planets","Houses","Transits","Doshas","Relationships","Numerology","Remedies"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Status</label>
          <select value={postStatus} onChange={(e) => setPostStatus(e.target.value as any)}
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
          <label className="text-xs text-gray-500">Content (Markdown supported)</label>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" /> {readTime}
            <span>•</span>
            <FileText className="w-3 h-3" /> {wordCount} words
          </div>
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20}
          placeholder="Write your blog post content in Markdown...&#10;&#10;## Heading 2&#10;&#10;Your content here...&#10;&#10;### Heading 3&#10;&#10;More content..."
          className="w-full px-4 py-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/40 resize-y font-mono leading-relaxed" />
      </div>

      {/* SEO Fields */}
      <div className="rounded-xl border border-white/10 p-5 space-y-4" style={{ background: "rgba(15,15,30,0.8)" }}>
        <h3 className="font-sora font-semibold text-sm text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold-400" /> SEO Settings</h3>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Meta Title ({metaTitle.length}/60)</label>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-gold-400/40" />
          {metaTitle.length > 60 && <p className="text-xs text-red-400 mt-1">Title too long — keep under 60 characters</p>}
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Meta Description ({metaDesc.length}/160)</label>
          <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-gold-400/40 resize-none" />
          {metaDesc.length > 160 && <p className="text-xs text-red-400 mt-1">Description too long — keep under 160 characters</p>}
        </div>
        {/* Preview */}
        <div className="bg-white/[0.02] rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Google Search Preview</p>
          <p className="text-blue-400 text-sm font-medium">{metaTitle || "Post Title"}</p>
          <p className="text-emerald-400 text-xs font-mono">vivaai.in/blog/{slug || "post-slug"}</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{metaDesc || description || "Post description will appear here..."}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">Blog posts are currently saved as static files. Database CMS coming soon with PostgreSQL integration.</p>
    </div>
  );
}
