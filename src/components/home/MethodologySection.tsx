import Link from "next/link";

/**
 * Replaces the testimonial wall that used to sit here.
 *
 * Those testimonials were written by us, not by users — invented names,
 * invented cities, invented star ratings. Presenting them as "real experiences
 * from our community" is exactly what Google's misrepresentative-content policy
 * prohibits, and it is dishonest regardless of the policy. Until we have
 * reviews people actually wrote, the honest thing to show in this slot is how
 * the numbers are produced and where they come from.
 */

const PIPELINE = [
  {
    step: "01",
    title: "Birth moment → Julian Day",
    body: "Your date, clock time and birthplace are converted to Universal Time and then to a Julian Day number — a continuous count of days that removes calendar and timezone ambiguity from every calculation downstream.",
  },
  {
    step: "02",
    title: "Positions from orbital mechanics",
    body: "The Sun and Moon are computed from the periodic series in Jean Meeus's Astronomical Algorithms — the full 60-term lunar longitude series, not a truncation. Mercury through Saturn come from Keplerian elements with the Jupiter–Saturn resonance corrections applied, plus a light-time correction.",
  },
  {
    step: "03",
    title: "Tropical → Sidereal (Lahiri)",
    body: "Vedic astrology uses the sidereal zodiac, fixed to the stars rather than the equinox. We subtract the Lahiri Ayanamsa — the standard adopted by the Indian Calendar Reform Committee — which is 23°51′11″ at the year 2000 and drifts about 50.3 arcseconds per year.",
  },
  {
    step: "04",
    title: "Ascendant, houses, Nakshatra",
    body: "The Lagna comes from local sidereal time and the obliquity of the ecliptic via spherical trigonometry. Houses use the whole-sign system that Parashara describes. The Moon's sidereal longitude fixes the Nakshatra and Pada, which in turn set the Vimshottari Dasha balance at birth.",
  },
  {
    step: "05",
    title: "Classical rules, applied literally",
    body: "Yogas, Doshas and dignities are evaluated against the conditions stated in the classical texts — house lordships, exaltation and debilitation degrees, planetary aspects including the special aspects of Mars, Jupiter and Saturn. No step invents a rule that a source does not state.",
  },
];

const ACCURACY = [
  { body: "Sun", err: "< 0.4′", note: "checked at equinoxes & solstices" },
  { body: "Moon", err: "< 0.9′", note: "checked at New & Full Moon" },
  { body: "Ayanamsa", err: "exact", note: "to the Lahiri definition" },
  { body: "Mercury–Saturn", err: "~1–3′", note: "Keplerian + perturbations" },
];

export function MethodologySection() {
  return (
    <section className="py-20">
      <div className="section-container">
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-center mb-3">
          <span className="gold-text">How Your Chart Is Calculated</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12 max-w-2xl mx-auto">
          Every number on this site comes out of the same open pipeline. Nothing is
          guessed, nothing is randomised, and the same birth details always produce
          the same chart.
        </p>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
          {PIPELINE.map((p) => (
            <li key={p.step} className="glass-card p-5 flex flex-col">
              <div className="text-[0.65rem] font-mono text-gold-400/70 tracking-widest mb-2">
                {p.step}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{p.body}</p>
            </li>
          ))}

          <li className="glass-card-bright p-5 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-gold-200 mb-3">Measured error</h3>
            <dl className="space-y-2">
              {ACCURACY.map((a) => (
                <div key={a.body} className="flex items-baseline justify-between gap-2">
                  <dt className="text-xs text-[var(--text-secondary)]">{a.body}</dt>
                  <dd className="text-right">
                    <span className="text-xs font-semibold text-mystic-green">{a.err}</span>
                    <span className="block text-[0.6rem] text-[var(--text-muted)]">{a.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        </ol>

        <div className="max-w-3xl mx-auto glass-card p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            These figures are not marketing copy. The engine is checked against events
            whose timings are independently published — equinoxes, solstices, and the
            geocentric New and Full Moons behind recorded eclipses. The check runs from
            the repository as a script, and the arcminute errors above are what it
            currently reports.
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-4">
            Astronomical precision is not the same thing as predictive accuracy.
            Read our{" "}
            <Link href="/editorial-policy" className="text-gold-400 hover:underline">
              editorial policy
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="text-gold-400 hover:underline">
              disclaimer
            </Link>{" "}
            for where we draw that line.
          </p>
        </div>
      </div>
    </section>
  );
}
