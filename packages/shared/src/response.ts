// Standard API response envelopes used by every endpoint.

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; code?: string; details?: unknown };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type Paginated<T> = {
  success: true;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export const ok = <T>(data: T): ApiSuccess<T> => ({ success: true, data });
export const fail = (error: string, code?: string, details?: unknown): ApiError =>
  details === undefined
    ? code === undefined
      ? { success: false, error }
      : { success: false, error, code }
    : { success: false, error, code, details };

export const paginated = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): Paginated<T> => ({
  success: true,
  data,
  pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
});
