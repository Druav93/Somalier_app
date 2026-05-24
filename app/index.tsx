import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppStore } from '@/store/app';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (onboardingComplete) {
      router.replace('/(tabs)/');
    } else {
      router.replace('/onboarding');
    }
  }, []);

  return null;
}
