import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
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
import { Colors, Typography, Spacing, Radii } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function OnboardingWelcome() {
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

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));
  const bottleStyle = useAnimatedStyle(() => ({
    opacity: bottleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MeshBackground />

      <SafeAreaView style={styles.safe}>
        {/* Bottle hero */}
        <Animated.View style={[styles.heroSection, bottleStyle]}>
          <BottleHero />

          {/* Glow beneath bottle */}
          <View style={styles.glow} />
        </Animated.View>

        {/* Text */}
        <View style={styles.textSection}>
          <Animated.Text style={[styles.tagline, titleStyle]}>
            Pour
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Your personal AI sommelier.{'\n'}Point. Snap. Sip.
          </Animated.Text>
        </View>

        {/* Cards row */}
        <Animated.View style={[styles.cardRow, cardStyle]}>
          {[
            { icon: '🍷', label: 'Wine' },
            { icon: '🥃', label: 'Whiskey' },
            { icon: '🍸', label: 'Cocktails' },
          ].map((item) => (
            <GlassCard key={item.label} style={styles.categoryChip} intensity={50}>
              <View style={styles.chipInner}>
                <Text style={styles.chipIcon}>{item.icon}</Text>
                <Text style={styles.chipLabel}>{item.label}</Text>
              </View>
            </GlassCard>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaSection, cardStyle]}>
          <PressableScale onPress={() => router.push('/onboarding/taste-profile')} style={styles.ctaButton}>
            <LinearGradient
              colors={[Colors.burgundyLight, Colors.burgundy]}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.ctaText}>Build My Taste Profile</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale onPress={() => router.replace('/(tabs)/')} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </PressableScale>
        </Animated.View>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  safe: { flex: 1 },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
    height: height * 0.35,
  },
  glow: {
    position: 'absolute',
    bottom: 0,
    width: 160,
    height: 60,
    backgroundColor: Colors.burgundy,
    opacity: 0.25,
    borderRadius: 80,
    transform: [{ scaleX: 2 }],
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  tagline: {
    fontFamily: Typography.display,
    fontSize: 62,
    color: Colors.cream,
    letterSpacing: -1,
    lineHeight: 68,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 17,
    color: Colors.creamDim,
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
  categoryChip: {
    flex: 1,
    maxWidth: 100,
  },
  chipInner: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    gap: 4,
  },
  chipIcon: { fontSize: 22 },
  chipLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.cream,
  },
  ctaSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  ctaButton: {
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  ctaText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 16,
    color: Colors.cream,
  },
  ctaArrow: {
    fontFamily: Typography.bodyBold,
    fontSize: 18,
    color: Colors.gold,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.creamDim,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.lg,
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
