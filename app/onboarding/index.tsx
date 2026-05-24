import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
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
import { MeshBackground } from '@/components/animations/MeshBackground';
import { BottleHero } from '@/components/animations/BottleHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Typography, Spacing, Radii, Gradients } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';

const { height } = Dimensions.get('window');

export default function OnboardingWelcome() {
  const colors = useColors();

  const titleY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(40);
  const bottleOpacity = useSharedValue(0);

  useEffect(() => {
    bottleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 700 }));
    titleY.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));
    subtitleOpacity.value = withDelay(650, withTiming(1, { duration: 600 }));
    subtitleY.value = withDelay(650, withSpring(0, { damping: 15, stiffness: 100 }));
    cardOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    cardY.value = withDelay(900, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value, transform: [{ translateY: titleY.value }] }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value, transform: [{ translateY: subtitleY.value }] }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value, transform: [{ translateY: cardY.value }] }));
  const bottleStyle = useAnimatedStyle(() => ({ opacity: bottleOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        {/* Bottle hero */}
        <Animated.View style={[styles.heroSection, bottleStyle]}>
          <BottleHero imageIndex={0} />
        </Animated.View>

        {/* Text */}
        <View style={styles.textSection}>
          <Animated.Text style={[styles.tagline, { color: colors.text }, titleStyle]}>
            Pour
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { color: colors.textDim }, subtitleStyle]}>
            Your personal AI sommelier.{'\n'}Point. Snap. Sip.
          </Animated.Text>
        </View>

        {/* Category chips */}
        <Animated.View style={[styles.cardRow, cardStyle]}>
          {[{ icon: '🍷', label: 'Wine' }, { icon: '🥃', label: 'Whiskey' }, { icon: '🍸', label: 'Cocktails' }].map((item) => (
            <GlassCard key={item.label} style={styles.categoryChip}>
              <View style={styles.chipInner}>
                <Text style={styles.chipIcon}>{item.icon}</Text>
                <Text style={[styles.chipLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
            </GlassCard>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaSection, cardStyle]}>
          <PressableScale onPress={() => router.push('/onboarding/taste-profile')} style={styles.ctaButton}>
            <LinearGradient
              colors={Gradients.burgundy}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.ctaText}>Build My Taste Profile</Text>
              <Text style={[styles.ctaArrow, { color: colors.goldLight }]}>→</Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale onPress={() => router.replace('/(tabs)/')} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip for now</Text>
          </PressableScale>
        </Animated.View>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i === 0 ? colors.gold : colors.glassBorder }]}
              {...(i === 0 ? { width: 20 } : {})}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
    height: height * 0.35,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  tagline: {
    fontFamily: Typography.display,
    fontSize: 62,
    letterSpacing: -1,
    lineHeight: 68,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 17,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 26,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  categoryChip: { flex: 1, maxWidth: 100 },
  chipInner: { alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs, gap: 4 },
  chipIcon: { fontSize: 22 },
  chipLabel: { fontFamily: Typography.bodyMedium, fontSize: 12 },
  ctaSection: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl, gap: Spacing.sm },
  ctaButton: { borderRadius: Radii.full, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  ctaText: { fontFamily: Typography.bodySemiBold, fontSize: 16, color: '#F5F1E8' },
  ctaArrow: { fontFamily: Typography.bodyBold, fontSize: 18 },
  skipButton: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipText: { fontFamily: Typography.body, fontSize: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: Spacing.lg },
  dot: { height: 6, borderRadius: 3, width: 6 },
});
