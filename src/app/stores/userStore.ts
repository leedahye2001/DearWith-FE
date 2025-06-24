// src/stores/authStore.ts
import { create } from "zustand";

type UserState = {
  email: string;
  setEmail: (email: string) => void;
};

const useUserStore = create<UserState>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));

export default useUserStore;
