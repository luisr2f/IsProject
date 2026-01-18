/**
 * Declaración de tipos para las variables de entorno
 * Este archivo permite que TypeScript reconozca las variables importadas desde @env
 */

declare module '@env' {
  export const API_BASE_URL: string;
  export const APP_NAME: string;
  export const APP_VERSION: string;
  export const NODE_ENV: string;
  // Agregar más variables según las que definas en .env
}
