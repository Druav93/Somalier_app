import React from 'react';
import { Text, TextStyle } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

interface GradientTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'display' | 'body' | 'gold';
}

export function GradientText({ children, style, variant = 'display' }: GradientTextProps) {
  const color = variant === 'gold' ? Colors.gold : Colors.cream;
  const fontFamily = variant === 'body' ? Typography.body : Typography.display;

  return (
    <Text style={[{ color, fontFamily }, style]}>
      {children}
    </Text>
  );
}
