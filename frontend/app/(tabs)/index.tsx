import pb from "@/utils/pocketbase";
import { router } from "expo-router";
import { Image, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#11e",
      }}
    >
      <Image
        source={require("@/assets/images/TMP_logo-01.png")}
        style={{ width: 300, resizeMode: "contain" }}
      />
    </View>
  );
}
