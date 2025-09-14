import type { ApiErrorResponse, ApiSuccessResponse } from '@/types';

export abstract class BaseService {
  protected createSuccessResponse<T>(
    data: T,
    message?: string
  ): ApiSuccessResponse<T> {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    return response;
  }

  protected createErrorResponse(
    message: string,
    errors?: string[]
  ): ApiErrorResponse {
    const response: ApiErrorResponse = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return response;
  }

  protected handleError(error: unknown): ApiErrorResponse {
    console.error('Service error:', error);

    if (error instanceof Error) {
      return this.createErrorResponse(
        'An error occurred while processing your request',
        [error.message]
      );
    }

    return this.createErrorResponse('An unknown error occurred');
  }
}
