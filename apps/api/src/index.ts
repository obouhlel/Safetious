import { env } from '@/config/env';

import { app } from './app';

console.log(
  `🚀 Safetious API running on port ${env.PORT} in ${env.NODE_ENV} mode`
);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
