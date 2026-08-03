import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "kundali-matching-ashtakoot-guide",
  title: "Ashtakoot Guna Milan: What the 36 Points Actually Measure",
  description:
    "The eight Koots of Vedic marriage matching, what each one weighs and why, how the score is computed, the Nadi and Bhakoot exceptions, and an honest account of what a 36-point score can and cannot tell you.",
  date: "2026-01-18",
  updated: "2026-08-03",
  category: "Matching",
  sources: ["bphs", "saravali", "jatakaParijata"],
  content: `Guna Milan is the best-known procedure in Indian astrology and the least understood. Families quote scores out of 36 with great confidence and rarely know that the entire calculation rests on one variable per person — the Moon's Nakshatra — or that half the total comes from a single Koot.

Here is what the eight Koots weigh, how the arithmetic works, and where the system's own authorities disagree.

## What the inputs are

**The Moon's Nakshatra and Rashi for each person. That is all.**

Nothing else enters the Ashtakoot calculation. Not the Ascendant, not the seventh house, not the seventh lord, not Venus, not the Dashas. This is worth stating plainly because it explains both the system's convenience — two data points per person — and its limits.

## The eight Koots

| Koot | Points | Measures |
| --- | --- | --- |
| Varna | 1 | Work orientation and temperament |
| Vashya | 2 | Mutual influence and control |
| Tara | 3 | Health, fortune, destiny compatibility |
| Yoni | 4 | Physical and sexual compatibility |
| Graha Maitri | 5 | Mental affinity and friendship |
| Gana | 6 | Temperament and behavioural type |
| Bhakoot | 7 | Family welfare and prosperity |
| Nadi | 8 | Health, genetics, progeny |
| **Total** | **36** | |

Note the weighting. **Nadi and Bhakoot together are 15 of 36 — more than 40 percent.** A couple can be well matched on the six other Koots and still score badly because these two dominate.

### Varna (1 point)

Divides the twelve signs into four groups: Brahmin (water signs), Kshatriya (fire), Vaishya (earth), Shudra (air). The point is awarded if the man's Varna equals or exceeds the woman's in a traditional hierarchy.

This is the Koot most obviously carrying assumptions of its period, and it is worth one point out of thirty-six — the system's own weighting treats it as marginal.

### Vashya (2 points)

Groups signs by a different scheme — quadruped, human, water-dwelling, insect, wild — and scores mutual influence. It is read as which partner has more natural sway over the other.

### Tara (3 points)

Counts the Nakshatra distance between the two Moons in both directions, divides each by nine, and reads the remainder. Remainders of 3, 5 and 7 are inauspicious. Points are awarded according to whether one, both or neither direction lands on a bad remainder.

### Yoni (4 points)

Each of the 27 Nakshatras is assigned an animal — horse, elephant, sheep, serpent, dog, cat, rat, cow, buffalo, tiger, deer, monkey, mongoose, lion. Compatibility follows a table of natural relationships between the animals.

Same animal scores the full 4. Natural enemies — cat and rat, serpent and mongoose, cow and tiger, elephant and lion — score 0 or 1. This is read for physical and sexual compatibility.

### Graha Maitri (5 points)

Compares the **lords of the two Moon signs** and scores their natural friendship. Mutual friends score 5, mutual enemies 0, mixed relationships fall between.

This is the Koot most directly about mental and intellectual affinity, and at 5 points it carries real weight. Because it depends on sign lords, two people with Moons in different signs ruled by the same planet — Gemini and Virgo, say, both Mercury — score full marks here automatically.

### Gana (6 points)

Sorts the 27 Nakshatras into three temperaments: **Deva** (divine — gentle, principled), **Manushya** (human — mixed, practical), **Rakshasa** (demonic — forceful, self-directed).

Same Gana scores the full 6. Deva with Manushya scores 5 or 6. **Deva with Rakshasa scores 0** and is the pairing the texts treat most seriously here.

The names are unhelpful. Rakshasa Gana does not mean a bad person — it describes a forceful, independent, sometimes blunt temperament, and includes Nakshatras associated with considerable achievement.

### Bhakoot (7 points)

Counts the distance between the two Moon **signs** in both directions. Certain relationships score zero outright:

- **6 and 8** (Shadashtaka) — read as risk to health and to the marriage's longevity
- **9 and 5** (Navam-Pancham) — read as difficulty with children
- **2 and 12** (Dwirdwadasha) — read as financial strain

Everything else scores the full 7. Bhakoot is therefore all-or-nothing: seven points or zero, with no middle. A single unlucky sign relationship removes nearly a fifth of the total score.

### Nadi (8 points)

The largest single Koot. Each Nakshatra is assigned one of three Nadis — **Aadi**, **Madhya**, **Antya** — loosely corresponding to the Ayurvedic constitutional types Vata, Pitta and Kapha.

**Different Nadi scores the full 8. Same Nadi scores 0.**

There is no partial credit. Nadi Dosha is the single most common reason a match fails, and because it is 8 points, a same-Nadi couple starts from a maximum possible score of 28.

The traditional reasoning is genetic — that constitutionally similar parents produce weaker progeny. Whether one accepts that reasoning or not, it is the stated basis.

## How the score is read

| Score | Traditional reading |
| --- | --- |
| 31 to 36 | Excellent |
| 26 to 30 | Very good |
| 21 to 25 | Acceptable, the usual working threshold |
| 18 to 20 | Marginal; requires further analysis |
| Below 18 | Not recommended on this method alone |

**18 is the conventional minimum.** In practice most astrologers treat anything above 21 as workable and anything below 18 as requiring the rest of the chart to make the case.

## The exceptions

The texts list conditions under which Nadi and Bhakoot Dosha do not apply. These are routinely omitted from automated reports.

**Nadi Dosha is cancelled if:**
- Both partners have the same Moon sign but different Nakshatras
- Both have the same Nakshatra but different Padas
- The Moon sign lords of the two charts are the same planet
- The two Moons are in the same sign

**Bhakoot Dosha is cancelled if:**
- The lords of the two Moon signs are friends, or are the same planet
- Graha Maitri scores full marks
- Both Moons are in signs ruled by the same planet

These exceptions are common enough in practice that a raw score reported without checking them is frequently misleading. Our [matching tool](/matching) applies them and reports which cancellation fired.

## What the system does not check

This is the honest part, and it matters more than the score.

Ashtakoot uses two data points per person. It does not look at:

- The **seventh house** or its lord in either chart — the actual house of marriage
- **Venus**, the natural significator of the spouse
- **Manglik Dosha** — this is a separate check entirely, covered in the [Manglik guide](/blog/manglik-dosha-complete-guide)
- The **Navamsa**, which classical practice treats as the primary chart for marriage
- The **Dasha periods** either person is running or about to enter
- **Longevity indications** in either chart

A high Guna score with a badly afflicted seventh house in both charts is not a good match, and a low score with strong seventh houses and a supportive Navamsa is frequently a workable one. Competent practitioners treat the 36 points as a first filter, not a verdict.

## An honest closing note

Guna Milan was designed for arranged marriages between families who did not know each other, as a screening tool. It is very good at that job and it was never intended to be the last word.

If two people who know each other well are given a score of 19 and take it as a reason not to marry, the system is being asked to do something it was not built for. The scores are a starting point for a conversation with someone who can read both charts properly — not a result to act on directly.

## Run a match

The [Kundali matching tool](/matching) computes all eight Koots from both Moon positions, applies the classical cancellation conditions, and reports which Koot lost points and why — rather than only a total out of 36.`,
  faqs: [
    {
      q: "What is a good Guna Milan score?",
      a: "18 out of 36 is the conventional minimum and 21 or above is generally treated as workable. But the score alone decides nothing: it is computed from only the two Moon positions and ignores the seventh house, Venus, the Navamsa and the Dashas.",
    },
    {
      q: "Can Nadi Dosha be cancelled?",
      a: "Yes. The texts list several conditions, including both partners having the same Moon sign with different Nakshatras, the same Nakshatra with different Padas, or Moon sign lords that are the same planet. These exceptions are common and are omitted from most automated reports.",
    },
    {
      q: "Why is Nadi worth 8 points?",
      a: "It is the largest single Koot because it is read for health and progeny, which the tradition treats as the most consequential outcomes of a marriage. The result is that a same-Nadi couple can score at most 28 out of 36 regardless of how well matched they are otherwise.",
    },
    {
      q: "Does a low score mean the marriage will fail?",
      a: "No. Guna Milan is a screening tool built for matches between families who did not know each other. It measures eight specific compatibility factors from two data points and does not assess the marriage houses in either chart. A low score means look closer, not stop.",
    },
  ],
};
