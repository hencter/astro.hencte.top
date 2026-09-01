// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import { remarkObsidian } from "./src/lib/remark-obsidian";

// https://astro.build/config
export default defineConfig({
  site: "https://hencte.top",
  build: {
    concurrency: 4,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    markdoc(),
    sitemap({
      i18n: {
        defaultLocale: "zh-CN",
        locales: {
          "zh-CN": "zh-CN",
          "en-US": "en",
        },
      },
      // Keep /novel/ out of the sitemap: robots.txt disallows it (DRM fiction),
      // so listing it here would contradict the crawl directives.
      serialize(item) {
        if (item.url.includes("/novel")) return undefined;
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
      }
    ],
    defaultLocale: "zh-CN",
  }
});
