import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "what-is-kundali-vedic-birth-chart",
  title: "What Is a Kundali? A Working Guide to the Vedic Birth Chart",
  description:
    "What a Kundali actually is, how the twelve houses and nine grahas are assembled from your birth moment, why the sidereal zodiac puts you in a different sign than Western astrology, and how to read the chart rather than just look at it.",
  date: "2025-12-15",
  updated: "2026-08-03",
  category: "Basics",
  sources: ["bphs", "brihatJataka", "meeus", "crc"],
  content: `A Kundali is a diagram of where everything in the sky was at the moment you were born, drawn from the place you were born. That is the whole of it. Every other claim made about a birth chart rests on that single geometric fact, and if the geometry is wrong nothing built on top of it can be right.

This guide covers what the chart contains, how each part is derived, and — more usefully — how to look at one without immediately reaching for a list of meanings.

## The three inputs, and why the third one surprises people

A Kundali needs a date, a time, and a place. Most people expect the first two. The third is the one that does real work.

**Date** fixes where the slow-moving bodies are. Saturn takes about twenty-nine and a half years to circle the zodiac, so it moves roughly one degree every twelve days. Jupiter takes about twelve years. For these two, being a day out barely matters.

**Time** fixes the Moon and the Ascendant. The Moon moves about thirteen degrees a day — half a degree per hour — so an hour of error can shift your Nakshatra. The Ascendant is worse: it moves through the entire zodiac every twenty-four hours, which is one degree every four minutes. A birth time recorded to the nearest fifteen minutes carries roughly four degrees of uncertainty in the Ascendant, and if your true Ascendant sits near a sign boundary, four degrees is the difference between two completely different charts.

**Place** fixes the Ascendant too, and this is the part that surprises people. The Ascendant is the point of the ecliptic rising over the eastern horizon, and the horizon is different in Chennai than in Chandigarh. Two babies born at the same instant, one in each city, have identical planetary positions and different Ascendants — which means different houses, different house lords, and different readings. The latitude matters more than the longitude here, because the angle at which the ecliptic meets the horizon changes with how far north or south you are.

## From a timestamp to a sky

The conversion runs in a fixed order.

Your local clock time is converted to Universal Time, then to a **Julian Day** — a continuous count of days used in astronomy precisely because it has no months, no leap years and no time zones to argue about. Everything downstream is a function of that one number.

From the Julian Day, the positions of the Sun, Moon and the five visible planets are computed. These are not looked up in a table. They come from periodic series — long sums of sine terms, each representing one gravitational nudge from another body — published in Jean Meeus's *Astronomical Algorithms*. The Moon's series alone runs to sixty terms in its main form, and the terms matter: dropping the smaller ones costs you tenths of a degree, and a Nakshatra Pada is only three degrees and twenty minutes wide.

The result at this stage is **tropical**: measured from the vernal equinox, the point where the Sun crosses the celestial equator each March. This is the zodiac Western astrology uses.

## Why your Vedic sign differs from your Western one

The vernal equinox is not fixed against the stars. The Earth's axis wobbles like a slowing top, one full circuit every roughly 25,800 years, which drags the equinox backwards through the constellations at about fifty arcseconds a year. This is **precession**.

Around 285 CE the equinox sat at the start of the constellation Aries and the two zodiacs agreed. They have been drifting apart ever since, and today the gap is about twenty-four degrees.

Vedic astrology uses the **sidereal** zodiac, fixed to the stars. To get there you subtract the accumulated drift, a quantity called the **Ayanamsa**. This site uses the Lahiri Ayanamsa, adopted by the Government of India's Calendar Reform Committee in 1955 and defined as 23 degrees 51 arcminutes 11 arcseconds at the start of the year 2000, increasing by about 50.3 arcseconds per year.

The practical consequence: if you were born in the last few days of a Western sign, your Vedic Sun sign is almost certainly the previous one. A Western Aries born on 15 April is usually a Vedic Pisces. This is not a disagreement about your character. It is two different measuring conventions, and each system's interpretations were built on its own convention.

## The twelve houses

Once the Ascendant is known, the chart is divided into twelve **Bhavas**, or houses. This site uses the whole-sign system that Parashara describes: the entire sign containing the Ascendant is the first house, the next sign is the second, and so on. No sign is split between two houses, and every house is exactly thirty degrees.

Houses are the subject matter. Planets are the actors. Signs are the manner.

- **1st** — the body, temperament, vitality, how you meet the world
- **2nd** — accumulated wealth, family of origin, speech, what you eat
- **3rd** — initiative, courage, younger siblings, short journeys, hands and communication
- **4th** — mother, home, land and vehicles, schooling, inner contentment
- **5th** — children, intelligence, past merit, speculation, romance
- **6th** — illness, debt, enemies, litigation, daily service and routine
- **7th** — marriage, business partners, contracts, open opposition
- **8th** — longevity, upheaval, inheritance, other people's money, the occult
- **9th** — fortune, dharma, father, teachers, long journeys, higher learning
- **10th** — profession, status, public action, authority
- **11th** — income, gains, elder siblings, networks, desires fulfilled
- **12th** — loss and expenditure, foreign lands, seclusion, liberation

Houses 1, 4, 7 and 10 are the **Kendras** or angles — the load-bearing structure of the chart. Houses 1, 5 and 9 are the **Trikonas** or trines, associated with merit and fortune. Houses 6, 8 and 12 are the **Dusthanas**, the difficult houses, though the sixth and eleventh both have a competitive quality that can be productive.

## The nine grahas

Vedic astrology counts nine. Seven are physical bodies visible to the naked eye; two are not bodies at all.

- **Sun (Surya)** — the soul, vitality, the father, authority, recognition
- **Moon (Chandra)** — the mind, emotional weather, the mother, the public
- **Mars (Mangal)** — drive, courage, siblings, land, surgery, anything won by force
- **Mercury (Budha)** — intellect, speech, commerce, calculation, the nerves
- **Jupiter (Guru)** — wisdom, teachers, children, wealth, dharma, expansion
- **Venus (Shukra)** — love, marriage, beauty, vehicles, luxury, artistic sense
- **Saturn (Shani)** — time, discipline, labour, longevity, sorrow, slow mastery
- **Rahu** — the Moon's north node: obsession, foreign things, sudden rise, illusion
- **Ketu** — the Moon's south node: detachment, past merit, sharp insight, sudden loss

Rahu and Ketu are the two points where the Moon's orbit crosses the ecliptic. They are always exactly opposite each other, they always move backwards through the zodiac, and eclipses happen only when a New or Full Moon occurs near one of them — which is why the tradition describes them as the shadow that swallows the luminaries. They own no sign, so they take on the character of whatever house they occupy and of the planet that rules that house.

## Reading the chart instead of looking it up

The failure mode of every beginner — and of most free chart reports — is treating the chart as twelve independent lookups. "Mars in the fourth house" gets a paragraph, "Saturn in the seventh" gets another, and the paragraphs never speak to each other.

Classical practice works differently. Four questions, in order:

**1. Which houses does this planet rule?** A planet's first job is to carry the affairs of the signs it owns. Mars in the fourth house means something quite different if Mars also rules your first and eighth than if it rules your third and tenth. This is why the Ascendant matters so much: it decides every lordship in the chart.

**2. Is it functionally benefic here?** Natural temperament is only half the story. A lord of a trine protects, even if it is Saturn. A lord of the sixth, eighth or twelfth creates friction, even if it is Jupiter. For six Ascendants a single planet rules both an angle and a trine — that planet is the **Yogakaraka**, and it is the most reliable source of good in the chart.

**3. Can it actually act?** A planet can promise and fail to deliver. Debilitation, combustion, and low Shadbala all describe a planet that signifies something it cannot bring about on schedule. Our [Shadbala guide](/blog/shadbala-planetary-strength-explained) covers the measurement in detail.

**4. When?** A chart shows what is possible. The **Vimshottari Dasha** system shows when each possibility gets its turn, and it is calculated from the Moon's exact position at birth. A brilliant placement in a planet whose Dasha comes at seventy is a different life from the same placement in a Dasha that runs from twenty-five to forty-one.

## What a chart cannot tell you

Two honest limits.

The astronomy is exact and checkable. The interpretation is not. Classical texts frequently disagree with each other — on which house governs which topic at the margins, on how much a cancellation condition actually cancels, on whether a given combination is a Yoga at all. A report that never mentions disagreement is hiding something.

And a chart says nothing about what you should do. It describes a set of tendencies and timings within which a very large number of different lives are possible. Treat it as a description of the weather, not of your route.

## Where to go next

Generate your own chart with the [free Kundali tool](/kundali) — it is complete and needs no account. Then read the [Vimshottari Dasha guide](/blog/vimshottari-dasha-system-explained) to understand the timing layer, and [how to read a North Indian chart](/blog/how-to-read-north-indian-birth-chart) if the diamond diagram is unfamiliar.`,
  faqs: [
    {
      q: "How accurate does my birth time need to be?",
      a: "The Ascendant moves one degree every four minutes, so a time accurate to five minutes gives you an Ascendant good to about a degree. If your recorded time is only accurate to the nearest hour, treat the Ascendant and house placements as provisional — the planetary positions themselves will still be reliable, except the Moon, which moves about half a degree per hour.",
    },
    {
      q: "Why is my Vedic sign different from my Western sign?",
      a: "The two systems measure from different starting points. Western astrology measures from the vernal equinox; Vedic astrology measures from a fixed point among the stars. Precession has separated the two by about 24 degrees, so anyone born in roughly the last three weeks of a Western sign will have the previous sign in the Vedic system.",
    },
    {
      q: "What is the difference between my Sun sign and my Moon sign?",
      a: "Vedic astrology gives primary weight to the Moon sign, called your Rashi, because the Moon governs the mind and because the Vimshottari Dasha timeline is calculated from the Moon's position. When Indian astrology asks your sign, it usually means your Moon sign, not your Sun sign.",
    },
    {
      q: "Do I need to know my birth place exactly?",
      a: "The city is normally enough. Latitude affects the Ascendant most, and moving a few kilometres changes it by a negligible amount. Moving several hundred kilometres north or south can shift it noticeably, so use the actual city of birth rather than the nearest large one.",
    },
  ],
};
