export type StorageKey =
  | "open-tools-starter.theme"
  | "open-tools-starter.language"
  | "open-tools-starter.recentAction";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const probeKey = "open-tools-starter.storage-probe";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  isAvailable(): boolean {
    return getStorage() !== null;
  },

  getJson<T>(key: StorageKey, fallback: T): T {
    const localStorage = getStorage();
    if (!localStorage) {
      return fallback;
    }

    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setJson<T>(key: StorageKey, value: T): boolean {
    const localStorage = getStorage();
    if (!localStorage) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key: StorageKey): boolean {
    const localStorage = getStorage();
    if (!localStorage) {
      return false;
    }

    localStorage.removeItem(key);
    return true;
  },
};
