# UI Surface 与 Card 使用收敛报告 — 2026-09-03

> 范围：交叉审核 [[ui/2026-09-03_shadcn_card_inventory]]、[[ui/2026-09-03_editorial_surface_audit]]、[[ui/2026-09-03_visual_flow_audit]]，并参照 [[ui/2026-09-02_theme_visual_refresh]]、[[ui/2026-09-02_forum_design_port]]、[[ui/2026-09-02_reading_measure_colors]]、[[ui/2026-07-09_ui_audit]]。本轮只做综合、归档与路线排序，未修改站点源码。

## 本轮 North Star

让个人写作与作品成为视觉主角：用内容语义决定 surface，而不是让所有页面分区、文字流和链接集合共享同一种“圆角 + 四边框 + 填充 + 阴影/上浮”语法。

## 直接结论

1. **本站没有真正使用 shadcn/ui。** 当前是 Astro SSG + 自定义 CSS；不存在 shadcn Card 误用。也不应为了消除 Card 感而引入 React/Radix/shadcn。
2. **Card 过量的根因不是某个组件数量本身，而是缺少 surface 资格政策。** `.section`、文章/项目条目、正文、TOC、相关文章和静态说明被赋予相近的背景、边框、圆角及 hover 反馈；模板循环再把少数源码调用点展开成大量页面实例，形成“外层面板套内层卡片”。
3. **文章正文应完全退出通用背景 Card。** 普通博客的文章级 `.section.post-shell`，以及普通博客/古文所用的 `.read-container`，都不应形成有界背景面；保留阅读宽度、横向 padding、字色、字体和行高。代码、表格、公式、图片说明、引用和 callout 是内容语义 inset，不属于“正文背景 Card”，可以保留必要的局部区分。
4. **保留有明确职责的 surface。** 保留站点 header chrome；首页可保留一个 hero；项目、小说/书籍等独立且可比较的对象可保留轻量 object card；每页末尾至多一个 CTA surface；代码、callout、表格等保留语义 inset。文章列表、正文、元数据、TOC、相关文章、普通 section、故事/原则/时间线改为 bare flow、divider 或 rail。
5. **当前权威主题是“墨纸·鎏金”，不是“墨纸·青瓷”。** [[ui/2026-09-02_forum_design_port]] 及 Git 历史显示，青瓷刷新之后发生了明确的金色论坛配色移植；当前 token 与后一个变更一致。是否回退青瓷是新的品牌决策，不能在本轮 Card 精简中暗自处理。

## 代理执行摘要

| 报告 | 状态 | 可采用产出 | 证据限制 |
|---|---|---|---|
| [[ui/2026-09-03_shadcn_card_inventory]] | ✅ 完成 | 依赖、组件、CSS 与源码调用点盘点；Card 语义矩阵 | 数量以源码文本为主，不等于单页渲染数量 |
| [[ui/2026-09-03_editorial_surface_audit]] | ✅ 结构审计完成 | 阅读流、surface policy、页面级去留建议 | 无当前截图；部分视觉措辞是源码推断 |
| [[ui/2026-09-03_visual_flow_audit]] | ⚠️ 视觉取证未完成 | 构建、路由、生成 DOM/CSS 与单页实例计数 | in-app Browser 不可用，0 张新截图；不能视为视觉验收 |

## 证据分级

### A. 已由当前源码或构建验证的事实

- `package.json` 没有 React、Radix、CVA、`tailwind-merge` 或 shadcn 依赖；不存在 `components.json`、`src/components/ui`、`.tsx/.jsx` 文件、React/Radix import 或 `client:*` hydration 指令。
- Astro 源码中有 **19 个 Card 语义 wrapper 调用点**：`value-card` 1、`project-card` 6、`blog-post-card` 3、`card-featured` 2、`card-accent-stripe` 4、`story-panel` 2、`related-card` 1。这里统计模板位置，不统计 `card-featured-visual/body`、`related-card-title/meta/excerpt` 等内部子元素。
- 本轮重新执行 `pnpm build` 成功，Astro 生成 **203 页**。对生成 HTML 的精确 class token 复核结果为：`/` 有 6 个 `.section` 和 20 个上述 Card surface；`/blog/` 有 1 个 `.section` 和 22 个；`/tech/ai-guardrail/` 有 1 个 `.section`、3 个 `.related-card`、1 个 `.post-toc` 与 1 个 `.read-container`。
- [[src/styles/global.css]] 当前确实让 `.section` 使用背景、四边框和大圆角；主要 Card 类共享背景、边框、圆角与 hover；`.post-toc` 和 `.read-container` 也有独立背景与圆角。
- 当前 light token 为 `--brand: #b8792c`、`--accent: #a14932`，dark token 为 `--brand: #d9aa4e`、`--accent: #c46a52`；Git 历史中 `feat(ui): port DoggyArium forum gold palette, replace celadon green` 晚于青瓷主题刷新。

