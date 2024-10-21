// tokenStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@access_token', token);
  } catch (e) {
    console.error('Failed to save the token:', e);
  }
};

export const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@access_token');
    return token;
  } catch (e) {
    console.error('Failed to retrieve the token:', e);
  }
};
