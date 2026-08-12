import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
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

export interface Suggestion {
  placeId: string;
  displayName: string;
}

type Props = {
  data: Suggestion[];
  onSelect: (item: Suggestion) => void;
};

export default function AddressSuggestions({
  data,
  onSelect,
}: Props) {
  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>
        Sugestões de destino
      </Text>

      {data.map((item) => (
        <TouchableOpacity
          key={item.placeId}
          activeOpacity={0.75}
          onPress={() => onSelect(item)}
        >
          <Card style={styles.card}>
            <Card.Content
              style={styles.cardContent}
            >
              <View
                style={styles.iconContainer}
              >
                <Text style={styles.icon}>
                  📍
                </Text>
              </View>

              <View
                style={styles.textContainer}
              >
                <Text
                  style={styles.address}
                  numberOfLines={2}
                >
                  {item.displayName}
                </Text>

                <Text style={styles.helper}>
                  Toque para selecionar
                </Text>
              </View>

              <Text style={styles.arrow}>
                ›
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  sectionLabel: {
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,

    color: COLORS.textMuted,

    fontSize: TYPOGRAPHY.size.xs,
    fontWeight:
      TYPOGRAPHY.weight.semiBold,
  },

  card: {
    marginBottom: SPACING.sm,

    borderRadius: RADIUS.md,

    backgroundColor:
      COLORS.surfaceLight,

    borderWidth: 1,
    borderColor: COLORS.borderSoft,

    ...SHADOWS.sm,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: SPACING.md,
  },

  iconContainer: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: RADIUS.round,

    backgroundColor:
      COLORS.primarySoft,
  },

  icon: {
    fontSize: TYPOGRAPHY.size.lg,
  },

  textContainer: {
    flex: 1,

    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },

  address: {
    color: COLORS.text,

    fontSize: TYPOGRAPHY.size.sm,
    lineHeight:
      TYPOGRAPHY.lineHeight.md,
    fontWeight:
      TYPOGRAPHY.weight.medium,
  },

  helper: {
    marginTop: SPACING.xs,

    color: COLORS.textMuted,

    fontSize: TYPOGRAPHY.size.xs,
  },

  arrow: {
    color: COLORS.primaryLight,

    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight:
      TYPOGRAPHY.weight.medium,
  },
});