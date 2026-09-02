# 编辑式阅读体验与 Surface Policy 审计 — 2026-09-03

> 范围：中文首页、博客首页/栏目页、博客正文、古文与小说阅读、侧栏与 CTA；只读诊断，不改站点源码、索引或 Git。
>
> 关联：[[2026-09-02_theme_visual_refresh]]、[[2026-09-02_reading_measure_colors]]、[[2026-07-09_ui_audit]]、[[CONTEXT]]、[[AGENTS]]。

## 最强结论

站点的核心问题不是「卡片的视觉不好」，而是**容器没有表达信息层级**：站点把“页面分段”、 “可比较的对象”、 “长文阅读纸面”、 “交互控件”四种不同语义，都套进了圆角、边框、浅底、阴影和 hover 上浮这一种语法。

因此首页每个主题段落先是 `.section` 面板，里面再是项目/文章卡；文章页则是 `.section.post-shell` 外框、`.post-toc` 卡、`.read-container` 暖纸卡、`.related-card` 卡的连续嵌套。读者会先感到组件系统，再感到作者、栏目与文本。对个人写作/作品站，这会削弱编辑感与可信度。

应确立一个单一判断：**只有“可点击且需要彼此比较的独立对象”才是 card；文字流、栏目分段、文章元数据和导航都应裸排或以细分隔线组织。** 长文正文尤其不应拥有任何背景卡片。

## 审计证据与边界

- 已检查现有组件、布局、内容入口、`global.css` 和上述三份历史报告；源码行号均为本次工作树实际位置。
- 可视化浏览器服务在本次运行不可用，未能取得当前页面截图；关于密度、节奏和暗色的结论基于已渲染的 DOM 结构与 CSS，而非像素级截图核验。实施后应以 `/`、`/blog/`、一篇技术文、古文、小说章节的 1440px 与 390px 截图复审。
- 历史报告的主题描述与实际工作树存在直接冲突：[[2026-09-02_theme_visual_refresh]] 记录的青瓷 `--brand: #3d6b5e`、朱砂 `--accent: #b85c42`，并称本轮已替换；现有 `global.css:3-18` 却标为 “Ink & Gold — DoggyArium forum”，实际为金褐 `#b8792c` 与砖红 `#a14932`。所以无法把“卡片化”归因于该报告所述刷新；可确认的是，当前工作树没有落实那套青瓷 token，且仍保留/强化了通用卡片语言。

## 当前表面层级：问题在哪里

| 区域 | 当前容器语法 | 阅读后果 | 证据 |
|---|---|---|---|
| 页面骨架 | 渐变/噪点的背景上，所有内容置于 1120px shell | 适合品牌气氛；无需再给每个区块做“盒中盒” | `global.css:121-161,171-175` |
| 顶部导航 | 半透明、有边框、圆角、blur 的 sticky surface | 合理：它是浮在内容上的操作 chrome | `global.css:180-200` |
| 首页/栏目大段 | 每一个 `.section` 都有圆角、边框、浅底、内距 | 把“章节”误做成卡；连续 5–6 块会形成仪表盘式格栅 | `global.css:537-543`; `HomeSections.astro:119,137,158,176,242,259` |
| 首页文章、栏目和项目 | `.section` 面板内再嵌 `.blog-post-card`、`.project-card`、`.value-card` | 双层边框和背景使文章条目与项目对象同权，阅读入口不够安静 | `global.css:668-701,919-946`; `HomeSections.astro:142-155,163-173,212-237`; `BlogIndexView.astro:77-138` |
| 文章页 | `.section.post-shell` 外框 + `.post-toc` 卡 + `.read-container` 纸面卡 + related cards | 一篇文章被拆成连续的小组件；正文与页面背景之间不需要再画一个圆角边界 | `[...slug].astro:271-330`; `global.css:1035-1060,1088-1131,1782-1801` |
| 栏目页 | hero 卡、section 卡、栏目 project cards、文章 cards | IA 层次由边框而非标题/分隔/节奏承担，栏目内容显得像 SaaS 控制台 | `BlogIndexView.astro:45-63,77-138`; `BlogSectionLayout.astro:121-170` |
| 古文/小说 | 正文仍有阅读容器背景；小说自身基本为裸纸流 | 小说的裸流、窄 measure、章名分隔更接近目标；古文/普通文则仍被网站卡片系统包住 | `AncientPostLayout.astro:87-146`; `NovelLayout.astro:161-214,303-322` |

