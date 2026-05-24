import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { PressableScale } from '@/components/ui/PressableScale';
import { CategoryToggle } from '@/components/ui/CategoryToggle';
import { OccasionPicker } from '@/components/ui/OccasionPicker';
import { ShimmerCard } from '@/components/animations/ShimmerLoader';
import { Typography, Spacing, Radii } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';
import { usePairingStore } from '@/store/pairing';
import { getPairing } from '@/lib/openai';
import { Category } from '@/types';

const { width, height } = Dimensions.get('window');
const SHUTTER_SIZE = 76;

type Facing = 'front' | 'back';

export default function CameraScreen() {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<Facing>('back');
  const [flash, setFlash] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const { category, occasion, setCategory, setOccasion, setImageUri, setResult, setLoading, setError, isLoading } = usePairingStore();

  const shutterScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const shutterStyle = useAnimatedStyle(() => ({ transform: [{ scale: shutterScale.value }] }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  const triggerCapture = useCallback(async () => {
    if (!cameraRef.current || isLoading) return;

    // Flash feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    shutterScale.value = withSequence(withSpring(0.88), withSpring(1));
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 60, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 350, easing: Easing.in(Easing.ease) }),
    );

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, exif: false });
      if (!photo) return;
      await processImage(photo.uri);
    } catch {
      setError('Could not take photo. Please try again.');
    }
  }, [isLoading]);

  const pickFromGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  }, []);

  const processImage = async (uri: string) => {
    setCapturedUri(uri);
    setImageUri(uri);
    setLoading(true);
    overlayOpacity.value = withTiming(1, { duration: 300 });

    try {
      const pairing = await getPairing(uri, category, occasion);
      setResult(pairing);
      setLoading(false);
      router.push('/pairing/result');
    } catch (err) {
      setLoading(false);
      setError('Pairing failed. Check your connection and try again.');
      overlayOpacity.value = withTiming(0, { duration: 300 });
      setCapturedUri(null);
    }
  };

  // Permission not determined yet
  if (!permission) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MeshBackground />
        <SafeAreaView style={styles.permissionSafe}>
          <View style={styles.permissionCenter}>
            <BlurView intensity={60} style={StyleSheet.absoluteFill} />
            <View style={[styles.permissionCard, { borderColor: colors.glassBorder }]}>
              <Text style={styles.permissionIcon}>📸</Text>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Camera Access</Text>
              <Text style={[styles.permissionDesc, { color: colors.textDim }]}>
                Pour needs your camera to identify dishes and bottles for AI pairing.
              </Text>
              <PressableScale onPress={requestPermission} style={styles.permissionBtn}>
                <LinearGradient
                  colors={['#9B2E50', '#7B1E3A']}
                  style={styles.permissionBtnGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.permissionBtnText}>Grant Access</Text>
                </LinearGradient>
              </PressableScale>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Live camera or captured preview */}
      {capturedUri ? (
        <Image source={{ uri: capturedUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash ? 'on' : 'off'}
        />
      )}

      {/* Flash overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.flashOverlay, flashStyle]}
        pointerEvents="none"
      />

      {/* Top controls */}
      <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={styles.topBar}>
          <PressableScale onPress={() => router.back()} style={styles.iconBtn}>
            <BlurView intensity={50} style={StyleSheet.absoluteFill} />
            <Text style={styles.iconBtnText}>✕</Text>
          </PressableScale>

          <BlurView intensity={40} style={styles.titlePill}>
            <Text style={styles.titleText}>Pour</Text>
          </BlurView>

          <PressableScale
            onPress={() => setFlash((f) => !f)}
            style={[styles.iconBtn, flash && styles.iconBtnActive]}
          >
            <BlurView intensity={50} style={StyleSheet.absoluteFill} />
            <Text style={styles.iconBtnText}>{flash ? '⚡' : '🔦'}</Text>
          </PressableScale>
        </View>

        {/* Bottom overlay */}
        <View style={styles.bottomSection} pointerEvents="box-none">
          <LinearGradient
            colors={['transparent', 'rgba(6,9,26,0.55)', 'rgba(6,9,26,0.92)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
          />

          {/* Occasion picker */}
          <OccasionPicker value={occasion} onChange={setOccasion} />

          {/* Category toggle */}
          <CategoryToggle value={category} onChange={setCategory} />

          {/* Shutter row */}
          <View style={styles.shutterRow}>
            {/* Gallery picker */}
            <PressableScale onPress={pickFromGallery} style={styles.sideBtn}>
              <BlurView intensity={50} style={StyleSheet.absoluteFill} />
              <Text style={styles.sideBtnIcon}>🖼️</Text>
              <Text style={styles.sideBtnLabel}>Gallery</Text>
            </PressableScale>

            {/* Shutter */}
            <Animated.View style={[styles.shutterOuter, shutterStyle]}>
              <PressableScale onPress={triggerCapture} haptic={false}>
                <View style={styles.shutterRing}>
                  <View style={styles.shutterInner} />
                </View>
              </PressableScale>
            </Animated.View>

            {/* Flip */}
            <PressableScale
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
              style={styles.sideBtn}
            >
              <BlurView intensity={50} style={StyleSheet.absoluteFill} />
              <Text style={styles.sideBtnIcon}>🔄</Text>
              <Text style={styles.sideBtnLabel}>Flip</Text>
            </PressableScale>
          </View>

          {/* Category hint */}
          <Text style={styles.hint}>
            {category === 'wine' ? 'Point at a dish or wine bottle' :
             category === 'whiskey' ? 'Point at food or a spirit bottle' :
             'Point at a dish to build a cocktail'}
          </Text>
        </View>
      </SafeAreaView>

      {/* Loading overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.loadingOverlay, overlayStyle]} pointerEvents={isLoading ? 'auto' : 'none'}>
        <BlurView intensity={40} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContent}>
          <PourLoadingIcon category={category} />
          <Text style={styles.loadingTitle}>Pouring your pairing…</Text>
          <Text style={styles.loadingSubtitle}>Analysing flavours & finding your perfect match</Text>
          <ShimmerCard />
        </View>
      </Animated.View>
    </View>
  );
}

function PourLoadingIcon({ category }: { category: Category }) {
  const fill = useSharedValue(0);
  React.useEffect(() => {
    fill.value = withSequence(
      withTiming(0.85, { duration: 1600, easing: Easing.out(Easing.cubic) }),
      withTiming(0.2, { duration: 800, easing: Easing.in(Easing.cubic) }),
    );
    const interval = setInterval(() => {
      fill.value = withSequence(
        withTiming(0.85, { duration: 1600, easing: Easing.out(Easing.cubic) }),
        withTiming(0.2, { duration: 800, easing: Easing.in(Easing.cubic) }),
      );
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const liquidStyle = useAnimatedStyle(() => ({ height: `${fill.value * 100}%` }));

  return (
    <View style={pourStyles.glassOuter}>
      <Animated.View style={[pourStyles.liquid, liquidStyle]}>
        <LinearGradient
          colors={category === 'wine' ? ['#9B2E50', '#5A1228'] : category === 'whiskey' ? ['#C8922A', '#7A5520'] : ['#2A6B8A', '#1A3A4A']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const pourStyles = StyleSheet.create({
  glassOuter: {
    width: 48,
    height: 64,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  liquid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  flashOverlay: { backgroundColor: '#FFFFFF' },
  permissionSafe: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  permissionCenter: {
    width: width * 0.85,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  permissionCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  permissionIcon: { fontSize: 48 },
  permissionTitle: { fontFamily: Typography.display, fontSize: 26 },
  permissionDesc: { fontFamily: Typography.body, fontSize: 15, textAlign: 'center', lineHeight: 24 },
  permissionBtn: { borderRadius: Radii.full, overflow: 'hidden', width: '100%' },
  permissionBtnGrad: { alignItems: 'center', paddingVertical: Spacing.md },
  permissionBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 16, color: '#F5F1E8' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.md,
    paddingBottom: Spacing.sm,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconBtnActive: { backgroundColor: 'rgba(212,175,55,0.3)' },
  iconBtnText: { fontSize: 18 },
  titlePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  titleText: { fontFamily: Typography.display, fontSize: 20, color: '#F5F1E8' },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: Spacing.md,
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  sideBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 2,
  },
  sideBtnIcon: { fontSize: 20 },
  sideBtnLabel: { fontFamily: Typography.body, fontSize: 10, color: 'rgba(245,241,232,0.7)' },
  shutterOuter: { alignItems: 'center', justifyContent: 'center' },
  shutterRing: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: SHUTTER_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  shutterInner: {
    width: SHUTTER_SIZE - 14,
    height: SHUTTER_SIZE - 14,
    borderRadius: (SHUTTER_SIZE - 14) / 2,
    backgroundColor: '#FFFFFF',
  },
  hint: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: 'rgba(245,241,232,0.55)',
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingOverlay: {
    backgroundColor: 'rgba(6,9,26,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: { alignItems: 'center', width: width * 0.9 },
  loadingTitle: {
    fontFamily: Typography.display,
    fontSize: 28,
    color: '#F5F1E8',
    marginBottom: Spacing.xs,
  },
  loadingSubtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: 'rgba(245,241,232,0.6)',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
