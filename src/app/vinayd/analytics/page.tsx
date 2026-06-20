"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, Globe, Search, DollarSign, ExternalLink, Info, TrendingUp } from "lucide-react";

/**
 * Traffic analytics live in Google's tools (GA4 + Search Console + AdSense).
 * There is no on-site database to store page views, so rather than show
 * fabricated numbers, this page deep-links to the real dashboards.
 */
export default function AdminAnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/vinayd/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-gold-400">Loading…</div></div>;
  }

  const tools = [
    {
      icon: BarChart3, color: "bg-orange-500/20 text-orange-400",
      name: "Google Analytics 4", desc: "Live visitors, page views, traffic sources, devices, countries, engagement.",
      links: [
        { label: "Realtime", href: "https://analytics.google.com/analytics/web/#/p0/realtime/overview" },
        { label: "Reports", href: "https://analytics.google.com" },
      ],
    },
    {
      icon: Search, color: "bg-cyan-500/20 text-cyan-400",
      name: "Search Console", desc: "Search impressions, clicks, average position, indexed pages, query data.",
      links: [
        { label: "Performance", href: "https://search.google.com/search-console/performance/search-analytics" },
        { label: "Index Coverage", href: "https://search.google.com/search-console/index" },
        { label: "Sitemaps", href: "https://search.google.com/search-console/sitemaps" },
      ],
    },
    {
      icon: DollarSign, color: "bg-gold-400/20 text-gold-400",
      name: "Google AdSense", desc: "Ad revenue, RPM, page views, impressions, CTR, and policy status.",
      links: [
        { label: "Home", href: "https://www.google.com/adsense" },
        { label: "Reports", href: "https://www.google.com/adsense/new/u/0/pub/main/reports" },
      ],
    },
    {
      icon: TrendingUp, color: "bg-purple-500/20 text-purple-400",
      name: "PageSpeed Insights", desc: "Core Web Vitals (LCP, CLS, INP) — directly affects SEO ranking.",
      links: [
        { label: "Test vivaai.in", href: "https://pagespeed.web.dev/analysis?url=https://vivaai.in" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora font-bold text-2xl text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Your real traffic data lives in Google&apos;s tools — open them directly below.</p>
      </div>

      <div className="rounded-xl border border-blue-400/30 bg-blue-400/5 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 leading-relaxed">
          <p className="font-medium text-blue-300 mb-1">Why no numbers here?</p>
          This site has no database, so page-view data isn&apos;t stored on-site. GA4 already tracks every visit (the tag is live in your layout). For accurate, real-time numbers, use the official dashboards — they&apos;re the source of truth and free.
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map((t) => (
          <div key={t.name} className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.color}`}>
                <t.icon className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-sora font-semibold text-sm text-white">{t.name}</h2>
            </div>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">{t.desc}</p>
            <div className="flex flex-wrap gap-2">
              {t.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition flex items-center gap-1.5">
                  {l.label} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SEO quick checklist */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(15,15,30,0.8)" }}>
        <h2 className="font-sora font-semibold text-sm text-white mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gold-400" /> Weekly SEO Routine
        </h2>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex gap-2"><span className="text-gold-400">1.</span> Search Console → Performance: note which queries are gaining impressions, write a blog post targeting the top one.</li>
          <li className="flex gap-2"><span className="text-gold-400">2.</span> Index Coverage: confirm new pages are indexed; request indexing for any &quot;Discovered – not indexed&quot;.</li>
          <li className="flex gap-2"><span className="text-gold-400">3.</span> PageSpeed: keep mobile score above 90; fix any CLS/LCP regressions.</li>
          <li className="flex gap-2"><span className="text-gold-400">4.</span> AdSense: check RPM and policy center for any flags.</li>
        </ul>
      </div>
    </div>
  );
}
