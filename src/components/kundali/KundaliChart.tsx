"use client";

import { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import {
  northIndianCells,
  northIndianFrame,
  southIndianCells,
  fitTokens,
  type HouseCell,
  type Pt,
} from "@/lib/astrology/chartGeometry";

// ── Types ─────────────────────────────────────────────────

export interface ChartPlanet {
  body: string;
  /** Sign index 0–11 *within this divisional chart*. */
  signIndex: number;
  /** Degrees within that sign, 0–30. Omitted for vargas where it has no meaning. */
  signDegree?: number;
  isRetrograde?: boolean;
  isCombust?: boolean;
  dignity?: string;
  nakshatra?: string;
  nakshatraPada?: number;
}

export interface ChartVariant {
  key: string;
  label: string;
  /** One line explaining what the chart is for. */
  caption: string;
  /** Sign index rising in this chart. */
  ascSignIndex: number;
  planets: ChartPlanet[];
  /** D9 and the Moon chart have no meaningful degree-in-sign to print. */
  showDegrees?: boolean;
}

// ── Constants ─────────────────────────────────────────────

const SIGN_SHORT = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis",
];

const SIGN_SANSKRIT = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena",
];

const SIGN_LORD = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const BODY_SHORT: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
  Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
};

/** What each house is read for — shown when a house is selected. */
const HOUSE_MEANING: Record<number, string> = {
  1: "Body, temperament, vitality, how you meet the world",
  2: "Accumulated wealth, family line, speech, food",
  3: "Younger siblings, courage, initiative, short journeys",
  4: "Mother, home, land and vehicles, inner contentment, schooling",
  5: "Children, intelligence, past merit, speculation, romance",
  6: "Illness, debt, enemies, litigation, daily service",
  7: "Marriage, business partners, contracts, open opposition",
  8: "Longevity, upheaval, inheritance, the occult, others' money",
  9: "Fortune, dharma, father, teachers, long journeys, higher learning",
  10: "Profession, status, public action, authority",
  11: "Income, gains, elder siblings, networks, fulfilled desires",
  12: "Loss and expenditure, foreign lands, seclusion, liberation",
};

const CHART_SIZE = 400;
const CHART_PAD = 14;

const COLORS = {
  gold: "#ffb347",
  goldDim: "rgba(255,179,71,0.45)",
  ink: "#0b0c16",
  panel: "#12132399",
  planet: "#e9e4d8",
  benefic: "#7fd6a2",
  retro: "#ff7a7a",
  combust: "#8b8fa3",
  asc: "#ff5f8f",
};

// ── Token building ────────────────────────────────────────

function degToken(deg: number, minutes: boolean): string {
  if (!minutes) return `${Math.floor(deg)}°`;
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return m === 60 ? `${d + 1}°00′` : `${d}°${String(m).padStart(2, "0")}′`;
}

/**
 * Three progressively terser renderings of the same planet list. The fitter
 * walks down this list until something fits the house, so a crowded house
 * loses its minutes before it loses a planet.
 */
function tokenVariants(planets: ChartPlanet[], showDegrees: boolean): string[][] {
  const abbrev = (p: ChartPlanet) => BODY_SHORT[p.body] ?? p.body.slice(0, 2);
  const retro = (p: ChartPlanet) => (p.isRetrograde ? "℞" : "");

  const withMinutes = planets.map(
    (p) => `${abbrev(p)}${retro(p)} ${degToken(p.signDegree ?? 0, true)}`
  );
  const withDegrees = planets.map(
    (p) => `${abbrev(p)}${retro(p)} ${degToken(p.signDegree ?? 0, false)}`
  );
  const bare = planets.map((p) => `${abbrev(p)}${retro(p)}`);

  return showDegrees ? [withMinutes, withDegrees, bare] : [bare];
}

function planetsInSign(planets: ChartPlanet[], signIndex: number): ChartPlanet[] {
  return planets
    .filter((p) => p.signIndex === signIndex)
    .sort((a, b) => (a.signDegree ?? 0) - (b.signDegree ?? 0));
}

/** Colour a token by the state of the planet it names. */
function planetFill(p: ChartPlanet): string {
  if (p.isRetrograde) return COLORS.retro;
  if (p.isCombust) return COLORS.combust;
  if (p.dignity?.startsWith("Exalted") || p.dignity?.startsWith("Own")) return COLORS.benefic;
  return COLORS.planet;
}

