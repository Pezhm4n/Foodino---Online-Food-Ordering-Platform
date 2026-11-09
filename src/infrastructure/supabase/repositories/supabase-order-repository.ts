import type { SupabaseClient } from '@supabase/supabase-js';
import type { CheckoutQuote, OrderRepository, PendingOrderResult, PublicTracking } from '@/application/ports/order-repository';
import type { OrderStatus } from '@/domain/order/order-status';
import type { CheckoutInput, CheckoutQuoteInput } from '@/lib/validation/checkout';
import type { Database } from '@/infrastructure/supabase/database.types';

function checkoutItems(input: CheckoutQuoteInput) {
  return input.items.map((item) => ({
    product_id: item.productId,
    variant_id: item.variantId ?? null,
    addon_ids: item.addonIds,
    quantity: item.quantity,
    note: item.notes?.trim() || null,
  }));
}

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async quote(input: CheckoutQuoteInput): Promise<CheckoutQuote> {
    const { data, error } = await this.client.schema('api').rpc('quote_checkout', {
      p_restaurant_id: input.restaurantId,
      p_items: checkoutItems(input),
      ...(input.couponCode ? { p_coupon_code: input.couponCode } : {}),
      ...(input.idempotencyKey ? { p_idempotency_key: input.idempotencyKey } : {}),
      ...(input.addressId ? { p_address_id: input.addressId } : {}),
      ...(input.orderNote ? { p_order_note: input.orderNote } : {}),
    });
    if (error) throw error;
    const quote = data[0];
    if (!quote) throw new Error('quote_checkout returned no result');
    return {
      subtotalIrr: quote.subtotal_irr,
      deliveryFeeIrr: quote.delivery_fee_irr,
      taxIrr: quote.tax_irr,
      couponCode: quote.coupon_code,
      discountIrr: quote.discount_irr,
      totalIrr: quote.total_irr,
    };
  }

  async createPending(input: CheckoutInput): Promise<PendingOrderResult> {
    const { data, error } = await this.client.schema('api').rpc('create_pending_order', {
      p_address_id: input.addressId,
      p_restaurant_id: input.restaurantId,
      p_idempotency_key: input.idempotencyKey,
      p_items: checkoutItems(input),
      ...(input.couponCode ? { p_coupon_code: input.couponCode } : {}),
      ...(input.orderNote ? { p_order_note: input.orderNote } : {}),
      ...(input.expectedTotalIrr !== undefined ? { p_expected_total_irr: input.expectedTotalIrr } : {}),
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
