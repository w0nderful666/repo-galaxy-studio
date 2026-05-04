import {
  Moon,
  Sun,
  Settings,
  Maximize,
  Minimize,
  Keyboard,
} from "lucide-react";
import type { ThemeConfig } from "../lib/themes";
import type { ThemeId } from "../lib/themes";

interface HeaderProps {
  theme: ThemeConfig;
  themeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  onSettingsClick: () => void;
  fullscreen: boolean;
  onFullscreenToggle: () => void;
}

const THEME_LIST: { id: ThemeId; label: string }[] = [
  { id: "deep-space", label: "🌌 Deep Space" },
  { id: "neon-cyber", label: "💜 Neon Cyber" },
  { id: "terminal", label: "💻 Terminal" },
  { id: "aurora", label: "🌊 Aurora" },
];

export function Header({
  theme,
  themeId,
  onThemeChange,
  onSettingsClick,
  fullscreen,
  onFullscreenToggle,
}: HeaderProps) {
  const nextTheme = () => {
    const idx = THEME_LIST.findIndex((t) => t.id === themeId);
    const next = THEME_LIST[(idx + 1) % THEME_LIST.length];
    onThemeChange(next.id);
  };

  return (
    <header
      className="app-header"
      style={{
        background: theme.panelBg,
        borderBottom: `1px solid ${theme.border}`,
        color: theme.text,
      }}
      data-testid="app-header"
    >
      <div className="header-brand">
        <span className="brand-icon" style={{ color: theme.accent }}>🌌</span>
        <span className="brand-text">
          <strong>Repo Galaxy Studio</strong>
          <small style={{ color: theme.textSecondary }}>开源星系工坊</small>
        </span>
      </div>

      <div className="header-actions">
        <button
          onClick={nextTheme}
          className="header-btn"
          aria-label={`切换主题 (当前: ${theme.name})`}
          title={`主题: ${theme.name}`}
          style={{ color: theme.accent }}
        >
          {themeId === "terminal" ? <Keyboard size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={onFullscreenToggle}
          className="header-btn"
          aria-label={fullscreen ? "退出全屏" : "进入全屏"}
          title={fullscreen ? "退出全屏 (F)" : "全屏 (F)"}
          style={{ color: theme.textSecondary }}
        >
          {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        <button
          onClick={onSettingsClick}
          className="header-btn"
          aria-label="设置"
          title="设置"
          style={{ color: theme.textSecondary }}
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
