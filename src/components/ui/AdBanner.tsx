"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  className?: string;
}

/**
 * Google AdSense ad placement — uses Next.js Script with lazyOnload
 * for zero CLS impact (per research Section 6.2).
 */
export function AdBanner({ slot, format = "auto", layout, className = "" }: AdBannerProps) {
  const loaded = useRef(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId || loaded.current) return;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        loaded.current = true;
      }
    } catch { /* AdSense not ready */ }
  }, [adsenseId]);

  if (!adsenseId) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className={`border border-dashed border-[var(--border)] rounded-lg p-4 text-center my-6 ${className}`}>
          <p className="text-xs text-[var(--text-muted)]">📢 Ad Space — Configure NEXT_PUBLIC_ADSENSE_ID</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`my-6 overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}

/** In-article ad for blog posts and long content pages. */
export function InArticleAd({ className = "" }: { className?: string }) {
  return <AdBanner slot="in-article-ad" format="fluid" layout="in-article" className={className} />;
}

/** Display ad for sidebars and between sections. */
export function DisplayAd({ className = "" }: { className?: string }) {
  return <AdBanner slot="display-ad" format="rectangle" className={className} />;
}

/**
 * AdSense auto-ads script loader — place once in layout.
 * Uses Next.js Script with lazyOnload strategy for zero LCP/CLS impact.
 */
export function AdSenseScript() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!adsenseId) return null;

  return (
    <Script
      id="adsense-script"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      crossOrigin="anonymous"
    />
  );
}
