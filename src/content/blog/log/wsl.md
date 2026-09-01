---
title: "WSL 问题记录"
description: "WSL 使用笔记：通过微软商店或 wsl --list --online 安装 Debian 系发行版，并用 netsh interface portproxy 将主机端口转发到 WSL 地址，配合 Clash 等代理使用。"
date: "2022-10-01T17:01:53+08:00"
draft: false
tags:
  - "WSL"
  - "Windows"
  - "System"
  - "Linux"
  - "Develop"
categories:
  - "子系统"
  - "微软"
  - "视窗"
  - "操作系统"
  - "开发"
slug: "log/wsl"
section: "log"
legacyPath: "log/2022-10-01-wsl.md"
---

## Debian系列等安装

**Nothing:** Just in the Microsoft Store Installed

没什么好说的,凡是微软应用商店有的直接下载安装即可

```shell
wsl --list --online
```

## 端口转发配置

```shell
# Clash
# 172.17.40.17 为 WSL 的地址，可以使用 `ifconfig` 查看 eth0 网卡地址
netsh interface portproxy add v4tov4 listenport=7891 listenaddress=0.0.0.0 connectport=7891 connectaddress=172.17.40.17

netsh interface portproxy add v4tov4 listenport=7890 listenaddress=0.0.0.0 connectport=7890 connectaddress=172.17.40.17

netsh interface portproxy add v4tov4 listenport=9090 listenaddress=0.0.0.0 connectport=9090 connectaddress=172.17.40.17
```

```shell
# 展示所有端口转发
netsh interface portproxy show all

# 清除所有端口转发
netsh interface portproxy reset
```
