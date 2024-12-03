import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert } from "react-native";
import { API_URL } from "@/utils/constants";
import { Product } from "@/services/ProductService";

type Props = {
  product: Product;
  callback: (product: Product) => void;
  columnCount: number;
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
    flexBasis: "23%",
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
  },
  cardBody: {
    padding: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  cardImage: {
    resizeMode: "cover",
    borderRadius: 4,
  },
  cardPrice: {
    fontSize: 12,
    textAlign: "right",
    width: "100%",
  },
});

export default function ProductCard({ product, callback, columnCount = 3 }: Props) {
  const image_path = `${API_URL}/api/files/products/${product.id}/${product.image}`;

  const onProductPress = () => {
    callback(product);
  };

  return (
    <View style={[styles.card, { flexBasis: `${100 / columnCount - 1}%` }]}>
      <TouchableHighlight onPress={onProductPress} underlayColor="white">
        <View style={[styles.cardBody]}>
          <Image
            source={{ uri: image_path }}
            style={[styles.cardImage]}
            resizeMode="cover"
            height={400 / columnCount}
          />
          <Text
            style={[styles.cardTitle, { fontSize: 16 - columnCount / 2 }]}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {product.label}
          </Text>
          <Text
            style={[styles.cardPrice, { fontSize: 16 - columnCount }]}
            numberOfLines={1}
          >
            {product.price}x{product.kg}กก
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}
