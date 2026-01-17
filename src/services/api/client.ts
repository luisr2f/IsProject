/**
 * Cliente HTTP usando axios
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '../../constants/config';
import { store } from '../../store/store';

// Usar la URL base directamente (axios maneja automáticamente las barras)
const baseURL = APP_CONFIG.API_BASE_URL?.trim() || '';

// Log para debug
console.log('🔧 [API Config]', {
  API_BASE_URL: APP_CONFIG.API_BASE_URL,
  baseURL: baseURL,
});

// Crear instancia de axios con configuración base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación desde el store
axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Construir URL final (axios maneja la concatenación, pero lo hacemos manualmente para el log)
    const finalURL = config.url?.startsWith('http')
      ? config.url
      : `${config.baseURL || ''}${config.url || ''}`.replace(
          /([^:]\/)\/+/g,
          '$1',
        ); // Elimina dobles slashes excepto después de ://
    // Log de la petición
    console.log('🚀 [API Request]', {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      endpoint: config.url,
      finalURL: finalURL,
      headers: config.headers,
      data: config.data,
      params: config.params,
    });

    return config;
  },
  error => {
    //console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  },
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  response => {
    // Log de la respuesta exitosa
    console.log('✅ [API Response]', {
      status: response.status,
      url: `${response.config.baseURL}${response.config.url}`,
      method: response.config.method?.toUpperCase(),
      data: response.data,
    });
    return response;
  },
  async error => {
    // Log del error

    console.error('❌ [API Error]', {
      status: error.response?.status,
      url: error.config
        ? `${error.config.baseURL}${error.config.url}`
        : 'Unknown',
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      data: error.response?.data,
    });

    // Si el error es 401, cerrar sesión directamente
    // Nota: El endpoint de refresh token no está disponible en la API según Swagger
    if (error.response?.status === 401) {
      // Cerrar sesión si recibimos un 401 (no autorizado)
      store.dispatch({ type: 'auth/logout' });
    }

    // Código comentado: Lógica de refresh token (no disponible en la API actual)
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const state = store.getState();
    //   const refreshToken = state.auth.refreshToken;
    //   if (refreshToken) {
    //     try {
    //       const response = await axiosInstance.post(
    //         API_ENDPOINTS.AUTH.REFRESH,
    //         { refreshToken },
    //       );
    //       const {token, refreshToken: newRefreshToken} = response.data;
    //       store.dispatch({
    //         type: 'auth/setCredentials',
    //         payload: {token, refreshToken: newRefreshToken},
    //       });
    //       originalRequest.headers.Authorization = `Bearer ${token}`;
    //       return axiosInstance(originalRequest);
    //     } catch (refreshError) {
    //       store.dispatch({type: 'auth/logout'});
    //       return Promise.reject(refreshError);
    //     }
    //   } else {
    //     store.dispatch({type: 'auth/logout'});
    //   }
    // }

    return Promise.reject(error);
  },
);

// Exportar métodos del cliente
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

// Exportar la instancia para uso avanzado
export default axiosInstance;
