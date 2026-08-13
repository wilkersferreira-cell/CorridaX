import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
import useRideComparison from '../hooks/useRideComparison';

import {
  chooseBestRide,
} from '../services/ai';

import {
  RideOption,
} from '../services/comparison';

import {
  COLORS,
  SPACING,
} from '../theme';

/*
 * Exibe um endereço de forma
 * resumida quando o destino
 * não possuir um nome comercial.
 *
 * Exemplos:
 *
 * Shopping Grande Circular
 * continua:
 * Shopping Grande Circular
 *
 * Av. Coronel Teixeira,
 * 5705 - Ponta Negra
 *
 * vira:
 * Av. Coronel Teixeira, 5705
 */
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

  /*
   * Nomes comerciais normalmente
   * não possuem vírgula.
   *
   * Exemplo:
   * Shopping Grande Circular
   */
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

  /*
   * Se o segundo trecho começar
   * com número, provavelmente
   * estamos diante de um endereço.
   */
  const looksLikeAddress =
    /^\d/.test(
      secondPart,
    );

  if (!looksLikeAddress) {
    return firstPart;
  }

  return `${firstPart}, ${secondPart}`;
}

/*
 * Localiza a opção
 * de menor preço.
 */
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

/*
 * Localiza a opção
 * de menor tempo.
 */
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

/*
 * Formatação monetária utilizada
 * nas mensagens comerciais.
 */
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

/*
 * Define a classificação comercial
 * de cada alternativa.
 *
 * A melhor escolha é apresentada
 * separadamente pelo CorridaX.
 *
 * Entre as demais:
 *
 * - menor preço = Mais econômico
 * - menor tempo = Mais rápido
 * - intermediária = Equilíbrio
 */
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

/*
 * Cria mensagens simples que
 * mostram ao usuário exatamente
 * o que ele ganha ou perde
 * escolhendo aquela opção.
 */
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

  /*
   * Uma mesma opção pode,
   * eventualmente, ser a mais
   * barata e a mais rápida.
   */
  if (
    isCheapest &&
    isFastest
  ) {
    return 'Menor preço e menor tempo nesta viagem.';
  }

  /*
   * MAIS ECONÔMICO
   *
   * Compara preço e tempo
   * diretamente com a opção
   * mais rápida.
   */
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

  /*
   * MAIS RÁPIDO
   *
   * Mostra quanto tempo o usuário
   * ganha e quanto custa essa
   * diferença.
   */
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

  /*
   * EQUILÍBRIO
   *
   * A terceira opção não é tratada
   * simplesmente como "outra".
   *
   * Mostramos por que ela pode ser
   * interessante entre preço e tempo.
   */

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

/*
 * Define a prioridade visual
 * das alternativas.
 *
 * Opções com uma vantagem objetiva
 * aparecem antes da opção de
 * equilíbrio.
 */
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

  /*
   * Origem obtida pelo GPS.
   */
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

  /*
   * Envia as coordenadas reais
   * para o motor CorridaX.
   */
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

  /*
   * Melhor escolha CorridaX.
   *
   * O Score continua existindo
   * somente no motor interno.
   */
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

  /*
   * Líderes reais daquela viagem.
   */
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

  /*
   * Remove a Melhor escolha
   * da lista de alternativas
   * e organiza as demais.
   *
   * Ordem:
   *
   * 1. Mais econômico
   * 2. Mais rápido
   * 3. Equilíbrio
   *
   * Caso a Melhor escolha já seja
   * uma dessas categorias, ela não
   * será repetida.
   */
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

  /*
   * Nome amigável do destino.
   *
   * Se Google Places retornar
   * "Shopping Grande Circular",
   * esse será o texto mostrado.
   *
   * Para endereços residenciais,
   * continuamos mostrando rua
   * e número.
   */
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

      setSuggestions(
        [],
      );
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
              const selected =
                await selectDestination(
                  item,
                );

              /*
               * Agora o Google Places
               * prioriza o nome do local.
               *
               * Exemplo:
               * Shopping Grande Circular
               */
              setDestino(
                selected.displayName,
              );

              setSuggestions(
                [],
              );
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

          {/*
           * MELHOR ESCOLHA
           *
           * O Score não é exibido
           * para o usuário.
           */}
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