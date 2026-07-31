"use client";

import { useState } from "react";

interface HouseInfo {
  house: number;
  sign: string;
  signEnglish: string;
  lord: string;
  planets: string[];
}

interface KundaliChartProps {
  houses: HouseInfo[];
  lagnaSignIndex: number; // 0-indexed (0=Aries, 1=Taurus...)
}

export function KundaliChart({ houses, lagnaSignIndex }: KundaliChartProps) {
  const [style, setStyle] = useState<"north" | "south">("north");

  // Map house numbers to house data
  const houseMap: Record<number, HouseInfo> = {};
  for (const h of houses) {
    houseMap[h.house] = h;
  }

  return (
    <div className="bg-[#0b0c16] border border-gold-400/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
      {/* Header with Style Switcher */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold gold-text uppercase tracking-wider">
            {style === "north" ? "North Indian (Lagna Chart)" : "South Indian (Rashi Chart)"}
          </h3>
          <p className="text-[0.65rem] text-[var(--text-muted)]">
            {style === "north" ? "House 1 (Top Center) = Lagna" : "Fixed Sign Layout"}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setStyle("north")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
              style === "north" ? "bg-gold-400 text-black shadow-glow" : "text-gray-400 hover:text-white"
            }`}
          >
            North Indian
          </button>
          <button
            onClick={() => setStyle("south")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
              style === "south" ? "bg-gold-400 text-black shadow-glow" : "text-gray-400 hover:text-white"
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="max-w-[420px] mx-auto aspect-square relative">
        {style === "north" ? (
          <NorthIndianSvg houseMap={houseMap} lagnaSignIndex={lagnaSignIndex} />
        ) : (
          <SouthIndianSvg houseMap={houseMap} lagnaSignIndex={lagnaSignIndex} />
        )}
      </div>
    </div>
  );
}

// ── North Indian Diamond Chart (SVG) ──────────────────────────────

function NorthIndianSvg({
  houseMap,
  lagnaSignIndex,
}: {
  houseMap: Record<number, HouseInfo>;
  lagnaSignIndex: number;
}) {
  // Coordinates for house label centers and planet list positions in 300x300 canvas
  const housePositions: Record<number, { signX: number; signY: number; planetsX: number; planetsY: number }> = {
    1:  { signX: 150, signY: 105, planetsX: 150, planetsY: 70 },
    2:  { signX: 75,  signY: 35,  planetsX: 65,  planetsY: 60 },
    3:  { signX: 35,  signY: 75,  planetsX: 60,  planetsY: 110 },
    4:  { signX: 105, signY: 150, planetsX: 70,  planetsY: 150 },
    5:  { signX: 35,  signY: 225, planetsX: 60,  planetsY: 190 },
    6:  { signX: 75,  signY: 265, planetsX: 65,  planetsY: 240 },
    7:  { signX: 150, signY: 195, planetsX: 150, planetsY: 230 },
    8:  { signX: 225, signY: 265, planetsX: 235, planetsY: 240 },
    9:  { signX: 265, signY: 225, planetsX: 240, planetsY: 190 },
    10: { signX: 195, signY: 150, planetsX: 230, planetsY: 150 },
    11: { signX: 265, signY: 75,  planetsX: 240, planetsY: 110 },
    12: { signX: 225, signY: 35,  planetsX: 235, planetsY: 60 },
  };

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,179,71,0.15)]">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="100%" stopColor="#ffcc00" />
        </linearGradient>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#121324" />
          <stop offset="100%" stopColor="#0a0b15" />
        </linearGradient>
      </defs>

      {/* Background Square */}
      <rect x="5" y="5" width="290" height="290" fill="url(#bgGradient)" rx="10" stroke="#ffb347" strokeWidth="2" />

      {/* Main Outer Box */}
      <rect x="10" y="10" width="280" height="280" fill="none" stroke="#ffb347" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Diagonals */}
      <line x1="10" y1="10" x2="290" y2="290" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="290" y1="10" x2="10" y2="290" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.6" />

      {/* Central Diamond */}
      <polygon points="150,10 290,150 150,290 10,150" fill="none" stroke="#ffb347" strokeWidth="1.5" strokeOpacity="0.9" />

      {/* Houses Data */}
      {Object.entries(housePositions).map(([houseStr, pos]) => {
        const hNo = Number(houseStr);
        const hData = houseMap[hNo];
        if (!hData) return null;

        // Sign index in Whole Sign (1-indexed zodiac sign number: 1=Aries ... 12=Pisces)
        const signNum = ((lagnaSignIndex + hNo - 1) % 12) + 1;
        const planets = hData.planets || [];

        return (
          <g key={hNo}>
            {/* Sign Number */}
            <text
              x={pos.signX}
              y={pos.signY}
              fill="#ffb347"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
              opacity="0.9"
            >
              {signNum}
            </text>

            {/* Planets */}
            {planets.length > 0 && (
              <text
                x={pos.planetsX}
                y={pos.planetsY}
                fill="#50c878"
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {planets.map((p) => shortBody(p)).join(", ")}
              </text>
            )}
          </g>
        );
      })}

      {/* Lagna Badge in House 1 */}
      <text x="150" y="42" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
        LAGNA
      </text>
    </svg>
  );
}

// ── South Indian Grid Chart (SVG) ──────────────────────────────

function SouthIndianSvg({
  houseMap,
  lagnaSignIndex,
}: {
  houseMap: Record<number, HouseInfo>;
  lagnaSignIndex: number;
}) {
  // South Indian chart has 12 fixed sign locations in a 4x4 grid:
  // Top row: Pisces (12), Aries (1), Taurus (2), Gemini (3)
  // Right col: Cancer (4), Leo (5), Virgo (6)
  // Bottom row: Libra (7), Scorpio (8), Sagittarius (9), Capricorn (10)
  // Left col: Aquarius (11)

  const signGridPos: Record<number, { col: number; row: number }> = {
    12: { col: 0, row: 0 },
    1:  { col: 1, row: 0 },
    2:  { col: 2, row: 0 },
    3:  { col: 3, row: 0 },
    4:  { col: 3, row: 1 },
    5:  { col: 3, row: 2 },
    6:  { col: 3, row: 3 },
    7:  { col: 2, row: 3 },
    8:  { col: 1, row: 3 },
    9:  { col: 0, row: 3 },
    10: { col: 0, row: 2 },
    11: { col: 0, row: 1 },
  };

  const SIGN_NAMES = [
    "Mesha", "Vrish", "Mith", "Kark", "Simh", "Kanya",
    "Tula", "Vris", "Dhan", "Makar", "Kumbh", "Meen",
  ];

  // Map each sign number (1..12) to planets inside it
  const signPlanets: Record<number, { planets: string[]; isLagna: boolean; houseNo: number }> = {};
  for (let s = 1; s <= 12; s++) {
    signPlanets[s] = { planets: [], isLagna: false, houseNo: 0 };
  }

  for (const h of Object.values(houseMap)) {
    const sNum = ((lagnaSignIndex + h.house - 1) % 12) + 1;
    signPlanets[sNum] = {
      planets: h.planets || [],
      isLagna: h.house === 1,
      houseNo: h.house,
    };
  }

  const cellSize = 72;
  const padding = 6;

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,179,71,0.15)]">
      {/* Background */}
      <rect x="5" y="5" width="290" height="290" fill="#0c0d1a" rx="10" stroke="#ffb347" strokeWidth="2" />

      {/* Grid Lines */}
      {/* Outer Border */}
      <rect x="6" y="6" width="288" height="288" fill="none" stroke="#ffb347" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* 4x4 Grid lines */}
      <line x1="78" y1="6" x2="78" y2="294" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="150" y1="6" x2="150" y2="294" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="222" y1="6" x2="222" y2="294" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />

      <line x1="6" y1="78" x2="294" y2="78" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="6" y1="150" x2="294" y2="150" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="6" y1="222" x2="294" y2="222" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.5" />

      {/* Center 2x2 Empty Box Filled with Logo */}
      <rect x="78" y="78" width="144" height="144" fill="#141528" stroke="#ffb347" strokeWidth="1" strokeOpacity="0.4" />
      <text x="150" y="140" fill="#ffb347" fontSize="14" fontWeight="bold" textAnchor="middle">
        VivaAI
      </text>
      <text x="150" y="160" fill="#a0a0b4" fontSize="9" textAnchor="middle">
        Vedic Birth Chart
      </text>

      {/* Render 12 Sign Boxes */}
      {Object.entries(signGridPos).map(([signStr, pos]) => {
        const sNum = Number(signStr);
        const cellX = padding + pos.col * cellSize;
        const cellY = padding + pos.row * cellSize;
        const info = signPlanets[sNum];

        return (
          <g key={sNum}>
            {/* Sign Title */}
            <text x={cellX + 6} y={cellY + 14} fill="#ffb347" fontSize="9" fontWeight="bold" opacity="0.8">
              {SIGN_NAMES[sNum - 1]} ({sNum})
            </text>

            {/* Ascendant Marker */}
            {info.isLagna && (
              <g>
                <line x1={cellX + 2} y1={cellY + 2} x2={cellX + 22} y2={cellY + 22} stroke="#ff3366" strokeWidth="2" />
                <text x={cellX + 24} y={cellY + 14} fill="#ff3366" fontSize="8" fontWeight="bold">
                  ASC
                </text>
              </g>
            )}

            {/* Planets in Sign */}
            {info.planets.length > 0 && (
              <text x={cellX + 6} y={cellY + 36} fill="#50c878" fontSize="9" fontWeight="600">
                {info.planets.map((p) => shortBody(p)).join(", ")}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function shortBody(body: string): string {
  const map: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
    Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
  };
  return map[body] || body.substring(0, 2);
}
