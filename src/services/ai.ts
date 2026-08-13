import {
  RideOption,
} from './comparison';

export type Recommendation = {
  melhor: RideOption;
  maisBarata: RideOption;
  maisRapida: RideOption;
  motivo: string;
};

function formatCurrency(
  value: number,
): string {
  return value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  );
}

function getCheapestRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce(
    (current, ride) =>
      ride.preco <
      current.preco
        ? ride
        : current,
  );
}

function getFastestRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce(
    (current, ride) =>
      ride.tempo <
      current.tempo
        ? ride
        : current,
  );
}

function getMostExpensiveRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce(
    (current, ride) =>
      ride.preco >
      current.preco
        ? ride
        : current,
  );
}

function getBestRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce(
    (current, ride) => {
      if (
        ride.score >
        current.score
      ) {
        return ride;
      }

      if (
        ride.score ===
          current.score &&
        ride.preco <
          current.preco
      ) {
        return ride;
      }

      if (
        ride.score ===
          current.score &&
        ride.preco ===
          current.preco &&
        ride.tempo <
          current.tempo
      ) {
        return ride;
      }

      return current;
    },
  );
}

/*
 * Gera uma recomendação curta,
 * direta e adequada para a
 * interface comercial.
 *
 * Preço, tempo e aplicativo já
 * aparecem visualmente no card,
 * então evitamos repetir essas
 * informações desnecessariamente.
 */
function buildReason(
  melhor: RideOption,
  maisBarata: RideOption,
  maisRapida: RideOption,
  maisCara: RideOption,
): string {
  const isCheapest =
    melhor.id ===
    maisBarata.id;

  const isFastest =
    melhor.id ===
    maisRapida.id;

  const saving = Number(
    (
      maisCara.preco -
      melhor.preco
    ).toFixed(2),
  );

  /*
   * Melhor opção também é
   * a mais barata e rápida.
   */
  if (
    isCheapest &&
    isFastest
  ) {
    if (saving > 0) {
      return (
        `Melhor preço e menor tempo. ` +
        `Economize até ${formatCurrency(
          saving,
        )}.`
      );
    }

    return (
      'Melhor preço e menor tempo para esta viagem.'
    );
  }

  /*
   * Melhor opção é a
   * mais barata.
   */
  if (isCheapest) {
    const timeDifference =
      Math.max(
        0,
        melhor.tempo -
          maisRapida.tempo,
      );

    if (
      saving > 0 &&
      timeDifference > 0
    ) {
      return (
        `Economize até ${formatCurrency(
          saving,
        )} por apenas ` +
        `${timeDifference} min a mais.`
      );
    }

    if (saving > 0) {
      return (
        `Economize até ${formatCurrency(
          saving,
        )}.`
      );
    }

    return (
      'Melhor preço para esta viagem.'
    );
  }

  /*
   * Melhor opção é a
   * mais rápida.
   */
  if (isFastest) {
    const priceDifference =
      Number(
        (
          melhor.preco -
          maisBarata.preco
        ).toFixed(2),
      );

    if (priceDifference > 0) {
      return (
        `Chegue mais rápido por apenas ` +
        `${formatCurrency(
          priceDifference,
        )} a mais.`
      );
    }

    return (
      'Menor tempo para esta viagem.'
    );
  }

  /*
   * Melhor equilíbrio entre
   * preço e tempo.
   */
  const priceDifference =
    Number(
      (
        melhor.preco -
        maisBarata.preco
      ).toFixed(2),
    );

  const timeDifference =
    Math.max(
      0,
      melhor.tempo -
        maisRapida.tempo,
    );

  if (
    priceDifference > 0 &&
    timeDifference > 0
  ) {
    return (
      `Melhor equilíbrio entre preço e tempo. ` +
      `Apenas ${formatCurrency(
        priceDifference,
      )} acima da mais barata.`
    );
  }

  return (
    'Melhor equilíbrio entre preço e tempo.'
  );
}

export function chooseBestRide(
  rides: RideOption[],
): Recommendation {
  if (
    rides.length === 0
  ) {
    throw new Error(
      'Nenhuma corrida disponível.',
    );
  }

  const melhor =
    getBestRide(rides);

  const maisBarata =
    getCheapestRide(rides);

  const maisRapida =
    getFastestRide(rides);

  const maisCara =
    getMostExpensiveRide(
      rides,
    );

  const motivo =
    buildReason(
      melhor,
      maisBarata,
      maisRapida,
      maisCara,
    );

  return {
    melhor,
    maisBarata,
    maisRapida,
    motivo,
  };
}