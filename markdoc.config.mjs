// @ts-check
import { defineMarkdocConfig, component } from "@astrojs/markdoc/config"

export default defineMarkdocConfig({
  allowHTML: true,

  tags: {
    callout: {
      render: component("./src/markdoc/components/Callout.astro"),
      attributes: {
        type: { type: String, default: "note" },
        title: { type: String, default: "Note" },
      },
      selfClose: false,
    },
  },
})
