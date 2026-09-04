# Nav 对比度 + CTA 去卡片壳 — 2026-09-04

> 北极星：首页配图 banner 延伸至 sticky nav 背后时，导航文字仍锐利可读；页底 CTA 不作为卡片容器，内容直接落在纸面。  
> 关联：[[2026-09-04_banner_under_nav]] · [[2026-09-03_card_design_philosophy]]。

## Issue 1 — Nav 叠在 banner 照片上对比不足

### 问题

`--ink-500` 导航链坐在陶瓷开片等忙碌纹理上；上一轮 under-nav 刻意去掉 veil 雾化，导致右栏可读性崩。

### 方案（CSS-first，保持构图连续）

- **不**恢复实心 cream 条切断 banner。
- 仅当首屏为 imaged page banner 时（`:has(...)`），对未滚动的 `.site-header` 加轻纸霜：
  - `background: color-mix(surface 52%, transparent)` + 轻 `backdrop-filter`
- 同条件将 `.nav-list a` 提到 `--ink-700`（hover/focus → `--ink-900`）；品牌名 `--ink-900`。
- `.is-scrolled` 玻璃 + hairline 不变，滚动后仍走既有态。

## Issue 2 — CTA 去掉卡片壳

### 问题

`.site-banner--cta` 继承 `.site-banner` 的 border / radius，并自带 surface 混色底，暗色下呈明显面板。

### 方案

- `.site-banner--cta`：`background: transparent`；`border: 0`；`border-radius: 0`；无 shadow。
- 嵌套在 `.section` 内的 CTA 与其它 nested banner 一样 `padding-inline: 0`（去掉原「卡片内边距」特例）。
- 排版、文字链、QR（`cta-banner__qr`）与 split 布局保留。

## 文件清单

| 文件 | 变更 |
|------|------|
| `src/styles/global.css` | under-nav frost + ink 加强；CTA 去壳；nested padding 统一 |
| `swarm_reports/ui/2026-09-04_nav_contrast_cta_surface.md` | 本报告 |
| `swarm_reports/index.md` | 索引一行 |

未改：`Banner.astro` / `CtaBanner.astro` 结构、git commit。

## DoD

1. ✅ 右栏 nav 在陶瓷纹理上可读（霜 + 更深 ink）
2. ✅ CTA 无卡片底/边框壳；文+QR 落在 page bg
3. ✅ 报告归档
