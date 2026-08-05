import { useState } from 'react';

import { searchAddress, SearchResult } from '../api/geocoding';
import { calculateRoute } from '../api/routes';
import {
  compareRides,
  RideOption,
} from '../services/comparison';

export default function useRideComparison() {
  const [loading, setLoading] = useState(false);

  const [rides, setRides] = useState<RideOption[]>([]);

  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);

  async function search(query: string) {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await searchAddress(query);

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
        throw new Error('Endereço não encontrado');
      }

      const route =
        await calculateRoute(
          Number(origemBusca[0].lat),
          Number(origemBusca[0].lon),
          Number(destinoBusca[0].lat),
          Number(destinoBusca[0].lon),
        );

      const resultado =
        compareRides(
          route.distance,
          route.duration,
        );

      setRides(resultado);

      return resultado;

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
  };
}