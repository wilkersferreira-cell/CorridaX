import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  COLORS,
  SHADOWS,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  size?: number;
};

export default function LogoCX({
  size = 60,
}: Props) {
  const radius = size * 0.28;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
      ]}
    >
      <Text
        style={[
          styles.c,
          {
            fontSize: size * 0.62,
          },
        ]}
      >
        C
      </Text>

      <Text
        style={[
          styles.x,
          {
            fontSize: size * 0.56,
          },
        ]}
      >
        X
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    ...SHADOWS.primary,
  },

  c: {
    position: 'absolute',

    left: '18%',

    color: COLORS.white,

    fontWeight: TYPOGRAPHY.weight.black,
  },

  x: {
    position: 'absolute',

    right: '15%',

    color: COLORS.primaryLight,

    fontWeight: TYPOGRAPHY.weight.black,
  },
});