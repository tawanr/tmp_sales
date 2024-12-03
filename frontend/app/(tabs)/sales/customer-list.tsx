import { Customer, getCustomers } from "@/services/CustomerService";
import { useOrderStore } from "@/services/OrderService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
    padding: 5,
    flexDirection: "row",
    columnGap: 6,
    alignItems: "center",
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#ddd",
    height: 40,
    padding: 10,
    borderRadius: 6,
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
  customerCard: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
    flexDirection: "row",
  },
});

const CustomerListItem = ({ customer }: { customer: Customer }) => {
  const { updateCustomer } = useOrderStore();
  const selectCustomer = () => {
    updateCustomer(customer);
    router.dismiss();
  };
  return (
    <View style={[styles.customerCard]}>
      <Pressable onPress={selectCustomer} style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontWeight: "bold", width: 150 }}>{customer.name}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {customer.address}
          </Text>
        </View>
        <View>
          <Text>{customer.phone}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const reloadList = () => {
    setRefreshing(true);
    getCustomers(searchTerm).then((customerList) => {
      setCustomers(customerList);
      setRefreshing(false);
    });
  };
  useEffect(() => {
    reloadList();
  }, []);
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.searchBarContainer]}>
        <View style={{ flexGrow: 1 }}>
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
        <View
          style={{
            flexShrink: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "#00e",
            paddingHorizontal: 10,
            borderRadius: 6,
          }}
        >
          <Pressable onPress={() => router.push("/sales/customer-create")}>
            <Text style={{ color: "#fff" }}>เพิ่มลูกค้า</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={customers}
        renderItem={({ item }) => <CustomerListItem customer={item} />}
        keyExtractor={(item) => item.id}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          flex: 1,
          padding: 6,
          rowGap: 6,
        }}
        onRefresh={reloadList}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
}
