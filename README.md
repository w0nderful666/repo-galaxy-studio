# 🌌 Repo Galaxy Studio | 开源星系工坊

> 把你的 GitHub 公开仓库变成一片可交互的 3D 开源宇宙。

[![Version](https://img.shields.io/badge/version-1.2.0-6366f1)](https://github.com/w0nderful666/repo-galaxy-studio)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.170-049ef4)](https://threejs.org)
[![Local First](https://img.shields.io/badge/Local-First-22c55e)]()
[![No Backend](https://img.shields.io/badge/No-Backend-eab308)]()
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages%20Ready-8b5cf6)](https://w0nderful666.github.io/repo-galaxy-studio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

🔗 **在线体验：[https://w0nderful666.github.io/repo-galaxy-studio/](https://w0nderful666.github.io/repo-galaxy-studio/)**

---

## ✨ 功能亮点

- 🌌 **3D 星系** — 基于 Three.js / @react-three/fiber 的沉浸式 3D 可视化
- 🗺️ **2D 降级** — WebGL 不可用时自动切换 2D SVG 星图
- 🔗 **GitHub 公开 API** — 无需登录，输入用户名即可生成星系
- 🔍 **语言筛选** — 按编程语言过滤仓库
- 📊 **排序搜索** — 按 Stars / Forks / 更新时间 / 名称排序
- ⚡ **开源能量评分** — 根据 Stars、Forks、活跃度等计算能量等级
- 📝 **README 卡片生成** — 一键生成可嵌入 Profile 的 Markdown 卡片
- 📦 **导入导出 JSON** — 保存和恢复星系快照
- 🔗 **分享链接** — 生成包含用户名和视图状态的分享 URL
- 🎨 **4 个主题** — Deep Space / Neon Cyber / Terminal / Aurora
- 📱 **移动端适配** — 响应式布局，详情面板自动变为 bottom sheet
- 🔒 **Local First / No Backend** — 所有数据存储在浏览器本地
- ⌨️ **键盘快捷键** — `/` 搜索、`Esc` 关闭、`T` 切换主题、`F` 全屏

---

## 🔒 隐私说明

- ✅ **无后端** — 纯前端应用，所有逻辑在浏览器中执行
- ✅ **无登录** — 使用 GitHub 公开 API，无需认证
- ✅ **不追踪** — 不包含任何追踪脚本或分析工具
- ✅ **不上传用户文件** — 所有数据仅在本地处理
- ✅ **GitHub Token 可选** — 仅保存在浏览器 localStorage，不导出、不写入分享链接

---

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 运行自测
npm run self-test

# 运行预检
npm run preflight
```

---

## 🌐 GitHub Pages 部署

使用 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建并部署到 GitHub Pages
3. 访问 `https://w0nderful666.github.io/repo-galaxy-studio/`

> 部署使用 GitHub Actions workflow，监听 `main` 分支，构建 `dist` 目录。

---

## 🪐 星球映射规则

| 属性 | 视觉影响 |
|------|----------|
| `stars` | 星球大小（0.3x ~ 2.5x） |
| `forks` | 卫星数量（0 ~ 8 个） |
| `language` | 星球颜色（每种语言固定颜色） |
| `updated_at` / `pushed_at` | 亮度 / 脉冲（越近越亮） |
| `archived` | 暗淡死星样式 |
| `homepage` | 光环标记 |
| `topics` | 标签显示 |
| `license` | 文明标记 |
| `repo id` | 稳定伪随机布局种子（同一用户刷新后位置一致） |

---

## 📁 项目结构

```
repo-galaxy-studio/
├── index.html              # 入口 HTML
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── public/
│   ├── icon.svg            # 应用图标
│   ├── manifest.webmanifest
│   ├── og-image.svg        # OG 图片
│   └── sw.js               # Service Worker
├── src/
│   ├── main.tsx            # 入口文件
│   ├── App.tsx             # 主应用组件
│   ├── components/
│   │   ├── GalaxyCanvas.tsx    # 3D 星系渲染
│   │   ├── WebGLFallback.tsx   # 2D SVG 降级
│   │   ├── ControlPanel.tsx    # 控制面板
│   │   ├── StatsPanel.tsx      # 统计面板
│   │   ├── DetailPanel.tsx     # 仓库详情
│   │   ├── Header.tsx          # 顶部导航
│   │   ├── TokenSettings.tsx   # Token 设置
│   │   └── ReadmeGenerator.tsx # README 卡片生成
│   ├── hooks/
│   │   ├── usePersistentState.ts
│   │   └── useWebGL.ts
│   ├── lib/
│   │   ├── github.ts       # GitHub API 封装
│   │   ├── galaxy.ts       # 星系映射逻辑
│   │   ├── themes.ts       # 主题配置
│   │   ├── storage.ts      # 本地存储
│   │   └── export.ts       # 导入导出
│   ├── config/
│   │   └── siteMeta.ts     # 项目元信息
│   └── styles/
│       └── global.css      # 全局样式
└── scripts/
    ├── run-self-test.mjs   # 自测脚本
    └── preflight.mjs       # 预检脚本
```

---

## 🗺️ Roadmap

- [x] 3D 星系可视化
- [x] 2D SVG 降级
- [x] GitHub 公开 API 数据获取
- [x] 语言筛选、排序、搜索
- [x] 开源能量评分
- [x] README 卡片生成
- [x] 导入导出 JSON
- [x] 分享链接
- [x] 4 个主题
- [x] 移动端适配
- [x] 键盘快捷键
- [ ] 星系动画过渡
- [ ] 多用户对比模式
- [ ] 自定义星球标签
- [ ] 星系背景音乐

---

## 📄 License

[MIT](LICENSE) © [w0nderful666](https://github.com/w0nderful666)
