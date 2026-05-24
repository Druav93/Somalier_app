import { create } from 'zustand';
import { OnboardingProfile, Category } from '@/types';

interface OnboardingState {
  profile: OnboardingProfile;
  step: number;
  setStep: (step: number) => void;
  setSweetness: (v: number) => void;
  setBody: (v: number) => void;
  setAcidity: (v: number) => void;
  setSmokiness: (v: number) => void;
  toggleCategory: (cat: Category) => void;
  reset: () => void;
}

const defaultProfile: OnboardingProfile = {
  sweetness: 3,
  body: 3,
  acidity: 3,
  smokiness: 2,
  categories: ['wine', 'cocktail'],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  profile: { ...defaultProfile },
  step: 0,
  setStep: (step) => set({ step }),
  setSweetness: (v) => set((s) => ({ profile: { ...s.profile, sweetness: v } })),
  setBody: (v) => set((s) => ({ profile: { ...s.profile, body: v } })),
  setAcidity: (v) => set((s) => ({ profile: { ...s.profile, acidity: v } })),
  setSmokiness: (v) => set((s) => ({ profile: { ...s.profile, smokiness: v } })),
  toggleCategory: (cat) =>
    set((s) => {
      const cats = s.profile.categories;
      const next = cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat];
      return { profile: { ...s.profile, categories: next.length ? next : [cat] } };
    }),
  reset: () => set({ profile: { ...defaultProfile }, step: 0 }),
}));
