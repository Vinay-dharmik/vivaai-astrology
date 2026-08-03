import type { BlogPost } from "../types";

export const post: Omit<BlogPost, "readTime"> = {
  slug: "vimshottari-dasha-system-explained",
  title: "Vimshottari Dasha: How Vedic Astrology Actually Times Events",
  description:
    "The 120-year Dasha cycle explained from the arithmetic up — how your Nakshatra sets the starting period, how to compute the balance at birth, what Antardasha and Pratyantardasha add, and how to judge whether a period will deliver.",
  date: "2025-12-28",
  updated: "2026-08-03",
  category: "Predictive",
  sources: ["bphs", "phaladeepika"],
  content: `A birth chart shows what is possible. It does not, on its own, show when. The Dasha system is the timing layer, and Vimshottari is the one nearly every Vedic astrologer reaches for first.

Most explanations of it stop at "each planet rules a period." That is true and useless. What follows is the actual arithmetic, because once you can compute your own balance at birth you stop having to trust anyone's software — including ours.

## The 120-year cycle

Vimshottari means "one hundred and twenty." The nine grahas divide those years between them in a fixed sequence and fixed proportions:

| Planet | Years | Share |
| --- | --- | --- |
| Ketu | 7 | 5.8% |
| Venus | 20 | 16.7% |
| Sun | 6 | 5.0% |
| Moon | 10 | 8.3% |
| Mars | 7 | 5.8% |
| Rahu | 18 | 15.0% |
| Jupiter | 16 | 13.3% |
| Saturn | 19 | 15.8% |
| Mercury | 17 | 14.2% |

The order never changes. After Mercury it returns to Ketu. What differs between people is only where in the cycle you start, and how much of that first period was already spent before you were born.

## The Moon decides where you start

This is the part that makes Vimshottari a genuinely personal system rather than a generational one.

The zodiac's 360 degrees are divided into 27 **Nakshatras** of 13 degrees 20 arcminutes each. Each Nakshatra has a ruling planet, and the rulers cycle through the same nine-planet order three times around the zodiac:

Ashwini–Ketu, Bharani–Venus, Krittika–Sun, Rohini–Moon, Mrigashira–Mars, Ardra–Rahu, Punarvasu–Jupiter, Pushya–Saturn, Ashlesha–Mercury — then the sequence repeats from Magha, and again from Mula.

**The Nakshatra your Moon occupies at birth determines which planet's Mahadasha you were born into.** Moon in Rohini means you were born in a Moon Mahadasha. Moon in Pushya means Saturn. This is why the Moon's position needs to be computed accurately: an error of a few tenths of a degree near a boundary hands you a completely different life timeline.

## Computing the balance at birth

You are almost never born at the exact start of a Nakshatra, so your first Mahadasha is already partly spent. The remainder is the **balance**.

The formula is a simple proportion. Take how far the Moon has travelled through its Nakshatra, express it as a fraction of the whole Nakshatra, and that is the fraction of the Mahadasha already used up.

**Worked example.** Suppose the Moon sits at 4 degrees 0 arcminutes of Taurus.

Taurus starts at 30 degrees of the zodiac, so the Moon is at 34 degrees absolute. Divide by 13 degrees 20 arcminutes (13.3333 degrees) to find the Nakshatra number: 34 divided by 13.3333 gives 2.55. The integer part is 2, so this is the third Nakshatra — Krittika, ruled by the Sun.

Krittika begins at 2 times 13.3333, which is 26.6667 degrees. The Moon has travelled 34 minus 26.6667, which is 7.3333 degrees into it. As a fraction: 7.3333 divided by 13.3333 gives 0.55, so 55 percent of Krittika is behind us.

The Sun's Mahadasha is 6 years. Elapsed: 0.55 times 6, which is 3.3 years. **Balance at birth: 2.7 years of Sun Dasha remaining**, or about 2 years and 8 months.

So this person runs Sun until age 2.7, then Moon for 10 years until 12.7, then Mars for 7 until 19.7, then Rahu for 18 until 37.7, and so on. Their Jupiter Mahadasha lands between 37.7 and 53.7. Someone born two days earlier, with the Moon in Bharani, would start in Venus and have a completely different sequence.

## Antardasha: the second level

Each Mahadasha subdivides into nine **Antardashas** (also called Bhukti), running in the same planetary order, each proportional to its own length.

The formula is:

**Antardasha length = (Mahadasha years times Antardasha planet's years) divided by 120**

The Mahadasha always begins with its own Antardasha. So a Saturn Mahadasha of 19 years opens with Saturn–Saturn: 19 times 19 divided by 120, which is 3.008 years — about 3 years and 1 month. Then Saturn–Mercury: 19 times 17 divided by 120, which is 2.69 years. Then Saturn–Ketu: 19 times 7 divided by 120, which is 1.11 years. And so on through Venus, Sun, Moon, Mars, Rahu and Jupiter.

Add all nine and you get back exactly 19 years, which is a useful check that the arithmetic is right.

The Antardasha is where most practical prediction happens. A Mahadasha sets the theme of a decade or two; the Antardasha tells you which year within it the theme actually arrives.

## Pratyantardasha and below

The same proportional rule applies again to subdivide each Antardasha into nine **Pratyantardashas**, and again below that. Each level narrows the window: Mahadasha gives you years, Antardasha gives you a year, Pratyantardasha gives you a month or two.

In practice most astrologers work to the third level and stop. Below that the precision of the calculation starts to exceed the precision of the birth time it was built on, which is a form of false confidence.

## Judging whether a period will actually deliver

This is where most Dasha reading goes wrong. People look up "Jupiter Mahadasha" and read a generic paragraph about expansion and good fortune. But Jupiter's Dasha is not the same event for everyone. Five questions decide what it does for you:

**1. What does the planet rule in your chart?** Jupiter ruling your fifth and ninth is a very different period from Jupiter ruling your sixth and twelfth. For a Capricorn Ascendant, Jupiter rules the third and twelfth — both difficult — and its Dasha is nothing like the textbook description.

**2. Where does it sit?** A Dasha lord tends to deliver the affairs of the house it occupies. Jupiter in the tenth gives career results; Jupiter in the twelfth gives foreign travel, expenditure, or withdrawal.

**3. How strong is it?** A planet below its required Shadbala signifies its matters but struggles to bring them about on time. See the [Shadbala guide](/blog/shadbala-planetary-strength-explained) for the measurement.

**4. What is the relationship between Mahadasha and Antardasha lords?** Friendly planets produce smoother results. When the Antardasha lord sits in the sixth, eighth or twelfth from the Mahadasha lord, the sub-period tends to work against the main one — a well-known signature for the difficult stretch inside an otherwise good Dasha.

**5. What are the transits doing?** Dasha grants permission; transit picks the moment. The classical view is that an event needs both — a supportive Dasha and a transit that activates the relevant house. Ashtakavarga is the usual tool for judging transit quality, covered in our [Ashtakavarga guide](/blog/ashtakavarga-bindu-system-guide).

## Common misreadings

**"Saturn Dasha means nineteen bad years."** It does not. Saturn's Dasha is demanding, but for Taurus and Libra Ascendants Saturn is the Yogakaraka — the single most constructive planet in the chart — and its nineteen years are frequently the most productive of a life. Saturn rewards sustained effort; it punishes shortcuts. Those are different things.

**"Rahu Dasha is always chaotic."** Rahu amplifies the house it sits in and the planet that rules that house. Rahu in the tenth with a strong tenth lord can produce a very fast rise. Rahu is unstable where it is unsupported, not everywhere.

**"The Mahadasha lord's own Antardasha is the best part."** It is the most concentrated part, which is not the same. If the Dasha lord is weak or badly placed, its own sub-period is when that weakness is most exposed.

**"I am in a good Dasha so nothing bad can happen."** Dashas run in parallel with transits, with the Dashas of other charts you are connected to, and with the ordinary causes of events. A supportive period makes good outcomes more available. It does not make them automatic.

## The transition years

The handover between two Mahadashas is usually more noticeable than anything inside either one. The last Antardasha of an outgoing Dasha and the first of the incoming one often bracket a genuine change of direction — a move, a career shift, the end or start of a relationship.

If you are trying to make sense of a period of your life that felt like a hinge, check whether it sat on a Mahadasha boundary. It frequently does.

## Check your own

Your [free Kundali report](/kundali) gives your current Mahadasha and Antardasha with the balance computed from your Moon's exact longitude, alongside the Shadbala figures you need to judge whether the current lord can deliver. Everything above is the arithmetic behind those numbers — run it by hand if you want to confirm them.`,
  faqs: [
    {
      q: "Why is my Dasha different from what another site shows?",
      a: "Almost always because of a small difference in the Moon's computed longitude, which changes the elapsed fraction of the Nakshatra and therefore the balance at birth. Differences of a few months are normal between programs. Differences of years usually mean the two are using different Ayanamsa values or that one has the birth time or timezone wrong.",
    },
    {
      q: "Which matters more, Mahadasha or Antardasha?",
      a: "The Mahadasha sets the theme and the Antardasha sets the timing. A supportive Antardasha inside a difficult Mahadasha gives relief but not a change of direction; a difficult Antardasha inside a supportive Mahadasha gives a setback that the wider period tends to absorb.",
    },
    {
      q: "Are there other Dasha systems?",
      a: "Many. Ashtottari runs on 108 years, Yogini on 36, Chara Dasha is sign-based rather than planet-based and belongs to the Jaimini tradition. Vimshottari is the default because Parashara presents it as the primary system for the current age, and because it is keyed to the Nakshatras.",
    },
    {
      q: "Can a Dasha be changed or remedied?",
      a: "The period itself runs regardless. What classical remedies address is the strength of the planet running it — a weak Dasha lord is understood to deliver its results late, partially, or with difficulty, and the traditional prescriptions aim at that weakness rather than at the calendar.",
    },
  ],
};
