import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { baseQuery } from './baseQuery';

// Types for client API
export interface Client {
  idCliente?: string | number;
  nombre: string;
  apellidos: string;
  identificacion: string;
  celular: string;
  telefono: string;
  direccion: string;
  fNacimiento: string; // Format: DD.MM.YYYY
  fAfiliacion: string; // Format: DD.MM.YYYY
  genero: 'M' | 'F';
  interesFK: string; // UUID
}

export interface CreateClientRequest {
  nombre: string;
  apellidos: string;
  identificacion: string;
  celular: string;
  telefono: string;
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  genero: 'M' | 'F';
  interesFK: string;
}

export interface UpdateClientRequest extends CreateClientRequest {
  idCliente: string | number;
}

export interface ClientListResponse {
  clients: Client[];
  total?: number;
}

export interface ClientListItem {
  id: string;
  identificacion: string;
  nombre: string;
  apellidos: string;
}

export interface GetClientsListRequest {
  usuarioId: string;
  nombre: string;
}

// RTK Query API slice
export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery,
  tagTypes: ['Client'],
  endpoints: builder => ({
    getClientsList: builder.query<ClientListItem[], GetClientsListRequest>({
      query: body => ({
        url: API_ENDPOINTS.CLIENTE.LISTADO,
        method: 'POST',
        data: {
          usuarioId: body.usuarioId,
          identificacion: '',
          nombre: body.nombre,
        },
      }),
      providesTags: ['Client'],
    }),
    getClientById: builder.query<Client, string | number>({
      query: idCliente => ({
        url: API_ENDPOINTS.CLIENTE.OBTENER(idCliente),
        method: 'GET',
      }),
      providesTags: (result, error, idCliente) => [
        { type: 'Client', id: idCliente },
      ],
    }),
    createClient: builder.mutation<Client, CreateClientRequest>({
      query: clientData => ({
        url: API_ENDPOINTS.CLIENTE.CREAR,
        method: 'POST',
        data: clientData,
      }),
      invalidatesTags: ['Client'],
    }),
    updateClient: builder.mutation<Client, UpdateClientRequest>({
      query: clientData => ({
        url: API_ENDPOINTS.CLIENTE.ACTUALIZAR,
        method: 'PUT',
        data: clientData,
      }),
      invalidatesTags: (result, error, { idCliente }) => [
        'Client',
        { type: 'Client', id: idCliente },
      ],
    }),
    deleteClient: builder.mutation<void, string | number>({
      query: idCliente => ({
        url: API_ENDPOINTS.CLIENTE.ELIMINAR(idCliente),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, idCliente) => [
        'Client',
        { type: 'Client', id: idCliente },
      ],
    }),
  }),
});

export const {
  useGetClientsListQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
