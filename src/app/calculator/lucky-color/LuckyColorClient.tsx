"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import Link from "next/link";

const SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
const SIGN_COLORS: Record<string, { primary: string; secondary: string; avoid: string; gem: string; metal: string }> = {
  aries: { primary: "Red", secondary: "Orange", avoid: "Blue", gem: "Red Coral", metal: "Copper" },
  taurus: { primary: "Green", secondary: "Pink", avoid: "Red", gem: "Diamond", metal: "Silver" },
  gemini: { primary: "Yellow", secondary: "Light Green", avoid: "Dark Blue", gem: "Emerald", metal: "Gold" },
  cancer: { primary: "White", secondary: "Silver", avoid: "Dark Red", gem: "Pearl", metal: "Silver" },
  leo: { primary: "Gold", secondary: "Orange", avoid: "Black", gem: "Ruby", metal: "Gold" },
  virgo: { primary: "Green", secondary: "Brown", avoid: "Red", gem: "Emerald", metal: "Bronze" },
  libra: { primary: "White", secondary: "Light Blue", avoid: "Red", gem: "Diamond", metal: "Platinum" },
  scorpio: { primary: "Maroon", secondary: "Dark Red", avoid: "Yellow", gem: "Red Coral", metal: "Iron" },
  sagittarius: { primary: "Yellow", secondary: "Orange", avoid: "Black", gem: "Yellow Sapphire", metal: "Gold" },
  capricorn: { primary: "Black", secondary: "Dark Blue", avoid: "Red", gem: "Blue Sapphire", metal: "Iron" },
  aquarius: { primary: "Blue", secondary: "Violet", avoid: "Dark Red", gem: "Blue Sapphire", metal: "Lead" },
  pisces: { primary: "Yellow", secondary: "Sea Green", avoid: "Black", gem: "Yellow Sapphire", metal: "Gold" },
};

const DAY_RULERS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const DAY_COLORS = ["Gold/Orange","White/Silver","Red/Maroon","Green/Yellow","Yellow/Saffron","White/Pink","Blue/Black"];

export default function LuckyColorClient() {
  const [sign, setSign] = useState("");

  const today = new Date();
  const dayIndex = today.getDay();
  const dayRuler = DAY_RULERS[dayIndex];
  const dayColor = DAY_COLORS[dayIndex];
  const info = sign ? SIGN_COLORS[sign] : null;

  return (
    <div>
      <div className="glass-card-bright p-6 mb-6">
        <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">Select Your Zodiac Sign</label>
        <select value={sign} onChange={(e) => setSign(e.target.value)} className="form-select w-full mb-4">
          <option value="">Choose your sign...</option>
          {SIGNS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        {/* Today's planetary ruler */}
        <div className="bg-white/[0.03] rounded-lg p-4 text-center">
          <p className="text-xs text-[var(--text-muted)] mb-1">Today&apos;s Planetary Ruler</p>
          <p className="text-lg font-bold gold-text">{dayRuler}</p>
          <p className="text-xs text-[var(--text-muted)]">Universal lucky color: <span className="text-gold-200">{dayColor}</span></p>
        </div>
      </div>

      {info && (
        <div className="glass-card-bright p-6 space-y-4">
          <h2 className="font-sora font-bold text-lg text-center gold-text capitalize">{sign} — Lucky Colors</h2>
          <div className="grid grid-cols-2 gap-3">
            <ColorCard label="Primary Lucky Color" value={info.primary} />
            <ColorCard label="Secondary Color" value={info.secondary} />
            <ColorCard label="Color to Avoid" value={info.avoid} />
            <ColorCard label="Lucky Gemstone" value={info.gem} />
            <ColorCard label="Lucky Metal" value={info.metal} />
            <ColorCard label="Today's Color" value={dayColor.split("/")[0]} />
          </div>
          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-3 justify-center">
            <Link href={`/horoscope/${sign}`} className="gold-btn text-sm px-6 py-2">Today&apos;s Horoscope</Link>
            <Link href="/calculator/lucky-number" className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">Lucky Number</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-lg p-3 text-center">
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-white mt-1 flex items-center justify-center gap-1">
        <Palette className="w-3 h-3 text-gold-400" />{value}
      </div>
    </div>
  );
}
