import { useState } from 'react';

import {
  searchAddress,
  SearchResult,
} from '../api/geocoding';

import {
  calculateRoute,
  Coordinate,
} from '../api/routes';

import {
  compareRides,
  ComparisonMode,
  RideOption,
} from '../services/comparison';

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
  ) {
    setLoading(true);

    try {
      const origemBusca =
        await searchAddress(origem);

      const destinoBusca =
        await searchAddress(destino);

      if (
        origemBusca.length === 0 ||
        destinoBusca.length === 0
      ) {
        throw new Error(
          'Endereço não encontrado.',
        );
      }

      const originCoordinate: Coordinate = {
        latitude: Number(
          origemBusca[0].lat,
        ),
        longitude: Number(
          origemBusca[0].lon,
        ),
      };

      const destinationCoordinate: Coordinate =
        {
          latitude: Number(
            destinoBusca[0].lat,
          ),
          longitude: Number(
            destinoBusca[0].lon,
          ),
        };

      setOrigin(originCoordinate);

      setDestination(
        destinationCoordinate,
      );

      const route =
        await calculateRoute(
          originCoordinate.latitude,
          originCoordinate.longitude,
          destinationCoordinate.latitude,
          destinationCoordinate.longitude,
        );

      setRouteCoordinates(
        route.coordinates,
      );

      const resultado =
        compareRides(
          route.distance,
          route.duration,
          comparisonMode,
        );

      setRides(resultado);
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
  };
}