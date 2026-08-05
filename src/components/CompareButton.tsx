import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

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
      onPress={onPress}
      loading={loading}
      disabled={loading}
      style={styles.button}
      contentStyle={styles.content}
      labelStyle={styles.label}
    >
      {loading ? 'Comparando...' : 'Comparar Corridas'}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
  },

  content: {
    height: 58,
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});