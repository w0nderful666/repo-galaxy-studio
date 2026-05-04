import { useMemo } from "react";
import {
  Star,
  GitFork,
  Archive,
  Globe,
  Code2,
  Zap,
  BarChart3,
} from "lucide-react";
import type { GitHubRepo } from "../lib/github";
import { calculateEnergyScore } from "../lib/galaxy";
import type { ThemeConfig } from "../lib/themes";

interface StatsPanelProps {
  repos: GitHubRepo[];
  theme: ThemeConfig;
}

export function StatsPanel({ repos, theme }: StatsPanelProps) {
  const stats = useMemo(() => {
    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
    const archived = repos.filter((r) => r.archived).length;
    const active = repos.length - archived;
    const languages = new Set(repos.map((r) => r.language).filter(Boolean)).size;
    const withHomepage = repos.filter((r) => r.homepage).length;
    const energy = calculateEnergyScore(repos);

    const top5 = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);

    const langDist = repos.reduce(
      (acc, r) => {
        const lang = r.language || "Other";
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalStars,
      totalForks,
      archived,
      active,
      languages,
      withHomepage,
      energy,
      top5,
      langDist,
    };
  }, [repos]);

  const topLangs = Object.entries(stats.langDist)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div
      className="stats-panel"
      style={{
        background: theme.panelBg,
        borderLeft: `1px solid ${theme.border}`,
        color: theme.text,
      }}
      data-testid="stats-panel"
    >
      <h3 style={{ color: theme.accent }}>
        <BarChart3 size={16} /> 星系统计 / Galaxy Stats
      </h3>

      <div className="stats-grid">
        <div className="stat-item" style={{ borderColor: theme.border }}>
          <Star size={14} color={theme.warning} />
          <span className="stat-value">{stats.totalStars.toLocaleString()}</span>
          <span className="stat-label" style={{ color: theme.textSecondary }}>总 Stars</span>
        </div>
        <div className="stat-item" style={{ borderColor: theme.border }}>
          <GitFork size={14} color={theme.accent} />
          <span className="stat-value">{stats.totalForks.toLocaleString()}</span>
          <span className="stat-label" style={{ color: theme.textSecondary }}>总 Forks</span>
        </div>
        <div className="stat-item" style={{ borderColor: theme.border }}>
          <Globe size={14} color={theme.success} />
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label" style={{ color: theme.textSecondary }}>活跃仓库</span>
        </div>
        <div className="stat-item" style={{ borderColor: theme.border }}>
          <Archive size={14} color={theme.textSecondary} />
          <span className="stat-value">{stats.archived}</span>
          <span className="stat-label" style={{ color: theme.textSecondary }}>归档仓库</span>
        </div>
        <div className="stat-item" style={{ borderColor: theme.border }}>
          <Code2 size={14} color={theme.accentSecondary} />
          <span className="stat-value">{stats.languages}</span>
          <span className="stat-label" style={{ color: theme.textSecondary }}>语言数</span>
        </div>
        <div className="stat-item" style={{ borderColor: theme.border }}>
          <Globe size={14} color={theme.accent} />
          <span className="stat-value">{stats.withHomepage}</span>
          <span className="stat-label" style={{ color: theme.textSecondary }}>有 Homepage</span>
        </div>
      </div>

      <div className="energy-badge" style={{ borderColor: theme.accent }}>
        <Zap size={16} color={theme.warning} />
        <div>
          <div style={{ color: theme.accent, fontWeight: 600 }}>
            {stats.energy.emoji} {stats.energy.level}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: "11px" }}>
            开源能量分: {stats.energy.score.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="lang-dist">
        <h4 style={{ color: theme.textSecondary }}>语言分布</h4>
        {topLangs.map(([lang, count]) => (
          <div key={lang} className="lang-bar-row">
            <span className="lang-name" style={{ color: theme.text }}>{lang}</span>
            <div className="lang-bar" style={{ background: theme.bgSecondary }}>
              <div
                className="lang-bar-fill"
                style={{
                  width: `${(count / repos.length) * 100}%`,
                  background: theme.accent,
                }}
              />
            </div>
            <span className="lang-count" style={{ color: theme.textSecondary }}>{count}</span>
          </div>
        ))}
      </div>

      <div className="top5">
        <h4 style={{ color: theme.textSecondary }}>Top 5 Repos</h4>
        {stats.top5.map((repo, i) => (
          <div
            key={repo.id}
            className="top5-item"
            style={{ borderColor: theme.border }}
          >
            <span className="top5-rank" style={{ color: theme.accent }}>
              #{i + 1}
            </span>
            <span className="top5-name">{repo.name}</span>
            <span style={{ color: theme.warning }}>⭐ {repo.stargazers_count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
