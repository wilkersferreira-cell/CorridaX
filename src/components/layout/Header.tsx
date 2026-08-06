import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  IconButton,
  Text,
} from 'react-native-paper';

import LogoCX from './LogoCX';

export default function Header() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Bom dia 👋'
      : hour < 18
      ? 'Boa tarde 👋'
      : 'Boa noite 🌙';

  return (
    <View style={styles.container}>

      <View style={styles.topRow}>

        <View style={styles.left}>

          <LogoCX size={64} />

          <View style={styles.textContainer}>

            <Text style={styles.greeting}>
              {greeting}
            </Text>

            <Text style={styles.title}>
              CorridaX
            </Text>

            <Text style={styles.subtitle}>
              Assistente Inteligente de Mobilidade
            </Text>

          </View>

        </View>

        <IconButton
          icon="cog-outline"
          iconColor="#FFFFFF"
          containerColor="#162845"
          size={24}
          onPress={() => {}}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginTop: 10,
    marginBottom: 22,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  textContainer: {
    marginLeft: 14,
    flex: 1,
  },

  greeting: {
    color: '#8EA4C6',
    fontSize: 14,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 2,
  },

  subtitle: {
    color: '#9FB2CC',
    fontSize: 14,
    marginTop: 2,
  },

});