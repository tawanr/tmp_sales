/**
 * Container Type System
 * Extensible system for managing different container types, sizes, and combinations
 */

export enum ContainerType {
  FOAM = "foam",
  BLACK_BAG = "black_bag",
}

export enum ContainerSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRA_LARGE = "xl",
}

export interface ContainerSpec {
  type: ContainerType;
  size: ContainerSize;
  name: string;
  price: number;
  capacity?: number; // Optional capacity in kg or units
  description?: string;
}

export interface ContainerSelection {
  spec: ContainerSpec;
  quantity: number;
  totalPrice: number;
  deliveryPrice?: number; // Optional delivery price per container
}

export interface ContainerSummary {
  selections: ContainerSelection[];
  totalQuantity: number;
  totalPrice: number;
  totalDeliveryPrice: number; // Total delivery cost for all containers
}

// Default container configurations
export const CONTAINER_SPECS: Record<string, ContainerSpec> = {
  // Foam containers
  foam_small: {
    type: ContainerType.FOAM,
    size: ContainerSize.SMALL,
    name: "โฟมเล็ก",
    price: 65,
    capacity: 5,
    description: "โฟมขนาดเล็ก สำหรับสินค้าไม่เกิน 5 กก",
  },
  foam_large: {
    type: ContainerType.FOAM,
    size: ContainerSize.LARGE,
    name: "โฟมใหญ่",
    price: 80,
    capacity: 15,
    description: "โฟมขนาดใหญ่ สำหรับสินค้า 10-15 กก",
  },

  // Black bag containers
  black_bag: {
    type: ContainerType.BLACK_BAG,
    size: ContainerSize.LARGE,
    name: "ถุงดำ",
    price: 15,
    capacity: 12,
    description: "ถุงดำขนาดใหญ่ สำหรับสินค้า 7-12 กก",
  },
};

// Helper functions
export const getContainerSpecById = (id: string): ContainerSpec | undefined => {
  return CONTAINER_SPECS[id];
};

export const getContainerSpecsByType = (
  type: ContainerType
): ContainerSpec[] => {
  return Object.values(CONTAINER_SPECS).filter((spec) => spec.type === type);
};

export const createContainerSelection = (
  spec: ContainerSpec,
  quantity: number = 1
): ContainerSelection => ({
  spec,
  quantity,
  totalPrice: spec.price * quantity,
});

export const calculateContainerSummary = (
  selections: ContainerSelection[]
): ContainerSummary => {
  const totalQuantity = selections.reduce(
    (sum, selection) => sum + selection.quantity,
    0
  );
  const totalPrice = selections.reduce(
    (sum, selection) => sum + selection.totalPrice,
    0
  );
  const totalDeliveryPrice = selections.reduce(
    (sum, selection) =>
      sum + (selection.deliveryPrice || 0) * selection.quantity,
    0
  );

  return {
    selections,
    totalQuantity,
    totalPrice,
    totalDeliveryPrice,
  };
};

// Backward compatibility helpers
export const getLegacyContainerSpec = (packageType: boolean): ContainerSpec => {
  return packageType
    ? CONTAINER_SPECS["black_bag_medium"]
    : CONTAINER_SPECS["foam_medium"];
};

export const createLegacyContainerSelection = (
  packageType: boolean,
  quantity: number
): ContainerSelection => {
  const spec = getLegacyContainerSpec(packageType);
  return createContainerSelection(spec, quantity);
};
