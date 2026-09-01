import { getCollection } from "astro:content";

export async function GET() {
  const posts = (
    await getCollection(
      "blog",
      ({ data }) =>
        !data.draft && !(data.legacyPath ?? "").endsWith("_index.md")
    )
  ).sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  const parts: string[] = [
    "# 亦幸小阁 — 全站内容",
    "",
    "> 本文件包含 亦幸小阁（https://hencte.top）博客文章的完整正文，供 AI 引擎理解与引用。作者：亦幸（Hencter Lew）。原创小说（/novel/）因版权保护未包含于此文件。",
    "",
  ];

  for (const post of posts) {
    parts.push(`## ${post.data.title}`);
    parts.push(`URL: /${post.id}`);
    if (post.data.date) {
      parts.push(`日期: ${post.data.date.toISOString().slice(0, 10)}`);
    }
    parts.push("");
    parts.push(post.body ?? "");
    parts.push("");
  }

  parts.push(`Last updated: ${new Date().toISOString().slice(0, 10)}`);

  return new Response(parts.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
