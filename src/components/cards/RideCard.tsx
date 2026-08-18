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

export type RideHighlight =
  | 'cheapest'
  | 'fastest'
  | 'balanced'
  | 'alternative';

type Props = {
  nome: string;
  preco: string;
  tempo?: string;
  distancia?: string;
  economia?: string;

  highlight?: RideHighlight;

  advantageText?: string;

  origin?: RideLocation;
  destination?: RideLocation;
};

export default function RideCard({
  nome,
  preco,
  tempo,
  distancia,
  economia,
  highlight = 'alternative',
  advantageText,
  origin,
  destination,
}: Props) {
  const normalizedName =
    nome.toLowerCase();

  function getAppData() {
    if (
      normalizedName.includes(
        'uber',
      )
    ) {
      return {
        id: 'uber' as const,
        buttonLabel: 'Abrir Uber',
        type: 'uber' as const,
      };
    }

    if (
      normalizedName.includes(
        '99',
      )
    ) {
      return {
        id: '99' as const,
        buttonLabel: 'Abrir 99',
        type: '99' as const,
      };
    }

    return {
      id: 'indrive' as const,
      buttonLabel: 'Abrir inDrive',
      type: 'indrive' as const,
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

  function getHighlightData() {
    if (
      highlight ===
      'cheapest'
    ) {
      return {
        icon:
          'cash-multiple' as const,

        label:
          'Mais econômico',

        color:
          COLORS.economy,
      };
    }

    if (
      highlight ===
      'fastest'
    ) {
      return {
        icon:
          'lightning-bolt' as const,

        label:
          'Mais rápido',

        color:
          COLORS.info,
      };
    }

    if (
      highlight ===
      'balanced'
    ) {
      return {
        icon:
          'scale-balance' as const,

        label:
          'Equilíbrio',

        color:
          COLORS.primaryLight,
      };
    }

    return {
      icon:
        'car-outline' as const,

      label:
        'Outra opção',

      color:
        COLORS.textSecondary,
    };
  }

  const highlightData =
    getHighlightData();

  const savingValue =
    economia
      ? Number(
          economia
            .replace(
              /[^\d,.-]/g,
              '',
            )
            .replace(
              /\./g,
              '',
            )
            .replace(
              ',',
              '.',
            ),
        )
      : 0;

  const hasSaving =
    Number.isFinite(
      savingValue,
    ) &&
    savingValue > 0;

  function getAdvantageIcon() {
    if (
      highlight ===
      'fastest'
    ) {
      return 'lightning-bolt' as const;
    }

    if (
      highlight ===
      'cheapest'
    ) {
      return 'cash-multiple' as const;
    }

    if (
      highlight ===
      'balanced'
    ) {
      return 'scale-balance' as const;
    }

    return 'information-outline' as const;
  }

  return (
    <View
      style={[
        styles.card,

        highlight ===
          'cheapest' &&
          styles.cheapestCard,

        highlight ===
          'fastest' &&
          styles.fastestCard,

        highlight ===
          'balanced' &&
          styles.balancedCard,
      ]}
    >
      <View
        style={
          styles.badgeRow
        }
      >
        <MaterialCommunityIcons
          name={
            highlightData.icon
          }
          size={15}
          color={
            highlightData.color
          }
        />

        <Text
          style={[
            styles.badgeText,
            {
              color:
                highlightData.color,
            },
          ]}
        >
          {highlightData.label}
        </Text>
      </View>

      <View
        style={
          styles.mainRow
        }
      >
        <Logo />

        <View
          style={
            styles.details
          }
        >
          <Text
            style={
              styles.name
            }
            numberOfLines={1}
          >
            {nome}
          </Text>

          <View
            style={
              styles.tripRow
            }
          >
            {tempo && (
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
                  {tempo}
                </Text>
              </View>
            )}

            {tempo &&
              distancia && (
                <View
                  style={
                    styles.dot
                  }
                />
              )}

            {distancia && (
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
                  {distancia}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text
          style={
            styles.price
          }
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {preco}
        </Text>
      </View>

      {!!advantageText && (
        <View
          style={
            styles.advantageRow
          }
        >
          <MaterialCommunityIcons
            name={
              getAdvantageIcon()
            }
            size={16}
            color={
              highlightData.color
            }
          />

          <Text
            style={[
              styles.advantageText,
              {
                color:
                  highlightData.color,
              },
            ]}
          >
            {advantageText}
          </Text>
        </View>
      )}

      {!advantageText &&
        hasSaving && (
          <View
            style={
              styles.advantageRow
            }
          >
            <MaterialCommunityIcons
              name="tag-outline"
              size={16}
              color={
                COLORS.economy
              }
            />

            <Text
              style={
                styles.saving
              }
            >
              Economize{' '}
              {economia}
            </Text>
          </View>
        )}

      <Button
        mode="outlined"
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
        {app.buttonLabel}
      </Button>
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      marginBottom:
        SPACING.md,

      padding:
        SPACING.md,

      backgroundColor:
        COLORS.surfaceLight,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,

      borderRadius:
        RADIUS.xl,

      ...SHADOWS.sm,
    },

    cheapestCard: {
      borderColor:
        COLORS.economy,
    },

    fastestCard: {
      borderColor:
        COLORS.info,
    },

    balancedCard: {
      borderColor:
        COLORS.primary,
    },

    badgeRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom:
        SPACING.sm,
    },

    badgeText: {
      marginLeft: 5,

      fontSize:
        TYPOGRAPHY.size.xs,

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

    name: {
      color:
        COLORS.white,

      fontSize:
        TYPOGRAPHY.size.lg,

      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    tripRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      flexWrap:
        'wrap',

      marginTop: 5,
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
        COLORS.white,

      fontSize: 21,

      fontWeight:
        TYPOGRAPHY.weight.extraBold,

      textAlign:
        'right',
    },

    advantageRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop:
        SPACING.md,

      paddingTop:
        SPACING.sm,

      borderTopWidth: 1,

      borderTopColor:
        COLORS.borderSoft,
    },

    advantageText: {
      flex: 1,

      marginLeft:
        SPACING.xs,

      fontSize:
        TYPOGRAPHY.size.xs,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,

      lineHeight: 18,
    },

    saving: {
      flex: 1,

      marginLeft:
        SPACING.xs,

      color:
        COLORS.economy,

      fontSize:
        TYPOGRAPHY.size.xs,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,

      lineHeight: 18,
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