import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Colors, Typography, Spacing, Radii, Gradients } from '@/constants/theme';
import { WEEKLY_PICK, TOP_PAIRINGS } from '@/data/pairings';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function HomeScreen() {
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(30);
  const cardsOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    heroOpacity.value = withDelay(200, withTiming(1, { duration: 700 }));
    heroY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    cardsOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
  }, []);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0.6]),
    transform: [{ translateY: interpolate(scrollY.value, [0, 80], [0, -10]) }],
  }));

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));

  const cardsStyle = useAnimatedStyle(() => ({ opacity: cardsOpacity.value }));

  const recentPairings = TOP_PAIRINGS.slice(0, 5).map((p, i) => ({
    id: String(i),
    dish: p.dish,
    wine: p.wine.name,
    emoji: ['🍷', '🥃', '🍸', '🍷', '🥃'][i],
    region: p.wine.region,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MeshBackground />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View>
            <Text style={styles.greeting}>Good evening 🌙</Text>
            <Text style={styles.headerTitle}>Pour</Text>
          </View>
          <PressableScale onPress={() => router.push('/(tabs)/profile')} style={styles.avatarButton}>
            <GlassCard style={styles.avatar} intensity={50}>
              <Text style={styles.avatarText}>A</Text>
            </GlassCard>
          </PressableScale>
        </Animated.View>

        <AnimatedScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Camera CTA */}
          <Animated.View style={heroStyle}>
            <PressableScale
              onPress={() => router.push('/(tabs)/camera')}
              style={styles.heroCTA}
            >
              <LinearGradient
                colors={[Colors.burgundyLight, Colors.burgundy, '#3D0F1D']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.heroContent}>
                  <Text style={styles.heroIcon}>📸</Text>
                  <View style={styles.heroText}>
                    <Text style={styles.heroTitle}>What's on your plate?</Text>
                    <Text style={styles.heroSubtitle}>Snap a dish or bottle to get your perfect pairing</Text>
                  </View>
                </View>
                <View style={styles.heroShutter}>
                  <View style={styles.shutterOuter}>
                    <View style={styles.shutterInner} />
                  </View>
                </View>
                {/* Decorative orbs */}
                <View style={[styles.orb, { top: -30, right: -20, width: 100, height: 100 }]} />
                <View style={[styles.orb, { bottom: -20, left: 40, width: 70, height: 70, opacity: 0.15 }]} />
              </LinearGradient>
            </PressableScale>
          </Animated.View>

          {/* Section: Weekly Pick */}
          <Animated.View style={cardsStyle}>
            <Text style={styles.sectionTitle}>Weekly Pick</Text>
            <PressableScale>
              <GlassCard style={styles.weeklyCard} intensity={55}>
                <LinearGradient
                  colors={['rgba(212,175,55,0.15)', 'rgba(212,175,55,0.03)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.weeklyInner}>
                  <View style={styles.weeklyLeft}>
                    <Text style={styles.weeklyBadge}>✦ SOMMELIER'S CHOICE</Text>
                    <Text style={styles.weeklyName}>{WEEKLY_PICK.name}</Text>
                    <Text style={styles.weeklyProducer}>{WEEKLY_PICK.producer}</Text>
                    <Text style={styles.weeklyRegion}>{WEEKLY_PICK.region}</Text>
                    <Text style={styles.weeklyRationale} numberOfLines={2}>
                      {WEEKLY_PICK.rationale}
                    </Text>
                    <View style={styles.weeklyFooter}>
                      <View style={styles.priceTag}>
                        <Text style={styles.priceText}>{WEEKLY_PICK.price}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.weeklyBottle}>
                    <Text style={{ fontSize: 56 }}>🍷</Text>
                  </View>
                </View>
              </GlassCard>
            </PressableScale>
          </Animated.View>

          {/* Section: Recent Pairings */}
          <Animated.View style={cardsStyle}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Pairings</Text>
              <PressableScale>
                <Text style={styles.seeAll}>See all →</Text>
              </PressableScale>
            </View>
          </Animated.View>

          {/* Horizontal scroll cards */}
          <Animated.View style={[cardsStyle, { marginHorizontal: -Spacing.lg }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              snapToInterval={CARD_WIDTH + Spacing.md}
              decelerationRate="fast"
            >
              {recentPairings.map((item) => (
                <PairingCarouselCard key={item.id} item={item} />
              ))}

              {/* Empty state card */}
              <PressableScale onPress={() => router.push('/(tabs)/camera')}>
                <GlassCard style={[styles.carouselCard, styles.emptyCard]} intensity={40}>
                  <Text style={styles.emptyIcon}>+</Text>
                  <Text style={styles.emptyLabel}>New Pairing</Text>
                </GlassCard>
              </PressableScale>
            </ScrollView>
          </Animated.View>

          {/* Quick actions */}
          <Animated.View style={[cardsStyle, styles.quickActions]}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickRow}>
              {[
                { icon: '🎁', label: 'Gift Idea', onPress: () => router.push('/(tabs)/camera') },
                { icon: '🍖', label: 'BBQ Night', onPress: () => router.push('/(tabs)/camera') },
                { icon: '💑', label: 'Date Night', onPress: () => router.push('/(tabs)/camera') },
                { icon: '🍾', label: 'Celebrate', onPress: () => router.push('/(tabs)/camera') },
              ].map((action) => (
                <PressableScale key={action.label} onPress={action.onPress} style={styles.quickItem}>
                  <GlassCard style={styles.quickCard} intensity={45}>
                    <Text style={styles.quickIcon}>{action.icon}</Text>
                    <Text style={styles.quickLabel}>{action.label}</Text>
                  </GlassCard>
                </PressableScale>
              ))}
            </View>
          </Animated.View>

          {/* Bottom padding for tab bar */}
          <View style={{ height: 100 }} />
        </AnimatedScrollView>
      </SafeAreaView>
    </View>
  );
}

function PairingCarouselCard({ item }: { item: { id: string; dish: string; wine: string; emoji: string; region: string } }) {
  return (
    <PressableScale>
      <GlassCard style={styles.carouselCard} intensity={55}>
        <LinearGradient
          colors={['rgba(123,30,58,0.3)', 'rgba(123,30,58,0.05)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.carouselContent2}>
          <Text style={styles.carouselEmoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.carouselDish} numberOfLines={1}>{item.dish}</Text>
            <Text style={styles.carouselWine} numberOfLines={1}>{item.wine}</Text>
            <Text style={styles.carouselRegion} numberOfLines={1}>{item.region}</Text>
          </View>
          <Text style={styles.carouselArrow}>›</Text>
        </View>
      </GlassCard>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.creamDim,
  },
  headerTitle: {
    fontFamily: Typography.display,
    fontSize: 32,
    color: Colors.cream,
    lineHeight: 38,
  },
  avatarButton: {},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 16,
    color: Colors.gold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  heroCTA: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: Spacing.lg,
    minHeight: 140,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: 1,
  },
  heroIcon: { fontSize: 36 },
  heroText: { flex: 1 },
  heroTitle: {
    fontFamily: Typography.displayMedium,
    fontSize: 20,
    color: Colors.cream,
    lineHeight: 26,
  },
  heroSubtitle: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: 'rgba(245,241,232,0.7)',
    lineHeight: 20,
    marginTop: 4,
  },
  heroShutter: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
  shutterOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  orb: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    opacity: 0.2,
  },
  sectionTitle: {
    fontFamily: Typography.displayMedium,
    fontSize: 20,
    color: Colors.cream,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.gold,
  },
  weeklyCard: {
    overflow: 'hidden',
    position: 'relative',
  },
  weeklyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  weeklyLeft: { flex: 1, gap: 4 },
  weeklyBadge: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  weeklyName: {
    fontFamily: Typography.display,
    fontSize: 22,
    color: Colors.cream,
    lineHeight: 28,
  },
  weeklyProducer: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.gold,
  },
  weeklyRegion: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.creamDim,
  },
  weeklyRationale: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.creamDim,
    lineHeight: 18,
    marginTop: 4,
  },
  weeklyFooter: { flexDirection: 'row', marginTop: Spacing.sm },
  priceTag: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  priceText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.gold,
  },
  weeklyBottle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  carouselCard: {
    width: CARD_WIDTH,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselContent2: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  carouselEmoji: { fontSize: 28 },
  carouselDish: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.cream,
  },
  carouselWine: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.gold,
    marginTop: 2,
  },
  carouselRegion: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.creamDim,
  },
  carouselArrow: {
    fontFamily: Typography.bodyBold,
    fontSize: 22,
    color: Colors.creamDim,
  },
  emptyCard: {
    width: CARD_WIDTH * 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyIcon: {
    fontFamily: Typography.bodyBold,
    fontSize: 28,
    color: Colors.creamDim,
  },
  emptyLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.creamDim,
    marginTop: 4,
  },
  quickActions: {},
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickItem: { flex: 1 },
  quickCard: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    gap: 4,
  },
  quickIcon: { fontSize: 24 },
  quickLabel: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.creamDim,
    textAlign: 'center',
  },
});
