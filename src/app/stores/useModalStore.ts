import { create } from "zustand";

type ModalType = "alert" | "confirm";

type ModalState = {
  showModal: boolean;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  openAlert: (message: string) => void;
  openConfirm: (message: string, onConfirm: () => void) => void;
  closeModal: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  showModal: false,
  message: "",
  type: "alert",
  onConfirm: undefined,

  openAlert: (message) =>
    set({ showModal: true, message, type: "alert", onConfirm: undefined }),

  openConfirm: (message, onConfirm) =>
    set({ showModal: true, message, type: "confirm", onConfirm }),

  closeModal: () =>
    set({ showModal: false, message: "", onConfirm: undefined }),
}));

export default useModalStore;
