# ops — hencte-top.png「赤字」印章修复（2026-09-03）

## 问题

用户反馈：`hencte-top.png` **还是赤字**。

## 根因

项目卡封面与首页 section 大气图共用的静物图中，朱印字形为 **「赤」**（AI 生成误写），而非品牌印 **「亦」**。  
「赤字」在此语境 = 印面上仍是「赤」字，不是财务 KPI，也不是要把朱印改成青瓷色（品牌朱印保留）。

相关路径：

- `public/img/projects/hencte-top.png`（项目/首页卡）
- `public/img/sections/home.webp`（同源 banner）
- 备份：`public/img/sections/home.webp.bak-chi-seal`（含错误「赤」印）

## 修复

1. 从 backup 底图出发，扩区抹除朱红印迹（含旁侧残印）。
2. 用系统宋体清晰绘制「亦」字朱文方印（带印泥噪点），贴回原印位。
3. 同步写出 `home.webp` + `hencte-top.png`（1536×1024）。
4. 校验裁切：`docs/qa/assets/hencte-top-seal-crop-20260903.png`、`banner-seal-yi-crop-20260903.png` — 字形为「亦」。

## 验证

- 视觉：全图与印章 crop 均为「亦」，不再是「赤」。
- 脚本：仓库内 `_fix_seal_yi.py`（历史尝试）+ 本轮重做合成。

## 状态

已修复；待随本轮 sprint 一并 commit / push。
