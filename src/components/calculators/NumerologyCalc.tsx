"use client";

import { useState } from "react";
import { Hash } from "lucide-react";
import { calculateNumerology, type NumerologyResult } from "@/lib/astrology/numerology";

export function NumerologyCalc() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const calc = () => {
    if (!name || !dob) return;
    setResult(calculateNumerology(name, dob));
  };

  return (
    <>
      <div className="glass-card p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="form-select w-full" />
          </div>
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="form-select w-full" />
          </div>
        </div>
        <button onClick={calc} className="gold-btn w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2">
          <Hash className="w-5 h-5" /> Calculate Numerology
        </button>
      </div>

      {result && (
        <div className="glass-card-bright p-6 mt-6 space-y-5">
          <div className="text-center">
            <div className="text-5xl font-bold gold-text mb-1">{result.lifePath}</div>
            <div className="text-sm text-gold-200">Life Path Number</div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-white/[0.03] border-l-4 border-mystic-green pl-4 py-3 rounded-r-lg">
            {result.lifePathMeaning}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NumCard label="Expression" value={result.expression} />
            <NumCard label="Soul Urge" value={result.soulUrge} />
            <NumCard label="Personality" value={result.personality} />
            <NumCard label="Birthday" value={result.birthday} />
          </div>

          <p className="text-sm text-[var(--text-muted)]">
            <strong className="text-gold-200">Expression:</strong> {result.expressionMeaning}
          </p>
        </div>
      )}
    </>
  );
}

function NumCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-xl p-3 text-center">
      <div className="text-2xl font-bold gold-text">{value}</div>
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
