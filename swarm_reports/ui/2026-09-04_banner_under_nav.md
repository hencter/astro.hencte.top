# Banner 气氛延伸至 sticky nav 背后 — 2026-09-04

> 北极星：配图 page Banner（尤其首页）的气氛背景必须连续延伸到 sticky `.site-header` 背后，导航与英雄区读作同一构图；nav 文字保持锐利可读。  
> 关联：[[2026-09-03_banner_redefinition]]。

## 问题

截图显示：实心 cream nav 条 + 底部分隔线 + banner 从下方软淡入开始，形成「纸缝」切断构图。根因是 `.page-shell` 顶 padding + `.site-main` `margin-top` 造成的间隙，而非 banner 顶 mask 透明（顶缘本已不透明）。

## 方案（CSS-first）

### 1. 重叠量 `--banner-under-nav`

```css
--banner-under-nav: calc(1.25rem + 3.2rem + 2rem);
/* page-shell pad-top + header(0.6+2+0.6) + site-main margin */
```

`≤640px` 改为 `calc(0.7rem + 3.5rem + 2rem)`（更紧的 shell pad + 更大的 header pad）。

### 2. 选择器范围

仅：

```css
.site-main > .site-banner--page.site-banner--imaged:first-child
```

- `margin-top: calc(-1 * var(--banner-under-nav))` — 媒体层拉入 nav 背后
- `padding-top: calc(var(--banner-under-nav) + clamp(...))` — 标题/CTA 仍避开 chrome
- `absolute; inset: 0` 的 media 自然绘入重叠带；header `z-index: 30` 压在上方

section / cta / 非首屏 / 无图 banner 不受影响。

### 3. Mask / Veil

- 垂直 mask：**顶部保持全不透明**；底部/侧向溶解略下移比例，避免把淡化带推到 nav 文字带。
- Veil：对首屏配图 page banner 增加垂直 mask，在 `--banner-under-nav` 带内全透明，可读性洗只从 nav 下方淡入——不雾化 chrome。

### 4. Nav 可读性

- 静止态 header 仍 `background: transparent`（不恢复实心 cream 条）。
- `.is-scrolled` 玻璃 + hairline 保留（离开英雄区后）。
- 未加实心底；cream/照片底本身足够衬托 `--ink`。

## 文件清单

| 文件 | 变更 |
|------|------|
| `src/styles/global.css` | `--banner-under-nav`；首屏重叠 + padding 补偿；mask/veil 调整；≤640 覆盖 |
| `swarm_reports/ui/2026-09-04_banner_under_nav.md` | 本报告 |
| `swarm_reports/index.md` | 索引一行 |

未改：`Banner.astro`、布局组件、git commit。

## 调参

微调重叠只改 `--banner-under-nav` 一处即可。

## 注意

- 若某页首子元素不是 imaged page Banner，不会触发（符合预期）。
- 移动端展开 nav 面板时 header 变高；重叠按折叠高度估算。
- 照片资产若自带顶缘羽化，CSS 无法完全消除；本轮只去掉 CSS 层对 nav 带的雾化。
- 滚动 `y > 24` 仍会进入 `.is-scrolled` 玻璃态。
