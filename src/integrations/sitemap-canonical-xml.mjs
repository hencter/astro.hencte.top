import {
  access,
  readFile,
  readdir,
  rename,
  unlink,
} from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { constants as fsConstants } from "node:fs";

/**
 * @astrojs/sitemap always emits sitemap-index.xml + sitemap-N.xml.
 * For sites under the chunk limit, promote the sole chunk to /sitemap.xml
 * (and drop the index). If multiple chunks exist, promote the index to
 * /sitemap.xml so crawlers still have a stable canonical URL.
 *
 * Also serves /sitemap.xml during `astro dev` (the sitemap integration
 * only writes files on `astro build`). Prefer the last build's
 * dist/sitemap.xml; otherwise emit a minimal valid urlset.
 *
 * Register this integration *after* `sitemap()` so it runs on the
 * same `astro:build:done` phase after files are written.
 *
 * Output is raw sitemaps.org XML only (no browser XSL presentation).
 */

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "no-store",
  // Prevent browsers/CDNs from sniffing this as text/html (which hides tags).
  "X-Content-Type-Options": "nosniff",
};

/** @param {string} site */
function minimalDevSitemap(site) {
  const origin = site.replace(/\/$/, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Dev fallback: run \`pnpm build\` for the full production sitemap (hreflang + all pages). -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
</urlset>
`;
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {() => void} next
 * @param {{ site: string; root: string; logger: { info: (m: string) => void; warn: (m: string) => void } }} ctx
 */
async function serveDevSitemap(req, res, next, ctx) {
  const pathname = (req.url ?? "").split("?")[0];
  if (pathname !== "/sitemap.xml" && pathname !== "/sitemap.xml/") {
    next();
    return;
  }

  const distPath = join(ctx.root, "dist", "sitemap.xml");
  try {
    await access(distPath, fsConstants.R_OK);
    const body = await readFile(distPath, "utf8");
    res.writeHead(200, {
      ...XML_HEADERS,
      "X-Sitemap-Source": "dist",
    });
    res.end(body);
    return;
  } catch {
    // no dist yet — fall through
  }

  ctx.logger.warn(
    "Serving minimal /sitemap.xml in dev (dist/sitemap.xml missing). Run `pnpm build` for the full sitemap.",
  );
  const body = minimalDevSitemap(ctx.site);
  res.writeHead(200, {
    ...XML_HEADERS,
    "X-Sitemap-Source": "dev-fallback",
  });
  res.end(body);
}

/**
 * Ensure /sitemap.xml is handled before Astro's HTML 404 / catch-all.
 * @param {import('vite').ViteDevServer} server
 * @param {(req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void} handle
 */
function prependMiddleware(server, handle) {
  server.middlewares.use(handle);
  const stack = server.middlewares.stack;
  stack.unshift(stack.pop());
}

export function sitemapCanonicalXml() {
  /** @type {string} */
  let site = "https://hencte.top";
  /** @type {string} */
  let root = process.cwd();

  return {
    name: "sitemap-canonical-xml",
    hooks: {
      "astro:config:done": ({ config }) => {
        site = config.site ? String(config.site) : site;
        root = fileURLToPath(config.root);
      },
      "astro:server:setup": ({ server, logger }) => {
        prependMiddleware(server, (req, res, next) => {
          serveDevSitemap(req, res, next, { site, root, logger }).catch(
            (err) => {
              logger.warn(`sitemap-canonical-xml dev serve failed: ${err}`);
              next();
            },
          );
        });
        logger.info(
          "Dev /sitemap.xml enabled (application/xml; serves dist when present)",
        );
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const files = await readdir(outDir);
        const chunks = files
          .filter((name) => /^sitemap-\d+\.xml$/.test(name))
          .sort((a, b) => {
            const ai = Number(a.match(/sitemap-(\d+)\.xml/)?.[1] ?? 0);
            const bi = Number(b.match(/sitemap-(\d+)\.xml/)?.[1] ?? 0);
            return ai - bi;
          });
        const indexName = "sitemap-index.xml";
        const hasIndex = files.includes(indexName);
        const target = join(outDir, "sitemap.xml");

        if (chunks.length === 1) {
          await rename(join(outDir, chunks[0]), target);
          if (hasIndex) await unlink(join(outDir, indexName));
          logger.info("Sitemap canonicalized → /sitemap.xml (single urlset)");
          return;
        }

        if (chunks.length > 1 && hasIndex) {
          await rename(join(outDir, indexName), target);
          logger.info(
            `Sitemap canonicalized → /sitemap.xml (index over ${chunks.length} chunks)`,
          );
          return;
        }

        logger.warn(
          "sitemap-canonical-xml: no sitemap-*.xml chunks found; skipped",
        );
      },
    },
  };
}
