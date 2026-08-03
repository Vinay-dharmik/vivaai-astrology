import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "planetary-aspects-drishti-guide",
  title: "Drishti: How Planets Aspect Each Other in Vedic Astrology",
  description:
    "The Vedic aspect system explained — why every planet aspects the seventh house, the special aspects of Mars, Jupiter and Saturn, how Drishti differs from Western aspects, and how aspect strength is graded.",
  date: "2026-04-18",
  updated: "2026-08-03",
  category: "Fundamentals",
  sources: ["bphs", "phaladeepika", "brihatJataka"],
  content: `A planet does not only affect the house it sits in. It also throws its influence across the chart to other houses, and those houses behave as though the planet were partly present in them. This is **Drishti** — aspect, literally "sight."

Vedic aspects work differently enough from Western ones that carrying assumptions across causes real confusion. Worth getting straight.

## The universal seventh aspect

**Every planet aspects the seventh house from itself with full strength.**

A planet in the first house aspects the seventh. A planet in the fourth aspects the tenth. A planet in the tenth aspects the fourth. This is the opposition, and in Vedic astrology it is not inherently hostile — it is simply full sight. What it does depends on which planet is looking and what it is looking at.

If nothing else, this rule alone accounts for a great deal. Any planet in your first house is influencing your marriage house. Any planet in your tenth is influencing your home.

## The special aspects

Three planets aspect additional houses. These are the **Vishesha Drishti**, and they are the part that has no Western equivalent.

**Mars** aspects the **4th, 7th and 8th** houses from itself.

The fourth is domestic peace and the eighth is upheaval and longevity — so Mars, wherever it sits, is putting pressure on the home and on matters of crisis. This is a substantial part of why Mars placement is watched so carefully in marriage matching: Mars in the first house aspects the fourth (home), the seventh (marriage) and the eighth (the partner's longevity), which is three of the six Manglik houses covered from a single position.

**Jupiter** aspects the **5th, 7th and 9th** houses from itself.

The fifth and ninth are the two trines other than the first — the houses of merit and fortune. Jupiter is therefore the only planet whose special aspects both fall on trines, which is the technical reason behind its reputation as the great protector. Jupiter aspecting a difficult house is one of the most commonly cited mitigating factors in the whole system.

**Saturn** aspects the **3rd, 10th and 7th** houses from itself.

The third is effort and initiative, the tenth is career. Saturn's aspect is not destructive — it is restrictive and maturing. Saturn aspecting the tenth house is a classic signature for a career that builds slowly and lasts, which is a different thing from a career that is blocked.

Some traditions add special aspects for Rahu and Ketu, usually the 5th, 7th and 9th like Jupiter. This is disputed and not universal; the majority position gives the nodes the seventh aspect only.

## Summary table

| Planet | Aspects (houses from itself) |
| --- | --- |
| Sun | 7 |
| Moon | 7 |
| Mars | 4, 7, 8 |
| Mercury | 7 |
| Jupiter | 5, 7, 9 |
| Venus | 7 |
| Saturn | 3, 7, 10 |
| Rahu / Ketu | 7 (5 and 9 in some traditions) |

## How this differs from Western aspects

Three differences that matter.

**Vedic aspects are one-directional.** In Western astrology, if A trines B then B trines A. In Vedic astrology, Jupiter in the first aspects the fifth, but a planet in the fifth does not aspect the first — it aspects the eleventh. Aspects are cast forward from the planet, and the special aspects are not symmetric. Saturn aspecting the third from itself is not reciprocated by the planet in that third house.

**Vedic aspects are primarily house-based.** The classical system counts whole houses rather than exact degrees. A planet anywhere in the seventh house from Jupiter receives Jupiter's aspect. Western astrology works from exact angular separation with an orb.

**There is no sextile, square or trine as such.** The Vedic system does not classify aspects as harmonious or hostile by angle. A seventh-house aspect from Jupiter and a seventh-house aspect from Saturn are the same geometry with completely different effects, because the nature comes from the planet rather than from the angle.

## Grading aspect strength

The house-based rule is the classical default, but the texts also describe aspects varying in strength with exact separation, and most modern practice uses some form of grading.

The usual approach treats an aspect as fullest when the two planets are close to the exact angle and tapering as the separation widens. On this site the Drik Bala component of Shadbala uses a fifteen-degree orb either side of exactness, with strength falling linearly to zero at the edge.

Parashara additionally describes graded aspects by house distance — quarter, half and three-quarter sight for certain intermediate houses — but the implementations of this differ enough between authorities that it is not a settled matter. The full-aspect list above is what nearly everyone agrees on.

## Reading aspects in practice

**Benefic aspect on a difficult house is a mitigating factor.** Jupiter aspecting the sixth, eighth or twelfth is among the most frequently cited reasons a difficult placement does not produce the difficulty the textbook predicts.

**Malefic aspect on a good house adds friction.** Saturn aspecting the fifth can delay children or education; Mars aspecting the seventh adds conflict to partnership. Neither prevents the matter — they change how it arrives.

**Mutual aspect is a strong link.** When two planets aspect each other — which given the one-directional rule requires either mutual seventh-house placement or one of the special aspects reciprocating — the two significations become genuinely entangled. This is one of the standard ways a Raja Yoga forms between an angle lord and a trine lord that are not conjunct.

**An unaspected planet acts alone.** A planet that neither aspects nor is aspected by anything operates purely on its own terms — neither rescued nor obstructed. This is more common than people expect and worth noticing, because it means nothing in the chart will moderate it.

## A worked check

Take Saturn in the fourth house. It aspects:

- The **sixth** (3rd from the 4th) — restraint applied to enemies and debt, generally read as helpful
- The **tenth** (7th from the 4th) — a slow, durable career
- The **first** (10th from the 4th) — a serious, self-disciplined temperament, and pressure on vitality

So a single Saturn placement is doing work in four houses. Reading only "Saturn in the fourth means difficulty with the mother or the home" captures a quarter of what is going on.

This is why aspect-aware reading changes charts substantially. Most free reports list placements and ignore Drishti entirely, which discards most of the structure.

## In your chart

Your [free Kundali report](/kundali) computes all aspects including the special ones, uses them in yoga detection, feeds them into the Drik Bala component of Shadbala, and names which planets aspect each planet in the per-planet analysis — separating benefic sight from malefic sight, since the distinction is what determines the effect.`,
  faqs: [
    {
      q: "Do Rahu and Ketu cast aspects?",
      a: "The majority view gives them the seventh-house aspect like any other graha. Some traditions add the fifth and ninth, treating them like Jupiter. This is genuinely disputed rather than settled, and practitioners differ.",
    },
    {
      q: "Why does Mars aspect the 4th and 8th specifically?",
      a: "The classical texts state the rule without deriving it. The thematic reading usually offered is that Mars, as the graha of force and separation, naturally presses on the house of domestic peace and the house of upheaval — but that is an explanation applied afterwards, not the reason given in the source.",
    },
    {
      q: "Is a seventh-house aspect bad, like a Western opposition?",
      a: "No. Vedic aspects carry no inherent quality from the angle. A seventh aspect from Jupiter is protective; the same aspect from Saturn is restrictive. The nature comes entirely from the planet doing the aspecting.",
    },
    {
      q: "Does aspect strength depend on exact degrees?",
      a: "The classical default is whole-house, so any planet in the aspected house receives it. Most modern practice grades it by exactness, and this site uses a fifteen-degree orb with strength tapering to zero at the edge for the Shadbala calculation. Both approaches are defensible.",
    },
  ],
};
