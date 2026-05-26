"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Tag, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminBlogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  const categories = Array.from(new Set(BLOG_POSTS.map(p => p.category))).sort();

  const filtered = BLOG_POSTS.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Blog CMS</h1>
          <p className="text-sm text-gray-500 mt-1">{BLOG_POSTS.length} total posts • {categories.length} categories</p>
        </div>
        <Link href="/vinayd/blogs/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gold-400 text-black hover:bg-gold-500 transition">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/40" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white appearance-none focus:outline-none focus:border-gold-400/40">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-3 font-medium hidden lg:table-cell">Date</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((post) => (
                <tr key={post.slug} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-3">
                    <p className="text-white font-medium text-sm line-clamp-1">{post.title}</p>
                    <p className="text-[0.65rem] text-gray-600 mt-0.5 font-mono">/{post.slug}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-gold-400/10 text-gold-400">{post.category}</span>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-xs text-gray-500">{post.date}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400">Published</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/blog/${post.slug}`} target="_blank"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition" title="View">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400 transition" title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No posts matching your filters.</div>
        )}
      </div>
    </div>
  );
}
