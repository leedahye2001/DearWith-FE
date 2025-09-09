import { create } from "zustand";

interface CarouselState {
  currentCarouselIndex: number;
  setCurrentCarouselIndex: (index: number) => void;
}

export const useCarouselStore = create<CarouselState>((set) => ({
  currentCarouselIndex: 0,
  setCurrentCarouselIndex: (index) => set({ currentCarouselIndex: index }),
}));
