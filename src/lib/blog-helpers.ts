import { getCollection } from "astro:content";
import type { SiteLocale } from "./i18n";
import { getDateLocale } from "./i18n";
import { getNovelHref } from "./i18n";
import { mirrorNovelData } from "./novel-helpers";

const allowedSections = new Set(["log", "tech", "ancient", "novel"]);

const isIndexPage = (entry: { data: { legacyPath?: string } }) =>
  Boolean(entry.data.legacyPath?.endsWith("_index.md"));

export async function getLatestPosts(limit = 6) {
  const allEntries = await getCollection("blog");
  return allEntries
    .filter((entry) => !entry.data.draft)
    .filter((entry) => allowedSections.has(entry.data.section || entry.id.split("/")[0]))
    .filter((entry) => !isIndexPage(entry))
    .sort((a, b) => {
      const aTime = a.data.date ? a.data.date.getTime() : 0;
      const bTime = b.data.date ? b.data.date.getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}

const NOVEL_INDEX_IDS = new Set(["novel", "zh-CN/novel", "en/novel"]);

export async function getHomeNovels(locale: SiteLocale = "zh-CN") {
  const prefix = locale === "en-US" ? "en/" : "zh-CN/";
  const novelEntries = await getCollection("novel");
  return novelEntries
    .filter((e) => !e.data.draft)
    .filter((e) => e.id.startsWith(prefix))
    .filter((e) => !e.data.chapter && !e.data.novel && !NOVEL_INDEX_IDS.has(e.id))
    .map((e) => ({
      id: e.id.replace(/^(zh-CN|en)\//, ""),
      data: locale === "zh-CN" || locale === "en-US" ? e.data : mirrorNovelData(e.data, locale),
      href: getNovelHref(locale, e.id.replace(/^(zh-CN|en)\//, "")),
    }));
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
    .filter((entry) => allowed.has(entry.data.section || entry.id.split("/")[0]));

  const novelPrefix = locale === "en-US" ? "en/" : "zh-cn/";
  const novelEntries = await getCollection("novel");
  const novelCount = novelEntries.filter(
    (e) =>
      !e.data.draft &&
      e.id.toLowerCase().startsWith(novelPrefix) &&
      !e.data.chapter &&
      !e.data.novel &&
      !["novel", "zh-cn/novel", "en/novel"].includes(e.id.toLowerCase())
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
