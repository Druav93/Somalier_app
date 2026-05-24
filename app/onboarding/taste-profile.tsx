import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Colors, Typography, Spacing, Radii } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboarding';

export default function TasteProfile() {
  const { profile, setSweetness, setBody, setAcidity, setSmokiness } = useOnboardingStore();

  const headerY = useSharedValue(20);
  const headerOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(30);

  useEffect(() => {
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 100 }));
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    cardY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  const sliders = [
    { label: 'Sweetness', emoji: '🍯', left: 'Bone Dry', right: 'Luscious', value: profile.sweetness, onChange: setSweetness },
    { label: 'Body', emoji: '⚖️', left: 'Light', right: 'Full', value: profile.body, onChange: setBody },
    { label: 'Acidity', emoji: '🍋', left: 'Mellow', right: 'Bright', value: profile.acidity, onChange: setAcidity },
    { label: 'Smokiness', emoji: '🔥', left: 'Clean', right: 'Peaty', value: profile.smokiness, onChange: setSmokiness },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <MeshBackground />

        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View style={[styles.header, headerStyle]}>
              <Text style={styles.step}>Step 2 of 3</Text>
              <Text style={styles.title}>Your Palate</Text>
              <Text style={styles.description}>
                Slide each dial to capture your flavour preferences. We use this to personalise every pairing recommendation.
              </Text>
            </Animated.View>

            {/* Sliders card */}
            <Animated.View style={cardStyle}>
              <GlassCard style={styles.slidersCard} intensity={55}>
                {sliders.map((slider, i) => (
                  <View key={slider.label}>
                    <SliderRow {...slider} />
                    {i < sliders.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </GlassCard>
            </Animated.View>

            {/* Insight card */}
            <Animated.View style={cardStyle}>
              <GlassCard style={styles.insightCard} intensity={40}>
                <View style={styles.insightInner}>
                  <Text style={styles.insightIcon}>✨</Text>
                  <Text style={styles.insightText}>
                    Based on your profile, you might love a structured{' '}
                    <Text style={styles.insightHighlight}>Barolo</Text> or a{' '}
                    <Text style={styles.insightHighlight}>smoky Scotch Manhattan</Text>.
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>

            {/* CTA */}
            <Animated.View style={[styles.ctaSection, cardStyle]}>
              <PressableScale
                onPress={() => router.push('/onboarding/categories')}
                style={styles.ctaButton}
              >
                <LinearGradient
                  colors={[Colors.burgundyLight, Colors.burgundy]}
                  style={styles.ctaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.ctaText}>Continue</Text>
                  <Text style={styles.ctaArrow}>→</Text>
                </LinearGradient>
              </PressableScale>

              <PressableScale onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
              </PressableScale>
            </Animated.View>
          </ScrollView>

          {/* Progress */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

// Simple slider using native approach (avoids gesture handler complexity)
function SliderRow({ label, emoji, left, right, value, onChange }: {
  label: string; emoji: string; left: string; right: string; value: number; onChange: (v: number) => void;
}) {
  const steps = [1, 2, 3, 4, 5];

  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.labelRow}>
        <Text style={sliderStyles.emoji}>{emoji}</Text>
        <Text style={sliderStyles.label}>{label}</Text>
      </View>
      <View style={sliderStyles.stepsRow}>
        <Text style={sliderStyles.endLabel}>{left}</Text>
        <View style={sliderStyles.steps}>
          {steps.map((step) => (
            <PressableScale
              key={step}
              onPress={() => onChange(step)}
              style={[sliderStyles.step, step <= value && sliderStyles.stepActive]}
              haptic
            >
              <View style={[sliderStyles.stepDot, step <= value && sliderStyles.stepDotActive]} />
            </PressableScale>
          ))}
        </View>
        <Text style={sliderStyles.endLabel}>{right}</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: { paddingVertical: Spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  emoji: { fontSize: 16 },
  label: { fontFamily: Typography.bodySemiBold, color: Colors.cream, fontSize: 14 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  endLabel: { fontFamily: Typography.body, color: Colors.creamDim, fontSize: 11, width: 44, textAlign: 'center' },
  steps: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {},
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  stepDotActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
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
    fontSize: 42,
    color: Colors.cream,
    lineHeight: 48,
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.creamDim,
    lineHeight: 24,
  },
  slidersCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: -Spacing.md,
  },
  insightCard: {
    padding: Spacing.md,
  },
  insightInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  insightIcon: { fontSize: 18 },
  insightText: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.creamDim,
    lineHeight: 22,
  },
  insightHighlight: {
    fontFamily: Typography.bodySemiBold,
    color: Colors.gold,
  },
  ctaSection: { gap: Spacing.sm },
  ctaButton: { borderRadius: Radii.full, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  ctaText: { fontFamily: Typography.bodySemiBold, fontSize: 16, color: Colors.cream },
  ctaArrow: { fontFamily: Typography.bodyBold, fontSize: 18, color: Colors.gold },
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
