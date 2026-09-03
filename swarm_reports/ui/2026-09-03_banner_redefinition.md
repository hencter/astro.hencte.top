# Banner 重定义 — 分区大气头 + 正文纸面 — 2026-09-03

> 北极星：分区气氛在 Banner 上；正文保持纸墨；悬停只呼吸文字；Card 只留给可点复合对象。  
> 关联：[[2026-09-03_card_design_philosophy]]、[[2026-09-03_ui_surface_p0_implementation]]。

## Banner API

组件：`src/components/Banner.astro`

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `title` | `string` | 必填 | 主标题（page→h1，section/cta→h2） |
| `subtitle` | `string?` | — | 一句支持文案 |
| `kicker` | `string?` | — | 小轨标签（原 hero badge） |
| `image` | `string?` | — | 气氛图路径；缺省则纯纸面头 |
| `imageAlt` | `string?` | `""` | 装饰图可空 alt |
| `variant` | `"page" \| "section" \| "cta"` | `"page"` | 页面头 / 分区头 / 收束 CTA |
| `compact` | `boolean` | `false` | 略减内边距 |
| `id` | `string?` | — | 锚点 |
| `actions` | `{label,href}[]` | `[]` | CTA；默认文字链，非卡阵 |
| `actionStyle` | `"text" \| "button"` | `"text"` | 首页品牌主 CTA 可用 button |
| `split` | `boolean` | `false` | CTA 旁侧槽（二维码） |
| `prefetch` | `boolean` | `false` | 动作链 hover prefetch |

Slots：`before`（面包屑等）、默认、`aside`（split 侧栏）。

配图解析：`src/lib/section-images.ts` → `sectionImage(key)`  
扫描 `public/img/sections/{key}.{webp,jpg,jpeg,png}`，不存在则 `undefined`（不喷坏图）。

兼容层：

- `Hero.astro` → Banner `variant="page"` + `actionStyle="button"`
- `CtaBanner.astro` → Banner `variant="cta"` + 文字链；`split` 走 `aside`

## 应用面

| 页面 / 布局 | 变更 |
|-------------|------|
| Home (`HomeSections`) | Banner + `sectionImage("home")`；hub chips / more 用 `.text-breathe` |
| Blog index (`BlogIndexView`) | Banner；栏目入口由 Card 格 → `EditorialListItem` 行 |
| Blog section (`BlogSectionLayout`) | Banner + `sectionKey`；子栏目卡阵 → editorial rows |
| About / Projects / Links | Banner + 对应 section key |
| Obsidian plugins (zh/en) | Hero → Banner |
| SectionHeading | 仍为无图编辑轨；标题加 `.text-breathe` |

书架路由未改布局（共享 Banner 仅经全局 CSS）。

## Card 克制

- 博客首页栏目入口、栏目页子栏目：去掉 `Card` / `project-card` 格，改为 divider 行。
- About：去掉左栏渐变描边装饰壳，双栏裸 `story-panel`。
- 真对象卡（项目 featured / work、友链）保留 ink-card 轮廓揭示，未回滚。

## 文字呼吸

全局 `.text-breathe`：精确指针下 opacity + letter-spacing 微变；链接配软下划线。  
`prefers-reduced-motion`：取消位移/字距呼吸，保留瞬时色变。  
未动 `scroll-behavior: smooth`（与 smooth-scroll 代理共存）。

## 配图协调

- 约定目录：`public/img/sections/`（已建 `.gitkeep`）
- Keys：`home` `blog` `log` `tech` `ancient` `about` `projects` `links` `shelf` `obsidian`
- 本轮无图时 Banner 仍为可读纸面头；section imagery 代理落盘后自动启用气氛图。

## Build

`pnpm build` — **成功**（209 pages，sitemap OK）。

## 文件清单

- 新增：`src/components/Banner.astro`、`src/lib/section-images.ts`、`public/img/sections/.gitkeep`
- 改写：Hero / CtaBanner / SectionHeading / EditorialListItem / Home·About·Projects·FriendLinks / BlogIndexView / BlogSectionLayout / obsidian pages / `[...slug]` / `ancient`
- 样式：`global.css`（`.site-banner*`、`.text-breathe`；保留 scroll-behavior）
