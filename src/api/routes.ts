import { API } from './http';

export interface RouteResult {
  distance: number;
  duration: number;
}

export async function calculateRoute(
  originLat: number,
  originLon: number,
  destinationLat: number,
  destinationLon: number,
): Promise<RouteResult> {

  const response = await fetch(
    `${API.OSRM}/route/v1/driving/${originLon},${originLat};${destinationLon},${destinationLat}?overview=false`,
  );

  if (!response.ok) {
    throw new Error('Erro ao calcular rota.');
  }

  const data = await response.json();

  const route = data.routes[0];

  return {
    distance: route.distance / 1000,
    duration: route.duration / 60,
  };
}