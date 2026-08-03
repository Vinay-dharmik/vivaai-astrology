import type { SourceKey } from "@/lib/author";

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** First publication date, ISO. */
  date: string;
  /** Last substantive revision. Only set when the article actually changed. */
  updated?: string;
  category: string;
  /**
   * Derived from the word count at module load, never authored by hand.
   *
   * These used to be typed in, and every one of them was wrong in the same
   * direction — a 320-word post was labelled "8 min read". Inflating a reading
   * estimate to make an article look substantial is a small lie that the
   * article itself immediately contradicts.
   */
  readTime: string;
  content: string;
  /**
   * Classical or technical works this article draws on. Rendered as a sources
   * block at the foot of the page, so a reader can trace any rule stated here
   * back to a named text rather than taking the site's word for it.
   */
  sources?: SourceKey[];
  /** Rendered on-page and emitted as FAQPage structured data. */
  faqs?: ArticleFaq[];
  /**
   * True for posts assembled from a data template rather than written by an
   * editor. They stay reachable but are excluded from the blog index, the
   * sitemap, and ad placement so the site is judged on its editorial work.
   */
  generated?: boolean;
}

/** Words per minute for the reading estimate — the usual prose figure. */
const WPM = 220;

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WPM))} min read`;
}

export function wordCount(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}
