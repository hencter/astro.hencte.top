# 全站组件化审计 — 2026-09-03

> 范围：`src/components|layouts|pages|lib|styles|markdoc` 全量静态盘点；只读审计，未改源码、未提交 Git。
> 关联：[[ui/2026-09-03_ui_surface_p0_implementation]]（本轮 P0 后基线）、[[ui/2026-09-03_ui_surface_convergence]]、[[ui/2026-07-09_ui_audit]]。

## 审计基线（本轮 P0 + LocaleSelect 已落地后）

| 层 | 数量 | 说明 |
|---|---|---|
| 页面 | 34 个 astro | 大部分是 i18n 薄壳（zh/en/tw/hk × home/about/projects/blog/links/novel/obsidian） |
| Layout | 8 | 5 个独立 HTML 壳 + 2 个 BaseLayout 子壳 + 1 个死存根 |
| 组件 | 15（另有 2 死存根） | connect 5 + blog 1 + novel 0（LocaleSelect 取代）+ 通用 4 + learn 1 |
| 生成页 | 207 | `pnpm build` ✅（最近一次验证） |
| 样式 | global.css 1821 行 / ≈46 区块 / 4 处 @media | 另 7 处组件内 `<style>`，14 处内联 `style=` |
| lib | 12 个 ts 文件 | 内容/镜像/转换/渲染各司其职 |

## 一、布局壳层（发现：5 个独立 HTML 壳，各写一遍样板）

| 壳 | 行数 | 备注 |
|---|---|---|
| `BaseLayout.astro` | 267 | 站点主壳：header/nav/theme/GA/reveal/footer/skip-link |
| `FullscreenAncientLayout.astro` | 327 | 古文全屏阅读壳（独立 inline 样式 + 脚本） |
| `NovelLayout.astro` | 480 | 章节阅读壳（大段 inline CSS + DRM/防扒脚本） |
| `NovelIndexPage.astro` | 333 | 书库壳 |
| `NovelLandingPage.astro` | 131 | 丛书页壳 |

- **主题初始化脚本重复 5 处**（`localStorage.getItem('theme')` boot 块：BaseLayout + 3 小说壳 + FullscreenAncient）。
- 小说三壳各自重复 `<head>` 样板：viewport/meta/robots noindex/canonical/theme script/自己的 `--nv-*` 或页面级 token 集。
- **微信浮窗双实现**：站点 `WechatWidget.astro`（仅 BaseLayout 引用）与 NovelLayout 内自实现的 `.nv-wechat-widget`（受小说壳隔离策略保护）。
- **404 双份复制**：`pages/404.astro` 与 `pages/en/404.astro` 整页含 `<style>` 复制；**zh-TW/zh-HK 无 404 页**（将回落英文/简体 404，属 i18n 覆盖缺口）。
- **死存根**：`layouts/PostLayout.astro`（4 行）、`components/learn/EmptyComponent.astro`（5 行，全 `learn/` 目录仅此一文件）——零引用，脚手架残留。

## 二、结构组件缺口（同一段 markup 多文件内联复制）

| 模式 | 出现文件数 | 现状 | 建议组件 |
|---|---|---|---|
| **Hero**（badge/title/subtitle/actions） | 8 | BlogIndexView、4 个 connect 板块、BlogSectionLayout、obsidian/plugins ×2 语言 | `<Hero>`（含 hero-compact 变体） |
| **section-heading**（rail+title+subtitle） | 4 | About/FriendLinks/Home/Projects | `<SectionHeading>` |
| **CTA banner** 容器 | 3 | About/Home/FriendLinks 相同 `.cta-banner` 结构 | `<CtaBanner>` |
| **Breadcrumb** nav | ≥3 | BlogSectionLayout、`[...slug]`、AncientPostLayout（三种写法细节不一） | `<Breadcrumb items>` |
| **文章行**（blog-post-card 结构） | 3 | Home/BlogIndex/BlogSectionLayout markup 近似但细节分叉（kicker/meta/tags/summary 组合不同） | `<EditorialListItem post>`（对齐 P0 editorial row） |
| **文章头块**（kicker+title+meta+chips） | 2 | `[...slug]` 与 AncientPostLayout | `<PostHeader>` |
| **TOC** aside | 2 | `[...slug]`（post-toc）与 AncientPostLayout（heti 包裹） | `<PostToc headings>`（配合 P1 rail 改造） |
| **RelatedPosts** | 1（在 `[...slug]` 页内嵌 25 行） | 应组件化以便古文/未来栏目复用 | `<RelatedPosts>` |
| **card-featured 精选展示** | 2 | Home/Projects 各写一遍 | `<ProjectFeatured>`（object card 例外保留） |
| **碎片** | - | `card-kicker` 12 处、`chip-list` 8 处、`post-meta-line` 4 处、`hero-actions` 6 处、按钮对 ×7——低层碎语汇重复 | 视提取成本入 P2 语义原语化 |

