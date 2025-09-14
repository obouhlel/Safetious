import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Database connection
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/safetious';

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient);

export type Database = typeof db;
