import { Hono } from 'hono';

export const apiRoutes = new Hono();

// Health check route
apiRoutes.get('/health', c => {
  return c.json({
    service: 'Safetious API',
    timestamp: new Date().toISOString(),
    status: 'ok',
  });
});

// Exemple de comment ajouter de nouvelles routes :
// import { usersRoutes } from './users.routes';
// apiRoutes.route('/users', usersRoutes);
