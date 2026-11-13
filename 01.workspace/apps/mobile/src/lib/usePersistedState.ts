import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

/** JSON value persisted on the device under `key`. `ready` is false until storage has been read. */
export function usePersistedState<T>(key: string) {
  const [value, setValue] = useState<T | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((v) => v && setValue(JSON.parse(v)))
      .catch(() => {})
      .finally(() => setReady(true));
  }, [key]);

  const save = useCallback((v: T | null) => {
    setValue(v);
    (v ? AsyncStorage.setItem(key, JSON.stringify(v)) : AsyncStorage.removeItem(key)).catch(() => {});
  }, [key]);

  return { value, ready, save };
}
