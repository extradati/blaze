import type { UserPosition } from "./types";

export const KEEP_BETTER_MS = 10_000;

/** Whether `next` should replace the shown fix: never an older one; a less precise one only once the shown fix is KEEP_BETTER_MS old. */
export function shouldReplace(cur: UserPosition | null, next: UserPosition): boolean {
  if (!cur) return true;
  if (next.time < cur.time) return false;
  return next.accuracy <= cur.accuracy || next.time - cur.time > KEEP_BETTER_MS;
}
