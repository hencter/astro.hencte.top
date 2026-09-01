# 小说 per-novel 目录结构重构

**日期**: 2026-09-02  
**代理**: content-editor (novel directory subagent)  
**状态**: ✅ 完成，`pnpm build` 通过（197 pages）

## 问题

此前所有章节平铺在 `src/content/novel/{zh-CN,en}/` 下，以 `{series}-ch{nn}.md` 命名，**每本小说没有独立目录**，Nutstore 导入与人工维护都不直观。

## 方案

采用 **locale-first + per-series 子目录**（与 OpenCC TW/HK 镜像管线兼容）：

```
src/content/novel/
├── _glossary/              # 术语表（按 series 命名，OpenCC 保护词）
│   ├── sky-tax.json
│   └── ai-counter-taming.json
├── zh-CN/
│   ├── novel.md            # 书架索引
│   ├── sky-tax/
│   │   ├── index.md        # 系列 landing
│   │   └── ch01.md … ch26.md
│   └── ai-counter-taming/
│       ├── index.md
│       └── ch01.md … ch04.md
└── en/
    ├── novel.md
    ├── sky-tax/
    │   ├── index.md
    │   └── ch01.md … ch26.md
    └── ai-counter-taming/
        └── index.md        # EN stub（coming soon）
```

Collection ID 示例（Astro glob loader，Windows 上为小写 `zh-cn/`）：

| 文件路径 | Collection ID | 公开 slug |
|----------|---------------|-----------|
| `zh-CN/sky-tax/index.md` | `zh-cn/sky-tax/index` | `sky-tax` |
| `zh-CN/sky-tax/ch01.md` | `zh-cn/sky-tax/ch01` | `sky-tax-ch01` |
| `en/sky-tax/ch12.md` | `en/sky-tax/ch12` | `sky-tax-ch12` |

`entrySlug()` 在 `novel-helpers.ts` 中将 nested path 映射回 legacy slug，**URL 不变**。

## Before / After

### Before（flat）

```
src/content/novel/zh-CN/
  novel.md
  sky-tax.md
  sky-tax-ch01.md … sky-tax-ch26.md
  ai-counter-taming.md
  ai-counter-taming-ch01.md … ch04.md
```

### After（per-series）

```
src/content/novel/zh-CN/
  novel.md
  sky-tax/index.md + ch01.md … ch26.md
  ai-counter-taming/index.md + ch01.md … ch04.md
```

（`en/` 同理，天空税 26 章 + ai-counter-taming stub）

## URL 影响

| 路径 | 变更 |
|------|------|
| `/novel/sky-tax` | ✅ 不变 |
| `/novel/sky-tax-ch{nn}` | ✅ 不变 |
| `/novel/ai-counter-taming` | ✅ 不变 |
| `/en/novel/…` | ✅ 不变 |
| `/tw/novel/…`、`/hk/novel/…` | ✅ 不变（OpenCC 镜像仍读 zh-CN 源文件） |

**无需新增 redirect** — slug 映射层保留 `{series}-ch{nn}`  convention。

## 代码变更

| 文件 | 变更 |
|------|------|
| `src/lib/novel-helpers.ts` | `entrySlug()` nested 映射；`isSeriesLanding()`；`enChapterExists` 按 slug 查找 |
| `src/lib/novel-page.ts` | landing/chapter 查询改用 slug 而非 flat id |
| `src/content.config.ts` | 注释说明目录约定 |
| `scripts/import-novels.mjs` | 写入 `{series}/index.md` + `ch{nn}.md`；含 flat→nested 迁移 |

## 如何添加新小说（开发者）

1. 在 Nutstore `20_Areas/创作与内容/{书名}/` 准备章节 markdown
2. 在 `scripts/import-novels.mjs` 增加 `importMyNovel()` 函数（参考 `importSkyTax`）
3. 或手动创建：
   ```
   src/content/novel/zh-CN/my-novel/index.md    # frontmatter: title, description, locale
   src/content/novel/zh-CN/my-novel/ch01.md     # frontmatter: title, novel: "my-novel", chapter: 1
   ```
4. 可选：添加 `src/content/novel/_glossary/my-novel.json` 供 OpenCC 术语保护
5. 运行 `pnpm import:novels` 或 `pnpm build` 验证

公开 URL 自动为 `/novel/my-novel` 与 `/novel/my-novel-ch01`。

## 验证

- `pnpm import:novels` — 迁移 62 flat 文件 → nested
- `pnpm build` — 197 pages，含 `/novel/sky-tax`、`/novel/sky-tax-ch01` 等

## 关联

- [[2026-09-02_novel_i18n]] — 初始 locale 分区与 Nutstore 导入
- [[2026-09-02_slug_geo_novel]] — slug 规范 `{series}-ch{nn}`
