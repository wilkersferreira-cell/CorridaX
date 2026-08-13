import {
  SimulationProvider,
} from '../providers/SimulationProvider';

export interface RideOption {
  id: string;
  nome: string;
  preco: number;
  tempo: number;
  distancia: number;
  economia: number;
  score: number;
  destaque?: boolean;
}

export type ComparisonMode =
  | 'balanced'
  | 'economy'
  | 'fast';

type ComparisonWeights = {
  price: number;
  time: number;
};

const WEIGHTS: Record<
  ComparisonMode,
  ComparisonWeights
> = {
  balanced: {
    price: 0.65,
    time: 0.35,
  },

  economy: {
    price: 0.85,
    time: 0.15,
  },

  fast: {
    price: 0.25,
    time: 0.75,
  },
};

/*
 * Calcula uma nota de 0 a 100
 * comparando o valor com a
 * melhor opção disponível.
 *
 * Diferentemente da normalização
 * min/max, pequenas diferenças
 * reais produzem pequenas
 * diferenças no Score.
 */
function relativeScore(
  value: number,
  bestValue: number,
): number {
  if (
    value <= 0 ||
    bestValue <= 0
  ) {
    return 100;
  }

  return (
    bestValue /
    value *
    100
  );
}

function clampScore(
  score: number,
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score),
    ),
  );
}

export async function compareRides(
  distance: number,
  duration: number,
  mode: ComparisonMode = 'balanced',
): Promise<RideOption[]> {
  const weights =
    WEIGHTS[mode];

  /*
   * Obtém as estimativas através
   * do provider.
   *
   * Atualmente usamos o
   * SimulationProvider.
   */
  const estimates =
    await SimulationProvider.getEstimates({
      origin: {
        latitude: 0,
        longitude: 0,
      },

      destination: {
        latitude: 0,
        longitude: 0,
      },

      distance,
      duration,
    });

  /*
   * Considera somente opções
   * disponíveis.
   */
  const availableEstimates =
    estimates.filter(
      (estimate) =>
        estimate.available,
    );

  if (
    availableEstimates.length === 0
  ) {
    return [];
  }

  /*
   * Converte o formato comum
   * dos providers para RideOption.
   *
   * Quando houver uma faixa
   * de preço, usamos o ponto médio.
   */
  const rides: RideOption[] =
    availableEstimates.map(
      (estimate) => ({
        id:
          estimate.providerId,

        nome:
          estimate.providerName,

        preco: Number(
          (
            (
              estimate.price.min +
              estimate.price.max
            ) /
            2
          ).toFixed(2),
        ),

        tempo:
          estimate.tripDurationMinutes,

        distancia:
          estimate.distanceKm,

        economia: 0,

        score: 0,

        destaque: false,
      }),
    );

  const prices =
    rides.map(
      (ride) =>
        ride.preco,
    );

  const times =
    rides.map(
      (ride) =>
        ride.tempo,
    );

  const minPrice =
    Math.min(...prices);

  const maxPrice =
    Math.max(...prices);

  const minTime =
    Math.min(...times);

  /*
   * Economia absoluta em relação
   * à opção mais cara disponível.
   */
  rides.forEach((ride) => {
    ride.economia =
      Number(
        (
          maxPrice -
          ride.preco
        ).toFixed(2),
      );
  });

  /*
   * SCORE CORRIDAX v4
   *
   * O Score passa a considerar
   * a diferença REAL entre preço
   * e tempo.
   *
   * Exemplo:
   *
   * R$ 20 vs R$ 21 não deve
   * produzir 100 vs 0.
   *
   * A nota relativa preserva
   * a magnitude da diferença.
   */
  rides.forEach((ride) => {
    const priceScore =
      relativeScore(
        ride.preco,
        minPrice,
      );

    const timeScore =
      relativeScore(
        ride.tempo,
        minTime,
      );

    const finalScore =
      priceScore *
        weights.price +
      timeScore *
        weights.time;

    ride.score =
      clampScore(
        finalScore,
      );
  });

  /*
   * Ordenação:
   *
   * 1. Maior Score CorridaX
   * 2. Menor preço
   * 3. Menor tempo
   */
  rides.sort((a, b) => {
    if (
      b.score !== a.score
    ) {
      return (
        b.score -
        a.score
      );
    }

    if (
      a.preco !== b.preco
    ) {
      return (
        a.preco -
        b.preco
      );
    }

    return (
      a.tempo -
      b.tempo
    );
  });

  /*
   * A primeira opção recebe
   * o destaque principal.
   */
  rides.forEach(
    (ride, index) => {
      ride.destaque =
        index === 0;
    },
  );

  return rides;
}