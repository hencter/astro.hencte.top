# 视觉流审计阻碍说明与结构证据

> 日期：2026-09-03
> 代理：visual-auditor
> 状态：**截图取证受阻；本文件不是已完成的视觉审计**
> 关联：[[2026-07-09_ui_audit]]、[[2026-09-02_theme_visual_refresh]]、[[2026-09-02_reading_measure_colors]]

## 结论先行

本轮无法按要求建立 in-app Browser 会话，因此没有生成、接受或检查任何新截图。为避免把源码推断伪装成视觉结论，以下只报告本轮可复现的构建、路由、依赖和 DOM/CSS 结构证据，并明确列出仍需截图确认的项目。

就当前可验证事实而言：

1. **站点没有使用 shadcn/ui，因而不存在“shadcn/ui 应用不当”的直接证据。** `package.json` 无 React、Radix 或 shadcn 依赖，仓库也没有 `components.json`、`components/ui` 或 shadcn 组件导入。现有卡片是 Astro 模板配合自定义 CSS。
2. **Card 密度在结构上偏高。** 生成 HTML 中，首页有 6 个 `.section` 外层面板和 20 个卡片表面；`/blog/` 在一个 `.section` 内放置 22 个卡片表面。问题不是某个组件库，而是“外层面板 + 内层卡片 + chip”反复叠加。
3. **文章正文建议优先去掉内层背景卡片感。** 正文页同时存在外层 `.section.post-shell`、`.post-toc` 面板，以及 `.post-prose.read-container` 的独立背景和圆角。建议先让正文 `background: transparent`、`border-radius: 0`，保留 70ch 行宽、横向留白、正文色与行高；这样不会牺牲阅读参数，却能减少“卡片套卡片”和长文被框住的感觉。
4. 由于缺少截图，不能确认上述结构在 1440px 和 390px 下的真实视觉强度；“去掉正文背景”是有明确结构依据的优先候选，不是本轮完成后的视觉验收结论。

## 审计范围与代表路由

本轮目标是从首页进入内容列表，再进入一篇技术正文，检查信息层级、Card 密度、阅读连续性、导航、颜色/边框/圆角、移动端重排和可访问性可见风险。

| 步骤 | 代表路由 | 预期视口 | 本轮健康状态 |
|---|---|---:|---|
| 1 | `/` | 1440px 桌面 | HTTP 200、DOM 可读；**未视觉确认** |
| 2 | `/blog/` | 1440px 桌面 | HTTP 200、DOM 可读；**未视觉确认** |
| 3 | `/tech/ai-guardrail/` | 1440px 桌面 | HTTP 200、DOM 可读；**未视觉确认** |
| 4 | `/tech/ai-guardrail/` | 约 390px 移动端 | 路由 HTTP 200；**未完成移动端截图与视觉确认** |

本地预览地址：`http://127.0.0.1:4321/`。静态构建成功，Astro 共生成 203 页。

## 截图取证状态

计划证据目录：

