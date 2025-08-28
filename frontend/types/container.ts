/**
 * Container Type System
 * Extensible system for managing different container types, sizes, and combinations
 */

export enum ContainerType {
  FOAM = "foam",
  BLACK_BAG = "black_bag",
  BOX = "box",
  COOLER = "cooler",
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
}

export interface ContainerSummary {
  selections: ContainerSelection[];
  totalQuantity: number;
  totalPrice: number;
}

// Default container configurations
export const CONTAINER_SPECS: Record<string, ContainerSpec> = {
  // Foam containers
  foam_small: {
    type: ContainerType.FOAM,
    size: ContainerSize.SMALL,
    name: "โฟมเล็ก",
    price: 60,
    capacity: 5,
    description: "โฟมขนาดเล็ก สำหรับสินค้าไม่เกิน 5 กก",
  },
  foam_medium: {
    type: ContainerType.FOAM,
    size: ContainerSize.MEDIUM,
    name: "โฟมกลาง",
    price: 80,
    capacity: 10,
    description: "โฟมขนาดกลาง สำหรับสินค้า 5-10 กก",
  },
  foam_large: {
    type: ContainerType.FOAM,
    size: ContainerSize.LARGE,
    name: "โฟมใหญ่",
    price: 100,
    capacity: 15,
    description: "โฟมขนาดใหญ่ สำหรับสินค้า 10-15 กก",
  },

  // Black bag containers
  black_bag_small: {
    type: ContainerType.BLACK_BAG,
    size: ContainerSize.SMALL,
    name: "ถุงดำเล็ก",
    price: 5,
    capacity: 3,
    description: "ถุงดำขนาดเล็ก สำหรับสินค้าไม่เกิน 3 กก",
  },
  black_bag_medium: {
    type: ContainerType.BLACK_BAG,
    size: ContainerSize.MEDIUM,
    name: "ถุงดำกลาง",
    price: 10,
    capacity: 7,
    description: "ถุงดำขนาดกลาง สำหรับสินค้า 3-7 กก",
  },
  black_bag_large: {
    type: ContainerType.BLACK_BAG,
    size: ContainerSize.LARGE,
    name: "ถุงดำใหญ่",
    price: 15,
    capacity: 12,
    description: "ถุงดำขนาดใหญ่ สำหรับสินค้า 7-12 กก",
  },

  // Box containers
  box_medium: {
    type: ContainerType.BOX,
    size: ContainerSize.MEDIUM,
    name: "กล่องกลาง",
    price: 25,
    capacity: 8,
    description: "กล่องกระดาษแข็งขนาดกลาง",
  },
  box_large: {
    type: ContainerType.BOX,
    size: ContainerSize.LARGE,
    name: "กล่องใหญ่",
    price: 35,
    capacity: 15,
    description: "กล่องกระดาษแข็งขนาดใหญ่",
  },

  // Cooler containers
  cooler_medium: {
    type: ContainerType.COOLER,
    size: ContainerSize.MEDIUM,
    name: "ถุงเก็บความเย็นกลาง",
    price: 45,
    capacity: 6,
    description: "ถุงเก็บความเย็นขนาดกลาง",
  },
  cooler_large: {
    type: ContainerType.COOLER,
    size: ContainerSize.LARGE,
    name: "ถุงเก็บความเย็นใหญ่",
    price: 65,
    capacity: 12,
    description: "ถุงเก็บความเย็นขนาดใหญ่",
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

  return {
    selections,
    totalQuantity,
    totalPrice,
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
