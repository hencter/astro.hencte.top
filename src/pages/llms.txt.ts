import { getCollection } from "astro:content";
import {
  formatNovelBibliographyMarkdown,
  getNovelBibliography,
} from "../lib/novel-bibliography";

export async function GET() {
  const posts = (
    await getCollection(
      "blog",
      ({ data }) =>
        !data.draft && !(data.legacyPath ?? "").endsWith("_index.md")
    )
  ).sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  const blogLines = posts.map((post) => {
    const description = post.data.description;
    return description
      ? `- [${post.data.title}](https://hencte.top/${post.id}): ${description}`
      : `- [${post.data.title}](https://hencte.top/${post.id})`;
  });

  const novelEntries = await getNovelBibliography();
  const novelSection = formatNovelBibliographyMarkdown(novelEntries);
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const content = `# 亦幸小阁

> 个人品牌站点：技术博客（AI 工程实践、论文解读、开发工具链、知识管理）、项目展示。作者：亦幸（Hencter Lew）。语言：zh-CN（默认）/ zh-TW（/tw）/ zh-HK（/hk）/ en-US。联系：hencter@linktrust.top

## 核心页面

- [首页](https://hencte.top/): 个人品牌主页与最新内容
- [项目](https://hencte.top/projects): Nova、通天路、商业帝国 3D 等技术项目
- [关于](https://hencte.top/about): 作者背景与联系方式
- [博客](https://hencte.top/blog): 技术文章索引
- [RSS](https://hencte.top/rss.xml): 博客更新订阅

## 英文页面

- [Home (EN)](https://hencte.top/en): English homepage
- [Projects (EN)](https://hencte.top/en/projects): Project portfolio
- [About (EN)](https://hencte.top/en/about): Author bio
- [Obsidian Plugins (EN)](https://hencte.top/en/obsidian/plugins): Plugin documentation

## 繁体中文页面

- [首頁（台灣）](https://hencte.top/tw): 繁體中文（台灣）首頁
- [項目（台灣）](https://hencte.top/tw/projects): 繁體中文（台灣）項目展示
- [關於（台灣）](https://hencte.top/tw/about): 繁體中文（台灣）作者介紹
- [首頁（香港）](https://hencte.top/hk): 繁體中文（香港）首頁
- [項目（香港）](https://hencte.top/hk/projects): 繁體中文（香港）項目展示
- [關於（香港）](https://hencte.top/hk/about): 繁體中文（香港）作者介紹

## 博客文章

${blogLines.join("\n")}

${novelSection}
## 作者资产

- [GitHub (@hencter)](https://github.com/hencter): 开源项目与代码
- [Nova](https://github.com/hencter/Nova): AI 自举知识库模板
- [通天路社区](https://tongtianlu.cn): AI 创作者互助社区

## Optional

- [llms-full.txt](https://hencte.top/llms-full.txt): 博客文章全文索引（不含 /novel/ 版权内容）
- [llm.txt](https://hencte.top/llm.txt): 站点实体与 FAQ 摘要（KEY:VALUE 格式）

Last updated: ${lastUpdated}
`;

  // Astro static builds drop Response headers (CDN serves bare text/plain).
  // UTF-8 BOM lets browsers detect encoding when charset is missing;
  // public/_headers sets Content-Type charset on Cloudflare/EdgeOne Pages.
  return new Response("\uFEFF" + content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Language": "zh-CN",
    },
  });
}
