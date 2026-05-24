import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { PressableScale } from '@/components/ui/PressableScale';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Typography, Spacing, Radii } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboarding';
import { useAppStore } from '@/store/app';
import { Category } from '@/types';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

const CATEGORIES: { id: Category; label: string; icon: string; description: string; color: string }[] = [
  {
    id: 'wine',
    label: 'Wine',
    icon: '🍷',
    description: 'Red, white, rosé, sparkling & dessert',
    color: Colors.burgundy,
  },
  {
    id: 'whiskey',
    label: 'Whiskey',
    icon: '🥃',
    description: 'Scotch, bourbon, Irish & Japanese',
    color: '#4A3520',
  },
  {
    id: 'cocktail',
    label: 'Cocktails',
    icon: '🍸',
    description: 'Classic, craft & seasonal creations',
    color: '#1A3A4A',
  },
];

function CategoryCard({ item, selected, onToggle, delay }: {
  item: typeof CATEGORIES[0];
  selected: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const progress = useSharedValue(selected ? 1 : 0);
  const entryOpacity = useSharedValue(0);
  const entryY = useSharedValue(20);

  useEffect(() => {
    entryOpacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    entryY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, { damping: 15, stiffness: 120 });
  }, [selected]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [{ translateY: entryY.value }, { scale: interpolate(progress.value, [0, 1], [1, 1.02]) }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[{ width: CARD_WIDTH }, cardStyle]}>
      <PressableScale onPress={onToggle} style={styles.cardOuter} haptic>
        <View style={[styles.cardInner, { minHeight: 160 }]}>
          <BlurView intensity={55} style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.lg }]} />

          {/* Colored bottom accent when selected */}
          <Animated.View style={[styles.selectedAccent, borderStyle]}>
            <LinearGradient
              colors={[item.color, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
            />
          </Animated.View>

          {/* Border */}
          <Animated.View style={[styles.selectedBorder, borderStyle, { borderColor: Colors.gold }]} />
          <View style={[styles.defaultBorder, { borderRadius: Radii.lg }]} />

          {/* Checkmark */}
          <Animated.View style={[styles.check, checkStyle]}>
            <Text style={styles.checkText}>✓</Text>
          </Animated.View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export default function CategoriesScreen() {
  const { profile, toggleCategory } = useOnboardingStore();
  const { setOnboardingComplete } = useAppStore();

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 100 }));
    ctaOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({ opacity: ctaOpacity.value }));

  const handleFinish = () => {
    setOnboardingComplete(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)/');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MeshBackground />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Animated.View style={[styles.header, headerStyle]}>
            <Text style={styles.step}>Step 3 of 3</Text>
            <Text style={styles.title}>What Do You{'\n'}Love to Drink?</Text>
            <Text style={styles.description}>
              Select one or more — Pour will focus your recommendations here.
            </Text>
          </Animated.View>

          {/* Category cards */}
          <View style={styles.cardsGrid}>
            {CATEGORIES.map((item, i) => (
              <CategoryCard
                key={item.id}
                item={item}
                selected={profile.categories.includes(item.id)}
                onToggle={() => toggleCategory(item.id)}
                delay={250 + i * 100}
              />
            ))}
          </View>

          {/* Selection summary */}
          {profile.categories.length > 0 && (
            <GlassCard style={styles.summaryCard} intensity={40}>
              <Text style={styles.summaryText}>
                Great taste. Pour will curate{' '}
                <Text style={styles.summaryHighlight}>
                  {profile.categories.join(', ')}
                </Text>{' '}
                pairings for you.
              </Text>
            </GlassCard>
          )}
        </View>

        {/* Fixed bottom CTA */}
        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <PressableScale
            onPress={handleFinish}
            style={[styles.ctaButton, profile.categories.length === 0 && styles.ctaDisabled]}
            haptic={false}
          >
            <LinearGradient
              colors={profile.categories.length > 0
                ? [Colors.burgundyLight, Colors.burgundy]
                : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.ctaText}>Start Pouring 🍷</Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </PressableScale>
        </Animated.View>

        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  header: { gap: Spacing.xs },
  step: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Typography.display,
    fontSize: 38,
    color: Colors.cream,
    lineHeight: 46,
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.creamDim,
    lineHeight: 24,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardOuter: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  cardInner: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  defaultBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  selectedBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5,
    borderRadius: Radii.lg,
  },
  selectedAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.4,
  },
  check: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  checkText: { fontFamily: Typography.bodyBold, fontSize: 12, color: Colors.midnight },
  cardContent: {
    padding: Spacing.md,
    gap: 6,
  },
  cardIcon: { fontSize: 32 },
  cardLabel: {
    fontFamily: Typography.displayMedium,
    fontSize: 18,
    color: Colors.cream,
  },
  cardDesc: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.creamDim,
    lineHeight: 18,
  },
  summaryCard: {
    padding: Spacing.md,
  },
  summaryText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.creamDim,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryHighlight: {
    fontFamily: Typography.bodySemiBold,
    color: Colors.gold,
    textTransform: 'capitalize',
  },
  ctaSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  ctaButton: { borderRadius: Radii.full, overflow: 'hidden' },
  ctaDisabled: { opacity: 0.5 },
  ctaGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  ctaText: { fontFamily: Typography.bodySemiBold, fontSize: 16, color: Colors.cream },
  backButton: { alignItems: 'center', paddingVertical: Spacing.sm },
  backText: { fontFamily: Typography.body, fontSize: 14, color: Colors.creamDim },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: Spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.gold,
  },
});
