import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

type Props = {
  address: string;
  loading?: boolean;
};

export default function CurrentLocationCard({
  address,
  loading = false,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📍</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Minha localização
        </Text>

        {loading ? (
          <ActivityIndicator
            size="small"
            style={styles.loading}
          />
        ) : (
          <Text
            style={styles.address}
            numberOfLines={3}
          >
            {address || 'Endereço não identificado'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#18263D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#213754',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 22,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  address: {
    color: '#B8C5D8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  loading: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});