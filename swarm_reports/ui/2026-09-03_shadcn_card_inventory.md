# shadcn/ui 与 Card 容器盘点 — 2026-09-03

> 范围：静态阅读 `package.json`、`src/components`、`src/layouts`、`src/pages`、`src/styles` 及 Markdoc 组件。仅诊断；未改站点源码、未更新 `swarm_reports/index.md`、未提交 Git。
>
> 相关记录：[[2026-09-02_theme_visual_refresh]]、[[2026-09-02_reading_measure_colors]]、[[ui-refactorer]]、[[CONTEXT]]。

## 结论摘要

这不是“shadcn Card 用错了”，而是设计语言与组合策略的问题。仓库当前没有真正接入 shadcn/ui：

| 项目 | 证据 | 结论 |
|---|---|---|
| `package.json` | 仅 Astro、Markdoc、Tailwind、RSS/Sitemap 等依赖（无 `react`、`react-dom`、`radix-ui`、`@radix-ui/*`、`class-variance-authority`、`tailwind-merge`） | 无 shadcn 运行时基础 |
| `components.json` | 文件不存在 | 未初始化 shadcn CLI |
| `src/components` | 仅 `.astro` 组件，无 `ui/`、`.tsx`/`.jsx` shadcn 源码 | 无 shadcn 组件实现 |
| imports / hydration | 未发现 React/Radix import 或 `client:*` 指令 | 当前页面为 Astro SSR/SSG + 原生脚本，不是 React 组件组合问题 |
| `pnpm-lock.yaml` | `react`、`@types/react`、`radix3` 只出现在依赖树/peer 解析上下文 | 不能据此认定站点使用了 React/Radix |

当前视觉问题来自 `global.css` 的自定义卡片系统：约 19 个卡片语义的 Astro 实例（不含卡片内部 visual/body 子元素），约 8 类主要卡片/面板类，几乎都共享“圆角 + 1px 边框 + 不透明背景 + hover 上浮/阴影”。这会把首页、博客导航、关于页和阅读页统一成产品 dashboard 式容器，削弱内容站的层级和阅读连续性。

## 1. 实际使用盘点

### shadcn / Radix / React

- 无 `components.json`，无 `src/components/ui/**`。
- `package.json` 没有 React、Radix、`cn()` 工具、CVA 或 `tailwind-merge`。
- `rg` 未发现 `from "react"`、`@radix-ui`、`radix-ui`、`client:load|idle|visible|media|only`。
- 现有交互是 Astro 原生按钮与脚本：主题切换、移动导航见 [[src/layouts/BaseLayout.astro]]:101-203；微信浮窗见 [[src/components/WechatWidget.astro]]:2-62；全屏古文控制见 [[src/layouts/FullscreenAncientLayout.astro]]:258-283；公式渲染脚本见 [[src/pages/[...slug].astro]]:334-344。

### 站点自定义 Card 系统

共同规则位于 [[src/styles/global.css]]:665-702：`.value-card`、`.project-card`、`.story-panel`、`.timeline-item`、`.principle-card`、`.blog-post-card` 共用 `border-radius: var(--radius-lg)`、`border`、`background: var(--card-bg)`、padding、transform/box-shadow hover。`.card-featured` 在 [[src/styles/global.css]]:591-609，`.card-accent-stripe` 在 :647-663，`.related-card` 在 :1782-1801。

主要调用点：

| 区域 | 代表文件/行号 | 实际模式 | 诊断分类 |
|---|---|---|---|
| 首页小说、最新文章、核心方向 | [[src/components/connect/HomeSections.astro]]:119-170 | `project-card`、`blog-post-card`、`value-card` | 内容/索引容器；可明显减卡 |
| 首页项目精选与项目列表 | [[src/components/connect/HomeSections.astro]]:176-235 | `card-featured` + `project-card` | 精选展示可保留；列表可改 editorial row |
| 首页 Build Loop | [[src/components/connect/HomeSections.astro]]:242-253 | `card-accent-stripe` | 时间/流程条目；更适合 divider/左色条 row |
| 关于页故事、原则、里程碑 | [[src/components/connect/AboutSections.astro]]:55-113 | `story-panel`、`card-accent-stripe` | story 不应套背景卡；原则/里程碑可 row |
| 项目页 | [[src/components/connect/ProjectsSections.astro]]:62-139 | `card-featured`、`project-card`、`card-accent-stripe` | 精选保留，其余减卡 |
| 博客首页 | [[src/components/blog/BlogIndexView.astro]]:77-134 | 栏目 `project-card`、文章 `blog-post-card` | 文章列表优先改无背景 row |
| 栏目页 | [[src/layouts/BlogSectionLayout.astro]]:126-164 | 子栏目 `project-card`、文章 `blog-post-card` | 同一内容模式重复一套卡片 |
| 文章页相关文章 | [[src/pages/[...slug].astro]]:314-325 | `related-card` | 改成三行/列表 + divider |
| 文章目录与正文 | [[src/pages/[...slug].astro]]:298-310；[[src/styles/global.css]]:1055-1060、1088-1131 | TOC 有背景卡；正文 `read-container` 有 `--read-bg` + radius | P0 内容阅读背景冗余 |

