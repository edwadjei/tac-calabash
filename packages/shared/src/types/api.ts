export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MINISTRY_LEADER';
  isActive: boolean;
  createdAt: string;
}
