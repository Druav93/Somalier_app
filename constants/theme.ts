// Shared accent colours that never change between modes
const accent = {
  burgundy: '#7B1E3A',
  burgundyLight: '#9B2E50',
  gold: '#C9A227',        // slightly richer for light bg readability
  goldLight: '#D4AF37',
  goldDim: '#9E7C1E',
} as const;

export const DarkColors = {
  ...accent,
  background: '#0A0E27',
  backgroundAlt: '#1A1F3A',
  surface: '#1A1F3A',
  surfaceAlt: '#242A4A',
  glass: 'rgba(255,255,255,0.08)',
  glassMid: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.15)',
  glassDark: 'rgba(0,0,0,0.3)',
  text: '#F5F1E8',
  textDim: '#C8C4BB',
  textMuted: '#888480',
  shimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'] as [string, string, string],
  gradientBg: ['#06091A', '#0A0E27', '#1A1F3A'] as [string, string, string],
  gradientCard: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)'] as [string, string],
  tabBar: 'rgba(10,14,39,0.75)',
  orbBurgundy: 'rgba(123,30,58,0.22)',
  orbGold: 'rgba(212,175,55,0.14)',
  orbMid: 'rgba(26,31,58,0.35)',
} as const;

export const LightColors = {
  ...accent,
  background: '#FAF7F2',
  backgroundAlt: '#EDE8DE',
  surface: '#FFFFFF',
  surfaceAlt: '#F2EDE3',
  glass: 'rgba(255,255,255,0.72)',
  glassMid: 'rgba(255,255,255,0.85)',
  glassBorder: 'rgba(0,0,0,0.07)',
  glassDark: 'rgba(0,0,0,0.06)',
  text: '#1A1F3A',
  textDim: '#5A5550',
  textMuted: '#9A9590',
  shimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)'] as [string, string, string],
  gradientBg: ['#FAF7F2', '#EDE8DE', '#E4DDD0'] as [string, string, string],
  gradientCard: ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.60)'] as [string, string],
  tabBar: 'rgba(250,247,242,0.88)',
  orbBurgundy: 'rgba(180,80,110,0.09)',
  orbGold: 'rgba(200,160,40,0.10)',
  orbMid: 'rgba(220,210,195,0.6)',
} as const;

export type ThemeColors = {
  // Accent (shared)
  burgundy: string;
  burgundyLight: string;
  gold: string;
  goldLight: string;
  goldDim: string;
  // Surfaces & text
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  glass: string;
  glassMid: string;
  glassBorder: string;
  glassDark: string;
  text: string;
  textDim: string;
  textMuted: string;
  // Gradients (tuples consumed by LinearGradient)
  shimmer: readonly [string, string, string];
  gradientBg: readonly [string, string, string];
  gradientCard: readonly [string, string];
  // UI
  tabBar: string;
  orbBurgundy: string;
  orbGold: string;
  orbMid: string;
};

// Non-color design tokens (same in both modes)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radii = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

export const Typography = {
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_700Bold_Italic',
  displayMedium: 'Fraunces_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const Spring = {
  default: { damping: 15, stiffness: 100 },
  bouncy: { damping: 12, stiffness: 120 },
  gentle: { damping: 20, stiffness: 80 },
} as const;

// Gradients reference (colour values pulled from active theme at runtime)
export const Gradients = {
  burgundy: ['#9B2E50', '#7B1E3A'] as [string, string],
  gold: ['#D4AF37', '#B8962E'] as [string, string],
} as const;
