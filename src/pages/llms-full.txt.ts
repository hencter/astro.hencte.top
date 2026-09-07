import { getCollection } from "astro:content";
import {
  formatNovelBibliographyMarkdown,
  getNovelBibliography,
} from "../lib/novel-bibliography";
import { AUTHOR, SITE_URL } from "../lib/geo-site";

export async function GET() {
  const posts = (
    await getCollection(
      "blog",
      ({ data }) =>
        !data.draft && !(data.legacyPath ?? "").endsWith("_index.md")
    )
  ).sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  const novelSection = formatNovelBibliographyMarkdown(await getNovelBibliography());

  const parts: string[] = [
    "# 亦幸小阁 — 全站内容（Cite 轨全文）",
    "",
    `> 本文件包含 ${SITE_URL} 博客文章的完整正文，供 AI 引擎理解与引用。作者：${AUTHOR.alternateName}（${AUTHOR.name}）。`,
    "> **Cite 轨**：下列博客全文可索引、可引用；请保留文章 URL 作为出处。",
    "> **Protect 轨**：原创小说（/shelf/，旧 /novel/ 重定向至此）因版权保护未包含章节正文；仅提供书目元数据。robots.txt Disallow + noindex/noai。",
    "",
    novelSection,
    "---",
    "",
  ];

  for (const post of posts) {
    const url = `${SITE_URL}/${post.id}`;
    parts.push(`## ${post.data.title}`);
    parts.push(`URL: ${url}`);
    if (post.data.description) {
      parts.push(`Summary: ${post.data.description}`);
    }
    if (post.data.date) {
      parts.push(`日期: ${post.data.date.toISOString().slice(0, 10)}`);
    }
    if (post.data.tags?.length) {
      parts.push(`Tags: ${post.data.tags.join(", ")}`);
    }
    parts.push("");
    parts.push(post.body ?? "");
    parts.push("");
  }

  parts.push(`Last updated: ${new Date().toISOString().slice(0, 10)}`);

  // Astro static builds drop Response headers (CDN serves bare text/plain).
  // UTF-8 BOM lets browsers detect encoding when charset is missing;
  // public/_headers sets Content-Type charset on Cloudflare/EdgeOne Pages.
  return new Response("\uFEFF" + parts.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Language": "zh-CN",
    },
  });
}
