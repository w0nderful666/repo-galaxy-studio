# Opencode Presets

这些提示词可直接复制给 opencode 使用。复制前请把方括号中的项目名、工具类型或特殊要求替换为真实内容。

## 1. C 级项目启动提示词

```text
请基于 open-tools-starter 创建一个 C 级纯前端小工具，项目名为 [项目名]。

技术栈：Vite + React + TypeScript。

限制：
1. 不引入后端。
2. 不引入数据库。
3. 不做登录系统。
4. 不上传用户文件到服务器。
5. 默认支持 GitHub Pages。
6. 不引入重依赖。
7. 所有按钮必须真实可用，不允许空壳 UI。

C 级必须包含：
- 现代 UI
- 移动端适配
- 深色模式
- 中文 / 英文切换
- 示例数据
- 一键复制
- README
- GitHub Pages 部署说明

本项目要做的工具是：[工具说明]。

请先阅读现有文件，再实现一个轻量、完整、可发布的版本。不要加入 PWA、复杂导入导出、批处理或过度架构。
```

## 2. B 级项目启动提示词

```text
请基于 open-tools-starter 创建一个 B 级纯前端实用工具，项目名为 [项目名]。

技术栈：Vite + React + TypeScript。

限制：
1. 不引入后端。
2. 不引入数据库。
3. 不做登录系统。
4. 不上传用户文件到服务器。
5. 默认支持 GitHub Pages。
6. 不引入不必要的重依赖。
7. 所有按钮必须真实可用。

B 级必须包含 C 级所有能力，并额外包含：
- localStorage
- 导入 JSON
- 导出 JSON
- 下载结果文件
- 分享链接
- 错误提示
- 空状态
- self-test.html
- self-test.js
- RELEASE_NOTES.md
- 发布前检查清单
- 隐私说明

本项目要做的工具是：[工具说明]。

请先阅读 README、docs/PROJECT_LEVELS.md 和 docs/MODULE_MATRIX.md，然后实现标准可发布版本。
```

## 3. A 级项目启动提示词

```text
请基于 open-tools-starter 创建一个 A 级旗舰纯前端工具项目，项目名为 [项目名]。

技术栈：Vite + React + TypeScript。

限制：
1. 不引入后端。
2. 不引入数据库。
3. 不做登录系统。
4. 不上传用户文件到服务器。
5. 默认支持 GitHub Pages。
6. 所有按钮必须真实可用。
7. 不为了炫技引入过重依赖。

A 级必须包含 B 级所有能力，并额外包含：
- PWA
- 离线提示
- 批处理能力
- 工具模块化
- 统一组件库
- 统一设置中心
- 项目健康检查
- preflight 脚本
- SEO / OpenGraph
- 完整错误边界
- 完整中英文文案

本项目要做的是：[旗舰项目说明]。

请先阅读所有文档和现有源码，再提出模块划分并实现第一版可运行架构。不要一次性堆满业务功能，优先保证长期维护结构。
```

## 4. 从 C 级升级到 B 级的提示词

```text
请把当前项目从 C 级升级到 B 级。

升级前请先阅读：
- README.md
- RELEASE_NOTES.md
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- 当前源码

升级目标：
- 保留现有功能和 UI 风格。
- 补齐 localStorage 封装。
- 增加导入 JSON。
- 增加导出 JSON。
- 增加下载结果文件能力。
- 增加分享链接。
- 增加错误提示和空状态。
- 增加 self-test.html 和 self-test.js。
- 更新 RELEASE_NOTES.md。
- 更新 README.md 的隐私、自测和发布说明。
- 检查所有按钮真实可用。

限制：
不引入后端、数据库、登录系统，不上传用户文件，不引入过重依赖。

完成后运行 npm run build 和 self-test，并修复所有错误。
```

## 5. 从 B 级升级到 A 级的提示词

