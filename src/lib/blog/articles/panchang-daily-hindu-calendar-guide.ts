import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "panchang-daily-hindu-calendar-guide",
  title: "Reading the Panchang: The Five Limbs and the Arithmetic Behind Them",
  description:
    "What the five limbs of the Panchang actually measure — Tithi, Nakshatra, Yoga, Karana and Vara — each defined by the real angle between Sun and Moon, plus how Rahu Kalam is derived and where the daily figures come from.",
  date: "2026-04-01",
  updated: "2026-08-03",
  category: "Fundamentals",
  sources: ["bphs", "meeus"],
  content: `Panchang means "five limbs," and the name is exact: it is five separate measurements of the sky for a given day and place, not a mystical almanac. Four of the five are defined by the angular relationship between the Sun and the Moon, and the fifth is simply the weekday. Once you know that, the Panchang stops being a list of unfamiliar words and becomes readable — each limb is answering a precise astronomical question.

This guide defines each limb by what it measures, so that a figure on a Panchang page can be traced back to an angle rather than taken on trust.

## The engine underneath: the Sun–Moon angle

Almost everything in the Panchang follows from one quantity — the difference in ecliptic longitude between the Moon and the Sun, measured in the sidereal zodiac. Call it the elongation. It runs from 0° at the new moon (Sun and Moon together) through 180° at the full moon and back to 360°. Tithi, Yoga and Karana are all just this angle sliced at different intervals; get the two longitudes right and the three fall out of arithmetic. That is why an accurate Panchang depends first on accurate positions — the periodic series for the Sun and Moon from Meeus's algorithms, applied with the Lahiri ayanamsa.

## 1. Tithi — the lunar day (Sun–Moon elongation ÷ 12°)

A Tithi is the time the Moon takes to gain 12° of elongation on the Sun. Thirty of them make a lunar month: fifteen in the waxing fortnight (**Shukla Paksha**) from new to full moon, fifteen in the waning fortnight (**Krishna Paksha**) from full back to new.

Because the Moon's speed varies, a Tithi is not a fixed number of hours — it can run from about 19 to 26 hours, which is why a Tithi can occasionally be skipped or repeated across two sunrises. The Tithi in force at sunrise is the one that names the day.

Some Tithis carry standing associations: **Pratipada** for beginnings, **Panchami** for learning, **Ekadashi** for fasting, **Purnima** (full moon) and **Amavasya** (new moon) for worship and ancestral rites respectively.

## 2. Nakshatra — the Moon's mansion (Moon longitude ÷ 13°20′)

The second limb is simply which of the 27 Nakshatras the Moon occupies — its sidereal longitude divided into 27 equal bands of 13°20′. The Moon crosses roughly one Nakshatra per day, so the day's Nakshatra changes at a definite clock time when the Moon leaves one band for the next.

Electional astrology (Muhurta) leans heavily on this limb: **Rohini** and **Pushya** are among the most auspicious for beginnings, **Ashwini** for travel and treatment, **Revati** for new undertakings. Each Nakshatra has traditional favoured and unfavoured activities.

## 3. Yoga — the summed longitude (Sun + Moon, ÷ 13°20′)

Yoga is the most misunderstood limb because it sounds like the postural practice and is unrelated to it. Here it is the **sum** of the Sun's and Moon's sidereal longitudes, divided into 27 parts. Where Tithi and Nakshatra track the Moon relative to the Sun and to the zodiac, Yoga tracks the two bodies moving together, and it advances a little faster than one unit per day.

There are 27 named Yogas. A handful are traditionally auspicious — **Siddhi**, **Amrita**, **Shubha** — and a few, such as **Vyatipata** and **Vaidhriti**, are avoided for important work.

## 4. Karana — the half-Tithi (elongation ÷ 6°)

A Karana is half a Tithi — 6° of elongation — so there are two per Tithi and 60 across the lunar month. There are only 11 distinct Karana names: four "fixed" ones that occur once each per month around the new moon, and seven "movable" ones that repeat in rotation. Karana refines timing within a day and matters most in detailed Muhurta selection.

## 5. Vara — the weekday and its planet

The simplest limb: the day of the week, each ruled by a planet, defining the day's baseline character.

| Day | Ruler | Emphasis |
| --- | --- | --- |
| Sunday | Sun | Authority, vitality, health |
| Monday | Moon | Mind, emotion, water |
| Tuesday | Mars | Energy, courage, property, disputes |
| Wednesday | Mercury | Commerce, study, communication |
| Thursday | Jupiter | Wisdom, learning, marriage, ceremony |
| Friday | Venus | Love, art, comfort, luxury |
| Saturday | Saturn | Labour, discipline, endings, karma |

## Rahu Kalam — a derived, not observed, window

Every day carries a roughly 90-minute window called **Rahu Kalam**, traditionally avoided for starting anything important. It is not an observation of Rahu — Rahu is a computed point, not a body that "arrives." It is a calendrical division: the daylight span from sunrise to sunset is cut into eight equal parts, and a fixed part is assigned to Rahu depending on the weekday. The window therefore shifts with your local sunrise and with the length of the day, which is why it must be computed for a place, not read off a national table.

The related windows **Yamaganda** and **Gulika Kalam** are derived the same way, from the same eightfold division, assigned to different parts by weekday.

## How to actually use a Panchang

1. Check the **Tithi** and **Nakshatra** in force at the time you plan to act — both change at definite moments, not at midnight.
2. Avoid **Rahu Kalam**, **Yamaganda** and the inauspicious Yogas for anything you want to begin cleanly.
3. For weddings, housewarmings and other ceremonies, match the event to a favourable Nakshatra and a benefic Tithi — this is the substance of Muhurta.
4. Remember the whole thing is local. Two cities a few hundred kilometres apart can have different Tithi-change times and different Rahu Kalam windows on the same date.

## An honest note on Muhurta

The five limbs are astronomy and can be computed exactly; this site does. The claim that a given Tithi or Nakshatra makes an undertaking succeed or fail is tradition, not measurement, and it should be read as the accumulated convention of Muhurta rather than as a law of cause and effect. The calendar is real; the electional meaning attached to it is a practice you can take or leave.

## Today's Panchang

Our [daily Panchang](/panchang) computes all five limbs, plus Rahu Kalam, Yamaganda and Gulika, for your location — using the same Sun and Moon positions that drive the [Kundali engine](/kundali), so the Tithi and Nakshatra you see here agree with the ones in a birth chart cast for the same moment.`,
  faqs: [
    {
      q: "What are the five limbs of the Panchang?",
      a: "Tithi (lunar day), Nakshatra (the Moon's mansion), Yoga (the summed longitude of Sun and Moon), Karana (half a Tithi), and Vara (the weekday and its ruling planet). Four of the five are defined by the angle between the Sun and Moon; the fifth is simply the day of the week.",
    },
    {
      q: "Why does a Tithi not last exactly 24 hours?",
      a: "A Tithi is defined by the Moon gaining 12 degrees of elongation on the Sun, not by the clock. Because the Moon's speed varies, that takes anywhere from about 19 to 26 hours — which is why a Tithi can occasionally be skipped or repeated between two sunrises.",
    },
    {
      q: "How is Rahu Kalam calculated?",
      a: "The daylight period from sunrise to sunset is divided into eight equal parts, and one fixed part is assigned to Rahu depending on the weekday. It is a calendrical division, not an observation of a planet, so it shifts with your local sunrise and the length of the day and must be computed for a specific place.",
    },
    {
      q: "Does the Panchang really need to be calculated for my exact location?",
      a: "Yes. The Tithi and Nakshatra change at definite moments that depend on longitude, and Rahu Kalam depends on local sunrise and sunset. A Panchang cast for a distant city can give the wrong window and even the wrong Tithi at sunrise, so location matters.",
    },
  ],
};
