import { create } from 'zustand';
import { Pairing, BarItem } from '@/types';

type ThemeMode = 'system' | 'light' | 'dark';

interface AppState {
  onboardingComplete: boolean;
  themeMode: ThemeMode;
  pairings: Pairing[];
  favorites: string[];
  barItems: BarItem[];
  setOnboardingComplete: (v: boolean) => void;
  setThemeMode: (m: ThemeMode) => void;
  addPairing: (p: Pairing) => void;
  toggleFavorite: (id: string) => void;
  addBarItem: (item: BarItem) => void;
  removeBarItem: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  onboardingComplete: false,
  themeMode: 'system',
  pairings: [],
  favorites: [],
  barItems: [],
  setOnboardingComplete: (v) => set({ onboardingComplete: v }),
  setThemeMode: (m) => set({ themeMode: m }),
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
