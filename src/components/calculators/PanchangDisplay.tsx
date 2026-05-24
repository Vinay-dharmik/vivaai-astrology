"use client";

import { useState } from "react";
import { calculatePanchang, type PanchangData } from "@/lib/astrology/panchang";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PanchangDisplay() {
  const [date, setDate] = useState(new Date());
  const data = calculatePanchang(date);

  const shift = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  };

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => shift(-1)} className="glass-card p-2 hover:bg-gold-400/10 transition"><ChevronLeft className="w-5 h-5 text-gold-400" /></button>
        <input type="date" value={date.toISOString().split("T")[0]} onChange={(e) => setDate(new Date(e.target.value))}
          className="form-select text-center text-sm" />
        <button onClick={() => shift(1)} className="glass-card p-2 hover:bg-gold-400/10 transition"><ChevronRight className="w-5 h-5 text-gold-400" /></button>
      </div>

      {/* Main grid */}
      <div className="glass-card-bright p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="font-sora font-bold text-xl gold-text">{data.date}</h2>
          <p className="text-sm text-[var(--text-muted)]">{data.hinduMonth} Month</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <Fact label="Vara (Day)" value={data.vara} />
          <Fact label="Tithi" value={data.tithi} />
          <Fact label="Paksha" value={data.paksha} />
          <Fact label="Nakshatra" value={data.nakshatra} />
          <Fact label="Yoga" value={data.yoga} />
          <Fact label="Karana" value={data.karana} />
          <Fact label="Moon Sign" value={data.moonSign} />
          <Fact label="Sunrise" value={data.sunrise} />
          <Fact label="Sunset" value={data.sunset} />
          <Fact label="Rahu Kalam" value={data.rahu} highlight />
        </div>

        {/* Auspicious/Inauspicious */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs text-mystic-green uppercase tracking-wider font-semibold mb-2">✦ Auspicious</h3>
            {data.auspicious.map((a, i) => (
              <p key={i} className="text-sm text-[var(--text-secondary)] mb-1 flex gap-2">
                <span className="text-mystic-green">✓</span>{a}
              </p>
            ))}
          </div>
          <div>
            <h3 className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-2">⚠ Inauspicious</h3>
            {data.inauspicious.map((a, i) => (
              <p key={i} className="text-sm text-[var(--text-secondary)] mb-1 flex gap-2">
                <span className="text-red-400">•</span>{a}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-xl p-3 text-center ${highlight ? "border-red-400/30 bg-red-400/5" : "border-[var(--border)] bg-[rgba(8,6,14,0.5)]"}`}>
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xs font-semibold ${highlight ? "text-red-400" : "text-white"}`}>{value}</div>
    </div>
  );
}
