import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

type Props = {
  loading: boolean;
  address: string;
};

export default function LocationCard({ loading, address }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">📍 Sua localização</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 10 }} />
      ) : (
        <Text style={styles.address}>{address}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18263D',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  address: {
    marginTop: 8,
    color: '#FFFFFF',
  },
});