import { create } from "zustand";

type ModalType = "alert" | "confirm";

type ModalState = {
  showModal: boolean;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  openAlert: (message: string, onClose?: () => void) => void;
  openConfirm: (message: string, onConfirm: () => void) => void;
  openConfirmWithCustomButtons: (
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  closeModal: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  showModal: false,
  message: "",
  type: "alert",
  onConfirm: undefined,
  confirmButtonText: undefined,
  cancelButtonText: undefined,

  openAlert: (message, onClose) =>
    set({ showModal: true, message, type: "alert", onConfirm: onClose, confirmButtonText: undefined, cancelButtonText: undefined }),

  openConfirm: (message, onConfirm) =>
    set({ showModal: true, message, type: "confirm", onConfirm, confirmButtonText: undefined, cancelButtonText: undefined }),

  openConfirmWithCustomButtons: (message, onConfirm, confirmText, cancelText) =>
    set({ showModal: true, message, type: "confirm", onConfirm, confirmButtonText: confirmText, cancelButtonText: cancelText }),

  closeModal: () =>
    set({ showModal: false, message: "", onConfirm: undefined, confirmButtonText: undefined, cancelButtonText: undefined }),
}));

export default useModalStore;
