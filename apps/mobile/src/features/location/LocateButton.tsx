import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

type Props = { onPress: () => void; busy: boolean };

export function LocateButton({ onPress, busy }: Props) {
  return (
    <Pressable onPress={onPress} disabled={busy} style={styles.button} accessibilityRole="button" accessibilityLabel="Show my location">
      {busy ? <ActivityIndicator color="#1a73e8" /> : <MaterialIcons name="my-location" size={24} color="#1a73e8" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute", right: 16, bottom: 48, width: 48, height: 48, borderRadius: 24,
    backgroundColor: "white", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
});
