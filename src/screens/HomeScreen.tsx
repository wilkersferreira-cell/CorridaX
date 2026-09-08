import React, {
  useEffect,
  useMemo,
  useRef,
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
import {
  getAnalytics,
  logEvent,
} from '@react-native-firebase/analytics';

import AddressSuggestions from '../components/inputs/AddressSuggestions';
import Header from '../components/layout/Header';
import LocationInput from '../components/inputs/LocationInput';
import MapViewCard from '../components/map/MapViewCard';

import useLocation from '../hooks/useLocation';

import useRideComparison, {
  MobilityMode,
} from '../hooks/useRideComparison';

import {
  openRideApp,
  RideApp,
} from '../services/deepLinks';

import {
  startNavigation,
} from '../services/navigation';

import {
  saveFavorite,
} from '../services/favoritesStorage';

import {
  saveHistory,
} from '../services/storage';

import {
  COLORS,
  SPACING,
} from '../theme';

type ProviderOption = {
  id: RideApp;
  name: string;
  eyebrow: string;
  action: string;
  accent: string;
  cardBackground: string;
  badgeBackground: string;
  badgeTextColor: string;
};

const PROVIDERS: ProviderOption[] = [
  {
    id: 'uber',
    name: 'Uber',
    eyebrow: 'CORRIDA',
    action: 'Abrir Uber agora',
    accent: '#FFFFFF',
    cardBackground: '#090A0C',
    badgeBackground: '#FFFFFF',
    badgeTextColor: '#090A0C',
  },
  {
    id: '99',
    name: '99',
    eyebrow: 'CORRIDA',
    action: 'Abrir 99 agora',
    accent: '#FFD400',
    cardBackground: '#241E00',
    badgeBackground: '#FFD400',
    badgeTextColor: '#171400',
  },
  {
    id: 'indrive',
    name: 'inDrive',
    eyebrow: 'CORRIDA',
    action: 'Abrir inDrive agora',
    accent: '#A7EA36',
    cardBackground: '#15200B',
    badgeBackground: '#A7EA36',
    badgeTextColor: '#142008',
  },
];

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

function formatRouteDistance(
  distance: number,
): string {
  return `${distance.toFixed(
    1,
  )} km`;
}

function formatRouteDuration(
  duration: number,
): string {
  const totalMinutes =
    Math.max(
      1,
      Math.round(
        duration,
      ),
    );

  if (
    totalMinutes < 60
  ) {
    return `${totalMinutes} min`;
  }

  const hours =
    Math.floor(
      totalMinutes / 60,
    );

  const minutes =
    totalMinutes % 60;

  if (
    minutes === 0
  ) {
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

export default function HomeScreen({
  navigation,
  route,
}: any) {
  const {
    loading,
    address,
    latitude,
    longitude,
  } = useLocation();

  const {
    suggestions,
    search,
    setSuggestions,
    selectDestination,
    selectSavedDestination,
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
  } = useRideComparison();

  const [
    origem,
    setOrigem,
  ] = useState('');

  const [
    destino,
    setDestino,
  ] = useState('');

  const processingFavoriteRef =
    useRef<string | null>(
      null,
    );

  const savedHistoryRouteRef =
    useRef<string | null>(
      null,
    );

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
    setGpsOrigin,
  ]);

  useEffect(() => {
    const favorite =
      route.params
        ?.favoriteDestination;

    if (!favorite) {
      processingFavoriteRef.current =
        null;

      return;
    }

    const favoriteLatitude =
      Number(
        favorite.latitude,
      );

    const favoriteLongitude =
      Number(
        favorite.longitude,
      );

    const hasValidFavoriteCoordinate =
      Number.isFinite(
        favoriteLatitude,
      ) &&
      Number.isFinite(
        favoriteLongitude,
      ) &&
      favoriteLatitude >= -90 &&
      favoriteLatitude <= 90 &&
      favoriteLongitude >= -180 &&
      favoriteLongitude <= 180 &&
      !(
        favoriteLatitude === 0 &&
        favoriteLongitude === 0
      );

    const hasGps =
      Number.isFinite(
        latitude,
      ) &&
      Number.isFinite(
        longitude,
      ) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180 &&
      !(
        latitude === 0 &&
        longitude === 0
      );

    if (!hasGps) {
      return;
    }

    const favoriteKey =
      String(
        favorite.id ||
          `${favoriteLatitude},${favoriteLongitude}:${favorite.name || favorite.address || ''}`,
      );

    if (
      processingFavoriteRef.current ===
      favoriteKey
    ) {
      return;
    }

    processingFavoriteRef.current =
      favoriteKey;

    navigation.setParams({
      favoriteDestination:
        undefined,
    });

    if (
      !hasValidFavoriteCoordinate
    ) {
      Alert.alert(
        'Favoritos',
        'Este favorito possui uma localização inválida. Remova-o e salve o destino novamente.',
      );

      return;
    }

    let active = true;

    async function openFavoriteDestination() {
      try {
        setDestino(
          favorite.address ||
            favorite.name,
        );

        setSuggestions(
          [],
        );

        await selectSavedDestination(
          favorite.name,
          {
            latitude:
              favoriteLatitude,

            longitude:
              favoriteLongitude,
          },
          latitude,
          longitude,
        );
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Não foi possível abrir este favorito.';

        Alert.alert(
          'Favoritos',
          message,
        );
      }
    }

    void openFavoriteDestination();

    return () => {
      active = false;
    };
  }, [
    route.params
      ?.favoriteDestination,
    latitude,
    longitude,
    navigation,
    selectSavedDestination,
    setSuggestions,
  ]);

  const displayedDestination =
    destination
      ? formatDestinationName(
          destino,
        )
      : destino;

  const currentRouteKey =
    useMemo(() => {
      if (
        !origin ||
        !destination
      ) {
        return null;
      }

      return (
        `${origin.latitude},${origin.longitude}` +
        '>' +
        `${destination.latitude},${destination.longitude}`
      );
    }, [
      origin,
      destination,
    ]);

  async function handleSaveFavorite() {
    if (!destination) {
      Alert.alert(
        'Favoritos',
        'Selecione um destino antes de salvar.',
      );

      return;
    }

    try {
      const result =
        await saveFavorite({
          name:
            displayedDestination.trim() ||
            destino.trim(),

          address:
            destino.trim(),

          latitude:
            destination.latitude,

          longitude:
            destination.longitude,
        });

      Alert.alert(
        'Favoritos',
        result.created
          ? 'Destino salvo nos favoritos.'
          : 'Este destino já está nos seus favoritos.',
      );
    } catch {
      Alert.alert(
        'Favoritos',
        'Não foi possível salvar este destino.',
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

  async function saveCurrentRouteToHistory() {
    if (
      !routeInfo ||
      !currentRouteKey
    ) {
      return;
    }

    if (
      savedHistoryRouteRef.current ===
      currentRouteKey
    ) {
      return;
    }

    savedHistoryRouteRef.current =
      currentRouteKey;

    try {
      await saveHistory({
        origin:
          origem.trim(),

        destination:
          destino.trim(),

        distance:
          routeInfo.distance,

        duration:
          routeInfo.duration,

        mobilityMode:
          selectedMobilityMode,
      });
    } catch {
      savedHistoryRouteRef.current =
        null;
    }
  }

  async function handleOpenProvider(
    provider: RideApp,
  ) {
    if (
      !origin ||
      !destination
    ) {
      Alert.alert(
        'Corrida',
        'Selecione um destino antes de consultar uma plataforma.',
      );

      return;
    }

    await saveCurrentRouteToHistory();

    try {
      await logEvent(
        getAnalytics(),
        'provider_open',
        {
          provider,
          mobility_mode:
            selectedMobilityMode,
          distance_km:
            routeInfo?.distance ?? 0,
          duration_minutes:
            routeInfo?.duration ?? 0,
        },
      );
    } catch {
      // Analytics não deve impedir a abertura da plataforma.
    }

    await openRideApp(
      provider,
      {
        origin: {
          latitude:
            origin.latitude,

          longitude:
            origin.longitude,

          address:
            origem.trim(),
        },

        destination: {
          latitude:
            destination.latitude,

          longitude:
            destination.longitude,

          address:
            destino.trim(),
        },
      },
    );
  }

  const initialState =
    !destination &&
    !routeInfo;

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={[
        styles.content,

        initialState &&
          styles.contentInitial,
      ]}
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
          compact={
            initialState
          }
        />
      )}

      <View
        style={[
          styles.tripSection,

          initialState &&
            styles.tripSectionInitial,
        ]}
      >
        <View style={styles.tripHeading}>
          <Text style={styles.sectionEyebrow}>
            SEU PONTO DE PARTIDA
          </Text>

          <Text style={styles.sectionTitle}>
            Para onde vamos hoje?
          </Text>

          {initialState && (
            <Text style={styles.sectionSubtitle}>
              Informe seu destino uma vez e escolha em qual plataforma consultar sua corrida.
            </Text>
          )}
        </View>

        <View
          style={
            styles.locationGroup
          }
        >
          <LocationInput
            label="Origem"
            value={
              origem ||
              'Obtendo localização...'
            }
            onChangeText={() => {}}
            icon="crosshairs-gps"
            editable={
              false
            }
            compact
            position="top"
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
            position="bottom"
          />
        </View>

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
                  latitude,
                  longitude,
                );

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

        {initialState && (
          <View style={styles.initialProvidersSection}>
            <Text style={styles.initialProvidersEyebrow}>
              SUAS OPÇÕES DE CORRIDA
            </Text>

            <View style={styles.providerCompactRow}>
              {PROVIDERS.map((provider) => (
                <View
                  key={provider.id}
                  style={[
                    styles.providerCompactCard,
                    styles.providerCompactCardDisabled,
                    {
                      backgroundColor:
                        provider.id === 'uber'
                          ? '#050505'
                          : provider.id === '99'
                            ? '#FFD400'
                            : '#A7EA36',
                      borderColor:
                        provider.id === 'uber'
                          ? '#FFFFFF'
                          : provider.id === '99'
                            ? '#FFD400'
                            : '#A7EA36',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.providerCompactBrand,
                      {
                        color:
                          provider.id === 'uber'
                            ? '#FFFFFF'
                            : '#000000',
                      },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {provider.name}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.initialProvidersMessage}>
              Informe seu destino e clique na plataforma para saber o valor da sua corrida.
            </Text>
          </View>
        )}

        {routeInfo &&
          destination && (
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
                  Sua rota
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
            <Pressable
              onPress={
                handleSaveFavorite
              }
              style={({
                pressed,
              }) => [
                styles.favoriteButton,

                pressed &&
                  styles.cardPressed,
              ]}
            >
              <MaterialIcons
                name="favorite-border"
                size={19}
                color={
                  COLORS.primary
                }
              />

              <View
                style={
                  styles.favoriteButtonText
                }
              >
                <Text
                  style={
                    styles.favoriteButtonTitle
                  }
                >
                  Salvar nos favoritos
                </Text>

                <Text
                  style={
                    styles.favoriteButtonSubtitle
                  }
                >
                  Guardar este destino para usar depois
                </Text>
              </View>

              <MaterialIcons
                name="chevron-right"
                size={20}
                color={
                  COLORS.textSecondary
                }
              />
            </Pressable>

            {routeInfo &&
              origin && (
                <View style={styles.routeProvidersSection}>
                  <Text style={styles.routeProvidersEyebrow}>
                    ESCOLHA ONDE CONSULTAR
                  </Text>

                  <View style={styles.providerCompactRow}>
                    {PROVIDERS.map((provider) => (
                      <Pressable
                        key={provider.id}
                        onPress={() =>
                          handleOpenProvider(
                            provider.id,
                          )
                        }
                        style={({ pressed }) => [
                          styles.providerCompactCard,
                          {
                            backgroundColor:
                              provider.id === 'uber'
                                ? '#050505'
                                : provider.id === '99'
                                  ? '#FFD400'
                                  : '#A7EA36',
                            borderColor:
                              provider.id === 'uber'
                                ? '#FFFFFF'
                                : provider.id === '99'
                                  ? '#FFD400'
                                  : '#A7EA36',
                          },
                          pressed &&
                            styles.providerCompactCardPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.providerCompactBrand,
                            {
                              color:
                                provider.id === 'uber'
                                  ? '#FFFFFF'
                                  : '#000000',
                            },
                          ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {provider.name}
                        </Text>

                        <Text
                          style={[
                            styles.providerCompactAction,
                            {
                              color:
                                provider.id === 'uber'
                                  ? '#FFFFFF'
                                  : '#000000',
                            },
                          ]}
                          numberOfLines={2}
                        >
                          Clique e veja o valor
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

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
                          style={({
                            pressed,
                          }) => [
                            styles.mobilityCard,

                            selected &&
                              styles.mobilityCardSelected,

                            pressed &&
                              styles.cardPressed,
                          ]}
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

                          <Text
                            style={
                              styles.mobilityLabel
                            }
                            numberOfLines={1}
                          >
                            {option.label}
                          </Text>

                          <Text
                            style={
                              styles.mobilityDuration
                            }
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            {formatRouteDuration(
                              option.duration,
                            )}
                          </Text>

                          {selected && (
                            <View
                              style={
                                styles.mobilitySelectedDot
                              }
                            />
                          )}
                        </Pressable>
                      );
                    },
                  )}
                </View>

                <Pressable
                  onPress={
                    handleStartNavigation
                  }
                  style={({
                    pressed,
                  }) => [
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
                      size={19}
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
                    size={21}
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
      flexGrow: 1,
      paddingHorizontal:
        SPACING.lg,
      paddingTop: 2,
      paddingBottom: 32,
    },

    contentInitial: {
      paddingBottom: 96,
    },

    tripSection: {
      marginTop: 11,
    },

    tripSectionInitial: {
      marginTop: 12,
    },

    tripHeading: {
      marginBottom: 9,
    },

    sectionEyebrow: {
      marginBottom: 4,
      color:
        COLORS.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.35,
    },

    sectionTitle: {
      color:
        COLORS.text,
      fontSize: 23,
      fontWeight: '900',
      letterSpacing: -0.6,
    },

    sectionSubtitle: {
      maxWidth: 340,
      marginTop: 4,
      color:
        COLORS.textSecondary,
      fontSize: 11,
      lineHeight: 15,
    },

    locationGroup: {
      marginBottom: 8,
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.surface,
    },

    initialProvidersSection: {
      marginTop: 10,
      paddingHorizontal: 13,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.surface,
    },

    initialProvidersEyebrow: {
      marginBottom: 9,
      color:
        COLORS.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.15,
    },

    initialProvidersMessage: {
      marginTop: 9,
      color:
        COLORS.textSecondary,
      fontSize: 9,
      lineHeight: 13,
      textAlign: 'center',
    },

    routeProvidersSection: {
      marginBottom: 12,
    },

    routeProvidersEyebrow: {
      marginBottom: 8,
      color:
        COLORS.primary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.15,
    },

    providerCompactRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
    },

    providerCompactCard: {
      width: '31.8%',
      minHeight: 96,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      paddingVertical: 9,
      borderRadius: 16,
      borderWidth: 1,
    },

    providerCompactCardDisabled: {
      minHeight: 78,
      opacity: 0.94,
    },

    providerCompactCardPressed: {
      opacity: 0.78,
      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    providerCompactBrand: {
      width: '100%',
      color:
        COLORS.white,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '900',
      letterSpacing: -0.5,
      textAlign: 'center',
    },

    providerCompactAction: {
      marginTop: 8,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '800',
      textAlign: 'center',
    },

    routeSummary: {
      marginTop: 9,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 17,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
    },

    routeSummaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 8,
    },

    routeSummaryTitle: {
      color:
        COLORS.text,
      fontSize: 15,
      fontWeight: '900',
    },

    routeSummaryStatus: {
      color:
        COLORS.primary,
      fontSize: 9,
      fontWeight: '800',
    },

    routeMetrics: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    routeMetric: {
      flex: 1,
    },

    routeMetricLabel: {
      color:
        COLORS.textSecondary,
      fontSize: 10,
      marginBottom: 1,
    },

    routeMetricValue: {
      color:
        COLORS.text,
      fontSize: 19,
      fontWeight: '900',
      letterSpacing: -0.3,
    },

    routeDivider: {
      width: 1,
      height: 31,
      marginHorizontal: 13,
      backgroundColor:
        COLORS.border,
    },

    mobilitySection: {
      marginTop: 10,
    },

    favoriteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 9,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 13,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.surface,
    },

    favoriteButtonText: {
      flex: 1,
      marginLeft: 9,
    },

    favoriteButtonTitle: {
      color:
        COLORS.text,
      fontSize: 12,
      fontWeight: '800',
    },

    favoriteButtonSubtitle: {
      marginTop: 1,
      color:
        COLORS.textSecondary,
      fontSize: 9,
    },

    mobilityHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
      marginBottom: 7,
    },

    mobilityHeaderText: {
      flex: 1,
      paddingRight: 8,
    },

    mobilityTitle: {
      color:
        COLORS.text,
      fontSize: 17,
      fontWeight: '900',
      letterSpacing: -0.3,
    },

    mobilitySubtitle: {
      marginTop: 1,
      color:
        COLORS.textSecondary,
      fontSize: 10,
      lineHeight: 14,
    },

    mobilityLoading: {
      color:
        COLORS.primary,
      fontSize: 9,
      fontWeight: '800',
    },

    mobilityGrid: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
    },

    mobilityCard: {
      position: 'relative',
      width: '23.7%',
      minHeight: 84,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 7,
      paddingHorizontal: 5,
      paddingVertical: 8,
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
      backgroundColor:
        COLORS.surfaceLight,
    },

    cardPressed: {
      opacity: 0.78,
    },

    mobilityIconContainer: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
      backgroundColor:
        COLORS.background,
    },

    mobilityIconContainerSelected: {
      borderWidth: 1,
      borderColor:
        COLORS.primary,
    },

    mobilityLabel: {
      marginTop: 5,
      color:
        COLORS.textSecondary,
      fontSize: 8,
      fontWeight: '800',
      textAlign: 'center',
    },

    mobilityDuration: {
      marginTop: 1,
      maxWidth: '100%',
      color:
        COLORS.text,
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: -0.2,
      textAlign: 'center',
    },

    mobilitySelectedDot: {
      position: 'absolute',
      top: 7,
      right: 7,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        COLORS.primary,
    },

    mobilityUnavailable: {
      color:
        COLORS.textSecondary,
      fontSize: 11,
      lineHeight: 16,
    },

    navigationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 14,
      backgroundColor:
        COLORS.primary,
    },

    navigationButtonPressed: {
      opacity: 0.82,
    },

    navigationButtonIcon: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
      backgroundColor:
        'rgba(255,255,255,0.14)',
    },

    navigationButtonTextArea: {
      flex: 1,
      marginLeft: 10,
    },

    navigationButtonTitle: {
      color:
        COLORS.white,
      fontSize: 14,
      fontWeight: '900',
    },

    navigationButtonSubtitle: {
      marginTop: 1,
      color:
        'rgba(255,255,255,0.78)',
      fontSize: 9,
      fontWeight: '500',
    },

  });
