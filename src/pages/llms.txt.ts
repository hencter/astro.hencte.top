import { getCollection } from "astro:content";

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
      ? `- [${post.data.title}](/${post.id})：${description}`
      : `- [${post.data.title}](/${post.id})`;
  });

  const lastUpdated = new Date().toISOString().slice(0, 10);

  const content = `# 亦幸小阁

> 个人品牌站点：技术博客（AI 工程实践、论文解读、开发工具链、知识管理）、项目展示、原创小说。作者：亦幸（Hencter Lew）。语言：zh-CN（默认）/ en-US。联系：hencter@linktrust.top。站点 URL：https://hencte.top

## 核心页面

- [首页](/)
- [项目](/projects)
- [关于](/about)
- [博客](/blog)
- [EN (English)](/en)

## 博客文章

${blogLines.join("\n")}

## 作者其他资产

- [GitHub（@hencter）](https://github.com/hencter)
- [Nova（新项目）](https://github.com/hencter/Nova)
- [通天路社区](https://tongtianlu.cn)

Last updated: ${lastUpdated}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
