export interface ApiResponseMeta {
  timestamp: string;
  path: string;
  statusCode: number;
  requestId: string;
  traceId?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta: ApiResponseMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: ApiResponseMeta & { pagination: PaginationMeta };
}

export class PaginatedResult<T> {
  constructor(readonly items: T[], readonly pagination: PaginationMeta) {}
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details: unknown;
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
  meta: ApiResponseMeta;
}
