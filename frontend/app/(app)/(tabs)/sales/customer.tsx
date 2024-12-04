import CustomerFormComponent, { CustomerForm } from "@/components/CustomerForm";
import { useOrderStore } from "@/services/OrderService";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
  inputField: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "70%",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-end",
    paddingBottom: 10,
  },
  inputLabel: {
    fontWeight: "bold",
    alignContent: "center",
    paddingRight: 10,
  },
  fullButton: {
    width: "100%",
    height: 35,
    backgroundColor: "#00e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 5,
  },
});

export default function Customer() {
  const { customer, updateCustomer } = useOrderStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: customer.name,
      address: customer.address,
      phone: customer.phone,
      deliveryNote: customer.deliveryNote,
      deliveryService: customer.deliveryService,
    },
    values: customer,
  });
  const onSubmit = (formData: CustomerForm) => {
    updateCustomer({ ...formData, id: customer.id });
    router.dismiss();
  };
  return (
    <View style={[styles.container]}>
      <View style={[styles.fullButton]}>
        <Pressable
          style={[styles.fullButton]}
          onPress={() => router.push("/sales/customer-list")}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff" }}>เลือกลูกค้า</Text>
          </View>
        </Pressable>
      </View>
      <View style={{ width: "100%", height: "100%" }}>
        <CustomerFormComponent
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </View>
    </View>
  );
}
