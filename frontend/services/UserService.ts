import { create } from "zustand";

export interface User {
  id: string;
  name: string;
}

type UserStore = {
  user: User;
};

type UserStoreActions = {
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStore & UserStoreActions>((set) => ({
  user: {
    id: "",
    name: "",
  },
  setUser: (user: User) => {
    set({ user });
  },
}));
