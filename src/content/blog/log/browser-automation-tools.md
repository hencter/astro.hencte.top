---
title: "浏览器自动化测试工具和库"
description: "对比 Selenium、Playwright、Cypress 三款浏览器自动化测试工具的特点与适用场景，讲解 Chrome 与 ChromeDriver 的安装及版本对应要点，并附 Python Selenium 打开网页、定位元素、模拟输入的示例代码。"
date: "2023-03-11T23:44:25+08:00"
draft: false
tags:
  - "Test"
  - "End to End Testing"
categories:
  - "自动化"
  - "测试"
slug: "log/browser-automation-tools"
section: "log"
legacyPath: "log/2023-03-11-browser-automation-tools.md"
---

自动化测试是软件开发的一个重要环节，可以提高软件的质量和开发效率。而浏览器自动化测试是其中一个重要的领域，可以用于测试网站的前端功能和用户体验。Selenium 是一个流行的浏览器自动化测试库，它支持多种编程语言，包括 Python。

除了 Selenium，还有一些类似的工具，例如 Playwright[^Playwright] 和 Cypress[^Cypress]。它们都提供了比 Selenium 更加现代化和高效的 API 和功能。

Playwright 是由 Microsoft 开发的一个跨浏览器自动化测试库，它支持 Chrome、Firefox 和 Safari 等多种浏览器，并提供了比 Selenium 更加简洁和高效的 API，支持异步操作和多个浏览器实例的管理。

Cypress 是另一个流行的浏览器自动化测试工具，它提供了一套完整的测试框架，可以用于测试 Web 应用的前端功能和性能。它支持实时重新加载和调试，并提供了一套易于使用的 API 和命令行界面。

在使用 Selenium 进行浏览器自动化测试之前，需要安装 Chrome[^Chrome] 浏览器和 ChromeDriver。ChromeDriver 是一个开源的 WebDriver 实现，可以用于控制 Chrome 浏览器进行自动化测试。要保证 Chrome 浏览器和 ChromeDriver 版本相对应，可以通过 Chrome 浏览器的版本信息来确定需要下载的 ChromeDriver[^Chromedriver] 版本。

在 Python 中使用 Selenium，可以通过 pip[^Config_PyPI] 安装 `selenium` 包。然后可以使用 `webdriver` 模块创建 `WebDriver` 对象，指定要使用的浏览器驱动（例如 ChromeDriver），并调用 `get` 方法打开指定的网址。使用 `find_element` 方法可以查找页面中的元素，然后使用 `send_keys` 方法输入内容并模拟按键操作，例如回车键，参考下方[简单示例](#selenium-示例)。

总之，浏览器自动化测试是一个重要的测试领域，Selenium 是一个流行的测试库，而 Playwright 和 Cypress 等工具则提供了更加现代化和高效的 API 和功能，可以根据具体的需求选择使用。

Selenium 官方文档：<https://www.selenium.dev/zh-cn/documentation/>

## 安装 Chrome 和 ChromeDriver

[^Chrome]: Chrome 下载地址 <https://www.google.cn/chrome/index.html>

[^Chromedriver]: Chromedriver 下载地址（注意：最好与你的 Chrome 主机对应）<https://chromedriver.storage.googleapis.com/index.html>

[^Playwright]: Playwright 官网 https://playwright.dev/

[^Cypress]: Cypress 官网 https://www.cypress.io/

Chrome 与 ChromeDriver 版本要对应
[^Config_PyPI]: https://mirror.tuna.tsinghua.edu.cn/help/pypi/

## Selenium 示例

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

# 创建 WebDriver 对象，指明相应浏览器驱动，这里使用 chromedriver
# wd = webdriver.Chrome(r'D:\DevEnv\WebDrivers\chromedriver\chromedriver.exe')
wd = webdriver.Chrome()

# 调用WebDriver 对象的get方法 可以让浏览器打开指定网址
wd.get('https://www.baidu.com')

element = wd.find_element(By.ID, 'kw')

element.send_keys("你好\n")
```
