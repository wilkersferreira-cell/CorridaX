import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  Button,
  Text,
} from 'react-native-paper';

import {
  RideOption,
} from '../../services/comparison';

import {
  openRideApp,
  RideLocation,
} from '../../services/deepLinks';

import CalibrationCard, {
  CalibrationCardProps,
} from './CalibrationCard';

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

export type RideAppId =
  | 'uber'
  | '99'
  | 'indrive';

type Props = {
  ride: RideOption;

  recommendation: string;

  origin?: RideLocation;

  destination?: RideLocation;

  onOpenApp?: (
    provider: RideAppId,
  ) => void;

  calibration?:
    CalibrationCardProps;
};

type AppData = {
  id: RideAppId;

  type: RideAppId;
};

function formatCurrency(
  value: number,
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
}

function formatPriceRange(
  min: number,
  max: number,
): string {
  return (
    `${formatCurrency(min)} – ` +
    `${formatCurrency(max)}`
  );
}

export default function AIRecommendationCard({
  ride,
  recommendation,
  origin,
  destination,
  onOpenApp,
  calibration,
}: Props) {
  if (!recommendation) {
    return null;
  }

  const normalizedName =
    ride.nome.toLowerCase();

  function getAppData(): AppData {
    if (
      normalizedName.includes(
        'uber',
      )
    ) {
      return {
        id: 'uber',
        type: 'uber',
      };
    }

    if (
      normalizedName.includes(
        '99',
      )
    ) {
      return {
        id: '99',
        type: '99',
      };
    }

    return {
      id: 'indrive',
      type: 'indrive',
    };
  }

  const app =
    getAppData();

  async function handleOpenApp() {
    onOpenApp?.(
      app.id,
    );

    await openRideApp(
      app.id,
      {
        origin,
        destination,
      },
    );
  }

  function Logo() {
    switch (app.type) {
      case '99':
        return (
          <View
            style={
              styles.logo99
            }
          >
            <Text
              style={
                styles.logo99Text
              }
            >
              99
            </Text>
          </View>
        );

      case 'uber':
        return (
          <View
            style={
              styles.logoUber
            }
          >
            <Text
              style={
                styles.logoUberText
              }
            >
              Uber
            </Text>
          </View>
        );

      default:
        return (
          <View
            style={
              styles.logoIndrive
            }
          >
            <Text
              style={
                styles.logoIndriveText
              }
            >
              iD
            </Text>
          </View>
        );
    }
  }

  return (
    <View
      style={
        styles.card
      }
    >
      <View
        style={
          styles.accent
        }
      />

      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.badge
          }
        >
          <MaterialCommunityIcons
            name="star"
            size={13}
            color={
              COLORS.primaryLight
            }
          />

          <Text
            style={
              styles.badgeText
            }
          >
            Melhor escolha
          </Text>
        </View>

        <View
          style={
            styles.recommended
          }
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={15}
            color={
              COLORS.success
            }
          />

          <Text
            style={
              styles.recommendedText
            }
          >
            Recomendado
          </Text>
        </View>
      </View>

      <View
        style={
          styles.mainRow
        }
      >
        <Logo />

        <View
          style={
            styles.rideInfo
          }
        >
          <Text
            style={
              styles.providerLabel
            }
          >
            Melhor opção agora
          </Text>

          <View
            style={
              styles.tripRow
            }
          >
            <View
              style={
                styles.tripItem
              }
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color={
                  COLORS.textSecondary
                }
              />

              <Text
                style={
                  styles.tripText
                }
              >
                {ride.tempo} min
              </Text>
            </View>

            <View
              style={
                styles.dot
              }
            />

            <View
              style={
                styles.tripItem
              }
            >
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={14}
                color={
                  COLORS.textSecondary
                }
              />

              <Text
                style={
                  styles.tripText
                }
              >
                {ride.distancia.toFixed(
                  1,
                )}{' '}
                km
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={
          styles.priceBlock
        }
      >
        <Text
          style={
            styles.priceLabel
          }
        >
          Estimativa
        </Text>

        <Text
          style={
            styles.price
          }
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatPriceRange(
            ride.precoMin,
            ride.precoMax,
          )}
        </Text>

        <Text
          style={
            styles.priceDisclaimer
          }
        >
          Valor estimado pelo CorridaX
        </Text>
      </View>

      <View
        style={
          styles.insight
        }
      >
        <View
          style={
            styles.insightIcon
          }
        >
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={17}
            color={
              COLORS.primaryLight
            }
          />
        </View>

        <Text
          style={
            styles.reason
          }
        >
          {recommendation}
        </Text>
      </View>

      <Button
        mode="outlined"
        icon="open-in-new"
        onPress={
          handleOpenApp
        }
        textColor={
          COLORS.primaryLight
        }
        style={
          styles.button
        }
        contentStyle={
          styles.buttonContent
        }
        labelStyle={
          styles.buttonLabel
        }
      >
        {calibration
          ? 'Abrir app novamente'
          : 'Ver preço no app'}
      </Button>

      {calibration && (
        <CalibrationCard
          {...calibration}
        />
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      position: 'relative',
      overflow: 'hidden',
      padding: SPACING.md,
      paddingTop: 14,
      backgroundColor:
        COLORS.surfaceLight,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      borderRadius:
        RADIUS.xl,
      ...SHADOWS.sm,
    },

    accent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor:
        COLORS.primary,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 13,
    },

    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius:
        RADIUS.round,
      backgroundColor:
        COLORS.primarySoft,
    },

    badgeText: {
      marginLeft: 5,
      color:
        COLORS.primaryLight,
      fontSize: 10,
      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    recommended: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    recommendedText: {
      marginLeft: 4,
      color:
        COLORS.success,
      fontSize: 10,
      fontWeight:
        TYPOGRAPHY.weight.semiBold,
    },

    mainRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    rideInfo: {
      flex: 1,
      marginLeft: 12,
    },

    providerLabel: {
      marginBottom: 5,
      color:
        COLORS.text,
      fontSize: 13,
      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    tripRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },

    tripItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    tripText: {
      marginLeft: 4,
      color:
        COLORS.textSecondary,
      fontSize:
        TYPOGRAPHY.size.xs,
      fontWeight:
        TYPOGRAPHY.weight.medium,
    },

    dot: {
      width: 3,
      height: 3,
      marginHorizontal: 7,
      borderRadius:
        RADIUS.round,
      backgroundColor:
        COLORS.textMuted,
    },

    priceBlock: {
      marginTop: 14,
      paddingHorizontal: 12,
      paddingVertical: 11,
      borderRadius:
        RADIUS.lg,
      backgroundColor:
        COLORS.surface,
    },

    priceLabel: {
      marginBottom: 3,
      color:
        COLORS.textMuted,
      fontSize: 10,
      fontWeight:
        TYPOGRAPHY.weight.medium,
    },

    price: {
      color:
        COLORS.white,
      fontSize: 22,
      fontWeight:
        TYPOGRAPHY.weight.extraBold,
      letterSpacing: -0.4,
    },

    priceDisclaimer: {
      marginTop: 3,
      color:
        COLORS.textMuted,
      fontSize: 10,
      fontWeight:
        TYPOGRAPHY.weight.medium,
    },

    insight: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 14,
      paddingHorizontal: 11,
      paddingVertical: 10,
      borderRadius:
        RADIUS.lg,
      backgroundColor:
        COLORS.primarySoft,
    },

    insightIcon: {
      width: 25,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 7,
      borderRadius:
        RADIUS.round,
      backgroundColor:
        COLORS.background,
    },

    reason: {
      flex: 1,
      color:
        COLORS.textSecondary,
      fontSize:
        TYPOGRAPHY.size.xs,
      lineHeight: 17,
    },

    button: {
      marginTop: 12,
      borderRadius:
        RADIUS.lg,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.surface,
    },

    buttonContent: {
      minHeight: 42,
    },

    buttonLabel: {
      fontSize:
        TYPOGRAPHY.size.sm,
      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    logo99: {
      width: 48,
      height: 48,
      borderRadius:
        RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#FFD400',
    },

    logo99Text: {
      color:
        '#000000',
      fontSize: 22,
      fontWeight: '800',
    },

    logoUber: {
      width: 48,
      height: 48,
      borderRadius:
        RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#000000',
    },

    logoUberText: {
      color:
        '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    logoIndrive: {
      width: 48,
      height: 48,
      borderRadius:
        RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#B8FF1A',
    },

    logoIndriveText: {
      color:
        '#000000',
      fontSize: 20,
      fontWeight: '800',
    },
  });