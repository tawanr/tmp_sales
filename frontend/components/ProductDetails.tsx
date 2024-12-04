import { Product } from "@/services/ProductService";
import {
  Modal,
  Text,
  Image,
  StyleSheet,
  View,
  Pressable,
  Button,
  TextInput,
  Keyboard,
} from "react-native";
import { API_URL } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

type Props = {
  product: Product;
  close: () => void;
  callback: (product: Product, count: number) => void;
};

const styles = StyleSheet.create({
  cardImage: {
    width: 300,
    flexGrow: 1,
    resizeMode: "cover",
    borderRadius: 4,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 100,
    paddingBottom: 280,
  },
  modalContainer: {
    flex: 1,
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8,
    paddingTop: 5,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  cancelButton: {
    backgroundColor: "#f00",
    borderRadius: 10,
    color: "#f00",
    padding: 10,
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    marginVertical: 6,
  },
  minusButton: {
    backgroundColor: "#aaa",
    borderStartStartRadius: 10,
    borderEndStartRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  plusButton: {
    backgroundColor: "#aaa",
    borderStartEndRadius: 10,
    borderEndEndRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  countText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    width: "40%",
    textAlign: "center",
  },
});

export default function ProductDetails({ product, close, callback }: Props) {
  const image_path = `${API_URL}/api/files/products/${product.id}/${product.image}`;
  const [count, setCount] = useState(1);
  if (isNaN(count) || count < 1) {
    setCount(1);
  }
  const addProduct = () => {
    callback(product, count);
    close();
  };
  const convertCount = (countString: string) => {
    setCount(parseInt(countString));
  };
  return (
    <View style={[styles.detailsContainer]}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View style={[styles.modalContainer]}>
          <View>
            <Text style={[styles.title]}>{product.label}</Text>
            <Image source={{ uri: image_path }} style={[styles.cardImage]} />
            <View style={[styles.countRow]}>
              <Pressable
                onPress={() => setCount(count - 1)}
                style={[styles.minusButton]}
              >
                <Text style={[styles.countText]}>-</Text>
              </Pressable>
              <TextInput
                style={[styles.countText]}
                value={count.toString()}
                onChangeText={convertCount}
                inputMode="numeric"
                // returnKeyType="done"
                selectTextOnFocus={true}
              />
              <Pressable
                onPress={() => setCount(count + 1)}
                style={[styles.plusButton]}
              >
                <Text style={[styles.countText]}>+</Text>
              </Pressable>
            </View>
            <View style={[styles.buttonsRow]}>
              <Button title="Cancel" onPress={close} color={"#f00"} />
              <Button title="Add" onPress={addProduct} />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
