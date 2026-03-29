---
title: "内容类型"
date: "2023-04-13T14:05:22+08:00"
draft: true
tags:
  - "Hugo"
  - "Content"
categories:
  - "内容管理"
slug: "tech/hugo/content-types"
section: "tech"
legacyPath: "tech/hugo/content-types.md"
---

## 什么是内容类型？

官方给出的回答：

> Hugo is built around content organized in sections.

简单翻译一下：Hugo 是围绕 sections 构建组织内容的。

内容类型是一种组织内容的方式。

Hugo 从 front matter 的 `type` 字段中解析内容类型。

如果没有设置那么，类型就是第一个目录的目录名。

例如： 如果没有设置类型，content/blog/my-first-event.md 将是 blog 类型。

## 手动在 front matter 中设置类型

```md
+++
title = " "
type = "blog"
+++
```

那么在模版中如果有 `layout/blog/目录`
