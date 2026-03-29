---
title: "代理配置"
date: "2022-10-05T12:25:57+08:00"
draft: false
tags:
  - "Proxy"
categories:
  - "代理"
slug: "log/proxy"
section: "log"
legacyPath: "log/2022-10-05-proxy.md"
---

本文会记录一些常用代理的设置

## Git

### 设置代理

```shell
git config --global http.proxy 'http://127.0.0.1:7890'
git config --global https.proxy 'https://127.0.0.1:7890'
git config --global http.proxy 'socks5://127.0.0.1:7890'
git config --global https.proxy 'socks5://127.0.0.1:7890'
```

### 清空代理

```shell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## curl

### 传参代理

每次访问时都需要写代理参数

```bash
curl -x socks5://127.0.0.1:7981 http://www.google.com # -x 参数等同于 --proxy
```

### 设置配置文件

每次使用`curl`的时候都会使用代理

```bash
# 修改curl配置文件
vim ~/.curlrc
# 写入
socks5 = "127.0.0.1:7981"

# 如果临时不需要代理使用以下参数
curl --noproxy "*" http://www.google.com
```

### 设置linux全局代理配置

不仅仅适用于`curl`，大部分的linux命令行工具都会读取这个配置通过代理访问网络。

```text
# 修改shell配置文件 ~/.bashrc ~/.zshrc等
export http_proxy=socks5://127.0.0.1:7981
export https_proxy=$http_proxy

# 设置setproxy和unsetproxy 可以快捷的开关
# 需要时先输入命令 setproxy
# 不需要时输入命令 unsetproxy
alias setproxy="export http_proxy=socks5://127.0.0.1:7981; export https_proxy=$http_proxy; echo 'HTTP Proxy on';"
alias unsetproxy="unset http_proxy; unset https_proxy; echo 'HTTP Proxy off';"
```

### 排查问题

### `curl -v` 参数会输出请求中访问的路由信息，方便确定是否设置成功，请求有没有代理

### `netstat -nat | grep 7981` 查看与代理端口相链接的端口

### `lsof -i :7981` 查看端口相关的进程

## WSL

WSL 可以直接访问主机代理

## SSH

SSH 的代理配置这里是为了 Github 的 ssh 访问

配置方式如下

这里需要说明一下，下面配置中执行了 nc 命令，所以这里我们需要安装 BSD 版本的 netcat 工具，GNU 的没法使用代理[^Github git SSH 代理设置]。

### SSH 代理

这里用的环境是 Arch Linux

```shell
# 有时候你需要自己 sudo pacman -Ss netcat , 看清楚是 BSD 版本的就行
sudo pacman -S community/openbsd-netcat
```

配置

```config
# ~/.ssh/config
Host github.com *.github.com
   User git
   IdentityFile ~/.ssh/<私钥>
   ProxyCommand nc -X 5 -x <PROXY_ADDRESS>:<PORT> %h %p
```

[^Github git SSH 代理设置]: https://nswebfrog.com/posts/2021/01/31-github-ssh-proxy/
