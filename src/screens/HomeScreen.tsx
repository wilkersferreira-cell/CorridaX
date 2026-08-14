import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import AddressSuggestions from '../components/inputs/AddressSuggestions';
import AIRecommendationCard from '../components/cards/AIRecommendationCard';
import CompareButton from '../components/buttons/CompareButton';
import ComparisonModeSelector from '../components/inputs/ComparisonModeSelector';
import Header from '../components/layout/Header';
import LocationInput from '../components/inputs/LocationInput';
import MapViewCard from '../components/map/MapViewCard';

import RideCard, {
  RideHighlight,
} from '../components/cards/RideCard';

import useLocation from '../hooks/useLocation';

import useRideComparison, {
  MobilityMode,
} from '../hooks/useRideComparison';

import {
  chooseBestRide,
} from '../services/ai';

import {
  RideOption,
} from '../services/comparison';

import {
  startNavigation,
} from '../services/navigation';

import {
  COLORS,
  SPACING,
} from '../theme';

function formatDestinationName(
  value: string,
): string {
  if (!value) {
    return '';
  }

  const parts =
    value
      .split(',')
      .map((part) =>
        part.trim(),
      )
      .filter(Boolean);

  if (parts.length <= 1) {
    return value;
  }

  const firstPart =
    parts[0];

  const secondPart =
    parts[1]
      ? parts[1]
          .split(' - ')[0]
          .trim()
      : '';

  const looksLikeAddress =
    /^\d/.test(
      secondPart,
    );

  if (!looksLikeAddress) {
    return firstPart;
  }

  return `${firstPart}, ${secondPart}`;
}

function getCheapestRide(
  rides: RideOption[],
): RideOption | undefined {
  if (rides.length === 0) {
    return undefined;
  }

  return rides.reduce(
    (current, ride) =>
      ride.preco <
      current.preco
        ? ride
        : current,
  );
}

function getFastestRide(
  rides: RideOption[],
): RideOption | undefined {
  if (rides.length === 0) {
    return undefined;
  }

  return rides.reduce(
    (current, ride) =>
      ride.tempo <
      current.tempo
        ? ride
        : current,
  );
}

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

function getRideHighlight(
  ride: RideOption,
  cheapest?: RideOption,
  fastest?: RideOption,
): RideHighlight {
  if (
    cheapest &&
    ride.id === cheapest.id
  ) {
    return 'cheapest';
  }

  if (
    fastest &&
    ride.id === fastest.id
  ) {
    return 'fastest';
  }

  return 'balanced';
}

function getAdvantageText(
  ride: RideOption,
  cheapest?: RideOption,
  fastest?: RideOption,
): string | undefined {
  if (
    !cheapest ||
    !fastest
  ) {
    return undefined;
  }

  const isCheapest =
    ride.id ===
    cheapest.id;

  const isFastest =
    ride.id ===
    fastest.id;

  if (
    isCheapest &&
    isFastest
  ) {
    return 'Menor preço e menor tempo nesta viagem.';
  }

  if (isCheapest) {
    const saving =
      fastest.preco -
      ride.preco;

    const extraMinutes =
      ride.tempo -
      fastest.tempo;

    if (
      saving > 0 &&
      extraMinutes > 0
    ) {
      return (
        `Economize ${formatCurrency(
          saving,
        )} por ${extraMinutes} min a mais.`
      );
    }

    if (saving > 0) {
      return (
        `Economize ${formatCurrency(
          saving,
        )} em relação à opção mais rápida.`
      );
    }

    return 'Menor preço desta viagem.';
  }

  if (isFastest) {
    const minutesSaved =
      cheapest.tempo -
      ride.tempo;

    const extraCost =
      ride.preco -
      cheapest.preco;

    if (
      minutesSaved > 0 &&
      extraCost > 0
    ) {
      return (
        `Chegue ${minutesSaved} min antes por ` +
        `apenas ${formatCurrency(
          extraCost,
        )} a mais.`
      );
    }

    if (minutesSaved > 0) {
      return (
        `Chegue ${minutesSaved} min antes que ` +
        `a opção mais econômica.`
      );
    }

    return 'Menor tempo desta viagem.';
  }

  const savingVsFastest =
    fastest.preco -
    ride.preco;

  const timeGainVsCheapest =
    cheapest.tempo -
    ride.tempo;

  if (
    savingVsFastest > 0 &&
    timeGainVsCheapest > 0
  ) {
    return (
      `Economize ${formatCurrency(
        savingVsFastest,
      )} e chegue ${timeGainVsCheapest} min antes ` +
      `que a opção mais econômica.`
    );
  }

  if (savingVsFastest > 0) {
    return (
      `Economize ${formatCurrency(
        savingVsFastest,
      )} em relação à opção mais rápida.`
    );
  }

  if (timeGainVsCheapest > 0) {
    return (
      `${timeGainVsCheapest} min mais rápido que ` +
      `a opção mais econômica.`
    );
  }

  return 'Boa relação entre preço e tempo.';
}

