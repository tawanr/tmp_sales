import { PRIMARY_DARK, PRIMARY_LIGHT } from "@/utils/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";

type IconName = ComponentProps<typeof FontAwesome>["name"];

// Tab tint colors are plain strings (see screenOptions), so narrowing is safe.
const tabIcon =
  (name: IconName) =>
  ({ color }: { color: ColorValue }) => (
    <FontAwesome
      size={28}
      name={name}
      color={color as string}
    />
  );

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_LIGHT,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: tabIcon("file"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: tabIcon("shopping-cart"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: tabIcon("cog"),
        }}
      />
    </Tabs>
  );
}
