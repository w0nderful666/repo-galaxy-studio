import type { GitHubRepo, GitHubUser } from "./github";
import { siteMeta } from "../config/siteMeta";

export interface GalaxySnapshot {
  schemaVersion: number;
  exportedAt: string;
  app: string;
  version: string;
  user: GitHubUser;
  repos: GitHubRepo[];
}

export function exportSnapshot(
  user: GitHubUser,
  repos: GitHubRepo[]
): string {
  const snapshot: GalaxySnapshot = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    app: siteMeta.name,
    version: siteMeta.version,
    user,
    repos,
  };
  return JSON.stringify(snapshot, null, 2);
}

export function importSnapshot(
  json: string
): { user: GitHubUser; repos: GitHubRepo[] } | null {
  try {
    const data = JSON.parse(json);
    if (!data.user || !data.repos || !Array.isArray(data.repos)) return null;
    return { user: data.user, repos: data.repos };
  } catch {
    return null;
  }
}

export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateShareURL(
  username: string,
  params?: Record<string, string>
): string {
  const base = siteMeta.demoUrl;
  const url = new URL(base);
  url.searchParams.set("user", username);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
}

export function generateReadmeCard(username: string): string {
  const link = `${siteMeta.demoUrl}?user=${username}`;
  return `## 🌌 My Open Source Galaxy

[![Repo Galaxy Studio](${siteMeta.demoUrl}icon.svg)](${link})

**[${username}'s Galaxy](${link})**

> Explore ${username}'s GitHub repositories as an interactive 3D galaxy, powered by [Repo Galaxy Studio](${siteMeta.repositoryUrl}).

🔗 **[Open Galaxy →](${link})**`;
}
