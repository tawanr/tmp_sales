import pb from "@/utils/pocketbase";
import { router } from "expo-router";
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
  clearUser: () => {
    set({ user: { id: "", name: "" } });
  },
}));

export const login = async (email: string, password: string) => {
  const { setUser } = useUserStore();
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    setUser({ id: authData.record.id, name: authData.record.name });
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const checkAuth = () => {
  if (pb.authStore.isValid) {
    router.push("/");
  }
};
