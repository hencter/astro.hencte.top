---
title: "Docker"
description: "Docker 使用备忘：记录用 docker run 一条命令启动 MySQL 5.7 容器的写法，映射 3306 端口并通过 MYSQL_ROOT_PASSWORD 环境变量设置 root 密码。"
date: "2022-10-05T12:19:04+08:00"
draft: false
tags:
  - "Docker"
categories:
  - "容器"
slug: "log/docker"
section: "log"
legacyPath: "log/2022-10-05-docker.md"
---

## Mysql

```shell
# MySql 5.7
docker run --name mysql57 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7 
```
<!--stackedit_data:
eyJwcm9wZXJ0aWVzIjoidGl0bGU6IERvY2tlclxuIiwiaGlzdG
9yeSI6Wy0xODkxODA3MDA2LC0zOTQ1MzcxMjBdfQ==
-->
