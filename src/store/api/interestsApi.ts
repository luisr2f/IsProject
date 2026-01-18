import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { baseQuery } from './baseQuery';

// Types for interests API
export interface Interest {
  id: string; // UUID format
  descripcion: string;
}

// RTK Query API slice
export const interestsApi = createApi({
  reducerPath: 'interestsApi',
  baseQuery,
  tagTypes: ['Interests'],
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: builder => ({
    getInterestsList: builder.query<Interest[], void>({
      query: () => ({
        url: API_ENDPOINTS.INTERESES.LISTADO,
        method: 'GET',
      }),
      providesTags: ['Interests'],
      keepUnusedDataFor: 300, // Mantener datos en caché por 5 minutos (300 segundos)
    }),
  }),
});

export const { useGetInterestsListQuery } = interestsApi;
