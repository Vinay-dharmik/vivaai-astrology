"use client";

import { useState, useCallback } from "react";
import { Loader2, Star, Download, ShieldCheck } from "lucide-react";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { KundaliResult } from "@/components/kundali/KundaliResult";
import type { KundaliData } from "@/components/kundali/KundaliForm";

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

export default function AdminKundaliPage() {
  const [form, setForm] = useState<FormData>({
    name: "Admin User", gender: "male", dob: "1995-05-15", hour: 10, minute: 30, meridiem: "AM",
    placeText: "New Delhi, Delhi, India",
    place: { label: "New Delhi, Delhi, India", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" },
  });
  const [loading, setLoading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KundaliData | null>(null);

  const update = (key: keyof FormData, val: any) =>
    setForm((p) => ({ ...p, [key]: val }));

  const generate = useCallback(async () => {
    if (!form.name || !form.dob || !form.place) {
      setError("Please fill all fields and select a city.");
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

  const downloadAdminFreePDF = async () => {
    if (!result) return;
    setPdfDownloading(true);
    try {
      const { generateKundaliPDF } = await import("@/lib/pdf/kundaliPDF");
      await generateKundaliPDF(result);
    } catch (err: any) {
      console.error(err);
      setError("PDF generation error: " + err.message);
    } finally {
      setPdfDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sora font-bold text-2xl gold-text">Admin Kundali & Free PDF Tool</h1>
            <span className="text-xs bg-gold-400/20 text-gold-400 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Vinayd Free Access
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generate Janam Kundali for any birth details and download the 100% Free Premium PDF without payment verification.
          </p>
        </div>

        {result && (
          <button
            onClick={downloadAdminFreePDF}
            disabled={pdfDownloading}
            className="gold-btn px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-glow"
          >
            {pdfDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {pdfDownloading ? "Generating PDF..." : "Download Free Premium PDF"}
          </button>
        )}
      </div>

      {/* Form Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-1.5 font-medium">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full Name"
              className="form-select w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-1.5 font-medium">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              className="form-select w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-1.5 font-medium">Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => update("dob", e.target.value)}
              className="form-select w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-1.5 font-medium">Time of Birth</label>
            <div className="grid grid-cols-3 gap-1.5">
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
            <label className="block text-xs text-gold-200 uppercase tracking-wider mb-1.5 font-medium">Place of Birth</label>
            <PlaceAutocomplete
              value={form.placeText}
              onChange={(v) => { update("placeText", v); update("place", null); }}
              onSelect={(p) => { update("placeText", p.label); update("place", p); }}
              placeholder="Search city..."
            />
            {form.place && (
              <div className="text-xs text-mystic-green mt-1">
                ✓ {form.place.label} ({form.place.latitude.toFixed(2)}°N, {form.place.longitude.toFixed(2)}°E, TZ: {form.place.timezone})
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <button
          onClick={generate}
          disabled={loading}
          className="gold-btn w-full mt-6 py-3.5 text-base font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-glow"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
          {loading ? "Calculating Kundali..." : "Generate Kundali Report"}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-4">
          <div className="bg-gold-400/10 border border-gold-400/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span className="text-sm font-semibold text-white">Admin Privileges Active: Instant Free PDF Download Available</span>
            </div>
            <button
              onClick={downloadAdminFreePDF}
              disabled={pdfDownloading}
              className="gold-btn px-4 py-2 text-xs rounded-lg font-bold flex items-center gap-1.5"
            >
              {pdfDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {pdfDownloading ? "Downloading..." : "Download PDF Now"}
            </button>
          </div>

          <KundaliResult data={result} />
        </div>
      )}
    </div>
  );
}
