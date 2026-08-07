import React from 'react';
import { StyleSheet } from 'react-native';

import { Button } from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  onPress: () => void;
  loading?: boolean;
};

export default function CompareButton({
  onPress,
  loading = false,
}: Props) {
  return (
    <Button
      mode="contained"
      icon={loading ? undefined : 'car-search'}
      onPress={onPress}
      loading={loading}
      disabled={loading}
      buttonColor={COLORS.primary}
      textColor={COLORS.white}
      style={[
        styles.button,
        !loading && SHADOWS.primary,
      ]}
      contentStyle={styles.content}
      labelStyle={styles.label}
    >
      {loading ? 'Comparando...' : 'Comparar Corridas'}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,

    borderRadius: RADIUS.lg,
  },

  content: {
    height: 58,
  },

  label: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
});