import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { SiteLocale } from "./i18n";
import {
  enChapterExists,
  entrySlug,
  getNovelHref,
  getNovelLanguageLinks,
  isChapterSlug,
  isSeriesLanding,
  mirrorNovelData,
  novelSeriesSlug,
  sortChapters,
  sourceLocaleForPage,
  type NovelEntry,
} from "./novel-helpers";
import { mirrorEntryData, novelBodyOwnTitle, renderNovelContent } from "./novel-render";

export interface ChapterItem {
  title: string;
  href: string;
  current: boolean;
}

export interface NovelPageContext {
  locale: SiteLocale;
  entry: NovelEntry;
  slug: string | undefined;
  displayData: NovelEntry["data"];
  Content: Awaited<ReturnType<typeof renderNovelContent>>["Content"];
  html: string | null;
  languageLinks: ReturnType<typeof getNovelLanguageLinks>;
  chapterCtx: {
    novelTitle: string;
    novelSlug: string;
    chapters: ChapterItem[];
    prevChapter: { title: string; href: string } | null;
    nextChapter: { title: string; href: string } | null;
    contentOwnTitle: boolean;
  } | null;
  landingCtx: {
    novelTitle: string;
    novelDescription: string;
    chapters: { title: string; href: string }[];
    novelSlug: string;
    comingSoon: boolean;
  } | null;
  indexNovels: {
    title: string;
    description?: string;
    href: string;
    slug: string;
    cover?: string;
    imageAlt?: string;
    /** Shelf category — fiction now; tutorials/guides plug in later */
    kind: "fiction" | "tutorial" | "guide";
  }[];
}

const INDEX_IDS = new Set(["novel", "zh-cn/novel", "en/novel"]);

function isIndexId(id: string): boolean {
  return INDEX_IDS.has(id.toLowerCase());
}

function hasPrefix(id: string, prefix: string): boolean {
  return id.toLowerCase().startsWith(prefix.toLowerCase());
}

export function findNovelIndexEntry(
  entries: NovelEntry[],
  source: "zh-CN" | "en-US"
): NovelEntry {
  const target = source === "en-US" ? "en/novel" : "zh-CN/novel";
  const found = entries.find((e) => e.id.toLowerCase() === target.toLowerCase());
  if (!found) throw new Error(`Missing ${target} index entry`);
  return found;
}

export async function getNovelStaticPaths(locale: SiteLocale) {
  const source = sourceLocaleForPage(locale);
  const prefix = source === "en-US" ? "en/" : "zh-cn/";
  const entries = await getCollection("novel");
  const publicEntries = entries.filter((e) => !e.data.draft && hasPrefix(e.id, prefix));

  const paths = publicEntries
    .filter((entry) => !isIndexId(entry.id))
    .map((entry) => ({
      params: { slug: entrySlug(entry)! },
      props: { entry, novelLocale: locale },
    }));

  if (locale === "zh-TW" || locale === "zh-HK") {
    const zhEntries = entries.filter((e) => !e.data.draft && hasPrefix(e.id, "zh-cn/"));
    return zhEntries
      .filter((entry) => !isIndexId(entry.id))
      .map((entry) => ({
        params: { slug: entrySlug(entry)! },
        props: { entry, novelLocale: locale },
      }));
  }

  return paths;
}

async function resolveZhMirrorEntry(
  locale: SiteLocale,
  slug: string | undefined
): Promise<NovelEntry | null> {
  if (locale !== "zh-TW" && locale !== "zh-HK") return null;
  const entries = await getCollection("novel");
  if (!slug) {
    return entries.find((e) => e.id.toLowerCase() === "zh-cn/novel") ?? null;
  }
  return entries.find((e) => entrySlug(e) === slug && e.id.toLowerCase().startsWith("zh-cn/")) ?? null;
}

