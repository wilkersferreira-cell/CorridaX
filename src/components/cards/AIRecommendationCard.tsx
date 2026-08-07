import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Card,
  Text,
} from 'react-native-paper';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  recommendation: string;
};

export default function AIRecommendationCard({
  recommendation,
}: Props) {
  if (!recommendation) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              🤖
            </Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              IA CorridaX
            </Text>

            <Text style={styles.subtitle}>
              Recomendação inteligente
            </Text>
          </View>
        </View>

        <Text style={styles.text}>
          {recommendation}
        </Text>

        <View style={styles.footer}>
          <View style={styles.statusDot} />

          <Text style={styles.footerText}>
            Análise CorridaX
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,

    borderRadius: RADIUS.xl,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    ...SHADOWS.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: RADIUS.md,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.primarySoft,
  },

  icon: {
    fontSize: TYPOGRAPHY.size.xl,
  },

  headerText: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  title: {
    color: COLORS.primaryLight,

    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  subtitle: {
    marginTop: SPACING.xs,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.sm,
  },

  text: {
    marginTop: SPACING.lg,

    color: COLORS.text,

    fontSize: TYPOGRAPHY.size.md,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: SPACING.lg,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.success,

    marginRight: SPACING.sm,
  },

  footerText: {
    color: COLORS.textMuted,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
});