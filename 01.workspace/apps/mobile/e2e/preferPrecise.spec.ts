import { expect, test } from "./test";
import { preferPrecise } from "../src/features/location/preferPrecise";
import { LocationDeniedError, LocationTimeoutError, LocationUnavailableError } from "../src/features/location/types";

const after = <T>(ms: number, v: T) => new Promise<T>((r) => setTimeout(() => r(v), ms));
const failAfter = (ms: number, e: Error) => new Promise<never>((_, j) => setTimeout(() => j(e), ms));
const never = new Promise<never>(() => {});

test("precise wins when it arrives first", async () => {
  expect(await preferPrecise(after(10, "p"), after(20, "c"), 50)).toBe("p");
});
test("precise arriving within grace beats earlier coarse", async () => {
  expect(await preferPrecise(after(30, "p"), after(5, "c"), 100)).toBe("p");
});
test("coarse used after grace when precise hangs", async () => {
  const t = Date.now();
  expect(await preferPrecise(never, after(5, "c"), 50)).toBe("c");
  expect(Date.now() - t).toBeLessThan(500);
});
test("coarse used when precise fails", async () => {
  expect(await preferPrecise(failAfter(5, new LocationUnavailableError()), after(20, "c"), 50)).toBe("c");
});
test("denied wins over other errors", async () => {
  await expect(preferPrecise(failAfter(5, new LocationDeniedError()), failAfter(5, new LocationTimeoutError()))).rejects.toBeInstanceOf(LocationDeniedError);
});
test("timeout only when all requests time out", async () => {
  await expect(preferPrecise(failAfter(5, new LocationTimeoutError()), failAfter(5, new LocationTimeoutError()))).rejects.toBeInstanceOf(LocationTimeoutError);
  await expect(preferPrecise(failAfter(5, new LocationTimeoutError()), failAfter(5, new LocationUnavailableError()))).rejects.toBeInstanceOf(LocationUnavailableError);
});
