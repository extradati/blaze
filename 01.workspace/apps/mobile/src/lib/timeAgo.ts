import { useEffect, useState } from "react";

const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;

/** i18n key + count for "how long ago", e.g. { key: "time.hours", count: 2 } → "2 h ago". */
export function timeAgo(then: number, now: number) {
  const d = Math.max(0, now - then);
  if (d < MIN) return { key: "time.justNow", count: 0 } as const;
  if (d < HOUR) return { key: "time.minutes", count: Math.floor(d / MIN) } as const;
  if (d < DAY) return { key: "time.hours", count: Math.floor(d / HOUR) } as const;
  return { key: "time.days", count: Math.floor(d / DAY) } as const;
}

/** Current time, refreshed every `intervalMs` so relative times stay correct. */
export function useNow(intervalMs = MIN) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
