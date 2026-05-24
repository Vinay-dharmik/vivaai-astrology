"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, X } from "lucide-react";

/**
 * Sticky bottom CTA bar that appears after scrolling down.
 * Only shows on pages where it makes sense (not on kundali page itself).
 * Proven mobile UX pattern — used by Astrotalk, ClickAstro, etc.
 */
export function StickyBottomCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show on kundali page (user is already there)
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/kundali")) {
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-[rgba(10,11,20,0.95)] border-t border-gold-400/30 backdrop-blur-lg px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">🔮 Free Vedic Kundali Report</p>
            <p className="text-[0.65rem] text-[var(--text-muted)]">Lagna • Dasha • Doshas • Predictions</p>
          </div>
          <Link href="/kundali"
            className="gold-btn text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0 shadow-glow font-semibold">
            <Star className="w-3 h-3" />
            Try Free
          </Link>
          <button onClick={() => setDismissed(true)}
            className="text-[var(--text-muted)] hover:text-white transition p-1"
            aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
