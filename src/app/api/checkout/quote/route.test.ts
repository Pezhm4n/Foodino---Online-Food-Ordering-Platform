import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ claims: vi.fn(), quote: vi.fn(), log: vi.fn() }));
vi.mock('@/infrastructure/supabase/server', () => ({ requireClaims: mocks.claims, createSupabaseServerClient: async () => ({}) }));
vi.mock('@/infrastructure/supabase/repositories/supabase-order-repository', () => ({ SupabaseOrderRepository: class { quote = mocks.quote; } }));
vi.mock('@/infrastructure/logging/logger', () => ({ logger: { error: mocks.log } }));
import { POST } from './route';

const selection = { restaurantId: '20000000-0000-4000-8000-000000000001', items: [
  { productId: '30000000-0000-4000-8000-000000000001', quantity: 1, addonIds: [] },
] };
const quote = { subtotalIrr: 1450000, deliveryFeeIrr: 150000, taxIrr: 130500, couponCode: null, discountIrr: 0, totalIrr: 1730500 };
const request = (body: unknown = selection) => new Request('https://foodino.example/api/checkout/quote', {
  method: 'POST', headers: { host: 'foodino.example', origin: 'https://foodino.example', 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.resetAllMocks();
  mocks.claims.mockResolvedValue({ sub: 'customer' });
  mocks.quote.mockResolvedValue(quote);
});

describe('authoritative checkout quote endpoint', () => {
  it('returns the repository calculation with private cache policy', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(quote);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  });

  it('rejects unauthenticated pricing requests', async () => {
    mocks.claims.mockResolvedValue(null);
    expect((await POST(request())).status).toBe(401);
    expect(mocks.quote).not.toHaveBeenCalled();
  });

  it('rejects caller-supplied totals instead of using them for pricing', async () => {
    expect((await POST(request({ ...selection, totalIrr: 10 }))).status).toBe(422);
    expect(mocks.quote).not.toHaveBeenCalled();
  });

  it('distinguishes a database/API outage from a cart conflict and logs no private message', async () => {
    mocks.quote.mockRejectedValue({ code: 'PGRST106', message: 'private-address' });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: 'CHECKOUT_QUOTE_FAILED' });
    expect(mocks.log).toHaveBeenCalledWith('Checkout quote unavailable', expect.objectContaining({ errorCode: 'PGRST106' }));
    expect(JSON.stringify(mocks.log.mock.calls)).not.toContain('private-address');
  });

  it('preserves domain rejection feedback without logging an infrastructure fault', async () => {
    mocks.quote.mockRejectedValue({ message: 'product_unavailable' });
    const response = await POST(request());
    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ code: 'CART_ITEM_UNAVAILABLE' });
    expect(mocks.log).not.toHaveBeenCalled();
  });

  it('rejects cross-origin mutations before pricing', async () => {
    const input = request();
    input.headers.set('origin', 'https://outside.example');
    expect((await POST(input)).status).toBe(403);
    expect(mocks.quote).not.toHaveBeenCalled();
  });
});
