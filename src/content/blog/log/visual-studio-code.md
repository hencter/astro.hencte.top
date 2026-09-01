---
title: "Visual Studio Code"
description: "VS Code 问题记录：package.json 报错无法加载 schemastore 校验模式，成因是同源策略拦截 JSON Schema 下载，启用 json.schemaDownload.enable 配置即可解决。"
date: "2022-07-27T21:01:31+08:00"
draft: false
tags:
  - "Editor"
  - "Tool"
  - "Code"
categories:
  - "编辑器"
  - "工具"
  - "问题"
slug: "log/visual-studio-code"
section: "log"
legacyPath: "log/2022-07-27-visual-studio-code.md"
---

<!-- TODO -->

## 问题记录

### Problems loading reference 'https://json.schemastore.org/package'

- 问题描述

  CSS contributions to package.json
  Problems loading reference 'https://json.schemastore.org/package': Unable to load schema from 'https://json.schemastore.org/package': Downloading schemas is disabled through setting 'json.schemaDownload.enable'.(768)

- 原因

  vscode在加载tsconfig.json文件时会向<https://json.schemastore.org/tsconfig>发送请求，由于本机的同源策略安全设置，不允许跨域访问资源，所有会将该请求的响应数据拦截。

- 解决方案

在 `settings.json` 中启用该配置以获取 JSON schemas。

  ```json
  // When enabled, JSON schemas can be fetched from http and https locations.
  // 启用后，可以从 http 和 https 位置获取 JSON schemas。
  "json.schemaDownload.enable": true
  ```

## 插件列表
