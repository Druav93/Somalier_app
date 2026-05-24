import React from 'react';
import { Text, TextStyle } from 'react-native';
import { Typography } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';

interface GradientTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'display' | 'body' | 'gold';
}

export function GradientText({ children, style, variant = 'display' }: GradientTextProps) {
  const colors = useColors();
  const color = variant === 'gold' ? colors.gold : colors.text;
  const fontFamily = variant === 'body' ? Typography.body : Typography.display;

  return (
    <Text style={[{ color, fontFamily }, style]}>
      {children}
    </Text>
  );
}
