"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 로그인 정보 저장
type UserState = {
  message: string;
  userId: string;
  nickname: string;
  role: string;
  token: string;
  refreshToken: string;

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

      setUser: (user) =>
        set((state) => ({
          ...state,
          ...user,
        })),
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
    }
  )
);

// 이메일만 client 저장
interface EmailState {
  inputEmail: string;
  setInputEmail: (email: string) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  inputEmail: "",
  setInputEmail: (email) => set({ inputEmail: email }),
}));

export default useUserStore;
