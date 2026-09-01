import { getCollection } from "astro:content";
import { getNovelHref } from "./novel-helpers";

const INDEX_IDS = new Set(["novel", "zh-CN/novel", "en/novel"]);
const SITE = "https://hencte.top";

export interface NovelBibliographyEntry {
  slug: string;
  titleZh: string;
  titleEn?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  genres: string[];
  chapterCountZh: number;
  chapterCountEn: number;
  enComingSoon: boolean;
  urls: {
    zh: string;
    en: string;
    tw: string;
    hk: string;
  };
}

export async function getNovelBibliography(): Promise<NovelBibliographyEntry[]> {
  const all = await getCollection("novel");
  const publicEntries = all.filter((e) => !e.data.draft);

  const zhLandings = publicEntries.filter(
    (e) =>
      e.id.toLowerCase().startsWith("zh-cn/") &&
      !e.data.novel &&
      !e.data.chapter &&
      !["novel", "zh-cn/novel", "en/novel"].includes(e.id.toLowerCase())
  );

  return zhLandings.map((zhLanding) => {
    const slug = zhLanding.id.replace(/^zh-cn\//i, "");
    const enLanding = publicEntries.find((e) => e.id.toLowerCase() === `en/${slug}`.toLowerCase());
    const genres = (zhLanding.data.tags as string[] | undefined)?.length
      ? (zhLanding.data.tags as string[])
      : inferGenres(zhLanding.data.description as string | undefined);

    const chapterCountZh = publicEntries.filter(
      (e) => e.id.toLowerCase().startsWith("zh-cn/") && e.data.novel === slug
    ).length;
    const chapterCountEn = publicEntries.filter(
      (e) => e.id.toLowerCase().startsWith("en/") && e.data.novel === slug
    ).length;

    return {
      slug,
      titleZh: zhLanding.data.title,
      titleEn: enLanding?.data.title,
      descriptionZh: zhLanding.data.description,
      descriptionEn: enLanding?.data.description,
      genres,
      chapterCountZh,
      chapterCountEn,
      enComingSoon: Boolean(enLanding?.data.comingSoon),
      urls: {
        zh: `${SITE}${getNovelHref("zh-CN", slug)}`,
        en: `${SITE}${getNovelHref("en-US", slug)}`,
        tw: `${SITE}${getNovelHref("zh-TW", slug)}`,
        hk: `${SITE}${getNovelHref("zh-HK", slug)}`,
      },
    };
  });
}

function inferGenres(description?: string): string[] {
  if (!description) return ["fiction"];
  const lower = description.toLowerCase();
  const genres: string[] = ["fiction"];
  if (/科幻|cyberpunk|2057|starlink|orbit/i.test(description + lower)) {
    genres.push("science fiction", "cyberpunk");
  }
  if (/ai|人工智能/i.test(description)) genres.push("AI");
  return genres;
}

export function formatNovelBibliographyMarkdown(entries: NovelBibliographyEntry[]): string {
  const lines: string[] = [
    "## 原创小说（书目元数据）",
    "",
    "> **AI 训练政策**：/novel/ 路径下的小说为版权保护原创内容，仅供人类读者在线阅读。",
    "> robots.txt 禁止 AI 爬虫抓取；章节页标记 noindex/noai/noimageai。",
    "> 本节仅提供书目元数据（标题、作者、体裁、章节数、入口 URL），不含正文。",
    "",
  ];

  for (const entry of entries) {
    const enStatus = entry.enComingSoon
      ? "英文版筹备中"
      : entry.chapterCountEn > 0
        ? `${entry.chapterCountEn} 章`
        : "无英文版";
    lines.push(`### ${entry.titleZh}${entry.titleEn ? ` / ${entry.titleEn}` : ""}`);
    lines.push(`- 作者: 亦幸 (Hencter Lew)`);
    lines.push(`- Slug: \`${entry.slug}\``);
    lines.push(`- 体裁: ${entry.genres.join(", ")}`);
    lines.push(`- 章节: 简体 ${entry.chapterCountZh} 章 · 英文 ${enStatus}`);
    if (entry.descriptionZh) lines.push(`- 简介（zh）: ${entry.descriptionZh}`);
    if (entry.descriptionEn) lines.push(`- 简介（en）: ${entry.descriptionEn}`);
    lines.push(`- 入口: [简体](${entry.urls.zh}) · [English](${entry.urls.en}) · [繁體 TW](${entry.urls.tw}) · [繁體 HK](${entry.urls.hk})`);
    lines.push(`- 章节目录模式: \`/${entry.slug}-ch{nn}\`（例: \`/${entry.slug}-ch01\`）`);
    lines.push(`- 插图: 系列封面（\`cover\`）+ 可选章节头图（\`chapterImage\`），见 landing/chapter 页；章节仍为 noindex/noai`);
    lines.push("");
  }

  lines.push("### 书架索引");
  lines.push(`- [小说书架（简体）](${SITE}/novel/): 原创小说目录`);
  lines.push(`- [Fiction shelf (EN)](${SITE}/en/novel/): English fiction index`);
  lines.push(`- [小說書架（台灣）](${SITE}/tw/novel/): 繁體中文（台灣）`);
  lines.push(`- [小說書架（香港）](${SITE}/hk/novel/): 繁體中文（香港）`);
  lines.push("");

  return lines.join("\n");
}
