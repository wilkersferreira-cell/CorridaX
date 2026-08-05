import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚖 CorridaX</Text>

      <Text style={styles.subtitle}>
        Assistente Inteligente de Mobilidade
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },

  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#A5B4C7',
    textAlign: 'center',
    marginTop: 6,
  },
});