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
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface OrbProps {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay?: number;
}

function Orb({ color, size, initialX, initialY, duration, delay = 0 }: OrbProps) {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  useEffect(() => {
    const targetX = initialX + (Math.random() - 0.5) * width * 0.6;
    const targetY = initialY + (Math.random() - 0.5) * height * 0.4;

    setTimeout(() => {
      x.value = withRepeat(
        withTiming(targetX, { duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
      y.value = withRepeat(
        withTiming(targetY, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.15,
        },
        style,
      ]}
    />
  );
}

export function MeshBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#06091A', '#0A0E27', '#1A1F3A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Orb color={Colors.burgundy} size={width * 0.8} initialX={-width * 0.2} initialY={height * 0.1} duration={8000} />
      <Orb color={Colors.gold} size={width * 0.6} initialX={width * 0.4} initialY={height * 0.5} duration={11000} delay={2000} />
      <Orb color={Colors.midnightLight} size={width * 0.9} initialX={width * 0.1} initialY={height * 0.3} duration={14000} delay={1000} />
    </View>
  );
}

const styles = StyleSheet.create({});
