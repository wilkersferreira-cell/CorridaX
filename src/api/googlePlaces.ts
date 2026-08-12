export interface GooglePlaceSuggestion {
  placeId: string;
  displayName: string;
}

export interface GooglePlaceCoordinate {
  latitude: number;
  longitude: number;
  displayName: string;
}

const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const ANDROID_PACKAGE =
  'com.corridax.app';

const ANDROID_SHA1 =
  '5E8F16062EA3CD2C4A0D547876BAA6F38CABF625';

function getApiKey(): string {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      'Google Places API Key não configurada.',
    );
  }

  return GOOGLE_PLACES_API_KEY;
}

/**
 * Pesquisa sugestões de destinos usando
 * Google Places API (New).
 */
export async function searchGooglePlaces(
  query: string,
  latitude?: number,
  longitude?: number,
): Promise<GooglePlaceSuggestion[]> {
  const input = query.trim();

  if (input.length < 3) {
    return [];
  }

  const body: Record<string, unknown> = {
    input,
    languageCode: 'pt-BR',
    regionCode: 'BR',
    includedRegionCodes: ['br'],
  };

  /*
   * Favorece resultados próximos da
   * localização atual do usuário.
   * Não impede resultados de outras cidades.
   */
  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    body.locationBias = {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius: 50000,
      },
    };
  }

  const response = await fetch(
    'https://places.googleapis.com/v1/places:autocomplete',
    {
      method: 'POST',

      headers: {
  'Content-Type': 'application/json',

  'X-Goog-Api-Key':
    getApiKey(),

  'X-Android-Package':
    ANDROID_PACKAGE,

  'X-Android-Cert':
    ANDROID_SHA1,

  'X-Goog-FieldMask':
    'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
},

      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.warn(
      'Google Places Autocomplete:',
      response.status,
      errorText,
    );

    throw new Error(
      `Google Places Autocomplete HTTP ${response.status}`,
    );
  }

  const data = await response.json();

  return (data.suggestions ?? [])
    .map((suggestion: any) => {
      const prediction =
        suggestion.placePrediction;

      if (!prediction?.placeId) {
        return null;
      }

      return {
        placeId: prediction.placeId,
        displayName:
          prediction.text?.text ?? '',
      };
    })
    .filter(
      (
        item: GooglePlaceSuggestion | null,
      ): item is GooglePlaceSuggestion =>
        item !== null &&
        Boolean(item.displayName),
    );
}

/**
 * Depois que o usuário escolhe uma sugestão,
 * busca latitude/longitude exatas daquele Place.
 */
export async function getGooglePlaceCoordinate(
  placeId: string,
): Promise<GooglePlaceCoordinate> {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(
      placeId,
    )}`,
    {
     headers: {
  'X-Goog-Api-Key':
    getApiKey(),

  'X-Android-Package':
    ANDROID_PACKAGE,

  'X-Android-Cert':
    ANDROID_SHA1,

  'X-Goog-FieldMask':
    'id,displayName,formattedAddress,location',

  'Accept-Language':
    'pt-BR',
},
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.warn(
      'Google Place Details:',
      response.status,
      errorText,
    );

    throw new Error(
      `Google Place Details HTTP ${response.status}`,
    );
  }

  const data = await response.json();

  const latitude =
    Number(data.location?.latitude);

  const longitude =
    Number(data.location?.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      'O Google não retornou as coordenadas do destino.',
    );
  }

  return {
    latitude,
    longitude,
    displayName:
      data.formattedAddress ??
      data.displayName?.text ??
      '',
  };
}