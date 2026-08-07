import {
  ProviderPriceId,
} from './priceEstimator';

export type PriceCalibrationInput = {
  provider: ProviderPriceId;

  distanceKm: number;

  durationMinutes: number;

  estimatedPrice: number;

  observedPrice: number;

  promotionalPrice?: number;
};

export type PriceCalibrationResult = {
  provider: ProviderPriceId;

  distanceKm: number;

  durationMinutes: number;

  estimatedPrice: number;

  observedPrice: number;

  promotionalPrice?: number;

  absoluteError: number;

  percentageError: number;

  direction:
    | 'above'
    | 'below'
    | 'exact';

  recordedAt: string;
};

function roundCurrency(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

function roundPercentage(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

export function calculatePriceCalibration(
  input: PriceCalibrationInput,
): PriceCalibrationResult {
  const {
    provider,
    distanceKm,
    durationMinutes,
    estimatedPrice,
    observedPrice,
    promotionalPrice,
  } = input;

  if (observedPrice <= 0) {
    throw new Error(
      'O preço observado deve ser maior que zero.',
    );
  }

  if (estimatedPrice < 0) {
    throw new Error(
      'A estimativa não pode ser negativa.',
    );
  }

  const difference =
    estimatedPrice -
    observedPrice;

  const absoluteError =
    roundCurrency(
      Math.abs(difference),
    );

  const percentageError =
    roundPercentage(
      (
        Math.abs(difference) /
        observedPrice
      ) * 100,
    );

  let direction:
    PriceCalibrationResult['direction'];

  if (difference > 0) {
    direction = 'above';
  } else if (difference < 0) {
    direction = 'below';
  } else {
    direction = 'exact';
  }

  return {
    provider,

    distanceKm:
      Number(
        distanceKm.toFixed(1),
      ),

    durationMinutes:
      Math.round(
        durationMinutes,
      ),

    estimatedPrice:
      roundCurrency(
        estimatedPrice,
      ),

    observedPrice:
      roundCurrency(
        observedPrice,
      ),

    promotionalPrice:
      promotionalPrice !== undefined
        ? roundCurrency(
            promotionalPrice,
          )
        : undefined,

    absoluteError,

    percentageError,

    direction,

    recordedAt:
      new Date().toISOString(),
  };
}