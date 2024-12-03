import { create } from "zustand";
import { Product } from "./ProductService";
import { Customer } from "./CustomerService";

export interface OrderItem {
  product: Product;
  count: number;
};

type OrderState = {
  orders: Map<string, OrderItem>;
  customer: Customer;
};

type OrderActions = {
  addItem: (item: OrderItem) => void;
  changeAmount: (id: string, amount: number) => void;
  updateCustomer: (customer: Customer) => void;
};

function generateOrderText(order: OrderItem): string {
  const { product, count } = order;
  let text = `${product.label} = ${count}\n`;
  text += `${count} x ${product.kg} x ${product.price}  = ${product.price * product.kg * count}\n\n`;
  return text;
}

export function generateOrderSummary(orders: Map<string, OrderItem>, customer: Customer): string {
  const date = new Date();
  // const { orders, customer } = useOrderStore();
  let text = "";
  let totalCost = 0;
  text += `${date.getDate()}/${date.getMonth() + 1} ${customer.name}\n\n`;
  orders.forEach((order) => {
    text += generateOrderText(order);
    totalCost += order.product.price * order.count * order.product.kg;
  });
  text += `รวม ${totalCost} บาท\n\n`;
  text += `ส่ง\n`;
  text += `${customer.name}\n ${customer.address}\n`;
  text += `เบอร์ ${customer.phone}\n`;
  text += `**นัดรับ ${customer.deliveryNote}\n`;
  return text;
}

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  orders: new Map<string, OrderItem>(),
  customer: {
    id: "",
    name: "",
    address: "",
    phone: "",
    deliveryNote: "",
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
}));

// https://zustand.docs.pmnd.rs/guides/maps-and-sets-usage
// export function updateCustomer(customer: Customer) {
//   useOrderStore.setState((prev) => ({
//     orders: new Map<string, OrderItem>(prev.orders).set(customer.id, customer),
//     customer: customer,
//   }))