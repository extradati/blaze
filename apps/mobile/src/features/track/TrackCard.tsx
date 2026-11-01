import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TRACK_COLOR } from "@/features/map/config";
import type { Track } from "./types";

type Props = { track: Track; onRemove: () => void };

export function TrackCard({ track, onRemove }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.card, { top: insets.top + 12 }]} testID="track-card">
      <View style={styles.swatch} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{track.name ?? t("track.untitled")}</Text>
        <Text style={styles.meta}>{t("track.distance", { km: (track.distanceM / 1000).toFixed(1) })}</Text>
      </View>
      <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={t("track.remove")} hitSlop={8}>
        <MaterialIcons name="close" size={22} color="#444" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute", left: 12, right: 64, flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "white", maxWidth: 420,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  swatch: { width: 6, alignSelf: "stretch", borderRadius: 3, backgroundColor: TRACK_COLOR },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: "#222" },
  meta: { fontSize: 13, color: "#555" },
});
