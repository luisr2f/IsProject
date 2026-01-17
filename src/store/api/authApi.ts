import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { baseQuery } from './baseQuery';

// Types for auth API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  userid: string;
  username: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// RTK Query API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: [],
  endpoints: builder => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: userData => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        data: userData,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        data: credentials,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
