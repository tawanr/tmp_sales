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
  calculateTotalWeight,
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
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useAnimatedValue,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";
import * as Clipboard from "expo-clipboard";
import ContainerSelector from "@/components/ContainerSelector";
import ContainerManager from "@/services/ContainerService";

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
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 10,
  },
  customerSelectButton: {
    backgroundColor: "#00f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  customerEditButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
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
  productSection: {
    flex: 1,
    minHeight: 120, // Ensure at least space for one product item
    width: "100%",
  },
  productTitle: {
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  containerSection: {
    width: "60%",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    height: 40,
  },
  containerHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  fixedBottomSection: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 10,
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
  const { orders, customer, deliveryDetails, orderOptions, containerManager } =
    useOrderStore(
      useShallow((state) => ({
        orders: state.orders,
        customer: state.customer,
        deliveryDetails: state.deliveryDetails,
        orderOptions: state.orderOptions,
        containerManager: state.containerManager,
      }))
    );
  const {
    toggleIsDelivery,
    changeDeliveryCost,
    updateOrderCustomer,
    toggleIsWithoutDetails,
    toggleOrderType,
    setProductLocation,
    updateContainerManager,
  } = useOrderStore();
  const { user } = useUserStore();
  const [summary, setSummary] = useState("");
  const ordersList = Array.from(orders.values());
  const copiedOpacity = useAnimatedValue(0);
  const [isOptionsOpen, setOptionsOpen] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { isWithoutDetails, orderType } = orderOptions;
  const [isContainerSelectorVisible, setIsContainerSelectorVisible] =
    useState(false);

  const locationOptions = ["-", "เบิก TMP", "เบิกคิงเวลล์"];

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
      user,
      containerManager
    );
    sentOrder
      .then(() => {
        clearItems();
        updateOrderCustomer(createEmptyCustomer());
        resetDeliveryDetails();
        // Clear container manager and update state
        if (containerManager) {
          containerManager.clear();
          updateContainerManager(containerManager);
        } else {
          updateContainerManager(new ContainerManager());
        }
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

  const handleContainerChange = (manager: ContainerManager) => {
    if (!manager) return;
    updateContainerManager(manager);
  };

  const toggleOptionsDialog = () => {
    setOptionsOpen(!isOptionsOpen);
  };

  useEffect(() => {
    if (!orderType) {
      setSummary(
        generateOrderSummary(
          orders,
          customer,
          deliveryDetails,
          orderOptions,
          containerManager
        )
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
    containerManager,
  ]);

  useEffect(() => {
    setProductLocation(selectedLocation);
  }, [selectedLocation]);

  // Initialize container manager on component mount
  // useEffect(() => {
  //   // Ensure the container manager is properly initialized
  //   if (!containerManager) {
  //     updateContainerManager(new ContainerManager());
  //   } else if (
  //     containerManager &&
  //     containerManager.isEmpty() &&
  //     deliveryDetails.containers
  //   ) {
  //     try {
  //       containerManager.deserialize(deliveryDetails.containers);
  //       updateContainerManager(containerManager);
  //     } catch (error) {
  //       console.warn("Failed to deserialize container data:", error);
  //     }
  //   }
  // }, [deliveryDetails.containers]);
  // }, [containerManager, deliveryDetails.containers, updateContainerManager]);

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
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View>
            <Text>ชื่อลูกค้า: </Text>
            <Text style={{ fontWeight: "bold" }}>{customer.name || "-"}</Text>
          </View>
        </View>
        <View>
          <Link href="/sales/customer-list">
            <View style={[styles.customerSelectButton]}>
              <Text style={{ color: "#fff" }}>เลือก</Text>
            </View>
          </Link>
        </View>
        <View>
          <Link href="/sales/customer">
            <View style={[styles.customerEditButton]}>
              <Text style={{ color: "#000" }}>แก้ไข</Text>
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
      <Text style={[styles.productTitle]}>รายการสินค้า</Text>
      {/* Product List Section - Flexible height with minimum space */}
      <View style={styles.productSection}>
        <FlatList
          data={ordersList}
          renderItem={({ item }) => <OrderListItem order={item} />}
          keyExtractor={(item) => item.product.id}
          style={{
            flex: 1,
            width: "100%",
          }}
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            padding: 6,
            rowGap: 6,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        />
      </View>
      {/* Delivery Options Section */}
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
          {deliveryDetails.isDeliver ? (
            <View style={styles.containerSection}>
              <Pressable
                style={styles.containerHeader}
                onPress={() => setIsContainerSelectorVisible(true)}
              >
                <Text style={styles.containerHeaderText}>
                  {`บรรจุภัณฑ์${
                    containerManager && containerManager.getTotalQuantity() > 0
                      ? ` (${containerManager.getTotalQuantity()} ใบ)`
                      : " - ยังไม่ได้เลือก"
                  }`}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.countControls, { marginRight: 0 }]}>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  minWidth: 100,
                }}
                onPress={() => setLocationModalVisible(true)}
              >
                <Text style={{ textAlign: "center" }}>
                  {selectedLocation || "เลือกที่เบิก"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Floating Container Selector Modal */}
      <Modal
        visible={isContainerSelectorVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsContainerSelectorVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              width: "100%",
              maxWidth: 500,
              maxHeight: "80%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#e9ecef",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                เลือกบรรจุภัณฑ์
              </Text>
              <Pressable
                onPress={() => setIsContainerSelectorVisible(false)}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <FontAwesome
                  name="times"
                  size={16}
                  color="#666"
                />
              </Pressable>
            </View>

            {containerManager && (
              <ScrollView
                style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                showsVerticalScrollIndicator={true}
              >
                <ContainerSelector
                  containerManager={containerManager}
                  onContainerChange={handleContainerChange}
                  totalWeight={calculateTotalWeight(orders)}
                  style={{ marginHorizontal: 0 }}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      {/* Fixed Bottom Section */}
      <View style={styles.fixedBottomSection}>
        <View
          style={{
            width: "90%",
            marginBottom: 8,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
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
      </View>
      {/* End fixedBottomSection */}
      {/* Location Selection Modal */}
      <Modal
        visible={locationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setLocationModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              width: "80%",
              maxHeight: "60%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              เลือกจุดรับสินค้า
            </Text>
            <FlatList
              data={locationOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                  onPress={() => {
                    if (item === "-") {
                      setSelectedLocation("");
                    } else {
                      setSelectedLocation(item);
                    }
                    setLocationModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
            <Pressable
              style={{
                marginTop: 15,
                backgroundColor: "#ccc",
                paddingVertical: 10,
                borderRadius: 5,
              }}
              onPress={() => setLocationModalVisible(false)}
            >
              <Text style={{ textAlign: "center", fontSize: 16 }}>ยกเลิก</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
