import { expect, test } from "./test";
import { KEEP_BETTER_MS, shouldReplace } from "../src/features/location/better";

const fix = (accuracy: number, time: number) => ({ center: [7, 46] as [number, number], accuracy, time });

test("live fixes: better replaces, worse waits, older never", () => {
  expect(shouldReplace(null, fix(500, 0))).toBe(true);
  expect(shouldReplace(fix(50, 1000), fix(10, 2000))).toBe(true); // more precise
  expect(shouldReplace(fix(10, 1000), fix(50, 2000))).toBe(false); // less precise, shown one still recent
  expect(shouldReplace(fix(10, 1000), fix(50, 1000 + KEEP_BETTER_MS + 1))).toBe(true); // shown one too old: user may have moved
  expect(shouldReplace(fix(50, 5000), fix(5, 4000))).toBe(false); // older fix
});
