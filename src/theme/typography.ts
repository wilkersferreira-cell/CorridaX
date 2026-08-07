export const TYPOGRAPHY = {
  // Tamanhos
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    title: 30,
    display: 34,
  },

  // Pesos
  weight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },

  // Altura de linha
  lineHeight: {
    xs: 16,
    sm: 18,
    md: 22,
    lg: 24,
    xl: 28,
    title: 36,
    display: 40,
  },

  // Espaçamento entre letras
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export type TypographySize =
  keyof typeof TYPOGRAPHY.size;

export type TypographyWeight =
  keyof typeof TYPOGRAPHY.weight;