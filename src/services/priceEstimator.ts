export type ProviderPriceId =
  | 'uber'
  | '99'
  | 'indrive';

export type PriceEstimateInput = {
  provider: ProviderPriceId;

  distanceKm: number;

  /*
   * Duração atual da rota.
   *
   * Quando fornecida pelo Google Routes,
   * já considera as condições atuais
   * de trânsito.
   */
  durationMinutes: number;

  /*
   * Duração-base da rota,
   * sem considerar o trânsito atual.
   *
   * Quando disponível, é usada como
   * referência estrutural do preço.
   */
  staticDurationMinutes?: number;

  /*
   * Relação entre duração atual
   * e duração-base:
   *
   * trafficIndex =
   * duration / staticDuration
   *
   * Exemplo:
   *
   * 1.00 = sem impacto relevante
   * 1.10 = aproximadamente +10% no tempo
   * 1.30 = aproximadamente +30% no tempo
   */
  trafficIndex?: number;

  /*
   * Minutos adicionais provocados
   * pelas condições atuais da rota.
   *
   * Mantido para diagnóstico,
   * armazenamento e futuras versões.
   */
  trafficDelayMinutes?: number;
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

  /*
   * Correção global específica
   * de cada plataforma.
   */
  marketCalibrationFactor: number;

  /*
   * Intensidade com que o trânsito
   * altera o preço estimado.
   *
   * 0.30 significa que aproximadamente
   * 30% do impacto percentual observado
   * no tempo da rota será refletido
   * no preço.
   */
  trafficSensitivity: number;

  lowerVariation: number;

  upperVariation: number;
};

type DistanceProfile =
  | 'short'
  | 'medium'
  | 'long';

type RouteAdjustment = {
  distance: Record<
    DistanceProfile,
    number
  >;
};

/*
 * MOTOR DE PREÇOS CORRIDAX v2.6
 *
 * PRINCIPAL EVOLUÇÃO:
 *
 * O trânsito deixa de ser dividido
 * apenas em:
 *
 * - flowing
 * - normal
 * - slow
 *
 * Agora o trafficIndex é utilizado
 * continuamente.
 *
 * EXEMPLOS COM SENSIBILIDADE 0.30:
 *
 * trafficIndex 1.05
 * impacto no preço ≈ +1,5%
 *
 * trafficIndex 1.12
 * impacto no preço ≈ +3,6%
 *
 * trafficIndex 1.25
 * impacto no preço ≈ +7,5%
 *
 * trafficIndex 1.40
 * impacto no preço ≈ +12%
 *
 * LIMITES DE SEGURANÇA:
 *
 * mínimo: -3%
 * máximo: +12%
 *
 * Isso impede que um dado extremo
 * de trânsito distorça excessivamente
 * a estimativa.
 *
 * Quando staticDurationMinutes existe,
 * ela é usada no componente estrutural
 * de tempo.
 *
 * Dessa forma, evitamos utilizar
 * durationMinutes com trânsito e,
 * posteriormente, cobrar novamente
 * todo o impacto do trânsito.
 *
 * O CorridaX continua produzindo
 * estimativas próprias.
 *
 * Não reproduz tarifas oficiais
 * das plataformas.
 *
 * Não existe aleatoriedade.
 */

const MIN_TRAFFIC_ADJUSTMENT =
  -0.03;

const MAX_TRAFFIC_ADJUSTMENT =
  0.12;

const PRICE_MODELS: Record<
  ProviderPriceId,
  PriceModel
> = {
  '99': {
    baseFare: 3.5,

    pricePerKm: 1.65,

    pricePerMinute: 0.28,

    minimumFare: 8,

    /*
     * Calibração definida após
     * os testes reais realizados.
     */
    marketCalibrationFactor:
      0.70,

    trafficSensitivity:
      0.30,

    lowerVariation:
      0.02,

    upperVariation:
      0.02,
  },

  uber: {
    baseFare: 4,

    pricePerKm: 1.75,

    pricePerMinute: 0.32,

    minimumFare: 9,

    marketCalibrationFactor:
      1.18,

    trafficSensitivity:
      0.30,

    lowerVariation:
      0.02,

    upperVariation:
      0.02,
  },

  indrive: {
    baseFare: 3.75,

    pricePerKm: 1.70,

    pricePerMinute: 0.30,

    minimumFare: 8.5,

    marketCalibrationFactor:
      1.11,

    trafficSensitivity:
      0.30,

    lowerVariation:
      0.02,

    upperVariation:
      0.02,
  },
};

/*
 * AJUSTES POR DISTÂNCIA
 *
 * Permanecem separados da
 * calibração global e do trânsito.
 */

const ROUTE_ADJUSTMENTS: Record<
  ProviderPriceId,
  RouteAdjustment
> = {
  '99': {
    distance: {
      short:
        -0.26,

      medium:
        -0.07,

      long:
        0.09,
    },
  },

  uber: {
    distance: {
      short:
        -0.20,

      medium:
        -0.27,

      long:
        -0.33,
    },
  },

  indrive: {
    distance: {
      short:
        -0.06,

      medium:
        -0.28,

      long:
        -0.33,
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

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value,
    ),
  );
}

function getDistanceProfile(
  distanceKm: number,
): DistanceProfile {
  if (
    distanceKm <= 5
  ) {
    return 'short';
  }

  if (
    distanceKm <= 15
  ) {
    return 'medium';
  }

  return 'long';
}

/*
 * Valida a duração-base.
 */

function getSafeStaticDuration(
  staticDurationMinutes?:
    number,
): number | undefined {
  if (
    staticDurationMinutes ===
      undefined ||
    !Number.isFinite(
      staticDurationMinutes,
    ) ||
    staticDurationMinutes <= 0
  ) {
    return undefined;
  }

  return staticDurationMinutes;
}

