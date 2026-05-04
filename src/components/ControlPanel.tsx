import { useMemo } from "react";
import {
  Search,
  SortAsc,
  Filter,
  RotateCcw,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import type { GitHubRepo } from "../lib/github";
import type { ThemeConfig } from "../lib/themes";

interface ControlPanelProps {
  repos: GitHubRepo[];
  theme: ThemeConfig;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (lang: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
  performanceMode: boolean;
  onPerformanceModeToggle: () => void;
  viewMode: "3d" | "2d";
  onViewModeToggle: () => void;
  webglSupported: boolean;
}

export function ControlPanel({
  repos,
  theme,
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageFilterChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
  autoRotate,
  onAutoRotateToggle,
  performanceMode,
  onPerformanceModeToggle,
  viewMode,
  onViewModeToggle,
  webglSupported,
}: ControlPanelProps) {
  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [repos]);

  const clearFilters = () => {
    onSearchChange("");
    onLanguageFilterChange("");
    onSortChange("stars");
  };

  const hasFilters = searchQuery || languageFilter;

  return (
    <div
      className="control-panel"
      style={{
        background: theme.panelBg,
        borderRight: `1px solid ${theme.border}`,
        color: theme.text,
      }}
      data-testid="control-panel"
    >
      <div className="panel-section">
        <div className="search-box" style={{ borderColor: theme.border }}>
          <Search size={14} color={theme.textSecondary} />
          <input
            type="text"
            placeholder="搜索仓库 / Search repos"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="搜索仓库"
            style={{ color: theme.text, background: "transparent" }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="clear-btn"
              aria-label="清除搜索"
              style={{ color: theme.textSecondary }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="panel-section">
        <label className="panel-label" style={{ color: theme.textSecondary }}>
          <Filter size={12} /> 语言筛选 / Language
        </label>
        <select
          value={languageFilter}
          onChange={(e) => onLanguageFilterChange(e.target.value)}
          aria-label="按语言筛选"
          style={{
            background: theme.bgSecondary,
            color: theme.text,
            borderColor: theme.border,
          }}
        >
          <option value="">全部 / All</option>
          {languages.map((lang) => (
            <option key={lang} value={lang!}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="panel-section">
        <label className="panel-label" style={{ color: theme.textSecondary }}>
          <SortAsc size={12} /> 排序 / Sort
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="排序方式"
          style={{
            background: theme.bgSecondary,
            color: theme.text,
            borderColor: theme.border,
          }}
        >
          <option value="stars">⭐ Stars</option>
          <option value="forks">🍴 Forks</option>
          <option value="updated">🕐 Updated</option>
          <option value="name">📝 Name</option>
        </select>
      </div>

      <div className="panel-section panel-stats">
        <span style={{ color: theme.textSecondary }}>
          渲染 {filteredCount} / {totalCount} 个仓库
        </span>
      </div>

      <div className="panel-section panel-toggles">
        <button
          className="toggle-btn"
          onClick={onAutoRotateToggle}
          aria-label={autoRotate ? "关闭自动旋转" : "开启自动旋转"}
          title={autoRotate ? "自动旋转: 开" : "自动旋转: 关"}
          style={{
            color: autoRotate ? theme.accent : theme.textSecondary,
            borderColor: theme.border,
          }}
        >
          <RotateCcw size={14} />
          {autoRotate ? "旋转: 开" : "旋转: 关"}
        </button>

        <button
          className="toggle-btn"
          onClick={onPerformanceModeToggle}
          aria-label={performanceMode ? "关闭性能模式" : "开启性能模式"}
          title={performanceMode ? "性能模式: 开" : "性能模式: 关"}
          style={{
            color: performanceMode ? theme.warning : theme.textSecondary,
            borderColor: theme.border,
          }}
        >
          <Zap size={14} />
          {performanceMode ? "性能: 开" : "性能: 关"}
        </button>

        {webglSupported && (
          <button
            className="toggle-btn"
            onClick={onViewModeToggle}
            aria-label={viewMode === "3d" ? "切换到 2D 视图" : "切换到 3D 视图"}
            style={{ color: theme.accent, borderColor: theme.border }}
          >
            {viewMode === "3d" ? <Eye size={14} /> : <EyeOff size={14} />}
            {viewMode === "3d" ? "3D" : "2D"}
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="panel-section">
          <button
            className="clear-filters-btn"
            onClick={clearFilters}
            style={{ color: theme.accent }}
          >
            <RotateCcw size={12} /> 清除筛选
          </button>
        </div>
      )}
    </div>
  );
}
