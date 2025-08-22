// src/store/useUserStore.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  message: string;
  userId: string;
  nickname: string;
  role: string;
  token: string;
  refreshToken: string;
  setToken: (token: string) => void;

  setUser: (user: Omit<UserState, "setUser" | "clearUser">) => void;
  clearUser: () => void;
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      message: "",
      userId: "",
      nickname: "",
      role: "",
      token: "",
      refreshToken: "",

      setUser: (user) => set(() => ({ ...user })),
      setToken: (token: string) => set((state) => ({ ...state, token })),
      // 로그아웃
      clearUser: () =>
        set(() => ({
          message: "",
          userId: "",
          nickname: "",
          role: "",
          token: "",
          refreshToken: "",
        })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useUserStore;
