import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radii } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
}

export function GlassCard({ children, style, intensity = 60, borderRadius = Radii.lg }: GlassCardProps) {
  return (
    <View style={[styles.wrapper, { borderRadius }, style]}>
      <BlurView intensity={intensity} style={[StyleSheet.absoluteFill, { borderRadius }]} />
      <View style={[styles.overlay, { borderRadius }]} />
      <View style={[styles.border, { borderRadius }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.glass,
  },
  border: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
