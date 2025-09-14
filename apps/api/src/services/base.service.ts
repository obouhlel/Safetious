import type { ApiResponse } from '@/types';

export abstract class BaseService {
  protected createSuccessResponse<T>(
    data: T,
    message?: string
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  protected createErrorResponse(
    message: string,
    errors?: string[]
  ): ApiResponse {
    return {
      success: false,
      message,
      errors,
    };
  }

  protected handleError(error: unknown): ApiResponse {
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
