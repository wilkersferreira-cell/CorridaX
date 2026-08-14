import React from 'react';

import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  Text,
} from 'react-native-paper';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../theme';

export interface Suggestion {
  placeId: string;
  displayName: string;
}

type Props = {
  data: Suggestion[];
  onSelect: (
    item: Suggestion,
  ) => void;
};

/*
 * Separa o nome principal
 * do restante da descrição.
 *
 * Exemplo:
 *
 * Shopping Grande Circular,
 * Avenida Autaz Mirim...
 *
 * vira:
 *
 * Shopping Grande Circular
 * Avenida Autaz Mirim...
 */
function splitDisplayName(
  displayName: string,
): {
  title: string;
  subtitle?: string;
} {
  const parts =
    displayName
      .split(',')
      .map((part) =>
        part.trim(),
      )
      .filter(Boolean);

  if (parts.length === 0) {
    return {
      title:
        displayName,
    };
  }

  const [
    title,
    ...rest
  ] = parts;

  const subtitle =
    rest.length > 0
      ? rest.join(', ')
      : undefined;

  return {
    title,
    subtitle,
  };
}

export default function AddressSuggestions({
  data,
  onSelect,
}: Props) {
  if (data.length === 0) {
    return null;
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.sectionLabel
        }
      >
        Sugestões
      </Text>

      <View
        style={
          styles.list
        }
      >
        {data.map(
          (item, index) => {
            const {
              title,
              subtitle,
            } =
              splitDisplayName(
                item.displayName,
              );

            const isLast =
              index ===
              data.length - 1;

            return (
              <Pressable
                key={
                  item.placeId
                }
                onPress={() =>
                  onSelect(
                    item,
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.item,

                  !isLast &&
                    styles.itemBorder,

                  pressed &&
                    styles.itemPressed,
                ]}
              >
                <View
                  style={
                    styles.textContainer
                  }
                >
                  <Text
                    style={
                      styles.title
                    }
                    numberOfLines={
                      1
                    }
                  >
                    {title}
                  </Text>

                  {subtitle && (
                    <Text
                      style={
                        styles.subtitle
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {subtitle}
                    </Text>
                  )}
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={
                    COLORS.textMuted
                  }
                />
              </Pressable>
            );
          },
        )}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      marginTop: 2,

      marginBottom:
        SPACING.md,
    },

    sectionLabel: {
      marginLeft:
        SPACING.xs,

      marginBottom: 6,

      color:
        COLORS.textMuted,

      fontSize: 11,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,

      letterSpacing: 0.2,
    },

    /*
     * Um único painel para
     * todas as sugestões.
     *
     * Mais limpo que vários
     * cards independentes.
     */
    list: {
      overflow:
        'hidden',

      borderRadius:
        RADIUS.lg,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,

      backgroundColor:
        COLORS.surfaceLight,
    },

    item: {
      minHeight: 58,

      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal:
        SPACING.md,

      paddingVertical: 10,
    },

    itemBorder: {
      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        COLORS.borderSoft,
    },

    itemPressed: {
      backgroundColor:
        COLORS.primarySoft,
    },

    textContainer: {
      flex: 1,

      paddingRight:
        SPACING.sm,
    },

    title: {
      color:
        COLORS.text,

      fontSize:
        TYPOGRAPHY.size.sm,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,
    },

    subtitle: {
      marginTop: 3,

      color:
        COLORS.textMuted,

      fontSize:
        TYPOGRAPHY.size.xs,

      lineHeight: 16,
    },
  });