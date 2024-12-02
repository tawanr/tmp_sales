import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getProducts } from '@/services/ProductService';
import { ListResult, RecordModel } from 'pocketbase';

export default function Sales() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    getProducts().then((productList) => {
      setProducts(productList.items);
      console.log(productList);
    });
  }, []);
  return (
    <View>
      {products.map((product) => {
        return <Text key={product.id}>{product.label}</Text>;
      })}
    </View>
  );
}