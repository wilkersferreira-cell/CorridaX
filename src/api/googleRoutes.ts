import polyline from '@mapbox/polyline';

/*
 * Modos de deslocamento
 * suportados pelo CorridaX.
 *
 * Mantemos os mesmos nomes
 * utilizados pelo Google Routes
 * para evitar conversÃµes
 * desnecessÃ¡rias.
 */
export type GoogleTravelMode =
  | 'DRIVE'
  | 'TWO_WHEELER'
  | 'BICYCLE'
  | 'WALK';

export interface GoogleRouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface GoogleRouteResult {
  distance: number;
  duration: number;
  coordinates: GoogleRouteCoordinate[];
  encodedPolyline?: string;
}

type ComputeRoutesResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
    polyline?: {
      encodedPolyline?: string;
    };
  }>;
};

const ANDROID_PACKAGE =
  'com.corridax.app';

const ANDROID_SHA1 =
  __DEV__
    ? '5E8F16062EA3CD2C4A0D547876BAA6F38CABF625'
    : 'ED77CD58EB15D70692CAA5D2038AFBBDD1E6D643';

function getRoutesApiKey(): string {
  const apiKey =
    process.env
      .EXPO_PUBLIC_GOOGLE_ROUTES_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Chave do Google Routes nÃ£o configurada.',
    );
  }

  return apiKey;
}

/*
 * Define as opÃ§Ãµes adicionais
 * adequadas para cada modalidade.
 *
 * TRAFFIC_AWARE faz sentido
 * para veÃ­culos motorizados.
 *
 * Para caminhada e bicicleta,
 * nÃ£o enviamos routingPreference.
 */
function getRoutingOptions(
  travelMode: GoogleTravelMode,
) {
  if (
    travelMode === 'DRIVE' ||
    travelMode === 'TWO_WHEELER'
  ) {
    return {
      routingPreference:
        'TRAFFIC_AWARE',
    };
  }

  return {};
}

/**
 * Calcula uma rota utilizando
 * Google Routes API.
 *
 * O modo padrÃ£o continua sendo
 * DRIVE.
 *
 * Isso Ã© importante porque todo
 * o cÃ³digo atual do CorridaX
 * continua funcionando sem
 * precisar ser alterado.
 *
 * Exemplos:
 *
 * calculateGoogleRoute(
 *   origemLat,
 *   origemLon,
 *   destinoLat,
 *   destinoLon,
 * )
 *
 * = carro
 *
 * calculateGoogleRoute(
 *   origemLat,
 *   origemLon,
 *   destinoLat,
 *   destinoLon,
 *   'WALK',
 * )
 *
 * = caminhada
 */
export async function calculateGoogleRoute(
  originLat: number,
  originLon: number,
  destinationLat: number,
  destinationLon: number,
  travelMode: GoogleTravelMode = 'DRIVE',
): Promise<GoogleRouteResult> {
  const apiKey =
    getRoutesApiKey();

  const routingOptions =
    getRoutingOptions(
      travelMode,
    );

  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',

        'X-Goog-Api-Key':
          apiKey,

        'X-Android-Package':
          ANDROID_PACKAGE,

        'X-Android-Cert':
          ANDROID_SHA1,

        'X-Goog-FieldMask':
          [
            'routes.distanceMeters',
            'routes.duration',
            'routes.polyline.encodedPolyline',
          ].join(','),
      },

      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude:
                originLat,

              longitude:
                originLon,
            },
          },
        },

        destination: {
          location: {
            latLng: {
              latitude:
                destinationLat,

              longitude:
                destinationLon,
            },
          },
        },

        /*
         * NOVO
         *
         * Agora o modo de transporte
         * pode ser escolhido pelo
         * CorridaX.
         */
        travelMode,

        /*
         * OpÃ§Ãµes especÃ­ficas
         * da modalidade.
         */
        ...routingOptions,

        polylineQuality:
          'HIGH_QUALITY',

        polylineEncoding:
          'ENCODED_POLYLINE',
      }),
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Google Routes (${travelMode}): ` +
        `${response.status} ${errorText}`,
    );
  }

  const data =
    (await response.json()) as
      ComputeRoutesResponse;

  const route =
    data.routes?.[0];

  if (
    !route ||
    route.distanceMeters ===
      undefined ||
    !route.duration
  ) {
    throw new Error(
      `Google Routes nÃ£o retornou uma rota vÃ¡lida para ${travelMode}.`,
    );
  }

  /*
   * O Google retorna duraÃ§Ã£o
   * normalmente no formato:
   *
   * "1234s"
   */
  const durationSeconds =
    Number(
      route.duration.replace(
        's',
        '',
      ),
    );

  if (
    !Number.isFinite(
      durationSeconds,
    )
  ) {
    throw new Error(
      'DuraÃ§Ã£o invÃ¡lida retornada pelo Google Routes.',
    );
  }

  const encodedPolyline =
    route.polyline
      ?.encodedPolyline;

  const coordinates:
    GoogleRouteCoordinate[] =
    encodedPolyline
      ? polyline
          .decode(
            encodedPolyline,
          )
          .map(
            ([
              latitude,
              longitude,
            ]) => ({
              latitude,
              longitude,
            }),
          )
      : [];

  return {
    /*
     * metros â†’ quilÃ´metros
     */
    distance:
      route.distanceMeters /
      1000,

    /*
     * segundos â†’ minutos
     */
    duration:
      durationSeconds /
      60,

    coordinates,

    encodedPolyline,
  };
}