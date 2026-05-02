export type Language = "zh" | "en";

type Level = {
  title: string;
  subtitle: string;
  description: string;
  required: string[];
};

export type Messages = {
  nav: {
    docs: string;
    levels: string;
    modules: string;
    settings: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryAction: string;
    secondaryAction: string;
    copyPrompt: string;
    downloadManifest: string;
  };
  tags: string[];
  levels: {
    title: string;
    intro: string;
    items: Level[];
  };
  matrix: {
    title: string;
    body: string;
    open: string;
    modalTitle: string;
    modalBody: string;
    copyPath: string;
    bullets: string[];
  };
  capabilities: {
    title: string;
    intro: string;
    items: Array<{ title: string; body: string }>;
  };
  tools: {
    title: string;
    intro: string;
    copyTitle: string;
    copyBody: string;
    downloadTitle: string;
    downloadBody: string;
    modalTitle: string;
    modalBody: string;
  };
  settings: {
    title: string;
    intro: string;
    theme: string;
    language: string;
    themeDark: string;
    themeLight: string;
    zh: string;
    en: string;
    storageReady: string;
    storageBlocked: string;
  };
  states: {
    emptyTitle: string;
    emptyBody: string;
    errorTitle: string;
    errorBody: string;
  };
  toast: {
    copied: string;
    copyFailed: string;
    downloaded: string;
    themeChanged: string;
    languageChanged: string;
    modalOpened: string;
  };
  common: {
    close: string;
    copied: string;
    copy: string;
    download: string;
    open: string;
  };
};

