import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

type Props = { icon: ComponentProps<typeof MaterialIcons>["name"]; label: string; onPress: () => void; busy?: boolean };

/** Round floating button for map controls. */
export function MapButton({ icon, label, onPress, busy = false }: Props) {
  return (
    <Pressable onPress={onPress} disabled={busy} style={styles.button} accessibilityRole="button" accessibilityLabel={label}>
      {busy ? <ActivityIndicator color="#1a73e8" /> : <MaterialIcons name={icon} size={24} color="#1a73e8" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "white", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
});
