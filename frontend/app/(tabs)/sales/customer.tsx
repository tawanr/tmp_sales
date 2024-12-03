import { useOrderStore } from "@/services/OrderService";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type CustomerForm = {
  name: string;
  address: string;
  phone: string;
  deliveryNote: string;
  deliveryService: string;
};

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
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Name:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </View>
          </View>
        )}
      />
      {errors.name && <Text style={{ color: "red" }}>{errors.name.message}</Text>}
      <Controller
        control={control}
        name="phone"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Phone:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Phone"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </View>
          </View>
        )}
      />
      <Controller
        control={control}
        name="deliveryService"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Deliverer:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Deliverer"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                numberOfLines={4}
                multiline={true}
              />
            </View>
          </View>
        )}
      />
      <Controller
        control={control}
        name="address"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Address:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                numberOfLines={4}
                multiline={true}
              />
            </View>
          </View>
        )}
      />
      <Controller
        control={control}
        name="deliveryNote"
        rules={{ required: false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Note:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Note"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                numberOfLines={4}
                multiline={true}
              />
            </View>
          </View>
        )}
      />
      <Button title="Save" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
