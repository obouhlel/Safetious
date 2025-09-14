import type { Context } from 'hono';

import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from '@/types';

export abstract class BaseController {
  protected sendResponse<T>(response: ApiResponse<T>, status = 200) {
    return Response.json(response, { status });
  }

  protected sendSuccess<T>(data: T, message?: string, status = 200) {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    return this.sendResponse(response, status);
  }

  protected sendError(message: string, errors?: string[], status = 400) {
    const response: ApiErrorResponse = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return this.sendResponse(response, status);
  }

  protected handleError(_c: Context, error: unknown) {
    console.error('Controller error:', error);

    if (error instanceof Error) {
      return this.sendError(
        'An error occurred while processing your request',
        [error.message],
        500
      );
    }

    return this.sendError('An unknown error occurred', undefined, 500);
  }
}
