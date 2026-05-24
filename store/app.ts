import { create } from 'zustand';
import { Pairing, BarItem } from '@/types';

interface AppState {
  onboardingComplete: boolean;
  pairings: Pairing[];
  favorites: string[];
  barItems: BarItem[];
  setOnboardingComplete: (v: boolean) => void;
  addPairing: (p: Pairing) => void;
  toggleFavorite: (id: string) => void;
  addBarItem: (item: BarItem) => void;
  removeBarItem: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  onboardingComplete: false,
  pairings: [],
  favorites: [],
  barItems: [],
  setOnboardingComplete: (v) => set({ onboardingComplete: v }),
  addPairing: (p) => set((s) => ({ pairings: [p, ...s.pairings] })),
  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id],
    })),
  addBarItem: (item) => set((s) => ({ barItems: [...s.barItems, item] })),
  removeBarItem: (id) => set((s) => ({ barItems: s.barItems.filter((b) => b.id !== id) })),
}));
