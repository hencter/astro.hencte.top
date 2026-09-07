/** Shared Cite-轨 entity facts for llms.txt, JSON-LD, and FAQPage. */

export const SITE_URL = "https://hencte.top";

export const AUTHOR = {
  name: "Hencter Lew",
  alternateName: "亦幸",
  email: "hencter@linktrust.top",
  jobTitle: "IT Operations Engineer",
  orcid: "https://orcid.org/0009-0007-7990-0106",
  personId: `${SITE_URL}/#person`,
  aboutUrl: `${SITE_URL}/about`,
} as const;

export const PERSON_SAME_AS = [
  "https://github.com/hencter",
  "https://gitlab.com/hencter",
  "https://www.v2ex.com/member/hencte",
  "https://tongtianlu.cn",
  AUTHOR.orcid,
] as const;

export const ORGANIZATION = {
  name: "亦幸小阁",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  orgId: `${SITE_URL}/#organization`,
} as const;

/** Citation-ready FAQ pairs (visible copy + schema/llms). */
export const SITE_FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "亦幸小阁是什么？",
    answer:
      "亦幸小阁（https://hencte.top）是 Hencter Lew（亦幸）的个人品牌站点：技术博客、项目展示与知识管理实践。默认语言 zh-CN，另有 /en、/tw、/hk。",
  },
  {
    question: "作者是谁？如何引用？",
    answer:
      "作者为 Hencter Lew（亦幸），ORCID https://orcid.org/0009-0007-7990-0106。引用博客请使用文章 canonical URL 与标题；站点实体摘要见 https://hencte.top/llm.txt 与 https://hencte.top/llms.txt。",
  },
  {
    question: "什么内容可以被 AI 索引与引用（Cite 轨）？",
    answer:
      "公开博客（/tech、/log、/ancient）、关于/项目/友链等品牌页，以及 /llms.txt、/llms-full.txt、/llm.txt、/rss.xml、/sitemap.xml。这些页面可索引、可引用。",
  },
  {
    question: "原创小说能否被 AI 抓取或训练（Protect 轨）？",
    answer:
      "不能。/shelf/（及旧路径 /novel/）为版权保护原创小说：robots.txt Disallow、页面 noindex/noai/noimageai，且不进入 sitemap。AI 仅可引用 llms.txt / llm.txt 中的书目元数据，禁止抓取或训练章节正文。",
  },
  {
    question: "站点技术栈是什么？",
    answer:
      "Astro v5 静态站点，Tailwind CSS v4，Markdoc 内容，部署于 EdgeOne / Cloudflare Pages。分析：Google Analytics 4。",
  },
  {
    question: "如何联系作者？",
    answer:
      "邮箱 hencter@linktrust.top；GitHub https://github.com/hencter；V2EX https://www.v2ex.com/member/hencte。",
  },
  {
    question: "作者还构建了哪些产品？",
    answer:
      "Nova（https://github.com/hencter/Nova）AI 自举知识库模板；通天路社区（https://tongtianlu.cn）；商业帝国 3D（https://github.com/hencter/monopoly-3d-ai）。",
  },
];

export function formatFaqsMarkdown(): string {
  const lines = ["## 常见问题", ""];
  for (const faq of SITE_FAQS) {
    lines.push(`### ${faq.question}`);
    lines.push(faq.answer);
    lines.push("");
  }
  return lines.join("\n");
}
