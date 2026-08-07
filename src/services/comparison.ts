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

export async function compareRides(
  distance: number,
  duration: number,
  mode: ComparisonMode = 'balanced',
): Promise<RideOption[]> {
  const weights =
    WEIGHTS[mode];

  /*
   * O motor solicita as estimativas
   * através do provider.
   *
   * Hoje usamos o SimulationProvider.
   * Futuramente poderemos trocar a fonte
   * sem alterar a lógica do Score.
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
   * Consideramos somente opções
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
   * Converte o formato comum dos
   * providers para o formato utilizado
   * atualmente pelo Motor CorridaX.
   *
   * Enquanto houver faixa de preço,
   * usamos a média entre mínimo e máximo.
   */
  const rides: RideOption[] =
    availableEstimates.map(
      (estimate) => ({
        id: estimate.providerId,

        nome:
          estimate.providerName,

        preco: Number(
          (
            (estimate.price.min +
              estimate.price.max) /
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
   * Equilibrado:
   * 65% preço / 35% tempo
   *
   * Economizar:
   * 85% preço / 15% tempo
   *
   * Rápido:
   * 25% preço / 75% tempo
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