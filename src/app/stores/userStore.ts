"use client";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

// 쿠키를 사용하는 커스텀 storage
const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === "undefined") return;
    // 쿠키에 저장 (7일 만료, httpOnly는 서버에서만 설정 가능)
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

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
      storage: createJSONStorage(() => cookieStorage),
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
