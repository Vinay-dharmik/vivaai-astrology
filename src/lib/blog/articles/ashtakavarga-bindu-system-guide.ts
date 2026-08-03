import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "ashtakavarga-bindu-system-guide",
  title: "Ashtakavarga: Scoring Every Sign in Your Chart",
  description:
    "The bindu system explained from the tables up — how Bhinnashtakavarga is built from eight reference points, why the totals must come to 337, how to read Sarvashtakavarga scores, and how the system is used to judge transits.",
  date: "2026-02-24",
  updated: "2026-08-03",
  category: "Advanced",
  sources: ["bphs"],
  content: `Most chart analysis asks what sits in a house. Ashtakavarga asks a different and often more useful question: how much support does this part of the chart receive from everything else in it?

The answer comes out as a number between roughly 18 and 40 per sign, and once you have those twelve numbers a great deal becomes easier to judge — particularly transits, which are otherwise the vaguest part of predictive work.

## The idea

**Ashtakavarga** means "eight divisions." For each planet, its position is scored against eight reference points: the other six classical planets, itself, and the Ascendant.

For each reference point, the classical texts list the houses — counted from that reference point — in which the planet gives a benefic result. If the planet lands in one of those houses, it earns one **bindu**, or point. If not, it earns nothing.

Do this for all eight reference points and you get that planet's score for each of the twelve signs. That table is its **Bhinnashtakavarga**, its individual chart. Sum the seven individual charts and you get the **Sarvashtakavarga**, the combined score per sign.

## The tables

Here are the benefic places for the Sun's Ashtakavarga, as an example of what the source material looks like. Each row reads: counted from this planet, the Sun is benefic in these houses.

| From | Benefic houses |
| --- | --- |
| Sun | 1, 2, 4, 7, 8, 9, 10, 11 |
| Moon | 3, 6, 10, 11 |
| Mars | 1, 2, 4, 7, 8, 9, 10, 11 |
| Mercury | 3, 5, 6, 9, 10, 11, 12 |
| Jupiter | 5, 6, 9, 11 |
| Venus | 6, 7, 12 |
| Saturn | 1, 2, 4, 7, 8, 9, 10, 11 |
| Lagna | 3, 4, 6, 10, 11, 12 |

Count them: 8 + 4 + 8 + 7 + 4 + 3 + 8 + 6 = 48. That is the total number of bindus in the Sun's chart, spread across twelve signs.

The seven planets have their own tables, with these totals:

| Planet | Total bindus |
| --- | --- |
| Sun | 48 |
| Moon | 49 |
| Mars | 39 |
| Mercury | 54 |
| Jupiter | 56 |
| Venus | 52 |
| Saturn | 39 |

**48 + 49 + 39 + 54 + 56 + 52 + 39 = 337.**

That figure is the check. Any correctly computed Sarvashtakavarga sums to exactly 337 across the twelve signs, always, for every chart. If a program gives you a different total it has a bug, and this is the easiest way to test one. Average per sign is 337 divided by 12, which is 28.08.

## Worked example

Suppose the Moon is in Taurus and we are computing the Sun's bindus. From the Moon, the Sun is benefic in houses 3, 6, 10 and 11.

Counting from Taurus, and remembering that "the 3rd from" is inclusive of the starting sign:

- 3rd from Taurus is Cancer
- 6th from Taurus is Libra
- 10th from Taurus is Aquarius
- 11th from Taurus is Pisces

So the Moon contributes one bindu each to Cancer, Libra, Aquarius and Pisces in the Sun's chart. Repeat for the other seven reference points, add up per sign, and the Sun's Bhinnashtakavarga is complete.

The one thing that trips people up: counting is inclusive. The 1st from Taurus is Taurus, not Gemini.

## Reading Sarvashtakavarga

The twelve Sarva totals tell you which areas of life are well supplied and which are not.

| Bindus | Reading |
| --- | --- |
| 33 or more | Very well supported |
| 29 to 32 | Well supported |
| 25 to 28 | Average |
| 21 to 24 | Thin support |
| 20 or fewer | Poorly supported |

A house with 33 bindus tends to produce results with less effort than the raw placements would suggest. A house with 20 tends to be harder work than the chart appears to promise. This is often what explains the discrepancy between a chart that reads well and a life that has not gone that way — the promising houses are sitting on thin support.

Some practical rules from the texts:

- The **Ascendant sign** with high bindus indicates general vitality and resilience.
- The **10th house** with high bindus supports career without a fight.
- **Houses 6, 8 and 12 with high bindus** are read differently: strong difficult houses can indicate capacity to overcome enemies and illness rather than more of them.
- A sign with fewer than 25 bindus is a place where you should expect to spend more than you get back, particularly during transits.

## Reading Bhinnashtakavarga

The individual charts are read planet by planet. The number that matters most is **a planet's own bindus in the sign it actually occupies**.

- **6 or more** — the planet can act freely there
- **4 to 5** — it works, with effort
- **3 or fewer** — it is obstructed

A planet with high Shadbala but low bindus in its own sign is strong but constrained: it has the capacity and not the room. The reverse — low Shadbala, high bindus — describes a planet with the room and not the capacity. Both are common and both explain otherwise puzzling charts.

## Using it for transits

This is where Ashtakavarga earns its place, because transit interpretation is otherwise nearly unfalsifiable.

**Saturn's transit** is the standard application. Saturn takes about two and a half years per sign, and the difference between Saturn transiting a sign with 6 bindus in its own Bhinnashtakavarga and one with 1 is the difference between a demanding but productive stretch and a genuinely difficult one. Sade Sati is read the same way — see the [Sade Sati guide](/blog/sade-sati-saturn-transit-guide) — and the bindu count is why one person's Sade Sati is career-defining and another's is punishing.

**Jupiter's transit** through a sign with high Sarva bindus tends to deliver on its reputation. Through a low-bindu sign it often passes without much.

**The general rule**: a planet transiting a sign where it holds 5 or more of its own bindus produces results in line with its nature. Below 3, it tends to cost more than it returns.

This gives transit work something it usually lacks — a number computed before the fact rather than a story assembled after it.

## Reductions

The classical texts describe two further operations, **Trikona Shodhana** (trinal reduction) and **Ekadhipatya Shodhana** (reduction for planets ruling two signs), applied before using the figures for certain longevity calculations.

These are genuinely disputed. Different authorities apply them in different orders, and some apply only one. This site reports the unreduced figures, which is what the great majority of software shows and what the transit rules above are calibrated against. If you are following a text that assumes reduced values, be aware the numbers will differ.

## What it does not do

Ashtakavarga measures support, not outcome. A sign with 35 bindus containing a debilitated functional malefic is still a difficult placement — well supported, but supporting something difficult. The bindus tell you how much the rest of the chart backs that part of the map. They do not tell you what is drawn on it.

It also says nothing about timing on its own. Bindus are static; they describe the chart's terrain. Dasha and transit supply the movement across it.

## See your own

Your [free Kundali report](/kundali) includes the full Bhinnashtakavarga grid for all seven planets, the Sarvashtakavarga total per house, and each planet's own bindus in the sign it occupies — the last of which feeds directly into the per-planet strength assessment. The Sarva total is displayed so you can confirm it comes to 337.`,
  faqs: [
    {
      q: "Why must the Sarvashtakavarga total be 337?",
      a: "Because the seven benefic-place tables are fixed and contain a fixed number of entries: 48 + 49 + 39 + 54 + 56 + 52 + 39. Every entry places exactly one bindu somewhere, so the grand total is the same for every chart regardless of where the planets are. It is the simplest available test of whether software has implemented the tables correctly.",
    },
    {
      q: "Should I use reduced or unreduced bindus?",
      a: "For transit judgement, unreduced — that is what almost all software reports and what the standard thresholds are calibrated against. The reductions, Trikona Shodhana and Ekadhipatya Shodhana, belong to specific longevity techniques and are applied inconsistently between authorities.",
    },
    {
      q: "Are Rahu and Ketu included?",
      a: "Not in the classical seven-planet Ashtakavarga. Some later authorities construct tables for the nodes, but they are not part of the standard system and are not included in the 337 total.",
    },
    {
      q: "What does it mean if my Ascendant sign has very few bindus?",
      a: "The first house governs vitality and general resilience, so low support there is usually read as needing to be more deliberate about health and energy than the chart's other indications alone would suggest. It is a statement about the terrain, not a prediction.",
    },
  ],
};
