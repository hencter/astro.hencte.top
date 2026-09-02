# UI Surface P0 实施报告 — 阅读连续性恢复 — 2026-09-03

> 范围：执行 [[2026-09-03_ui_surface_convergence]] 的 P0 三行动（文章路由 bare 正文、文章列表/related 改 editorial divider rows、裸化普通 `.section`），不包含 P1/P2。
> 基线：`91fe805 docs(ui): audit editorial surfaces and card usage`（上一轮只归档未改源码）；本轮期间另一会话并发提交了 `7a618b8 feat(links)`，已用 git 隔离，未混入本提交。

## 本轮结论

1. **P0 三项全部落地，构建通过（207 页），结构验收满足，视觉验收仍未完成**（本环境无浏览器截图通道，与上轮一致）。
2. 改动的视觉语义从“圆角 + 边框 + 浅底 + hover 上浮”退到：正文与列表回到页面底色上的 bare flow；分段交给留白与 heading rail；只有 hero、CTA banner、object card（项目/小说/友链卡）保留明确 surface。
3. 未触碰品牌 token：当前仍以“墨纸·鎏金”为基线（[[ui/2026-09-02_forum_design_port]] 之后的 Git 事实），本提交不夹带主题回退。

## 变更清单（4 个源码文件 + 本报告）

| 文件 | 变更 |
|---|---|
| `src/styles/global.css` | ① `.section` 默认 bare（padding/border/radius/background 清零），新增 opt-in `.section--surface` 供 hero/CTA/object 使用；② `.read-container` 移除 `background: var(--read-bg)` 与圆角，删除重复的 `.post-prose.read-container` 装饰块，保留 measure/padding/type；③ `.blog-post-card` 由 boxed card 改为 bare 行（无背景/无边框圆角、`border-bottom` divider、无 hover 上浮，摘要 2 行截断），新增 `.post-list` 单列容器；④ 删除只为 3 列卡阵服务的 `.blog-post-card:nth-child(3n)` 装饰点；⑤ `.related-grid` 改单列、`.related-card` 改 divider 行（border-top 分隔、无卡视觉、无 dark 残留覆盖）；`.blog-list-grid` 保留给项目对象卡网格 |
| `src/components/connect/HomeSections.astro` | 首页“最新博客文章”容器 `blog-list-grid` → `post-list` |
| `src/components/blog/BlogIndexView.astro` | 博客首页“最新文章”容器 → `post-list` |
| `src/layouts/BlogSectionLayout.astro` | 栏目页“文章”容器 → `post-list` |

### 未改动的有意保留（P1 范围）

- `.post-toc` 仍是卡片（P1 #4 改 rail/disclosure）。
- `value-card`、`card-accent-stripe`、`story-panel` 静态条目仍保留卡/色带（P1 #5）。
- header chrome、`.hero`、`.cta-banner`、`.card-featured`/`.project-card` 对象面、代码/表格/引用/callout 语义 inset 全部保留。
- `.blog-list-grid` 名称暂留在 ProjectsSections（项目对象网格），语义改名留 P2。
- 友链页 `FriendLinksSections.astro`（并发提交 7a618b8 新增）：父 `.section` 自动裸化，条目本身是组件内 `<style>` 定义的独立卡片，符合 policy，未改。

## 验收证据（结构级）

基线对比沿用上轮口径：**模板调用点 / 单页渲染实例 / CSS 规则**三者分开。

| 检查项 | 结果 |
|---|---|
| `pnpm build` | ✅ 207 页，6.79s，exit 0 |
| 编译 CSS `.section` | `.section{background:0 0;border:0;border-radius:0;padding:0}`，`.section--surface{...}` 仅显式面恢复旧盒 |
| 编译 CSS `.read-container` | 无 background/无 radius，保留 max-width/padding-inline/padding-block/color |
| 编译 CSS `.blog-post-card` | 新规则（idx 更高）覆盖旧共享卡规则：border:0、bg 透明、divider |
| `/` (home) | 6 个 `.section`（不再有卡盒）、1 个 `.post-list`、6 行 `.blog-post-card`、1 个 `.cta-banner` |
| `/blog/` | 1 个 `.section`、1 个 `.post-list`、18 行 `.blog-post-card`（0 个 `blog-list-grid`） |
| `/tech/ai-guardrail/` | 1 个 `.post-prose.read-container`（bare）、1 个 `.related-grid`、3 个 `.related-card` divider 行、`.post-toc` 仍为 P1 待办 |
| `/en/`、`/en/blog/` | `.post-list` 生效，i18n 四语一致（zh/en/tw/hk 共用组件） |
| `/links/`（并发新增） | 构建无冲突，sitemap 正常生成 |

### 限制（与上轮相同的证据分级）

- 无浏览器截图与像素测量：1440px/390px 下的实际留白、divider 对比度、dark mode、focus-visible、移动端目录高度未做视觉验收；本提交只承诺“结构 + CSS 规则”已按 policy 收敛。
- `.section` 内边距清零后，内容对齐从“section 内缩进”变为“page-shell 边缘对齐”，观感需截图复核；如过宽可后续给 `.post-list`/heading 增加 measure 约束（留 P1/P2 微调）。

## 下一步（P1/P2 保持收敛计划排序）

1. P1：TOC rail/mobile disclosure；文章头 tags 降文字 taxonomy。
2. P1：story/原则/里程碑/Build Loop 裸排与 `accent-row`；栏目入口 divider；hero/CTA surface 预算复核。
3. P2：语义原语（BareSection/EditorialList/ProjectCard/ProseInset）固化、合并重复 `.blog-post-card` 规则与 `.blog-list-grid` 改名、callout/code inset token 化。
4. 浏览器通道恢复后：对 `/`、`/blog/`、技术正文、古文、小说章节补 1440×900 与 390×844 截图验收，再宣称视觉整改完成。

## 经验沉淀（本轮新增）

- **多会话共享同一工作树时，git 状态是竞争资源**：本轮开工时 `git status` 干净，中段另一会话提交了 7a618b8；若直接用 `git add -A` 会把他人产出卷进本提交。提交前必须复查状态并显式 `git add` 本会话文件。详见 [[lessons_learned]] #15。
