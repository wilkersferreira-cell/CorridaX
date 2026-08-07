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

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

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

            <Text
              style={styles.subtitle}
              numberOfLines={1}
            >
              Assistente Inteligente de Mobilidade
            </Text>
          </View>
        </View>

        <IconButton
          icon="cog-outline"
          iconColor={COLORS.white}
          containerColor={COLORS.surfaceElevated}
          size={24}
          style={styles.settingsButton}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xxl,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  greeting: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },

  title: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.size.title,
    lineHeight: TYPOGRAPHY.lineHeight.title,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },

  settingsButton: {
    borderRadius: RADIUS.round,
    margin: 0,
    marginLeft: SPACING.sm,
  },
});