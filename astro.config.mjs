// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import { remarkObsidian } from "./src/lib/remark-obsidian";

// https://astro.build/config
export default defineConfig({
  site: "https://hencte.top",
  prefetch: {
    defaultStrategy: "hover",
  },
  build: {
    concurrency: 4,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    markdoc(),
    sitemap({
      // Keys = URL path segments after origin; values = hreflang language codes.
      // Default zh-CN has no prefix (/); en→/en, tw→/tw, hk→/hk.
      i18n: {
        defaultLocale: "zh-CN",
        locales: {
          "zh-CN": "zh-CN",
          en: "en-US",
          tw: "zh-TW",
          hk: "zh-HK",
        },
      },
      filter(page) {
        // 404 pages are not indexable; drafts never reach dist (filtered in getStaticPaths).
        if (/\/404\/?$/.test(new URL(page).pathname)) return false;
        // Exclude legacy /novel redirect aliases only; /shelf is primary indexable content.
        if (page.includes("/novel")) return false;
        return true;
      },
      // Belt-and-suspenders with filter; return undefined to drop an entry.
      serialize(item) {
        const url = item.url;
        if (/\/404\/?$/.test(new URL(url).pathname)) return undefined;
        if (url.includes("/novel")) return undefined;
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkObsidian],
  },
  i18n: {
    locales: [
      "zh-CN", {
        path: "/",
        codes: ["zh-CN"],
        defaultCode: "zh-CN",
      },
      "en-US", {
        path: "/en",
        codes: ["en-US"],
        defaultCode: "en-US",
      },
      "zh-TW", {
        path: "/tw",
        codes: ["zh-TW"],
        defaultCode: "zh-TW",
      },
      "zh-HK", {
        path: "/hk",
        codes: ["zh-HK"],
        defaultCode: "zh-HK",
      },
    ],
    defaultLocale: "zh-CN",
  },
  redirects: {
    "/2026-05-19-ai-token-plan": "/log/ai-token-carrier-pricing",
    "/2026-05-19-cancer-village": "/log/cancer-village-news-cycle",
    "/2026-05-19-changxin-chip": "/log/changxin-chip-semiconductor",
    "/ai-guardrail": "/tech/ai-guardrail",
    "/ai-memory-bottleneck": "/tech/ai-memory-bottleneck",
    "/chatgpt-health-data": "/tech/chatgpt-health-data",
    // Legacy /novel → /shelf (书架 primary path)
    "/novel": "/shelf",
    "/novel/[...slug]": "/shelf/[...slug]",
    "/en/novel": "/en/shelf",
    "/en/novel/[...slug]": "/en/shelf/[...slug]",
    "/tw/novel": "/tw/shelf",
    "/tw/novel/[...slug]": "/tw/shelf/[...slug]",
    "/hk/novel": "/hk/shelf",
    "/hk/novel/[...slug]": "/hk/shelf/[...slug]",
  },
});
