# 配图与文案优化报告 — 2026-09-03

> **范围**: 首页/项目页配图接线、小说关键章插图补齐、重点博客封面、中英文案压缩  
> **执行**: 主代理（配图 Sprint）  
> **构建**: `pnpm build` ✅（209 pages）

## North Star

为站点「需要配图」的高曝光面补上真实视觉，并收紧对外文案：更短、更品牌、更可扫读。

## 配图清单

| 资产 | 用途 | 路径 |
|------|------|------|
| Nova | 首页/项目 featured | `/img/projects/nova.png` |
| 通天路 | 首页/项目卡片 | `/img/projects/tongtianlu.png` |
| 商业帝国 3D | 首页/项目卡片 | `/img/projects/monopoly-3d.png` |
| LinkTrust | 项目卡片 | `/img/projects/linktrust.png` |
| 天空税 ch06 | 章节头图 | `/img/novel/sky-tax-ch06.png` |
| 天空税 ch10 | 章节头图 | `/img/novel/sky-tax-ch10.png` |
| 天空税 ch24 | 章节头图 | `/img/novel/sky-tax-ch24.png` |
| AI 三道门 | 博客封面 | `/img/blog/ai-three-gates-cover.png` |
| SEO+GEO | 博客封面 | `/img/blog/seo-geo-cover.png` |

## 代码与内容变更

- `content.config.ts`：`featuredProjects` 增加可选 `image` / `imageAlt`
- `HomeSections.astro` / `ProjectsSections.astro`：优先渲染项目配图，保留 emoji 回退
- `global.css`：`.card-featured-visual img` 与 `--image` 变体
- 压缩 `zh/en` 的 home / projects / about 文案；修正 EN 首页主行动为「Start reading」
- 小说索引 `novel.md`（zh/en）补充可读描述
- 小说 ch06 / ch10 / ch24（zh+en）写入 `chapterImage` + `imageAlt`

## 文案策略

- Hero 以品牌名为主信号，副标题压到 2 句内
- 项目描述去掉堆砌句，保留「是什么 + 结果」
- 首页写作区 subtitle 明确包含小说指针

## 仍待下一波

| 优先级 | 事项 |
|--------|------|
| P1 | 《我被AI反向驯化了》各章头图 |
| P2 | hencte.top / Obsidian 插件项目卡配图 |
| P2 | 更多 tech 文章封面（ai-guardrail 等已有） |
| P3 | 压缩超大 PNG（部分 >2.5MB）为 WebP |

## 维基链接

- [[2026-09-02_novel_illustrations_generated]]
- [[2026-09-02_section_pages]]
- [[2026-09-03_home_hub_singlepage]]
