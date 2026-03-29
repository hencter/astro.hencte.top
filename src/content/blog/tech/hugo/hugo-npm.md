---
title: "Hugo Npm"
date: "2025-10-02T20:02:39+08:00"
draft: true
slug: "tech/hugo/hugo-npm"
section: "tech"
legacyPath: "tech/hugo/2025-10-02-hugo-npm.md"
---

## Hugo 中的 npm 依赖处理

### 1. **Hugo Modules 与 npm 集成**

Hugo 提供了一个实验性功能来处理 npm 依赖，主要通过以下机制：

#### `hugo mod npm pack` 命令[^2]

- **功能**: 为项目准备和编写复合的 `package.json` 文件
- **工作原理**:
  - 首次运行时在项目根目录创建 `package.hugo.json` 文件（如果不存在）
  - 这个文件作为基础依赖集的模板文件
  - 会合并依赖树中找到的所有 `package.hugo.json` 文件，选择最接近项目的版本

#### `package.hugo.json` 文件[^1]

- **用途**: 定义主题或模块的 npm 依赖
- **工作流程**:

  ```bash
  cd user-site
  hugo mod get -u github.com/foo/bar
  hugo mod npm pack
  npm update
  ```

- **注意**: npm 无法直接使用 `package.hugo.json`，需要先通过 `hugo mod npm pack` 生成标准的 `package.json`

### 2. **JavaScript 构建与 npm 依赖**

#### `js.Build` 函数[^3]

Hugo 的 `js.Build` 函数支持 Node.js 依赖：

- **前提条件**: 如果项目中有 npm 依赖，需要在运行 `hugo` 之前先运行 `npm install`
- **解析机制**: 项目目录作为解析 npm 包的起始目录（查找 `node_modules` 等）
- **推荐**: 对于依赖 `package.json` 的主题/组件，建议了解 `hugo mod npm pack` 工具

### 3. **主题开发中的 npm 依赖**

#### 主题中的依赖管理[^4]

- **常见做法**: 主题在其文件夹中包含 `package.json`
- **集成方式**: 使用 Hugo Pipes 处理 CSS/JS 资源
- **PostCSS 支持**: Hugo 可以在构建时评估和运行 PostCSS 配置

### 4. **模块系统配置**

#### 模块导入和挂载[^5]

Hugo 模块系统支持：

- **模块导入**: 通过配置文件导入外部模块
- **版本管理**: 使用 `hugo mod get` 更新模块
- **本地开发**: 支持 replace 指令进行本地模块开发
- **工作区支持**: Go 1.18+ 的工作区模式

### 5. **实际应用建议**

根据你的项目情况，建议的 npm 依赖处理方式：

1. **对于简单项目**: 直接在项目根目录使用标准的 `package.json` 和 `npm install`

2. **对于模块化主题**:
   - 在主题中创建 `package.hugo.json`
   - 使用 `hugo mod npm pack` 合并依赖
   - 用户项目中运行 `npm install`

3. **对于复杂构建**: 结合 Hugo Pipes 和 `js.Build` 函数处理现代 JavaScript 工具链

你的项目已经有了标准的 `package.json` 和 `pnpm` 配置，这是目前最直接有效的方式。Hugo 的模块系统主要是为了更复杂的模块化场景设计的。

## 参考资料

[^1]: [How should I use package.hugo.json? - Hugo Community](https://discourse.gohugo.io/t/how-should-i-use-package-hugo-json/43055)
[^2]: [hugo mod npm pack - Hugo Documentation](https://gohugo.io/commands/hugo_mod_npm_pack/)
[^3]: [js.Build - Hugo Documentation](https://gohugo.io/functions/js/build/)
[^4]: [Proper way to set up theme with node dependencies - Hugo Community](https://discourse.gohugo.io/t/proper-way-to-set-up-theme-with-node-dependencies/27827)
[^5]: [Use Hugo Modules - Hugo Documentation](https://gohugo.io/hugo-modules/use-modules/)
