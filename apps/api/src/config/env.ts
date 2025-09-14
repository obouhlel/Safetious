import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/safetious'),
  JWT_SECRET: z.string().default('your-super-secret-jwt-key'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
