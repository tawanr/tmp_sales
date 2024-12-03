import pb from "@/utils/pocketbase";
import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  if (pb.authStore.isValid) {
    router.push("/");
  }
  return (
    <View>
      <View>
        <Text>Email</Text>
        <TextInput placeholder="Email" />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput placeholder="Password" />
      </View>
      <View>
        <Pressable>
          <Text>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
