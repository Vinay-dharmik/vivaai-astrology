"use client";

import { useState } from "react";
import { Calendar, Clock, Gift } from "lucide-react";

export function AgeCalculatorClient() {
  const [dob, setDob] = useState("");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<AgeResult | null>(null);

  function calculate() {
    if (!dob) return;
    const birth = new Date(dob);
    const end = new Date(toDate || new Date().toISOString().split("T")[0]);
    if (birth >= end) return;

    let years = end.getFullYear() - birth.getFullYear();
    let months = end.getMonth() - birth.getMonth();
    let days = end.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = end.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / 3600000);
    const totalMinutes = Math.floor(diffMs / 60000);
    const totalSeconds = Math.floor(diffMs / 1000);

    // Next birthday
    const nextBday = new Date(end.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= end) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBday.getTime() - end.getTime()) / 86400000);
    const nextBdayDay = nextBday.toLocaleDateString("en-IN", { weekday: "long" });

    setResult({ years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds, daysToNext, nextBdayDay, nextBdayDate: nextBday.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) });
  }

  return (
    <div>
      <div className="glass-card p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider block mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={toDate}
              className="w-full bg-[rgba(8,6,14,0.6)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold-400/60 outline-none transition" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider block mb-1">Calculate To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              className="w-full bg-[rgba(8,6,14,0.6)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-white text-sm focus:border-gold-400/60 outline-none transition" />
          </div>
        </div>
        <button onClick={calculate} className="gold-btn w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" /> Calculate Age
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main age display */}
          <div className="glass-card-bright p-6 text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase mb-2">Your Exact Age</p>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-4xl font-bold gold-text">{result.years}</span>
              <span className="text-lg text-[var(--text-muted)]">years</span>
              <span className="text-3xl font-bold text-white">{result.months}</span>
              <span className="text-lg text-[var(--text-muted)]">months</span>
              <span className="text-3xl font-bold text-white">{result.days}</span>
              <span className="text-lg text-[var(--text-muted)]">days</span>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard icon={<Clock className="w-4 h-4 text-gold-400" />} label="Total Days" value={result.totalDays.toLocaleString()} />
            <StatCard icon={<Clock className="w-4 h-4 text-gold-400" />} label="Total Weeks" value={result.totalWeeks.toLocaleString()} />
            <StatCard icon={<Clock className="w-4 h-4 text-gold-400" />} label="Total Hours" value={result.totalHours.toLocaleString()} />
            <StatCard icon={<Clock className="w-4 h-4 text-gold-400" />} label="Total Minutes" value={result.totalMinutes.toLocaleString()} />
            <StatCard icon={<Clock className="w-4 h-4 text-gold-400" />} label="Total Seconds" value={result.totalSeconds.toLocaleString()} />
            <StatCard icon={<Gift className="w-4 h-4 text-mystic-green" />} label="Next Birthday" value={`${result.daysToNext} days`} sub={`${result.nextBdayDay}, ${result.nextBdayDate}`} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="glass-card p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">{icon}<span className="text-xs text-[var(--text-muted)] uppercase">{label}</span></div>
      <div className="text-lg font-bold text-white">{value}</div>
      {sub && <div className="text-[0.6rem] text-[var(--text-muted)] mt-0.5">{sub}</div>}
    </div>
  );
}

interface AgeResult {
  years: number; months: number; days: number;
  totalDays: number; totalWeeks: number; totalHours: number; totalMinutes: number; totalSeconds: number;
  daysToNext: number; nextBdayDay: string; nextBdayDate: string;
}
