import type { Context } from 'hono';

import type { Database } from '@/db';

export interface AppContext extends Context {
  db: Database;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}
