import { Alert, Linking, Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';

export type RideApp = 'uber' | '99' | 'indrive';

export type RideLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type RideTrip = {
  origin?: RideLocation;
  destination?: RideLocation;
};

function getStoreUrl(app: RideApp): string {
  if (Platform.OS === 'android') {
    switch (app) {
      case 'uber':
        return 'market://details?id=com.ubercab';

      case '99':
        return 'market://details?id=com.taxis99';

      case 'indrive':
        return 'market://details?id=sinet.startup.inDriver';
    }
  }

  switch (app) {
    case 'uber':
      return 'https://apps.apple.com/app/uber-request-a-ride/id368677368';

    case '99':
      return 'https://apps.apple.com/app/99-corridas/id553663691';

    case 'indrive':
      return 'https://apps.apple.com/app/indrive-save-on-city-rides/id780125801';
  }
}

function buildUberUrl(trip?: RideTrip): string {
  const params: string[] = ['action=setPickup'];

  if (trip?.origin) {
    params.push(
      `pickup[latitude]=${encodeURIComponent(
        String(trip.origin.latitude)
      )}`
    );

    params.push(
      `pickup[longitude]=${encodeURIComponent(
        String(trip.origin.longitude)
      )}`
    );

    if (trip.origin.address) {
      params.push(
        `pickup[nickname]=${encodeURIComponent(
          trip.origin.address
        )}`
      );

      params.push(
        `pickup[formatted_address]=${encodeURIComponent(
          trip.origin.address
        )}`
      );
    }
  } else {
    params.push('pickup=my_location');
  }

  if (trip?.destination) {
    params.push(
      `dropoff[latitude]=${encodeURIComponent(
        String(trip.destination.latitude)
      )}`
    );

    params.push(
      `dropoff[longitude]=${encodeURIComponent(
        String(trip.destination.longitude)
      )}`
    );

    if (trip.destination.address) {
      params.push(
        `dropoff[nickname]=${encodeURIComponent(
          trip.destination.address
        )}`
      );

      params.push(
        `dropoff[formatted_address]=${encodeURIComponent(
          trip.destination.address
        )}`
      );
    }
  }

  return `uber://?${params.join('&')}`;
}

function build99Url(trip?: RideTrip): string {
  if (!trip?.origin || !trip?.destination) {
    return 'taxis99://';
  }

  const params: string[] = [
    'deep_link_product_id=316',

    `pickup_latitude=${encodeURIComponent(
      String(trip.origin.latitude)
    )}`,

    `pickup_longitude=${encodeURIComponent(
      String(trip.origin.longitude)
    )}`,

    `dropoff_latitude=${encodeURIComponent(
      String(trip.destination.latitude)
    )}`,

    `dropoff_longitude=${encodeURIComponent(
      String(trip.destination.longitude)
    )}`,
  ];

  if (trip.origin.address) {
    params.push(
      `pickup_title=${encodeURIComponent(
        trip.origin.address
      )}`
    );

    params.push(
      `pickup_formatted_address=${encodeURIComponent(
        trip.origin.address
      )}`
    );
  }

  if (trip.destination.address) {
    params.push(
      `dropoff_title=${encodeURIComponent(
        trip.destination.address
      )}`
    );

    params.push(
      `dropoff_formatted_address=${encodeURIComponent(
        trip.destination.address
      )}`
    );
  }

  return `taxis99://call?${params.join('&')}`;
}

/**
 * O inDrive instalado no Android declara suporte ao scheme geo:
 * diretamente em:
 *
 * sinet.startup.inDriver/.ui.deeplink.DeeplinkActivity
 *
 * Portanto enviamos o destino diretamente para essa Activity.
 */
function buildInDriveGeoUrl(trip?: RideTrip): string {
  if (!trip?.destination) {
    return 'indrive://open';
  }

  const latitude = trip.destination.latitude;
  const longitude = trip.destination.longitude;

  return `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
}

async function openStore(app: RideApp): Promise<void> {
  const storeUrl = getStoreUrl(app);

  try {
    await Linking.openURL(storeUrl);
  } catch (error) {
    console.error('[CORRIDAX STORE]', error);

    Alert.alert(
      'Aplicativo não encontrado',
      'Não foi possível abrir o aplicativo nem a loja.'
    );
  }
}

export async function openRideApp(
  app: RideApp,
  trip?: RideTrip
): Promise<void> {
  try {
    /*
     * UBER
     */
    if (app === 'uber') {
      const url = buildUberUrl(trip);

      console.log('[CORRIDAX UBER DEEPLINK]', url);

      await Linking.openURL(url);

      return;
    }

    /*
     * 99
     *
     * Deep link validado no Android:
     *
     * taxis99://call
     *
     * A versão atual da 99 lê:
     * pickup_latitude
     * pickup_longitude
     * pickup_title
     * pickup_formatted_address
     * dropoff_latitude
     * dropoff_longitude
     * dropoff_title
     * dropoff_formatted_address
     * deep_link_product_id
     *
     * Não utilizamos client_id fictício.
     */
    if (app === '99') {
      if (Platform.OS === 'android') {
        const url = build99Url(trip);

        console.log('[CORRIDAX 99 DEEPLINK]', url);

        try {
          await Linking.openURL(url);

          return;
        } catch (error) {
          console.warn(
            '[CORRIDAX 99] Deep link falhou. Abrindo Activity principal.',
            error
          );

          await IntentLauncher.startActivityAsync(
            'android.intent.action.MAIN',
            {
              packageName: 'com.taxis99',
              className:
                'com.didi.sdk.splash.SplashActivity',
            }
          );

          return;
        }
      }

      await Linking.openURL(build99Url(trip));

      return;
    }

    /*
     * INDRIVE
     *
     * Android:
     * envia o destino via geo: diretamente para a DeeplinkActivity
     * do inDrive, evitando o seletor Maps/Uber/Waze.
     */
    if (app === 'indrive') {
      if (Platform.OS === 'android') {
        if (!trip?.destination) {
          console.log(
            '[CORRIDAX INDRIVE] Sem destino. Abrindo aplicativo.'
          );

          await IntentLauncher.startActivityAsync(
            'android.intent.action.MAIN',
            {
              packageName: 'sinet.startup.inDriver',
              className:
                'sinet.startup.inDriver.ui.splash.SplashActivity',
            }
          );

          return;
        }

        const geoUrl = buildInDriveGeoUrl(trip);

        console.log(
          '[CORRIDAX INDRIVE GEO]',
          geoUrl
        );

        await IntentLauncher.startActivityAsync(
          'android.intent.action.VIEW',
          {
            packageName: 'sinet.startup.inDriver',
            className:
              'sinet.startup.inDriver.ui.deeplink.DeeplinkActivity',
            data: geoUrl,
          }
        );

        return;
      }

      /*
       * iOS ainda não foi validado para receber destino.
       */
      await Linking.openURL('indrive://open');

      return;
    }
  } catch (error) {
    console.error(
      `[CORRIDAX] Erro ao abrir ${app}:`,
      error
    );

    await openStore(app);
  }
}