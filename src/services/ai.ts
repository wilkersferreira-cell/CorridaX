import { RideOption } from './comparison';

export type Recommendation = {
  melhor: RideOption;
  motivo: string;
};

export function chooseBestRide(
  rides: RideOption[],
): Recommendation {

  if (rides.length === 0) {
    throw new Error(
      'Nenhuma corrida disponível.',
    );
  }

  const melhor = rides.reduce(
    (anterior, atual) =>
      atual.score > anterior.score
        ? atual
        : anterior,
  );

  let motivo = '';

  if (melhor.economia > 0) {

    motivo =
      `A IA do CorridaX recomenda ${melhor.nome} porque oferece o melhor equilíbrio entre preço e tempo. Você economiza R$ ${melhor.economia.toFixed(
        2,
      )} em relação à opção mais cara.`;

  } else {

    motivo =
      `A IA do CorridaX recomenda ${melhor.nome} por apresentar o melhor desempenho nesta comparação.`;

  }

  return {
    melhor,
    motivo,
  };
}