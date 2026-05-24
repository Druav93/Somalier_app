import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/context/ThemeContext';
import { Radii } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface ShimmerProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  borderRadius?: number;
}

export function ShimmerBox({ width: w = 200, height: h = 20, style, borderRadius = Radii.sm }: ShimmerProps) {
  const colors = useColors();
  const translateX = useSharedValue(-w);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(w * 2, { duration: 1400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [w]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        { width: w, height: h, borderRadius, overflow: 'hidden', backgroundColor: colors.glass },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={colors.shimmer}
          style={{ width: w, height: h }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>
    </View>
  );
}

export function ShimmerCard() {
  const colors = useColors();
  return (
    <View style={[shimmerStyles.card, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
      <ShimmerBox width={width * 0.6} height={28} borderRadius={Radii.md} style={{ marginBottom: 12 }} />
      <ShimmerBox width={width * 0.4} height={16} borderRadius={Radii.sm} style={{ marginBottom: 8 }} />
      <ShimmerBox width={width * 0.5} height={16} borderRadius={Radii.sm} style={{ marginBottom: 20 }} />
      <ShimmerBox width={width * 0.75} height={14} borderRadius={Radii.sm} style={{ marginBottom: 6 }} />
      <ShimmerBox width={width * 0.65} height={14} borderRadius={Radii.sm} />
    </View>
  );
}

const shimmerStyles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: Radii.xl,
    borderWidth: 1,
    margin: 16,
  },
});
