// @ts-check
import { defineMarkdocConfig, component } from "@astrojs/markdoc/config"

// allowHTML lives on the integration options (astro.config.mjs), not in
// this file — the markdoc config type intentionally omits it.
export default defineMarkdocConfig({
  tags: {
    callout: {
      render: component("./src/markdoc/components/Callout.astro"),
      attributes: {
        type: { type: String, default: "note" },
        title: { type: String, default: "Note" },
      },
    },
  },
})