export const messages: Record<Language, Messages> = {
  zh: {
    nav: {
      docs: "文档",
      levels: "等级",
      modules: "模块",
      settings: "设置",
    },
    hero: {
      eyebrow: "长期复用的 GitHub Pages 工具母版",
      title: "Open Tools Starter",
      body: "为纯前端小工具准备的 Local First 模板：无后端、无登录、隐私友好，适合从轻量 C 级工具一路扩展到 A 级旗舰工具箱。",
      primaryAction: "查看模块矩阵",
      secondaryAction: "复制 C 级启动提示词",
      copyPrompt: "复制启动提示词",
      downloadManifest: "下载模板清单",
    },
    tags: ["Local First", "No Backend", "Privacy Friendly", "Offline Friendly", "GitHub Pages Ready"],
    levels: {
      title: "A / B / C 项目等级系统",
      intro: "用等级约束复杂度，让每个新工具都知道自己该做到哪里、暂时不该做什么。",
      items: [
        {
          title: "C 级项目",
          subtitle: "轻量小工具",
          description: "适合单页工具、文本处理、提示词生成器、二维码工具、小型计算器等。",
          required: ["现代 UI", "移动端适配", "深色模式", "中英文切换", "示例数据", "一键复制", "README", "GitHub Pages 部署"],
        },
        {
          title: "B 级项目",
          subtitle: "标准实用工具",
          description: "适合 PDF 小工具、图片工具、文件处理、批量重命名、字幕工具、JSON/CSV 工具等。",
          required: ["C 级全部能力", "localStorage", "导入/导出 JSON", "下载结果文件", "分享链接", "错误提示", "self-test", "发布说明", "隐私说明"],
        },
        {
          title: "A 级项目",
          subtitle: "旗舰项目",
          description: "适合长期维护的工具箱、File Bento、PDF Desk Lite、Image Desk Lite、Prompt Market、GitHub Galaxy 等。",
          required: ["B 级全部能力", "PWA", "离线提示", "批处理", "模块化工具", "统一组件库", "设置中心", "健康检查", "preflight", "SEO/OpenGraph"],
        },
      ],
    },
    matrix: {
      title: "模块矩阵入口",
      body: "模块矩阵定义每个能力在 C/B/A 等级中的状态：必须、推荐、可选或不建议。",
      open: "打开矩阵摘要",
      modalTitle: "模块矩阵摘要",
      modalBody: "完整矩阵位于 docs/MODULE_MATRIX.md。模板首页保留这个入口，方便新项目继续对照裁剪。",
      copyPath: "复制文档路径",
      bullets: ["C 级优先轻量发布", "B 级补齐文件与状态能力", "A 级加入长期维护体系"],
    },
    capabilities: {
      title: "模板能力",
      intro: "第一阶段只搭地基：稳定 UI、设置、文档、自测和发布约束。",
      items: [
        {
          title: "隐私友好",
          body: "默认所有数据都在浏览器本地处理，不上传用户文件。",
        },
        {
          title: "GitHub Pages Ready",
          body: "Vite 使用相对 base，适合部署到任意仓库路径。",
        },
        {
          title: "可持续升级",
          body: "从 C 到 B 再到 A 的升级路径写入文档和提示词。",
        },
      ],
    },
    tools: {
      title: "示例工具卡片",
      intro: "这些不是业务工具，而是模板级能力示例。每个按钮都真实可用。",
      copyTitle: "复制提示词",
      copyBody: "复制 C 级项目启动提示词，后续可直接交给 opencode。",
      downloadTitle: "下载 JSON",
      downloadBody: "下载一份模板能力清单，验证下载结果文件能力。",
      modalTitle: "矩阵弹窗",
      modalBody: "打开一个可关闭的模块矩阵摘要弹窗，验证 Modal 组件。",
    },
    settings: {
      title: "设置区域",
      intro: "主题和语言会写入 localStorage，刷新后保持选择。",
      theme: "主题",
      language: "语言",
      themeDark: "深色",
      themeLight: "浅色",
      zh: "中文",
      en: "English",
      storageReady: "localStorage 可用",
      storageBlocked: "localStorage 不可用",
    },
    states: {
      emptyTitle: "暂无业务模块",
      emptyBody: "第一阶段只创建模板能力，不实现 PDF、图片处理、二维码或文件转换。",
      errorTitle: "示例错误状态",
      errorBody: "这里展示可复用 ErrorState，后续业务模块可接入真实错误信息。",
    },
    toast: {
      copied: "已复制",
      copyFailed: "复制失败，请手动选择文本",
      downloaded: "已生成下载文件",
      themeChanged: "主题已更新",
      languageChanged: "语言已更新",
      modalOpened: "矩阵摘要已打开",
    },
    common: {
      close: "关闭",
      copied: "已复制",
      copy: "复制",
      download: "下载",
      open: "打开",
    },
  },
  en: {
    nav: {
      docs: "Docs",
      levels: "Levels",
      modules: "Modules",
      settings: "Settings",
    },
    hero: {
      eyebrow: "Reusable GitHub Pages starter for frontend tools",
      title: "Open Tools Starter",
      body: "A local-first template for pure frontend tools: no backend, no login, privacy friendly, and ready to grow from a compact C-level utility into an A-level flagship toolbox.",
      primaryAction: "View module matrix",
      secondaryAction: "Copy C-level prompt",
      copyPrompt: "Copy starter prompt",
      downloadManifest: "Download manifest",
    },
    tags: ["Local First", "No Backend", "Privacy Friendly", "Offline Friendly", "GitHub Pages Ready"],
    levels: {
      title: "A / B / C Project Levels",
      intro: "Use project levels to control scope, quality gates, and upgrade paths.",
      items: [
        {
          title: "Level C",
          subtitle: "Lightweight utility",
          description: "Best for single-page tools, text helpers, prompt generators, QR helpers, and small calculators.",
          required: ["Modern UI", "Mobile layout", "Dark mode", "Chinese/English copy", "Sample data", "One-click copy", "README", "GitHub Pages deployment"],
        },
        {
          title: "Level B",
          subtitle: "Standard practical tool",
          description: "Best for PDF helpers, image tools, file utilities, batch renamers, subtitle tools, and JSON/CSV tools.",
          required: ["All Level C capabilities", "localStorage", "JSON import/export", "Result downloads", "Share links", "Error feedback", "self-test", "Release notes", "Privacy note"],
        },
        {
          title: "Level A",
          subtitle: "Flagship project",
          description: "Best for long-lived toolboxes, File Bento, PDF Desk Lite, Image Desk Lite, Prompt Market, and GitHub Galaxy.",
          required: ["All Level B capabilities", "PWA", "Offline hint", "Batch processing", "Modular tools", "Shared component library", "Settings center", "Health checks", "preflight", "SEO/OpenGraph"],
        },
      ],
    },
    matrix: {
      title: "Module Matrix",
      body: "The module matrix marks each capability as required, recommended, optional, or discouraged for C/B/A projects.",
      open: "Open matrix summary",
      modalTitle: "Module Matrix Summary",
      modalBody: "The full matrix lives in docs/MODULE_MATRIX.md. This homepage keeps a practical entry point for future projects.",
      copyPath: "Copy docs path",
      bullets: ["Level C ships light", "Level B adds files and states", "Level A adds long-term maintenance systems"],
    },
    capabilities: {
      title: "Template Capabilities",
      intro: "Phase one builds the foundation: UI, settings, docs, self-test, and release rules.",
      items: [
        {
          title: "Privacy friendly",
          body: "Data stays in the browser by default. User files are not uploaded.",
        },
        {
          title: "GitHub Pages Ready",
          body: "Vite uses a relative base, so it can be deployed under any repository path.",
        },
        {
          title: "Upgrade path",
          body: "The C to B to A path is captured in docs and reusable prompts.",
        },
      ],
    },
    tools: {
      title: "Example Tool Cards",
      intro: "These are template-level examples, not business tools. Every button performs a real action.",
      copyTitle: "Copy Prompt",
      copyBody: "Copy the C-level starter prompt for future opencode runs.",
      downloadTitle: "Download JSON",
      downloadBody: "Download a template manifest to verify result-file downloads.",
      modalTitle: "Matrix Modal",
      modalBody: "Open a dismissible module matrix summary to validate the Modal component.",
    },
    settings: {
      title: "Settings",
      intro: "Theme and language are saved in localStorage and survive refreshes.",
      theme: "Theme",
      language: "Language",
      themeDark: "Dark",
      themeLight: "Light",
      zh: "中文",
      en: "English",
      storageReady: "localStorage available",
      storageBlocked: "localStorage unavailable",
    },
    states: {
      emptyTitle: "No business modules yet",
      emptyBody: "Phase one only creates template capabilities. PDF, image, QR, and file conversion tools are intentionally out of scope.",
      errorTitle: "Example error state",
      errorBody: "This reusable ErrorState can later receive real business errors.",
    },
    toast: {
      copied: "Copied",
      copyFailed: "Copy failed. Please select the text manually.",
      downloaded: "Download generated",
      themeChanged: "Theme updated",
      languageChanged: "Language updated",
      modalOpened: "Matrix summary opened",
    },
    common: {
      close: "Close",
      copied: "Copied",
      copy: "Copy",
      download: "Download",
      open: "Open",
    },
  },
};
