#!/usr/bin/env node
/**
 * Import novel manuscripts from Nutstore into per-novel directories:
 *   src/content/novel/{zh-CN,en}/{series}/index.md
 *   src/content/novel/{zh-CN,en}/{series}/ch{nn}.md
 *
 * Run: pnpm import:novels
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const NUTSTORE = "C:/Users/hencter/Nutstore/1/Note/20_Areas/创作与内容";
const NOVEL_ROOT = path.join(ROOT, "src/content/novel");
const OUT_ZH = path.join(NOVEL_ROOT, "zh-CN");
const OUT_EN = path.join(NOVEL_ROOT, "en");

function stripObsidianFrontmatter(raw) {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? raw.slice(match[0].length).trimStart() : raw.trimStart();
}

function extractH1(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function writeMd(filePath, frontmatter, body) {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.map((x) => `"${x}"`).join(", ")}]`;
      if (typeof v === "boolean") return `${k}: ${v}`;
      if (typeof v === "number") return `${k}: ${v}`;
      return `${k}: "${String(v).replace(/"/g, '\\"')}"`;
    })
    .join("\n");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `---\n${fm}\n---\n\n${body.trim()}\n`, "utf8");
}

function seriesLandingPath(localeDir, series) {
  return path.join(localeDir, series, "index.md");
}

function seriesChapterPath(localeDir, series, chapter) {
  return path.join(localeDir, series, `ch${String(chapter).padStart(2, "0")}.md`);
}

/** One-time: move flat `{series}.md` / `{series}-ch{nn}.md` into `{series}/` subdirs. */
function migrateFlatToNested(localeDir) {
  if (!fs.existsSync(localeDir)) return;
  for (const file of fs.readdirSync(localeDir)) {
    if (!file.endsWith(".md")) continue;
    if (file === "novel.md") continue;

    const src = path.join(localeDir, file);
    if (!fs.statSync(src).isFile()) continue;

    const chapterMatch = file.match(/^(.+)-ch(\d+)\.md$/);
    if (chapterMatch) {
      const [, series, num] = chapterMatch;
      const dest = seriesChapterPath(localeDir, series, Number(num));
      if (fs.existsSync(dest)) {
        fs.unlinkSync(src);
        console.log("Removed duplicate flat chapter:", file);
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
        console.log("Migrated chapter:", file, "→", path.relative(NOVEL_ROOT, dest));
      }
      continue;
    }

    const landingMatch = file.match(/^([a-z0-9-]+)\.md$/);
    if (landingMatch) {
      const [, series] = landingMatch;
      const dest = seriesLandingPath(localeDir, series);
      if (fs.existsSync(dest)) {
        fs.unlinkSync(src);
        console.log("Removed duplicate flat landing:", file);
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
        console.log("Migrated landing:", file, "→", path.relative(NOVEL_ROOT, dest));
      }
    }
  }
}

function importSkyTax() {
  const skyDir = path.join(NUTSTORE, "天空税");
  const chaptersDir = path.join(skyDir, "03-章节");
  const enChaptersDir = path.join(skyDir, "05-英文版/chapters");
  const series = "sky-tax";

  writeMd(seriesLandingPath(OUT_ZH, series), {
    title: "天空税",
    description:
      "2057年赛博朋克科幻：星链垄断近地轨道通信与AI算力，对数据和计算征收「Token税」。",
    draft: false,
    locale: "zh-CN",
  }, "《天空税》—— 星链垄断下的数据税、算力税，与鸽子网络的慢速自由。");

  writeMd(seriesLandingPath(OUT_EN, series), {
    title: "Sky Tax",
    description:
      "Near-future cyberpunk (2057): Starlink monopolizes orbit, data, and AI compute—taxing every token of thought.",
    draft: false,
    locale: "en-US",
  }, "*Sky Tax* — When the sky belongs to one company, freedom travels by pigeon.");

  const zhFiles = fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".md")).sort();
  for (let i = 0; i < zhFiles.length; i++) {
    const file = zhFiles[i];
    const raw = fs.readFileSync(path.join(chaptersDir, file), "utf8");
    const body = stripObsidianFrontmatter(raw);
    const title = extractH1(body) || file.replace(/\.md$/, "");
    const chapter = i + 1;
    writeMd(seriesChapterPath(OUT_ZH, series, chapter), {
      title,
      novel: series,
      chapter,
      draft: false,
      locale: "zh-CN",
    }, body);
  }

  const enFiles = fs.readdirSync(enChaptersDir).filter((f) => f.startsWith("ch") && f.endsWith(".md")).sort();
  for (const file of enFiles) {
    const num = parseInt(file.match(/ch(\d+)/)?.[1] ?? "0", 10);
    if (!num) continue;
    const raw = fs.readFileSync(path.join(enChaptersDir, file), "utf8");
    const body = stripObsidianFrontmatter(raw);
    const title = extractH1(body) || file.replace(/\.md$/, "");
    writeMd(seriesChapterPath(OUT_EN, series, num), {
      title,
      novel: series,
      chapter: num,
      draft: false,
      locale: "en-US",
    }, body);
  }

  console.log(`天空税: ${zhFiles.length} zh-CN chapters, ${enFiles.length} en-US chapters`);
}

