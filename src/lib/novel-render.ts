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
