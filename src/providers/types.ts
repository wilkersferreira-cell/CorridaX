export type RideProviderId =
  | 'uber'
  | '99'
  | 'indrive'
  | 'simulation';

export type RideCategory =
  | 'economy'
  | 'standard'
  | 'premium'
  | 'other';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type RideRequest = {
  origin: Coordinate;
  destination: Coordinate;

  distance: number;
  duration: number;
};

export type RideEstimate = {
  id: string;

  providerId: RideProviderId;

  providerName: string;

  category: RideCategory;

  productName: string;

  price: {
    min: number;
    max: number;
    currency: 'BRL';
  };

  pickupTimeMinutes: number;

  tripDurationMinutes: number;

  distanceKm: number;

  available: boolean;

  source: 'simulation' | 'api';

  fetchedAt: string;
};

export interface RideProvider {
  id: RideProviderId;

  name: string;

  getEstimates(
    request: RideRequest,
  ): Promise<RideEstimate[]>;
}