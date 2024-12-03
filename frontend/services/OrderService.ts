import { create } from "zustand";
import { Product } from "./ProductService";

export interface OrderItem {
  product: Product;
  count: number;
};

type OrderState = {
  orders: Map<string, OrderItem>;
};

type OrderActions = {
  addItem: (item: OrderItem) => void;
};

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  orders: new Map<string, OrderItem>(),
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
}));