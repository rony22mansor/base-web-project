export type ApiError = {
  success?: boolean;
  message?: string;
  errors?: {
    [key: string]: unknown;
  };
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  succeeded?: boolean;
  isEncrypted?: boolean;
  result?: number;
};

export interface PaginatedResponse<T> {
  list: T[];
  pagination: {
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
  };
}