### B. 综合推断与设计判断

- “Card 感过重”“像 dashboard/论坛模板”“阅读连续性被切断”是三份报告从结构与样式共同推导出的判断，不是本轮像素级测量结果。
- Card 过量的系统性根因是**语义与视觉原语一对多失配**：页面分段、导航、文字流、对象展示都落到同一种 surface；循环渲染和双层嵌套放大了这一问题。
- 让正文与文章外壳回到 bare reading flow、让文章索引与相关文章变成 divider rows，是最符合个人内容站 North Star 的方向。

### C. 尚无法视觉确认的事项

- 1440px 下边框、色差、阴影和字体加载后的实际强度；390px 下的重排、留白、目录高度和代码/表格溢出。
- light/dark 的真实对比度、focus-visible、hover、滚动 reveal、View Transition 与移动菜单交互质量。
- 去背景后的最终 padding、divider 对比度、hero/CTA 视觉重量。浏览器通道恢复后，必须对 `/`、`/blog/`、技术正文、古文和小说章节进行 1440px/390px 截图与交互复核；在此之前不得声称“已视觉验证”。

## 冲突检测与裁定

### 1. “源码 19 个”与“单页 20/22 个”并不矛盾

- **源码口径**：19 是整个仓库中的 Card wrapper 模板位置；一个 `map()`/循环只计一个调用点。
- **渲染口径**：20、22、3 是具体路由构建后实际出现的 wrapper 元素；循环数据会展开为多个实例。
- **文本命中口径**：[[ui/2026-09-03_shadcn_card_inventory]] 表中的 `card-featured = 6`、`related-card = 4` 是名称文本命中，包含 visual/body/title/meta/excerpt 子类，不能与 wrapper 数相加。
- **裁定**：以后报告必须同时写“模板调用点 / 单页渲染实例 / 非 Card surface”，禁止用一个总数代替三者。

### 2. 青瓷报告与当前金色 token 是版本继承，不是未解释的漂移

[[ui/2026-09-03_editorial_surface_audit]] 正确发现当前 token 与 [[ui/2026-09-02_theme_visual_refresh]] 不一致，但漏掉了同日后续 [[ui/2026-09-02_forum_design_port]] 的明确替换记录。Git 提交顺序也验证金色移植晚于青瓷刷新。因此本轮以“墨纸·鎏金”为当前事实基线；Card 精简只改变 surface 职责，不夹带主题回退。

### 3. 正文先只去内层背景，还是连文章外壳一起裸化

[[ui/2026-09-03_visual_flow_audit]] 因无截图而主张先移除 `.post-prose.read-container` 背景，再观察外层；[[ui/2026-09-03_editorial_surface_audit]] 主张文章头、正文和外层一并 bare 化。若外层 `.section.post-shell` 仍有整块背景、四边框与圆角，“正文完全无背景 Card”的目标仍未达成。

**裁定**：目标状态是文章外壳与正文 wrapper 都无 Card 视觉；实施时用文章路由专属 bare variant 保留 measure/padding，避免全局删除 `.section` 造成无关回归。视觉参数须经截图验收。

### 4. 相关文章是否保留 Card

视觉流报告把相关文章列为“可能适合 Card”的独立可点击对象；另外两份报告将其视为阅读后的辅助导航。考虑其信息量低、紧随正文、且视觉报告没有截图支持，采用后者：保留 `<aside>` 语义与完整链接，将各条目改为 divider rows，不保留 object card。

### 5. 旧的“通用 Card 组件”建议是否继续

[[ui/2026-07-09_ui_audit]] 曾建议提取 `<Card />` 与 `<BlogPostCard />`。本轮发现问题恰是通用 Card 语法覆盖过广，因此该抽象方向被部分取代：仍坚持纯 Astro 和减少重复，但组件应按 `EditorialListItem`、`ProjectCard`、`ProseInset` 等语义拆分，不建立万能 Card 基类。

## 建议的 Surface Policy

| 类型 | 默认规则 | 适用对象 | 不适用对象 |
|---|---|---|---|
| **Bare flow（默认）** | 无有界背景、无四边框、无圆角、无阴影；用标题、留白与文字层级组织 | 页面 section、文章头/正文、元数据、文章列表、相关文章 | 独立对象、浮动操作 chrome |
| **Rule / rail** | 单侧 1–3px 线或条目间 divider；无填充背景、无 hover lift | section heading、TOC、时间线、原则、Build Loop | 整页或长文背景 |
| **Semantic inset** | 仅在内容语义切换处用弱底色或单侧线；小半径可选；无上浮 | code、callout、表格、公式、必要引用/图注 | 通用正文 wrapper、普通文章条目 |
| **Object card（例外）** | 仅用于独立、可点击、需要比较且有复合信息的对象；轻边框/背景，反馈克制 | 项目、小说/书籍入口、带封面的作品；featured 每页至多 1 个 | 最新文章、纯文字栏目、related、静态价值说明 |
| **Chrome / CTA（例外）** | header 可 glass；hero 可保留一个气氛面；每页末尾至多一个 CTA surface；禁止嵌套 Card | 固定导航、主题/语言控件、首页 hero、页末 CTA | 普通内容 section |

