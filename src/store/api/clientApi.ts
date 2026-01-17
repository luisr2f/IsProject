import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { baseQuery } from './baseQuery';

// Types for client API
export interface ClientListItem {
  id: string;
  identificacion: string;
  nombre: string;
  apellidos: string;
}

export interface Client {
  id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  telefonoCelular: string;
  otroTelefono: string;
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  sexo: 'M' | 'F';
  resenaPersonal: string;
  imagen: string;
  interesesId: string; // UUID
}

export interface CreateClientRequest {
  nombre: string;
  apellidos: string;
  identificacion: string;
  celular: string;
  otroTelefono: string;
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  sexo: 'M' | 'F';
  resennaPersonal: string;
  imagen: string;
  interesFK: string;
  usuarioId: string;
}

// telefonoCelular vs celular
// resenaPersonal vs resennaPersonal
// interesesId vs interesFK

export interface UpdateClientRequest extends CreateClientRequest {
  id: string | number;
}

export interface ClientListResponse {
  clients: Client[];
  total?: number;
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
    createClient: builder.mutation<void, CreateClientRequest>({
      query: clientData => ({
        url: API_ENDPOINTS.CLIENTE.CREAR,
        method: 'POST',
        data: clientData,
      }),
      invalidatesTags: ['Client'],
    }),
    getClientById: builder.query<Client, string>({
      query: idCliente => ({
        url: API_ENDPOINTS.CLIENTE.OBTENER(idCliente),
        method: 'GET',
      }),
      providesTags: (result, error, idCliente) => [
        { type: 'Client', id: idCliente },
      ],
    }),
    updateClient: builder.mutation<void, UpdateClientRequest>({
      query: clientData => ({
        url: API_ENDPOINTS.CLIENTE.ACTUALIZAR,
        method: 'POST',
        data: clientData,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Client',
        { type: 'Client', id },
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
