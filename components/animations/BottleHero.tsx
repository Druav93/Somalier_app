import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
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
import { useTheme } from '@/context/ThemeContext';
import { Spring } from '@/constants/theme';

const { width } = Dimensions.get('window');
const IMG_WIDTH = width * 0.30;
const IMG_HEIGHT = IMG_WIDTH * 3.0;

// Curated high-quality wine bottle photographs from Unsplash
// Photographer credit shown in-app on production builds
const BOTTLE_IMAGES = [
  // Classic dark Bordeaux bottle — Christopher Bill / Unsplash
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=90',
  // Burgundy/Pinot style bottle — Lefteris kallergis / Unsplash
  'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&auto=format&fit=crop&q=90',
];

export function BottleHero({ imageIndex = 0 }: { imageIndex?: number }) {
  const { isDark } = useTheme();
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 900 });
    translateY.value = withSpring(0, Spring.gentle);
    rotate.value = withRepeat(
      withSequence(
        withTiming(2.5, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2.5, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  const bottleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  const uri = BOTTLE_IMAGES[imageIndex % BOTTLE_IMAGES.length];

  return (
    <Animated.View style={[styles.container, bottleStyle]}>
      {/* Glow layer behind bottle */}
      <View style={[styles.glow, isDark ? styles.glowDark : styles.glowLight]} />

      {/* Bottle image with drop shadow */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="contain"
        />
        {/* Subtle vignette/fade at bottom */}
        <LinearGradient
          colors={['transparent', isDark ? 'rgba(10,14,39,0.4)' : 'rgba(250,247,242,0.4)']}
          style={styles.bottomFade}
          start={{ x: 0.5, y: 0.4 }}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: IMG_WIDTH + 60,
    height: IMG_HEIGHT + 30,
  },
  glow: {
    position: 'absolute',
    bottom: 0,
    width: IMG_WIDTH * 1.4,
    height: 50,
    borderRadius: 50,
    transform: [{ scaleX: 1.6 }],
  },
  glowDark: {
    backgroundColor: 'rgba(123,30,58,0.35)',
  },
  glowLight: {
    backgroundColor: 'rgba(180,80,100,0.18)',
  },
  imageWrapper: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: IMG_HEIGHT * 0.3,
  },
});
