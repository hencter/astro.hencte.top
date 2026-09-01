# 小说本地化 + 插图 — 2026-09-02

> 代理: content-editor (subagent)  
> 任务: 角色/术语本地化注册表、EN 翻译一致性修复、适量插图支持

## 摘要

为《天空税》与《我被AI反向驯化了》建立可维护术语表，修复 EN 章节中大量中英混杂残留，扩展 novel schema 与布局以支持系列封面和章节头图，并更新 llms.txt 书目元数据说明。

## Part 1 — 术语注册表

**位置**: `src/content/novel/_glossary/`

| 文件 | 用途 |
|------|------|
| `sky-tax.json` | 天空税：角色、机构、协议名、OpenCC 保留词 |
| `ai-counter-taming.json` | 反向驯化：系列名与未来 EN 翻译锚点 |

**命名约定**（来源: Nutstore `05-英文版/00-book-summary.md`, `01-creative-concept.md`）:

| 中文 | English | 说明 |
|------|---------|------|
| 天空税 | **Sky Tax** | 系列品牌名 |
| 陆远 | Lu Yuan | |
| 陆子衿 | Lu Zijing | 非 Zijing 以外的变体 |
| 米兰·沃伊诺维奇 | Milan Vojnović | |
| 塞拉斯·陈 | Silas Chen | |
| 法尔汉 | Farhan | |
| 阿米娜 | Amina | |
| 米娅 | Mia | |
| 伊莎贝尔 | Isabel Krause | |
| 沈姐 | Sister Shen | |
| 数据党 | Data Party | |
| 鸽子网络 | **Pigeonnet** | 非 Pigeon net |
| SkyWalker协议 | SkyWalker protocol | |
| 数据天堂 | **Data Haven** | EN 统一为 Haven（避难飞地），非 Heaven |
| 铜/银/金/铂金级 | Copper/Silver/Gold/Platinum tier | |

**TW/HK**: `src/lib/novel-glossary.ts` → 注入 `opencc.ts` 的 `PROTECTED_TERMS`，人名/品牌不被 OpenCC 误转。

## Part 2 — EN 翻译修复

**工具**: `scripts/fix-sky-tax-en-localization.py`（可重复运行）

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 含 CJK 的 EN 行数 | ~207 | ~62 |

**已处理**:
- `Data Heaven` → `Data Haven`（全书统一）
- 嵌套入口、远程会诊、指令、操控等 100+ 术语片段
- ch23 整段中文对白替换为英文

**仍待人工/下一波** (~62 行，主要在 ch16–ch25):
- 编码损坏的 em dash（`��`）
- 长句内嵌 2–4 字的漏译（如 ch24 医疗场景描写）
- 建议对照 Nutstore `05-英文版/chapters/` 源稿做 diff

**ai-counter-taming**: EN 仍为 comingSoon；术语表已就绪，描述与 glossary 对齐。

## Part 3 — 插图

**Schema** (`src/content.config.ts`): 新增可选字段 `cover`, `chapterImage`, `imageAlt`

**布局**:
- `NovelLandingPage.astro` — 系列 `cover`，lazy-load
- `NovelLayout.astro` — 章节 `chapterImage` 于标题下，max-height 220px

**资产** (`public/img/novel/`):

| 路径 | 用途 |
|------|------|
| `sky-tax-cover.svg` | 天空税系列封面 |
| `sky-tax-ch01.svg` | 第1章头图（医院等级线） |
| `ai-counter-taming-cover.svg` | 反向驯化系列封面 |

**Frontmatter 已更新**: `sky-tax.md`, `ai-counter-taming.md`（zh/en）, `sky-tax-ch01.md`（zh/en）

Nutstore 中有 ai-counter 分镜 PNG，未批量导入（避免性能/版权过载）；可按章逐步添加 `chapterImage`。

## Part 4 — GEO

`src/lib/novel-bibliography.ts` — llms.txt 小说节增加插图说明（仅书目，无正文）。

## 验证

- [x] `pnpm build` 通过（199 pages）
- [x] `/novel/sky-tax` — `series-cover` + `/img/novel/sky-tax-cover.svg` 已渲染
- [x] `/novel/sky-tax-ch01` — `nv-chapter-illustration` + ch01.svg 已渲染
- [x] TW/HK 路由在 build 中生成正常
- [x] Git push `a59a172` → `origin/main` 成功

## 后续建议

1. 人工审校 ch16–26 EN 剩余 CJK 行
2. 从 Nutstore 分镜挑选 3–5 张关键场景图替换 SVG 占位
3. ai-counter-taming EN 四章翻译（当前仅 stub）
4. 考虑在 CI 加 `fix-sky-tax-en-localization.py --check` 防止 CJK 回退

---

*关联: [[2026-09-02_i18n_tw_hk]], [[2026-09-02_section_pages]]*
