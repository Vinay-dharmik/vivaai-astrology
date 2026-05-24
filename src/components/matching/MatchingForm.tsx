"use client";

import { useState } from "react";
import { Loader2, Heart } from "lucide-react";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import type { MatchingResult } from "@/lib/astrology/matching";

interface PlaceData { label: string; latitude: number; longitude: number; timezone: string; }

interface PersonForm {
  name: string;
  dob: string;
  hour: number;
  minute: number;
  meridiem: string;
  placeText: string;
  place: PlaceData | null;
}

const EMPTY: PersonForm = { name: "", dob: "", hour: 6, minute: 0, meridiem: "AM", placeText: "", place: null };

export function MatchingForm() {
  const [boy, setBoy] = useState<PersonForm>({ ...EMPTY });
  const [girl, setGirl] = useState<PersonForm>({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchingResult | null>(null);

  const updateBoy = (k: keyof PersonForm, v: any) => setBoy((p) => ({ ...p, [k]: v }));
  const updateGirl = (k: keyof PersonForm, v: any) => setGirl((p) => ({ ...p, [k]: v }));

  const match = async () => {
    if (!boy.name || !boy.dob || !boy.place || !girl.name || !girl.dob || !girl.place) {
      setError("Please fill all fields and select cities from suggestions.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const calc = await import("@/lib/astrology/calculations");
      const { calculateAshtakootMatch } = await import("@/lib/astrology/matching");
      const Astronomy = await import("astronomy-engine");

      async function computePerson(p: PersonForm) {
        const place = p.place!;
        const { hour24, minute } = calc.to24Hour(p.hour, p.minute, p.meridiem);
        const utc = calc.zonedBirthToUtc(p.dob, hour24, minute, place.timezone);
        const aya = calc.lahiriAyanamsa(utc);
        const sid = calc.planetarySiderealLongitudes(utc, aya, Astronomy);
        const moonInfo = calc.getRashiInfo(sid.Moon);
        const lagnaLon = calc.calcAscendantSidereal(utc, place.latitude, place.longitude, aya, Astronomy);
        const lagnaInfo = calc.getRashiInfo(lagnaLon);
        const marsInfo = calc.getRashiInfo(sid.Mars);
        const marsHouse = calc.houseFromPlanet(marsInfo.signIndex, lagnaInfo.signIndex);
        return { moonLon: sid.Moon, moonSign: moonInfo.signIndex, marsHouse };
      }

      const b = await computePerson(boy);
      const g = await computePerson(girl);
      const res = calculateAshtakootMatch(b.moonLon, g.moonLon, b.moonSign, g.moonSign, b.marsHouse, g.marsHouse);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Matching failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <PersonCard title="Boy's Details" person={boy} update={updateBoy} accent="blue" />
        <PersonCard title="Girl's Details" person={girl} update={updateGirl} accent="pink" />
      </div>

      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

      <button onClick={match} disabled={loading}
        className="gold-btn w-full mt-6 py-4 text-lg rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
        {loading ? "Calculating Compatibility..." : "Check Compatibility"}
      </button>

      {result && <MatchResult data={result} boyName={boy.name} girlName={girl.name} />}
    </>
  );
}

function PersonCard({ title, person, update, accent }: {
  title: string; person: PersonForm; update: (k: keyof PersonForm, v: any) => void; accent: string;
}) {
  const borderColor = accent === "blue" ? "border-mystic-blue/30" : "border-pink-500/30";
  return (
    <div className={`glass-card p-5 ${borderColor}`}>
      <h3 className="text-sm font-semibold text-gold-200 uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-3">
        <Field label="Name" value={person.name} onChange={(v) => update("name", v)} placeholder="Full name" />
        <Field label="Date of Birth" type="date" value={person.dob} onChange={(v) => update("dob", v)} />
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Time of Birth</label>
          <div className="grid grid-cols-3 gap-2">
            <select value={person.hour} onChange={(e) => update("hour", +e.target.value)} className="form-select text-sm">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}</option>)}
            </select>
            <select value={person.minute} onChange={(e) => update("minute", +e.target.value)} className="form-select text-sm">
              {Array.from({ length: 60 }, (_, i) => i).map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
            </select>
            <select value={person.meridiem} onChange={(e) => update("meridiem", e.target.value)} className="form-select text-sm">
              <option value="AM">AM</option><option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Place of Birth</label>
          <PlaceAutocomplete
            value={person.placeText}
            onChange={(v) => { update("placeText", v); update("place", null); }}
            onSelect={(p) => { update("placeText", p.label); update("place", p); }}
            placeholder="Search city..."
          />
          {person.place && <span className="text-xs text-mystic-green mt-1 block">✓ {person.place.label}</span>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--text-muted)] mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="form-select w-full text-sm" />
    </div>
  );
}

function MatchResult({ data, boyName, girlName }: { data: MatchingResult; boyName: string; girlName: string }) {
  const ringColor = data.percentage >= 70 ? "text-mystic-green" : data.percentage >= 50 ? "text-gold-400" : "text-red-400";

  return (
    <div className="glass-card-bright p-6 sm:p-8 mt-8 space-y-6">
      <div className="text-center">
        <h2 className="font-sora font-bold text-xl gold-text mb-2">{boyName} ❤️ {girlName}</h2>
        <div className={`text-5xl font-bold ${ringColor} mb-1`}>{data.totalScore}/36</div>
        <div className="text-sm text-[var(--text-muted)]">{data.percentage}% Compatible</div>
        <div className="text-lg font-semibold text-gold-200 mt-2">{data.verdict}</div>
      </div>

      <div>
        <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">Ashtakoot Analysis</h3>
        <div className="space-y-2">
          {data.koots.map((k) => (
            <div key={k.name} className="bg-white/[0.03] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-28 text-sm font-medium text-white">{k.name}</div>
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full" style={{ width: `${(k.score / k.maxPoints) * 100}%` }} />
                  </div>
                </div>
                <div className="text-sm text-gold-200 w-12 text-right">{k.score}/{k.maxPoints}</div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 pl-28">{k.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.03] border-l-4 border-gold-400/50 pl-4 py-3 rounded-r-lg">
        <h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-1">Manglik Status</h3>
        <p className="text-sm text-[var(--text-secondary)]">{data.manglikMatch}</p>
      </div>

      <div className="text-center border-t border-[var(--border)] pt-4">
        <p className="text-sm text-[var(--text-secondary)]">{data.recommendation}</p>
      </div>
    </div>
  );
}
