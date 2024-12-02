import { useEffect, useState } from 'react';
import { getProducts, Product } from '@/services/ProductService';
import { SafeAreaView, View, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';

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
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexGrow: 1,
    width: '100%',
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
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

type Props = {
  rowCount: number;
};

export default function ProductList({rowCount = 3}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts().then((productList) => {
      setProducts(productList);
    });
  }, []);

  const selectProductDetails = (product: Product) => {
    setModalVisible(true);
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const addProduct = (product: Product, count: number) => {
    console.log(JSON.stringify(product));
    console.log(count);
  };

  const reloadList = () => {
    getProducts(searchTerm).then((productList) => {
      setProducts(productList);
    });
  }

  let modalContent = null;
  if (selectedProduct) {
    modalContent = (
    <TouchableOpacity onPress={closeModal} activeOpacity={1} style={[styles.modalBackground]}>
      <ProductDetails product={selectedProduct} close={closeModal} callback={addProduct} />
    </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} transparent={true}>
        {modalContent}
      </Modal>
      <View style={[styles.searchBarContainer]}>
        <TextInput style={[styles.searchBar]} placeholder="Search" onChangeText={setSearchTerm} onEndEditing={reloadList} value={searchTerm} placeholderTextColor={'#999'} />
      </View>
      <View style={{ flex: 1, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={[styles.listContainer]}>
          {products.map((product, index) => {
            return <ProductCard key={product.id} product={product} callback={selectProductDetails} />;
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}