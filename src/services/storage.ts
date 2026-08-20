import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getAuth,
} from '@react-native-firebase/auth';

const HISTORY_KEY =
  '@corridax/history';

const MAX_HISTORY_ITEMS =
  50;

export type HistoryItem = {
  id: string;

  createdAt: string;

  origin: string;

  destination: string;

  distance: number;

  duration: number;

  mobilityMode: string;

  comparisonMode?: string;
};

function getUserHistoryKey(): string {
  const user =
    getAuth().currentUser;

  if (!user) {
    throw new Error(
      'Usuário não autenticado.',
    );
  }

  return `${HISTORY_KEY}:${user.uid}`;
}

export async function saveHistory(
  item: Omit<
    HistoryItem,
    'id' | 'createdAt'
  >,
): Promise<HistoryItem> {
  const history =
    await getHistory();

  const newItem: HistoryItem = {
    ...item,

    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,

    createdAt:
      new Date().toISOString(),
  };

  const updatedHistory = [
    newItem,
    ...history,
  ].slice(
    0,
    MAX_HISTORY_ITEMS,
  );

  await AsyncStorage.setItem(
    getUserHistoryKey(),
    JSON.stringify(
      updatedHistory,
    ),
  );

  return newItem;
}

export async function getHistory(): Promise<
  HistoryItem[]
> {
  try {
    const value =
      await AsyncStorage.getItem(
        getUserHistoryKey(),
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

    return parsed as HistoryItem[];
  } catch (error) {
    console.warn(
      'Não foi possível carregar o histórico do CorridaX.',
      error,
    );

    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      getUserHistoryKey(),
    );
  } catch (error) {
    console.warn(
      'Não foi possível limpar o histórico do CorridaX.',
      error,
    );

    throw error;
  }
}