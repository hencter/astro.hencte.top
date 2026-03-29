---
title: "Tomcat8 问题记录"
date: "2023-03-11T23:16:01+08:00"
draft: false
tags:
  - "Tomcat"
  - "Server"
categories:
  - "服务器"
  - "开发"
  - "问题记录"
slug: "log/tomcat8"
section: "log"
legacyPath: "log/2023-03-11-tomcat8.md"
---

本文是迁移以前没写进来的内容所以日期只记录我迁移的日期了

由于很多情况我们需要直接用 Idea 直接进行开发，我才用的是下载 zip 包的方式直接安装，自行配置位置即可，简单方便，占用还少，并且还免安装

## Linux 下权限问题

> Tips: IDEA Error copying configuration files &Address localhost:8080 is already in use

解决方法：

进入tomcat目录下的conf文件夹。

对文件夹下所有文件赋予最大权限。

(命令如下，目录文件根据实际修改）

```shell
#进入指定目录
cd /usr/share/tomcat/conf

#赋予权限
sudo chmod 777 *
```

[参考链接](https://blog.csdn.net/weixin_38500325/article/details/82728577)
