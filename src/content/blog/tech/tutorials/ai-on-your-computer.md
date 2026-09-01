---
title: "写给小白：怎么在你的电脑上用上 AI"
description: "从零开始在电脑上用上 AI 工具——不是网页版 ChatGPT，而是能在你电脑上直接帮你写文件、整理资料、搜索信息的 AI。分免翻墙版和完整版两条路线。"
date: "2026-07-09"
publishDate: "2026-07-09"
tags: ["AI", "OpenCode", "Claude Code", "DeepSeek", "Cursor", "教程", "小白"]
categories: ["教程"]
section: "tech"
toc: true
---

> [!info] 这篇文章是什么
> 教你从零开始在电脑上用上 AI 工具——不是网页版 ChatGPT，而是能**在你电脑上直接帮你写文件、整理资料、搜索信息**的 AI。
>
> **分两个版本**：
> - **免翻墙版**：用 OpenCode + DeepSeek（国内服务，不需要科学上网）
> - **完整版**：翻墙后用 Claude Code + DeepSeek（功能更强，需要科学上网）
>
> 先从免翻墙版开始，觉得好用再升级到完整版。

---

## 一、网页版 AI vs 电脑版 AI

### 1.1 你可能已经在用的——网页版 AI

你在浏览器里打开 ChatGPT、DeepSeek、通义千问的网页版，打字聊天，AI 回答——这是**网页版 AI**。

它的局限：
- **只能聊天**，不能帮你操作电脑上的文件
- 你让它写一篇文章，它只会把文字发在聊天框里，你得自己复制粘贴保存
- 不能读你电脑上的文件，不能上网帮你搜索
- 每开一个新对话，之前聊的全忘

### 1.2 这篇要教的——电脑版 AI（Coding Agent）

有一类工具叫 **Coding Agent**（编程智能体），虽然名字里有"编程"，但**不是只有程序员才能用**。它能：

- ✅ 直接在你电脑上创建文件、写文章、保存
- ✅ 读取你电脑上的文件内容并分析
- ✅ 上网搜索信息并整理成文档
- ✅ 批量处理文件（比如把 100 个文件按规则重命名）
- ✅ 记住你给它的指令（Skill），下次自动执行

**和网页版最大的区别**：你不是在"和 AI 聊天"，而是在"让 AI 帮你干活"。你告诉它**做什么、存到哪**，它直接执行。

| | 网页版 AI | 电脑版 AI（Coding Agent） |
|---|---------|------------------------|
| 输出方式 | 聊天框里回复 | 直接帮你创建/修改文件 |
| 能读你的文件吗 | 不能 | 能 |
| 能上网搜索吗 | 部分 | 能 |
| 能记住指令吗 | 不能（新对话就忘） | 能（通过 Skill） |
| 需要装软件吗 | 不用（浏览器打开） | 需要 |
| 需要翻墙吗 | 看用哪家 | 看用哪条路线（见下文） |

### 1.3 两条路线

| | 免翻墙版 | 完整版 |
|---|---------|--------|
| 工具 | OpenCode（桌面版） | OpenCode + Claude Code（命令行） |
| AI 模型 | OpenCode 免费模型 + DeepSeek API | DeepSeek API（驱动 Claude Code） |
| 需要翻墙吗 | **不需要** | **需要**（Claude Code 要访问境外服务器） |
| 费用 | 免费模型 0 元 / DeepSeek 充 10 元 | DeepSeek 充 10 元 |
| 难度 | ⭐ 最简单 | ⭐⭐⭐ 需要配环境变量 |
| 能干什么 | 写文章、整理资料、搜索、批量处理 | 以上全部 + 更多高级功能 |

> [!tip] 推荐顺序
> 1. 先走**免翻墙版**：装 OpenCode + Git，用免费模型体验
> 2. 觉得好用后，充 10 元 DeepSeek，在 OpenCode 里接 DeepSeek API
> 3. 想要更强功能，再走**完整版**：翻墙 + 装 Claude Code + 配环境变量

---

## 二、完全合规版：OpenCode + DeepSeek

### 2.0 这条路线不需要魔法

OpenCode 桌面版可以从国内下载，DeepSeek 是国内公司的 AI 服务，API 服务器在国内，**全程不需要魔法**。

