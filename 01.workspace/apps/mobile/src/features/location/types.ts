import type { LngLat } from "@/features/map/config";

export type UserPosition = { center: LngLat; accuracy: number; time: number }; // accuracy in metres, time = fix time (ms epoch)

export class LocationDeniedError extends Error {}
export class LocationUnavailableError extends Error {}
export class LocationTimeoutError extends Error {}
