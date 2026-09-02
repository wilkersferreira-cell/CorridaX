import {
  useState,
} from 'react';

import {
  searchGooglePlaces,
  getGooglePlaceCoordinate,
  GooglePlaceSuggestion,
} from '../api/googlePlaces';

import {
  calculateRoute,
  Coordinate,
} from '../api/routes';

import {
  calculateGoogleRoute,
  GoogleTravelMode,
} from '../api/googleRoutes';

import {
  compareRides,
  ComparisonMode,
  RideOption,
} from '../services/comparison';

import {
  compareRouteEngines,
  RouteComparisonResult,
} from '../services/routeComparison';

export type MobilityMode =
  | 'car'
  | 'motorcycle'
  | 'bicycle'
  | 'walk';

export type MobilityOption = {
  id: MobilityMode;
  label: string;
  travelMode: GoogleTravelMode;

  distance: number;
  duration: number;

  /*
   * Dados de trânsito retornados
   * pelo Google Routes.
   *
   * São opcionais porque WALK,
   * BICYCLE ou um eventual fallback
   * podem não fornecer essas métricas.
   */
  staticDuration?: number;
  trafficIndex?: number;
  trafficDelayMinutes?: number;

  coordinates: Coordinate[];
};

export type RouteInfo = {
  distance: number;
  duration: number;

  staticDuration?: number;
  trafficIndex?: number;
  trafficDelayMinutes?: number;
};

const MOBILITY_MODES: Array<{
  id: MobilityMode;
  label: string;
  travelMode: GoogleTravelMode;
}> = [
  {
    id: 'car',
    label: 'Carro',
    travelMode: 'DRIVE',
  },

  {
    id: 'motorcycle',
    label: 'Moto',
    travelMode: 'TWO_WHEELER',
  },

  {
    id: 'bicycle',
    label: 'Bicicleta',
    travelMode: 'BICYCLE',
  },

  {
    id: 'walk',
    label: 'A pé',
    travelMode: 'WALK',
  },
];

function isValidCoordinate(
  latitude?: number,
  longitude?: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(
      latitude === 0 &&
      longitude === 0
    )
  );
}

