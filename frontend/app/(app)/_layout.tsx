import { PRIMARY_LIGHT } from "@/utils/constants";
import pb from "@/utils/pocketbase";
import { Redirect, Stack } from "expo-router";
import { StatusBar, View } from "react-native";

export default function RootLayout() {
  if (!pb.authStore.isValid) {
    return <Redirect href="/login" />;
  }
  return (
    <View style={{ backgroundColor: PRIMARY_LIGHT, width: "100%", height: "100%" }}>
      <StatusBar barStyle={"dark-content"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
