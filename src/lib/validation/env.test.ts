import { describe, expect, it } from 'vitest';
import { serverEnvSchema } from './env';

const input = { NODE_ENV: 'production', APP_URL: 'https://foodino.example', SUPABASE_URL: 'https://project.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'x'.repeat(32), SUPABASE_SECRET_KEY: 'x'.repeat(32), PAYMENT_CALLBACK_SECRET: 'x'.repeat(32), PAYMENT_PROVIDER: 'demo', DEMO_MODE: 'true' };

describe('demo payment deployment policy', () => {
  it('allows explicit demo payments in demo deployments', () => {
    expect(serverEnvSchema.safeParse(input).success).toBe(true);
  });
  it.each(['development', 'test', 'production'])('requires explicit demo mode in %s', NODE_ENV => {
    expect(serverEnvSchema.safeParse({ ...input, NODE_ENV, DEMO_MODE: 'false' }).success).toBe(false);
    expect(serverEnvSchema.safeParse({ ...input, NODE_ENV, DEMO_MODE: undefined }).success).toBe(false);
  });
  it('forbids development payments in production even when demo mode is enabled', () => {
    const result = serverEnvSchema.safeParse({ ...input, PAYMENT_PROVIDER: 'development' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map(issue => issue.message)).toContain('Development payment provider is forbidden in production.');
  });
  it('preserves normal production infrastructure requirements', () => {
    const result = serverEnvSchema.safeParse({ ...input, PAYMENT_PROVIDER: 'disabled', DEMO_MODE: 'false' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map(issue => issue.path[0])).toEqual(expect.arrayContaining(['RATE_LIMIT_ADAPTER', 'SMTP_CONFIGURED']));
  });
});
