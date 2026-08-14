import {
  Alert,
  Linking,
  Platform,
} from 'react-native';

import {
  Coordinate,
} from '../api/routes';

export type NavigationMode =
  | 'car'
  | 'motorcycle'
  | 'bicycle'
  | 'walk';

type NavigationTrip = {
  origin?: Coordinate;
  destination: Coordinate;
  mode: NavigationMode;
};

/*
 * Converte a modalidade do CorridaX
 * para o modo de navegação utilizado
 * pelo Android / Google Maps.
 */
function getAndroidNavigationMode(
  mode: NavigationMode,
):
  | 'd'
  | 'b'
  | 'w' {
  switch (mode) {
    case 'bicycle':
      return 'b';

    case 'walk':
      return 'w';

    case 'motorcycle':
      /*
       * O esquema google.navigation
       * não possui um modo universal
       * específico para motocicleta.
       */
      return 'd';

    case 'car':
    default:
      return 'd';
  }
}

/*
 * NAVEGAÇÃO NATIVA ANDROID
 *
 * O Android recebe a intenção de
 * navegação e apresenta os aplicativos
 * compatíveis instalados no aparelho.
 *
 * Exemplo:
 * Google Maps
 * Waze
 * Uber
 *
 * Mantemos assim porque o seletor
 * nativo utiliza os ícones e nomes
 * originais dos aplicativos.
 */
function buildAndroidNavigationUrl(
  destination: Coordinate,
  mode: NavigationMode,
): string {
  const latitude =
    destination.latitude;

  const longitude =
    destination.longitude;

  const navigationMode =
    getAndroidNavigationMode(
      mode,
    );

  return (
    `google.navigation:q=${latitude},${longitude}` +
    `&mode=${navigationMode}`
  );
}

/*
 * FALLBACK UNIVERSAL
 *
 * Caso o esquema de navegação nativo
 * não possa ser aberto, usamos uma
 * URL universal do Google Maps.
 */
function buildGoogleMapsFallbackUrl({
  origin,
  destination,
  mode,
}: NavigationTrip): string {
  let travelMode:
    | 'driving'
    | 'bicycling'
    | 'walking';

  switch (mode) {
    case 'bicycle':
      travelMode =
        'bicycling';
      break;

    case 'walk':
      travelMode =
        'walking';
      break;

    case 'motorcycle':
    case 'car':
    default:
      travelMode =
        'driving';
      break;
  }

  const params: string[] = [
    'api=1',

    `destination=${encodeURIComponent(
      `${destination.latitude},${destination.longitude}`,
    )}`,

    `travelmode=${encodeURIComponent(
      travelMode,
    )}`,

    'dir_action=navigate',
  ];

  /*
   * Se a origem estiver disponível,
   * enviamos o GPS atual.
   */
  if (origin) {
    params.push(
      `origin=${encodeURIComponent(
        `${origin.latitude},${origin.longitude}`,
      )}`,
    );
  }

  return (
    'https://www.google.com/maps/dir/?' +
    params.join('&')
  );
}

/*
 * INICIAR NAVEGAÇÃO
 */
export async function startNavigation({
  origin,
  destination,
  mode,
}: NavigationTrip): Promise<void> {
  try {
    /*
     * Validação das coordenadas.
     */
    if (
      !Number.isFinite(
        destination.latitude,
      ) ||
      !Number.isFinite(
        destination.longitude,
      )
    ) {
      throw new Error(
        'Coordenadas do destino inválidas.',
      );
    }

    /*
     * ANDROID
     *
     * Entregamos a intenção ao sistema.
     * O próprio telefone apresenta
     * os aplicativos compatíveis.
     */
    if (
      Platform.OS ===
      'android'
    ) {
      const nativeUrl =
        buildAndroidNavigationUrl(
          destination,
          mode,
        );

      const canOpenNative =
        await Linking.canOpenURL(
          nativeUrl,
        );

      if (canOpenNative) {
        await Linking.openURL(
          nativeUrl,
        );

        return;
      }
    }

    /*
     * FALLBACK
     *
     * Utilizado principalmente caso
     * a navegação nativa não esteja
     * disponível.
     */
    const fallbackUrl =
      buildGoogleMapsFallbackUrl({
        origin,
        destination,
        mode,
      });

    const canOpenFallback =
      await Linking.canOpenURL(
        fallbackUrl,
      );

    if (!canOpenFallback) {
      throw new Error(
        'Nenhum aplicativo de navegação disponível.',
      );
    }

    await Linking.openURL(
      fallbackUrl,
    );
  } catch (error) {
    console.warn(
      'Falha ao iniciar navegação:',
      error,
    );

    Alert.alert(
      'Navegação',
      'Não foi possível iniciar a navegação.',
    );
  }
}