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
 * MOTOR DE PREÇOS CORRIDAX v2.2
 *
 * O modelo NÃO reproduz tarifas oficiais
 * das plataformas.
 *
 * O preço de referência é calculado a partir de:
 *
 * - tarifa-base estrutural;
 * - distância;
 * - duração;
 * - tarifa mínima;
 * - faixa de distância;
 * - velocidade média / trânsito.
 *
 * A versão 2.2 incorpora calibração empírica
 * realizada com observações reais feitas em
 * 27/08/2026, comparando o CorridaX com:
 *
 * - Uber;
 * - 99;
 * - inDrive.
 *
 * Foram utilizadas três faixas:
 *
 * - curta: até 5 km;
 * - média: acima de 5 km até 15 km;
 * - longa: acima de 15 km.
 *
 * Não existe aleatoriedade.
 *
 * Os valores continuam sendo estimativas
 * próprias do CorridaX e podem divergir dos
 * preços efetivamente apresentados pelas
 * plataformas, especialmente em situações
 * de demanda dinâmica, promoções, eventos,
 * chuva ou alterações tarifárias.
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
 * CALIBRAÇÃO CORRIDAX v2.2
 *
 * Coeficientes calibrados com três
 * observações reais:
 *
 * CURTA
 * 3,3 km / 10 min
 *
 * MÉDIA
 * 8,3 km / 15 min
 *
 * LONGA
 * 25,3 km / 46 min
 *
 * Os ajustes de trânsito permanecem
 * independentes dos ajustes por distância.
 *
 * Dessa forma, novas condições de tráfego
 * ainda podem alterar a estimativa sem
 * eliminar a calibração de cada plataforma.
 */

const ROUTE_ADJUSTMENTS: Record<
  ProviderPriceId,
  RouteAdjustment
> = {
  '99': {
    distance: {
      short: -0.26,
      medium: -0.07,
      long: 0.09,
    },

    traffic: {
      slow: 0.03,
      normal: 0,
      flowing: -0.01,
    },
  },

  uber: {
    distance: {
      short: -0.20,
      medium: -0.27,
      long: -0.33,
    },

    traffic: {
      slow: 0.04,
      normal: 0,
      flowing: -0.03,
    },
  },

  indrive: {
    distance: {
      short: -0.06,
      medium: -0.28,
      long: -0.33,
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
    (
      distanceKm /
      durationMinutes
    ) *
    60;

  if (
    averageSpeedKmh <
    20
  ) {
    return 'slow';
  }

  if (
    averageSpeedKmh >
    35
  ) {
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
    (
      distanceKm *
      model.pricePerKm
    ) +
    (
      durationMinutes *
      model.pricePerMinute
    );

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

  const distanceAdjustment =
    adjustment.distance[
      distanceProfile
    ];

  const trafficAdjustment =
    adjustment.traffic[
      trafficProfile
    ];

  const multiplier =
    1 +
    distanceAdjustment +
    trafficAdjustment;

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
    PRICE_MODELS[
      provider
    ];

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