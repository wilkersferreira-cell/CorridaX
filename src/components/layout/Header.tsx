import React from 'react';

import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {
  Text,
} from 'react-native-paper';

import LogoCX from './LogoCX';

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

export default function Header() {
  const statusBarHeight =
    Platform.OS === 'android'
      ? StatusBar.currentHeight ?? 0
      : 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
  statusBarHeight > 0
    ? SPACING.sm + 20
    : SPACING.md + 18,
        },
      ]}
    >
      <View style={styles.brandRow}>
        <LogoCX size={42} />

        <View style={styles.textContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            CorridaX
          </Text>

          <Text
            style={styles.subtitle}
            numberOfLines={1}
          >
            Compare. Escolha. Economize.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  brandRow: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,

    marginLeft: 11,

    justifyContent: 'center',
  },

  title: {
    color: COLORS.white,

    fontSize: 23,
    lineHeight: 26,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,

    letterSpacing: -0.45,
  },

  subtitle: {
    marginTop: 1,

    color:
      COLORS.textSecondary,

    fontSize: 12,
    lineHeight: 16,

    fontWeight:
      TYPOGRAPHY.weight.medium,

    letterSpacing: 0.05,
  },
});