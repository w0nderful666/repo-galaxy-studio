import { useState, useEffect, useCallback } from "react";
import { storage } from "../lib/storage";

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => storage.get(key, initialValue));

  useEffect(() => {
    storage.set(key, state);
  }, [key, state]);

  const setPersistentState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        return next;
      });
    },
    []
  );

  return [state, setPersistentState];
}
