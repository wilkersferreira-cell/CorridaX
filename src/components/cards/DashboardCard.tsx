import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Text } from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  icon: string;
  title: string;
  value: string;
  color?: string;
};

export default function DashboardCard({
  icon,
  title,
  value,
  color = COLORS.white,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>
          {icon}
        </Text>

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.value,
          {
            color,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,

    backgroundColor: COLORS.surfaceLight,

    borderRadius: RADIUS.xl,

    padding: SPACING.lg,
    margin: SPACING.xs,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    ...SHADOWS.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: TYPOGRAPHY.size.lg,
    marginRight: SPACING.sm,
  },

  title: {
    flex: 1,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    fontWeight: TYPOGRAPHY.weight.semiBold,
  },

  value: {
    marginTop: SPACING.md,

    fontSize: TYPOGRAPHY.size.xxl,
    lineHeight: TYPOGRAPHY.lineHeight.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});