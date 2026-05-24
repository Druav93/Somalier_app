import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColors } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');

function Orb({ color, size, initialX, initialY, duration, delay = 0 }: {
  color: string; size: number; initialX: number; initialY: number; duration: number; delay?: number;
}) {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  useEffect(() => {
    const tx = initialX + (Math.random() - 0.5) * width * 0.6;
    const ty = initialY + (Math.random() - 0.5) * height * 0.4;
    setTimeout(() => {
      x.value = withRepeat(withTiming(tx, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
      y.value = withRepeat(withTiming(ty, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }), -1, true);
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}
    />
  );
}

export function MeshBackground() {
  const colors = useColors();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={colors.gradientBg}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Orb color={colors.orbBurgundy} size={width * 0.8} initialX={-width * 0.2} initialY={height * 0.1} duration={8000} />
      <Orb color={colors.orbGold} size={width * 0.6} initialX={width * 0.4} initialY={height * 0.5} duration={11000} delay={2000} />
      <Orb color={colors.orbMid} size={width * 0.9} initialX={width * 0.1} initialY={height * 0.3} duration={14000} delay={1000} />
    </View>
  );
}
