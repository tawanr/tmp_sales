import { create } from "zustand";
import { Product } from "./ProductService";
import { Customer } from "./CustomerService";
import { numberWithCommas } from "@/utils/utils";
import pb from "@/utils/pocketbase";
import { User } from "./UserService";
import ContainerManager from "./ContainerService";
import { ContainerSelection } from "@/types/container";

export type CompleteOrder = {
  customer: string;
  orderDetails: object;
  customerDetails: object;
  summary: string;
  isEnable: boolean;
  products: string[];
  deliveryDetails: object;
  user: string;
};

export interface OrderItem {
  product: Product;
  count: number;
}

export interface DeliveryDetails {
  isDeliver: boolean;
  deliveryCost: number;
  containerCount: number; // Kept for backward compatibility
  productLocation: string;
  containers?: object; // Serialized container selections
}

export interface OrderOptions {
  isWithoutDetails: boolean;
  orderType: boolean;
  packageType: boolean; // Kept for backward compatibility
}

type OrderState = {
  orders: Map<string, OrderItem>;
  customer: Customer;
  deliveryDetails: DeliveryDetails;
  orderOptions: OrderOptions;
  containerManager: ContainerManager; // New container manager
};

type OrderActions = {
  clearCustomer: () => void;
  addItem: (item: OrderItem) => void;
  changeAmount: (id: string, amount: number) => void;
  updateOrderCustomer: (customer: Customer) => void;
  toggleIsDelivery: (value: boolean) => void;
  changeDeliveryCost: (value: number) => void;
  changeContainerCount: (value: number) => void;
  toggleIsWithoutDetails: () => void;
  toggleOrderType: () => void;
  togglePackageType: () => void;
  setProductLocation: (value: string) => void;
  updateContainerManager: (manager: ContainerManager) => void; // New container action
  syncContainerCount: () => void; // Sync legacy container count
};

function generateOrderText(order: OrderItem): string {
  const { product, count } = order;
  let text = `${product.label} = ${count} ${product.unit}\n`;
  text += `${count}x${product.kg}x${numberWithCommas(
    product.price
  )}\n=${numberWithCommas(product.price * product.kg * count)}\n\n`;
  return text;
}

export function generateOrderSummary(
  orders: Map<string, OrderItem>,
  customer: Customer,
  deliveryDetails: DeliveryDetails,
  orderOptions: OrderOptions,
  containerManager?: ContainerManager
): string {
  const date = new Date();
  const { isWithoutDetails, orderType, packageType } = orderOptions;
  let text = "";
  let totalCost = 0;
  let deliveryCost = 0;
  if (!isWithoutDetails) {
    text += `${date.getDate()}/${date.getMonth() + 1} ${customer.name} ${
      deliveryDetails.isDeliver ? "" : deliveryDetails.productLocation
    } \n`;
    if (customer.deliveryService.length > 0 && deliveryDetails.isDeliver) {
      text += `ส่ง ${customer.deliveryService}\n`;
    }
    if (!deliveryDetails.isDeliver && customer.carRegistration?.length > 0) {
      text += `ทะเบียน ${customer.carRegistration}\n`;
    }
  }
  orders.forEach((order) => {
    text += generateOrderText(order);
    totalCost += order.product.price * order.count * order.product.kg;
  });

  // Use new container system if available, otherwise fall back to legacy
  if (deliveryDetails.isDeliver) {
    if (containerManager && !containerManager.isEmpty()) {
      // Use new container system
      text += containerManager.generateSummaryText(true);
      const containerSummary = containerManager.getSummary();
      deliveryCost += containerSummary.totalPrice;
      deliveryCost += containerSummary.totalDeliveryPrice;
      // text += `=${numberWithCommas(deliveryCost)}\n\n`;
    }
    totalCost += deliveryCost;
  }
  text += `รวม ${numberWithCommas(totalCost)} บาท\n\n`;
  if (!isWithoutDetails && deliveryDetails.isDeliver) {
    text += `ส่ง\n`;
    text += `${customer.deliveryNote}\n`;
  }
  return text;
}

export function generateWithdrawalSummary(
  orders: Map<string, OrderItem>,
  customer: Customer,
  deliveryDetails: DeliveryDetails,
  orderOptions: OrderOptions
): string {
  const date = new Date();
  let text = "";
  const { isWithoutDetails } = orderOptions;
  if (!isWithoutDetails) {
    text += `เบิก ${date.getDate()}/${date.getMonth() + 1}\n`;
    text += `ทะเบียน ${customer.carRegistration}\n`;
  }
  orders.forEach((order) => {
    text += `${order.product.lotNumber}\n${order.product.label}\n${order.count} ${order.product.unit}\n\n`;
  });
  return text;
}

