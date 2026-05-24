import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PressableScale } from './PressableScale';
import { Typography, Spacing } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';

interface TasteSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
  emoji?: string;
}

export function TasteSlider({ label, leftLabel, rightLabel, value, onChange, emoji }: TasteSliderProps) {
  const colors = useColors();
  const steps = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.stepsRow}>
        <Text style={[styles.endLabel, { color: colors.textMuted }]}>{leftLabel}</Text>
        <View style={styles.steps}>
          {steps.map((step) => (
            <PressableScale key={step} onPress={() => onChange(step)} style={styles.stepButton} haptic>
              <View style={[
                styles.stepDot,
                step <= value
                  ? { backgroundColor: colors.gold, borderColor: colors.gold }
                  : { backgroundColor: colors.glass, borderColor: colors.glassBorder },
              ]} />
            </PressableScale>
          ))}
        </View>
        <Text style={[styles.endLabel, { color: colors.textMuted }]}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
