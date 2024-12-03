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
      state.customer = customer;
      return state;
    });
  },
}));