"use client";

import { useState } from "react";
import { Loader2, Gem } from "lucide-react";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import type { RemedySet } from "@/lib/astrology/remedies";

interface PlaceData { label: string; latitude: number; longitude: number; timezone: string; }

export function RemediesForm() {
  const [form, setForm] = useState({ name: "", dob: "", hour: 6, minute: 0, meridiem: "AM", placeText: "", place: null as PlaceData | null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ remedies: RemedySet; lagna: string; moon: string; dasha: string } | null>(null);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!form.name || !form.dob || !form.place) { setError("Please fill all fields and select a city."); return; }
    setLoading(true); setError(""); setResult(null);

    try {
      const calc = await import("@/lib/astrology/calculations");
      const { generateRemedies } = await import("@/lib/astrology/remedies");
      const Astronomy = await import("astronomy-engine");

      const place = form.place!;
      const { hour24, minute } = calc.to24Hour(form.hour, form.minute, form.meridiem);
      const utc = calc.zonedBirthToUtc(form.dob, hour24, minute, place.timezone);
      const aya = calc.lahiriAyanamsa(utc);
      const sid = calc.planetarySiderealLongitudes(utc, aya, Astronomy);
      const moonInfo = calc.getRashiInfo(sid.Moon);
      const lagnaLon = calc.calcAscendantSidereal(utc, place.latitude, place.longitude, aya, Astronomy);
      const lagnaInfo = calc.getRashiInfo(lagnaLon);
      const age = calc.getAgeYears(form.dob);
      const nakInfo = calc.getNakshatraInfo(sid.Moon);
      const dasha = calc.getVimshottariSummary(nakInfo.lord, age);
      const rows = calc.buildPlanetRows(sid, lagnaInfo.signIndex);
      const weakPlanets = rows.filter((r) => [6, 8, 12].includes(r.house)).map((r) => r.body);

      const remedies = generateRemedies(lagnaInfo, moonInfo, dasha.current, weakPlanets);
      setResult({ remedies, lagna: `${lagnaInfo.name} (${lagnaInfo.english})`, moon: `${moonInfo.name} (${moonInfo.english})`, dasha: dasha.current });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Inp label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Your name" />
          <Inp label="Date of Birth" type="date" value={form.dob} onChange={(v) => update("dob", v)} />
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Time of Birth</label>
            <div className="grid grid-cols-3 gap-2">
              <select value={form.hour} onChange={(e) => update("hour", +e.target.value)} className="form-select text-sm">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}</option>)}
              </select>
              <select value={form.minute} onChange={(e) => update("minute", +e.target.value)} className="form-select text-sm">
                {Array.from({ length: 60 }, (_, i) => i).map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
              </select>
              <select value={form.meridiem} onChange={(e) => update("meridiem", e.target.value)} className="form-select text-sm">
                <option value="AM">AM</option><option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">Place of Birth</label>
            <PlaceAutocomplete
              value={form.placeText}
              onChange={(v) => { update("placeText", v); update("place", null); }}
              onSelect={(p) => { update("placeText", p.label); update("place", p); }}
              placeholder="Search city..."
            />
            {form.place && <span className="text-xs text-mystic-green mt-1 block">✓ {form.place.label}</span>}
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="gold-btn w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gem className="w-5 h-5" />}
          {loading ? "Calculating..." : "Get Personalized Remedies"}
        </button>
      </div>

      {result && <RemedyDisplay data={result} />}
    </>
  );
}

function Inp({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gold-200 uppercase tracking-wider mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="form-select w-full" />
    </div>
  );
}

function RemedyDisplay({ data }: { data: { remedies: RemedySet; lagna: string; moon: string; dasha: string } }) {
  const { remedies, lagna, moon, dasha } = data;
  return (
    <div className="glass-card-bright p-6 mt-8 space-y-6">
      <div className="text-center">
        <h2 className="font-sora font-bold text-lg gold-text">Your Personalized Remedies</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">Lagna: {lagna} • Moon: {moon} • Dasha: {dasha}</p>
      </div>

      <Sec title="💎 Recommended Gemstones">
        <div className="grid sm:grid-cols-2 gap-3">
          {remedies.gemstones.map((g) => (
            <div key={g.planet} className="bg-white/[0.03] rounded-lg p-3">
              <div className="font-semibold text-sm text-white">{g.name}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Planet: {g.planet} • Finger: {g.finger} • Metal: {g.metal} • Day: {g.day}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec title="🕉️ Daily Mantras">
        {remedies.mantras.map((m) => (
          <div key={m.planet} className="bg-white/[0.03] rounded-lg p-3 mb-2">
            <div className="font-semibold text-sm text-gold-200">{m.mantra}</div>
            <div className="text-xs text-[var(--text-muted)]">For {m.planet} • {m.count}</div>
          </div>
        ))}
      </Sec>

      <Sec title="🍃 Fasting Recommendations">
        {remedies.fasting.map((f) => (
          <div key={f.planet} className="flex justify-between items-center bg-white/[0.03] rounded-lg p-3 mb-2">
            <div><span className="text-sm font-medium text-white">{f.day}</span> <span className="text-xs text-[var(--text-muted)]">({f.planet})</span></div>
            <span className="text-xs text-[var(--text-muted)]">{f.benefit}</span>
          </div>
        ))}
      </Sec>

      <div className="grid sm:grid-cols-2 gap-4">
        <Sec title="🎨 Lucky Colors">
          {remedies.colors.map((c) => (
            <div key={c.color} className="text-sm text-[var(--text-secondary)] mb-1"><strong className="text-gold-200">{c.color}</strong> — {c.effect}</div>
          ))}
        </Sec>
        <Sec title="🔢 Lucky Numbers & Day">
          <div className="text-sm text-[var(--text-secondary)]">Numbers: <strong className="text-gold-200">{remedies.luckyNumbers.join(", ")}</strong></div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Day: <strong className="text-gold-200">{remedies.luckyDay}</strong></div>
        </Sec>
      </div>

      <Sec title="🙏 Donation Suggestions">
        {remedies.donations.map((d) => (
          <div key={d.item} className="text-sm text-[var(--text-secondary)] mb-1"><strong className="text-gold-200">{d.item}</strong> on {d.day} — {d.benefit}</div>
        ))}
      </Sec>
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="text-xs text-gold-200 uppercase tracking-wider font-semibold mb-3">{title}</h3>{children}</div>;
}
