import type { UserPosition } from "@/features/location/types";
import type { Bounds, Track } from "@/features/track/types";
import type { LngLat } from "./config";

/** Camera target; a new object re-triggers the move even for the same coordinates. */
export type MapFocus = { center: LngLat; zoom: number } | { bounds: Bounds };

export type TrekMapProps = { focus: MapFocus | null; userPosition: UserPosition | null; track: Track | null };
