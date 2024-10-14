// config.ts
import Constants from 'expo-constants';

interface ExtraConfig {
  apiUrl: string;
  accessToken: string;
}

const extra = Constants.manifest?.extra as ExtraConfig;

export const API_URL = extra.apiUrl;
export const ACCESS_TOKEN = extra.accessToken;
