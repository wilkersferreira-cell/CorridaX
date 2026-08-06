import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.logo}>🚕</Text>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>CorridaX</Text>

          <Text style={styles.subtitle}>
            Compare preços em segundos
          </Text>
        </View>

        <IconButton
          icon="cog"
          size={24}
          mode="contained-tonal"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 24,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    fontSize: 34,
    marginRight: 10,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A5B4C7',
    fontSize: 15,
    marginTop: 2,
  },
});