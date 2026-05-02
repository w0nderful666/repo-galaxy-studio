import { useEffect, useState } from "react";
import { storage, type StorageKey } from "@/lib/storage";

export function usePersistentState<T>(
  key: StorageKey,
  initialValue: T,
): [T, (nextValue: T) => void] {
  const [value, setValue] = useState<T>(() =>
    storage.getJson<T>(key, initialValue),
  );

  useEffect(() => {
    storage.setJson(key, value);
  }, [key, value]);

  return [value, setValue];
}
