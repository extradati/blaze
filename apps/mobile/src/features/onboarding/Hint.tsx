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

const styles = StyleSheet.create({
  bubble: {
    position: "absolute", flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#1a73e8", maxWidth: 260,
  },
  text: { color: "white", fontSize: 15, flexShrink: 1 },
  arrow: {
    position: "absolute", bottom: -6, right: 18, width: 12, height: 12,
    backgroundColor: "#1a73e8", transform: [{ rotate: "45deg" }],
  },
});
