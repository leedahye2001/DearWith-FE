import { create } from "zustand";

interface AuthState {
  twitterHandle?: string;
  twitterId?: string;
  twitterName?: string;
  setAuth: (auth: Partial<AuthState>) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  setAuth: (auth) => set(auth),
}));

export default useAuthStore;
