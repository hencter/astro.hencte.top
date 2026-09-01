import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { SiteLocale } from "./i18n";
import { LOCALE_CONFIG, localeToVariant } from "./i18n";
import { convertDeep, convertText } from "./opencc";

export type NovelEntry = CollectionEntry<"novel">;

const INDEX_IDS = new Set(["novel", "zh-CN/novel", "en/novel"]);
const ZH_CN_PREFIX = "zh-CN/";
const EN_PREFIX = "en/";

export function getNovelLocalePrefix(locale: SiteLocale): string {
  const base = LOCALE_CONFIG[locale].path.replace(/\/$/, "");
  return base ? `${base}/novel` : "/novel";
}

export function getNovelHref(locale: SiteLocale, slug: string | undefined): string {
  const prefix = getNovelLocalePrefix(locale);
  return slug ? `${prefix}/${slug}` : `${prefix}/`;
}

export function entrySlug(entry: NovelEntry): string | undefined {
  if (INDEX_IDS.has(entry.id)) return undefined;
  const parts = entry.id.split("/");
  return parts.length > 1 ? parts.slice(1).join("/") : entry.id;
}

export function contentLocale(entry: NovelEntry): "zh-CN" | "en-US" {
  if (entry.id.startsWith(EN_PREFIX)) return "en-US";
  return "zh-CN";
}

export function sourceLocaleForPage(locale: SiteLocale): "zh-CN" | "en-US" {
  return locale === "en-US" ? "en-US" : "zh-CN";
}

export function isChapterSlug(slug: string | undefined): boolean {
  return slug ? /-ch\d{2,}$/.test(slug) : false;
}

export function novelSeriesSlug(slug: string | undefined, entry?: NovelEntry): string | null {
  if (entry?.data.novel) return entry.data.novel as string;
  if (!slug) return null;
  const m = slug.match(/^(.+)-ch\d{2,}$/);
  return m ? m[1] : slug;
}

export async function getNovelEntriesForLocale(locale: SiteLocale): Promise<NovelEntry[]> {
  const prefix = locale === "en-US" ? EN_PREFIX : ZH_CN_PREFIX;
  const all = await getCollection("novel");
  return all.filter((e) => !e.data.draft && e.id.startsWith(prefix));
}

export function mirrorNovelData<T extends Record<string, unknown>>(
  data: T,
  locale: SiteLocale
): T {
  const variant = localeToVariant(locale);
  if (!variant) return data;
  return convertDeep(data, variant);
}

export function mirrorNovelBody(body: string, locale: SiteLocale): string {
  const variant = localeToVariant(locale);
  if (!variant) return body;
  return convertText(body, variant);
}

export function getNovelLanguageLinks(
  currentLocale: SiteLocale,
  slug: string | undefined,
  enAvailable: boolean
): { locale: SiteLocale; href: string; label: string; current: boolean }[] {
  return (Object.keys(LOCALE_CONFIG) as SiteLocale[]).map((locale) => {
    let href = getNovelHref(locale, slug);
    if (locale === "en-US" && slug && !enAvailable && slug !== undefined) {
      const series = novelSeriesSlug(slug);
      if (series === "ai-counter-taming") {
        href = getNovelHref("en-US", series);
      }
    }
    return {
      locale,
      href,
      label: LOCALE_CONFIG[locale].label,
      current: locale === currentLocale,
    };
  });
}

export async function enChapterExists(slug: string): Promise<boolean> {
  const all = await getCollection("novel");
  return all.some((e) => e.id === `${EN_PREFIX}${slug}` && !e.data.draft);
}

export async function enNovelExists(seriesSlug: string): Promise<boolean> {
  const all = await getCollection("novel");
  const landing = all.find((e) => e.id === `${EN_PREFIX}${seriesSlug}` && !e.data.draft);
  if (!landing) return false;
  if (landing.data.comingSoon) return false;
  const chapters = all.filter(
    (e) => e.id.startsWith(EN_PREFIX) && e.data.novel === seriesSlug && !e.data.draft
  );
  return chapters.length > 0;
}

export function sortChapters(a: NovelEntry, b: NovelEntry): number {
  return (Number(a.data.chapter) || 0) - (Number(b.data.chapter) || 0);
}

export function getNovelUiStrings(locale: SiteLocale) {
  const zh = {
    home: "首页",
    novelIndex: "小说目录",
    chapterSelect: "章节目录",
    prevChapter: "上一章",
    nextChapter: "下一章",
    lastRead: "上次读到",
    libraryTitle: "书架",
    librarySub: "原创小说 · 持续更新",
    backHome: "首页",
    wechatAlt: "微信公众号二维码",
    wechatHint: "扫码关注微信公众号",
    wechatMore: "阅读更多独家内容",
    comingSoon: "英文版即将推出",
    readZh: "阅读简体中文版",
    language: "语言",
  };
  if (locale === "en-US") {
    return {
      home: "Home",
      novelIndex: "Fiction",
      chapterSelect: "Chapters",
      prevChapter: "Previous",
      nextChapter: "Next",
      lastRead: "Continue reading",
      libraryTitle: "Bookshelf",
      librarySub: "Original fiction · ongoing",
      backHome: "Home",
      wechatAlt: "WeChat QR code",
      wechatHint: "Follow on WeChat",
      wechatMore: "for exclusive updates",
      comingSoon: "English edition coming soon",
      readZh: "Read in Simplified Chinese",
      language: "Language",
    };
  }
  if (locale === "zh-TW") {
    return {
      ...mirrorNovelData(zh, "zh-TW"),
      libraryTitle: "📚 書架",
    };
  }
  if (locale === "zh-HK") {
    return {
      ...mirrorNovelData(zh, "zh-HK"),
      libraryTitle: "📚 書架",
    };
  }
  return { ...zh, libraryTitle: "📚 书架" };
}

export function htmlLangForLocale(locale: SiteLocale): string {
  return LOCALE_CONFIG[locale].htmlLang;
}
