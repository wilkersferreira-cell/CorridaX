import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import {
  TextInput,
} from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (
    text: string,
  ) => void;
  icon: string;
  editable?: boolean;
  compact?: boolean;

  position?: 'top' | 'bottom';
};

export default function LocationInput({
  label,
  value,
  onChangeText,
  icon,
  editable = true,
  compact = false,
  position,
}: Props) {
  const grouped =
    position !== undefined;

  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      editable={editable}
      onChangeText={
        onChangeText
      }
      left={
        <TextInput.Icon
          icon={icon}
          color={
            compact
              ? COLORS.success
              : COLORS.primary
          }
          size={
            compact
              ? 18
              : 20
          }
        />
      }
      style={[
        styles.input,

        compact &&
          styles.inputCompact,

        grouped &&
          styles.inputGrouped,

        position === 'top' &&
          styles.inputTop,

        position === 'bottom' &&
          styles.inputBottom,

        !editable &&
          styles.inputDisabled,
      ]}
      contentStyle={[
        styles.content,

        compact &&
          styles.contentCompact,

        grouped &&
          styles.contentGrouped,
      ]}
      outlineStyle={[
        styles.outline,

        compact &&
          styles.outlineCompact,

        position === 'top' &&
          styles.outlineTop,

        position === 'bottom' &&
          styles.outlineBottom,
      ]}
      textColor={
        compact
          ? COLORS.textSecondary
          : COLORS.white
      }
      theme={{
        colors: {
          background:
            grouped
              ? COLORS.surface
              : compact
                ? COLORS.surface
                : COLORS.surfaceLight,

          primary:
            COLORS.primary,

          outline:
            grouped
              ? COLORS.borderSoft
              : compact
                ? COLORS.borderSoft
                : COLORS.border,

          onSurfaceVariant:
            COLORS.textSecondary,
        },
      }}
      autoCorrect={false}
      autoCapitalize="words"
      selectionColor={
        COLORS.primary
      }
    />
  );
}

const styles =
  StyleSheet.create({
    input: {
      marginBottom: 8,

      backgroundColor:
        COLORS.surfaceLight,
    },

    inputCompact: {
      marginBottom: 6,

      backgroundColor:
        COLORS.surface,
    },

    inputGrouped: {
      marginBottom: 0,

      backgroundColor:
        COLORS.surface,
    },

    inputTop: {
      zIndex: 2,
    },

    inputBottom: {
      marginTop: -1,

      zIndex: 1,
    },

    inputDisabled: {
      opacity: 1,
    },

    content: {
      minHeight: 50,

      fontSize: 16,
    },

    contentCompact: {
      minHeight: 42,

      fontSize:
        TYPOGRAPHY.size.md,
    },

    contentGrouped: {
      minHeight: 48,

      fontSize: 16,
    },

    outline: {
      borderRadius:
        RADIUS.lg,

      borderWidth: 1.5,
    },

    outlineCompact: {
      borderRadius:
        RADIUS.lg,

      borderWidth: 1,
    },

    outlineTop: {
      borderBottomLeftRadius: 0,

      borderBottomRightRadius: 0,

      borderWidth: 1,
    },

    outlineBottom: {
      borderTopLeftRadius: 0,

      borderTopRightRadius: 0,

      borderWidth: 1,
    },
  });