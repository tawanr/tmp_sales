/**
 * Container Selection Component
 * Advanced container type and quantity selection with support for multiple container types
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  ContainerSpec,
  ContainerSelection,
  ContainerType,
  CONTAINER_SPECS,
  getContainerSpecsByType,
} from "@/types/container";
import ContainerManager from "@/services/ContainerService";
import { PRIMARY_DARK, PRIMARY_LIGHT } from "@/utils/constants";
import { numberWithCommas } from "@/utils/utils";

interface ContainerSelectorProps {
  containerManager: ContainerManager;
  onContainerChange: (manager: ContainerManager) => void;
  totalWeight?: number; // For auto-suggestions
  style?: object;
}

const styles = StyleSheet.create({
  containerSection: {
    width: "100%",
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  containerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  containerInfo: {
    flex: 1,
  },
  containerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  containerDetails: {
    fontSize: 12,
    color: "#666",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityButton: {
    backgroundColor: PRIMARY_DARK,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: 50,
    height: 32,
    textAlign: "center",
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: "#dc3545",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  summary: {
    backgroundColor: "#e8f4fd",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  typeSection: {
    marginBottom: 20,
  },
  typeHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: PRIMARY_DARK,
  },
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    marginVertical: 2,
  },
  specInfo: {
    flex: 1,
  },
  specName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  specDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  specPrice: {
    fontSize: 13,
    color: PRIMARY_DARK,
    fontWeight: "600",
  },
  selectButton: {
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  autoSuggestButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  autoSuggestText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
});

const ContainerSelector: React.FC<ContainerSelectorProps> = ({
  containerManager,
  onContainerChange,
  totalWeight,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContainers, setSelectedContainers] = useState<
    ContainerSelection[]
  >([]);

  useEffect(() => {
    setSelectedContainers(containerManager.getAllContainers());
  }, [containerManager]);

  const handleAddContainer = (spec: ContainerSpec) => {
    containerManager.addContainer(getSpecId(spec), 1);
    onContainerChange(containerManager);
    setSelectedContainers(containerManager.getAllContainers());
  };

  const handleUpdateQuantity = (specId: string, quantity: number) => {
    containerManager.updateContainerQuantity(specId, quantity);
    onContainerChange(containerManager);
    setSelectedContainers(containerManager.getAllContainers());
  };

  const handleRemoveContainer = (specId: string) => {
    containerManager.removeContainer(specId);
    onContainerChange(containerManager);
    setSelectedContainers(containerManager.getAllContainers());
  };

  const handleAutoSuggest = () => {
    if (!totalWeight || totalWeight <= 0) {
      Alert.alert("ไม่สามารถแนะนำได้", "ไม่มีข้อมูลน้ำหนักสินค้า");
      return;
    }

    const suggestions = containerManager.autoSuggestContainers(totalWeight);
    containerManager.clear();

    suggestions.forEach((suggestion) => {
      const specId = getSpecId(suggestion.spec);
      containerManager.addContainer(specId, suggestion.quantity);
    });

    onContainerChange(containerManager);
    setSelectedContainers(containerManager.getAllContainers());
    setModalVisible(false);
  };

  const getSpecId = (spec: ContainerSpec): string => {
    return (
      Object.keys(CONTAINER_SPECS).find(
        (key) => CONTAINER_SPECS[key] === spec
      ) || ""
    );
  };

  const renderContainerItem = ({ item }: { item: ContainerSelection }) => {
    const specId = getSpecId(item.spec);

    return (
      <View style={styles.containerItem}>
        <View style={styles.containerInfo}>
          <Text style={styles.containerName}>{item.spec.name}</Text>
          <Text style={styles.containerDetails}>
            {item.spec.price} บาท/ใบ • รวม {numberWithCommas(item.totalPrice)}{" "}
            บาท
          </Text>
          {!!item.spec.capacity && (
            <Text style={styles.containerDetails}>
              ความจุ: {item.spec.capacity} กก
            </Text>
          )}
        </View>

        <View style={styles.quantityControls}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(specId, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>

          <TextInput
            style={styles.quantityInput}
            value={item.quantity.toString()}
            onChangeText={(text) => {
              const quantity = parseInt(text) || 0;
              handleUpdateQuantity(specId, quantity);
            }}
            keyboardType="number-pad"
            selectTextOnFocus
          />

          <Pressable
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(specId, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>

          <Pressable
            style={styles.removeButton}
            onPress={() => handleRemoveContainer(specId)}
          >
            <FontAwesome
              name="trash"
              size={14}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderSpecItem = ({ item }: { item: ContainerSpec }) => (
    <View style={styles.specItem}>
      <View style={styles.specInfo}>
        <Text style={styles.specName}>{item.name}</Text>
        {!!item.description && (
          <Text style={styles.specDescription}>{item.description}</Text>
        )}
        <Text style={styles.specPrice}>{item.price} บาท/ใบ</Text>
      </View>
      <Pressable
        style={styles.selectButton}
        onPress={() => {
          handleAddContainer(item);
          setModalVisible(false);
        }}
      >
        <Text style={styles.selectButtonText}>เลือก</Text>
      </Pressable>
    </View>
  );

  const renderTypeSection = (type: ContainerType) => {
    const specs = getContainerSpecsByType(type);
    const typeNames = {
      [ContainerType.FOAM]: "โฟม",
      [ContainerType.BLACK_BAG]: "ถุงดำ",
      [ContainerType.BOX]: "กล่อง",
      [ContainerType.COOLER]: "ถุงเก็บความเย็น",
    };

    return (
      <View
        key={type}
        style={styles.typeSection}
      >
        <Text style={styles.typeHeader}>{typeNames[type]}</Text>
        <FlatList
          data={specs}
          renderItem={renderSpecItem}
          keyExtractor={(item) => getSpecId(item)}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const summary = containerManager.getSummary();

  return (
    <View style={[styles.containerSection, style]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>บรรจุภัณฑ์</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome
            name="plus"
            size={12}
            color="#fff"
          />
          <Text style={styles.addButtonText}>เพิ่ม</Text>
        </Pressable>
      </View>

      <FlatList
        data={selectedContainers}
        renderItem={renderContainerItem}
        keyExtractor={(item) => getSpecId(item.spec)}
        scrollEnabled={false}
      />

      {summary.totalQuantity > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            รวม {summary.totalQuantity} ใบ •{" "}
            {numberWithCommas(summary.totalPrice)} บาท
          </Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เลือกบรรจุภัณฑ์</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome
                  name="times"
                  size={20}
                  color="#666"
                />
              </Pressable>
            </View>

            {totalWeight != null && totalWeight > 0 && (
              <Pressable
                style={styles.autoSuggestButton}
                onPress={handleAutoSuggest}
              >
                <Text style={styles.autoSuggestText}>
                  แนะนำอัตโนมัติ (น้ำหนัก {totalWeight} กก)
                </Text>
              </Pressable>
            )}

            <FlatList
              data={Object.values(ContainerType)}
              renderItem={({ item }) => renderTypeSection(item)}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContainerSelector;
