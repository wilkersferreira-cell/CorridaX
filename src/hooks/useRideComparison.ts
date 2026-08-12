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

  /**
   * Define a origem diretamente
   * a partir do GPS do aparelho.
   *
   * Isso permite que o mapa conheça
   * a origem antes de o usuário
   * clicar em Comparar.
   */
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

  /**
   * Pesquisa destinos utilizando
   * Google Places.
   */
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

  /**
   * Resolve o destino escolhido
   * para coordenadas exatas.
   */
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

    /*
     * O destino entra imediatamente
     * no estado do mapa.
     */
    setDestination(
      coordinate,
    );

    /*
     * Remove a rota anterior.
     * Assim o mapa mostra somente
     * origem + novo destino.
     */
    setRouteCoordinates([]);

    setRouteComparison(
      null,
    );

    setRides([]);

    setSuggestions([]);

    return {
      displayName,
      coordinate,
    };
  }

  /**
   * Quando o usuário começa a
   * digitar um novo destino,
   * invalida a seleção anterior.
   */
  function clearSelectedDestination() {
    setSelectedDestination(
      null,
    );

    setDestination(
      undefined,
    );

    setRouteCoordinates([]);

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
      /*
       * ORIGEM
       *
       * GPS real do aparelho.
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
       * Prioridade para o destino
       * escolhido na lista do Google.
       */
      let destinationCoordinate:
        Coordinate;

      if (selectedDestination) {
        destinationCoordinate =
          selectedDestination.coordinate;
      } else {
        /*
         * Caso o usuário não selecione
         * uma sugestão, pesquisamos o
         * texto informado no Google.
         */
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
       * GOOGLE ROUTES
       *
       * Motor principal.
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
         * Se o Google não fornecer
         * geometria, OSRM desenha
         * o percurso.
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
         * FALLBACK OSRM
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

      /*
       * A partir daqui o mapa recebe
       * a geometria completa da rota.
       */
      setRouteCoordinates(
        coordinates,
      );

      /*
       * MOTOR DE PREÇOS CORRIDAX
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
       * Google × OSRM.
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

    selectDestination,

    clearSelectedDestination,

    selectedDestination,

    setGpsOrigin,

    origin,

    destination,

    routeCoordinates,

    comparisonMode,

    setComparisonMode,

    routeComparison,
  };
}