import {
  calculateRoute,
  Coordinate,
} from '../api/routes';

import {
  calculateGoogleRoute,
} from '../api/googleRoutes';

export type RouteEngineResult = {
  distance: number;
  duration: number;
};

export type RouteComparisonResult = {
  osrm: RouteEngineResult;
  google: RouteEngineResult;

  distanceDifferenceKm: number;
  distanceDifferencePercent: number;

  durationDifferenceMinutes: number;
  durationDifferencePercent: number;
};

function round(
  value: number,
  decimals = 2,
): number {
  return Number(
    value.toFixed(decimals),
  );
}

function percentageDifference(
  googleValue: number,
  osrmValue: number,
): number {
  if (osrmValue === 0) {
    return 0;
  }

  return (
    ((googleValue - osrmValue) /
      osrmValue) *
    100
  );
}

export async function compareRouteEngines(
  origin: Coordinate,
  destination: Coordinate,
): Promise<RouteComparisonResult> {
  const [
    osrmRoute,
    googleRoute,
  ] = await Promise.all([
    calculateRoute(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude,
    ),

    calculateGoogleRoute(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude,
    ),
  ]);

  const distanceDifferenceKm =
    googleRoute.distance -
    osrmRoute.distance;

  const durationDifferenceMinutes =
    googleRoute.duration -
    osrmRoute.duration;

  return {
    osrm: {
      distance: round(
        osrmRoute.distance,
      ),

      duration: round(
        osrmRoute.duration,
      ),
    },

    google: {
      distance: round(
        googleRoute.distance,
      ),

      duration: round(
        googleRoute.duration,
      ),
    },

    distanceDifferenceKm:
      round(
        distanceDifferenceKm,
      ),

    distanceDifferencePercent:
      round(
        percentageDifference(
          googleRoute.distance,
          osrmRoute.distance,
        ),
      ),

    durationDifferenceMinutes:
      round(
        durationDifferenceMinutes,
      ),

    durationDifferencePercent:
      round(
        percentageDifference(
          googleRoute.duration,
          osrmRoute.duration,
        ),
      ),
  };
}