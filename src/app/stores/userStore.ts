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

// 이메일 client에 저장
interface EmailState {
  inputEmail: string;
  setInputEmail: (email: string) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  inputEmail: "",
  setInputEmail: (email) => set({ inputEmail: email }),
}));

// password client에 저장
interface PasswordState {
  password: string;
  setPassword: (password: string) => void;
}

export const usePasswordStore = create<PasswordState>((set) => ({
  password: "",
  setPassword: (password) => set({ password: password }),
}));

// nickname client에 저장
interface nicknameState {
  nickname: string;
  setNickname: (password: string) => void;
}

export const useNicknameStore = create<nicknameState>((set) => ({
  nickname: "",
  setNickname: (nickname) => set({ nickname: nickname }),
}));

export default useUserStore;