/*
 * Determina o índice real
 * de trânsito.
 *
 * PRIORIDADE:
 *
 * 1. trafficIndex fornecido
 *    pelo Google Routes.
 *
 * 2. cálculo através de:
 *
 *    duration /
 *    staticDuration
 *
 * 3. ausência de índice.
 */

function getEffectiveTrafficIndex(
  durationMinutes: number,
  staticDurationMinutes?:
    number,
  trafficIndex?: number,
): number | undefined {
  if (
    trafficIndex !== undefined &&
    Number.isFinite(
      trafficIndex,
    ) &&
    trafficIndex > 0
  ) {
    return trafficIndex;
  }

  const safeStaticDuration =
    getSafeStaticDuration(
      staticDurationMinutes,
    );

  if (
    safeStaticDuration ===
      undefined ||
    durationMinutes <= 0
  ) {
    return undefined;
  }

  return (
    durationMinutes /
    safeStaticDuration
  );
}

/*
 * IMPACTO CONTÍNUO DO TRÂNSITO
 *
 * Ao invés de categorias fixas,
 * utilizamos diretamente a intensidade
 * do trafficIndex.
 *
 * Fórmula:
 *
 * (trafficIndex - 1)
 * × trafficSensitivity
 *
 * Depois aplicamos os limites:
 *
 * -3% até +12%
 */

function calculateTrafficAdjustment(
  trafficIndex: number | undefined,
  trafficSensitivity: number,
): number {
  if (
    trafficIndex === undefined ||
    !Number.isFinite(
      trafficIndex,
    ) ||
    trafficIndex <= 0
  ) {
    return 0;
  }

  const rawAdjustment =
    (
      trafficIndex -
      1
    ) *
    trafficSensitivity;

  return clamp(
    rawAdjustment,
    MIN_TRAFFIC_ADJUSTMENT,
    MAX_TRAFFIC_ADJUSTMENT,
  );
}

/*
 * PREÇO ESTRUTURAL
 *
 * Base +
 * distância +
 * tempo-base.
 */

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

/*
 * AJUSTE POR PERFIL
 * DE DISTÂNCIA.
 */

function applyDistanceAdjustment(
  provider: ProviderPriceId,
  structuralPrice: number,
  distanceKm: number,
  minimumFare: number,
): number {
  const distanceProfile =
    getDistanceProfile(
      distanceKm,
    );

  const adjustment =
    ROUTE_ADJUSTMENTS[
      provider
    ];

  const distanceAdjustment =
    adjustment.distance[
      distanceProfile
    ];

  const multiplier =
    1 +
    distanceAdjustment;

  return Math.max(
    minimumFare,
    structuralPrice *
      multiplier,
  );
}

/*
 * CALIBRAÇÃO GLOBAL
 * DA PLATAFORMA.
 */

function applyMarketCalibration(
  model: PriceModel,
  price: number,
): number {
  const calibratedPrice =
    price *
    model.marketCalibrationFactor;

  return Math.max(
    model.minimumFare,
    calibratedPrice,
  );
}

/*
 * APLICAÇÃO DO TRÂNSITO REAL.
 */

function applyTrafficAdjustment(
  model: PriceModel,
  price: number,
  trafficIndex:
    number | undefined,
): number {
  const trafficAdjustment =
    calculateTrafficAdjustment(
      trafficIndex,
      model.trafficSensitivity,
    );

  const multiplier =
    1 +
    trafficAdjustment;

  return Math.max(
    model.minimumFare,
    price *
      multiplier,
  );
}

export function estimateRidePriceRange({
  provider,
  distanceKm,
  durationMinutes,
  staticDurationMinutes,
  trafficIndex,
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

  const safeCurrentDuration =
    Math.max(
      0,
      durationMinutes,
    );

  const safeStaticDuration =
    getSafeStaticDuration(
      staticDurationMinutes,
    );

  /*
   * Quando temos duração-base
   * do Google Routes, ela passa
   * a ser usada na estrutura.
   *
   * Caso contrário, utilizamos
   * a duração atual como fallback.
   */
  const structuralDuration =
    safeStaticDuration ??
    safeCurrentDuration;

  /*
   * Índice efetivamente utilizado
   * para representar o trânsito.
   */
  const effectiveTrafficIndex =
    getEffectiveTrafficIndex(
      safeCurrentDuration,
      safeStaticDuration,
      trafficIndex,
    );

  /*
   * ETAPA 1
   *
   * Estrutura básica:
   *
   * base +
   * distância +
   * tempo-base.
   */
  const structuralPrice =
    calculateStructuralPrice(
      model,
      safeDistance,
      structuralDuration,
    );

  /*
   * ETAPA 2
   *
   * Ajuste por perfil
   * de distância.
   */
  const distanceAdjustedPrice =
    applyDistanceAdjustment(
      provider,
      structuralPrice,
      safeDistance,
      model.minimumFare,
    );

  /*
   * ETAPA 3
   *
   * Calibração global
   * específica da plataforma.
   */
  const marketCalibratedPrice =
    applyMarketCalibration(
      model,
      distanceAdjustedPrice,
    );

  /*
   * ETAPA 4
   *
   * Impacto contínuo
   * do trânsito atual.
   */
  const reference =
    applyTrafficAdjustment(
      model,
      marketCalibratedPrice,
      effectiveTrafficIndex,
    );

  /*
   * ETAPA 5
   *
   * Faixa CorridaX.
   */
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
 * Compatibilidade com partes
 * antigas do CorridaX que ainda
 * esperem um único valor.
 */

export function estimateRidePrice(
  input: PriceEstimateInput,
): number {
  return estimateRidePriceRange(
    input,
  ).reference;
}