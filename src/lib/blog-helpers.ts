import { getCollection } from "astro:content";
import type { SiteLocale } from "./i18n";
import { getNovelHref } from "./i18n";
import { mirrorNovelData } from "./novel-helpers";

const allowedSections = new Set(["log", "tech", "ancient"]);

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
