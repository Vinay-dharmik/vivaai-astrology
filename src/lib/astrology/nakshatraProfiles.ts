/**
 * Single source of truth for the 27 Nakshatras.
 *
 * This file exists because the classical attributes (gana, yoni, nadi) were
 * previously duplicated in two places that disagreed with each other and with
 * the classical tables, and because 26 of the 27 detail pages fell through to
 * a generic template. Attributes here follow Brihat Parashara Hora Shastra and
 * the standard Ashtakoota tables; the written profiles are hand-authored.
 */

export type Gana = "Deva" | "Manushya" | "Rakshasa";
export type Nadi = "Aadi" | "Madhya" | "Antya";

export interface NakshatraProfile {
  index: number;
  name: string;
  lord: string;
  deity: string;
  symbol: string;
  gana: Gana;
  /** Yoni animal used in Ashtakoota Yoni Kuta matching. */
  yoni: string;
  yoniGender: "Male" | "Female";
  nadi: Nadi;
  span: string;
  rashi: string;
  /** Body part in Kalapurusha, used for the health section. */
  bodyPart: string;
  personality: string;
  career: string;
  relationship: string;
  health: string;
  strengths: string[];
  weaknesses: string[];
  /** A concrete, classical remedy note rather than generic advice. */
  remedy: string;
}

