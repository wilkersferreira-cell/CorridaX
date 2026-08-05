export type RideOption = {
  id: string;
  nome: string;
  preco: number | null;
  tempo: number | null;
  destaque?: boolean;
};

export async function compareRides(): Promise<RideOption[]> {
  // Simulação (MVP)
  return [
    {
      id: '99',
      nome: '99',
      preco: 18.4,
      tempo: 11,
      destaque: true,
    },
    {
      id: 'uber',
      nome: 'Uber',
      preco: 20.8,
      tempo: 13,
    },
    {
      id: 'indrive',
      nome: 'inDrive',
      preco: null,
      tempo: null,
    },
  ];
}