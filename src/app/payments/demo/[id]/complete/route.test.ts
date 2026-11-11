import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  env: { PAYMENT_PROVIDER: 'demo', DEMO_MODE: 'true' },
  claims: vi.fn(), order: vi.fn(), orderFilter: vi.fn(), payment: vi.fn(), rpc: vi.fn(), admin: vi.fn(),
}));
vi.mock('@/infrastructure/config/server-env', () => ({ getServerEnv: () => mocks.env }));
vi.mock('@/infrastructure/supabase/server', () => ({
  requireClaims: mocks.claims,
  createSupabaseServerClient: async () => ({ from: () => ({ select: () => {
    const query = { eq: (key: string, value: string) => { mocks.orderFilter(key, value); return query; }, maybeSingle: mocks.order };
    return query;
  } }) }),
}));
vi.mock('@/infrastructure/supabase/admin', () => ({ createSupabaseAdminClient: () => {
  mocks.admin();
  return { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.payment }) }) }), schema: () => ({ rpc: mocks.rpc }) };
} }));
import { POST } from './route';

const id = '8b0be7d5-7277-45a4-a957-3ae16c3075f4';
const context = { params: Promise.resolve({ id }) };
const pendingOrder = { id, status: 'pending_payment', total_irr: 123_000 };
const pendingPayment = { order_id: id, provider: 'demo', provider_reference: `demo:${id}`, status: 'pending', amount_irr: 123_000 };
const request = (body: unknown = { outcome: 'succeeded' }, origin = 'https://foodino.example') => new Request(`https://foodino.example/payments/demo/${id}/complete`, {
  method: 'POST', headers: { origin, host: 'foodino.example', 'content-type': 'application/json' }, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.resetAllMocks();
  mocks.env.PAYMENT_PROVIDER = 'demo'; mocks.env.DEMO_MODE = 'true';
  mocks.claims.mockResolvedValue({ sub: 'owner-id' });
  mocks.order.mockResolvedValue({ data: pendingOrder, error: null });
  mocks.payment.mockResolvedValue({ data: pendingPayment, error: null });
  mocks.rpc.mockResolvedValue({ data: [{ applied: true, order_id: id, order_status: 'confirmed' }], error: null });
});

describe('authenticated demo payment completion', () => {
  it('applies the database amount through the atomic payment event RPC after owner filtering', async () => {
    const response = await POST(request(), context);
    expect(response.status).toBe(200);
    expect(mocks.orderFilter).toHaveBeenCalledWith('user_id', 'owner-id');
    expect(mocks.rpc).toHaveBeenCalledWith('apply_payment_event', expect.objectContaining({
      p_provider: 'demo', p_provider_reference: `demo:${id}`, p_amount_irr: 123_000, p_status: 'succeeded',
    }));
    expect(await response.json()).toEqual({ receiptUrl: `/orders/${id}` });
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  });
  it('records an explicit failed choice through the same authoritative path', async () => {
    expect((await POST(request({ outcome: 'failed' }), context)).status).toBe(200);
    expect(mocks.rpc).toHaveBeenCalledWith('apply_payment_event', expect.objectContaining({ p_status: 'failed', p_amount_irr: 123_000 }));
  });
  it('rejects cross-origin mutations before auth or database access', async () => {
    expect((await POST(request(undefined, 'https://other.example'), context)).status).toBe(403);
    expect(mocks.claims).not.toHaveBeenCalled(); expect(mocks.admin).not.toHaveBeenCalled();
  });
  it('requires authentication', async () => {
    mocks.claims.mockResolvedValue(null);
    expect((await POST(request(), context)).status).toBe(401);
    expect(mocks.admin).not.toHaveBeenCalled();
  });
  it('does not read or mutate payments when the owner-filtered order is absent', async () => {
    mocks.order.mockResolvedValue({ data: null, error: null });
    expect((await POST(request(), context)).status).toBe(404);
    expect(mocks.admin).not.toHaveBeenCalled(); expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it.each([{ outcome: 'succeeded', amountIrr: 10 }, { outcome: 'refunded' }])('rejects client supplied amount or unsupported outcome %j', async body => {
    expect((await POST(request(body), context)).status).toBe(422);
    expect(mocks.admin).not.toHaveBeenCalled();
  });
  it('only accepts persisted demo payments with the order amount', async () => {
    mocks.payment.mockResolvedValue({ data: { ...pendingPayment, provider: 'development' }, error: null });
    expect((await POST(request(), context)).status).toBe(404);
    mocks.payment.mockResolvedValue({ data: { ...pendingPayment, amount_irr: 10 }, error: null });
    expect((await POST(request(), context)).status).toBe(409);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it('preserves terminal results on replay and opposite outcome choices', async () => {
    mocks.order.mockResolvedValue({ data: { ...pendingOrder, status: 'confirmed' }, error: null });
    mocks.payment.mockResolvedValue({ data: { ...pendingPayment, status: 'succeeded' }, error: null });
    expect((await POST(request({ outcome: 'failed' }), context)).status).toBe(200);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it('fails closed when demo configuration is disabled', async () => {
    mocks.env.DEMO_MODE = 'false';
    expect((await POST(request(), context)).status).toBe(404);
    expect(mocks.claims).not.toHaveBeenCalled();
  });
  it('returns a retryable error if the atomic event write fails', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: 'unavailable' } });
    expect((await POST(request(), context)).status).toBe(503);
  });
});
