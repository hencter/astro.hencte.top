---
title: "Shortcode"
date: "2023-04-13T00:09:30+08:00"
draft: true
tags:
  - "Shortcode"
categories:
  - "简码"
  - "演示"
slug: "tech/hugo/shortcode"
section: "tech"
legacyPath: "tech/hugo/shortcode.md"
---

## 说明

Shortcode 用于再 Makrdown 中扩展一些 Makdown 本身不支持的特性。

## 使用 Hugo 的内置简码

### `<figure>` 可附标题内容元素

![了解更多：](/img/avatar.jpg)

*了解更多：*

[亦幸](/about)

### Gitub Gist

~~``{{< gist hencter 74114b0f07510d24b70b1a7f2def0596 >}}``~~

---

~~``{{< gist hencter 74114b0f07510d24b70b1a7f2def0596   darkmode.js >}}``~~

~~``{{< gist hencter 74114b0f07510d24b70b1a7f2def0596  hugo-markdown.scss  >}}``~~

### vimeo

[Vimeo](https://vimeo.com/55073825)

### youtube

[YouTube](https://www.youtube.com/watch?v=w7Ft2ymGmfc)

### 代码高亮

强调部分代码，

```go
package main

import "fmt"

func main() {
fmt.Println("Hello, 世界")
}
```

## 创建自己的简码

参阅：<https://gohugo.io/templates/shortcode-templates/>

2026

2026-03-29T21:54:33