## 2. 数量、定义与真正语义

### 计数口径

下表是对源码文本的 `rg` 盘点；CSS 数量包含 selector 的重复引用（例如 hover、dark、reveal），Astro 数量按源文件中的 class 调用点计，不等于构建后实例总数。

| 类名 | CSS 文本命中 | Astro 文本命中 | 真实语义 |
|---|---:|---:|---|
| `card-featured` | 8 | 6 | 1 个精选项目展示；visual/body 是其内部装饰结构 |
| `card-accent-stripe` | 2 | 4 | 原则、里程碑、Build Loop 的静态条目 |
| `project-card` | 11 | 6 | 项目/栏目链接列表；适合 row/list |
| `blog-post-card` | 20 | 3 | 文章链接列表；最不需要实体背景 |
| `value-card` | 11 | 1 | 首页价值支柱静态内容 |
| `story-panel` | 7 | 2 | 关于页叙事面板；其中外层 gradient 壳与内层 panel 嵌套 |
| `related-card` | 12 | 4 | 文章页相关文章（1 article + title/meta/excerpt） |
| `timeline-item` / `principle-card` | 12 / 11 | 0 / 0 | 共享规则中的未使用抽象，应清理或改为显式 row token |

### 非 Card 但也造成“容器感”的规则

- 页面 chrome：`.site-header` [[src/styles/global.css]]:189-199 使用玻璃背景、边框、圆角、阴影。
- `.post-toc` [[src/styles/global.css]]:1055-1060 使用独立背景/边框/圆角。
- `.read-container` 与 `.post-prose.read-container` [[src/styles/global.css]]:1088-1131 给文章正文设置 `var(--read-bg)`、圆角；这正是“文章不该有任何背景卡片”诉求最直接的实现点。
- `.callout` [[src/styles/global.css]]:1240-1256 是正文中的信息块，属于真正的内容语义组件，不应与普通文章卡片一刀切。
- 图片、代码、表格的边框/背景 [[src/styles/global.css]]:1188-1235 是阅读可读性 affordance，不应当作为普通 Card 统计。

## 3. Token、一致性与抽象风险

### 设计 token

已有 token 是自定义命名：`--bg`、`--surface`、`--line`、`--card-bg`、`--card-border`、`--shadow-card`、`--radius-sm/md/lg/xl`，定义见 [[src/styles/global.css]]:6-61 与 dark 变体 :67-106。它们并非 shadcn 的 `--background`、`--card`、`--border`、`--radius` 体系；因此不应为了“看起来像 shadcn”机械增加 `bg-card` 或 `Card` 组件。

风险点：

1. 半径层级偏大（`0.65rem / 0.8rem / 1.1rem / 1.6rem`），普通文章条目和精选项目都使用 `--radius-lg`，层级差被抹平。
2. `--card-bg: var(--surface)` 与正文 `--read-bg` 都是不透明纸色；文章外层/正文/TOC/相关文章会出现多个相近但不同的“纸片”。
3. 卡片、按钮、导航、TOC、callout、代码块分别使用多套 border/background token；这不是 token 缺失，而是“哪些内容应成为 surface”的决策缺失。
4. 仍存在局部 inline 硬编码：[[src/components/connect/AboutSections.astro]]:57 的渐变边框、[[src/components/connect/HomeSections.astro]]:278 的 QR 背景，以及小说布局中的 inline 色值；不适合纳入普通 Card 重构。
5. `.blog-post-card` 既包含在共享 Cards 组，又在 [[src/styles/global.css]]:929-946 再定义一遍，属于重复抽象/覆盖风险。

### 客户端 JS、语义与可访问性

- Card 本身是语义 `<article>`，链接使用 `.card-link::after` stretched link（[[src/styles/global.css]]:686-692），可用但会扩大点击层；应确保 article 内不要再放第二个会与伪元素竞争的交互层。
- `card-featured`、静态 `value-card`、`card-accent-stripe` 使用 hover transform/阴影；需保留 `prefers-reduced-motion` 策略，避免把纯信息条目伪装成可交互控件。
- 文章页相关文章是 `<aside>`，但建议补充 `aria-labelledby` 与唯一 heading 关系；TOC 同样建议有明确标签/标题关系（[[src/pages/[...slug].astro]]:298-325）。
- 页面已有 skip link、`main`、`nav` 和 button label（[[src/layouts/BaseLayout.astro]]:120-189），说明主要风险是层级和交互暗示，不是缺少 shadcn a11y primitives。
- 无 React hydration 负担；引入 shadcn React Card 反而会新增客户端边界/依赖，不能解决视觉组合问题。

