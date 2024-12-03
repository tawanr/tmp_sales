import { useOrderStore } from "@/services/OrderService";
import { Text, View } from "react-native";

export default function Order() {
  const { orders } = useOrderStore();
  console.log(orders);
  const orderItems: JSX.Element[] = [];
  orders.forEach((value) => {
    orderItems.push(<Text key={value.product.id}>{ value.product.label } x { value.count }</Text>);
  });
  return (
    <View>
      {orderItems}
    </View>
  );
}