// ── Main component ────────────────────────────────────────

export function KundaliChart({ variants }: { variants: ChartVariant[] }) {
  const [style, setStyle] = useState<"north" | "south">("north");
  const [vargaKey, setVargaKey] = useState(variants[0]?.key ?? "");
  const [selected, setSelected] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const varga = variants.find((v) => v.key === vargaKey) ?? variants[0];

  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const scale = 3;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = CHART_SIZE * scale;
      canvas.height = CHART_SIZE * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = COLORS.ink;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.download = `kundali-${style}-${varga.key}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  };

  if (!varga) return null;

  return (
    <div className="bg-[#0b0c16] border border-gold-400/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
      {/* Chart selector */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-sm font-bold gold-text uppercase tracking-wider">
            {varga.label} · {style === "north" ? "North Indian" : "South Indian"}
          </h3>
          <p className="text-[0.65rem] text-[var(--text-muted)] mt-0.5">{varga.caption}</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
          {(["north", "south"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                style === s ? "bg-gold-400 text-black shadow-glow" : "text-gray-400 hover:text-white"
              }`}
            >
              {s === "north" ? "North" : "South"}
            </button>
          ))}
        </div>
      </div>

      {variants.length > 1 && (
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {variants.map((v) => (
            <button
              key={v.key}
              onClick={() => { setVargaKey(v.key); setSelected(null); }}
              className={`px-3 py-1.5 text-[0.7rem] rounded-lg font-semibold border transition ${
                v.key === varga.key
                  ? "border-gold-400/60 bg-gold-400/10 text-gold-200"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/25"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="max-w-[440px] mx-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto select-none"
          role="img"
          aria-label={`${varga.label}, ${style} Indian style`}
        >
          <rect width={CHART_SIZE} height={CHART_SIZE} rx="12" fill={COLORS.ink} />
          {style === "north" ? (
            <NorthChart varga={varga} selected={selected} onSelect={setSelected} />
          ) : (
            <SouthChart varga={varga} selected={selected} onSelect={setSelected} />
          )}
        </svg>
      </div>

      <Legend />

      {selected !== null && <HouseDetail house={selected} varga={varga} onClose={() => setSelected(null)} />}

      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5 flex-wrap">
        <p className="text-[0.65rem] text-[var(--text-muted)]">
          {selected === null ? "Tap any house for its significations." : `Showing house ${selected}.`}
        </p>
        <button
          onClick={downloadPng}
          className="text-xs text-gold-400 hover:text-gold-200 transition inline-flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Save chart as PNG
        </button>
      </div>
    </div>
  );
}

// ── North Indian ──────────────────────────────────────────

function NorthChart({
  varga, selected, onSelect,
}: {
  varga: ChartVariant;
  selected: number | null;
  onSelect: (h: number | null) => void;
}) {
  const cells = useMemo(() => northIndianCells(CHART_SIZE, CHART_PAD), []);
  const frame = useMemo(() => northIndianFrame(CHART_SIZE, CHART_PAD), []);

  return (
    <g>
      <rect {...frame.outer} fill="none" stroke={COLORS.gold} strokeWidth="1.6" />
      {frame.diagonals.map((d, i) => (
        <line key={i} {...d} stroke={COLORS.goldDim} strokeWidth="1" />
      ))}
      <polygon points={frame.diamond} fill="none" stroke={COLORS.gold} strokeWidth="1.3" />

      {cells.map((c) => {
        const houseNo = c.index;
        const signIndex = (varga.ascSignIndex + houseNo - 1) % 12;
        const inSign = planetsInSign(varga.planets, signIndex);
        const isSelected = selected === houseNo;

        return (
          <g
            key={houseNo}
            onClick={() => onSelect(isSelected ? null : houseNo)}
            style={{ cursor: "pointer" }}
          >
            <polygon
              points={c.polygon.map((p) => `${p.x},${p.y}`).join(" ")}
              fill={isSelected ? "rgba(255,179,71,0.12)" : "transparent"}
              stroke={isSelected ? COLORS.gold : "none"}
              strokeWidth="1"
            />

            {/* Rashi number, toward the centre of the diagram */}
            <text
              x={c.signAnchor.x}
              y={c.signAnchor.y}
              fill={COLORS.gold}
              fontSize="10.5"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
              opacity="0.85"
              fontFamily="system-ui, sans-serif"
            >
              {signIndex + 1}
            </text>

            {houseNo === 1 && <AscMark cell={c} />}

            <PlanetStack cell={c} planets={inSign} showDegrees={varga.showDegrees !== false} />
          </g>
        );
      })}
    </g>
  );
}

/** The Ascendant tick in house 1 of a North Indian chart. */
function AscMark({ cell }: { cell: HouseCell }) {
  return (
    <text
      x={cell.centroid.x}
      y={cell.top + 13}
      fill={COLORS.asc}
      fontSize="9"
      fontWeight="700"
      textAnchor="middle"
      fontFamily="system-ui, sans-serif"
    >
      Asc
    </text>
  );
}

/**
 * Draws the planets of one house, fitted to the shape of that house.
 *
 * If nothing fits even at the smallest size the house shows a count instead of
 * overflowing into its neighbours.
 */
function PlanetStack({
  cell, planets, showDegrees, yShift = 0,
}: {
  cell: HouseCell;
  planets: ChartPlanet[];
  showDegrees: boolean;
  yShift?: number;
}) {
  const fitted = useMemo(() => {
    if (planets.length === 0) return null;
    const centre: Pt = { x: cell.centroid.x, y: cell.centroid.y + yShift };
    return fitTokens(cell.polygon, centre, tokenVariants(planets, showDegrees), {
      maxFont: 10,
      minFont: 6,
      padding: 4,
    });
  }, [cell, planets, showDegrees, yShift]);

  if (planets.length === 0) return null;

  if (!fitted) {
    return (
      <text
        x={cell.centroid.x}
        y={cell.centroid.y + yShift}
        fill={COLORS.planet}
        fontSize="9"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="system-ui, sans-serif"
      >
        {planets.length} planets
      </text>
    );
  }

  const { lines, fontSize, lineHeight } = fitted;
  const startY = cell.centroid.y + yShift - ((lines.length - 1) * lineHeight) / 2;

  // Walk the original planet order so each token keeps its own colour.
  let idx = 0;
  return (
    <>
      {lines.map((line, li) => {
        const tokens = line.map(() => planets[idx++]);
        return (
          <text
            key={li}
            x={cell.centroid.x}
            y={startY + li * lineHeight}
            fontSize={fontSize}
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="system-ui, sans-serif"
          >
            {line.map((tok, ti) => (
              <tspan key={ti} fill={planetFill(tokens[ti])}>
                {ti > 0 ? "  " : ""}
                {tok}
              </tspan>
            ))}
          </text>
        );
      })}
    </>
  );
}

// ── South Indian ──────────────────────────────────────────

function SouthChart({
  varga, selected, onSelect,
}: {
  varga: ChartVariant;
  selected: number | null;
  onSelect: (h: number | null) => void;
}) {
  const cells = useMemo(() => southIndianCells(CHART_SIZE, CHART_PAD), []);
  const inner = CHART_SIZE - CHART_PAD * 2;
  const s = inner / 4;

  return (
    <g>
      <rect
        x={CHART_PAD} y={CHART_PAD} width={inner} height={inner}
        fill="none" stroke={COLORS.gold} strokeWidth="1.6"
      />
      {/* The hollow centre */}
      <rect
        x={CHART_PAD + s} y={CHART_PAD + s} width={s * 2} height={s * 2}
        fill="rgba(255,255,255,0.02)" stroke={COLORS.goldDim} strokeWidth="1"
      />
      <text
        x={CHART_SIZE / 2} y={CHART_SIZE / 2 - 6}
        fill={COLORS.gold} fontSize="13" fontWeight="700" textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        {varga.label}
      </text>
      <text
        x={CHART_SIZE / 2} y={CHART_SIZE / 2 + 11}
        fill="#8b8fa3" fontSize="8.5" textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        Asc in {SIGN_SHORT[varga.ascSignIndex]}
      </text>

      {cells.map((c) => {
        const houseNo = ((c.signIndex - varga.ascSignIndex + 12) % 12) + 1;
        const inSign = planetsInSign(varga.planets, c.signIndex);
        const isAsc = houseNo === 1;
        const isSelected = selected === houseNo;

        // Rectangular cell reused through the same fitter as the diamond,
        // so both layouts shrink text by identical rules.
        const poly: Pt[] = [
          { x: c.x, y: c.y + 15 },
          { x: c.x + c.w, y: c.y + 15 },
          { x: c.x + c.w, y: c.y + c.h },
          { x: c.x, y: c.y + c.h },
        ];
        const pseudoCell: HouseCell = {
          index: houseNo,
          polygon: poly,
          centroid: { x: c.x + c.w / 2, y: c.y + 15 + (c.h - 15) / 2 },
          signAnchor: { x: c.x + 5, y: c.y + 9 },
          top: c.y + 15,
          bottom: c.y + c.h,
        };

        return (
          <g key={c.signIndex} onClick={() => onSelect(isSelected ? null : houseNo)} style={{ cursor: "pointer" }}>
            <rect
              x={c.x} y={c.y} width={c.w} height={c.h}
              fill={isSelected ? "rgba(255,179,71,0.12)" : "transparent"}
              stroke={isAsc ? COLORS.asc : COLORS.goldDim}
              strokeWidth={isAsc ? 1.6 : 0.8}
            />
            <text
              x={c.x + 5} y={c.y + 11}
              fill={isAsc ? COLORS.asc : COLORS.gold}
              fontSize="8.5" fontWeight="700" opacity="0.9"
              fontFamily="system-ui, sans-serif"
            >
              {SIGN_SHORT[c.signIndex]}
              <tspan fill="#8b8fa3" fontWeight="400"> · {houseNo}</tspan>
            </text>
            {isAsc && (
              <text
                x={c.x + c.w - 5} y={c.y + 11}
                fill={COLORS.asc} fontSize="8" fontWeight="700" textAnchor="end"
                fontFamily="system-ui, sans-serif"
              >
                Asc
              </text>
            )}
            <PlanetStack cell={pseudoCell} planets={inSign} showDegrees={varga.showDegrees !== false} />
          </g>
        );
      })}
    </g>
  );
}

// ── Legend & detail ───────────────────────────────────────

function Legend() {
  const items = [
    { c: COLORS.planet, l: "Direct" },
    { c: COLORS.retro, l: "Retrograde (℞)" },
    { c: COLORS.combust, l: "Combust" },
    { c: COLORS.benefic, l: "Exalted / own sign" },
  ];
  return (
    <div className="flex items-center justify-center gap-x-4 gap-y-1.5 flex-wrap mt-3">
      {items.map((i) => (
        <span key={i.l} className="inline-flex items-center gap-1.5 text-[0.62rem] text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: i.c }} />
          {i.l}
        </span>
      ))}
    </div>
  );
}

function HouseDetail({
  house, varga, onClose,
}: {
  house: number;
  varga: ChartVariant;
  onClose: () => void;
}) {
  const signIndex = (varga.ascSignIndex + house - 1) % 12;
  const occupants = planetsInSign(varga.planets, signIndex);

  return (
    <div className="mt-4 rounded-xl border border-gold-400/25 bg-gold-400/[0.04] p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-sm font-semibold text-white">
            House {house} · {SIGN_SANSKRIT[signIndex]}{" "}
            <span className="text-[var(--text-muted)] font-normal">({SIGN_SHORT[signIndex]})</span>
          </div>
          <div className="text-[0.68rem] text-gold-400 mt-0.5">Lord: {SIGN_LORD[signIndex]}</div>
        </div>
        <button onClick={onClose} className="text-xs text-[var(--text-muted)] hover:text-white shrink-0">
          Close
        </button>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">{HOUSE_MEANING[house]}</p>

      {occupants.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)]">
          No planet occupies this house. It is read through its lord, {SIGN_LORD[signIndex]}, and
          through the planets aspecting it.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {occupants.map((p) => (
            <li key={p.body} className="text-xs flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold" style={{ color: planetFill(p) }}>{p.body}</span>
              {p.signDegree !== undefined && varga.showDegrees !== false && (
                <span className="text-[var(--text-secondary)]">{degToken(p.signDegree, true)}</span>
              )}
              {p.nakshatra && (
                <span className="text-[var(--text-muted)]">
                  {p.nakshatra}{p.nakshatraPada ? ` pada ${p.nakshatraPada}` : ""}
                </span>
              )}
              {p.isRetrograde && <span className="text-[#ff7a7a]">retrograde</span>}
              {p.isCombust && <span className="text-[#8b8fa3]">combust</span>}
              {p.dignity && p.dignity !== "Normal" && (
                <span className="text-gold-400">{p.dignity}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
