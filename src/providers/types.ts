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

  /*
   * Duração-base da rota,
   * sem considerar o trânsito atual.
   *
   * Esse campo é opcional para
   * manter compatibilidade com
   * chamadas antigas.
   */
  staticDuration?: number;

  /*
   * Índice de trânsito real:
   *
   * duration / staticDuration
   *
   * Exemplos:
   * 1.00 = sem aumento relevante
   * 1.20 = cerca de 20% mais lento
   * 1.50 = cerca de 50% mais lento
   */
  trafficIndex?: number;

  /*
   * Minutos adicionais causados
   * pelas condições atuais da rota.
   */
  trafficDelayMinutes?: number;
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