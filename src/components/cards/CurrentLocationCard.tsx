import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  ActivityIndicator,
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
        <Text style={styles.icon}>
          📍
        </Text>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            Minha localização
          </Text>

          {!loading && (
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                GPS ativo
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
            />

            <Text style={styles.loadingText}>
              Obtendo localização...
            </Text>
          </View>
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

    marginBottom: SPACING.lg,
    padding: SPACING.lg,

    backgroundColor: COLORS.surfaceLight,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    borderRadius: RADIUS.lg,

    ...SHADOWS.sm,
  },

  iconContainer: {
    width: 44,
    height: 44,

    marginRight: SPACING.md,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.primarySoft,
  },

  icon: {
    fontSize: TYPOGRAPHY.size.xl,
  },

  textContainer: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    flexShrink: 1,

    color: COLORS.white,

    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginLeft: SPACING.sm,
  },

  statusDot: {
    width: 7,
    height: 7,

    marginRight: SPACING.xs,

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.success,
  },

  statusText: {
    color: COLORS.success,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semiBold,
  },

  address: {
    marginTop: SPACING.xs,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: SPACING.sm,
  },

  loadingText: {
    marginLeft: SPACING.sm,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.sm,
  },
});