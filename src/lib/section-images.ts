import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Optional atmosphere images for section / partition Banners.
 * Files live under public/img/sections/ (owned by section-imagery work).
 * Returns undefined when missing so Banner stays typography-first.
 */
const EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"] as const;

export type SectionImageKey =
  | "home"
  | "blog"
  | "log"
  | "tech"
  | "ancient"
  | "about"
  | "projects"
  | "links"
  | "shelf"
  | "obsidian";

export function sectionImage(key: SectionImageKey | string): string | undefined {
  const base = join(process.cwd(), "public", "img", "sections");
  for (const ext of EXTENSIONS) {
    const abs = join(base, `${key}${ext}`);
    if (existsSync(abs)) {
      // Cache-bust when atmosphere assets are regenerated in place (e.g. home seal).
      const bust = key === "home" ? "?v=20260903yi" : "";
      return `/img/sections/${key}${ext}${bust}`;
    }
  }
  return undefined;
}
