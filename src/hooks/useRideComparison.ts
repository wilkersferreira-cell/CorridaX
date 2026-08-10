import {
  useState,
} from 'react';

import {
  searchAddress,
  SearchResult,
} from '../api/geocoding';

import {
  calculateRoute,
  Coordinate,
} from '../api/routes';

import {
  calculateGoogleRoute,
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

export default function useRideComparison() {
  const [loading, setLoading] =
    useState(false);

  const [rides, setRides] =
    useState<RideOption[]>([]);

  const [suggestions, setSuggestions] =
    useState<SearchResult[]>([]);

  const [origin, setOrigin] =
    useState<Coordinate | undefined>();

  const [destination, setDestination] =
    useState<Coordinate | undefined>();

  const [
    routeCoordinates,
    setRouteCoordinates,
  ] = useState<Coordinate[]>([]);

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

  async function search(
    query: string,
  ) {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const result =
        await searchAddress(query);

      setSuggestions(result);
    } catch {
      setSuggestions([]);
    }
  }

  async function compare(
    origem: string,
    destino: string,
    originLatitude: number,
    originLongitude: number,
  ) {
    setLoading(true);

    try {
      /*
       * ORIGEM
       *
       * Agora usamos diretamente
       * o GPS real do celular.
       *
       * Não pesquisamos novamente
       * o endereço da origem.
       */
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

      /*
       * DESTINO
       *
       * O destino continua sendo
       * convertido em coordenadas
       * através da busca.
       */
      const destinoBusca =
        await searchAddress(
          destino,
        );

      if (
        destinoBusca.length === 0
      ) {
        throw new Error(
          'Destino não encontrado.',
        );
      }

      const destinationCoordinate:
        Coordinate = {
        latitude: Number(
          destinoBusca[0].lat,
        ),

        longitude: Number(
          destinoBusca[0].lon,
        ),
      };

      setOrigin(
        originCoordinate,
      );

      setDestination(
        destinationCoordinate,
      );

      /*
       * GOOGLE ROUTES
       *
       * Motor principal do CorridaX.
       */
      let routeDistance: number;
      let routeDuration: number;
      let coordinates:
        Coordinate[];

      try {
        const googleRoute =
          await calculateGoogleRoute(
            originCoordinate.latitude,
            originCoordinate.longitude,
            destinationCoordinate.latitude,
            destinationCoordinate.longitude,
          );

        routeDistance =
          googleRoute.distance;

        routeDuration =
          googleRoute.duration;

        coordinates =
          googleRoute.coordinates;

        /*
         * Segurança:
         * se o Google retornar uma
         * rota sem geometria,
         * usamos OSRM para desenhar.
         */
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
        /*
         * FALLBACK
         *
         * Se Google Routes falhar,
         * CorridaX continua funcionando
         * através do OSRM.
         */
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

        coordinates =
          osrmRoute.coordinates;
      }

      setRouteCoordinates(
        coordinates,
      );

      /*
       * MOTOR DE PREÇOS CORRIDAX
       *
       * Agora recebe distância e
       * duração do Google Routes
       * sempre que disponível.
       */
      const resultado =
        await compareRides(
          routeDistance,
          routeDuration,
          comparisonMode,
        );

      setRides(
        resultado,
      );

      /*
       * DIAGNÓSTICO TEMPORÁRIO
       *
       * Mantemos Google × OSRM
       * para continuar avaliando
       * os dois motores.
       *
       * Falha aqui NÃO interrompe
       * a comparação principal.
       */
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

    origin,

    destination,

    routeCoordinates,

    comparisonMode,

    setComparisonMode,

    routeComparison,
  };
}