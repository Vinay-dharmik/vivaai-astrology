"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { href: "/kundali", label: "Free Kundali" },
  { href: "/horoscope", label: "Horoscope" },
  { href: "/matching", label: "Matching" },
  { href: "/panchang", label: "Panchang" },
  { href: "/calculator", label: "Tools" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]"
      style={{ background: "rgba(10,11,20,0.85)", backdropFilter: "blur(16px)" }}>
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-gold-400 group-hover:animate-glow-pulse transition" />
          <span className="font-sora font-bold text-lg gold-text">VivaAI</span>
          <span className="text-sm text-gold-200 hidden sm:inline">Astrology</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-sm text-[var(--text-secondary)] hover:text-gold-400 transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/kundali"
            className="gold-btn text-sm px-5 py-2 rounded-lg">
            Get Free Kundali
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gold-400"
          aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] px-5 py-4 space-y-3"
          style={{ background: "rgba(10,11,20,0.95)" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-[var(--text-secondary)] hover:text-gold-400 transition py-1">
              {l.label}
            </Link>
          ))}
          <Link href="/kundali" onClick={() => setOpen(false)}
            className="block gold-btn text-center text-sm mt-2">
            Get Free Kundali
          </Link>
        </div>
      )}
    </nav>
  );
}
