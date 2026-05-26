"use client";

import { useState } from "react";
import { Sparkles, Star } from "lucide-react";
import Link from "next/link";

const COLORS = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet", "White", "Gold", "Silver"];
const DIRECTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const ELEMENTS = ["Fire", "Earth", "Air", "Water"];

function computeLucky(dob: string) {
  const d = new Date(dob);
  const today = new Date();
  const birthNum = d.getDate() % 9 || 9;
  const dayNum = today.getDate() % 9 || 9;
  const monthNum = (today.getMonth() + 1) % 9 || 9;
  const seed = (birthNum * 7 + dayNum * 3 + monthNum * 5 + today.getFullYear()) % 100;

  return {
    luckyNumber: (seed % 9) + 1,
    luckyColor: COLORS[seed % COLORS.length],
    luckyDirection: DIRECTIONS[seed % DIRECTIONS.length],
    luckyElement: ELEMENTS[seed % ELEMENTS.length],
    luckyTime: `${9 + (seed % 8)}:00 - ${10 + (seed % 8)}:00`,
    intensity: 60 + (seed % 35),
    birthNumber: birthNum,
  };
}

export default function LuckyNumberClient() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<ReturnType<typeof computeLucky> | null>(null);

  return (
    <div>
      <div className="glass-card-bright p-6 mb-6">
        <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
          className="form-select w-full mb-4" />
        <button onClick={() => dob && setResult(computeLucky(dob))}
          disabled={!dob}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition ${dob ? "gold-btn" : "bg-white/5 text-[var(--text-muted)] cursor-not-allowed"}`}>
          <Sparkles className="w-4 h-4 inline mr-2" />Find My Lucky Number Today
        </button>
      </div>

      {result && (
        <div className="glass-card-bright p-6 space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold gold-text font-sora mb-2">{result.luckyNumber}</div>
            <p className="text-sm text-[var(--text-muted)]">Your Lucky Number Today</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Birth Number" value={String(result.birthNumber)} />
            <InfoCard label="Lucky Color" value={result.luckyColor} />
            <InfoCard label="Lucky Direction" value={result.luckyDirection} />
            <InfoCard label="Lucky Element" value={result.luckyElement} />
            <InfoCard label="Best Time" value={result.luckyTime} />
            <InfoCard label="Cosmic Energy" value={`${result.intensity}%`} />
          </div>
          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-3 justify-center">
            <Link href="/kundali" className="gold-btn text-sm px-6 py-2">Get Full Kundali</Link>
            <Link href="/calculator/numerology" className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">Numerology Calculator</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-lg p-3 text-center">
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-white mt-1 flex items-center justify-center gap-1">
        <Star className="w-3 h-3 text-gold-400" />{value}
      </div>
    </div>
  );
}
