import { RideOption } from './comparison';

export type Recommendation = {
  melhor: RideOption;
  maisBarata: RideOption;
  maisRapida: RideOption;
  motivo: string;
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function getCheapestRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce((current, ride) =>
    ride.preco < current.preco
      ? ride
      : current,
  );
}

function getFastestRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce((current, ride) =>
    ride.tempo < current.tempo
      ? ride
      : current,
  );
}

function getMostExpensiveRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce((current, ride) =>
    ride.preco > current.preco
      ? ride
      : current,
  );
}

function getBestRide(
  rides: RideOption[],
): RideOption {
  return rides.reduce((current, ride) => {
    if (ride.score > current.score) {
      return ride;
    }

    if (
      ride.score === current.score &&
      ride.preco < current.preco
    ) {
      return ride;
    }

    if (
      ride.score === current.score &&
      ride.preco === current.preco &&
      ride.tempo < current.tempo
    ) {
      return ride;
    }

    return current;
  });
}

function buildReason(
  melhor: RideOption,
  maisBarata: RideOption,
  maisRapida: RideOption,
  maisCara: RideOption,
): string {
  const isCheapest =
    melhor.id === maisBarata.id;

  const isFastest =
    melhor.id === maisRapida.id;

  const saving = Number(
    (
      maisCara.preco -
      melhor.preco
    ).toFixed(2),
  );

  if (isCheapest && isFastest) {
    return (
      `${melhor.nome} é a melhor escolha nesta viagem. ` +
      `Além de ser a opção mais barata, também apresenta ` +
      `o menor tempo estimado. Custa ` +
      `${formatCurrency(melhor.preco)}, leva cerca de ` +
      `${melhor.tempo} min e economiza até ` +
      `${formatCurrency(saving)} em relação à opção mais cara.`
    );
  }

  if (isCheapest) {
    const timeDifference =
      melhor.tempo - maisRapida.tempo;

    return (
      `${melhor.nome} oferece o melhor custo-benefício e ` +
      `também é a opção mais barata, por ` +
      `${formatCurrency(melhor.preco)}. ` +
      `A economia chega a ${formatCurrency(saving)}. ` +
      `A opção mais rápida pode chegar cerca de ` +
      `${timeDifference} min antes.`
    );
  }

  if (isFastest) {
    const priceDifference = Number(
      (
        melhor.preco -
        maisBarata.preco
      ).toFixed(2),
    );

    return (
      `${melhor.nome} oferece o melhor custo-benefício e ` +
      `também é a opção mais rápida, com cerca de ` +
      `${melhor.tempo} min. Ela custa ` +
      `${formatCurrency(priceDifference)} a mais que a ` +
      `opção mais barata e recebeu Score CorridaX ` +
      `${melhor.score}.`
    );
  }

  return (
    `${melhor.nome} apresenta o melhor equilíbrio entre ` +
    `preço e tempo, com Score CorridaX ${melhor.score}. ` +
    `Custa ${formatCurrency(melhor.preco)} e tem tempo ` +
    `estimado de ${melhor.tempo} min.`
  );
}

export function chooseBestRide(
  rides: RideOption[],
): Recommendation {
  if (rides.length === 0) {
    throw new Error(
      'Nenhuma corrida disponível.',
    );
  }

  const melhor = getBestRide(rides);

  const maisBarata =
    getCheapestRide(rides);

  const maisRapida =
    getFastestRide(rides);

  const maisCara =
    getMostExpensiveRide(rides);

  const motivo = buildReason(
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