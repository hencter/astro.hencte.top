# 友链模块移除头像 UI

**日期**: 2026-09-04  
**领域**: ui  
**代理**: friend-links-no-avatar  

## 目标

从友链（Friend Links）模块彻底去掉头像/占位圆：无 avatar 图、无 fallback 字母槽、无空头像间隙。

## 变更

| 文件 | 改动 |
|------|------|
| `src/components/connect/FriendLinksSections.astro` | 移除 friend / ownSite 的 `<img>` 与 fallback；删 `.friend-avatar*` 样式；卡片布局改为 `1fr auto`；own-site 纯文字行 |
| `src/styles/global.css` | `.ink-card--link` / `.friend-card` 网格由 `auto 1fr auto` → `1fr auto`（对齐无头像布局） |
| `src/content/zh/links.md` | 交换规则去掉「含图标 URL」（仅改文案一行；保留并行代理新增的 huanggaoxiang 条目与 avatar 字段） |
| `src/content/en/links.md` | 同上（en） |

## 刻意未改

- `content.config.ts` 与 frontmatter 中的 `avatar` 仍为 optional — UI 不再读取，旧数据与并行新增条目不破。
- tw/hk 经 `getMirroredConnect` 复用 zh，随组件变更自动生效，无独立视图需改。

## DoD

- [x] 友链 UI 无头像/圆形占位
- [x] 布局无空 avatar 列，与 ink-card 设计一致
- [x] zh/en/tw/hk 同一组件路径覆盖
- [x] 未 git commit
