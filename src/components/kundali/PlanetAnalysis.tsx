"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { KundaliData } from "./KundaliForm";
import { sarvaVerdict } from "@/lib/astrology/ashtakavarga";

const SIGN_SHORT = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis",
];

const PLANET_GLYPH: Record<string, string> = {
  Sun: "☉", Moon: "☾", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

// ── Per-planet written analysis ───────────────────────────

export function PlanetAnalysis({ data }: { data: KundaliData }) {
  const [open, setOpen] = useState<string | null>(data.planetReports[0]?.planet ?? null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
        Each planet is assessed against your Ascendant, not in the abstract: which houses
        it rules for you, whether that makes it functionally benefic here, how it scores
        on Shadbala against the minimum Parashara requires, and how many Ashtakavarga
        bindus support the sign it sits in.
      </p>

      {data.planetReports.map((r) => {
        const isOpen = open === r.planet;
        return (
          <div
            key={r.planet}
            className="rounded-xl border border-[var(--border)] bg-white/[0.02] overflow-hidden"
          >
            <button
              onClick={() => setOpen(isOpen ? null : r.planet)}
              className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-white/[0.03] transition"
            >
              <span className="text-lg text-gold-400 w-6 text-center shrink-0" aria-hidden>
                {PLANET_GLYPH[r.planet]}
              </span>

              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-white">
                  {r.planet}
                  <span className="font-normal text-[var(--text-muted)]"> · {r.placement}</span>
                </span>
                <span className="block text-[0.68rem] text-[var(--text-secondary)] mt-0.5 truncate">
                  {r.headline}
                </span>
              </span>

              <StrengthPip score={r.score} />

              <ChevronDown
                className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="px-3.5 pb-4 pt-1 space-y-3 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {r.significations}
                </p>

                <NatureBadge nature={r.rulership.nature} />

                {r.strengths.length > 0 && (
                  <Block title="Strengths" tone="good" items={r.strengths} />
                )}
                {r.weaknesses.length > 0 && (
                  <Block title="Weaknesses" tone="bad" items={r.weaknesses} />
                )}
                {r.effects.length > 0 && (
                  <Block title="How it acts in your chart" tone="neutral" items={r.effects} />
                )}

                <div className="rounded-lg bg-white/[0.03] p-3">
                  <div className="text-[0.62rem] uppercase tracking-wider text-gold-200 font-semibold mb-1">
                    Timing
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{r.timing}</p>
                </div>

                <div className="rounded-lg border-l-2 border-gold-400/50 bg-gold-400/[0.04] pl-3 py-2.5">
                  <div className="text-[0.62rem] uppercase tracking-wider text-gold-200 font-semibold mb-1">
                    Strengthening it
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{r.remedy}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StrengthPip({ score }: { score: number }) {
  const tone = score >= 110 ? "#7fd6a2" : score >= 90 ? "#ffb347" : "#ff7a7a";
  return (
    <span className="hidden sm:flex items-center gap-2 shrink-0 w-24">
      <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <span
          className="block h-full rounded-full"
          style={{ width: `${Math.min(100, score)}%`, background: tone }}
        />
      </span>
      <span className="text-[0.6rem] tabular-nums" style={{ color: tone }}>
        {score}
      </span>
    </span>
  );
}

function NatureBadge({ nature }: { nature: string }) {
  const style =
    nature === "Yogakaraka"
      ? "bg-mystic-green/15 text-mystic-green border-mystic-green/40"
      : nature === "Functional malefic"
      ? "bg-red-400/10 text-red-400 border-red-400/30"
      : nature === "Functional benefic"
      ? "bg-gold-400/10 text-gold-400 border-gold-400/30"
      : "bg-white/5 text-[var(--text-muted)] border-white/10";
  return (
    <span className={`inline-block text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style}`}>
      {nature}
    </span>
  );
}

function Block({ title, tone, items }: { title: string; tone: "good" | "bad" | "neutral"; items: string[] }) {
  const mark = tone === "good" ? "✦" : tone === "bad" ? "▲" : "•";
  const color = tone === "good" ? "text-mystic-green" : tone === "bad" ? "text-red-400" : "text-gold-400";
  return (
    <div>
      <div className="text-[0.62rem] uppercase tracking-wider text-gold-200 font-semibold mb-1.5">
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed flex gap-2">
            <span className={`${color} shrink-0`}>{mark}</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Shadbala table ────────────────────────────────────────

export function ShadbalaTable({ data }: { data: KundaliData }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
        Shadbala measures a planet in six ways and adds them up. Parashara sets a required
        minimum for each planet; the ratio to that minimum matters more than the raw total.
        A planet below 100% still signifies its matters but struggles to deliver them on
        its own schedule.
      </p>

      <div className="space-y-1.5 mb-3">
        {[...data.shadbala].sort((a, b) => b.ratio - a.ratio).map((s) => {
          const pct = Math.round(s.ratio * 100);
          const tone = pct >= 110 ? "#7fd6a2" : pct >= 90 ? "#ffb347" : "#ff7a7a";
          return (
            <div key={s.planet} className="flex items-center gap-3 text-xs">
              <span className="w-16 shrink-0 text-white font-medium">{s.planet}</span>
              <span className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden relative">
                <span
                  className="block h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (pct / 160) * 100)}%`, background: tone }}
                />
                {/* The 100%-of-required mark. */}
                <span
                  className="absolute top-0 bottom-0 w-px bg-white/40"
                  style={{ left: `${(100 / 160) * 100}%` }}
                />
              </span>
              <span className="w-14 text-right tabular-nums text-[var(--text-secondary)]">
                {s.totalRupas.toFixed(2)}
              </span>
              <span className="w-11 text-right tabular-nums font-semibold" style={{ color: tone }}>
                {pct}%
              </span>
              <span className="hidden sm:block w-24 text-right text-[0.65rem] text-[var(--text-muted)]">
                {s.verdict}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[0.65rem] text-[var(--text-muted)] mb-3">
        Values in Rupas. The white line marks 100% of the required minimum
        (Sun 5, Moon 6, Mars 5, Mercury 7, Jupiter 6.5, Venus 5.5, Saturn 5).
      </p>

      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="text-xs text-gold-400 hover:underline"
      >
        {showBreakdown ? "Hide" : "Show"} the six components
      </button>

      {showBreakdown && (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-gold-400/20">
                {["Planet", "Sthana", "Dig", "Kala", "Cheshta", "Naisargika", "Drik", "Total"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 text-gold-200 font-medium uppercase text-[0.6rem]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.shadbala.map((s) => (
                <tr key={s.planet} className="border-b border-[var(--border)]">
                  <td className="py-1.5 px-2 text-white font-medium">{s.planet}</td>
                  <td className="py-1.5 px-2 text-[var(--text-secondary)] tabular-nums">{s.breakdown.sthanaTotal.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-[var(--text-secondary)] tabular-nums">{s.breakdown.dig.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-[var(--text-secondary)] tabular-nums">{s.breakdown.kalaTotal.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-[var(--text-secondary)] tabular-nums">{s.breakdown.cheshta.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-[var(--text-secondary)] tabular-nums">{s.breakdown.naisargika.toFixed(1)}</td>
                  <td className="py-1.5 px-2 tabular-nums" style={{ color: s.breakdown.drik >= 0 ? "#7fd6a2" : "#ff7a7a" }}>
                    {s.breakdown.drik >= 0 ? "+" : ""}{s.breakdown.drik.toFixed(1)}
                  </td>
                  <td className="py-1.5 px-2 text-white font-semibold tabular-nums">{s.totalVirupas.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[0.62rem] text-[var(--text-muted)] mt-2 whitespace-normal">
            Figures in Virupas (60 Virupas = 1 Rupa). Kala Bala here covers Nathonnatha,
            Paksha, Ayana, Vara and Hora. Abda, Masa and Tribhaga Bala are omitted because
            they depend on regional calendar conventions, and filling them in with a guess
            would make the total look more authoritative than it is.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Ashtakavarga ──────────────────────────────────────────

export function AshtakavargaTable({ data }: { data: KundaliData }) {
  const { ashtakavarga: av, lagnaSignIndex } = data;
  const max = Math.max(...av.sarvaBySign);

  return (
    <div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
        Ashtakavarga scores every sign by how much support it receives from the whole
        chart rather than from whatever happens to sit in it. The seven individual charts
        sum to {av.sarvaTotal} bindus — the classical check figure is 337 — and a sign's
        Sarvashtakavarga total tells you whether that area of life is well supplied.
        Average is 28.
      </p>

      {/* Sarvashtakavarga per house */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
        {Array.from({ length: 12 }, (_, i) => {
          const house = i + 1;
          const sign = (lagnaSignIndex + i) % 12;
          const bindus = av.sarvaBySign[sign];
          const v = sarvaVerdict(bindus);
          const color = v.tone === "good" ? "#7fd6a2" : v.tone === "mixed" ? "#ffb347" : "#ff7a7a";
          return (
            <div key={house} className="rounded-lg border border-[var(--border)] bg-white/[0.02] p-2.5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[0.6rem] uppercase tracking-wider text-[var(--text-muted)]">
                  H{house} · {SIGN_SHORT[sign]}
                </span>
                <span className="text-sm font-bold tabular-nums" style={{ color }}>
                  {bindus}
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(bindus / max) * 100}%`, background: color }}
                />
              </div>
              <div className="text-[0.58rem] mt-1" style={{ color }}>{v.label}</div>
            </div>
          );
        })}
      </div>

      {/* Bhinnashtakavarga grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-gold-400/20">
              <th className="text-left py-2 px-2 text-gold-200 font-medium uppercase text-[0.6rem]">Planet</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="text-center py-2 px-1 text-gold-200 font-medium text-[0.6rem]">
                  {SIGN_SHORT[(lagnaSignIndex + i) % 12]}
                </th>
              ))}
              <th className="text-right py-2 px-2 text-gold-200 font-medium uppercase text-[0.6rem]">Total</th>
            </tr>
          </thead>
          <tbody>
            {av.bhinna.map((b) => (
              <tr key={b.planet} className="border-b border-[var(--border)]">
                <td className="py-1.5 px-2 text-white font-medium">{b.planet}</td>
                {Array.from({ length: 12 }, (_, i) => {
                  const val = b.bindusBySign[(lagnaSignIndex + i) % 12];
                  return (
                    <td
                      key={i}
                      className="text-center py-1.5 px-1 tabular-nums"
                      style={{ color: val >= 5 ? "#7fd6a2" : val <= 2 ? "#ff7a7a" : "var(--text-secondary)" }}
                    >
                      {val}
                    </td>
                  );
                })}
                <td className="text-right py-1.5 px-2 text-[var(--text-muted)] tabular-nums">{b.total}</td>
              </tr>
            ))}
            <tr className="border-t border-gold-400/30">
              <td className="py-2 px-2 text-gold-200 font-semibold uppercase text-[0.6rem]">Sarva</td>
              {Array.from({ length: 12 }, (_, i) => {
                const val = av.sarvaBySign[(lagnaSignIndex + i) % 12];
                return (
                  <td key={i} className="text-center py-2 px-1 font-bold tabular-nums text-white">
                    {val}
                  </td>
                );
              })}
              <td className="text-right py-2 px-2 text-white font-bold tabular-nums">{av.sarvaTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[0.65rem] text-[var(--text-muted)] mt-3 leading-relaxed">
        Columns run in house order from your Ascendant. In a planet&apos;s own row, 5 or more
        bindus in the sign it occupies means it can act freely there; 2 or fewer means it is
        obstructed. Transits through high-bindu signs tend to go well, and through low-bindu
        signs to cost more than they return.
      </p>
    </div>
  );
}
