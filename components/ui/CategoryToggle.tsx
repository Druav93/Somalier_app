import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { PressableScale } from './PressableScale';
import { Typography, Spacing, Radii, Spring } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';
import { Category } from '@/types';

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'wine', label: 'Wine', icon: '🍷' },
  { id: 'whiskey', label: 'Whiskey', icon: '🥃' },
  { id: 'cocktail', label: 'Cocktail', icon: '🍸' },
];

interface CategoryToggleProps {
  value: Category;
  onChange: (c: Category) => void;
}

export function CategoryToggle({ value, onChange }: CategoryToggleProps) {
  const colors = useColors();
  const activeIndex = CATEGORIES.findIndex((c) => c.id === value);
  const indicatorX = useSharedValue(activeIndex * (100 / 3));

  useEffect(() => {
    indicatorX.value = withSpring(activeIndex * (100 / 3), Spring.bouncy);
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorX.value}%`,
  }));

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={70} style={StyleSheet.absoluteFill} />
      <View style={[styles.track, { borderColor: colors.glassBorder }]}>
        {/* Sliding indicator */}
        <Animated.View style={[styles.indicator, { backgroundColor: colors.burgundy }, indicatorStyle]} />

        {CATEGORIES.map((cat) => (
          <PressableScale
            key={cat.id}
            style={styles.pill}
            onPress={() => onChange(cat.id)}
            haptic
          >
            <Text style={styles.pillIcon}>{cat.icon}</Text>
            <Text style={[styles.pillLabel, { color: value === cat.id ? '#F5F1E8' : colors.textDim }]}>
              {cat.label}
            </Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radii.full,
    overflow: 'hidden',
    marginHorizontal: Spacing.xl,
  },
  track: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 3,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: `${100 / 3}%`,
    borderRadius: Radii.full,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: 4,
    zIndex: 1,
  },
  pillIcon: { fontSize: 14 },
  pillLabel: { fontFamily: Typography.bodyMedium, fontSize: 13 },
});
