import { useEffect, useState } from "react";
import { getProducts, Product } from "@/services/ProductService";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Pressable,
  Text,
  Image,
  ScrollView,
} from "react-native";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import { Link } from "expo-router";
import OrderDetails from "./OrderDetails";
import { useOrderStore } from "@/services/OrderService";
import { FlatList } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 1,
    width: "100%",
  },
  searchBarContainer: {
    width: "100%",
    height: 50,
    padding: 6,
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#ddd",
    height: 40,
    padding: 10,
    borderRadius: 6,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  shoppingIconContainer: {
    width: 50,
    height: 50,
    position: "absolute",
    right: 15,
    bottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 100,
    shadowColor: "#000",
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
    resizeMode: "contain",
    padding: 5,
  },
});

type Props = {
  columnCount: number;
};

export default function ProductList({ columnCount = 3 }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const addItem = useOrderStore((state) => state.addItem);
  const productCount = useOrderStore((state) => state.orders.size);

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
    setRefreshing(true);
    getProducts(searchTerm).then((productList) => {
      setProducts(productList);
    });
    setRefreshing(false);
  };

  let modalContent = null;
  if (selectedProduct) {
    modalContent = (
      <TouchableOpacity
        onPress={closeModal}
        activeOpacity={1}
        style={[styles.modalBackground]}
      >
        <ProductDetails
          product={selectedProduct}
          close={closeModal}
          callback={addProduct}
        />
      </TouchableOpacity>
    );
  }

  let badge = null;
  if (productCount > 0) {
    badge = (
      <View
        style={{
          position: "absolute",
          bottom: -5,
          left: -5,
          borderRadius: 100,
          backgroundColor: "#e00",
          width: 20,
          height: 20,
          alignContent: "center",
          justifyContent: "center",
          flex: 1,
          padding: "auto",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: "#fff",
            width: "100%",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            marginLeft: 6,
            marginTop: 1,
          }}
        >
          {productCount}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        {modalContent}
      </Modal>
      <Modal
        visible={orderModalVisible}
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <OrderDetails />
      </Modal>
      <View style={[styles.searchBarContainer]}>
        <TextInput
          style={[styles.searchBar]}
          placeholder="Search"
          onChangeText={setSearchTerm}
          onEndEditing={reloadList}
          value={searchTerm}
          placeholderTextColor={"#999"}
          enterKeyHint="search"
          selectTextOnFocus={true}
          clearButtonMode="always"
        />
      </View>
      <View style={{ flex: 1, alignContent: "center" }}>
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              callback={selectProductDetails}
              columnCount={columnCount}
            />
          )}
          keyExtractor={(item) => item.id}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentContainerStyle={{
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            padding: 6,
          }}
          numColumns={columnCount}
          onRefresh={reloadList}
          refreshing={refreshing}
        />
      </View>
      <View style={[styles.shoppingIconContainer]}>
        <Link href="/sales/order">
          <Image
            source={require("../assets/images/shopping-cart.png")}
            style={[styles.shoppingIcon]}
          />
        </Link>
        {badge}
      </View>
    </SafeAreaView>
  );
}
