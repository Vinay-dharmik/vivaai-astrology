"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NAKSHATRAS } from "@/lib/astrology/constants";
import { slugify } from "@/lib/astrology/nakshatraCompat";
import { Search, Heart, ArrowRight } from "lucide-react";

/**
 * Interactive Nakshatra Compatibility Selector
 * - Two searchable dropdowns (Male/Female nakshatra)
 * - Auto-suggest filtering
 * - Quick-select grid fallback
 * - Navigates to /nakshatra-compatibility/[pair] on submit
 */
export function NakshatraSelector() {
  const router = useRouter();
  const [maleNak, setMaleNak] = useState("");
  const [femaleNak, setFemaleNak] = useState("");
  const [maleSearch, setMaleSearch] = useState("");
  const [femaleSearch, setFemaleSearch] = useState("");
  const [maleFocused, setMaleFocused] = useState(false);
  const [femaleFocused, setFemaleFocused] = useState(false);

  // Filtered suggestions
  const maleSuggestions = useMemo(() => {
    if (!maleSearch) return NAKSHATRAS;
    return NAKSHATRAS.filter(n =>
      n.toLowerCase().includes(maleSearch.toLowerCase())
    );
  }, [maleSearch]);

  const femaleSuggestions = useMemo(() => {
    if (!femaleSearch) return NAKSHATRAS;
    return NAKSHATRAS.filter(n =>
      n.toLowerCase().includes(femaleSearch.toLowerCase())
    );
  }, [femaleSearch]);

  const canSubmit = maleNak && femaleNak;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const slug = `${slugify(maleNak)}-and-${slugify(femaleNak)}`;
    router.push(`/nakshatra-compatibility/${slug}`);
  };

  const selectMale = (nak: string) => {
    setMaleNak(nak);
    setMaleSearch(nak);
    setMaleFocused(false);
  };

  const selectFemale = (nak: string) => {
    setFemaleNak(nak);
    setFemaleSearch(nak);
    setFemaleFocused(false);
  };

  return (
    <div className="glass-card-bright p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="font-sora font-bold text-lg text-center gold-text mb-1">
        Check Your Nakshatra Compatibility
      </h2>
      <p className="text-xs text-[var(--text-muted)] text-center mb-6">
        Select both Nakshatras to get detailed marriage compatibility analysis
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Male Nakshatra */}
        <div className="relative">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">
            👨 Boy&apos;s Nakshatra
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={maleSearch}
              onChange={(e) => { setMaleSearch(e.target.value); setMaleNak(""); }}
              onFocus={() => setMaleFocused(true)}
              onBlur={() => setTimeout(() => setMaleFocused(false), 200)}
              placeholder="Search nakshatra..."
              className="form-select w-full pl-9 text-sm"
              autoComplete="off"
            />
          </div>
          {maleFocused && maleSuggestions.length > 0 && (
            <ul className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-[var(--border)] max-h-48 overflow-y-auto"
              style={{ background: "rgba(10,11,20,0.97)", backdropFilter: "blur(16px)" }}>
              {maleSuggestions.map((nak) => (
                <li key={nak}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectMale(nak)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gold-400/10 transition flex items-center gap-2 ${
                      maleNak === nak ? "text-gold-400 font-semibold" : "text-white"
                    }`}
                  >
                    <span className="text-gold-400">⭐</span> {nak}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {maleNak && (
            <p className="text-xs text-mystic-green mt-1">✓ Selected: {maleNak}</p>
          )}
        </div>

        {/* Female Nakshatra */}
        <div className="relative">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">
            👩 Girl&apos;s Nakshatra
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={femaleSearch}
              onChange={(e) => { setFemaleSearch(e.target.value); setFemaleNak(""); }}
              onFocus={() => setFemaleFocused(true)}
              onBlur={() => setTimeout(() => setFemaleFocused(false), 200)}
              placeholder="Search nakshatra..."
              className="form-select w-full pl-9 text-sm"
              autoComplete="off"
            />
          </div>
          {femaleFocused && femaleSuggestions.length > 0 && (
            <ul className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-[var(--border)] max-h-48 overflow-y-auto"
              style={{ background: "rgba(10,11,20,0.97)", backdropFilter: "blur(16px)" }}>
              {femaleSuggestions.map((nak) => (
                <li key={nak}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectFemale(nak)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gold-400/10 transition flex items-center gap-2 ${
                      femaleNak === nak ? "text-gold-400 font-semibold" : "text-white"
                    }`}
                  >
                    <span className="text-gold-400">⭐</span> {nak}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {femaleNak && (
            <p className="text-xs text-mystic-green mt-1">✓ Selected: {femaleNak}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
          canSubmit
            ? "gold-btn shadow-glow cursor-pointer"
            : "bg-white/5 text-[var(--text-muted)] cursor-not-allowed"
        }`}
      >
        <Heart className="w-4 h-4" />
        {canSubmit
          ? `Check ${maleNak} × ${femaleNak} Compatibility`
          : "Select Both Nakshatras to Continue"}
        {canSubmit && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
