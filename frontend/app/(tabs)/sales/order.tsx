import {
  changeItemAmount,
  clearItems,
  generateOrderSummary,
  OrderItem,
  removeItem,
  useOrderStore,
} from "@/services/OrderService";
import { API_URL } from "@/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
  },
  customerDetails: {
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  customerEditButton: {
    backgroundColor: "#00f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  orderCard: {
    width: "100%",
    flexDirection: "row",
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
    justifyContent: "flex-start",
  },
  countControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    marginRight: 25,
    columnGap: 15,
  },
});

const OrderListItem = ({ order }: { order: OrderItem }) => {
  const image_path = `${API_URL}/api/files/products/${order.product.id}/${order.product.image}`;
  return (
    <View style={[styles.orderCard]}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          columnGap: 15,
          paddingHorizontal: 10,
        }}
      >
        <Image source={{ uri: image_path }} style={{ width: 50, height: 50 }} />
        <View>
          <Text ellipsizeMode="tail" style={{ fontWeight: "bold" }}>
            {order.product.label}
          </Text>
          <Text>
            {order.product.price} บาท x {order.product.kg} กก
          </Text>
        </View>
      </View>
      <View style={[styles.countControls]}>
        <Pressable
          onPress={() => {
            if (order.count == 1) {
              removeItem(order.product.id);
              return;
            }
            changeItemAmount(order.product.id, order.count - 1);
          }}
        >
          <Text style={{ fontSize: 26 }}>-</Text>
        </Pressable>
        <TextInput
          style={{ textAlign: "center", width: 30, borderWidth: 1, height: 30 }}
          value={order.count.toString()}
          onChangeText={(text) => {
            let amount = parseInt(text);
            if (amount < 1) {
              removeItem(order.product.id);
              return;
            }
            if (isNaN(amount)) {
              amount = 1;
            }
            changeItemAmount(order.product.id, amount);
          }}
          keyboardType="number-pad"
          selectTextOnFocus={true}
        />
        <Pressable
          onPress={() => {
            changeItemAmount(order.product.id, order.count + 1);
          }}
        >
          <Text style={{ fontSize: 26 }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function Order() {
  const { orders, customer, deliveryDetails } = useOrderStore(
    useShallow((state) => ({
      orders: state.orders,
      customer: state.customer,
      deliveryDetails: state.deliveryDetails,
    }))
  );
  const { toggleIsDelivery, changeContainerCount, changeDeliveryCost } =
    useOrderStore();
  const [summary, setSummary] = useState("");
  useEffect(() => {
    setSummary(generateOrderSummary(orders, customer, deliveryDetails));
  }, [orders, customer, deliveryDetails]);
  const ordersList = Array.from(orders.values());
  const updateContainerCount = (value: string) => {
    let count = parseInt(value);
    if (isNaN(count) || count < 0) {
      count = 0;
    }
    changeContainerCount(count);
  };
  const updateDeliveryCost = (value: string) => {
    let cost = parseFloat(value);
    if (isNaN(cost) || cost < 0) {
      cost = 0;
    }
    changeDeliveryCost(cost);
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container]}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.customerDetails]}>
        <View>
          <Text>Name: </Text>
          <Text style={{ fontWeight: "bold" }}>{customer.name}</Text>
        </View>
        <View>
          <Link href="/sales/customer">
            <View style={[styles.customerEditButton]}>
              <Text style={{ color: "#fff" }}>Edit</Text>
            </View>
          </Link>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: "#eee",
          borderBottomWidth: 1,
          width: "90%",
          marginVertical: 8,
        }}
      />
      <Text style={{ marginBottom: 5 }}>รายการสินค้า</Text>
      <FlatList
        data={ordersList}
        renderItem={({ item }) => <OrderListItem order={item} />}
        keyExtractor={(item) => item.product.id}
        style={{
          width: "100%",
        }}
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          padding: 6,
          rowGap: 6,
        }}
      />
      <View
        style={{
          borderBottomColor: "#eee",
          borderBottomWidth: 1,
          width: "90%",
          marginTop: 15,
        }}
      />
      <View
        style={{
          width: "100%",
          marginVertical: 0,
          marginHorizontal: 15,
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.countControls, { marginRight: 0 }]}>
            <Text>ขนส่ง</Text>
            <Switch
              value={deliveryDetails.isDeliver}
              onValueChange={toggleIsDelivery}
            />
          </View>
          <View style={[styles.countControls, { marginRight: 0 }]}>
            <Text>ค่าขนส่ง</Text>
            <TextInput
              style={{ textAlign: "center", width: 50, borderWidth: 1, height: 30 }}
              value={deliveryDetails.deliveryCost.toString()}
              onChangeText={updateDeliveryCost}
              keyboardType="numeric"
              selectTextOnFocus={true}
            />
          </View>
          <View style={[styles.countControls, { marginRight: 0 }]}>
            <Pressable
              onPress={() => {
                if (deliveryDetails.containerCount === 0) {
                  return;
                }
                changeContainerCount(deliveryDetails.containerCount - 1);
              }}
            >
              <Text style={{ fontSize: 26 }}>-</Text>
            </Pressable>
            <TextInput
              style={{ textAlign: "center", width: 30, borderWidth: 1, height: 30 }}
              value={deliveryDetails.containerCount.toString()}
              onChangeText={updateContainerCount}
              keyboardType="numeric"
              selectTextOnFocus={true}
            />
            <Pressable
              onPress={() => {
                changeContainerCount(deliveryDetails.containerCount + 1);
              }}
            >
              <Text style={{ fontSize: 26 }}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "90%",
          marginBottom: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          multiline={true}
          value={summary}
          onChangeText={setSummary}
          style={{
            width: "100%",
            height: 125,
            marginVertical: 8,
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 10,
          }}
          editable={false}
          selectTextOnFocus={true}
        />
        <View style={{ position: "absolute", top: 20, right: 15 }}>
          {/* <Pressable onPress={() => Clipboard.setString(summary)}> */}
          <FontAwesome name="copy" size={20} color="#888" />
          {/* </Pressable> */}
        </View>
      </View>
      <View style={{ flexDirection: "row", columnGap: 10 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f00",
            height: 35,
            width: 100,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <Pressable onPress={clearItems}>
            <Text style={{ color: "#fff" }}>ล้าง</Text>
          </Pressable>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00d",
            height: 35,
            width: 100,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <Pressable>
            <Text style={{ color: "#fff" }}>บันทึก</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
