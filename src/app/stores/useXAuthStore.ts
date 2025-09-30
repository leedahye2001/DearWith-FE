import { create } from "zustand";

interface XAuthState {
  result: string;
  ticket: string;
  handle: string;
  isVerified: boolean;
  setAuthData: (data: {
    result: string;
    ticket: string;
    handle: string;
  }) => void;
  setVerified: (verified: boolean) => void;
}

export const useXAuthStore = create<XAuthState>((set) => ({
  result: "",
  ticket: "",
  handle: "",
  isVerified: false,
  setAuthData: (data) => set({ ...data }),
  setVerified: (verified) => set({ isVerified: verified }),
}));
