import { createMiddleware } from 'hono/factory';

import { db } from '@/db';

export const databaseMiddleware = createMiddleware<{
  Variables: { db: typeof db };
}>(async (c, next) => {
  c.set('db', db);
  await next();
});
