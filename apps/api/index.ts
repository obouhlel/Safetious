import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { db } from './src/db/index';
import { users } from './src/db/schemas';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());

// Health check endpoint
app.get('/health', c => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Safetious API',
  });
});

// API routes
app.get('/api/users', async c => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users);

    return c.json({ users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Default route
app.get('/', c => {
  return c.json({
    message: 'Welcome to Safetious API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
    },
  });
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Safetious API running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
