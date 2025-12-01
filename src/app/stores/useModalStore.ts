// stores/modalStore.ts
import { create } from "zustand";

interface ModalState {
  message: string | null;
  showModal: boolean;
  openModal: (msg: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  message: null,
  showModal: false,
  openModal: (msg: string) => set({ message: msg, showModal: true }),
  closeModal: () => set({ message: null, showModal: false }),
}));

export default useModalStore;
