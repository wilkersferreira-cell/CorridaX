import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialIcons,
} from '@expo/vector-icons';

import {
  Text,
} from 'react-native-paper';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  clearHistory,
  getHistory,
  HistoryItem,
} from '../services/storage';

import {
  COLORS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../theme';

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
}

function formatDistance(
  value: number,
): string {
  return `${value.toFixed(1)} km`;
}

function formatDuration(
  value: number,
): string {
  const totalMinutes =
    Math.max(
      1,
      Math.round(value),
    );

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours =
    Math.floor(
      totalMinutes / 60,
    );

  const minutes =
    totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function getMobilityLabel(
  mode: string,
): string {
  switch (mode) {
    case 'car':
      return 'Carro';

    case 'motorcycle':
      return 'Moto';

    case 'bicycle':
      return 'Bicicleta';

    case 'walk':
      return 'A pé';

    default:
      return 'Rota';
  }
}

function getMobilityIcon(
  mode: string,
):
  | 'directions-car'
  | 'two-wheeler'
  | 'directions-bike'
  | 'directions-walk'
  | 'route' {
  switch (mode) {
    case 'car':
      return 'directions-car';

    case 'motorcycle':
      return 'two-wheeler';

    case 'bicycle':
      return 'directions-bike';

    case 'walk':
      return 'directions-walk';

    default:
      return 'route';
  }
}

export default function HistoryScreen() {
  const [
    history,
    setHistory,
  ] =
    useState<HistoryItem[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const loadHistory =
    useCallback(
      async () => {
        setLoading(true);

        try {
          const items =
            await getHistory();

          setHistory(items);
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  function handleClearHistory() {
    if (
      history.length === 0
    ) {
      return;
    }

    Alert.alert(
      'Limpar histórico',
      'Deseja apagar todo o seu histórico de comparações?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Limpar',
          style: 'destructive',

          onPress: async () => {
            try {
              await clearHistory();

              setHistory([]);
            } catch {
              Alert.alert(
                'Histórico',
                'Não foi possível limpar o histórico.',
              );
            }
          },
        },
      ],
    );
  }

  function renderItem({
    item,
  }: {
    item: HistoryItem;
  }) {
    return (
      <View
        style={
          styles.historyCard
        }
      >
        <View
          style={
            styles.cardHeader
          }
        >
          <View
            style={
              styles.modeBadge
            }
          >
            <MaterialIcons
              name={
                getMobilityIcon(
                  item.mobilityMode,
                )
              }
              size={18}
              color={
                COLORS.primaryLight
              }
            />

            <Text
              style={
                styles.modeText
              }
            >
              {getMobilityLabel(
                item.mobilityMode,
              )}
            </Text>
          </View>

          <Text
            style={
              styles.dateText
            }
          >
            {formatDate(
              item.createdAt,
            )}
          </Text>
        </View>

        <View
          style={
            styles.routeArea
          }
        >
          <View
            style={
              styles.routeIndicator
            }
          >
            <View
              style={
                styles.originDot
              }
            />

            <View
              style={
                styles.routeLine
              }
            />

            <MaterialIcons
              name="location-on"
              size={18}
              color={
                COLORS.primaryLight
              }
            />
          </View>

          <View
            style={
              styles.addresses
            }
          >
            <View>
              <Text
                style={
                  styles.addressLabel
                }
              >
                Origem
              </Text>

              <Text
                style={
                  styles.addressText
                }
                numberOfLines={1}
              >
                {item.origin}
              </Text>
            </View>

            <View
              style={
                styles.destinationArea
              }
            >
              <Text
                style={
                  styles.addressLabel
                }
              >
                Destino
              </Text>

              <Text
                style={
                  styles.destinationText
                }
                numberOfLines={2}
              >
                {item.destination}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={
            styles.metrics
          }
        >
          <View
            style={
              styles.metric
            }
          >
            <MaterialIcons
              name="straighten"
              size={17}
              color={
                COLORS.textSecondary
              }
            />

            <Text
              style={
                styles.metricValue
              }
            >
              {formatDistance(
                item.distance,
              )}
            </Text>
          </View>

          <View
            style={
              styles.metricDivider
            }
          />

          <View
            style={
              styles.metric
            }
          >
            <MaterialIcons
              name="schedule"
              size={17}
              color={
                COLORS.textSecondary
              }
            />

            <Text
              style={
                styles.metricValue
              }
            >
              {formatDuration(
                item.duration,
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
      edges={['top']}
    >
      <View
        style={
          styles.container
        }
      >
        <View
          style={
            styles.header
          }
        >
          <View>
            <Text
              style={
                styles.title
              }
            >
              Histórico
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Suas últimas comparações
            </Text>
          </View>

          {history.length > 0 && (
            <Pressable
              onPress={
                handleClearHistory
              }
              hitSlop={10}
              style={({
                pressed,
              }) => [
                styles.clearButton,

                pressed && {
                  opacity: 0.65,
                },
              ]}
            >
              <MaterialIcons
                name="delete-outline"
                size={21}
                color={
                  COLORS.textSecondary
                }
              />
            </Pressable>
          )}
        </View>

        <FlatList
          data={history}
          keyExtractor={(
            item,
          ) => item.id}
          renderItem={
            renderItem
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={[
            styles.listContent,

            history.length === 0 &&
              styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={
                loading
              }
              onRefresh={
                loadHistory
              }
              tintColor={
                COLORS.primaryLight
              }
            />
          }
          ListEmptyComponent={
            <View
              style={
                styles.emptyState
              }
            >
              <View
                style={
                  styles.emptyIcon
                }
              >
                <MaterialIcons
                  name="history"
                  size={34}
                  color={
                    COLORS.primaryLight
                  }
                />
              </View>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Nenhuma comparação ainda
              </Text>

              <Text
                style={
                  styles.emptyDescription
                }
              >
                As corridas que você comparar aparecerão aqui.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,

      paddingHorizontal:
        SPACING.lg,
    },

    header: {
      minHeight: 82,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      paddingTop: 10,

      paddingBottom: 12,
    },

    title: {
      color:
        COLORS.text,

      fontSize: 27,

      lineHeight: 32,

      fontWeight:
        TYPOGRAPHY.weight.extraBold,

      letterSpacing: -0.7,
    },

    subtitle: {
      marginTop: 2,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 18,
    },

    clearButton: {
      width: 42,

      height: 42,

      alignItems: 'center',

      justifyContent:
        'center',

      borderRadius:
        RADIUS.lg,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,
    },

    listContent: {
      paddingBottom: 24,
    },

    historyCard: {
      marginBottom: 12,

      padding: 16,

      borderRadius:
        RADIUS.lg,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.borderSoft,
    },

    cardHeader: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      marginBottom: 17,
    },

    modeBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 6,

      paddingHorizontal: 9,

      paddingVertical: 6,

      borderRadius:
        RADIUS.md,

      backgroundColor:
        COLORS.primarySoft,
    },

    modeText: {
      color:
        COLORS.primaryLight,

      fontSize: 12,

      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    dateText: {
      color:
        COLORS.textMuted,

      fontSize: 11,

      fontWeight:
        TYPOGRAPHY.weight.medium,
    },

    routeArea: {
      flexDirection: 'row',
    },

    routeIndicator: {
      width: 24,

      alignItems: 'center',

      paddingTop: 5,
    },

    originDot: {
      width: 9,

      height: 9,

      borderRadius: 5,

      backgroundColor:
        COLORS.primary,
    },

    routeLine: {
      width: 1,

      height: 37,

      marginVertical: 3,

      backgroundColor:
        COLORS.border,
    },

    addresses: {
      flex: 1,

      marginLeft: 9,
    },

    destinationArea: {
      marginTop: 14,
    },

    addressLabel: {
      color:
        COLORS.textMuted,

      fontSize: 10,

      lineHeight: 14,

      fontWeight:
        TYPOGRAPHY.weight.medium,

      textTransform:
        'uppercase',

      letterSpacing: 0.5,
    },

    addressText: {
      marginTop: 1,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 18,

      fontWeight:
        TYPOGRAPHY.weight.medium,
    },

    destinationText: {
      marginTop: 1,

      color:
        COLORS.text,

      fontSize: 14,

      lineHeight: 19,

      fontWeight:
        TYPOGRAPHY.weight.bold,
    },

    metrics: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 17,

      paddingTop: 13,

      borderTopWidth:
        StyleSheet.hairlineWidth,

      borderTopColor:
        COLORS.borderSoft,
    },

    metric: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',

      gap: 7,
    },

    metricDivider: {
      width:
        StyleSheet.hairlineWidth,

      height: 20,

      backgroundColor:
        COLORS.borderSoft,
    },

    metricValue: {
      color:
        COLORS.textSecondary,

      fontSize: 12,

      fontWeight:
        TYPOGRAPHY.weight.semiBold,
    },

    emptyListContent: {
      flexGrow: 1,
    },

    emptyState: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',

      paddingHorizontal: 32,

      paddingBottom: 80,
    },

    emptyIcon: {
      width: 70,

      height: 70,

      alignItems: 'center',

      justifyContent:
        'center',

      marginBottom: 18,

      borderRadius: 35,

      backgroundColor:
        COLORS.primarySoft,
    },

    emptyTitle: {
      color:
        COLORS.text,

      fontSize: 18,

      fontWeight:
        TYPOGRAPHY.weight.bold,

      textAlign: 'center',
    },

    emptyDescription: {
      maxWidth: 280,

      marginTop: 7,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 19,

      textAlign: 'center',
    },
  });