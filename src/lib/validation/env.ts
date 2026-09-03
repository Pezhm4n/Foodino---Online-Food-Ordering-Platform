import { z } from 'zod';

const emptyToUndefined = (val: unknown) =>
  typeof val === 'string' && val.trim() === '' ? undefined : val;

const baseEnvSchema = z.object({
  NODE_ENV: z.preprocess(
    emptyToUndefined,
    z.enum(['development', 'test', 'production']).default('development'),
  ),
  APP_URL: z.url(),
  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SECRET_KEY: z.string().min(20),
  PAYMENT_PROVIDER: z.enum(['development', 'disabled']),
  PAYMENT_CALLBACK_SECRET: z.string().min(32),
  RATE_LIMIT_ADAPTER: z.preprocess(
    emptyToUndefined,
    z.enum(['vercel', 'trusted-reverse-proxy']).optional(),
  ),
  TRUSTED_PROXY_HOPS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(10).optional(),
  ),
  SMTP_CONFIGURED: z.preprocess(
    emptyToUndefined,
    z.enum(['true', 'false']).default('false'),
  ),
  DEMO_MODE: z.preprocess(
    (val) => (typeof val === 'string' ? (val.trim() === '' ? undefined : val.trim().toLowerCase()) : val),
    z.enum(['true', 'false']).optional(),
  ),
});

export const serverEnvSchema = baseEnvSchema.superRefine((env, context) => {
  if (env.NODE_ENV !== 'production' || env.DEMO_MODE === 'true') return;

  if (env.PAYMENT_PROVIDER === 'development') {
    context.addIssue({
      code: 'custom',
      path: ['PAYMENT_PROVIDER'],
      message: 'Development payment provider is forbidden in production.',
    });
  }
  if (!env.RATE_LIMIT_ADAPTER) {
    context.addIssue({
      code: 'custom',
      path: ['RATE_LIMIT_ADAPTER'],
      message: 'A trusted client IP adapter is required in production.',
    });
  }
  if (env.SMTP_CONFIGURED !== 'true') {
    context.addIssue({
      code: 'custom',
      path: ['SMTP_CONFIGURED'],
      message: 'Production SMTP must be configured.',
    });
  }
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(input: NodeJS.ProcessEnv = process.env): ServerEnv {
  return serverEnvSchema.parse(input);
}