### 文章专用规则

- `.section.post-shell` 与 `.post-prose.read-container` 的目标视觉均为 transparent / borderless / radius 0；`--read-*` token 继续承担文字、行宽、行高和页面级阅读场配色。
- TOC：桌面 rail/sticky list，移动端 `<details>` 或无框列表；不使用普通 Card。
- related posts：保留 `<aside>` 与 heading，条目采用单列 divider rows。
- code、callout、blockquote、table、math、mermaid、figure 可按语义保留局部 inset；这不违反“正文无背景 Card”。

## 统一优先级与分阶段实施顺序

分值按 `Impact × Urgency / Effort` 计算（各项 1–5）；排序用于下一轮实施，不表示本轮已修改。

### P0 — 先恢复阅读连续性

| 顺序 | 行动 | I/U/E | Score | 验收重点 |
|---:|---|---|---:|---|
| 1 | 建立文章路由专属 bare variant，同时移除 `post-shell` 与正文 wrapper 的背景 Card；保留 measure/padding/type | 5/5/2 | 12.5 | 正文首段前无四边框、圆角背景或阴影 |
| 2 | 将首页、博客首页、栏目页的文章条目及正文后的 related 统一为 editorial divider rows | 5/4/3 | 6.7 | `/blog/` 可快速扫描，related 不再出现三张小卡 |
| 3 | 裸化普通 `.section`，仅为 hero/CTA/object 区域显式启用 surface variant | 5/4/4 | 5.0 | 不再出现“section card 包 card” |

### P1 — 重建导航和对象层级

| 顺序 | 行动 | I/U/E | Score | 验收重点 |
|---:|---|---|---:|---|
| 4 | TOC 改 desktop rail + mobile disclosure；标签/元数据降为文字 taxonomy | 4/3/3 | 4.0 | 目录可发现但不抢正文层级 |
| 5 | story、原则、里程碑、Build Loop、栏目入口改 bare/rule/rail；项目与小说 object card 保留 | 4/3/4 | 3.0 | 静态信息无 hover lift；对象仍清晰可点 |
| 6 | hero 最多一个强 surface、页末最多一个 CTA；解除父 section 双框 | 3/3/3 | 3.0 | 强调面有预算且不嵌套 |
| 7 | 固化“当前为墨纸·鎏金、青瓷已被替换”的设计记录；若要回退，另开品牌决策 Sprint | 3/2/2 | 3.0 | 报告、token 与 Git 历史口径一致 |

### P2 — 清理和精修

| 顺序 | 行动 | I/U/E | Score | 验收重点 |
|---:|---|---|---:|---|
| 8 | 以语义原语替代万能 Card 抽象，合并重复 `.blog-post-card`，清理未使用 `.timeline-item/.principle-card` | 3/2/4 | 1.5 | CSS 无重复覆盖，组件名表达职责 |
| 9 | token 化 code/callout/math/table inset，降低 chip 与普通链接的视觉重量 | 3/2/4 | 1.5 | 语义块清晰但不重新卡片化 |
| 10 | 收敛非交互内容的 hover motion；只给真实可点击 object card 保留克制反馈 | 2/2/3 | 1.3 | 静态内容不再假装按钮 |

## 分阶段验证门

1. **基线**：记录当前构建与 DOM 数量；恢复浏览器后补齐 `/`、`/blog/`、技术正文、古文、小说章节的 1440×900 和 390×844 截图。
2. **P0 后**：先核对正文、列表、外层 section 的视觉层级；同时检查 focus-visible、整行链接和 dark mode，未通过不得推进大范围 CSS 清理。
3. **P1 后**：复核 TOC、项目/小说对象卡、hero/CTA 的可发现性与移动端布局。
4. **P2 后**：执行完整构建、关键路由截图、键盘流程与对比度检查，才可宣称视觉整改完成。

## 本轮遗漏与后续建议

- 本轮没有有效截图，因此只完成了结构收敛，不构成视觉验收；[[ui/2026-09-03_visual_flow_audit]] 应在浏览器通道恢复后补跑，而不是把源码判断改写成截图结论。
- 本轮未做真实读屏、键盘或触控测试，也未测量 light/dark 对比度。
- shadcn 无需进入当前 backlog；未来只有在确实需要 Dialog、Tabs、Sheet、Command 等复杂交互原语时，再独立评估框架与 hydration 成本。

## 经验沉淀

- UI 数量审计必须分开记录模板调用点、单页渲染实例和非 Card surface，避免相同数字标签指向不同对象。
- 主题报告必须按 Git 时间线解释“当前态”；截图通道失败时，结构事实、设计推断与视觉验收结论必须分层。
