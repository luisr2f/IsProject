// Tipos globales para Redux
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
