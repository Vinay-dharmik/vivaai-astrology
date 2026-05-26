"use client";

import { useState } from "react";
import { Heart, Calendar, Star } from "lucide-react";
import Link from "next/link";

function predictMarriageAge(dob: string, gender: string) {
  const d = new Date(dob);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const seed = (day * 7 + month * 13 + year) % 100;

  // Base age range depends on gender and numerological factors
  const baseAge = gender === "female" ? 22 : 24;
  const variation = (seed % 8);
  const earlyAge = baseAge + variation;
  const lateAge = earlyAge + 3;

  const venusStrength = (seed % 10) > 4 ? "Strong" : "Moderate";
  const seventhHouseLord = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"][seed % 9];
  const marriageDasha = ["Jupiter","Venus","Mercury","Moon","Sun"][seed % 5];
  const favorableYear = year + earlyAge - (year - d.getFullYear() > 0 ? year - d.getFullYear() : 0);

  const factors = [
    `7th house lord (${seventhHouseLord}) influences marriage timing`,
    `Venus strength is ${venusStrength} — ${venusStrength === "Strong" ? "favors timely marriage" : "may cause slight delays"}`,
    `${marriageDasha} Dasha period most favorable for marriage`,
    variation < 3 ? "Early marriage indicators present in chart" : "Chart suggests marriage after career stability",
  ];

  const remedies = [
    "Worship Lord Shiva and Goddess Parvati for timely marriage",
    "Chant Venus (Shukra) Beej Mantra on Fridays",
    "Wear Diamond or White Sapphire after astrological consultation",
    "Fast on Fridays and offer white flowers to Goddess Lakshmi",
    "Donate white items on Fridays — rice, sugar, white clothes",
  ];

  return { earlyAge, lateAge, venusStrength, seventhHouseLord, marriageDasha, factors, remedies, favorableYear };
}

export default function MarriageAgeClient() {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<ReturnType<typeof predictMarriageAge> | null>(null);

  const canSubmit = dob && gender;

  return (
    <div>
      <div className="glass-card-bright p-6 mb-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="form-select w-full" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select w-full">
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button onClick={() => canSubmit && setResult(predictMarriageAge(dob, gender))}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${canSubmit ? "gold-btn" : "bg-white/5 text-[var(--text-muted)] cursor-not-allowed"}`}>
          <Heart className="w-4 h-4" /> Predict Marriage Age
        </button>
        <p className="text-[0.65rem] text-[var(--text-muted)] text-center">For precise predictions with actual planetary positions, use our <Link href="/kundali" className="text-gold-400 hover:underline">Full Kundali Generator</Link></p>
      </div>

      {result && (
        <div className="glass-card-bright p-6 space-y-5">
          <div className="text-center p-5 rounded-xl border border-gold-400/30 bg-gold-400/5">
            <Calendar className="w-8 h-8 text-gold-400 mx-auto mb-2" />
            <p className="text-xs text-[var(--text-muted)] mb-1">Estimated Marriage Age Range</p>
            <h2 className="font-sora font-bold text-3xl gold-text">{result.earlyAge} — {result.lateAge} years</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniCard label="Venus Strength" value={result.venusStrength} />
            <MiniCard label="7th House Lord" value={result.seventhHouseLord} />
            <MiniCard label="Best Dasha" value={result.marriageDasha} />
            <MiniCard label="Favorable Year" value={String(result.favorableYear)} />
          </div>

          <div>
            <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">Key Factors</h3>
            <ul className="space-y-2">
              {result.factors.map(f => (
                <li key={f} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                  <Star className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">Remedies for Timely Marriage</h3>
            <ul className="space-y-2">
              {result.remedies.map(r => (
                <li key={r} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                  <span className="text-gold-400">•</span>{r}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-3 justify-center">
            <Link href="/kundali" className="gold-btn text-sm px-6 py-2">Full Kundali Analysis</Link>
            <Link href="/matching" className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">Kundali Matching</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(8,6,14,0.5)] border border-[var(--border)] rounded-lg p-3 text-center">
      <div className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-white mt-1">{value}</div>
    </div>
  );
}
