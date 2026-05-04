import { siteMeta } from "../config/siteMeta";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  archived: boolean;
  disabled: boolean;
  topics: string[];
  license: { spdx_id: string; name: string } | null;
  updated_at: string;
  pushed_at: string;
  created_at: string;
  visibility: string;
  fork: boolean;
  size: number;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  name: string | null;
}

export type FetchError =
  | { type: "user_not_found" }
  | { type: "rate_limited"; retryAfter?: number }
  | { type: "network_error"; message: string }
  | { type: "no_repos" }
  | { type: "unknown"; message: string };

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchUser(
  username: string,
  token?: string
): Promise<{ user: GitHubUser } | { error: FetchError }> {
  try {
    const res = await fetch(`${siteMeta.apiBase}/users/${username}`, {
      headers: getHeaders(token),
    });
    if (res.status === 404) return { error: { type: "user_not_found" } };
    if (res.status === 403) {
      const retryAfter = res.headers.get("Retry-After");
      return {
        error: {
          type: "rate_limited",
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
        },
      };
    }
    if (!res.ok)
      return { error: { type: "unknown", message: `HTTP ${res.status}` } };
    const user = await res.json();
    return { user };
  } catch (e) {
    return {
      error: { type: "network_error", message: (e as Error).message },
    };
  }
}

export async function fetchRepos(
  username: string,
  token?: string,
  maxRepos = siteMeta.maxRepos
): Promise<{ repos: GitHubRepo[] } | { error: FetchError }> {
  try {
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = Math.min(maxRepos, 100);

    while (allRepos.length < maxRepos) {
      const res = await fetch(
        `${siteMeta.apiBase}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
        { headers: getHeaders(token) }
      );
      if (res.status === 404) return { error: { type: "user_not_found" } };
      if (res.status === 403) {
        const retryAfter = res.headers.get("Retry-After");
        return {
          error: {
            type: "rate_limited",
            retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
          },
        };
      }
      if (!res.ok)
        return { error: { type: "unknown", message: `HTTP ${res.status}` } };

      const batch: GitHubRepo[] = await res.json();
      if (batch.length === 0) break;
      allRepos.push(...batch);
      if (batch.length < perPage) break;
      page++;
    }

    if (allRepos.length === 0) return { error: { type: "no_repos" } };
    return { repos: allRepos.slice(0, maxRepos) };
  } catch (e) {
    return {
      error: { type: "network_error", message: (e as Error).message },
    };
  }
}
