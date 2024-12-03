import { useOrderStore } from "@/services/OrderService";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  customerDetails: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerEditButton: {
    backgroundColor: '#00f',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default function Order() {
  const { orders, customer } = useOrderStore();
  const orderItems: JSX.Element[] = [];
  orders.forEach((value) => {
    orderItems.push(<Text key={value.product.id}>{ value.product.label } x { value.count }</Text>);
  });
  return (
    <View style={[styles.container]}>
      <View style={[styles.customerDetails]}>
        <View>
          <Text>Name: </Text><Text style={{ fontWeight: 'bold' }}>{customer.name}</Text>
        </View>
        <View>
          <Link href="/sales/customer">
            <View style={[styles.customerEditButton]}>
              <Text style={{ color: '#fff' }}>Edit</Text>
            </View>
          </Link>
        </View>
      </View>
      <View style={{ borderBottomColor: '#eee', borderBottomWidth: 1, width: '90%', marginVertical: 8 }} />
      <View>
        {orderItems}
      </View>
    </View>
  );
}