## 三、样式组件化（单体 + 局部孤岛）

1. **global.css 单体**：1821 行、≈46 区块、仅 4 处 @media。P0 后 surface 规则已语义化，但“哪些规则属于壳/页面/内容”仍未分层。
2. **组件内 `<style>` ×7**：FriendLinksSections 内联样式块最大（自身 311 行中约 120 行样式）、WechatWidget、LocaleSelect（新组件，合理自带）、NovelLayout/NovelIndexPage/NovelLandingPage、FullscreenAncient（large inline）。孤岛样式与 global token 平行存在（`--nv-*` vs global），维护成本高但受版权/隔离策略保护，**不建议强行合并小说样式**。
3. **重复/覆盖与死代码**：`.blog-post-card` 双基类（共享组 668 + 专有 926）；`.timeline-item`/`.principle-card` 死选择器（模板零引用，上轮已点名仍未清）；共享卡片 hover 组只服务 P1 待裸化条目。
4. **内联 `style=` 散落 ≈14 处**：HomeSections/AboutSections/ProjectsSections/BlogIndexView/NovelLayout 等（渐变边框、QR 底色、grid 列数覆盖、accent 色数组…）——应 token 化/组件 prop 化。
5. **i18n 文案散落**：12 个文件直接含 `zh-TW` 三/四语分支（如 BlogIndexView 内联 `pendingDate`/`summaryFallback`、JsonLD 本地化、各壳 aria/按钮串）；connect 内容已走 content collection（好实践），但组件层 UI 串仍与 `lib/ui-strings.ts`/`novel-helpers` 并行。

## 四、lib 层与数据流

- 良好：`content collections` 承担正文/文案；`blog-helpers`/`novel-*`/`i18n` 职责清晰；LocaleSelect 让导航交互成为可复用组件（本轮先例）。
- 需收敛：UI 文案三源（组件内联分支 / `ui-strings.ts` / `novel-helpers.ts`）；`connect-mirror` 与 `novel-helpers` 镜像转换并存（一个给 connect 内容、一个给小说，属有意并行但需在文档标注）。

## 五、组件化目标蓝图（只读建议，未实施）

对齐 UI Surface policy 的语义原语，**顺序 = 收益/风险**：

| 优先级 | 行动 | I/U/E | 风险 | 说明 |
|---|---|---:|---|---|
| P1 | 抽 `<Hero>`、`<SectionHeading>`、`<CtaBanner>` | 5/4/3 | 低 | 8+4+3 处复制收敛；纯展示、无逻辑 |
| P1 | `<EditorialListItem>` 收敛 3 处文章行 | 5/4/3 | 低-中 | 先统一 prop 契约（kicker/title/date/tags/summary/url）再替换 |
| P2 | `<PostHeader>`/`<PostToc>`/`<Breadcrumb>`/`<RelatedPosts>`（文章系，跨普通/古文） | 4/3/3 | 中 | 与 P1 TOC rail 同轮做，古文 heti 包裹保留 |
| P2 | `<ErrorPage locale>`：zh/en 合并且补 tw/hk | 3/3/2 | 低 | 修 404 覆盖缺口 |
| P2 | 样式治理：删死选择器、合并 `.blog-post-card` 双基类、内联 `style=` token 化 | 3/2/4 | 中 | global.css 按 chrome/page/prose/object 分层 |
| P2 | 删除 PostLayout/EmptyComponent 死存根 | 1/1/1 | 无 | 脚手架残留 |
| P3 | 小说壳共享 head/token 模板（`NovelHead` partial） | 2/2/5 | 高 | **红线：不得触碰 DRM/防扒/阅读脚本**；只合并纯样板（meta/token 声明），先做 diff 试验再动 |
| P3 | 微信浮窗复用进小说 | 1/1/5 | 高 | 小说有独立视觉与反扒策略，维持现状更安全 |

## 六、验证门与限制

1. 每次抽取后：`pnpm build` 页数保持 207；抽查 `/`、`/blog/`、技术正文、古文、小说章节、`/links` 的 DOM 类名与 `git diff` 克隆点计数下降。
2. 本审计仍无浏览器截图通道——只做结构/文本事实，视觉一致性验收继续挂起。
3. 小说部分遵守用户红线：阅读体验、反扒（noindex/noai/robots/复制拦截/DevTools 检测）一律不动；如需放开小说 SEO 属独立决策，另开 Sprint。

## 经验沉淀

- 组件化审计应先量“复制点 × 语义变体”，再谈提取：hero/heading/CTA 是**同构复制**（安全抽），文章行是**近构分叉**（先定 prop 契约），小说/古文壳是**有界孤岛**（不抽或最小抽）。
- 详见 [[lessons_learned]] #16。
