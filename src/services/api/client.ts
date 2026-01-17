/**
 * Cliente HTTP para llamadas a la API
 * Ejemplo usando fetch nativo o axios
 */

// Ejemplo con fetch
const API_BASE_URL = 'https://api.example.com';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // Agregar más métodos según necesites
};
