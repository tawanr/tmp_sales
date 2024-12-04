import { useUserStore } from "@/services/UserService";
import { PRIMARY_DARK, PRIMARY_LIGHT } from "@/utils/constants";
import pb from "@/utils/pocketbase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_DARK,
  },
  input: {
    backgroundColor: PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 6,
    margin: 6,
    width: 200,
  },
  loginButton: {
    margin: 10,
  },
});

const checkAuth = () => {
  if (pb.authStore.isValid) {
    router.push("/");
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { setUser } = useUserStore();

  const login = () => {
    const authData = pb.collection("users").authWithPassword(email, password);
    authData
      .then((data) => {
        setUser({ id: data.record.id, name: data.record.name });
        router.push("/");
      })
      .catch((error) => {
        setErrors(error.message);
        setTimeout(() => {
          setErrors("");
        }, 5);
      });
  };

  checkAuth();
  return (
    <View style={[styles.container]}>
      <Pressable style={[styles.container]} onPress={() => Keyboard.dismiss()}>
        <Text style={{ color: "#e00" }}>{errors}</Text>
        <View style={[styles.input]}>
          <TextInput
            placeholder="Email"
            style={{ color: "#eee" }}
            placeholderTextColor={"#aaa"}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={[styles.input]}>
          <TextInput
            placeholder="Password"
            style={{ color: "#eee" }}
            placeholderTextColor={"#aaa"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={[styles.loginButton]}>
          <Pressable onPress={login}>
            <Text style={{ color: "#eee" }}>Login</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}
