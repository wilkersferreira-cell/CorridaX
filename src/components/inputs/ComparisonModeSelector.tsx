import React from 'react';

import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  Text,
} from 'react-native-paper';

import {
  ComparisonMode,
} from '../../services/comparison';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  value: ComparisonMode;

  onChange: (
    mode: ComparisonMode,
  ) => void;
};

type ModeOption = {
  id: ComparisonMode;

  icon:
    | 'scale-balance'
    | 'cash'
    | 'lightning-bolt';

  label: string;
};

const MODES: ModeOption[] = [
  {
    id: 'balanced',
    icon: 'scale-balance',
    label: 'Equilibrado',
  },

  {
    id: 'economy',
    icon: 'cash',
    label: 'Economizar',
  },

  {
    id: 'fast',
    icon: 'lightning-bolt',
    label: 'Rápido',
  },
];

export default function ComparisonModeSelector({
  value,
  onChange,
}: Props) {
  return (
    <View
      style={
        styles.container
      }
    >
      {MODES.map(
        (mode) => {
          const selected =
            value ===
            mode.id;

          return (
            <Pressable
              key={
                mode.id
              }
              onPress={() =>
                onChange(
                  mode.id,
                )
              }
              style={({
                pressed,
              }) => [
                styles.option,

                selected &&
                  styles.optionSelected,

                pressed &&
                  styles.optionPressed,
              ]}
            >
              <MaterialCommunityIcons
                name={
                  mode.icon
                }
                size={20}
                color={
                  selected
                    ? COLORS.primaryLight
                    : COLORS.textSecondary
                }
              />

              <Text
                style={[
                  styles.label,

                  selected &&
                    styles.labelSelected,
                ]}
                numberOfLines={
                  1
                }
              >
                {mode.label}
              </Text>
            </Pressable>
          );
        },
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        'row',

      padding: 4,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,

      borderRadius:
        RADIUS.xl,
    },

    option: {
      flex: 1,

      minHeight: 48,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 5,

      paddingHorizontal:
        SPACING.xs,

      borderRadius:
        RADIUS.lg,
    },

    optionSelected: {
      backgroundColor:
        COLORS.primarySoft,

      borderWidth: 1,

      borderColor:
        COLORS.primary,
    },

    optionPressed: {
      opacity: 0.75,
    },

    label: {
      color:
        COLORS.textSecondary,

      fontSize:
        TYPOGRAPHY.size.xs,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,
    },

    labelSelected: {
      color:
        COLORS.primaryLight,
    },
  });