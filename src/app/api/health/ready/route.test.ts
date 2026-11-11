import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ catalog: vi.fn(), rpc: vi.fn() }));
vi.mock('@/infrastructure/config/server-env', () => ({ getServerEnv: () => ({}) }));
vi.mock('@/infrastructure/supabase/server', () => ({ createSupabaseServerClient: async () => ({
  from: () => ({ select: () => ({ limit: mocks.catalog }) }),
  schema: () => ({ rpc: mocks.rpc }),
}) }));
import { GET } from './route';

beforeEach(() => {
  vi.resetAllMocks();
  mocks.catalog.mockResolvedValue({ error: null });
  mocks.rpc.mockResolvedValue({ data: [], error: null });
});

describe('checkout-capable readiness', () => {
  it('requires both public catalog access and the custom API schema', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith('get_public_tracking', { p_token: '0'.repeat(43) });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('fails readiness when public reads work but the order API schema is unavailable', async () => {
    mocks.rpc.mockResolvedValue({ error: { code: 'PGRST106', message: 'Invalid schema: api' } });
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: 'unavailable' });
  });

  it('fails closed on catalog transport errors', async () => {
    mocks.catalog.mockRejectedValue(new Error('connection failed'));
    expect((await GET()).status).toBe(503);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});
