# 首页单页 Hub 重构报告 — 2026-09-03

> 决策：用户设计问答选"首页单页 hub"——首页改为一条滚动叙事（hero → 锚点快捷条 → 精选项目 → 最新写作 → 关于浓缩 → 联系 CTA）；about/projects/blog/links 深页保留，SEO 不损。

## 变更清单

| 文件 | 变更 |
|---|---|
| `src/components/connect/HomeSections.astro` | 全量重构：移除小说卡区/核心方向 value-card/持续节奏 accent-stripe 三个重区块（旧 id novels/focus/playbook/latest 清零）；新顺序 hero → `.hub-jump`（项目/写作/关于/联系 + /blog ghost chip）→ `#hub-projects`（featured 1 + 其余 ≤3 网格 + 全部项目入口）→ `#hub-writing`（最新写作 ≤4 条 divider 行 + 原创小说入口）→ `#hub-about`（62ch 编辑式简介 + 深入了解）→ 联系 CTA（保留 QR）；featured 图标抽取 `featuredIcon()` 取代三层内联三元；新增 scoped 样式（chip/详情行/简介排版） |
| `src/lib/ui-strings.ts` | HOME_STRINGS zh/en 新增 hub 文案键（hubWriting/hubProjects/hubAbout/hubContact/aboutTitle/aboutBody/aboutCta/viewNovels/viewAllProjects）；zh-TW/zh-HK 经 opencc 自动转换 |

## 验证

- `pnpm build` ✅ 207 页。
- zh/en/tw/hk 首页均含 `hub-projects/hub-writing/hub-about` 锚点与正确本地化文案；旧区块 0 残留；首页文章行 = 4；`id="contact"` 每页仅页脚 1 处；en 版 about 文案为英文。
- 深页不受影响：about/projects/blog/links/novel 路由与内容未动，sitemap 页数不变。
- 首页信息负载：6 块 → 4 块叙事 + 快捷条；"核心方向/Build Loop"内容仍保留在 content 中可后续迁移至 about/projects。

## 备注

- 未做视觉验收（无浏览器通道）；跳转条、间距与 featured 卡观感待截图复核。
- 深页密度瘦身（blog 最新限 6–8、统计行文本化等）仍在 backlog。
