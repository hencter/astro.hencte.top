# Smooth in-page anchor scrolling

**Date:** 2026-09-03  
**Agent:** smooth-scroll worker  
**Scope:** sitewide `#hash` jumps under sticky header + ClientRouter

## Approach

CSS-first:

1. `html { scroll-behavior: smooth }` for same-page `#anchor` clicks.
2. Token `--scroll-margin-chrome: 5.25rem` — matches sticky `.site-header` footprint (`top: 0.85rem` + pad `1.2rem` + brand-mark `2rem` ≈ `4.05rem`, plus air).
3. Sitewide `scroll-margin-top` on `:is(h1…h6, [id])` (replaces the previous post-prose-only rule).
4. Existing `@media (prefers-reduced-motion: reduce)` already forces `scroll-behavior: auto !important` → instant jumps.

Minimal JS in `BaseLayout.astro` (ClientRouter edge cases only):

- `astro:before-swap` + `navigationType === 'traverse'` → set `scrollBehavior: auto` on the incoming document (no smooth history restore).
- `astro:after-swap` + `location.hash` → `scrollIntoView({ behavior: 'auto' })` so fragment landings after a view transition don’t fight CSS smooth mid-flight. `scroll-margin` still applies.

## Files changed

| File | Change |
|------|--------|
| `src/styles/global.css` | `--scroll-margin-chrome`; `html` smooth scroll; global `[id]`/heading scroll-margin; drop prose-only rule |
| `src/layouts/BaseLayout.astro` | Hash re-land + traverse instant-scroll helpers |

## Header offset

`--scroll-margin-chrome: 5.25rem` — same value previously used for `.post-prose h2–h4[id]`, now sitewide via the token.

## Build

`pnpm build` — **passed** (209 pages).

## Non-goals / no commit

- No Card / section-page edits (concurrent agents).
- No git commit (per task).
