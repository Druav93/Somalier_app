import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
import { GlassCard } from '@/components/ui/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Typography, Spacing, Radii, Gradients } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';
import { useOnboardingStore } from '@/store/onboarding';

export default function TasteProfile() {
  const colors = useColors();
  const { profile, setSweetness, setBody, setAcidity, setSmokiness } = useOnboardingStore();

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(30);

  useEffect(() => {
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    headerY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 100 }));
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    cardY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value, transform: [{ translateY: headerY.value }] }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value, transform: [{ translateY: cardY.value }] }));

  const sliders = [
    { label: 'Sweetness', emoji: '🍯', left: 'Bone Dry', right: 'Luscious', value: profile.sweetness, onChange: setSweetness },
    { label: 'Body', emoji: '⚖️', left: 'Light', right: 'Full', value: profile.body, onChange: setBody },
    { label: 'Acidity', emoji: '🍋', left: 'Mellow', right: 'Bright', value: profile.acidity, onChange: setAcidity },
    { label: 'Smokiness', emoji: '🔥', left: 'Clean', right: 'Peaty', value: profile.smokiness, onChange: setSmokiness },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.header, headerStyle]}>
            <Text style={[styles.step, { color: colors.gold }]}>Step 2 of 3</Text>
            <Text style={[styles.title, { color: colors.text }]}>Your Palate</Text>
            <Text style={[styles.description, { color: colors.textDim }]}>
              Tap each dial to set your flavour preferences. Pour uses this to personalise every recommendation.
            </Text>
          </Animated.View>

          <Animated.View style={cardStyle}>
            <GlassCard style={styles.slidersCard}>
              {sliders.map((slider, i) => (
                <View key={slider.label}>
                  <SliderRow {...slider} colors={colors} />
                  {i < sliders.length - 1 && <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />}
                </View>
              ))}
            </GlassCard>
          </Animated.View>

          <Animated.View style={cardStyle}>
            <GlassCard style={styles.insightCard}>
              <View style={styles.insightInner}>
                <Text style={styles.insightIcon}>✨</Text>
                <Text style={[styles.insightText, { color: colors.textDim }]}>
                  Based on your profile, you might love a structured{' '}
                  <Text style={[styles.insightHighlight, { color: colors.gold }]}>Barolo</Text> or a{' '}
                  <Text style={[styles.insightHighlight, { color: colors.gold }]}>smoky Scotch Manhattan</Text>.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View style={[styles.ctaSection, cardStyle]}>
            <PressableScale onPress={() => router.push('/onboarding/categories')} style={styles.ctaButton}>
              <LinearGradient colors={Gradients.burgundy} style={styles.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.ctaText}>Continue</Text>
                <Text style={[styles.ctaArrow, { color: colors.goldLight }]}>→</Text>
              </LinearGradient>
            </PressableScale>
            <PressableScale onPress={() => router.back()} style={styles.backButton}>
              <Text style={[styles.backText, { color: colors.textMuted }]}>← Back</Text>
            </PressableScale>
          </Animated.View>
        </ScrollView>

        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i === 1 ? colors.gold : colors.glassBorder, width: i === 1 ? 20 : 6 }]}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

function SliderRow({ label, emoji, left, right, value, onChange, colors }: {
  label: string; emoji: string; left: string; right: string; value: number;
  onChange: (v: number) => void; colors: ReturnType<typeof useColors>;
}) {
  const steps = [1, 2, 3, 4, 5];
  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.labelRow}>
        <Text style={sliderStyles.emoji}>{emoji}</Text>
        <Text style={[sliderStyles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={sliderStyles.stepsRow}>
        <Text style={[sliderStyles.endLabel, { color: colors.textMuted }]}>{left}</Text>
        <View style={sliderStyles.steps}>
          {steps.map((step) => (
            <PressableScale key={step} onPress={() => onChange(step)} style={sliderStyles.stepButton} haptic>
              <View style={[
                sliderStyles.stepDot,
                step <= value
                  ? { backgroundColor: colors.gold, borderColor: colors.gold }
                  : { backgroundColor: colors.glass, borderColor: colors.glassBorder },
              ]} />
            </PressableScale>
          ))}
        </View>
        <Text style={[sliderStyles.endLabel, { color: colors.textMuted }]}>{right}</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: { paddingVertical: Spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  emoji: { fontSize: 16 },
  label: { fontFamily: Typography.bodySemiBold, fontSize: 14 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  endLabel: { fontFamily: Typography.body, fontSize: 11, width: 44, textAlign: 'center' },
  steps: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  stepDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  header: { gap: Spacing.xs },
  step: { fontFamily: Typography.bodyMedium, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { fontFamily: Typography.display, fontSize: 42, lineHeight: 48 },
  description: { fontFamily: Typography.body, fontSize: 15, lineHeight: 24 },
  slidersCard: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  divider: { height: 1, marginHorizontal: -Spacing.md },
  insightCard: { padding: Spacing.md },
  insightInner: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  insightIcon: { fontSize: 18 },
  insightText: { flex: 1, fontFamily: Typography.body, fontSize: 14, lineHeight: 22 },
  insightHighlight: { fontFamily: Typography.bodySemiBold },
  ctaSection: { gap: Spacing.sm },
  ctaButton: { borderRadius: Radii.full, overflow: 'hidden' },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, gap: Spacing.sm },
  ctaText: { fontFamily: Typography.bodySemiBold, fontSize: 16, color: '#F5F1E8' },
  ctaArrow: { fontFamily: Typography.bodyBold, fontSize: 18 },
  backButton: { alignItems: 'center', paddingVertical: Spacing.sm },
  backText: { fontFamily: Typography.body, fontSize: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: Spacing.lg },
  dot: { height: 6, borderRadius: 3 },
});
