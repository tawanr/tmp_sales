import { useEffect, useState } from 'react';
import { getProducts, Product } from '@/services/ProductService';
import { SafeAreaView, View, StyleSheet, TextInput, Modal, TouchableOpacity, Pressable, Text, Image } from 'react-native';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import { Link } from 'expo-router';
import OrderDetails from './OrderDetails';
import { useOrderStore } from '@/services/OrderService';

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
  shoppingIconContainer: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 15,
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  shoppingIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    padding: 5,
  }
});

type Props = {
  columnCount: number;
};

export default function ProductList({columnCount = 3}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const addItem = useOrderStore((state) => state.addItem);

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
    addItem({ product, count });
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
      <Modal visible={orderModalVisible} onRequestClose={() => setOrderModalVisible(false)}>
        <OrderDetails />
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
      <View style={[styles.shoppingIconContainer]}>
        <Link href="/sales/order">
          <Image source={require('../assets/images/shopping-cart.png')} style={[styles.shoppingIcon]} />
        </Link>
      </View>
    </SafeAreaView>
  );
}