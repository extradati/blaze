import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

type Props = { kind: "start" | "finish" };

/** Map pin for a track end: green flag = start, checkered flag = finish. Anchor at its bottom. */
export function TrackFlag({ kind }: Props) {
  const { t } = useTranslation();
  const color = kind === "start" ? "#2e7d32" : "#111111";
  return (
    <View style={styles.pin} accessibilityLabel={t(`track.${kind}`)} testID={`track-flag-${kind}`}>
      <View style={[styles.badge, { borderColor: color }]}>
        <MaterialIcons name={kind === "start" ? "flag" : "sports-score"} size={18} color={color} />
      </View>
      <View style={[styles.pointer, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pin: { alignItems: "center", width: 32, height: 40 },
  badge: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2, backgroundColor: "white", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 3, zIndex: 1,
  },
  pointer: { width: 8, height: 8, marginTop: -4, transform: [{ rotate: "45deg" }] },
});
