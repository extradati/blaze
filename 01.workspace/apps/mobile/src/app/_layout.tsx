import "@/i18n";
import { Stack } from "expo-router";
import { registerServiceWorker } from "@/features/offline/registerServiceWorker";

registerServiceWorker();

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
