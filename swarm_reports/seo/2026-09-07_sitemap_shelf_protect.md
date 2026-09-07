# Sitemap / robots：Protect 轨踢出发现队列 — 2026-09-07

**触发**：GSC 显示 sitemap 已成功处理（205 发现），但仅 7 页已索引；199 页「已发现 - 尚未编入索引」（上次抓取=不适用）。列表大量为四语 `/shelf` 章节，而布局已 `noindex`。

**根因**：2026-09-03 曾把 `/shelf` 放回 sitemap（205 = 公开页 + ~128 书架），与 noindex 信号矛盾，挤占 crawl 队列。

## 变更

| 文件 | 改动 |
|------|------|
| `astro.config.mjs` | sitemap `filter`/`serialize` 排除 `/shelf` 与 `/novel` |
| `public/robots.txt` | 全部 UA 段 `Disallow` 四语 `/shelf/` + `/novel/` |

## 构建验证

```
pnpm build → exit 0, 209 pages
```

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| sitemap `<loc>` | ~205 | **77** |
| 含 `/shelf` | ~128 | **0** |
| 含 `/novel` | 0 | **0** |
| robots Disallow `/shelf/` 四语 | 无 | **有（全 UA）** |

## 部署后建议（人工）

1. 等新 sitemap 被 GSC 再读
2. URL 检查优先请求：`/`、`/about/`、`/tech/seo-geo-architecture/`、代表作 log/tech
3. 观察「已发现未索引」下降、已索引 >7

*对齐教义：Cite 轨进 sitemap；Protect 轨 noindex + robots + 不进 sitemap*