## 4. 逐层精简矩阵

| 层级 | 保留/改造决策 | 代表文件与行号 | 原因 |
|---|---|---|---|
| P0 — 正文 | 改为无背景 editorial surface：移除 `.post-prose.read-container` 的 `background`、`border-radius`；保留 measure/padding/typography | [[src/styles/global.css]]:1088-1131；[[src/pages/[...slug].astro]]:310 | 文章应像连续纸面，不像 dashboard 卡片 |
| P0 — 文章导航 | 改为无背景 aside + `border-top/bottom` 或单侧规则 | [[src/pages/[...slug].astro]]:298；[[src/layouts/AncientPostLayout.astro]]:124；[[src/styles/global.css]]:1055-1060 | TOC 是导航，不是内容卡 |
| P0 — 文章列表 | 改为 editorial row：标题、meta、excerpt + `border-bottom`，取消背景/圆角/上浮阴影 | [[src/components/blog/BlogIndexView.astro]]:113-134；[[src/layouts/BlogSectionLayout.astro]]:145-164 | 文章消费密度和连续性更重要 |
| P1 — 相关文章 | 保留 `<aside>` 与标题，`related-card` 改 row/divider；移动端可单列 | [[src/pages/[...slug].astro]]:314-325；[[src/styles/global.css]]:1776-1801 | 相关链接是导航集合，不是独立产品卡 |
| P1 — 关于叙事 | `story-panel` 改透明 prose/两列 editorial section；删除 [[src/components/connect/AboutSections.astro]]:57 的外层 gradient 壳 | 同上 | 当前存在嵌套卡片：gradient div → story-panel |
| P1 — 原则/里程碑/Build Loop | 保留内容语义，改为 divider + accent stripe row；取消普通背景与 hover lift | [[src/components/connect/AboutSections.astro]]:81-113；[[src/components/connect/HomeSections.astro]]:242-253；[[src/components/connect/ProjectsSections.astro]]:128-139 | 静态条目不应暗示按钮 |
| P1 — 栏目/项目列表 | 改为 compact editorial row；保留链接与 count/meta | [[src/layouts/BlogSectionLayout.astro]]:126-138；[[src/components/blog/BlogIndexView.astro]]:77-106；[[src/components/connect/ProjectsSections.astro]]:101-120 | 这些是列表项，不是交互原语 |
| 保留 | `card-featured` 可保留为唯一高强调展示；限制每页 1 个，保留视觉区/明确 CTA | [[src/components/connect/HomeSections.astro]]:183-207；[[src/components/connect/ProjectsSections.astro]]:69-93 | 精选内容有明确“surface”理由 |
| 保留并独立 | `.callout`、代码块、表格、图片边框作为正文语义/可读性组件 | [[src/styles/global.css]]:1188-1256 | 这些不是普通 Card，不能因减卡而损失可读性 |
| 清理 | 删除/合并未调用 `.timeline-item`、`.principle-card`；合并重复 `.blog-post-card` 规则 | [[src/styles/global.css]]:668-684、:929-946 | 减少无效抽象与覆盖路径 |

## 5. P0/P1 建议

### P0

1. 先定义“文章页无卡片”基线：正文透明、TOC 仅 divider/侧线、相关文章 editorial rows；不引入 shadcn Card。
2. 将 `blog-post-card` 与 `related-card` 的视觉规则收敛到一个无背景 `editorial-row` 语义类，避免复制一套 Card hover。
3. 移除或禁用静态内容条目的 hover 上浮/阴影；只有真正可点击的精选展示保留 motion，并受 reduced-motion 约束。

### P1

1. 将 `project-card` 仅保留给确有项目展示需求的精选模块；栏目索引、博客索引、相关文章改 divider rows。
2. 将 `card-accent-stripe` 降级为无背景的 `accent-row`，保留左色条作为分类标识。
3. 清理未使用的 `timeline-item`/`principle-card` selectors，合并重复 `blog-post-card` 定义。
4. 若未来确实需要 Dialog、Tabs、Sheet、Command 等交互原语，再按 shadcn 官方流程初始化；目前静态内容站不应为 Card 单独引入 React/Radix。

## 最终判断

用户观察“Card 用太多、文章不该有背景卡片”是准确的，但问题根源是设计语言把所有内容都组合成 surface，而不是 shadcn API 或 Radix 可访问性实现。当前最有效的方向是建立“精选 surface / editorial row / divider section / 正文 prose”四级组合规则，并让 Card 只承担少量明确的高强调展示。
