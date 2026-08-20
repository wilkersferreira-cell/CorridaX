import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getAuth,
} from '@react-native-firebase/auth';

const FAVORITES_KEY =
  '@corridax/favorites';

const MAX_FAVORITES =
  30;

export type FavoriteItem = {
  id: string;

  createdAt: string;

  name: string;

  address: string;

  latitude: number;

  longitude: number;
};

type NewFavorite = Omit<
  FavoriteItem,
  'id' | 'createdAt'
>;

export type SaveFavoriteResult = {
  item: FavoriteItem;

  created: boolean;
};

function getUserFavoritesKey(): string {
  const user =
    getAuth().currentUser;

  if (!user) {
    throw new Error(
      'Usuário não autenticado.',
    );
  }

  return `${FAVORITES_KEY}:${user.uid}`;
}

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      'pt-BR',
    );
}

function isSameFavorite(
  favorite: FavoriteItem,
  item: NewFavorite,
): boolean {
  const sameAddress =
    normalizeText(
      favorite.address,
    ) ===
    normalizeText(
      item.address,
    );

  const sameCoordinate =
    Math.abs(
      favorite.latitude -
        item.latitude,
    ) < 0.00001 &&
    Math.abs(
      favorite.longitude -
        item.longitude,
    ) < 0.00001;

  return (
    sameAddress ||
    sameCoordinate
  );
}

export async function getFavorites(): Promise<
  FavoriteItem[]
> {
  try {
    const value =
      await AsyncStorage.getItem(
        getUserFavoritesKey(),
      );

    if (!value) {
      return [];
    }

    const parsed =
      JSON.parse(value);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed as FavoriteItem[];
  } catch (error) {
    console.warn(
      'Não foi possível carregar os favoritos do CorridaX.',
      error,
    );

    return [];
  }
}

export async function saveFavorite(
  item: NewFavorite,
): Promise<SaveFavoriteResult> {
  const favorites =
    await getFavorites();

  const existing =
    favorites.find(
      (favorite) =>
        isSameFavorite(
          favorite,
          item,
        ),
    );

  if (existing) {
    return {
      item: existing,
      created: false,
    };
  }

  const newFavorite:
    FavoriteItem = {
    ...item,

    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,

    createdAt:
      new Date().toISOString(),
  };

  const updatedFavorites = [
    newFavorite,
    ...favorites,
  ].slice(
    0,
    MAX_FAVORITES,
  );

  await AsyncStorage.setItem(
    getUserFavoritesKey(),
    JSON.stringify(
      updatedFavorites,
    ),
  );

  return {
    item: newFavorite,
    created: true,
  };
}

export async function removeFavorite(
  id: string,
): Promise<void> {
  const favorites =
    await getFavorites();

  const updatedFavorites =
    favorites.filter(
      (item) =>
        item.id !== id,
    );

  await AsyncStorage.setItem(
    getUserFavoritesKey(),
    JSON.stringify(
      updatedFavorites,
    ),
  );
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(
    getUserFavoritesKey(),
  );
}