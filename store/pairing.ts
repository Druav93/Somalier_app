import { create } from 'zustand';
import { Category, Occasion, PairingAIResult } from '@/types';

interface PairingState {
  imageUri: string | null;
  category: Category;
  occasion: Occasion | null;
  result: PairingAIResult | null;
  isLoading: boolean;
  error: string | null;
  setImageUri: (uri: string) => void;
  setCategory: (c: Category) => void;
  setOccasion: (o: Occasion | null) => void;
  setResult: (r: PairingAIResult) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const usePairingStore = create<PairingState>((set) => ({
  imageUri: null,
  category: 'wine',
  occasion: null,
  result: null,
  isLoading: false,
  error: null,
  setImageUri: (uri) => set({ imageUri: uri }),
  setCategory: (c) => set({ category: c }),
  setOccasion: (o) => set({ occasion: o }),
  setResult: (r) => set({ result: r }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),
  reset: () => set({ imageUri: null, result: null, isLoading: false, error: null }),
}));
