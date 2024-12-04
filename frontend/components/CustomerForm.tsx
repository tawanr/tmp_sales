import { Customer } from "@/services/CustomerService";
import { useOrderStore } from "@/services/OrderService";
import { Link, router } from "expo-router";
import { Control, Controller, useForm, UseFormHandleSubmit } from "react-hook-form";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  control: Control<Customer, any>;
  handleSubmit: UseFormHandleSubmit<Customer, undefined>;
  onSubmit: (data: Customer) => void;
};

export type CustomerForm = {
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

export default function CustomerFormComponent({
  control,
  handleSubmit,
  onSubmit,
}: Props) {
  return (
    <View>
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
                placeholderTextColor={"#aaa"}
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
                placeholderTextColor={"#aaa"}
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
        rules={{ required: false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Deliverer:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Deliverer"
                placeholderTextColor={"#aaa"}
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
        rules={{ required: false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>Address:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Address"
                placeholderTextColor={"#aaa"}
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
                placeholderTextColor={"#aaa"}
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
