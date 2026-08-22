import type { BlogPost } from "../types";

// Each article lives in its own file and exports `post`. They are collected
// here so posts.ts has a single import for the entire editorial corpus.
import { post as ashtakavarga } from "./ashtakavarga-bindu-system-guide";
import { post as ayanamsa } from "./ayanamsa-sidereal-vs-tropical-zodiac";
import { post as birthTimeRectification } from "./birth-time-rectification-guide";
import { post as careerTenthHouse } from "./career-astrology-tenth-house-guide";
import { post as combustionRetrograde } from "./combustion-retrograde-planets-guide";
import { post as gemstones } from "./gemstones-vedic-astrology-complete-guide";
import { post as northIndianChart } from "./how-to-read-north-indian-birth-chart";
import { post as kundaliMatching } from "./kundali-matching-ashtakoot-guide";
import { post as manglikDosha } from "./manglik-dosha-complete-guide";
import { post as nakshatraCompatibility } from "./nakshatra-compatibility-marriage-guide";
import { post as navamsa } from "./navamsa-d9-chart-guide";
import { post as numerology } from "./numerology-life-path-number-guide";
import { post as panchang } from "./panchang-daily-hindu-calendar-guide";
import { post as planetaryAspects } from "./planetary-aspects-drishti-guide";
import { post as rahuKetu } from "./rahu-ketu-nodes-vedic-astrology";
import { post as rajaYoga } from "./raja-yoga-dhana-yoga-guide";
import { post as sadeSati } from "./sade-sati-saturn-transit-guide";
import { post as shadbala } from "./shadbala-planetary-strength-explained";
import { post as vimshottari } from "./vimshottari-dasha-system-explained";
import { post as whatIsKundali } from "./what-is-kundali-vedic-birth-chart";
import { post as zodiacCompatibility } from "./zodiac-compatibility-guide";

/**
 * The full hand-written editorial corpus. Every entry is a substantive,
 * sourced article — no templated or thin posts. `readTime` is omitted here
 * and derived from the word count in posts.ts, so it can never disagree with
 * the actual length of the article.
 */
export const ARTICLES: Omit<BlogPost, "readTime">[] = [
  whatIsKundali,
  northIndianChart,
  navamsa,
  ayanamsa,
  vimshottari,
  planetaryAspects,
  rajaYoga,
  shadbala,
  ashtakavarga,
  combustionRetrograde,
  birthTimeRectification,
  rahuKetu,
  manglikDosha,
  sadeSati,
  kundaliMatching,
  nakshatraCompatibility,
  zodiacCompatibility,
  gemstones,
  careerTenthHouse,
  panchang,
  numerology,
];
