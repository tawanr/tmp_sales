import { useUserStore } from "@/services/UserService";
import pb from "@/utils/pocketbase";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  const { user } = useUserStore();
  const logout = () => {
    pb.authStore.clear();
    router.push("/");
  };
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        padding: 30,
      }}
    >
      <Text>{user.name}</Text>
      <Pressable onPress={logout}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00f",
            padding: 10,
          }}
        >
          <Text style={{ color: "#fff" }}>Logout</Text>
        </View>
      </Pressable>
    </View>
  );
}
