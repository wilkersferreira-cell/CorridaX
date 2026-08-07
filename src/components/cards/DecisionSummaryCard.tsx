import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Text } from 'react-native-paper';

import { RideOption } from '../../services/comparison';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  melhor: RideOption;
  maisBarata: RideOption;
  maisRapida: RideOption;
};

type DecisionItemProps = {
  icon: string;
  label: string;
  ride: RideOption;
  value: string;
  color: string;
};

function DecisionItem({
  icon,
  label,
  ride,
  value,
  color,
}: DecisionItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.icon}>
          {icon}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      <Text
        style={styles.appName}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {ride.nome}
      </Text>

      <Text
        style={[
          styles.value,
          {
            color,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

export default function DecisionSummaryCard({
  melhor,
  maisBarata,
  maisRapida,
}: Props) {
  const cheapestPrice =
    maisBarata.preco.toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      },
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Resumo da comparação
          </Text>

          <Text style={styles.subtitle}>
            Escolha de acordo com sua prioridade
          </Text>
        </View>

        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>
            CX
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.decisions}>
        <DecisionItem
          icon="🏆"
          label="Melhor"
          ride={melhor}
          value={`Score ${melhor.score}`}
          color={COLORS.recommended}
        />

        <View style={styles.verticalDivider} />

        <DecisionItem
          icon="💰"
          label="Mais barata"
          ride={maisBarata}
          value={cheapestPrice}
          color={COLORS.economy}
        />

        <View style={styles.verticalDivider} />

        <DecisionItem
          icon="⚡"
          label="Mais rápida"
          ride={maisRapida}
          value={`${maisRapida.tempo} min`}
          color={COLORS.info}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,

    padding: SPACING.lg,

    backgroundColor: COLORS.surfaceLight,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    borderRadius: RADIUS.xl,

    ...SHADOWS.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: COLORS.white,

    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  subtitle: {
    marginTop: SPACING.xs,

    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.xs,
  },

  aiBadge: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: RADIUS.md,

    backgroundColor: COLORS.primarySoft,
  },

  aiBadgeText: {
    color: COLORS.primaryLight,

    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.extraBold,
  },

  divider: {
    height: 1,

    marginVertical: SPACING.lg,

    backgroundColor: COLORS.borderSoft,
  },

  decisions: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  item: {
    flex: 1,
    alignItems: 'center',

    paddingHorizontal: SPACING.xs,
  },

  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    marginRight: SPACING.xs,

    fontSize: TYPOGRAPHY.size.sm,
  },

  label: {
    flexShrink: 1,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  appName: {
    marginTop: SPACING.sm,

    color: COLORS.white,

    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,

    textAlign: 'center',
  },

  value: {
    marginTop: SPACING.xs,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semiBold,

    textAlign: 'center',
  },

  verticalDivider: {
    width: 1,

    marginHorizontal: SPACING.xs,

    backgroundColor: COLORS.borderSoft,
  },
});