"use client";
import { create } from "zustand";

type Artist = {
  id: number;
  nameKr: string;
  nameEn: string;
  imageUrl: string;
  groupName: string | null;
  birthDate: string;
  debutDate: string;
};

type Event = {
  id: number;
  title: string;
  imageUrl: string;
  artistNamesEn: string[];
  artistNamesKr: string[];
  startDate: string;
  endDate: string;
  bookmarkCount: number;
  bookmarked: boolean;
};

type Review = {
  reviewId: number;
  eventId: number;
  title: string;
  content: string;
  images: {
    id: number;
    variants: {
      name: string;
      url: string;
    }[];
  }[];
};

type MainState = {
  birthdayArtists: Artist[];
  recommendedEvents: Event[];
  hotEvents: Event[];
  newEvents: Event[];
  latestReviews: Review[];
  setMainData: (data: Partial<MainState>) => void;
};

const useMainStore = create<MainState>((set) => ({
  birthdayArtists: [],
  recommendedEvents: [],
  hotEvents: [],
  newEvents: [],
  latestReviews: [],
  setMainData: (data) => set(() => ({ ...data })),
}));

export default useMainStore;
