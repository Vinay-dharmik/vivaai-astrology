"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Globe, CheckCircle, AlertTriangle, XCircle, ExternalLink, Search, FileText, Map, Link2 } from "lucide-react";
import Link from "next/link";

function SeoStatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} mb-3`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-2xl font-bold text-white font-sora">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function AdminSeoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading" || !session) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading...</div></div>;

  const pages = [
    { url: "/", title: "Homepage", indexed: true, score: 95 },
    { url: "/kundali", title: "Free Kundali Generator", indexed: true, score: 92 },
    { url: "/matching", title: "Kundali Matching", indexed: true, score: 90 },
    { url: "/horoscope", title: "Daily Horoscope", indexed: true, score: 88 },
    { url: "/nakshatra-compatibility", title: "Nakshatra Compatibility", indexed: true, score: 85 },
    { url: "/blog", title: "Blog Index", indexed: true, score: 82 },
    { url: "/calculator", title: "Astrology Calculators", indexed: true, score: 80 },
    { url: "/panchang", title: "Daily Panchang", indexed: true, score: 78 },
    { url: "/calculator/mangal-dosha", title: "Mangal Dosha Checker", indexed: false, score: 75 },
    { url: "/calculator/marriage-age", title: "Marriage Age Predictor", indexed: false, score: 72 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora font-bold text-2xl text-white">SEO Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor indexing, optimize meta data, and track rankings.</p>
      </div>

      {/* SEO Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SeoStatCard icon={Globe} label="Total Pages" value="968+" color="bg-blue-500/20 text-blue-400" />
        <SeoStatCard icon={CheckCircle} label="Indexed" value="847" color="bg-emerald-500/20 text-emerald-400" />
        <SeoStatCard icon={AlertTriangle} label="Pending Index" value="121" color="bg-yellow-500/20 text-yellow-400" />
        <SeoStatCard icon={Map} label="Sitemap URLs" value="968" color="bg-purple-500/20 text-purple-400" />
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-3">
        <a href="https://search.google.com/search-console" target="_blank" rel="noopener"
          className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition" style={{ background: "rgba(15,15,30,0.8)" }}>
          <Search className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-white font-medium">Search Console</p>
            <p className="text-[0.6rem] text-gray-500">View indexing & performance</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-600 ml-auto" />
        </a>
        <a href="https://vivaai.in/sitemap.xml" target="_blank" rel="noopener"
          className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition" style={{ background: "rgba(15,15,30,0.8)" }}>
          <Map className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm text-white font-medium">Sitemap</p>
            <p className="text-[0.6rem] text-gray-500">View live sitemap.xml</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-600 ml-auto" />
        </a>
        <a href="https://vivaai.in/robots.txt" target="_blank" rel="noopener"
          className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition" style={{ background: "rgba(15,15,30,0.8)" }}>
          <FileText className="w-5 h-5 text-gold-400" />
          <div>
            <p className="text-sm text-white font-medium">Robots.txt</p>
            <p className="text-[0.6rem] text-gray-500">View crawl rules</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-600 ml-auto" />
        </a>
      </div>

      {/* Pages Audit */}
      <div>
        <h2 className="font-sora font-semibold text-sm text-white mb-3">Page SEO Audit</h2>
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(15,15,30,0.8)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-500">
                <th className="text-left p-3 font-medium">Page</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Title</th>
                <th className="text-center p-3 font-medium">Indexed</th>
                <th className="text-right p-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pages.map((page) => (
                <tr key={page.url} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-3 font-mono text-xs text-blue-400">{page.url}</td>
                  <td className="p-3 text-gray-300 text-xs hidden sm:table-cell">{page.title}</td>
                  <td className="p-3 text-center">
                    {page.indexed
                      ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      : <XCircle className="w-4 h-4 text-yellow-400 mx-auto" />}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      page.score >= 85 ? "bg-emerald-400/10 text-emerald-400" :
                      page.score >= 70 ? "bg-yellow-400/10 text-yellow-400" :
                      "bg-red-400/10 text-red-400"
                    }`}>{page.score}/100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
