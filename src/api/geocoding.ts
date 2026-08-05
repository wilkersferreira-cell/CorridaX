import { API } from './http';

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function searchAddress(
  query: string,
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `${API.NOMINATIM}/search?format=json&limit=5&q=${encodeURIComponent(
      query,
    )}`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CorridaX',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Erro ao pesquisar endereço.');
  }

  return await response.json();
}