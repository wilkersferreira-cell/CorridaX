import {
  Alert,
  Linking,
  Platform,
} from 'react-native';

export type RideApp =
  | 'uber'
  | '99'
  | 'indrive';

export type RideLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type RideTrip = {
  origin?: RideLocation;
  destination?: RideLocation;
};

function getStoreUrl(
  app: RideApp,
): string {
  if (Platform.OS === 'ios') {
    switch (app) {
      case 'uber':
        return 'https://apps.apple.com/app/uber/id368677368';

      case '99':
        return 'https://apps.apple.com/app/99/id553663691';

      case 'indrive':
        return 'https://apps.apple.com/app/indrive/id780125801';
    }
  }

  switch (app) {
    case 'uber':
      return 'https://play.google.com/store/apps/details?id=com.ubercab';

    case '99':
      return 'https://play.google.com/store/apps/details?id=com.taxis99';

    case 'indrive':
      return 'https://play.google.com/store/apps/details?id=sinet.startup.inDriver';
  }
}

function buildUberUrl(
  trip?: RideTrip,
): string {
  if (
    !trip?.destination
  ) {
    return 'uber://';
  }

  const params: string[] = [
    'action=setPickup',
  ];

  if (trip.origin) {
    params.push(
      `pickup[latitude]=${encodeURIComponent(
        String(
          trip.origin.latitude,
        ),
      )}`,
    );

    params.push(
      `pickup[longitude]=${encodeURIComponent(
        String(
          trip.origin.longitude,
        ),
      )}`,
    );

    if (trip.origin.address) {
      params.push(
        `pickup[nickname]=${encodeURIComponent(
          trip.origin.address,
        )}`,
      );
    }
  } else {
    params.push(
      'pickup=my_location',
    );
  }

  params.push(
    `dropoff[latitude]=${encodeURIComponent(
      String(
        trip.destination.latitude,
      ),
    )}`,
  );

  params.push(
    `dropoff[longitude]=${encodeURIComponent(
      String(
        trip.destination.longitude,
      ),
    )}`,
  );

  if (trip.destination.address) {
    params.push(
      `dropoff[nickname]=${encodeURIComponent(
        trip.destination.address,
      )}`,
    );
  }

  return `uber://?${params.join('&')}`;
}

function getAppUrl(
  app: RideApp,
  trip?: RideTrip,
): string {
  switch (app) {
    case 'uber':
      return buildUberUrl(trip);

    case '99':
      /*
       * Ainda não enviamos origem/destino.
       * Mantemos somente a abertura do app
       * até termos integração oficialmente
       * documentada.
       */
      return '99://';

    case 'indrive':
      /*
       * Mesmo princípio da 99:
       * abertura simples e segura.
       */
      return 'indrive://';
  }
}

export async function openRideApp(
  app: RideApp,
  trip?: RideTrip,
): Promise<void> {
  try {
    const url =
      getAppUrl(
        app,
        trip,
      );

    const canOpen =
      await Linking.canOpenURL(
        url,
      );

    if (canOpen) {
      await Linking.openURL(
        url,
      );

      return;
    }

    /*
     * Caso o link parametrizado da Uber
     * não seja reconhecido, tentamos
     * abrir o aplicativo normalmente.
     */
    if (
      app === 'uber' &&
      url !== 'uber://'
    ) {
      const canOpenUber =
        await Linking.canOpenURL(
          'uber://',
        );

      if (canOpenUber) {
        await Linking.openURL(
          'uber://',
        );

        return;
      }
    }

    /*
     * Aplicativo não disponível:
     * direcionamos para a loja.
     */
    await Linking.openURL(
      getStoreUrl(app),
    );
  } catch {
    Alert.alert(
      'Erro',
      'Não foi possível abrir o aplicativo.',
    );
  }
}