# Section Banner Imagery — 2026-09-03

> 代理：section-imagery（续跑；前次 resource_exhausted）  
> 范围：`public/img/sections/{key}.{webp,jpg,png}` 资产补齐；不改 Banner 结构

## 结论

Banner 已通过 `sectionImage(key)` 解析分区大气图。本轮仅补齐缺失的 **home**、**obsidian**；其余分区图已存在且键名一致。novel/shelf 按指令跳过。

## 键盘点（call sites）

| Key | Call site | 资产 | 解析路径 |
|-----|-----------|------|----------|
| `home` | `HomeSections.astro` | **新增** `home.webp` (1920×1280) | `/img/sections/home.webp` |
| `blog` | `BlogIndexView.astro`；`BlogSectionLayout` fallback | 已有 | `/img/sections/blog.webp` |
| `log` | `BlogSectionLayout`（log 分区） | 已有 | `/img/sections/log.webp` |
| `tech` | `BlogSectionLayout`（tech 分区） | 已有 | `/img/sections/tech.webp` |
| `ancient` | `BlogSectionLayout` / `ancient.astro` | 已有 | `/img/sections/ancient.webp` |
| `about` | `AboutSections.astro` | 已有 | `/img/sections/about.webp` |
| `projects` | `ProjectsSections.astro` | 已有 | `/img/sections/projects.webp` |
| `links` | `FriendLinksSections.astro` | 已有 | `/img/sections/links.webp` |
| `obsidian` | `obsidian/plugins.astro` + `en/...` | **新增** `obsidian.webp` (1920×1280) | `/img/sections/obsidian.webp` |
| `shelf` | （类型声明有；路由跳过） | 未做 | — |

## 变更

- 新增 `public/img/sections/home.webp` — 墨纸·青瓷桌面静物（青瓷盏、笔、朱印、墨晕）
- 新增 `public/img/sections/obsidian.webp` — 线装书 + 青瓷碎片 + 节点图示意（知识网络）
- **无** Banner / `sectionImage` 代码改动；键名无需修正

## Soft-verify

`sectionImage()` 对上表除 shelf 外全部返回非 `undefined`。最终目录：

```
about.webp, ancient.webp, blog.webp, home.webp, links.webp,
log.webp, obsidian.webp, projects.webp, tech.webp
```

## 构建

`pnpm build` 成功：209 pages，~7.3s，无错误。未做 git commit。
