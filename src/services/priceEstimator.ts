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

/*
 * MODELO DE PREÇO CORRIDAX v2
 *
 * Estes valores NÃO representam
 * tarifas oficiais das plataformas.
 *
 * O CorridaX calcula um preço de
 * referência e, a partir dele, uma
 * faixa provável de preço.
 *
 * A faixa representa incerteza de
 * mercado e será calibrada com
 * observações reais ao longo do tempo.
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
    pricePerKm: 1.7,
    pricePerMinute: 0.30,
    minimumFare: 8.5,
    lowerVariation: 0.15,
    upperVariation: 0.20,
  },
};

function roundCurrency(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

function calculateReferencePrice(
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

  const reference =
    calculateReferencePrice(
      model,
      safeDistance,
      safeDuration,
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
 * do aplicativo que ainda esperem
 * somente um valor numérico.
 */
export function estimateRidePrice(
  input: PriceEstimateInput,
): number {
  return estimateRidePriceRange(
    input,
  ).reference;
}
