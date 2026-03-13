/**
 * TaskUp Design System — Premium Organic-Tech Tokens
 * ─────────────────────────────────────────────────────
 * Central source of truth for colors, spacing, radii,
 * typography, shadows, and semantic mappings.
 */

// ── Colors ───────────────────────────────────────────
export const COLORS = {
  primaryMoss: '#2E4036',
  accentClay: '#CC5833',
  backgroundCream: '#F2F0E9',
  textCharcoal: '#1A1A1A',
  softSurface: '#FAF8F3',
  softBorder: 'rgba(46,64,54,0.12)',
  mutedText: 'rgba(26,26,26,0.55)',

  successSage: '#7A9B76',
  warningAmber: '#C58A2B',
  criticalRose: '#B64C4C',
  infoMist: '#A9B8B0',

  white: '#FFFFFF',
  transparent: 'transparent',

  // Surface tints
  mossLight: 'rgba(46,64,54,0.06)',
  clayLight: 'rgba(204,88,51,0.08)',
  sageLight: 'rgba(122,155,118,0.10)',
  amberLight: 'rgba(197,138,43,0.10)',
  roseLight: 'rgba(182,76,76,0.08)',
};

// ── Priority System ──────────────────────────────────
export const PRIORITY_COLORS = {
  low: '#7A9B76',
  medium: '#C58A2B',
  high: '#CC5833',
  urgent: '#B64C4C',
};

export const PRIORITY_BG = {
  low: 'rgba(122,155,118,0.12)',
  medium: 'rgba(197,138,43,0.12)',
  high: 'rgba(204,88,51,0.10)',
  urgent: 'rgba(182,76,76,0.10)',
};

export const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

// ── Zone Color System ────────────────────────────────
export const ZONE_COLORS = {
  'Work Zone':     { accent: '#A8705A', bg: 'rgba(168,112,90,0.10)' },
  'Reading Zone':  { accent: '#5A7F66', bg: 'rgba(90,127,102,0.10)' },
  'Meeting Zone':  { accent: '#5F7A6E', bg: 'rgba(95,122,110,0.10)' },
  'Food Zone':     { accent: '#C58A2B', bg: 'rgba(197,138,43,0.10)' },
  'Exam Zone':     { accent: '#B06050', bg: 'rgba(176,96,80,0.10)' },
  'Personal Zone': { accent: '#7A9B76', bg: 'rgba(122,155,118,0.10)' },
};

export const DEFAULT_ZONE_ACCENT = { accent: '#2E4036', bg: 'rgba(46,64,54,0.10)' };

export const getZoneColor = (zoneName) =>
  ZONE_COLORS[zoneName] || DEFAULT_ZONE_ACCENT;

// ── Typography ───────────────────────────────────────
export const FONTS = {
  heading: { fontFamily: 'System', fontWeight: '800' },
  headingLight: { fontFamily: 'System', fontWeight: '600' },
  body: { fontFamily: 'System', fontWeight: '400' },
  bodyMedium: { fontFamily: 'System', fontWeight: '500' },
  bodySemibold: { fontFamily: 'System', fontWeight: '600' },
  bodyBold: { fontFamily: 'System', fontWeight: '700' },
  mono: { fontFamily: 'Courier', fontWeight: '600' },
  label: { fontFamily: 'System', fontWeight: '700', letterSpacing: 1.2 },
};

export const TYPE = {
  h1: { fontSize: 30, lineHeight: 38, ...FONTS.heading },
  h2: { fontSize: 24, lineHeight: 32, ...FONTS.heading },
  h3: { fontSize: 20, lineHeight: 28, ...FONTS.heading },
  h4: { fontSize: 17, lineHeight: 24, ...FONTS.bodyBold },
  body: { fontSize: 15, lineHeight: 22, ...FONTS.body },
  bodySmall: { fontSize: 13, lineHeight: 20, ...FONTS.body },
  caption: { fontSize: 11, lineHeight: 16, ...FONTS.bodySemibold },
  label: { fontSize: 10, lineHeight: 14, ...FONTS.label },
  counter: { fontSize: 28, lineHeight: 36, ...FONTS.mono },
  counterSmall: { fontSize: 18, lineHeight: 24, ...FONTS.mono },
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
  section: 40,
};

// ── Radius ───────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 100,
};

// ── Shadows ──────────────────────────────────────────
export const SHADOWS = {
  soft: {
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  elevated: {
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  button: {
    shadowColor: '#2E4036',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};
