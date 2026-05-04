import { siteMeta } from "../config/siteMeta";

const PREFIX = siteMeta.localStoragePrefix;

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`${PREFIX}.${key}`);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}.${key}`, JSON.stringify(value));
    } catch {
      // storage full or blocked
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${PREFIX}.${key}`);
    } catch {
      // ignore
    }
  },

  isAvailable(): boolean {
    try {
      const k = `${PREFIX}._test`;
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  },
};

export function getRecentUsers(): string[] {
  return storage.get<string[]>("recentUsers", []);
}

export function addRecentUser(username: string): void {
  const recent = getRecentUsers().filter((u) => u !== username);
  recent.unshift(username);
  storage.set("recentUsers", recent.slice(0, 10));
}

export function getToken(): string {
  return storage.get<string>("token", "");
}

export function setToken(token: string): void {
  storage.set("token", token);
}

export function clearToken(): void {
  storage.remove("token");
}
