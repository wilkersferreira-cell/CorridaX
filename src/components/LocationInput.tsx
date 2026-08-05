import React from 'react';
import { TextInput } from 'react-native-paper';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
};

export default function LocationInput({
  label,
  value,
  onChangeText,
  icon,
}: Props) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      left={<TextInput.Icon icon={icon} />}
      style={{ marginBottom: 16 }}
    />
  );
}