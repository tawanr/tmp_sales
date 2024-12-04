import { PRIMARY_LIGHT } from "@/utils/constants";
import pb from "@/utils/pocketbase";
import { Redirect, router, Stack, useRootNavigationState } from "expo-router";

export default function RootLayout() {
  if (!pb.authStore.isValid) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack
      screenOptions={{
        statusBarBackgroundColor: PRIMARY_LIGHT,
        navigationBarColor: PRIMARY_LIGHT,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
