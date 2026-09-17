import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogIndex } from "../lib/blog-index";

export async function GET(_context: APIContext) {
  const { posts: allPosts } = await getBlogIndex();
  const posts = allPosts.slice(0, 50);

  return rss({
    title: "亦幸小阁",
    description:
      "个人品牌站点 Cite 轨订阅：技术博客（AI 工程实践、GEO/SEO、论文解读、开发工具链、知识管理）与项目动态。不含 /shelf/ 版权小说正文。",
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
