// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import markdoc from "@astrojs/markdoc";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [markdoc()],

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
  },

  adapter: cloudflare()
});