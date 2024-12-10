import { create } from "zustand";
import { Product } from "./ProductService";
import { Customer } from "./CustomerService";
import { numberWithCommas } from "@/utils/utils";
import pb from "@/utils/pocketbase";
import { User } from "./UserService";

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
  containerCount: number;
}

export interface OrderOptions {
  isWithoutDetails: boolean;
  orderType: boolean;
  packageType: boolean;
}

type OrderState = {
  orders: Map<string, OrderItem>;
  customer: Customer;
  deliveryDetails: DeliveryDetails;
  orderOptions: OrderOptions;
};

type OrderActions = {
  addItem: (item: OrderItem) => void;
  changeAmount: (id: string, amount: number) => void;
  updateCustomer: (customer: Customer) => void;
  toggleIsDelivery: (value: boolean) => void;
  changeDeliveryCost: (value: number) => void;
  changeContainerCount: (value: number) => void;
  toggleIsWithoutDetails: () => void;
  toggleOrderType: () => void;
  togglePackageType: () => void;
};

function generateOrderText(order: OrderItem): string {
  const { product, count } = order;
  let text = `${product.label} = ${count} ${product.unit}\n`;
  text += `${count}x${product.kg}x${product.price}\n=${numberWithCommas(
    product.price * product.kg * count
  )}\n\n`;
  return text;
}

export function generateOrderSummary(
  orders: Map<string, OrderItem>,
  customer: Customer,
  deliveryDetails: DeliveryDetails,
  orderOptions: OrderOptions
): string {
  const date = new Date();
  const { isWithoutDetails, orderType, packageType } = orderOptions;
  let text = "";
  let totalCost = 0;
  let deliveryCost = 0;
  if (!isWithoutDetails) {
    text += `${date.getDate()}/${date.getMonth() + 1} ${customer.name}\n`;
    if (customer.deliveryService.length > 0) {
      text += `ส่ง ${customer.deliveryService}\n`;
    }
  }
  orders.forEach((order) => {
    text += generateOrderText(order);
    totalCost += order.product.price * order.count * order.product.kg;
  });
  if (deliveryDetails.deliveryCost > 0 && deliveryDetails.isDeliver) {
    text += "ค่าส่ง+";
    deliveryCost = deliveryDetails.deliveryCost;
  }
  if (!packageType) {
    text += `ค่าโฟม ${deliveryDetails.containerCount} ใบ\n`;
    if (deliveryCost > 0 && deliveryDetails.isDeliver) {
      text += `(${deliveryCost}+80)x${deliveryDetails.containerCount}\n`;
    } else {
      text += `80x${deliveryDetails.containerCount}\n`;
    }
    deliveryCost += 80;
  } else {
    text += `ค่าถุงดำ ${deliveryDetails.containerCount} ใบ\n`;
    if (deliveryCost > 0 && deliveryDetails.isDeliver) {
      text += `(${deliveryCost}+10)x${deliveryDetails.containerCount}\n`;
    } else {
      text += `10x${deliveryDetails.containerCount}\n`;
    }
    deliveryCost += 10;
  }
  deliveryCost *= deliveryDetails.containerCount;
  totalCost += deliveryCost;
  text += `=${numberWithCommas(deliveryCost)}\n\n`;
  text += `รวม ${numberWithCommas(totalCost)} บาท\n\n`;
  if (!isWithoutDetails) {
    text += `ส่ง\n`;
    text += `${customer.name} ${customer.address}\n`;
    text += `เบอร์ ${customer.phone}\n`;
    if (deliveryDetails.isDeliver && customer.deliveryNote.length > 0) {
      text += `**${customer.deliveryNote}\n`;
    }
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
    isDeliver: false,
    deliveryCost: 0,
    containerCount: 0,
  },
  orderOptions: {
    isWithoutDetails: false,
    orderType: false,
    packageType: false,
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
  updateCustomer: (customer: Customer) => {
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

export function finishOrder(
  orders: Map<string, OrderItem>,
  customer: Customer,
  deliveryDetails: DeliveryDetails,
  summary: string,
  user: User
) {
  const completeOrder: CompleteOrder = {
    customer: customer.id,
    orderDetails: Array.from(orders.values()),
    customerDetails: customer,
    summary: summary,
    isEnable: true,
    products: Array.from(orders.keys()),
    deliveryDetails: deliveryDetails,
    user: user.id,
  };
  return createOrder(completeOrder);
}

export async function createOrder(order: CompleteOrder) {
  const newOrder = await pb.collection("orders").create(order);
  return newOrder.id;
}