如果你将来想升级到完整版（Claude Code），那时才需要科学上网——先看 [这篇科普](/tech/tutorials/proxy-tun-mode-explained)。

### 2.1 装 Git（必须）

Git 是版本管理工具，AI 工具靠它追踪文件的改动。不装的话部分功能用不了。

**操作**：
1. 打开 https://git-scm.com
2. 点 **Download for Windows**
3. 选 **64-bit Git for Windows Setup**
4. 安装：一路 Next（默认设置就是最优的，不用改任何选项）

### 2.2 装 OpenCode

1. 打开 https://opencode.ai/zh/download
2. 选你的系统版本（Windows / macOS）
3. 下载安装：一路 Next

> [!note] 版本要求
> DeepSeek 官方文档建议 OpenCode 版本 >= v1.14.24。如果已装旧版，在终端执行 `opencode upgrade` 升级。

### 2.3 创建项目

1. 启动 OpenCode
2. 建议在 D 盘建一个项目目录，比如 `D:\Projects\first-prj`
3. 在 OpenCode 里打开这个文件夹

> [!tip] 为什么要建项目目录
> AI 工具是在「项目」里干活的。你让它写文章、整理资料，它会在当前项目文件夹里创建文件。别在 C 盘用户目录下干，文件多了会乱。

### 2.4 用免费模型（零成本入门）

OpenCode 自带免费模型，**不用任何配置、不用充钱、不用注册任何账号**，装完就能用。

界面里选免费模型，直接开始对话。

**试一下**：输入「你好，帮我看看今天的新闻」，它会自动上网搜索并总结。

> [!tip] 免费模型怎么玩
> 免费模型每天有额度限制，但足够你学习和体验。建议：
> - 每天用免费模型练习对话、写文章、整理资料
> - 试着让它「在当前项目下用 md 格式保存一篇文章」
> - 体验不同免费模型的效果差异
> - 额度用完了明天再来，每天刷新

### 2.5 让 AI 做事，而不只是聊天

> [!warning] 关键区别
> 在网页版你跟 AI 聊天，它只回复文字。
> 在 Coding Agent 里你要告诉它**做什么操作**、**存到哪**。

❌ 错误用法（只会回复文字）：
```
帮我写一篇文章
```

✅ 正确用法（会创建文件）：
```
请在当前项目下，用 md 文档格式，写一篇关于 XX 的文章并保存
```

| 你想要 | 错误说法 | 正确说法 |
|--------|---------|---------|
| 写文章 | 「帮我写一篇文章」 | 「在当前项目下用 md 格式写一篇关于 XX 的文章并保存」 |
| 整理资料 | 「帮我整理这些信息」 | 「读取当前目录的 xx.txt，提取关键信息，整理成 md 表格保存」 |
| 搜索 | 「今天有什么新闻」 | 「搜索今天的 AI 新闻，整理成 md 文件保存到当前项目」 |

**记住**：告诉它**做什么 + 存到哪 + 什么格式**，它才会帮你执行操作。

### 2.6 接入 DeepSeek API（可选，进阶）

免费模型有额度限制。想用更强的模型（DeepSeek-V4-Pro），可以接 DeepSeek 的 API。**不需要翻墙**，DeepSeek 是国内服务。

#### 关于实名认证（重要，先看）

> [!warning] DeepSeek 平台注册须知
> DeepSeek 是国内公司（深度求索），注册平台账号需要**手机号**——这是国内服务的常规要求。
>
> **你需要知道的事实**（本教程作者实测）：
> - 注册 platform.deepseek.com 需要手机号（接收验证码）
> - 手机号背后对应你的实名信息（运营商实名制，这是运营商层面的事，不是 DeepSeek 额外要求的）
> - 充值需要绑定支付方式（微信/支付宝，也是实名的）
> - **你的 API 使用记录会和你的账号关联**
> - DeepSeek **不会封号**（和 Claude 官方账号不同），正常使用不用担心
>
> **为什么不推荐直接用 Claude 官方账号**：
> - Claude 官方账号检测到中国 IP 会**封号**，充了钱可能打水漂
> - DeepSeek 是国内服务，不存在这个问题
> - DeepSeek API 的费用远低于 Claude 官方
>
> **结论**：DeepSeek 比 Claude 官方账号安全（不会封号），但你的使用记录和手机号关联。正常用于学习、工作、写文章不用担心。如果你对隐私非常敏感，可以考虑用一张副卡注册。

