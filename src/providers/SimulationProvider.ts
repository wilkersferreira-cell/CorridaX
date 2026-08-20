import {
  estimateRidePriceRange,
} from '../services/priceEstimator';

import {
  RideEstimate,
  RideProvider,
  RideRequest,
} from './types';

function roundDistance(
  value: number,
): number {
  return Number(
    value.toFixed(1),
  );
}

export const SimulationProvider: RideProvider = {
  id: 'simulation',

  name: 'CorridaX Simulation',

  async getEstimates(
    request: RideRequest,
  ): Promise<RideEstimate[]> {
    const safeDistance =
      Math.max(
        0,
        request.distance,
      );

    const safeDuration =
      Math.max(
        1,
        request.duration,
      );

    const distanceKm =
      roundDistance(
        safeDistance,
      );

    const fetchedAt =
      new Date().toISOString();

    /*
     * PREÇO CORRIDAX v2
     *
     * Os preços agora são calculados
     * pelo priceEstimator.
     *
     * Eles continuam sendo estimativas
     * internas e NÃO tarifas oficiais.
     */

    const app99Price =
      estimateRidePriceRange({
        provider: '99',
        distanceKm,
        durationMinutes:
          safeDuration,
      });

    const uberPrice =
      estimateRidePriceRange({
        provider: 'uber',
        distanceKm,
        durationMinutes:
          safeDuration,
      });

    const inDrivePrice =
      estimateRidePriceRange({
        provider: 'indrive',
        distanceKm,
        durationMinutes:
          safeDuration,
      });

    return [
      {
        id: '99-economy',

        providerId: '99',
        providerName: '99',

        category: 'economy',
        productName: '99Pop',

        price: {
          min:
            app99Price.min,
          max:
            app99Price.max,
          currency: 'BRL',
        },

        pickupTimeMinutes: 5,

        tripDurationMinutes:
          Math.max(
            1,
            Math.round(
              safeDuration + 2,
            ),
          ),

        distanceKm,

        available: true,

        source: 'simulation',

        fetchedAt,
      },

      {
        id: 'uber-economy',

        providerId: 'uber',
        providerName: 'Uber',

        category: 'economy',
        productName: 'UberX',

        price: {
          min:
            uberPrice.min,
          max:
            uberPrice.max,
          currency: 'BRL',
        },

        pickupTimeMinutes: 3,

        tripDurationMinutes:
          Math.max(
            1,
            Math.round(
              safeDuration - 2,
            ),
          ),

        distanceKm,

        available: true,

        source: 'simulation',

        fetchedAt,
      },

      {
        id: 'indrive-economy',

        providerId: 'indrive',
        providerName: 'inDrive',

        category: 'economy',
        productName: 'inDrive',

        price: {
          min:
            inDrivePrice.min,
          max:
            inDrivePrice.max,
          currency: 'BRL',
        },

        pickupTimeMinutes: 4,

        tripDurationMinutes:
          Math.max(
            1,
            Math.round(
              safeDuration,
            ),
          ),

        distanceKm,

        available: true,

        source: 'simulation',

        fetchedAt,
      },
    ];
  },
};