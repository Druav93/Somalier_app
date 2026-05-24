import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  Share,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/ui/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Typography, Spacing, Radii, Gradients, Spring } from '@/constants/theme';
import { useColors, useTheme } from '@/context/ThemeContext';
import { usePairingStore } from '@/store/pairing';
import { useAppStore } from '@/store/app';
import { BottleImages } from '@/data/pairings';
import { BudgetTier, Category, PairingOption } from '@/types';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.78;
const CARD_HEIGHT = 310;
const HERO_HEIGHT = height * 0.42;

const TIER_META: Record<BudgetTier, { label: string; color: string; icon: string }> = {
  budget: { label: 'Great Value', color: '#2A6B3A', icon: '✦' },
  mid: { label: "Sommelier's Pick", color: '#7B1E3A', icon: '★' },
  premium: { label: 'Premium', color: '#9E7C1E', icon: '◆' },
};

const BOTTLE_BY_CATEGORY: Record<Category, string> = {
  wine: BottleImages.redWine,
  whiskey: BottleImages.whiskey,
  cocktail: BottleImages.cocktail,
};

export default function ResultScreen() {
  const colors = useColors();
  const { isDark } = useTheme();
  const { imageUri, result, category, occasion, reset } = usePairingStore();
  const { addPairing, toggleFavorite, favorites } = useAppStore();

  const [activeCard, setActiveCard] = useState(1); // start on mid
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [savedId] = useState(() => Math.random().toString(36).slice(2));

  // Entry animations
  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(1.06);
  const pourLineH = useSharedValue(0);
  const cardsY = useSharedValue(60);
  const cardsOpacity = useSharedValue(0);
  const actionOpacity = useSharedValue(0);
  const whyHeight = useSharedValue(0);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => { scrollY.value = e.contentOffset.y; });

  useEffect(() => {
    // Cascade of reveal animations on mount
    heroOpacity.value = withTiming(1, { duration: 700 });
    heroScale.value = withSpring(1, Spring.gentle);
    pourLineH.value = withDelay(200, withTiming(HERO_HEIGHT, { duration: 900 }));
    cardsOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    cardsY.value = withDelay(500, withSpring(0, Spring.default));
    actionOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  const heroParallaxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, HERO_HEIGHT], [0, -HERO_HEIGHT * 0.3], Extrapolation.CLAMP) }],
  }));

  const pourStyle = useAnimatedStyle(() => ({ height: pourLineH.value }));

  const cardsStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsY.value }],
  }));

  const actionStyle = useAnimatedStyle(() => ({ opacity: actionOpacity.value }));

  const whyStyle = useAnimatedStyle(() => ({
    height: whyHeight.value,
    overflow: 'hidden',
  }));

  const toggleWhy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !whyExpanded;
    setWhyExpanded(next);
    whyHeight.value = withSpring(next ? 180 : 0, Spring.default);
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toggleFavorite(savedId);
  };

  const handleShare = async () => {
    const pairing = result?.pairings[activeCard];
    if (!pairing) return;
    try {
      await Share.share({
        title: `Pour pairing: ${result?.dish_description}`,
        message: `🍷 Pour recommends: ${pairing.name}\nWith: ${result?.dish_description}\n\n"${pairing.rationale}"\n\nDownload Pour for AI-powered wine & cocktail pairings.`,
      });
    } catch {}
  };

  const isFaved = favorites.includes(savedId);

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.noResult, { color: colors.textDim }]}>No pairing found. Go back and try again.</Text>
          <PressableScale onPress={() => router.back()}>
            <Text style={{ color: colors.gold, fontFamily: Typography.bodyMedium, marginTop: 16 }}>← Back</Text>
          </PressableScale>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#06091A' : '#FAF7F2' }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero image ── */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.heroImageWrapper, heroStyle, heroParallaxStyle]}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              <LinearGradient colors={Gradients.burgundy} style={styles.heroImage} />
            )}
          </Animated.View>

          {/* Pour line — animated vertical gold stroke */}
          <Animated.View style={[styles.pourLine, pourStyle]} pointerEvents="none" />

          {/* Gradient scrim */}
          <LinearGradient
            colors={isDark
              ? ['transparent', 'rgba(6,9,26,0.5)', 'rgba(6,9,26,0.98)']
              : ['transparent', 'rgba(250,247,242,0.4)', 'rgba(250,247,242,0.98)']}
            style={styles.heroScrim}
            start={{ x: 0.5, y: 0.1 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
          />

          {/* Back button */}
          <SafeAreaView style={styles.safeTop} pointerEvents="box-none">
            <PressableScale onPress={() => { reset(); router.back(); }} style={styles.backBtn}>
              <BlurView intensity={50} style={StyleSheet.absoluteFill} />
              <Text style={styles.backBtnText}>←</Text>
            </PressableScale>
          </SafeAreaView>

          {/* Dish name over hero */}
          <View style={styles.heroCaption}>
            {occasion && (
              <View style={styles.occasionBadge}>
                <Text style={styles.occasionText}>{occasion.replace(/_/g, ' ')}</Text>
              </View>
            )}
            <Text style={[styles.dishName, { color: isDark ? '#F5F1E8' : '#1A1F3A' }]} numberOfLines={2}>
              {result.dish_description}
            </Text>
            <Text style={[styles.dishSub, { color: isDark ? 'rgba(245,241,232,0.65)' : 'rgba(26,31,58,0.6)' }]}>
              {result.pairings.length} pairings found · {category}
            </Text>
          </View>
        </View>

        {/* ── Pairing cards ── */}
        <Animated.View style={cardsStyle}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>YOUR PAIRINGS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + Spacing.md}
            decelerationRate="fast"
            contentContainerStyle={styles.cardsScroll}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + Spacing.md));
              setActiveCard(Math.max(0, Math.min(result.pairings.length - 1, idx)));
            }}
            contentOffset={{ x: 1 * (CARD_WIDTH + Spacing.md), y: 0 }} // start on mid
          >
            {result.pairings.map((option, i) => (
              <PairingCardItem
                key={option.tier}
                option={option}
                category={category}
                isActive={i === activeCard}
                index={i}
              />
            ))}
          </ScrollView>

          {/* Dot indicators */}
          <View style={styles.dots}>
            {result.pairings.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === activeCard ? colors.gold : colors.glassBorder,
                    width: i === activeCard ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Why it works ── */}
        <Animated.View style={[styles.whySection, cardsStyle]}>
          <PressableScale onPress={toggleWhy} style={styles.whyHeader}>
            <GlassCard style={styles.whyHeaderCard}>
              <View style={styles.whyHeaderInner}>
                <Text style={styles.whyIcon}>🔬</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.whyTitle, { color: colors.text }]}>Why This Works</Text>
                  <Text style={[styles.whyDesc, { color: colors.textDim }]}>The science behind your pairing</Text>
                </View>
                <Text style={[styles.whyChevron, { color: colors.gold, transform: [{ rotate: whyExpanded ? '90deg' : '0deg' }] }]}>›</Text>
              </View>
              <Animated.View style={[whyStyle]}>
                <Text style={[styles.whyBody, { color: colors.textDim }]}>
                  {result.why_it_works}
                </Text>
              </Animated.View>
            </GlassCard>
          </PressableScale>
        </Animated.View>

        {/* ── Actions ── */}
        <Animated.View style={[styles.actions, actionStyle]}>
          <PressableScale onPress={handleSave} style={styles.actionBtn}>
            <LinearGradient
              colors={isFaved ? [colors.gold, colors.goldDim] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.actionGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.actionIcon}>{isFaved ? '❤️' : '🤍'}</Text>
              <Text style={[styles.actionLabel, { color: isFaved ? '#0A0E27' : colors.text }]}>
                {isFaved ? 'Saved' : 'Save'}
              </Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale onPress={handleShare} style={[styles.actionBtn, { flex: 2 }]}>
            <LinearGradient
              colors={Gradients.burgundy}
              style={styles.actionGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.actionIcon}>↑</Text>
              <Text style={[styles.actionLabel, { color: '#F5F1E8' }]}>Share Pairing Card</Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale
            onPress={() => { reset(); router.back(); }}
            style={styles.actionBtn}
          >
            <GlassCard style={styles.actionGlassInner}>
              <Text style={styles.actionIcon}>📸</Text>
              <Text style={[styles.actionLabel, { color: colors.text }]}>New Scan</Text>
            </GlassCard>
          </PressableScale>
        </Animated.View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ── Individual pairing card ─────────────────────────────────────────────────

