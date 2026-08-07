import React from 'react';
import { StyleSheet } from 'react-native';

import { IconButton } from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
} from '../../theme';

type Props = {
  onPress: () => void;
};

export default function SwapLocationsButton({
  onPress,
}: Props) {
  return (
    <IconButton
      icon="swap-vertical"
      mode="contained"
      size={24}
      onPress={onPress}
      style={styles.button}
      containerColor={COLORS.primary}
      iconColor={COLORS.white}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',

    marginVertical: SPACING.xs,

    borderRadius: RADIUS.round,

    ...SHADOWS.primary,
  },
});