import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { databaseMiddleware } from '@/middleware/database.middleware';
import { apiRoutes } from '@/routes';

const app = new Hono();

// Global middlewares
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', databaseMiddleware);

// Default route
app.get('/', c => {
  return c.json({
    message: 'Welcome to Safetious API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      api: '/api',
    },
  });
});

// API routes
app.route('/api', apiRoutes);

export { app };
