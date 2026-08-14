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

import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

type Props = {
  ride: RideOption;
  recommendation: string;

  origin?: RideLocation;
  destination?: RideLocation;
};

type AppType =
  | 'uber'
  | '99'
  | 'indrive';

type AppData = {
  id: AppType;
  buttonLabel: string;
  type: AppType;
};

function formatCurrency(
  value: number,
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  );
}

export default function AIRecommendationCard({
  ride,
  recommendation,
  origin,
  destination,
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

        buttonLabel:
          'Abrir Uber',

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

        buttonLabel:
          'Abrir 99',

        type: '99',
      };
    }

    return {
      id: 'indrive',

      buttonLabel:
        'Abrir inDrive',

      type: 'indrive',
    };
  }

  const app =
    getAppData();

  async function handleOpenApp() {
    await openRideApp(
      app.id,
      {
        origin,
        destination,
      },
    );
  }

  /*
   * Mesmo padrão visual
   * utilizado no RideCard.
   *
   * Todos os logos possuem
   * exatamente 48 x 48.
   */
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
          styles.topRow
        }
      >
        <View
          style={
            styles.badge
          }
        >
          <MaterialCommunityIcons
            name="star"
            size={12}
            color={
              COLORS.background
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

        <MaterialCommunityIcons
          name="check-decagram"
          size={19}
          color={
            COLORS.success
          }
        />
      </View>

      <View
        style={
          styles.mainRow
        }
      >
        {/*
         * Logo exatamente no
         * mesmo padrão dos cards
         * das outras opções.
         */}
        <Logo />

        <View
          style={
            styles.details
          }
        >
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
                size={15}
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
                size={15}
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

        <Text
          style={
            styles.price
          }
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatCurrency(
            ride.preco,
          )}
        </Text>
      </View>

      <View
        style={
          styles.reasonRow
        }
      >
        <MaterialCommunityIcons
          name="lightbulb-outline"
          size={16}
          color={
            COLORS.primaryLight
          }
        />

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
        onPress={
          handleOpenApp
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
        textColor={
          COLORS.primaryLight
        }
      >
        {app.buttonLabel}
      </Button>
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      padding:
        SPACING.md,

      backgroundColor:
        COLORS.surfaceLight,

      borderWidth: 1.5,

      borderColor:
        COLORS.primary,

      borderRadius:
        RADIUS.xl,

      ...SHADOWS.sm,
    },

    topRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom:
        SPACING.sm,
    },

    badge: {
      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal: 8,

      paddingVertical: 3,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.success,
    },

    badgeText: {
      marginLeft: 4,

      color:
        COLORS.background,

      fontSize: 10,

      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    mainRow: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    details: {
      flex: 1,

      marginLeft:
        SPACING.md,

      marginRight:
        SPACING.sm,
    },

    tripRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      flexWrap:
        'wrap',
    },

    tripItem: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    tripText: {
      marginLeft: 4,

      color:
        COLORS.textSecondary,

      fontSize:
        TYPOGRAPHY.size.xs,
    },

    dot: {
      width: 3,

      height: 3,

      marginHorizontal:
        SPACING.sm,

      borderRadius:
        RADIUS.round,

      backgroundColor:
        COLORS.textMuted,
    },

    price: {
      maxWidth: 115,

      color:
        COLORS.primaryLight,

      fontSize: 21,

      fontWeight:
        TYPOGRAPHY.weight.extraBold,

      textAlign:
        'right',
    },

    reasonRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      marginTop:
        SPACING.md,

      paddingTop:
        SPACING.sm,

      borderTopWidth: 1,

      borderTopColor:
        COLORS.borderSoft,
    },

    reason: {
      flex: 1,

      marginLeft:
        SPACING.xs,

      color:
        COLORS.textSecondary,

      fontSize:
        TYPOGRAPHY.size.xs,

      lineHeight: 18,
    },

    button: {
      marginTop:
        SPACING.md,

      borderRadius:
        RADIUS.lg,

      borderColor:
        COLORS.primary,
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

    /*
     * A PARTIR DAQUI OS LOGOS
     * SÃO EXATAMENTE DO MESMO
     * MODELO DO RIDECARD.
     */

    logo99: {
      width: 48,

      height: 48,

      borderRadius:
        RADIUS.md,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFD400',
    },

    logo99Text: {
      color:
        '#000000',

      fontSize: 22,

      fontWeight:
        '800',
    },

    logoUber: {
      width: 48,

      height: 48,

      borderRadius:
        RADIUS.md,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#000000',
    },

    logoUberText: {
      color:
        '#FFFFFF',

      fontSize: 15,

      fontWeight:
        '700',
    },

    logoIndrive: {
      width: 48,

      height: 48,

      borderRadius:
        RADIUS.md,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#B8FF1A',
    },

    logoIndriveText: {
      color:
        '#000000',

      fontSize: 20,

      fontWeight:
        '800',
    },
  });