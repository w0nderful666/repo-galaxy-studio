import type { GitHubRepo } from "./github";

export interface PlanetData {
  repo: GitHubRepo;
  position: [number, number, number];
  size: number;
  color: string;
  brightness: number;
  satellites: number;
  isArchived: boolean;
  hasHomepage: boolean;
  seed: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Lua: "#000080",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Zig: "#ec915c",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
  R: "#198CE7",
  Julia: "#a270ba",
  Perl: "#0298c3",
  Objective: "#438eff",
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getLanguageColor(lang: string | null): string {
  if (!lang) return "#666666";
  return LANGUAGE_COLORS[lang] || `hsl(${hashString(lang) % 360}, 60%, 55%)`;
}

export function mapReposToPlanets(repos: GitHubRepo[]): PlanetData[] {
  const maxStars = Math.max(...repos.map((r) => r.stargazers_count), 1);
  const maxForks = Math.max(...repos.map((r) => r.forks_count), 1);

  return repos.map((repo, index) => {
    const seed = hashString(repo.full_name + repo.id.toString());
    const rand = seededRandom(seed);

    // Size based on stars (0.3 to 2.5)
    const starNorm = repo.stargazers_count / maxStars;
    const size = 0.3 + starNorm * 2.2;

    // Satellites based on forks (0 to 8)
    const forkNorm = repo.forks_count / maxForks;
    const satellites = Math.round(forkNorm * 8);

    // Brightness based on last update
    const daysSinceUpdate =
      (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
    const brightness = repo.archived
      ? 0.2
      : Math.max(0.3, 1 - daysSinceUpdate / 365);

    // Stable orbital layout using golden angle
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = index * goldenAngle;
    const radius = 3 + Math.sqrt(index) * 2.5 + rand() * 1.5;
    const y = (rand() - 0.5) * 4;

    const position: [number, number, number] = [
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius,
    ];

    return {
      repo,
      position,
      size,
      color: getLanguageColor(repo.language),
      brightness,
      satellites,
      isArchived: repo.archived,
      hasHomepage: !!repo.homepage,
      seed,
    };
  });
}

export function calculateEnergyScore(
  repos: GitHubRepo[]
): { level: string; score: number; emoji: string } {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const activeRepos = repos.filter(
    (r) => !r.archived && (Date.now() - new Date(r.pushed_at).getTime()) < 180 * 24 * 60 * 60 * 1000
  ).length;
  const languages = new Set(repos.map((r) => r.language).filter(Boolean)).size;

  const score =
    totalStars * 2 +
    totalForks * 3 +
    activeRepos * 5 +
    languages * 10 +
    repos.length;

  if (score >= 5000) return { level: "宇宙级 · Cosmic", score, emoji: "🌌" };
  if (score >= 2000) return { level: "星系级 · Galactic", score, emoji: "🪐" };
  if (score >= 500) return { level: "恒星级 · Stellar", score, emoji: "⭐" };
  if (score >= 100) return { level: "行星级 · Planetary", score, emoji: "🌍" };
  return { level: "星尘级 · Stardust", score, emoji: "✨" };
}
