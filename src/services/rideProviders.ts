export type ProviderRideEstimate = {
  id: string;
  nome: string;
  preco: number;
  tempo: number;
  distancia: number;
};

/**
 * Camada de provedores do CorridaX.
 *
 * Neste estágio do projeto os dados ainda são simulados.
 * Futuramente esta camada poderá ser substituída ou
 * complementada por integrações reais com provedores
 * de mobilidade.
 */

function roundPrice(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

function roundDistance(
  value: number,
): number {
  return Number(
    value.toFixed(1),
  );
}

export function getRideEstimates(
  distance: number,
  duration: number,
): ProviderRideEstimate[] {
  const safeDistance =
    Math.max(0, distance);

  const safeDuration =
    Math.max(1, duration);

  /*
   * 99
   *
   * Cenário de desenvolvimento:
   * menor preço e tempo um pouco maior.
   */

  const app99Price =
    roundPrice(
      4 +
        safeDistance * 2.0,
    );

  const app99Time =
    Math.max(
      1,
      Math.round(
        safeDuration + 2,
      ),
    );

  /*
   * Uber
   *
   * Cenário de desenvolvimento:
   * preço maior e menor tempo.
   */

  const uberPrice =
    roundPrice(
      6 +
        safeDistance * 2.1,
    );

  const uberTime =
    Math.max(
      1,
      Math.round(
        safeDuration - 2,
      ),
    );

  /*
   * inDrive
   *
   * Cenário intermediário entre
   * preço e tempo.
   */

  const inDrivePrice =
    roundPrice(
      5 +
        safeDistance * 2.05,
    );

  const inDriveTime =
    Math.max(
      1,
      Math.round(
        safeDuration,
      ),
    );

  const normalizedDistance =
    roundDistance(
      safeDistance,
    );

  return [
    {
      id: '99',
      nome: '99',
      preco: app99Price,
      tempo: app99Time,
      distancia:
        normalizedDistance,
    },

    {
      id: 'uber',
      nome: 'Uber',
      preco: uberPrice,
      tempo: uberTime,
      distancia:
        normalizedDistance,
    },

    {
      id: 'indrive',
      nome: 'inDrive',
      preco: inDrivePrice,
      tempo: inDriveTime,
      distancia:
        normalizedDistance,
    },
  ];
}