import { describe, expect, it } from 'vitest';
import { getClientIp, hashClientIp } from './client-ip';
import type { ServerEnv } from '@/lib/validation/env';

describe('client-ip extraction and anonymization', () => {
  const baseEnv: ServerEnv = {
    NODE_ENV: 'production',
    APP_URL: 'https://foodino.ir',
    SUPABASE_URL: 'https://supabase.foodino.ir',
    SUPABASE_PUBLISHABLE_KEY: 'sb_pub_01234567890123456789',
    SUPABASE_SECRET_KEY: 'sb_sec_01234567890123456789',
    PAYMENT_PROVIDER: 'disabled',
    PAYMENT_CALLBACK_SECRET: 'supersecretcallbacksecret32charsmin',
    RATE_LIMIT_ADAPTER: 'trusted-reverse-proxy',
    TRUSTED_PROXY_HOPS: 1,
    SMTP_CONFIGURED: 'true',
  };

  it('extracts client IP with trusted proxy hops', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '203.0.113.195, 70.41.3.18, 150.172.238.178');

    // 1 hop: client is 150.172.238.178
    expect(getClientIp(headers, baseEnv)).toBe('150.172.238.178');

    // 2 hops: client is 70.41.3.18
    expect(getClientIp(headers, { ...baseEnv, TRUSTED_PROXY_HOPS: 2 })).toBe('70.41.3.18');
  });

  it('extracts vercel client IP when vercel adapter configured', () => {
    const headers = new Headers();
    headers.set('x-vercel-forwarded-for', '198.51.100.4, 10.0.0.1');

    const vercelEnv: ServerEnv = {
      ...baseEnv,
      RATE_LIMIT_ADAPTER: 'vercel',
    };
    expect(getClientIp(headers, vercelEnv)).toBe('198.51.100.4');
  });

  it('falls back to 127.0.0.1 in non-production environments', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '198.51.100.4');
    expect(getClientIp(headers, { ...baseEnv, NODE_ENV: 'development' })).toBe('127.0.0.1');
  });

  it('hashes IP deterministically for privacy preservation', () => {
    const hashA = hashClientIp('203.0.113.195', 'secret-key-123');
    const hashB = hashClientIp('203.0.113.195', 'secret-key-123');
    const hashC = hashClientIp('198.51.100.4', 'secret-key-123');

    expect(hashA).toBe(hashB);
    expect(hashA).not.toBe(hashC);
    expect(hashA).toMatch(/^[0-9a-f]{64}$/);
  });
});
