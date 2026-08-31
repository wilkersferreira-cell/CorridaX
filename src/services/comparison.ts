import {
  SimulationProvider,
} from '../providers/SimulationProvider';

export interface RideOption {
  id: string;
  nome: string;

  /*
   * Valor de referência interno.
   *
   * É o ponto médio da faixa estimada
   * e continua sendo utilizado pelo
   * CorridaX para:
   *
   * - ranking;
   * - Score;
   * - comparação;
   * - economia;
   * - recomendação.
   */
  preco: number;

  /*
   * Faixa apresentada ao usuário.
   */
  precoMin: number;
  precoMax: number;

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
   * A faixa original é preservada
   * em precoMin / precoMax.
   *
   * O ponto médio continua em
   * preco e é usado somente para
   * cálculos internos do CorridaX.
   */
  const rides: RideOption[] =
    availableEstimates.map(
      (estimate) => {
        const precoMin =
          Number(
            estimate.price.min.toFixed(
              2,
            ),
          );

        const precoMax =
          Number(
            estimate.price.max.toFixed(
              2,
            ),
          );

        const precoReferencia =
          Number(
            (
              (
                precoMin +
                precoMax
              ) /
              2
            ).toFixed(2),
          );

        return {
          id:
            estimate.providerId,

          nome:
            estimate.providerName,

          preco:
            precoReferencia,

          precoMin,

          precoMax,

          tempo:
            estimate.tripDurationMinutes,

          distancia:
            estimate.distanceKm,

          economia: 0,

          score: 0,

          destaque: false,
        };
      },
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
   *
   * Utilizamos o valor de referência
   * interno para manter uma comparação
   * consistente entre as plataformas.
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
   * O Score considera a diferença
   * real entre preço e tempo.
   *
   * O valor usado para o cálculo
   * permanece sendo o ponto médio
   * da faixa estimada.
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
   * 2. Menor preço de referência
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