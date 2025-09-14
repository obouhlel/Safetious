import type { Context } from 'hono';

import type { ApiResponse } from '@/types';

export abstract class BaseController {
  protected sendResponse<T>(
    c: Context,
    response: ApiResponse<T>,
    status: number = 200
  ) {
    return c.json(response, status);
  }

  protected sendSuccess<T>(
    c: Context,
    data: T,
    message?: string,
    status: number = 200
  ) {
    return this.sendResponse(
      c,
      {
        success: true,
        data,
        message,
      },
      status
    );
  }

  protected sendError(
    c: Context,
    message: string,
    errors?: string[],
    status: number = 400
  ) {
    return this.sendResponse(
      c,
      {
        success: false,
        message,
        errors,
      },
      status
    );
  }

  protected handleError(c: Context, error: unknown) {
    console.error('Controller error:', error);

    if (error instanceof Error) {
      return this.sendError(
        c,
        'An error occurred while processing your request',
        [error.message],
        500
      );
    }

    return this.sendError(c, 'An unknown error occurred', undefined, 500);
  }
}
