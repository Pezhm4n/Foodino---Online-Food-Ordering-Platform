import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ claims: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: async () => ({ getAll: () => [] }) }));
vi.mock('@/infrastructure/config/server-env', () => ({ getServerEnv: () => ({
  SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', NODE_ENV: 'test',
}) }));
vi.mock('@supabase/ssr', () => ({ createServerClient: () => ({ auth: { getClaims: mocks.claims } }) }));
import { requireClaims } from './server';

beforeEach(() => vi.resetAllMocks());
afterEach(() => vi.unstubAllEnvs());

describe('authenticated identity', () => {
  it('recognizes a verified identity even with a demo catalog', async () => {
    vi.stubEnv('DEMO_MODE', 'true');
    mocks.claims.mockResolvedValue({ data: { claims: { sub: 'verified-user' } }, error: null });
    expect(await requireClaims()).toEqual({ sub: 'verified-user' });
  });

  it('fails closed on provider and transport errors', async () => {
    mocks.claims.mockResolvedValueOnce({ data: null, error: { code: 'session_expired' } });
    expect(await requireClaims()).toBeNull();
    mocks.claims.mockRejectedValueOnce(new Error('network'));
    expect(await requireClaims()).toBeNull();
  });
});
