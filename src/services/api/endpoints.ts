/**
 * Definición de endpoints de la API
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  // Agregar más endpoints según necesites
} as const;