### 视觉刷新与品牌气质

[[2026-09-02_theme_visual_refresh]] 的正确方向是温暖纸感、衬线正文、小魏体标题和减少炫技动画；[[2026-09-02_reading_measure_colors]] 的 70ch / 40em / 42em measure 亦是可保留的基础。不过当前实现产生三个副作用：

1. **“纸”被误解成一张张纸卡。** `--read-bg` 被直接赋给 `.read-container`（`global.css:1088-1097,1127-1131`），所以正文变成圆角浅色面板；真正编辑式的纸感应是整个阅读场的底色与字色关系，不是正文外框。
2. **同一装饰反复出现。** `.section`、`.hero`、CTA、featured card、普通 card 都有圆角+边框，间距仅约 `0.95rem`（`global.css:427-437,537-543,567-574,830-839`）。层级越多，几何语言反而越少。
3. **当前色彩并不等于“墨纸·青瓷”。** 这不是审美小问题：金褐/砖红与报告中承诺的青瓷/朱砂是不同品牌信号，且会让“文学纸感 + 技术个人站”的克制定位滑向复古论坛/模板感。应先在设计 token 层确认唯一的品牌色，再做组件删减，避免为两套主题同时调样式。

## 建议 Surface Policy（可直接转为组件与 CSS 规则）

### 1. 语法词典

| Surface 类型 | 允许的处理 | 禁止/避免 | 适用对象 |
|---|---|---|---|
| **Bare flow（默认）** | 页面底色、留白、标题层级、1px 分隔、文字链接 | 圆角容器、整块浅底、投影 | 栏目段落、文章头、正文、元数据、列表文章、目录、related posts |
| **Rule / rail（编辑标记）** | 左侧 2–3px 品牌线，或底部细线；无填充 | 四边边框+圆角同时出现 | section heading、时间线、引用、目录定位 |
| **Inset（语义插页）** | 极弱色差或左边线，0–6px 半径可接受 | hover 上浮、作为泛用文章外框 | 引用、注释、警示、公式、表格标题；按内容语义出现 |
| **Object card（例外）** | 细边框/有限背景；仅一个清晰可点击对象；hover 只改链接或边框 | 把纯文字条目、标签或每个页面 section 卡片化 | 项目、书籍封面/小说入口、带缩略图的作品、可比较的栏目入口 |
| **Chrome / CTA** | header 可用 glass；CTA 可用一次品牌色带或淡色面 | 多层嵌套 card、与普通内容使用同一 card | 固定导航、theme/language controls、页末联系行动 |

### 2. 页面级决策

