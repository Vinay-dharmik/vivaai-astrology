import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "how-to-read-north-indian-birth-chart",
  title: "How to Read a North Indian Birth Chart, Step by Step",
  description:
    "The diamond chart decoded — how the twelve houses are laid out, why the numbers in the boxes are signs rather than houses, how it differs from the South Indian square, and a working order for reading any chart you are handed.",
  date: "2026-03-08",
  updated: "2026-08-03",
  category: "Basics",
  sources: ["bphs", "brihatJataka"],
  content: `The North Indian chart is a square with two diagonals and a diamond inscribed through the midpoints of the sides. It looks like a geometry exercise, and the first time someone hands you one it is genuinely hard to tell which region is which house.

Once you know the construction it becomes easy, and it never changes — the layout is identical for every chart ever drawn in this style.

## The construction

Draw a square. Draw both diagonals, corner to corner. Then draw a diamond connecting the midpoints of the four sides.

That produces exactly twelve regions:

- Four **rhombi** at the centre — top, left, bottom, right
- Eight **triangles**, two in each corner

## Where the houses go

**House 1 is the top-centre rhombus. Always.** Then count anticlockwise.

Reading it out in full:

| House | Position |
| --- | --- |
| 1 | Top centre rhombus |
| 2 | Upper left triangle of the top-left corner |
| 3 | Lower left triangle of the top-left corner |
| 4 | Left rhombus |
| 5 | Upper triangle of the bottom-left corner |
| 6 | Lower triangle of the bottom-left corner |
| 7 | Bottom centre rhombus |
| 8 | Lower triangle of the bottom-right corner |
| 9 | Upper triangle of the bottom-right corner |
| 10 | Right rhombus |
| 11 | Lower triangle of the top-right corner |
| 12 | Upper triangle of the top-right corner |

The four rhombi are the four angles — houses 1, 4, 7 and 10. That is worth committing to memory on its own, because the angles carry the structure of the chart.

Note the direction. Anticlockwise for houses feels wrong to anyone used to clock faces, and it is the single most common source of beginner confusion.

## The number in each box is a sign, not a house

This is the point where most people go wrong.

**The house positions are fixed. The numbers written in the boxes are zodiac signs.**

The number in the top-centre rhombus tells you which sign is rising — your Ascendant. 1 means Aries, 2 Taurus, 3 Gemini, and so on to 12 for Pisces. Every subsequent house then carries the next sign in order.

So a chart with 7 in the top box is a Libra Ascendant. The second house will show 8 (Scorpio), the third 9 (Sagittarius), and so on, wrapping from 12 back to 1.

This is why the North Indian chart is called **house-centric**: the houses hold still and the signs move. It makes house-based reading fast, because the first house is always in the same place on the page no matter whose chart you are looking at.

## The South Indian chart does the opposite

The South Indian chart is a four-by-four grid with the middle four cells empty, giving twelve cells around the edge. Here the **signs** are fixed and the **houses** move.

Aries is always the second cell of the top row. Taurus is next to it, and the signs run clockwise from there. The Ascendant is marked with a diagonal line or the label "Asc" in whichever cell holds the rising sign, and you count houses clockwise from there.

Both charts contain identical information. The choice is regional convention and personal habit, not accuracy. Practitioners used to one often find the other briefly unreadable, which is why our [Kundali tool](/kundali) draws both from the same data with a single switch.

## Notation inside the boxes

Planets are written with two-letter abbreviations: Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke.

Most charts add the degree within the sign next to the abbreviation, because degrees matter for several things: exact conjunction, exaltation strength, and which Nakshatra Pada the planet falls in.

**Retrograde** is marked with an R, sometimes with the symbol ℞, and occasionally by writing the planet in a different colour. Only Mercury through Saturn retrograde. Rahu and Ketu are always retrograde and are usually not marked, since it would be redundant. The Sun and Moon never retrograde.

**Combustion** — a planet too close to the Sun to be visible — is sometimes marked with an asterisk or by dimming the text. Not every chart shows it.

## A working reading order

Given a chart you have never seen, this is a sequence that gets you somewhere useful without needing to memorise a table of meanings.

**1. Find the Ascendant.** Read the number in the top rhombus. This decides everything about lordship, so nothing else can be assessed until you have it.

**2. Locate the Ascendant lord.** Which sign rules the first house, and where is that planet sitting? A first lord in an angle or trine is a strong chart. A first lord in the sixth, eighth or twelfth is a chart where the person's own trajectory keeps running through difficulty.

**3. Find the Moon.** The Moon's sign is the Rashi, which Vedic astrology weights more heavily than the Sun sign, and the Moon's Nakshatra sets the entire Dasha timeline. Then read the chart a second time treating the Moon's sign as the first house — this is the **Chandra Lagna**, and classical practice is to check every important conclusion from both.

**4. Identify the Yogakaraka, if there is one.** For six Ascendants a single planet rules both an angle and a trine, and is the most reliable source of good in the chart:

| Ascendant | Yogakaraka |
| --- | --- |
| Taurus | Saturn |
| Cancer | Mars |
| Leo | Mars |
| Libra | Saturn |
| Capricorn | Venus |
| Aquarius | Venus |

For the other six Ascendants there is no single Yogakaraka and the good is distributed across several planets.

**5. Note the functional malefics.** Whichever planets rule the sixth, eighth and twelfth from this Ascendant carry the difficulties of those houses wherever they sit — regardless of whether they are natural benefics.

**6. Check the angles and trines for occupancy.** Planets in houses 1, 4, 7, 10, 5 and 9 do more visible work than planets in the cadent houses.

**7. Only then read individual placements.** By this point you know what each planet rules, whether it is functionally helpful, and how much structural weight its house carries. A placement read without those three facts is a placement read out of context.

## Common mistakes

**Counting houses clockwise.** They run anticlockwise. Every time.

**Reading the box numbers as house numbers.** They are signs. The houses are the positions.

**Treating the Sun sign as primary.** In Vedic practice the Moon sign and the Ascendant both outrank it.

**Assuming a natural malefic is bad here.** Saturn ruling a trine protects. Jupiter ruling the sixth and twelfth causes friction. Function beats nature.

**Ignoring degrees.** Two planets in the same sign are only genuinely conjunct if they are close in degree. Fifteen degrees apart in the same sign is not a conjunction in any meaningful sense.

## Practice on your own

Generate your chart with the [free Kundali tool](/kundali) and work through the seven steps above. It draws both North and South Indian layouts, shows degrees and retrograde marks, and lets you tap any house to see what it governs and what occupies it — which is a faster way to learn the layout than memorising the table.

When the layout is familiar, the [Navamsa guide](/blog/navamsa-d9-chart-guide) covers the second chart every Vedic astrologer reads alongside this one.`,
  faqs: [
    {
      q: "Why do houses run anticlockwise in the North Indian chart?",
      a: "It reflects the apparent motion of the zodiac past the Ascendant. Signs rise in the east and move through the houses in that direction. The convention is fixed and universal for this chart style.",
    },
    {
      q: "Which is better, North Indian or South Indian?",
      a: "Neither. They contain identical information in different arrangements. North Indian keeps the houses in fixed positions, which suits house-based analysis; South Indian keeps the signs fixed, which suits sign-based and Jaimini techniques. Most practitioners simply use whichever they learned first.",
    },
    {
      q: "What does the number in the top box mean?",
      a: "It is your Ascendant sign, numbered 1 for Aries through 12 for Pisces. It is not the house number — the top-centre rhombus is always the first house, in every North Indian chart.",
    },
    {
      q: "Why is there an East Indian chart too?",
      a: "Bengal, Odisha and Assam use a third layout — a square divided into nine cells with the corner cells split diagonally. It is house-centric like the North Indian chart but drawn differently. All three encode the same information.",
    },
  ],
};
