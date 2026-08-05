import { RideOption } from './comparison';

export type Recommendation = {
  melhor: RideOption;
  motivo: string;
};

export function chooseBestRide(
  rides: RideOption[]
): Recommendation {

  const validRides = rides.filter(
    ride => ride.preco !== null
  );

  if (validRides.length === 0) {
    throw new Error('Nenhuma corrida disponível.');
  }

  const melhor = validRides.reduce((anterior, atual) => {

    if ((atual.preco ?? 9999) < (anterior.preco ?? 9999)) {
      return atual;
    }

    return anterior;

  });

  return {
    melhor,
    motivo: 'Menor preço disponível',
  };
}