function PairingCardItem({ option, category, isActive, index }: {
  option: PairingOption; category: Category; isActive: boolean; index: number;
}) {
  const colors = useColors();
  const { isDark } = useTheme();
  const meta = TIER_META[option.tier];
  const bottleImg = BOTTLE_BY_CATEGORY[category];

  const scale = useSharedValue(isActive ? 1 : 0.93);
  const opacity = useSharedValue(isActive ? 1 : 0.7);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.93, Spring.default);
    opacity.value = withTiming(isActive ? 1 : 0.7, { duration: 250 });
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[cardStyle, { width: CARD_WIDTH }]}>
      <GlassCard style={styles.pairingCard} intensity={isDark ? 65 : 55}>
        {/* Tier-coloured top bar */}
        <View style={[styles.tierBar, { backgroundColor: meta.color }]}>
          <Text style={styles.tierIcon}>{meta.icon}</Text>
          <Text style={styles.tierLabel}>{meta.label}</Text>
          <Text style={styles.tierPrice}>{option.price_range}</Text>
        </View>

        {/* Card body */}
        <View style={styles.cardBody}>
          {/* Bottle image */}
          <Image
            source={{ uri: bottleImg }}
            style={styles.bottleImg}
            resizeMode="contain"
          />

          {/* Info */}
          <View style={styles.cardInfo}>
            <Text style={[styles.pairingName, { color: colors.text }]} numberOfLines={2}>
              {option.name}
            </Text>
            {option.producer && (
              <Text style={[styles.pairingProducer, { color: colors.gold }]} numberOfLines={1}>
                {option.producer}
              </Text>
            )}
            {option.region && (
              <Text style={[styles.pairingRegion, { color: colors.textDim }]} numberOfLines={1}>
                {option.region}
                {option.vintage ? ` · ${option.vintage}` : ''}
              </Text>
            )}
            {option.serving_temp && (
              <View style={styles.tempRow}>
                <Text style={styles.tempIcon}>🌡</Text>
                <Text style={[styles.tempText, { color: colors.textMuted }]}>{option.serving_temp}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Rationale */}
        <View style={[styles.rationaleSection, { borderTopColor: colors.glassBorder }]}>
          <Text style={[styles.rationaleText, { color: colors.textDim }]}>
            {option.rationale}
          </Text>
        </View>

        {/* Food notes pills */}
        {option.food_notes.length > 0 && (
          <View style={styles.notesRow}>
            {option.food_notes.slice(0, 3).map((note) => (
              <View key={note} style={[styles.notePill, { backgroundColor: colors.glassMid, borderColor: colors.glassBorder }]}>
                <Text style={[styles.noteText, { color: colors.textDim }]}>{note}</Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: Spacing.xl },
  heroContainer: { height: HERO_HEIGHT, position: 'relative', overflow: 'hidden' },
  heroImageWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  heroImage: { width: '100%', height: '100%' },
  pourLine: {
    position: 'absolute',
    left: Spacing.xl + 12,
    top: 0,
    width: 2,
    backgroundColor: '#D4AF37',
    opacity: 0.7,
  },
  heroScrim: { position: 'absolute', bottom: 0, left: 0, right: 0, height: HERO_HEIGHT * 0.65 },
  safeTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: {
    marginTop: Platform.OS === 'android' ? Spacing.xl : Spacing.md,
    marginLeft: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: '#F5F1E8', fontSize: 20, fontFamily: Typography.bodyBold },
  heroCaption: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    gap: 4,
  },
  occasionBadge: {
    backgroundColor: 'rgba(123,30,58,0.7)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  occasionText: { fontFamily: Typography.bodyMedium, fontSize: 11, color: '#F5F1E8', textTransform: 'capitalize' },
  dishName: { fontFamily: Typography.display, fontSize: 30, lineHeight: 36 },
  dishSub: { fontFamily: Typography.body, fontSize: 13, textTransform: 'capitalize' },
  sectionLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    marginLeft: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cardsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  pairingCard: {
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  tierBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: Spacing.xs,
  },
  tierIcon: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  tierLabel: { flex: 1, fontFamily: Typography.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 0.8 },
  tierPrice: { fontFamily: Typography.bodySemiBold, fontSize: 13, color: '#FFFFFF' },
  cardBody: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: 'center',
  },
  bottleImg: { width: 56, height: 120 },
  cardInfo: { flex: 1, gap: 3 },
  pairingName: { fontFamily: Typography.display, fontSize: 20, lineHeight: 26 },
  pairingProducer: { fontFamily: Typography.bodyMedium, fontSize: 13 },
  pairingRegion: { fontFamily: Typography.body, fontSize: 12 },
  tempRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  tempIcon: { fontSize: 12 },
  tempText: { fontFamily: Typography.body, fontSize: 11 },
  rationaleSection: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.sm, borderTopWidth: 1 },
  rationaleText: { fontFamily: Typography.body, fontSize: 13, lineHeight: 20 },
  notesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  notePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full, borderWidth: 1 },
  noteText: { fontFamily: Typography.body, fontSize: 11 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: Spacing.md },
  dot: { height: 6, borderRadius: 3 },
  whySection: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg },
  whyHeader: {},
  whyHeaderCard: { padding: Spacing.md },
  whyHeaderInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  whyIcon: { fontSize: 22 },
  whyTitle: { fontFamily: Typography.bodySemiBold, fontSize: 15 },
  whyDesc: { fontFamily: Typography.body, fontSize: 12 },
  whyChevron: { fontFamily: Typography.bodyBold, fontSize: 24 },
  whyBody: { fontFamily: Typography.body, fontSize: 14, lineHeight: 22, paddingTop: Spacing.md },
  actions: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  actionBtn: { flex: 1, borderRadius: Radii.full, overflow: 'hidden' },
  actionGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, gap: 6 },
  actionGlassInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, gap: 6 },
  actionIcon: { fontSize: 16 },
  actionLabel: { fontFamily: Typography.bodyMedium, fontSize: 13 },
  noResult: { fontFamily: Typography.body, fontSize: 16 },
});
