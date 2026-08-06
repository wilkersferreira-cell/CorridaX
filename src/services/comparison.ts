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

export function compareRides(
  distance: number,
  duration: number,
): RideOption[] {

  const uber = Number((5 + distance * 2.2).toFixed(2));
  const app99 = Number((4 + distance * 2.0).toFixed(2));
  const inDrive = Number((4.5 + distance * 2.1).toFixed(2));

  const maiorPreco = Math.max(
    uber,
    app99,
    inDrive,
  );

  const rides: RideOption[] = [
    {
      id: '99',
      nome: '99',
      preco: app99,
      tempo: Math.round(duration),
      distancia: Number(distance.toFixed(1)),
      economia: Number((maiorPreco - app99).toFixed(2)),
      score: 0,
    },

    {
      id: 'uber',
      nome: 'Uber',
      preco: uber,
      tempo: Math.round(duration + 2),
      distancia: Number(distance.toFixed(1)),
      economia: Number((maiorPreco - uber).toFixed(2)),
      score: 0,
    },

    {
      id: 'indrive',
      nome: 'inDrive',
      preco: inDrive,
      tempo: Math.round(duration + 3),
      distancia: Number(distance.toFixed(1)),
      economia: Number((maiorPreco - inDrive).toFixed(2)),
      score: 0,
    },
  ];

  rides.forEach((ride) => {
    const precoScore = 100 - ride.preco;
    const tempoScore = 100 - ride.tempo;

    ride.score = Math.round(
      precoScore * 0.7 +
      tempoScore * 0.3,
    );
  });

  const melhor = rides.reduce((a, b) =>
    a.score > b.score ? a : b,
  );

  rides.forEach((ride) => {
    ride.destaque = ride.id === melhor.id;
  });

  return rides.sort(
    (a, b) => b.score - a.score,
  );
}