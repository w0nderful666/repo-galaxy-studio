import { useState } from "react";
import { Key, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import type { ThemeConfig } from "../lib/themes";

interface TokenSettingsProps {
  theme: ThemeConfig;
  token: string;
  onTokenChange: (token: string) => void;
  onTokenClear: () => void;
  onClose: () => void;
}

export function TokenSettings({
  theme,
  token,
  onTokenChange,
  onTokenClear,
  onClose,
}: TokenSettingsProps) {
  const [inputValue, setInputValue] = useState(token);
  const [showToken, setShowToken] = useState(false);

  const handleSave = () => {
    onTokenChange(inputValue.trim());
    onClose();
  };

  return (
    <div
      className="token-settings"
      style={{ background: theme.panelBg, color: theme.text }}
      data-testid="token-settings"
    >
      <div className="token-header">
        <h3>
          <Key size={16} color={theme.accent} /> GitHub Token (可选)
        </h3>
        <button onClick={onClose} style={{ color: theme.textSecondary }} aria-label="关闭">
          ×
        </button>
      </div>

      <p style={{ color: theme.textSecondary, fontSize: "13px" }}>
        可选的 Personal Access Token，用于提高 GitHub API 速率限制。
        Token 仅保存在浏览器本地，不会导出或分享。
      </p>

      <div className="token-input-row">
        <input
          type={showToken ? "text" : "password"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="github_pat_xxxxxxxx"
          style={{
            background: theme.bgSecondary,
            color: theme.text,
            borderColor: theme.border,
          }}
          aria-label="GitHub Token"
        />
        <button
          onClick={() => setShowToken(!showToken)}
          style={{ color: theme.textSecondary }}
          aria-label={showToken ? "隐藏 Token" : "显示 Token"}
        >
          {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <div className="token-actions">
        <button
          onClick={handleSave}
          className="token-save-btn"
          style={{ background: theme.accent, color: "#fff" }}
        >
          保存
        </button>
        {token && (
          <button
            onClick={() => {
              onTokenClear();
              setInputValue("");
              onClose();
            }}
            className="token-clear-btn"
            style={{ color: theme.danger, borderColor: theme.border }}
          >
            <Trash2 size={14} /> 清除 Token
          </button>
        )}
      </div>

      <a
        href="https://github.com/settings/tokens"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: theme.accent, fontSize: "12px", marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "4px" }}
      >
        <ExternalLink size={12} /> 创建 Token
      </a>
    </div>
  );
}
