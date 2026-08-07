import React from 'react';
import { StyleSheet } from 'react-native';

import { Button } from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  onPress: () => void;
};

export default function SearchAddressButton({
  onPress,
}: Props) {
  return (
    <Button
      mode="outlined"
      icon="map-search-outline"
      onPress={onPress}
      textColor={COLORS.primaryLight}
      style={styles.button}
      contentStyle={styles.content}
      labelStyle={styles.label}
    >
      Buscar endereço
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: SPACING.lg,

    borderRadius: RADIUS.lg,
    borderColor: COLORS.border,
  },

  content: {
    minHeight: 50,
  },

  label: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semiBold,
  },
});