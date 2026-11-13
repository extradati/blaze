import { LocationDeniedError, LocationTimeoutError, LocationUnavailableError } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Runs a precise and a coarse position request in parallel.
 * Uses the precise result if it arrives; if only the coarse one arrives, waits graceMs more for precision, then uses it.
 */
export async function preferPrecise<T>(precise: Promise<T>, coarse: Promise<T>, graceMs = 3000): Promise<T> {
  const coarseThenWait = coarse.then((c) => Promise.race([precise, delay(graceMs).then(() => c)]).catch(() => c));
  try {
    return await Promise.any([precise, coarseThenWait]);
  } catch (e) {
    const errors = e instanceof AggregateError ? e.errors : [e];
    if (errors.some((x) => x instanceof LocationDeniedError)) throw errors.find((x) => x instanceof LocationDeniedError);
    if (errors.every((x) => x instanceof LocationTimeoutError)) throw errors[0];
    throw errors.find((x) => x instanceof LocationUnavailableError) ?? new LocationUnavailableError("No position available");
  }
}
