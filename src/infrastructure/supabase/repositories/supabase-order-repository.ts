import type { SupabaseClient } from '@supabase/supabase-js';
import type { OrderRepository, PendingOrderResult, PublicTracking } from '@/application/ports/order-repository';
import type { OrderStatus } from '@/domain/order/order-status';
import type { CheckoutInput } from '@/lib/validation/checkout';
import type { Database } from '@/infrastructure/supabase/database.types';

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async createPending(input: CheckoutInput): Promise<PendingOrderResult> {
    const items = input.items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId ?? null,
      addon_ids: item.addonIds,
      quantity: item.quantity,
    }));
    const { data, error } = await this.client.schema('api').rpc('create_pending_order', {
      p_address_id: input.addressId,
      p_restaurant_id: input.restaurantId,
      p_idempotency_key: input.idempotencyKey,
      p_items: items,
    });
    if (error) throw error;
    const result = data[0];
    if (!result) throw new Error('create_pending_order returned no result');
    return {
      orderId: result.order_id,
      trackingToken: result.tracking_token,
      reused: result.reused,
    };
  }

  async cancelOwn(orderId: string, reason?: string): Promise<OrderStatus> {
    const { data, error } = await this.client.schema('api').rpc('cancel_own_order', {
      p_order_id: orderId,
      ...(reason ? { p_reason: reason } : {}),
    });
    if (error) throw error;
    return data;
  }

  async transition(orderId: string, toStatus: OrderStatus, reason?: string): Promise<OrderStatus> {
    const { data, error } = await this.client.schema('api').rpc('transition_order_status', {
      p_order_id: orderId,
      p_to_status: toStatus,
      ...(reason ? { p_reason: reason } : {}),
    });
    if (error) throw error;
    return data;
  }

  async getPublicTracking(token: string): Promise<PublicTracking | null> {
    const { data, error } = await this.client.schema('api').rpc('get_public_tracking', {
      p_token: token,
    });
    if (error) throw error;
    const result = data[0];
    return result ? {
      status: result.status,
      restaurantName: result.restaurant_name,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    } : null;
  }
}
