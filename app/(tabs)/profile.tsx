import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Typography, Spacing, Radii } from '@/constants/theme';
import { useColors, useTheme } from '@/context/ThemeContext';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

type ThemeOption = { id: 'system' | 'light' | 'dark'; label: string; icon: string };

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'system', label: 'System', icon: '⚙️' },
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const { mode, setMode, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.avatarLarge, { backgroundColor: colors.burgundy }]}>
              <Text style={styles.avatarInitial}>A</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>Andrew</Text>
            <Text style={[styles.subtitle, { color: colors.textDim }]}>Connoisseur · 12 pairings saved</Text>
          </View>

          {/* Appearance section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.gold }]}>APPEARANCE</Text>
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🎨</Text>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Theme</Text>
                  <Text style={[styles.cardDesc, { color: colors.textDim }]}>
                    Currently {isDark ? 'Dark' : 'Light'} mode
                  </Text>
                </View>
              </View>
              <View style={[styles.themeRow, { backgroundColor: colors.glassDark, borderRadius: Radii.full }]}>
                {THEME_OPTIONS.map((opt) => (
                  <ThemePill
                    key={opt.id}
                    option={opt}
                    selected={mode === opt.id}
                    onSelect={() => setMode(opt.id)}
                    colors={colors}
                  />
                ))}
              </View>
            </GlassCard>
          </View>

          {/* Taste Profile section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.gold }]}>TASTE PROFILE</Text>
            <GlassCard style={styles.card}>
              {[
                { label: 'Sweetness', value: 3, emoji: '🍯' },
                { label: 'Body', value: 4, emoji: '⚖️' },
                { label: 'Acidity', value: 2, emoji: '🍋' },
                { label: 'Smokiness', value: 2, emoji: '🔥' },
              ].map((item, i, arr) => (
                <View key={item.label}>
                  <View style={styles.profileRow}>
                    <Text style={styles.profileEmoji}>{item.emoji}</Text>
                    <Text style={[styles.profileLabel, { color: colors.text }]}>{item.label}</Text>
                    <View style={[styles.profileTrack, { backgroundColor: colors.glassBorder }]}>
                      <View style={[styles.profileFill, { width: `${(item.value / 5) * 100}%`, backgroundColor: colors.gold }]} />
                    </View>
                  </View>
                  {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />}
                </View>
              ))}
            </GlassCard>
          </View>

          {/* Settings rows */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.gold }]}>ACCOUNT</Text>
            <GlassCard style={styles.card}>
              {[
                { icon: '🍾', label: 'My Bar Inventory', desc: '0 bottles tracked' },
                { icon: '❤️', label: 'Saved Pairings', desc: '12 favourites' },
                { icon: '📊', label: 'Pairing History', desc: '28 pairings all-time' },
                { icon: '⭐', label: 'Go Premium', desc: 'Unlock unlimited AI pairings' },
              ].map((row, i, arr) => (
                <View key={row.label}>
                  <PressableScale style={styles.settingsRow}>
                    <Text style={styles.settingsIcon}>{row.icon}</Text>
                    <View style={styles.settingsText}>
                      <Text style={[styles.settingsLabel, { color: colors.text }]}>{row.label}</Text>
                      <Text style={[styles.settingsDesc, { color: colors.textDim }]}>{row.desc}</Text>
                    </View>
                    <Text style={[styles.settingsChevron, { color: colors.textMuted }]}>›</Text>
                  </PressableScale>
                  {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />}
                </View>
              ))}
            </GlassCard>
          </View>

          {/* Coming soon note */}
          <GlassCard style={styles.comingSoon}>
            <Text style={[styles.comingSoonText, { color: colors.textDim }]}>
              Full profile screen with history, premium upsell, and Supabase auth coming in Screen 7.
            </Text>
          </GlassCard>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ThemePill({ option, selected, onSelect, colors }: {
  option: ThemeOption;
  selected: boolean;
  onSelect: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const scale = useSharedValue(selected ? 1 : 0.95);
  const pillStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  React.useEffect(() => {
    scale.value = withSpring(selected ? 1 : 0.95, { damping: 15, stiffness: 120 });
  }, [selected]);

  return (
    <PressableScale onPress={onSelect} style={{ flex: 1 }} haptic>
      <Animated.View style={[
        styles.themePill,
        pillStyle,
        selected && { backgroundColor: colors.gold },
      ]}>
        <Text style={styles.themePillIcon}>{option.icon}</Text>
        <Text style={[styles.themePillLabel, { color: selected ? '#0A0E27' : colors.textDim }]}>
          {option.label}
        </Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.lg },
  header: { alignItems: 'center', gap: Spacing.sm, paddingBottom: Spacing.sm },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: Typography.display, fontSize: 32, color: '#F5F1E8' },
  name: { fontFamily: Typography.display, fontSize: 28 },
  subtitle: { fontFamily: Typography.body, fontSize: 14 },
  section: { gap: Spacing.sm },
  sectionLabel: { fontFamily: Typography.bodyMedium, fontSize: 11, letterSpacing: 1.5, marginLeft: Spacing.xs },
  card: { padding: Spacing.md, gap: Spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardIcon: { fontSize: 24 },
  cardTitle: { fontFamily: Typography.bodySemiBold, fontSize: 15 },
  cardDesc: { fontFamily: Typography.body, fontSize: 12, marginTop: 2 },
  themeRow: { flexDirection: 'row', padding: 4, gap: 4 },
  themePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    gap: 4,
  },
  themePillIcon: { fontSize: 14 },
  themePillLabel: { fontFamily: Typography.bodyMedium, fontSize: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  profileEmoji: { fontSize: 16, width: 24 },
  profileLabel: { fontFamily: Typography.bodyMedium, fontSize: 13, width: 80 },
  profileTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  profileFill: { height: '100%', borderRadius: 3 },
  divider: { height: 1, marginVertical: 2 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  settingsIcon: { fontSize: 20, width: 28 },
  settingsText: { flex: 1 },
  settingsLabel: { fontFamily: Typography.bodyMedium, fontSize: 14 },
  settingsDesc: { fontFamily: Typography.body, fontSize: 12, marginTop: 2 },
  settingsChevron: { fontFamily: Typography.bodyBold, fontSize: 22 },
  comingSoon: { padding: Spacing.md },
  comingSoonText: { fontFamily: Typography.body, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
