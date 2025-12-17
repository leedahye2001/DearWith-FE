"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 로그인 정보 저장
type UserState = {
  message: string;
  userId: string;
  nickname: string;
  role: string;

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
        })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type AuthState = {
  accessToken: string;
  refreshToken: string;
  expirationTime: string;

  setTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    expirationTime: string;
  }) => void;

  clearTokens: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      expirationTime: "",

      setTokens: ({ accessToken, refreshToken, expirationTime }) =>
        set({
          accessToken,
          refreshToken,
          expirationTime,
        }),

      clearTokens: () =>
        set({
          accessToken: "",
          refreshToken: "",
          expirationTime: "",
        }),
    }),
    {
      name: "auth-token",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 프로필 사진 저장 (마이페이지)
type UserProfile = {
  nickname: string;
  profileImageUrl: string;
};

export const useProfileStore = create<{ profile: UserProfile | null; setProfile: (p: UserProfile) => void }>()(
  (set) => ({
    profile: null,
    setProfile: (p) => set({ profile: p }),
  })
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

interface EmailTicketState {
  emailTicket: string;
  setEmailTicket: (ticket: string) => void;
}

export const useEmailTicketStore = create<EmailTicketState>((set) => ({
  emailTicket: "",
  setEmailTicket: (ticket) => set({ emailTicket: ticket }),
}));

interface AgreementState {
  item1: boolean; // AGE_OVER_14
  item2: boolean; // TERMS_OF_SERVICE
  item3: boolean; // PERSONAL_INFORMATION
  item5: boolean; // PUSH_NOTIFICATION
  setAgreements: (agreements: {
    item1: boolean;
    item2: boolean;
    item3: boolean;
    item5: boolean;
  }) => void;
}

export const useAgreementStore = create<AgreementState>((set) => ({
  item1: false,
  item2: false,
  item3: false,
  item5: false,
  setAgreements: (agreements) => set(agreements),
}));

export default useUserStore;