#### 操作步骤

1. 打开 https://platform.deepseek.com，用手机号注册登录
2. 左侧菜单 → **API Keys** → **创建 API Key**
3. 名称填 `opencode`，创建后**立即复制保存到记事本**（只显示一次！）
4. 充值：**先少充一点试试**（建议 5-10 元起步），别一次性充太多。用完再充，心里有数

#### 在 OpenCode 里接入

1. 在 OpenCode 对话框里输入 `/connect`
2. 输入 `deepseek` 并选择
3. 填入你的 DeepSeek API Key
4. 选择 DeepSeek-V4-Pro 模型

> [!tip] DeepSeek 模型说明
> - `deepseek-v4-pro`：主力模型，能力强，适合复杂任务
> - `deepseek-v4-flash`：快速模型，速度快、便宜，适合简单任务
> - `deepseek-chat` 和 `deepseek-reasoner` 将于 2026/07/24 弃用，用上面两个代替

#### 费用参考

DeepSeek API 按使用量收费（Token 计费），日常写文章、整理资料的话，10 元能用很久。具体价格见 [DeepSeek 官方定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)。

---

## 三、完整版：Claude Code + DeepSeek（需要翻墙）

### 3.0 什么时候升级到完整版

- 免翻墙版玩明白了，想要更强功能
- 想用命令行工具（更快、资源占用更小）
- 需要 Claude Code 的高级功能（Web Search、更多 Skill 兼容）

### 3.1 前置条件

1. **科学上网**：Claude Code 要访问境外服务器。如果没搞定，先看 [这篇科普](/tech/tutorials/proxy-tun-mode-explained)
2. **Git**：已装（免翻墙版装过了）
3. **Node.js**（可选）：打开 https://nodejs.org，选 LTS 版本下载，一路 Next 安装

