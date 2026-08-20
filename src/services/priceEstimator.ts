export type ProviderPriceId =
  | 'uber'
  | '99'
  | 'indrive';

export type PriceEstimateInput = {
  provider: ProviderPriceId;
  distanceKm: number;
  durationMinutes: number;
};

export type PriceEstimateRange = {
  reference: number;
  min: number;
  max: number;
};

type PriceModel = {
  baseFare: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  lowerVariation: number;
  upperVariation: number;
};

type DistanceProfile =
  | 'short'
  | 'medium'
  | 'long';

type TrafficProfile =
  | 'slow'
  | 'normal'
  | 'flowing';

type RouteAdjustment = {
  distance: Record<
    DistanceProfile,
    number
  >;

  traffic: Record<
    TrafficProfile,
    number
  >;
};

/*
 * MOTOR DE PREÇOS CORRIDAX v2.1
 *
 * O modelo NÃO tenta reproduzir
 * tarifas oficiais das plataformas.
 *
 * Primeiro calculamos um preço
 * estrutural com distância e tempo.
 *
 * Depois aplicamos ajustes
 * determinísticos conforme:
 *
 * - distância da viagem;
 * - velocidade média da rota;
 * - sensibilidade de cada plataforma.
 *
 * Não há aleatoriedade.
 */
const PRICE_MODELS: Record<
  ProviderPriceId,
  PriceModel
> = {
  '99': {
    baseFare: 3.5,
    pricePerKm: 1.65,
    pricePerMinute: 0.28,
    minimumFare: 8,
    lowerVariation: 0.10,
    upperVariation: 0.15,
  },

  uber: {
    baseFare: 4,
    pricePerKm: 1.75,
    pricePerMinute: 0.32,
    minimumFare: 9,
    lowerVariation: 0.08,
    upperVariation: 0.18,
  },

  indrive: {
    baseFare: 3.75,
    pricePerKm: 1.70,
    pricePerMinute: 0.30,
    minimumFare: 8.5,
    lowerVariation: 0.15,
    upperVariation: 0.20,
  },
};

/*
 * Ajustes internos do CorridaX.
 *
 * A intenção é impedir que a ordem
 * de preços seja fixa em toda rota.
 *
 * Exemplo:
 * - 99 tende a ser competitiva em
 *   viagens curtas e médias;
 * - Uber ganha eficiência relativa
 *   em rotas longas/fluídas;
 * - inDrive recebe maior vantagem
 *   estrutural em viagens longas.
 *
 * Estes parâmetros serão calibrados
 * com observações reais futuras.
 */
const ROUTE_ADJUSTMENTS: Record<
  ProviderPriceId,
  RouteAdjustment
> = {
  '99': {
    distance: {
      short: -0.02,
      medium: 0,
      long: 0.01,
    },

    traffic: {
      slow: 0.03,
      normal: 0,
      flowing: -0.01,
    },
  },

  uber: {
    distance: {
      short: -0.04,
      medium: 0,
      long: -0.03,
    },

    traffic: {
      slow: 0.04,
      normal: 0,
      flowing: -0.03,
    },
  },

  indrive: {
    distance: {
      short: 0.02,
      medium: -0.01,
      long: -0.07,
    },

    traffic: {
      slow: -0.01,
      normal: 0,
      flowing: -0.02,
    },
  },
};

function roundCurrency(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

function getDistanceProfile(
  distanceKm: number,
): DistanceProfile {
  if (distanceKm <= 5) {
    return 'short';
  }

  if (distanceKm <= 15) {
    return 'medium';
  }

  return 'long';
}

function getTrafficProfile(
  distanceKm: number,
  durationMinutes: number,
): TrafficProfile {
  if (
    distanceKm <= 0 ||
    durationMinutes <= 0
  ) {
    return 'normal';
  }

  const averageSpeedKmh =
    distanceKm /
    durationMinutes *
    60;

  if (averageSpeedKmh < 20) {
    return 'slow';
  }

  if (averageSpeedKmh > 35) {
    return 'flowing';
  }

  return 'normal';
}

function calculateStructuralPrice(
  model: PriceModel,
  distanceKm: number,
  durationMinutes: number,
): number {
  const calculatedPrice =
    model.baseFare +
    distanceKm *
      model.pricePerKm +
    durationMinutes *
      model.pricePerMinute;

  return Math.max(
    model.minimumFare,
    calculatedPrice,
  );
}

function applyRouteAdjustment(
  provider: ProviderPriceId,
  structuralPrice: number,
  distanceKm: number,
  durationMinutes: number,
  minimumFare: number,
): number {
  const distanceProfile =
    getDistanceProfile(
      distanceKm,
    );

  const trafficProfile =
    getTrafficProfile(
      distanceKm,
      durationMinutes,
    );

  const adjustment =
    ROUTE_ADJUSTMENTS[
      provider
    ];

  const multiplier =
    1 +
    adjustment.distance[
      distanceProfile
    ] +
    adjustment.traffic[
      trafficProfile
    ];

  return Math.max(
    minimumFare,
    structuralPrice *
      multiplier,
  );
}

export function estimateRidePriceRange({
  provider,
  distanceKm,
  durationMinutes,
}: PriceEstimateInput): PriceEstimateRange {
  const model =
    PRICE_MODELS[provider];

  const safeDistance =
    Math.max(
      0,
      distanceKm,
    );

  const safeDuration =
    Math.max(
      0,
      durationMinutes,
    );

  const structuralPrice =
    calculateStructuralPrice(
      model,
      safeDistance,
      safeDuration,
    );

  const reference =
    applyRouteAdjustment(
      provider,
      structuralPrice,
      safeDistance,
      safeDuration,
      model.minimumFare,
    );

  const estimatedMin =
    Math.max(
      model.minimumFare,
      reference *
        (
          1 -
          model.lowerVariation
        ),
    );

  const estimatedMax =
    Math.max(
      estimatedMin,
      reference *
        (
          1 +
          model.upperVariation
        ),
    );

  return {
    reference:
      roundCurrency(
        reference,
      ),

    min:
      roundCurrency(
        estimatedMin,
      ),

    max:
      roundCurrency(
        estimatedMax,
      ),
  };
}

/*
 * Compatibilidade com partes antigas
 * que ainda esperem um único valor.
 */
export function estimateRidePrice(
  input: PriceEstimateInput,
): number {
  return estimateRidePriceRange(
    input,
  ).reference;
}
