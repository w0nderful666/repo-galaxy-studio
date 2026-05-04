import {
  X,
  ExternalLink,
  Home,
  Copy,
  FileText,
  Star,
  GitFork,
  AlertCircle,
  Scale,
  Clock,
  Tag,
} from "lucide-react";
import type { GitHubRepo } from "../lib/github";
import type { ThemeConfig } from "../lib/themes";

interface DetailPanelProps {
  repo: GitHubRepo;
  theme: ThemeConfig;
  onClose: () => void;
}

export function DetailPanel({ repo, theme, onClose }: DetailPanelProps) {
  const copyClone = () => {
    navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(
      `[${repo.full_name}](${repo.html_url}) — ${repo.description || ""}`
    );
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return "今天";
    if (days < 30) return `${days} 天前`;
    if (days < 365) return `${Math.floor(days / 30)} 月前`;
    return `${Math.floor(days / 365)} 年前`;
  };

  return (
    <div
      className="detail-panel"
      style={{
        background: theme.panelBg,
        borderLeft: `1px solid ${theme.border}`,
        color: theme.text,
      }}
      data-testid="detail-panel"
      role="dialog"
      aria-label={`仓库详情: ${repo.name}`}
    >
      <div className="detail-header">
        <h2 style={{ color: theme.accent }}>{repo.name}</h2>
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="关闭详情"
          style={{ color: theme.textSecondary }}
        >
          <X size={18} />
        </button>
      </div>

      {repo.description && (
        <p className="detail-desc" style={{ color: theme.textSecondary }}>
          {repo.description}
        </p>
      )}

      <div className="detail-meta">
        <div className="meta-row" style={{ borderColor: theme.border }}>
          <Star size={14} color={theme.warning} />
          <span>Stars</span>
          <strong>{repo.stargazers_count.toLocaleString()}</strong>
        </div>
        <div className="meta-row" style={{ borderColor: theme.border }}>
          <GitFork size={14} color={theme.accent} />
          <span>Forks</span>
          <strong>{repo.forks_count.toLocaleString()}</strong>
        </div>
        <div className="meta-row" style={{ borderColor: theme.border }}>
          <AlertCircle size={14} color={theme.danger} />
          <span>Issues</span>
          <strong>{repo.open_issues_count}</strong>
        </div>
        {repo.language && (
          <div className="meta-row" style={{ borderColor: theme.border }}>
            <span
              className="lang-dot"
              style={{ background: theme.accent }}
            />
            <span>语言</span>
            <strong>{repo.language}</strong>
          </div>
        )}
        {repo.license && (
          <div className="meta-row" style={{ borderColor: theme.border }}>
            <Scale size={14} color={theme.textSecondary} />
            <span>License</span>
            <strong>{repo.license.spdx_id}</strong>
          </div>
        )}
        <div className="meta-row" style={{ borderColor: theme.border }}>
          <Clock size={14} color={theme.textSecondary} />
          <span>更新</span>
          <strong>{timeAgo(repo.pushed_at)}</strong>
        </div>
        {repo.archived && (
          <div className="meta-row archived" style={{ borderColor: theme.border }}>
            <span>⚠️ 已归档 / Archived</span>
          </div>
        )}
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="detail-topics">
          <Tag size={12} color={theme.textSecondary} />
          {repo.topics.map((t) => (
            <span
              key={t}
              className="topic-tag"
              style={{ background: theme.bgSecondary, color: theme.accent, borderColor: theme.border }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="detail-actions">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn"
          style={{ color: theme.accent, borderColor: theme.border }}
          aria-label="在 GitHub 打开"
        >
          <ExternalLink size={14} /> GitHub
        </a>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            style={{ color: theme.accentSecondary, borderColor: theme.border }}
            aria-label="打开 Homepage"
          >
            <Home size={14} /> Homepage
          </a>
        )}
        <button
          onClick={copyClone}
          className="action-btn"
          style={{ color: theme.text, borderColor: theme.border }}
          aria-label="复制 git clone 命令"
        >
          <Copy size={14} /> Clone
        </button>
        <button
          onClick={copyMarkdown}
          className="action-btn"
          style={{ color: theme.text, borderColor: theme.border }}
          aria-label="复制 Markdown 链接"
        >
          <FileText size={14} /> Markdown
        </button>
      </div>
    </div>
  );
}
