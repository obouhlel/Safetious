import type { Database } from '@/db';

export abstract class BaseRepository {
  protected db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  protected handleError(error: unknown): never {
    console.error('Repository error:', error);
    if (error instanceof Error) {
      throw new Error(`Database operation failed: ${error.message}`);
    }
    throw new Error('Unknown database error occurred');
  }

  protected formatResponse<T>(data: T): T {
    return data;
  }
}
