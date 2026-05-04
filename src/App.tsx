import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Download,
  Upload,
  Share2,
  FileText,
  Key,
  Loader2,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { Header } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { StatsPanel } from "./components/StatsPanel";
import { DetailPanel } from "./components/DetailPanel";
import { GalaxyCanvas } from "./components/GalaxyCanvas";
import { WebGLFallback } from "./components/WebGLFallback";
import { TokenSettings } from "./components/TokenSettings";
import { ReadmeGenerator } from "./components/ReadmeGenerator";
import { usePersistentState } from "./hooks/usePersistentState";
import { useWebGL } from "./hooks/useWebGL";
import {
  fetchUser,
  fetchRepos,
  type GitHubRepo,
  type GitHubUser,
  type FetchError,
} from "./lib/github";
import { mapReposToPlanets, type PlanetData } from "./lib/galaxy";
import { themes, type ThemeId, type ThemeConfig } from "./lib/themes";
import {
  storage,
  getRecentUsers,
  addRecentUser,
  getToken,
  setToken,
  clearToken,
} from "./lib/storage";
import {
  exportSnapshot,
  importSnapshot,
  downloadJSON,
  generateShareURL,
} from "./lib/export";

type ViewMode = "3d" | "2d";
type SortKey = "stars" | "forks" | "updated" | "name";

function parseURLParams(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("user");
}

function getErrorLabel(error: FetchError, t: string): string {
  switch (error.type) {
    case "user_not_found":
      return "用户不存在 / User not found";
    case "rate_limited":
      return `GitHub API 限流，请稍后重试${error.retryAfter ? ` (${error.retryAfter}s)` : ""}`;
    case "network_error":
      return `网络错误: ${error.message}`;
    case "no_repos":
      return "该用户没有公开仓库 / No public repos";
    default:
      return `未知错误: ${error.message}`;
  }
}

