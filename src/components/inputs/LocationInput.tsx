import React from 'react';
import { StyleSheet } from 'react-native';

import { TextInput } from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  editable?: boolean;
};

export default function LocationInput({
  label,
  value,
  onChangeText,
  icon,
  editable = true,
}: Props) {
  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      left={
        <TextInput.Icon
          icon={icon}
          color={COLORS.primary}
        />
      }
      style={[
        styles.input,
        !editable && styles.inputDisabled,
      ]}
      contentStyle={styles.content}
      outlineStyle={styles.outline}
      textColor={COLORS.white}
      theme={{
        colors: {
          background: COLORS.surfaceLight,
          primary: COLORS.primary,
          outline: COLORS.border,
          onSurfaceVariant: COLORS.textSecondary,
        },
      }}
      autoCorrect={false}
      autoCapitalize="words"
      selectionColor={COLORS.primary}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surfaceLight,
  },

  inputDisabled: {
    opacity: 0.9,
  },

  content: {
    fontSize: TYPOGRAPHY.size.lg,
    minHeight: 60,
  },

  outline: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
  },
});