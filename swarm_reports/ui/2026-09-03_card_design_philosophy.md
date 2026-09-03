# Card 设计哲学 — 墨纸 · 亦幸 — 2026-09-03

> 北极星：只有「可点击、可比较、信息复合」的独立对象才配成为 Card。  
> 其余一律裸排（bare flow）、分隔行（editorial row）或语义插页（inset）。  
> 关联：[[2026-09-03_ui_surface_convergence]]、[[2026-09-03_editorial_surface_audit]]、[[2026-09-03_design_decisions]]。

## 一条铁律：先安静，再成卡

| 状态 | 视觉 | 意图 |
|---|---|---|
| **Rest** | 近乎编辑式：透明/极弱底、**无硬轮廓**、无阴影、无抬升 | 阅读场保持纸面平静；对象存在靠标题、媒体与留白，不靠盒子 |
| **Hover**（精确指针） | 轮廓显现 + 短软阴影 + `translateY(-1~2px)` | 「这是可交互对象」；边框像墨线落纸，不是 Material 浮层 |
| **`:focus-visible` / `:focus-within`** | 与 hover **同级轮廓**（键盘无 hover 也必须可见） | a11y：焦点路径不依赖鼠标 |
| **Touch / `(hover: none)`** | Rest 即带 **始终轻描边**（`--line` 弱化），无抬升依赖 | 无 hover 设备上对象边界仍可发现；禁止依赖 sticky `:hover` |

阴影预算：单层、短距、低不透明度（`--shadow-card-lift`）。禁止多层 glow、大模糊、弹跳 easing。

## 何时用什么

| 原语 | 用 | 不用 |
|---|---|---|
| **Card (`work` / `link` / `shelf` / `featured`)** | 项目、友链、封面向书架项、每区至多 1 个精选 | 文章列表、正文、TOC、related、静态说明、普通 section |
| **Editorial row**（`EditorialListItem` / `.blog-post-card`） | 首页/博客/related 的文字条目 | 伪装成卡的文章摘要格 |
| **Bare surface / section** | 栏目分段、叙事、原则、时间线 | 再套一层圆角边框 |
| **Cover-forward shelf** | 书/小说入口以封面为主、文字为辅 | 把章节目录做成卡片墙 |

**一句话测验**：去掉 border / shadow / radius 后，它还像不像一个独立可点对象？若不像，它就不该是 Card。

## 解剖（Anatomy）

```
┌ media（可选：图 / 封面 / 视觉场）
├ kicker（阶段、栏目、来源 — 小 caps / accent）
├ title（唯一主链接目标；可 stretched）
├ meta / body（结果、摘要、标签 — 次级墨色）
└ action（显式 CTA；与 stretched link 互斥，避免双层点击竞争）
```

- **一个主交互**：整卡 stretched *或* 标题/按钮其一，不两者抢伪元素层。
- **媒体服务对象**：封面/缩略图表达作品本身；禁止装饰性 emoji 墙冒充 media。

## 视觉规则（绑定墨纸气质）

当前 token 基线为工作树「墨纸·鎏金」；气质契约仍按**墨纸**执行：暖纸、克制墨线、短抬升——无论青瓷/鎏金色相，**轮廓语法不变**。

1. **半径**：对象卡用 `--radius-card`（偏小的纸边，非大圆角 SaaS）。精选可用略大 `--radius-card-featured`。
2. **边框**：Rest = `transparent`（精指针）或 touch 轻边；Active = `--card-border` → hover `--card-hover-border`。
3. **底**：Rest 透明或 `color-mix` 极弱；禁止与页面 `--surface` 叠出「盒中盒」。
4. **动效**：`border-color` / `box-shadow` / `transform` ≤ 280ms，ease 克制；`prefers-reduced-motion` 取消位移，仅保留轮廓色变。
5. **密度**：同屏 object card 宜少；精选 **每页至多 1**。

## 变体（仅在有语义时）

| Variant | 语义 | Rest 特例 |
|---|---|---|
| `work` | 项目 / 可比作品 | 安静；可有缩略图 |
| `featured` | 单区高强调作品（layout 加宽） | 仍安静；布局不靠更重阴影 |
| `link` | 外链/友链人格对象 | 同行头像 + 名；轮廓揭示同 work |
| `shelf` | 封面向前的书目格 | Rest 可靠封面本身建立边界；轮廓仍可在 hover 加强 |

**没有 `editorial` Card 变体。** 文章行永远是 list row，不是 Card。

## 反模式

- **Card soup**：section 套 card 再套 card；或一屏十张同权盒子。
- **Nested cards**：卡内再卡；gradient 壳包 panel。
- **Decorative-only cards**：无链接、无比较价值的静态文套盒子 + hover 上浮。
- **Hero cards**：首屏 hero 禁用 object card 语法（见前端规则）。
- **Heavy Material**：大投影、弹跳 `cubic-bezier(0.34,1.56,…)`、多层 glow。
- **Hover-only a11y**：键盘看不见轮廓；触屏无任何 resting edge。

## 组件契约

- Astro：`src/components/Card.astro` — `variant` + slots；**不引入** React/shadcn。
- CSS：`.ink-card` + `--work|featured|link|shelf`；遗留 `.project-card` / `.card-featured` / `.friend-card` **别名到同一揭示语法**（向后兼容）。
- 书架 / 栏目配图由其他代理拥有：本哲学只固化 API 与 token；不抢改其布局文件。
