import { API } from './http';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  distance: number;
  duration: number;
  coordinates: Coordinate[];
}

export async function calculateRoute(
  originLat: number,
  originLon: number,
  destinationLat: number,
  destinationLon: number,
): Promise<RouteResult> {

  const response = await fetch(
    `${API.OSRM}/route/v1/driving/${originLon},${originLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson`,
  );

  if (!response.ok) {
    throw new Error('Erro ao calcular rota.');
  }

  const data = await response.json();

  const route = data.routes[0];

  const coordinates =
    route.geometry.coordinates.map(
      (point: number[]) => ({
        latitude: point[1],
        longitude: point[0],
      }),
    );

  return {
    distance: route.distance / 1000,
    duration: route.duration / 60,
    coordinates,
  };
}