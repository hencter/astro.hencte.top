import { getCollection } from "astro:content";
import {
  formatNovelBibliographyMarkdown,
  getNovelBibliography,
} from "../lib/novel-bibliography";
import {
  AUTHOR,
  SITE_URL,
  formatFaqsMarkdown,
} from "../lib/geo-site";

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
    const url = `${SITE_URL}/${post.id}`;
    return description
      ? `- [${post.data.title}](${url}): ${description}`
      : `- [${post.data.title}](${url})`;
  });

  const novelEntries = await getNovelBibliography();
  const novelSection = formatNovelBibliographyMarkdown(novelEntries);
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const content = `# 亦幸小阁

> 个人品牌站点（Cite 轨开放索引与引用）：技术博客（AI 工程、GEO/SEO、论文解读、开发工具链、知识管理）、项目展示。作者：${AUTHOR.alternateName}（${AUTHOR.name}）。语言：zh-CN（默认）/ zh-TW（/tw）/ zh-HK（/hk）/ en-US（/en）。联系：${AUTHOR.email}。ORCID：${AUTHOR.orcid}

## 引用与爬取政策（Cite vs Protect）

- **Cite 轨（可索引 / 可引用）**：博客 \`/tech\` \`/log\` \`/ancient\`、品牌页（首页、关于、项目、友链、博客索引）、\`${SITE_URL}/llms.txt\`、\`${SITE_URL}/llms-full.txt\`、\`${SITE_URL}/llm.txt\`、\`${SITE_URL}/rss.xml\`、\`${SITE_URL}/sitemap.xml\`。
- **Protect 轨（禁止训练与抓取正文）**：\`/shelf/\` 及旧路径 \`/novel/\`（四语）。\`robots.txt\` Disallow；页面 \`noindex, noai, noimageai\`；**不进入 sitemap**。书目元数据仅见下文与 \`llm.txt\`，不含章节正文。
- **引用建议**：优先使用文章 canonical URL + 标题；站点级事实以本文件与 [llm.txt](${SITE_URL}/llm.txt) 为准。

## 关键实体

- [亦幸 / Hencter Lew](${SITE_URL}/about): 作者主页（TypeScript / Lua / Python；AI 工程、知识管理、公开构建）
- [GEO 两年深度复盘](${SITE_URL}/tech/geo-two-years): 16 个一手信源核查后的 GEO 事实与噪声经济
- [GEO Two Years (EN)](${SITE_URL}/tech/geo-two-years-en): English companion to the GEO investigation
- [SEO+GEO 三位一体架构](${SITE_URL}/tech/seo-geo-architecture): 结构化标记 + 双路径内容 + 统一观测
- [Nova](https://github.com/hencter/Nova): AI 自举知识库模板
- [通天路](https://tongtianlu.cn): 邀请制 AI 创作者社区
- [商业帝国 3D](https://github.com/hencter/monopoly-3d-ai): Three.js + DeepSeek 大富翁

## 核心页面

- [首页](${SITE_URL}/): 个人品牌主页与最新内容
- [项目](${SITE_URL}/projects): Nova、通天路、商业帝国 3D 等技术项目
- [友链](${SITE_URL}/links): 友情链接墙与交换规则
- [关于](${SITE_URL}/about): 作者背景与联系方式
- [博客](${SITE_URL}/blog): 技术文章索引
- [博客（台灣）](${SITE_URL}/tw/blog): 繁體中文（台灣）博客索引
- [博客（香港）](${SITE_URL}/hk/blog): 繁體中文（香港）博客索引
- [RSS](${SITE_URL}/rss.xml): 博客更新订阅

## 英文页面

- [Home (EN)](${SITE_URL}/en): English homepage
- [Projects (EN)](${SITE_URL}/en/projects): Project portfolio
- [About (EN)](${SITE_URL}/en/about): Author bio
- [Obsidian Plugins (EN)](${SITE_URL}/en/obsidian/plugins): Plugin documentation

## 繁体中文页面

- [首頁（台灣）](${SITE_URL}/tw): 繁體中文（台灣）首頁
- [項目（台灣）](${SITE_URL}/tw/projects): 繁體中文（台灣）項目展示
- [關於（台灣）](${SITE_URL}/tw/about): 繁體中文（台灣）作者介紹
- [首頁（香港）](${SITE_URL}/hk): 繁體中文（香港）首頁
- [項目（香港）](${SITE_URL}/hk/projects): 繁體中文（香港）項目展示
- [關於（香港）](${SITE_URL}/hk/about): 繁體中文（香港）作者介紹

${formatFaqsMarkdown()}## 博客文章

${blogLines.join("\n")}

${novelSection}## 作者资产

- [GitHub (@hencter)](https://github.com/hencter): 开源项目与代码
- [ORCID](${AUTHOR.orcid}): 作者持久标识
- [Nova](https://github.com/hencter/Nova): AI 自举知识库模板
- [通天路社区](https://tongtianlu.cn): AI 创作者互助社区

## Optional

- [llms-full.txt](${SITE_URL}/llms-full.txt): 博客文章全文索引（不含 /shelf/ 版权小说正文）
- [llm.txt](${SITE_URL}/llm.txt): 站点实体与 FAQ 摘要（KEY:VALUE 格式）
- [sitemap.xml](${SITE_URL}/sitemap.xml): Cite 轨 URL 清单（不含 /shelf/、/novel/）
- [robots.txt](${SITE_URL}/robots.txt): 爬虫策略（AI UA 与 Protect Disallow）

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
