import { TrekMap } from "@/features/map/TrekMap";
import { useUserCenter } from "@/features/map/useUserCenter";

export default function MapScreen() {
  return <TrekMap center={useUserCenter()} />;
}
