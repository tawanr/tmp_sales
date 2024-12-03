import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert } from "react-native";
import { API_URL } from "@/utils/constants";
import { Product } from "@/services/ProductService";

type Props = {
  product: Product;
  callback: (product: Product) => void;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    padding: 2,
    margin: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 1.7,
    flexBasis: "48%",
    height: "40%",
  },
  cardBody: {
    padding: 5,
    flex: 1,
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  cardImage: {
    flex: 1,
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 4,
  },
  cardPrice: {
    fontSize: 12,
    textAlign: "right",
  },
});

export default function ProductCard({ product, callback }: Props) {
  const image_path = `${API_URL}/api/files/products/${product.id}/${product.image}`;

  const onProductPress = () => {
    callback(product);
  };

  return (
    <TouchableHighlight
      onPress={onProductPress}
      style={[styles.card]}
      underlayColor="white"
    >
      <View style={[styles.cardBody]}>
        <Image source={{ uri: image_path }} style={[styles.cardImage]} />
        <Text style={[styles.cardTitle]} ellipsizeMode="tail" numberOfLines={1}>
          {product.label}
        </Text>
        <Text style={[styles.cardPrice]}>
          {product.price} x {product.kg}
        </Text>
      </View>
    </TouchableHighlight>
  );
}
