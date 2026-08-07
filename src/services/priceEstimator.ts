export type ProviderPriceId =
  | 'uber'
  | '99'
  | 'indrive';

export type PriceEstimateInput = {
  provider: ProviderPriceId;
  distanceKm: number;
  durationMinutes: number;
};

type PriceModel = {
  baseFare: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
};

/*
 * MODELO DE PREÇO CORRIDAX v1
 *
 * Estes valores NÃO representam
 * tarifas oficiais das plataformas.
 *
 * São parâmetros internos do modelo
 * de estimativa do CorridaX e serão
 * calibrados progressivamente com
 * observações reais.
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
  },

  uber: {
    baseFare: 4,
    pricePerKm: 1.75,
    pricePerMinute: 0.32,
    minimumFare: 9,
  },

  indrive: {
    baseFare: 3.75,
    pricePerKm: 1.7,
    pricePerMinute: 0.3,
    minimumFare: 8.5,
  },
};

function roundCurrency(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

export function estimateRidePrice({
  provider,
  distanceKm,
  durationMinutes,
}: PriceEstimateInput): number {
  const model =
    PRICE_MODELS[provider];

  const safeDistance =
    Math.max(0, distanceKm);

  const safeDuration =
    Math.max(0, durationMinutes);

  const calculatedPrice =
    model.baseFare +
    safeDistance *
      model.pricePerKm +
    safeDuration *
      model.pricePerMinute;

  const finalPrice =
    Math.max(
      model.minimumFare,
      calculatedPrice,
    );

  return roundCurrency(
    finalPrice,
  );
}