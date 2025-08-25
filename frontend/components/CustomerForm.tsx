import { Customer } from "@/services/CustomerService";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  control: Control<Customer, any>;
  handleSubmit: UseFormHandleSubmit<Customer, undefined>;
  onSubmit: (data: Customer) => void;
  onSubmitAndEdit?: ((data: Customer) => void) | null;
  onReset?: (() => void) | null;
  disabledNameEdit: boolean | null;
};

export type CustomerForm = {
  name: string;
  address: string;
  phone: string;
  deliveryNote: string;
  deliveryService: string;
  carRegistration: string;
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
  buttonsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-end",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  primaryButton: {
    height: 40,
    width: 100,
    backgroundColor: "rgba(0, 139, 23, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 5,
    color: "#fff",
  },
  saveButton: {
    height: 40,
    width: 100,
    backgroundColor: "#00e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 5,
    color: "#fff",
  },
  clearButton: {
    height: 40,
    width: 100,
    backgroundColor: "rgba(255, 3, 3, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 5,
    color: "#fff",
  },
});

export default function CustomerFormComponent({
  control,
  handleSubmit,
  onSubmit,
  onSubmitAndEdit = null,
  onReset = null,
  disabledNameEdit = false,
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
                editable={!disabledNameEdit}
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
        name="deliveryNote"
        rules={{ required: false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>รายละเอียด:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%", height: 100 }}
                placeholder="รายละเอียด"
                placeholderTextColor={"#aaa"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                numberOfLines={10}
                multiline={true}
              />
            </View>
          </View>
        )}
      />
      <Controller
        control={control}
        name="carRegistration"
        rules={{ required: false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputRow]}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text style={[styles.inputLabel]}>ทะเบียนรถ:</Text>
            </View>
            <View style={[styles.inputField]}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="ทะเบียนรถ"
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
      <View style={[styles.buttonsRow]}>
        {onSubmitAndEdit ? (
          <View style={[styles.primaryButton]}>
            <Pressable onPress={handleSubmit(onSubmitAndEdit)}>
              <Text style={{ color: "#fff" }}>แก้ไข</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={[styles.saveButton]}>
          <Pressable onPress={handleSubmit(onSubmit)}>
            <Text style={{ color: "#fff" }}>บันทึก</Text>
          </Pressable>
        </View>
        {onReset ? (
          <View style={[styles.clearButton]}>
            <Pressable onPress={handleSubmit(onReset)}>
              <Text style={{ color: "#fff" }}>เคลียร์</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}
