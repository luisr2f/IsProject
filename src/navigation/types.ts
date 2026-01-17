/**
 * Tipos de navegación para React Navigation
 */

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  ClientList: undefined;
  ClientForm: { id?: string } | undefined;
};
