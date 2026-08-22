import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "nakshatra-compatibility-marriage-guide",
  title: "Nakshatra Compatibility for Marriage: Gana, Yoni, Nadi and Graha Maitri",
  description:
    "How the Moon's Nakshatra drives Vedic marriage matching — the four Nakshatra-based factors of the Ashtakoot system explained with their scoring, the Nadi and Gana doshas, and when a low score genuinely warrants caution.",
  date: "2026-03-01",
  updated: "2026-08-03",
  category: "Matching",
  sources: ["bphs", "saravali", "jatakaParijata"],
  content: `Vedic marriage matching rests on one point in each chart: the degree the Moon occupied at birth. That degree fixes the person's **Nakshatra** — one of 27 lunar mansions, each spanning 13°20′ of the zodiac — and the Nakshatra is what the matching system compares. Not the sun sign, not the ascendant. The Moon, because in this tradition the Moon carries the mind and the emotional constitution, and marriage is treated as a meeting of those before it is anything else.

Four of the eight Ashtakoot factors are computed directly from the two Nakshatras. They are the ones this article covers, because they are where most of the weight and nearly all of the folklore sit.

## Why the Nakshatra and not the sign

A zodiac sign is thirty degrees wide and the Moon crosses it in roughly two and a quarter days. A Nakshatra is less than half that width. Two people born days apart can share a Moon sign and fall in different Nakshatras with different rulers, different ganas and different nadis — and the matching will treat them completely differently. The finer unit is the whole point: it lets the system distinguish charts that a sign-level comparison would call identical.

Every Nakshatra carries a fixed set of attributes assigned by the classical texts — a planetary ruler, a gana, a yoni animal, a nadi. The matching is really a comparison of those attributes between the two birth stars.

## Gana — temperament (6 points)

Gana sorts the 27 Nakshatras into three natures:

- **Deva (divine)** — gentle, principled, accommodating.
- **Manushya (human)** — balanced, worldly, a mix of the other two.
- **Rakshasa (demonic)** — intense, self-willed, forceful. The label is unfortunate; it denotes drive and independence, not malice.

Same-gana pairs score the full 6. Deva with Manushya scores well. The combination the texts flag is **Deva with Rakshasa**, which scores lowest — the gentleness of one meeting the force of the other. This is called **Gana dosha**, and it is real but frequently overstated; it speaks to a difference in temperament that many couples navigate without difficulty, and it is routinely cancelled when other factors between the charts are strong.

## Yoni — physical and instinctive compatibility (4 points)

Each Nakshatra is assigned an animal — horse, elephant, sheep, serpent, dog, cat, rat, cow, buffalo, tiger, deer, monkey, mongoose, lion. Yoni scores the compatibility of the two animals: the same animal scores maximum, friendly species score well, and a few pairs are classed as natural enemies (cat and rat, serpent and mongoose, cow and tiger, and so on) and score lowest.

Yoni is traditionally read as physical and instinctive compatibility — the level of attraction and bodily ease between partners. It carries only 4 of the 36 points, so a poor Yoni score alone rarely decides a match, but the enemy pairings are worth noting because they describe a friction that tends to persist rather than resolve.

## Graha Maitri — mental compatibility (5 points)

This factor compares the **planetary lords of the two Moon signs** and asks whether those planets are friends, neutral or enemies in the classical scheme of planetary relationships. Friendly lords score the full 5; mutual enemies score 0.

Graha Maitri is read as intellectual and emotional rapport — whether two minds meet easily. Because it works from the sign lords rather than the Nakshatra directly, it overlaps with the sign-level relationship between the two charts, and a strong Graha Maitri often carries a match through weaknesses elsewhere.

## Nadi — the heaviest factor (8 points)

Nadi divides the Nakshatras into three physiological constitutions borrowed from Ayurveda:

- **Aadi (Vata / wind)**
- **Madhya (Pitta / fire)**
- **Antya (Kapha / water)**

The rule is stark and asymmetric. **Different nadis score the full 8. The same nadi scores 0** — this is **Nadi dosha**, and with 8 of the 36 points riding on it, no other single factor moves the total as much.

Nadi dosha is traditionally associated with health and with progeny — the classical concern is compatibility of constitution and the wellbeing of children. It is the factor astrologers take most seriously and the one most often subjected to cancellation rules: Nadi dosha is generally held to be void when the two share a Moon sign but different Nakshatras, when the Nakshatra is the same but the pada differs, or when the Nakshatra lords are the same planet. Because so much rides on this one number, it is also the factor most worth having computed carefully rather than eyeballed.

## Reading the combined score

The four Nakshatra factors above contribute 6 + 4 + 5 + 8 = 23 of the full 36 points; the remaining 13 come from Varna, Vashya, Tara and Bhakoot, which the [full Ashtakoot guide](/blog/kundali-matching-ashtakoot-guide) covers. On the complete 36-point scale:

| Total (of 36) | Reading |
| --- | --- |
| Below 18 | Weak; the texts advise against without careful review |
| 18 to 24 | Workable, often with attention to specific doshas |
| 25 to 32 | Good |
| 33 to 36 | Very strong |

But the score is a summary, not a verdict. A match can total 30 and still carry a Nadi dosha that a careful astrologer would want to examine; another can total 20 with every serious dosha cancelled and be perfectly sound. The number tells you where to look, not what to conclude.

## When a low score genuinely matters

Take the result seriously when a heavy factor fails and nothing cancels it — an uncancelled Nadi dosha above all, and to a lesser degree a Gana dosha compounding a poor Bhakoot. Weight it far less when the points lost are spread across the light factors, or when a classical cancellation clearly applies. The single most common mistake is treating the raw total as the answer while ignoring which factors produced it.

And a point the classical texts themselves make: Ashtakoot is one instrument. A complete assessment also weighs Manglik status in both charts, the condition of the seventh house and its lord, and the strength of Venus and Jupiter. A high Guna score over an afflicted seventh house is not the reassurance the number suggests.

## Check your own match

Our [Nakshatra compatibility tool](/nakshatra-compatibility) identifies both Moon Nakshatras and scores the factors above, and the [full Kundali matching tool](/matching) runs the complete 36-point Ashtakoot with the standard dosha-cancellation rules applied — so the total you get already accounts for the exceptions, rather than penalising a match for a dosha the tradition would have voided.`,
  faqs: [
    {
      q: "What is Nadi dosha and how serious is it?",
      a: "Nadi dosha occurs when both partners share the same Nadi (Aadi, Madhya or Antya), scoring 0 of the 8 Nadi points. It is the heaviest single factor and is associated with health and progeny, so it is taken seriously — but classical rules cancel it in several situations, such as the same Moon sign with different Nakshatras, so an apparent Nadi dosha should always be checked against the cancellation conditions.",
    },
    {
      q: "Is Gana dosha a reason to call off a marriage?",
      a: "Rarely on its own. Gana dosha (typically a Deva–Rakshasa pairing) describes a difference in temperament, not an insurmountable conflict, and it is frequently cancelled when other factors between the charts are strong. It is worth noting, not worth panicking over.",
    },
    {
      q: "Why does Vedic matching use the Nakshatra instead of the sun sign?",
      a: "Because the Nakshatra is a finer unit — under 14 degrees wide versus the sign's 30 — and it carries the ruler, gana, yoni and nadi that the whole system compares. It works from the Moon, which in this tradition represents the mind and emotional constitution, and it can distinguish two charts that a sign-level comparison would treat as identical.",
    },
    {
      q: "What score is needed for marriage in Nakshatra matching?",
      a: "On the full 36-point Ashtakoot scale, 18 is the conventional minimum and 25 and above is considered good. But the total is a summary — a match should be read by which factors passed or failed, especially the heavy Nadi and Bhakoot factors, not by the number alone.",
    },
  ],
};
