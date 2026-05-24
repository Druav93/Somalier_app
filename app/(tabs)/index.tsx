import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
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
import { Typography, Spacing, Radii, Gradients } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';
import { WEEKLY_PICK, TOP_PAIRINGS } from '@/data/pairings';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function HomeScreen() {
  const colors = useColors();
  const scrollY = useSharedValue(0);
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(30);
  const cardsOpacity = useSharedValue(0);

  useEffect(() => {
    heroOpacity.value = withDelay(100, withTiming(1, { duration: 700 }));
    heroY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 100 }));
    cardsOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);

  const scrollHandler = useAnimatedScrollHandler((e) => { scrollY.value = e.contentOffset.y; });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0.6]),
    transform: [{ translateY: interpolate(scrollY.value, [0, 80], [0, -8]) }],
  }));

  const heroStyle = useAnimatedStyle(() => ({ opacity: heroOpacity.value, transform: [{ translateY: heroY.value }] }));
  const cardsStyle = useAnimatedStyle(() => ({ opacity: cardsOpacity.value }));

  const recentPairings = TOP_PAIRINGS.slice(0, 5).map((p, i) => ({
    id: String(i),
    dish: p.dish,
    wine: p.wine.name,
    emoji: ['🍷', '🥃', '🍸', '🍷', '🥃'][i],
    region: p.wine.region,
    imageUrl: p.imageUrl,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View>
            <Text style={[styles.greeting, { color: colors.textDim }]}>Good evening 🌙</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Pour</Text>
          </View>
          <PressableScale onPress={() => router.push('/(tabs)/profile')}>
            <GlassCard style={styles.avatar}>
              <Text style={[styles.avatarText, { color: colors.gold }]}>A</Text>
            </GlassCard>
          </PressableScale>
        </Animated.View>

        <AnimatedScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero CTA */}
          <Animated.View style={heroStyle}>
            <PressableScale onPress={() => router.push('/(tabs)/camera')} style={styles.heroCTA}>
              <LinearGradient
                colors={Gradients.burgundy}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.heroContent}>
                  <Text style={styles.heroIcon}>📸</Text>
                  <View style={styles.heroText}>
                    <Text style={styles.heroTitle}>What's on your plate?</Text>
                    <Text style={styles.heroSubtitle}>Snap a dish or bottle for your perfect pairing</Text>
                  </View>
                </View>
                <View style={styles.heroShutter}>
                  <View style={styles.shutterOuter}>
                    <View style={styles.shutterInner} />
                  </View>
                </View>
                <View style={[styles.orb, { top: -30, right: -20, width: 100, height: 100 }]} />
                <View style={[styles.orb, { bottom: -20, left: 40, width: 70, height: 70, opacity: 0.12 }]} />
              </LinearGradient>
            </PressableScale>
          </Animated.View>

          {/* Weekly Pick */}
          <Animated.View style={cardsStyle}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Pick</Text>
            <PressableScale>
              <GlassCard style={styles.weeklyCard}>
                <LinearGradient
                  colors={['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.02)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.weeklyInner}>
                  <View style={styles.weeklyLeft}>
                    <Text style={[styles.weeklyBadge, { color: colors.gold }]}>✦ SOMMELIER'S CHOICE</Text>
                    <Text style={[styles.weeklyName, { color: colors.text }]}>{WEEKLY_PICK.name}</Text>
                    <Text style={[styles.weeklyProducer, { color: colors.gold }]}>{WEEKLY_PICK.producer}</Text>
                    <Text style={[styles.weeklyRegion, { color: colors.textDim }]}>{WEEKLY_PICK.region}</Text>
                    <Text style={[styles.weeklyRationale, { color: colors.textDim }]} numberOfLines={2}>
                      {WEEKLY_PICK.rationale}
                    </Text>
                    <View style={styles.weeklyFooter}>
                      <View style={[styles.priceTag, { borderColor: `${colors.gold}50`, backgroundColor: `${colors.gold}18` }]}>
                        <Text style={[styles.priceText, { color: colors.gold }]}>{WEEKLY_PICK.price}</Text>
                      </View>
                    </View>
                  </View>
                  {/* Real bottle image */}
                  <View style={styles.weeklyBottle}>
                    <Image
                      source={{ uri: WEEKLY_PICK.imageUrl }}
                      style={styles.weeklyBottleImg}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </GlassCard>
            </PressableScale>
          </Animated.View>

          {/* Recent Pairings */}
          <Animated.View style={cardsStyle}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Pairings</Text>
              <PressableScale>
                <Text style={[styles.seeAll, { color: colors.gold }]}>See all →</Text>
              </PressableScale>
            </View>
          </Animated.View>

          <Animated.View style={[cardsStyle, { marginHorizontal: -Spacing.lg }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              snapToInterval={CARD_WIDTH + Spacing.md}
              decelerationRate="fast"
            >
              {recentPairings.map((item) => (
                <PairingCarouselCard key={item.id} item={item} colors={colors} />
              ))}
              <PressableScale onPress={() => router.push('/(tabs)/camera')}>
                <GlassCard style={[styles.carouselCard, styles.emptyCard]}>
                  <Text style={[styles.emptyIcon, { color: colors.textDim }]}>+</Text>
                  <Text style={[styles.emptyLabel, { color: colors.textDim }]}>New Pairing</Text>
                </GlassCard>
              </PressableScale>
            </ScrollView>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={cardsStyle}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickRow}>
              {[
                { icon: '🎁', label: 'Gift Idea' },
                { icon: '🍖', label: 'BBQ Night' },
                { icon: '💑', label: 'Date Night' },
                { icon: '🍾', label: 'Celebrate' },
              ].map((action) => (
                <PressableScale key={action.label} onPress={() => router.push('/(tabs)/camera')} style={styles.quickItem}>
                  <GlassCard style={styles.quickCard}>
                    <Text style={styles.quickIcon}>{action.icon}</Text>
                    <Text style={[styles.quickLabel, { color: colors.textDim }]}>{action.label}</Text>
                  </GlassCard>
                </PressableScale>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </AnimatedScrollView>
      </SafeAreaView>
    </View>
  );
}

function PairingCarouselCard({ item, colors }: {
  item: { id: string; dish: string; wine: string; emoji: string; region: string; imageUrl: string };
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <PressableScale>
      <GlassCard style={styles.carouselCard}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.carouselBottleImg} resizeMode="contain" />
        ) : null}
        <View style={styles.carouselContent2}>
          <Text style={styles.carouselEmoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.carouselDish, { color: colors.text }]} numberOfLines={1}>{item.dish}</Text>
            <Text style={[styles.carouselWine, { color: colors.gold }]} numberOfLines={1}>{item.wine}</Text>
            <Text style={[styles.carouselRegion, { color: colors.textDim }]} numberOfLines={1}>{item.region}</Text>
          </View>
          <Text style={[styles.carouselArrow, { color: colors.textMuted }]}>›</Text>
        </View>
      </GlassCard>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting: { fontFamily: Typography.body, fontSize: 13 },
  headerTitle: { fontFamily: Typography.display, fontSize: 32, lineHeight: 38 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.bodySemiBold, fontSize: 16 },
  scrollContent: { paddingHorizontal: Spacing.lg, gap: Spacing.lg, paddingTop: Spacing.sm },
  heroCTA: { borderRadius: Radii.xl, overflow: 'hidden' },
  heroGradient: { padding: Spacing.lg, minHeight: 140, justifyContent: 'space-between', overflow: 'hidden' },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, zIndex: 1 },
  heroIcon: { fontSize: 36 },
  heroText: { flex: 1 },
  heroTitle: { fontFamily: Typography.displayMedium, fontSize: 20, color: '#F5F1E8', lineHeight: 26 },
  heroSubtitle: { fontFamily: Typography.body, fontSize: 13, color: 'rgba(245,241,232,0.7)', lineHeight: 20, marginTop: 4 },
  heroShutter: { alignItems: 'flex-end', zIndex: 1 },
  shutterOuter: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.9)' },
  orb: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, opacity: 0.2 },
  sectionTitle: { fontFamily: Typography.displayMedium, fontSize: 20, marginBottom: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  seeAll: { fontFamily: Typography.bodyMedium, fontSize: 13 },
  weeklyCard: { overflow: 'hidden' },
  weeklyInner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  weeklyLeft: { flex: 1, gap: 4 },
  weeklyBadge: { fontFamily: Typography.bodyMedium, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  weeklyName: { fontFamily: Typography.display, fontSize: 22, lineHeight: 28 },
  weeklyProducer: { fontFamily: Typography.bodyMedium, fontSize: 13 },
  weeklyRegion: { fontFamily: Typography.body, fontSize: 12 },
  weeklyRationale: { fontFamily: Typography.body, fontSize: 12, lineHeight: 18, marginTop: 4 },
  weeklyFooter: { flexDirection: 'row', marginTop: Spacing.sm },
  priceTag: { borderRadius: Radii.sm, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderWidth: 1 },
  priceText: { fontFamily: Typography.bodyMedium, fontSize: 12 },
  weeklyBottle: { width: 70, height: 120, justifyContent: 'center', alignItems: 'center' },
  weeklyBottleImg: { width: 60, height: 110, borderRadius: 4 },
  carouselContent: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingVertical: Spacing.xs },
  carouselCard: { width: CARD_WIDTH, overflow: 'hidden' },
  carouselBottleImg: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, opacity: 0.35 },
  carouselContent2: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.sm },
  carouselEmoji: { fontSize: 28 },
  carouselDish: { fontFamily: Typography.bodySemiBold, fontSize: 14 },
  carouselWine: { fontFamily: Typography.bodyMedium, fontSize: 12, marginTop: 2 },
  carouselRegion: { fontFamily: Typography.body, fontSize: 11 },
  carouselArrow: { fontFamily: Typography.bodyBold, fontSize: 22 },
  emptyCard: { width: CARD_WIDTH * 0.55, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  emptyIcon: { fontFamily: Typography.bodyBold, fontSize: 28 },
  emptyLabel: { fontFamily: Typography.bodyMedium, fontSize: 12, marginTop: 4 },
  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickItem: { flex: 1 },
  quickCard: { alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.xs, gap: 4 },
  quickIcon: { fontSize: 24 },
  quickLabel: { fontFamily: Typography.body, fontSize: 11, textAlign: 'center' },
});
