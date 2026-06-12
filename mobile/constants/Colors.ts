const tintColorLight = '#0B7A53';
const tintColorDark = '#34D399';

export default {
  light: {
    text: '#0F172A',
    background: '#F4F7F5',
    tint: tintColorLight,
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#D9E2DD',
    muted: '#64748B',
    accent: '#F59E0B',
    success: '#15803D',
    danger: '#DC2626',
    live: '#EA580C',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0B1220',
    tint: tintColorDark,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    card: '#111827',
    border: '#1F2937',
    muted: '#94A3B8',
    accent: '#FBBF24',
    success: '#4ADE80',
    danger: '#F87171',
    live: '#FB923C',
  },
};

export type ThemeColors = typeof import('./Colors').default.light;
