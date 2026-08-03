/**
 * The single named human behind the site.
 *
 * Google's quality guidelines lean hard on "who wrote this and why should I
 * believe them" — a site with no attributable author reads as content produced
 * at scale by nobody. Everything editorial on this site is bylined from here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EDIT THIS BEFORE REAPPLYING TO ADSENSE.
 *
 * The fields below are deliberately written to claim nothing that is not
 * already demonstrably true from the codebase. If you hold an actual Jyotish
 * qualification, have studied under a named teacher, or have been reading
 * charts for a known number of years, put that in `credentials` and `bio` —
 * that is the strongest trust signal you can add, and it is the one thing the
 * code cannot supply for you.
 *
 * Do not add a credential you do not hold. A false qualification is a worse
 * policy violation than having none.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const AUTHOR = {
  name: "Vinay Dharmik",
  role: "a full-stack developer",
  location: "India",
  email: "contact@vivaai.in",

  /** Shown under the name on the author card. Keep it factual. */
  credentials: [
    "Wrote the astronomical engine this site runs on, from the published algorithms rather than a third-party library",
    "Maintains the classical rule set against Brihat Parashara Hora Shastra, Phaladeepika and Saravali",
  ],

  bio:
    "I built the astronomy in this site from Jean Meeus's published algorithms and check it against equinox, solstice and eclipse timings I did not compute myself, because that is the only part of astrology that can be objectively right or wrong. The interpretive layer is a faithful transcription of what the classical texts state for a given placement — I am the developer who encoded those rules, not a practising astrologer, and I would rather you know that than assume otherwise.",

  /** Where a reader can verify the person exists. Empty entries are skipped. */
  profiles: [] as { label: string; url: string }[],
} as const;

/** schema.org Person, for embedding in article JSON-LD. */
export function authorJsonLd() {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    email: AUTHOR.email,
    description: AUTHOR.bio,
    knowsAbout: [
      "Vedic astrology",
      "Jyotish",
      "Astronomical calculation",
      "Sidereal zodiac",
    ],
    url: "https://vivaai.in/about",
    ...(AUTHOR.profiles.length ? { sameAs: AUTHOR.profiles.map((p) => p.url) } : {}),
  };
}

/**
 * Classical sources the interpretive rules are drawn from. Articles cite these
 * by key so a reader can trace a claim back to a text.
 */
export const SOURCES = {
  bphs: {
    key: "bphs",
    title: "Brihat Parashara Hora Shastra",
    author: "Maharishi Parashara",
    note: "The foundational text of Vedic astrology. Source for house significations, planetary dignities, Vimshottari Dasha and the majority of the Yoga definitions used here.",
  },
  phaladeepika: {
    key: "phaladeepika",
    title: "Phaladeepika",
    author: "Mantreswara",
    note: "A 13th–15th century synthesis. Source for several Dhana and Raja Yoga conditions and for the treatment of planetary aspects.",
  },
  saravali: {
    key: "saravali",
    title: "Saravali",
    author: "Kalyana Varma",
    note: "10th century. Source for planetary combinations, Nakshatra characteristics and remedial principles.",
  },
  jatakaParijata: {
    key: "jatakaParijata",
    title: "Jataka Parijata",
    author: "Vaidyanatha Dikshita",
    note: "Source for Manglik Dosha cancellation conditions and marriage-related rules.",
  },
  brihatJataka: {
    key: "brihatJataka",
    title: "Brihat Jataka",
    author: "Varahamihira",
    note: "6th century. Source for the Panch Mahapurusha Yogas and core natal-chart principles.",
  },
  meeus: {
    key: "meeus",
    title: "Astronomical Algorithms, 2nd ed.",
    author: "Jean Meeus",
    note: "Willmann-Bell, 1998. Source for the solar and lunar periodic series, sidereal time, obliquity and the lunar node.",
  },
  crc: {
    key: "crc",
    title: "Report of the Calendar Reform Committee",
    author: "Government of India, 1955",
    note: "Defines the Lahiri Ayanamsa used throughout this site for tropical-to-sidereal conversion.",
  },
} as const;

export type SourceKey = keyof typeof SOURCES;
