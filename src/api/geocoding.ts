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
    `https://photon.komoot.io/api/?q=${encodeURIComponent(
      query,
    )}&limit=5`,
  );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`,
    );
  }

  const data = await response.json();

  return data.features.map((item: any) => ({

    display_name: [
      item.properties.name,
      item.properties.city,
      item.properties.state,
    ]
      .filter(Boolean)
      .join(', '),

    lat: String(item.geometry.coordinates[1]),

    lon: String(item.geometry.coordinates[0]),

  }));
}