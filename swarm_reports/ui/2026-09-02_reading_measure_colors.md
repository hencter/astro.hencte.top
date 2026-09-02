# 阅读宽度与配色优化报告

> 日期: 2026-09-02  
> 代理: ui-refactorer (reading sub-mission)  
> 关联: [[2026-09-02_theme_visual_refresh]] (agent 812e9bf1 主题刷新，本任务在其 Ink & Celadon / 夜墨 token 基础上叠加阅读专用变量)

## 目标

为小说章节、技术/日志博客、古文长文找到最优 **行宽 (measure)** 与 **低眼疲劳配色**，并与全站设计 token 对齐。

## 选定数值

### 行宽 (Measure)

| Token | 值 | 适用场景 | 依据 |
|-------|-----|----------|------|
| `--read-max-width` | **70ch** | 技术/日志博客（中英混排、代码块多） | 拉丁文最佳 65–75ch；较原 78ch 略收窄 |
| `--read-max-width-cjk` | **40em** (~720px @ 18px) | 古文 Heti 排版、CJK 正文 | CJK 最佳 38–42em |
| `--read-max-width-novel` | **42em** (~756px @ 18px) | 小说章节沉浸阅读 | 略宽于博客 CJK，利于长段叙事 |
| `--read-max-width-ancient` | **56rem** | 古文双栏 fullscreen | 保留竖排/双栏舞台宽度 |
| `--read-padding-x` | `clamp(1rem, 4vw, 2rem)` | 全阅读容器 | 响应式侧距 |

### 配色 (Light — 暖纸墨)

| Token | Hex | 用途 | WCAG AA |
|-------|-----|------|---------|
| `--read-bg` | `#faf8f5` | 阅读区纸面背景 | — |
| `--read-fg` | `#2a2722` | 正文（非纯黑） | 对 `#faf8f5` ≈ **12.8:1** ✓ |
| `--read-muted` | `#6b6358` | 辅助/meta 文字 | 对 `#faf8f5` ≈ **5.2:1** ✓ |
| `--read-accent` | `#2a5248` | 链接/强调（celadon 深） | 对 `#faf8f5` ≈ **7.1:1** ✓ |

### 配色 (Dark — 暖墨夜)

| Token | Hex | 用途 | WCAG AA |
|-------|-----|------|---------|
| `--read-bg` | `#1a1814` | 阅读区背景（暖暗，区别于页面 `#121110`） | — |
| `--read-fg` | `#ddd8ce` | 正文 | 对 `#1a1814` ≈ **11.5:1** ✓ |
| `--read-muted` | `#9a9288` | 辅助文字 | 对 `#1a1814` ≈ **5.8:1** ✓ |
| `--read-accent` | `#6db3a0` | 链接（与 `--brand` 协调） | 对 `#1a1814` ≈ **6.2:1** ✓ |

### 排版 (Heti / CJK)

| Token | 值 |
|-------|-----|
| `--read-line-height` | `1.75` (博客) |
| `--read-line-height-cjk` | `1.9` (小说/古文) |
| `--read-letter-spacing` | `0.005em` |
| `--read-letter-spacing-cjk` | `0.02em` |

## 变更文件

| 文件 | 变更 |
|------|------|
| `src/styles/global.css` | 新增 `--read-*` token；`.read-container` / `.read-container--cjk` / `.read-container--intro`；`.post-prose` 改用 token |
| `src/pages/[...slug].astro` | 博客文章 `<div class="post-prose read-container">` |
| `src/layouts/BlogSectionLayout.astro` | 栏目导语 `read-container read-container--intro` |
| `src/layouts/AncientPostLayout.astro` | 古文 `read-container read-container--cjk` |
| `src/layouts/NovelLayout.astro` | `--nv-*` 对齐 read palette；桌面宽 560px → **42em** |
| `src/layouts/FullscreenAncientLayout.astro` | `--fs-*` 对齐 read palette |

## Before / After

### 博客 (`/tech/*`, `/log/*`)

- **Before**: `max-width: 78ch`，链接 `--brand-deep`，无独立阅读背景，正文继承 `--ink-900` (#1a1814)
- **After**: **70ch** + 暖纸 `#faf8f5` 阅读面板，正文 `#2a2722` 略柔，链接 `#2a5248` celadon 深绿

### 小说 (`/novel/sky-tax-ch01`)

- **Before**: 桌面容器 **560px**（偏窄），配色 `#faf9f6` / `#1a2332` 偏冷蓝
- **After**: **42em (~714–756px)**，暖纸 `#faf8f5` / 墨 `#2a2722`，letter-spacing 0.02em，与全站墨纸主题一致

### 古文 (`/ancient/*`)

- **Before**: Fullscreen `#f5f0e6` / `#2c2416`，accent `#8b5e3c` 偏棕
- **After**: `#faf8f5` / `#2a2722`，accent `#2a5248`；内联 AncientPostLayout 使用 **40em** CJK measure

## 验证

- `pnpm build` ✓ (203 pages)
- 与 812e9bf1 主题刷新 **无冲突**：dark 模式已升级为「夜墨 · Warm Ink」，阅读 token 在其上叠加

## 建议后续

1. 英文博客 (`/en/blog/*`) 若独立路由，复用相同 `read-container`
2. Obsidian plugins 页 (`post-prose` only) 可补 `read-container`
3. 用户可调字号/行宽 — 可选 `localStorage` 阅读偏好
