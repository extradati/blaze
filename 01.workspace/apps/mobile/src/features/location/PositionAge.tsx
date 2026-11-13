import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import { timeAgo, useNow } from "@/lib/timeAgo";

/** Small label under a saved (not live) position dot, e.g. "2 h ago". */
export function PositionAge({ time }: { time: number }) {
  const { t } = useTranslation();
  const { key, count } = timeAgo(time, useNow());
  return <Text style={styles.label} testID="position-age">{t(key, { count })}</Text>;
}

const styles = StyleSheet.create({
  label: {
    paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8, overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.9)", color: "#555", fontSize: 12,
  },
});
