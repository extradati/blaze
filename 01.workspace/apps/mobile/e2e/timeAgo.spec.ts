import { expect, test } from "@playwright/test";
import { timeAgo } from "../src/lib/timeAgo";

const MIN = 60_000;

test("buckets elapsed time into just now / min / h / d", () => {
  const now = 1_000_000_000_000;
  expect(timeAgo(now - 30_000, now)).toEqual({ key: "time.justNow", count: 0 });
  expect(timeAgo(now - 5 * MIN, now)).toEqual({ key: "time.minutes", count: 5 });
  expect(timeAgo(now - 59 * MIN, now)).toEqual({ key: "time.minutes", count: 59 });
  expect(timeAgo(now - 150 * MIN, now)).toEqual({ key: "time.hours", count: 2 });
  expect(timeAgo(now - 3 * 24 * 60 * MIN, now)).toEqual({ key: "time.days", count: 3 });
  expect(timeAgo(now + MIN, now)).toEqual({ key: "time.justNow", count: 0 }); // clock skew
});
