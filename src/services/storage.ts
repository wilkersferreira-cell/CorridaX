import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@corridax/history';

export async function saveHistory(item: any) {
  try {
    const history = await getHistory();

    history.unshift(item);

    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );
  } catch (e) {
    console.log(e);
  }
}

export async function getHistory() {
  try {
    const value = await AsyncStorage.getItem(HISTORY_KEY);

    if (value) {
      return JSON.parse(value);
    }

    return [];
  } catch (e) {
    return [];
  }
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}