import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = ViewStyle;

export const SHADOWS: Record<
  'none' | 'sm' | 'md' | 'lg' | 'primary',
  ShadowStyle
> = {
  none: {},

  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) as ShadowStyle,

  md: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }) as ShadowStyle,

  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.24,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ShadowStyle,

  primary: Platform.select({
    ios: {
      shadowColor: '#1565FF',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    android: {
      elevation: 7,
    },
    default: {},
  }) as ShadowStyle,
};

export type ShadowToken = keyof typeof SHADOWS;