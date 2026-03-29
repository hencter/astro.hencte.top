---
title: "Front Matter"
date: "2023-04-12T23:41:51+08:00"
draft: true
tags:
  - "Front Matter"
  - "Markdown"
categories:
  - "内容前置"
slug: "tech/hugo/front-matter"
section: "tech"
legacyPath: "tech/hugo/front-matter.md"
---

Hugo 允许您将 yaml、toml 或 json 中的 front matter 添加到您的内容文件中。

## 支持的 Front Matter 格式如下

### **TOML**

通过 `+++` 开启和关闭标识。

### **YML**

通过 `---` 开启和关闭标识。

### **JSON**

由 `{` 和 `}` 包围的单个 JSON 对象，后跟一个新行。

## 例子参考如下地址

<https://gohugo.io/content-management/front-matter/#example>

## 默认的 Front Matter 变量参考如下地址

<https://gohugo.io/content-management/front-matter/#front-matter-variables>

## 用户定义

你可以在你的 front matter 中**任意添加字段**来满足你的需要。这些用户定义的键值被放置在一个单独的 `.Params` 变量中，以供在您的模板中使用。

> [!note]
> 这里目前已全部调整为 YMAL 格式

[front-matter](<ref front-matter.md>)
