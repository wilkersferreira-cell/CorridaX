import {
  RideEstimate,
  RideProvider,
  RideRequest,
} from './types';

function roundPrice(value: number): number {
  return Number(value.toFixed(2));
}

function roundDistance(value: number): number {
  return Number(value.toFixed(1));
}

export const SimulationProvider: RideProvider = {
  id: 'simulation',

  name: 'CorridaX Simulation',

  async getEstimates(
    request: RideRequest,
  ): Promise<RideEstimate[]> {
    const safeDistance = Math.max(
      0,
      request.distance,
    );

    const safeDuration = Math.max(
      1,
      request.duration,
    );

    const distanceKm =
      roundDistance(safeDistance);

    const fetchedAt =
      new Date().toISOString();

    /*
     * 99
     * Mais econômica na simulação.
     */
    const app99Price = roundPrice(
      4 + safeDistance * 2.0,
    );

    /*
     * Uber
     * Mais rápida na simulação.
     */
    const uberPrice = roundPrice(
      6 + safeDistance * 2.1,
    );

    /*
     * inDrive
     * Opção intermediária.
     */
    const inDrivePrice = roundPrice(
      5 + safeDistance * 2.05,
    );

    return [
      {
        id: '99-economy',

        providerId: '99',
        providerName: '99',

        category: 'economy',
        productName: '99Pop',

        price: {
          min: app99Price,
          max: app99Price,
          currency: 'BRL',
        },

        pickupTimeMinutes: 5,

        tripDurationMinutes: Math.max(
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
          min: uberPrice,
          max: uberPrice,
          currency: 'BRL',
        },

        pickupTimeMinutes: 3,

        tripDurationMinutes: Math.max(
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
          min: inDrivePrice,
          max: inDrivePrice,
          currency: 'BRL',
        },

        pickupTimeMinutes: 4,

        tripDurationMinutes: Math.max(
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