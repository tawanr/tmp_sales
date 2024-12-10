import {
  changeItemAmount,
  clearItems,
  createEmptyCustomer,
  finishOrder,
  generateOrderSummary,
  generateWithdrawalSummary,
  OrderItem,
  removeItem,
  resetDeliveryDetails,
  useOrderStore,
} from "@/services/OrderService";
import { useUserStore } from "@/services/UserService";
import { API_URL, PRIMARY_DARK, PRIMARY_LIGHT } from "@/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useAnimatedValue,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";
import * as Clipboard from "expo-clipboard";

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
  optionsDialog: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    zIndex: 100,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 5,
    right: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
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
        <Image
          source={{ uri: image_path }}
          style={{ width: 50, height: 50 }}
        />
        <View>
          <Text
            ellipsizeMode="tail"
            style={{ fontWeight: "bold" }}
          >
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
  const { orders, customer, deliveryDetails, orderOptions } = useOrderStore(
    useShallow((state) => ({
      orders: state.orders,
      customer: state.customer,
      deliveryDetails: state.deliveryDetails,
      orderOptions: state.orderOptions,
    }))
  );
  const {
    toggleIsDelivery,
    changeContainerCount,
    changeDeliveryCost,
    updateCustomer,
    toggleIsWithoutDetails,
    toggleOrderType,
    togglePackageType,
  } = useOrderStore();
  const { user } = useUserStore();
  const [summary, setSummary] = useState("");
  const ordersList = Array.from(orders.values());
  const copiedOpacity = useAnimatedValue(0);
  const [isOptionsOpen, setOptionsOpen] = useState(false);
  const { isWithoutDetails, orderType, packageType } = orderOptions;

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

  const onSubmit = () => {
    const sentOrder = finishOrder(
      orders,
      customer,
      deliveryDetails,
      summary,
      user
    );
    sentOrder
      .then(() => {
        clearItems();
        updateCustomer(createEmptyCustomer());
        resetDeliveryDetails();
      })
      .catch((errors) => {
        console.error(errors);
      });
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(summary);
    copiedOpacity.setValue(1);
    setTimeout(() => {
      Animated.timing(copiedOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2500);
  };

  const toggleOptionsDialog = () => {
    setOptionsOpen(!isOptionsOpen);
  };

  useEffect(() => {
    if (!orderType) {
      setSummary(
        generateOrderSummary(orders, customer, deliveryDetails, orderOptions)
      );
    } else {
      setSummary(
        generateWithdrawalSummary(
          orders,
          customer,
          deliveryDetails,
          orderOptions
        )
      );
    }
  }, [
    orders,
    customer,
    deliveryDetails,
    orderType,
    isWithoutDetails,
    packageType,
  ]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container]}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={toggleOptionsDialog}
              style={{ margin: 5 }}
            >
              <FontAwesome
                name="bars"
                size={20}
                color="#222"
              />
            </Pressable>
          ),
        }}
      />
      <View style={[styles.optionsDialog, { opacity: isOptionsOpen ? 1 : 0 }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>ตัวเลือก</Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: orderType ? "#aaa" : "#222" }}>สินค้า</Text>
          <Switch
            trackColor={{ false: PRIMARY_DARK, true: PRIMARY_LIGHT }}
            value={orderType}
            onValueChange={toggleOrderType}
            ios_backgroundColor={PRIMARY_DARK}
          />
          <Text style={{ color: !orderType ? "#aaa" : "#222" }}>
            เบิกสินค้า
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: packageType ? "#aaa" : "#222" }}>โฟม</Text>
          <Switch
            trackColor={{ false: PRIMARY_DARK, true: PRIMARY_LIGHT }}
            value={packageType}
            onValueChange={togglePackageType}
            ios_backgroundColor={PRIMARY_DARK}
          />
          <Text style={{ color: !packageType ? "#aaa" : "#222" }}>ถุงดำ</Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Switch
            trackColor={{ false: PRIMARY_DARK, true: PRIMARY_LIGHT }}
            value={isWithoutDetails}
            onValueChange={toggleIsWithoutDetails}
            ios_backgroundColor={PRIMARY_DARK}
          />
          <Text>เฉพาะสินค้า</Text>
        </View>
      </View>
      <View style={[styles.customerDetails]}>
        <View>
          <Text>ชื่อลูกค้า: </Text>
          <Text style={{ fontWeight: "bold" }}>{customer.name || "-"}</Text>
        </View>
        <View>
          <Link href="/sales/customer">
            <View style={[styles.customerEditButton]}>
              <Text style={{ color: "#fff" }}>แก้ไข</Text>
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
      <Text style={{ marginBottom: 5, fontWeight: "bold" }}>รายการสินค้า</Text>
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
              style={{
                textAlign: "center",
                width: 50,
                borderWidth: 1,
                height: 30,
              }}
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
              style={{
                textAlign: "center",
                width: 30,
                borderWidth: 1,
                height: 30,
              }}
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
        <View
          style={{
            position: "absolute",
            top: 20,
            right: 15,
            flexDirection: "row",
          }}
        >
          <Animated.Text
            style={{
              marginRight: 5,
              color: "#999",
              opacity: copiedOpacity,
            }}
          >
            คัดลอก
          </Animated.Text>
          <Pressable onPress={copyToClipboard}>
            <FontAwesome
              name="copy"
              size={20}
              color="#888"
            />
          </Pressable>
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
          <Pressable onPress={onSubmit}>
            <Text style={{ color: "#fff" }}>เสร็จสิ้น</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
