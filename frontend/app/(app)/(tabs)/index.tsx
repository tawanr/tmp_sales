import { PRIMARY_LIGHT } from "@/utils/constants";
import { Image, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PRIMARY_LIGHT,
      }}
    >
      <Image
        source={require("@/assets/images/TMP_logo-01.png")}
        style={{ width: 300, resizeMode: "contain" }}
      />
    </View>
  );
}