function importAiCounterTaming() {
  const series = "ai-counter-taming";
  const nutDir = path.join(NUTSTORE, "我被AI反向驯化了");

  // Preserve existing zh chapters if Nutstore dir missing
  const zhSeriesDir = path.join(OUT_ZH, series);
  if (fs.existsSync(nutDir)) {
    const chaptersDir = path.join(nutDir, "章节");
    if (fs.existsSync(chaptersDir)) {
      const zhFiles = fs.readdirSync(chaptersDir).filter((f) => f.endsWith(".md")).sort();
      for (let i = 0; i < zhFiles.length; i++) {
        const file = zhFiles[i];
        const raw = fs.readFileSync(path.join(chaptersDir, file), "utf8");
        const body = stripObsidianFrontmatter(raw);
        const title = extractH1(body) || file.replace(/\.md$/, "");
        const chapter = i + 1;
        writeMd(seriesChapterPath(OUT_ZH, series, chapter), {
          title,
          novel: series,
          chapter,
          draft: false,
          locale: "zh-CN",
        }, body);
      }
      console.log(`ai-counter-taming: ${zhFiles.length} zh-CN chapters from Nutstore`);
    }
  } else if (fs.existsSync(zhSeriesDir)) {
    const count = fs.readdirSync(zhSeriesDir).filter((f) => /^ch\d+\.md$/.test(f)).length;
    console.log(`ai-counter-taming: kept ${count} existing zh-CN chapters`);
  }

  if (!fs.existsSync(seriesLandingPath(OUT_ZH, series))) {
    writeMd(seriesLandingPath(OUT_ZH, series), {
      title: "我被AI反向驯化了",
      description: "当工具开始反过来定义使用者，驯化究竟发生在谁身上？",
      draft: false,
      locale: "zh-CN",
    }, "原创科幻短篇系列。");
  }

  writeMd(seriesLandingPath(OUT_EN, series), {
    title: "Tamed by AI",
    description: "English edition coming soon. Read the Simplified Chinese version for now.",
    draft: false,
    locale: "en-US",
    comingSoon: true,
  }, "English translation is in progress. [Read in 简体中文](/shelf/ai-counter-taming).");
}

function writeLocaleIndexes() {
  writeMd(path.join(OUT_ZH, "novel.md"), {
    title: "小说",
    description: "原创小说 · 持续更新",
    draft: false,
    locale: "zh-CN",
  }, "原创小说 by Hencter Lew。");

  writeMd(path.join(OUT_EN, "novel.md"), {
    title: "Fiction",
    description: "Original fiction. Some works available in English.",
    draft: false,
    locale: "en-US",
  }, "Original fiction by Hencter Lew.");
}

function removeLegacyFlatFiles() {
  for (const localeDir of [OUT_ZH, OUT_EN]) {
    if (!fs.existsSync(localeDir)) continue;
    for (const name of fs.readdirSync(localeDir)) {
      const p = path.join(localeDir, name);
      if (!fs.statSync(p).isFile() || !name.endsWith(".md")) continue;
      if (name === "novel.md") continue;
      fs.unlinkSync(p);
      console.log("Removed legacy flat file:", path.relative(NOVEL_ROOT, p));
    }
  }
}

console.log("Migrating flat novel files to per-series directories…");
migrateFlatToNested(OUT_ZH);
migrateFlatToNested(OUT_EN);

importSkyTax();
importAiCounterTaming();
writeLocaleIndexes();
removeLegacyFlatFiles();
console.log("Import complete.");