> [!warning] 关键：必须开 Tun 模式
> Claude Code 在命令行里运行，**命令行不走系统代理**。必须开 Tun 模式（虚拟网卡）强制所有流量走代理。
> 详见 [科学上网科普文第四节](/tech/tutorials/proxy-tun-mode-explained#四系统代理-vs-tun-模式教程里最让人懵的两个词)。

### 3.2 环境变量是什么——小白最懵的概念

Claude Code 的配置会反复提到「环境变量」，先搞懂它。

**环境变量**就是 Windows 系统里存的一些「全局设置」。软件安装后会把自己的路径写进环境变量，这样你在任何地方输入命令名就能启动它。

**打个比方**：
- 环境变量 = Windows 的「通讯录」
- 你输入 `claude` → Windows 翻通讯录 → 找到 claude 在哪 → 启动它
- 如果通讯录里没有 claude 的记录 → Windows 说「找不到命令」

**怎么打开环境变量设置**：
1. 按 `Win + S`，输入「环境变量」
2. 点「编辑系统环境变量」
3. 弹出窗口右下角点「环境变量」
4. 上面是**用户变量**（只对你生效），下面是**系统变量**（对所有人生效）
5. 大部分情况配**用户变量**就够了

> [!warning] 加完环境变量要重开终端
> 环境变量改了之后，**已经打开的终端不会立刻生效**。关掉终端窗口重新打开，新设置才会读到。

### 3.3 装 Claude Code

**方式一：原生安装（推荐）**

1. 右键左下角开始菜单 → 选「终端管理员」
2. 复制粘贴这行命令，回车：

```powershell
irm https://claude.ai/install.ps1 | iex
```

> [!tip] 终端粘贴技巧
> PowerShell 里直接 `Ctrl+V` 可能无效。**右键**直接粘贴，或按 `Ctrl+Shift+V`。

3. 装完关闭终端，重新打开

**方式二：npm 安装（方式一失败时用）**

```powershell
# 先设置执行策略（只需一次）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 安装
npm install -g @anthropic-ai/claude-code
```

### 3.4 添加 Path 环境变量

装完后如果输入 `claude` 没反应，说明环境变量没加。

1. 按 `Win+S` 搜「环境变量」→ 打开
2. 在**用户变量**里找 `Path`，双击
3. 新建一条：`%USERPROFILE%\.local\bin`
4. 在**系统变量**的 `Path` 里也加一条同样的
5. 确定，**关掉终端重新打开**
6. 输入 `claude` 回车 → 看到启动界面就成功了

### 3.5 接入 DeepSeek（核心步骤）

Claude Code 默认要用 Anthropic 官方账号（贵且有封号风险）。通过环境变量接入 DeepSeek，**不用买 Claude 会员，10 元能用很久**。

> [!warning] 为什么不直接用 Claude 官方账号
> Claude 官方账号检测到中国 IP 会**封号**，充了钱可能打水漂。接 DeepSeek 的 API 是"瞒天过海"——让 Claude Code 以为在跟 Anthropic 服务器通信，实际全走 DeepSeek 的国内服务器。不用翻墙访问 DeepSeek，但 Claude Code 本身需要翻墙才能装。

#### 第 1 步：获取 DeepSeek API Key

如果你在免翻墙版已经注册过 DeepSeek 并拿到 Key，直接用那个，不用重新注册。

1. 打开 https://platform.deepseek.com
2. 左侧 → **API Keys** → **创建 API Key**
3. 名称填 `claude-code`
4. 复制生成的 Key **立即保存到记事本**（只显示一次！）
5. 充值（10 元起步）

#### 第 2 步：配置环境变量

打开**终端管理员**，把下面命令里的 `<你的 DeepSeek API Key>` 替换成你的 Key，逐条执行：

```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://api.deepseek.com/anthropic", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "你的 DeepSeek API Key", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-v4-pro[1m]", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_OPUS_MODEL", "deepseek-v4-pro[1m]", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_SONNET_MODEL", "deepseek-v4-pro[1m]", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_HAIKU_MODEL", "deepseek-v4-flash", "User")
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_SUBAGENT_MODEL", "deepseek-v4-flash", "User")
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_EFFORT_LEVEL", "max", "User")
```

> [!note] 这些变量做了什么
> - `ANTHROPIC_BASE_URL`：把请求地址从 Anthropic 官方改成 DeepSeek
> - `ANTHROPIC_AUTH_TOKEN`：用 DeepSeek 的 API Key 代替 Anthropic 的
> - `ANTHROPIC_MODEL` 等：指定用 DeepSeek 的哪个模型
> - 本质就是"瞒天过海"——Claude Code 以为自己还在和 Anthropic 通信

> [!tip] 也可以用图形界面配
> 按 3.2 节的方法打开环境变量窗口，在用户变量里手动「新建」每一条。变量名和变量值对照上面的命令。

#### 第 3 步：验证

1. **关掉所有终端窗口，重新打开**（环境变量要重开才生效）
2. 进入你的项目目录（比如 `cd D:\Projects\first-prj`）
3. 输入 `claude` 回车
4. 不再弹出登录提示，直接进入对话界面 = 配置成功

---

## 四、通用：基础使用

### 4.1 让 AI 做事的核心原则

无论 OpenCode 还是 Claude Code，核心都是：**告诉它做什么 + 存到哪 + 什么格式**。

```
请在当前项目下，用 md 文档格式，写一篇关于 XX 的文章并保存
```

### 4.2 查看生成的文件

- OpenCode：右侧 Files 面板
- 文件管理器：右键项目文件夹 → 在文件管理器中打开
- Obsidian（推荐）：专门看 Markdown 文件的工具，见下文

### 4.3 斜杠命令

在对话框里输入 `/`，会弹出可用命令列表。装了 Skill 后也会出现在这里。

### 4.4 Git 版本追踪

装了 Git 后，AI 每次修改文件都会被追踪。不满意可以撤销。

---

## 五、通用：Skill 是什么

### 5.1 问题

每次新开会话，AI 都是从零开始，你之前教的它全忘了。比如你每次都要说「用口语风格写、每段不超过 3 句」——太累。

### 5.2 解决

**Skill** = 预先写好的提示词模板。装一次，以后用 `/` 命令一键加载。

### 5.3 怎么装

**方法一**：让 AI 帮你找

```
帮我去 https://skills.sh 找一个写分镜的 skill，安装到当前项目
```

**方法二**：输入 `/` 搜索已安装的 Skill

### 5.4 npm 镜像（装 Skill 卡住时用）

```powershell
npm config set registry https://registry.npmmirror.com
```

> [!warning] Skill 安全
> 网上有 9 万+ 个 Skill，约 30% 有安全风险。装之前可以让 AI 先评估：「这个 Skill 有哪些可能的风险？」

---

## 六、通用：Obsidian 看文档

### 6.1 什么是 Obsidian

专门看和管理 Markdown（.md）文件的工具。AI 生成的文件都是 md 格式，文件多了用记事本一个个开很麻烦，Obsidian 能统一预览。

### 6.2 安装

1. 打开 https://obsidian.md
2. 下载对应系统版本
3. 安装：一路 Next

### 6.3 打开项目文件夹

1. 启动 Obsidian
2. 选「打开本地仓库（Open folder as vault）」
3. 选你之前建的项目文件夹（比如 `D:\Projects\first-prj`）
4. 所有 md 文件都会列出来，点击即可预览

---

## 七、常见问题排障

> [!question]- OpenCode 免费模型用不了
> **原因**：网络问题
> **解决**：检查网络。免费模型不需要翻墙，正常上网就能用。如果还是不行，可能是 OpenCode 版本太旧，执行 `opencode upgrade` 升级。

> [!question]- `claude` 命令找不到
> **原因**：Path 环境变量没配
> **解决**：按 3.4 节，在环境变量的 Path 里加 `%USERPROFILE%\.local\bin`（用户变量和系统变量都加），**关掉终端重新打开**再试。

> [!question]- Claude Code 提示「不在支持的国家」
> **原因**：翻墙工具没代理终端
> **解决**：在翻墙工具里开 **Tun 模式**（虚拟网卡），强制命令行流量也走代理。详见 [科普文第四节](/tech/tutorials/proxy-tun-mode-explained#四系统代理-vs-tun-模式教程里最让人懵的两个词)。

> [!question]- 终端里下载/安装卡住不动
> **原因**：没开 Tun 模式，命令行不走系统代理
> **解决**：同上，开 Tun 模式。命令行工具（PowerShell/CMD）默认不认系统代理，只有 Tun 模式能代理全部流量。

> [!question]- npm install 卡住
> **原因**：网络问题，npm 默认源在境外
> **解决**：换成国内镜像源：
> ```powershell
> npm config set registry https://registry.npmmirror.com
> ```

> [!question]- OpenCode 的 Git 按钮点不动
> **原因**：没装 Git
> **解决**：按 2.1 节安装 Git（https://git-scm.com），装完后**重启 OpenCode**。

> [!question]- Skill 安装到一半卡住
> **原因**：网络波动
> **解决**：先配 npm 镜像源（见上），然后开新会话让它重试。Skill 安装走的是 npm，网络慢就会卡。

> [!question]- DeepSeek 说余额不足
> **原因**：没充值或用完了
> **解决**：登录 https://platform.deepseek.com 充值。建议先充 5-10 元试试，用完再充。

> [!question]- Token 消耗太快，钱扣得猛
> **原因**：正常现象，复杂任务消耗多
> **解决**：
> - 用免费模型做探索性操作（试错、学习）
> - 付费模型（DeepSeek）做关键任务（正式写文章、整理资料）
> - DeepSeek 后台可以设置消费限额，防止意外超额
> - 别一次充太多，5-10 元试水，心里有数再续

> [!question]- 环境变量配了不生效
> **原因**：终端没重开
> **解决**：环境变量改了之后，**已经打开的终端读不到新值**。关掉所有终端窗口，重新打开就好了。

> [!question]- Claude 官方账号被封
> **原因**：Claude 检测到中国 IP 会封号，充了钱可能打水漂
> **解决**：**不要用 Claude 官方账号**。两个替代方案：
> 1. 接 DeepSeek API 驱动 Claude Code（本教程方案，10 元能用很久）
> 2. 买 Cursor Pro（$20/月，内置 Claude 模型，Cursor 官方处理封号问题）

---

## 八、想体验 Claude 模型？推荐 Cursor

上面两条路线都是用 DeepSeek 的模型。如果你**非常想体验 Anthropic Claude 原版模型**（目前最强的 AI 模型之一），直接买 Claude 官方账号有封号风险（检测中国 IP）。

**推荐方案：买 Cursor**。

### 8.1 Cursor 是什么

Cursor 是一款内置 AI 的代码编辑器（基于 VS Code 改的），内置了 Claude、GPT、Gemini 等多家前沿模型。你不用自己接 API、不用配环境变量、不用担心封号——Cursor 帮你搞定一切。

### 8.2 费用

| 方案 | 价格 | 包含 |
|------|------|------|
| **Hobby（免费版）** | $0 | 有限的 Agent 请求和 Tab 补全，不用信用卡 |
| **Individual（Pro 版）** | $20/月 | 扩展 Agent 限额、**访问 Claude/GPT/Gemini 等前沿模型**、MCP/Skills/Hooks、Cloud agents |
| **Teams** | $40/用户/月 | 团队协作功能 |

> [!tip] 免费版先试
> Hobby 免费版不用信用卡就能用，有限额度但足够体验。觉得值再升级 Pro。

### 8.3 和本教程其他路线的对比

| | OpenCode 免费模型 | OpenCode + DeepSeek | Claude Code + DeepSeek | **Cursor Pro** |
|---|---|---|---|---|
| 模型 | 免费模型 | DeepSeek-V4 | DeepSeek-V4（伪装成 Claude） | **Claude 原版 + GPT + Gemini** |
| 需要翻墙 | ❌ | ❌ | ✅ | ✅（需要访问 Cursor 服务器） |
| 需要配环境变量 | ❌ | ❌ | ✅（8 条） | ❌（开箱即用） |
| 封号风险 | 无 | 无 | 无（走 DeepSeek） | **无**（Cursor 官方处理） |
| 费用 | $0 | ~10 元人民币 | ~10 元人民币 | $20/月 |
| 适合 | 零成本入门 | 便宜的日常使用 | 命令行高级用户 | **想用最强模型、不怕花钱** |

### 8.4 怎么装

1. 打开 https://www.cursor.com
2. 点 Download 下载对应系统版本
3. 安装：一路 Next
4. 启动后登录（用 Google/邮箱注册）
5. 免费版直接用；想用 Claude 等前沿模型 → 升级 Pro（$20/月）

> [!note] Cursor 也需要翻墙
> Cursor 的服务器在境外，使用时需要科学上网。但不像 Claude Code 那样需要配环境变量——Cursor 是图形界面的编辑器，开系统代理就能用（不需要 Tun 模式）。

### 8.5 适合谁

- 想体验 Claude 原版模型、不怕花 $20/月的人
- 想要开箱即用、不想折腾环境变量的人
- 既是写代码又是写文章的人（Cursor 本质是代码编辑器，但也能帮你写 md 文件）

---

## 九、三条路线总结

| | 免翻墙版 | 完整版 | Cursor 版 |
|---|---------|--------|-----------|
| 难度 | ⭐ | ⭐⭐⭐ | ⭐ |
| 需要翻墙 | ❌ | ✅ | ✅（系统代理即可） |
| 模型 | 免费模型 / DeepSeek | DeepSeek | Claude/GPT/Gemini 原版 |
| 费用 | $0 ~ 10 元 | ~10 元 | $0 ~ $20/月 |
| 适合 | 完全零基础 | 命令行高级用户 | 想用最强模型的人 |

> [!tip] 推荐路线
> 1. **第一步（免翻墙）**：装 OpenCode + Git → 用免费模型每天练习 → 充 10 元 DeepSeek
> 2. **第二步（完整版）**：搞定科学上网 → 装 Claude Code → 配环境变量接 DeepSeek
> 3. **或直接跳到 Cursor**：如果预算充足、想用 Claude 原版模型 → 买 Cursor Pro（$20/月，开箱即用）

---

## 相关笔记

- [写给小白：翻墙、代理、Tun 模式到底是什么](/tech/tutorials/proxy-tun-mode-explained) — 完整版的前置条件
- [LTSC 安装教程](/log/windows-daily) — 系统层面的配置
- [环境配置 SOP](/tech/ai-engineering-practices) — 技术向的环境配置