```text
请把当前项目从 B 级升级到 A 级。

升级前请先阅读所有文档、配置和源码。

升级目标：
- 保留现有功能。
- 加入 PWA。
- 加入离线提示。
- 支持批处理能力。
- 将工具模块化。
- 整理统一组件库。
- 增加统一设置中心。
- 增加项目健康检查。
- 增加 preflight 脚本。
- 完善 SEO / OpenGraph。
- 增加完整错误边界。
- 补齐完整中英文文案。

限制：
不引入后端、数据库、登录系统，不上传用户文件。
不要把无关业务功能塞进升级任务。

完成后运行 npm run build、self-test 和 preflight，并修复所有错误。
```

## 6. 发布前检查提示词

```text
请对当前纯前端 GitHub Pages 项目做发布前检查。

重点检查：
- 所有按钮是否真实可用。
- 是否存在空壳 UI。
- 是否存在未处理的占位标记、临时修复说明或未决规划项。
- 移动端是否正常。
- 深色模式是否正常。
- 中英文是否完整。
- README 是否完整。
- RELEASE_NOTES 是否完整。
- GitHub Pages 路径是否正确。
- 是否错误上传用户文件。
- 是否依赖后端。
- 是否存在外部追踪脚本。
- 是否存在敏感信息。
- npm run build 是否通过。
- self-test 是否通过。

请先输出问题清单，再修复可直接修复的问题，最后给出发布结论。
```

## 7. README 打磨提示词

```text
请打磨当前项目 README.md。

README 必须清楚说明：
- 这个项目是什么。
- 适合做什么。
- 当前项目等级。
- 核心功能。
- 本地运行方法。
- GitHub Pages 部署方法。
- 隐私原则。
- 项目结构。
- 自测方法。
- 发布前检查。

要求：
- 中文为主，必要时保留英文品牌标签。
- 不夸大功能。
- 不写还没实现的能力。
- 命令和路径必须准确。
- 读者可以照着 README 从零运行项目。
```

## 8. UI 质感优化提示词

```text
请优化当前纯前端工具项目的 UI 质感。

目标：
- 保持现有功能不变。
- 提升层级、间距、对比度和响应式体验。
- 移动端必须自然可用。
- 深色模式必须完整。
- 中英文切换后文本不能溢出。
- 所有按钮必须保持真实可用。

限制：
- 不引入重型 UI 框架。
- 不把工具页改成营销落地页。
- 不增加空壳模块。
- 不做无关业务功能。

请先阅读现有 CSS 和组件结构，再做小步、可维护的优化。完成后运行 npm run build。
```

## 9. 基于母版创建 C 级新项目

```text
请基于 open-tools-starter 母版创建一个 C 级新项目。

项目名称：[项目名]
项目说明：[一句话说明]
目标用户：[目标用户]
核心功能：[核心功能]

请先阅读：
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/NEW_PROJECT_START_GUIDE.md
- docs/PROJECT_SPEC_TEMPLATE.md
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts

C 级边界：
- 保留现代 UI、移动端适配、深色模式、中英文切换、示例数据、一键复制、README、GitHub Pages 部署。
- localStorage 可保留用于主题和语言。
- 不加入 PWA、复杂导入导出、批处理或大型架构。

限制：
- 不引入后端、数据库、登录系统。
- 不上传用户文件。
- 不引入重依赖。
- 所有按钮必须真实可用。

请修改 package.json、README、页面标题、项目名称和必要配置，然后添加第一个真实 C 级工具。完成后运行 build、self-test、preflight。
```

## 10. 基于母版创建 B 级新项目

```text
请基于 open-tools-starter 母版创建一个 B 级新项目。

项目名称：[项目名]
项目说明：[一句话说明]
目标用户：[目标用户]
核心功能：[核心功能]

请先阅读：
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/NEW_PROJECT_START_GUIDE.md
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts

B 级必须包含 C 级能力，并额外包含：
- localStorage
- 导入 JSON
- 导出 JSON
- 下载结果文件
- 分享链接
- 错误提示
- 空状态
- self-test.html
- self-test.js
- RELEASE_NOTES.md
- 发布前检查清单
- 隐私说明

限制：
- 不引入后端、数据库、登录系统。
- 不上传用户文件。
- 不引入不必要的重依赖。
- 所有按钮必须真实可用。

请按 B 级 Profile 裁剪模块，更新 README 和 RELEASE_NOTES，添加第一个真实工具，并运行 build、self-test、preflight。
```

