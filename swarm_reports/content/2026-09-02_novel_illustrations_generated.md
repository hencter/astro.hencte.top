# 小说 AI 插图生成 — 2026-09-02

> 代理: content-editor (subagent)  
> 任务: 蜂群生图 + 配文（Sky Tax 系列封面/章节图 + AI Counter Taming 封面升级）

## 摘要

使用 Cursor `GenerateImage` 为《天空税》生成 1 张系列封面 + 4 张章节头图，为《我被AI反向驯化了》升级系列封面；更新 zh-CN / en-US frontmatter 的 `cover`、`chapterImage`、`imageAlt`；`pnpm build` 通过。

## 生成清单

| 路径 | 章节/用途 | Prompt 摘要 | imageAlt (zh-CN) |
|------|-----------|-------------|------------------|
| `/img/novel/sky-tax-cover.png` | 系列封面 | 星链卫星穹顶笼罩地球，信鸽掠过暮光天际；青橙电影感 | 《天空税》封面：星链卫星穹顶笼罩地球，一只信鸽掠过暮光天际 |
| `/img/novel/sky-tax-ch01.png` | ch01 铜级人生 | 2057 深圳医院候诊区，铜/银/金/铂金地灯线，陆远持平板 | 2057年深圳医院候诊区：铜、银、金、铂金四级地灯线分隔候诊通道，陆远手持平板守候 |
| `/img/novel/sky-tax-ch12.png` | ch12 重逢与别离 (Lagos) | 拉各斯废弃仓库 Pigeonnet 节点，热带潮湿工作间 | 拉各斯港口区废弃仓库内的鸽子网络节点：阿米娜与陆远在热带潮湿的工作间调试加密固件 |
| `/img/novel/sky-tax-ch22.png` | ch22 开门 (Data Haven) | 米兰旧金山办公室，嵌套入口连接 Data Haven，蓝光拓扑 | 米兰在旧金山办公室通过嵌套入口连接数据天堂：终端蓝光与轨道卫星拓扑图同时亮起 |
| `/img/novel/sky-tax-ch23.png` | ch23 卫星间的战争 | 轨道视角卫星网影子路由扩散，Data Haven 自治域 | 数据天堂自治域在星链路由表中扩散：数百颗卫星间的影子路由与激光链路交织成网 |
| `/img/novel/ai-counter-taming-cover.png` | 系列封面 | 成人剪影与神经网络对称映照，驯化关系暧昧 | 《我被AI反向驯化了》封面：成人剪影与发光神经网络彼此映照，驯化关系暧昧不明 |

## Frontmatter 更新

| 文件 | 字段 |
|------|------|
| `zh-CN/sky-tax/index.md`, `en/sky-tax/index.md` | `cover` → `.png`, `imageAlt` 更新 |
| `zh-CN/en sky-tax/ch01.md` | `chapterImage` → `.png` |
| `zh-CN/en sky-tax/ch12.md` | 新增 `chapterImage`, `imageAlt` |
| `zh-CN/en sky-tax/ch22.md` | 新增 `chapterImage`, `imageAlt` |
| `zh-CN/en sky-tax/ch23.md` | 新增 `chapterImage`, `imageAlt` |
| `zh-CN/en ai-counter-taming/index.md` | `cover` → `.png`, `imageAlt` 更新 |

布局 `NovelLandingPage.astro` / `NovelLayout.astro` 已支持上述字段，无需代码改动。

## 术语对齐

插图 alt 文案遵循 `src/content/novel/_glossary/sky-tax.json`：

- Lu Yuan / 陆远、Amina / 阿米娜、Milan Vojnović / 米兰
- Pigeonnet / 鸽子网络、Data Haven / 数据天堂、Starlink / 星链

## 验证

- [x] `pnpm build` — 203 pages, exit 0
- [x] 图片位于 `public/img/novel/*.png`
- [ ] 旧 SVG 占位保留（`sky-tax-cover.svg` 等），可后续清理

## 仍待插图（建议下一波）

| 优先级 | 章节 | 场景 |
|--------|------|------|
| P1 | ch06 数据党 | 数据党安全屋 / Farhan |
| P1 | ch10 鸽子的航线 | 信鸽跨洲航线 |
| P2 | ch24 铂金级的代价 | 术后恢复室 |
| P2 | ai-counter-taming ch01–04 | 各章头图（目前仅系列封面） |

## 策略说明

- 小说页保持 `noindex, noai, noimageai` — 插图仅供读者浏览，不进入训练索引意图
- 风格：cinematic literary sci-fi，成熟写实，非卡通
