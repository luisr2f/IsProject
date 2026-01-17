export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Authenticate/login',
    REGISTER: '/Authenticate/register',
  },
  CLIENTE: {
    LISTADO: '/Cliente/Listado',
    CREAR: '/Cliente/Crear',
    ACTUALIZAR: '/Cliente/Actualizar',
    OBTENER: (idCliente: string | number) => `/Cliente/Obtener/${idCliente}`,
    ELIMINAR: (idCliente: string | number) => `/Cliente/Eliminar/${idCliente}`,
  },
  INTERESES: {
    LISTADO: '/Intereses/Listado',
  },
} as const;
