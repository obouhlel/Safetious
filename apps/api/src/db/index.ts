import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/config/env';

// Database connection
const connectionString = env.DATABASE_URL;

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient);

export type Database = typeof db;
