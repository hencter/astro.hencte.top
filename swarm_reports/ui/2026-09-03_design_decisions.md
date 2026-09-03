# 设计问答决策记录 — 2026-09-03

> 亦幸与主代理的设计拷问轮：每条含判断、证据与状态。防止后续轮次重复评估。

## 1. Card/卡片语法（P0 已实施；P1 轮廓揭示 2026-09-03）
- 判断：无脑"卡片化"是层级失语；正文/列表裸排，只有 object/hero/CTA 保留 surface。
- **轮廓揭示（用户偏好）**：Rest = 编辑式安静（无硬框）；hover / `:focus-visible`·`:focus-within` = 显现边线 + 短软抬升；`(hover: none)` 触屏保留轻描边。禁止厚 Material 阴影与弹跳 easing。
- 状态：✅ 哲学文档 + `Card.astro` + `.ink-card` token 已落地；首页项目 / 博客栏目入口已迁移；书架由其他代理持有。
- 详见：[[2026-09-03_card_design_philosophy]]

## 2. shadcn Select（LocaleSelect）
- 判断：真 shadcn = React/Radix hydration，本站不引入；原生 select 仿视觉零依赖。
- 状态：✅ 已统一头部 + 小说页（commit 6178825）。

## 3. Logo（「亦」字印章 SVG）
- 判断：品牌 mark 需专属 monogram。
- 状态：✅ header + favicon 已实施（dbbb4c2）；字形/字距待截图复核。

## 4. 导航
- 判断：骨架合理；#contact id 三重复为真 bug；Blog 需覆盖栏目家族。
- 状态：✅ 已修复（dbbb4c2）。

## 5. TOC / 悬浮目录
- 判断：TOC 卡片不合理 → 右侧 sticky rail（≥1200px 两栏，窄屏折叠）；古文/小说不套。
- 状态：✅ 普通文章右侧 sticky rail 已实施（去卡片背景，≥1180px 两栏 rail，无 headings 自动回落单列）；古文/小说不动（古文 TOC 随 .post-toc 裸化，无卡盒）。观感待截图复核。

## 6. 标签
- 判断：39 标签/49 实例太稀疏，不做独立 tag 路由；chip 可点化 + 栏目页轻量标签云足够。
- 状态：⏳ 待排期。

## 7. 信息密度
- 判断：首页 6 块超载；博客首页 18 条也超载。
- 状态：✅ 首页已改单页 hub（cdb41bf）；/blog 密度瘦身待排期。

## 8. 单页呈现
- 判断：长文+版权小说不能全站单页；首页单页 hub + 深页保留为最优。
- 状态：✅ hub 已实施（cdb41bf）。

## 9. 转场动画
- 判断：旧实现三层动画叠加显"重"（600ms 分段淡入 + 逐段入场 + 24px reveal）。
- 状态：✅ 已柔化（4df0738）：160+220ms 无间隙 crossfade、入场去逐段延迟、reveal 位移减半、prefers-reduced-motion 保留。

## 10. 视差动画
- 判断：苹果式满屏视差是"产品叙事"正解，与本站编辑式内容/阅读北极星/性能冲突；可借"空间层次"思想做 hero 微氛围，但克制优先。
- 决策：🚫 用户先选择**不做满屏视差**；随后把"视差式位移"落实到 **阅读 chrome 进出场**（见 #11）。hero 氛围视差保持不做。
- 依据：surface policy、2026-09-03 收敛报告、组件化审计。

## 11. 阅读聚焦 chrome（导航/目录随滚动隐现）
- 需求：滚动阅读时 chrome（sticky 导航 + 右侧 TOC rail）退出；停下不动也退出；上滚或指针回顶部再浮现；正文列始终居中不动；markdown 移动端渲染不得受影响。
- 状态：✅ 已实施（commit 待记录）：`html.reading-chrome--hidden` 控制；导航 translateY 视觉退出（transform 不影响布局、visibility 延迟隐藏防焦点落入）；rail 以 opacity/visibility 淡出（列宽保留 → 正文始终居中不重排）；下滚 >160px 隐藏、上滚即现、空闲 2.4s 隐藏、指针距顶 <96px 唤回；`prefers-reduced-motion` 下整体禁用；标题锚点 `scroll-margin-top` 规避 sticky 遮挡。移动端仅导航隐现、无 rail、MD 容器未触碰。

## 待排期汇总
- P1：TOC 右侧悬浮 rail、标签可点 + 轻量标签云、/blog 密度瘦身、静态卡降噪（story-panel 嵌套/hover/callout 色/badge·stats pill）。
- 视觉验收门：浏览器通道恢复后补 1440×900 / 390×844 截图（`/`、`/blog/`、技术正文、古文、小说章节、hub 首页）。
