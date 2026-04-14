/**
 * TaskUp Design System — Neo Brutalism Tokens
 * ─────────────────────────────────────────────────────
 * Central source of truth for colors, spacing, radii,
 * typography, shadows, and semantic mappings.
 * Features: High contrast, stark borders, hard shadows, sharp corners.
 */

// ── Colors ───────────────────────────────────────────
export const COLORS = {
  primaryMoss: '#000000', // Black takes over as primary for brutalism
  accentClay: '#FF007F', // Hot Pink
  backgroundCream: '#FFFFFF', // Stark White
  textCharcoal: '#000000',
  softSurface: '#F0F0F0', // Very light gray for panels
  softBorder: '#000000', // Solid black borders everywhere
  mutedText: '#333333', // Darker gray for readability on white

  successSage: '#00FF88', // Neo Mint
  warningAmber: '#FFD500', // Bright Yellow
  criticalRose: '#FF007F', // Hot Pink
  infoMist: '#00FFFF', // Cyan

  white: '#FFFFFF',
  transparent: 'transparent',

  // Surface tints - replaced with high-contrast variants
  mossLight: '#E6E6E6', // Light gray
  clayLight: '#FFB3D9', // Light pink
  sageLight: '#B3FFD6', // Light mint
  amberLight: '#FFF2B3', // Light yellow
  roseLight: '#FFB3D9', // Light pink
  cyanLight: '#B3FFFF', // Light cyan
};

// ── Priority System ──────────────────────────────────
export const PRIORITY_COLORS = {
  low: '#00FF88', // Neo Mint
  medium: '#00FFFF', // Cyan
  high: '#FFD500', // Bright Yellow
  urgent: '#FF007F', // Hot Pink
};

export const PRIORITY_BG = {
  low: '#B3FFD6',
  medium: '#B3FFFF',
  high: '#FFF2B3',
  urgent: '#FFB3D9',
};

export const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

// ── Zone Color System ────────────────────────────────
export const ZONE_COLORS = {
  'Work Zone':     { accent: '#FF007F', bg: '#FFB3D9' }, // Hot Pink
  'Reading Zone':  { accent: '#00FFFF', bg: '#B3FFFF' }, // Cyan
  'Meeting Zone':  { accent: '#FFD500', bg: '#FFF2B3' }, // Yellow
  'Food Zone':     { accent: '#00FF88', bg: '#B3FFD6' }, // Mint
  'Exam Zone':     { accent: '#FF007F', bg: '#FFB3D9' }, // Pink
  'Personal Zone': { accent: '#00FFFF', bg: '#B3FFFF' }, // Cyan
};

export const DEFAULT_ZONE_ACCENT = { accent: '#000000', bg: '#E6E6E6' };

export const getZoneColor = (zoneName) =>
  ZONE_COLORS[zoneName] || DEFAULT_ZONE_ACCENT;

// ── Typography ───────────────────────────────────────
export const FONTS = {
  heading: { fontFamily: 'System', fontWeight: '900' }, // Heaviest weight possible
  headingLight: { fontFamily: 'System', fontWeight: '800' },
  body: { fontFamily: 'System', fontWeight: '500' },
  bodyMedium: { fontFamily: 'System', fontWeight: '600' },
  bodySemibold: { fontFamily: 'System', fontWeight: '700' },
  bodyBold: { fontFamily: 'System', fontWeight: '800' },
  mono: { fontFamily: 'Courier', fontWeight: '700' },
  label: { fontFamily: 'System', fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' }, // Bold, uppercase labels
};

export const TYPE = {
  h1: { fontSize: 32, lineHeight: 40, ...FONTS.heading },
  h2: { fontSize: 26, lineHeight: 34, ...FONTS.heading },
  h3: { fontSize: 22, lineHeight: 30, ...FONTS.heading },
  h4: { fontSize: 18, lineHeight: 26, ...FONTS.bodyBold },
  body: { fontSize: 16, lineHeight: 24, ...FONTS.body },
  bodySmall: { fontSize: 14, lineHeight: 22, ...FONTS.body },
  caption: { fontSize: 12, lineHeight: 18, ...FONTS.bodySemibold },
  label: { fontSize: 11, lineHeight: 16, ...FONTS.label },
  counter: { fontSize: 32, lineHeight: 40, ...FONTS.mono },
  counterSmall: { fontSize: 20, lineHeight: 26, ...FONTS.mono },
};

// ── Spacing ──────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48, // slightly more breathing room for blocky UI
};

// ── Radius ───────────────────────────────────────────
// Neo Brutalism uses sharp corners or very square radii
export const RADIUS = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  xxl: 8, // Overridden pill shapes to squares
  pill: 8, // Overridden pill shapes to squares
};

// ── Shadows ──────────────────────────────────────────
// Hard block shadows, no blur, solid black
export const SHADOWS = {
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 },
    elevation: 4, 
  },
  card: {
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 5, height: 5 },
    elevation: 6,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
    elevation: 8,
  },
  button: {
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
    elevation: 4,
  },
};