function getAlternativePriority(
  ride: RideOption,
  cheapest?: RideOption,
  fastest?: RideOption,
): number {
  if (
    cheapest &&
    ride.id === cheapest.id
  ) {
    return 1;
  }

  if (
    fastest &&
    ride.id === fastest.id
  ) {
    return 2;
  }

  return 3;
}

function formatRouteDistance(
  distance: number,
): string {
  return `${distance.toFixed(1)} km`;
}

function formatRouteDuration(
  duration: number,
): string {
  const totalMinutes =
    Math.max(
      1,
      Math.round(duration),
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

function getMobilityIcon(
  mode: MobilityMode,
):
  | 'directions-car'
  | 'two-wheeler'
  | 'directions-bike'
  | 'directions-walk' {
  switch (mode) {
    case 'motorcycle':
      return 'two-wheeler';

    case 'bicycle':
      return 'directions-bike';

    case 'walk':
      return 'directions-walk';

    case 'car':
    default:
      return 'directions-car';
  }
}

function getMobilityLabel(
  mode: MobilityMode,
): string {
  switch (mode) {
    case 'motorcycle':
      return 'Moto';

    case 'bicycle':
      return 'Bicicleta';

    case 'walk':
      return 'A pé';

    case 'car':
    default:
      return 'Carro';
  }
}

export default function HomeScreen() {
  const {
    loading,
    address,
    latitude,
    longitude,
  } = useLocation();

  const {
    rides,
    loading: loadingCompare,
    compare,
    suggestions,
    search,
    setSuggestions,
    selectDestination,
    clearSelectedDestination,
    setGpsOrigin,
    origin,
    destination,
    routeCoordinates,
    routeInfo,
    mobilityOptions,
    loadingMobility,
    selectedMobilityMode,
    selectMobilityMode,
    comparisonMode,
    setComparisonMode,
  } = useRideComparison();

  const [
    origem,
    setOrigem,
  ] = useState('');

  const [
    destino,
    setDestino,
  ] = useState('');

  useEffect(() => {
    if (
      address &&
      !origem
    ) {
      setOrigem(
        address,
      );
    }
  }, [
    address,
    origem,
  ]);

  useEffect(() => {
    if (
      Number.isFinite(
        latitude,
      ) &&
      Number.isFinite(
        longitude,
      ) &&
      !(
        latitude === 0 &&
        longitude === 0
      )
    ) {
      setGpsOrigin(
        latitude,
        longitude,
      );
    }
  }, [
    latitude,
    longitude,
  ]);

  const recommendation =
    useMemo(() => {
      if (
        rides.length === 0
      ) {
        return null;
      }

      return chooseBestRide(
        rides,
      );
    }, [rides]);

  const cheapestRide =
    useMemo(
      () =>
        getCheapestRide(
          rides,
        ),
      [rides],
    );

  const fastestRide =
    useMemo(
      () =>
        getFastestRide(
          rides,
        ),
      [rides],
    );

  const alternativeRides =
    useMemo(() => {
      if (!recommendation) {
        return [];
      }

      return rides
        .filter(
          (ride) =>
            ride.id !==
            recommendation.melhor.id,
        )
        .sort(
          (a, b) =>
            getAlternativePriority(
              a,
              cheapestRide,
              fastestRide,
            ) -
            getAlternativePriority(
              b,
              cheapestRide,
              fastestRide,
            ),
        );
    }, [
      rides,
      recommendation,
      cheapestRide,
      fastestRide,
    ]);

  const displayedDestination =
    destination
      ? formatDestinationName(
          destino,
        )
      : destino;

  async function compararCorridas() {
    if (
      !origem.trim()
    ) {
      Alert.alert(
        'Localização',
        'Não foi possível identificar sua localização.',
      );

      return;
    }

    if (
      !destino.trim()
    ) {
      Alert.alert(
        'Destino',
        'Informe para onde você deseja ir.',
      );

      return;
    }

    try {
      await compare(
        origem,
        destino,
        latitude,
        longitude,
      );

      setSuggestions([]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível comparar as corridas.';

      Alert.alert(
        'Não foi possível comparar',
        message,
      );
    }
  }

  async function handleStartNavigation() {
    if (!destination) {
      Alert.alert(
        'Navegação',
        'Selecione um destino antes de iniciar a rota.',
      );

      return;
    }

    await startNavigation({
      origin,
      destination,
      mode:
        selectedMobilityMode,
    });
  }

  const rideOrigin =
    origin
      ? {
          latitude:
            origin.latitude,

          longitude:
            origin.longitude,

          address:
            origem,
        }
      : undefined;

  const rideDestination =
    destination
      ? {
          latitude:
            destination.latitude,

          longitude:
            destination.longitude,

          address:
            destino,
        }
      : undefined;

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <Header />

      {!loading && (
        <MapViewCard
          userLocation={{
            latitude,
            longitude,
          }}
          origin={
            origin
          }
          destination={
            destination
          }
          route={
            routeCoordinates
          }
        />
      )}

      <View
        style={
          styles.tripSection
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Para onde vamos?
        </Text>

        <LocationInput
          label="Origem"
          value={
            origem
              ? 'Minha localização'
              : 'Obtendo localização...'
          }
          onChangeText={() => {}}
          icon="crosshairs-gps"
          editable={false}
          compact
        />

        <LocationInput
          label="Destino"
          value={
            displayedDestination
          }
          onChangeText={(
            text,
          ) => {
            setDestino(
              text,
            );

            clearSelectedDestination();

            search(
              text,
              latitude,
              longitude,
            );
          }}
          icon="flag-checkered"
        />

        <AddressSuggestions
          data={
            suggestions
          }
          onSelect={async (
            item,
          ) => {
            try {
              /*
               * IMPORTANTE:
               *
               * Agora enviamos o GPS
               * atual diretamente para
               * selectDestination.
               *
               * Assim a pré-visualização
               * não precisa esperar a
               * atualização assíncrona
               * do estado origin.
               */
              const selected =
                await selectDestination(
                  item,
                  latitude,
                  longitude,
                );

              setDestino(
                selected.displayName,
              );

              setSuggestions([]);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : 'Não foi possível selecionar o destino.';

              Alert.alert(
                'Destino',
                message,
              );
            }
          }}
        />

        {routeInfo && destination && (
          <View
            style={
              styles.routeSummary
            }
          >
            <View
              style={
                styles.routeSummaryHeader
              }
            >
              <Text
                style={
                  styles.routeSummaryTitle
                }
              >
                Rota estimada
              </Text>

              <Text
                style={
                  styles.routeSummaryStatus
                }
              >
                Google Routes
              </Text>
            </View>

            <View
              style={
                styles.routeMetrics
              }
            >
              <View
                style={
                  styles.routeMetric
                }
              >
                <Text
                  style={
                    styles.routeMetricLabel
                  }
                >
                  Distância
                </Text>

                <Text
                  style={
                    styles.routeMetricValue
                  }
                >
                  {formatRouteDistance(
                    routeInfo.distance,
                  )}
                </Text>
              </View>

              <View
                style={
                  styles.routeDivider
                }
              />

              <View
                style={
                  styles.routeMetric
                }
              >
                <Text
                  style={
                    styles.routeMetricLabel
                  }
                >
                  Tempo estimado
                </Text>

                <Text
                  style={
                    styles.routeMetricValue
                  }
                >
                  {formatRouteDuration(
                    routeInfo.duration,
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        {destination && (
          <View
            style={
              styles.mobilitySection
            }
          >
            <View
              style={
                styles.mobilityHeader
              }
            >
              <View
                style={
                  styles.mobilityHeaderText
                }
              >
                <Text
                  style={
                    styles.mobilityTitle
                  }
                >
                  Como você quer ir?
                </Text>

                <Text
                  style={
                    styles.mobilitySubtitle
                  }
                >
                  Toque em uma opção para visualizar a rota.
                </Text>
              </View>

              {loadingMobility && (
                <Text
                  style={
                    styles.mobilityLoading
                  }
                >
                  Calculando...
                </Text>
              )}
            </View>

            {mobilityOptions.length >
              0 && (
              <>
                <View
                  style={
                    styles.mobilityGrid
                  }
                >
                  {mobilityOptions.map(
                    (option) => {
                      const selected =
                        selectedMobilityMode ===
                        option.id;

                      return (
                        <Pressable
                          key={
                            option.id
                          }
                          onPress={() =>
                            selectMobilityMode(
                              option.id,
                            )
                          }
                          style={({ pressed }) => [
                            styles.mobilityCard,

                            selected &&
                              styles.mobilityCardSelected,

                            pressed &&
                              styles.mobilityCardPressed,
                          ]}
                        >
                          <View
                            style={
                              styles.mobilityTopRow
                            }
                          >
                            <View
                              style={[
                                styles.mobilityIconContainer,

                                selected &&
                                  styles.mobilityIconContainerSelected,
                              ]}
                            >
                              <MaterialIcons
                                name={
                                  getMobilityIcon(
                                    option.id,
                                  )
                                }
                                size={19}
                                color={
                                  COLORS.primary
                                }
                              />
                            </View>

                            {selected && (
                              <MaterialIcons
                                name="check-circle"
                                size={17}
                                color={
                                  COLORS.primary
                                }
                              />
                            )}
                          </View>

                          <View
                            style={
                              styles.mobilityInfo
                            }
                          >
                            <Text
                              style={
                                styles.mobilityLabel
                              }
                            >
                              {option.label}
                            </Text>

                            <Text
                              style={
                                styles.mobilityDuration
                              }
                            >
                              {formatRouteDuration(
                                option.duration,
                              )}
                            </Text>

                            <Text
                              style={
                                styles.mobilityDistance
                              }
                            >
                              {formatRouteDistance(
                                option.distance,
                              )}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    },
                  )}
                </View>

                <Pressable
                  onPress={
                    handleStartNavigation
                  }
                  style={({ pressed }) => [
                    styles.navigationButton,

                    pressed &&
                      styles.navigationButtonPressed,
                  ]}
                >
                  <View
                    style={
                      styles.navigationButtonIcon
                    }
                  >
                    <MaterialIcons
                      name="navigation"
                      size={20}
                      color={
                        COLORS.white
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.navigationButtonTextArea
                    }
                  >
                    <Text
                      style={
                        styles.navigationButtonTitle
                      }
                    >
                      Iniciar rota
                    </Text>

                    <Text
                      style={
                        styles.navigationButtonSubtitle
                      }
                    >
                      Navegar de{' '}
                      {getMobilityLabel(
                        selectedMobilityMode,
                      )}{' '}
                      com Google Maps
                    </Text>
                  </View>

                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={
                      COLORS.white
                    }
                  />
                </Pressable>
              </>
            )}

            {!loadingMobility &&
              mobilityOptions.length ===
                0 && (
                <Text
                  style={
                    styles.mobilityUnavailable
                  }
                >
                  Não foi possível calcular outras formas de deslocamento para esta rota.
                </Text>
              )}
          </View>
        )}
      </View>

      <View
        style={
          styles.prioritySection
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          O que importa mais?
        </Text>

        <ComparisonModeSelector
          value={
            comparisonMode
          }
          onChange={
            setComparisonMode
          }
        />
      </View>

      <View
        style={
          styles.compareSection
        }
      >
        <CompareButton
          onPress={
            compararCorridas
          }
          loading={
            loadingCompare
          }
        />
      </View>

      {recommendation && (
        <View
          style={
            styles.resultsSection
          }
        >
          <View
            style={
              styles.resultsHeader
            }
          >
            <Text
              style={
                styles.resultsTitle
              }
            >
              Melhor corrida para você
            </Text>

            <Text
              style={
                styles.resultsSubtitle
              }
            >
              Comparamos preço e tempo para facilitar sua escolha.
            </Text>
          </View>

          <AIRecommendationCard
            ride={
              recommendation.melhor
            }
            recommendation={
              recommendation.motivo
            }
            origin={
              rideOrigin
            }
            destination={
              rideDestination
            }
          />

          {alternativeRides.length >
            0 && (
            <>
              <View
                style={
                  styles.optionsHeader
                }
              >
                <Text
                  style={
                    styles.optionsTitle
                  }
                >
                  Compare as opções
                </Text>

                <Text
                  style={
                    styles.optionsSubtitle
                  }
                >
                  Veja o que você ganha em preço e tempo em cada alternativa.
                </Text>
              </View>

              {alternativeRides.map(
                (ride) => {
                  const highlight =
                    getRideHighlight(
                      ride,
                      cheapestRide,
                      fastestRide,
                    );

                  const advantageText =
                    getAdvantageText(
                      ride,
                      cheapestRide,
                      fastestRide,
                    );

                  return (
                    <RideCard
                      key={
                        ride.id
                      }
                      nome={
                        ride.nome
                      }
                      preco={
                        formatCurrency(
                          ride.preco,
                        )
                      }
                      tempo={
                        `${ride.tempo} min`
                      }
                      distancia={
                        `${ride.distancia.toFixed(
                          1,
                        )} km`
                      }
                      economia={
                        formatCurrency(
                          ride.economia,
                        )
                      }
                      highlight={
                        highlight
                      }
                      advantageText={
                        advantageText
                      }
                      origin={
                        rideOrigin
                      }
                      destination={
                        rideDestination
                      }
                    />
                  );
                },
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    content: {
      paddingHorizontal:
        SPACING.lg,

      paddingTop:
        SPACING.sm,

      paddingBottom: 36,
    },

    tripSection: {
      marginTop:
        SPACING.lg,
    },

    prioritySection: {
      marginTop:
        SPACING.md,
    },

    compareSection: {
      marginTop:
        SPACING.md,

      marginBottom:
        SPACING.sm,
    },

    sectionTitle: {
      marginBottom:
        SPACING.sm,

      color:
        COLORS.text,

      fontSize: 19,

      fontWeight:
        '700',
    },

    routeSummary: {
      marginTop:
        SPACING.md,

      padding:
        SPACING.md,

      borderRadius: 16,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },

    routeSummaryHeader: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom:
        SPACING.md,
    },

    routeSummaryTitle: {
      color:
        COLORS.text,

      fontSize: 15,

      fontWeight:
        '700',
    },

    routeSummaryStatus: {
      color:
        COLORS.textSecondary,

      fontSize: 11,

      fontWeight:
        '600',
    },

    routeMetrics: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    routeMetric: {
      flex: 1,
    },

    routeMetricLabel: {
      color:
        COLORS.textSecondary,

      fontSize: 12,

      marginBottom: 3,
    },

    routeMetricValue: {
      color:
        COLORS.text,

      fontSize: 19,

      fontWeight:
        '800',
    },

    routeDivider: {
      width: 1,

      height: 34,

      marginHorizontal:
        SPACING.md,

      backgroundColor:
        COLORS.border,
    },

    mobilitySection: {
      marginTop:
        SPACING.md,
    },

    mobilityHeader: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',

      marginBottom: 8,
    },

    mobilityHeaderText: {
      flex: 1,

      paddingRight:
        SPACING.sm,
    },

    mobilityTitle: {
      color:
        COLORS.text,

      fontSize: 17,

      fontWeight:
        '700',
    },

    mobilitySubtitle: {
      marginTop: 1,

      color:
        COLORS.textSecondary,

      fontSize: 12,

      lineHeight: 16,
    },

    mobilityLoading: {
      color:
        COLORS.primary,

      fontSize: 11,

      fontWeight:
        '600',
    },

    mobilityGrid: {
      flexDirection:
        'row',

      flexWrap:
        'wrap',

      justifyContent:
        'space-between',
    },

    mobilityCard: {
      width: '48.7%',

      minHeight: 94,

      marginBottom: 8,

      paddingHorizontal: 11,

      paddingVertical: 9,

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.surface,
    },

    mobilityCardSelected: {
      borderWidth: 1.5,

      borderColor:
        COLORS.primary,
    },

    mobilityCardPressed: {
      opacity: 0.78,
    },

    mobilityTopRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },

    mobilityIconContainer: {
      width: 30,

      height: 30,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius: 9,

      backgroundColor:
        COLORS.background,
    },

    mobilityIconContainerSelected: {
      borderWidth: 1,

      borderColor:
        COLORS.primary,
    },

    mobilityInfo: {
      marginTop: 5,
    },

    mobilityLabel: {
      color:
        COLORS.textSecondary,

      fontSize: 11,

      fontWeight:
        '600',
    },

    mobilityDuration: {
      marginTop: 1,

      color:
        COLORS.text,

      fontSize: 16,

      fontWeight:
        '800',
    },

    mobilityDistance: {
      marginTop: 1,

      color:
        COLORS.textSecondary,

      fontSize: 11,
    },

    mobilityUnavailable: {
      color:
        COLORS.textSecondary,

      fontSize: 12,

      lineHeight: 17,
    },

    navigationButton: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 4,

      paddingHorizontal: 14,

      paddingVertical: 11,

      borderRadius: 14,

      backgroundColor:
        COLORS.primary,
    },

    navigationButtonPressed: {
      opacity: 0.82,
    },

    navigationButtonIcon: {
      width: 34,

      height: 34,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius: 10,

      backgroundColor:
        'rgba(255,255,255,0.12)',
    },

    navigationButtonTextArea: {
      flex: 1,

      marginLeft:
        SPACING.sm,
    },

    navigationButtonTitle: {
      color:
        COLORS.white,

      fontSize: 15,

      fontWeight:
        '800',
    },

    navigationButtonSubtitle: {
      marginTop: 1,

      color:
        'rgba(255,255,255,0.76)',

      fontSize: 11,

      fontWeight:
        '500',
    },

    resultsSection: {
      marginTop:
        SPACING.xl,
    },

    resultsHeader: {
      marginBottom:
        SPACING.sm,
    },

    resultsTitle: {
      color:
        COLORS.text,

      fontSize: 21,

      fontWeight:
        '800',
    },

    resultsSubtitle: {
      marginTop: 3,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 18,
    },

    optionsHeader: {
      marginTop:
        SPACING.lg,

      marginBottom:
        SPACING.sm,
    },

    optionsTitle: {
      color:
        COLORS.text,

      fontSize: 19,

      fontWeight:
        '700',
    },

    optionsSubtitle: {
      marginTop: 2,

      color:
        COLORS.textSecondary,

      fontSize: 13,

      lineHeight: 18,
    },
  });