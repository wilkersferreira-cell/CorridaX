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
      mode="outlined"
      label={label}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      left={
        <TextInput.Icon
          icon={icon}
          color="#3B82F6"
        />
      }
      style={styles.input}
      contentStyle={styles.content}
      outlineStyle={styles.outline}
      textColor="#FFFFFF"
      theme={{
        colors: {
          background: '#16243B',
          primary: '#3B82F6',
          outline: '#29476B',
          onSurfaceVariant: '#8FA4C2',
        },
      }}
      autoCorrect={false}
      autoCapitalize="words"
      selectionColor="#3B82F6"
    />
  );
}

const styles = StyleSheet.create({

  input: {
    marginBottom: 18,
    backgroundColor: '#16243B',
  },

  content: {
    fontSize: 17,
    minHeight: 60,
  },

  outline: {
    borderRadius: 18,
    borderWidth: 1.5,
  },

});