import CustomerFormComponent, { CustomerForm } from "@/components/CustomerForm";
import { createCustomer, Customer } from "@/services/CustomerService";
import { useOrderStore } from "@/services/OrderService";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export default function CustomerCreate() {
  const { updateOrderCustomer } = useOrderStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      deliveryNote: "",
      deliveryService: "",
    },
  });
  const onSubmit = (formData: CustomerForm) => {
    createCustomer(formData).then((id) => {
      updateOrderCustomer({ ...formData, id: id });
      router.dismiss(2);
    });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        margin: 8,
        paddingTop: 10,
      }}
    >
      <CustomerFormComponent
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        disabledNameEdit={false}
      />
    </View>
  );
}
