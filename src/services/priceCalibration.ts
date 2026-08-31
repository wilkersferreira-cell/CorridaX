import {
  ProviderPriceId,
} from './priceEstimator';

export type PriceCalibrationInput = {
  provider: ProviderPriceId;

  distanceKm: number;

  durationMinutes: number;

  /*
   * Valor de referência interno
   * usado pelo CorridaX.
   */
  estimatedPrice: number;

  /*
   * Faixa que foi apresentada
   * ao usuário na tela.
   */
  estimatedPriceMin?: number;

  estimatedPriceMax?: number;

  /*
   * Valor realmente encontrado
   * pelo usuário no aplicativo
   * da plataforma.
   */
  observedPrice: number;

  /*
   * Mantido por compatibilidade
   * com registros anteriores.
   */
  promotionalPrice?: number;

  /*
   * Dados da rota consultada.
   */
  origin?: string;

  destination?: string;
};

export type PriceCalibrationResult = {
  provider: ProviderPriceId;

  distanceKm: number;

  durationMinutes: number;

  estimatedPrice: number;

  estimatedPriceMin?: number;

  estimatedPriceMax?: number;

  observedPrice: number;

  promotionalPrice?: number;

  origin?: string;

  destination?: string;

  absoluteError: number;

  percentageError: number;

  direction:
    | 'above'
    | 'below'
    | 'exact';

  /*
   * Horário em que o usuário
   * informou o preço encontrado.
   */
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
    estimatedPriceMin,
    estimatedPriceMax,
    observedPrice,
    promotionalPrice,
    origin,
    destination,
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

  if (
    estimatedPriceMin !== undefined &&
    estimatedPriceMin < 0
  ) {
    throw new Error(
      'O valor mínimo estimado não pode ser negativo.',
    );
  }

  if (
    estimatedPriceMax !== undefined &&
    estimatedPriceMax < 0
  ) {
    throw new Error(
      'O valor máximo estimado não pode ser negativo.',
    );
  }

  if (
    estimatedPriceMin !== undefined &&
    estimatedPriceMax !== undefined &&
    estimatedPriceMin >
      estimatedPriceMax
  ) {
    throw new Error(
      'A faixa estimada informada é inválida.',
    );
  }

  const difference =
    estimatedPrice -
    observedPrice;

  const absoluteError =
    roundCurrency(
      Math.abs(
        difference,
      ),
    );

  const percentageError =
    roundPercentage(
      (
        Math.abs(
          difference,
        ) /
        observedPrice
      ) * 100,
    );

  let direction:
    PriceCalibrationResult['direction'];

  if (difference > 0) {
    direction = 'above';
  } else if (
    difference < 0
  ) {
    direction = 'below';
  } else {
    direction = 'exact';
  }

  return {
    provider,

    distanceKm:
      Number(
        distanceKm.toFixed(
          1,
        ),
      ),

    durationMinutes:
      Math.round(
        durationMinutes,
      ),

    estimatedPrice:
      roundCurrency(
        estimatedPrice,
      ),

    estimatedPriceMin:
      estimatedPriceMin !==
      undefined
        ? roundCurrency(
            estimatedPriceMin,
          )
        : undefined,

    estimatedPriceMax:
      estimatedPriceMax !==
      undefined
        ? roundCurrency(
            estimatedPriceMax,
          )
        : undefined,

    observedPrice:
      roundCurrency(
        observedPrice,
      ),

    promotionalPrice:
      promotionalPrice !==
      undefined
        ? roundCurrency(
            promotionalPrice,
          )
        : undefined,

    origin:
      origin?.trim() ||
      undefined,

    destination:
      destination?.trim() ||
      undefined,

    absoluteError,

    percentageError,

    direction,

    recordedAt:
      new Date().toISOString(),
  };
}