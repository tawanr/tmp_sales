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
              <Text style={[styles.inputLabel]}>ชื่อ:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="ชื่อ"
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
              <Text style={[styles.inputLabel]}>เบอร์:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="เบอร์"
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
              <Text style={[styles.inputLabel]}>สายรถขนส่ง:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="สายรถขนส่ง"
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
              <Text style={[styles.inputLabel]}>ที่อยู่:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="ที่อยู่"
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
              <Text style={[styles.inputLabel]}>รายละเอียด:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="รายละเอียด"
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
      <Button title="บันทึก" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
