"use client";

import { useState, useCallback } from "react";
import { Loader2, Star } from "lucide-react";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { KundaliResult } from "./KundaliResult";
import type { PlanetStrength } from "@/lib/astrology/shadbala";
import type { AshtakavargaResult } from "@/lib/astrology/ashtakavarga";
import type { PlanetReport } from "@/lib/astrology/planetReport";

interface PlaceData {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface FormData {
  name: string;
  gender: string;
  dob: string;
  hour: number;
  minute: number;
  meridiem: string;
  placeText: string;
  place: PlaceData | null;
}

export interface PlanetRow {
  body: string;
  lon: number;
  rashi: string;
  rashiEnglish: string;
  house: number;
  signIndex: number;
  nakshatra: string;
  nakshatraPada: number;
  isRetrograde: boolean;
  isCombust: boolean;
  signDegree: number;
  dignity: string;
}

export interface DoshaSummary {
  manglik: { status: boolean; severity: string; details: string; isCancelled: boolean; cancellationReason: string };
  kaalSarp: { status: boolean; type: string; details: string };
  sadeSati: { status: boolean; phase: string; details: string };
}

export interface YogaSummary {
  name: string;
  formed: boolean;
  planets: string;
  effect: string;
  sanskrit?: string;
  category?: "benefic" | "malefic" | "mixed";
  strength?: "strong" | "moderate" | "weak";
}

export interface KundaliData {
  name: string;
  gender: string;
  dob: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
  moonSign: { name: string; english: string; degree: number; lord: string };
  sunSign: { name: string; english: string; degree: number; lord: string };
  lagna: { name: string; english: string; lord: string; element: string; degree: number };
  nakshatra: { name: string; lord: string; pada: number; deity: string; gana: string; nadi: string; yoni: string };
  ayanamsa: number;
  dasha: { current: string; currentRange: string; next: string; nextStartsAt: string; remaining: string; antardasha: string };
  planets: PlanetRow[];
  houses: { house: number; sign: string; signEnglish: string; lord: string; planets: string[] }[];
  doshas: DoshaSummary;
  yogas: YogaSummary[];
  navamsa: { planet: string; navamsaSignIndex: number; navamsaSign: string; navamsaEnglish: string; navamsaLord: string; dignity: string }[];
  /** Sign indices (0 = Aries) the chart component draws its house grid from. */
  lagnaSignIndex: number;
  moonSignIndex: number;
  navamsaLagnaSignIndex: number;
  /** Six-fold strength for the seven classical planets. */
  shadbala: PlanetStrength[];
  ashtakavarga: AshtakavargaResult;
  /** One written analysis per planet, including Rahu and Ketu. */
  planetReports: PlanetReport[];
  personality: string;
  career: string;
  marriage: string;
  health: string;
  finance: string;
  spiritual: string;
  positives: string[];
  challenges: { issue: string; solution: string }[];
  remedies: string[];
  luckyGems: { name: string; planet: string; finger: string }[];
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDay: string;
}

export function KundaliForm() {
  const [form, setForm] = useState<FormData>({
    name: "", gender: "male", dob: "", hour: 6, minute: 0, meridiem: "AM",
    placeText: "", place: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KundaliData | null>(null);

  const update = (key: keyof FormData, val: string | number | PlaceData | null) =>
    setForm((p) => ({ ...p, [key]: val }));

  const generate = useCallback(async () => {
    if (!form.name || !form.dob || !form.place) {
      setError("Please fill all fields and select a city from suggestions.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { generateKundaliData } = await import("@/app/actions/astrology");
      const res = await generateKundaliData(form);
      if (!res.success) {
        setError(res.error || "Failed to generate Kundali");
        setLoading(false);
        return;
      }
      setResult(res.data as KundaliData);
    } catch (e: any) {
      setError("An unexpected error occurred.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [form]);

  return (
    <>
      <div className="glass-card p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Enter your full name" />
          <SelectField label="Gender" value={form.gender} onChange={(v) => update("gender", v)}
            options={[{ v: "male", l: "Male" }, { v: "female", l: "Female" }, { v: "other", l: "Other" }]} />
          <InputField label="Date of Birth" type="date" value={form.dob} onChange={(v) => update("dob", v)} />
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Time of Birth</label>
            <div className="grid grid-cols-3 gap-2">
              <select value={form.hour} onChange={(e) => update("hour", +e.target.value)} className="form-select">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                ))}
              </select>
              <select value={form.minute} onChange={(e) => update("minute", +e.target.value)} className="form-select">
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
              <select value={form.meridiem} onChange={(e) => update("meridiem", e.target.value)} className="form-select">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Place of Birth</label>
            <PlaceAutocomplete
              value={form.placeText}
              onChange={(v) => { update("placeText", v); update("place", null); }}
              onSelect={(p) => { update("placeText", p.label); update("place", p); }}
              placeholder="Search city, state, country..."
            />
            {form.place && (
              <div className="text-xs text-mystic-green mt-1">
                ✓ {form.place.label} ({form.place.latitude.toFixed(2)}°N, {form.place.longitude.toFixed(2)}°E, TZ: {form.place.timezone})
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <button onClick={generate} disabled={loading}
          className="gold-btn w-full mt-6 py-4 text-lg rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
          {loading ? "Calculating your Kundali..." : "Generate Free Kundali"}
        </button>
      </div>

      {result && <KundaliResult data={result} />}
    </>
  );
}

// ── Form sub-components ───────────────────────────────────

function InputField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="form-select w-full" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select w-full">
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
