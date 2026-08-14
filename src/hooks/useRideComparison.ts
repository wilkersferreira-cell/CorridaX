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
   * NOVO
   *
   * Cada modalidade guarda
   * sua própria geometria.
   */
  coordinates: Coordinate[];
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
  ] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const [
    mobilityOptions,
    setMobilityOptions,
  ] = useState<MobilityOption[]>([]);

  const [
    loadingMobility,
    setLoadingMobility,
  ] = useState(false);

  /*
   * Modalidade atualmente
   * selecionada no CorridaX.
   *
   * Carro é o padrão.
   */
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
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      (
        latitude === 0 &&
        longitude === 0
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

  /*
   * Troca a modalidade ativa
   * e imediatamente atualiza
   * o trajeto do mapa.
   */
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
    });

    /*
     * O mapa passa a utilizar
     * a geometria específica
     * daquela modalidade.
     */
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

  async function previewRoute(
    destinationCoordinate: Coordinate,
  ) {
    if (!origin) {
      console.warn(
        'Origem ainda não disponível para pré-visualizar a rota.',
      );

      return;
    }

    try {
      let routeDistance: number;
      let routeDuration: number;

      let coordinates:
        Coordinate[];

      try {
        const googleRoute =
          await calculateGoogleRoute(
            origin.latitude,
            origin.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
            'DRIVE',
          );

        routeDistance =
          googleRoute.distance;

        routeDuration =
          googleRoute.duration;

        coordinates =
          googleRoute.coordinates;

        if (
          coordinates.length === 0
        ) {
          const osrmGeometry =
            await calculateRoute(
              origin.latitude,
              origin.longitude,
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
            origin.latitude,
            origin.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
          );

        routeDistance =
          osrmRoute.distance;

        routeDuration =
          osrmRoute.duration;

        coordinates =
          osrmRoute.coordinates;
      }

      /*
       * Carro continua sendo
       * a modalidade inicial.
       */
      setSelectedMobilityMode(
        'car',
      );

      setRouteCoordinates(
        coordinates,
      );

      setRouteInfo({
        distance:
          routeDistance,

        duration:
          routeDuration,
      });

      const options =
        await calculateMobilityOptions(
          origin,
          destinationCoordinate,
        );

      /*
       * Sincroniza a rota inicial
       * com o resultado DRIVE
       * retornado na lista.
       */
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

  async function selectDestination(
    suggestion: GooglePlaceSuggestion,
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

    await previewRoute(
      coordinate,
    );

    return {
      displayName,
      coordinate,
    };
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
        !Number.isFinite(
          originLatitude,
        ) ||
        !Number.isFinite(
          originLongitude,
        ) ||
        (
          originLatitude === 0 &&
          originLongitude === 0
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

      /*
       * IMPORTANTE
       *
       * A comparação de Uber,
       * 99 e inDrive continua
       * utilizando a rota de carro.
       *
       * Selecionar caminhada ou
       * bicicleta no mapa não
       * altera o cálculo dos apps.
       */
      let routeDistance: number;
      let routeDuration: number;

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

        carCoordinates =
          osrmRoute.coordinates;
      }

      /*
       * Só voltamos o mapa para
       * carro se carro estiver
       * selecionado.
       */
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
       * Se outro modo estiver
       * selecionado, preservamos
       * sua rota após comparar
       * os aplicativos.
       */
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

      const resultado =
        await compareRides(
          routeDistance,
          routeDuration,
          comparisonMode,
        );

      setRides(
        resultado,
      );

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

    clearSelectedDestination,

    selectedDestination,

    setGpsOrigin,

    origin,

    destination,

    routeCoordinates,

    routeInfo,

    mobilityOptions,

    loadingMobility,

    /*
     * NOVO
     */
    selectedMobilityMode,

    selectMobilityMode,

    comparisonMode,

    setComparisonMode,

    routeComparison,
  };
}