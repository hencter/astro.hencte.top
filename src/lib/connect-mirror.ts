import { getEntry } from "astro:content";
import { convertDeep } from "./opencc";
import type { ConnectPage, TraditionalVariant } from "./i18n";

const LOCALE_PREFIX: Record<TraditionalVariant, string> = {
  tw: "/tw",
  hk: "/hk",
};

/** Connect pages whose root paths should be rewritten for TW/HK locales. */
const REWRITABLE_PATHS = new Set(["/", "/about", "/projects"]);

function rewriteHref(href: string, prefix: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href.startsWith("/en") || href.startsWith("/tw") || href.startsWith("/hk")) return href;
  if (href.startsWith("/novel") || href.startsWith("/blog") || href.startsWith("/log") || href.startsWith("/tech") || href.startsWith("/ancient") || href.startsWith("/obsidian")) {
    return href;
  }
  if (REWRITABLE_PATHS.has(href)) {
    return href === "/" ? prefix : `${prefix}${href}`;
  }
  return href;
}

function rewritePathsDeep<T>(value: T, prefix: string): T {
  if (typeof value === "string") {
    if (value.startsWith("/") && !value.startsWith("//")) {
      return rewriteHref(value, prefix) as T;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewritePathsDeep(item, prefix)) as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (key === "href" && typeof nested === "string") {
        result[key] = rewriteHref(nested, prefix);
      } else {
        result[key] = rewritePathsDeep(nested, prefix);
      }
    }
    return result as T;
  }
  return value;
}

export async function getMirroredConnect(page: ConnectPage, variant: TraditionalVariant) {
  const entry = await getEntry("connect", `zh/${page}`);
  if (!entry) {
    throw new Error(`Missing connect content: zh/${page}`);
  }
  const converted = convertDeep(entry.data, variant);
  return rewritePathsDeep(converted, LOCALE_PREFIX[variant]);
}
