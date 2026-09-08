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
              ? 19
              : 21
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

        grouped &&
          styles.outlineGrouped,

        position === 'top' &&
          styles.outlineTop,

        position === 'bottom' &&
          styles.outlineBottom,
      ]}
      textColor={
        editable
          ? COLORS.white
          : COLORS.textSecondary
      }
      theme={{
        roundness: RADIUS.lg,

        colors: {
          background:
            COLORS.surface,

          primary:
            COLORS.primary,

          outline:
            COLORS.borderSoft,

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
        COLORS.surface,
    },

    inputCompact: {
      marginBottom: 5,
    },

    inputGrouped: {
      marginBottom: 0,
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
      minHeight: 54,
      paddingHorizontal: 2,
      fontSize: 16,
      fontWeight:
        TYPOGRAPHY.weight.medium,
    },

    contentCompact: {
      minHeight: 48,
      fontSize:
        TYPOGRAPHY.size.md,
    },

    contentGrouped: {
      minHeight: 52,
      fontSize: 16,
    },

    outline: {
      borderRadius:
        RADIUS.xl,
      borderWidth: 1.25,
    },

    outlineGrouped: {
      borderColor:
        COLORS.borderSoft,
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
