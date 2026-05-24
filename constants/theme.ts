export const Colors = {
  midnight: '#0A0E27',
  midnightDeep: '#06091A',
  midnightLight: '#1A1F3A',
  burgundy: '#7B1E3A',
  burgundyLight: '#9B2E50',
  gold: '#D4AF37',
  goldLight: '#E8C84A',
  cream: '#F5F1E8',
  creamDim: '#C8C4BB',
  white: '#FFFFFF',
  glass: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.15)',
  glassDark: 'rgba(0,0,0,0.3)',
  overlay: 'rgba(10,14,39,0.7)',
} as const;

export const Gradients = {
  background: ['#0A0E27', '#1A1F3A'] as [string, string],
  backgroundDeep: ['#06091A', '#0A0E27', '#1A1F3A'] as [string, string, string],
  burgundy: ['#7B1E3A', '#5A1228'] as [string, string],
  gold: ['#D4AF37', '#B8962E'] as [string, string],
  card: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)'] as [string, string],
  shimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'] as [string, string, string],
} as const;

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