export function App() {
  // Theme
  const [themeId, setThemeId] = usePersistentState<ThemeId>("theme", "deep-space");
  const theme: ThemeConfig = themes[themeId] || themes["deep-space"];

  // User state
  const [username, setUsername] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = usePersistentState<ViewMode>("viewMode", "3d");
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [sortBy, setSortBy] = usePersistentState<SortKey>("sortBy", "stars");
  const [autoRotate, setAutoRotate] = usePersistentState("autoRotate", true);
  const [performanceMode, setPerformanceMode] = usePersistentState("performanceMode", false);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  // UI state
  const [showTokenSettings, setShowTokenSettings] = useState(false);
  const [showReadmeGenerator, setShowReadmeGenerator] = useState(false);
  const [showStats, setShowStats] = usePersistentState("showStats", true);
  const [showControls, setShowControls] = usePersistentState("showControls", true);
  const [fullscreen, setFullscreen] = useState(false);
  const [token, setTokenState] = useState(getToken());
  const [recentUsers, setRecentUsers] = useState(getRecentUsers());

  const webglSupported = useWebGL();
  const effectiveViewMode = webglSupported ? viewMode : "2d";

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--bg-secondary", theme.bgSecondary);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-secondary", theme.textSecondary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--panel-bg", theme.panelBg);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  // URL param detection
  useEffect(() => {
    const urlUser = parseURLParams();
    if (urlUser) {
      setInputValue(urlUser);
      loadUser(urlUser);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Escape") {
          (e.target as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key) {
        case "/":
          e.preventDefault();
          document.querySelector<HTMLInputElement>('[aria-label="搜索仓库"]')?.focus();
          break;
        case "Escape":
          setSelectedPlanet(null);
          break;
        case "t":
        case "T":
          setThemeId((prev) => {
            const ids = Object.keys(themes) as ThemeId[];
            const idx = ids.indexOf(prev);
            return ids[(idx + 1) % ids.length];
          });
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, []);

  const loadUser = async (uname: string) => {
    if (!uname.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedPlanet(null);

    const userResult = await fetchUser(uname.trim(), token || undefined);
    if ("error" in userResult) {
      setError(getErrorLabel(userResult.error, uname));
      setLoading(false);
      return;
    }

    const reposResult = await fetchRepos(uname.trim(), token || undefined);
    if ("error" in reposResult) {
      setError(getErrorLabel(reposResult.error, uname));
      setLoading(false);
      return;
    }

    setUser(userResult.user);
    setRepos(reposResult.repos);
    setUsername(uname.trim());
    addRecentUser(uname.trim());
    setRecentUsers(getRecentUsers());
    setLoading(false);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("user", uname.trim());
    window.history.replaceState({}, "", url.toString());
  };

  const handleTokenChange = (newToken: string) => {
    setTokenState(newToken);
    setToken(newToken);
  };

  const handleTokenClear = () => {
    setTokenState("");
    clearToken();
  };

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    let filtered = repos;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    if (languageFilter) {
      filtered = filtered.filter((r) => r.language === languageFilter);
    }

    switch (sortBy) {
      case "stars":
        filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case "forks":
        filtered.sort((a, b) => b.forks_count - a.forks_count);
        break;
      case "updated":
        filtered.sort(
          (a, b) =>
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [repos, searchQuery, languageFilter, sortBy]);

  const planets = useMemo(
    () => mapReposToPlanets(filteredRepos),
    [filteredRepos]
  );

  const handleExport = () => {
    if (!user) return;
    const json = exportSnapshot(user, repos);
    downloadJSON(json, `galaxy-${user.login}.json`);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const data = importSnapshot(text);
      if (data) {
        setUser(data.user);
        setRepos(data.repos);
        setUsername(data.user.login);
        setInputValue(data.user.login);
      }
    };
    input.click();
  };

  const handleShare = () => {
    if (!username) return;
    const params: Record<string, string> = {};
    if (themeId !== "deep-space") params.theme = themeId;
    if (effectiveViewMode !== "3d") params.view = effectiveViewMode;
    if (sortBy !== "stars") params.sort = sortBy;
    if (languageFilter) params.lang = languageFilter;
    const url = generateShareURL(username, params);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="app" style={{ background: theme.bg, color: theme.text }}>
      <Header
        theme={theme}
        themeId={themeId}
        onThemeChange={setThemeId}
        onSettingsClick={() => setShowTokenSettings(true)}
        fullscreen={fullscreen}
        onFullscreenToggle={toggleFullscreen}
      />

      <div className="app-body">
        {/* Left: Search + Controls */}
        {!user ? (
          <div className="welcome-screen" style={{ color: theme.text }}>
            <div className="welcome-content">
              <h1 style={{ color: theme.accent }}>🌌 Repo Galaxy Studio</h1>
              <p style={{ color: theme.textSecondary }}>
                把你的 GitHub 公开仓库变成一片可交互的 3D 开源宇宙
              </p>

              <form
                className="search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  loadUser(inputValue);
                }}
              >
                <div
                  className="search-input-wrap"
                  style={{ borderColor: theme.border, background: theme.bgSecondary }}
                >
                  <Search size={18} color={theme.textSecondary} />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入 GitHub 用户名..."
                    aria-label="GitHub 用户名"
                    autoFocus
                    style={{ color: theme.text, background: "transparent" }}
                  />
                </div>
                <button
                  type="submit"
                  className="search-btn"
                  style={{ background: theme.accent }}
                  disabled={loading || !inputValue.trim()}
                >
                  {loading ? <Loader2 size={18} className="spin" /> : "生成星系"}
                </button>
              </form>

              <div className="quick-actions">
                <button
                  className="quick-btn"
                  onClick={() => {
                    setInputValue("w0nderful666");
                    loadUser("w0nderful666");
                  }}
                  style={{ color: theme.accent, borderColor: theme.border }}
                >
                  ⭐ 示例: w0nderful666
                </button>
                <button
                  className="quick-btn"
                  onClick={handleImport}
                  style={{ color: theme.textSecondary, borderColor: theme.border }}
                >
                  <Upload size={14} /> 导入 JSON
                </button>
                <button
                  className="quick-btn"
                  onClick={() => setShowTokenSettings(true)}
                  style={{ color: theme.textSecondary, borderColor: theme.border }}
                >
                  <Key size={14} /> Token 设置
                </button>
              </div>

              {recentUsers.length > 0 && (
                <div className="recent-users">
                  <span style={{ color: theme.textSecondary, fontSize: "12px" }}>
                    最近搜索:
                  </span>
                  {recentUsers.slice(0, 5).map((u) => (
                    <button
                      key={u}
                      className="recent-btn"
                      onClick={() => {
                        setInputValue(u);
                        loadUser(u);
                      }}
                      style={{ color: theme.accent, borderColor: theme.border }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="error-msg" style={{ color: theme.danger }}>
                  <AlertTriangle size={16} /> {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Control Panel */}
            {showControls && (
              <ControlPanel
                repos={repos}
                theme={theme}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                languageFilter={languageFilter}
                onLanguageFilterChange={setLanguageFilter}
                sortBy={sortBy}
                onSortChange={(s) => setSortBy(s as SortKey)}
                totalCount={repos.length}
                filteredCount={filteredRepos.length}
                autoRotate={autoRotate}
                onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
                performanceMode={performanceMode}
                onPerformanceModeToggle={() => setPerformanceMode(!performanceMode)}
                viewMode={effectiveViewMode}
                onViewModeToggle={() =>
                  setViewMode(effectiveViewMode === "3d" ? "2d" : "3d")
                }
                webglSupported={webglSupported}
              />
            )}

            {/* Center: Galaxy view */}
            <div className="galaxy-area">
              {/* Top bar with user info */}
              <div
                className="galaxy-topbar"
                style={{ background: theme.panelBg, borderBottom: `1px solid ${theme.border}` }}
              >
                <div className="topbar-user">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="user-avatar"
                    style={{ borderColor: theme.border }}
                  />
                  <div>
                    <strong style={{ color: theme.text }}>
                      {user.name || user.login}
                    </strong>
                    <small style={{ color: theme.textSecondary }}>@{user.login}</small>
                  </div>
                </div>
                <div className="topbar-actions">
                  <button
                    onClick={() => setShowControls(!showControls)}
                    className="topbar-btn"
                    style={{ color: theme.textSecondary }}
                    aria-label={showControls ? "隐藏控制面板" : "显示控制面板"}
                    title="控制面板"
                  >
                    ☰
                  </button>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="topbar-btn"
                    style={{ color: theme.textSecondary }}
                    aria-label={showStats ? "隐藏统计" : "显示统计"}
                    title="统计面板"
                  >
                    📊
                  </button>
                  <button
                    onClick={() => setShowReadmeGenerator(true)}
                    className="topbar-btn"
                    style={{ color: theme.accent }}
                    aria-label="生成 README 卡片"
                    title="README 卡片"
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    onClick={handleExport}
                    className="topbar-btn"
                    style={{ color: theme.textSecondary }}
                    aria-label="导出 JSON"
                    title="导出"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={handleImport}
                    className="topbar-btn"
                    style={{ color: theme.textSecondary }}
                    aria-label="导入 JSON"
                    title="导入"
                  >
                    <Upload size={16} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="topbar-btn"
                    style={{ color: theme.accent }}
                    aria-label="复制分享链接"
                    title="分享"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setUser(null);
                      setRepos([]);
                      setUsername("");
                      setInputValue("");
                      setSelectedPlanet(null);
                      const url = new URL(window.location.href);
                      url.searchParams.delete("user");
                      window.history.replaceState({}, "", url.toString());
                    }}
                    className="topbar-btn"
                    style={{ color: theme.textSecondary }}
                    aria-label="返回"
                    title="返回"
                  >
                    <RefreshCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Galaxy visualization */}
              {effectiveViewMode === "3d" ? (
                <GalaxyCanvas
                  planets={planets}
                  theme={theme}
                  autoRotate={autoRotate}
                  performanceMode={performanceMode}
                  onSelect={setSelectedPlanet}
                  selectedRepoId={selectedPlanet?.repo.id ?? null}
                />
              ) : (
                <WebGLFallback
                  planets={planets}
                  theme={theme}
                  onSelect={setSelectedPlanet}
                  selectedRepoId={selectedPlanet?.repo.id ?? null}
                />
              )}

              {/* Error overlay */}
              {error && (
                <div className="error-overlay" style={{ background: theme.panelBg }}>
                  <AlertTriangle size={24} color={theme.danger} />
                  <p style={{ color: theme.danger }}>{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      loadUser(username);
                    }}
                    style={{ color: theme.accent }}
                  >
                    <RefreshCcw size={14} /> 重试
                  </button>
                </div>
              )}
            </div>

            {/* Right: Stats */}
            {showStats && repos.length > 0 && (
              <StatsPanel repos={repos} theme={theme} />
            )}

            {/* Detail Panel (overlay on mobile, sidebar on desktop) */}
            {selectedPlanet && (
              <DetailPanel
                repo={selectedPlanet.repo}
                theme={theme}
                onClose={() => setSelectedPlanet(null)}
              />
            )}
          </>
        )}
      </div>

      {/* Token Settings Modal */}
      {showTokenSettings && (
        <div className="modal-overlay" onClick={() => setShowTokenSettings(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <TokenSettings
              theme={theme}
              token={token}
              onTokenChange={handleTokenChange}
              onTokenClear={handleTokenClear}
              onClose={() => setShowTokenSettings(false)}
            />
          </div>
        </div>
      )}

      {/* README Generator Modal */}
      {showReadmeGenerator && user && (
        <div className="modal-overlay" onClick={() => setShowReadmeGenerator(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ReadmeGenerator
              theme={theme}
              user={user}
              repos={repos}
              onClose={() => setShowReadmeGenerator(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
