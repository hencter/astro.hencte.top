# UI 主题视觉刷新 — 2026-09-02

## 执行摘要

针对用户反馈「UI 视觉化，还有主题不是很好」，对全站设计系统进行了**墨纸·青瓷 (Ink & Celadon)** 主题重构。核心改动：统一暖色纸感配色、消除 GitHub 蓝暗色模式割裂感、减少过度动画、强化中文文学气质排版、新增移动端导航与 skip-link。

## 质量评分

| 维度 | 改前 | 改后 | 说明 |
|------|------|------|------|
| 主题一致性 | 5/10 | 8/10 | 亮/暗模式统一暖墨+青瓷，告别 Ocean/GitHub 混搭 |
| 视觉层次 | 6/10 | 8/10 | 竖线 section 标题、display 字体、卡片左缘 accent |
| 文学气质 | 6/10 | 8/10 | ZCOOL XiaoWei + Noto Serif SC，暖纸阅读区 |
| 导航体验 | 5/10 | 7/10 | 移动端折叠菜单、active 态、skip-link |
| 动效克制 | 5/10 | 8/10 | 移除 float-badge、hero 渐变动画、blur 入场 |
| **综合** | **5.5/10** | **7.8/10** | 可见提升，仍有组件提取空间 |

---

## 设计决策

### 配色 — 墨纸·青瓷

| Token | Light | Dark | 语义 |
|-------|-------|------|------|
| `--bg` | `#f5f1e8` | `#121110` | 暖米纸 / 暖墨黑 |
| `--brand` | `#3d6b5e` | `#6db8a4` | 青瓷绿 |
| `--accent` | `#b85c42` | `#d4846a` | 朱砂点缀 |
| `--ink-900` | `#1a1814` | `#ebe6dc` | 墨黑 / 暖白 |

**放弃**：Ocean Depths 青蓝 + GitHub `#58a6ff` 暗色；紫色渐变按钮；hero 文字渐变动画。

### 字体

| 角色 | 字体 | 用途 |
|------|------|------|
| Display | ZCOOL XiaoWei | 品牌名、hero、section 标题 |
| Body | Noto Sans SC (+ Manrope en) | UI、导航、卡片 |
| Prose | Noto Serif SC | 博客正文、长文阅读 |
| Mono | Cascadia Mono | 代码块 |

### 签名元素

Section 标题左侧 **3px 青瓷竖线** (`.section-heading { border-left: 3px solid var(--brand) }`) — 呼应中文排版竖排意象，区别于通用 numbered markers。

### 组件变更

| 组件 | 变更 |
|------|------|
| `site-header` | 圆角 pill → 圆角矩形；desktop grid 三列布局 |
| `brand-mark` | 渐变 → 纯色青瓷；display 字体 |
| `btn-primary` | 渐变 → 纯色 brand，hover 加深 |
| `nav-list a` | 新增 `.is-active` 当前页高亮 |
| `.novel-card` | 首页小说卡片左缘朱砂 accent + display 标题 |
| `BaseLayout` | skip-link、mobile nav toggle、Noto Serif SC 加载 |

### 小说子系统对齐

- `NovelLayout.astro` — `--nv-*` token 与 global 同步
- `NovelIndexPage.astro` — 书架墙背景与 `--bg` 统一
- 章节标题使用 ZCOOL XiaoWei

---

## 页面效果描述

### `/` 首页
- 暖米纸背景，hero 标题为 solid ink 色 + 小魏体，不再闪烁渐变
- Section 标题带左竖线，视觉分区更清晰
- 小说卡片有朱砂左缘 + 小魏体书名

### `/blog/` 博客
- 子导航 active 态为青瓷实心 pill
- 正文区 Noto Serif SC，70ch 阅读宽度
- 面包屑 + compact hero 层次清晰

### `/projects/` 项目
- 与首页共享 card-featured / project-card 样式
- 悬停改为轻微上浮，无 scale 模糊

### `/novel/` 书架
- 墙背景与全站 `--bg` 一致
- 木质书架保留，书脊色板不变

### `/novel/*/chapter` 阅读
- 暖纸背景 + -serif 正文
- 顶栏/底栏 control 背景与 surface-glass 协调

---

## 文件变更

| 文件 | 变更类型 |
|------|----------|
| `src/styles/global.css` | 主题 token、导航、hero、section、卡片、skip-link、mobile nav |
| `src/layouts/BaseLayout.astro` | skip-link、mobile nav、active nav、字体 |
| `src/layouts/NovelLayout.astro` | `--nv-*` 对齐、章节标题字体 |
| `src/layouts/NovelIndexPage.astro` | 书架墙配色对齐 |
| `src/components/connect/HomeSections.astro` | novel-card class、i18n kicker |

---

## 验证

- [x] `pnpm build` — 203 pages, exit 0
- [x] 路由未破坏
- [x] i18n / TW / HK / novel 功能保留
- [x] reduced-motion 兼容

## 后续建议 (P2)

1. 提取 `<SiteHeader />` 组件（audit 已建议）
2. Callout 暗色对比度 token 化
3. 统一 4 套孤立 token 系统注释映射
4. 项目页 featured visual emoji → SVG icon

---

*代理: ui-refactorer | 收敛: swarm-convergence*