| 页面/区域 | 应采用 | 现有落点与执行建议 |
|---|---|---|
| 首页 hero | 一个有气氛的 hero surface 可以保留，但弱化边框/阴影二选一 | `.hero` (`global.css:427-437`) 保持为唯一大 surface；其后不要每段再加 section card。 |
| 首页栏目区 | **Bare flow + heading rail + 纵向留白** | `HomeSections.astro:119-259` 的各 `.section` 改为裸 section；使用 `padding-block: clamp(2.5rem, 7vw, 5rem)`、标题底线/左线来分段。 |
| 最新文章 | **编辑式 list** | `HomeSections.astro:142-155` 改为一列文章行：栏目/日期在上或左、标题、两行摘要；项目卡只保留给项目。首页最多展示 3–5 条，全文链接放段尾。 |
| 博客首页与栏目页 | **bare list，栏目入口可用轻对象块** | `BlogIndexView.astro:77-138` 和 `BlogSectionLayout.astro:126-168`：栏目可有 4 个轻量入口（无投影、仅分隔）；最新文章/文章列表去 card，改 `article + border-top`。 |
| 项目 | **Object card，可保留** | `ProjectsSections.astro:62-125`：项目确有 stage/outcome/tags/外链、且需要横向比较。保留 featured 单卡和项目对象卡，但消除外层 `.section` 外框、减少 emoji visual。 |
| 文章头 | **Bare flow** | `[...slug].astro:271-295`：取消外层 `.section` 的边框/背景；breadcrumb、栏目、标题、元数据和标签排在统一阅读 measure 上。 |
| 正文 | **Bare reading flow，绝不使用背景卡** | `[...slug].astro:310-312` 与 `global.css:1088-1097,1127-1131`：保留 max-width、padding、字体与颜色，移除 `background`/`border-radius`/上下“纸面”内距。可将全页文章场改用 `--read-bg`，而非正文 div。 |
| 目录 | desktop 为 **rail**，mobile 为 **disclosure/list** | `[...slug].astro:297-308`、`global.css:1055-1083`：不要普通 card。桌面在正文左/右做 sticky 的细左线索引；移动端放在元数据下的 `<details>` 或无边框折叠目录。 |
| 标签/元数据 | **裸排文字**；标签只在筛选时是 chip | `[...slug].astro:284-294`，`global.css:742-767,973-981`：日期/阅读时长用分隔 dot；文章头 tags 由实心 pill 改为弱文本链接或短横列。 |
| 相关文章 | **同一列编辑式列表** | `[...slug].astro:314-328`、`global.css:1764-1801`：改标题+两三条 border-top 行，避免正文后再出现 3 张小卡。 |
| CTA | **唯一、明确的收束面** | `HomeSections.astro:259-280`、`AboutSections.astro:119-135`：CTA 应只在页面末尾出现一次，可保留淡品牌面或左色带；外层 `.section` 必须裸化以避免双框。 |

### 3. 正文元素

- **标题与留白**：保留 `Noto Serif SC`、70ch 和既有 1.75 / 1.9 行高（`global.css:48-61,1114-1139`）。正文 `h2` 前增加明显的 section break（约 2.5–3.5em），而不是依赖容器换色；`h3` 只收窄间距。标题无需每次配 card 或 badge。
- **引用**：改为裸的 3px 左线 + 斜体/次级墨色，默认不填色；仅长引文可用极弱 inset。当前 `blockquote` 的底色、圆角、4px 左线（`global.css:1194-1200`）应减一层。
- **代码/图表**：代码块可保留清晰不同底色，因为它是语义上不同的阅读模式；边框或圆角二选一，禁用 hover。`Fence.astro:26-43` 仍用 GitHub light/dark 主题，和墨纸 token 是另一套语气，应在后续专门对齐。图表可作为 inset；图片本身不应像 card，只需必要的细线/说明文字（`global.css:1188-1192,1319-1386`）。
- **callout / 表格 / 数学**：允许语义插页，不应继承“卡片 hover”。callout 的硬编码高饱和彩边及 dark `#1a2332` 会把青瓷/暖墨基调打断（`global.css:1240-1314`）；应 token 化、收敛为少数状态色，正文中优先左线而非封闭盒。
- **暗色**：不要通过“更深的 card”来分层。主背景/阅读背景保持同一暖黑的微小明度差；正文、分隔线与链接用 token 取得层次。当前 `--read-bg` 等于 `--surface`（`global.css:68-105`），仅靠圆角不能形成有意义的阅读层级。

## 桌面与移动的差异

| 情境 | 桌面 | 移动 |
|---|---|---|
| 页面分段 | 大留白（约 64–96px）+ heading rail；可用 2–3 列对象卡 | 40–56px 留白；所有纯文本列表为单列，不因窄屏加 card 边框 |
| 文章列表 | 单列长行最佳；日期可设在窄副栏或标题上方 | 日期/栏目置于标题上方，摘要压至 2 行；整行链接，但触点由行高和标题 link 提供而非卡片 |
| 目录 | sticky rail（正文之外，不竞争 70ch measure） | 默认收起；在文章头后展开，读正文时不浮成卡 |
| 正文 | 70ch 文字列；仅全页面可有读写场色差 | `padding-inline: 1rem–1.25rem`，仍无 card 背景；代码/表格横向滚动并保留语义 inset |
| CTA/项目 | CTA 横向排布、项目可网格 | CTA 垂直；项目对象仍允许单卡，但减少内距/不做 translate hover（触屏没有 hover） |

