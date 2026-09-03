---
name: ui-component-audit
description: UI component audit and replacement pipeline for astro.hencte.top. Covers design system audit, component extraction from Tailwind CSS v4 + custom CSS, reusable Astro component creation, accessibility (a11y) audit, dark mode consistency, and component library evaluation. Use when the user says "UI", "组件", "设计系统", "design system", "组件库", "refactor UI", "重构组件", "shadcn", "可访问性".
---

# ui-component-audit — UI 组件审计与重构管道

astro.hencte.top 站点的 UI 架构审计、设计系统规范化和组件库评估。

## 当前 UI 架构

| 维度 | 现状 |
|------|------|
| CSS 框架 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 自定义 CSS | `src/styles/global.css` (1118 行，含完整设计系统) |
| 设计令牌 | CSS 自定义属性（颜色、阴影、圆角、字体） |
| 组件 | 少量 Astro 组件（JsonLD, Meta, WechatWidget, Welcome） |
| 布局 | 8 个 Astro 布局文件 |
| 暗色模式 | `.dark` class 切换 |
| 动效 | CSS keyframes + IntersectionObserver + View Transitions |
| 可访问性 | `prefers-reduced-motion` 支持，其他未审计 |

## 工作流程

### Step 1: UI 审计
使用 `ui-refactorer` 代理完成全站 UI 审计：
- 扫描所有 `.astro` 文件，识别可提取为独立组件的重复模式
- 审计 `global.css` 中未使用的 CSS 变量和样式规则
- 检查暗色模式在各页面的覆盖完整性
- 审查可访问性 (a11y)：颜色对比度、键盘导航、ARIA 标签、语义 HTML
- 审计 `tailwind.config` 的定制化程度

### Step 2: 设计系统规范化

#### CSS 变量清单审计
审查 `global.css` 中的 CSS 自定义属性，确保完整覆盖：
- 颜色体系（主色、辅色、语义色、表面色、文本色）
- 间距体系
- 字体体系（sans、serif、mono）
- 阴影体系
- 圆角体系
- 动画过渡

#### 组件提取
从现有布局中识别并提取以下可复用组件：

| 候选组件 | 来源 | 优先级 |
|----------|------|--------|
| `<SiteHeader />` | BaseLayout 中的 header | 🔴 P0 |
| `<SiteFooter />` | BaseLayout 中的 footer | 🔴 P0 |
| `<ThemeToggle />` | BaseLayout 中的主题切换 | 🔴 P0 |
| `<LanguageSwitcher />` | BaseLayout 中的语言切换 | 🔴 P0 |
| `<NavLink />` | 导航链接 | 🟡 P1 |
| `<Card />` | 博客列表中的卡片 | 🟡 P1 |
| `<Tag />` / `<Badge />` | 标签和状态标记 | 🟡 P1 |
| `<Section />` | 带动画的通用区块 | 🟡 P1 |
| `<Prose />` | Markdoc 渲染的内容区域 | 🟢 P2 |
| `<Breadcrumb />` | 面包屑导航 | 🟢 P2 |
| `<LoadingSpinner />` | 加载状态 | 🟢 P2 |

### Step 3: 组件库评估

评估是否引入组件库（如 shadcn/ui、Radix、Headless UI）：
- **shadcn/ui**：React 组件库，在 Astro 中可通过 `@astrojs/react` 集成，但增加框架依赖
- **Headless UI**：无样式组件，与 Tailwind 配合好，同样需要 React
- **纯 Astro 组件**：无需额外框架，与现有架构最兼容，但缺少复杂交互组件
- **Web Components**：框架无关，但生态不如 React 成熟

**推荐策略**：优先提取纯 Astro 组件 + Tailwind 样式，保持零框架依赖。仅在需要复杂交互（如 Dialog、Dropdown）时考虑引入轻量 Web Components 或 Alpine.js。

### Step 4: 可访问性 (a11y) 增强
- 颜色对比度审计（WCAG AA 标准：4.5:1 正常文本，3:1 大文本）
- 键盘导航支持（Tab 顺序、Focus 可见性）
- 语义 HTML 结构审查
- ARIA 标签补充（role, aria-label, aria-describedby）
- 屏幕阅读器友好内容

## 输出规范
- 审计报告写入 `swarm_reports/ui/`
- 文件命名: `YYYY-MM-DD_ui_audit.md`
- 包含：发现的问题、组件提取建议、设计系统缺口、a11y 违规项
