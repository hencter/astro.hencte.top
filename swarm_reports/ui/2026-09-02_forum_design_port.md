# Forum Design Port — 2026-09-02

> Port DoggyArium forum design tokens to astro.hencte.top, replacing celadon/green brand with warm ink + gold palette.

## Reference Source

- **Project:** `D:\DoggyArium\forum`
- **Primary tokens:** `static/headless/headless.css` (TongTop / Headless UI theme)
- **Aesthetic:** Warm paper background, deep ink text, **brand gold** primary accent, rust secondary, slate-blue highlight

## Pages Verified (localhost:4321)

| Route | Status | Green hex | Gold hex |
|-------|--------|-----------|----------|
| `/` | 200 | 0 | 7 |
| `/novel/` | 200 | 0 | 1 |
| `/blog/` | 200 | 0 | 7 |
| `/novel/sky-tax-ch01/` | 200 | 0 | 5 |

## Before → After Color Mapping

### Light mode

| Token | Old (Celadon) | New (Forum) | Forum source |
|-------|---------------|-------------|--------------|
| `--bg` | `#f5f1e8` | `#f5f0e6` | `--background` |
| `--surface` | `#fcfaf5` | `#fffcf5` | `--card` |
| `--line` | `#ddd5c8` | `#d8cdba` | `--border` |
| `--ink-900` | `#1a1814` | `#19150f` | `--foreground` |
| `--ink-700` | `#3d3830` | `#3b3124` | `--secondary-foreground` |
| `--ink-500` | `#6b6358` | `#5f5548` | `--muted-foreground` |
| `--brand` | `#3d6b5e` | `#b8792c` | `--brand-gold` |
| `--brand-deep` | `#2a5248` | `#845414` | `--brand-gold-strong` |
| `--accent` | `#b85c42` | `#a14932` | `--brand-rust` |
| `--highlight` | `#4a8b7a` | `#3c5b73` | `--brand-blue` |
| `--read-accent` | `#2a5248` | `#845414` | `--brand-gold-strong` |
| `--blockquote-border` | `#8fb5a8` | `#b8792c` | `--brand-gold` |
| `--nav-hover-bg` | `rgba(61,107,94,0.08)` | `rgba(184,121,44,0.08)` | gold tint |
| `--grad-hero-a` | green rgba | `rgba(184,121,44,0.1)` | gold ambient |

### Dark mode

| Token | Old (Celadon) | New (Forum) | Forum source |
|-------|---------------|-------------|--------------|
| `--bg` | `#121110` | `#0b0907` | `--background` |
| `--surface` | `#1a1917` | `#15110d` | `--card` |
| `--line` | `#2e2b27` | `#3b3021` | `--border` |
| `--ink-900` | `#ebe6dc` | `#f2e8d9` | `--foreground` |
| `--brand` | `#6db8a4` | `#d9aa4e` | `--brand-gold` |
| `--brand-deep` | `#8fd4bc` | `#e8bd68` | `--accent-foreground` |
| `--accent` | `#d4846a` | `#c46a52` | `--destructive` |
| `--highlight` | `#5a9e8c` | `#5a8aad` | lighter `--brand-blue` |
| `--read-accent` | `#6db3a0` | `#d9aa4e` | `--brand-gold` |
| `--blockquote-border` | `#3d6b5e` | `#d9aa4e` | `--ring` |

### Novel layout (`--nv-*`)

Synced to same forum palette in `NovelLayout.astro`, `NovelLandingPage.astro`, `NovelLocaleSwitcher.astro`.

### Ancient fullscreen (`--fs-accent`)

| Mode | Old | New |
|------|-----|-----|
| Light | `#2a5248` | `#845414` |
| Dark | `#6db3a0` | `#d9aa4e` |

## Files Changed

- `src/styles/global.css` — core design tokens (light + dark)
- `src/layouts/NovelLayout.astro` — `--nv-*` variables
- `src/layouts/NovelLandingPage.astro` — inline fallback tokens
- `src/layouts/FullscreenAncientLayout.astro` — `--fs-accent`
- `src/components/novel/NovelLocaleSwitcher.astro` — fallback brand color

## Preserved

- Reading measure tokens: `--read-max-width: 70ch`, `--read-max-width-novel: 42em` (from e97057a)
- Site structure, class names, component architecture unchanged
- Dark mode toggle behavior unchanged

## Build

`pnpm build` — **pass** (203 pages)

## Aesthetic Summary

The site shifts from **墨纸·青瓷** (ink + celadon green) to **墨纸·鎏金** (ink + warm gold), matching the DoggyArium forum's TongTop theme. Navigation active states, buttons, links, blockquote borders, and ambient gradients now use gold/rust/blue instead of green. Backgrounds are slightly warmer paper tones; dark mode uses deeper night ink with luminous gold accents.
