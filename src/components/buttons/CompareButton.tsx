import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import {
  Button,
} from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SHADOWS,
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
      icon={
        loading
          ? undefined
          : 'car-search'
      }
      onPress={
        onPress
      }
      loading={
        loading
      }
      disabled={
        loading
      }
      buttonColor={
        COLORS.primary
      }
      textColor={
        COLORS.white
      }
      style={[
        styles.button,

        !loading &&
          SHADOWS.primary,
      ]}
      contentStyle={
        styles.content
      }
      labelStyle={
        styles.label
      }
    >
      {loading
        ? 'Comparando...'
        : 'Comparar Corridas'}
    </Button>
  );
}

const styles =
  StyleSheet.create({
    button: {
      borderRadius:
        RADIUS.lg,
    },

    content: {
      height: 50,
    },

    label: {
      fontSize: 16,

      fontWeight:
        TYPOGRAPHY.weight.bold,

      letterSpacing:
        TYPOGRAPHY.letterSpacing.normal,
    },
  });