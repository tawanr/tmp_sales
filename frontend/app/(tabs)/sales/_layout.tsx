import { Stack } from "expo-router";

export default function SalesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Sales" }} />
      <Stack.Screen name="order" options={{ title: "Order" }} />
      <Stack.Screen name="customer" options={{ title: "Customer" }} />
      <Stack.Screen name="customer-list" options={{ title: "Customer" }} />
      <Stack.Screen name="customer-create" options={{ title: "Customer" }} />
    </Stack>
  );
}
