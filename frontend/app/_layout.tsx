import { Stack } from "expo-router";

import "@/assets/css/global.css";
import "@/assets/css/output.css";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  </Stack>
}
