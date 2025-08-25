import CustomerFormComponent, { CustomerForm } from "@/components/CustomerForm";
import { createCustomer, updateCustomer } from "@/services/CustomerService";
import { useOrderStore } from "@/services/OrderService";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

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
  const { customer, updateOrderCustomer, clearCustomer } = useOrderStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: customer.name,
      deliveryNote: customer.deliveryNote,
      deliveryService: customer.deliveryService,
      carRegistration: customer.carRegistration,
    },
    values: customer,
  });
  const onSubmit = (formData: CustomerForm) => {
    updateOrderCustomer({ ...formData, id: customer.id });
    router.dismiss();
  };
  const onSubmitAndEdit = async (formData: CustomerForm) => {
    updateOrderCustomer({ ...formData, id: customer.id });
    console.log(customer.id);
    if (customer.id) {
      await updateCustomer(customer.id, formData);
    } else {
      await createCustomer(formData).then((id) => {
        updateOrderCustomer({ ...formData, id });
      });
    }
    router.dismiss();
  };
  const onReset = () => {
    clearCustomer();
  };

  return (
    <View style={[styles.container]}>
      {/* <View style={[styles.fullButton]}>
        <Pressable
          style={[styles.fullButton]}
          onPress={() => router.push("/sales/customer-list")}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>เลือกลูกค้า</Text>
          </View>
        </Pressable>
      </View> */}
      <View style={{ width: "100%", height: "100%" }}>
        <CustomerFormComponent
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onSubmitAndEdit={onSubmitAndEdit}
          onReset={onReset}
          disabledNameEdit={customer.id ? true : false}
        />
      </View>
    </View>
  );
}
