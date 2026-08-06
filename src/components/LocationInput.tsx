import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

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
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      left={<TextInput.Icon icon={icon} />}
      style={styles.input}
      contentStyle={styles.content}
      outlineStyle={styles.outline}
      autoCorrect={false}
      autoCapitalize="words"
      dense={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: '#101826',
  },

  content: {
    fontSize: 17,
    minHeight: 58,
  },

  outline: {
    borderRadius: 14,
    borderWidth: 1.2,
  },
});