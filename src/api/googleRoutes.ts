import polyline from '@mapbox/polyline';

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

export async function calculateGoogleRoute(
  originLat: number,
  originLon: number,
  destinationLat: number,
  destinationLon: number,
): Promise<GoogleRouteResult> {
  const apiKey =
    process.env
      .EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Chave do Google Maps não configurada.',
    );
  }

  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',

        'X-Goog-Api-Key':
          apiKey,

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

        travelMode: 'DRIVE',

        routingPreference:
          'TRAFFIC_AWARE',
      }),
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Google Routes: ${response.status} ${errorText}`,
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
      'Google Routes não retornou uma rota válida.',
    );
  }

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
      'Duração inválida retornada pelo Google Routes.',
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
    distance:
      route.distanceMeters /
      1000,

    duration:
      durationSeconds /
      60,

    coordinates,

    encodedPolyline,
  };
}