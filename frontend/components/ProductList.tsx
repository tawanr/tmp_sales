import { useEffect, useState } from 'react';
import { getProducts, Product } from '@/services/ProductService';
import { SafeAreaView, View, StyleSheet, TextInput } from 'react-native';
import ProductCard from './ProductCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  searchBarContainer: {
    width: '100%',
    height: 50,
    padding: 6,
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#ddd',
    height: 40,
    padding: 10,
    borderRadius: 6,
  }
});

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    getProducts().then((productList) => {
      setProducts(productList);
      console.log(productList);
    });
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.searchBarContainer]}>
        <TextInput style={[styles.searchBar]} placeholder="Search" onChangeText={setSearchTerm} value={searchTerm} placeholderTextColor={'#999'} />
      </View>
      <View style={[styles.listContainer]}>
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </View>
    </SafeAreaView>
  );
}