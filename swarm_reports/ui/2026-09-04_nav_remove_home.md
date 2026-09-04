# Nav 去掉「首页 / Home」— 2026-09-04

> 北极星：品牌 logo 已回首页，主导航不再重复「首页 / Home」。

## 变更

| 文件 | 改动 |
|------|------|
| `src/lib/i18n.ts` → `getNavLinks` | 四 locale（zh-CN / en-US / zh-TW / zh-HK）均移除 home 项；保留 Projects、Blog、Links、About、Contact |

## 未改

- `BaseLayout.astro` 品牌 `homeHref` logo 链接保留
- `isNavActive` 保留（无 home 项时自然不再匹配首页；Blog 族高亮逻辑不变）
- 面包屑 / 古文壳 / 小说壳里的「首页」回链不属于 `.nav-list`，未动

## DoD

- `.nav-list` 无「首页」「首頁」「Home」
- Logo 仍链到各 locale 首页
