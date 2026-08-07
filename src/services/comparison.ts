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
  const safeDistance =
    Math.max(0, distance);

  const safeDuration =
    Math.max(1, duration);

  const weights =
    WEIGHTS[mode];

  /*
   * DADOS SIMULADOS DE DESENVOLVIMENTO
   *
   * O objetivo desta simulação é criar
   * um trade-off real entre preço e tempo.
   *
   * 99:
   * tendência de menor preço
   *
   * Uber:
   * tendência de menor tempo
   *
   * inDrive:
   * posição intermediária
   *
   * Futuramente estes valores serão
   * substituídos por dados reais.
   */

  const uber = Number(
    (
      6 +
      safeDistance * 2.1
    ).toFixed(2),
  );

  const app99 = Number(
    (
      4 +
      safeDistance * 2.0
    ).toFixed(2),
  );

  const inDrive = Number(
    (
      5 +
      safeDistance * 2.05
    ).toFixed(2),
  );

  /*
   * Também simulamos diferenças de tempo.
   *
   * Uber = mais rápida
   * inDrive = intermediária
   * 99 = mais econômica
   */

  const uberTime =
    Math.max(
      1,
      Math.round(
        safeDuration - 2,
      ),
    );

  const inDriveTime =
    Math.max(
      1,
      Math.round(
        safeDuration,
      ),
    );

  const app99Time =
    Math.max(
      1,
      Math.round(
        safeDuration + 2,
      ),
    );

  const rides: RideOption[] = [
    {
      id: '99',
      nome: '99',
      preco: app99,
      tempo: app99Time,
      distancia: Number(
        safeDistance.toFixed(1),
      ),
      economia: 0,
      score: 0,
    },

    {
      id: 'uber',
      nome: 'Uber',
      preco: uber,
      tempo: uberTime,
      distancia: Number(
        safeDistance.toFixed(1),
      ),
      economia: 0,
      score: 0,
    },

    {
      id: 'indrive',
      nome: 'inDrive',
      preco: inDrive,
      tempo: inDriveTime,
      distancia: Number(
        safeDistance.toFixed(1),
      ),
      economia: 0,
      score: 0,
    },
  ];

  const prices = rides.map(
    (ride) => ride.preco,
  );

  const times = rides.map(
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
   * Economia em relação à opção
   * mais cara disponível.
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
   * BALANCED
   * 65% preço
   * 35% tempo
   *
   * ECONOMY
   * 85% preço
   * 15% tempo
   *
   * FAST
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
   * 1. Maior Score
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
   * A primeira corrida após a
   * ordenação recebe o destaque.
   */

  rides.forEach(
    (ride, index) => {
      ride.destaque =
        index === 0;
    },
  );

  return rides;
}