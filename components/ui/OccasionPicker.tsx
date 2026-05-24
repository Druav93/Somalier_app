import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Typography, Spacing, Radii } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';
import { Occasion } from '@/types';

const OCCASIONS: { id: Occasion; label: string; icon: string }[] = [
  { id: 'casual', label: 'Casual', icon: '😊' },
  { id: 'date_night', label: 'Date Night', icon: '💑' },
  { id: 'dinner_party', label: 'Dinner Party', icon: '🍽️' },
  { id: 'bbq', label: 'BBQ', icon: '🔥' },
  { id: 'celebration', label: 'Celebrate', icon: '🥂' },
  { id: 'gift', label: 'Gift', icon: '🎁' },
];

interface OccasionPickerProps {
  value: Occasion | null;
  onChange: (o: Occasion | null) => void;
}

export function OccasionPicker({ value, onChange }: OccasionPickerProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {OCCASIONS.map((occ) => {
        const active = value === occ.id;
        return (
          <PressableScale
            key={occ.id}
            onPress={() => onChange(active ? null : occ.id)}
            haptic
          >
            <View style={[
              styles.pill,
              {
                backgroundColor: active ? colors.burgundy : 'rgba(0,0,0,0.25)',
                borderColor: active ? colors.burgundy : colors.glassBorder,
              },
            ]}>
              <Text style={styles.icon}>{occ.icon}</Text>
              <Text style={[styles.label, { color: active ? '#F5F1E8' : colors.textDim }]}>
                {occ.label}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  icon: { fontSize: 14 },
  label: { fontFamily: Typography.bodyMedium, fontSize: 13 },
});