## 11. 基于母版创建 A 级新项目

```text
请基于 open-tools-starter 母版创建一个 A 级旗舰项目。

项目名称：[项目名]
项目说明：[一句话说明]
目标用户：[目标用户]
核心模块：[核心模块列表]

请先阅读所有 docs 文档、src/config/projectProfiles.ts、src/config/moduleRegistry.ts 和现有源码。

A 级必须包含 B 级能力，并额外包含：
- PWA
- 离线提示
- 批处理能力
- 工具模块化
- 统一组件库
- 统一设置中心
- 项目健康检查
- preflight 脚本
- SEO / OpenGraph
- 完整错误边界
- 完整中英文文案

限制：
- 不引入后端、数据库、登录系统。
- 不上传用户文件。
- 不为了炫技引入重依赖。
- 不一次性堆满所有业务功能。

请先做旗舰项目架构和第一个可运行工具模块，保持长期维护结构清晰。完成后运行 build、self-test、preflight。
```

## 12. 根据 PROJECT_SPEC_TEMPLATE.md 生成项目计划

```text
请读取 docs/PROJECT_SPEC_TEMPLATE.md，并根据其中填写的内容生成项目实施计划。

输出内容：
- 项目等级判断是否合理。
- 必须启用的模块。
- 推荐启用的模块。
- 可以删除或暂不实现的模块。
- README 需要替换的内容。
- package.json 需要修改的字段。
- GitHub Pages base 建议。
- 第一版最小可发布范围。
- 风险和不做范围。
- 验收检查清单。

限制：
- 不开始写业务代码。
- 不引入后端、数据库、登录系统。
- 不上传用户文件。

请先给计划，再等我确认后再实现。
```

## 13. 检查项目是否符合对应等级

```text
请检查当前项目是否符合 [C/B/A] 级项目要求。

请阅读：
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts
- README.md
- RELEASE_NOTES.md
- 当前源码

检查内容：
- 必须模块是否存在。
- 推荐模块是否合理处理。
- 不建议模块是否被过早加入。
- README 是否准确。
- RELEASE_NOTES 是否准确。
- 按钮是否真实可用。
- 是否存在空壳 UI。
- 是否依赖后端、数据库或登录。
- 是否上传用户文件。
- build、self-test、preflight 是否通过。

请先输出问题清单，再修复可直接修复的问题，最后给出等级符合结论。
```

## 14. 把 C 级项目升级到 B 级

```text
请把当前 C 级项目升级到 B 级。

升级前请阅读：
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts
- README.md
- RELEASE_NOTES.md
- 当前源码

升级目标：
- 保留现有 C 级功能。
- 补齐 localStorage 业务封装。
- 增加导入 JSON。
- 增加导出 JSON。
- 增加下载结果文件。
- 增加分享链接。
- 增加错误提示和空状态。
- 增强 self-test.html 和 public/self-test.js。
- 更新 README、RELEASE_NOTES 和隐私说明。

限制：
- 不引入后端、数据库、登录系统。
- 不上传用户文件。
- 不引入重依赖。

完成后运行 build、self-test、preflight，并修复所有错误。
```

## 15. 把 B 级项目升级到 A 级

```text
请把当前 B 级项目升级到 A 级。

升级前请阅读所有 docs 文档、src/config 配置和当前源码。

升级目标：
- 保留现有 B 级功能。
- 加入 PWA。
- 加入离线提示。
- 支持批处理能力。
- 将工具模块化。
- 整理统一组件库。
- 增加统一设置中心。
- 增加项目健康检查。
- 完善 preflight 脚本。
- 完善 SEO / OpenGraph。
- 增加完整错误边界。
- 补齐完整中英文文案。

限制：
- 不引入后端、数据库、登录系统。
- 不上传用户文件。
- 不把无关业务功能塞进升级任务。
- 不为了炫技引入重依赖。

完成后运行 build、self-test、preflight，并修复所有错误。
```
