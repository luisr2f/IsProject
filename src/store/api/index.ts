export { baseQuery } from './baseQuery';

export { authApi } from './authApi';
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
} from './authApi';

export { interestsApi } from './interestsApi';
export type { Interest } from './interestsApi';

export { clientApi } from './clientApi';
export type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  ClientListResponse,
  ClientListItem,
} from './clientApi';
