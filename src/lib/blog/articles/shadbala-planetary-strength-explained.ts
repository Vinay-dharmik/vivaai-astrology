import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "shadbala-planetary-strength-explained",
  title: "Shadbala: Measuring Whether a Planet Can Actually Deliver",
  description:
    "The six-fold strength system explained component by component — Sthana, Dig, Kala, Cheshta, Naisargika and Drik Bala — with the arithmetic, Parashara's required minimums, and what a planet scoring below its minimum actually means for a chart.",
  date: "2026-02-10",
  updated: "2026-08-03",
  category: "Advanced",
  sources: ["bphs", "phaladeepika"],
  content: `There is a gap in most chart readings between what a planet promises and whether it can produce it. A chart can show Jupiter ruling the ninth house from the ninth house — textbook fortune — in a person whose life shows no sign of it. The usual explanation is that "the planet is weak," which raises the obvious question: weak by how much, and measured how?

Shadbala is the classical answer. Six separate measurements, added together, compared against a required minimum that differs for each planet. It is the most quantitative thing in Vedic astrology and, for that reason, the most checkable.

## The unit

Everything is measured in **Virupas**. Sixty Virupas make one **Rupa**. Most individual components max out at 60 Virupas, which is one Rupa, so the totals land in the range of five to nine Rupas for a typical planet.

## The six strengths

### 1. Sthana Bala — positional strength

The largest and most complex component. Five sub-parts:

**Uchcha Bala (exaltation strength).** Every planet has an exact exaltation degree and an exact debilitation degree 180 degrees opposite. Uchcha Bala is proportional to the distance from the debilitation point:

**Uchcha Bala = (angular distance from debilitation point ÷ 180) × 60**

A planet exactly on its exaltation degree scores the full 60. On its debilitation degree it scores 0. The exaltation points are: Sun at Aries 10, Moon at Taurus 3, Mars at Capricorn 28, Mercury at Virgo 15, Jupiter at Cancer 5, Venus at Pisces 27, Saturn at Libra 20.

Note that this is a smooth gradient, not a switch. A planet three degrees from exaltation is nearly as strong as one exactly on it — the language of "exalted" and "debilitated" as binary states does not survive contact with the actual formula.

**Saptavargaja Bala (divisional strength).** The planet's dignity is assessed across seven divisional charts and scored: Moolatrikona 45, own sign 30, great friend 22.5, friend 15, neutral 7.5, enemy 3.75, great enemy 1.875. A planet in its own sign in several divisions accumulates a lot here.

**Ojhayugmarasyamsa Bala (odd/even strength).** The Moon and Venus gain 15 Virupas for occupying an even sign, and another 15 for an even Navamsa. Every other planet gains the same for odd signs. This encodes the tradition's gendering of the grahas.

**Kendradi Bala (angular strength).** 60 Virupas in an angle (1, 4, 7, 10), 30 in a succedent house (2, 5, 8, 11), 15 in a cadent house (3, 6, 9, 12).

**Drekkana Bala (decanate strength).** Male planets — Sun, Mars, Jupiter — gain 15 in the first third of a sign. Neuter planets — Mercury, Saturn — in the second third. Female planets — Moon, Venus — in the last third.

### 2. Dig Bala — directional strength

Each planet has a direction where it is strongest, expressed as a house:

| Planet | Strongest in | Direction |
| --- | --- | --- |
| Jupiter, Mercury | 1st house | East |
| Sun, Mars | 10th house | South |
| Saturn | 7th house | West |
| Moon, Venus | 4th house | North |

**Dig Bala = (angular distance from the weakest point ÷ 180) × 60**

The weakest point is directly opposite the strongest. Saturn, strongest in the seventh, is weakest in the first — which is worth knowing if you have Saturn on your Ascendant.

The logic is intuitive once stated. Jupiter, the counsellor, is strongest rising. The Sun is strongest at the top of the sky. Saturn, the planet of endings, is strongest setting. The Moon is strongest at the bottom of the chart, at midnight, at home.

### 3. Kala Bala — temporal strength

Strength from when you were born. Several sub-components:

**Nathonnatha Bala.** The Moon, Mars and Saturn are strongest at local midnight; the Sun, Jupiter and Venus at local noon. Mercury scores the full 60 regardless. The value slides linearly between the two extremes.

**Paksha Bala.** Natural benefics — Jupiter, Venus, Mercury, an unafflicted Moon — gain strength as the Moon waxes. Natural malefics gain as it wanes. At full moon the benefics score 60 and the malefics 0. The Moon's own Paksha Bala is doubled.

**Ayana Bala.** Strength from declination — how far north or south of the celestial equator a planet is. Most planets gain from northern declination; Saturn and Mars prefer southern. Mercury benefits from declination in either direction.

**Vara Bala.** The ruler of the weekday of birth gets 45 Virupas.

**Hora Bala.** The ruler of the planetary hour of birth gets 60. The hours run in Chaldean order, starting with the weekday's own lord at sunrise.

**Abda, Masa and Tribhaga Bala** are the remaining classical components — year lord, month lord, and the thirds of day and night. These depend on regional calendar conventions that genuinely differ between traditions, and this site omits them rather than picking one convention and presenting the resulting total as complete. Where you see our Shadbala figures, the Kala Bala covers the five components listed above and the omission is stated on the page.

### 4. Cheshta Bala — motional strength

Strength from apparent motion. This is the component that produces the most counterintuitive result in the system: **a retrograde planet receives the full 60 Virupas**, the maximum.

The classical reasoning is that a planet appearing to move backwards is doing something unusual and therefore acting with unusual force. In practice a retrograde planet tends to produce results that arrive out of sequence, get revisited, or require a second attempt — insistent rather than smooth.

The eightfold classification of motion runs from Vakra (retrograde, 60) through Vikala (stationary, 15), Manda (slow), Sama (mean), Chara (fast) and Atichara (very fast). The Sun and Moon never retrograde, so Parashara substitutes the Sun's Ayana Bala and the Moon's Paksha Bala in place of their Cheshta Bala.

### 5. Naisargika Bala — natural strength

A fixed value per planet, ordered by apparent brightness:

Sun 60, Moon 51.43, Venus 42.85, Jupiter 34.28, Mercury 25.70, Mars 17.14, Saturn 8.57.

These are 60 divided by 1 through 7 in sequence. It contributes nothing that distinguishes one chart from another, but it shifts the baseline — which is part of why Saturn's required minimum is low and Mercury's is high.

### 6. Drik Bala — aspectual strength

The net effect of aspects received. Benefic aspects add, malefic aspects subtract, and both are weighted by how exact the aspect is. Parashara divides the net result by four.

Every planet casts a full aspect on the seventh house from itself. Mars additionally aspects the fourth and eighth, Jupiter the fifth and ninth, Saturn the third and tenth. See the [Drishti guide](/blog/planetary-aspects-drishti-guide) for the detail.

## The required minimums

This is the part that makes Shadbala usable. Parashara gives a required total for each planet:

| Planet | Required (Rupas) |
| --- | --- |
| Sun | 5.0 |
| Moon | 6.0 |
| Mars | 5.0 |
| Mercury | 7.0 |
| Jupiter | 6.5 |
| Venus | 5.5 |
| Saturn | 5.0 |

**The ratio of a planet's total to its requirement matters far more than the raw total.** Mercury scoring 6.5 Rupas is below strength, at 93 percent of its minimum. Saturn scoring 6.5 is comfortably strong, at 130 percent. Comparing raw totals across planets tells you almost nothing; comparing ratios tells you a great deal.

## Reading the result

**Above 100 percent.** The planet can deliver what it signifies and what it rules, on a reasonable schedule, without extraordinary effort. Its Dasha periods tend to produce their results.

**Around 100 percent.** Sufficient, with no margin. It performs when the rest of the chart supports it and falters under pressure.

**Below 100 percent.** The planet still signifies its matters — a weak seventh lord does not mean no marriage. What it means is that the results arrive late, partially, or only after repeated effort, and that the person tends to experience that area of life as requiring more from them than it seems to require from others.

The most useful single question Shadbala answers: **when a chart shows a strong promise that has not materialised, is the promising planet actually able to act?** Very often the answer is no, and that is more informative than another paragraph of interpretation.

## What Shadbala is not

It is not a ranking of how good your planets are. A functionally malefic planet with high Shadbala is a strong functional malefic — its Dasha will be more emphatic, not more pleasant. Strength describes capacity to act, and what it acts on is decided by lordship and placement.

It also does not settle disagreements about interpretation. It tells you a planet has the resources to produce its results. What those results are remains a question for the rest of the chart.

## See your own figures

Your [free Kundali report](/kundali) computes all six components for the seven classical planets, shows the total in Rupas against each planet's required minimum, and breaks out which component contributed most and least. The per-planet analysis uses the ratio directly when assessing whether a placement can deliver what it promises.`,
  faqs: [
    {
      q: "Why does a retrograde planet get maximum Cheshta Bala?",
      a: "The classical reasoning is that unusual motion indicates unusual force. In practice, a retrograde planet tends to produce results that are insistent and repeatedly revisited rather than smooth — the strength is real but it does not always feel comfortable.",
    },
    {
      q: "My planet has high Shadbala but my life in that area is difficult. Why?",
      a: "Shadbala measures capacity to act, not whether the action is welcome. A strong lord of the sixth, eighth or twelfth acts strongly on the affairs of those houses. Strength and benefic function are independent questions.",
    },
    {
      q: "Why does Mercury need 7 Rupas when Saturn only needs 5?",
      a: "The required minimums compensate for Naisargika Bala, the fixed natural strength, which runs from 60 for the Sun down to 8.57 for Saturn. Saturn starts from a much lower base, so a lower requirement puts the planets on comparable footing.",
    },
    {
      q: "Is Shadbala the only strength measure in Vedic astrology?",
      a: "No. Bhava Bala measures house strength rather than planetary strength, Vimshopaka Bala scores dignity across divisional charts, and Ashtakavarga measures support by sign. Shadbala is the most comprehensive of the planetary measures and the one most often quoted.",
    },
  ],
};
