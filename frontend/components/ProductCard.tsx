import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { API_URL } from '@/utils/constants';
import { Product } from '@/services/ProductService';

type Props = {
  product: Product;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    padding: 2,
    margin: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    flex: 1,
  },
  cardBody: {
    padding: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  cardPrice: {
    fontSize: 12,
    textAlign: 'right',
  }
});

export default function ProductCard({product}: Props) {
  const image_path = `${API_URL}/api/files/products/${product.id}/${product.image}`;
  console.log("image path", image_path);
  return (
    <View style={[styles.card]}>
      <View style={[styles.cardBody]}>
        <Image source={{ uri: image_path }} style={[styles.cardImage]} />
        <Text style={[styles.cardTitle]} ellipsizeMode='tail' numberOfLines={1}>{product.label}</Text>
        <Text style={[styles.cardPrice]}>{product.price} x {product.kg}</Text>
      </View>
    </View>
  );
}