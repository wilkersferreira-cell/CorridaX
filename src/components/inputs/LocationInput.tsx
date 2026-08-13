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
  SPACING,
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
};

export default function LocationInput({
  label,
  value,
  onChangeText,
  icon,
  editable = true,
  compact = false,
}: Props) {
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
              ? 20
              : 24
          }
        />
      }
      style={[
        styles.input,

        compact &&
          styles.inputCompact,

        !editable &&
          styles.inputDisabled,
      ]}
      contentStyle={[
        styles.content,

        compact &&
          styles.contentCompact,
      ]}
      outlineStyle={[
        styles.outline,

        compact &&
          styles.outlineCompact,
      ]}
      textColor={
        compact
          ? COLORS.textSecondary
          : COLORS.white
      }
      theme={{
        colors: {
          background:
            compact
              ? COLORS.surface
              : COLORS.surfaceLight,

          primary:
            COLORS.primary,

          outline:
            compact
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
      marginBottom:
        SPACING.md,

      backgroundColor:
        COLORS.surfaceLight,
    },

    inputCompact: {
      backgroundColor:
        COLORS.surface,

      marginBottom:
        SPACING.sm,
    },

    inputDisabled: {
      opacity: 1,
    },

    content: {
      fontSize:
        TYPOGRAPHY.size.lg,

      minHeight: 58,
    },

    contentCompact: {
      fontSize:
        TYPOGRAPHY.size.md,

      minHeight: 44,
    },

    outline: {
      borderRadius:
        RADIUS.xl,

      borderWidth: 1.5,
    },

    outlineCompact: {
      borderRadius:
        RADIUS.lg,

      borderWidth: 1,
    },
  });