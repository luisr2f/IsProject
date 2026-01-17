/**
 * Configuración de la aplicación
 * Las variables se cargan desde el archivo .env usando react-native-dotenv
 */

import {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  NODE_ENV,
} from '@env';

export const APP_CONFIG = {
  API_BASE_URL: API_BASE_URL || 'https://api.example.com',
  APP_NAME: APP_NAME || 'IsProject',
  VERSION: APP_VERSION || '0.0.1',
  NODE_ENV: NODE_ENV || 'development',
  // Agregar más configuración según necesites
} as const;
