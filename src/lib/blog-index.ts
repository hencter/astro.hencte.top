import { getCollection, type CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

/** Route-bearing sections (keep in sync with pages/[...slug].astro). */
export const BLOG_ROUTE_SECTIONS = new Set(["log", "tech", "ancient", "posts"]);

export function inferBlogSection(entry: {
  id: string;
  data: { section?: string };
}): string {
  return entry.data.section || entry.id.split("/")[0] || "blog";
}

export function isBlogIndexPage(entry: {
  data: { legacyPath?: string };
}): boolean {
  return Boolean(entry.data.legacyPath?.endsWith("_index.md"));
}

export function byBlogDateDesc(
  a: { data: { date?: Date } },
  b: { data: { date?: Date } },
): number {
  return (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);
}

export interface BlogIndex {
  /** Non-draft, non-index entries across the whole corpus, date desc. */
  posts: BlogEntry[];
  /** Non-draft entries in route-bearing sections (incl. index pages), date desc. */
  routed: BlogEntry[];
  /** Section _index pages within routed sections. */
  indexPages: BlogEntry[];
  /** Routed entries minus index pages. */
  routedPosts: BlogEntry[];
}

let cache: Promise<BlogIndex> | null = null;

/**
 * Shared blog index — one getCollection + one filter/sort pass per build,
 * reused by pages, RSS, llms.txt and related-post logic instead of every
 * consumer re-running its own getCollection/filter/sort chain.
 */
export function getBlogIndex(): Promise<BlogIndex> {
  if (!cache) {
    cache = getCollection("blog").then((entries) => {
      const publicEntries = entries
        .filter((entry) => !entry.data.draft)
        .sort(byBlogDateDesc);
      const routed = publicEntries.filter((entry) =>
        BLOG_ROUTE_SECTIONS.has(inferBlogSection(entry)),
      );
      const indexPages = routed.filter(isBlogIndexPage);
      const routedPosts = routed.filter((entry) => !isBlogIndexPage(entry));
      return {
        posts: publicEntries.filter((entry) => !isBlogIndexPage(entry)),
        routed,
        indexPages,
        routedPosts,
      };
    });
  }
  return cache;
}
