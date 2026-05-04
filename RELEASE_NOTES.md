# Release Notes

## v1.2.0 — 2026-05-04

### 🔄 Restored

- **恢复 Repo Galaxy Studio 项目**：重建为完整的 GitHub 开源星系可视化工具

### ✨ New Features

- **3D 星系可视化**：基于 Three.js / @react-three/fiber / @react-three/drei 的沉浸式 3D 星系渲染
- **2D SVG 降级**：WebGL 不可用时自动切换为 2D SVG 星图，支持点击交互
- **GitHub 数据获取**：输入用户名获取公开仓库，支持分页加载（最多 100 个仓库）
- **星球映射系统**：stars→大小、forks→卫星、language→颜色、updated→亮度、archived→暗淡
- **控制面板**：搜索、语言筛选、排序（Stars/Forks/Updated/Name）
- **统计面板**：总仓库数、总 Stars、总 Forks、活跃/归档仓库、语言分布、Top 5、开源能量评分
- **详情面板**：仓库完整信息、topics 标签、GitHub/Homepage 链接、复制 Clone 命令、复制 Markdown 链接
- **4 个主题**：Deep Space（默认）、Neon Cyber、Terminal、Aurora
- **导入导出 JSON**：星系快照含 schemaVersion，支持导入恢复
- **分享链接**：生成包含 username/theme/view 状态的 URL（不含 Token）
- **README 卡片生成**：一键生成可嵌入 GitHub Profile 的 Markdown
- **Token 设置**：可选 GitHub PAT，仅本地保存，支持清除
- **最近搜索用户**：自动记录最近 5 个搜索用户
- **键盘快捷键**：`/` 搜索、`Esc` 关闭、`T` 切换主题、`F` 全屏
- **移动端适配**：响应式布局，详情面板在移动端变为 bottom sheet
- **性能模式**：降低粒子和渲染复杂度，适合低端设备
- **自动旋转**：星系自动旋转开关
- **Service Worker**：离线缓存支持

### 🏗️ Architecture

- Local First、No Backend、No Database
- 纯前端，GitHub Pages Ready
- 不追踪、不上传用户文件
- GitHub Token 仅 localStorage，不导出、不分享

### 📋 Known Limitations

- GitHub API 未认证限流为 60 次/小时，建议设置 Token
- 3D 模式在低端设备上可能卡顿，建议开启性能模式
- 导入 JSON 不包含 Token（设计如此，保护隐私）
- 暂不支持私有仓库（仅公开 API）