export default function useRideComparison() {
  const [loading, setLoading] =
    useState(false);

  const [rides, setRides] =
    useState<RideOption[]>([]);

  const [suggestions, setSuggestions] =
    useState<GooglePlaceSuggestion[]>([]);

  const [origin, setOrigin] =
    useState<Coordinate | undefined>();

  const [destination, setDestination] =
    useState<Coordinate | undefined>();

  const [
    selectedDestination,
    setSelectedDestination,
  ] = useState<{
    placeId: string;
    displayName: string;
    coordinate: Coordinate;
  } | null>(null);

  const [
    routeCoordinates,
    setRouteCoordinates,
  ] = useState<Coordinate[]>([]);

  const [
    routeInfo,
    setRouteInfo,
  ] = useState<RouteInfo | null>(
    null,
  );

  const [
    mobilityOptions,
    setMobilityOptions,
  ] = useState<MobilityOption[]>([]);

  const [
    loadingMobility,
    setLoadingMobility,
  ] = useState(false);

  const [
    selectedMobilityMode,
    setSelectedMobilityMode,
  ] = useState<MobilityMode>(
    'car',
  );

  const [
    comparisonMode,
    setComparisonMode,
  ] = useState<ComparisonMode>(
    'balanced',
  );

  const [
    routeComparison,
    setRouteComparison,
  ] =
    useState<
      RouteComparisonResult | null
    >(null);

  function setGpsOrigin(
    latitude: number,
    longitude: number,
  ) {
    if (
      !isValidCoordinate(
        latitude,
        longitude,
      )
    ) {
      return;
    }

    setOrigin({
      latitude,
      longitude,
    });
  }

  async function search(
    query: string,
    latitude?: number,
    longitude?: number,
  ) {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const result =
        await searchGooglePlaces(
          query,
          latitude,
          longitude,
        );

      setSuggestions(result);
    } catch (error) {
      console.warn(
        'Falha na busca Google Places:',
        error,
      );

      setSuggestions([]);
    }
  }

  function selectMobilityMode(
    mode: MobilityMode,
  ) {
    const option =
      mobilityOptions.find(
        (item) =>
          item.id === mode,
      );

    if (!option) {
      return;
    }

    setSelectedMobilityMode(
      mode,
    );

    setRouteInfo({
      distance:
        option.distance,

      duration:
        option.duration,

      staticDuration:
        option.staticDuration,

      trafficIndex:
        option.trafficIndex,

      trafficDelayMinutes:
        option.trafficDelayMinutes,
    });

    if (
      option.coordinates.length >= 2
    ) {
      setRouteCoordinates(
        option.coordinates,
      );
    }
  }

  async function calculateMobilityOptions(
    originCoordinate: Coordinate,
    destinationCoordinate: Coordinate,
  ): Promise<MobilityOption[]> {
    setLoadingMobility(true);

    try {
      const results =
        await Promise.allSettled(
          MOBILITY_MODES.map(
            async (mode) => {
              const route =
                await calculateGoogleRoute(
                  originCoordinate.latitude,
                  originCoordinate.longitude,
                  destinationCoordinate.latitude,
                  destinationCoordinate.longitude,
                  mode.travelMode,
                );

              const option:
                MobilityOption = {
                id:
                  mode.id,

                label:
                  mode.label,

                travelMode:
                  mode.travelMode,

                distance:
                  route.distance,

                duration:
                  route.duration,

                staticDuration:
                  route.staticDuration,

                trafficIndex:
                  route.trafficIndex,

                trafficDelayMinutes:
                  route.trafficDelayMinutes,

                coordinates:
                  route.coordinates,
              };

              return option;
            },
          ),
        );

      const availableOptions:
        MobilityOption[] = [];

      results.forEach(
        (result, index) => {
          if (
            result.status ===
            'fulfilled'
          ) {
            availableOptions.push(
              result.value,
            );

            return;
          }

          console.warn(
            `Modo ${MOBILITY_MODES[index].label} indisponível:`,
            result.reason,
          );
        },
      );

      setMobilityOptions(
        availableOptions,
      );

      return availableOptions;
    } catch (error) {
      console.warn(
        'Falha ao calcular opções de mobilidade:',
        error,
      );

      setMobilityOptions([]);

      return [];
    } finally {
      setLoadingMobility(false);
    }
  }

  /*
   * PRÉ-VISUALIZAÇÃO DA ROTA
   *
   * Recebe a origem explicitamente
   * para não depender exclusivamente
   * do estado assíncrono do React.
   *
   * Quando o Google Routes responde,
   * também preservamos os dados
   * objetivos de trânsito.
   */
  async function previewRoute(
    originCoordinate: Coordinate,
    destinationCoordinate: Coordinate,
  ) {
    try {
      let routeDistance: number;
      let routeDuration: number;

      let routeStaticDuration:
        number | undefined;

      let routeTrafficIndex:
        number | undefined;

      let routeTrafficDelayMinutes:
        number | undefined;

      let coordinates:
        Coordinate[];

      try {
        const googleRoute =
          await calculateGoogleRoute(
            originCoordinate.latitude,
            originCoordinate.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
            'DRIVE',
          );

        routeDistance =
          googleRoute.distance;

        routeDuration =
          googleRoute.duration;

        routeStaticDuration =
          googleRoute.staticDuration;

        routeTrafficIndex =
          googleRoute.trafficIndex;

        routeTrafficDelayMinutes =
          googleRoute.trafficDelayMinutes;

        coordinates =
          googleRoute.coordinates;

        if (
          coordinates.length === 0
        ) {
          const osrmGeometry =
            await calculateRoute(
              originCoordinate.latitude,
              originCoordinate.longitude,
              destinationCoordinate.latitude,
              destinationCoordinate.longitude,
            );

          coordinates =
            osrmGeometry.coordinates;
        }
      } catch (googleError) {
        console.warn(
          'Google Routes indisponível no preview. Usando OSRM.',
          googleError,
        );

        const osrmRoute =
          await calculateRoute(
            originCoordinate.latitude,
            originCoordinate.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
          );

        routeDistance =
          osrmRoute.distance;

        routeDuration =
          osrmRoute.duration;

        /*
         * OSRM não fornece a mesma
         * referência de trânsito atual
         * utilizada pelo Google Routes.
         *
         * Por isso não inventamos
         * trafficIndex no fallback.
         */
        routeStaticDuration =
          undefined;

        routeTrafficIndex =
          undefined;

        routeTrafficDelayMinutes =
          undefined;

        coordinates =
          osrmRoute.coordinates;
      }

      setOrigin(
        originCoordinate,
      );

      setSelectedMobilityMode(
        'car',
      );

      /*
       * A rota de carro aparece
       * imediatamente.
       */
      setRouteCoordinates(
        coordinates,
      );

      setRouteInfo({
        distance:
          routeDistance,

        duration:
          routeDuration,

        staticDuration:
          routeStaticDuration,

        trafficIndex:
          routeTrafficIndex,

        trafficDelayMinutes:
          routeTrafficDelayMinutes,
      });

      /*
       * Depois calculamos as quatro
       * modalidades.
       */
      const options =
        await calculateMobilityOptions(
          originCoordinate,
          destinationCoordinate,
        );

      const carOption =
        options.find(
          (option) =>
            option.id === 'car',
        );

      if (carOption) {
        setRouteInfo({
          distance:
            carOption.distance,

          duration:
            carOption.duration,

          staticDuration:
            carOption.staticDuration,

          trafficIndex:
            carOption.trafficIndex,

          trafficDelayMinutes:
            carOption.trafficDelayMinutes,
        });

        if (
          carOption.coordinates.length >=
          2
        ) {
          setRouteCoordinates(
            carOption.coordinates,
          );
        }
      }
    } catch (error) {
      console.warn(
        'Não foi possível pré-visualizar a rota:',
        error,
      );

      setRouteCoordinates([]);

      setRouteInfo(null);

      setMobilityOptions([]);
    }
  }

  /*
   * SELEÇÃO DO DESTINO
   *
   * Pode receber diretamente
   * latitude e longitude atuais
   * fornecidas pela Home.
   */
  async function selectDestination(
    suggestion: GooglePlaceSuggestion,
    originLatitude?: number,
    originLongitude?: number,
  ) {
    const place =
      await getGooglePlaceCoordinate(
        suggestion.placeId,
      );

    const coordinate: Coordinate = {
      latitude:
        place.latitude,

      longitude:
        place.longitude,
    };

    const displayName =
      place.displayName ||
      suggestion.displayName;

    setSelectedDestination({
      placeId:
        suggestion.placeId,

      displayName,

      coordinate,
    });

    setDestination(
      coordinate,
    );

    setRouteCoordinates([]);

    setRouteInfo(null);

    setMobilityOptions([]);

    setSelectedMobilityMode(
      'car',
    );

    setRouteComparison(
      null,
    );

    setRides([]);

    setSuggestions([]);

    /*
     * PRIORIDADE:
     *
     * 1. GPS fornecido diretamente
     *    pela Home.
     *
     * 2. Estado origin já existente.
     */
    let previewOrigin:
      Coordinate | undefined;

    if (
      isValidCoordinate(
        originLatitude,
        originLongitude,
      )
    ) {
      previewOrigin = {
        latitude:
          originLatitude as number,

        longitude:
          originLongitude as number,
      };
    } else if (origin) {
      previewOrigin =
        origin;
    }

    if (!previewOrigin) {
      console.warn(
        'GPS ainda não disponível para calcular a rota.',
      );

      return {
        displayName,
        coordinate,
      };
    }

    await previewRoute(
      previewOrigin,
      coordinate,
    );

    return {
      displayName,
      coordinate,
    };
  }

  async function selectSavedDestination(
    displayName: string,
    coordinate: Coordinate,
    originLatitude?: number,
    originLongitude?: number,
  ) {
    setSelectedDestination({
      placeId:
        `favorite:${coordinate.latitude},${coordinate.longitude}`,

      displayName,

      coordinate,
    });

    setDestination(
      coordinate,
    );

    setRouteCoordinates([]);

    setRouteInfo(null);

    setMobilityOptions([]);

    setSelectedMobilityMode(
      'car',
    );

    setRouteComparison(
      null,
    );

    setRides([]);

    setSuggestions([]);

    let previewOrigin:
      Coordinate | undefined;

    if (
      isValidCoordinate(
        originLatitude,
        originLongitude,
      )
    ) {
      previewOrigin = {
        latitude:
          originLatitude as number,

        longitude:
          originLongitude as number,
      };
    } else if (origin) {
      previewOrigin =
        origin;
    }

    if (!previewOrigin) {
      return;
    }

    await previewRoute(
      previewOrigin,
      coordinate,
    );
  }

  function clearSelectedDestination() {
    setSelectedDestination(
      null,
    );

    setDestination(
      undefined,
    );

    setRouteCoordinates([]);

    setRouteInfo(null);

    setMobilityOptions([]);

    setSelectedMobilityMode(
      'car',
    );

    setRouteComparison(
      null,
    );

    setRides([]);
  }

  async function compare(
    origem: string,
    destino: string,
    originLatitude: number,
    originLongitude: number,
  ) {
    setLoading(true);

    try {
      if (
        !isValidCoordinate(
          originLatitude,
          originLongitude,
        )
      ) {
        throw new Error(
          'Localização GPS ainda não disponível.',
        );
      }

      const originCoordinate:
        Coordinate = {
        latitude:
          originLatitude,

        longitude:
          originLongitude,
      };

      let destinationCoordinate:
        Coordinate;

      if (selectedDestination) {
        destinationCoordinate =
          selectedDestination.coordinate;
      } else {
        const results =
          await searchGooglePlaces(
            destino,
            originLatitude,
            originLongitude,
          );

        if (
          results.length === 0
        ) {
          throw new Error(
            'Destino não encontrado.',
          );
        }

        const place =
          await getGooglePlaceCoordinate(
            results[0].placeId,
          );

        destinationCoordinate = {
          latitude:
            place.latitude,

          longitude:
            place.longitude,
        };

        setSelectedDestination({
          placeId:
            results[0].placeId,

          displayName:
            place.displayName ||
            results[0].displayName,

          coordinate:
            destinationCoordinate,
        });
      }

      setOrigin(
        originCoordinate,
      );

      setDestination(
        destinationCoordinate,
      );

      let routeDistance: number;
      let routeDuration: number;

      let routeStaticDuration:
        number | undefined;

      let routeTrafficIndex:
        number | undefined;

      let routeTrafficDelayMinutes:
        number | undefined;

      let carCoordinates:
        Coordinate[];

      try {
        const googleRoute =
          await calculateGoogleRoute(
            originCoordinate.latitude,
            originCoordinate.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
            'DRIVE',
          );

        routeDistance =
          googleRoute.distance;

        routeDuration =
          googleRoute.duration;

        routeStaticDuration =
  googleRoute.staticDuration;

routeTrafficIndex =
  googleRoute.trafficIndex;

routeTrafficDelayMinutes =
  googleRoute.trafficDelayMinutes;

console.log(
  '🚦 CORRIDAX TRAFFIC',
  {
    distanceKm:
      googleRoute.distance,

    durationMinutes:
      googleRoute.duration,

    staticDurationMinutes:
      googleRoute.staticDuration,

    trafficIndex:
      googleRoute.trafficIndex,

    trafficDelayMinutes:
      googleRoute.trafficDelayMinutes,
  },
);

carCoordinates =
  googleRoute.coordinates;

        carCoordinates =
          googleRoute.coordinates;

        if (
          carCoordinates.length === 0
        ) {
          const osrmGeometry =
            await calculateRoute(
              originCoordinate.latitude,
              originCoordinate.longitude,
              destinationCoordinate.latitude,
              destinationCoordinate.longitude,
            );

          carCoordinates =
            osrmGeometry.coordinates;
        }
      } catch (googleError) {
        console.warn(
          'Google Routes indisponível. Usando OSRM.',
          googleError,
        );

        const osrmRoute =
          await calculateRoute(
            originCoordinate.latitude,
            originCoordinate.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
          );

        routeDistance =
          osrmRoute.distance;

        routeDuration =
          osrmRoute.duration;

        routeStaticDuration =
          undefined;

        routeTrafficIndex =
          undefined;

        routeTrafficDelayMinutes =
          undefined;

        carCoordinates =
          osrmRoute.coordinates;
      }

      if (
        selectedMobilityMode ===
        'car'
      ) {
        setRouteCoordinates(
          carCoordinates,
        );

        setRouteInfo({
          distance:
            routeDistance,

          duration:
            routeDuration,

          staticDuration:
            routeStaticDuration,

          trafficIndex:
            routeTrafficIndex,

          trafficDelayMinutes:
            routeTrafficDelayMinutes,
        });
      }

      let options =
        mobilityOptions;

      if (
        options.length === 0
      ) {
        options =
          await calculateMobilityOptions(
            originCoordinate,
            destinationCoordinate,
          );
      }

      /*
       * Caso a opção de carro tenha sido
       * recalculada nas modalidades,
       * usamos também os dados mais recentes
       * dessa rota como referência.
       */
      const carOption =
        options.find(
          (option) =>
            option.id === 'car',
        );

      if (carOption) {
        routeDistance =
          carOption.distance;

        routeDuration =
          carOption.duration;

        routeStaticDuration =
          carOption.staticDuration;

        routeTrafficIndex =
          carOption.trafficIndex;

        routeTrafficDelayMinutes =
          carOption.trafficDelayMinutes;

        if (
          carOption.coordinates.length >=
          2
        ) {
          carCoordinates =
            carOption.coordinates;
        }
      }

      if (
        selectedMobilityMode ===
        'car'
      ) {
        setRouteCoordinates(
          carCoordinates,
        );

        setRouteInfo({
          distance:
            routeDistance,

          duration:
            routeDuration,

          staticDuration:
            routeStaticDuration,

          trafficIndex:
            routeTrafficIndex,

          trafficDelayMinutes:
            routeTrafficDelayMinutes,
        });
      }

      if (
        selectedMobilityMode !==
        'car'
      ) {
        const selectedOption =
          options.find(
            (option) =>
              option.id ===
              selectedMobilityMode,
          );

        if (selectedOption) {
          setRouteInfo({
            distance:
              selectedOption.distance,

            duration:
              selectedOption.duration,

            staticDuration:
              selectedOption.staticDuration,

            trafficIndex:
              selectedOption.trafficIndex,

            trafficDelayMinutes:
              selectedOption.trafficDelayMinutes,
          });

          if (
            selectedOption.coordinates.length >=
            2
          ) {
            setRouteCoordinates(
              selectedOption.coordinates,
            );
          }
        }
      }

      /*
       * PREÇOS DE CORRIDA
       *
       * Uber, 99 e inDrive utilizam
       * a rota de carro como referência.
       *
       * Agora também repassamos:
       *
       * - staticDuration
       * - trafficIndex
       * - trafficDelayMinutes
       *
       * Se o Google não fornecer esses
       * dados, todos permanecem opcionais
       * e o motor usa o fallback legado.
       */
      const resultado =
        await compareRides(
          routeDistance,
          routeDuration,
          comparisonMode,
          {
            staticDuration:
              routeStaticDuration,

            trafficIndex:
              routeTrafficIndex,

            trafficDelayMinutes:
              routeTrafficDelayMinutes,
          },
        );

      setRides(
        resultado,
      );

      const comparisonResult = {
        distance:
          routeDistance,

        duration:
          routeDuration,

        rides:
          resultado,
      };

      try {
        const comparison =
          await compareRouteEngines(
            originCoordinate,
            destinationCoordinate,
          );

        setRouteComparison(
          comparison,
        );
      } catch (error) {
        console.warn(
          'Falha no diagnóstico Google × OSRM:',
          error,
        );

        setRouteComparison(
          null,
        );
      }

      return comparisonResult;
    } finally {
      setLoading(false);
    }
  }

  return {
    rides,

    loading,

    compare,

    suggestions,

    search,

    setSuggestions,

    selectDestination,

    selectSavedDestination,

    clearSelectedDestination,

    selectedDestination,

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

    routeComparison,
  };
}