export function createEmptyCustomer(): Customer {
  return {
    id: "",
    name: "",
    address: "",
    phone: "",
    deliveryNote: "",
    deliveryService: "",
    carRegistration: "",
  };
}

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  orders: new Map<string, OrderItem>(),
  customer: createEmptyCustomer(),
  deliveryDetails: {
    isDeliver: true,
    deliveryCost: 0,
    containerCount: 0,
    productLocation: "",
  },
  orderOptions: {
    isWithoutDetails: false,
    orderType: false,
    packageType: false,
  },
  containerManager: new ContainerManager(), // Initialize container manager
  clearCustomer: () => {
    set((state: OrderState) => ({
      ...state,
      customer: createEmptyCustomer(),
    }));
  },
  addItem: (item: OrderItem) => {
    set((state: OrderState) => {
      if (!state.orders.has(item.product.id)) {
        state.orders.set(item.product.id, item);
      } else {
        const existingItem = state.orders.get(item.product.id);
        if (existingItem) {
          existingItem.count += item.count;
        }
      }
      return state;
    });
  },
  changeAmount: (id: string, amount: number) => {
    set((state: OrderState) => {
      const existingItem = state.orders.get(id);
      if (existingItem) {
        existingItem.count = amount;
      }
      return state;
    });
  },
  updateOrderCustomer: (customer: Customer) => {
    set((state: OrderState) => {
      state = { ...state, customer: customer };
      return state;
    });
  },
  toggleIsDelivery: () => {
    set((state: OrderState) => ({
      deliveryDetails: {
        ...state.deliveryDetails,
        isDeliver: !state.deliveryDetails.isDeliver,
      },
    }));
  },
  changeContainerCount: (value: number) => {
    set((state: OrderState) => ({
      ...state,
      deliveryDetails: {
        ...state.deliveryDetails,
        containerCount: value,
      },
    }));
  },
  changeDeliveryCost: (value: number) => {
    set((state: OrderState) => ({
      ...state,
      deliveryDetails: {
        ...state.deliveryDetails,
        deliveryCost: value,
      },
    }));
  },
  toggleIsWithoutDetails: () => {
    set((state: OrderState) => ({
      orderOptions: {
        ...state.orderOptions,
        isWithoutDetails: !state.orderOptions.isWithoutDetails,
      },
    }));
  },
  toggleOrderType: () => {
    set((state: OrderState) => ({
      orderOptions: {
        ...state.orderOptions,
        orderType: !state.orderOptions.orderType,
      },
    }));
  },
  togglePackageType: () => {
    set((state: OrderState) => ({
      orderOptions: {
        ...state.orderOptions,
        packageType: !state.orderOptions.packageType,
      },
    }));
  },
  setProductLocation: (value: string) => {
    set((state: OrderState) => ({
      ...state,
      deliveryDetails: {
        ...state.deliveryDetails,
        productLocation: value,
      },
    }));
  },
  updateContainerManager: (manager: ContainerManager) => {
    set((state: OrderState) => ({
      ...state,
      containerManager: manager,
      deliveryDetails: {
        ...state.deliveryDetails,
        containers: manager.serialize(),
        containerCount: manager.getTotalQuantity(), // Sync legacy count
      },
    }));
  },
  syncContainerCount: () => {
    set((state: OrderState) => ({
      ...state,
      deliveryDetails: {
        ...state.deliveryDetails,
        containerCount: state.containerManager.getTotalQuantity(),
      },
    }));
  },
}));

// https://zustand.docs.pmnd.rs/guides/maps-and-sets-usage
export function changeItemAmount(id: string, amount: number) {
  const state = useOrderStore.getState();
  if (!state.orders.has(id)) {
    return;
  }
  useOrderStore.setState((prev) => ({
    orders: new Map<string, OrderItem>(prev.orders).set(id, {
      ...prev.orders.get(id)!,
      count: amount,
    }),
  }));
}

export function clearItems() {
  useOrderStore.setState({ orders: new Map<string, OrderItem>() });
}

export function removeItem(id: string) {
  useOrderStore.setState((prev) => {
    const newOrder = new Map<string, OrderItem>(prev.orders);
    newOrder.delete(id);
    return { orders: newOrder };
  });
}

export function resetDeliveryDetails() {
  const { toggleIsDelivery, changeContainerCount, changeDeliveryCost } =
    useOrderStore();
  toggleIsDelivery(true);
  changeContainerCount(0);
  changeDeliveryCost(0);
}

export function calculateTotalWeight(orders: Map<string, OrderItem>): number {
  let totalWeight = 0;
  orders.forEach((order) => {
    totalWeight += order.product.kg * order.count;
  });
  return totalWeight;
}

export function finishOrder(
  orders: Map<string, OrderItem>,
  customer: Customer,
  deliveryDetails: DeliveryDetails,
  summary: string,
  user: User,
  containerManager?: ContainerManager
) {
  const completeOrder: CompleteOrder = {
    customer: customer.id,
    orderDetails: Array.from(orders.values()),
    customerDetails: customer,
    summary: summary,
    isEnable: true,
    products: Array.from(orders.keys()),
    deliveryDetails: {
      ...deliveryDetails,
      containers: containerManager
        ? containerManager.serialize()
        : deliveryDetails.containers,
    },
    user: user.id,
  };
  return createOrder(completeOrder);
}

export async function createOrder(order: CompleteOrder) {
  const newOrder = await pb.collection("orders").create(order);
  return newOrder.id;
}

export async function fetchOrderHistory(user: User | null, page: number = 0) {
  let filters = {};
  if (user) {
    filters = { filter: { user } };
  }
  const orders = await pb.collection("orders").getList();
}
