import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Radii } from '@/constants/theme';
import { useColors, useTheme } from '@/context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
}

export function GlassCard({ children, style, intensity, borderRadius = Radii.lg }: GlassCardProps) {
  const colors = useColors();
  const { isDark } = useTheme();
  const blurIntensity = intensity ?? (isDark ? 60 : 50);

  return (
    <View style={[styles.wrapper, { borderRadius }, style]}>
      <BlurView intensity={blurIntensity} style={[StyleSheet.absoluteFill, { borderRadius }]} />
      <View style={[styles.fill, { backgroundColor: colors.glass, borderRadius }]} />
      <View style={[styles.border, { borderColor: colors.glassBorder, borderRadius }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  border: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
