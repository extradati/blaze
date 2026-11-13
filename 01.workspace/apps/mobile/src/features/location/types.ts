import type { LngLat } from "@/features/map/config";

export type UserPosition = { center: LngLat; accuracy: number }; // accuracy in metres

export class LocationDeniedError extends Error {}
export class LocationUnavailableError extends Error {}
export class LocationTimeoutError extends Error {}
