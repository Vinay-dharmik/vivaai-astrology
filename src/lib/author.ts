/**
 * The single named human behind the site.
 *
 * Google's quality guidelines lean hard on "who wrote this and why should I
 * believe them" — a site with no attributable author reads as content produced
 * at scale by nobody.
 *
 * The author here is not a qualified astrologer, and the copy says so in the
 * first sentence. That is deliberate. The alternative — implying a Jyotish
 * lineage that does not exist — is the same category of misrepresentation that
 * got this site rejected from AdSense in the first place. Stating the limit
 * plainly and then showing exactly which classical text each rule comes from
 * is a stronger position than a vague claim to authority, because a reader can
 * check the sources and cannot check a credential.
 *
 * Do not add a qualification to this file that the author does not hold.
 */
export const AUTHOR = {
  name: "Vinay Dharmik",
  role: "a software developer, not a practising astrologer",
  location: "India",
  email: "contact@vivaai.in",

  /** Shown under the name on the author card. Only verifiable statements. */
  credentials: [
    "Implemented this site's astronomical engine directly from Jean Meeus's published algorithms, rather than calling a third-party ephemeris",
    "Verifies every release against independently published equinox, solstice and eclipse timings — the check script ships in the repository",
    "Transcribes each interpretive rule from a named classical text and cites it at the point of use",
  ],

  /** The one-line version, used in bylines. */
  shortBio:
    "Software developer. Builds the calculation engine behind VivaAI and transcribes the classical rules it applies. Not a qualified astrologer.",

  bio:
    "I want to be straightforward about what I am and am not. I am not a Jyotishi. I have no lineage, no certification, and I do not read charts for people. I am a developer who became interested in how much of Vedic astrology is actually arithmetic, and who found that most free chart generators get that arithmetic quietly wrong. So I wrote the astronomy myself from Jean Meeus's published algorithms and check it against sky events whose timings other people measured — equinoxes, solstices, the geocentric conjunctions behind recorded eclipses. That part of this site can be objectively right or wrong, and I can show you that it is right. The interpretive layer is a different thing: it is a transcription of what named classical texts state for a given placement, cited so you can look it up. Where those texts disagree with each other, I say so rather than picking one and presenting it as settled. What I cannot give you is the judgement of an experienced astrologer weighing a whole chart at once. For anything that matters, see one.",

  /** Where a reader can verify the person exists. Empty entries are skipped. */
  profiles: [] as { label: string; url: string }[],
} as const;

/** schema.org Person, for embedding in article JSON-LD. */
export function authorJsonLd() {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    email: AUTHOR.email,
    description: AUTHOR.shortBio,
    jobTitle: "Software developer",
    knowsAbout: [
      "Astronomical calculation",
      "Sidereal zodiac",
      "Vedic astrology calculation methods",
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
