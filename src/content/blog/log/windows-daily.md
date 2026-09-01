---
title: "Windows 基本安装与维护"
description: "Windows 10 安装与维护笔记：涵盖 DiskGenius 分区、Dism++ 释放映像装机、初始化引导设置，以及 Windows Terminal 美化、脚本执行策略调整、KMS 激活与符号链接等问题处理。"
date: "2022-10-01T17:05:56+08:00"
draft: false
tags:
  - "Windows"
categories:
  - "系统"
  - "维护"
slug: "log/windows-daily"
section: "log"
legacyPath: "log/2022-10-01-windows-daily.md"
---

这里采用 Windows 10 操作系统作为内容。

## 分区

1. 使用 DiskGenius markdown front meta 将安装系统的磁盘进行清除扇区，以保证安装过程中不会出错
2. 清除分区后请将磁盘格式转换成 GUID 格式
3. 新建分区：勾选[建立 ESP 分区]，其余默认
4. 主磁盘分区设置 $256*1024+8=262152MiB$ (结尾务必为 8),卷标自行设置
5. 剩余空间自行分配(这里我按照我的个人习惯来了)
   这里我为存放数据分配了 512008MB 空间
6. 由于硬盘还算大，所以我将剩余的空间留给了双系统的 ArchLinux
   大约还剩 253.6GB，Linux 的话是完全足够了的

## Dism++ 安装系统

1. 打开 Dism++ 按下 `Ctrl` + `N` 释放映像 选择镜像和释放位置，勾选[格式化]和[添加引导]
2. 选择 ESP 分区，也就是刚才创建的 300MB 的那个分区
3. 等待……
4. 打开会话，关闭系统启动项的 SecurityHealth [也就是微软自带的杀毒软件]
5. 系统简单做一些小优化，具体查看控制面板下的系统优化内部条目
6. 配置完成后重新启动

## Windows 10 初始化引导配置

1. 选择区域 `下一步`
2. 选择输入法/键盘布局 `下一步`
3. 网络

   1. `我没有 Internet 连接`
   2. `继续执行有限的设置`

4. 接受 “Windows 10 许可协议”`接受`
5. 输入“用户名”建议英文「中文在安装某些软件可能会受到影响」`下一步`
6. 密码

   **这里建议先跳过直接点击下一步**，  
   此时创建密码需要设置三个密保问题！！！  
   会浪费很多时间！！！可选项  
   `下一步`

7. 服务，全部先关闭，这里的服务暂时没什么用处
8. 等待...
9. 进入系统后将右下角的 OneDrive 关闭，并在控制面版里面卸载
10. 此时联网进入设置更新系统，重命名主机名并且重启一次

## Windows Terminal

微软应用商店中下载 Windows Terminal

> 参考：[Windows Terminal 美化](https://zhuanlan.zhihu.com/p/352882990)

### 安装 oh-my-posh 和 posh-git

```powershell
# 管理员运行 powershell
Install-Module posh-git
Install-Module oh-my-posh
Install-Module DirColors
```

```powershell
> code $PROFILE
==============================
Import-Module posh-git
Import-Module oh-my-posh
Import-Module DirColors
Set-PoshPrompt -Theme Material
==============================
```

## 「问题」PowerShell因为在此系统上禁止运行脚本，解决方法

```powershell
set-executionpolicy remotesigned
```

### 注意 Windows + Linux 双系统状态，在切换系统时请务必重启，不然 Windows 会独占无线网卡让 Linux 没法检测到

### LTSC 2019 激活

> 2021.10.16  
> 设置 KMS 密钥，密钥来自[微软](https://docs.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys#windows-10-ltsc-2019 "ＫＭＳ激活说明")

```powershell
slmgr.vbs /ipk 密钥
# (KMS 服务器地址)
slmgr.vbs /skms kms.loli.beer
slmgr.vbs /ato
```

## 「问题」Windows 软链接链接

[Windows 下创建符号链接](https://blog.csdn.net/yin0hao/article/details/88052343)

### **目录（Directory）**

MKLINK 创建符号链接。

```cmd
MKLINK [[/D] | [/H] | [/J]] Link Target 
```

删除

```cmd
RD <TARGET PATH>
```

### 问题记录

> 这几天用的 Windows 10 系统遇到一个莫名奇妙的问题，就是在快速访问里总是固定了下载文件夹，而且无法取消固定，其它文件夹都正常就是它不能取消固定，始终顽固的显示在快速访问里。即使我在“查看|选项|隐私"里取消对”在‘快速访问’中显示最近使用的文件”和“在‘快速访问’中显示常用文件夹”的勾选，再清除文件资源管理器历史记录最不行。

---

> 最后在询问了度娘 N 多关键词后终于在一个解决其它快速访问功能异常的问答中找到了解决我这个问题的答案。

在文件资源管理器地址栏输入：

```cmd
%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations
```

打开的文件夹里找到文件：`f01b4d95cf55d32a.automaticDestinations-msv`

**删除它**，**或者安全起见你可以剪切它到其它地方**，问题就这么简单的解决了：）
