import { create } from "zustand";

interface StepState {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  incrementStep: () => void;
  decrementStep: () => void;
}

export const useStepStore = create<StepState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  incrementStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  decrementStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
}));
