# Lang switcher all routes — 2026-09-03

> 亦幸小阁 · 全站 chrome 语言切换可见性 + 路由↔内容有界修复。  
> 交叉报告：通天路仓 `docs/qa/banner-i18n-routing-20260903.md`（若同会话）。

## 根因

`BaseLayout` 仅在 `connectPage` 有值时生成 `languageLinks` 并渲染 `LocaleSelect`；`BlogSectionLayout`（`/log` 等）未传 `connectPage` → 栏目页顶栏缺失语言切换。

## 修复

1. `getChromeLanguageLinks` 恒返回四 locale；缺对等页 → 该语种首页。
2. `BaseLayout` 始终挂载 `LocaleSelect`。
3. `BlogSectionLayout` 传 `connectPage="blog"`；EN 栏目 chip 不链假 `/en/log`。
4. `getLatestPosts` / `getBlogIndexData` 按 locale 过滤（`-en` 启发式）。

## 验收

- `pnpm build` → 209 pages OK  
- `dist/{index,log,blog,about,projects,obsidian/plugins,en,en/blog}/index.html` 均含 `data-locale-nav`  
- 未 commit / 未 push  

## Pass/Fail

**Pass（有界）**
