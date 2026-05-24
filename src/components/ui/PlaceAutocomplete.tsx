"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface Suggestion {
  id: number;
  name: string;
  admin1: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface PlaceAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (place: { label: string; latitude: number; longitude: number; timezone: string }) => void;
  placeholder?: string;
}

export function PlaceAutocomplete({ value, onChange, onSelect, placeholder = "Search city..." }: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = (query: string) => {
    onChange(query);
    if (query.length < 2) { setSuggestions([]); setOpen(false); return; }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
        );
        const data = await res.json();
        if (data.results?.length) {
          setSuggestions(data.results.map((r: any) => ({
            id: r.id,
            name: r.name,
            admin1: r.admin1 || "",
            country: r.country || "",
            latitude: r.latitude,
            longitude: r.longitude,
            timezone: r.timezone || "UTC",
          })));
          setOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch { setSuggestions([]); }
      setLoading(false);
    }, 300);
  };

  const pick = (s: Suggestion) => {
    const label = [s.name, s.admin1, s.country].filter(Boolean).join(", ");
    onChange(label);
    onSelect({ label, latitude: s.latitude, longitude: s.longitude, timezone: s.timezone });
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => search(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="form-select w-full pl-9"
          autoComplete="off"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 animate-spin" />}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-[var(--border)] overflow-hidden"
          style={{ background: "rgba(10,11,20,0.97)", backdropFilter: "blur(16px)" }}>
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => pick(s)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gold-400/10 transition flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="text-white">{s.name}</span>
                <span className="text-[var(--text-muted)] text-xs">
                  {[s.admin1, s.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
