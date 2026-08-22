import type { BlogPost } from "./types";
import { readingTime } from "./types";
import { ARTICLES } from "./articles";
import { GENERATED_POSTS } from "./generated-posts";

// Re-exported so existing consumers can keep importing the type from here.
export type { BlogPost };
export { readingTime };

/**
 * All blog posts — hand-written articles plus the programmatically generated
 * reference posts. `readTime` is derived from the word count at load time for
 * every post, so it can never be inflated by hand.
 */
export const BLOG_POSTS: BlogPost[] = [...ARTICLES, ...GENERATED_POSTS].map((p) => ({
  ...p,
  readTime: readingTime(p.content),
}));

/**
 * Hand-written articles only, newest first. This is what the blog index, the
 * sitemap and the prev/next navigation use — templated posts are reference
 * material, not editorial content, and presenting them as articles is what
 * makes a site read as thin.
 */
export const EDITORIAL_POSTS: BlogPost[] = BLOG_POSTS
  .filter((p) => !p.generated)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