当前 `.card-grid.three`、`.blog-list-grid` 在 920px 变单列（`global.css:1619-1631`）这一响应式结构可保留；应改变的是它们承载的表面语法，而不是强行恢复多列。

## 优先级与精确改动面

| 优先级 | 变更 | 文件 / 选择器 | 目的 |
|---|---|---|---|
| P0 | 分拆容器职责：`section` 默认裸排；新增仅给 hero/CTA/项目使用的 surface variant | `src/styles/global.css:537-543,830-839` | 一次解除首页、栏目与正文的双层卡片化。 |
| P0 | 正文从 card 中释放；把 read palette 移到文章页面/阅读区，而非 `.read-container` | `src/styles/global.css:1088-1131`; `src/pages/[...slug].astro:271-312`; `src/layouts/AncientPostLayout.astro:87-146` | 落实“文章无背景卡片”的用户直觉，同时保留行宽与排版。 |
| P0 | 博客条目组件改为 divider list；related 改为同一语法 | `src/components/blog/BlogIndexView.astro:113-138`; `src/layouts/BlogSectionLayout.astro:145-168`; `src/components/connect/HomeSections.astro:137-155`; `src/styles/global.css:919-968,1764-1857` | 让写作成为首页/栏目页主角，项目才保留对象卡。 |
| P1 | TOC 从 card 改 rail/disclosure；文章头 tags 降级为文本 taxonomy | `src/pages/[...slug].astro:272-308`; `src/layouts/AncientPostLayout.astro:98-137`; `src/styles/global.css:742-767,1035-1083` | 减少文章开始前的组件噪声。 |
| P1 | CTA 仅保留页面末尾一个强 surface，并裸化其父 section | `src/components/connect/HomeSections.astro:259-280`; `src/components/connect/AboutSections.astro:119-135` | CTA 成为真正收束，而非又一张卡。 |
| P1 | 先确认并统一主题 token；不要以历史报告为视觉真相 | `src/styles/global.css:3-105`; [[2026-09-02_theme_visual_refresh]] | 恢复“墨纸·青瓷”的单一品牌契约，避免金褐/论坛感和报告承诺并存。 |
| P2 | 减少所有普通 card 的 bounce hover；文章链接采用下划线/色变，项目卡才保留少量边框反馈 | `src/styles/global.css:679-701,934-968,1790-1819` | 编辑式站点的动感来自阅读路径，不来自每个矩形上浮。 |
| P2 | callout、code、math、mermaid 收敛为 prose 专用 inset token | `src/styles/global.css:1194-1408`; `src/markdoc/components/Callout.astro:31-38`; `src/markdoc/components/Fence.astro:26-43` | 保留内容语义变化，但不复用卡片系统。 |

## 验收标准

1. 一篇普通文章从 breadcrumb 到正文首段，除代码/引用等语义块外，**没有**圆角背景、四边边框或阴影。
2. 首页在 hero 之后，连续文本区依靠留白与 heading rail 分段；一屏中不出现“section card 包 card”的双层框。
3. `/blog/` 与栏目页的文章条目是单列/分隔线阅读列表；项目仍可被识别为独立可比较对象。
4. 每页最多一个 CTA surface；header 是唯一长期浮动 chrome。
5. 亮暗两色都只用 token 形成层次；无额外 GitHub/冷蓝 callout 与未确认的主题 token 混入。
6. 在 390px 和 1440px 复拍 5 条关键路径，并确认没有因去框导致链接、焦点、目录或触摸目标失去可发现性。

## 建议实施顺序

先做 P0 的正文与博客列表（对阅读收益最大），再裸化外层 section，最后处理目录、CTA 和 prose inset。不要先新建“万能 Card 组件”：这会把当前问题抽象并固化。应先建立 `BareSection`、`EditorialList`、`ProjectCard`、`ProseInset` 四种语义明确的原语，之后再做抽取。
