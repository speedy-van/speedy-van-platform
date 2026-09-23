export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  pagination?: PaginationMeta;
};

export type ApiFailure = {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DRIVER" | "CUSTOMER" | string;
};

export type LoginResponse = {
  token: string;
  user: AdminUser;
};
