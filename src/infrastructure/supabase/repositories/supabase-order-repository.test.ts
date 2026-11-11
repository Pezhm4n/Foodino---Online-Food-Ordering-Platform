import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/infrastructure/supabase/database.types';
import { SupabaseOrderRepository } from './supabase-order-repository';

describe('public tracking provenance', () => {
  it.each([true, false])('maps persisted is_demo=%s from the public RPC', async isDemo => {
    const rpc = vi.fn().mockResolvedValue({ data: [{ status: 'confirmed', restaurant_name: 'رستوران', created_at: '2026-11-11T10:00:00Z', updated_at: '2026-11-11T10:01:00Z', is_demo: isDemo }], error: null });
    const client = { schema: () => ({ rpc }) } as unknown as SupabaseClient<Database>;
    const result = await new SupabaseOrderRepository(client).getPublicTracking('token');
    expect(result).toEqual({ status: 'confirmed', restaurantName: 'رستوران', createdAt: '2026-11-11T10:00:00Z', updatedAt: '2026-11-11T10:01:00Z', isDemo });
    expect(rpc).toHaveBeenCalledWith('get_public_tracking', { p_token: 'token' });
  });
  it('preserves missing tracking and RPC failures', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    const repository = new SupabaseOrderRepository({ schema: () => ({ rpc }) } as unknown as SupabaseClient<Database>);
    expect(await repository.getPublicTracking('missing')).toBeNull();
    rpc.mockResolvedValue({ data: null, error: { code: 'unavailable' } });
    await expect(repository.getPublicTracking('token')).rejects.toEqual({ code: 'unavailable' });
  });
});
