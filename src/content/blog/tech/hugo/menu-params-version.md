---
title: "Menu Params version"
date: "2023-04-14T02:35:39+08:00"
draft: true
slug: "tech/hugo/menu-params-version"
section: "tech"
legacyPath: "tech/hugo/menu-params-version.md"
---

无论您如何定义菜单条目，与页面关联的条目都可以访问页面变量和方法。

这个简单的示例在每个条目的名称旁边呈现一个名为 version 的页面参数。
代码防御性地使用 with 或 if 来处理条目，其中 (a) 条目指向外部资源，或 (b) 未定义版本参数。

##

`layouts/_default/single.html`

```html
{{- range site.Menus.main }}
  <a href="{{ .URL }}">
    {{ .Name }}
    {{- with .Page }}
      {{- with .Params.version -}}
        ({{ . }})
      {{- end }}
    {{- end }}
  </a>
{{- end }}
```