export const NAKSHATRA_PROFILES: NakshatraProfile[] = [
  {
    index: 1, name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras",
    symbol: "Horse's head", gana: "Deva", yoni: "Horse", yoniGender: "Male",
    nadi: "Aadi", span: "Aries 0°00' – 13°20'", rashi: "Aries", bodyPart: "Knees and the top of the head",
    personality: "Ashwini is the starting gate of the zodiac, and its natives carry that quality of being first. The Ashwini Kumaras are the physicians of the gods, arriving fast and leaving quickly, and the same signature shows in the native: rapid response, instinctive rather than deliberated judgement, and a real capacity to help in a crisis. Ketu's rulership adds a curious detachment — Ashwini people commit intensely to a task and then move on without the sentimental attachment others expect. They dislike being managed, tend to be physically restless, and often look younger than their age.",
    career: "Emergency medicine, surgery, paramedic and first-responder work, veterinary practice, sports and athletics, motor and transport industries, and any founder role where speed of decision matters more than consensus. Ashwini natives often do poorly in slow bureaucracies and thrive where they can act immediately on their own judgement.",
    relationship: "Attraction is fast and physical; the difficulty is staying past the initial charge. Ashwini natives need a partner who reads independence as a trait rather than a rejection. When they do commit they are fiercely protective. The Deva gana gives basic decency in conflict — they rarely fight dirty — but the Ketu influence can make them emotionally abrupt, withdrawing rather than explaining.",
    health: "Strong constitution with unusually quick recovery. The vulnerable areas are the head — headaches, migraines, sinus trouble — and injuries from speed: sports strains, road accidents, fractures. Ashwini natives generally under-rest rather than over-rest, and most of their health problems come from not stopping.",
    strengths: ["Acts decisively under pressure", "Genuine healing instinct", "Physically resilient", "Self-starting, needs no supervision", "Recovers from setbacks quickly"],
    weaknesses: ["Starts far more than it finishes", "Impatient with slower people", "Blunt to the point of causing offence", "Accident-prone through haste"],
    remedy: "Ketu remedies suit this Nakshatra: chant the Ketu beej mantra on Tuesdays, feed dogs, and donate blankets or sesame. Ashwini natives benefit more from disciplined rest than from any gemstone.",
  },
  {
    index: 2, name: "Bharani", lord: "Venus", deity: "Yama",
    symbol: "Yoni (the womb)", gana: "Manushya", yoni: "Elephant", yoniGender: "Male",
    nadi: "Madhya", span: "Aries 13°20' – 26°40'", rashi: "Aries", bodyPart: "Head and the soles of the feet",
    personality: "Bharani carries the tension of its two rulers: Venus, who governs pleasure and creation, and Yama, the god of death and moral accounting. The result is a native who experiences life in extremes and has an unusual tolerance for what other people find unbearable. Bharani natives are frequently the ones who handle the funeral, sit with the dying friend, or take on the ethically difficult job. They have strong appetites — for food, sex, beauty, experience — alongside a surprisingly rigid private moral code. They bear things; the name itself means 'the bearer'.",
    career: "Obstetrics and midwifery, palliative and hospice care, law and judiciary, forensic work, funeral services, the arts, food and hospitality, and creative direction. Bharani natives also do well in any field involving transformation of raw material — sculpture, surgery, editing, restoration.",
    relationship: "Passionate and possessive. Bharani is one of the more sexually charged Nakshatras, and relationships tend to be intense rather than easy. The Manushya gana makes them fundamentally partnership-oriented, but jealousy is a genuine failing here. They respond very badly to being deceived and have long memories for betrayal.",
    health: "Reproductive and eliminative systems need attention, as does the liver given Bharani's appetites. Female natives may face menstrual or fertility issues at some stage. The Nakshatra's endurance is real but it masks strain — Bharani natives often discover a problem late because they carried on through the warning signs.",
    strengths: ["Extraordinary endurance under strain", "Creative and sensually gifted", "Handles death, crisis and taboo without flinching", "Loyal once committed", "Strong sense of justice"],
    weaknesses: ["Jealous and possessive", "Prone to excess in food, drink and pleasure", "Judgemental of others' morals", "Carries burdens silently until they become damage"],
    remedy: "Venus remedies balance the Nakshatra: donate white items or sweets on Fridays, and worship Yama through observance of Yama Deepam. Moderation in diet is the practical remedy that matters most.",
  },
  {
    index: 3, name: "Krittika", lord: "Sun", deity: "Agni",
    symbol: "A razor or flame", gana: "Rakshasa", yoni: "Goat", yoniGender: "Female",
    nadi: "Antya", span: "Aries 26°40' – Taurus 10°00'", rashi: "Aries / Taurus", bodyPart: "Head, neck and eyes",
    personality: "Krittika is fire that cuts. Agni is the deity, and the symbol is a blade — this is the Nakshatra of purification through burning away what is false. Krittika natives are direct to the point of discomfort, have a low tolerance for pretension, and are usually the person in the room who says the thing everyone was avoiding. The Sun's rulership gives them genuine authority and a need to be respected. They are also, in a way the other fire Nakshatras are not, nurturing: Krittika is associated with the Pleiades, the six mothers who raised Kartikeya. They feed people and they cut them, sometimes in the same conversation.",
    career: "Military and defence, surgery, criticism and editing, teaching, metallurgy and engineering, cooking and the culinary professions, fire and energy industries, and quality control or audit — any role where the job is to find the flaw and say so.",
    relationship: "Krittika natives are protective and generous partners with a sharp tongue. The Rakshasa gana means conflict escalates fast; they do not soften an argument. What they need is a partner secure enough not to be wounded by the bluntness, because the criticism is usually not withdrawal of affection — Krittika criticises what it is invested in.",
    health: "Fire governs digestion here: acidity, ulcers, inflammatory conditions and skin eruptions are common. Eye strain and headaches also appear. Krittika natives run hot both physically and temperamentally, and cooling routines — diet, sleep, avoiding stimulants — do more for them than most interventions.",
    strengths: ["Cuts through confusion to the real issue", "Natural teacher and mentor", "High personal integrity", "Protective of dependants", "Excellent at spotting flaws others miss"],
    weaknesses: ["Wounding bluntness", "Impatient and quick to anger", "Can be arrogant about being right", "Holds others to standards they never agreed to"],
    remedy: "Sun remedies apply: offer water to the rising Sun, chant the Aditya Hridayam on Sundays, and donate wheat or jaggery. Managing the temper is the substantive remedy — Krittika's problems are nearly always self-inflicted through speech.",
  },
  {
    index: 4, name: "Rohini", lord: "Moon", deity: "Brahma (Prajapati)",
    symbol: "An ox-cart", gana: "Manushya", yoni: "Serpent", yoniGender: "Male",
    nadi: "Antya", span: "Taurus 10°00' – 23°20'", rashi: "Taurus", bodyPart: "Forehead, ankles and shins",
    personality: "Rohini is the Moon's own favourite — classically the Nakshatra the Moon loved best — and it shows. These natives have magnetism, physical attractiveness and an ease with material life that others find slightly unfair. Rohini is the Nakshatra of growth and fertility: things planted here take root. The natives are charming, artistically gifted and genuinely pleasant company, with a strong instinct for comfort and beauty. The shadow is the serpent yoni and the Taurean fixity — Rohini can be materially grasping, and it does not let go of what it considers its own, whether that is property or a person.",
    career: "Agriculture and horticulture, luxury goods, fashion and textiles, cosmetics, entertainment and music, banking and finance, real estate, hospitality, and food production. Rohini is one of the most commercially successful Nakshatras and does especially well anywhere that beauty converts into revenue.",
    relationship: "Highly desirable partners and they know it. Rohini natives are sensual, attentive and good at the texture of domestic life. The difficulty is possessiveness and, in some charts, a wandering eye justified by the same appetite for beauty that makes them attractive. Jealousy features on both sides of a Rohini relationship.",
    health: "The throat, neck, tonsils and thyroid are the vulnerable zones, along with weight gain from a genuine fondness for food. Rohini natives tend toward comfort rather than exertion, and lifestyle disease — diabetes, cholesterol, hypertension — is the realistic long-term risk rather than acute illness.",
    strengths: ["Magnetic and naturally liked", "Strong artistic and aesthetic sense", "Commercially shrewd", "Creates stability and abundance around them", "Patient and steady"],
    weaknesses: ["Materialistic and status-conscious", "Possessive in love", "Resists change once comfortable", "Indulgent — food, spending, comfort"],
    remedy: "Moon remedies suit Rohini: offer water or milk on Mondays, wear white, and keep silver. The meaningful discipline is restraint in consumption, since Rohini's difficulties come from abundance rather than lack.",
  },
  {
    index: 5, name: "Mrigashira", lord: "Mars", deity: "Soma (Chandra)",
    symbol: "A deer's head", gana: "Deva", yoni: "Serpent", yoniGender: "Female",
    nadi: "Madhya", span: "Taurus 23°20' – Gemini 6°40'", rashi: "Taurus / Gemini", bodyPart: "Eyebrows, chin and shoulders",
    personality: "Mrigashira is the searching Nakshatra — the deer with its head raised, scenting something in the distance. Natives are curious, mentally quick and perpetually slightly dissatisfied, always sensing that the better thing is elsewhere. They are gentle in manner but restless underneath, with Mars supplying a nervous energy that Soma's softness does not fully contain. They gather information compulsively, ask good questions, and are excellent company. The failing is follow-through: the search itself is more compelling to them than arriving.",
    career: "Research and academia, journalism, travel and exploration, real estate and land surveying, textile and perfume trades, music, and any advisory role built on gathering and comparing information. Mrigashira also shows up strongly in sales and procurement — the natives are natural seekers of the better deal.",
    relationship: "Charming, playful and hard to hold. Mrigashira natives approach relationships with the same searching quality they bring to everything, and can be genuinely devoted while still restless. They need mental stimulation more than security, and a partner who becomes predictable loses them. The Deva gana keeps them decent — they leave badly rather than cruelly.",
    health: "Nervous system complaints, anxiety, insomnia and throat or chest issues. The restlessness is physical as well as mental, and Mrigashira natives frequently present with stress symptoms rather than disease. Grounding routines matter more than medication for this Nakshatra.",
    strengths: ["Genuinely curious and quick to learn", "Gentle and non-aggressive", "Adaptable across situations and cultures", "Perceptive about people", "Communicates well"],
    weaknesses: ["Chronically restless and dissatisfied", "Suspicious and prone to second-guessing", "Struggles to finish what it starts", "Nervous and easily unsettled"],
    remedy: "Mars remedies steady the Nakshatra: chant the Mangal beej mantra on Tuesdays and donate red lentils. Practically, Mrigashira benefits enormously from a fixed daily routine — the structure it resists is the thing it needs.",
  },
  {
    index: 6, name: "Ardra", lord: "Rahu", deity: "Rudra",
    symbol: "A teardrop", gana: "Manushya", yoni: "Dog", yoniGender: "Female",
    nadi: "Aadi", span: "Gemini 6°40' – 20°00'", rashi: "Gemini", bodyPart: "Eyes and the back of the head",
    personality: "Ardra is the storm Nakshatra, presided over by Rudra, the howling form of Shiva. Its symbol is a teardrop and its meaning is 'moist' — the destruction that precedes new growth, the rain after the lightning. Natives are intellectually formidable, often with a destructive-analytical turn of mind: they take things apart, including beliefs and institutions other people would rather leave alone. Rahu gives them an appetite for the unconventional and a certain hunger that is never quite satisfied. Ardra lives are frequently marked by an early upheaval that becomes the source of the native's later depth.",
    career: "Research, particularly in the sciences; software and technology; psychology and psychiatry; investigation and forensics; pharmaceuticals and chemistry; crisis management; and radical politics or activism. Ardra excels wherever the work involves dismantling something in order to understand it.",
    relationship: "Emotionally intense and often turbulent. Ardra natives feel deeply but express awkwardly, and the storm quality shows up as sudden emotional weather in relationships. They are capable of great loyalty — the dog yoni is significant — but they test their partners, sometimes destructively. Relationships that survive an Ardra native's early turbulence tend to be very durable.",
    health: "Headaches, eye problems, respiratory and asthmatic complaints, and nervous or psychological strain. Ardra has a genuine association with mental health difficulty, and the natives benefit from taking that seriously rather than intellectualising it.",
    strengths: ["Exceptional analytical depth", "Unafraid of difficult truths", "Transforms personal suffering into insight", "Innovative and unconventional", "Loyal in a tested friendship"],
    weaknesses: ["Emotionally volatile", "Can be deliberately destructive", "Ungrateful or dismissive when in a dark phase", "Restless and never satisfied"],
    remedy: "Rahu remedies apply: chant the Rahu beej mantra, donate to the elderly or disabled, and avoid intoxicants, which affect Ardra natives disproportionately. Regular worship of Shiva, particularly the Rudram, is the classical prescription.",
  },
  {
    index: 7, name: "Punarvasu", lord: "Jupiter", deity: "Aditi",
    symbol: "A bow and quiver", gana: "Deva", yoni: "Cat", yoniGender: "Female",
    nadi: "Aadi", span: "Gemini 20°00' – Cancer 3°20'", rashi: "Gemini / Cancer", bodyPart: "Fingers and nose",
    personality: "Punarvasu means 'return of the light', and recovery is the whole signature of this Nakshatra. Its natives lose things — jobs, homes, relationships, certainties — and rebuild, repeatedly, without becoming bitter. Aditi is the mother of the gods, boundless and forgiving, and Jupiter's rulership adds philosophy and generosity. Punarvasu natives are usually the most emotionally healthy people in a difficult family, the ones who forgive first. They are content with modest means, dislike ostentation and are widely trusted.",
    career: "Teaching, counselling, spiritual and religious vocations, publishing, hospitality, logistics and travel, social work, and any role built on repeated patient contact with people. Punarvasu also does well in advisory positions where trustworthiness matters more than aggression.",
    relationship: "Warm, forgiving and undemanding partners. Punarvasu natives are genuinely easy to live with, which is rarer than it sounds. The weakness is a tendency to be too accommodating — they forgive things that should not be forgiven, and can end up repeatedly rebuilding a relationship that another person keeps damaging.",
    health: "Generally good health with strong recuperative capacity, matching the Nakshatra's theme. Vulnerabilities are the chest and lungs, the digestive system, and the ears. Punarvasu natives typically recover well from illnesses that would set others back further.",
    strengths: ["Recovers from loss without bitterness", "Genuinely generous and forgiving", "Philosophically grounded", "Content with enough", "Widely trusted"],
    weaknesses: ["Too accommodating; poor boundaries", "Lacks material ambition, sometimes to their own cost", "Can be complacent", "Repeats the same mistake charitably"],
    remedy: "Jupiter remedies suit Punarvasu: chant the Guru beej mantra on Thursdays, donate yellow items or turmeric, and respect teachers. The useful discipline is learning to say no — this Nakshatra's problems come from excess forgiveness.",
  },
  {
    index: 8, name: "Pushya", lord: "Saturn", deity: "Brihaspati",
    symbol: "A cow's udder", gana: "Deva", yoni: "Goat", yoniGender: "Male",
    nadi: "Madhya", span: "Cancer 3°20' – 16°40'", rashi: "Cancer", bodyPart: "Mouth and face",
    personality: "Pushya is classically considered the single most auspicious Nakshatra, and its character is nourishment. The symbol is a cow's udder — that which feeds without depleting. Natives are dutiful, protective, conservative and deeply reliable. Saturn's rulership gives seriousness and staying power; Brihaspati as deity gives wisdom and priestly dignity. Pushya natives are the ones the family relies on and the institution promotes slowly. They are not exciting and do not want to be. The shadow side is rigidity and a certain self-satisfied conventionality.",
    career: "Teaching, priesthood and religious administration, government and civil service, food production and dairy, nursing and caregiving, banking, law, and any long-tenure institutional career. Pushya rewards patience and is one of the strongest Nakshatras for steady, cumulative advancement.",
    relationship: "Devoted, protective and somewhat parental. Pushya natives look after their partners in practical ways — the bills paid, the family managed, the crisis absorbed. They are not naturally romantic and can be emotionally reserved. Marriage tends to be stable and long, occasionally at the cost of passion.",
    health: "Chest, stomach and digestive complaints, water retention, and a tendency to put on weight. Saturn's influence can bring chronic rather than acute conditions — the slow-developing problem discovered at a routine check. Pushya natives are generally long-lived.",
    strengths: ["Utterly reliable", "Nurturing and protective", "Patient over long time horizons", "Ethically grounded", "Builds lasting institutions and families"],
    weaknesses: ["Rigid and resistant to new ideas", "Conventional to a fault", "Emotionally withholding", "Can be smugly moralistic"],
    remedy: "Saturn remedies apply: serve the elderly, donate black sesame or mustard oil on Saturdays, and observe Thursday worship of Brihaspati. Pushya natives benefit from deliberately exposing themselves to unfamiliar ideas.",
  },
  {
    index: 9, name: "Ashlesha", lord: "Mercury", deity: "The Nagas",
    symbol: "A coiled serpent", gana: "Rakshasa", yoni: "Cat", yoniGender: "Male",
    nadi: "Antya", span: "Cancer 16°40' – 30°00'", rashi: "Cancer", bodyPart: "Ears, joints and nails",
    personality: "Ashlesha is the entwining Nakshatra — the coiled serpent, the embrace that is also a grip. Natives possess unusual psychological penetration: they read people accurately and quickly, including the things people are hiding. Combined with Mercury's cleverness and the Rakshasa gana's willingness to use an advantage, this makes Ashlesha the most strategically capable and most ethically ambivalent of the Nakshatras. At its best it produces profound healers, therapists and mystics. At its worst it produces manipulators. The difference is almost entirely a matter of the native's own choices.",
    career: "Psychology and psychotherapy, medicine and particularly toxicology or anaesthesia, politics, negotiation and diplomacy, intelligence work, occult and tantric practice, chemistry and pharmaceuticals, and litigation. Ashlesha thrives in any field where reading the opponent is the core skill.",
    relationship: "Intensely bonding and difficult to leave. Ashlesha natives form deep attachments and can be secretive, testing and emotionally strategic within them. Their perceptiveness is a genuine gift to a partner who wants to be understood, and a weapon if the relationship turns adversarial. Trust, once broken, is rarely restored on either side.",
    health: "Digestive and stomach complaints, joint problems, and issues arising from stress held internally. Ashlesha has classical associations with poisoning and with drug or alcohol dependency — the natives should treat any developing habit as serious early.",
    strengths: ["Reads people with unusual accuracy", "Strategically brilliant", "Capable of profound healing work", "Resourceful under pressure", "Intense focus"],
    weaknesses: ["Manipulative when unchecked", "Secretive and hard to know", "Holds grudges", "Prone to dependency and self-destructive habits"],
    remedy: "Naga worship is the classical remedy — Naga Panchami observance and offerings at serpent shrines. Mercury remedies also apply: chant the Budha mantra on Wednesdays and donate green gram. Honest self-examination is the substantive practice for this Nakshatra.",
  },
  {
    index: 10, name: "Magha", lord: "Ketu", deity: "The Pitrs (ancestors)",
    symbol: "A royal throne", gana: "Rakshasa", yoni: "Rat", yoniGender: "Male",
    nadi: "Antya", span: "Leo 0°00' – 13°20'", rashi: "Leo", bodyPart: "Nose, lips and chin",
    personality: "Magha is the throne, and its deity is the ancestors — this is the Nakshatra of inherited position and the weight that comes with it. Natives carry themselves with natural dignity and expect to be treated accordingly. They have a strong sense of lineage, tradition and rightful place, and are often unusually connected to their family history. Ketu's rulership means the position is inherited rather than earned, which produces two distinct types: the native who honours the inheritance and the one who is trapped by it. Magha natives are generous to those beneath them and unyielding to those who challenge their standing.",
    career: "Government and administration, law and judiciary, historical and archaeological work, genealogy, ceremonial and religious roles, senior management, the family business, and politics. Magha does well in any hierarchy where seniority and dignity are formally recognised.",
    relationship: "Loyal and dignified but proud. Magha natives expect respect within the relationship and respond badly to being diminished, especially in public. Family approval matters enormously to them — more than to almost any other Nakshatra — and a partner rejected by the family creates a genuine and lasting fracture.",
    health: "Heart, spine and circulatory complaints, in keeping with Leo. Magha natives also carry stress in the back. There is a classical association with ancestral or hereditary conditions, which is worth taking as a prompt for family history screening rather than fatalism.",
    strengths: ["Natural dignity and presence", "Deeply loyal to family and tradition", "Generous to dependants", "Strong sense of duty", "Commands respect easily"],
    weaknesses: ["Proud and status-obsessed", "Contemptuous of those it considers beneath it", "Trapped by expectation and inheritance", "Struggles to accept being wrong"],
    remedy: "Ancestral worship is the specific remedy for Magha: perform Pitru Tarpana, observe Shraddha rites properly, and honour elders. Ketu remedies also apply. Magha natives who neglect ancestral obligations often report the Nakshatra's difficulties most sharply.",
  },
  {
    index: 11, name: "Purva Phalguni", lord: "Venus", deity: "Bhaga",
    symbol: "The front legs of a bed", gana: "Manushya", yoni: "Rat", yoniGender: "Female",
    nadi: "Madhya", span: "Leo 13°20' – 26°40'", rashi: "Leo", bodyPart: "Right hand and the genitals",
    personality: "Purva Phalguni is rest, pleasure and the enjoyment of what has been earned. Bhaga is the god of good fortune and marital happiness, and the symbol is the front of a bed. Natives are charming, sociable, artistically inclined and unapologetically fond of comfort. They have a gift for making occasions enjoyable and are often the social centre of their circle. Venus rules and Leo hosts, so there is both warmth and a taste for display. The weakness is straightforward: a preference for pleasure over effort, and vanity about appearance and reputation.",
    career: "Entertainment, music and performance, fashion and beauty, event management, hospitality and luxury services, interior design, marketing, and the arts generally. Purva Phalguni also does well in any role that is essentially about making other people feel good.",
    relationship: "Romantic, generous and genuinely fun to be with. This is one of the better Nakshatras for marital happiness — Bhaga's domain — provided the native's need for admiration is met. Purva Phalguni natives are affectionate and demonstrative, and their relationships tend to be warm rather than intense. The risk is flirtation and a certain laziness about the unglamorous parts of partnership.",
    health: "The back, spine and heart, plus the reproductive system. Purva Phalguni natives are prone to lifestyle-related complaints from comfort and rich living rather than from stress. Exercise is the intervention that matters most and the one they most reliably avoid.",
    strengths: ["Warm, charming and socially gifted", "Creative and artistically able", "Generous with friends", "Brings enjoyment to others", "Optimistic"],
    weaknesses: ["Lazy and pleasure-seeking", "Vain about appearance and status", "Avoids unpleasant work", "Extravagant with money"],
    remedy: "Venus remedies apply: donate white clothing or sweets on Fridays and worship Lakshmi. The substantive discipline for Purva Phalguni is regular physical exertion and a habit of finishing the dull part of a task.",
  },
  {
    index: 12, name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman",
    symbol: "The back legs of a bed", gana: "Manushya", yoni: "Cow", yoniGender: "Male",
    nadi: "Aadi", span: "Leo 26°40' – Virgo 10°00'", rashi: "Leo / Virgo", bodyPart: "Left hand",
    personality: "Where Purva Phalguni is the pleasure, Uttara Phalguni is the contract that follows it — Aryaman is the deity of patronage, friendship and marriage vows. Natives are dependable, socially responsible and strongly oriented toward agreements kept. They make excellent friends in the old sense of the word: the person who actually turns up. The Sun's rulership across the Leo–Virgo cusp gives both dignity and a practical, service-minded streak. Uttara Phalguni natives dislike disorder and are quietly ambitious, preferring earned advancement to inherited position.",
    career: "Medicine and healthcare, social work and philanthropy, human resources, contract law, marriage and family counselling, teaching, civil administration, and charitable foundations. This Nakshatra shows up strongly in careers built around formalised help.",
    relationship: "Committed and steady. Uttara Phalguni is one of the strongest Nakshatras for marriage, because the native genuinely values the contract and not just the feeling. They are kind, practical partners who show love through reliability rather than romance. The failing is a tendency toward self-righteousness and an expectation of gratitude for the help they give.",
    health: "The liver, stomach and intestines, in keeping with the Virgo portion. Uttara Phalguni natives are often health-conscious to the point of anxiety, and digestive complaints with a nervous component are common.",
    strengths: ["Keeps commitments reliably", "Genuinely helpful without expecting payment", "Socially responsible", "Good organiser", "Steady advancement through merit"],
    weaknesses: ["Self-righteous about their own decency", "Expects gratitude", "Can be rigidly proper", "Takes on others' burdens then resents it"],
    remedy: "Sun remedies suit this Nakshatra: offer water at sunrise on Sundays and donate wheat. Uttara Phalguni natives benefit from doing charitable work anonymously, which addresses the Nakshatra's characteristic need for recognition.",
  },
  {
    index: 13, name: "Hasta", lord: "Moon", deity: "Savitar",
    symbol: "An open hand", gana: "Deva", yoni: "Buffalo", yoniGender: "Female",
    nadi: "Aadi", span: "Virgo 10°00' – 23°20'", rashi: "Virgo", bodyPart: "Hands",
    personality: "Hasta is the hand, and its natives make things. This is the Nakshatra of skill, dexterity and craft — the ability to produce a real object or result from raw material. Savitar is a solar deity associated with creative power and the granting of what is asked for. Natives are clever, industrious, humorous and unusually practical, with excellent manual and technical ability. The Moon's rulership in Virgo gives sharp discrimination and, less helpfully, a critical anxiety. Hasta people also have a well-documented streak of cunning — the hand that makes can also take.",
    career: "Crafts and handiwork of every kind, surgery, dentistry, massage and physiotherapy, art and sculpture, engineering, watchmaking and precision manufacture, writing, magic and performance, and trade. Hasta is also strongly associated with astrology and palmistry.",
    relationship: "Attentive, practical and often funny. Hasta natives express affection through doing — repairing the thing, arranging the trip, making the meal. They are companionable partners with a tendency toward criticism and worry that can wear on a relationship over time. Mental compatibility matters more to them than passion.",
    health: "Nervous complaints, anxiety, digestive issues and problems with the hands themselves — repetitive strain, arthritis, tremor. Hasta natives internalise stress and it shows up in the gut and the nerves rather than dramatically.",
    strengths: ["Exceptional manual and technical skill", "Industrious and productive", "Quick-witted and funny", "Practical problem-solver", "Discriminating judgement"],
    weaknesses: ["Anxious and prone to worry", "Critical of self and others", "Can be cunning or sharp in dealings", "Restless mind, poor sleep"],
    remedy: "Moon remedies apply: offer water or rice on Mondays and wear silver. The Gayatri mantra is classically prescribed here, as Savitar is its presiding deity. Practical work with the hands is itself calming for this Nakshatra.",
  },
  {
    index: 14, name: "Chitra", lord: "Mars", deity: "Tvashtar (Vishvakarma)",
    symbol: "A bright jewel", gana: "Rakshasa", yoni: "Tiger", yoniGender: "Female",
    nadi: "Madhya", span: "Virgo 23°20' – Libra 6°40'", rashi: "Virgo / Libra", bodyPart: "Neck and forehead",
    personality: "Chitra is the celestial architect's Nakshatra — Tvashtar is the craftsman of the gods, the maker of forms. Its natives have a striking aesthetic sense and an instinct for design and structure, whether in buildings, images, arguments or their own appearance. Chitra people are usually visually memorable; the jewel symbol is literal. Mars gives drive and a competitive edge, and the Rakshasa gana gives a willingness to fight for their vision. The shadow is surface over substance: Chitra can build an impressive facade and mistake it for the thing itself.",
    career: "Architecture, interior and industrial design, graphic and visual arts, photography, fashion, jewellery, engineering, surgery, and urban planning. Chitra is also strong in any field involving the presentation of information — data visualisation, staging, exhibition design.",
    relationship: "Attractive, passionate and somewhat performative. Chitra natives care how the relationship looks as well as how it feels, and they choose partners partly aesthetically. They are ardent and physically expressive, with the tiger yoni's intensity. The difficulty is that image-consciousness can prevent the unglamorous honesty a long partnership needs.",
    health: "Kidneys, lower back, and the neck and forehead. Chitra natives are often physically fit but push too hard; injuries from training or overexertion are common. Stress presents as tension in the neck and shoulders.",
    strengths: ["Exceptional design and aesthetic judgement", "Creates structures that last", "Charismatic and visually striking", "Competitive and driven", "Sees the whole form, not just the parts"],
    weaknesses: ["Prioritises appearance over substance", "Vain", "Argumentative when its vision is challenged", "Discontented with the ordinary"],
    remedy: "Mars remedies apply: chant the Mangal mantra on Tuesdays, donate red lentils or copper. Worship of Vishvakarma is specific to this Nakshatra, particularly for those in building or design trades.",
  },
  {
    index: 15, name: "Swati", lord: "Rahu", deity: "Vayu",
    symbol: "A young shoot bending in the wind", gana: "Deva", yoni: "Buffalo", yoniGender: "Male",
    nadi: "Antya", span: "Libra 6°40' – 20°00'", rashi: "Libra", bodyPart: "Chest",
    personality: "Swati is independence. Vayu is the wind — unbound, going where it chooses, belonging to no one — and the symbol is a young plant flexible enough to survive the storm that breaks rigid trees. Natives are self-reliant to an unusual degree, dislike dependence in either direction, and have a strong instinct for freedom of movement. Libra's influence gives diplomacy and a real concern with fairness; Rahu adds ambition and an attraction to the unconventional or foreign. Swati natives are adaptable, commercially able and quietly restless.",
    career: "Trade and commerce, import-export, aviation and travel, diplomacy and negotiation, independent business, law, yoga and breathwork, and any career involving movement across borders. Swati is one of the strongest Nakshatras for self-employment.",
    relationship: "Fair-minded and courteous but hard to pin down. Swati natives resist relationships that constrain their autonomy and can appear commitment-shy when the issue is really independence. Given room, they are loyal and even-handed partners who genuinely try to be fair. They do badly with possessive partners.",
    health: "Respiratory and asthmatic complaints, digestive gas and bloating (Vayu governs air in the body), and joint problems. Swati natives are often physically flexible and benefit greatly from pranayama, which is the Nakshatra's natural discipline.",
    strengths: ["Genuinely independent and self-sufficient", "Adaptable — bends without breaking", "Fair and diplomatic", "Commercially capable", "Comfortable in unfamiliar environments"],
    weaknesses: ["Avoids commitment and dependence", "Restless; changes direction often", "Can be indecisive weighing all sides", "Ambition occasionally outruns ethics under Rahu"],
    remedy: "Rahu remedies apply: chant the Rahu mantra and donate to the marginalised. Pranayama and breath discipline are the practices most specific to Swati, and consistently the most effective for its natives.",
  },
  {
    index: 16, name: "Vishakha", lord: "Jupiter", deity: "Indra and Agni",
    symbol: "A triumphal archway", gana: "Rakshasa", yoni: "Tiger", yoniGender: "Male",
    nadi: "Antya", span: "Libra 20°00' – Scorpio 3°20'", rashi: "Libra / Scorpio", bodyPart: "Arms and breasts",
    personality: "Vishakha is the Nakshatra of goal-directed ambition. Its dual deities — Indra, the king, and Agni, the fire — give both the desire for the prize and the burning persistence to reach it. The symbol is a triumphal arch: the moment of arrival. Natives are determined, focused and prepared to wait a very long time for the thing they want. They are also the most single-minded of the Nakshatras, which is a strength until the goal turns out to be the wrong one. Vishakha lives frequently divide into a first half spent achieving something and a second half spent re-evaluating it.",
    career: "Politics, senior leadership, competitive sport, sales and business development, research requiring long persistence, military command, religious leadership, and entrepreneurship. Vishakha is strongly associated with late-career success, often after an earlier setback.",
    relationship: "Passionate and purposeful, but the relationship competes with the goal. Vishakha natives can be devoted partners and are typically loyal, yet a partner will at some point discover they are not the first priority. Jealousy and possessiveness appear, particularly with the Scorpio portion. When the ambition is shared, this is a formidable partnership.",
    health: "Arms, breasts, kidneys and the lower back. Vishakha natives are prone to stress-related conditions from sustained pressure they refuse to release, and to inflammatory complaints from Agni's influence.",
    strengths: ["Extraordinary persistence toward a goal", "Focused and hard to distract", "Recovers from setbacks and continues", "Natural leader", "Achieves late and substantially"],
    weaknesses: ["Single-minded to the point of neglecting people", "Envious of rivals", "Impatient when blocked", "Struggles to enjoy what it has won"],
    remedy: "Jupiter remedies apply: chant the Guru mantra on Thursdays, donate yellow items, and respect teachers. The specific practice for Vishakha is periodically re-examining whether the goal is still worth the cost — this Nakshatra rarely does it unprompted.",
  },
  {
    index: 17, name: "Anuradha", lord: "Saturn", deity: "Mitra",
    symbol: "A lotus flower", gana: "Deva", yoni: "Deer", yoniGender: "Female",
    nadi: "Madhya", span: "Scorpio 3°20' – 16°40'", rashi: "Scorpio", bodyPart: "Stomach and breasts",
    personality: "Anuradha is friendship as a spiritual discipline. Mitra is the deity of contracts, alliance and companionship — the god who makes cooperation possible — and the lotus symbol indicates beauty produced from difficult ground. Natives have a genuine gift for organising people and are the ones who hold groups together. Saturn's rulership in Scorpio gives them endurance through hardship, and Anuradha lives typically include a serious period of struggle that the native comes through with their capacity for warmth intact. They travel well, work well abroad, and make friends across every boundary.",
    career: "Organisational leadership and team management, international work and diplomacy, mining and deep research, occult and spiritual study, medicine, and any field requiring cooperation across factions. Anuradha is notably good at building coalitions.",
    relationship: "Devoted and emotionally serious. Anuradha natives take relationships as commitments rather than experiments, and they weather difficulty rather than leaving. Scorpio gives depth and some possessiveness; Saturn gives patience. The failing is a tendency to suppress their own needs for the sake of the alliance and to become quietly resentful.",
    health: "Stomach and digestive complaints, constipation, menstrual irregularity, and issues arising from suppressed emotion. Anuradha natives hold difficulty internally and it registers in the gut.",
    strengths: ["Exceptional at building and holding groups", "Loyal through genuine hardship", "Adapts to foreign cultures easily", "Devoted friend", "Patient and enduring"],
    weaknesses: ["Suppresses own needs, then resents it", "Prone to melancholy", "Possessive under stress", "Slow to leave situations that have failed"],
    remedy: "Saturn remedies apply: serve the elderly and donate black sesame or iron on Saturdays. Anuradha benefits particularly from actually voicing grievances early, which is the Nakshatra's characteristic difficulty.",
  },
  {
    index: 18, name: "Jyeshtha", lord: "Mercury", deity: "Indra",
    symbol: "An earring or umbrella", gana: "Rakshasa", yoni: "Deer", yoniGender: "Male",
    nadi: "Aadi", span: "Scorpio 16°40' – 30°00'", rashi: "Scorpio", bodyPart: "Neck and right side",
    personality: "Jyeshtha means 'the eldest', and its natives carry the eldest child's characteristics whether or not they are one: responsibility, authority, competence and a certain weariness. Indra is the deity — the king of the gods, powerful but insecure in his position, forever defending it. Jyeshtha natives are capable and often hold real power, but frequently feel unappreciated for what they carry. Mercury's rulership in Scorpio gives sharp, penetrating intelligence and a talent for the well-aimed remark. This is a protective, competent, somewhat embittered Nakshatra.",
    career: "Senior management and administration, military and police, occult and esoteric fields, engineering, medicine, research, and any position of formal responsibility. Jyeshtha natives frequently end up as the person who actually runs the organisation.",
    relationship: "Protective and controlling in roughly equal measure. Jyeshtha natives look after their partners genuinely but expect authority in return, and they can be sharp-tongued when crossed. They are private about their own vulnerabilities. A partner who acknowledges what they carry gets a very different relationship from one who takes it for granted.",
    health: "Neck and shoulder problems, respiratory complaints, and stress-related conditions from sustained responsibility. Jyeshtha natives are prone to sudden health events that follow long periods of ignoring warning signs.",
    strengths: ["Highly competent and takes responsibility", "Protective of those in their charge", "Penetrating intelligence", "Performs under pressure", "Defends others' interests"],
    weaknesses: ["Resentful of being unappreciated", "Controlling", "Cutting speech when provoked", "Isolated by pride; will not ask for help"],
    remedy: "Mercury remedies apply: chant the Budha mantra on Wednesdays and donate green gram. Worship of Indra and, in some traditions, of Jyeshtha Devi is specific here. Learning to delegate is the practical remedy this Nakshatra needs most.",
  },
  {
    index: 19, name: "Mula", lord: "Ketu", deity: "Nirriti",
    symbol: "A bundle of tied roots", gana: "Rakshasa", yoni: "Dog", yoniGender: "Male",
    nadi: "Aadi", span: "Sagittarius 0°00' – 13°20'", rashi: "Sagittarius", bodyPart: "Hips and thighs",
    personality: "Mula means 'root', and this Nakshatra goes to the bottom of things — sometimes by tearing them up. Nirriti is the goddess of dissolution and calamity, which sounds worse than it plays out: Mula natives are investigators of fundamentals, drawn to whatever lies beneath the accepted surface. They ask the question others avoid. Ketu's rulership brings detachment and a spiritual pull that often expresses as indifference to convention. Mula lives frequently involve an early uprooting, and the natives develop unusual philosophical depth as a result.",
    career: "Research of every kind, philosophy and theology, medicine and pharmacology, herbal and root-based medicine, investigation and journalism, archaeology, and spiritual or renunciate paths. Mula is also strong in demolition, mining and anything involving getting to what is underneath.",
    relationship: "Intense but non-clinging. Mula natives can love deeply while remaining fundamentally detached, which partners find confusing. They are honest, often brutally so, and they do not perform sentiment they do not feel. Relationships with Mula natives tend to be either very deep or short. The classical texts advise checking Mula placements carefully in matching, particularly for the first pada.",
    health: "Hips, thighs, sciatica and the pelvic region. Mula natives may experience sudden health disruptions that mirror the Nakshatra's theme of upheaval. Nervous and psychological strain is also common given Ketu's influence.",
    strengths: ["Gets to the actual root of a problem", "Philosophically fearless", "Detached from material anxiety", "Honest to the point of discomfort", "Rebuilds after total loss"],
    weaknesses: ["Destructive when unfocused", "Emotionally detached from people who need warmth", "Attracts and creates upheaval", "Blunt without regard for consequence"],
    remedy: "Ketu remedies are central: chant the Ketu mantra, feed dogs, donate blankets. Ganesha worship is classically prescribed for Mula-born natives, particularly to soften the Nakshatra's disruptive early years.",
  },
  {
    index: 20, name: "Purva Ashadha", lord: "Venus", deity: "Apas (the waters)",
    symbol: "A winnowing basket / fan", gana: "Manushya", yoni: "Monkey", yoniGender: "Male",
    nadi: "Madhya", span: "Sagittarius 13°20' – 26°40'", rashi: "Sagittarius", bodyPart: "Thighs and back",
    personality: "Purva Ashadha is 'the earlier invincible one', and the confidence is the defining feature. Natives possess an almost unshakeable belief in their own position, which carries them through opposition that would stop other people. Apas, the water deity, gives the quality of purification and the ability to wear down obstacles rather than smash them. Venus in Sagittarius gives persuasive charm and philosophical conviction. Purva Ashadha natives are natural debaters and propagandists — they convince, and they are extremely difficult to convince in return.",
    career: "Law and advocacy, politics, teaching and philosophy, writing and publishing, shipping and water-related industries, sales, public speaking, and religious or ideological leadership. This Nakshatra produces persuaders.",
    relationship: "Charming, warm and stubborn. Purva Ashadha natives are affectionate partners who will not concede an argument. They are loyal and take pride in their relationship, though the monkey yoni brings a playful and occasionally wandering quality. A partner needs to be comfortable losing debates.",
    health: "Thighs, hips, lungs and the bladder or urinary system. Water retention and kidney issues appear. Purva Ashadha natives are generally robust but slow to accept a diagnosis that contradicts their own view of their health.",
    strengths: ["Unshakeable confidence and conviction", "Highly persuasive", "Wears down opposition through persistence", "Loyal to their cause and people", "Recovers from defeat quickly"],
    weaknesses: ["Cannot admit being wrong", "Argumentative and dogmatic", "Overestimates own capacity", "Dismissive of contrary evidence"],
    remedy: "Venus remedies apply: donate white items on Fridays and worship at water bodies, which is specific to Apas. The practical discipline is deliberately seeking out disconfirming views — Purva Ashadha's characteristic failing is intellectual insulation.",
  },
  {
    index: 21, name: "Uttara Ashadha", lord: "Sun", deity: "The Vishvedevas",
    symbol: "An elephant's tusk", gana: "Manushya", yoni: "Mongoose", yoniGender: "Male",
    nadi: "Antya", span: "Sagittarius 26°40' – Capricorn 10°00'", rashi: "Sagittarius / Capricorn", bodyPart: "Thighs and waist",
    personality: "Uttara Ashadha is 'the later invincible one', and where Purva Ashadha wins by conviction, this Nakshatra wins by being genuinely right and genuinely persistent. The Vishvedevas are the collective universal gods — this is victory achieved with and for others rather than over them. Natives are principled, responsible and unusually incorruptible, with a strong sense of duty toward the group. The Sun across the Sagittarius–Capricorn cusp gives both idealism and administrative competence. Success here is slow, late and durable.",
    career: "Government and public administration, judiciary, defence leadership, non-profit and institutional work, engineering and infrastructure, teaching, and any long-horizon leadership role. Uttara Ashadha is associated with permanent achievements rather than quick ones.",
    relationship: "Sincere, responsible and somewhat formal. Uttara Ashadha natives take marriage seriously and behave honourably within it, though they are not naturally demonstrative. They can be so committed to their public duty that the relationship receives what is left over. Partners get integrity and reliability rather than romance.",
    health: "Thighs, waist, stomach and, later in life, the joints and skeletal system through Capricorn. Uttara Ashadha natives tend to overwork and to ignore fatigue as a moral failing rather than a signal.",
    strengths: ["Genuinely principled and incorruptible", "Achieves lasting rather than quick results", "Responsible toward the collective", "Patient and thorough", "Widely and deservedly respected"],
    weaknesses: ["Rigid about principle to the point of inflexibility", "Puts duty above people, including family", "Slow to act", "Struggles to relax or play"],
    remedy: "Sun remedies apply: offer water at sunrise, chant the Aditya Hridayam on Sundays. The specific practice for this Nakshatra is scheduled rest — Uttara Ashadha natives require permission to stop, and rarely give it to themselves.",
  },
  {
    index: 22, name: "Shravana", lord: "Moon", deity: "Vishnu",
    symbol: "An ear / three footprints", gana: "Deva", yoni: "Monkey", yoniGender: "Female",
    nadi: "Antya", span: "Capricorn 10°00' – 23°20'", rashi: "Capricorn", bodyPart: "Ears",
    personality: "Shravana is listening. The symbol is the ear, the deity is Vishnu who takes three strides across the universe, and the Nakshatra governs learning received through hearing — the oral tradition, the teaching passed down. Natives are attentive, well-informed and often the best-connected person in their circle, because they listen and remember. They accumulate knowledge and reputation steadily. The Moon in Capricorn gives an emotionally reserved, socially careful character. The shadow is gossip and an over-dependence on what others say — Shravana can absorb opinions without testing them.",
    career: "Teaching and academia, media and broadcasting, language and translation, music, counselling, public relations, research, religious scholarship, and the law. Shravana is strong in any field where the professional asset is knowing things and knowing people.",
    relationship: "Attentive and understanding partners — they actually listen, which is rarer than it should be. Shravana natives are loyal and family-oriented, with Capricorn's seriousness about obligation. The failing is oversensitivity to what others say about the relationship and a tendency to absorb criticism deeply.",
    health: "Ear problems specifically — infections, tinnitus, hearing loss — along with skin conditions and, through Capricorn, the knees and joints. Shravana natives are sensitive to noise and benefit from quiet environments more than most.",
    strengths: ["Genuinely listens and retains", "Well-informed and widely connected", "Scholarly and methodical", "Loyal to family and teachers", "Builds reputation steadily"],
    weaknesses: ["Prone to gossip and repeating what it hears", "Oversensitive to criticism", "Accepts received opinion too readily", "Socially anxious about reputation"],
    remedy: "Moon remedies apply: offer water on Mondays and wear silver. Vishnu worship — particularly the Vishnu Sahasranama, which is heard rather than read — is the practice specific to this Nakshatra.",
  },
  {
    index: 23, name: "Dhanishta", lord: "Mars", deity: "The eight Vasus",
    symbol: "A drum (mridanga)", gana: "Rakshasa", yoni: "Lion", yoniGender: "Female",
    nadi: "Madhya", span: "Capricorn 23°20' – Aquarius 6°40'", rashi: "Capricorn / Aquarius", bodyPart: "Back and anus",
    personality: "Dhanishta is rhythm, wealth and performance. The drum symbol indicates both music and the ability to set the tempo others move to; the Vasus are the deities of material abundance. Natives are energetic, musically or rhythmically gifted, and among the most reliably prosperous of the Nakshatras. Mars in the Capricorn–Aquarius range gives disciplined ambition with a social conscience. Dhanishta people are generous and enjoy being seen to be generous. The shadow is materialism and a hardness — the Rakshasa gana and lion yoni give a willingness to be ruthless about advancement.",
    career: "Music and performance, real estate and property, finance and investment, mining and minerals, sports, defence, engineering, and group or community leadership. Dhanishta is one of the strongest Nakshatras for accumulation of wealth.",
    relationship: "Generous, socially active and slightly detached. Dhanishta natives provide well and are good company, but Aquarian influence gives a certain emotional coolness — they may treat the relationship as one commitment among several. Classical texts flag some difficulty with marital happiness for this Nakshatra, particularly delayed marriage; the practical reading is that the native's ambitions and social life compete with the partnership.",
    health: "The back, spine and lower abdomen, plus circulatory issues and, through Aquarius, the ankles. Dhanishta natives are typically physically strong and prone to injury through overexertion.",
    strengths: ["Materially successful and generous with it", "Musically and rhythmically gifted", "Energetic and hard-working", "Leads groups effectively", "Socially prominent"],
    weaknesses: ["Materialistic", "Emotionally cool with intimates", "Ruthless about advancement", "Can be boastful about success"],
    remedy: "Mars remedies apply: chant the Mangal mantra on Tuesdays, donate red lentils or copper. Dhanishta natives benefit from anonymous charity, which addresses the Nakshatra's tendency to make generosity a performance.",
  },
  {
    index: 24, name: "Shatabhisha", lord: "Rahu", deity: "Varuna",
    symbol: "An empty circle", gana: "Rakshasa", yoni: "Horse", yoniGender: "Female",
    nadi: "Aadi", span: "Aquarius 6°40' – 20°00'", rashi: "Aquarius", bodyPart: "Jaw and right thigh",
    personality: "Shatabhisha means 'a hundred healers' or 'a hundred medicines', and its symbol is an empty circle — the enclosure, the isolation, the void within which healing happens. Natives are solitary, unconventional and often genuinely gifted in healing or in seeing systems others cannot. Varuna is the god of cosmic law and of the waters, and he binds — Shatabhisha natives frequently deal with things that are hidden, restricted or secret. Rahu's rulership makes them independent, unorthodox and drawn to whatever mainstream opinion has dismissed. They are private to the point of secrecy and can be very hard to know.",
    career: "Medicine, especially alternative and research medicine; astrology and esoteric sciences; technology and systems engineering; scientific research; aviation and space; distilling and chemistry; and any solitary technical vocation. Shatabhisha is a classic healer's Nakshatra.",
    relationship: "Independent and emotionally guarded. Shatabhisha natives need substantial solitude and can seem cold to partners who need constant presence. They are honest and, once committed, dependable, but they do not open easily and may keep areas of their life entirely private. Late marriage is common.",
    health: "Genuinely associated with unusual or hard-to-diagnose conditions, and with the ankles, calves and circulatory system through Aquarius. Shatabhisha natives often have strong recuperative power and an interest in their own treatment. There is also a classical link to addiction that is worth taking seriously.",
    strengths: ["Genuine healing capacity", "Sees systems and patterns others miss", "Fiercely independent", "Unimpressed by conventional opinion", "Perseveres in solitary work"],
    weaknesses: ["Isolated and secretive", "Emotionally unavailable", "Stubbornly contrarian", "Prone to addiction and self-medication"],
    remedy: "Rahu remedies apply: chant the Rahu mantra and donate to the sick or marginalised. Varuna worship, and offerings at water, is specific to this Nakshatra. Deliberately maintaining a few close relationships counteracts its characteristic isolation.",
  },
  {
    index: 25, name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada",
    symbol: "The front legs of a funeral cot", gana: "Manushya", yoni: "Lion", yoniGender: "Male",
    nadi: "Aadi", span: "Aquarius 20°00' – Pisces 3°20'", rashi: "Aquarius / Pisces", bodyPart: "Sides of the body and the left foot",
    personality: "Purva Bhadrapada is the fierce edge of spirituality. Aja Ekapada is the one-footed goat, a form associated with Rudra — an austere, burning, single-pointed deity. Natives are intense, idealistic and capable of extreme commitment to a principle, sometimes at real cost to themselves. This Nakshatra produces both genuine mystics and genuine fanatics, and the difference lies in whether the intensity is directed inward or at other people. Jupiter's rulership gives philosophical depth. Natives are often unusually eloquent about difficult subjects and unafraid of death, suffering and the shadow side of life.",
    career: "Priesthood and religious vocation, occult and tantric practice, funeral and death-related professions, statistics and risk analysis, radical politics and activism, surgery, and research into dangerous or difficult subjects. Purva Bhadrapada also produces powerful writers and speakers.",
    relationship: "Intense and demanding. Purva Bhadrapada natives bring their idealism into relationships and can hold partners to standards that are not reasonable. They are passionate and loyal but prone to anxiety and to sudden withdrawal into their own inner world. A partner who shares their conviction fares far better than one who finds it excessive.",
    health: "The sides of the body, the feet and ankles, and the digestive system. Anxiety is a genuine feature of this Nakshatra, along with sleep disturbance. Purva Bhadrapada natives may also be prone to unusual accidents.",
    strengths: ["Capable of extraordinary commitment", "Philosophically and spiritually deep", "Unafraid of the difficult and the taboo", "Eloquent and persuasive", "Sees through comfortable illusions"],
    weaknesses: ["Fanatical when the intensity turns outward", "Anxious and prone to worry", "Cynical about ordinary human weakness", "Neglects the practical and material"],
    remedy: "Jupiter remedies apply: chant the Guru mantra on Thursdays and donate yellow items. Shiva worship, particularly Rudra Abhishek, is specific to this Nakshatra. Grounding practices matter — this is a Nakshatra that needs anchoring.",
  },
  {
    index: 26, name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahir Budhnya",
    symbol: "The back legs of a funeral cot", gana: "Manushya", yoni: "Cow", yoniGender: "Female",
    nadi: "Madhya", span: "Pisces 3°20' – 16°40'", rashi: "Pisces", bodyPart: "Shins and the soles of the feet",
    personality: "Where Purva Bhadrapada burns, Uttara Bhadrapada rests. Ahir Budhnya is the serpent of the deep — the coiled wisdom lying still at the bottom of the ocean. This Nakshatra is classically considered among the most benevolent, and its natives are calm, wise, compassionate and remarkably difficult to provoke. Saturn in Pisces gives disciplined compassion rather than sentimental compassion: they help in ways that actually work. Uttara Bhadrapada natives are often sought out for advice, carry other people's confidences well, and have a genuine inner life that they do not advertise.",
    career: "Counselling and psychotherapy, spiritual teaching, charitable and humanitarian work, medicine, research, writing, law with a social dimension, and advisory roles. This Nakshatra also does well in solitary contemplative or scholarly work.",
    relationship: "Steady, kind and forgiving. Uttara Bhadrapada is one of the better Nakshatras for domestic happiness — natives are patient, undemanding and slow to anger. The corresponding weakness is passivity: they tolerate too much for too long and may stay in situations they should have left, mistaking endurance for virtue.",
    health: "Feet, shins and ankles; digestive complaints; and a tendency toward lethargy or fluid retention. Uttara Bhadrapada natives are generally long-lived and healthy but under-exercise.",
    strengths: ["Genuinely wise and even-tempered", "Compassionate in practical ways", "Deep inner life", "Trusted with confidences", "Rarely provoked into bad decisions"],
    weaknesses: ["Passive; endures what it should refuse", "Lethargic and slow to act", "Withdraws rather than confronts", "Can be detached from practical ambition"],
    remedy: "Saturn remedies apply: serve the elderly, donate black sesame on Saturdays. This Nakshatra's practical discipline is asserting a boundary early rather than enduring — its difficulties nearly all stem from tolerating too much.",
  },
  {
    index: 27, name: "Revati", lord: "Mercury", deity: "Pushan",
    symbol: "A fish / a drum", gana: "Deva", yoni: "Elephant", yoniGender: "Female",
    nadi: "Antya", span: "Pisces 16°40' – 30°00'", rashi: "Pisces", bodyPart: "Feet and ankles",
    personality: "Revati is the last Nakshatra, the completion of the zodiac, and it carries the quality of safe arrival. Pushan is the shepherd god who guides travellers home and protects animals and the vulnerable. Natives are gentle, nurturing, artistically gifted and almost universally well-liked. They have a strong protective instinct toward anything weaker than themselves — children, animals, the struggling friend. Mercury in Pisces gives imaginative intelligence rather than analytical intelligence. The weakness is a certain unworldliness: Revati natives are easily taken advantage of and often disappointed by people who do not deserve the trust they extended.",
    career: "Care work and nursing, veterinary medicine, teaching young children, art, music and dance, writing and imaginative work, travel and hospitality, spiritual and pastoral roles, and marine or aquatic fields. Revati is strong wherever the work is looking after someone.",
    relationship: "Devoted, affectionate and idealistic. Revati natives are among the most loving partners and the most likely to be hurt, because they give trust before it has been earned and forgive faster than is wise. In a good relationship they are wonderful; in a bad one they stay far too long. Family harmony matters enormously to them.",
    health: "The feet and ankles specifically, plus the lymphatic and immune systems. Revati natives are physically sensitive, sometimes with allergies or low stamina, and are affected by their environment more than most. Emotional distress registers physically and quickly.",
    strengths: ["Genuinely kind and nurturing", "Artistically and imaginatively gifted", "Protective of the vulnerable", "Well-liked across every group", "Brings things to completion"],
    weaknesses: ["Naive; trusts too readily", "Easily exploited", "Oversensitive to atmosphere and criticism", "Avoids confrontation entirely"],
    remedy: "Mercury remedies apply: chant the Budha mantra on Wednesdays and donate green gram. Care of animals is the practice specific to Pushan and to this Nakshatra. Revati natives benefit most from learning to withhold trust until it is earned.",
  },
];

const BY_NAME = new Map(NAKSHATRA_PROFILES.map((p) => [p.name, p]));

export function getNakshatraProfile(name: string): NakshatraProfile | undefined {
  return BY_NAME.get(name);
}

export function getNakshatraProfileByIndex(idx: number): NakshatraProfile {
  return NAKSHATRA_PROFILES[idx];
}

/** Attribute lookups, so no other module has to keep its own copy. */
export const GANA_BY_INDEX: Gana[] = NAKSHATRA_PROFILES.map((p) => p.gana);
export const YONI_BY_INDEX: string[] = NAKSHATRA_PROFILES.map((p) => p.yoni);
export const NADI_BY_INDEX: Nadi[] = NAKSHATRA_PROFILES.map((p) => p.nadi);
export const DEITY_BY_INDEX: string[] = NAKSHATRA_PROFILES.map((p) => p.deity);
export const SYMBOL_BY_INDEX: string[] = NAKSHATRA_PROFILES.map((p) => p.symbol);
