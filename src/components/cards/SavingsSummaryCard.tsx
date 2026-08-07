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
  appName: string;
  amount: number;
};

export default function SavingsSummaryCard({
  appName,
  amount,
}: Props) {
  if (amount <= 0) {
    return null;
  }

  const formattedAmount = amount.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            💰
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.label}>
            Economia estimada
          </Text>

          <Text style={styles.helper}>
            Melhor opção encontrada
          </Text>
        </View>
      </View>

      <Text style={styles.amount}>
        {formattedAmount}
      </Text>

      <Text style={styles.description}>
        escolhendo{' '}
        <Text style={styles.appName}>
          {appName}
        </Text>{' '}
        nesta viagem
      </Text>

      <View style={styles.footer}>
        <View style={styles.statusDot} />

        <Text style={styles.footerText}>
          Comparação CorridaX
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,

    padding: SPACING.xl,

    backgroundColor: COLORS.successSoft,

    borderWidth: 1,
    borderColor: COLORS.success,

    borderRadius: RADIUS.xl,

    ...SHADOWS.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 42,
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: RADIUS.md,

    backgroundColor: COLORS.surfaceLight,
  },

  icon: {
    fontSize: TYPOGRAPHY.size.xl,
  },

  headerText: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  label: {
    color: COLORS.success,

    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  helper: {
    marginTop: SPACING.xs,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.xs,
  },

  amount: {
    marginTop: SPACING.md,

    color: COLORS.success,

    fontSize: TYPOGRAPHY.size.display,
    lineHeight: TYPOGRAPHY.lineHeight.display,
    fontWeight: TYPOGRAPHY.weight.extraBold,
  },

  description: {
    marginTop: SPACING.xs,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.size.md,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },

  appName: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: SPACING.lg,
  },

  statusDot: {
    width: 7,
    height: 7,

    marginRight: SPACING.sm,

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.success,
  },

  footerText: {
    color: COLORS.textMuted,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
});