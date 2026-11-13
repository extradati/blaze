import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TRACK_COLOR } from "@/features/map/config";
import type { OfflineMapState } from "@/features/offline/useOfflineMap";
import type { Track } from "./types";

type Props = { track: Track; offline: OfflineMapState | null; onRemove: () => void };

export function TrackCard({ track, offline, onRemove }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.card, { top: insets.top + 12 }]} testID="track-card">
      <View style={styles.swatch} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{track.name ?? t("track.untitled")}</Text>
        <Text style={styles.meta}>{t("track.distance", { km: (track.distanceM / 1000).toFixed(1) })}</Text>
        {offline && (
          <View style={styles.offline} testID="offline-status" accessibilityLiveRegion="polite">
            <MaterialIcons name={OFFLINE_ICON[offline.status]} size={14} color={offline.status === "done" ? "#2e7d32" : "#555"} />
            <Text style={styles.meta}>
              {offline.status === "saving" ? t("offline.saving", { percent: Math.floor(offline.progress * 100) }) : t(`offline.${offline.status}`)}
            </Text>
          </View>
        )}
      </View>
      <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={t("track.remove")} hitSlop={8}>
        <MaterialIcons name="close" size={22} color="#444" />
      </Pressable>
    </View>
  );
}

const OFFLINE_ICON = { saving: "downloading", done: "offline-pin", paused: "cloud-off", failed: "error-outline" } as const;

const styles = StyleSheet.create({
  card: {
    position: "absolute", left: 12, right: 64, flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "white", maxWidth: 420,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  swatch: { width: 6, alignSelf: "stretch", borderRadius: 3, backgroundColor: TRACK_COLOR },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: "#222" },
  meta: { fontSize: 13, color: "#555", flexShrink: 1 },
  offline: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
});
