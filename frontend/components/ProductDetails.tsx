import { Product } from "@/services/ProductService";
import {
  Modal,
  Text,
  Image,
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import { API_URL } from "@/utils/constants";
import { useState } from "react";
import Button from "./Button";

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
    gap: 10,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginVertical: 12,
    overflow: "hidden",
  },
  minusButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  plusButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  countButtonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  countInput: {
    flex: 1,
    height: 48,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e9ecef",
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
            <Image
              source={{ uri: image_path }}
              style={[styles.cardImage]}
            />
            <View style={[styles.countRow]}>
              <Pressable
                onPress={() => setCount(Math.max(1, count - 1))}
                style={({ pressed }) => [
                  styles.minusButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={styles.countButtonText}>−</Text>
              </Pressable>
              <TextInput
                style={styles.countInput}
                value={count.toString()}
                onChangeText={convertCount}
                keyboardType="number-pad"
                selectTextOnFocus={true}
              />
              <Pressable
                onPress={() => setCount(count + 1)}
                style={({ pressed }) => [
                  styles.plusButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={styles.countButtonText}>+</Text>
              </Pressable>
            </View>
            <View style={[styles.buttonsRow]}>
              <Button
                title="ยกเลิก"
                onPress={close}
                variant="destructive"
              />
              <Button
                title="เพิ่ม"
                onPress={addProduct}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
