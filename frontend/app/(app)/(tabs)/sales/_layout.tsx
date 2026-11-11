import { Stack } from "expo-router";

export default function SalesLayout() {
  return (
    // SDK 58 defaults iOS headers to transparent Liquid Glass, which lets
    // content render underneath. Keep the opaque header layout.
    <Stack screenOptions={{ headerTransparent: false }}>
      <Stack.Screen name="index" options={{ title: "Sales" }} />
      <Stack.Screen name="order" options={{ title: "Order" }} />
      <Stack.Screen name="customer" options={{ title: "Customer" }} />
      <Stack.Screen name="customer-list" options={{ title: "Customer" }} />
      <Stack.Screen name="customer-create" options={{ title: "Customer" }} />
    </Stack>
  );
}
