import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

type Props = { text: string; onClose: () => void; style?: ViewStyle };

/** Speech bubble with an arrow on its bottom-right, pointing at a control below it. */
export function Hint({ text, onClose, style }: Props) {
  const { t } = useTranslation();
  return (
    <View style={[styles.bubble, style]}>
      <Text style={styles.text}>{text}</Text>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={t("hint.close")} hitSlop={8}>
        <MaterialIcons name="close" size={18} color="white" />
      </Pressable>
      <View style={styles.arrow} />
    </View>
  );
}

const BG = "#0b2545"; // dark blue: stands out on the colorful topo map

const styles = StyleSheet.create({
  bubble: {
    position: "absolute", flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: BG, maxWidth: 260,
    borderWidth: 1.5, borderColor: "white",
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 6,
  },
  text: { color: "white", fontSize: 15, flexShrink: 1 },
  arrow: {
    position: "absolute", bottom: -7, right: 18, width: 12, height: 12,
    backgroundColor: BG, borderColor: "white", borderRightWidth: 1.5, borderBottomWidth: 1.5, transform: [{ rotate: "45deg" }],
  },
});
