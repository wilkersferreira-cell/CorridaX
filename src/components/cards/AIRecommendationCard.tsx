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

  const app =
    normalizedName.includes(
      'uber',
    )
      ? {
          id: 'uber' as const,
          label: 'Abrir Uber',
        }
      : normalizedName.includes(
            '99',
          )
        ? {
            id: '99' as const,
            label: 'Abrir 99',
          }
        : {
            id: 'indrive' as const,
            label:
              'Abrir inDrive',
          };

  async function handleOpenApp() {
    await openRideApp(
      app.id,
      {
        origin,
        destination,
      },
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
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

      <View style={styles.mainRow}>
        <View
          style={
            styles.providerArea
          }
        >
          <Text
            style={
              styles.providerName
            }
            numberOfLines={1}
          >
            {ride.nome}
          </Text>

          <View
            style={
              styles.tripRow
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
                styles.tripInfo
              }
            >
              {ride.tempo} min
            </Text>

            <View
              style={
                styles.dot
              }
            />

            <MaterialCommunityIcons
              name="map-marker-distance"
              size={14}
              color={
                COLORS.textSecondary
              }
            />

            <Text
              style={
                styles.tripInfo
              }
            >
              {ride.distancia.toFixed(
                1,
              )}{' '}
              km
            </Text>
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
        mode="contained"
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
      >
        {app.label}
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

      justifyContent:
        'space-between',
    },

    providerArea: {
      flex: 1,

      paddingRight:
        SPACING.sm,
    },

    providerName: {
      color:
        COLORS.white,

      fontSize: 20,

      fontWeight:
        TYPOGRAPHY.weight.extraBold,
    },

    tripRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 3,
    },

    tripInfo: {
      marginLeft: 4,

      color:
        COLORS.textSecondary,

      fontSize:
        TYPOGRAPHY.size.xs,
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

    price: {
      maxWidth: 130,

      color:
        COLORS.primaryLight,

      fontSize: 21,

      fontWeight:
        TYPOGRAPHY.weight.extraBold,

      textAlign: 'right',
    },

    reasonRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      marginTop:
        SPACING.sm,

      paddingTop:
        SPACING.sm,

      borderTopWidth: 1,

      borderTopColor:
        COLORS.borderSoft,
    },

    reason: {
      flex: 1,

      marginLeft:
        SPACING.sm,

      color:
        COLORS.textSecondary,

      fontSize:
        TYPOGRAPHY.size.xs,

      lineHeight: 17,
    },

    button: {
      marginTop:
        SPACING.md,

      borderRadius:
        RADIUS.lg,

      backgroundColor:
        COLORS.primary,
    },

    buttonContent: {
      minHeight: 40,
    },

    buttonLabel: {
      fontSize:
        TYPOGRAPHY.size.sm,

      fontWeight:
        TYPOGRAPHY.weight.bold,
    },
  });