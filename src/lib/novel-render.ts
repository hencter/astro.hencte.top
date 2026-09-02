import fs from "node:fs";
import path from "node:path";
import { createMarkdownProcessor, parseFrontmatter } from "@astrojs/markdown-remark";
import type { CollectionEntry } from "astro:content";
import type { SiteLocale } from "./i18n";
import { localeToVariant } from "./i18n";
import { convertDeep, convertText } from "./opencc";
import { render } from "astro:content";

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

async function getProcessor() {
  if (!processor) {
    processor = await createMarkdownProcessor({
      syntaxHighlight: false,
      gfm: true,
      smartypants: false,
    });
  }
  return processor;
}

function zhCnFilePath(entryId: string): string {
  const slug = entryId.replace(/^zh-cn\//i, "");
  return path.join(process.cwd(), "src/content/novel/zh-CN", `${slug}.md`);
}

export async function renderNovelContent(
  entry: CollectionEntry<"novel">,
  locale: SiteLocale
): Promise<{ Content: Awaited<ReturnType<typeof render>>["Content"] | null; html: string | null }> {
  const variant = localeToVariant(locale);
  if (!variant) {
    const { Content } = await render(entry);
    return { Content, html: null };
  }

  const filePath = zhCnFilePath(
    /^zh-cn\//i.test(entry.id) ? entry.id : `zh-CN/${entry.id.replace(/^en\//i, "")}`
  );
  if (!fs.existsSync(filePath)) {
    const { Content } = await render(entry);
    return { Content, html: null };
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, content } = parseFrontmatter(raw);
  void frontmatter;
  const converted = convertText(content, variant);
  const md = await getProcessor();
  const result = await md.render(converted);
  return { Content: null, html: result.code };
}

export function mirrorEntryData(
  entry: CollectionEntry<"novel">,
  locale: SiteLocale
): CollectionEntry<"novel">["data"] {
  const variant = localeToVariant(locale);
  if (!variant) return entry.data;
  return convertDeep(entry.data, variant);
}

/**
 * Detect whether a chapter body renders its own title heading, e.g.
 * "# 第1章 · 铜级人生" (sky-tax does; ai-counter-taming starts with an
 * italic hook instead). When it does, the layout should skip its own
 * <h1 class="nv-title"> to avoid showing the chapter title twice.
 * True when the first heading is an H1, or an early H2/H3 heading text
 * equals the frontmatter title.
 */
export function novelBodyOwnTitle(entryId: string): boolean {
  const prefix = /^en\//i.test(entryId) ? "en" : "zh-CN";
  const rest = entryId.replace(/^[a-z]{2}(?:-[a-z]{2})?\//i, "");
  const candidates =
    prefix === "en" ? ["en", "zh-CN"] : ["zh-CN", "en"];
  for (const dir of candidates) {
    const p = path.join(process.cwd(), "src/content/novel", dir, `${rest}.md`);
    if (!fs.existsSync(p)) continue;
    const { frontmatter, content } = parseFrontmatter(fs.readFileSync(p, "utf8"));
    const fmTitle = String(frontmatter.title ?? "").trim();
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const m = /^(#{1,3})\s+(.*)$/.exec(trimmed);
      if (m) {
        const level = m[1].length;
        return level === 1 || (level <= 3 && m[2].trim() === fmTitle);
      }
      return false; // body begins with prose -> no own title
    }
    return false;
  }
  return false;
}