`D:\Hencter\astro.hencte.top\.scratch\ui-audit-2026-09-03\`

计划文件：

- `01-home-desktop-1440.png`
- `02-blog-index-desktop-1440.png`
- `03-article-desktop-1440.png`
- `04-article-mobile-390.png`

实际结果：**0 张截图**。in-app Browser 初始化失败，环境返回 `Browser use requires a trusted Node REPL browser service`。主代理复测得到同一结果。根据用户指定的浏览器约束和 Browser 技能规则，本轮没有改用 standalone Playwright、系统级截图或其他浏览器来冒充取证。

因此以下各项均未执行：等待视觉稳定、截图、打开截图检查、拒绝空白/加载中/错误截图、桌面/移动端对照。

## 可复现的结构证据

### 1. shadcn/ui 判断

本轮仓库搜索覆盖 `package.json`、`src/` 与常见 shadcn 路径/标识：

- 无 `shadcn` 字样；
- 无 `@radix-ui/*`；
- 无 `components.json`；
- 无 `components/ui/*`；
- 无 React 运行时依赖或 `<Card>` 组件导入。

结论：不要把当前 UI 问题归因于 shadcn/ui。[[2026-07-09_ui_audit]] 已建议本站继续采用纯 Astro 组件路线，本轮依赖证据与该建议一致。

### 2. Card 密度

从本轮实际预览返回的生成 HTML 统计精确 class token：

| 路由 | `.section` 外层面板 | 卡片表面 token | `chip-list` | 判断 |
|---|---:|---:|---:|---|
| `/` | 6 | 20 | 6 | 多个大圆角 section 再嵌套卡片，结构密度高 |
| `/blog/` | 1 | 22 | 18 | 文章归档被切成大量等权卡片与标签胶囊 |
| `/tech/ai-guardrail/` | 1 | 3（相关文章） | 1 | 正文之外另有目录面板、阅读背景层 |

卡片表面 token 统计包含 `value-card`、`project-card`、`blog-post-card`、`card-featured`、`card-accent-stripe`、`related-card` 等。首页还把 Hero 和每个主题 section 都做成带边框、背景、圆角的独立表面；这使“Card 化”不仅发生在内容单元，也发生在页面分区层级。

### 3. 正文阅读连续性

正文路由的层级为：

```text
.section.post-shell
├── .post-header
├── .post-toc                 # 有边框、背景、圆角
├── .post-prose.read-container # 独立阅读背景、圆角
└── .related-posts
    └── .related-card × 3
```

相关样式事实：

- `.section`：边框、混合 surface 背景、`--radius-xl`；
- `.read-container`：`--read-bg` 背景、`--radius-md`、上下内边距；
- `.post-prose.read-container` 再次设置背景与圆角；
- 正文 measure 为 `70ch`，行高 `1.75`，横向 padding 使用 `clamp(1rem, 4vw, 2rem)`；
- 浅色页面背景为 `#f5f0e6`，section surface 接近 `#fffcf5`，正文背景为 `#faf8f5`，构成多层相近纸色；深色下 section/card 与正文背景都接近 `#15110d`。

基于这些结构，**正文不需要再表现为一张独立 Card**。推荐的最小方向是只去掉 `.post-prose.read-container` 的背景和圆角，继续沿用 [[2026-09-02_reading_measure_colors]] 定义的行宽、排版与颜色 token。若实拍仍显得被外框束缚，再评估文章路由专用的无边框 `.section` 变体，而不是一次性去掉所有阅读留白。

### 4. 首页与文章列表的 Card 使用边界

Card 适合表达可独立点击、可比较、内容边界明确的对象，例如：项目、小说、相关文章。以下区域更适合降低 Card 感：

- 首页“最新博客文章”：可改为带分隔线的文章列表，突出标题、日期和摘要；
- `/blog/` 最新文章归档：保留栏目入口卡片，但正文索引优先使用紧凑列表/分组列表；
- 首页整段 `.section`：不必每个主题都同时拥有背景、边框和大圆角，可让关键 Hero/CTA 保留面板，其余用留白与标题分隔；
- 标签 chip：18 组 chip-list 与文章卡片叠加，会进一步碎片化列表扫描；可只展示关键标签或在归档页弱化为纯文本元信息。

以上属于结构机会点，仍需桌面截图确认哪些区域在真实字体、内容高度和配色下最拥挤。

## 源码层面的已确认优点

- BaseLayout 已有 skip link，指向 `#main-content`；
- 主题按钮为 44×44px；
- 920px 以下启用折叠菜单，按钮带 `aria-expanded`/`aria-controls`，脚本同步开关状态；
- 主导航有当前页状态；
- 全局存在 `prefers-reduced-motion: reduce` 降级；
- 正文行宽、CJK 行高和阅读色已 token 化，延续 [[2026-09-02_reading_measure_colors]] 的工作。

这些是实现层面的事实，不等于键盘、读屏或真实对比度测试已通过。

## 无法从本轮证据确认的项目

以下项目必须等有效截图或交互测试后再下结论：

1. 1440px 下 Hero、section 与 Card 的边框/阴影是否已经明显造成“表面过多”；
2. 字体加载后真实的标题层级、行长、段落密度与截断情况；
3. 正文背景与外层 section 的色差是否足以被感知为“卡片套卡片”；
4. 390px 下正文左右留白、代码块/表格/图片溢出与目录高度；
5. 移动端菜单展开后的遮挡、焦点次序、关闭方式和触摸体验；
6. 浅色/深色模式下的实际对比度与边界辨识度；
7. hover、focus-visible、滚动 reveal、Astro View Transition 的视觉与交互质量；
8. 截图中是否存在空白、加载中、错误页、裁切或第三方字体未加载。

## 后续截图验收清单

浏览器能力恢复后，应在同一轮重新执行并实际检查以下证据：

1. 1440×900 首页首屏与至少一个 Card 密集区；
2. 1440×900 `/blog/` 首屏和文章列表中段；
3. 1440×900 `/tech/ai-guardrail/` 标题、目录与正文起始；
4. 390×844 同一正文页，至少覆盖标题到正文起始，并补一张代码块或表格区域（若页面包含）；
5. 每张保存后打开检查，拒绝空白、错误、加载中或裁切截图；
6. 实拍对照“保留现状”与“正文背景透明”两个方向，再确定是否连外层 section 一起扁平化。

## 优先级建议（待视觉复核）

| 优先级 | 建议 | 原因 |
|---|---|---|
| P0 | 正文 `.post-prose.read-container` 去背景与圆角，保留 measure/padding/type tokens | 最小改动即可移除内层 Card 感，不损伤阅读参数 |
| P1 | `/blog/` 文章归档从逐条 Card 改为分组列表/分隔行 | 22 个等权表面不利于快速扫描 |
| P1 | 首页只保留关键 Hero/项目/CTA 的强表面，其余 section 用留白分区 | 减少 section 与 card 双重容器 |
| P2 | 精简归档页 chip 数量与视觉重量 | 降低碎片感，改善标题扫描 |

在补齐新截图以前，这些建议不得标记为“已视觉验证”。
