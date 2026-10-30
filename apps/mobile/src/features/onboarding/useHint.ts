import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

/** One-time hint: visible until dismissed, remembered across launches. */
export function useHint(id: string) {
  const key = `hint.${id}.dismissed`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((v) => setVisible(v === null)).catch(() => {});
  }, [key]);

  const dismiss = useCallback(() => {
    setVisible(false);
    AsyncStorage.setItem(key, "1").catch(() => {});
  }, [key]);

  return { visible, dismiss };
}
