import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
  Card,
  Text,
} from 'react-native-paper';

import { openRideApp } from '../../services/deepLinks';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  nome: string;
  preco: string;
  tempo?: string;
  distancia?: string;
  economia?: string;
  score?: number;
  destaque?: boolean;
};

type RideAppType = 'uber' | '99' | 'indrive';

export default function RideCard({
  nome,
  preco,
  tempo,
  distancia,
  economia,
  score,
  destaque = false,
}: Props) {
  const normalizedName = nome.toLowerCase();

  function getAppData(): {
    id: RideAppType;
    buttonLabel: string;
    type: RideAppType;
  } {
    if (normalizedName.includes('uber')) {
      return {
        id: 'uber',
        buttonLabel: 'Abrir Uber',
        type: 'uber',
      };
    }

    if (normalizedName.includes('99')) {
      return {
        id: '99',
        buttonLabel: 'Abrir 99',
        type: '99',
      };
    }

    return {
      id: 'indrive',
      buttonLabel: 'Abrir inDrive',
      type: 'indrive',
    };
  }

  const app = getAppData();

  async function handleOpenApp() {
    await openRideApp(app.id);
  }

  function Logo() {
    switch (app.type) {
      case '99':
        return (
          <View style={[styles.logo, styles.logo99]}>
            <Text style={styles.logo99Text}>
              99
            </Text>
          </View>
        );

      case 'uber':
        return (
          <View style={[styles.logo, styles.logoUber]}>
            <Text style={styles.logoUberText}>
              Uber
            </Text>
          </View>
        );

      default:
        return (
          <View style={[styles.logo, styles.logoIndrive]}>
            <Text style={styles.logoIndriveText}>
              iD
            </Text>
          </View>
        );
    }
  }

  const hasSaving =
    !!economia &&
    economia !== 'R$ 0.00' &&
    economia !== 'R$ 0,00';

  return (
    <Card
      style={[
        styles.card,
        destaque && styles.bestCard,
      ]}
    >
      <Card.Content>
        <View style={styles.header}>
          <Logo />

          <View style={styles.mainInfo}>
            <View style={styles.nameRow}>
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {nome}
              </Text>

              {destaque && (
                <View style={styles.recommendedPill}>
                  <Text style={styles.recommendedPillText}>
                    MELHOR
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.price}>
              {preco}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          {tempo && (
            <Text style={styles.info}>
              ⏱️ {tempo}
            </Text>
          )}

          {distancia && (
            <Text style={styles.info}>
              📏 {distancia}
            </Text>
          )}
        </View>

        {hasSaving && (
          <Text style={styles.saving}>
            💸 Economize {economia}
          </Text>
        )}

        {score !== undefined && (
          <View style={styles.scoreContainer}>
            <View style={styles.scoreHeader}>
              <Text style={styles.score}>
                ⭐ Score CorridaX
              </Text>

              <Text style={styles.scoreValue}>
                {score}
              </Text>
            </View>

            <View style={styles.scoreTrack}>
              <View
                style={[
                  styles.scoreProgress,
                  {
                    width: `${Math.min(
                      Math.max(score, 0),
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {destaque && (
          <Text style={styles.badge}>
            🏆 Melhor custo-benefício
          </Text>
        )}

        <Button
          mode="contained"
          icon="open-in-new"
          buttonColor={COLORS.primary}
          textColor={COLORS.white}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={handleOpenApp}
        >
          {app.buttonLabel}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.lg,

    borderRadius: RADIUS.xxl,

    backgroundColor: COLORS.surfaceLight,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    ...SHADOWS.md,
  },

  bestCard: {
    borderWidth: 2,
    borderColor: COLORS.recommended,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mainInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    flexShrink: 1,

    color: COLORS.white,

    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  recommendedPill: {
    marginLeft: SPACING.sm,

    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.successSoft,
  },

  recommendedPillText: {
    color: COLORS.recommended,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  price: {
    marginTop: SPACING.xs,

    color: COLORS.success,

    fontSize: TYPOGRAPHY.size.title,
    lineHeight: TYPOGRAPHY.lineHeight.title,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: SPACING.lg,
  },

  info: {
    color: COLORS.textSecondary,

    fontSize: TYPOGRAPHY.size.md,
  },

  saving: {
    marginTop: SPACING.sm,

    color: COLORS.economy,

    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  scoreContainer: {
    marginTop: SPACING.md,
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  score: {
    color: COLORS.score,

    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semiBold,
  },

  scoreValue: {
    color: COLORS.score,

    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  scoreTrack: {
    height: 6,

    marginTop: SPACING.sm,

    borderRadius: RADIUS.round,

    overflow: 'hidden',

    backgroundColor: COLORS.borderSoft,
  },

  scoreProgress: {
    height: '100%',

    borderRadius: RADIUS.round,

    backgroundColor: COLORS.score,
  },

  badge: {
    marginTop: SPACING.md,

    color: COLORS.recommended,

    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  button: {
    marginTop: SPACING.xl,

    borderRadius: RADIUS.md,
  },

  buttonContent: {
    height: 50,
  },

  buttonLabel: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  logo: {
    width: 60,
    height: 60,

    marginRight: SPACING.lg,

    borderRadius: RADIUS.lg,

    justifyContent: 'center',
    alignItems: 'center',
  },

  logo99: {
    backgroundColor: '#FFD400',
  },

  logo99Text: {
    color: COLORS.black,

    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  logoUber: {
    backgroundColor: COLORS.black,
  },

  logoUberText: {
    color: COLORS.white,

    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
  },

  logoIndrive: {
    backgroundColor: '#B8FF1A',
  },

  logoIndriveText: {
    color: COLORS.black,

    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
});