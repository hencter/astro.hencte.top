import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(_context: APIContext) {
  const posts = (
    await getCollection(
      "blog",
      ({ data }) =>
        !data.draft && !(data.legacyPath ?? "").endsWith("_index.md")
    )
  )
    .sort(
      (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0)
    )
    .slice(0, 50);

  return rss({
    title: "亦幸小阁",
    description: "个人品牌站点：技术博客（AI 工程实践、论文解读、开发工具链、知识管理）、项目展示、原创小说",
    site: new URL("https://hencte.top"),
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? `${entry.data.title} - 亦幸小阁`,
      pubDate: entry.data.date,
      link: `/${entry.id}`,
    })),
    customData: "<language>zh-CN</language>",
    trailingSlash: false,
  });
}
