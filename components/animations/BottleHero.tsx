import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spring } from '@/constants/theme';

const { width } = Dimensions.get('window');
const BOTTLE_WIDTH = width * 0.18;
const BOTTLE_HEIGHT = BOTTLE_WIDTH * 3.2;

export function BottleHero() {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const liquidLevel = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withSpring(0, Spring.gentle);

    rotate.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    liquidLevel.value = withTiming(0.65, { duration: 1200, easing: Easing.out(Easing.cubic) });
  }, []);

  const bottleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  const liquidStyle = useAnimatedStyle(() => ({
    height: `${liquidLevel.value * 100}%`,
  }));

  return (
    <Animated.View style={[styles.container, bottleStyle]}>
      {/* Bottle body */}
      <View style={styles.bottleBody}>
        {/* Liquid fill */}
        <Animated.View style={[styles.liquidWrapper, liquidStyle]}>
          <LinearGradient
            colors={[Colors.burgundyLight, Colors.burgundy, '#3D0F1D']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          />
        </Animated.View>

        {/* Glass highlight */}
        <View style={styles.highlight} />
        <View style={styles.highlight2} />

        {/* Label */}
        <View style={styles.label}>
          <View style={styles.labelGold} />
        </View>
      </View>

      {/* Neck */}
      <View style={styles.neck}>
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Cork */}
      <View style={styles.cork} />

      {/* Reflection */}
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']}
        style={styles.glassSheen}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: BOTTLE_WIDTH + 40,
  },
  bottleBody: {
    width: BOTTLE_WIDTH,
    height: BOTTLE_HEIGHT,
    borderRadius: BOTTLE_WIDTH * 0.15,
    backgroundColor: 'rgba(20, 35, 20, 0.85)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  liquidWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 6,
    width: 5,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
  },
  highlight2: {
    position: 'absolute',
    top: 20,
    left: 14,
    width: 2,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
  },
  label: {
    position: 'absolute',
    bottom: '20%',
    left: 6,
    right: 6,
    height: BOTTLE_HEIGHT * 0.22,
    backgroundColor: 'rgba(245,241,232,0.92)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelGold: {
    width: '60%',
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 1,
  },
  neck: {
    width: BOTTLE_WIDTH * 0.5,
    height: BOTTLE_HEIGHT * 0.22,
    backgroundColor: 'rgba(20, 35, 20, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  cork: {
    width: BOTTLE_WIDTH * 0.35,
    height: 12,
    backgroundColor: '#C8A97E',
    borderRadius: 2,
  },
  glassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: '100%',
    borderRadius: BOTTLE_WIDTH * 0.15,
  },
});
