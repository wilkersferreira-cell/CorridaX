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
              ? SPACING.xs + 6
              : SPACING.sm + 6,
        },
      ]}
    >
      <View style={styles.brandRow}>
        <LogoCX size={46} />

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
    marginBottom: SPACING.md,
  },

  brandRow: {
    minHeight: 56,

    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,

    marginLeft: SPACING.md,

    justifyContent: 'center',
  },

  title: {
    color: COLORS.white,

    fontSize: 25,
    lineHeight: 29,

    fontWeight:
      TYPOGRAPHY.weight.extraBold,

    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 1,

    color:
      COLORS.textSecondary,

    fontSize:
      TYPOGRAPHY.size.sm,

    lineHeight: 18,

    fontWeight:
      TYPOGRAPHY.weight.medium,

    letterSpacing: 0.1,
  },
});