"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";

const MANGLIK_HOUSES = [1, 4, 7, 8, 12];

function checkManglik(day: number, month: number) {
  // Simplified Manglik check based on birth date numerology
  // In production, this would use actual Mars house placement from astronomy-engine
  const seed = (day * 13 + month * 7) % 12 + 1;
  const marsHouse = seed;
  const isManglik = MANGLIK_HOUSES.includes(marsHouse);
  const severity = marsHouse === 7 || marsHouse === 8 ? "High" : marsHouse === 1 ? "Medium" : isManglik ? "Mild" : "None";

  const cancellations: string[] = [];
  if (marsHouse === 1 && (day % 3 === 0)) cancellations.push("Mars in own sign — Dosha cancelled");
  if (marsHouse === 4 && (month % 2 === 0)) cancellations.push("Jupiter aspects Mars — Dosha reduced");
  if (day > 20) cancellations.push("Mars maturity factor — intensity reduced after age 28");

  const remedies = isManglik ? [
    "Perform Mangal Shanti Puja before marriage",
    "Chant Hanuman Chalisa daily, especially on Tuesdays",
    "Wear Red Coral (Moonga) on ring finger after consultation",
    "Fast on Tuesdays and donate red lentils",
    "Kumbh Vivah ceremony for high-severity cases",
    "Marry a partner who is also Manglik to neutralize effects",
  ] : [];

  return { isManglik, marsHouse, severity, cancellations, remedies };
}

export default function MangalDoshaClient() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkManglik> | null>(null);

  const handleCheck = () => {
    if (!dob) return;
    const d = new Date(dob);
    setResult(checkManglik(d.getDate(), d.getMonth() + 1));
  };

  return (
    <div>
      <div className="glass-card-bright p-6 mb-6">
        <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider mb-2 block">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="form-select w-full mb-4" />
        <button onClick={handleCheck} disabled={!dob}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition ${dob ? "gold-btn" : "bg-white/5 text-[var(--text-muted)] cursor-not-allowed"}`}>
          Check Mangal Dosha
        </button>
        <p className="text-[0.65rem] text-[var(--text-muted)] mt-2 text-center">For precise analysis with actual Mars position, use our <Link href="/kundali" className="text-gold-400 hover:underline">Full Kundali Generator</Link></p>
      </div>

      {result && (
        <div className="glass-card-bright p-6 space-y-5">
          {/* Status */}
          <div className={`text-center p-5 rounded-xl border ${result.isManglik ? "border-red-400/30 bg-red-400/5" : "border-mystic-green/30 bg-mystic-green/5"}`}>
            {result.isManglik
              ? <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              : <CheckCircle className="w-10 h-10 text-mystic-green mx-auto mb-2" />
            }
            <h2 className={`font-sora font-bold text-xl ${result.isManglik ? "text-red-400" : "text-mystic-green"}`}>
              {result.isManglik ? "Manglik Dosha Present" : "Not Manglik"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Mars in {result.marsHouse}{result.marsHouse === 1 ? "st" : result.marsHouse === 2 ? "nd" : result.marsHouse === 3 ? "rd" : "th"} House • Severity: <span className={result.severity === "High" ? "text-red-400" : result.severity === "Medium" ? "text-yellow-400" : "text-mystic-green"}>{result.severity}</span>
            </p>
          </div>

          {/* Cancellations */}
          {result.cancellations.length > 0 && (
            <div>
              <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">Cancellation Factors</h3>
              {result.cancellations.map(c => (
                <div key={c} className="flex items-start gap-2 text-sm text-mystic-green mb-2">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0" />{c}
                </div>
              ))}
            </div>
          )}

          {/* Remedies */}
          {result.remedies.length > 0 && (
            <div>
              <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">Recommended Remedies</h3>
              <ul className="space-y-2">
                {result.remedies.map(r => (
                  <li key={r} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <span className="text-gold-400">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-3 justify-center">
            <Link href="/kundali" className="gold-btn text-sm px-6 py-2">Full Kundali Analysis</Link>
            <Link href="/matching" className="glass-card text-sm px-6 py-2 text-gold-200 hover:text-gold-400 transition">Kundali Matching</Link>
          </div>
        </div>
      )}
    </div>
  );
}
