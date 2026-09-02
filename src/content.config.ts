import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
      publishDate: z.string().optional(),
      lastmod: z.string().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      aliases: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      toc: z.boolean().optional(),
      math: z.boolean().optional(),
      section: z.string().optional(),
      legacyPath: z.string().optional(),
    })
    .passthrough(),
});

const connect = defineCollection({
  // "connect" collection lives directly under src/content/{zh,en}/...
  loader: glob({
    pattern: ["zh/**/*.md", "en/**/*.md"],
    base: "./src/content",
  }),
  schema: z
    .object({
      page: z.string().optional(),
      locale: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      hero: z
        .object({
          badge: z.string().optional(),
          headline: z.string().optional(),
          subtitle: z.string().optional(),
          actions: z
            .object({
              primary: z
                .object({
                  label: z.string(),
                  href: z.string(),
                })
                .optional(),
              secondary: z
                .object({
                  label: z.string(),
                  href: z.string(),
                })
                .optional(),
            })
            .optional(),
        })
        .optional(),
      focusSection: z
        .object({
          title: z.string(),
          subtitle: z.string().optional(),
        })
        .optional(),
      projectsSection: z
        .object({
          title: z.string(),
          subtitle: z.string().optional(),
        })
        .optional(),
      buildSection: z
        .object({
          title: z.string(),
          subtitle: z.string().optional(),
        })
        .optional(),
      latestSection: z
        .object({
          title: z.string(),
          subtitle: z.string().optional(),
        })
        .optional(),
      focusAreas: z
        .array(
          z.object({
            tag: z.string().optional(),
            title: z.string(),
            text: z.string(),
          })
        )
        .optional(),
      featuredProjects: z
        .array(
          z.object({
            stage: z.string().optional(),
            title: z.string(),
            description: z.string().optional(),
            outcome: z.string().optional(),
            result: z.string().optional(),
            tags: z.array(z.string()).default([]),
            url: z.string().optional(),
          })
        )
        .optional(),
      buildSteps: z
        .array(
          z.object({
            phase: z.string(),
            detail: z.string(),
          })
        )
        .optional(),
      sections: z
        .array(
          z.object({
            key: z.string(),
            label: z.string(),
            description: z.string().optional(),
            href: z.string(),
          })
        )
        .optional(),
      latestTitle: z.string().optional(),
      timeline: z
        .array(
          z.object({
            phase: z.string(),
            detail: z.string(),
          })
        )
        .optional(),
      panels: z
        .object({
          left: z
            .object({
              title: z.string(),
              body: z.string().optional(),
              bullets: z.array(z.string()).default([]),
            })
            .optional(),
          right: z
            .object({
              title: z.string(),
              body: z.string().optional(),
              bullets: z.array(z.string()).default([]),
            })
            .optional(),
        })
        .optional(),
      principles: z
        .array(
          z.object({
            title: z.string(),
            text: z.string(),
          })
        )
        .optional(),
      milestones: z
        .array(
          z.object({
            year: z.string(),
            title: z.string(),
            detail: z.string(),
          })
        )
        .optional(),
      cta: z
        .object({
          title: z.string().optional(),
          text: z.string().optional(),
          actions: z
            .object({
              primary: z
                .object({
                  label: z.string(),
                  href: z.string(),
                })
                .optional(),
              secondary: z
                .object({
                  label: z.string(),
                  href: z.string(),
                })
                .optional(),
            })
            .optional(),
        })
        .optional(),
      linksSection: z
        .object({
          title: z.string().optional(),
          subtitle: z.string().optional(),
          note: z.string().optional(),
        })
        .optional(),
      friendLinks: z
        .array(
          z.object({
            name: z.string(),
            url: z.string(),
            avatar: z.string().optional(),
            description: z.string().optional(),
            tags: z.array(z.string()).default([]),
          })
        )
        .optional(),
      ownSite: z
        .object({
          name: z.string(),
          url: z.string(),
          avatar: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
      applyRules: z
        .object({
          title: z.string().optional(),
          subtitle: z.string().optional(),
          rules: z.array(z.string()).default([]),
        })
        .optional(),
    })
    .passthrough(),
});

const novel = defineCollection({
  // Per-series layout: src/content/novel/{zh-CN,en}/{series}/index.md + ch{nn}.md
  // Public slugs unchanged: /novel/{series}, /novel/{series}-ch{nn}
  loader: glob({
    pattern: ["zh-CN/**/*.md", "en/**/*.md"],
    base: "./src/content/novel",
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
      publishDate: z.string().optional(),
      draft: z.boolean().default(false),
      locale: z.enum(["zh-CN", "en-US"]).optional(),
      novel: z.string().optional(),
      chapter: z.number().optional(),
      order: z.number().optional(),
      comingSoon: z.boolean().optional(),
      tags: z.array(z.string()).default([]),
      cover: z.string().optional(),
      chapterImage: z.string().optional(),
      imageAlt: z.string().optional(),
    })
    .passthrough(),
});

export const collections = {
  blog,
  connect,
  novel,
};
