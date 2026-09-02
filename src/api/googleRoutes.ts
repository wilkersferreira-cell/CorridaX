import polyline from '@mapbox/polyline';

/*
 * Modos de deslocamento
 * suportados pelo CorridaX.
 *
 * Mantemos os mesmos nomes
 * utilizados pelo Google Routes
 * para evitar conversões
 * desnecessárias.
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
  /*
   * Distância da rota em quilômetros.
   */
  distance: number;

  /*
   * Duração prevista em minutos.
   *
   * Para rotas TRAFFIC_AWARE,
   * considera as condições atuais
   * de trânsito.
   */
  duration: number;

  /*
   * Duração-base da rota em minutos,
   * sem considerar as condições
   * atuais de trânsito.
   */
  staticDuration?: number;

  /*
   * Relação entre a duração atual
   * e a duração-base.
   *
   * Exemplo:
   *
   * duration = 60
   * staticDuration = 40
   *
   * trafficIndex = 1.5
   *
   * Ou seja:
   * a viagem está levando cerca
   * de 50% mais tempo.
   */
  trafficIndex?: number;

  /*
   * Quantidade adicional de minutos
   * associada às condições atuais
   * da rota.
   */
  trafficDelayMinutes?: number;

  coordinates: GoogleRouteCoordinate[];

  encodedPolyline?: string;
}

type ComputeRoutesResponse = {
  routes?: Array<{
    distanceMeters?: number;

    duration?: string;

    staticDuration?: string;

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
      'Chave do Google Routes não configurada.',
    );
  }

  return apiKey;
}

/*
 * Define as opções adicionais
 * adequadas para cada modalidade.
 *
 * TRAFFIC_AWARE utiliza as
 * condições atuais de trânsito
 * para veículos motorizados.
 *
 * Para caminhada e bicicleta,
 * não enviamos routingPreference.
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

/*
 * Converte uma duração retornada
 * pelo Google Routes no formato
 * "1234s" para segundos.
 */
function parseDurationSeconds(
  value?: string,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const seconds =
    Number(
      value.replace(
        's',
        '',
      ),
    );

  if (
    !Number.isFinite(
      seconds,
    )
  ) {
    return undefined;
  }

  return seconds;
}

/**
 * Calcula uma rota utilizando
 * Google Routes API.
 *
 * O modo padrão continua sendo
 * DRIVE.
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
            'routes.staticDuration',
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

        travelMode,

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
      `Google Routes não retornou uma rota válida para ${travelMode}.`,
    );
  }

  const durationSeconds =
    parseDurationSeconds(
      route.duration,
    );

  if (
    durationSeconds ===
    undefined
  ) {
    throw new Error(
      'Duração inválida retornada pelo Google Routes.',
    );
  }

  const staticDurationSeconds =
    parseDurationSeconds(
      route.staticDuration,
    );

  const durationMinutes =
    durationSeconds /
    60;

  const staticDurationMinutes =
    staticDurationSeconds !==
    undefined
      ? staticDurationSeconds /
        60
      : undefined;

  /*
   * Índice real de impacto
   * do trânsito.
   *
   * 1.00 = sem aumento relevante
   * 1.20 = aproximadamente 20% maior
   * 1.50 = aproximadamente 50% maior
   * 2.00 = aproximadamente o dobro
   */
  const trafficIndex =
    staticDurationMinutes !==
      undefined &&
    staticDurationMinutes > 0
      ? durationMinutes /
        staticDurationMinutes
      : undefined;

  const trafficDelayMinutes =
    staticDurationMinutes !==
    undefined
      ? Math.max(
          0,
          durationMinutes -
            staticDurationMinutes,
        )
      : undefined;

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
     * metros → quilômetros
     */
    distance:
      route.distanceMeters /
      1000,

    /*
     * minutos considerando
     * o trânsito atual quando
     * TRAFFIC_AWARE estiver ativo.
     */
    duration:
      durationMinutes,

    staticDuration:
      staticDurationMinutes,

    trafficIndex,

    trafficDelayMinutes,

    coordinates,

    encodedPolyline,
  };
}