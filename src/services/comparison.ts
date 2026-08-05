export interface RideOption {
  id: string;
  nome: string;
  preco: number;
  tempo: number;
  destaque?: boolean;
}

export function compareRides(
  distance: number,
  duration: number,
): RideOption[] {

  const uber = Number((5 + distance * 2.2).toFixed(2));

  const app99 = Number((4 + distance * 2.0).toFixed(2));

  const inDrive = Number((4.5 + distance * 2.1).toFixed(2));

  return [
    {
      id: '99',
      nome: '99',
      preco: app99,
      tempo: Math.round(duration),
      destaque: true,
    },

    {
      id: 'uber',
      nome: 'Uber',
      preco: uber,
      tempo: Math.round(duration + 2),
    },

    {
      id: 'indrive',
      nome: 'inDrive',
      preco: inDrive,
      tempo: Math.round(duration + 3),
    },
  ];
}