import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadFromStorage = async <T>(key: string, fallback: T): Promise<T> => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}; 