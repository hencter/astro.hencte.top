---
title: "Arch Linux 踩坑记录"
description: "作者的 Arch Linux 踩坑记录：基于官方 Wiki 给出安装路线，汇总 pacman GPGME 报错、双系统时间不同步、内核固件缺失警告等问题的解法，并整理 fcitx5、Clash、VirtualBox 等常用软件的安装配置。"
date: "2022-10-01T22:10:01+08:00"
draft: false
tags:
  - "ArchLinux"
  - "Linux"
  - "KISS"
categories:
  - "系统"
  - "极简主义"
keywords:
  - "中文"
  - "个人"
slug: "log/arch-linux"
section: "log"
legacyPath: "log/2022-10-01-Arch-Linux.md"
---

## 引言

Linux 拥有各种各样的发行版本，但是 Arch Linux 是我入坑 Linux 的一个比较重要的版本（同时后面也无法放下的一个版本）。

我非常喜欢 Arch Wiki 里面的一句话：

> - Arch Linux 将简洁定义为：**避免任何不必要的添加、修改和复杂增加**。
> - Keep It Simple, Stupid（对应中文为“保持简单，且一目了然”）。

我个人的安装是参考 ArchLinux 的 [官方 Wiki](https://wiki.archlinux.org/)
基本安装需要参考的文章顺序如下（这里只给出英文的链接，自行切换中文）：

1. [Installation guide](https://wiki.archlinux.org/title/Installation_guide)
2. [Arch boot process](https://wiki.archlinux.org/title/Arch_boot_process)

   - [GRUB](https://wiki.archlinux.org/title/GRUB)
3. [General recommendations](https://wiki.archlinux.org/title/General_recommendations)
4. [List of applications](https://wiki.archlinux.org/title/List_of_applications)

这里是我的踩坑记录，部分软件安装现在由下面两个项目替代解决，本文只记录碰到的问题和参考用到的文章或者教程什么的，关于安装部分我参考了：

- Arch Tutorial <https://github.com/ArchLinuxStudio/ArchLinuxTutorial>
- Arch Linux 简明指南 <https://github.com/NakanoMikuOrg/arch-guide>

其中「简明指南」派生自「ArchTurorial」，并且 简明指南 对虚拟机的模拟，是尽量模拟了物理机的，所以我个人更加倾向简明指南，当然，无论这两个指南写的再棒

## ~~双系统分区方案~~

> [!NOTE] 2025年11月07日
> 由于机械革命 Code 01 的老旧问题，目前不再采取双系统方案

双系统不是必须的，如果不喜欢双系统，可以参考下面的 [WSL Archlinux]

由于存在不同的硬盘接口，这里的分区使用 `pn` 替代

| 挂载点             | 分区   | 大小        | 挂载顺序 |
|:---------------:|:----:|:---------:|:----:|
| `/mnt`          | `p3` | 256 GiB   | 1    |
| `[SWAP]`        | `p2` | 「与内存大小一致」 | 2    |
| `/mnt/efi/boot` | `p1` | 512 MiB   | 3    |
| `/mnt/home`     | `p4` | 剩余空间      | 4    |

### 多系统解决

~~机启动出现 `错误 sparse file not allowed archlinux`~~

```shell
sudo vim /etc/default/grub
```

对 `/etc/default/grub` 进行取消注释

```ini
GRUB_DISABLE_OS_PROBER=false
```

## 问题记录

### 一、使用 `pacman` 更新时遇到「GPGME 错误：无数据」

   解决方案[^1]

   ```shell
   sudo rm /var/lib/pacman/sync/*.sig
   ```

### 二、双系统时间不同步问题

   原因：Windows 系统使用 UTC[^2]

   Windows 使用 UTC 后，请记得禁用 Windows 的时间同步功能，以防 Windows 错误设置硬件时间。如上文所说，Linux 可以使用[NTP 服务](<https://wiki.archlinux.org/title/NTP_(简体中文)>)来在线同步硬件时钟。

   使用 `regedit`,新建如下 DWORD 值，并将其值设为十六进制的 `1`。

   右键左下角的开始菜单

   ```powershell
   reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /d 1 /t REG_DWORD /f
   ```

   如果以上操作不起作用，并且你使用的是 Windows 64 位系统，将 `DWORD` 修改为 `QWORD`。

   如果 Windows 要求根据夏令时更新时钟，可以允许。时钟仍然是 UTC，仅是显示时间会改变。

### 三、模块缺失的警告[^3]

   解决 Arch Linux 构建内核模块时报模块缺失的警告

   当我们安装完 Arch Linux 时，你会发现构建内核模块「执行下述命令」时出现警告 `==> WARNING: Possibly...` 内容

   ```shell
   # 构建内核模块
   sudo mkinitcpio -P
   ```

   警告内容如下：

   ```text
   ==> WARNING: Possibly missing firmware for module: wd719x
   ==> WARNING: Possibly missing firmware for module: aic94xx
   ==> WARNING: Possibly missing firmware for module: xhci_pci
   ```

   新错误：

   ```text
   ==> WARNING: Possibly missing firmware for module: bfa
   ==> WARNING: Possibly missing firmware for module: qed
   ==> WARNING: Possibly missing firmware for module: qla1280
   ==> WARNING: Possibly missing firmware for module: qla2xxx
   
   ```

   Arch Linux CN 源 和 4edu 源

   ```ini
   # file: /etc/pacman.cfg
   [archlinuxcn]
   SigLevel = Optional TrustAll
   Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
   Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
   Server = https://repo.archlinuxcn.org/$arch

   [arch4edu]
   Server = https://mirrors.tuna.tsinghua.edu.cn/arch4edu/$arch
   ```

   **需执行：**

   ```shell
   # [cn源]
   sudo pacman -S archlinuxcn-keyring
   # [4edu源]
   sudo pacman-key --recv-keys 7931B6D628C8D3BA
   sudo pacman-key --finger 7931B6D628C8D3BA
   sudo pacman-key --lsign-key 7931B6D628C8D3BA
   ```

   **解决：**

   ```bash
   yay -S wd719x-firmware aic94xx-firmware upd72020x-fw
   yay -S mkinitcpio-firmware
   ```

### 四、关于键盘 `F1-F12` 被识别为多媒体键

这个问题的原因是我的 RK61 键盘 Fn 按下后出现的问题

```bash

echo 0 | sudo tee /sys/module/hid_apple/parameters/fnmode

# 写入配置文件以永久保持，否则重启需要重新执行
echo "options hid_apple fnmode=0" | sudo tee -a /etc/modprobe.d/hid_apple.conf

# 执行下面命令并重启
sudo mkinitcpio -P && sudo reboot now
```

[^1]: pacman更新时遇到「GPGME 错误：无数据」 - 竹林里有冰的博客 <https://zhul.in/2022/01/01/pacman-gpgme-error-no-data/>
[^2]: System time - ArchWiki <https://wiki.archlinux.org/title/System_time>

## 个人配置

关闭 fish 启动提示

```shell
set -U fish_greeting ""
```

## Arch Linux 软件安装及配置

### 中文输入法 fcitx5

> 输入法还是很重要的，毕竟有了输入法你才能描述你的问题给**搜索引擎**,`fcitx5-pinyin-zhwiki` 和 `fcitx5-pinyin-moegirl` 是词库

```shell
yay -S fcitx5-im  fcitx5-chinese-addons fcitx5-pinyin-zhwiki fcitx5-pinyin-moegirl

# 推荐两个皮肤
yay -S community/fcitx5-nord
yay -S ommunity/fcitx5-material-color
```

配置

```shell
# ~/.pam_environment
GTK_IM_MODULE DEFAULT=fcitx5
QT_IM_MODULE  DEFAULT=fcitx5
XMODIFIERS    DEFAULT=@im=fcitx5
INPUT_METHOD  DEFAULT=fcitx5
SDL_IM_MODULE DEFAULT=fcitx
```

### KDE 窗口装饰器

```shell
# 更新后不建议安装
sudo pacman -S archlinuxcn/sierrabreeze-kwin-decoration-git
```

### Code OSS

Code 是 Visual Studio Code 的替代品，即不带微软官方私有的纯开源编译版本

<https://wiki.archlinux.org/title/Visual_Studio_Code>

```shell
yay -S code

# 切换微软扩展源

yay -S code-marketplace
```

### 坚果云

说实话，坚果云的安装有点运气成分在里面

```shell
yay -S nutstore
```

### WPS Office

```shell
# 这里安装的是国内版本，国际版本请将 `aur/wps-office-cn` 替换成 `aur/wps-office`

yay -S aur/wps-office-cn aur/wps-office-mui-zh-cn aur/ttf-wps-fonts
```

### LibreOffice

```shell
sudo pacman -Ss libreoffice-fresh libreoffice-fresh-zh-cn
```

### Clash

```shell
# 安装
sudo pacman -S clash
```

#### 安装 `Country.mmdb`[^Country.mmdb]

[^Country.mmdb]: <https://github.com/alecthw/mmdb_china_ip_list/blob/master/README.md>)

<https://cdn.jsdelivr.net/gh/alecthw/mmdb_china_ip_list@release/Country.mmdb>

#### 配置文件位置

```yml
# file： ~/.config/clash/config.yml
external-controller: 127.0.0.1:9090
# secret: 'admin.123'
# 配置 Web UI  请安装 yacd，该包在 ArchLinuxCN 源中
external-ui: '/usr/share/yacd'
```

#### 配置 Systemd 服务

- 下方的 `hencter` 为当前用户名
- 使用 `echo $USER` 查看当前用户名

- `/etc/systemd/system/clash.service`

```ini
[Unit]
Description=Clash daemon, A rule-based proxy in Go.
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/bin/clash -d /home/hencter/.config/clash

[Install]
WantedBy=multi-user.target
```

```shell
sudo systemctl enable clash
sudo systemctl start clash
```

#### 浏览器访问 UI 控制界面

直接访问下方地址即可

<https://127.0.0.1:9090/ui>

### Virtualbox

```shell
yay -S  community/virtualbox-host-dkms community/virtualbox archlinuxcn/virtualbox-ext-oracle community/virtualbox-guest-iso core/net-tools

# 加载 Virtualbox 内核模块
sudo modprobe vboxdrv vboxnetadp vboxnetflt

# 使用下面命令检查 Virtualbox 模块加载
# 该命令需要在 Root 权限下运行
sudo vboxreload

# 将当前用户添加到 `vboxusers` 用户组中
sudo gpasswd -a $USER vboxusers
```

### Go

```shell
sudo pacman -S go
```

[Go 1.13 及以上（推荐）](https://goproxy.cn/#usage-go-113-and-above-recommended)

打开你的终端并执行

```shell
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

参考：<https://goproxy.cn/>
