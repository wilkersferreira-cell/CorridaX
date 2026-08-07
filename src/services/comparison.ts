import {
  getRideEstimates,
} from './rideProviders';

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

function normalizeInverse(
  value: number,
  min: number,
  max: number,
): number {
  if (max === min) {
    return 100;
  }

  return (
    ((max - value) /
      (max - min)) *
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

export function compareRides(
  distance: number,
  duration: number,
  mode: ComparisonMode = 'balanced',
): RideOption[] {
  const weights =
    WEIGHTS[mode];

  /*
   * As estimativas vêm da camada
   * de provedores.
   *
   * O motor CorridaX não precisa
   * saber como preços e tempos
   * foram obtidos.
   */
  const estimates =
    getRideEstimates(
      distance,
      duration,
    );

  if (estimates.length === 0) {
    return [];
  }

  /*
   * Transformamos as estimativas
   * em opções que receberão
   * economia, score e destaque.
   */
  const rides: RideOption[] =
    estimates.map((estimate) => ({
      ...estimate,
      economia: 0,
      score: 0,
      destaque: false,
    }));

  const prices =
    rides.map(
      (ride) => ride.preco,
    );

  const times =
    rides.map(
      (ride) => ride.tempo,
    );

  const minPrice =
    Math.min(...prices);

  const maxPrice =
    Math.max(...prices);

  const minTime =
    Math.min(...times);

  const maxTime =
    Math.max(...times);

  /*
   * Economia em relação à
   * opção mais cara disponível.
   */
  rides.forEach((ride) => {
    ride.economia = Number(
      (
        maxPrice -
        ride.preco
      ).toFixed(2),
    );
  });

  /*
   * SCORE CORRIDAX v3
   *
   * balanced:
   * 65% preço
   * 35% tempo
   *
   * economy:
   * 85% preço
   * 15% tempo
   *
   * fast:
   * 25% preço
   * 75% tempo
   */
  rides.forEach((ride) => {
    const priceScore =
      normalizeInverse(
        ride.preco,
        minPrice,
        maxPrice,
      );

    const timeScore =
      normalizeInverse(
        ride.tempo,
        minTime,
        maxTime,
      );

    const finalScore =
      priceScore *
        weights.price +
      timeScore *
        weights.time;

    ride.score =
      clampScore(finalScore);
  });

  /*
   * Ordenação:
   *
   * 1. Maior Score CorridaX
   * 2. Menor preço
   * 3. Menor tempo
   */
  rides.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (a.preco !== b.preco) {
      return a.preco - b.preco;
    }

    return a.tempo - b.tempo;
  });

  /*
   * A primeira opção após
   * a ordenação recebe o destaque.
   */
  rides.forEach(
    (ride, index) => {
      ride.destaque =
        index === 0;
    },
  );

  return rides;
}