export const COLORS = {
  // Marca
  primary: '#1565FF',
  primaryDark: '#0D47C8',
  primaryLight: '#57D2FF',

  // Fundos
  background: '#0B1320',
  surface: '#101B2D',
  surfaceLight: '#18263D',
  surfaceElevated: '#203451',

  // Textos
  text: '#F5F7FA',
  textSecondary: '#A5B4C7',
  textMuted: '#71839D',
  white: '#FFFFFF',
  black: '#000000',

  // Estados
  success: '#32D74B',
  warning: '#FFD54F',
  error: '#FF5252',
  info: '#64B5F6',

  // Bordas
  border: '#29476B',
  borderSoft: '#233754',

  // Corridas
  recommended: '#32D74B',
  economy: '#FFD54F',
  score: '#64B5F6',

  // Transparências
  overlay: 'rgba(0, 0, 0, 0.45)',
  primarySoft: 'rgba(21, 101, 255, 0.15)',
  successSoft: 'rgba(50, 215, 75, 0.12)',
} as const;

export type ColorToken = keyof typeof COLORS;