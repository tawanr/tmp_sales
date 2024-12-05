import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
  callback: () => void;
  close: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 100,
    paddingBottom: 280,
  },
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    elevation: 10,
    backgroundColor: "#fff",
    shadowOpacity: 0.75,
    shadowRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 10,
  },
});

export default function ConfirmModal({ message, callback, close }: Props) {
  return (
    <View style={[styles.container]}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View style={[styles.modalContainer]}>
          <View
            style={{ flex: 3, justifyContent: "flex-start", alignContent: "center" }}
          >
            <Text>{message}</Text>
          </View>
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Pressable onPress={close}>
                <Text>ยกเลิก</Text>
              </Pressable>
            </View>
            <View>
              <Pressable onPress={callback}>
                <Text>ยืนยัน</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