export async function buildNovelPageContext(
  locale: SiteLocale,
  entry: NovelEntry,
  slugParam: string | undefined
): Promise<NovelPageContext> {
  let entryToUse = entry;
  if (locale === "zh-TW" || locale === "zh-HK") {
    const mirrored = await resolveZhMirrorEntry(locale, slugParam);
    if (mirrored) entryToUse = mirrored;
  }

  const slug = slugParam ?? entrySlug(entryToUse);
  const displayData =
    locale === "zh-TW" || locale === "zh-HK"
      ? mirrorEntryData(entryToUse, locale)
      : entryToUse.data;

  const { Content, html } = await renderNovelContent(entryToUse, locale);

  const isChapter = isChapterSlug(slug);
  const seriesSlug = novelSeriesSlug(slug, entryToUse);
  const enAvailable = slug ? await enChapterExists(slug) : true;

  const languageLinks = getNovelLanguageLinks(locale, slug, enAvailable);

  let chapterCtx: NovelPageContext["chapterCtx"] = null;
  let landingCtx: NovelPageContext["landingCtx"] = null;
  let indexNovels: NovelPageContext["indexNovels"] = [];

  const allEntries = await getCollection("novel");
  const sourcePrefix = locale === "en-US" ? "en/" : "zh-cn/";

  if (isChapter && slug && seriesSlug) {
    const landing = allEntries.find(
      (e) =>
        e.id.toLowerCase().startsWith(sourcePrefix.toLowerCase()) && entrySlug(e) === seriesSlug
    );
    const novelTitle =
      locale === "zh-TW" || locale === "zh-HK"
        ? mirrorNovelData(landing?.data ?? entryToUse.data, locale).title
        : landing?.data.title || seriesSlug;

    const chapterEntries = allEntries
      .filter((e) => !e.data.draft)
      .filter((e) => {
        const entrySeries = novelSeriesSlug(entrySlug(e), e);
        if (locale === "zh-TW" || locale === "zh-HK") {
          return hasPrefix(e.id, "zh-cn/") && entrySeries === seriesSlug && isChapterSlug(entrySlug(e));
        }
        return hasPrefix(e.id, sourcePrefix) && entrySeries === seriesSlug && isChapterSlug(entrySlug(e));
      })
      .sort(sortChapters);

    const ci = chapterEntries.findIndex((e) => entrySlug(e) === slug);
    const chapters: ChapterItem[] = chapterEntries.map((e) => {
      const s = entrySlug(e)!;
      const title =
        locale === "zh-TW" || locale === "zh-HK" ? mirrorNovelData(e.data, locale).title : e.data.title;
      return {
        title,
        href: getNovelHref(locale, s),
        current: s === slug,
      };
    });

    chapterCtx = {
      novelTitle,
      novelSlug: seriesSlug,
      chapters,
      contentOwnTitle: novelBodyOwnTitle(entryToUse.id),
      prevChapter:
        ci > 0
          ? {
              title:
                locale === "zh-TW" || locale === "zh-HK"
                  ? mirrorNovelData(chapterEntries[ci - 1].data, locale).title
                  : chapterEntries[ci - 1].data.title,
              href: getNovelHref(locale, entrySlug(chapterEntries[ci - 1])!),
            }
          : null,
      nextChapter:
        ci < chapterEntries.length - 1
          ? {
              title:
                locale === "zh-TW" || locale === "zh-HK"
                  ? mirrorNovelData(chapterEntries[ci + 1].data, locale).title
                  : chapterEntries[ci + 1].data.title,
              href: getNovelHref(locale, entrySlug(chapterEntries[ci + 1])!),
            }
          : null,
    };
  } else if (slug && !isIndexId(entryToUse.id)) {
    const chapterEntries = allEntries
      .filter((e) => !e.data.draft)
      .filter((e) => {
        const entrySeries = novelSeriesSlug(entrySlug(e), e);
        if (locale === "zh-TW" || locale === "zh-HK") {
          return hasPrefix(e.id, "zh-cn/") && entrySeries === slug && isChapterSlug(entrySlug(e));
        }
        return hasPrefix(e.id, sourcePrefix) && entrySeries === slug && isChapterSlug(entrySlug(e));
      })
      .sort(sortChapters);

    landingCtx = {
      novelTitle: displayData.title as string,
      novelDescription: (displayData.description as string) || "",
      chapters: chapterEntries.map((e) => ({
        title:
          locale === "zh-TW" || locale === "zh-HK" ? mirrorNovelData(e.data, locale).title : e.data.title,
        href: getNovelHref(locale, entrySlug(e)!),
      })),
      novelSlug: slug,
      comingSoon: Boolean(displayData.comingSoon),
    };
  } else {
    const prefix = locale === "en-US" ? "en/" : "zh-cn/";
    indexNovels = allEntries
      .filter((e) => !e.data.draft)
      .filter((e) => hasPrefix(e.id, prefix))
      .filter((e) => isSeriesLanding(e))
      .map((n) => {
        const data =
          locale === "zh-TW" || locale === "zh-HK" ? mirrorNovelData(n.data, locale) : n.data;
        return {
          title: data.title as string,
          description: data.description as string | undefined,
          href: getNovelHref(locale, entrySlug(n)!),
          slug: entrySlug(n)!,
          cover: (data.cover as string | undefined) ?? undefined,
          imageAlt: (data.imageAlt as string | undefined) ?? undefined,
          kind: "fiction" as const,
        };
      });
  }

  return {
    locale,
    entry: entryToUse,
    slug,
    displayData,
    Content,
    html,
    languageLinks,
    chapterCtx,
    landingCtx,
    indexNovels,
  };
}
