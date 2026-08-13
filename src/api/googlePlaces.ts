export interface GooglePlaceSuggestion {
  placeId: string;
  displayName: string;
}

export interface GooglePlaceCoordinate {
  latitude: number;
  longitude: number;

  /*
   * Nome principal do local.
   *
   * Exemplo:
   * Shopping Grande Circular
   */
  displayName: string;

  /*
   * Endereço completo.
   *
   * Continua disponível para
   * navegação, deep links e
   * uso interno do CorridaX.
   */
  formattedAddress: string;
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
 * Pesquisa sugestões de destinos
 * usando Google Places API (New).
 */
export async function searchGooglePlaces(
  query: string,
  latitude?: number,
  longitude?: number,
): Promise<GooglePlaceSuggestion[]> {
  const input =
    query.trim();

  if (input.length < 3) {
    return [];
  }

  const body: Record<
    string,
    unknown
  > = {
    input,

    languageCode:
      'pt-BR',

    regionCode:
      'BR',

    includedRegionCodes: [
      'br',
    ],
  };

  /*
   * Favorece resultados próximos
   * da localização atual.
   *
   * Isso melhora bastante buscas
   * como:
   *
   * "Grande Circular"
   * "Amazonas Shopping"
   * "Ponta Negra"
   */
  if (
    Number.isFinite(
      latitude,
    ) &&
    Number.isFinite(
      longitude,
    )
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

  const response =
    await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          'X-Goog-Api-Key':
            getApiKey(),

          'X-Android-Package':
            ANDROID_PACKAGE,

          'X-Android-Cert':
            ANDROID_SHA1,

          'X-Goog-FieldMask':
            'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
        },

        body:
          JSON.stringify(
            body,
          ),
      },
    );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.warn(
      'Google Places Autocomplete:',
      response.status,
      errorText,
    );

    throw new Error(
      `Google Places Autocomplete HTTP ${response.status}`,
    );
  }

  const data =
    await response.json();

  return (
    data.suggestions ?? []
  )
    .map(
      (
        suggestion: any,
      ) => {
        const prediction =
          suggestion.placePrediction;

        if (
          !prediction?.placeId
        ) {
          return null;
        }

        return {
          placeId:
            prediction.placeId,

          displayName:
            prediction.text
              ?.text ?? '',
        };
      },
    )
    .filter(
      (
        item:
          | GooglePlaceSuggestion
          | null,
      ): item is GooglePlaceSuggestion =>
        item !== null &&
        Boolean(
          item.displayName,
        ),
    );
}

/**
 * Busca os detalhes do destino
 * selecionado.
 *
 * Mantemos separadamente:
 *
 * - nome do local
 * - endereço completo
 * - coordenadas
 *
 * Isso permite mostrar uma
 * informação amigável na tela
 * sem perder o endereço necessário
 * para navegação.
 */
export async function getGooglePlaceCoordinate(
  placeId: string,
): Promise<GooglePlaceCoordinate> {
  const response =
    await fetch(
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
    const errorText =
      await response.text();

    console.warn(
      'Google Place Details:',
      response.status,
      errorText,
    );

    throw new Error(
      `Google Place Details HTTP ${response.status}`,
    );
  }

  const data =
    await response.json();

  const latitude =
    Number(
      data.location
        ?.latitude,
    );

  const longitude =
    Number(
      data.location
        ?.longitude,
    );

  if (
    !Number.isFinite(
      latitude,
    ) ||
    !Number.isFinite(
      longitude,
    )
  ) {
    throw new Error(
      'O Google não retornou as coordenadas do destino.',
    );
  }

  /*
   * Nome amigável do estabelecimento
   * ou ponto de interesse.
   *
   * Exemplo:
   * Shopping Grande Circular
   */
  const displayName =
    data.displayName?.text ??
    '';

  /*
   * Endereço físico completo.
   *
   * Exemplo:
   * Av. Autaz Mirim, 6100 -
   * São José Operário, Manaus - AM
   */
  const formattedAddress =
    data.formattedAddress ??
    '';

  return {
    latitude,

    longitude,

    displayName:
      displayName ||
      formattedAddress,

    formattedAddress,
  };
}