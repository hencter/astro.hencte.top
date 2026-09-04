# Sitemap: remove browser XSL presentation

**Date:** 2026-09-04  
**Agent:** seo-sitemap  
**Domain:** seo

## Intent

User:「不需要解析出来啊」— sitemap should stay raw XML for crawlers/tools, not a browser-pretty XSL view.

## Changes

- Removed `<?xml-stylesheet … href="/sitemap.xsl"?>` injection from `src/integrations/sitemap-canonical-xml.mjs` (`withStylesheetPi` / `injectStylesheetPi` deleted).
- Deleted `public/sitemap.xsl`.
- Kept: canonical `/sitemap.xml` rename, `Content-Type: application/xml`, `_headers`, `robots.txt` Sitemap line, valid urlset body, dev middleware serving dist/fallback without XSL.

## Result

`/sitemap.xml` is raw sitemaps.org XML only.
