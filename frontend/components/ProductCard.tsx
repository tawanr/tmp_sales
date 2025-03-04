import React from "react";
import { View, Text, StyleSheet, TouchableHighlight, Alert } from "react-native";
import { API_URL } from "@/utils/constants";
import { Product } from "@/services/ProductService";
import { Image } from "expo-image";

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
    padding: 0,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  cardImage: {
    resizeMode: "cover",
    borderRadius: 4,
  },
  cardPrice: {
    fontSize: 10,
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
            style={[styles.cardImage, { height: 400 / columnCount }]}
            contentFit="cover"
            cachePolicy="disk"
          />
          <Text
            style={[styles.cardTitle, { fontSize: 16 - columnCount }]}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {product.label}
          </Text>
          <Text
            style={[styles.cardPrice, { fontSize: 14 - columnCount }]}
            numberOfLines={1}
          >
            {product.price}x{product.kg}กก
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}
