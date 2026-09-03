import { getCollection } from "astro:content";
import type { SiteLocale } from "./i18n";
import { getDateLocale } from "./i18n";
import { getNovelHref } from "./i18n";
import { entrySlug, hasNovelLocalePrefix, isSeriesLanding, mirrorNovelData } from "./novel-helpers";

const allowedSections = new Set(["log", "tech", "ancient", "novel"]);

const isIndexPage = (entry: { data: { legacyPath?: string } }) =>
  Boolean(entry.data.legacyPath?.endsWith("_index.md"));

/**
 * Temporary English detector until blog schema gains `lang`.
 * Convention: leaf slug ends with `-en` (e.g. `tech/geo-two-years-en`).
 */
export function isEnglishBlogId(id: string): boolean {
  const leaf = id.split("/").pop() ?? id;
  return leaf.endsWith("-en");
}

/** Route↔content: zh* shells see Chinese corpus; `/en` sees English-only. */
export function blogIdMatchesLocale(id: string, locale: SiteLocale): boolean {
  const isEn = isEnglishBlogId(id);
  return locale === "en-US" ? isEn : !isEn;
}

export async function getLatestPosts(limit = 6, locale: SiteLocale = "zh-CN") {
  const allEntries = await getCollection("blog");
  return allEntries
    .filter((entry) => !entry.data.draft)
    .filter((entry) => allowedSections.has(entry.data.section || entry.id.split("/")[0]))
    .filter((entry) => !isIndexPage(entry))
    .filter((entry) => blogIdMatchesLocale(entry.id, locale))
    .sort((a, b) => {
      const aTime = a.data.date ? a.data.date.getTime() : 0;
      const bTime = b.data.date ? b.data.date.getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}

export async function getHomeNovels(locale: SiteLocale = "zh-CN") {
  const novelEntries = await getCollection("novel");
  return novelEntries
    .filter((e) => !e.data.draft)
    .filter((e) => hasNovelLocalePrefix(e.id, locale))
    .filter((e) => isSeriesLanding(e))
    .map((e) => {
      const slug = entrySlug(e)!;
      return {
        id: slug,
        data: locale === "zh-CN" || locale === "en-US" ? e.data : mirrorNovelData(e.data, locale),
        href: getNovelHref(locale, slug),
      };
    });
}

export interface BlogIndexSection {
  key: string;
  label: string;
  description?: string;
  href: string;
}

export interface BlogIndexPost {
  id: string;
  title: string;
  description?: string;
  body?: string;
  date?: Date;
  tags: string[];
  sectionKey: string;
}

export interface BlogIndexData {
  posts: BlogIndexPost[];
  novelCount: number;
  countsBySection: Record<string, number>;
  latestPosts: BlogIndexPost[];
  sectionLabels: Record<string, string>;
}

function extractSummary(description: string | undefined, body: string | undefined, fallback: string): string {
  if (description?.trim()) return description.trim();
  const source = body ?? "";
  const plainText = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/[>#*_~!\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plainText) return fallback;
  return plainText.length > 110 ? `${plainText.slice(0, 110)}...` : plainText;
}

export function formatBlogDate(date: Date | undefined, locale: SiteLocale, pendingLabel: string): string {
  if (!date) return pendingLabel;
  return date.toLocaleDateString(getDateLocale(locale), {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: locale === "en-US" ? "short" : "2-digit",
    day: "2-digit",
  });
}

export async function getBlogIndexData(
  sectionMeta: BlogIndexSection[],
  locale: SiteLocale
): Promise<BlogIndexData> {
  const allowed = new Set(sectionMeta.map((item) => item.key));
  const allEntries = await getCollection("blog");
  const publicEntries = allEntries
    .filter((entry) => !entry.data.draft)
    .filter((entry) => allowed.has(entry.data.section || entry.id.split("/")[0]))
    .filter((entry) => blogIdMatchesLocale(entry.id, locale));

  const novelEntries = await getCollection("novel");
  const novelCount = novelEntries.filter(
    (e) => !e.data.draft && hasNovelLocalePrefix(e.id, locale) && isSeriesLanding(e)
  ).length;

  const posts = publicEntries
    .filter((entry) => !isIndexPage(entry))
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0))
    .map((entry) => ({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      body: entry.body,
      date: entry.data.date,
      tags: entry.data.tags,
      sectionKey: entry.data.section || entry.id.split("/")[0],
    }));

  const sectionLabels = Object.fromEntries(sectionMeta.map((item) => [item.key, item.label]));
  const countsBySection = Object.fromEntries(
    sectionMeta.map((item) => [
      item.key,
      item.key === "novel"
        ? novelCount
        : posts.filter((entry) => entry.sectionKey === item.key).length,
    ])
  );

  return {
    posts,
    novelCount,
    countsBySection,
    latestPosts: posts.slice(0, 18),
    sectionLabels,
  };
}

export { extractSummary };
